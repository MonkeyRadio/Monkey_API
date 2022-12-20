/**------------------------------------------------------------------------
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-20
 * @description    :  mediaMetadata Model
 *------------------------------------------------------------------------**/

import { DataTypes, Model } from 'sequelize';

const mediaMetadataInit = (db) => {
    class mediaMetadata extends Model {}
    mediaMetadata.init({
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
            type: DataTypes.DATE,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        timeEnd: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize: db.seq,
        modelName: 'mediaMetadata',
    });

    return mediaMetadata;
}

export default mediaMetadataInit;
