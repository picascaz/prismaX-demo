import React, { useEffect, useRef } from 'react';

const ParticleCircle = () => {
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const particles: any[] = [];
  // const radius = 150; // 圆的半径
  // const particleCount = 100; // 粒子数量

  // const minDistance = 10; // 粒子之间的最小距离，避免重叠

  // const usedPositions: { x: number; y: number }[] = []; // 记录已使用的位置

  // useEffect(() => {
  //   const centerX = window.innerWidth / 2;
  //   const centerY = window.innerHeight / 2;
  //   const canvas = canvasRef.current!;
  //   const ctx = canvas.getContext('2d')!;

  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;

  //   // 粒子生成函数（取代类）
  //   const createParticle = () => {
  //     // 生成不重叠的目标位置
  //     const generateUniqueTargetPosition = () => {
  //       let isValid = false;
  //       let targetX: number
  //       let targetY: number

  //       while (!isValid) {
  //         const angle = Math.random() * Math.PI * 2;
  //         targetX = centerX + Math.cos(angle) * Math.random() * radius;
  //         targetY = centerY + Math.sin(angle) * Math.random() * radius;

  //         // 检查与已使用位置的距离是否足够远
  //         isValid = !usedPositions.some(
  //           pos => Math.hypot(pos.x - targetX, pos.y - targetY) < minDistance
  //         );
  //       }

  //       // 记录这个位置
  //       usedPositions.push({ x: targetX, y: targetY });

  //       return { x: targetX, y: targetY };
  //     };

  //     const position = generateUniqueTargetPosition();
  //     return {
  //       x: Math.random() * canvas.width,
  //       y: Math.random() * canvas.height,
  //       size: Math.random() * 2 + 1,
  //       velocityX: (Math.random() - 0.5) * 2,
  //       velocityY: (Math.random() - 0.5) * 2,
  //       color: 'white',
  //       targetX: position.x,
  //       targetY: position.y,
  //     };
  //   };

  //   // 初始化粒子
  //   const initParticles = () => {
  //     for (let i = 0; i < particleCount; i++) {
  //       particles.push(createParticle());
  //     }
  //   };

  //   // 动画函数
  //   const animateParticles = () => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     particles.forEach((particle) => {
  //       // 更新粒子位置朝向目标位置
  //       particle.x += (particle.targetX - particle.x) * 0.05;
  //       particle.y += (particle.targetY - particle.y) * 0.05;

  //       // 粒子在目标附近小幅度抖动
  //       const distFromTarget = Math.hypot(particle.x - particle.targetX, particle.y - particle.targetY);
  //       if (distFromTarget < 3) {
  //         particle.velocityX = (Math.random() - 0.5) * 0.1;
  //         particle.velocityY = (Math.random() - 0.5) * 0.1;
  //         particle.x += particle.velocityX;
  //         particle.y += particle.velocityY;
  //       }

  //       ctx.beginPath();
  //       ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  //       ctx.fillStyle = particle.color;
  //       ctx.fill();
  //     });

  //     requestAnimationFrame(animateParticles);
  //   };

  //   // 初始化粒子并启动动画
  //   initParticles();
  //   animateParticles();

  //   // 更新画布尺寸
  //   const handleResize = () => {
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []); // 空数组作为依赖项确保只在组件挂载时执行一次

  return <canvas style={{ display: 'block' }} />;
};

export default ParticleCircle;
