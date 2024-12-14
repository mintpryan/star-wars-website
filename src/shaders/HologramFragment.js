export default /*glsl*/ `
    uniform float time;
    varying vec2 vUv;

    
    void main() {
        // Базовые координаты
        vec2 uv = vUv;

        // Добавление искажения на основе времени и шума
        float distortion = sin(uv.y * 20.0 + time * 4.0) * 0.05;
        uv.x += distortion;

        // Градиент для создания светового эффекта
        float gradient = smoothstep(0.0, 1.2, uv.y);

        // Генерация горизонтальных полосок
        float stripes = sin((uv.y * 10000.0) + time * 2.0) * 0.1 + 0.5;
        stripes = smoothstep(0.1, 0.7, stripes);

        // Голубой цвет с учетом полосок
        vec3 blueColor = vec3(0.3, 0.3, 1.0) * (stripes + 0.05);

        // Итоговый цвет с прозрачностью
        gl_FragColor = vec4(blueColor, gradient * 0.8);

        
    }
  `;