/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  entitlement models
 *========================================================================**/

import { DataTypes, Model } from 'sequelize';
import fs from 'fs';

const entitlements = (db) => {
    let arr = {};
    arr.keyEntitlements = usersEntitlements(db);
    arr.entitlements = entitlementsList();
    db.accounts.usersKeys.hasOne(arr.keyEntitlements);
    arr.keyEntitlements.belongsTo(db.accounts.usersKeys);
    return arr;
}

const usersEntitlements = (db) => {
    class keyEntitlements extends Model {}
    keyEntitlements.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize: db.seq,
        modelName: 'keyEntitlements',
    });
    return keyEntitlements;
}

const entitlementsList = () => {
    return JSON.parse(fs.readFileSync('./src/database/Models/accounts/entitlements.json'));
}

export default entitlements;