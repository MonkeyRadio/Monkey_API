/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Ping Routes
 *========================================================================**/

import app from '../src/server.mjs'

const ping = () => {
    app.all("/ping", (req, res) => {
        res.json({ message: "pong", uptime: app.upTime });
    })
    
    app.all("/ping/raw", (req, res) => {
        res.send("pong");
    })
};

export default ping;
