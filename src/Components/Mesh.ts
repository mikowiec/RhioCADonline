import { DrawMode } from "../Constants";
import { Component, Geometry, Material } from "../Core";

export class Mesh extends Component {
    private _geometry: Geometry;
    private _material: Material;

    constructor(
        geometry: Geometry,
        material: Material,
        public drawMode: DrawMode = DrawMode.TRIANGLES
    ) {
        super();

        this.geometry = geometry;
        this.material = material;
    }

    public get geometry(): Geometry {
        return this._geometry;
    }

    public set geometry(value: Geometry) {
        this._geometry = value;
        this.needsUpdate = true;
    }

    public get material(): Material {
        return this._material;
    }

    public set material(value: Material) {
        this._material = value;
        this.needsUpdate = true;
    }
}
