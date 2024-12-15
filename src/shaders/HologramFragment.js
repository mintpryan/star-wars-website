export default /*glsl*/ `
    uniform float time;
    uniform float color_1;
    uniform float color_2;
    varying vec2 vUv;

    
    void main() {
        
        vec2 uv = vUv;

       
        float distortion = sin(uv.y * 20.0 + time * 4.0) * 0.05;
        uv.x += distortion;

    
        float gradient = smoothstep(0.0, 1.2, uv.y);

        float stripes = sin((uv.y * 10000.0) + time * 2.0) * 0.1 + 0.5;
        stripes = smoothstep(0.1, 0.7, stripes);

        vec3 blueColor = vec3(color_1, color_2, 1.0) * (stripes + 0.05);

        gl_FragColor = vec4(blueColor, gradient * 0.8);

        
    }
  `;