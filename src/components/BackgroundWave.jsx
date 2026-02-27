import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { useTheme } from "../contexts/ThemeContext";

const waveEffects = {
  hero: {
    speed: 0.02,
    maxSpeed: 0.04,
    scale: 0.67,
    noiseStrength: 1.8,
    position: [0, -1, 0],
    rotation: [-Math.PI / 4, 0, -0.5],
  },
  "cta-0": {
    speed: 0.02,
    maxSpeed: 0.02,
    scale: 1.125,
    noiseStrength: 1.2,
    position: [0, 0, 0],
    rotation: [0.1, -1.2, 0],
  },
  "cta-1": {
    speed: 0.03,
    maxSpeed: 0.03,
    scale: 0.67,
    noiseStrength: 1.4,
    position: [-1, -2.2, 0],
    rotation: [-1, -2.1, 1],
  },
  "cta-2": {
    speed: 0.02,
    maxSpeed: 0.02,
    scale: 1.125,
    noiseStrength: 1.2,
    position: [0, 0, 0],
    rotation: [0.1, -1.2, 0],
  },
  "cta-3": {
    speed: 0.03,
    maxSpeed: 0.03,
    scale: 0.67,
    noiseStrength: 1.4,
    position: [-1, -2.2, 0],
    rotation: [-1, -2.1, 0],
  },
  portfolio: {
    speed: 0.008,
    maxSpeed: 0.016,
    scale: 0.725,
    noiseStrength: 1.2,
    position: [0, 0, 0],
    rotation: [1, 0, 0.1],
  },
  services: {
    speed: 0.02,
    maxSpeed: 0.3,
    scale: 1,
    noiseStrength: 1.1,
    position: [0, 0, 0],
    rotation: [Math.PI / 2, 0, -Math.PI / 2],
  },
  footer: {
    speed: 0.04,
    maxSpeed: 0.4,
    scale: 2.1,
    noiseStrength: 2,
    position: [0, 0, 0],
    rotation: [5, -3, -4],
    baseSize: 0.085,
    maxSize: 0.1,
  },
};

const createParticleTexture = () => {
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const ParticleWave = ({ isMenuOpen }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const simplex = new SimplexNoise();
  const time = useRef(0);
  const particleTexture = useRef(null);
  const activeEffect = "portfolio";
  const isWaveOn = true;
  const { theme } = useTheme();

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const isFooter = activeEffect === "footer";

  // Use different rotation on mobile
  const rotation =
    activeEffect === "portfolio" && isMobile
      ? [14, 0, 1]
      : waveEffects[activeEffect]?.rotation;

  const targetPosition = new THREE.Vector3(
    ...waveEffects[activeEffect]?.position
  );
  const currentPosition = useRef(
    new THREE.Vector3(...waveEffects[activeEffect]?.position)
  );
  const targetRotation = new THREE.Euler(...rotation);
  const currentRotation = useRef(new THREE.Euler(...rotation));

  useEffect(() => {
    particleTexture.current = createParticleTexture();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update target rotation when mobile state changes
  useEffect(() => {
    const newRotation =
      activeEffect === "portfolio" && isMobile
        ? [14, 1, 4]
        : waveEffects[activeEffect]?.rotation;
    targetRotation.set(...newRotation);
  }, [isMobile, activeEffect]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current || isMenuOpen || !isWaveOn)
      return;

    const { speed, maxSpeed, noiseStrength, baseSize } =
      waveEffects[activeEffect];

    const waveSpeed = speed;
    time.current = clock.getElapsedTime();
    const elapsedTime = time.current * waveSpeed;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        noiseStrength * simplex.noise3d(x * 0.22, y * 0.92, elapsedTime);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;

    // Smoothly interpolate position and rotation
    currentPosition.current.lerp(targetPosition, 0.04);
    currentRotation.current.x +=
      (targetRotation.x - currentRotation.current.x) * 0.17;
    currentRotation.current.y +=
      (targetRotation.y - currentRotation.current.y) * 0.37;
    currentRotation.current.z +=
      (targetRotation.z - currentRotation.current.z) * 0.67;

    meshRef.current.position.copy(currentPosition.current);
    meshRef.current.rotation.set(
      currentRotation.current.x,
      currentRotation.current.y,
      currentRotation.current.z
    );

    // Static base color
    const baseColor = new THREE.Color(theme === "light" ? "#333" : "#ccc");
    materialRef.current.color.set(baseColor);
    materialRef.current.size = isFooter ? baseSize : 0.01;
    materialRef.current.needsUpdate = true;
  });

  const planeWidth = 30;
  const planeHeight = 3;

  return (
    <points ref={meshRef} scale={waveEffects[activeEffect]?.scale}>
      <planeGeometry args={[planeWidth, planeHeight, 150, 150]} />
      <pointsMaterial
        ref={materialRef}
        size={0.01}
        color={theme === "light" ? "#333" : "#ccc"}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        map={particleTexture.current}
        alphaMap={particleTexture.current}
        alphaTest={0.01}
      />
    </points>
  );
};

const BackgroundWave = ({ isMenuOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 30 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      gl={{ alpha: true }}
    >
      <ParticleWave isMenuOpen={isMenuOpen} />
    </Canvas>
  );
};

export default React.memo(BackgroundWave);
