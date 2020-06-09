const tsnode = require("ts-node");
const testConfig = require("../tsconfig.json");

tsnode.register(testConfig);

require("webgl-mock");
