/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Express Server
 *========================================================================**/

import Express from 'express';
import multer from 'multer';
import {config, callbacks} from '../config/config.mjs';

const app = Express();

app.use((req, res, next) => {
    multer().array()(req, res, (err) => {
        if (err) {
            res.status(400).json({
                status: "error",
                message: "Bad request",
                data: null
            });
        } else {
            next();
        }
    });
});
app.use(Express.json());
app.use(Express.urlencoded({extended: false}));

app.upTime = new Date();

app.tools = {};

app.tools.checkVar = (objArr) => {
    /**======================
     **   checkVar
      *@param objArr : array of objects
      *@return [bool, array of the name of undefined variables]
     *========================**/
    let arrUndefined = [];
    let response = true;
    objArr.forEach((v) => {
        let obj = Object.keys(v)[0];
        if (v[obj] === undefined || v[obj] === null) {
                arrUndefined.push(obj);
                response = false;
        }
    });
    return [response, arrUndefined];
}

app.tools.objClone = (obj) => {
    /**======================
     **  objClone
     * @param obj : object
     * @return cloned object
     * ========================**/
    let clone = {};
    for (let i in obj) {
        if (typeof(obj[i]) == "object" && obj[i] != null)
            clone[i] = app.tools.objClone(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}

const listen = () => {
    app.listen(config.port, config.host, callbacks.onListen());
}

export default app;
export {listen};