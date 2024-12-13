
export default /*glsl*/ `
    uniform float time;
    varying vec2 vUv;
    uniform sampler2D uTexture;

    
    void main() {
            vec2 uv = vUv;

    // Добавление искажения на основе времени и шума
    float distortion =  0.05;
    uv.x += distortion;

    // Выборка цвета из текстуры с учётом искажённых координат
    vec4 textureColor = texture2D(uTexture, uv);

    // Градиент для создания светового эффекта
    float gradient = smoothstep(0.0, 0.1, uv.y);

    // Генерация горизонтальных полосок
    float stripes = sin((uv.y * 1000.0) + time * 2.0) * 0.1 + 0.5;
    stripes = smoothstep(0.1, 0.7, stripes);

    // Голубой цвет с учётом полосок
    vec3 blueColor = vec3(0.3, 0.8, 1.0) * (stripes + 0.5);

    // Смешивание текстуры и голубого цвета
    vec3 finalColor = mix(textureColor.rgb, blueColor, 0.5);

    // Итоговый цвет с прозрачностью
    gl_FragColor = vec4(finalColor, gradient * textureColor.a);

        
    }
  `;
