/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-19
 * @description    :  db init
 *========================================================================**/

import mediaInit from './Models/media.mjs';
import playingMetadata from './Models/playingMetadata/playingMetadata.mjs';
import live from './Models/live/live.mjs';
import dbConnect from './db_connect.mjs';

let db = {};

const models_sync = (db) => {
    Object.keys(db).forEach((model) => {
        if (model === 'seq')
            return;
        if (typeof(db[model]) === 'object')
            models_sync(db[model]);
        if (typeof(db[model]) === 'function' && db[model].sync) {
            console.log(`[DB] Syncing ${model} model...`);
            db[model].sync();
        }
    });
}

const dbInit = async () => {
    db.seq = await dbConnect();
    db.media = mediaInit(db);
    db.playingMetadata = playingMetadata(db);
    db.live = live(db);
    models_sync(db);
    return db;
}

export default db;
export { dbInit };
