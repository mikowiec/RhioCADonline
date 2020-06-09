import { Material, MaterialParameters, MaterialState } from "../Core";

export class ShaderMaterial extends Material {
    private _vertex: string;
    private _fragment: string;

    constructor(
        vertex: string,
        fragment: string,
        params: MaterialParameters = {},
        state: MaterialState = {}
    ) {
        super(params, state);

        this._vertex = vertex;
        this._fragment = fragment;

        this.needsUpdate = true;
    }

    public get vertex(): string {
        return this._vertex;
    }

    public get fragment(): string {
        return this._fragment;
    }
}
