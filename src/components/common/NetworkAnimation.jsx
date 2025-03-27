import { useEffect, useRef, memo } from "react";
import { useTheme } from '../../contexts/ThemeContext';
import { isLowPerformanceDevice, prefersReducedMotion } from '../../utils/performanceUtils';

const NetworkAnimation = memo(() => {
  const { darkMode } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pointsRef = useRef([]);

  // Initialize the animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const isLowPerf = isLowPerformanceDevice();
    const reduceMotion = prefersReducedMotion();
    
    // Set canvas dimensions with proper DPI scaling
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      // Generate fewer points for better performance but ensure enough for visually pleasing effect
      const density = isLowPerf || reduceMotion ? 15000 : 10000; // Lower number = more points
      const numPoints = Math.max(20, Math.floor((rect.width * rect.height) / density));
      
      const newPoints = [];
      for (let i = 0; i < numPoints; i++) {
        newPoints.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.3, // Increased velocity
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2.5 + 1.2 // Larger points for better visibility
        });
      }
      
      pointsRef.current = newPoints;
    };

    // Draw animation frame
    const draw = () => {
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const points = pointsRef.current;
      // Stronger colors for dark/light modes
      const particleColor = darkMode ? "#37E359" : "#0284c7"; // Brighter green for dark mode, stronger blue for light
      
      // Draw and update particles
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        
        // Update position
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off edges
        if (point.x < 0 || point.x > rect.width) point.vx *= -1;
        if (point.y < 0 || point.y > rect.height) point.vy *= -1;
        
        // Keep within bounds
        point.x = Math.max(0, Math.min(rect.width, point.x));
        point.y = Math.max(0, Math.min(rect.height, point.y));
        
        // Draw particle with gradient for better appearance
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.radius
        );
        
        if (darkMode) {
          gradient.addColorStop(0, 'rgba(55, 227, 89, 1)'); // Bright center
          gradient.addColorStop(1, 'rgba(55, 227, 89, 0.3)'); // Faded edge
        } else {
          gradient.addColorStop(0, 'rgba(2, 132, 199, 1)');
          gradient.addColorStop(1, 'rgba(2, 132, 199, 0.3)');
        }
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Draw connections with thicker, more visible lines
      const maxDistance = isLowPerf ? 100 : 150; // Increased connection distance
      ctx.lineWidth = darkMode ? 0.8 : 0.6; // Thicker lines
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          
          // Fast distance check using squared distance
          const distSquared = dx * dx + dy * dy;
          if (distSquared < maxDistance * maxDistance) {
            const dist = Math.sqrt(distSquared);
            // Higher opacity for better visibility
            const opacity = 0.35 * (1 - dist / maxDistance); // Increased from 0.1 to 0.35
            
            if (darkMode) {
              ctx.strokeStyle = `rgba(55, 227, 89, ${opacity})`;
            } else {
              ctx.strokeStyle = `rgba(2, 132, 199, ${opacity})`;
            }
            
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Request next frame with appropriate throttling
      animationRef.current = requestAnimationFrame(draw);
    };

    // Handle window resize
    const handleResize = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeCanvas();
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Initialize
    resizeCanvas();
    draw();
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [darkMode]);
  
  // Add one frame delay to force a render cycle after the canvas is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ 
        background: darkMode ? '#051626' : '#F8F9FA',
        opacity: 1 // Increased from 0.8 to 1 for full visibility
      }}
      aria-hidden="true"
    />
  );
});

NetworkAnimation.displayName = 'NetworkAnimation';

export default NetworkAnimation;