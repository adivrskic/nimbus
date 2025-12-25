// fragment.glsl

varying float vPattern;

void main() {
    vec3 color = vec3(vPattern);

    csm_FragColor = vec4(color, 1.); // Using `csm_FragColor` removes all the shading. Use this only for debugging.
}