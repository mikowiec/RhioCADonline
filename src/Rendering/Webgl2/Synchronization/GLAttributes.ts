import { Attribute } from "../../../Core";
import { GLAttribute } from "../GLAttribute";
import { SyncedMap } from "./SyncedMap";

export class GLAttributes extends SyncedMap<Attribute, GLAttribute> {
    constructor(private gl: WebGL2RenderingContext) {
        super();
    }

    protected createInstance(
        attribute: Attribute,
        bufferType: GLenum = this.gl.ARRAY_BUFFER
    ): GLAttribute {
        return new GLAttribute(this.gl, bufferType);
    }

    protected updateInstance(attribute: Attribute, glAttribute: GLAttribute) {
        glAttribute.dinamic = attribute.dynamic;
        glAttribute.data = attribute.data;
        glAttribute.itemSize = attribute.itemSize;
        glAttribute.normalized = attribute.normalized;
    }

    protected destroyInstance(glAttribute: GLAttribute) {
        glAttribute.destroy();
    }
}
