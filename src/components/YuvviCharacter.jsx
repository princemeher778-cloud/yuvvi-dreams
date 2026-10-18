import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

const YUVVI_QUOTES = [
  "Ooh! Did you bring a gentle dream today? ✨",
  "Hold tight to your wonder! It never fades in the quiet.",
  "Listen closely... even small wishes make sweet music.",
  "Every star in the sky was once a cozy daydream.",
  "My lantern and little cloud keep all the sleepy wishes safe!",
  "A little puff of courage is all it takes to float high.",
  "You can gently spin me around if you want to look at my lantern! ✨"
];

export const YuvviCharacter = ({
  size = 'medium', // 'small' | 'medium' | 'large' | 'hero'
  expression = 'happy',
  interactive = true,
  showLantern = true,
  onLanternClick = null,
  customMessage = null,
  flightPose = false,
  lookTarget = null,
  className = ''
}) => {
  const mountRef = useRef(null);
  const [speech, setSpeech] = useState(customMessage);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const { isDayMode } = useTheme?.() || { isDayMode: false };

  // Pointer & Drag tracking for natural eye-following and 3D rotation
  const pointerRef = useRef({
    x: 0,
    y: 0,
    orbitX: 0,
    orbitY: 0,
    targetOrbitX: 0,
    targetOrbitY: 0,
    isDragging: false,
    startX: 0,
    startY: 0
  });

  const scaleMap = {
    small: { width: 145, height: 140 },
    medium: { width: 230, height: 220 },
    large: { width: 310, height: 295 },
    hero: { width: 390, height: 365 }
  };

  const currentScale = scaleMap[size] || scaleMap.medium;

  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  useEffect(() => {
    if (customMessage) setSpeech(customMessage);
  }, [customMessage]);

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
      camera.position.set(0, 0, 5.4);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(currentScale.width, currentScale.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      container.replaceChildren(renderer.domElement);

      // --- LIGHTING ---
      const ambientLight = new THREE.AmbientLight(0xfff0fa, 1.6);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(-2.5, 4, 3.5);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xb6a4ff, 1.8);
      rimLight.position.set(2.8, -1.8, -2);
      scene.add(rimLight);

      const lanternLight = new THREE.PointLight(0xffd985, 3.5, 5.5);
      lanternLight.position.set(1.4, 0.3, 0.8);
      scene.add(lanternLight);

      // --- ROOT CHARACTER GROUP ---
      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Materials
      const ghostMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.02,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        transmission: 0.18,
        ior: 1.35,
        sheen: 0.6,
        sheenColor: new THREE.Color(0xd99bcb)
      });

      const cloudMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.35,
        clearcoat: 0.4,
        sheen: 0.8,
        sheenColor: new THREE.Color(0xb6a4ff)
      });

      // --- 1. SMALL FLOATING COMPANION CLOUD (Beneath Yuvvi) ---
      const cloudGroup = new THREE.Group();
      cloudGroup.position.set(0, -1.05, 0);

      const puffGeo = new THREE.SphereGeometry(0.38, 20, 20);
      const centerPuff = new THREE.Mesh(puffGeo, cloudMaterial);
      centerPuff.scale.set(1.5, 0.85, 1.1);
      cloudGroup.add(centerPuff);

      const leftPuff = new THREE.Mesh(puffGeo, cloudMaterial);
      leftPuff.position.set(-0.55, -0.05, 0.05);
      leftPuff.scale.set(1.1, 0.75, 0.95);
      cloudGroup.add(leftPuff);

      const rightPuff = new THREE.Mesh(puffGeo, cloudMaterial);
      rightPuff.position.set(0.55, -0.04, 0.05);
      rightPuff.scale.set(1.15, 0.8, 0.95);
      cloudGroup.add(rightPuff);

      const frontPuff = new THREE.Mesh(puffGeo, cloudMaterial);
      frontPuff.position.set(0.1, -0.12, 0.3);
      frontPuff.scale.set(1.2, 0.65, 0.9);
      cloudGroup.add(frontPuff);

      rootGroup.add(cloudGroup);

      // --- 2. YUVVI'S GHOST BODY (Standing on the Cloud) ---
      const yuvviGroup = new THREE.Group();
      yuvviGroup.position.set(0, 0.15, 0);

      const bodyGeometry = new THREE.SphereGeometry(1.05, 36, 36);
      const posAttr = bodyGeometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        if (y < 0) {
          x *= 1.1;
          z *= 1.1;
        } else {
          x *= 0.92;
          z *= 0.92;
        }
        if (z > 0) z *= 1.08;

        posAttr.setXYZ(i, x, y, z);
      }
      bodyGeometry.computeVertexNormals();

      const bodyMesh = new THREE.Mesh(bodyGeometry, ghostMaterial);
      bodyMesh.scale.set(0.95, 1.18, 0.9);
      yuvviGroup.add(bodyMesh);

      // Forehead Golden Star
      const starShape = new THREE.Shape();
      const points = 5;
      const outerRadius = 0.13;
      const innerRadius = 0.055;
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
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.6
      });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.set(0, 0.68, 0.9);
      yuvviGroup.add(starMesh);

      // Expressive Glossy Eyes
      const eyeGeo = new THREE.SphereGeometry(0.1, 24, 24);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x111124,
        roughness: 0.04,
        metalness: 0.1
      });

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.3, 0.1, 0.92);
      leftEye.scale.set(1, 1.3, 0.6);
      yuvviGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.3, 0.1, 0.92);
      rightEye.scale.set(1, 1.3, 0.6);
      yuvviGroup.add(rightEye);

      // Catchlight highlights
      const catchlightGeo = new THREE.SphereGeometry(0.03, 12, 12);
      const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const leftCatch = new THREE.Mesh(catchlightGeo, catchlightMat);
      leftCatch.position.set(-0.33, 0.14, 0.98);
      yuvviGroup.add(leftCatch);

      const rightCatch = new THREE.Mesh(catchlightGeo, catchlightMat);
      rightCatch.position.set(0.27, 0.14, 0.98);
      yuvviGroup.add(rightCatch);

      // Rosy Cheeks
      const cheekGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const cheekMat = new THREE.MeshBasicMaterial({
        color: 0xd99bcb,
        transparent: true,
        opacity: 0.58
      });

      const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
      leftCheek.position.set(-0.44, -0.07, 0.85);
      leftCheek.scale.set(1.4, 0.6, 0.4);
      yuvviGroup.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
      rightCheek.position.set(0.44, -0.07, 0.85);
      rightCheek.scale.set(1.4, 0.6, 0.4);
      yuvviGroup.add(rightCheek);

      // Tiny Cloud Feet resting on the companion cloud
      const footGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const leftFoot = new THREE.Mesh(footGeo, ghostMaterial);
      leftFoot.position.set(-0.25, -0.92, 0.2);
      leftFoot.scale.set(1.1, 0.8, 1.3);
      yuvviGroup.add(leftFoot);

      const rightFoot = new THREE.Mesh(footGeo, ghostMaterial);
      rightFoot.position.set(0.25, -0.92, 0.2);
      rightFoot.scale.set(1.1, 0.8, 1.3);
      yuvviGroup.add(rightFoot);

      // Arms
      const armGeo = new THREE.SphereGeometry(0.17, 16, 16);
      const leftArm = new THREE.Mesh(armGeo, ghostMaterial);
      leftArm.position.set(-0.85, -0.15, 0.2);
      leftArm.scale.set(0.7, 1.35, 0.7);
      leftArm.rotation.z = 0.35;
      yuvviGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, ghostMaterial);
      rightArm.position.set(0.85, -0.1, 0.3);
      rightArm.scale.set(0.7, 1.35, 0.7);
      rightArm.rotation.z = -0.55;
      yuvviGroup.add(rightArm);

      rootGroup.add(yuvviGroup);

      // --- 3. FLOATING DREAM LANTERN ---
      let lanternGroup = null;
      let starFlame = null;

      if (showLantern) {
        lanternGroup = new THREE.Group();
        lanternGroup.position.set(1.3, 0.15, 0.6);

        const capGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.09, 18);
        const brassMat = new THREE.MeshStandardMaterial({
          color: 0xd4a137,
          roughness: 0.25,
          metalness: 0.8
        });
        const capMesh = new THREE.Mesh(capGeo, brassMat);
        capMesh.position.y = 0.3;
        lanternGroup.add(capMesh);

        const ringGeo = new THREE.TorusGeometry(0.08, 0.024, 12, 24);
        const ringMesh = new THREE.Mesh(ringGeo, brassMat);
        ringMesh.position.y = 0.4;
        ringMesh.rotation.x = Math.PI / 2;
        lanternGroup.add(ringMesh);

        const glassGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.42, 24, 1, true);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xfff9e6,
          transmission: 0.92,
          opacity: 0.85,
          transparent: true,
          roughness: 0.05
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        lanternGroup.add(glassMesh);

        const flameGeo = new THREE.OctahedronGeometry(0.1, 1);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffd985 });
        starFlame = new THREE.Mesh(flameGeo, flameMat);
        lanternGroup.add(starFlame);

        const baseGeo = new THREE.CylinderGeometry(0.2, 0.17, 0.08, 18);
        const baseMesh = new THREE.Mesh(baseGeo, brassMat);
        baseMesh.position.y = -0.24;
        lanternGroup.add(baseMesh);

        rootGroup.add(lanternGroup);
      }

      // --- ANIMATION LOOP ---
      const startTime = performance.now();
      let nextBlink = 2.0;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = (performance.now() - startTime) * 0.001;

        // Gentle Floating Animation (Yuvvi + Cloud together)
        const hoverY = Math.sin(elapsed * 1.8) * 0.12;
        const hoverRoll = Math.sin(elapsed * 1.4) * 0.035;
        rootGroup.position.y = hoverY;
        rootGroup.rotation.z = hoverRoll;

        // Subtle cloud puff breathing
        cloudGroup.scale.set(
          1 + Math.sin(elapsed * 2) * 0.03,
          1 + Math.cos(elapsed * 2) * 0.02,
          1 + Math.sin(elapsed * 2) * 0.03
        );

        // Flight pose lean
        if (flightPose) {
          rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, 0.32, 0.1);
        } else {
          rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, 0, 0.08);
        }

        // Reduced motion check
        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Subtle, curious head tilt oscillation
        const headTilt = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.1) * 0.045;

        // Smooth look & 3D Orbit Drag combination
        let targetRotY = pointerRef.current.orbitY + headTilt;
        let targetRotX = pointerRef.current.orbitX;

        if (lookTarget) {
          targetRotY += (lookTarget.x / window.innerWidth - 0.5) * 0.55;
          targetRotX += -(lookTarget.y / window.innerHeight - 0.5) * 0.35;
        } else {
          targetRotY += pointerRef.current.x * (prefersReducedMotion ? 0.05 : 0.42);
          targetRotX += -pointerRef.current.y * (prefersReducedMotion ? 0.04 : 0.26);
        }

        yuvviGroup.rotation.y = THREE.MathUtils.lerp(yuvviGroup.rotation.y, targetRotY, 0.08);
        yuvviGroup.rotation.x = THREE.MathUtils.lerp(yuvviGroup.rotation.x, targetRotX, 0.08);
        yuvviGroup.rotation.z = headTilt * 0.5;

        // Natural Eye Tracking: pupils & highlights follow pointer coordinates naturally
        const eyeOffsetX = THREE.MathUtils.clamp(pointerRef.current.x * 0.04, -0.04, 0.04);
        const eyeOffsetY = THREE.MathUtils.clamp(-pointerRef.current.y * 0.035, -0.035, 0.035);

        leftEye.position.x = -0.3 + eyeOffsetX;
        leftEye.position.y = 0.1 + eyeOffsetY;
        rightEye.position.x = 0.3 + eyeOffsetX;
        rightEye.position.y = 0.1 + eyeOffsetY;

        leftCatch.position.x = -0.33 + eyeOffsetX * 0.8;
        leftCatch.position.y = 0.14 + eyeOffsetY * 0.8;
        rightCatch.position.x = 0.27 + eyeOffsetX * 0.8;
        rightCatch.position.y = 0.14 + eyeOffsetY * 0.8;

        // If user finished dragging, orbit gently springs back to center over time
        if (!pointerRef.current.isDragging) {
          pointerRef.current.orbitY = THREE.MathUtils.lerp(pointerRef.current.orbitY, 0, 0.025);
          pointerRef.current.orbitX = THREE.MathUtils.lerp(pointerRef.current.orbitX, 0, 0.025);
        }

        // Blinking
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

        // Lantern hover & starlight flame
        if (lanternGroup) {
          lanternGroup.position.y = 0.15 + hoverY * 0.5 + Math.cos(elapsed * 2.2) * 0.05;
          lanternGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.06;

          if (starFlame) {
            const starPulse = 1 + Math.sin(elapsed * 5) * 0.14;
            starFlame.scale.set(starPulse, starPulse, starPulse);
            starFlame.rotation.y = elapsed * 1.2;
          }
        }

        // Responsive Lighting for Day / Night mode
        if (isDayMode) {
          ambientLight.color.setHex(0xfffaea);
          ambientLight.intensity = 1.85;
          rimLight.color.setHex(0xffd985);
          lanternLight.intensity = 2.2;
        } else {
          ambientLight.color.setHex(0xfff0fa);
          ambientLight.intensity = 1.5;
          rimLight.color.setHex(0xb6a4ff);
          lanternLight.intensity = 3.6;
        }

        renderer.render(scene, camera);
      };

      // Pointer tracking listener for natural eye following
      const handleGlobalPointerMove = (e) => {
        pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      };

      window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });

      animate();

      return () => {
        window.removeEventListener('pointermove', handleGlobalPointerMove);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer) renderer.dispose();
        if (container) container.innerHTML = '';
      };
    } catch {
      setWebGlSupported(false);
    }
  }, [currentScale.width, currentScale.height, showLantern, flightPose, isDayMode, lookTarget]);

  // Pointer drag to orbit 3D Yuvvi
  const handlePointerDown = (e) => {
    pointerRef.current.isDragging = true;
    pointerRef.current.startX = e.clientX;
    pointerRef.current.startY = e.clientY;
    pointerRef.current.moved = false;
  };

  const handlePointerMove = (e) => {
    if (!pointerRef.current.isDragging) return;
    const dx = e.clientX - pointerRef.current.startX;
    const dy = e.clientY - pointerRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      pointerRef.current.moved = true;
    }
    pointerRef.current.orbitY += dx * 0.008;
    pointerRef.current.orbitX = THREE.MathUtils.clamp(
      pointerRef.current.orbitX + dy * 0.006,
      -0.65,
      0.65
    );
    pointerRef.current.startX = e.clientX;
    pointerRef.current.startY = e.clientY;
  };

  const handlePointerUp = () => {
    const wasClick = !pointerRef.current.moved;
    pointerRef.current.isDragging = false;
    if (wasClick) {
      handleGhostClick();
    }
  };

  const handleGhostClick = () => {
    if (!interactive) return;
    sound.playChime(659.25, 'sine', 0.8);
    setCurrentExpression((prev) => (prev === 'waving' ? 'happy' : 'waving'));
    const randomQuote = YUVVI_QUOTES[Math.floor(Math.random() * YUVVI_QUOTES.length)];
    setSpeech(randomQuote);
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
      {/* Speech Bubble */}
      {speech && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'absolute',
            top: size === 'hero' ? '-45px' : '-32px',
            background: 'var(--color-card-bg)',
            color: 'var(--color-text-main)',
            border: '1.5px solid var(--color-lavender)',
            borderRadius: '18px',
            padding: '0.55rem 1.1rem',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-rounded)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
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
          onPointerDown={interactive ? handlePointerDown : undefined}
          onPointerMove={interactive ? handlePointerMove : undefined}
          onPointerUp={interactive ? handlePointerUp : undefined}
          onPointerCancel={interactive ? handlePointerUp : undefined}
          style={{
            width: `${currentScale.width}px`,
            height: `${currentScale.height}px`,
            cursor: interactive ? (pointerRef.current?.isDragging ? 'grabbing' : 'grab') : 'default',
            touchAction: 'none',
            filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.45))',
            transition: 'filter 0.3s ease'
          }}
          title={interactive ? 'Drag to rotate Yuvvi in 3D, or click to say hello ✨' : ''}
          role="img"
          aria-label="Interactive 3D Yuvvi the cloud ghost standing on his floating cloud"
        />
      ) : (
        /* Cute Cloud Ghost Fallback */
        <div
          onClick={handleGhostClick}
          onTouchStart={handleGhostClick}
          style={{
            width: `${currentScale.width}px`,
            height: `${currentScale.height}px`,
            cursor: interactive ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'manipulation'
          }}
          title={interactive ? 'Tap Yuvvi to interact ✨' : ''}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGhostClick(); }}
        >
          <svg width={currentScale.width} height={currentScale.height} viewBox="0 0 280 240" fill="none">
            {/* Companion Cloud Base */}
            <path
              d="M 60 180 Q 75 160 100 170 Q 130 150 160 165 Q 190 155 210 175 Q 230 195 200 210 Q 160 215 120 210 Q 70 215 60 180 Z"
              fill="#FFFFFF"
              stroke="#B6A4FF"
              strokeWidth="2.5"
            />
            {/* Yuvvi Body */}
            <path
              d="M 120 50 C 90 50, 80 80, 80 125 C 80 165, 88 175, 98 172 C 108 168, 114 175, 122 172 C 130 168, 138 175, 148 172 C 158 168, 164 175, 172 170 C 178 165, 176 150, 176 125 C 176 80 155 50 120 50 Z"
              fill="#FFFFFF"
              stroke="#B6A4FF"
              strokeWidth="3"
            />
            <polygon points="120,58 123.5,66 132,66.5 125.5,73.5 127.5,82 120,77 112.5,82 114.5,73.5 108,66.5 116.5,66" fill="#FFD985" />
            <circle cx="106" cy="110" r="5" fill="#15152D" />
            <circle cx="142" cy="110" r="5" fill="#15152D" />
            <ellipse cx="96" cy="120" rx="7" ry="4" fill="#D99BCB" opacity="0.6" />
            <ellipse cx="152" cy="120" rx="7" ry="4" fill="#D99BCB" opacity="0.6" />
          </svg>
        </div>
      )}
    </div>
  );
};
