import express from 'express';
import Radio from '../../controllers/objects/models/radio.js';
import New from './new.js';
import Delete from './delete.js';

const router = express.Router();

router.get('/:slug?', async (request, response) => {
    let resp: any = {};
    if (request.params.slug) {
        Radio.findOne({ slug: request.params.slug }, { _id: 0, __v: 0 })
        .then ( (radio) => {
            if (!radio)
                response.status(404).json({ "message": "Radio not found" });
            else {
                resp.radio = radio;
                response.status(200).json(resp);
            }
        })
        .catch( () => {
            response.status(500).json({ "message": "Database error" });
        });
    } else {
        Radio.find({}, { _id: 0, __v: 0 })
        .then ( (radios) => {
            if (!radios)
                resp.radios = [];
            else
                resp.radios = radios;
            response.status(200).json(resp);
         })
        .catch( () => {
            response.status(500).json({ "message": "Database error" });
        });
    }
});

New(router);
Delete(router);

export default router;