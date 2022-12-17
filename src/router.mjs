// ----------------------------------------------
// Monkey Radio ORG - 2022
// Dev by: @nicojqn
// Description: router
// ----------------------------------------------

import {config} from '../config/config.mjs'
import app from '../src/server.mjs'

// Importing routes

const routes = {};

const setRoutes = () => {
  config.APIModules.forEach((module) => {
      routes[module.name] = module;
      eval(`app.use(${module.name});`);
  });
};

app.use((req, res) => {
    res.status(404);
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
    res.type('txt').send('Not found');
});

export default routes;
export {setRoutes, routes};