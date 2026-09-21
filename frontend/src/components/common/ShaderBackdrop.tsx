import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

const vertexShader = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  float wave(vec2 point, vec2 origin, float speed) {
    return sin(length(point - origin) * 8.0 - u_time * speed) * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;
    float first = wave(uv, vec2(0.26, 0.36), 0.55);
    float second = wave(uv, vec2(1.20, 0.88), 0.42);
    float ribbon = sin((uv.x + uv.y * 0.6) * 5.0 + u_time * 0.18) * 0.5 + 0.5;
    vec3 base = vec3(0.035, 0.06, 0.16);
    vec3 navy = vec3(0.18, 0.24, 0.51);
    vec3 blue = vec3(0.34, 0.45, 0.67);
    vec3 mist = vec3(0.78, 0.84, 0.93);
    vec3 color = mix(base, navy, first * 0.60);
    color = mix(color, blue, second * 0.38);
    color += mist * ribbon * 0.08;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ShaderBackdrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!context) return;

    const createShader = (type: number, source: string) => {
      const shader = context.createShader(type)!;
      context.shaderSource(shader, source);
      context.compileShader(shader);
      return shader;
    };
    const program = context.createProgram()!;
    context.attachShader(program, createShader(context.VERTEX_SHADER, vertexShader));
    context.attachShader(program, createShader(context.FRAGMENT_SHADER, fragmentShader));
    context.linkProgram(program);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) return;

    const buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      context.STATIC_DRAW,
    );
    context.useProgram(program);
    const position = context.getAttribLocation(program, 'a_position');
    const resolution = context.getUniformLocation(program, 'u_resolution');
    const time = context.getUniformLocation(program, 'u_time');
    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      context.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const render = (now: number) => {
      frame = 0;
      context.uniform2f(resolution, canvas.width, canvas.height);
      context.uniform1f(time, reducedMotion ? 0 : now * 0.001);
      context.drawArrays(context.TRIANGLES, 0, 3);
      if (!reducedMotion && !document.hidden) frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    const visibilityChange = () => {
      if (!document.hidden && !reducedMotion && !frame) frame = requestAnimationFrame(render);
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    document.addEventListener('visibilitychange', visibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibilityChange);
      context.deleteProgram(program);
      context.deleteBuffer(buffer);
    };
  }, []);

  return (
    <Box
      ref={canvasRef}
      component="canvas"
      aria-hidden="true"
      sx={{ position: 'absolute', inset: 0, width: 1, height: 1 }}
    />
  );
};

export default ShaderBackdrop;
