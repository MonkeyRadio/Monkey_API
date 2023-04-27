import express from 'express';
import Register from './register.js';
import Login from './login.js';
import Update from './update.js';
import Infos from './info.js';
import destroyTokenFamily from './destroyTokenFamily.js';
import addPermission from './permission/addPermission.js';
import removePermission from './permission/removePermission.js';
import renewToken from './renewToken.js';

const router = express.Router();

Register(router);
Login(router);
destroyTokenFamily(router);
Update(router);
Infos(router);
addPermission(router);
removePermission(router);
renewToken(router);
export default router;