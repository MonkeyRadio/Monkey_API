import { Router } from "express";
import { RequestM } from "../../expressInterface.js"
import { validationResult  } from 'express-validator';
import responseC from '../../resultConstructor/responseC.js';
import badArguments from "../../resultConstructor/badArguments.js";
import success from "../../resultConstructor/success.js";
import destroyFamily from "../../controllers/auth/destroyFamily.js";
import auth from "../../middlewares/auth/verifyToken.js";

export default (router: Router): void => {
    const requestName = "auth.login";

    router.post("/destroyTokenFamily",
        auth,
        async (req, res) => {
            const request = req as RequestM;
            const result = validationResult(req);
            if (!result.isEmpty()) {
                responseC(res, 400, badArguments(requestName, result.array()));
                return;
            }
            await destroyFamily(request.auth.token);
            responseC(res, 200, success(requestName));
        });
}
