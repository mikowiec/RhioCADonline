import { Material, MaterialState, Texture, DataTexture } from "../Core";

export interface PBRMaterialParameters {
    uAlbedoTexture?: Texture;
    uMetallicTexture?: Texture;
    uRoughnessTexture?: Texture;
    uEmissiveTexture?: Texture;
    uNormalTexture?: Texture;
    uNormalScale?: number;
}

export class PBRMaterial extends Material {
    constructor(params: PBRMaterialParameters = {}, state: MaterialState = {}) {
        super({
            uAlbedoTexture: DataTexture.pixelBytes([255, 255, 255, 255]),
            uMetallicTexture: DataTexture.pixelBytes([0, 0, 0, 255]),
            uRoughnessTexture: DataTexture.pixelBytes([255, 255, 255, 255]),
            uEmissiveTexture: DataTexture.pixelBytes([0, 0, 0, 255]),
            uNormalScale: 1,
            ...params
        }, state);
    }
}
