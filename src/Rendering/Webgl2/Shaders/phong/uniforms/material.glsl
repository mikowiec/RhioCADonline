uniform vec4      uDiffuse;
uniform vec4      uSpecular;
uniform float     uShininess;
uniform sampler2D uDiffuseTexture;
uniform sampler2D uEmissiveTexture;

#ifdef USE_NORMALMAP
uniform sampler2D uNormalTexture;
uniform float     uNormalScale;
#endif
