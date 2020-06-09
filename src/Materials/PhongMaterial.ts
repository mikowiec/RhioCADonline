import { Material, MaterialState, RGBAColor, Texture, DataTexture } from "../Core";

export interface PhongMaterialParameters {
    uDiffuse?: RGBAColor;
    uSpecular?: RGBAColor;
    uShininess?: number;
    uDiffuseTexture?: Texture;
    uEmissiveTexture?: Texture;
    uNormalTexture?: Texture;
    uNormalScale?: number;
}

export class PhongMaterial extends Material {
    constructor(params: PhongMaterialParameters = {}, state: MaterialState = {}) {
        super({
            uDiffuse: [1, 1, 1, 1],
            uSpecular: [1, 1, 1, 1],
            uShininess: 50,
            uDiffuseTexture: DataTexture.pixelBytes([255, 255, 255, 255]),
            uEmissiveTexture: DataTexture.pixelBytes([0, 0, 0, 255]),
            uNormalScale: 1,
            ...params
        }, state);
    }
}
