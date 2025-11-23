import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BlobParticles = ({
  color = "#eb1736",
  bloomStrength = 12,
  bloomRadius = 2,
  bloomThreshold = 2.25,
  wireframe = false,
}) => {
  const mountRef = useRef(null);
  const animationRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const clock = new THREE.Clock();

    // --- ADDED: random stretch direction (XYZ)
    const stretchSeed = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();

    // Shaders
    const vertexShader = `
      uniform float u_time;
      uniform float u_frequency;

      // --- ADDED ---
      uniform float u_stretchAmp;
      uniform vec3 u_stretchSeed;

      varying vec3 vNormal;

      void main() {
        vNormal = normal;
        vec3 pos = position;

        // Cloud-like deformation with more varied noise
        float noise1 = sin(pos.x * 2.0 + u_time * 0.8)
                     * sin(pos.y * 2.5 + u_time * 0.6)
                     * sin(pos.z * 2.2 + u_time * 0.5);
        
        float noise2 = sin(pos.x * 4.5 + u_time * 1.2)
                     * cos(pos.y * 3.8 + u_time * 0.9)
                     * sin(pos.z * 4.2 + u_time * 1.1);
        
        // Combine noises for more organic, cloud-like bumps
        float combinedNoise = noise1 * 0.7 + noise2 * 0.3;
        
        float freq = u_frequency / 255.0;
        pos += normal * combinedNoise * (0.5 + freq * 0.3);

        // --- NEW STRETCH EFFECT ---
        // smooth variation over time
        float s = sin(u_time * 0.9) * 0.5 + 0.5;
        vec3 stretch = u_stretchSeed * u_stretchAmp * s;

        // apply stretch by scaling position by slightly different factors
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
        // Softer lighting for cloud-like appearance
        float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.4 + 0.6;
        vec3 brightColor = vec3(u_red, u_green, u_blue);
        vec3 darkColor = brightColor * 0.5;
        vec3 color = mix(darkColor, brightColor, intensity);
        gl_FragColor = vec4(color, 0.85);
      }
    `;

    const uniforms = {
      u_time: { value: 0 },
      u_frequency: { value: 0 },
      u_red: { value: 0 },
      u_green: { value: 0 },
      u_blue: { value: 0 },

      // --- ADDED ---
      u_stretchAmp: { value: 0.2 }, // adjust strength here
      u_stretchSeed: { value: stretchSeed },
    };

    const col = new THREE.Color(color);
    uniforms.u_red.value = col.r;
    uniforms.u_green.value = col.g;
    uniforms.u_blue.value = col.b;

    const geo = new THREE.IcosahedronGeometry(4, 30);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      wireframe,
    });

    const mesh = new THREE.Mesh(geo, mat);
    
    // Make it wider than tall (scale x and z more than y)
    mesh.scale.set(1.6, 1.0, 1.3);
    
    scene.add(mesh);

    // Trigger animation after a brief delay
    setTimeout(() => setIsLoaded(true), 100);

    // Animation
    const animate = () => {
      const t = clock.getElapsedTime();
      uniforms.u_time.value = t;

      // Slower, more gentle rotation for cloud-like movement
      mesh.rotation.x += 0.00015;
      mesh.rotation.y += 0.0002;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      mount.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
    };
  }, [color, bloomStrength, bloomRadius, bloomThreshold, wireframe]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "75%",
        zIndex: 1,
        opacity: isLoaded ? 1 : 0,
        filter: isLoaded ? "blur(26px)" : "blur(60px)",
        transform: isLoaded ? "scale(1)" : "scale(1.3)",
        pointerEvents: "none",
        transition: "opacity 1.2s ease-out, filter 1.2s ease-out, transform 1.2s ease-out",
      }}
    />
  );
};

export default BlobParticles;