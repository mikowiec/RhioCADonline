import { Entity } from "./Entity";
import { UpdateableObject } from "./UpdateableObject";

export type ComponentConstructor<DerivedComponent extends Component> = new (...args: any[]) => DerivedComponent;

export class Component extends UpdateableObject {
    public readonly type: string = this.constructor.name;
    public entity: Entity = null;
}
