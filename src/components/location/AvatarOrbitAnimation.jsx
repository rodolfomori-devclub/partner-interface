import React, { useEffect, useState } from 'react';

/**
 * Componente de animação de órbita de avatares
 * Exibe um avatar central com outros avatares orbitando ao redor
 */
const AvatarOrbitAnimation = () => {
  // Avatares aleatórios para demonstração
  const [avatars, setAvatars] = useState([]);
  
  // Função para gerar avatares aleatórios
  useEffect(() => {
    // Gerar 6 avatares aleatórios com seed diferentes
    const generateRandomAvatars = () => {
      const newAvatars = [];
      for (let i = 1; i <= 6; i++) {
        // Usando robohash.org para gerar avatares aleatórios
        const randomSeed = Math.floor(Math.random() * 1000);
        newAvatars.push(`https://robohash.org/${randomSeed}?set=set3&size=50x50`);
      }
      return newAvatars;
    };
    
    setAvatars(generateRandomAvatars());
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gradient">
        Encontre Parceiros De Estudo Perto De Você
      </h2>
      
      {/* Animação de órbitas */}
      <div className="avatar-grid">
        {/* Avatar central */}
        <div className="avatar-center rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/20" style={{width: '100px', height: '100px'}}>
          <img 
            src="https://robohash.org/you?set=set3&size=100x100" 
            alt="Seu avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Órbitas */}
        <div className="avatar-orbit avatar-orbit-1"></div>
        <div className="avatar-orbit avatar-orbit-2"></div>
        <div className="avatar-orbit avatar-orbit-3"></div>
        
        {/* Avatares orbitando */}
        {avatars.map((avatar, index) => (
          <div 
            key={index} 
            className={`avatar-item orbit-${index + 1} border-2 border-primary/50`}
          >
            <img 
              src={avatar} 
              alt={`Avatar ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <p className="text-center text-lg mt-10 max-w-2xl text-gray-600 dark:text-gray-300">
        Conecte-se com outros desenvolvedores próximos. Informe seu CEP ou use sua localização atual para 
        encontrar os melhores parceiros para estudar juntos.
      </p>
    </div>
  );
};

export default AvatarOrbitAnimation;