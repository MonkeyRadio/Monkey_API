import { Router } from "express";
import { body, validationResult  } from 'express-validator';
import responseC from '../../resultConstructor/responseC.js';
import { default as radioM, Radio, Variant } from "../../controllers/objects/models/radio.js";
import { default as badArgs } from "../../resultConstructor/badArguments.js";
import { default as internalError } from "../../resultConstructor/internalError.js";
import { default as successResult } from "../../resultConstructor/success.js";

export default (router: Router): void => {
    const requestName = "radio.create";

    router.post("/",
        body('slug').notEmpty(),
        body('slug').custom(async (slug) => {
            const doc = await radioM.findOne({ slug });
            if (doc) {
                return Promise.reject("Slug already exists");
            }
            return true;
        }),
        body('name').notEmpty(),
        body('name').isString(),
        body('icon').notEmpty(),
        body('icon').isString(),
        body('variants').notEmpty(),
        body('variants').isArray(),
        body('variants').custom(async (variants) => {
            if (variants.length < 1) {
                return Promise.reject("At least one variant is required");
            }
            for (const variant of variants) {
                if (!variant.slug || typeof variant.slug !== "string")
                    return Promise.reject("Variant must have a slug");
                if (await radioM.findOne({ slug: variant.slug }))
                    return Promise.reject("Variant slug must be unique");
                if (!variant.name || typeof variant.name !== "string")
                    return Promise.reject("Variant must have a name");
                if (!variant.icon || typeof variant.icon !== "string")
                    return Promise.reject("Variant must have an icon");
            }
            return true;
        }),
        (req, res) => {
        const result = validationResult(req);
            if (result.isEmpty()) {
                radioM.create({
                    slug: req.body.slug,
                    name: req.body.name,
                    icon: req.body.icon,
                    variants: req.body.variants
                }).then(() => responseC(res, 201, successResult(requestName, 201)))
                .catch((e) => {
                    console.error(e);
                    responseC(res, 500, internalError(requestName));
                });
                return;
            }
        responseC(res, 400, badArgs(requestName, result.array()));
    })
}
