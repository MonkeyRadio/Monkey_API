import { Router } from "express";
import { body, validationResult  } from 'express-validator';
import { default as radioM, Radio, Live } from "../../controllers/objects/models/radio.js";

export default (router: Router): void => {
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
        body('icon').notEmpty(),
        (req, res) => {
        const result = validationResult(req);
            if (result.isEmpty()) {
                radioM.create({
                    slug: req.body.slug,
                    name: req.body.name,
                    icon: req.body.icon,
                    live: []
                }).then(() => res.status(200).json({}))
                .catch((e) => {
                    console.error(e);
                    res.status(400).json({ "message": "Error creating radio" });
                });
                return;
            }
        res.status(400).json({ errors: result.array() });
    })
}