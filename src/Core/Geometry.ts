import { Attribute } from "./Attribute";
import { ComputeVertexNormals } from "./Helpers/ComputeVertexNormals";
import { UpdateableObject } from "./UpdateableObject";

interface Attributes {
    [attributeName: string]: Attribute;
}

export class Geometry extends UpdateableObject {
    private _index: Attribute;
    private _attributes = new Map<string, Attribute>();

    constructor(attributes: Attributes = {}) {
        super();

        Object.keys(attributes).forEach(name => {
            this.addAttribute(name, attributes[name]);
        });
    }

    public get index(): Attribute {
        return this._index;
    }

    public get attributes(): Map<string, Attribute> {
        return this._attributes;
    }

    public addAttribute(name: string, attribute: Attribute) {
        if (name === "index") {
            this._index = attribute;
        } else {
            this._attributes.set(name, attribute);
        }

        this.needsUpdate = true;
    }

    public removeAttribute(name: string) {
        this._attributes.delete(name);

        this.needsUpdate = true;
    }

    public getAttribute(name: string): Attribute {
        return this._attributes.get(name);
    }

    public calculateNormals() {
        const faces = this._index;
        const positions = this._attributes.get("aPosition");
        const normals = ComputeVertexNormals(faces, positions);

        this._attributes.set("aNormal", normals);
    }
}
