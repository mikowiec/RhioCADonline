import { BasicType } from "../../Constants";

interface BaseTextureInfo {
    level: number;
    type: BasicType;
    format: number;
    internalFormat: number;
    border: number;
    generateMipmaps: boolean;
    wrapS: number;
    wrapT: number;
    minFilter: number;
    magFilter: number;
}

interface TextureImageInfo extends Partial<BaseTextureInfo> {
    image: ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
}

interface TextureDataInfo extends Partial<BaseTextureInfo> {
    data: TypedArray;
    width: number;
    height: number;
    srcOffset?: number;
}

export class GLTexture {
    public texture: WebGLTexture;

    constructor(private gl: WebGL2RenderingContext) {
        this.texture = this.gl.createTexture();
    }

    public setImage(imageInfo: TextureImageInfo) {
        this.bind();

        const info = this.withDefaultTextureInfo(imageInfo);

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            info.level,
            info.internalFormat,
            info.image.width,
            info.image.height,
            info.border,
            info.format,
            info.type,
            info.image
        );

        this.prepareTexture(info as BaseTextureInfo);

        this.unbind();
    }

    public setData(dataInfo: TextureDataInfo) {
        this.bind();

        const info = this.withDefaultTextureInfo(dataInfo, {
            srcOffset: 0
        });

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            info.level,
            info.internalFormat,
            info.width,
            info.height,
            info.border,
            info.format,
            info.type,
            info.data,
            info.srcOffset
        );

        this.prepareTexture(info as BaseTextureInfo);

        this.unbind();
    }

    public bind(textureUnit?: number) {
        if (textureUnit !== undefined) {
            this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    }

    public unbind() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    public destroy() {
        this.gl.deleteTexture(this.texture);
        this.texture = null;
    }

    private prepareTexture(info: BaseTextureInfo) {
        if (info.generateMipmaps) {
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, info.minFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, info.magFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, info.wrapS);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, info.wrapT);
    }

    private withDefaultTextureInfo<T extends Partial<BaseTextureInfo>>(info: T, otherDefaults: Partial<T> = {}): T {
        const generateMipmaps = info.generateMipmaps || true;
        const minFilter = (generateMipmaps) ? this.gl.NEAREST_MIPMAP_LINEAR : this.gl.LINEAR;
        const defaultBaseInfo: BaseTextureInfo = {
            level: 0,
            type: BasicType.UNSIGNED_BYTE,
            format: this.gl.RGBA,
            internalFormat: this.gl.RGBA,
            border: 0,
            generateMipmaps,
            minFilter,
            magFilter: this.gl.LINEAR,
            wrapS: this.gl.REPEAT,
            wrapT: this.gl.REPEAT
        };

        return Object.assign(defaultBaseInfo, otherDefaults, info);
    }
}
