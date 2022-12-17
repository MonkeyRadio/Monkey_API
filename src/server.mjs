// ----------------------------------------------
// Monkey Radio ORG - 2022
// Dev by: @nicojqn
// Description: Express server for the API
// ----------------------------------------------

import Express from 'express';
import config from '../config/config.mjs';

const app = Express();

app.listen(config.port, config.host, config.callback.onListen());

export default app;
