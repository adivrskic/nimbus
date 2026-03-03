import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { useTheme } from "../contexts/ThemeContext";

const waveEffects = {
  portfolio: {
    speed: 0.008,
    maxSpeed: 0.013,
    scale: 0.675,
    noiseStrength: 1.6,
    position: [0, -0.2, 0],
    rotation: [1.5, 0, 0],
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

    currentPosition.current.lerp(targetPosition, 0.14);
    currentRotation.current.x +=
      (targetRotation.x - currentRotation.current.x) * 0.07;
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
  const [loaded, setLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const wrapRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => setIntroComplete(true), 3500);
    return () => clearTimeout(timer);
  }, [loaded]);

  useEffect(() => {
    if (!introComplete) return;

    const maxShift = 80;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const scrollY = window.scrollY;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;
        const progress = Math.min(scrollY / maxScroll, 1);
        const shift = progress * maxShift;
        el.style.transform = `translateY(-${shift}vh) scale(1.06)`;
      });
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [introComplete]);

  return (
    <div
      ref={wrapRef}
      style={
        introComplete
          ? {
              position: "absolute",
              top: "33%",
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              opacity: 1,
              transform: "scale(1.06)",
              willChange: "transform",
            }
          : {
              position: "absolute",
              top: "33%",
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "scale(1.06)" : "scale(1)",
              transition:
                "opacity 2.8s cubic-bezier(0.16, 1, 0.3, 1), transform 3.4s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "opacity, transform",
            }
      }
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 30 }}
        onCreated={() => {
          requestAnimationFrame(() => setLoaded(true));
        }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true }}
      >
        <ParticleWave isMenuOpen={isMenuOpen} />
      </Canvas>
    </div>
  );
};

export default React.memo(BackgroundWave);
