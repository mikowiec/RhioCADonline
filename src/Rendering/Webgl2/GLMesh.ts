import { DrawMode } from "../../Constants";
import { Material } from "../../Core";
import { GLGeometry } from "./GLGeometry";
import { GLMaterial } from "./GLMaterial";

export class GLMesh {
    public drawMode: DrawMode = DrawMode.TRIANGLES;

    private vaoNeedsUpdate: boolean = true;
    private vao: WebGLVertexArrayObject = null;
    private _geometry: GLGeometry = null;
    private _material: GLMaterial = null;

    constructor(private gl: WebGL2RenderingContext) { }

    public get geometry() {
        return this._geometry;
    }
    public set geometry(value: GLGeometry) {
        this._geometry = value;
        this.vaoNeedsUpdate = true;
    }

    public get material() {
        return this._material;
    }
    public set material(value: GLMaterial) {
        this._material = value;
        this.vaoNeedsUpdate = true;
    }

    public draw() {
        this.updateVao();
        this.gl.bindVertexArray(this.vao);

        this.gl.drawElements(
            this.drawMode,
            this.geometry.index.length,
            this.geometry.index.type,
            0
        );

        this.gl.bindVertexArray(null);
    }

    public destroy() {
        if (this.vao) {
            this.gl.deleteVertexArray(this.vao);
        }
        this.vao = null;
    }

    private updateVao() {
        if (!this.vaoNeedsUpdate) { return; }
        this.vaoNeedsUpdate = false;

        this.destroy();
        this.vao = this.gl.createVertexArray();

        this.gl.bindVertexArray(this.vao);

        this.geometry.attributes.forEach((glAttribute, attributeName) => {
            this.material.program.setAttribute(attributeName, glAttribute);
        });

        this.geometry.index.bind();

        this.gl.bindVertexArray(null);
    }
}
