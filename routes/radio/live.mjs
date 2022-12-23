/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Live Routes
 *========================================================================**/

import app from '../../src/server.mjs'
import db from '../../src/database/db.mjs'
import mediaMaskFromTime from '../../src/mediaMaskTools.mjs'

const live = () => {

    liveMetadata();
    liveContext();

}

const checkLiveHasMetadata = async (id, response) => {
    const item = await db.live.context.findOne({
        where: {
            id: id
        },
        include: {
            model: db.types
        }
    });
    if (item == null) {
        response.status = "error";
        response.message = "live item not found";
        response.data = {};
        return false;
    }
    if (item.hasMetadata == false) {
        response.status = "error";
        response.message = "live item has no metadata";
        response.data = {};
        return false;
    }
    return true;
}

const getLiveContext = async (req, res) => {
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
};

const postLiveContext = async (req, res) => {
    let response = {
        "status": "ok",
        "message": "liveContext",
        "data": {}
    }

    let requiredData = [
        { name: req.body.name },
        { description: req.body.description },
        { cover: req.body.cover },
        { tags: req.body.tags },
        { isPublic: req.body.isPublic },
        { hasMetadata: req.body.hasMetadata },
        { type: req.body.type }]

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
};


const liveContext = () => {

    app.get("/radio/live/*/context", getLiveContext);

    app.post("/radio/live", postLiveContext);

};

const getLiveMetadata = async (req, res) => {
    let response = {
        "status": "ok",
        "message": "liveMetadata",
        "data": {}
    }
    const id = parseInt(req.url.split("/")[3]);
    let timestamped = parseInt(req.url.split("/")[5]);
    const timestamp = isNaN(timestamped) ? Math.round(Date.now()/1000) : timestamped;
    if (await checkLiveHasMetadata(id, response) == false) {
        res.status(404).json(response);
        return;
    }
    const item = await db.live.context.findOne({
        where: {
            id: id
        },
        include: {
            model: db.types
        }
    });
    response.data = {
        "id": item.id,
        "name": item.name,
        "metadata": {
            "count": 0
        }
    }
    let metadataQuery = await db.live.metadata.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'liveContextId', 'PlayingMetadataSingleId']
        },
        where: {
            liveContextId: id
        },
        include: {
            model: db.playingMetadata.single,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'PlayingMetadataArtistId']
            },
            include: {
                model: db.playingMetadata.artist,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        },
        order: [
            ['timeStart', 'ASC']
        ]
    });
    let metadata = [];
    response.data.metadata.current = mediaMaskFromTime(metadata, Math.round(Date.now()/1000));
    for (let i = 0; i < metadataQuery.length; i++) {
        metadata[i] = metadataQuery[i].dataValues;
        metadata[i].single = metadataQuery[i].PlayingMetadata_Single.dataValues;
        metadata[i].single.artist = metadataQuery[i].PlayingMetadata_Single.PlayingMetadata_Artist;
        delete metadata[i].single.PlayingMetadata_Artist;
        delete metadata[i].PlayingMetadata_Single;
    }
    if (timestamp == undefined || isNaN(timestamp)) {
        response.data.metadata.count = metadata.length;
        response.data.metadata.items = metadata;
    } else {
        response.data.metadata.current = mediaMaskFromTime(metadata, timestamp);
        let metadataPasted = [];
        let metadataFuture = [];
        for (let i = 0; i < metadata.length; i++) {
            if (metadata[i].timeEnd <= timestamp) {
                metadataPasted.push(metadata[i]);
            } else if (metadata[i].timeStart > timestamp) {
                metadataFuture.push(metadata[i]);
            } else {
                response.data.metadata.current = metadata[i];
            }
        }
        response.data.metadata.past = metadataPasted;
        response.data.metadata.future = metadataFuture;
        response.data.metadata.count = metadataPasted.length + metadataFuture.length + 1;
    }
    res.json(response);

};

const postLiveMetadata = async (req, res) => {
    let response = {
        "status": "ok",
        "message": "PutLiveMetadata",
        "data": {}
    }
    const id = parseInt(req.url.split("/")[3]);
    if (await checkLiveHasMetadata(id, response) == false) {
        res.status(404).json(response);
        return;
    }
    let requiredData = [
        { type: req.body.type },
        { timeStart: req.body.timeStart },
        { duration: req.body.duration },
        { singleID: req.body.singleID }]

    if (req.body == undefined || app.tools.checkVar(requiredData)[0] === false) {
        response.status = "error";
        response.message = "Missing parameters";
        response.data = app.tools.checkVar(requiredData)[1];
        res.status(400).json(response);
        return;
    }
    try {
        response.data = await db.live.metadata.create({
            liveContextId: id,
            type: req.body.type,
            timeStart: parseInt(req.body.timeStart),
            duration: parseInt(req.body.duration),
            timeEnd: parseInt(req.body.timeStart) + parseInt(req.body.duration),
            PlayingMetadataSingleId: req.body.singleID
        })
        res.json(response);
    } catch (error) {
        response.status = "error";
        response.message = "Internal Server Error";
        response.data = error;
        res.status(503).json(response);
    }
};

const liveMetadata = () => {

    app.get("/radio/live/*/metadata", getLiveMetadata);
    app.get("/radio/live/*/metadata/*", getLiveMetadata);
    app.post("/radio/live/*/metadata", postLiveMetadata);

};
export default live;
