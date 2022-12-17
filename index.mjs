// ----------------------------------------------
// Monkey Radio ORG - 2022
// Dev by: @nicojqn
// Description: Monkey API
// ----------------------------------------------

// Importing modules
import {listen} from './src/server.mjs'
import {routes, setRoutes} from './src/router.mjs'

// Setting routes
setRoutes();

// Starting server
listen();