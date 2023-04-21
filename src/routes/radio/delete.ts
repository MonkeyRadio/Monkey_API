import { Router } from "express";
import { body, validationResult  } from 'express-validator';
import { default as radioM, Radio, Live } from "../../controllers/objects/models/radio.js";

export default (router: Router): void => {
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
                .then(() => res.status(200).json({}))
                .catch((e) => {
                    console.error(e);
                    res.status(400).json({ "message": "Error deleting radio" });
                });
                return;
            }
        res.status(400).json({ errors: result.array() });
    })
}
