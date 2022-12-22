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

app.use(multer().array()); 
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

const listen = () => {
    app.listen(config.port, config.host, callbacks.onListen());
}

export default app;
export {listen};