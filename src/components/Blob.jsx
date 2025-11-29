import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Blob = ({ color = "#eb1736", wireframe = false }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef();

  const [isLoaded, setIsLoaded] = useState(false);

  // --- NEW: flowing blur state ---
  const [dynamicBlur, setDynamicBlur] = useState(1);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ----- SCENE & CAMERA -----
    const scene = new THREE.Scene();
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const clock = new THREE.Clock();

    // ----- RANDOM STRETCH -----
    const stretchSeed = new THREE.Vector3(
      Math.random() * 1 - 1,
      Math.random() * 1 - 1,
      Math.random() * 1 - 1
    ).normalize();

    // ----- SHADERS -----
    const vertexShader = `
      uniform float u_time;
      uniform float u_stretchAmp;
      uniform vec3 u_stretchSeed;
      varying vec3 vNormal;

      void main() {
        vNormal = normal;
        vec3 pos = position;

        float noise1 = sin(pos.x * 2.0 + u_time * 0.8)
                     * sin(pos.y * 2.5 + u_time * 1.6)
                     * sin(pos.z * 2.2 + u_time * 0.5);

        float noise2 = sin(pos.x * 4.5 + u_time * 1.2)
                     * cos(pos.y * 3.8 + u_time * 1.9)
                     * sin(pos.z * 4.2 + u_time * 1.1);

        float combinedNoise = noise1 * 0.7 + noise2 * 0.5;
        pos += normal * combinedNoise * 0.8;

        float s = sin(u_time * 0.9) * 0.5 + 0.5;
        vec3 stretch = u_stretchSeed * u_stretchAmp * s;
        pos *= (1.0 + stretch);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_red;
      uniform float u_green;
      uniform float u_blue;
      varying vec3 vNormal;

      void main() {
        float intensity = dot(vNormal, vec3(0.0,0.0,1.0)) * 0.4 + 0.6;
        vec3 brightColor = vec3(u_red, u_green, u_blue);
        vec3 darkColor = brightColor * 0.5;
        vec3 color = mix(darkColor, brightColor, intensity);
        gl_FragColor = vec4(color, 0.85);
      }
    `;

    const col = new THREE.Color(color);
    const uniforms = {
      u_time: { value: 0 },
      u_red: { value: col.r },
      u_green: { value: col.g },
      u_blue: { value: col.b },
      u_stretchAmp: { value: 0.2 },
      u_stretchSeed: { value: stretchSeed },
    };

    // ----- MESH -----
    const geo = new THREE.IcosahedronGeometry(4, 30);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      wireframe,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ----- RESPONSIVE SCALE & ANIMATION -----
    const getScaleFactor = () => {
      const width = window.innerWidth;
      if (width < 480) return 0.6;
      if (width < 768) return 0.9;
      if (width < 1200) return 1.2;
      return 1.6;
    };

    const updateForScreen = () => {
      const scale = getScaleFactor();

      if (window.innerWidth < 768) {
        uniforms.u_stretchAmp.value = 0.001;
        mesh.userData.rotationXSpeed = 0.0001;
        mesh.userData.rotationYSpeed = 0.0001;
        mesh.userData.pulse = false;
      } else {
        uniforms.u_stretchAmp.value = 0.002;
        mesh.userData.rotationXSpeed = 0.00015;
        mesh.userData.rotationYSpeed = 0.0002;
        mesh.userData.pulse = false;
      }

      mesh.scale.set(scale, scale * 0.5, scale * 0.8);
    };

    updateForScreen();

    window.addEventListener("resize", () => {
      updateForScreen();
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });

    // ----- ANIMATION LOOP -----
    const animate = () => {
      const t = clock.getElapsedTime();
      uniforms.u_time.value = t;

      if (mesh.userData.pulse) {
        const pulse = 0.95 + 0.05 * Math.sin(t * 3);
        mesh.scale.set(pulse, pulse * 0.5, pulse * 0.8);
      }

      mesh.rotation.x += mesh.userData.rotationXSpeed;
      mesh.rotation.y += mesh.userData.rotationYSpeed;

      // ----- NEW: Random flowing blur animation -----
      const base = 20; // minimum blur
      const range = 10; // oscillation
      const noise = Math.sin(t * 0.6) * range;
      const jitter = (Math.random() - 0.5) * 2; // subtle random shake
      setDynamicBlur(base + noise + jitter);

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ----- SHOW AFTER SHORT DELAY -----
    setTimeout(() => setIsLoaded(true), 10);

    // ----- CLEANUP -----
    return () => {
      cancelAnimationFrame(animationRef.current);
      mount.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
    };
  }, [color, wireframe]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "67%",
        maxHeight: "100%",
        overflow: "hidden",
        zIndex: 1,
        opacity: isLoaded ? 1 : 0,

        // --- NEW: animated blur here ---
        filter: isLoaded ? `blur(${dynamicBlur.toFixed(1)}px)` : "blur(64px)",

        transform: isLoaded
          ? "translateY(20px) scale(1)"
          : "translateY(0px) scale(1.3)",
        pointerEvents: "none",
        transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
      }}
    />
  );
};

export default Blob;
