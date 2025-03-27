/**
 * Utilitários para melhorar a performance da aplicação
 */

/**
 * Função para debounce de eventos
 * Limita a frequência com que uma função é executada
 * 
 * @param {Function} func - A função para aplicar o debounce
 * @param {number} wait - Tempo de espera em ms
 * @param {boolean} immediate - Se a função deve ser executada imediatamente
 * @returns {Function} - Função com debounce aplicado
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Função para throttle de eventos
 * Garante que uma função seja executada no máximo uma vez em um período
 * 
 * @param {Function} func - A função para aplicar o throttle
 * @param {number} limit - Período mínimo entre execuções em ms
 * @returns {Function} - Função com throttle aplicado
 */
export const throttle = (func, limit = 300) => {
  let lastFunc;
  let lastRan;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

/**
 * Aplicar throttle ao scroll para evitar problemas de performance
 * 
 * @param {Function} callback - A função a ser executada no evento de scroll
 * @param {number} limit - Período mínimo entre execuções em ms
 */
export const optimizedScrollListener = (callback, limit = 100) => {
  const throttledCallback = throttle(callback, limit);
  
  window.addEventListener('scroll', throttledCallback, { passive: true });
  
  return () => window.removeEventListener('scroll', throttledCallback);
};

/**
 * Otimiza o redimensionamento para evitar muitas renderizações
 * 
 * @param {Function} callback - A função a ser executada no evento de resize
 * @param {number} wait - Tempo de espera em ms
 */
export const optimizedResizeListener = (callback, wait = 150) => {
  const debouncedCallback = debounce(callback, wait);
  
  window.addEventListener('resize', debouncedCallback);
  
  return () => window.removeEventListener('resize', debouncedCallback);
};

/**
 * Verifica se o modo de redução de movimento está ativo
 * Útil para desativar animações para usuários com problemas visuais ou sensibilidade
 * 
 * @returns {boolean} - Se o modo de redução de movimento está ativo
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Verifica suporte a WebP para usar formatos de imagem mais eficientes
 * 
 * @returns {Promise<boolean>} - Se o navegador suporta imagens WebP
 */
export const supportsWebP = async () => {
  if (!window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
};

/**
 * Aplica lazy loading para componentes pesados
 * 
 * @param {Function} importComponent - Função que importa o componente
 * @param {React.Component} fallback - Componente a ser exibido durante o carregamento
 * @returns {React.Component} - Componente com lazy loading
 */
export const lazyLoadComponent = (importComponent, fallback = null) => {
  const React = require('react');
  const Component = React.lazy(importComponent);
  
  return props => (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );
};

/**
 * Verifica se o dispositivo tem tela de toque
 * Útil para otimizações de UI em dispositivos touch
 * 
 * @returns {boolean} - Se o dispositivo tem tela de toque
 */
export const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
};

/**
 * Detecta hardware de baixo desempenho para ajustar animações e efeitos
 * 
 * @returns {boolean} - Se o dispositivo tem baixo desempenho
 */
export const isLowPerformanceDevice = () => {
  // Verificar número de cores (pode indicar dispositivos mais antigos)
  if (window.screen && window.screen.colorDepth && window.screen.colorDepth < 24) {
    return true;
  }
  
  // Verificar memória disponível (somente Chrome/Edge)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    return true;
  }
  
  // Verificar número de processadores lógicos (menos de 4 pode indicar hardware mais antigo)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  return false;
};

/**
 * Aplica configurações para melhorar performance com base no dispositivo
 * 
 * @returns {Object} - Configurações recomendadas
 */
export const getPerformanceConfig = () => {
  const isLowPerf = isLowPerformanceDevice();
  const reducedMotion = prefersReducedMotion();
  const isTouch = isTouchDevice();
  
  return {
    // Desativar animações em dispositivos de baixo desempenho ou com preferência por redução de movimento
    enableAnimations: !isLowPerf && !reducedMotion,
    
    // Reduzir qualidade de efeitos em dispositivos de baixo desempenho
    highQualityEffects: !isLowPerf,
    
    // Configurar transições mais rápidas para dispositivos de toque
    transitionDuration: isTouch ? 150 : 200,
    
    // Ajustar número de partículas na animação de rede
    networkAnimationDensity: isLowPerf ? 'low' : reducedMotion ? 'medium' : 'high',
  };
};