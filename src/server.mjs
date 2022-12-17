// ----------------------------------------------
// Monkey Radio ORG - 2022
// Dev by: @nicojqn
// Description: Express server for the API
// ----------------------------------------------

import Express from 'express';
import {config, callbacks} from '../config/config.mjs';

const app = Express();

const listen = () => {
    app.listen(config.port, config.host, callbacks.onListen());
}

export default app;
export {listen};