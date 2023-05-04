import { redisClient } from "../../app.js";
import jwt from "jsonwebtoken";

async function destroyFamily(token: string): Promise<boolean> {
    try {
        if (!jwt.verify(token, process.env.JWT!))
            return false;
        let data: any = (jwt.decode(token) as any);
        if (data.username && await redisClient.get(`AuthTokenFamilyID:${data.tokenFamily}`)) {
            await redisClient.del(`AuthTokenFamilyID:${data.tokenFamily}`);
            await redisClient.del(`AuthTokenUsername:${data.tokenFamily}`);
        }
    } catch (e) {
        return false;
    }
    return true;
}

export default destroyFamily;