import React, { useEffect, useState, useRef } from 'react';

/**
 * Componente de animação de órbita de avatares
 * Exibe um avatar central com outros avatares orbitando ao redor
 */
const AvatarOrbitAnimation = () => {
  const [avatars, setAvatars] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const loadAttempts = useRef(0);
  
  // Generate fixed avatar URLs with better seeds to prevent loading issues
  useEffect(() => {
    const generateAvatars = () => {
      // Use fixed seeds for more reliable loading
      const seeds = [
        'partner1', 
        'partner2', 
        'partner3', 
        'partner4', 
        'partner5', 
        'partner6'
      ];
      
      const newAvatars = seeds.map(seed => 
        `https://robohash.org/${seed}?set=set3&size=80x80&bgset=bg1`
      );
      
      setAvatars(newAvatars);
      
      // Mark as loaded after generation
      setLoaded(true);
    };
    
    generateAvatars();
    
    // Retry logic if avatars don't load properly
    const checkImagesLoaded = setTimeout(() => {
      if (!loaded && loadAttempts.current < 3) {
        loadAttempts.current += 1;
        generateAvatars();
      }
    }, 2000);
    
    return () => clearTimeout(checkImagesLoaded);
  }, [loaded]);
  
  // Function to preload images
  const preloadImages = (urls) => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };
  
  // Preload avatar images when available
  useEffect(() => {
    if (avatars.length > 0) {
      preloadImages(avatars);
    }
  }, [avatars]);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gradient">
        Encontre Partners De Estudo Perto De Você
      </h2>
      
      {/* Animação de órbitas */}
      <div className="avatar-grid">
        {/* Avatar central */}
        <div className="avatar-center rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/20" style={{width: '100px', height: '100px'}}>
          <img 
            src="https://robohash.org/you?set=set3&size=100x100&bgset=bg1" 
            alt="Seu avatar" 
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        
        {/* Órbitas */}
        <div className="avatar-orbit avatar-orbit-1"></div>
        <div className="avatar-orbit avatar-orbit-2"></div>
        <div className="avatar-orbit avatar-orbit-3"></div>
        
        {/* Avatares orbitando with backup color if image fails */}
        {avatars.map((avatar, index) => (
          <div 
            key={index} 
            className={`avatar-item orbit-${index + 1} border-2 border-primary/50 bg-primary/20`}
            style={{ 
              backgroundImage: loaded ? `url(${avatar})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!loaded && (
              <div className="w-full h-full flex items-center justify-center text-primary/70 text-xs">
                {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-center text-lg mt-10 max-w-2xl text-gray-600 dark:text-gray-300">
        Conecte-se com outros desenvolvedores próximos. Informe seu CEP ou use sua localização atual para 
        encontrar os melhores partners para estudar juntos.
      </p>
    </div>
  );
};

export default AvatarOrbitAnimation;