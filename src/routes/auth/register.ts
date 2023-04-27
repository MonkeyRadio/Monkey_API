import { Router } from "express";
import { body, validationResult  } from 'express-validator';
import userM from "../../controllers/auth/models/user.js";
import responseC from '../../resultConstructor/responseC.js';
import internalError from "../../resultConstructor/internalError.js";
import badArguments from "../../resultConstructor/badArguments.js";
import successData from "../../resultConstructor/successData.js";
import bcrypt from "bcrypt";
import newTokenFamily from "../../controllers/auth/newTokenFamily.js";

export default (router: Router): void => {
    const requestName = "auth.register";

    router.post("/register",
        body('username').notEmpty(),
        body('username').custom( async value => {
            if (await userM.findOne({ slug: value })) {
                return Promise.reject(new Error("Username already exists"));
            }
            return true;
        }),
        body('email').isEmail(),
        body('password').notEmpty(),
        body('password').isLength({ min: 8 }),
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                responseC(res, 400, badArguments(requestName, result.array()));
                return;
            }
            userM.create({
                slug: req.body.username,
                name: req.body.username,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                permissions: []
            }).then( async user => {
                let token = await newTokenFamily(req.body.username);
                if (token instanceof Error) {
                    responseC(res, 500, internalError(requestName));
                    return;
                }
                responseC(res, 200, successData(requestName, token));
            }).catch(err => {
                console.error(err);
                responseC(res, 500, internalError(requestName));
            })
        });
}
