/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-24
 * @description    :  entitlements routes
 *========================================================================**/

import app from '../../../src/server.mjs'
import jwtTools from '../JWTTools.mjs'
import listEntitlements from './listEntitlements.mjs'
import assignEntitlements from './assignEntitlements.mjs'
import revokeEntitlements from './revokeEntitlements.mjs'

const entitlements = () => {
    app.get('/auth/entitlements/list', jwtTools.tokenAuth, listEntitlements);
    app.get('/auth/entitlements/list/*', jwtTools.tokenAuth, listEntitlements);
    app.post('/auth/entitlements/assign', jwtTools.tokenAuth, assignEntitlements);
    app.post('/auth/entitlements/revoke', jwtTools.tokenAuth, revokeEntitlements);
}

export default entitlements;
