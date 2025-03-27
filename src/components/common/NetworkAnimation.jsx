import { useCallback, useEffect, useState, useRef, memo } from "react";
import { useTheme } from '../../contexts/ThemeContext';

// Memorizando o componente para evitar renderizações desnecessárias
const NetworkAnimation = memo(() => {
  const { darkMode } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pointsRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Usar cor verde DevClub
  const particleColor = "#37E359";
  const lineColor = "rgba(55, 227, 89, 0.15)";

  // Inicialização com useCallback para prevenir recriações desnecessárias
  const init = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas dimensions properly for high DPI displays
    const rect = canvas.getBoundingClientRect();
    setDimensions({
      width: rect.width,
      height: rect.height
    });
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Criar menos pontos para melhorar a performance
    const numPoints = Math.floor((rect.width * rect.height) / 15000); // Reduzi a densidade de pontos
    const newPoints = [];
    
    for (let i = 0; i < numPoints; i++) {
      newPoints.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: Math.random() * 0.2 - 0.1, // Velocidade reduzida ainda mais
        vy: Math.random() * 0.2 - 0.1,
        radius: Math.random() * 1.2 + 0.3 // Pontos menores
      });
    }
    
    pointsRef.current = newPoints;
  }, []);
  
  const animate = useCallback(() => {
    if (!canvasRef.current || pointsRef.current.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = dimensions;
    
    ctx.clearRect(0, 0, width, height);
    
    // Otimizando a computação e desenho de pontos
    const points = pointsRef.current;
    
    // Atualizando posições
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      
      // Atualizar posição
      point.x += point.vx;
      point.y += point.vy;
      
      // Lidar com bordas
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
      
      // Garantir que esteja dentro do canvas
      point.x = Math.max(0, Math.min(width, point.x));
      point.y = Math.max(0, Math.min(height, point.y));
      
      // Desenhar partícula
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
    
    // Desenhar conexões com distância máxima reduzida para evitar muitas linhas
    // e calcular apenas para pontos próximos
    const maxDistance = 80; // Reduzido de 120
    
    ctx.lineWidth = 0.4; // Linhas mais finas
    
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        
        // Verificação rápida usando distância ao quadrado para evitar raiz quadrada
        const distanceSquared = dx * dx + dy * dy;
        const maxDistanceSquared = maxDistance * maxDistance;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = 0.15 * (1 - distance / maxDistance);
          
          ctx.strokeStyle = `rgba(55, 227, 89, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, particleColor]);
  
  // Configurar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      init();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [init]);
  
  // Iniciar animação quando os pontos estiverem prontos
  useEffect(() => {
    if (pointsRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [animate, dimensions]);
  
  // Lidar com redimensionamento
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Cancelar a animação atual antes de reinicializar
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        init();
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [init]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ 
        background: darkMode ? '#051626' : '#F8F9FA',
        opacity: 0.7 // Reduzindo um pouco a opacidade para melhorar desempenho visual
      }}
      aria-hidden="true"
    />
  );
});

NetworkAnimation.displayName = 'NetworkAnimation';

export default NetworkAnimation;