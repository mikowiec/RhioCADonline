import { resolve } from "path";
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs';
import glslify from "rollup-plugin-glslify";
import glslifyImport from "glslify-import";
import livereload from "rollup-plugin-livereload";
import nodeResolve from 'rollup-plugin-node-resolve';
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";
import tsconfig from "./tsconfig.json";

function generateNamedExports(libraryNames) {
    return libraryNames.reduce((map, libraryName) => {
        map[libraryName] = Object.keys(require(libraryName));
        return map;
    }, {});
}

function commonPlugins() {
    return [
        nodeResolve(),
        commonjs({
            sourceMap: false,
            namedExports: generateNamedExports(["gltf-loader-ts"])
        }),
        glslify({
            transform: [glslifyImport]
        })
    ];
}

function libraryBuild() {
    return {
        input: "src/index.ts",
        plugins: [
            ...commonPlugins(),
            typescript({
                typescript: require("typescript"),
                cacheRoot: resolve(".cache", "rpt2")
            }),
            terser()
        ],
        output: [{
            file: pkg.main,
            format: "umd",
            name: pkg.name
        }, {
            file: pkg.module,
            format: "es"
        }]
    };
}

function devBuild() {
    return {
        input: "examples/index.ts",
        plugins: [
            ...commonPlugins(),
            typescript({
                typescript: require("typescript"),
                cacheRoot: resolve(".cache", "rpt2"),
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                        sourceMap: true
                    },
                    include: tsconfig.include.concat(["examples"])
                }
            }),
            serve({
                contentBase: ["dist", "static"],
                host: "0.0.0.0",
                port: 8080
            }),
            livereload({
                watch: ["dist", "static"]
            })
        ],
        output: [{
            file: "dist/examples.js",
            format: "iife",
            sourcemap: true
        }]
    };
}

const DEV = !!process.env.ROLLUP_WATCH;
const build = (DEV) ? devBuild : libraryBuild;

export default build();
