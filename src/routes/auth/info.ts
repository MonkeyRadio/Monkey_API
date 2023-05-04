import { Router } from "express";
import userM from "../../controllers/auth/models/user.js";
import responseC from '../../resultConstructor/responseC.js';
import internalError from "../../resultConstructor/internalError.js";
import successData from "../../resultConstructor/successData.js";
import { midAuth } from "../../expressInterface.js";
import auth from "../../middlewares/auth/verifyToken.js";

export default (router: Router): void => {
    const requestName = "auth.infos";

    router.get("/infos",
        auth,
        async (req, res) => {
            const user: midAuth = (req as any).auth;
            let userData = await userM.findOne({
                slug: user.username
            }, { _id: 0, __v: 0, password: 0 })
            if (!userData) {
                responseC(res, 500, internalError(requestName));
                return;
            }
            responseC(res, 200, successData(requestName, userData));
        });
}
