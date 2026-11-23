// src/misc/CRT.js

export const CRT = {

    // Screen geometry
    curvature:0.1,          // 0.00 = Flat | 0.10 = Curved

    // Signal distortion
    wobbleAmplitude: 0.0001,  // Horizontal movement
    wobbleFrequency: 40.0,
    wobbleSpeed: 1.0,

    glitchThreshold: 0.01,   // Higher = Less frequent
    glitchStrength: 0.001,     // Horizontal displacement

    // RGB separation
    rgbShiftBase: 0.0015,
    rgbShiftEdges: 0.003,

    // Glow
    glowStrength: 0.0875,     // 0.00 = Disabled

    // Scanlines
    scanlineDarkness: 0.95,   // 0.00 = Dark | 1.00 = Disabled

    // Phosphor mask
    maskStrength: 0.05,      // 0.00 = Disabled

    // Refresh bar
    refreshStrength: 0.04,
    refreshSpeed: 0.12,

    // Flicker
    flickerStrength: 0.02,
    flickerSpeed: 110.0,

    // Noise
    noiseStrength: 0.005,

    // Image appearance
    vignetteStrength: 0.35,
    brightness: 1.15
};

function GLSL(value) {
    return Number(value).toFixed(6);
}

const source = document.getElementById("game");
const screen = document.getElementById("screen");
const gl = screen.getContext("webgl");

if (!gl) {
    throw new Error("WebGL no está disponible.");
}



const vertexShader = `
attribute vec2 position;
varying vec2 uv;

void main() {
    uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;


const fragmentShader = `
precision mediump float;

varying vec2 uv;
uniform sampler2D image;
uniform float time;
uniform vec2 resolution;
uniform vec2 texSize;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 p = uv * 2.0 - 1.0;

    // Curvature
    p *= 1.0 + ${GLSL(CRT.curvature)} * vec2(p.y * p.y, p.x * p.x);

    vec2 coord = p * 0.5 + 0.5;

    if (coord.x < 0.0 || coord.x > 1.0 ||
        coord.y < 0.0 || coord.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Wobble + Glitch
    float wobble = sin(
        coord.y * ${GLSL(CRT.wobbleFrequency)} + time * ${GLSL(CRT.wobbleSpeed)}
    ) * ${GLSL(CRT.wobbleAmplitude)};

    float glitchLine = step(
        ${GLSL(CRT.glitchThreshold)},
        rand(vec2(floor(coord.y * 120.0), floor(time * 8.0)))
    );

    coord.x += wobble + glitchLine * ${GLSL(CRT.glitchStrength)};

    // RGB Separation
    float shift = ${GLSL(CRT.rgbShiftBase)} + ${GLSL(CRT.rgbShiftEdges)} * dot(p, p);

    float r = texture2D(image, coord + vec2(shift, 0.0)).r;
    float g = texture2D(image, coord).g;
    float b = texture2D(image, coord - vec2(shift, 0.0)).b;

    vec3 color = vec3(r, g, b);

    // Glow
    vec2 t = 1.0 / texSize;

    vec3 glow = texture2D(image, coord + vec2(t.x, 0.0)).rgb
              + texture2D(image, coord + vec2(-t.x, 0.0)).rgb
              + texture2D(image, coord + vec2(0.0, t.y)).rgb
              + texture2D(image, coord + vec2(0.0, -t.y)).rgb;

    color += glow * ${GLSL(CRT.glowStrength)};

    // Scanlines
    float s = 0.5 + 0.5 * sin(coord.y * texSize.y * 6.28318);

    color *= mix(${GLSL(CRT.scanlineDarkness)}, 1.0, s);

    // RGB Phosphor Mask
    float m = mod(gl_FragCoord.x, 3.0);

    vec3 mask = vec3(
        step(m, 1.0),
        step(1.0, m) * step(m, 2.0),
        step(2.0, m)
    );

    color *= mix(vec3(1.0), 0.6 + 0.8 * mask, ${GLSL(CRT.maskStrength)});

    // Refresh Bar
    color *= 1.0 - ${GLSL(CRT.refreshStrength)}
        + ${GLSL(CRT.refreshStrength)} * sin(
            (coord.y - time * ${GLSL(CRT.refreshSpeed)}) * 6.28318
        );

    // Flicker
    color *= 1.0 + ${GLSL(CRT.flickerStrength)} * sin(time * ${GLSL(CRT.flickerSpeed)});

    // Noise
    color += (rand(gl_FragCoord.xy + vec2(time)) - 0.5)
        * ${GLSL(CRT.noiseStrength)};

    // Vignette
    color *= 1.0 - ${GLSL(CRT.vignetteStrength)} * dot(p * 0.5, p * 0.5);

    // Brightness
    color *= ${GLSL(CRT.brightness)};

    gl_FragColor = vec4(color, 1.0);
}
`;


function compileShader(type, sourceCode) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(error);
    }

    return shader;
}



const program = gl.createProgram();

gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexShader));
gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentShader));

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);



const buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1
    ]),
    gl.STATIC_DRAW
);

const position = gl.getAttribLocation(program, "position");

gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);


const texture = gl.createTexture();

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

gl.uniform1i(gl.getUniformLocation(program, "image"), 0);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);



const timeLoc = gl.getUniformLocation(program, "time");
const resLoc = gl.getUniformLocation(program, "resolution");
const texSizeLoc = gl.getUniformLocation(program, "texSize");


export function DrawCRT() {

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source
    );

    gl.uniform1f(timeLoc, (performance.now() / 1000) % 1000);

    gl.uniform2f(resLoc, screen.width, screen.height);
    gl.uniform2f(texSizeLoc, source.width, source.height);

    gl.viewport(0, 0, screen.width, screen.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
