const   int  MAX_SHADOW_CASTERS = 5;
uniform int  uNumShadowCasters;
uniform float     uShadowBias       [MAX_SHADOW_CASTERS];
uniform mat4      uShadowView       [MAX_SHADOW_CASTERS];
uniform mat4      uShadowProjection [MAX_SHADOW_CASTERS];
uniform sampler2D uShadowDepth      [MAX_SHADOW_CASTERS];
