import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Starfield } from './Starfield';
import { Planet } from './Planet';

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 7], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#02090c']} />
      <fog attach="fog" args={['#02090c', 12, 42]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={2.1} color="#8ff4fa" />
      <pointLight position={[-6, -2, -4]} intensity={40} color="#b48cff" distance={30} />
      <Suspense fallback={null}>
        <Starfield />
        <Planet />
      </Suspense>
    </Canvas>
  );
}
