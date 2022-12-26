/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  accounts route
 *========================================================================**/

import app from '../../src/server.mjs'
import register from './register.mjs'
import login from './login.mjs'
import jwtTools from './JWTTools.mjs'
import tokenStatus from './tokenStatus.mjs'

const accounts = () => {
    app.post('/auth/register', register);
    app.post('/auth/login', login);
    app.get('/auth/tokenStatus', jwtTools.tokenAuth, tokenStatus);
}

export default accounts;