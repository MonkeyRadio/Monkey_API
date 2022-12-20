/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-20
 * @description    :  liveContext Model
 *========================================================================**/

import { DataTypes, Model } from 'sequelize';

const liveContextInit = (db) => {
    class liveContext extends Model {}
    liveContext.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cover: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        sequelize: db.seq,
        modelName: 'liveContext',
    });

    return liveContext;
};

export default liveContextInit;
