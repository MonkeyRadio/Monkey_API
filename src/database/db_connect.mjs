/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  db Connect
 *========================================================================**/

import {config, callbacks as cbs} from '../../config/config.mjs';
import Sequelize from 'sequelize';

const dbConnect = async () => {
    const db = new Sequelize(config.db.database,
        config.db.user, config.db.pass, 
        { dialect: config.db.type,
          host: config.db.host,
          logging: !process.argv.includes("dev") ? false : console.log });
    try {
        await db.authenticate();
        cbs.onDBConnect();
        return db;
    } catch (error) {
        cbs.onDBError(error);
    }
};

export default dbConnect;