#version 300 es

precision highp float;

in vec2 aDevicePosition;

out vec2 vTexcoord;

void main() {
    vTexcoord = (aDevicePosition + 1.0) * 0.5;
    gl_Position = vec4(aDevicePosition, 0.0, 1.0);
}
