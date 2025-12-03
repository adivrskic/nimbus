import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Blob = ({ color = "#efeff0", wireframe = false }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef();

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

    // ----- SHADERS - Updated for matte gray appearance -----
    const vertexShader = `
      uniform float u_time;
      uniform float u_stretchAmp;
      uniform vec3 u_stretchSeed;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normal;
        vPosition = position;
        vec3 pos = position;

        // More subtle noise for matte look
        float noise1 = sin(pos.x * 1.8 + u_time * 0.6)
                     * sin(pos.y * 1.5 + u_time * 1.3)
                     * sin(pos.z * 1.2 + u_time * 0.4) * 0.5;

        float noise2 = sin(pos.x * 3.5 + u_time * 0.9)
                     * cos(pos.y * 2.8 + u_time * 1.5)
                     * sin(pos.z * 3.2 + u_time * 0.8) * 0.3;

        float combinedNoise = (noise1 + noise2) * 0.6;
        pos += normal * combinedNoise * 0.5; // Reduced amplitude for smoother look

        // Subtle stretching
        float s = sin(u_time * 0.6) * 0.5 + 0.5;
        vec3 stretch = u_stretchSeed * u_stretchAmp * s;
        pos *= (1.0 + stretch * 0.5); // Reduced stretch effect

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

      void main() {
        // Matte finish calculation
        vec3 lightDir = normalize(vec3(0.3, 0.5, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        
        // Very subtle rim lighting
        vec3 viewDir = normalize(-vPosition);
        float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
        rim = smoothstep(0.4, 1.0, rim) * 0.15;
        
        // Base matte color with slight variation
        vec3 baseColor = vec3(u_red, u_green, u_blue);
        
        // Add subtle surface noise
        float grain = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
        
        // Matte shading - reduced contrast
        vec3 color = baseColor * (0.7 + diff * 0.3 + rim) + grain;
        
        // Subtle color variation over time
        float timeVar = sin(u_time * 0.3) * 0.02;
        color = mix(color, color * 0.95, timeVar);
        
        gl_FragColor = vec4(color, 0.92); // Slightly more opaque for matte look
      }
    `;

    const col = new THREE.Color(color);
    const uniforms = {
      u_time: { value: 0 },
      u_red: { value: col.r * 0.9 }, // Darker base for matte
      u_green: { value: col.g * 0.9 },
      u_blue: { value: col.b * 0.9 },
      u_stretchAmp: { value: 0.15 }, // Reduced amplitude
      u_stretchSeed: { value: stretchSeed },
    };

    // ----- MESH -----
    const geo = new THREE.IcosahedronGeometry(4, 25); // Reduced detail for smoother look
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      wireframe,
      // Add flat shading for matte appearance
      flatShading: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ----- RESPONSIVE SCALE & ANIMATION -----
    const getScaleFactor = () => {
      const width = window.innerWidth;
      if (width < 480) return 0.5;
      if (width < 768) return 0.8;
      if (width < 1200) return 1.0;
      return 1.3;
    };

    const updateForScreen = () => {
      const scale = getScaleFactor();

      // Slower, more subtle animations for matte look
      if (window.innerWidth < 768) {
        uniforms.u_stretchAmp.value = 0.08;
        mesh.userData.rotationXSpeed = 0.00008;
        mesh.userData.rotationYSpeed = 0.0001;
        mesh.userData.pulse = false;
      } else {
        uniforms.u_stretchAmp.value = 0.12;
        mesh.userData.rotationXSpeed = 0.0001;
        mesh.userData.rotationYSpeed = 0.00015;
        mesh.userData.pulse = false;
      }

      mesh.scale.set(scale, scale * 0.6, scale * 0.9); // Flatter, more subtle shape
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

      // Very subtle scaling for matte look
      if (mesh.userData.pulse) {
        const pulse = 0.97 + 0.03 * Math.sin(t * 4); // Much subtler pulse
        mesh.scale.set(pulse, pulse * 0.6, pulse * 0.7);
      }

      // Slower rotation
      mesh.rotation.x += mesh.userData.rotationXSpeed;
      mesh.rotation.y += mesh.userData.rotationYSpeed;

      // Softer, more subtle blur animation
      const base = 8; // Reduced base blur
      const range = 4; // Smaller oscillation range
      const noise = Math.sin(t * 0.4) * range; // Slower oscillation
      const jitter = (Math.random() - 0.5) * 0.4; // Reduced random shake
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
        top: "40%",
        left: "50%",
        transform: isLoaded
          ? "translate(-50%, -50%) scale(0.8)" // Just this line changed
          : "translate(-50%, -50%) scale(1.04)",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 1,
        opacity: isLoaded ? 1 : 0,
        filter: isLoaded ? `blur(${dynamicBlur.toFixed(1)}px)` : "blur(64px)",
        pointerEvents: "none",
        transition:
          "opacity 1.5s ease-out, transform 1.5s ease-out, filter 0.5s ease-out",
        backdropFilter: "blur(2px)",
      }}
    />
  );
};

export default Blob;
