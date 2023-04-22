import { Router } from "express";
import { body, validationResult  } from 'express-validator';
import responseC from '../../resultConstructor/responseC.js';
import { default as radioM, Radio, Variant } from "../../controllers/objects/models/radio.js";
import internalError from "../../resultConstructor/internalError.js";
import badArguments from "../../resultConstructor/badArguments.js";
import success from "../../resultConstructor/success.js";

export default (router: Router): void => {
    const requestName = "radio.delete";

    router.delete("/",
        body('slug').notEmpty(),
        body('slug').custom(async (slug) => {
            const doc = await radioM.findOne({ slug });
            if (!doc) {
                return Promise.reject("Slug does not exist");
            }
            return true;
        }),
        (req, res) => {
        const result = validationResult(req);
            if (result.isEmpty()) {
                radioM.deleteOne({ slug: req.body.slug})
                .then(() => responseC(res, 200, success(requestName)))
                .catch((e) => {
                    console.error(e);
                    responseC(res, 500, internalError(requestName));
                });
                return;
            }
        responseC(res, 400, badArguments(requestName, result.array()));
    })
}
