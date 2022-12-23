/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  single Route
 *========================================================================**/

import app from '../../src/server.mjs'
import db from '../../src/database/db.mjs'

const single = () => {
    app.get('/playingMetadata/single/*', getSingle);
    app.get('/playingMetadata/single', getSingle);
    app.post('/playingMetadata/single', postSingle);
}

const getSingle = async (req, res) => {
    let response = {
        "status": "ok",
        "message": "getSingle",
        "data": {}
    };

    const id = parseInt(req.url.split("/")[3]);
    let queryData = {
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'PlayingMetadataArtistId']
        },
        include: {
            model: db.playingMetadata.artist,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    }
    if (!isNaN(id))
        queryData.where = {id: id};
    response.data = await db.playingMetadata.single.findAll(queryData);
    if (response.data == null) {
        response.status = "error";
        response.message = "single not found";
        response.data = {};
        res.status(404).json(response);
        return;
    }
    res.json(response);
};

const postSingle = async (req, res) => {
    let response = {
        "status": "ok",
        "message": "postSingle",
        "data": {}
    };

    let requiredData = [
        {name: req.body.name},
        {releaseDate: req.body.releaseDate},
        {artistID: req.body.artistID}];
    if (req.body == undefined || app.tools.checkVar(requiredData)[0] === false) {
        response.status = "error";
        response.message = "Missing parameters";
        response.data = app.tools.checkVar(requiredData)[1];
        res.status(400).json(response);
        return;
    }

    try {
        response.data = await db.playingMetadata.single.create({
            name: req.body.name,
            releaseDate: req.body.releaseDate,
            PlayingMetadataArtistId: parseInt(req.body.artistID)
        })
        res.json(response);
    } catch (error) {
        response.status = "error";
        response.message = "Internal Server Error";
        response.data = error;
        res.status(503).json(response);
    }
}

export default single;