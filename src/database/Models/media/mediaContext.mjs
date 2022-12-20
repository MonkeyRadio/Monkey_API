/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-20
 * @description    :  mediaContext Model
 *========================================================================**/

import { DataTypes, Model } from 'sequelize';

const mediaContextInit = (db) => {
    class mediaContext extends Model {}
    mediaContext.init({
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
        wasDifused: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        dateDifused: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        hasMetadata: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        sequelize: db.seq,
        modelName: 'mediaContext',
    });

    return mediaContext;
};

export default mediaContextInit;
