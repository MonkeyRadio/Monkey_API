/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  playingMetadata Artist Model
 *========================================================================**/

import { DataTypes, Model } from 'sequelize';

const artistInit = (db) => {

    class Artist extends Model { }

    Artist.init({
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
    }, {
        sequelize: db.seq,
        modelName: 'PlayingMetadata_Artist'
    });

    return Artist;

};

export default artistInit;
