/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Monkey Global API - Main file
 *========================================================================**/

// Importing modules
import {listen} from './src/server.mjs'
import setRoutes from './src/router.mjs'
import {dbInit} from './src/database/db.mjs'

// Setting routes
setRoutes();

// Starting server
listen();

// Starting db
dbInit();