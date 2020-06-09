import { Md5 } from "md5-typescript";

import { Material, Texture } from "../../../Core";
import { ShaderMaterial } from "../../../Materials";
import { GLMaterial, UniformsData, UniformTextures } from "../GLMaterial";
import { ShaderDefines, ShaderProgramCache } from "../ShaderProgramCache";
import { GLTextures } from "./GLTextures";
import { SyncedMap } from "./SyncedMap";

import flatFragment from "../Shaders/flat/fragment.frag.glsl";
import flatVertex from "../Shaders/flat/vertex.vert.glsl";
import phongFragment from "../Shaders/phong/fragment.frag.glsl";
import phongVertex from "../Shaders/phong/vertex.vert.glsl";
import pbrFragment from "../Shaders/pbr/fragment.frag.glsl";
import pbrVertex from "../Shaders/pbr/vertex.vert.glsl";

const materialShaders = new Map<string, [string, string]>([
    ["FlatMaterial", [flatVertex, flatFragment]],
    ["PhongMaterial", [phongVertex, phongFragment]],
    ["PBRMaterial", [pbrVertex, pbrFragment]]
]);

export class GLMaterials extends SyncedMap<Material, GLMaterial> {
    private shaderPrograms: ShaderProgramCache;

    constructor(
        private gl: WebGL2RenderingContext,
        private glTextures: GLTextures
    ) {
        super();

        this.shaderPrograms = new ShaderProgramCache(gl);
    }

    protected createInstance(material: Material) {
        let name: string = material.type;
        let shaders = materialShaders.get(name);
        const defines: ShaderDefines = {};

        if (!shaders) {
            if (material instanceof ShaderMaterial) {
                shaders = [material.vertex, material.fragment];
                name = Md5.init(material.vertex + material.fragment);
            } else {
                throw new Error(`Unknown material "${material.type}"`);
            }
        }

        if (material.params.uNormalTexture) {
            defines.USE_NORMALMAP = 1;
        }

        const program = this.shaderPrograms.getOrCreate(name, shaders[0], shaders[1], defines);

        const { params, textures } = this.getParamsForMaterial(material);

        return new GLMaterial(this.gl, program, params, textures, material.state);
    }

    protected updateInstance(material: Material, glMaterial: GLMaterial) {
        const { params, textures } = this.getParamsForMaterial(material);

        glMaterial.state = material.state;
        glMaterial.params = params;
        glMaterial.textures = textures;
    }

    protected destroyInstance(glMaterial: GLMaterial) {
        glMaterial.destroy();
    }

    private getParamsForMaterial(material: Material) {
        const params: UniformsData = {};
        const textures: UniformTextures = {};

        for (const key in material.params) {
            if (!material.params.hasOwnProperty(key)) { continue; }

            const element = material.params[key];

            if (!element) { continue; }

            if (element instanceof Texture) {
                textures[key] = this.glTextures.getOrCreate(element);
            } else {
                params[key] = element;
            }
        }

        return { params, textures };
    }
}
