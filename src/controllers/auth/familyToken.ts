import { redisClient } from "../../app.js";

export type token = {
    token: string;
    expUTC: string;
    refreshToken: string;
    refreshExpUTC: string;
}

async function newFamilyToken(): Promise<string> {
    let familyID = "";
    for (let i = 0; i < 35; i++) {
        familyID += (Math.random() + 1).toString(36).substring(2);
    }
    try {
    if (await redisClient.get(`AuthTokenFamilyID:${familyID}`)) {
        return newFamilyToken();
    } else {
        await redisClient.set(`AuthTokenFamilyID:${familyID}`, "0", ["EX", Math.floor(2*604800)]);
        return familyID;
    }
    } catch (e) {
        console.error(e);
        return "Internal Server Error";
    }
}

export default newFamilyToken;