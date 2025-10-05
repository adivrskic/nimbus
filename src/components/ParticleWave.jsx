import React, { useEffect, useRef, useState } from 'react';

const ParticleWave = ({
  isDark = true,
  particleCount = 5000,
  baseRadius = 180,
  morphSpeed = 0.001,
  rotationSpeed = 0.0008,
  pulseSpeed = 0.002,
  sizeMin = 0.5,
  sizeMax = 2.5,
  enableMouseInteraction = true,
  mouseInfluence = 0.3,
  mobileFactor = 0.5,        // scale down particle count on mobile
  mobileBreakpoint = 600,    // width in px to consider as “mobile”
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Utility: detect mobile or small screen
  const getEffectiveCount = () => {
    if (!canvasRef.current) return particleCount;
    const w = canvasRef.current.offsetWidth;
    return w < mobileBreakpoint
      ? Math.floor(particleCount * mobileFactor)
      : particleCount;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Reusable noise (Perlin / Simplex) — you may replace with a better noise lib
    // Here I'll use a small but decent 3D noise implementation
    class Noise3D {
      // You could replace this with open-simplex-noise or noisejs for better quality
      constructor() {
        this.perm = new Uint8Array(512);
        this.grad = new Float32Array(512 * 3);
        this._init();
      }
      _init() {
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        // shuffle
        for (let i = 255; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) {
          const v = p[i & 255];
          this.perm[i] = v;
          // random gradient direction
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
          this.grad[i * 3 + 0] = Math.sin(phi) * Math.cos(theta);
          this.grad[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
          this.grad[i * 3 + 2] = Math.cos(phi);
        }
      }
      dotGrad(ix, iy, iz, x, y, z) {
        const idx = this.perm[(ix + this.perm[(iy + this.perm[iz & 255]) & 255]) & 255];
        return (
          this.grad[idx * 3 + 0] * x +
          this.grad[idx * 3 + 1] * y +
          this.grad[idx * 3 + 2] * z
        );
      }
      fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
      }
      lerp(t, a, b) {
        return a + t * (b - a);
      }
      noise(x, y, z) {
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        const iz = Math.floor(z);
        const fx = x - ix;
        const fy = y - iy;
        const fz = z - iz;
        const u = this.fade(fx);
        const v = this.fade(fy);
        const w = this.fade(fz);

        const d000 = this.dotGrad(ix + 0, iy + 0, iz + 0, fx, fy, fz);
        const d100 = this.dotGrad(ix + 1, iy + 0, iz + 0, fx - 1, fy, fz);
        const d010 = this.dotGrad(ix + 0, iy + 1, iz + 0, fx, fy - 1, fz);
        const d110 = this.dotGrad(ix + 1, iy + 1, iz + 0, fx - 1, fy - 1, fz);
        const d001 = this.dotGrad(ix + 0, iy + 0, iz + 1, fx, fy, fz - 1);
        const d101 = this.dotGrad(ix + 1, iy + 0, iz + 1, fx - 1, fy, fz - 1);
        const d011 = this.dotGrad(ix + 0, iy + 1, iz + 1, fx, fy - 1, fz - 1);
        const d111 = this.dotGrad(ix + 1, iy + 1, iz + 1, fx - 1, fy - 1, fz - 1);

        const x00 = this.lerp(u, d000, d100);
        const x10 = this.lerp(u, d010, d110);
        const x01 = this.lerp(u, d001, d101);
        const x11 = this.lerp(u, d011, d111);

        const y0 = this.lerp(v, x00, x10);
        const y1 = this.lerp(v, x01, x11);
        return this.lerp(w, y0, y1);
      }
    }

    const noiseGen = new Noise3D();

    class Particle {
      constructor(index, total) {
        // Use a torus-like distribution or layered spheres
        // I'll use a lat-long + ring mixing method

        const layerCount = Math.sqrt(total);  // e.g. sqrt layering
        const ringIndex = index % layerCount;
        const layer = Math.floor(index / layerCount);

        const theta = (2 * Math.PI * ringIndex) / layerCount;
        const phi = (Math.PI * (layer + 0.5)) / layerCount;

        // Mix ring radius
        const ringRadius = 1 + 0.5 * Math.sin(phi * 3 + ringIndex * 0.1);

        this.baseX = ringRadius * Math.sin(phi) * Math.cos(theta);
        this.baseY = ringRadius * Math.cos(phi);
        this.baseZ = ringRadius * Math.sin(phi) * Math.sin(theta);

        this.size = sizeMin + Math.random() * (sizeMax - sizeMin);
        this.noiseOffset = Math.random() * 1000;
        this.speedModifier = 0.8 + Math.random() * 0.4;

        const hue = 350 + Math.random() * 20;
        const lightness = isDark ? 60 + Math.random() * 15 : 40 + Math.random() * 15;
        this.color = `hsla(${hue}, 85%, ${lightness}%, 1)`;
      }

      update(time, mouseX, mouseY) {
        // noise-based morph
        const n = noiseGen.noise(
          this.baseX * 0.5 + time * 0.3,
          this.baseY * 0.5 + time * 0.3,
          this.baseZ * 0.5 + time * 0.3 + this.noiseOffset
        );
        const morph = 1 + n * 0.5;

        const radius = baseRadius * morph;

        let x = this.baseX * radius;
        let y = this.baseY * radius;
        let z = this.baseZ * radius;

        // rotation
        const rotY = time * rotationSpeed;
        const rotX = time * rotationSpeed * 0.5;
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

        // rotate Y
        {
          const tx = x * cosY - z * sinY;
          const tz = x * sinY + z * cosY;
          x = tx; z = tz;
        }
        // rotate X
        {
          const ty = y * cosX - z * sinX;
          const tz = y * sinX + z * cosX;
          y = ty; z = tz;
        }

        // pulse
        const pulse = 1 + Math.sin(time * pulseSpeed * this.speedModifier) * 0.2;
        x *= pulse;
        y *= pulse;
        z *= pulse;

        // mouse interaction
        if (enableMouseInteraction) {
          const dx = mouseX - width / 2;
          const dy = mouseY - height / 2;
          x += dx * mouseInfluence * 0.1;
          y += dy * mouseInfluence * 0.1;
        }

        // perspective
        const perspective = 800;
        const scale = perspective / (perspective + z);
        this.screenX = width / 2 + x * scale;
        this.screenY = height / 2 + y * scale;
        this.depth = z;
        this.scale = scale;
        this.currentSize = this.size * scale;
        // fade out if behind or far
        this.opacity = Math.max(
          0,
          Math.min(1, (scale - 0.4) * 1.5)
        );
      }

      draw(ctx) {
        if (this.opacity <= 0 || this.currentSize <= 0) return;

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.screenX, this.screenY, this.currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      const effCount = getEffectiveCount();
      const arr = new Array(effCount);
      for (let i = 0; i < effCount; i++) {
        arr[i] = new Particle(i, effCount);
      }
      particlesRef.current = arr;
    };

    const animate = () => {
      timeRef.current += morphSpeed;

      // fade with slight transparency to create trails
      ctx.fillStyle = isDark
        ? 'rgba(0, 0, 0, 0.07)'
        : 'rgba(255, 255, 255, 0.07)';
      ctx.fillRect(0, 0, width, height);

      particlesRef.current.sort((a, b) => a.depth - b.depth);

      for (const p of particlesRef.current) {
        p.update(timeRef.current, mouse.x, mouse.y);
        p.draw(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    initParticles();
    animate();

    window.addEventListener('resize', handleResize);
    if (enableMouseInteraction) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      if (enableMouseInteraction) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [
    isDark,
    particleCount,
    baseRadius,
    morphSpeed,
    rotationSpeed,
    pulseSpeed,
    sizeMin,
    sizeMax,
    enableMouseInteraction,
    mouseInfluence,
    mobileFactor,
    mobileBreakpoint,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: enableMouseInteraction ? 'auto' : 'none',
        filter: 'blur(48px)',
        opacity: 0.5,
        zIndex: 1,
      }}
    />
  );
};

export default ParticleWave;
