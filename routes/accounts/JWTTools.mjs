/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-24
 * @description    :  JWT Tools
 *========================================================================**/

import jwt from 'jsonwebtoken'
import config from '../../config/config.mjs'
import db from '../../src/database/db.mjs'
import app from '../../src/server.mjs'
import { Op, default as sequelize } from 'sequelize'

const jwtTools = {};

jwtTools.tokenAuth = async (req, res, next) => {

    let result = {
        status: "ok",
        message: "Token status",
        data: {}
    }

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        result.status = "error";
        result.message = "Authentification required";
        result.data = ["Authentification bearer"];
        return res.status(400).json(result);
    }

    try {
        let decoded = jwt.verify(token, config.jwt.secret);
        req.token = decoded;
    } catch (err) {
        result.status = "error";
        result.message = "Invalid Token";
        result.data = null;
        return res.status(400).json(result);
    }

    let userKey = await db.accounts.usersKeys.findOne({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        where: {
            id: req.token.key
        }
    });

    if (!userKey) {
        result.status = "error";
        result.message = "Token not found";
        return res.status(400).json(result);
    }

    req.key = userKey;

    let keyEntitlements = await db.accounts.entitlements.keyEntitlements.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'usersKeyId']
        },
        where: {
            usersKeyId: userKey.userId
        },
        order: [
            ['name', 'ASC'],
            [sequelize.fn('char_length', sequelize.col('name')), 'ASC']
        ]
    });

    req.entitlements = [];

    for (let i = 0; i < keyEntitlements.length; i++) {
        req.entitlements.push(keyEntitlements[i].name);
    }

    let user = await db.accounts.users.findOne({
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
        },
        where: {
            id: userKey.userId
        }
    });

    if (!user) {
        result.status = "error";
        result.message = "User not found";
        return res.status(400).json(result);
    }

    req.user = user;

    return next();
}

jwtTools.isEntitled = async (req, entitlements) => {

    if (typeof entitlements == "string") {
        entitlements = [entitlements];
    }

    let op = {
        usersKeyId: req.key.id,
        [Op.or]: [
            {name: "root"}
        ]
    }

    for (let i = 0; i < entitlements.length; i++) {
        op[Op.or].push({
            name: entitlements[i]
        });
    }

    let userEntitlements = await db.accounts.entitlements.keyEntitlements.findAll({
        where: op
    });

    if (userEntitlements.length === 0) {
        return false;
    }

    return true;
}

export default jwtTools;