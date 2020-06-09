import { RGBAColor } from "./Color";
import { UpdateableObject } from "./UpdateableObject";

export abstract class Texture extends UpdateableObject {
    public get data(): TypedArray { return undefined; }
    public get image(): HTMLImageElement { return undefined; }

    public abstract get width(): number;
    public abstract get height(): number;
}

export class ImageTexture extends Texture {
    private _image: HTMLImageElement;

    constructor(image: HTMLImageElement) {
        super();

        this.image = image;
    }

    public get image(): HTMLImageElement {
        return this._image;
    }

    public set image(original: HTMLImageElement) {
        this._image = original;
        this.needsUpdate = true;
    }

    public get width(): number {
        return this._image.width;
    }

    public get height(): number {
        return this._image.height;
    }
}

export class DataTexture extends Texture {
    public static pixelBytes(color: RGBAColor) {
        return new DataTexture(new Uint8Array(color));
    }

    private _data: TypedArray;

    constructor(
        data: TypedArray,
        public width = 1,
        public height = 1
    ) {
        super();

        this.data = data;
    }

    public get data() {
        return this._data;
    }

    public set data(value: TypedArray) {
        this._data = value;
        this.needsUpdate = true;
    }
}
