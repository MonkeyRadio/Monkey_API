/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Live Routes
 *========================================================================**/

import app from '../../src/server.mjs'
import multer from 'multer';
import db from '../../src/database/db.mjs'

const live = () => {

    liveMetadata();
    liveContext();

}

const liveContext = () => {

    app.get("/radio/live/*/context", async (req, res) => {
        let response = {
            "status": "ok",
            "message": "liveContext",
            "data": {}
        }
        const id = parseInt(req.url.split("/")[3]);
        response.data = await db.live.context.findOne({
            attributes: {
                exclude: ['allTypeId', 'createdAt', 'updatedAt', 'isPublic']           
            },
            where: {
                id: id
            },
            include: {
                model: db.types,
                attributes: ['id', 'name', 'isCDNAble']
            }
        });
        if (response.data == null) {
            response.status = "error";
            response.message = "liveContext not found";
            response.data = {};
            res.status(404).json(response);
            return;
        }
        res.json(response);
    });

    app.post("/radio/live", async (req, res) => {
        let response = {
            "status": "ok",
            "message": "liveContext",
            "data": {}
        }

        let requiredData = [
            {name: req.body.name},
            {description: req.body.description},
            {cover: req.body.cover},
            {tags: req.body.tags},
            {isPublic: req.body.isPublic},
            {hasMetadata: req.body.hasMetadata},
            {type: req.body.type}]

        if (req.body == undefined || app.tools.checkVar(requiredData)[0] === false) {
                response.status = "error";
                response.message = "Missing parameters";
                response.data = app.tools.checkVar(requiredData)[1];
                res.status(400).json(response);
                return;
            }

        try {
            response.data = await db.live.context.create({
                name: req.body.name,
                description: req.body.description,
                cover: req.body.cover,
                tags: req.body.tags,
                isPublic: req.body.isPublic,
                hasMetadata: req.body.hasMetadata,
                allTypeId: req.body.type,
            })
            res.json(response);
        } catch (error) {
            response.status = "error";
            response.message = "Internal Server Error";
            response.data = error;
            res.status(503).json(response);
        }
    });

};

const liveMetadata = () => {

    app.get("/radio/live/*/metadata", (req, res) => {
        let response = {
            "status": "ok",
            "message": "liveMetadata",
            "data": {}
        }
        res.json(response);
    })

};
export default live;
