import jwt from "jsonwebtoken";
import { default as newFamilyToken, token } from './familyToken.js';

export default async (username: string): Promise<token | Error> => {
    let familyID = await newFamilyToken();
    let tok = jwt.sign({ username: username, tokenFamily: familyID }, process.env.JWT!, { expiresIn: "2h" });
    let renewTok = jwt.sign({ tokenFamily: familyID }, process.env.JWT!, { expiresIn: "2w" });
    if (familyID == "Internal Server Error")
        return Error("Internal Server Error");
    return {
        token: tok,
        expUTC: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
        refreshToken: renewTok,
        refreshExpUTC: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
    }
}
