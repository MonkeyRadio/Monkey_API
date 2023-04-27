import { Response, Request } from "express";
import { RequestM } from "../../expressInterface.js";
import userM from "../../controllers/auth/models/user.js";
import responseC from "../../resultConstructor/responseC.js";
import unauthorized from "../../resultConstructor/unauthorized.js";
import forbidden from "../../resultConstructor/forbidden.js";

export default (permissionName: string): any => {
    return async (req: RequestM, res: Response, next: any) => {
        let user = await userM.findOne({
            slug: req.auth.username
        });
        if (!user) {
            return responseC(res, 401, unauthorized());
        }
        if (!user.permissions!.includes(permissionName) && !user.permissions!.includes("admin")) {
            return responseC(res, 403, forbidden());
        }
        next();
    }
}

export async function hasPerm(username: string, permissionName: string): Promise<boolean> {
    let user = await userM.findOne({
        slug: username
    });
    if (!user) {
        return false;
    }
    if (!user.permissions!.includes(permissionName) && !user.permissions!.includes("admin")) {
        return false;
    }
    return true;
}
