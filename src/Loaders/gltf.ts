import { quat, vec3 } from "gl-matrix";
import { GltfAsset, GltfLoader as InnerLoader } from "gltf-loader-ts";

import { Mesh } from "../Components";
import { componentTypeToTypedArrayConstructor } from "../Constants";
import { Attribute, Entity, Geometry, Texture, ImageTexture, Material } from "../Core";
import { PBRMaterial } from "../Materials";

export class GltfLoader {
    private loader: InnerLoader = new InnerLoader();

    public async load(uri: string): Promise<Entity> {
        const asset = await this.loader.load(uri);
        return new ResourceParser(asset).load();
    }
}

class ResourceParser {
    constructor(private asset: GltfAsset) {}

    public async load(): Promise<Entity> {
        return this.loadNode(0);
    }

    private get gltf() { return this.asset.gltf; }
    private material(index: number) { return this.gltf.materials[index]; }

    private async loadNode(index: number): Promise<Entity> {
        const nodeInfo = this.gltf.nodes[index];
        const entity = new Entity();

        if (nodeInfo.translation !== undefined) {
            const [x, y, z] = nodeInfo.translation;
            vec3.set(entity.position, x, y, z);
        }
        if (nodeInfo.rotation !== undefined) {
            const [x, y, z, w] = nodeInfo.rotation;
            quat.set(entity.rotation, x, y, z, w);
        }
        if (nodeInfo.scale !== undefined) {
            const [x, y, z] = nodeInfo.scale;
            vec3.set(entity.scale, x, y, z);
        }

        if (nodeInfo.mesh !== undefined) {
            const mesh = await this.loadMesh(nodeInfo.mesh);
            entity.addComponent(mesh);
        }

        if (nodeInfo.children !== undefined) {
            const childEntities = await Promise.all(nodeInfo.children.map(i => this.loadNode(i)));
            childEntities.forEach(child => entity.addChild(child));
        }

        return entity;
    }

    private async loadMesh(index: number): Promise<Mesh> {
        const meshInfo = this.gltf.meshes[index];

        const primitive = meshInfo.primitives[0];
        const material = await this.loadMaterial(primitive.material);

        const indicesBuffer = await this.createAttribute(primitive.indices);
        const positionsBuffer = await this.createAttribute(primitive.attributes.POSITION);
        const normalsBuffer = await this.createAttribute(primitive.attributes.NORMAL);
        const texcoordsBuffer = await this.createAttribute(primitive.attributes.TEXCOORD_0);

        const geometry = new Geometry({
            index: indicesBuffer,
            aPosition: positionsBuffer,
            aNormal: normalsBuffer,
            aTexcoord: texcoordsBuffer
        });

        return new Mesh(geometry, material);
    }

    private async loadMaterial(materialIndex: number): Promise<Material> {
        const materialInfo = this.material(materialIndex);

        const baseTextureInfo = materialInfo.pbrMetallicRoughness.baseColorTexture;
        const metallicRoughnessTextureInfo = materialInfo.pbrMetallicRoughness.metallicRoughnessTexture;
        const emissiveTextureInfo = materialInfo.emissiveTexture;
        const normalTextureInfo = materialInfo.normalTexture;

        const baseTexture = (baseTextureInfo) ? await this.createTexture(baseTextureInfo.index) : undefined;
        const metallicRoughnessTexture = (metallicRoughnessTextureInfo) ? await this.createTexture(metallicRoughnessTextureInfo.index) : undefined;
        const emissiveTexture = (emissiveTextureInfo) ? await this.createTexture(emissiveTextureInfo.index) : undefined;
        const normalTexture = (normalTextureInfo) ? await this.createTexture(normalTextureInfo.index) : undefined;

        return new PBRMaterial({
            uAlbedoTexture: baseTexture,
            uMetallicTexture: metallicRoughnessTexture,
            uRoughnessTexture: metallicRoughnessTexture,
            uEmissiveTexture: emissiveTexture,
            uNormalTexture: normalTexture
        });
    }

    private async createAttribute(accessorIndex: number): Promise<Attribute> {
        const dataPromise = this.bufferData(accessorIndex);
        const accesor = this.asset.gltf.accessors[accessorIndex];
        const itemSize = accesor.min.length || accesor.max.length;
        const normalized = accesor.normalized;

        return new Attribute(await dataPromise, itemSize, normalized);
    }

    private async bufferData(accessorIndex: number): Promise<TypedArray> {
        const dataPromise = this.asset.accessorData(accessorIndex);
        const accesor = this.asset.gltf.accessors[accessorIndex];
        const bufferView = this.asset.gltf.bufferViews[accesor.bufferView];
        const SelectedTypedArray = componentTypeToTypedArrayConstructor(accesor.componentType);
        const length = bufferView.byteLength / SelectedTypedArray.BYTES_PER_ELEMENT;

        return new SelectedTypedArray((await dataPromise).buffer, bufferView.byteOffset, length);
    }

    private async createTexture(accessorIndex: number): Promise<Texture> {
        const img = await this.asset.imageData.get(accessorIndex);
        return new ImageTexture(img);
    }
}
