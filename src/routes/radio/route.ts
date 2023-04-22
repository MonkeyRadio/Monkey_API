import express from 'express';
import Radio from '../../controllers/objects/models/radio.js';
import New from './new.js';
import Delete from './delete.js';
import responseC from '../../resultConstructor/responseC.js';
import { default as internalError } from '../../resultConstructor/internalError.js';
import { default as errorCustom } from '../../resultConstructor/errorCustomMessage.js';
import { default as successResultData } from '../../resultConstructor/successData.js';

const router = express.Router();

router.get('/:slug?', async (request, response) => {
    const requestName = "radio.get";

    let resp: any = {};
    if (request.params.slug) {
        Radio.findOne({ slug: request.params.slug }, { _id: 0, __v: 0 })
        .then ( (radio) => {
            if (!radio)
                responseC(response, 404, errorCustom(requestName, "Radio not found", 404));
            else
                responseC(response, 200, successResultData(requestName, { radio }));
        })
        .catch( () => {
            responseC(response, 500, internalError(requestName));
        });
    } else {
        Radio.find({}, { _id: 0, __v: 0 })
        .then ( (radios) => {
            if (!radios)
                resp.radios = [];
            else
                resp.radios = radios;
            responseC(response, 200, successResultData(requestName, resp));
         })
        .catch( () => {
            responseC(response, 500, internalError(requestName));
        });
    }
});

New(router);
Delete(router);

export default router;