import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Blob = ({
  color = "#eb1736",
  wireframe = false,
}) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

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
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
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
                     * sin(pos.y * 2.5 + u_time * 0.6)
                     * sin(pos.z * 2.2 + u_time * 0.5);

        float noise2 = sin(pos.x * 4.5 + u_time * 1.2)
                     * cos(pos.y * 3.8 + u_time * 0.9)
                     * sin(pos.z * 4.2 + u_time * 1.1);

        float combinedNoise = noise1 * 0.7 + noise2 * 0.3;
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
      if (width < 480) return 0.6;   // tiny phones
      if (width < 768) return 0.9;   // tablets
      if (width < 1200) return 1.2;  // small desktops
      return 1.6;                     // large desktops
    };

    const updateForScreen = () => {
      const scale = getScaleFactor();

      // Mobile: slower rotation + subtle pulsing
      if (window.innerWidth < 768) {
        uniforms.u_stretchAmp.value = 0.1;
        mesh.userData.rotationXSpeed = 0.0001;
        mesh.userData.rotationYSpeed = 0.0001;
        mesh.userData.pulse = true;
      } else {
        uniforms.u_stretchAmp.value = 0.2;
        mesh.userData.rotationXSpeed = 0.00015;
        mesh.userData.rotationYSpeed = 0.0002;
        mesh.userData.pulse = false;
      }

      mesh.scale.set(scale, scale * 0.6, scale * 0.8);
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
        const pulse = 0.95 + 0.05 * Math.sin(t * 4);
        mesh.scale.set(pulse, pulse * 0.6, pulse * 0.8);
      }

      mesh.rotation.x += mesh.userData.rotationXSpeed;
      mesh.rotation.y += mesh.userData.rotationYSpeed;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ----- SHOW AFTER SHORT DELAY -----
    setTimeout(() => setIsLoaded(true), 10);

    // ----- CLEANUP -----
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", updateForScreen);
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
        height: "67%",   // adjust as needed
        maxHeight: "100%",
        overflow: "hidden",
        zIndex: 1,
        opacity: isLoaded ? 1 : 0,
        filter: isLoaded ? "blur(26px)" : "blur(64px)",
        transform: isLoaded ? "translateY(20px) scale(1)" : "translateY(0px) scale(1.3)",
        pointerEvents: "none",
        transition: "opacity 1.2s ease-out, filter 1.2s ease-out, transform 1.2s ease-out",
      }}
    />
  );
};

export default Blob;
