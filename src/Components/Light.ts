import { Component, Color } from "../Core";
import { LightShadow } from "./LightShadow";

export interface LightInfo {
    castShadows?: boolean;
    color?: Color;
}

export abstract class Light extends Component {
    public castShadows: boolean;
    public color: Color;

    constructor(info: LightInfo) {
        super();

        this.castShadows = info.castShadows || false;
        this.color = info.color || [1, 1, 1];
    }

    public abstract get shadow(): LightShadow;
}
