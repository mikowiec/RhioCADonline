import { ShaderProgram } from "./ShaderProgram";
import injectDefines from "glsl-inject-defines";

export interface ShaderDefines {
    [define: string]: any;
}

export class ShaderProgramCache {
    private shaderPrograms = new Map<string, ShaderProgram>();

    constructor(private gl: WebGL2RenderingContext) {}

    public create(materialName: string, vertex: string, fragment: string, defines: ShaderDefines = {}): ShaderProgram {
        const vertexShader = injectDefines(vertex, defines);
        const fragmentShader = injectDefines(fragment, defines);

        const program = new ShaderProgram(this.gl, vertexShader, fragmentShader);
        this.shaderPrograms.set(this.keyName(materialName, defines), program);
        return program;
    }

    public get(materialName: string, defines: ShaderDefines = {}): ShaderProgram {
        return this.shaderPrograms.get(this.keyName(materialName, defines));
    }

    public getOrCreate(materialName: string, vertex: string, fragment: string, defines: ShaderDefines = {}) {
        return this.get(materialName, defines) || this.create(materialName, vertex, fragment, defines);
    }

    private keyName(materialName: string, defines: ShaderDefines) {
        const keyValues = Object.entries(defines).map(([k, v]) => `${k}=${v}`);
        return [materialName, ...keyValues].join("/");
    }
}
