import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  AmbientLight,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";

const isMobileOrPortrait = () => {
  return (
    window.innerWidth <= 768 ||
    (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)
  );
};

// Generate random value within range
const randomInRange = (min, max) => Math.random() * (max - min) + min;

// Generate random integer within range
const randomIntInRange = (min, max) => Math.floor(randomInRange(min, max + 1));

const noiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;
  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 
  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2(0.138196601125010504, 0.309016994374947451);
  vec4 i  = floor(v + dot(v, C.yyyy));
  vec4 x0 = v - i + dot(i, C.xxxx);

  vec4 i0;
  vec3 isX = step(x0.yzw, x0.xxx);
  vec3 isYZ = step(x0.zww, x0.yyz);
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  vec4 i3 = clamp(i0, 0.0, 1.0);
  vec4 i2 = clamp(i0 - 1.0, 0.0, 1.0);
  vec4 i1 = clamp(i0 - 2.0, 0.0, 1.0);

  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute(permute(permute(permute(
    i.w + vec4(i1.w, i2.w, i3.w, 1.0))
    + i.z + vec4(i1.z, i2.z, i3.z, 1.0))
    + i.y + vec4(i1.y, i2.y, i3.y, 1.0))
    + i.x + vec4(i1.x, i2.x, i3.x, 1.0));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);

  vec4 p0 = grad4(j0, ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
  m0 *= m0;
  m1 *= m1;

  return 49.0 * (
    dot(m0*m0, vec3(dot(p0,x0), dot(p1,x1), dot(p2,x2))) +
    dot(m1*m1, vec2(dot(p3,x3), dot(p4,x4)))
  );
}
`;

export default function NoiseBlob({
  // Theme props
  isDark = false,

  // Color props (can be overridden, but will default based on theme)
  color: colorProp,
  emissiveColor: emissiveColorProp,
  backgroundColor: backgroundColorProp,

  // Other props - these will be randomized if not provided
  shininess: shininessProp,
  wireframe = false,
  speed: speedProp,
  noiseScale: noiseScaleProp,
  noiseAmplitude: noiseAmplitudeProp,
  baseScale: baseScaleProp,
  detail: detailProp,
  cameraDistance = 10,
  fov = 70,
  enableControls = false,
  enableZoom = false,
  autoRotate = false,
  autoRotateSpeed = 2,
  ambientIntensity = 1,
  directionalIntensity: directionalIntensityProp,
  hemisphereIntensity: hemisphereIntensityProp,
  mobileScaleMultiplier: mobileScaleMultiplierProp,
  mobileCameraYOffset = 6,
  className = "",
  style = {},
  isGenerating = false,
  transitionSpeed = 2.0,
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const cleanedUpRef = useRef(false);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const uniformsRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  // Generate randomized values once on mount
  const randomizedProps = useMemo(
    () => ({
      shininess: shininessProp ?? randomInRange(400, 800),
      speed: speedProp ?? randomInRange(0.04, 0.22),
      noiseScale: noiseScaleProp ?? randomInRange(0.125, 0.875),
      noiseAmplitude: noiseAmplitudeProp ?? randomInRange(0.1, 0.75),
      baseScale: baseScaleProp ?? randomInRange(2.5, 4.1),
      detail: detailProp ?? randomIntInRange(80, 200),
      directionalIntensity: directionalIntensityProp ?? randomInRange(0.2, 0.7),
      hemisphereIntensity: hemisphereIntensityProp ?? randomInRange(0.125, 0.5),
      mobileScaleMultiplier:
        mobileScaleMultiplierProp ?? randomInRange(0.4, 0.75),
    }),
    []
  ); // Empty deps = only run once on mount

  const {
    shininess,
    speed,
    noiseScale,
    noiseAmplitude,
    baseScale,
    detail,
    directionalIntensity,
    hemisphereIntensity,
    mobileScaleMultiplier,
  } = randomizedProps;

  // Memoize colors based on theme to prevent unnecessary recalculations
  const colors = useMemo(
    () => ({
      light: {
        background: "#ffffff",
        blob: "#ffffff",
        emissive: "#ffffff",
      },
      dark: {
        background: "#111111",
        blob: "#222222",
        emissive: "#333333",
      },
    }),
    []
  );

  // Compute colors based on theme
  const computedColors = useMemo(
    () => ({
      backgroundColor:
        backgroundColorProp ||
        (isDark ? colors.dark.background : colors.light.background),
      color: colorProp || (isDark ? colors.dark.blob : colors.light.blob),
      emissiveColor:
        emissiveColorProp ||
        (isDark ? colors.dark.emissive : colors.light.emissive),
    }),
    [isDark, colorProp, emissiveColorProp, backgroundColorProp, colors]
  );

  const targetAmplitudeRef = useRef(noiseAmplitude);

  // Handle isGenerating prop changes
  useEffect(() => {
    if (isGenerating) {
      targetAmplitudeRef.current = 0.8;
    } else {
      targetAmplitudeRef.current = noiseAmplitude;
    }
  }, [isGenerating, noiseAmplitude]);

  // Update colors when theme changes - THIS IS THE KEY FIX
  useEffect(() => {
    if (!sceneRef.current || !meshRef.current) return;

    const { backgroundColor, color, emissiveColor } = computedColors;

    // Update scene background
    sceneRef.current.background = new Color(backgroundColor);

    // Update material colors
    const material = meshRef.current.material;
    if (material) {
      material.color = new Color(color);
      material.emissive = new Color(emissiveColor).multiplyScalar(0.25);
      material.opacity = isDark ? 0.9 : 0.95;
      material.shininess = isDark ? 300 : shininess;
      material.needsUpdate = true; // Force material update
    }

    // Update renderer clear color
    if (rendererRef.current) {
      rendererRef.current.setClearColor(new Color(backgroundColor), 0);
    }
  }, [computedColors, isDark, shininess]);

  // Main Three.js initialization
  useEffect(() => {
    if (!containerRef.current) return;

    let initTimeout;
    let idleCallbackId;

    const initThreeJS = () => {
      if (cleanedUpRef.current || !containerRef.current) return;

      const container = containerRef.current;
      container.innerHTML = "";

      const { backgroundColor, color, emissiveColor } = computedColors;

      const scene = new Scene();
      scene.background = new Color(backgroundColor);
      sceneRef.current = scene;

      const mobile = isMobileOrPortrait();
      const initialCameraY = mobile ? mobileCameraYOffset : 0;
      const initialScale = mobile
        ? baseScale * mobileScaleMultiplier
        : baseScale;

      const camera = new PerspectiveCamera(
        fov,
        container.clientWidth / container.clientHeight,
        1,
        1000
      );
      camera.position.set(0, initialCameraY, cameraDistance);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(new Color(backgroundColor), 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enabled = enableControls;
      controls.enableZoom = enableZoom;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = autoRotateSpeed;

      const uniforms = {
        time: { value: 0 },
        noiseScale: { value: noiseScale },
        noiseAmplitude: { value: noiseAmplitude },
        baseScale: { value: initialScale },
      };
      uniformsRef.current = uniforms;

      // Lighting - adjust for theme
      const dirLightIntensity = isDark
        ? directionalIntensity * 0.7
        : directionalIntensity;
      const hemiLightIntensity = isDark
        ? hemisphereIntensity * 0.7
        : hemisphereIntensity;
      const ambLightIntensity = isDark
        ? ambientIntensity * 0.7
        : ambientIntensity;

      const directionalLight = new DirectionalLight(
        0xffffff,
        dirLightIntensity
      );
      const hemisphereLight = new HemisphereLight(
        0xffff00,
        0x0000ff,
        hemiLightIntensity
      );
      const ambientLight = new AmbientLight(0xffffff, ambLightIntensity);

      scene.add(directionalLight, hemisphereLight, ambientLight);

      let geometry = new IcosahedronGeometry(1, detail);
      geometry.deleteAttribute("normal");
      geometry.deleteAttribute("uv");
      geometry = mergeVertices(geometry);
      geometry.computeVertexNormals();

      const material = new MeshPhongMaterial({
        color: new Color(color),
        emissive: new Color(emissiveColor).multiplyScalar(0.25),
        shininess: isDark ? 300 : shininess,
        wireframe,
        transparent: true,
        opacity: isDark ? 0.9 : 0.95,
        onBeforeCompile(shader) {
          shader.uniforms = { ...shader.uniforms, ...uniforms };

          shader.vertexShader = `
            uniform float time;
            uniform float noiseScale;
            uniform float noiseAmplitude;
            uniform float baseScale;
            ${noiseGLSL}
            float noise(vec3 p){
              float n = snoise(vec4(p, time));
              n = sin(n * 3.1415926 * 8.);
              n = n * 0.5 + 0.5;
              return n * n;
            }
            vec3 getPos(vec3 p){
              return p * (baseScale + noise(p * noiseScale) * noiseAmplitude);
            }
            ${shader.vertexShader}
          `
            .replace(
              "#include <beginnormal_vertex>",
              `#include <beginnormal_vertex>
               vec3 p0 = getPos(position);
               float theta = .1;
               vec3 t = normalize(cross(p0, vec3(1,0,0)) + cross(p0, vec3(0,1,0)));
               vec3 b = normalize(cross(t, p0));
               vec3 pt = getPos(normalize(p0 + theta * t));
               vec3 pb = getPos(normalize(p0 + theta * b));
               objectNormal = normalize(cross(pb - p0, pt - p0));`
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
               transformed = p0;`
            );
        },
      });

      const mesh = new Mesh(geometry, material);
      scene.add(mesh);
      meshRef.current = mesh;

      const clock = new Clock();
      let lastTime = 0;

      const animate = () => {
        if (cleanedUpRef.current) return;
        animationIdRef.current = requestAnimationFrame(animate);

        const t = clock.getElapsedTime();
        const dt = t - lastTime;
        lastTime = t;

        if (uniformsRef.current) {
          uniformsRef.current.noiseAmplitude.value +=
            (targetAmplitudeRef.current -
              uniformsRef.current.noiseAmplitude.value) *
            (1 - Math.exp(-transitionSpeed * dt));

          uniformsRef.current.time.value = t * speed;
        }
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
      setInitialized(true);
    };

    cleanedUpRef.current = false;

    if ("requestIdleCallback" in window) {
      idleCallbackId = requestIdleCallback(() => {
        initTimeout = setTimeout(initThreeJS, 0);
      });
    } else {
      initTimeout = setTimeout(initThreeJS, 50);
    }

    const handleResize = () => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cleanedUpRef.current = true;
      if (idleCallbackId) cancelIdleCallback(idleCallbackId);
      if (initTimeout) clearTimeout(initTimeout);
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        const domElement = rendererRef.current.domElement;
        if (domElement && domElement.parentNode) {
          domElement.parentNode.removeChild(domElement);
        }
      }
    };
  }, [
    // Only re-initialize on mount and when these props change
    detail,
    cameraDistance,
    fov,
    enableControls,
    enableZoom,
    autoRotate,
    autoRotateSpeed,
    mobileScaleMultiplier,
    mobileCameraYOffset,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        opacity: initialized ? 1 : 0,
        transition: "opacity 0.5s ease-in",
        ...style,
      }}
    />
  );
}
