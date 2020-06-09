#version 300 es

precision highp float;

#pragma glslify: import("../chunks/constants.glsl")
#pragma glslify: import("../chunks/uniforms/common.glsl")
#pragma glslify: import("../chunks/uniforms/lights.glsl")
#pragma glslify: import("../chunks/uniforms/shadows.glsl")
#pragma glslify: import("./uniforms/material.glsl")

#pragma glslify: import("../chunks/textureDepth.glsl")

#pragma glslify: perturbNormal = require("glsl-perturb-normal")
#pragma glslify: diffuseLambert = require("glsl-diffuse-lambert")
#pragma glslify: specularPhong = require("glsl-specular-phong")

in vec3 vPosition;
in vec3 vEye;
in vec3 vNormal;
in vec2 vTexcoord;

out vec4 fragColor;

vec3 getNormal(vec3 N, vec3 E) {
    #ifdef USE_NORMALMAP
        vec3 normalMap = (texture(uNormalTexture, vTexcoord) * 2.0 - 1.0).rgb;
        normalMap.xy *= uNormalScale;
        normalMap = normalize(normalMap);
        return perturbNormal(normalMap, normalize(N), normalize(E), vTexcoord);
    #else
        return normalize(N);
    #endif
}

void main() {
    vec3 materialColor = uDiffuse.xyz * texture(uDiffuseTexture, vTexcoord).xyz;
    vec3 materialSpecular = uSpecular.xyz;
    vec3 materialEmissive = texture(uEmissiveTexture, vTexcoord).xyz;

    vec3 kA = ambientColor * materialColor;
    vec3 kE = materialEmissive;
    vec3 kD = vec3(0.0);
    vec3 kS = vec3(0.0);

    vec3 E = normalize(vEye);
    vec3 N = getNormal(vNormal, E);

    int directionalLightsCount = min(uNumDirectionalLights, MAX_DIRECTIONAL_LIGHTS);
    int directionalShadowCasters = min(uNumShadowCasters, MAX_SHADOW_CASTERS);

    for (int i = 0; i < directionalLightsCount; i++) {
        vec3 L = -normalize(uDirectionalLightDirection[i]);
        float lightAmount = 1.0;

        if (i <= directionalShadowCasters) {
            vec4 shadowHomogeneousPos = uShadowProjection[i] * uShadowView[i] * vec4(vPosition, 1.0);
            vec3 shadowPos = shadowHomogeneousPos.xyz / shadowHomogeneousPos.w * 0.5 + 0.5;

            float bias = max(uShadowBias[i] * (1.0 - dot(N, L)), 0.001);

            float currentDepth = clamp(shadowPos.z, 0., 1.) - bias;
            float closestDepth = textureDepth(uShadowDepth[0], shadowPos.xy);

            lightAmount = (currentDepth < closestDepth) ? 1.0 : 0.0;
        }

        if (lightAmount > EPSILON) {
            vec3 lightColor = uDirectionalLightColor[i].xyz;

            float lambertTerm = diffuseLambert(L, N);
            float specularTerm = specularPhong(L, E, N, uShininess);

            kD += lightAmount * lambertTerm  * materialColor    * (lightColor - ambientColor);
            kS += lightAmount * specularTerm * materialSpecular * lightColor;
        }
    }

    fragColor = vec4(kA + kE + kD + kS, 1.0);
}
