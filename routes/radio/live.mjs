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

const live = () => {

    liveMetadata();
    liveContext();

}

const liveContext = () => {

    app.get("/radio/live/*", (req, res) => {
        let response = {
            "status": "ok",
            "message": "liveContext",
            "data": {}
        }
        res.json(response);
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
