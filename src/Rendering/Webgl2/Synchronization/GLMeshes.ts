import { Mesh } from "../../../Components";
import { GLMesh } from "../GLMesh";
import { GLGeometries } from "./GLGeometries";
import { GLMaterials } from "./GLMaterials";
import { SyncedMap } from "./SyncedMap";

export class GLMeshes extends SyncedMap<Mesh, GLMesh> {
    constructor(
        private gl: WebGL2RenderingContext,
        private geometries: GLGeometries,
        private materials: GLMaterials
    ) {
        super();
    }

    protected createInstance() {
        return new GLMesh(this.gl);
    }

    protected updateInstance(mesh: Mesh, glMesh: GLMesh) {
        glMesh.geometry = this.geometries.getOrCreate(mesh.geometry);
        glMesh.material = this.materials.getOrCreate(mesh.material);
        glMesh.drawMode = mesh.drawMode;
    }

    protected destroyInstance(glMesh: GLMesh) {
        glMesh.destroy();
    }
}
