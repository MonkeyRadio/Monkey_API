// ----------------------------------------------
// Monkey Radio ORG - 2022
// Dev by: @nicojqn
// Description: ping route
// ----------------------------------------------

import app from '../src/server.mjs'

const ping = (req, res, next) => {
    res.send('pong');
};

export default ping;
