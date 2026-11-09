import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../features/settings/ThemeContext';

interface InteractiveSchedule3DProps {
  className?: string;
}

export const InteractiveSchedule3D: React.FC<InteractiveSchedule3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- Generate Dynamic Canvas Texture representing a Real Schedule ---
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 1024;
    texCanvas.height = 700;
    const ctx = texCanvas.getContext('2d');

    const updateTextureContent = () => {
      if (!ctx) return;
      const palette = currentTheme.coursePalette;

      // Card Background (Theme Surface)
      ctx.fillStyle = currentTheme.isDark ? '#1a1f26' : '#ffffff';
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

      // Card Header
      ctx.fillStyle = currentTheme.isDark ? '#232b36' : '#f5f4ef';
      ctx.fillRect(0, 0, texCanvas.width, 100);

      // Subtle Header Border
      ctx.strokeStyle = currentTheme.isDark ? '#333e4f' : '#e5e1d5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 100);
      ctx.lineTo(texCanvas.width, 100);
      ctx.stroke();

      // Header Text
      ctx.fillStyle = currentTheme.isDark ? '#f0f3f8' : '#1e241d';
      ctx.font = '600 28px Inter, sans-serif';
      ctx.fillText('SCHEDULE PLANNING MATRIX', 40, 50);

      ctx.fillStyle = currentTheme.isDark ? '#8d9bb0' : '#6b7266';
      ctx.font = '500 18px Inter, sans-serif';
      ctx.fillText('First Semester · 18.0 Units · Conflict-Free Selection', 40, 80);

      // Grid Columns: Mon, Tue, Wed, Thu, Fri
      const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
      const colWidth = (texCanvas.width - 120) / 5;
      const startX = 60;
      const startY = 120;
      const gridHeight = 540;

      // Draw day column titles & divider lines
      days.forEach((day, i) => {
        const x = startX + i * colWidth;

        ctx.fillStyle = currentTheme.isDark ? '#7a889b' : '#737b6f';
        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillText(day, x + 10, startY + 20);

        ctx.strokeStyle = currentTheme.isDark ? '#26303d' : '#eeece2';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, startY + 30);
        ctx.lineTo(x, startY + gridHeight);
        ctx.stroke();
      });

      // Sample classes mapped into the grid using the active theme's colors!
      const sampleBlocks = [
        { dayIndex: 0, top: 50, height: 110, code: 'CS 101', title: 'Data Structures', room: 'Lab 1', colorIdx: 0 },
        { dayIndex: 0, top: 180, height: 130, code: 'MATH 201', title: 'Discrete Math', room: 'Hall 3', colorIdx: 1 },
        { dayIndex: 1, top: 80, height: 100, code: 'PHYS 102', title: 'General Physics', room: 'Aud 2', colorIdx: 2 },
        { dayIndex: 1, top: 220, height: 140, code: 'ENG 105', title: 'Academic Writing', room: 'Room 204', colorIdx: 3 },
        { dayIndex: 2, top: 50, height: 110, code: 'CS 101', title: 'Data Structures', room: 'Lab 1', colorIdx: 0 },
        { dayIndex: 2, top: 180, height: 130, code: 'MATH 201', title: 'Discrete Math', room: 'Hall 3', colorIdx: 1 },
        { dayIndex: 3, top: 80, height: 100, code: 'PHYS 102', title: 'General Physics', room: 'Aud 2', colorIdx: 2 },
        { dayIndex: 3, top: 200, height: 120, code: 'HIST 110', title: 'Modern History', room: 'Room 101', colorIdx: 4 },
        { dayIndex: 4, top: 100, height: 150, code: 'CS 101L', title: 'Algorithms Lab', room: 'Lab 4', colorIdx: 5 },
        { dayIndex: 4, top: 270, height: 100, code: 'PE 102', title: 'Physical Wellness', room: 'Gym', colorIdx: 6 },
      ];

      sampleBlocks.forEach((block) => {
        const x = startX + block.dayIndex * colWidth + 6;
        const y = startY + 40 + block.top;
        const w = colWidth - 12;
        const h = block.height;
        const c = palette[block.colorIdx % palette.length];

        // Block Background
        ctx.fillStyle = c.bg;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();

        // Block Border
        ctx.strokeStyle = c.border;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Code
        ctx.fillStyle = c.text;
        ctx.font = '700 15px Inter, sans-serif';
        ctx.fillText(block.code, x + 10, y + 24);

        // Title
        ctx.fillStyle = c.text;
        ctx.font = '500 13px Inter, sans-serif';
        ctx.fillText(block.title, x + 10, y + 46);

        // Room badge
        ctx.fillStyle = c.tagBg;
        ctx.beginPath();
        ctx.roundRect(x + 10, y + h - 26, 60, 18, 4);
        ctx.fill();

        ctx.fillStyle = c.tagText;
        ctx.font = '600 10px monospace';
        ctx.fillText(block.room, x + 16, y + h - 14);
      });

      // Subtle Outer Rounded Border of Card
      ctx.strokeStyle = currentTheme.isDark ? '#414f63' : '#d8d4c5';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, texCanvas.width - 4, texCanvas.height - 4);
    };

    updateTextureContent();
    const texture = new THREE.CanvasTexture(texCanvas);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Planar 3D Geometry for the Schedule Slate
    const geometry = new THREE.PlaneGeometry(3.5, 2.4, 32, 32);

    // Give a very gentle 3D curve to simulate a physical paper/slate card
    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      // Subtle concave curvature
      const z = -(x * x * 0.035 + y * y * 0.02);
      positionAttribute.setZ(i, z);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const cardMesh = new THREE.Mesh(geometry, material);
    scene.add(cardMesh);

    // Subtle drop shadow plane behind the card
    const shadowGeo = new THREE.PlaneGeometry(3.4, 2.3);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: currentTheme.isDark ? 0.35 : 0.12,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0.05, -0.08, -0.15);
    scene.add(shadowMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, currentTheme.isDark ? 1.4 : 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, currentTheme.isDark ? 1.6 : 1.4);
    dirLight.position.set(4, 5, 6);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(
      currentTheme.isDark ? 0x90b4e2 : 0xffffff,
      2.0,
      10
    );
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Pointer Interactivity (Normalized Mouse Coordinates)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      // Max tilt angles: ~20 degrees
      targetRotY = normX * 0.38;
      targetRotX = -normY * 0.28;

      pointLight.position.x = normX * 2.5;
      pointLight.position.y = normY * 2.5;
    };

    const handlePointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    window.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with smooth lerp interpolation and gentle floating oscillation
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping (lerp)
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      // Subtle resting idle float
      const idleFloatY = Math.sin(elapsedTime * 1.4) * 0.05;
      const idleTiltZ = Math.cos(elapsedTime * 1.1) * 0.015;

      cardMesh.rotation.x = currentRotX;
      cardMesh.rotation.y = currentRotY;
      cardMesh.rotation.z = idleTiltZ;
      cardMesh.position.y = idleFloatY;

      shadowMesh.rotation.x = currentRotX;
      shadowMesh.rotation.y = currentRotY;
      shadowMesh.position.y = idleFloatY - 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mouseleave', handlePointerLeave);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      shadowGeo.dispose();
      material.dispose();
      shadowMat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [currentTheme]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Hover and drag to rotate the 3D timetable card"
    />
  );
};
