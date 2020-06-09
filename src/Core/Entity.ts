import { mat3, mat4, quat, vec3 } from "gl-matrix";
import { UP } from "./directions";
import { Component, ComponentConstructor } from "./Component";

export class Entity {
    public position: vec3 = vec3.create();
    public rotation: quat = quat.create();
    public scale: vec3 = vec3.create();

    protected _parent: Entity | null = null;
    protected _children: Entity[] = [];
    protected _components: Component[] = [];

    protected _localMatrix: mat4 = mat4.create();
    protected _worldMatrix: mat4 = mat4.create();
    protected _normalMatrix: mat3 = mat3.create();

    constructor() {
        quat.identity(this.rotation);
        vec3.set(this.position, 0, 0, 0);
        vec3.set(this.scale, 1, 1, 1);
    }

    public lookAt(point: vec3) {
        mat4.targetTo(this._localMatrix, this.position, point, UP);
        mat4.getRotation(this.rotation, this._localMatrix);
    }

    public get localMatrix(): mat4 {
        return mat4.fromRotationTranslationScale(
            this._localMatrix,
            this.rotation,
            this.position,
            this.scale
        );
    }

    public get worldMatrix(): mat4 {
        mat4.copy(this._worldMatrix, this.localMatrix);

        if (this._parent) {
            mat4.multiply(this._worldMatrix,
                this._parent.worldMatrix,
                this._worldMatrix);
        }

        return this._worldMatrix;
    }

    public get normalMatrix(): mat3 {
        return mat3.normalFromMat4(this._normalMatrix, this.worldMatrix);
    }

    public addComponent(component: Component) {
        if (component.entity) {
            component.entity.removeComponent(component);
        }

        this._components.push(component);
        component.entity = this;
    }

    public removeComponent(component: Component) {
        const componentIndex = this._components.indexOf(component);

        if (componentIndex >= 0) {
            component.entity = null;
            this._components.splice(componentIndex, 1);
        }
    }

    public getComponents<DerivedComponent extends Component>(
        componentType: ComponentConstructor<DerivedComponent>
    ): DerivedComponent[] {
        return this._components.filter(c => c instanceof componentType) as DerivedComponent[];
    }

    public getComponent<DerivedComponent extends Component>(
        componentType: ComponentConstructor<DerivedComponent>
    ): DerivedComponent {
        return this._components.find(c => c instanceof componentType) as DerivedComponent;
    }

    public getComponentsOfType<DerivedComponent extends Component>(
        componentType: ComponentConstructor<DerivedComponent>
    ): DerivedComponent[] {
        return this._components.filter(c => c.type === componentType.name) as DerivedComponent[];
    }

    public getComponentOfType<DerivedComponent extends Component>(
        componentType: ComponentConstructor<DerivedComponent>
    ): DerivedComponent {
        return this._components.find(c => c.type === componentType.name) as DerivedComponent;
    }

    public addChild(entity: Entity) {
        const currentParent = entity._parent;

        if (currentParent) {
            currentParent.removeChild(entity);
        }

        entity._parent = this;
        this._children.push(entity);
    }

    public removeChild(entity: Entity) {
        const index = this._children.findIndex((child) => child === entity);

        if (index >= 0) {
            entity._parent = null;
            this._children.splice(index, 1);
        }
    }

    public forEach(callback: (entity: Entity) => void) {
        const queue: Entity[] = [this];
        while (queue.length > 0) {
            const entity = queue.pop();

            callback(entity);

            queue.push(...entity._children);
        }
    }

    public filter(callback: (entity: Entity) => boolean): Entity[] {
        const result: Entity[] = [];

        this.forEach((entity) => {
            if (callback(entity)) {
                result.push(entity);
            }
        });

        return result;

    }

    public map<T>(callback: (entity: Entity) => T): T[] {
        const result: T[] = [];

        this.forEach((entity) => {
            result.push(callback(entity));
        });

        return result;
    }

    public flatMap<T>(callback: (entity: Entity) => ReadonlyArray<T>): T[] {
        const result: T[] = [];

        this.forEach((entity) => {
            const intermediateResult = callback(entity);

            result.push(...intermediateResult);
        });

        return result;
    }
}
