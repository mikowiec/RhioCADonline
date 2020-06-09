#version 300 es

precision highp float;

#pragma glslify: import("../chunks/uniforms/common.glsl")

in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexcoord;

out vec3 vPosition;
out vec3 vEye;
out vec3 vNormal;
out vec2 vTexcoord;

void main() {
    vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
    vPosition = worldPosition.xyz;
    vNormal = uNormalMatrix * aNormal;
    vTexcoord = aTexcoord;
    vEye = -vec3(uInverseViewMatrix * vec4((uViewMatrix * worldPosition).xyz, 0.0));
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
}
