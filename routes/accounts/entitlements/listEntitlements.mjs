/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-24
 * @description    :  Entitlements List route
 *========================================================================**/

import {Op} from 'sequelize'
import db from '../../../src/database/db.mjs'
import app from '../../../src/server.mjs'
import jwtTools from '../JWTTools.mjs'

const retEnt = async (req, ent, parentName) => {
    let result = {};

    if (typeof ent === "string")
        return ent;

    if (typeof ent === "object" && !await jwtTools.isEntitled(req, `${parentName}.list`))
        return null;
    
    for (let key in ent) {
        if (typeof ent[key] === "string") {
            result[key] = ent[key];
        } else if (typeof ent[key] === "object") {
            if (await jwtTools.isEntitled(req, `${parentName}.${key}.list`)) {
                result[key] = retEnt(req, ent[key], `${parentName}.${key}`);
            }
        }
    }

    return result;
}


const listEntitlements = async (req, res, next) => {

    let result = {
        status: "ok",
        message: "Entitlements List",
        data: []
    }

    let parentName = req.url.split("/").slice(4).join("/");
    parentName = (parentName[parentName.length -1] === "/") ? parentName.slice(0, -1) : parentName;

    parentName = parentName.split("/").join(".");

    let requiredData = [
        {parentName: parentName}
    ]

    if (!req.body || app.tools.checkVar(requiredData)[0] === false) {
        result.status = "error";
        result.message = "Missing fields";
        result.data = app.tools.checkVar(requiredData)[1];
        return res.status(400).json(result);
    }

    if (await jwtTools.isEntitled(req, [`${parentName}.list`, `${parentName.split(".").slice(0, -1).join(".")}.list`]) === false) {
        result.status = "error";
        result.message = "Entitlements list failed";
        return res.status(400).json(result);
    }

    let entArr = parentName.split(".");

    if (parentName === "")
        entArr = [];

    let ent = db.accounts.entitlements.entitlements;

    for (let i = 0; i < entArr.length; i++) {
        if (ent === undefined) {
            ent = null;
            break;
        }
        eval(`ent = ent.${entArr[i]}`);
    }

    if (ent === undefined || ent === null) {
        result.status = "error";
        result.message = "Entitlements list failed";
        return res.status(400).json(result);
    }

    result.data = await retEnt(req, ent, parentName);

    if (result.data === null) {
        result.status = "error";
        result.message = "Entitlements list failed";
        result.data = [];
        return res.status(400).json(result);
    }

    res.json(result);
}

export default listEntitlements;