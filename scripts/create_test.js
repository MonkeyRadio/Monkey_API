const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const prompt = require('prompt-sync')();

const moduleName = prompt('Module name (path): ');
if (!moduleName)
    throw new Error('Module name is required!');
if (!existsSync(`src/${moduleName}`))
    throw new Error(`Module src/${moduleName} does not exist!`);
const moduleLastName = moduleName.split('/').pop();
const moduleNameFirstLetter = moduleLastName.charAt(0).toUpperCase() + moduleLastName.slice(1);

const TestName = prompt('Test name: ');
if (!TestName)
    throw new Error('Test name is required!');
const TestLowerName = TestName.toLowerCase();

const spec = readFileSync("helpers/basic.spec.helper", "utf8");

const newSpec = spec
    .replace(/\${{Module}}/g, moduleNameFirstLetter)
    .replace(/\${{module}}/g, `src/${moduleName}/${moduleName}`)
    .replace(/\${{test_suite}}/g, TestName);

if (!existsSync(`src/${moduleName}/tests`))
    mkdirSync(`src/${moduleName}/tests`);
writeFileSync(`src/${moduleName}/tests/${TestLowerName}.spec.ts`, newSpec);

console.log(`src/${moduleName}/tests/${TestLowerName}.spec.ts created!`);