import { Texture } from "../../../Core";
import { GLTexture } from "../GLTexture";
import { SyncedMap } from "./SyncedMap";

export class GLTextures extends SyncedMap<Texture, GLTexture> {
    constructor(private gl: WebGL2RenderingContext) {
        super();
    }

    protected createInstance(): GLTexture {
        return new GLTexture(this.gl);
    }

    protected updateInstance(texture: Texture, glTexture: GLTexture) {
        if (texture.image) {
            glTexture.setImage({
                image: texture.image
            });
        } else {
            glTexture.setData({
                data: texture.data,
                width: texture.width,
                height: texture.height
            });
        }
    }

    protected destroyInstance(glTexture: GLTexture) {
        glTexture.destroy();
    }
}
