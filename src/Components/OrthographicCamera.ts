import { mat4 } from "gl-matrix";

import { Camera } from "./Camera";

export class OrthographicCamera extends Camera {
    constructor(
        public left: number,
        public right: number,
        public bottom: number,
        public top: number,
        public near: number,
        public far: number
    ) {
        super();
    }

    public get projectionMatrix(): mat4 {
        return mat4.ortho(
            this._projectionMatrix,
            this.left,
            this.right,
            this.bottom,
            this.top,
            this.near,
            this.far
        );
    }

    public set width(value: number) {
        this.left = -value / 2;
        this.right = value / 2;
    }

    public set height(value: number) {
        this.top = value / 2;
        this.bottom = -value / 2;
    }

    public set size(value: number) {
        this.width = value;
        this.height = value;
    }
}
