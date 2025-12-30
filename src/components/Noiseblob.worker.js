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
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

let renderer = null;
let scene = null;
let camera = null;
let mesh = null;
let uniforms = null;
let clock = null;
let animationId = null;
let config = {};

let rotation = {
  y: 0,
  targetY: 0,
  x: 0,
  targetX: 0,
  dragging: false,
};

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
  const vec2  C = vec2( 0.138196601125010504, 0.309016994374947451);
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
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}
`;

function init(canvas, cfg) {
  config = cfg;

  scene = new Scene();
  scene.background = new Color(config.backgroundColor);

  camera = new PerspectiveCamera(
    config.fov,
    config.width / config.height,
    1,
    1000
  );
  camera.position.set(0, config.cameraYOffset, config.cameraDistance);
  camera.lookAt(0, 0, 0);

  renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(config.pixelRatio, 2));
  renderer.setSize(config.width, config.height, false);

  // Lights
  const dirLight = new DirectionalLight(0xffffff, config.directionalIntensity);
  dirLight.position.setScalar(1);
  scene.add(dirLight);
  scene.add(
    new HemisphereLight(0xffff00, 0x0000ff, config.hemisphereIntensity)
  );
  scene.add(new AmbientLight(0xffffff, config.ambientIntensity));

  // Uniforms
  uniforms = {
    time: { value: 0 },
    noiseScale: { value: config.noiseScale },
    noiseAmplitude: { value: config.noiseAmplitude },
    baseScale: { value: config.baseScale },
  };

  // Geometry
  let geo = new IcosahedronGeometry(1, config.detail);
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  geo = mergeVertices(geo);
  geo.computeVertexNormals();

  // Material
  const mat = new MeshPhongMaterial({
    color: new Color(config.color),
    emissive: new Color(config.emissiveColor).multiplyScalar(
      config.emissiveIntensity
    ),
    shininess: config.shininess,
    wireframe: config.wireframe,
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

  mesh = new Mesh(geo, mat);
  scene.add(mesh);

  clock = new Clock();
  animate();

  self.postMessage({ type: "ready" });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (!clock || !renderer || !scene || !camera || !uniforms || !mesh) return;

  const dt = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  uniforms.time.value = elapsed * config.speed;

  // Auto rotate
  if (config.autoRotate) {
    rotation.y += dt * config.autoRotateSpeed * 0.5;
  }

  // Smooth rotation
  if (!rotation.dragging) {
    rotation.y += (rotation.targetY - rotation.y) * 0.05;
    rotation.x += (rotation.targetX - rotation.x) * 0.05;
  }

  mesh.rotation.y = rotation.y;
  mesh.rotation.x = rotation.x;

  renderer.render(scene, camera);
}

function resize(w, h, pr, bs, cy) {
  if (!renderer || !camera) return;
  config.width = w;
  config.height = h;
  config.baseScale = bs;
  config.cameraYOffset = cy;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  camera.position.y = cy;
  camera.position.z = config.cameraDistance;
  camera.lookAt(0, 0, 0);

  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(pr, 2));

  if (uniforms) uniforms.baseScale.value = bs;
}

function cleanup() {
  if (animationId) cancelAnimationFrame(animationId);
  if (mesh) {
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  if (renderer) renderer.dispose();
  renderer = scene = camera = mesh = uniforms = clock = null;
}

self.onmessage = (e) => {
  const { type, payload } = e.data;
  switch (type) {
    case "init":
      init(payload.canvas, payload.config);
      break;
    case "resize":
      resize(
        payload.width,
        payload.height,
        payload.pixelRatio,
        payload.baseScale,
        payload.cameraYOffset
      );
      break;
    case "pointerdown":
      rotation.dragging = true;
      break;
    case "pointerup":
      rotation.dragging = false;
      break;
    case "pointermove":
      if (rotation.dragging && config.enableControls) {
        rotation.targetY += payload.deltaX * 0.005;
        rotation.targetX += payload.deltaY * 0.005;
        rotation.targetX = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, rotation.targetX)
        );
      }
      break;
    case "update":
      config = { ...config, ...payload };
      if (payload.backgroundColor && scene)
        scene.background = new Color(payload.backgroundColor);
      break;
    case "cleanup":
      cleanup();
      break;
  }
};
