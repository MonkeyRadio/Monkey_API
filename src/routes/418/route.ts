import responseC from '../../resultConstructor/responseC.js';
import errorCustomMessage from '../../resultConstructor/errorCustomMessage.js';
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    responseC(res, 418, errorCustomMessage("418", "I'm a teapot", 418));
})

export default router