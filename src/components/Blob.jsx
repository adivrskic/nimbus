import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "../contexts/ThemeContext";

const Blob = ({ color = "#efeff0", wireframe = false }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef();

  const { theme } = useTheme();

  const [isLoaded, setIsLoaded] = useState(false);
  const [dynamicBlur, setDynamicBlur] = useState(1);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ----- SCENE & CAMERA -----
    const scene = new THREE.Scene();
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const clock = new THREE.Clock();

    // ----- CLOUD SHADER with billowy puffs -----
    const vertexShader = `
      uniform float u_time;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      // Simplex-like noise for organic billowing
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Fractal Brownian Motion for puffy cloud shapes
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.1;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.1;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        vec3 pos = position;
        float t = u_time * 0.15; // Slow, dreamy movement
        
        // Create puffy bulges - multiple layers of noise at different scales
        // Large billowing puffs
        float largePuffs = fbm(pos * 0.4 + t * 0.5) * 1.2;
        
        // Medium cotton-ball bumps
        float mediumPuffs = fbm(pos * 0.8 + t * 0.3 + 100.0) * 0.6;
        
        // Small surface detail
        float smallPuffs = snoise(pos * 1.5 + t * 0.4) * 0.5;
        
        // Combine for cottony cloud shape
        float totalDisplacement = largePuffs + mediumPuffs + smallPuffs;
        
        // Make displacement always push outward (puffy, not indented)
        totalDisplacement = abs(totalDisplacement) * 0.5 + totalDisplacement * 0.3;
        
        // Gentle breathing
        float breathe = sin(t * 1.0) * 0.04;
        totalDisplacement += breathe;
        
        vDisplacement = totalDisplacement;
        
        // Displace along normal for puffy effect
        pos += normal * totalDisplacement;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_red;
      uniform float u_green;
      uniform float u_blue;
      uniform float u_time;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      void main() {
        vec3 normal = normalize(vNormal);
        
        // Soft diffuse lighting from above-right
        vec3 lightDir = normalize(vec3(0.4, 0.7, 0.5));
        float diff = max(dot(normal, lightDir), 0.0);
        
        // Wrap lighting for soft, cottony look
        float wrapDiff = (diff + 0.5) * 0.67;
        wrapDiff = pow(wrapDiff, 1.2);
        
        // Subtle rim/edge glow
        vec3 viewDir = normalize(-vPosition);
        float rim = 1.0 - max(dot(viewDir, normal), 0.0);
        rim = smoothstep(0.3, 1.0, rim) * 0.2;
        
        // Base color
        vec3 baseColor = vec3(u_red, u_green, u_blue);
        
        // Vary color based on displacement (puffier areas slightly brighter)
        float puffBrightness = smoothstep(-0.5, 1.5, vDisplacement) * 0.15;
        
        // Soft internal variation
        float internalVar = hash(vPosition * 2.0) * 0.03;
        
        // Combine lighting
        vec3 color = baseColor * (0.75 + wrapDiff * 0.25 + puffBrightness + rim) + internalVar;
        
        // Subtle time-based shimmer
        float shimmer = sin(u_time * 0.2 + vPosition.x * 2.0) * 0.015;
        color += shimmer;
        
        gl_FragColor = vec4(color, 0.92);
      }
    `;

    const col = new THREE.Color(color);
    const uniforms = {
      u_time: { value: 0 },
      u_red: { value: col.r * 0.95 },
      u_green: { value: col.g * 0.95 },
      u_blue: { value: col.b * 0.95 },
    };

    // ----- CREATE CLOUD GROUP (multiple overlapping puffs) -----
    const cloudGroup = new THREE.Group();

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      wireframe,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Main cloud body - slightly flattened sphere
    const mainGeo = new THREE.IcosahedronGeometry(3, 32);
    const mainCloud = new THREE.Mesh(mainGeo, mat);
    mainCloud.scale.set(1.7, 0.75, 0.9);
    cloudGroup.add(mainCloud);

    // Add puffy bulges around the main body (like cotton balls clustered together)
    const puffPositions = [
      // Top puffs (the fluffy top of the cloud)
      { pos: [-1.8, 0.8, 0.3], scale: [0.95, 0.75, 0.85] },
      { pos: [0.2, 1.1, 0.2], scale: [1.1, 0.7, 0.9] },
      { pos: [1.7, 0.7, -0.2], scale: [0.9, 0.65, 0.8] },
      { pos: [-0.8, 1.0, -0.4], scale: [0.8, 0.6, 0.75] },
      { pos: [0.9, 0.95, 0.5], scale: [0.75, 0.55, 0.7] },
      // Side puffs (bulging outward)
      { pos: [-2.5, 0.1, 0], scale: [0.75, 0.6, 0.7] },
      { pos: [2.4, 0.2, 0.1], scale: [0.8, 0.55, 0.75] },
      { pos: [-2.0, 0.4, 0.6], scale: [0.65, 0.5, 0.6] },
      { pos: [2.0, 0.35, -0.5], scale: [0.7, 0.5, 0.65] },
      // Bottom puffs (flatter, wider base)
      { pos: [-1.2, -0.4, 0.3], scale: [0.9, 0.4, 0.8] },
      { pos: [0.6, -0.35, -0.2], scale: [0.95, 0.45, 0.85] },
      { pos: [-0.3, -0.5, 0.1], scale: [1.0, 0.35, 0.9] },
      // Front/back depth puffs
      { pos: [0.4, 0.5, 1.1], scale: [0.75, 0.6, 0.65] },
      { pos: [-0.6, 0.4, -1.0], scale: [0.7, 0.55, 0.6] },
      { pos: [1.0, 0.3, 0.9], scale: [0.6, 0.5, 0.55] },
    ];

    const puffGeometries = [];
    puffPositions.forEach(({ pos, scale }) => {
      const puffGeo = new THREE.IcosahedronGeometry(2, 24);
      puffGeometries.push(puffGeo);
      const puff = new THREE.Mesh(puffGeo, mat);
      puff.position.set(pos[0], pos[1], pos[2]);
      puff.scale.set(scale[0], scale[1], scale[1]);
      cloudGroup.add(puff);
    });

    scene.add(cloudGroup);

    // ----- RESPONSIVE SCALE -----
    const getScaleFactor = () => {
      const width = window.innerWidth;
      if (width < 480) return 0.4;
      if (width < 768) return 0.55;
      if (width < 1200) return 0.75;
      return 0.95;
    };

    const updateForScreen = () => {
      const scale = getScaleFactor();
      cloudGroup.scale.set(scale, scale, scale);
    };

    updateForScreen();

    const handleResize = () => {
      updateForScreen();
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // ----- ANIMATION LOOP -----
    const animate = () => {
      const t = clock.getElapsedTime();
      uniforms.u_time.value = t;
      // Soft blur animation
      const base = 4;
      const range = 1;
      const noise = Math.sin(t * 0.001) * range;
      const jitter = (Math.random() - 0.2) * 0.001;
      setDynamicBlur(base + noise + jitter);

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ----- SHOW AFTER SHORT DELAY -----
    setTimeout(() => setIsLoaded(true), 10);

    // ----- CLEANUP -----
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      mainGeo.dispose();
      puffGeometries.forEach((geo) => geo.dispose());
      mat.dispose();
    };
  }, [color, wireframe]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: isLoaded
          ? "translate(-50%, -50%) scale(1.87)"
          : "translate(-50%, -50%) scale(1.04)",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 1,
        opacity: isLoaded ? (theme === "dark" ? 0.75 : 1) : 0,
        filter: isLoaded ? `blur(${dynamicBlur.toFixed(1)}px)` : "blur(64px)",
        pointerEvents: "none",
        transition:
          "opacity 1.5s ease-out, transform 1.5s ease-out, filter 0.5s ease-out",
        backdropFilter: "blur(33px)",
      }}
    />
  );
};

export default Blob;
