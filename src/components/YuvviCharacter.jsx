import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../utils/audio';

const YUVVI_QUOTES = [
  "Ooh! Did you bring a dream from the quiet night? ✨",
  "Hold tight to your wonder! It never fades in the dark.",
  "Listen closely... the midnight wind is humming a lullaby.",
  "Every star in this sky was once an unspoken wish.",
  "My lantern glows warmest when a forgotten memory is near!",
  "A tiny spark is all it takes to build a world."
];

export const YuvviCharacter = ({
  size = 'medium', // 'small' | 'medium' | 'large' | 'hero'
  expression = 'happy',
  interactive = true,
  showLantern = true,
  onLanternClick = null,
  customMessage = null,
  flightPose = false, // when in active flight
  lookTarget = null, // { x, y } target coordinates to look toward
  className = ''
}) => {
  const mountRef = useRef(null);
  const [speech, setSpeech] = useState(customMessage);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [webGlSupported, setWebGlSupported] = useState(true);

  const scaleMap = {
    small: { width: 140, height: 135 },
    medium: { width: 220, height: 210 },
    large: { width: 300, height: 280 },
    hero: { width: 380, height: 350 }
  };

  const currentScale = scaleMap[size] || scaleMap.medium;

  // Sync expression prop
  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  useEffect(() => {
    if (customMessage) setSpeech(customMessage);
  }, [customMessage]);

  // Three.js 3D Procedural Character Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, animationFrameId;

    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        42,
        currentScale.width / currentScale.height,
        0.1,
        100
      );
      camera.position.set(0, 0, 5.2);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(currentScale.width, currentScale.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      container.replaceChildren(renderer.domElement);

      // --- LIGHTING ---
      // Ambient Midnight Fill
      const ambientLight = new THREE.AmbientLight(0x281e48, 1.4);
      scene.add(ambientLight);

      // Cool Moonlight Directional Key from top-left
      const moonLight = new THREE.DirectionalLight(0xa8d9ff, 2.4);
      moonLight.position.set(-3, 4, 3);
      scene.add(moonLight);

      // Soft Purple Rim Light from rear-right
      const rimLight = new THREE.DirectionalLight(0xb6a4ff, 1.8);
      rimLight.position.set(3, -2, -2);
      scene.add(rimLight);

      // Lantern Warm Point Light (illuminates Yuvvi's right side)
      const lanternLight = new THREE.PointLight(0xffd985, 3.2, 5);
      lanternLight.position.set(1.4, 0.2, 0.8);
      scene.add(lanternLight);

      // --- CHARACTER HIERARCHY ROOT ---
      const yuvviGroup = new THREE.Group();
      scene.add(yuvviGroup);

      // --- 1. GHOST BODY MESH ---
      // Custom rounded sculpted geometry: soft pear shape with ruffled hem base
      const bodyGeometry = new THREE.SphereGeometry(1.15, 36, 36);
      const posAttr = bodyGeometry.attributes.position;
      const originalY = new Float32Array(posAttr.count);

      for (let i = 0; i < posAttr.count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        // Pear shape tapering at the top, soft wideness at bottom
        if (y < 0) {
          x *= 1.12 + Math.sin(y * 3) * 0.08;
          z *= 1.12 + Math.sin(y * 3) * 0.08;
        } else {
          x *= 0.95;
          z *= 0.95;
        }

        // Slight flatten back, soft puffed front
        if (z > 0) z *= 1.08;

        posAttr.setXYZ(i, x, y, z);
        originalY[i] = y;
      }
      bodyGeometry.computeVertexNormals();

      // Translucent Subsurface Material
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.18,
        metalness: 0.02,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        transmission: 0.2,
        ior: 1.35,
        sheen: 0.6,
        sheenColor: new THREE.Color(0xd99bcb)
      });

      const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
      bodyMesh.scale.set(1, 1.25, 0.95);
      yuvviGroup.add(bodyMesh);

      // --- 2. FOREHEAD GOLDEN STAR ---
      const starShape = new THREE.Shape();
      const points = 5;
      const outerRadius = 0.14;
      const innerRadius = 0.06;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) starShape.moveTo(px, py);
        else starShape.lineTo(px, py);
      }
      starShape.closePath();

      const starGeo = new THREE.ExtrudeGeometry(starShape, {
        depth: 0.03,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015
      });

      const starMat = new THREE.MeshStandardMaterial({
        color: 0xffd985,
        emissive: 0xffd985,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.6
      });

      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.set(0, 0.72, 0.94);
      yuvviGroup.add(starMesh);

      // --- 3. EXPRESSIVE GLOSSY EYES ---
      const eyeGeo = new THREE.SphereGeometry(0.11, 24, 24);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x111124,
        roughness: 0.04,
        metalness: 0.1
      });

      // Left Eye
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.32, 0.12, 0.98);
      leftEye.scale.set(1, 1.3, 0.6);
      yuvviGroup.add(leftEye);

      // Right Eye
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.32, 0.12, 0.98);
      rightEye.scale.set(1, 1.3, 0.6);
      yuvviGroup.add(rightEye);

      // Catchlights (Eye highlights)
      const catchlightGeo = new THREE.SphereGeometry(0.032, 12, 12);
      const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const leftCatch = new THREE.Mesh(catchlightGeo, catchlightMat);
      leftCatch.position.set(-0.35, 0.16, 1.05);
      yuvviGroup.add(leftCatch);

      const rightCatch = new THREE.Mesh(catchlightGeo, catchlightMat);
      rightCatch.position.set(0.29, 0.16, 1.05);
      yuvviGroup.add(rightCatch);

      // --- 4. ROSY CHEEKS ---
      const cheekGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const cheekMat = new THREE.MeshBasicMaterial({
        color: 0xd99bcb,
        transparent: true,
        opacity: 0.55
      });

      const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
      leftCheek.position.set(-0.46, -0.06, 0.9);
      leftCheek.scale.set(1.4, 0.6, 0.4);
      yuvviGroup.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
      rightCheek.position.set(0.46, -0.06, 0.9);
      rightCheek.scale.set(1.4, 0.6, 0.4);
      yuvviGroup.add(rightCheek);

      // --- 5. TINY SWEET ARMS ---
      const armGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const leftArm = new THREE.Mesh(armGeo, bodyMaterial);
      leftArm.position.set(-0.95, -0.15, 0.2);
      leftArm.scale.set(0.7, 1.4, 0.7);
      leftArm.rotation.z = 0.4;
      yuvviGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, bodyMaterial);
      rightArm.position.set(0.95, -0.1, 0.3);
      rightArm.scale.set(0.7, 1.4, 0.7);
      rightArm.rotation.z = -0.6;
      yuvviGroup.add(rightArm);

      // --- 6. 3D DREAM LANTERN ---
      let lanternGroup = null;
      let starFlame = null;

      if (showLantern) {
        lanternGroup = new THREE.Group();
        lanternGroup.position.set(1.35, 0.1, 0.6);

        // Brass Top Cap
        const capGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.1, 18);
        const brassMat = new THREE.MeshStandardMaterial({
          color: 0xd4a137,
          roughness: 0.25,
          metalness: 0.8
        });
        const capMesh = new THREE.Mesh(capGeo, brassMat);
        capMesh.position.y = 0.32;
        lanternGroup.add(capMesh);

        // Brass Loop Ring
        const ringGeo = new THREE.TorusGeometry(0.09, 0.025, 12, 24);
        const ringMesh = new THREE.Mesh(ringGeo, brassMat);
        ringMesh.position.y = 0.42;
        ringMesh.rotation.x = Math.PI / 2;
        lanternGroup.add(ringMesh);

        // Transparent Glass Chamber
        const glassGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.45, 24, 1, true);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xfff9e6,
          transmission: 0.92,
          opacity: 0.85,
          transparent: true,
          roughness: 0.05,
          ior: 1.45
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        lanternGroup.add(glassMesh);

        // Glowing Star Flame Inside
        const flameGeo = new THREE.OctahedronGeometry(0.11, 1);
        const flameMat = new THREE.MeshBasicMaterial({
          color: 0xffd985
        });
        starFlame = new THREE.Mesh(flameGeo, flameMat);
        lanternGroup.add(starFlame);

        // Brass Base
        const baseGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.08, 18);
        const baseMesh = new THREE.Mesh(baseGeo, brassMat);
        baseMesh.position.y = -0.26;
        lanternGroup.add(baseMesh);

        scene.add(lanternGroup);
      }

      // --- ANIMATION LOOP ---
      const startTime = performance.now();
      let nextBlink = 2.0;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsed = (performance.now() - startTime) * 0.001;

        // 1. Gentle Idle Floating (sine wave)
        const hoverY = Math.sin(elapsed * 1.8) * 0.12;
        const hoverRoll = Math.sin(elapsed * 1.4) * 0.04;
        yuvviGroup.position.y = hoverY;
        yuvviGroup.rotation.z = hoverRoll;

        // 2. Flight Pose tilt
        if (flightPose) {
          yuvviGroup.rotation.x = THREE.MathUtils.lerp(yuvviGroup.rotation.x, 0.35, 0.1);
          yuvviGroup.position.z = THREE.MathUtils.lerp(yuvviGroup.position.z, 0.3, 0.1);
        } else {
          yuvviGroup.rotation.x = THREE.MathUtils.lerp(yuvviGroup.rotation.x, 0, 0.08);
          yuvviGroup.position.z = THREE.MathUtils.lerp(yuvviGroup.position.z, 0, 0.08);
        }

        // 3. Smooth Look-Target Rotation
        if (lookTarget) {
          const targetRotY = (lookTarget.x / window.innerWidth - 0.5) * 0.6;
          const targetRotX = -(lookTarget.y / window.innerHeight - 0.5) * 0.4;
          yuvviGroup.rotation.y = THREE.MathUtils.lerp(yuvviGroup.rotation.y, targetRotY, 0.06);
          yuvviGroup.rotation.x = THREE.MathUtils.lerp(yuvviGroup.rotation.x, targetRotX, 0.06);
        } else {
          yuvviGroup.rotation.y = THREE.MathUtils.lerp(yuvviGroup.rotation.y, 0, 0.05);
        }

        // 4. Occasional Blinking
        if (elapsed > nextBlink) {
          leftEye.scale.y = 0.1;
          rightEye.scale.y = 0.1;
          leftCatch.visible = false;
          rightCatch.visible = false;

          if (elapsed > nextBlink + 0.14) {
            leftEye.scale.y = 1.3;
            rightEye.scale.y = 1.3;
            leftCatch.visible = true;
            rightCatch.visible = true;
            nextBlink = elapsed + 2.5 + Math.random() * 3.5;
          }
        }

        // 5. Lantern Hover & Internal Star Pulse
        if (lanternGroup) {
          lanternGroup.position.y = hoverY * 0.8 + Math.cos(elapsed * 2.2) * 0.06;
          lanternGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.08;

          if (starFlame) {
            const starPulse = 1 + Math.sin(elapsed * 5) * 0.15;
            starFlame.scale.set(starPulse, starPulse, starPulse);
            starFlame.rotation.y = elapsed * 1.2;
            starFlame.rotation.z = elapsed * 0.8;
          }
        }

        // 6. Base hem subtle wave deformation
        const pos = bodyGeometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = originalY[i];
          if (y < -0.4) {
            const wave = Math.sin(elapsed * 3 + pos.getX(i) * 4) * 0.04;
            pos.setY(i, y + wave);
          }
        }
        bodyGeometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();
    } catch {
      // Fallback gracefully to CSS / SVG character if WebGL is unavailable
      setWebGlSupported(false);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [currentScale.width, currentScale.height, showLantern, flightPose]);

  const handleGhostClick = () => {
    if (!interactive) return;
    sound.playChime(659.25, 'sine', 0.8);
    setCurrentExpression((prev) => (prev === 'waving' ? 'happy' : 'waving'));
    const randomQuote = YUVVI_QUOTES[Math.floor(Math.random() * YUVVI_QUOTES.length)];
    setSpeech(randomQuote);
  };

  const handleLanternClick = (e) => {
    e.stopPropagation();
    sound.playLanternGlow();
    setSpeech("The lantern glows when a dream is near! ✨");
    if (onLanternClick) onLanternClick();
  };

  return (
    <div
      className={`yuvvi-character-wrap ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none'
      }}
    >
      {/* Interactive Speech Bubble */}
      {speech && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'absolute',
            top: size === 'hero' ? '-45px' : '-32px',
            background: 'rgba(21, 21, 45, 0.92)',
            color: 'var(--color-text-main)',
            border: '1.5px solid var(--color-lavender)',
            borderRadius: '18px',
            padding: '0.55rem 1.1rem',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-rounded)',
            fontWeight: 600,
            boxShadow: '0 8px 30px rgba(8, 8, 17, 0.8), 0 0 15px rgba(182, 164, 255, 0.3)',
            whiteSpace: 'nowrap',
            zIndex: 25,
            animation: 'riseIntoSky 0.35s ease-out forwards',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <span>{speech}</span>
          <button
            onClick={() => setSpeech(null)}
            aria-label="Dismiss message"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
              lineHeight: 1,
              marginLeft: '4px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      {webGlSupported ? (
        <div
          ref={mountRef}
          onClick={handleGhostClick}
          style={{
            width: `${currentScale.width}px`,
            height: `${currentScale.height}px`,
            cursor: interactive ? 'pointer' : 'default',
            filter: 'drop-shadow(0 15px 35px rgba(8, 8, 17, 0.7))',
            transition: 'filter 0.3s ease'
          }}
          title={interactive ? 'Click Yuvvi to interact ✨' : ''}
          role="img"
          aria-label="Yuvvi the little 3D ghost holding a glowing Dream Lantern"
        />
      ) : (
        /* Layered 3D CSS / SVG Fallback */
        <div
          onClick={handleGhostClick}
          style={{
            width: `${currentScale.width}px`,
            height: `${currentScale.height}px`,
            cursor: interactive ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width={currentScale.width} height={currentScale.height} viewBox="0 0 280 240" fill="none">
            <path
              d="M 120 40 C 85 40, 72 75, 72 120 C 72 165, 80 185, 92 180 C 102 175, 108 185, 118 180 C 126 176, 134 186, 144 180 C 154 175, 160 185, 170 178 C 176 172, 174 150, 174 120 C 174 75, 155 40, 120 40 Z"
              fill="#FFFFFF"
              stroke="#B6A4FF"
              strokeWidth="3"
            />
            <polygon points="120,48 123.5,56 132,56.5 125.5,63.5 127.5,72 120,67 112.5,72 114.5,63.5 108,56.5 116.5,56" fill="#FFD985" />
            <circle cx="106" cy="100" r="5" fill="#15152D" />
            <circle cx="142" cy="100" r="5" fill="#15152D" />
          </svg>
        </div>
      )}
    </div>
  );
};
