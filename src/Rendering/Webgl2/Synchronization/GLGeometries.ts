import { Geometry } from "../../../Core";
import { GLAttribute } from "../GLAttribute";
import { GLGeometry } from "../GLGeometry";
import { GLAttributes } from "./GLAttributes";
import { SyncedMap } from "./SyncedMap";

export class GLGeometries extends SyncedMap<Geometry, GLGeometry> {
    constructor(private gl: WebGL2RenderingContext, private glAttributes: GLAttributes) {
        super();
    }

    protected createInstance() {
        return new GLGeometry();
    }

    protected updateInstance(geometry: Geometry, glGeometry: GLGeometry) {
        glGeometry.index = this.glAttributes.getOrCreate(geometry.index, this.gl.ELEMENT_ARRAY_BUFFER);

        glGeometry.attributes = new Map<string, GLAttribute>();

        geometry.attributes.forEach((attribute, attributeName) => {
            const glAttribute = this.glAttributes.getOrCreate(attribute, this.gl.ARRAY_BUFFER);
            glGeometry.attributes.set(attributeName, glAttribute);
        });
    }

    protected destroyInstance(glGeometry: GLGeometry) {
        glGeometry.destroy();
    }
}
