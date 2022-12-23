/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  artist Route
 *========================================================================**/

import app from '../../src/server.mjs'
import db from '../../src/database/db.mjs'

const artist = () => {
    app.get('/playingMetadata/artist/*', getArtist);
    app.post('/playingMetadata/artist', postArtist);
}

const getArtist = async (req, res) => {
    let response = {
        "status": "ok",
        "message": "getArtist",
        "data": {}
    };

    const id = parseInt(req.url.split("/")[3]);
    response.data = await db.playingMetadata.artist.findOne({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        where: {
            id: id
        }
    });
    if (response.data == null) {
        response.status = "error";
        response.message = "artist not found";
        response.data = {};
        res.status(404).json(response);
        return;
    }
    res.json(response);
};

const postArtist = async (req, res) => {
    let response = {
        "status": "ok",
        "message": "postArtist",
        "data": {}
    };

    let requiredData = [
        {name: req.body.name}];
    if (req.body == undefined || app.tools.checkVar(requiredData)[0] === false) {
        response.status = "error";
        response.message = "Missing parameters";
        response.data = app.tools.checkVar(requiredData)[1];
        res.status(400).json(response);
        return;
    }

    try {
        response.data = await db.playingMetadata.artist.create({
            name: req.body.name
        })
        res.json(response);
    } catch (error) {
        response.status = "error";
        response.message = "Internal Server Error";
        response.data = error;
        res.status(503).json(response);
    }
}

export default artist;