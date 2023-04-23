import { Router } from "express";
import { body, validationResult  } from 'express-validator';
import { User, default as userM } from "../../controllers/auth/models/user.js";
import responseC from '../../resultConstructor/responseC.js';
import { default as radioM, Radio, Variant } from "../../controllers/objects/models/radio.js";
import internalError from "../../resultConstructor/internalError.js";
import badArguments from "../../resultConstructor/badArguments.js";
import errorCustomMessage from "../../resultConstructor/errorCustomMessage.js";
import successData from "../../resultConstructor/successData.js";
import bcrypt from "bcrypt";
import newTokenFamily from "../../controllers/auth/newTokenFamily.js";

export default (router: Router): void => {
    const requestName = "auth.login";

    router.post("/login",
        body('username').notEmpty(),
        body('password').notEmpty(),
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                responseC(res, 400, badArguments(requestName, result.array()));
                return;
            }
            let user = await userM.findOne({ slug: req.body.username });
            if (!user || !await bcrypt.compare(req.body.password, user.password)) {
                responseC(res, 401, errorCustomMessage(requestName, "Invalid username or password", 401));
                return;
            }
            let token = await newTokenFamily(req.body.username);
            if (token instanceof Error) {
                responseC(res, 500, internalError(requestName));
                return;
            }
            responseC(res, 200, successData(requestName, token));
        });
}
