import React, { useEffect, useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, MeshReflectorMaterial } from "@react-three/drei";
import { useControls, folder } from "leva";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// 4D Perlin noise (Classic Perlin by Stefan Gustavson)
const noise4D = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec4 P){
  vec4 Pi0 = floor(P);
  vec4 Pi1 = Pi0 + 1.0;
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec4 Pf0 = fract(P);
  vec4 Pf1 = Pf0 - 1.0;
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = vec4(Pi0.zzzz);
  vec4 iz1 = vec4(Pi1.zzzz);
  vec4 iw0 = vec4(Pi0.wwww);
  vec4 iw1 = vec4(Pi1.wwww);

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 ixy00 = permute(ixy0 + iw0);
  vec4 ixy01 = permute(ixy0 + iw1);
  vec4 ixy10 = permute(ixy1 + iw0);
  vec4 ixy11 = permute(ixy1 + iw1);

  vec4 gx00 = ixy00 / 7.0;
  vec4 gy00 = floor(gx00) / 7.0;
  vec4 gz00 = floor(gy00) / 6.0;
  gx00 = fract(gx00) - 0.5;
  gy00 = fract(gy00) - 0.5;
  gz00 = fract(gz00) - 0.5;
  vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
  vec4 sw00 = step(gw00, vec4(0.0));
  gx00 -= sw00 * (step(0.0, gx00) - 0.5);
  gy00 -= sw00 * (step(0.0, gy00) - 0.5);

  vec4 gx01 = ixy01 / 7.0;
  vec4 gy01 = floor(gx01) / 7.0;
  vec4 gz01 = floor(gy01) / 6.0;
  gx01 = fract(gx01) - 0.5;
  gy01 = fract(gy01) - 0.5;
  gz01 = fract(gz01) - 0.5;
  vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
  vec4 sw01 = step(gw01, vec4(0.0));
  gx01 -= sw01 * (step(0.0, gx01) - 0.5);
  gy01 -= sw01 * (step(0.0, gy01) - 0.5);

  vec4 gx10 = ixy10 / 7.0;
  vec4 gy10 = floor(gx10) / 7.0;
  vec4 gz10 = floor(gy10) / 6.0;
  gx10 = fract(gx10) - 0.5;
  gy10 = fract(gy10) - 0.5;
  gz10 = fract(gz10) - 0.5;
  vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
  vec4 sw10 = step(gw10, vec4(0.0));
  gx10 -= sw10 * (step(0.0, gx10) - 0.5);
  gy10 -= sw10 * (step(0.0, gy10) - 0.5);

  vec4 gx11 = ixy11 / 7.0;
  vec4 gy11 = floor(gx11) / 7.0;
  vec4 gz11 = floor(gy11) / 6.0;
  gx11 = fract(gx11) - 0.5;
  gy11 = fract(gy11) - 0.5;
  gz11 = fract(gz11) - 0.5;
  vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
  vec4 sw11 = step(gw11, vec4(0.0));
  gx11 -= sw11 * (step(0.0, gx11) - 0.5);
  gy11 -= sw11 * (step(0.0, gy11) - 0.5);

  vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
  vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
  vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
  vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
  vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
  vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
  vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
  vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
  vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
  vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
  vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
  vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
  vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
  vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
  vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
  vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

  vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
  g0000 *= norm00.x;
  g0100 *= norm00.y;
  g1000 *= norm00.z;
  g1100 *= norm00.w;

  vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
  g0001 *= norm01.x;
  g0101 *= norm01.y;
  g1001 *= norm01.z;
  g1101 *= norm01.w;

  vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
  g0010 *= norm10.x;
  g0110 *= norm10.y;
  g1010 *= norm10.z;
  g1110 *= norm10.w;

  vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
  g0011 *= norm11.x;
  g0111 *= norm11.y;
  g1011 *= norm11.z;
  g1111 *= norm11.w;

  float n0000 = dot(g0000, Pf0);
  float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
  float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
  float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
  float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
  float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
  float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
  float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
  float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
  float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
  float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
  float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
  float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
  float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
  float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
  float n1111 = dot(g1111, Pf1);

  vec4 fade_xyzw = fade(Pf0);
  vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
  vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
  vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
  vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
  float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
  return 2.2 * n_xyzw;
}
`;

// Create cube map for reflections
function createCubeMap() {
  const images = [];
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext("2d");

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let j = 0; j < (canvas.width * canvas.height) / 2; j++) {
      ctx.fillStyle = Math.random() < 0.5 ? "#a8a9ad" : "#646464";
      ctx.fillRect(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
        2,
        1
      );
    }
    images.push(canvas.toDataURL());
  }

  return new THREE.CubeTextureLoader().load(images);
}

// Global uniforms shared between passes
const globalUniforms = {
  bloom: { value: 0 },
  time: { value: 0 },
};

// IsoNoise Sphere Component
const IsoNoiseSphere = ({ config }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  const cubeMap = useMemo(() => createCubeMap(), []);

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1, config.detail);
  }, [config.detail]);

  // Create material with shader modifications
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      roughness: config.roughness,
      metalness: config.metalness,
      envMap: cubeMap,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.bloom = globalUniforms.bloom;
      shader.uniforms.time = globalUniforms.time;
      shader.uniforms.color1 = { value: new THREE.Color(config.color1) };
      shader.uniforms.color2 = { value: new THREE.Color(config.color2) };
      shader.uniforms.noiseScale = { value: config.noiseScale };
      shader.uniforms.noiseStrength = { value: config.noiseStrength };
      shader.uniforms.gridScale = { value: config.gridScale };

      // Store shader ref for updates
      mat.userData.shader = shader;

      shader.vertexShader = `
        uniform float time;
        uniform float noiseScale;
        uniform float noiseStrength;
        varying vec3 rPos;
        ${noise4D}
        float noise(vec3 p){
          return cnoise(vec4(p, time));
        }
        vec3 getPos(vec3 p){
          return p * (4. + noise(p * noiseScale) * noiseStrength);
        }
        ${shader.vertexShader}
      `
        .replace(
          `#include <beginnormal_vertex>`,
          `#include <beginnormal_vertex>
          
          vec3 p0 = getPos(position);
          
          float theta = .1; 
          vec3 vecTangent = normalize(cross(p0, vec3(1.0, 0.0, 0.0)) + cross(p0, vec3(0.0, 1.0, 0.0)));
          vec3 vecBitangent = normalize(cross(vecTangent, p0));
          vec3 ptTangentSample = getPos(normalize(p0 + theta * normalize(vecTangent)));
          vec3 ptBitangentSample = getPos(normalize(p0 + theta * normalize(vecBitangent)));
          
          objectNormal = normalize(cross(ptBitangentSample - p0, ptTangentSample - p0));
        `
        )
        .replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          transformed = p0;
          rPos = transformed;
        `
        );

      shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float bloom;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float gridScale;
        varying vec3 rPos;
        ${shader.fragmentShader}
      `
        .replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `
          vec3 col = mix(color1, color2, ss(2., 6., length(rPos)));
          vec4 diffuseColor = vec4( col, opacity );
        `
        )
        .replace(
          `#include <dithering_fragment>`,
          `#include <dithering_fragment>
          
          float coord = length(rPos) * gridScale;
          float line = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / 1.25;
          float grid = 1.0 - min(line, 1.0);
          
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0), bloom);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, col * 2., grid);
        `
        );
    };

    return mat;
  }, [cubeMap, config.detail]);

  // Update uniforms when config changes
  useEffect(() => {
    if (materialRef.current?.userData?.shader) {
      const shader = materialRef.current.userData.shader;
      shader.uniforms.color1.value.set(config.color1);
      shader.uniforms.color2.value.set(config.color2);
      shader.uniforms.noiseScale.value = config.noiseScale;
      shader.uniforms.noiseStrength.value = config.noiseStrength;
      shader.uniforms.gridScale.value = config.gridScale;
    }
    if (materialRef.current) {
      materialRef.current.roughness = config.roughness;
      materialRef.current.metalness = config.metalness;
    }
  }, [config]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      scale={config.scale}
      position={[0, config.positionY, 0]}
    >
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
};

// Reflective floor
const ReflectiveFloor = ({ config }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, config.floorY, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        resolution={2048}
        mirror={config.floorMirror}
        mixBlur={config.floorBlur}
        mixStrength={config.floorMixStrength}
        blur={[200, 50]}
        color={config.floorColor}
        metalness={config.floorMetalness}
        roughness={config.floorRoughness}
      />
    </mesh>
  );
};

// Post-processing with selective bloom
const Effects = ({ config }) => {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef();
  const bloomComposerRef = useRef();

  useEffect(() => {
    // Bloom composer
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      config.bloomStrength,
      config.bloomRadius,
      config.bloomThreshold
    );

    bloomComposerRef.current = new EffectComposer(gl);
    bloomComposerRef.current.renderToScreen = false;
    bloomComposerRef.current.addPass(renderScene);
    bloomComposerRef.current.addPass(bloomPass);

    // Final composer
    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: {
            value: bloomComposerRef.current.renderTarget2.texture,
          },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv);
          }
        `,
      }),
      "baseTexture"
    );
    finalPass.needsSwap = true;

    composerRef.current = new EffectComposer(gl);
    composerRef.current.addPass(renderScene);
    composerRef.current.addPass(finalPass);

    return () => {
      composerRef.current?.dispose();
      bloomComposerRef.current?.dispose();
    };
  }, [gl, scene, camera, size]);

  // Handle resize
  useEffect(() => {
    if (composerRef.current && bloomComposerRef.current) {
      composerRef.current.setSize(size.width, size.height);
      bloomComposerRef.current.setSize(size.width, size.height);
    }
  }, [size]);

  useFrame(({ clock }) => {
    if (
      !composerRef.current ||
      !bloomComposerRef.current ||
      !config.enableBloom
    ) {
      return;
    }

    const t = clock.getElapsedTime();
    globalUniforms.time.value = t * config.animationSpeed;

    // Bloom pass
    globalUniforms.bloom.value = 1;
    bloomComposerRef.current.render();

    // Final pass
    globalUniforms.bloom.value = 0;
    composerRef.current.render();
  }, 1);

  // If bloom disabled, just update time
  useFrame(({ clock }) => {
    if (config.enableBloom) return;
    globalUniforms.time.value = clock.getElapsedTime() * config.animationSpeed;
  });

  return null;
};

// Main scene
const Scene = ({ config, onLoaded }) => {
  const { scene } = useThree();

  // Set background color
  useEffect(() => {
    if (config.transparentBg) {
      scene.background = null;
    } else {
      scene.background = new THREE.Color(config.bgColor);
    }
  }, [scene, config.transparentBg, config.bgColor]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  return (
    <>
      <IsoNoiseSphere config={config} />
      {config.showFloor && <ReflectiveFloor config={config} />}

      <directionalLight
        position={[config.lightX, config.lightY, config.lightZ]}
        intensity={config.directionalIntensity}
      />
      <ambientLight intensity={config.ambientIntensity} />

      <OrbitControls
        enableZoom={config.enableZoom}
        enablePan={config.enablePan}
        enableDamping
        autoRotate={config.autoRotate}
        autoRotateSpeed={config.autoRotateSpeed}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.6}
      />

      {config.enableBloom && <Effects config={config} />}
    </>
  );
};

const Experience = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Leva controls
  const config = useControls({
    Object: folder({
      scale: { value: 0.5, min: 0.1, max: 2, step: 0.05 },
      positionY: { value: 0, min: -5, max: 10, step: 0.1 },
      color1: { value: "#ff3232" },
      color2: { value: "#0032ff" },
      roughness: { value: 0.125, min: 0, max: 1, step: 0.01 },
      metalness: { value: 0.875, min: 0, max: 1, step: 0.01 },
      detail: { value: 70, min: 10, max: 100, step: 5 },
    }),
    Noise: folder({
      noiseScale: { value: 3, min: 0.5, max: 10, step: 0.1 },
      noiseStrength: { value: 2, min: 0, max: 5, step: 0.1 },
      gridScale: { value: 4, min: 1, max: 10, step: 0.5 },
      animationSpeed: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
    }),
    Floor: folder({
      showFloor: { value: true },
      floorY: { value: -2.8, min: -10, max: 0, step: 0.1 },
      floorColor: { value: "#e8e8e8" },
      floorMirror: { value: 0.75, min: 0, max: 1, step: 0.05 },
      floorBlur: { value: 0.5, min: 0, max: 10, step: 0.1 },
      floorMixStrength: { value: 1.2, min: 0, max: 2, step: 0.1 },
      floorMetalness: { value: 0.5, min: 0, max: 1, step: 0.05 },
      floorRoughness: { value: 0.05, min: 0, max: 1, step: 0.05 },
    }),
    Bloom: folder({
      enableBloom: { value: true },
      bloomStrength: { value: 0.6, min: 0, max: 3, step: 0.1 },
      bloomRadius: { value: 0, min: 0, max: 1, step: 0.05 },
      bloomThreshold: { value: 0.2, min: 0, max: 1, step: 0.05 },
    }),
    Lighting: folder({
      directionalIntensity: { value: 3.1, min: 0, max: 5, step: 0.1 },
      ambientIntensity: { value: 0.1, min: 0, max: 2, step: 0.05 },
      lightX: { value: 2, min: -10, max: 10, step: 0.5 },
      lightY: { value: 1, min: -10, max: 10, step: 0.5 },
      lightZ: { value: 1, min: -10, max: 10, step: 0.5 },
    }),
    Background: folder({
      transparentBg: { value: false },
      bgColor: { value: "#f0f0f0" },
    }),
    Controls: folder({
      autoRotate: { value: false },
      autoRotateSpeed: { value: 0.9, min: 0, max: 5, step: 0.1 },
      enableZoom: { value: false },
      enablePan: { value: true },
    }),
  });

  useEffect(() => {
    if (isLoaded) {
      document.body.classList.remove("loading");
    }
  }, [isLoaded]);

  return (
    <div
      className="canvas-wrapper"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
      }}
    >
      <Canvas
        camera={{
          position: [0, 2, 12],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          toneMapping: THREE.ReinhardToneMapping,
          antialias: true,
          alpha: config.transparentBg,
        }}
        dpr={[1, 2]}
        style={{
          background: config.transparentBg ? "transparent" : config.bgColor,
        }}
      >
        <Suspense fallback={null}>
          <Scene config={config} onLoaded={() => setIsLoaded(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
