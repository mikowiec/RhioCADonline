import { Camera } from "./Camera";
import { Light } from "./Light";

export interface LightShadowInfo {
    textureSize: number;
    bias: number;
}

export class LightShadow {
    public textureSize: number;
    public bias: number;
    private light: Light;
    private _camera: Camera;

    constructor(light: Light, camera: Camera, info: LightShadowInfo) {
        this.textureSize = info.textureSize;
        this.bias = info.bias;

        this.light = light;
        this._camera = camera;
    }

    public get camera() {
        this.light.entity.addComponent(this._camera);
        return this._camera;
    }
}
