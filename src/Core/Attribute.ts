import { UpdateableObject } from "./UpdateableObject";

export class Attribute extends UpdateableObject {
    protected _count: number;
    protected _data: TypedArray;

    public constructor(
        bufferData: TypedArray,
        public readonly itemSize: number,
        public readonly normalized = false,
        public readonly dynamic = false) {
        super();

        this.data = bufferData;
    }

    public get count(): number {
        return this._count;
    }

    public get data(): TypedArray {
        return this._data;
    }

    public set data(value: TypedArray) {
        this._count = value.length / this.itemSize;
        this._data = value;
        this.needsUpdate = true;
    }

    public at(index: number, chunkSize = this.itemSize): TypedArray {
        return this._data.subarray(index * chunkSize, (index + 1) * chunkSize);
    }

    public forEach(callbackFn: (value: TypedArray, index?: number) => void, chunkSize = this.itemSize) {
        for (let i = 0; (i * chunkSize) < this._data.length; i++) {
            callbackFn(this.at(i, chunkSize), i);
        }
    }
}
