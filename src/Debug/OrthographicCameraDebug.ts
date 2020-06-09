import { Mesh } from "../Components/Mesh";
import { OrthographicCamera } from "../Components/OrthographicCamera";
import { DrawMode } from "../Constants";
import { Attribute, Geometry } from "../Core";
import { FlatMaterial } from "../Materials";

export function orthographicCameraDebug(camera: OrthographicCamera): Mesh {
    const points = new Float32Array(9 * 3);
    const { left, right, bottom, top, near, far } = camera;

    points.set([left , bottom, -near], 0 * 3);
    points.set([left , top   , -near], 1 * 3);
    points.set([right, bottom, -near], 2 * 3);
    points.set([right, top   , -near], 3 * 3);
    points.set([left , bottom, -far ], 4 * 3);
    points.set([left , top   , -far ], 5 * 3);
    points.set([right, bottom, -far ], 6 * 3);
    points.set([right, top   , -far ], 7 * 3);
    points.set([0    , 0     , 0    ], 8 * 3);

    const indices = new Uint16Array([
        0, 1, // near quad
        0, 2,
        3, 1,
        3, 2,
        0, 4, // connection to far quad
        1, 5,
        2, 6,
        3, 7,
        4, 5, // far quad
        4, 6,
        7, 5,
        7, 6,
        8, 0, // near pyramid
        8, 1,
        8, 2,
        8, 3
    ]);

    return new Mesh(
        new Geometry({
            index: new Attribute(indices, 2),
            aPosition: new Attribute(points, 3)
        }),
        new FlatMaterial({ uColor: [1, 0, 0, 1] }),
        DrawMode.LINES
    );
}
