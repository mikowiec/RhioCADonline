import { Attribute } from "../Core/Attribute";
import { Geometry } from "../Core/Geometry";

import flatCubeData from "./data/flatCube";
import planeData from "./data/plane";
import smoothCubeData from "./data/smoothCube";

interface GeometryData {
    index: number[];
    vertex: number[];
    normals?: number[];
}

export class GeometryBuilder {
    public static createGeometry(data: GeometryData) {
        const aPosition = new Attribute(new Float32Array(data.vertex), 3);
        const index = new Attribute(new Uint32Array(data.index), 3);

        const geometry = new Geometry({ aPosition, index });

        if (data.normals) {
            const aNormal = new Attribute(new Float32Array(data.normals), 3);
            geometry.addAttribute("aNormal", aNormal);
        } else {
            geometry.calculateNormals();
        }

        return geometry;
    }

    public static createPlane(size: number) {
        return GeometryBuilder.createGeometry(planeData(size));
    }

    public static createFlatCube(size: number) {
        return GeometryBuilder.createGeometry(flatCubeData(size));
    }

    public static createSmoothCube(size: number) {
        return GeometryBuilder.createGeometry(smoothCubeData(size));
    }
}
