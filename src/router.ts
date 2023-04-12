import fs from "fs";
import { Express } from "express";

let routes: Array<string> = [];

export default async function init_routes(app: Express): Promise<void> {
    console.log("Loading routes...");
    routes = [];
    const get_files = async (fld: string) => {
        let dir = await fs.promises.readdir("./dist/routes/" + fld);
        for (let dirO of dir) {
            if ((await (fs.promises.lstat("./dist/routes/" + fld + dirO))).isDirectory()) {
                routes.push(fld + dirO);
            }
        }
    };
  
    await get_files("");
  
    let numCalls = 0;

    for (let route of routes) {
        let module = await import(`./routes/${route}/route.js`);
        console.log(`Loading route: /${route}`);
        if (module.mainMiddleware)
            app.use(`/${route}`, module.mainMiddleware, module.default);
        else
            app.use(`/${route}`, module.default);
        numCalls++;
        if (numCalls === routes.length) {
            console.log("Routes loaded.");
            return;
        }
    }
}
