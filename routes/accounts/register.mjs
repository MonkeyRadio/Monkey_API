/**========================================================================
 * ?                                ABOUT
 * @author         :  @nicojqn
 * @email          :  contact@nicojqn.fr
 * @repo           :  Monkey Radio ORG - 2022 - Global API
 * @createdOn      :  2022-12-23
 * @description    :  Accounts register route
 *========================================================================**/

import app from '../../src/server.mjs'
import db from '../../src/database/db.mjs'
import config from '../../config/config.mjs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const register = async (req, res) => {
    let result = {
        status: "ok",
        message: "User registered",
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

    let userExists = await db.accounts.users.findOne({
        where: {
            username: req.body.username
        }
    });

    if (userExists) {
        result.status = "error";
        result.message = "User already exists";
        return res.status(400).json(result);
    }

    const user = await db.accounts.users.create({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
    });

    const userToken = await db.accounts.usersKeys.create({
        userId: user.id
    });

    const token = jwt.sign({key: userToken.id}, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
    result.data = {
        id: user.id,
        username: user.username,
        key: {
            token: token,
            expires: config.jwt.expiresIn
        }
    }
    res.status(200).json(result);
}

export default register;