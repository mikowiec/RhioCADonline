#version 300 es

precision highp float;

uniform sampler2D uTexture;

in vec2 vTexcoord;

out vec4 fragColor;

void main() {
    fragColor = vec4(vec3(texture(uTexture, vTexcoord).r), 1.0);
}
