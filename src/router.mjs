/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Express Router
 *========================================================================**/

import {config} from '../config/config.mjs'
import app from '../src/server.mjs'

// Importing routes
import ping from '../routes/ping.mjs'
import radioLive from '../routes/radio/live.mjs'

const setRoutes = () => {
  ping();
  radioLive();
  
  route404();
};


const route404 = () => {
  app.use((req, res) => {
    res.status(404);
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
    res.type('txt').send('Not found');
});
}

export default setRoutes;
