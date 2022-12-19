/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Express Server
 *========================================================================**/

import Express from 'express';
import {config, callbacks} from '../config/config.mjs';

const app = Express();

app.upTime = new Date();

const listen = () => {
    app.listen(config.port, config.host, callbacks.onListen());
}

export default app;
export {listen};