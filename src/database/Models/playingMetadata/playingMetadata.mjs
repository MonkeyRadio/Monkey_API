/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  playingMetadata Model
 *========================================================================**/

import { DataTypes, Model } from 'sequelize';
import singleInit from './single.mjs';
import artistInit from './artists.mjs';

const playingMetadataInit = (db) => {
    let models = {};
    models.artist = artistInit(db);
    models.single = singleInit(db);
    models.artist.hasOne(models.single);
    models.single.belongsTo(models.artist);
    Object.keys(models).forEach((model) => {
        console.log(`[DB] Syncing ${model} model...`);
        models[model].sync();
    });
    return models;
};

export default playingMetadataInit;
