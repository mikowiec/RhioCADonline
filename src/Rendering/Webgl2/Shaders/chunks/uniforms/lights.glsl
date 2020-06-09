const vec3 ambientColor = vec3(0.1, 0.1, 0.1);

// Directional lights
const   int  MAX_DIRECTIONAL_LIGHTS = 5;
uniform int  uNumDirectionalLights;
uniform vec3 uDirectionalLightColor     [MAX_DIRECTIONAL_LIGHTS];
uniform vec3 uDirectionalLightDirection [MAX_DIRECTIONAL_LIGHTS];
