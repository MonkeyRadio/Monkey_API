import express from 'express';
import Register from './register.js';
import Login from './login.js';
import destroyTokenFamily from './destroyTokenFamily.js';

const router = express.Router();

Register(router);
Login(router);
destroyTokenFamily(router);
export default router;