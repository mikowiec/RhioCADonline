import { Camera, DirectionalLight, Mesh, Light } from "../../Components";
import { Entity, Renderer } from "../../Core";
import { GLAttributes, GLGeometries, GLMaterials, GLMeshes, GLTextures } from "./Synchronization";
import { ShadowRenderer } from "./ShadowRenderer";

const MAX_DIRECTIONAL_LIGHTS = 5;
const MAX_SHADOW_CASTERS = 1;

export class WebGL2Renderer extends Renderer {
    private gl: WebGL2RenderingContext;
    private attributes: GLAttributes;
    private geometries: GLGeometries;
    private materials: GLMaterials;
    private meshes: GLMeshes;
    private textures: GLTextures;

    private numDirectionalLights: number;
    private directionalLightsColor = new Float32Array(MAX_DIRECTIONAL_LIGHTS * 3);
    private directionalLightsDirection = new Float32Array(MAX_DIRECTIONAL_LIGHTS * 3);

    private numShadowCasters: number;
    private shadowBias = new Float32Array(MAX_SHADOW_CASTERS);
    private shadowViews = new Float32Array(MAX_SHADOW_CASTERS * 16);
    private shadowProjections = new Float32Array(MAX_SHADOW_CASTERS * 16);
    private shadowRenderers: ShadowRenderer[];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.gl = canvas.getContext("webgl2");

        this.attributes = new GLAttributes(this.gl);
        this.geometries = new GLGeometries(this.gl, this.attributes);

        this.textures = new GLTextures(this.gl);
        this.materials = new GLMaterials(this.gl, this.textures);

        this.meshes = new GLMeshes(this.gl, this.geometries, this.materials);

        this.shadowRenderers = Array(MAX_SHADOW_CASTERS).fill(0).map(() =>
            new ShadowRenderer(this.gl, this.meshes)
        );
    }

    public render(scene: Entity, camera: Camera) {
        this.prepareLights(scene);
        this.prepareState();

        const projectioMatrix = camera.projectionMatrix;
        const viewMatrix = camera.viewMatrix;
        const inverseViewMatrix = camera.entity.worldMatrix;

        scene.forEach(entity =>
            entity.getComponents(Mesh).forEach(mesh => {
                const glMesh = this.meshes.getOrCreate(mesh);
                const material = glMesh.material;

                const materialTextureCount = Object.keys(material.textures).length;
                const shadowTextureIndices = this.shadowRenderers
                    .slice(0, this.numShadowCasters)
                    .map((shadowRenderer, i) => {
                        const activeTexture = i + materialTextureCount;
                        shadowRenderer.depthTexture.bind(activeTexture);
                        return activeTexture;
                    });

                material.prepare({
                    // Basic matrix
                    uModelMatrix: entity.worldMatrix,
                    uViewMatrix: viewMatrix,
                    uProjectionMatrix: projectioMatrix,
                    uNormalMatrix: entity.normalMatrix,
                    uInverseViewMatrix: inverseViewMatrix,
                    // Lights
                    uNumDirectionalLights: this.numDirectionalLights,
                    uDirectionalLightColor: this.directionalLightsColor,
                    uDirectionalLightDirection: this.directionalLightsDirection,
                    // Shadows
                    uNumShadowCasters: this.numShadowCasters,
                    uShadowBias: this.shadowBias,
                    uShadowView: this.shadowViews,
                    uShadowProjection: this.shadowProjections,
                    uShadowDepth: shadowTextureIndices
                });

                glMesh.draw();
            })
        );
    }

    private prepareLights(scene: Entity) {
        const castersFirst = (a: Light, b: Light) => (a.castShadows === b.castShadows) ? 0 : a.castShadows ? -1 : 1;

        const directionalLights = scene
            .flatMap(entity => entity.getComponents(DirectionalLight))
            .sort(castersFirst)
            .slice(0, MAX_DIRECTIONAL_LIGHTS);

        const shadowCasters = directionalLights
            .filter(light => light.castShadows)
            .map(light => light.shadow)
            .slice(0, MAX_SHADOW_CASTERS);

        this.numDirectionalLights = directionalLights.length;
        this.numShadowCasters = shadowCasters.length;

        directionalLights.forEach((light, i) => {
            const offset = i * 3;
            this.directionalLightsDirection.set(light.direction, offset);
            this.directionalLightsColor.set(light.color, offset);
        });

        shadowCasters.forEach((shadow, i) => {
            this.shadowBias[i] = shadow.bias;

            const offset = i * 16;
            this.shadowViews.set(shadow.camera.viewMatrix, offset);
            this.shadowProjections.set(shadow.camera.projectionMatrix, offset);

            this.shadowRenderers[i].width = shadow.textureSize;
            this.shadowRenderers[i].height = shadow.textureSize;
            this.shadowRenderers[i].render(scene, shadow.camera);
        });
    }

    private prepareState() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.enable(this.gl.DEPTH_TEST);                                 // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);                                  // Near things obscure far things

        this.gl.enable(this.gl.BLEND);                                      // Enable blending
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);  // Blending func

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                             // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                                            // Clear everything
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
