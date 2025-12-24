import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useBlob } from "../contexts/BlobContext";
import { createNoise2D } from "../utils/noise";

// ====================== PANEL SYSTEM FOR METALLIC BLOB ======================

function createPanelTexture(textContent, fontSize = 48) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Clear transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Text with glow effect
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 15;
  ctx.fillText(textContent, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createImagePanelTexture(imageUrl) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      },
      undefined,
      reject
    );
  });
}

class PanelOrbitSystem {
  constructor(scene, config, updateCallback) {
    this.scene = scene;
    this.config = config;
    this.updateCallback = updateCallback;
    this.panels = [];
    this.panelGroup = new THREE.Group();
    this.scene.add(this.panelGroup);

    this.time = 0;
    this.mouseProximity = 0;

    // Load panel textures
    this.loadPanels();
  }

  async loadPanels() {
    const panelConfigs = this.config.panelConfigs || [
      { type: "text", content: "METALLIC BLOB", color: "#ffffff" },
      { type: "text", content: "INTERACTIVE", color: "#ffffff" },
      { type: "text", content: "3D EXPERIENCE", color: "#ffffff" },
      { type: "text", content: "DYNAMIC", color: "#ffffff" },
    ];

    this.panelTextures = [];

    for (const config of panelConfigs) {
      if (config.type === "image" && config.content) {
        try {
          const texture = await createImagePanelTexture(config.content);
          this.panelTextures.push({ texture, config });
        } catch (error) {
          console.warn("Failed to load image:", config.content);
          const fallbackTexture = createPanelTexture("IMAGE", 32);
          this.panelTextures.push({ texture: fallbackTexture, config });
        }
      } else {
        const texture = createPanelTexture(config.content || "PANEL", 32);
        this.panelTextures.push({ texture, config });
      }
    }

    this.setupPanels();
  }

  setupPanels() {
    const count = this.config.panelCount || 4;
    const orbitRadius = this.config.panelOrbitRadius || 3.5;
    const panelWidth = this.config.panelWidth || 0.1; // Ultra-thin
    const panelHeight = this.config.panelHeight || 1.8;
    const curvature = this.config.panelCurvature || 0.5;
    const panelOpacity = this.config.panelOpacity || 0.3;

    // Calculate positions in a ring
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.sin(angle) * orbitRadius;
      const z = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle * 3) * (this.config.panelWaveAmplitude || 0.3);

      const panel = this.createPanel(
        i % this.panelTextures.length,
        x,
        y,
        z,
        angle,
        panelWidth,
        panelHeight,
        curvature,
        panelOpacity
      );

      panel.userData = {
        originalPosition: new THREE.Vector3(x, y, z),
        originalAngle: angle,
        index: i,
        hovered: false,
        rotationOffset: Math.random() * Math.PI * 2,
        floatOffset: Math.random() * Math.PI * 2,
      };

      this.panels.push(panel);
    }

    // Add lighting for panels
    this.setupPanelLights();
  }

  createPanel(textureIndex, x, y, z, angle, width, height, curvature, opacity) {
    // Create curved geometry for thin panel
    const segments = 32;
    const geometry = new THREE.PlaneGeometry(width, height, 1, segments);

    // Curve the plane by adjusting vertices
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const vx = positions.getX(i);
      const vy = positions.getY(i);
      const vz = positions.getZ(i);

      // Apply curvature (bend along Y axis)
      const curveAmount = curvature * (vy / (height / 2));
      const newX = vx;
      const newZ = vz + curveAmount * Math.sin((vy / height) * Math.PI);

      positions.setXYZ(i, newX, vy, newZ);
    }

    geometry.computeVertexNormals();

    const panelConfig = this.panelTextures[textureIndex]?.config || {};
    const texture = this.panelTextures[textureIndex]?.texture;

    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      transparent: true,
      opacity: opacity,
      transmission: 0.95, // Highly transparent
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      color: new THREE.Color(panelConfig.color || "#ffffff"),
      emissive: new THREE.Color(panelConfig.color || "#ffffff"),
      emissiveIntensity: 0.1,
      reflectivity: 0.5,
      ior: 1.4,
    });

    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(x, y, z);
    panel.rotation.y = angle + Math.PI / 2; // Face outward

    this.panelGroup.add(panel);
    return panel;
  }

  setupPanelLights() {
    const count = this.config.panelLightCount || 8;
    const orbitRadius = this.config.panelOrbitRadius || 3.5;

    this.lights = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const light = new THREE.PointLight(
        0xffffff,
        this.config.panelLightIntensity || 0.3,
        orbitRadius * 2,
        2
      );

      light.position.set(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * orbitRadius
      );

      this.panelGroup.add(light);
      this.lights.push(light);
    }
  }

  update(time, mouseX, mouseY, mouseProximity) {
    this.time = time;
    this.mouseProximity = mouseProximity;

    const config = this.config;
    const orbitRadius = config.panelOrbitRadius || 3.5;
    const rotationSpeed = config.panelRotationSpeed || 0.3;
    const floatSpeed = config.panelFloatSpeed || 0.5;
    const floatAmplitude = config.panelFloatAmplitude || 0.1;
    const mouseInfluence = config.panelMouseInfluence || 0.8;
    const spacing = config.panelSpacing || 1.2;
    const waveAmplitude = config.panelWaveAmplitude || 0.3;

    // Update panel group rotation
    if (config.panelOrbitEnabled !== false) {
      this.panelGroup.rotation.y +=
        rotationSpeed * 0.01 * config.panelTimeScale;
    }

    // Update individual panels
    this.panels.forEach((panel, i) => {
      const userData = panel.userData;
      const originalAngle = userData.originalAngle;
      const totalAngle = originalAngle + this.panelGroup.rotation.y;

      // Calculate base position
      const baseX = Math.sin(totalAngle) * orbitRadius;
      const baseZ = Math.cos(totalAngle) * orbitRadius;
      const baseY = Math.sin(totalAngle * 3) * waveAmplitude;

      // Add floating effect
      const floatOffset =
        Math.sin(time * floatSpeed + userData.floatOffset) * floatAmplitude;
      const driftX = Math.cos(time * 0.3 + i) * 0.1;
      const driftZ = Math.sin(time * 0.4 + i) * 0.1;

      // Mouse influence
      const mouseOffsetY = mouseY * mouseInfluence * 0.5;
      const mouseOffsetX = mouseX * mouseInfluence * 0.3;

      // Calculate final position
      const targetX = baseX + driftX + mouseOffsetX;
      const targetZ = baseZ + driftZ;
      const targetY = baseY + floatOffset + mouseOffsetY;

      // Smooth interpolation
      panel.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);

      // Update rotation to face outward
      const targetRotationY =
        originalAngle + this.panelGroup.rotation.y + Math.PI / 2;
      const targetRotationX = mouseY * mouseInfluence * 0.5;
      const targetRotationZ = Math.sin(time * 0.6 + i) * 0.03;

      panel.rotation.x = THREE.MathUtils.lerp(
        panel.rotation.x,
        targetRotationX,
        0.1
      );
      panel.rotation.y = THREE.MathUtils.lerp(
        panel.rotation.y,
        targetRotationY,
        0.1
      );
      panel.rotation.z = THREE.MathUtils.lerp(
        panel.rotation.z,
        targetRotationZ,
        0.1
      );

      // Hover effects
      if (userData.hovered) {
        panel.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
        panel.material.emissiveIntensity = THREE.MathUtils.lerp(
          panel.material.emissiveIntensity,
          config.panelHoverGlow || 0.8,
          0.1
        );
        panel.material.opacity = THREE.MathUtils.lerp(
          panel.material.opacity,
          Math.min((config.panelOpacity || 0.3) * 1.5, 0.8),
          0.1
        );
      } else {
        panel.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        panel.material.emissiveIntensity = THREE.MathUtils.lerp(
          panel.material.emissiveIntensity,
          0.1,
          0.1
        );
        panel.material.opacity = THREE.MathUtils.lerp(
          panel.material.opacity,
          config.panelOpacity || 0.3,
          0.1
        );
      }

      // Mouse proximity effect
      const proximityScale = 1 + mouseProximity * 0.3;
      panel.scale.multiplyScalar(proximityScale);
    });

    // Update lights
    if (this.lights) {
      this.lights.forEach((light, i) => {
        const angle =
          (i / this.lights.length) * Math.PI * 2 + this.panelGroup.rotation.y;
        const lightRadius = orbitRadius * 0.8;

        light.position.x = Math.cos(angle) * lightRadius;
        light.position.z = Math.sin(angle) * lightRadius;
        light.position.y = Math.sin(angle * 2 + time) * 0.3;

        // Pulsing intensity
        light.intensity =
          (config.panelLightIntensity || 0.3) *
          (0.8 + Math.sin(time * 0.5 + i) * 0.2);
      });
    }
  }

  onMouseMove(mouseX, mouseY) {
    // Simple hover detection based on screen space
    const centerDistance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

    this.panels.forEach((panel) => {
      const panelPos = panel.position.clone();
      const cameraPos = new THREE.Vector3(0, 0, 5); // Approximate camera position
      const distanceToCamera = panelPos.distanceTo(cameraPos);
      const mouseDistance =
        Math.abs(mouseX * 5 - panelPos.x) + Math.abs(mouseY * 3 - panelPos.y);

      panel.userData.hovered = mouseDistance < 1.5;
    });
  }

  onClick(mouseX, mouseY) {
    const hoveredPanels = this.panels.filter((p) => p.userData.hovered);
    hoveredPanels.forEach((panel) => {
      if (this.updateCallback && this.updateCallback.onPanelClick) {
        this.updateCallback.onPanelClick(panel.userData.index, panel.userData);
      }
    });
  }

  dispose() {
    this.panels.forEach((panel) => {
      if (panel.material.map) {
        panel.material.map.dispose();
      }
      panel.material.dispose();
      panel.geometry.dispose();
    });

    if (this.lights) {
      this.lights.forEach((light) => {
        this.panelGroup.remove(light);
        light.dispose();
      });
    }

    this.scene.remove(this.panelGroup);
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// ====================== UPDATED METALLIC BLOB ======================

export default function MetallicBlob({
  className = "",
  panelConfig: externalPanelConfig,
}) {
  const containerRef = useRef(null);
  const { configRef, updateConfig } = useBlob();

  // Default panel configuration
  const [panelConfig] = useState({
    // Panel appearance
    panelCount: externalPanelConfig?.panelCount || 8,
    panelWidth: externalPanelConfig?.panelWidth || 0.08, // Ultra-thin
    panelHeight: externalPanelConfig?.panelHeight || 1.6,
    panelCurvature: externalPanelConfig?.panelCurvature || 0.3,
    panelOpacity: externalPanelConfig?.panelOpacity || 0.25,
    panelGlow: externalPanelConfig?.panelGlow || 0.1,
    panelHoverGlow: externalPanelConfig?.panelHoverGlow || 0.6,

    // Panel orbit
    panelOrbitRadius: externalPanelConfig?.panelOrbitRadius || 3.8,
    panelOrbitEnabled: externalPanelConfig?.panelOrbitEnabled !== false,
    panelRotationSpeed: externalPanelConfig?.panelRotationSpeed || 0.2,
    panelFloatSpeed: externalPanelConfig?.panelFloatSpeed || 0.4,
    panelFloatAmplitude: externalPanelConfig?.panelFloatAmplitude || 0.08,
    panelWaveAmplitude: externalPanelConfig?.panelWaveAmplitude || 0.2,
    panelSpacing: externalPanelConfig?.panelSpacing || 1.1,
    panelTimeScale: externalPanelConfig?.panelTimeScale || 1.0,

    // Interaction
    panelMouseInfluence: externalPanelConfig?.panelMouseInfluence || 0.7,
    panelInteractive: externalPanelConfig?.panelInteractive !== false,

    // Lighting
    panelLightCount: externalPanelConfig?.panelLightCount || 8,
    panelLightIntensity: externalPanelConfig?.panelLightIntensity || 0.2,

    // Content
    panelConfigs: externalPanelConfig?.panelConfigs || [
      { type: "text", content: "METALLIC", color: "#ffffff" },
      { type: "text", content: "BLOB", color: "#ffffff" },
      { type: "text", content: "3D", color: "#ffffff" },
      { type: "text", content: "EXPERIENCE", color: "#ffffff" },
      { type: "text", content: "SHADER", color: "#ffffff" },
      { type: "text", content: "DYNAMIC", color: "#ffffff" },
      { type: "text", content: "REAL-TIME", color: "#ffffff" },
      { type: "text", content: "METABALLS", color: "#ffffff" },
    ],

    // Callbacks
    onPanelClick: (index, data) => {
      console.log(`Panel ${index} clicked`, data);
    },
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const noise2D = createNoise2D();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd8dce0);

    const camera = new THREE.PerspectiveCamera(
      configRef.current.cameraFOV,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, configRef.current.cameraZ);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // Environment map
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(50, 32, 32);
    const envMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        void main() {
          float y = normalize(vWorldPosition).y * 0.5 + 0.5;
          vec3 bottom = vec3(0.65, 0.68, 0.72);
          vec3 mid = vec3(0.85, 0.88, 0.92);
          vec3 top = vec3(0.98, 0.99, 1.0);
          vec3 color = mix(bottom, mid, smoothstep(0.0, 0.5, y));
          color = mix(color, top, smoothstep(0.5, 1.0, y));
          float x = normalize(vWorldPosition).x * 0.5 + 0.5;
          color *= 0.9 + 0.2 * sin(x * 3.14159);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    const envMesh = new THREE.Mesh(envGeo, envMat);
    envScene.add(envMesh);
    cubeCamera.update(renderer, envScene);

    // Blob geometry
    const geometry = new THREE.SphereGeometry(1, 128, 128);

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        envMap: { value: cubeRenderTarget.texture },
        baseColor: {
          value: new THREE.Color(
            configRef.current.baseColorR,
            configRef.current.baseColorG,
            configRef.current.baseColorB
          ),
        },
        iridescenceIntensity: { value: configRef.current.iridescenceIntensity },
        fresnelPower: { value: configRef.current.fresnelPower },
        envMapIntensity: { value: configRef.current.envMapIntensity },
        specularIntensity: { value: configRef.current.specularIntensity },
        specularPower: { value: configRef.current.specularPower },
        secondarySpecular: { value: configRef.current.secondarySpecular },
        aoStrength: { value: configRef.current.aoStrength },
        brightnessBoost: { value: configRef.current.brightnessBoost },
        iriScale1: { value: configRef.current.iriScale1 },
        iriScale2: { value: configRef.current.iriScale2 },
        iriSpeed: { value: configRef.current.iriSpeed },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform samplerCube envMap;
        uniform vec3 baseColor;
        uniform float iridescenceIntensity;
        uniform float fresnelPower;
        uniform float envMapIntensity;
        uniform float specularIntensity;
        uniform float specularPower;
        uniform float secondarySpecular;
        uniform float aoStrength;
        uniform float brightnessBoost;
        uniform float iriScale1;
        uniform float iriScale2;
        uniform float iriSpeed;
        
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        
        vec3 iridescence(float angle, float thickness) {
          float phase = thickness * angle * 6.28318;
          return vec3(
            sin(phase) * 0.5 + 0.5,
            sin(phase + 2.094) * 0.5 + 0.5,
            sin(phase + 4.188) * 0.5 + 0.5
          );
        }
        
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          vec3 normal = normalize(vNormal);
          vec3 worldNormal = normalize(vWorldNormal);
          
          float fresnel = pow(1.0 - abs(dot(viewDir, normal)), fresnelPower);
          
          vec3 reflectDir = reflect(-normalize(vWorldPosition - cameraPosition), worldNormal);
          vec4 envColor = textureCube(envMap, reflectDir);
          
          float thickness = 1.0 + sin(vUv.x * iriScale1 + time * iriSpeed) * 0.3 + sin(vUv.y * iriScale1 * 0.8 - time * iriSpeed * 0.6) * 0.2;
          float viewAngle = dot(viewDir, normal) * 0.5 + 0.5;
          vec3 iridescentColor = iridescence(viewAngle, thickness);
          
          float thickness2 = 1.5 + sin(vUv.x * iriScale2 - time * iriSpeed * 0.8) * 0.2 + cos(vUv.y * iriScale2 * 0.8 + time * iriSpeed * 1.2) * 0.25;
          vec3 iridescentColor2 = iridescence(viewAngle * 1.2, thickness2);
          
          vec3 combinedIridescence = mix(iridescentColor, iridescentColor2, 0.5);
          
          vec3 surfaceVariation = vec3(
            sin(worldNormal.x * 3.0 + time * 0.2) * 0.05,
            sin(worldNormal.y * 3.0 + time * 0.25) * 0.05,
            sin(worldNormal.z * 3.0 + time * 0.3) * 0.05
          );
          
          vec3 metalColor = baseColor + surfaceVariation;
          vec3 reflectedColor = mix(metalColor * (1.0 - envMapIntensity), envColor.rgb * metalColor, envMapIntensity + fresnel * 0.3);
          vec3 finalColor = mix(reflectedColor, combinedIridescence, fresnel * iridescenceIntensity);
          
          float specular = pow(max(0.0, dot(reflect(-viewDir, normal), vec3(0.3, 1.0, 0.5))), specularPower);
          finalColor += vec3(1.0) * specular * specularIntensity;
          
          float specular2 = pow(max(0.0, dot(reflect(-viewDir, normal), vec3(-0.5, 0.5, 0.8))), specularPower * 0.75);
          finalColor += vec3(0.95, 0.97, 1.0) * specular2 * secondarySpecular;
          
          float ao = (1.0 - aoStrength) + aoStrength * dot(normal, vec3(0.0, 1.0, 0.0));
          finalColor *= ao;
          finalColor = finalColor * brightnessBoost;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // Initialize panel system
    let panelSystem;
    setTimeout(() => {
      panelSystem = new PanelOrbitSystem(scene, panelConfig, {
        onPanelClick: panelConfig.onPanelClick,
      });
    }, 0);

    // Shadow mesh
    const shadowGeometry = new THREE.SphereGeometry(1, 64, 64);
    const shadowCasterMat = new THREE.MeshStandardMaterial({
      color: 0xd8dce0,
      transparent: true,
      opacity: 0.0,
    });
    const shadowBlob = new THREE.Mesh(shadowGeometry, shadowCasterMat);
    shadowBlob.castShadow = true;
    scene.add(shadowBlob);

    const shadowOriginalPositions = Float32Array.from(
      shadowBlob.geometry.attributes.position.array
    );
    const originalPositions = Float32Array.from(
      blob.geometry.attributes.position.array
    );

    // Wall
    const wallGeo = new THREE.PlaneGeometry(50, 50);
    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(
        configRef.current.wallColorR,
        configRef.current.wallColorG,
        configRef.current.wallColorB
      ),
      roughness: configRef.current.wallRoughness,
      metalness: 0.0,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.z = -configRef.current.wallDistance;
    wall.receiveShadow = true;
    scene.add(wall);

    // Lights
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(
        configRef.current.ambientColorR,
        configRef.current.ambientColorG,
        configRef.current.ambientColorB
      ),
      configRef.current.ambientIntensity
    );
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(
      new THREE.Color(
        configRef.current.lightColorR,
        configRef.current.lightColorG,
        configRef.current.lightColorB
      ),
      configRef.current.lightIntensity
    );
    mainLight.position.set(
      configRef.current.lightPosX,
      configRef.current.lightPosY,
      configRef.current.lightPosZ
    );
    mainLight.target.position.set(0, 0, -configRef.current.wallDistance);
    scene.add(mainLight.target);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 20;
    mainLight.shadow.camera.left = -4;
    mainLight.shadow.camera.right = 4;
    mainLight.shadow.camera.top = 4;
    mainLight.shadow.camera.bottom = -4;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.radius = configRef.current.shadowRadius;
    mainLight.shadow.blurSamples = 25;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(
      0xe8f0ff,
      configRef.current.fillIntensity
    );
    fillLight.position.set(
      configRef.current.fillPosX,
      configRef.current.fillPosY,
      configRef.current.fillPosZ
    );
    scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(
      0xffffff,
      configRef.current.topIntensity
    );
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    // Animation state
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let mouseProximity = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      const distance =
        Math.sqrt(mouseX * mouseX + mouseY * mouseY) / Math.sqrt(2);
      mouseProximity = 1 - Math.min(distance, 1);

      if (panelSystem) {
        panelSystem.onMouseMove(mouseX, mouseY);
      }
    };

    const handleClick = (e) => {
      if (panelSystem && panelConfig.panelInteractive) {
        panelSystem.onClick(mouseX, mouseY);
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const cfg = configRef.current;
      time += 0.012 * cfg.timeScale;

      // Update uniforms
      material.uniforms.time.value = time;
      material.uniforms.iridescenceIntensity.value = cfg.iridescenceIntensity;
      material.uniforms.fresnelPower.value = cfg.fresnelPower;
      material.uniforms.baseColor.value.setRGB(
        cfg.baseColorR,
        cfg.baseColorG,
        cfg.baseColorB
      );
      material.uniforms.envMapIntensity.value = cfg.envMapIntensity;
      material.uniforms.specularIntensity.value = cfg.specularIntensity;
      material.uniforms.specularPower.value = cfg.specularPower;
      material.uniforms.secondarySpecular.value = cfg.secondarySpecular;
      material.uniforms.aoStrength.value = cfg.aoStrength;
      material.uniforms.brightnessBoost.value = cfg.brightnessBoost;
      material.uniforms.iriScale1.value = cfg.iriScale1;
      material.uniforms.iriScale2.value = cfg.iriScale2;
      material.uniforms.iriSpeed.value = cfg.iriSpeed;

      // Update scene
      wallMat.color.setRGB(cfg.wallColorR, cfg.wallColorG, cfg.wallColorB);
      wallMat.roughness = cfg.wallRoughness;
      wall.position.z = -cfg.wallDistance;

      mainLight.position.set(cfg.lightPosX, cfg.lightPosY, cfg.lightPosZ);
      mainLight.intensity = cfg.lightIntensity;
      mainLight.color.setRGB(cfg.lightColorR, cfg.lightColorG, cfg.lightColorB);
      mainLight.shadow.radius = cfg.shadowRadius;
      mainLight.target.position.set(0, 0, -cfg.wallDistance);

      ambientLight.intensity = cfg.ambientIntensity;
      ambientLight.color.setRGB(
        cfg.ambientColorR,
        cfg.ambientColorG,
        cfg.ambientColorB
      );

      fillLight.intensity = cfg.fillIntensity;
      fillLight.position.set(cfg.fillPosX, cfg.fillPosY, cfg.fillPosZ);

      topLight.intensity = cfg.topIntensity;

      camera.position.z = cfg.cameraZ;
      camera.fov = cfg.cameraFOV;
      camera.updateProjectionMatrix();

      // Update panel system
      if (panelSystem) {
        panelSystem.update(time, mouseX, mouseY, mouseProximity);
      }

      // Blob animation
      blob.position.y =
        Math.sin(time * cfg.floatSpeed) * cfg.floatAmplitude +
        Math.sin(time * cfg.floatSpeed * 1.6) * (cfg.floatAmplitude * 0.5);
      blob.position.x =
        Math.sin(time * cfg.driftSpeed) * cfg.driftAmplitude +
        Math.cos(time * cfg.driftSpeed * 1.8) * (cfg.driftAmplitude * 0.5);
      blob.position.z =
        Math.cos(time * cfg.driftSpeed * 1.2) * (cfg.driftAmplitude * 0.15);

      const baseRotY = time * cfg.autoRotateSpeed;
      const baseRotX = Math.sin(time * cfg.wobbleSpeed) * cfg.wobbleAmount;
      const baseRotZ =
        Math.cos(time * cfg.wobbleSpeed * 0.875) * (cfg.wobbleAmount * 0.5);

      targetRotationY +=
        (mouseX * cfg.mouseInfluence + baseRotY - targetRotationY) * 0.06;
      targetRotationX +=
        (mouseY * (cfg.mouseInfluence * 0.625) + baseRotX - targetRotationX) *
        0.06;

      blob.rotation.y = targetRotationY;
      blob.rotation.x = targetRotationX;
      blob.rotation.z = baseRotZ;

      const breathe =
        cfg.blobScale *
        (1 + Math.sin(time * cfg.breatheSpeed) * cfg.breatheAmount);
      blob.scale.set(
        breathe,
        breathe *
          (1 +
            Math.sin(time * cfg.breatheSpeed * 1.57) *
              (cfg.breatheAmount * 0.67)),
        breathe
      );

      // Geometry distortion
      const positions = blob.geometry.attributes.position.array;
      const normals = blob.geometry.attributes.normal.array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];

        const noise1 = noise2D(
          x * cfg.noiseScale + time * cfg.noiseSpeed,
          y * cfg.noiseScale + time * cfg.noiseSpeed * 0.71
        );
        const noise2 = noise2D(
          y * cfg.noiseScale * 1.22 + time * cfg.noiseSpeed * 0.86,
          z * cfg.noiseScale * 1.22 + time * cfg.noiseSpeed * 1.14
        );
        const noise3 = noise2D(
          z * cfg.noiseScale * 0.83 + time * cfg.noiseSpeed * 0.79,
          x * cfg.noiseScale * 0.83 + time * cfg.noiseSpeed * 0.93
        );
        const noise4 = noise2D(
          x * cfg.noiseScale * 1.67 + time * cfg.noiseSpeed * 1.71,
          z * cfg.noiseScale * 1.67 - time * cfg.noiseSpeed * 1.29
        );

        const combinedNoise =
          (noise1 + noise2 * 0.6 + noise3 * 0.35 + noise4 * 0.2) / 2.15;
        const proximityBoost =
          1 + mouseProximity * cfg.mouseProximityEffect * 3;
        const distortion =
          (cfg.distortionBase +
            Math.sin(time * 0.6) * cfg.distortionPulse +
            Math.sin(time * 1.1) * (cfg.distortionPulse * 0.67)) *
          proximityBoost;

        positions[i] = x + normals[i] * combinedNoise * distortion;
        positions[i + 1] = y + normals[i + 1] * combinedNoise * distortion;
        positions[i + 2] = z + normals[i + 2] * combinedNoise * distortion;
      }

      blob.geometry.attributes.position.needsUpdate = true;
      blob.geometry.computeVertexNormals();

      // Shadow mesh sync
      const shadowPositions = shadowBlob.geometry.attributes.position.array;
      const shadowNormals = shadowBlob.geometry.attributes.normal.array;
      for (let i = 0; i < shadowPositions.length; i += 3) {
        const x = shadowOriginalPositions[i];
        const y = shadowOriginalPositions[i + 1];
        const z = shadowOriginalPositions[i + 2];
        const noise1 = noise2D(
          x * cfg.noiseScale + time * cfg.noiseSpeed,
          y * cfg.noiseScale + time * cfg.noiseSpeed * 0.71
        );
        const noise2 = noise2D(
          y * cfg.noiseScale * 1.22 + time * cfg.noiseSpeed * 0.86,
          z * cfg.noiseScale * 1.22 + time * cfg.noiseSpeed * 1.14
        );
        const combinedNoise = (noise1 + noise2 * 0.6) / 1.6;
        const proximityBoost =
          1 + mouseProximity * cfg.mouseProximityEffect * 3;
        const dist =
          (cfg.distortionBase + Math.sin(time * 0.6) * cfg.distortionPulse) *
          proximityBoost;
        shadowPositions[i] = x + shadowNormals[i] * combinedNoise * dist;
        shadowPositions[i + 1] =
          y + shadowNormals[i + 1] * combinedNoise * dist;
        shadowPositions[i + 2] =
          z + shadowNormals[i + 2] * combinedNoise * dist;
      }
      shadowBlob.geometry.attributes.position.needsUpdate = true;

      shadowBlob.position.copy(blob.position);
      shadowBlob.rotation.copy(blob.rotation);
      shadowBlob.scale.copy(blob.scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (panelSystem) {
        panelSystem.dispose();
      }
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 ${className}`} />;
}

// ====================== PANEL CONFIGURATION UTILITIES ======================

export function createPanelConfig(options = {}) {
  return {
    // Panel appearance
    panelCount: options.panelCount || 8,
    panelWidth: options.panelWidth || 0.08, // Ultra-thin
    panelHeight: options.panelHeight || 1.6,
    panelCurvature: options.panelCurvature || 0.3,
    panelOpacity: options.panelOpacity || 0.25,
    panelGlow: options.panelGlow || 0.1,
    panelHoverGlow: options.panelHoverGlow || 0.6,

    // Panel orbit
    panelOrbitRadius: options.panelOrbitRadius || 3.8,
    panelOrbitEnabled: options.panelOrbitEnabled !== false,
    panelRotationSpeed: options.panelRotationSpeed || 0.2,
    panelFloatSpeed: options.panelFloatSpeed || 0.4,
    panelFloatAmplitude: options.panelFloatAmplitude || 0.08,
    panelWaveAmplitude: options.panelWaveAmplitude || 0.2,
    panelSpacing: options.panelSpacing || 1.1,
    panelTimeScale: options.panelTimeScale || 1.0,

    // Interaction
    panelMouseInfluence: options.panelMouseInfluence || 0.7,
    panelInteractive: options.panelInteractive !== false,

    // Lighting
    panelLightCount: options.panelLightCount || 8,
    panelLightIntensity: options.panelLightIntensity || 0.2,

    // Content
    panelConfigs: options.panelConfigs || [
      { type: "text", content: "METALLIC", color: "#ffffff" },
      { type: "text", content: "BLOB", color: "#ffffff" },
      { type: "text", content: "3D", color: "#ffffff" },
      { type: "text", content: "EXPERIENCE", color: "#ffffff" },
    ],
  };
}

// Preset panel configurations
export const panelPresets = {
  minimal: createPanelConfig({
    panelCount: 4,
    panelWidth: 0.06,
    panelOpacity: 0.15,
    panelCurvature: 0.2,
    panelOrbitRadius: 3.5,
  }),

  dense: createPanelConfig({
    panelCount: 12,
    panelWidth: 0.05,
    panelHeight: 1.2,
    panelOpacity: 0.2,
    panelCurvature: 0.4,
    panelOrbitRadius: 4.0,
    panelSpacing: 0.9,
  }),

  wide: createPanelConfig({
    panelCount: 6,
    panelWidth: 0.1,
    panelHeight: 2.0,
    panelOpacity: 0.3,
    panelCurvature: 0.6,
    panelOrbitRadius: 4.5,
  }),

  dynamic: createPanelConfig({
    panelCount: 8,
    panelWidth: 0.08,
    panelOpacity: 0.25,
    panelCurvature: 0.3,
    panelRotationSpeed: 0.4,
    panelFloatSpeed: 0.8,
    panelFloatAmplitude: 0.15,
    panelMouseInfluence: 1.0,
  }),
};
