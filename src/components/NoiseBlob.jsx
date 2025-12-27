import React, { useRef, useEffect } from "react";
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

// Check if viewport is mobile/portrait tablet
const isMobileOrPortrait = () => {
  return (
    window.innerWidth <= 768 ||
    (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)
  );
};

// 4D Simplex Noise GLSL (by Ian McEwan, Ashima Arts)
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
  const vec2  C = vec2( 0.138196601125010504,
                        0.309016994374947451);
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}
`;

/**
 * NoiseBlob - An animated 3D blob with simplex noise displacement
 */
export default function NoiseBlob({
  // === APPEARANCE ===
  color = "#ffffff", // Blob surface color
  emissiveColor = "#0000ff", // Glow/emissive color
  emissiveIntensity = 0.05, // How strong the glow is (0-1)
  backgroundColor = "#ffffff", // Scene background
  shininess = 300, // Surface shininess (0-1000)
  wireframe = false, // Show wireframe instead of solid

  // === ANIMATION ===
  speed = 0.15, // Animation speed (0.01=slow, 0.3=fast)

  // === NOISE SHAPE ===
  noiseScale = 0.875, // Noise frequency (higher = more bumps)
  noiseAmplitude = 0.35, // Bump height (0=smooth sphere, 1=very bumpy)

  // === SIZE ===
  baseScale = 3.5, // Base radius of the blob
  detail = 250, // Mesh detail (50=fast, 300=smooth)

  // === CAMERA ===
  cameraDistance = 10, // Distance from blob
  fov = 70, // Field of view

  // === CONTROLS ===
  enableControls = true, // Allow mouse/touch interaction
  enableZoom = true, // Allow scroll to zoom
  autoRotate = false, // Auto-spin the view
  autoRotateSpeed = 2, // Spin speed when autoRotate=true

  // === LIGHTING ===
  ambientIntensity = 1, // Ambient light strength
  directionalIntensity = 0.5, // Main light strength
  hemisphereIntensity = 0.375, // Sky/ground light strength

  // === MOBILE/PORTRAIT RESPONSIVE ===
  mobileScaleMultiplier = 1.4, // How much larger the blob is on mobile (1 = same size)
  mobileCameraYOffset = 6, // How much to move camera up on mobile (blob appears lower)

  // === CONTAINER ===
  className = "",
  style = {},
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const cleanedUpRef = useRef(false);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const uniformsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double initialization from StrictMode
    cleanedUpRef.current = false;

    // Clear any existing canvas
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Scene setup
    const scene = new Scene();
    scene.background = new Color(backgroundColor);
    sceneRef.current = scene;

    // Determine initial responsive settings
    const mobile = isMobileOrPortrait();
    const initialCameraY = mobile ? mobileCameraYOffset : 0;
    const initialScale = mobile ? baseScale * mobileScaleMultiplier : baseScale;

    // Camera
    const camera = new PerspectiveCamera(
      fov,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.set(0, initialCameraY, cameraDistance);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enabled = enableControls;
    controls.enableZoom = enableZoom;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.target.set(0, 0, 0);

    // Uniforms
    const uniforms = {
      time: { value: 0 },
      noiseScale: { value: noiseScale },
      noiseAmplitude: { value: noiseAmplitude },
      baseScale: { value: initialScale },
    };
    uniformsRef.current = uniforms;

    // Lights
    const directionalLight = new DirectionalLight(
      0xffffff,
      directionalIntensity
    );
    directionalLight.position.setScalar(1);
    const hemisphereLight = new HemisphereLight(
      0xffff00,
      0x0000ff,
      hemisphereIntensity
    );
    const ambientLight = new AmbientLight(0xffffff, ambientIntensity);
    scene.add(directionalLight, hemisphereLight, ambientLight);

    // Geometry
    let geometry = new IcosahedronGeometry(1, detail);
    geometry.deleteAttribute("normal");
    geometry.deleteAttribute("uv");
    geometry = mergeVertices(geometry);
    geometry.computeVertexNormals();

    // Material with custom shader
    const material = new MeshPhongMaterial({
      color: new Color(color),
      emissive: new Color(emissiveColor).multiplyScalar(emissiveIntensity),
      shininess: shininess,
      wireframe: wireframe,
      onBeforeCompile: (shader) => {
        shader.uniforms.time = uniforms.time;
        shader.uniforms.noiseScale = uniforms.noiseScale;
        shader.uniforms.noiseAmplitude = uniforms.noiseAmplitude;
        shader.uniforms.baseScale = uniforms.baseScale;

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
            n *= n;
            return n;
          }
          vec3 getPos(vec3 p){
            return p * (baseScale + noise(p * noiseScale) * noiseAmplitude);
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
          `
          );
      },
    });

    // Mesh
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // Clock
    const clock = new Clock();

    // Handle resize with responsive adjustments
    const handleResize = () => {
      if (!container || cleanedUpRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Update camera position and scale based on screen size
      const mobile = isMobileOrPortrait();
      camera.position.y = mobile ? mobileCameraYOffset : 0;
      camera.position.z = cameraDistance;
      controls.target.set(0, 0, 0);
      controls.update();

      // Update blob scale
      if (uniformsRef.current) {
        uniformsRef.current.baseScale.value = mobile
          ? baseScale * mobileScaleMultiplier
          : baseScale;
      }
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      if (cleanedUpRef.current) return;
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      uniforms.time.value = clock.getElapsedTime() * speed;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cleanedUpRef.current = true;
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      uniformsRef.current = null;
    };
  }, [
    color,
    emissiveColor,
    emissiveIntensity,
    backgroundColor,
    speed,
    noiseScale,
    noiseAmplitude,
    baseScale,
    detail,
    shininess,
    wireframe,
    cameraDistance,
    fov,
    enableControls,
    enableZoom,
    autoRotate,
    autoRotateSpeed,
    ambientIntensity,
    directionalIntensity,
    hemisphereIntensity,
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
        transform: isMobileOrPortrait() ? "translateY(50%)" : "",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
