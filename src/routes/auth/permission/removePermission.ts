import { Router } from "express";
import { body, validationResult, param  } from 'express-validator';
import { RequestM } from "../../../expressInterface.js";
import userM from "../../../controllers/auth/models/user.js";
import responseC from '../../../resultConstructor/responseC.js';
import internalError from "../../../resultConstructor/internalError.js";
import badArguments from "../../../resultConstructor/badArguments.js";
import success from "../../../resultConstructor/success.js";
import auth from "../../../middlewares/auth/verifyToken.js";
import checkPerm from "../../../middlewares/auth/checkPerm.js";

export default (router: Router): void => {
    const requestName = "auth.permission.delete";

    router.delete("/permission/:username",
        auth,
        checkPerm("auth.permission.delete"),
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
                            userData.permissions!.splice(userData.permissions!.indexOf(permsO), 1);
                } else
                    if (opePerm?.includes("admin") || opePerm?.includes(req.body!.permission))
                        userData.permissions!.splice(userData.permissions!.indexOf(req.body!.permission), 1);
                userData.save();
                responseC(res, 200, success(requestName));
            } catch (e) {
                responseC(res, 500, internalError(requestName));
            }
        });
}
