import {
    Primitive as _Primitive,
    TypedArray as _TypedArray
} from "type-fest";

declare global {
    type Primitive = _Primitive;
    type TypedArray = _TypedArray;

    interface ConstructorType<InstanceType> {
        new(...args: any[]): InstanceType;
        prototype: InstanceType;
    }

    interface TypedArrayConstructor extends ConstructorType<TypedArray> {
        readonly BYTES_PER_ELEMENT: number;
    }
}
