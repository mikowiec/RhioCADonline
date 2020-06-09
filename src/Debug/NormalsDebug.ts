import { vec3 } from "gl-matrix";

import { Mesh } from "../Components";
import { DrawMode } from "../Constants";
import { Attribute, Geometry } from "../Core";
import { FlatMaterial } from "../Materials";

function getAttribute(mesh: Mesh, attributeName: string): Attribute {
    const attribute = mesh.geometry.getAttribute(attributeName);
    if (!attribute) {
        throw new Error(`Cannot create a debug view for normals: missing attribute "${attributeName}".`);
    }
    return attribute;
}

function simpleIndex(n: number) {
    return new Uint16Array(Array(n).fill(0).map((_, i) => i));
}

export function normalsDebug(originalMesh: Mesh, debugScale: number = 1): Mesh {
    const positions = getAttribute(originalMesh, "aPosition");
    const normals = getAttribute(originalMesh, "aNormal");

    const pointsPerLine = 2;
    const normalsDebugPosition = new Float32Array(normals.count * normals.itemSize * pointsPerLine);

    const startPoint = vec3.create();
    const normal = vec3.create();
    const endPoint = vec3.create();

    positions.forEach((position: Float32Array, i: number) => {
        vec3.copy(startPoint, position as vec3);
        vec3.copy(normal, normals.at(i) as vec3);

        vec3.normalize(normal, normal);
        vec3.scale(normal, normal, debugScale);
        vec3.add(endPoint, startPoint, normal);

        const startLineIndex = i * pointsPerLine * normals.itemSize;
        const endLineIndex = startLineIndex + normals.itemSize;

        normalsDebugPosition.set(startPoint, startLineIndex);
        normalsDebugPosition.set(endPoint, endLineIndex);
    });

    return new Mesh(
        new Geometry({
            index: new Attribute(simpleIndex(normals.count * pointsPerLine), pointsPerLine),
            aPosition: new Attribute(normalsDebugPosition, normals.itemSize)
        }),
        new FlatMaterial({ uColor: [1, 0, 0, 1] }),
        DrawMode.LINES
    );
}
