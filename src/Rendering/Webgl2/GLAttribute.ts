import { BasicType, typedArrayToComponentType } from "../../Constants";

export class GLAttribute {
    public buffer: WebGLBuffer;
    public itemSize: number = 3;
    public normalized: boolean = false;
    public length: number = 0;
    public type: BasicType = BasicType.FLOAT;
    public dinamic: boolean = false;

    constructor(
        private gl: WebGL2RenderingContext,
        public bufferType: GLenum = gl.ARRAY_BUFFER
    ) {
        this.buffer = this.gl.createBuffer();
    }

    public bind() {
        this.gl.bindBuffer(this.bufferType, this.buffer);
    }

    public unbind() {
        this.gl.bindBuffer(this.bufferType, null);
    }

    public set data(value: TypedArray) {
        const usage = (this.dinamic) ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
        this.type = typedArrayToComponentType(value);
        this.gl.bindBuffer(this.bufferType, this.buffer);
        this.gl.bufferData(this.bufferType, value, usage);
        this.length = value.length;
    }

    public destroy() {
        this.gl.deleteBuffer(this.buffer);
        this.buffer = null;
    }
}
