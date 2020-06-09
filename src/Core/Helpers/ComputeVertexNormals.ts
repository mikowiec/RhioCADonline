import { vec3 } from "gl-matrix";

import { Attribute } from "../Attribute";

export function ComputeVertexNormals(index: Attribute, positions: Attribute): Attribute {
    const normals = Array(positions.count).fill(0).map(() => vec3.create());
    const normalsTypedArray = new Float32Array(positions.data.length);

    const a = vec3.create();
    const b = vec3.create();
    const c = vec3.create();

    index.forEach(([aIndex, bIndex, cIndex]: TypedArray, i) => {
        const aI = Number(aIndex);
        const bI = Number(bIndex);
        const cI = Number(cIndex);

        vec3.copy(a, positions.at(aI) as vec3);
        vec3.copy(b, positions.at(bI) as vec3);
        vec3.copy(c, positions.at(cI) as vec3);

        const faceNormal = ComputeTriangleNormal(a, b, c);

        vec3.add(normals[aI], normals[aI], faceNormal);
        vec3.add(normals[bI], normals[bI], faceNormal);
        vec3.add(normals[cI], normals[cI], faceNormal);
    }, 3);

    normals.forEach((vertexNormal, i) => {
        vec3.normalize(vertexNormal, vertexNormal);
        normalsTypedArray.set(vertexNormal, i * 3);
    });

    return new Attribute(normalsTypedArray, 3, true);
}

function ComputeTriangleNormal(a: vec3, b: vec3, c: vec3): vec3 {
    const ba = vec3.create();
    const ca = vec3.create();
    const faceNormal = vec3.create();
    const faceNormalized = vec3.create();

    vec3.sub(ba, b, a);
    vec3.sub(ca, c, a);
    vec3.cross(faceNormal, ba, ca);
    vec3.normalize(faceNormalized, faceNormal);

    return faceNormalized;
}
