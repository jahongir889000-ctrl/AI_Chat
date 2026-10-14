import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import styles from './ChatBackground3D.module.css';

function SpinningMesh({ geometry, position, rotationSpeed, color, opacity = 0.4, scale = 1 }) {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * rotationSpeed[0];
    ref.current.rotation.y += delta * rotationSpeed[1];
    ref.current.rotation.z += delta * rotationSpeed[2];
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        metalness={0.35}
        roughness={0.25}
        wireframe={false}
      />
    </mesh>
  );
}

function Scene() {
  const accent = '#14b886';
  const accentDim = '#0d9f6e';

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 2, 4]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color={accent} />
      <SpinningMesh
        geometry={<torusKnotGeometry args={[0.55, 0.16, 96, 12]} />}
        position={[-1.1, 0.35, -0.3]}
        rotationSpeed={[0.12, 0.22, 0.05]}
        color={accent}
        opacity={0.32}
      />
      <SpinningMesh
        geometry={<icosahedronGeometry args={[0.45, 0]} />}
        position={[1.15, -0.45, 0.1]}
        rotationSpeed={[0.18, 0.14, 0.1]}
        color={accentDim}
        opacity={0.28}
      />
      <SpinningMesh
        geometry={<octahedronGeometry args={[0.38, 0]} />}
        position={[0.2, 0.75, -0.5]}
        rotationSpeed={[0.08, 0.28, 0.12]}
        color="#3dd6a8"
        opacity={0.22}
        scale={1.1}
      />
      <SpinningMesh
        geometry={<torusGeometry args={[0.5, 0.12, 32, 16]} />}
        position={[0.5, -0.85, -0.2]}
        rotationSpeed={[0.25, 0.08, 0.15]}
        color={accent}
        opacity={0.2}
      />
    </>
  );
}

export function ChatBackground3D() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reducedMotion) {
    return <div className={styles.fallback} aria-hidden="true" />;
  }

  return (
    <div className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <Scene />
      </Canvas>
      <div className={styles.vignette} />
    </div>
  );
}
