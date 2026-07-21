import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * Holographic hero scene: procedural planet (GLSL), atmosphere glow, orbital
 * rings with fleets, nebulae, starfield and a distant sun — all lit with bloom.
 * The bright "sun"/planet is pushed to the right so the left-aligned hero copy
 * stays readable. Imperative three.js keeps the postprocessing pipeline simple.
 */
export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    wrap.appendChild(canvas);

    // Без WebGL конструктор рендерера бросает исключение; страница при этом
    // должна остаться живой — hero просто показывает CSS-градиент фона.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      wrap.removeChild(canvas);
      return;
    }
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 2000);
    camera.position.set(0, 3, 58);
    camera.lookAt(0, 0, 0);

    // Everything sits inside a group we push to the right / slightly down so the
    // luminous core is away from the hero text on the left.
    const world = new THREE.Group();
    world.position.set(16, -2, 0);
    scene.add(world);

    const isMobile = wrap.clientWidth < 760;

    // ===== STARFIELD =====
    const starColors = ['#ffffff', '#bfeee6', '#35d6e6', '#8ff4fa', '#b48cff', '#ffe5c2'];
    function makeStarfield(count: number, radius: number, sizeRange: [number, number]) {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const c = new THREE.Color();
      for (let i = 0; i < count; i++) {
        const r = radius * (0.5 + Math.random() * 0.5);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        c.set(starColors[Math.floor(Math.random() * starColors.length)]);
        const v = 0.5 + Math.random() * 0.5;
        colors[i * 3] = c.r * v;
        colors[i * 3 + 1] = c.g * v;
        colors[i * 3 + 2] = c.b * v;
        sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      return geo;
    }
    const starGeo = makeStarfield(isMobile ? 2600 : 6500, 800, [0.5, 2.0]);
    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vSize;
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
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ===== NEBULA SPRITES =====
    // material.dispose() не освобождает map — собираем все созданные текстуры.
    const textures: THREE.Texture[] = [];
    function makeRadialTexture(color1: string, color2: string) {
      const size = 256;
      const cv = document.createElement('canvas');
      cv.width = cv.height = size;
      const ctx = cv.getContext('2d')!;
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, color1);
      g.addColorStop(0.4, color2);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 26; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 18 + Math.random() * 56;
        const bg = ctx.createRadialGradient(x, y, 0, x, y, r);
        bg.addColorStop(0, color2);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);
      }
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      textures.push(tex);
      return tex;
    }
    const nebulaConfigs: { pos: [number, number, number]; scale: number; c1: string; c2: string }[] = [
      { pos: [-220, 60, -320], scale: 500, c1: 'rgba(53, 214, 230, 0.34)', c2: 'rgba(53, 214, 230, 0.06)' },
      { pos: [240, -80, -300], scale: 520, c1: 'rgba(143, 244, 250, 0.26)', c2: 'rgba(53, 214, 230, 0.05)' },
      { pos: [60, 140, -400], scale: 440, c1: 'rgba(180, 140, 255, 0.20)', c2: 'rgba(120, 80, 220, 0.04)' },
    ];
    const nebulaGroup = new THREE.Group();
    for (const cfg of nebulaConfigs) {
      const mat = new THREE.SpriteMaterial({
        map: makeRadialTexture(cfg.c1, cfg.c2),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.8,
      });
      const spr = new THREE.Sprite(mat);
      spr.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      spr.scale.set(cfg.scale, cfg.scale, 1);
      nebulaGroup.add(spr);
    }
    scene.add(nebulaGroup);

    // ===== PLANET =====
    const planetGroup = new THREE.Group();
    world.add(planetGroup);

    const planetUniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#062a31') },
      uColorB: { value: new THREE.Color('#0e5a63') },
      uColorC: { value: new THREE.Color('#35d6e6') },
      uColorD: { value: new THREE.Color('#03151a') },
      uAtmo: { value: new THREE.Color('#8ff4fa') },
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
        float hash(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
        float noise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
          return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                         mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                         mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
        float fbm(vec3 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
        void main(){
          vec3 p = normalize(vPos) * 2.5;
          float n = fbm(p + vec3(uTime * 0.02, 0.0, 0.0));
          float n2 = fbm(p * 2.2 - vec3(uTime * 0.01, 0.0, 0.0));
          float bands = sin(p.y * 6.0 + n2 * 3.0) * 0.5 + 0.5;
          vec3 col = mix(uColorD, uColorA, bands);
          col = mix(col, uColorB, smoothstep(0.4, 0.7, n));
          col = mix(col, uColorC, smoothstep(0.65, 0.85, n) * 0.6);
          float dark = pow(1.0 - max(dot(vNormal, normalize(vec3(-0.4, 0.3, 1.0))), 0.0), 2.0);
          float lights = step(0.80, n2) * dark * 0.5;
          col += vec3(0.7, 1.0, 1.0) * lights;
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float rim = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
          col += uAtmo * rim * 0.9;
          float light = max(dot(vNormal, normalize(vec3(-0.5, 0.4, 1.0))), 0.0);
          col *= 0.4 + 0.8 * light;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(10, 96, 96), planetMat);
    planetGroup.add(planet);

    const atmoMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color('#35d6e6') } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main(){
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
        void main(){
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float intensity = pow(1.0 - dot(vNormal, viewDir), 3.0);
          gl_FragColor = vec4(uColor, intensity * 0.85);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(11.4, 64, 64), atmoMat);
    planetGroup.add(atmosphere);

    // ===== ORBITAL RINGS + FLEETS =====
    const ringGroup = new THREE.Group();
    world.add(ringGroup);
    const ringConfigs = [
      { radius: 16, tilt: 0.05, color: 0x35d6e6, speed: 0.0035, fleetCount: 3, fleetSize: 0.32 },
      { radius: 21, tilt: -0.18, color: 0x8ff4fa, speed: -0.0024, fleetCount: 4, fleetSize: 0.28 },
      { radius: 27, tilt: 0.32, color: 0xffb43a, speed: 0.0016, fleetCount: 2, fleetSize: 0.42 },
      { radius: 33, tilt: -0.4, color: 0xb48cff, speed: -0.0011, fleetCount: 3, fleetSize: 0.24 },
    ];
    const fleets: { mesh: THREE.Mesh; radius: number; angle: number; speed: number; tilt: number }[] = [];
    const ringMeshes: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>[] = [];
    for (const cfg of ringConfigs) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(cfg.radius - 0.02, cfg.radius + 0.02, 180),
        new THREE.MeshBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      ring.rotation.x = Math.PI / 2 + cfg.tilt;
      ringGroup.add(ring);
      ringMeshes.push(ring);

      for (let f = 0; f < cfg.fleetCount; f++) {
        const fleet = new THREE.Mesh(
          new THREE.SphereGeometry(cfg.fleetSize, 12, 12),
          new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.95 }),
        );
        const halo = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: makeRadialTexture(
              `rgba(${(cfg.color >> 16) & 0xff},${(cfg.color >> 8) & 0xff},${cfg.color & 0xff},0.8)`,
              `rgba(${(cfg.color >> 16) & 0xff},${(cfg.color >> 8) & 0xff},${cfg.color & 0xff},0.12)`,
            ),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.8,
          }),
        );
        halo.scale.set(2.2, 2.2, 1);
        fleet.add(halo);
        fleets.push({
          mesh: fleet,
          radius: cfg.radius,
          angle: (f / cfg.fleetCount) * Math.PI * 2 + Math.random() * 0.5,
          speed: cfg.speed * (0.8 + Math.random() * 0.4),
          tilt: cfg.tilt,
        });
        ringGroup.add(fleet);
      }
    }

    // ===== DISTANT SUN =====
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xeafffb }),
    );
    sun.position.set(150, 60, -220);
    scene.add(sun);
    const sunHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeRadialTexture('rgba(180, 245, 250, 0.9)', 'rgba(53, 214, 230, 0.14)'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    sunHalo.scale.set(26, 26, 1);
    sunHalo.position.copy(sun.position);
    scene.add(sunHalo);

    // ===== POST PROCESSING =====
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(dpr);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), isMobile ? 0.5 : 0.62, 0.5, 0.2);
    composer.addPass(bloom);
    const output = new OutputPass();
    composer.addPass(output);

    // ===== SIZE =====
    let rafId = 0;
    let running = false;
    function resize() {
      const w = wrap!.clientWidth || 1;
      const h = wrap!.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      // setSize очищает канвас; без цикла (reduced motion / пауза) кадр надо вернуть.
      if (!running) composer.render();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ===== POINTER PARALLAX =====
    let mouseX = 0;
    let mouseY = 0;
    const onPointer = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    // ===== LOOP =====
    const clock = new THREE.Clock();
    function frame() {
      const t = clock.getElapsedTime();
      planetGroup.rotation.y = t * 0.05 + mouseX * 0.12;
      planetGroup.rotation.x = mouseY * 0.06;
      planetUniforms.uTime.value = t;
      starMat.uniforms.uTime.value = t;
      stars.rotation.y = t * 0.005;
      nebulaGroup.rotation.y = t * 0.008;
      for (const fl of fleets) {
        fl.angle += fl.speed;
        const x = Math.cos(fl.angle) * fl.radius;
        const z = Math.sin(fl.angle) * fl.radius;
        fl.mesh.position.set(x, -z * Math.sin(fl.tilt), z * Math.cos(fl.tilt));
      }
      ringMeshes.forEach((ring, i) => {
        ring.material.opacity = 0.11 + 0.07 * Math.sin(t * 0.8 + i * 0.5);
      });
      composer.render();
      if (running) rafId = requestAnimationFrame(frame);
    }
    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }
    // Рендерим только когда hero в кадре и вкладка видима — читая секции ниже,
    // пользователь не жжёт GPU на невидимый bloom-пайплайн.
    let inView = true;
    const updateRunState = () => {
      if (reduced) return;
      if (inView && !document.hidden) start();
      else stop();
    };
    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      updateRunState();
    });
    io.observe(wrap);
    const onVisibility = () => updateRunState();
    document.addEventListener('visibilitychange', onVisibility);

    if (reduced) {
      for (const fl of fleets) {
        fl.mesh.position.set(
          Math.cos(fl.angle) * fl.radius,
          -Math.sin(fl.angle) * fl.radius * Math.sin(fl.tilt),
          Math.sin(fl.angle) * fl.radius * Math.cos(fl.tilt),
        );
      }
      composer.render();
    } else {
      start();
    }

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      io.disconnect();
      ro.disconnect();
      // composer.dispose() не трогает добавленные пассы — bloom держит
      // ~11 render target'ов и материалы, освобождаем явно.
      bloom.dispose();
      output.dispose();
      composer.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = (mesh as THREE.Mesh).material;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else if (m) (m as THREE.Material).dispose();
      });
      textures.forEach((t) => t.dispose());
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }} aria-hidden />;
}
