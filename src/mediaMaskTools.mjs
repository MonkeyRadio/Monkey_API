/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  mediaMask Tools & Route
 *========================================================================**/

const getMediaMaskFromTime = (time) => {
    let mediaMask = {
        id: null,
        type: "mediaMask",
        timeStart: null,
        duration: null,
        timeEnd: null,
        single: {
            id: null,
            name: "Monkey",
            releaseDate: null,
            artist: {
                id: null,
                name: "Monkey Radio",
            }
        }
    }
    return mediaMask;
}

export default getMediaMaskFromTime;