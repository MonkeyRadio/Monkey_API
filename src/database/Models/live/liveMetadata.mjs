/**------------------------------------------------------------------------
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-20
 * @description    :  liveMetadata Model
 *------------------------------------------------------------------------**/

import { DataTypes, Model } from 'sequelize';

const liveMetadataInit = (db) => {
    class liveMetadata extends Model {}
    liveMetadata.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeStart: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        timeEnd: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: db.seq,
        modelName: 'liveMetadata',
    });

    return liveMetadata;
}

export default liveMetadataInit;
