import jwt from "jsonwebtoken";
import { redisClient } from "../../app.js";
import responseC from "../../resultConstructor/responseC.js";
import unauthorized from "../../resultConstructor/unauthorized.js";

export default async (req: any, res: any, next: any): Promise<void> => {
    if (!req.headers.authorization)
        return responseC(res, 401, unauthorized());
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!jwt.verify(token as string, process.env.JWT!))
            return responseC(res, 401, unauthorized());
        let data: string = (jwt.decode(token as string) as any).tokenFamily;
        if (await redisClient.get(`AuthTokenFamilyID:${data}`)) {
            req.auth = {};
            req.auth.token = token;
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
