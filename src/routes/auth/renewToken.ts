import { Router } from "express";
import { RequestM, RefreshToken, AccessToken } from "../../expressInterface.js"
import { body, validationResult  } from 'express-validator';
import jwt from "jsonwebtoken";
import { redisClient } from "../../app.js";
import responseC from '../../resultConstructor/responseC.js';
import badArguments from "../../resultConstructor/badArguments.js";
import internalError from "../../resultConstructor/internalError.js";
import successData from "../../resultConstructor/successData.js";
import unauthorized from "../../resultConstructor/unauthorized.js";

async function destroyFamily(familyID: string): Promise<void> {
    await redisClient.del(`AuthTokenFamilyID:${familyID}`);
    await redisClient.del(`AuthTokenUsername:${familyID}`);
}

export default (router: Router): void => {
    const requestName = "auth.renewToken";

    router.post("/renewToken",
        body("refreshToken").notEmpty(),
        body("refreshToken").isString(),
        async (req, res) => {
            const request = req as RequestM;
            const result = validationResult(req);
            if (!result.isEmpty()) {
                responseC(res, 400, badArguments(requestName, result.array()));
                return;
            }
            if (!jwt.verify(req.body.refreshToken as string, process.env.JWT!)) {
                responseC(res, 401, unauthorized());
                return;
            }
            let refreshToken: RefreshToken = jwt.decode(req.body.refreshToken) as RefreshToken;
            if (!refreshToken || !refreshToken.tokenFamily || (refreshToken as any).username) {
                responseC(res, 401, unauthorized());
                return;
            }
            let familyChildNumber = await redisClient.get(`AuthTokenFamilyID:${refreshToken.tokenFamily}`);
            if (!familyChildNumber || refreshToken.familyChildNumber !== Number(familyChildNumber)) {
                await destroyFamily(refreshToken.tokenFamily);
                responseC(res, 401, unauthorized());
                return;
            }
            let username = await redisClient.get(`AuthTokenUsername:${refreshToken.tokenFamily}`);
            let familyID = refreshToken.tokenFamily;
            if (!username) {
                await destroyFamily(refreshToken.tokenFamily);
                responseC(res, 401, unauthorized());
                return;
            }
            await redisClient.set(`AuthTokenFamilyID:${refreshToken.tokenFamily}`, String(refreshToken.familyChildNumber + 1), ["EX", Math.floor(2*604800)]);
            await redisClient.set(`AuthTokenUsername:${refreshToken.tokenFamily}`, username, ["EX", Math.floor(2*604800)]);
            let actok: AccessToken = {
                username: username,
                tokenFamily: familyID,
                familyChildNumber: refreshToken.familyChildNumber + 1
            }
            let refrtok: RefreshToken = {
                tokenFamily: familyID,
                familyChildNumber: refreshToken.familyChildNumber + 1
            }
            let tok = jwt.sign(actok, process.env.JWT!, { expiresIn: "2h" });
            let renewTok = jwt.sign(refrtok, process.env.JWT!, { expiresIn: "2w" });
            let data = {
                token: tok,
                expUTC: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
                refreshToken: renewTok,
                refreshExpUTC: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
            }
            responseC(res, 200, successData(requestName, data));
        });
}
