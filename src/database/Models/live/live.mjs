/**------------------------------------------------------------------------
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-20
 * @description    :  live Models
 *------------------------------------------------------------------------**/

import { DataTypes, Model } from 'sequelize';
import liveContextInit from './liveContext.mjs';
import liveMetadataInit from './liveMetadata.mjs';

const liveInit = (db) => {
    const arr = {
        context : liveContextInit(db),
        metadata : liveMetadataInit(db)
    };
    arr.context.hasOne(arr.metadata);
    arr.metadata.belongsTo(arr.context);
    db.playingMetadata.single.hasOne(arr.metadata);
    arr.metadata.belongsTo(db.playingMetadata.single);
    return arr;
};

export default liveInit;