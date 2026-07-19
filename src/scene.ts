// @ts-nocheck
// Void Dominion — hero 3D scene (three.js, bundled).
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_MOBILE = window.innerWidth < 760;
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// ===== SETUP =====
const canvas = document.getElementById('scene-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
const dpr = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(dpr);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x05060d, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060d, 0.0008);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 4, 60);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = !REDUCED;
controls.autoRotateSpeed = 0.18;
controls.minPolarAngle = Math.PI * 0.25;
controls.maxPolarAngle = Math.PI * 0.75;
controls.target.set(0, 0, 0);

// ===== STARFIELD =====
function makeStarfield(count, radius, sizeRange, colorPalette) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // distribute in a sphere shell
    const r = radius * (0.5 + Math.random() * 0.5);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    c.set(col);
    const v = 0.5 + Math.random() * 0.5;
    colors[i*3]   = c.r * v;
    colors[i*3+1] = c.g * v;
    colors[i*3+2] = c.b * v;
    sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  return geo;
}

const starColors = ['#ffffff', '#a8b0d4', '#5ef0ff', '#a779ff', '#ff9b5e', '#ffe5c2'];
const starGeo = makeStarfield(IS_MOBILE ? 3000 : 8000, 800, [0.5, 2.2], starColors);
const starMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader: `
    attribute float size;
    varying vec3 vColor;
    varying float vSize;
    uniform float uTime;
    void main() {
      vColor = color;
      vSize = size;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vSize;
    uniform float uTime;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      float a = smoothstep(0.5, 0.0, d);
      a *= 0.7 + 0.3 * sin(uTime * 2.0 + vSize * 12.0);
      gl_FragColor = vec4(vColor, a);
    }
  `,
  vertexColors: true,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ===== NEBULA CLOUDS (sprites) =====
function makeNebulaTexture(color1, color2) {
  const size = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0, color1);
  g.addColorStop(0.4, color2);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  // add noise blobs
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 20 + Math.random() * 60;
    const bg = ctx.createRadialGradient(x, y, 0, x, y, r);
    bg.addColorStop(0, color2);
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const nebulaConfigs = [
  { pos: [-180, 40, -300], scale: 480, c1: 'rgba(94, 240, 255, 0.4)', c2: 'rgba(94, 240, 255, 0.08)' },
  { pos: [220, -60, -260], scale: 520, c1: 'rgba(167, 121, 255, 0.35)', c2: 'rgba(167, 121, 255, 0.06)' },
  { pos: [80, 120, -380], scale: 420, c1: 'rgba(255, 155, 94, 0.22)', c2: 'rgba(255, 100, 50, 0.04)' },
  { pos: [-120, -120, -200], scale: 360, c1: 'rgba(120, 80, 255, 0.25)', c2: 'rgba(80, 40, 200, 0.05)' }
];
const nebulaGroup = new THREE.Group();
nebulaConfigs.forEach(cfg => {
  const tex = makeNebulaTexture(cfg.c1, cfg.c2);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.85
  });
  const spr = new THREE.Sprite(mat);
  spr.position.set(...cfg.pos);
  spr.scale.set(cfg.scale, cfg.scale, 1);
  nebulaGroup.add(spr);
});
scene.add(nebulaGroup);

// ===== PLANET =====
const planetGroup = new THREE.Group();
scene.add(planetGroup);

// procedural planet shader
const planetUniforms = {
  uTime: { value: 0 },
  uColorA: { value: new THREE.Color('#1a0830') },
  uColorB: { value: new THREE.Color('#3a1a5e') },
  uColorC: { value: new THREE.Color('#7a3aff') },
  uColorD: { value: new THREE.Color('#0a0518') },
  uAtmo:   { value: new THREE.Color('#5ef0ff') }
};

const planetMat = new THREE.ShaderMaterial({
  uniforms: planetUniforms,
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 vWorldPos;
    uniform float uTime;
    uniform vec3 uColorA, uColorB, uColorC, uColorD, uAtmo;

    // hash + noise
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                     mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                     mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
    }
    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec3 p = normalize(vPos) * 2.5;
      float n = fbm(p + vec3(uTime * 0.02, 0.0, 0.0));
      float n2 = fbm(p * 2.2 - vec3(uTime * 0.01, 0.0, 0.0));
      float bands = sin(p.y * 6.0 + n2 * 3.0) * 0.5 + 0.5;

      vec3 col = mix(uColorD, uColorA, bands);
      col = mix(col, uColorB, smoothstep(0.4, 0.7, n));
      col = mix(col, uColorC, smoothstep(0.65, 0.85, n) * 0.6);

      // city lights on dark side
      float dark = pow(1.0 - max(dot(vNormal, normalize(vec3(0.4, 0.3, 1.0))), 0.0), 2.0);
      float lights = step(0.78, n2) * dark * 0.6;
      col += vec3(1.0, 0.7, 0.3) * lights;

      // rim / atmosphere
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
      rim = pow(rim, 2.5);
      col += uAtmo * rim * 0.9;

      // subtle lighting
      float light = max(dot(vNormal, normalize(vec3(0.5, 0.4, 1.0))), 0.0);
      col *= 0.4 + 0.8 * light;

      gl_FragColor = vec4(col, 1.0);
    }
  `
});

const planet = new THREE.Mesh(new THREE.SphereGeometry(10, 96, 96), planetMat);
planetGroup.add(planet);

// atmosphere outer glow
const atmoMat = new THREE.ShaderMaterial({
  uniforms: { uColor: { value: new THREE.Color('#5ef0ff') } },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    uniform vec3 uColor;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float intensity = pow(1.0 - dot(vNormal, viewDir), 3.0);
      gl_FragColor = vec4(uColor, intensity * 0.9);
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false
});
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(11.4, 64, 64), atmoMat);
planetGroup.add(atmosphere);

// ===== ORBITAL RINGS + FLEETS =====
const ringGroup = new THREE.Group();
scene.add(ringGroup);

const ringConfigs = [
  { radius: 16, tilt: 0.05, color: 0x5ef0ff, speed: 0.0035, fleetCount: 3, fleetSize: 0.32 },
  { radius: 21, tilt: -0.18, color: 0xa779ff, speed: -0.0024, fleetCount: 4, fleetSize: 0.28 },
  { radius: 27, tilt: 0.32, color: 0xff9b5e, speed: 0.0016, fleetCount: 2, fleetSize: 0.42 },
  { radius: 33, tilt: -0.4, color: 0x5eff9b, speed: -0.0011, fleetCount: 3, fleetSize: 0.24 }
];

const fleets = [];
ringConfigs.forEach((cfg) => {
  // ring line
  const ringGeo = new THREE.RingGeometry(cfg.radius - 0.02, cfg.radius + 0.02, 180);
  const ringMat = new THREE.MeshBasicMaterial({
    color: cfg.color,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2 + cfg.tilt;
  ringGroup.add(ring);

  // faint dashed inner orbit using points
  const dotCount = 220;
  const dotPos = new Float32Array(dotCount * 3);
  for (let i = 0; i < dotCount; i++) {
    const a = (i / dotCount) * Math.PI * 2;
    dotPos[i*3]   = Math.cos(a) * cfg.radius;
    dotPos[i*3+1] = 0;
    dotPos[i*3+2] = Math.sin(a) * cfg.radius;
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
  const dotMat = new THREE.PointsMaterial({
    color: cfg.color,
    size: 0.08,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const dots = new THREE.Points(dotGeo, dotMat);
  dots.rotation.x = Math.PI / 2 + cfg.tilt;
  ringGroup.add(dots);

  // fleets
  for (let f = 0; f < cfg.fleetCount; f++) {
    const fleetMat = new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.95 });
    const fleet = new THREE.Mesh(new THREE.SphereGeometry(cfg.fleetSize, 12, 12), fleetMat);
    // glow halo via sprite
    const haloTex = makeNebulaTexture(`rgba(${(cfg.color>>16)&0xff},${(cfg.color>>8)&0xff},${cfg.color&0xff},0.8)`, `rgba(${(cfg.color>>16)&0xff},${(cfg.color>>8)&0xff},${cfg.color&0xff},0.15)`);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    }));
    halo.scale.set(2.4, 2.4, 1);
    fleet.add(halo);

    const angle = (f / cfg.fleetCount) * Math.PI * 2 + Math.random() * 0.5;
    fleets.push({
      mesh: fleet,
      radius: cfg.radius,
      angle,
      speed: cfg.speed * (0.8 + Math.random() * 0.4),
      tilt: cfg.tilt
    });
    ringGroup.add(fleet);
  }
});

// ===== DISTANT SUN =====
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffe5c2 });
const sun = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 24), sunMat);
sun.position.set(120, 30, -200);
scene.add(sun);
const sunHaloTex = makeNebulaTexture('rgba(255, 200, 120, 0.9)', 'rgba(255, 150, 80, 0.15)');
const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({
  map: sunHaloTex,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
}));
sunHalo.scale.set(28, 28, 1);
sunHalo.position.copy(sun.position);
scene.add(sunHalo);

// directional light from sun
const sunLight = new THREE.DirectionalLight(0xffe5c2, 1.2);
sunLight.position.set(120, 30, -200);
scene.add(sunLight);
const ambient = new THREE.AmbientLight(0x2a1a4a, 0.6);
scene.add(ambient);

// ===== POST PROCESSING =====
const composer = new EffectComposer(renderer);
composer.setPixelRatio(dpr);
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  IS_MOBILE ? 0.6 : 0.85,  // strength
  0.55,  // radius
  0.18   // threshold
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ===== SCROLL / POINTER RESPONSE =====
let scrollY = 0;
let targetCamZ = 60;
let targetCamY = 4;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
}, { passive: true });

let mouseX = 0, mouseY = 0;
window.addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

// ===== RESIZE =====
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// ===== ANIMATION LOOP =====
const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();

  // scroll-driven camera distance
  const scrollFactor = Math.min(scrollY / (window.innerHeight * 2.5), 1);
  targetCamZ = 60 + scrollFactor * 30;
  targetCamY = 4 - scrollFactor * 8;
  camera.position.z += (targetCamZ - camera.position.z) * 0.04;
  camera.position.y += (targetCamY - camera.position.y) * 0.04;

  // subtle mouse parallax on planet group
  planetGroup.rotation.y = t * 0.05 + mouseX * 0.15;
  planetGroup.rotation.x = mouseY * 0.08;

  // planet shader time
  planetUniforms.uTime.value = t;
  starMat.uniforms.uTime.value = t;

  // rotate stars slowly
  stars.rotation.y = t * 0.005;
  nebulaGroup.rotation.y = t * 0.008;

  // orbit fleets
  for (const f of fleets) {
    f.angle += f.speed;
    const x = Math.cos(f.angle) * f.radius;
    const z = Math.sin(f.angle) * f.radius;
    // apply tilt around X axis
    const yTilt = -z * Math.sin(f.tilt);
    const zTilt = z * Math.cos(f.tilt);
    f.mesh.position.set(x, yTilt, zTilt);
  }

  // pulse ring opacity
  ringGroup.children.forEach((child, i) => {
    if (child.material && child.material.opacity !== undefined && child.type === 'Mesh') {
      child.material.opacity = 0.12 + 0.08 * Math.sin(t * 0.8 + i * 0.5);
    }
  });

  controls.update();
  composer.render();
  if (running) rafId = requestAnimationFrame(animate);
}
let rafId = 0;
let running = false;
function start() {
  if (running) return;
  running = true;
  rafId = requestAnimationFrame(animate);
}
function stop() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}
// Pause the render loop when the tab is hidden to save battery/CPU.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
  else start();
});
if (REDUCED) {
  // Render a single static frame; no continuous animation.
  planetUniforms.uTime.value = 0;
  starMat.uniforms.uTime.value = 0;
  for (const f of fleets) {
    f.mesh.position.set(Math.cos(f.angle) * f.radius,
      -Math.sin(f.angle) * f.radius * Math.sin(f.tilt),
      Math.sin(f.angle) * f.radius * Math.cos(f.tilt));
  }
  controls.update();
  composer.render();
} else {
  start();
}

// ===== LOADER HIDE =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.getElementById('loader');
    l.classList.add('hide');
    setTimeout(() => l.remove(), 800);
  }, 400);
});

// ===== REVEAL ON SCROLL =====
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
reveals.forEach(r => io.observe(r));


// ===== ANIMATED STAT COUNTERS =====
function animateCounters() {
  const nums = document.querySelectorAll('.stat-num');
  nums.forEach((el) => {
    const raw = (el.textContent || '').trim();
    if (!/^\d+$/.test(raw)) return; // skip "24/7", "RU/EN"
    const target = parseInt(raw, 10);
    if (REDUCED) { el.textContent = String(target); return; }
    const dur = 1400;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(target * eased));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const so = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animateCounters(); so.disconnect(); }
    });
  }, { threshold: 0.4 });
  so.observe(statsBar);
}

// ===== MOBILE NAV TOGGLE =====
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  const setOpen = (open) => {
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}
