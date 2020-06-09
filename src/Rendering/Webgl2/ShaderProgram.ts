import { GLAttribute } from "./GLAttribute";
import { UniformData, uniformSetterMappings } from "./UniformSetterMappings";

interface ShaderAtrributes {
    [name: string]: number;
}

interface ShaderUniforms {
    [name: string]: (
        data: UniformData,
        srcOffset?: number,
        srcLength?: number
    ) => void;
}

export class ShaderProgram {
    private vertexShader: WebGLShader;
    private fragmentShader: WebGLShader;
    private program: WebGLProgram;
    private attributes: ShaderAtrributes;
    private uniforms: ShaderUniforms;

    constructor(
        private gl: WebGL2RenderingContext,
        vertexSource: string,
        fragmentSource: string) {

        this.createProgram(vertexSource, fragmentSource);
    }

    public setAttribute(attributeName: string, attribute: GLAttribute) {
        const location = this.attributes[attributeName];

        if (location === undefined) {
            return;
        }

        attribute.bind();
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location,
            attribute.itemSize,
            attribute.type,
            attribute.normalized,
            0, 0
        );
        attribute.unbind();
    }

    public setUniform(uniformName: string, data: UniformData,
                      srcOffset?: number, srcLength?: number) {
        const setter = this.uniforms[uniformName];

        if (setter === undefined) {
            return;
        }

        setter(data, srcOffset, srcLength);
    }

    public useProgram() {
        this.gl.useProgram(this.program);
    }

    private createProgram(vertexSource: string, fragmentSource: string) {
        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            const errorInfo = this.gl.getProgramInfoLog(this.program);
            this.gl.deleteProgram(this.program);
            throw new Error(`Unable to initialize the shader program: ${errorInfo}`);
        }

        this.setupAttributes();
        this.setupUniforms();
    }

    private createShader(type: number, source: string) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const errorInfo = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`An error occurred compiling the shaders: ${errorInfo}`);
        }

        return shader;
    }

    private setupAttributes() {
        this.attributes = {};

        const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < numAttribs; i++) {
            const info = this.gl.getActiveAttrib(this.program, i);
            this.attributes[info.name] = this.gl.getAttribLocation(this.program, info.name);
        }
    }

    private setupUniforms() {
        this.uniforms = {};

        const mappings = uniformSetterMappings(this.gl);

        const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < numUniforms; i++) {
            const info = this.gl.getActiveUniform(this.program, i);
            const location = this.gl.getUniformLocation(this.program, info.name);
            const cannonicalName = info.name.replace(/\[\d+\]$/, "");
            const glMapping = mappings.get(info.type);
            if (!glMapping) {
                throw new Error(`No glMappings for "${cannonicalName}" { type: ${info.type}, size: 1 }`);
            }
            this.uniforms[cannonicalName] = (data: UniformData, srcOffset?: number, srcLength?: number) => {
                glMapping(location, data, srcOffset, srcLength);
            };
        }
    }
}
