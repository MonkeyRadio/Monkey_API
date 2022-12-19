/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  playingMetadata Single Model
 *========================================================================**/

import { DataTypes, Model } from 'sequelize';

const singleInit = (db) => {

    class Single extends Model { }

    Single.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        releaseDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize: db,
        modelName: 'PlayingMetadata_Single'
    });

    return Single;

};

export default singleInit;
