import { vec3 } from "gl-matrix";

import { FORWARD } from "../Core";
import { Light, LightInfo } from "./Light";
import { LightShadow, LightShadowInfo } from "./LightShadow";
import { OrthographicCamera } from "./OrthographicCamera";

interface DirectionalLightInfo extends LightInfo {
    shadowInfo?: LightShadowInfo;
}

export class DirectionalLight extends Light {
    private _direction: vec3 = vec3.create();
    private _shadow: LightShadow;

    constructor(info: DirectionalLightInfo = {}) {
        super(info);

        this._shadow = new LightShadow(
            this,
            new OrthographicCamera(-4, 4, -4, 4, 1, 10),
            Object.assign({
                textureSize: 1024,
                bias: 0.02
            }, info.shadowInfo)
        );
    }

    public get shadow() {
        return this._shadow;
    }

    public get direction() {
        return vec3.transformMat3(
            this._direction,
            FORWARD,
            this.entity.normalMatrix
        );
    }
}
