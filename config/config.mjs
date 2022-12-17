// ----------------------------------------------
// Monkey Radio ORG - 2022
// Dev by: @nicojqn
// Description: CONFIG file
// ----------------------------------------------

import db from "./dbConfig.mjs";

const config = {
    port: 8080,
    host: "0.0.0.0",
    db : db,
    api: {
        version: "v2",
        prefix: "/api",
        name: "Monkey Radio API",
        description: "Monkey Radio API"
    }
}

const callback = {
    onListen: () => {
        console.log(`Listening on ${config.host}:${config.port}`);
    }
}

export default { config, callback };