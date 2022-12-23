/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  playingMetadata Route
 *========================================================================**/

import artist from './artist.mjs';
import single from './single.mjs';

const playingMetadata = () => {
    artist();
    single();
};

export default playingMetadata;