import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import requiredEnv from './requiredEnv.json' assert {
    type: "json"
};
import init_routes from './router.js';

dotenv.config();

const app = express();

const port: number = parseInt(process.env.PORT!) || 3000;
const host: string = process.env.HOST || 'localhost';
const proxyLevel: number = parseInt(process.env.PROXY_LEVEL!) || 0;

function check_env_vars(): boolean {
    for (let i = 0; i < requiredEnv.length; i++) {
      if (!process.env[requiredEnv[i]]) {
        return false;
      }
    }
    return true;
};

async function start(): Promise<void> {
    if (!check_env_vars()) {
        console.error('Missing required environment variables');
        return;
    }
    console.log("MONKEY RADIO API");
    console.log('Starting server');
    app.disable('x-powered-by');
    app.set("trust proxy", proxyLevel);
    app.get("/ip", (request, response) => response.send(request.ip));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    try {
        console.log("Connecting to db");
        await mongoose.connect(process.env.MONGODB_URI!);
    } catch (error) {
        console.error("Cannot connect to db");
        console.error(error);
        return;
    }
    app.listen(port, host, async () => {
        await init_routes(app);
        console.log(`Server is running on http://${host}:${port}`);
    });
}

start();

process.on("uncaughtException", function (err) {
    console.log("Caught exception: ", err);
});