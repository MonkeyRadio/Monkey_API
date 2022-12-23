/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  accounts models
 *========================================================================**/

import users from './users.mjs';
import entitlements from './entitlement.mjs';
import usersToken from './usersKeys.mjs';

const accounts = (db) => {
    db.accounts = {}
    db.accounts.users = users(db);
    db.accounts.usersKeys = usersToken(db);
    db.accounts.users.hasOne(db.accounts.usersKeys);
    db.accounts.usersKeys.belongsTo(db.accounts.users);
    db.accounts.entitlements = entitlements(db);
}

export default accounts;
