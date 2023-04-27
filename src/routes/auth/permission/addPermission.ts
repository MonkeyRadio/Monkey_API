import { Router } from "express";
import { body, validationResult, param  } from 'express-validator';
import { RequestM } from "../../../expressInterface.js";
import userM from "../../../controllers/auth/models/user.js";
import responseC from '../../../resultConstructor/responseC.js';
import internalError from "../../../resultConstructor/internalError.js";
import badArguments from "../../../resultConstructor/badArguments.js";
import success from "../../../resultConstructor/success.js";
import auth from "../../../middlewares/auth/verifyToken.js";
import { default as checkPerm, hasPerm } from "../../../middlewares/auth/checkPerm.js";

export default (router: Router): void => {
    const requestName = "auth.permission.add";

    router.put("/permission/:username",
        auth,
        checkPerm("auth.permission.add"),
        param("username").isString(),
        param("username").custom( async value => {
            if (await userM.findOne({ slug: value })) {
                return true;
            }
            return Promise.reject(new Error("User does not exist"));
        }),
        body("permission").isString(),
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                responseC(res, 400, badArguments(requestName, result.array()));
                return;
            }
            let opePermD = await userM.findOne({
                slug: (req as RequestM).auth.username
            });            
            let userData = await userM.findOne({
                slug: req.params!.username
            });
            if (!userData || !opePermD) {
                responseC(res, 500, internalError(requestName));
                return;
            }
            let opePerm = opePermD.permissions;
            try {
                let perm = req.body!.permission;
                if (perm.split(";").length > 1) {
                    let perms = perm.split(";");
                    for (let permsO of perms)
                        if (opePerm?.includes("admin") || opePerm?.includes(permsO))
                            if (!userData.permissions!.includes(permsO))
                                userData.permissions!.push(permsO);
                } else
                    if (opePerm?.includes("admin") || opePerm?.includes(req.body!.permission))
                        if (!userData.permissions!.includes(req.body!.permission))
                            userData.permissions!.push(req.body!.permission);
                userData.save();
                responseC(res, 200, success(requestName));
            } catch (e) {
                responseC(res, 500, internalError(requestName));
            }
        });
}
