import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** A stylised homeworld: a dark cyan sphere, a fresnel atmosphere shell, an
 *  inclined orbital ring and a few fleets tracing the orbit. */
export function Planet() {
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const fleets = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (planet.current) planet.current.rotation.y += delta * 0.08;
    if (fleets.current) fleets.current.rotation.y += delta * 0.32;
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.rotation.x = Math.sin(t * 0.15) * 0.06;
      group.current.position.y = Math.sin(t * 0.4) * 0.08;
    }
  });

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color('#35d6e6') } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          uniform vec3 uColor;
          void main() {
            float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
            gl_FragColor = vec4(uColor, rim * 0.9);
          }
        `,
      }),
    [],
  );

  const fleetPositions = useMemo(() => {
    const arr: [number, number, number][] = [];
    const rings = [2.35, 2.9, 3.5];
    rings.forEach((radius, ri) => {
      const n = 2 + ri;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + ri;
        arr.push([Math.cos(a) * radius, (ri - 1) * 0.25, Math.sin(a) * radius]);
      }
    });
    return arr;
  }, []);

  return (
    <group ref={group}>
      {/* Planet body */}
      <mesh ref={planet}>
        <icosahedronGeometry args={[1.6, 6]} />
        <meshStandardMaterial
          color="#0a2b33"
          emissive="#0b6b74"
          emissiveIntensity={0.35}
          roughness={0.55}
          metalness={0.5}
          flatShading
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.28}>
        <icosahedronGeometry args={[1.6, 5]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2.2, 0, 0.35]}>
        <torusGeometry args={[2.9, 0.012, 8, 128]} />
        <meshBasicMaterial color="#1d6b70" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 1.9, 0.4, 0.1]}>
        <torusGeometry args={[3.5, 0.008, 8, 128]} />
        <meshBasicMaterial color="#b48cff" transparent opacity={0.35} />
      </mesh>

      {/* Fleets on orbit */}
      <group ref={fleets}>
        {fleetPositions.map((p, i) => (
          <mesh key={i} position={p} rotation={[0, i, Math.PI / 4]}>
            <tetrahedronGeometry args={[0.09]} />
            <meshStandardMaterial
              color="#8ff4fa"
              emissive="#35d6e6"
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
