import express from 'express';

const router = express.Router();

export default router.get('/', (request, response) => {
    let resp: any = {
        objects: []
    }
    response.status(200).json(resp);
});
