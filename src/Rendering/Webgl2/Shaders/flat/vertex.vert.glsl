#version 300 es

precision highp float;

#pragma glslify: import("../chunks/uniforms/common.glsl")

in vec3 aPosition;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
