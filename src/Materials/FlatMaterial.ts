import { Material, MaterialState, RGBAColor } from "../Core";

export interface FlatMaterialParameters {
    uColor?: RGBAColor;
}

export class FlatMaterial extends Material {
    constructor(params: FlatMaterialParameters = {}, state: MaterialState = {}) {
        super({
            uColor: [1, 0, 1, 1],
            ...params
        }, state);
    }
}
