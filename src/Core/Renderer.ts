import { PerspectiveCamera } from "../Components";
import { Entity } from "./Entity";

export abstract class Renderer {
    constructor(protected canvas: HTMLCanvasElement) {}

    public abstract render(entities: Entity, camera: PerspectiveCamera): void;
}
