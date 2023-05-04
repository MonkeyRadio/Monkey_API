import { Router } from "express";
import { body, validationResult  } from 'express-validator';
import bcrypt from "bcrypt";
import userM from "../../controllers/auth/models/user.js";
import responseC from '../../resultConstructor/responseC.js';
import internalError from "../../resultConstructor/internalError.js";
import badArguments from "../../resultConstructor/badArguments.js";
import success from "../../resultConstructor/success.js";
import { midAuth } from "../../expressInterface.js";
import auth from "../../middlewares/auth/verifyToken.js";

export default (router: Router): void => {
    const requestName = "auth.update";

    router.put("/update",
        auth,
        body('email').custom((value, { req }) => {
            if (!value) {
                return true;
            }
            if (value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/)) {
                return true;
            }
            return false;
        }),
        body('password').custom((value, { req }) => {
            if (!value) {
                return true;
            }
            if (value.length < 8) {
                return false;
            }
            return false;  
        }),
        async (req, res) => {
            const result = validationResult(req);
            const user: midAuth = (req as any).auth;
            if (!result.isEmpty()) {
                responseC(res, 400, badArguments(requestName, result.array()));
                return;
            }
            let oldUser = await userM.findOne({
                slug: user.username
            })
            if (!oldUser) {
                responseC(res, 500, internalError(requestName));
                return;
            }
            let newUser: any = {
                email: req.body.email,
                avatar: req.body.avatar,
                password: req.body.password
            }
            for (let obj of Object.keys(newUser)) {
                if (newUser[obj] === undefined) {
                    delete newUser[obj];
                }
            }
            if (newUser.password) {
                newUser.password = await bcrypt.hash(newUser.password, 10);
            }
            newUser = {
                ...oldUser,
                ...newUser
            };
            if (await userM.updateOne({ slug: user.username }, { $set: newUser })) {
                responseC(res, 200, success(requestName));
            } else {
                responseC(res, 500, internalError(requestName));
            }
            
        });
}
