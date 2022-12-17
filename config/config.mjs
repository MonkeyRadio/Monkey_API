// ----------------------------------------------
// Monkey Radio ORG - 2022
// Dev by: @nicojqn
// Description: CONFIG file
// ----------------------------------------------

const config = {
    port : 8081,
    host : "0.0.0.0",
    db : {
        type: "mysql",
        host: "localhost",
        port: 27017,
        name: "monkeyradio",
        user: "monkeyradio",
        pass: "monkeyradio"
    },
    api : {
        version: "v2",
        prefix: "/api",
        name: "Monkey Radio API",
        description: "Monkey Radio API"
    },
    APIModules: [
        {name : "ping", path : "ping.mjs", description : "Ping API", requireAUTH : false},
    ]
};

const callbacks = {
    onListen: () => {
        console.log(`Listening on ${config.host}:${config.port}`);
    }
};

export default config;
export { config, callbacks };