import React, { useEffect, useRef } from "react";
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

        // Existing wavy deformation
        float noise = sin(pos.x * 3.0 + u_time * 2.0)
                    * sin(pos.y * 3.0 + u_time * 1.6)
                    * sin(pos.z * 3.0 + u_time * 1.2);
        float freq = u_frequency / 255.0;
        pos += normal * noise * (0.35 + freq * 0.25);

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
        float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
        vec3 brightColor = vec3(u_red, u_green, u_blue);
        vec3 darkColor = brightColor * 0.3;
        vec3 color = mix(darkColor, brightColor, intensity);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      u_time: { value: 0 },
      u_frequency: { value: 0 },
      u_red: { value: 0 },
      u_green: { value: 0 },
      u_blue: { value: 0 },

      // --- ADDED ---
      u_stretchAmp: { value: 0.15 }, // adjust strength here
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
    scene.add(mesh);

    // Animation
    const animate = () => {
      const t = clock.getElapsedTime();
      uniforms.u_time.value = t;

      // Existing auto-rotation
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.004;

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
        opacity: 0.9,
        filter: "blur(18px)",
        pointerEvents: "none",
      }}
    />
  );
};

export default BlobParticles;
