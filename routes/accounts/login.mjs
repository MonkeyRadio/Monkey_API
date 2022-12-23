/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  login route
 *========================================================================**/

import db from '../../src/database/db.mjs'
import app from '../../src/server.mjs'
import config from '../../config/config.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req, res) => {
    let result = {
        status: "ok",
        message: "User logged in",
        data: {}
    }

    let requiredData = [
        {username: req.body.username},
        {password: req.body.password}
    ]

    if (!req.body || app.tools.checkVar(requiredData)[0] === false) {
        result.status = "error";
        result.message = "Missing fields";
        result.data = app.tools.checkVar(requiredData)[1];
        return res.status(400).json(result);
    }

    let user = await db.accounts.users.findOne({
        where: {
            username: req.body.username
        }
    });

    if (!user) {
        result.status = "error";
        result.message = "User or password incorrect";
        return res.status(400).json(result);
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        result.status = "error";
        result.message = "User or password incorrect";
        return res.status(400).json(result);
    }

    const userToken = await db.accounts.usersKeys.findOne({
        where: {
            userId: user.id
        },
        order: [
            ['id', 'ASC']
        ]
    });

    const token = jwt.sign({key: userToken.id}, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
    result.data = {
        id: user.id,
        username: user.username,
        key: {
            id: userToken.id,
            token: token
        }
    }
    return res.status(200).json(result);
}

export default login