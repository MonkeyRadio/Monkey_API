/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  usersToken models
 *========================================================================**/

import { DataTypes, Model } from 'sequelize';

const usersTokenM = (db) => {
    class usersKeys extends Model {}
    usersKeys.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        }
    }, {
        sequelize: db.seq,
        modelName: 'usersKeys',
    });
    return usersKeys;
}

export default usersTokenM;