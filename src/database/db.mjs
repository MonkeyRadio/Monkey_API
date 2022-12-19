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
import dbConnect from './db_connect.mjs';

let db = {};

const dbInit = async () => {
    db.seq = await dbConnect();
    db.media = mediaInit(db.seq);
    db.playingMetadata = playingMetadata(db.seq);
    return db;
}

export default db;
export { dbInit };
