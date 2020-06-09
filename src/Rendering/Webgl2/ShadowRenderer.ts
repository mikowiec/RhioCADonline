import { Camera, Mesh } from "../../Components";
import { Entity } from "../../Core";
import { GLMaterial } from "./GLMaterial";
import { ShaderProgram } from "./ShaderProgram";
import { GLMeshes } from "./Synchronization";

import shadowFragment from "./Shaders/depth/fragment.glsl";
import shadowVertex from "./Shaders/depth/vertex.glsl";
import { GLTexture } from "./GLTexture";

export class ShadowRenderer {
    private _frameBuffer: WebGLFramebuffer;
    private _depthTexture: GLTexture;
    private shadowMaterial: GLMaterial;

    private _width: number = 1024;
    private _height: number = 1024;
    private dirty: boolean = true;

    constructor(
        private gl: WebGL2RenderingContext,
        private meshes: GLMeshes
    ) {
        this._frameBuffer = this.gl.createFramebuffer();
        this._depthTexture = new GLTexture(this.gl);

        const shadowShader = new ShaderProgram(gl, shadowVertex, shadowFragment);
        this.shadowMaterial = new GLMaterial(gl, shadowShader);

        this.updateDepthAttachment();
    }

    public get frameBuffer() {
        return this._frameBuffer;
    }

    public get depthTexture() {
        return this._depthTexture;
    }

    public get width() {
        return this._width;
    }

    public set width(value: number) {
        if (value === this._width) { return; }

        this.dirty = true;
        this._width = value;
    }

    public get height() {
        return this._height;
    }

    public set height(value: number) {
        if (value === this._height) { return; }

        this.dirty = true;
        this._height = value;
    }

    public render(scene: Entity, camera: Camera) {
        this.prepareState();

        this._depthTexture.bind(0);

        scene.forEach(entity =>
            entity.getComponents(Mesh).forEach(mesh => {
                const glMesh = this.meshes.getOrCreate(mesh);

                this.shadowMaterial.prepare({
                    uProjectionMatrix: camera.projectionMatrix,
                    uViewMatrix: camera.viewMatrix,
                    uModelMatrix: entity.worldMatrix
                });

                glMesh.draw();
            })
        );

        this._depthTexture.unbind();
    }

    private prepareState() {
        this.updateDepthAttachment();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._frameBuffer);
        this.gl.viewport(0, 0, this._width, this._height);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    }

    private updateDepthAttachment() {
        if (!this.dirty) { return; }

        this.dirty = false;

        this._depthTexture.setData({
            format: this.gl.DEPTH_COMPONENT,
            internalFormat: this.gl.DEPTH_COMPONENT24,
            type: this.gl.UNSIGNED_INT,
            data: new Uint32Array(this._width * this._height),
            width: this._width,
            height: this._height,
            generateMipmaps: false,
            wrapS: this.gl.CLAMP_TO_EDGE,
            wrapT: this.gl.CLAMP_TO_EDGE,
            minFilter: this.gl.NEAREST,
            magFilter: this.gl.NEAREST
        });

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._frameBuffer);
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.DEPTH_ATTACHMENT,
            this.gl.TEXTURE_2D,
            this._depthTexture.texture,
            0
        );
    }
}
