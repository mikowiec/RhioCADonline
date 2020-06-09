float textureDepth(sampler2D depth, vec2 coords) {
    if (coords.x < 0.001 ||
        coords.y < 0.001 ||
        coords.x > 1.0 - 0.001 ||
        coords.y > 1.0 - 0.001) {
        return 1.0;
    }
    return texture(depth, coords).r;
}
