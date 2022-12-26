/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-24
 * @description    :  Entitlements assignation route
 *========================================================================**/

import app from '../../../src/server.mjs'
import db from '../../../src/database/db.mjs'

const assignEntitlements = async (req, res) => {
    let result = {
        status: "ok",
        message: "Entitlements assignation",
        data: {}
    }

    let requiredData = [
        {usersKeyId: req.body.usersKeyId},
        {entitlementName: req.body.entitlementName}
    ]

    if (!req.body || app.tools.checkVar(requiredData)[0] === false) {
        result.status = "error";
        result.message = "Missing fields";
        result.data = app.tools.checkVar(requiredData)[1];
        return res.status(400).json(result);
    }

    let userKey = await db.accounts.usersKeys.findOne({
        where: {
            id: req.body.usersKeyId
        }
    });

    if (!userKey) {
        result.status = "error";
        result.message = "User key not found";
        return res.status(400).json(result);
    }

    let entArr = req.body.entitlementName.split(".");

    let ent = db.accounts.entitlements.entitlements[entArr[0]];

    for (let i = 1; i < entArr.length; i++) {
        if (ent === undefined) {
            break;
        }
        eval(`ent = ent.${entArr[i]}`);
    }

    if (ent === undefined || ent === null || typeof ent === "object") {
        result.status = "error";
        result.message = "Entitlements not found";
        return res.status(400).json(result);
    }

    let userEntitlements = await db.accounts.entitlements.keyEntitlements.findOne({
        where: {
            usersKeyId: req.body.usersKeyId,
            name: req.body.entitlementName
        }
    });

    if (userEntitlements) {
        result.status = "error";
        result.message = "Entitlements already assigned";
        return res.status(400).json(result);
    }

    let newEntitlements = await db.accounts.entitlements.keyEntitlements.create({
        usersKeyId: req.body.usersKeyId,
        name: req.body.entitlementName
    });

    if (!newEntitlements) {
        result.status = "error";
        result.message = "Entitlements assignation failed";
        return res.status(400).json(result);
    }

    result.data = newEntitlements;

    res.json(result);
}

export default assignEntitlements