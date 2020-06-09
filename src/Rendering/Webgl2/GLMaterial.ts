import { MaterialState } from "../../Core/Material";
import { GLTexture } from "./GLTexture";
import { ShaderProgram } from "./ShaderProgram";
import { UniformData } from "./UniformSetterMappings";

export interface UniformsData    { [name: string]: UniformData; }
export interface UniformTextures { [name: string]: GLTexture  ; }

export class GLMaterial {
    constructor(
        protected gl: WebGL2RenderingContext,
        public program: ShaderProgram = null,
        public params: UniformsData = {},
        public textures: UniformTextures = {},
        public state: MaterialState = {}
    ) {}

    public prepare(uniformsData: UniformsData = {}) {
        this.program.useProgram();

        this.setupRenderingState();
        this.setUniforms(uniformsData);
        this.setUniforms(this.params);
        this.setTextures();
    }

    public destroy() {
        this.program = null;
    }

    private setupRenderingState() {
        if (this.state.cullingSide) {
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.state.cullingSide);
        } else {
            this.gl.disable(this.gl.CULL_FACE);
        }
    }

    private setUniforms(uniformsData: UniformsData) {
        for (const uniformName in uniformsData) {
            if (!uniformsData.hasOwnProperty(uniformName)) { continue; }

            const data = uniformsData[uniformName];
            this.program.setUniform(uniformName, data);
        }
    }

    private setTextures() {
        let count = 0;
        for (const key in this.textures) {
            if (!this.textures.hasOwnProperty(key)) { continue; }

            const texture = this.textures[key];

            texture.bind(count);
            this.program.setUniform(key, count);

            count++;
        }
    }
}
