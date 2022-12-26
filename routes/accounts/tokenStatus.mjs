/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  tokenStatus route
 *========================================================================**/

import db from '../../src/database/db.mjs'
import app from '../../src/server.mjs'
import config from '../../config/config.mjs'

const tokenStatus = async (req, res, next) => {

    let result = {
        status: "ok",
        message: "Token status",
        data: {
            token: req.token,
            key: req.key,
            user: req.user,
            entitlements: req.entitlements
        }
    }

    res.json(result);
}

export default tokenStatus