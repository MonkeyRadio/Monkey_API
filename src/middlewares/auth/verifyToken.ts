import jwt from "jsonwebtoken";
import { redisClient } from "../../app.js";
import responseC from "../../resultConstructor/responseC.js";
import unauthorized from "../../resultConstructor/unauthorized.js";
import { AccessToken, midAuth } from "../../expressInterface.js";

export default async (req: any, res: any, next: any): Promise<void> => {
    if (!req.headers.authorization)
        return responseC(res, 401, unauthorized());
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!jwt.verify(token as string, process.env.JWT!))
            return responseC(res, 401, unauthorized());
        let data: AccessToken = (jwt.decode(token as string) as AccessToken);
        let familyChildNumber = await redisClient.get(`AuthTokenFamilyID:${data.tokenFamily}`);
        let usernameChecked = false;
        if (data.username) {
            if (await redisClient.get(`AuthTokenUsername:${data.tokenFamily}`)) {
                usernameChecked = true;
            }
        }
        if (familyChildNumber && Number(familyChildNumber) === data.familyChildNumber && usernameChecked) {
            let user: midAuth = {
                token: token,
                username: data.username,
                tokenFamily: data.tokenFamily,
                familyChildNumber: data.familyChildNumber
            }
            req.auth = user;
            next();
            return;
        } else {
            responseC(res, 401, unauthorized());
            return;
        }
    } catch (e) {
        responseC(res, 401, unauthorized());
        return;
    }
}
