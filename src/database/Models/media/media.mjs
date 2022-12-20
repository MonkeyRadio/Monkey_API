/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  Media Models
 *========================================================================**/

import mediaContextInit from "./mediaContext.mjs";
import mediaMetadataInit from "./mediaMetadata.mjs";

const mediaInit = (db) => {
    const arr = {
        context : mediaContextInit(db),
        metadata : mediaMetadataInit(db)
    };
    arr.context.hasOne(arr.metadata);
    arr.metadata.belongsTo(arr.context);
    db.playingMetadata.single.hasOne(arr.metadata);
    arr.metadata.belongsTo(db.playingMetadata.single);
    db.types.hasOne(arr.context);
    arr.context.belongsTo(db.types);
    return arr;
};

export default mediaInit;
