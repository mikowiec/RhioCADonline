import { mat4 } from "gl-matrix";

import { Component } from "../Core";

export class Camera extends Component {
    protected _viewMatrix: mat4;
    protected _projectionMatrix: mat4;

    constructor() {
        super();

        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();
    }

    public get viewMatrix(): mat4 {
        return mat4.invert(this._viewMatrix, this.entity.worldMatrix);
    }

    public get projectionMatrix(): mat4 {
        return this._projectionMatrix;
    }
}
