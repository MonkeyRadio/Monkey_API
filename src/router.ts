import fs from "fs";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from 'yaml';
import notFound from "./resultConstructor/notFound.js";
import errorCustomMessage from "./resultConstructor/errorCustomMessage.js";
import responseC from "./resultConstructor/responseC.js";

let routes: Array<string> = [];

export default async function init_routes(app: Express): Promise<void> {
    console.log("Loading routes...");
    routes = [];
    const swaggerFile: any = (process.cwd()+"/swagger/swagger.yaml");
    const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
    const customCss: any = fs.readFileSync((process.cwd()+"/swagger/swagger.css"), 'utf8');
    const swaggerDocument: any = YAML.parse(swaggerData);
    const options = {
        customCss: customCss,
        customSiteTitle: "Monkey Radio API",
        customfavIcon: "https://monkeyradio.fr/assets/monkeyPNG.png"
      };
    app.use('/api/docs', swaggerUi.serve,
            swaggerUi.setup(swaggerDocument, options, undefined, customCss));
    const get_files = async (fld: string) => {
        let dir = await fs.promises.readdir(process.env.ROUTE_SRC + fld);
        for (let dirO of dir) {
            if ((await (fs.promises.lstat(process.env.ROUTE_SRC + fld + dirO))).isDirectory()) {
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
            app.use((err: any, req: any, res: any, next: any) => {
                if (err) {
                    responseC(res, 400, errorCustomMessage('Unknown', 'Error Parsing Data', 400));
                } else {
                  next()
                }
              })
            app.use((req, res) => {
                responseC(res, 404, notFound());
            });
            console.log("Routes loaded.");
            return;
        }
    }
}
