import { mat4 } from "gl-matrix";
import { Camera } from "./Camera";

export class PerspectiveCamera extends Camera {
    constructor(
        public fovy: number,
        public aspect: number,
        public near: number,
        public far: number
    ) {
        super();
    }

    public get projectionMatrix(): mat4 {
        return mat4.perspective(
            this._projectionMatrix,
            this.fovy,
            this.aspect,
            this.near,
            this.far
        );
    }
}
