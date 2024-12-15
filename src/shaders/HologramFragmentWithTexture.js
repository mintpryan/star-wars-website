
export default /*glsl*/ `
    uniform float time;
    varying vec2 vUv;
    uniform sampler2D uTexture;

    
    void main() {
            vec2 uv = vUv;

    float distortion =  0.002;
    uv.x += distortion;

    vec4 textureColor = texture2D(uTexture, uv);

    float gradient = smoothstep(0.0, 0.06, uv.y);
    float stripes = sin((uv.y * 1000.0) + time * 2.0) * 0.1 + 0.5;
    stripes = smoothstep(0.1, 0.7, stripes);

    vec3 blueColor = vec3(0.3, 0.8, 1.0) * (stripes + 0.5);

    vec3 finalColor = mix(textureColor.rgb, blueColor, 0.5);


    gl_FragColor = vec4(finalColor, gradient * textureColor.a);

        
    }
  `;
