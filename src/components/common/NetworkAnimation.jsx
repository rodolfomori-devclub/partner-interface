import { useCallback, useEffect, useState } from "react";
import { useTheme } from '../../contexts/ThemeContext';

const NetworkAnimation = () => {
  const { darkMode } = useTheme();
  const [canvas, setCanvas] = useState(null);
  const [points, setPoints] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Usar cor verde DevClub
  const particleColor = "#37E359";
  const lineColor = "rgba(55, 227, 89, 0.15)";

  const init = useCallback(() => {
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas dimensions properly for high DPI displays
    const rect = canvas.getBoundingClientRect();
    setWidth(rect.width);
    setHeight(rect.height);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Create particles
    const numPoints = Math.floor((rect.width * rect.height) / 8000); // Mais pontos para rede mais densa
    const newPoints = [];
    
    for (let i = 0; i < numPoints; i++) {
      newPoints.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: Math.random() * 0.3 - 0.15, // Velocidade reduzida para movimento mais suave
        vy: Math.random() * 0.3 - 0.15,
        radius: Math.random() * 1.5 + 0.5 // Pontos menores
      });
    }
    
    setPoints(newPoints);
  }, [canvas]);
  
  const animate = useCallback(() => {
    if (!canvas || points.length === 0) return;
    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    const updatedPoints = points.map(point => {
      // Update position
      let x = point.x + point.vx;
      let y = point.y + point.vy;
      
      // Bounce off edges
      if (x < 0 || x > width) point.vx *= -1;
      if (y < 0 || y > height) point.vy *= -1;
      
      // Constrain to canvas
      x = Math.max(0, Math.min(width, x));
      y = Math.max(0, Math.min(height, y));
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(x, y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
      
      return {
        ...point,
        x,
        y
      };
    });
    
    // Draw connections
    ctx.beginPath();
    for (let i = 0; i < updatedPoints.length; i++) {
      for (let j = i + 1; j < updatedPoints.length; j++) {
        const dx = updatedPoints[i].x - updatedPoints[j].x;
        const dy = updatedPoints[i].y - updatedPoints[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Aumentar a distância máxima para mais conexões
        if (distance < 120) {
          // Opacidade varia com a distância - mais próximo = mais visível
          ctx.strokeStyle = `rgba(55, 227, 89, ${0.2 * (1 - distance/120)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(updatedPoints[i].x, updatedPoints[i].y);
          ctx.lineTo(updatedPoints[j].x, updatedPoints[j].y);
          ctx.stroke();
        }
      }
    }
    
    setPoints(updatedPoints);
    requestAnimationFrame(animate);
  }, [canvas, points, width, height, particleColor]);
  
  useEffect(() => {
    const canvasElement = document.getElementById("network-canvas");
    setCanvas(canvasElement);
  }, []);
  
  useEffect(() => {
    if (canvas) {
      init();
    }
  }, [canvas, init]);
  
  useEffect(() => {
    if (points.length > 0) {
      const animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [points, animate]);
  
  useEffect(() => {
    const handleResize = () => {
      if (canvas) {
        init();
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvas, init]);
  
  return (
    <canvas
      id="network-canvas"
      className="absolute inset-0 w-full h-full z-0"
      style={{ 
        background: darkMode ? '#051626' : '#F8F9FA',
        opacity: 0.8
      }}
      aria-hidden="true"
    />
  );
};

export default NetworkAnimation;