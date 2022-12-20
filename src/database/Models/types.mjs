/**------------------------------------------------------------------------
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-20
 * @description    :  allTypes Model
 *------------------------------------------------------------------------**/

import { DataTypes, Model } from 'sequelize';

const allTypesInit = (db) => {

    class allTypes extends Model {}
    allTypes.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCDNAble: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        sequelize: db.seq,
        modelName: 'allTypes',
    });

    return allTypes;
}

export default allTypesInit;
