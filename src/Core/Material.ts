import { CullingSide } from "../Constants";
import { Texture } from "./Texture";
import { UpdateableObject } from "./UpdateableObject";

export type MaterialParameter = number | Int32Array | Uint32Array | Float32Array | ArrayLike<number> | Texture;
export interface MaterialParameters {
    [param: string]: MaterialParameter;
}

export interface MaterialState {
    cullingSide?: CullingSide;
}

export abstract class Material extends UpdateableObject {
    public readonly type: string = this.constructor.name;
    private _state: MaterialState;
    private _params: MaterialParameters;

    constructor(
        params: MaterialParameters = {},
        state: MaterialState = {}
    ) {
        super();

        this.params = params;
        this.state = Object.assign({
            cullingSide: CullingSide.BACK
        }, state);
    }

    public get state(): MaterialState {
        return this._state;
    }

    public set state(value: MaterialState) {
        this._state = value;
        this.needsUpdate = true;
    }

    public get params(): MaterialParameters {
        return this._params;
    }

    public set params(value: MaterialParameters) {
        this._params = value;
        this.needsUpdate = true;
    }
}
