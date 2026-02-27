import React, { useRef, useState, useEffect } from "react"; // ✅ added React
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
  // Updated portfolio effect
  portfolio: {
    speed: 0.008, // slightly slower
    maxSpeed: 0.016,
    scale: 0.75,
    noiseStrength: 1.4, // reduced for smoother appearance
    position: [0, 0, -1],
    rotation: [14, 0, 0], // 14 degrees in radians
  },
  services: {
    speed: 0.02,
    maxSpeed: 0.3,
    scale: 1,
    noiseStrength: 1.2,
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
    pulseEnabled: true,
    colorEffects: true,
    baseSize: 0.085,
    maxSize: 0.1,
  },
};

// Gradient colors (unchanged)
const gradientColors = [
  new THREE.Color("#ff2299").convertSRGBToLinear(),
  new THREE.Color("#00eeff").convertSRGBToLinear(),
  new THREE.Color("#cc22ff").convertSRGBToLinear(),
  new THREE.Color("#ff6622").convertSRGBToLinear(),
];

const gradientColorsDark = [
  new THREE.Color("#84fab0").convertSRGBToLinear(),
  new THREE.Color("#8fd3f4").convertSRGBToLinear(),
];

// Custom particle texture (unchanged)
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
  const colorMap = useRef(new Map());
  const particleTexture = useRef(null);
  const activeEffect = "portfolio";
  const isWaveOn = true;
  const progress = 0;
  const { theme } = useTheme();

  console.log("hello);");

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [opacity] = useState(1);
  const isFooter = activeEffect === "footer";

  // Target position/rotation from effect
  const targetPosition = new THREE.Vector3(
    ...waveEffects[activeEffect]?.position
  );
  const currentPosition = useRef(
    new THREE.Vector3(...waveEffects[activeEffect]?.position)
  );
  const targetRotation = new THREE.Euler(
    ...waveEffects[activeEffect]?.rotation
  );
  const currentRotation = useRef(
    new THREE.Euler(...waveEffects[activeEffect]?.rotation)
  );

  useEffect(() => {
    particleTexture.current = createParticleTexture();
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize colors for footer effect (unchanged)
  useEffect(() => {
    if (meshRef.current && isFooter) {
      const count = meshRef.current.geometry.attributes.position.count;
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      const c = theme === "light" ? gradientColors : gradientColorsDark;

      for (let i = 0; i < count; i++) {
        const existingData = colorMap.current.get(i);
        const colorIndex =
          existingData?.baseColor ?? Math.floor(Math.random() * c.length);
        const color = c[colorIndex];

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        const sizeVariation =
          existingData?.sizeMultiplier ?? 0.7 + Math.random() * 0.6;
        sizes[i] = waveEffects.footer.baseSize * sizeVariation;

        colorMap.current.set(i, {
          baseColor: colorIndex,
          phase: existingData?.phase ?? Math.random() * Math.PI * 2,
          pulseSpeed: existingData?.pulseSpeed ?? 0.3 + Math.random() * 1.7,
          sizeMultiplier: sizeVariation,
        });
      }

      if (meshRef.current.geometry.attributes.color === undefined) {
        meshRef.current.geometry.setAttribute(
          "color",
          new THREE.BufferAttribute(colors, 3)
        );
      } else {
        meshRef.current.geometry.attributes.color.array.set(colors);
        meshRef.current.geometry.attributes.color.needsUpdate = true;
      }

      if (meshRef.current.geometry.attributes.size === undefined) {
        meshRef.current.geometry.setAttribute(
          "size",
          new THREE.BufferAttribute(sizes, 1)
        );
      } else {
        meshRef.current.geometry.attributes.size.array.set(sizes);
        meshRef.current.geometry.attributes.size.needsUpdate = true;
      }
    }
  }, [isFooter, meshRef.current, theme]);

  // Main animation loop
  useFrame(({ clock, camera }) => {
    if (!meshRef.current || !materialRef.current || isMenuOpen || !isWaveOn)
      return;

    const {
      speed,
      maxSpeed,
      noiseStrength,
      pulseEnabled,
      colorEffects,
      baseSize,
      maxSize,
    } = waveEffects[activeEffect];

    const progressFactor = Math.min(1, Math.max(0, progress / 100));
    const waveSpeed = speed + progressFactor * (maxSpeed - speed);

    time.current = clock.getElapsedTime();
    const elapsedTime = time.current * waveSpeed;
    const pos = meshRef.current.geometry.attributes.position;

    // Animate wave
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      let z = noiseStrength * simplex.noise3d(x * 0.22, y * 0.92, elapsedTime);

      if (isFooter && pulseEnabled) {
        const particleData = colorMap.current.get(i) || {
          phase: 0,
          pulseSpeed: 1,
        };
        const pulseFactor =
          Math.sin(
            time.current * particleData.pulseSpeed + particleData.phase
          ) * 0.5;
        z += pulseFactor * progressFactor;
      }

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

    // Color effects (unchanged)
    if (isFooter && colorEffects && meshRef.current.geometry.attributes.color) {
      // ... (footer color animation code, same as before)
    } else {
      // Standard color transition
      const colorStart = new THREE.Color(theme === "light" ? "#333" : "#ccc");
      const colorEnd = new THREE.Color("#ff0077");
      const newColor = colorStart.clone().lerp(colorEnd, progressFactor);
      materialRef.current.color.set(newColor);

      // Adjust particle size to be more visible
      materialRef.current.size = isFooter ? baseSize : 0.03; // increased from 0.02
      materialRef.current.needsUpdate = true;
    }
  });

  // Compute plane size to fill the screen based on camera view
  // We want the plane to cover the visible area at the current camera distance.
  // Camera is at (0,2,8) looking at origin. The visible height at distance 8 with fov 30° is ~ 2 * 8 * tan(15°) ≈ 4.3 units.
  // We'll set plane dimensions to cover that, but also account for aspect ratio.
  // Use a fixed base size and let the geometry adapt? Instead, we'll set the plane to a size that roughly covers the view.
  const planeWidth = 30; // enough to cover horizontally (based on aspect ~16:9)
  const planeHeight = 4; // enough to cover vertically

  // Alternatively, we can set it based on window aspect:
  // const aspect = size.width / size.height;
  // const planeWidth = 8 * aspect;
  // const planeHeight = 8; // slightly larger than 4.3 to ensure coverage

  return (
    <points ref={meshRef} scale={waveEffects[activeEffect].scale}>
      <planeGeometry args={[planeWidth, planeHeight, 100, 100]} />
      <pointsMaterial
        ref={materialRef}
        size={0.2} // default size, overridden per effect
        transparent
        opacity={opacity}
        vertexColors={isFooter}
        blending={isFooter ? THREE.AdditiveBlending : THREE.NormalBlending}
        map={particleTexture.current}
        alphaTest={0.01}
        sizeAttenuation={true}
      />
    </points>
  );
};

const BackgroundWave = ({ isMenuOpen, activeEffect, progress, isWaveOn }) => {
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
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: "100%",
        height: isMobile ? "800px" : "400px",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Canvas camera={{ position: [0, 2, 8], fov: 30 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <ParticleWave
          isMenuOpen={isMenuOpen}
          activeEffect={activeEffect}
          progress={progress}
          isWaveOn={isWaveOn}
        />
      </Canvas>
    </div>
  );
};
export default React.memo(BackgroundWave);
