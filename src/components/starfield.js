'use client'; // Ensure client-side rendering for App Router

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    let stars = [];
    const numStars = 100; // Lightweight number of stars

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star class
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Slightly larger for visibility
        this.opacity = Math.random() * 0.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3; // Slower for subtle movement
        this.speedY = (Math.random() - 0.5) * 0.3;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
    }

    // Initialize stars
    try {
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
      }
    } catch (error) {
      console.error('Error initializing stars:', error);
    }

    // Animation loop
    const animateStars = () => {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => {
          star.update();
          star.draw();
        });
      } catch (error) {
        console.error('Error in animation loop:', error);
      }
    };

    // GSAP twinkling effect
    stars.forEach((star) => {
      gsap.to(star, {
        opacity: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Start animation with GSAP ticker
    gsap.ticker.add(animateStars);
    console.log('Starfield animation started');

    // Cleanup
    return () => {
      console.log('Cleaning up Starfield');
      window.removeEventListener('resize', resizeCanvas);
      gsap.ticker.remove(animateStars);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default Starfield;