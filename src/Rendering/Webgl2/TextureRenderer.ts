import { GLAttribute } from "./GLAttribute";
import { GLGeometry } from "./GLGeometry";
import { GLMaterial } from "./GLMaterial";
import { GLMesh } from "./GLMesh";
import { GLTexture } from "./GLTexture";
import { ShaderProgram } from "./ShaderProgram";

import vertex from "./Shaders/rendershadow/vertex.glsl";
import fragment from "./Shaders/rendershadow/fragment.glsl";

export class TextureRenderer {
    private quad: GLMesh;

    constructor(private gl: WebGL2RenderingContext) {
        this.quad = new GLMesh(this.gl);
        this.quad.geometry = this.createQuadGeometry();
        this.quad.material = new GLMaterial(this.gl, new ShaderProgram(this.gl, vertex, fragment));
    }

    public render(texture: GLTexture) {
        this.prepareState();

        const textureUnit = 0;

        texture.bind(textureUnit);
        this.quad.material.prepare({ uTexture: textureUnit });

        this.quad.draw();
    }

    private prepareState() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        const { width, height } = this.gl.canvas;

        this.gl.viewport(width * 0.75, 0, width * 0.25, height * 0.25);
    }

    private createQuadGeometry(): GLGeometry {
        const index = new GLAttribute(this.gl, this.gl.ELEMENT_ARRAY_BUFFER);
        index.data = new Uint16Array([0, 2, 1, 1, 3, 2]);

        const devicePosition = new GLAttribute(this.gl, this.gl.ARRAY_BUFFER);
        devicePosition.data = new Float32Array([
            -1, -1,
            -1,  1,
             1, -1,
             1,  1
        ]);
        devicePosition.itemSize = 2;

        const quadGeometry = new GLGeometry();
        quadGeometry.index = index;
        quadGeometry.attributes.set("aDevicePosition", devicePosition);

        return quadGeometry;
    }
}
