uniform sampler2D uAlbedoTexture;
uniform sampler2D uMetallicTexture;
uniform sampler2D uRoughnessTexture;
uniform sampler2D uEmissiveTexture;

#ifdef USE_NORMALMAP
uniform sampler2D uNormalTexture;
uniform float     uNormalScale;
#endif
