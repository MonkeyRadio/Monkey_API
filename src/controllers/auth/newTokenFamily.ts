import jwt from "jsonwebtoken";
import { redisClient } from "../../app.js";
import { default as newFamilyToken, token } from './familyToken.js';
import { AccessToken, RefreshToken } from "../../expressInterface.js";

export default async (username: string): Promise<token | Error> => {
    let familyID = await newFamilyToken();
    await redisClient.set(`AuthTokenUsername:${familyID}`, username, ["EX", Math.floor(2*604800)]);
    let actok: AccessToken = {
        username: username,
        tokenFamily: familyID,
        familyChildNumber: 0
    }
    let refrtok: RefreshToken = {
        tokenFamily: familyID,
        familyChildNumber: 0
    }
    let tok = jwt.sign(actok, process.env.JWT!, { expiresIn: "2h" });
    let renewTok = jwt.sign(refrtok, process.env.JWT!, { expiresIn: "2w" });
    if (familyID == "Internal Server Error")
        return Error("Internal Server Error");
    return {
        token: tok,
        expUTC: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
        refreshToken: renewTok,
        refreshExpUTC: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
    }
}
