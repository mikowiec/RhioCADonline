import { GLAttribute } from "./GLAttribute";

export class GLGeometry {
    public index: GLAttribute = null;
    public attributes = new Map<string, GLAttribute>();

    public destroy() {
        this.index = null;
        this.attributes = null;
    }
}
