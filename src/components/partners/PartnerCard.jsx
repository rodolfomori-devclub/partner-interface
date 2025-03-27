import { useState, memo } from 'react';
import { formatDistance, formatStudyTimes, formatProgrammingLevel } from '../../utils/locationUtils';

// Memorizando o componente para evitar renderizações desnecessárias
const PartnerCard = memo(({ partner }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Format WhatsApp number for link - calculado apenas uma vez
  const whatsappLink = `https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`;
  
  // Extract first name for greeting
  const firstName = partner.name.split(' ')[0];
  
  // Format level for display
  const level = formatProgrammingLevel(partner.level);
  
  // Format study times for display
  const studyTimes = formatStudyTimes(partner.studyTimes);
  
  // Determinar a cor do nível
  const getLevelClass = () => {
    switch(partner.level) {
      case 'beginner':
        return 'level-iniciante';
      case 'intermediate':
        return 'level-intermediario';
      case 'advanced':
        return 'level-avancado';
      default:
        return 'level-iniciante';
    }
  };
  
  // Handle modal open/close
  const openModal = () => setShowDetailsModal(true);
  const closeModal = () => setShowDetailsModal(false);
  
  return (
    <>
      <div 
        className="card card-hover cursor-pointer bg-white dark:bg-secondary-light"
        onClick={openModal}
      >
        <div className="p-5">
          {/* Cabeçalho do card com avatar e informações básicas */}
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={partner.avatarUrl}
                alt={`Avatar de ${partner.name}`}
                className="h-16 w-16 rounded-full border-2 border-primary object-cover"
                loading="lazy"
              />
              {/* Indicador de status online (exemplo) */}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-400 border-2 border-white dark:border-secondary-light"></span>
            </div>
            
            <div className="ml-4">
              <h3 className="font-bold text-gray-800 dark:text-white">
                {partner.name}
              </h3>
              <div className={`${getLevelClass()} mt-1`}>
                {level}
              </div>
            </div>
          </div>
          
          {/* Informações adicionais */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {studyTimes}
            </div>
            
            {partner.distance !== undefined && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="font-medium">{formatDistance(partner.distance)}</span>
              </div>
            )}
          </div>
          
          {/* Descrição/Bio */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 h-10 overflow-hidden">
            {partner.about}
          </div>
          
          {/* Botões de ação */}
          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
              className="flex-1 btn-white dark:btn-secondary group"
            >
              <svg className="h-5 w-5 mr-2 text-indigo-500 group-hover:text-indigo-600 dark:text-primary dark:group-hover:text-primary-light transition-colors" 
                   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="7.5" r="1.5" fill="currentColor"/>
                <rect x="10.75" y="10" width="2.5" height="8" rx="1" fill="currentColor"/>
              </svg>
              Detalhes
            </button>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 btn-primary group"
            >
              <svg className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.267-.465-2.414-1.485-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.134-.135.301-.345.451-.52.146-.174.194-.3.3-.5.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.221-.24-.6-.487-.51-.673-.51-.172 0-.372-.015-.572-.015-.2 0-.523.074-.797.365-.273.3-1.045 1.02-1.045 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.16 5.1 4.43.714.306 1.27.489 1.704.625.714.227 1.365.195 1.88.118.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 017.021 2.91 9.788 9.788 0 012.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
              </svg>
              Contato
            </a>
          </div>
        </div>
      </div>
      
      {/* Modal de Detalhes */}
      {showDetailsModal && (
        <div 
          className="modal-overlay"
          onClick={closeModal}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Perfil de {partner.name}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
                <img
                  src={partner.avatarUrl}
                  alt={`Avatar de ${partner.name}`}
                  className="h-24 w-24 rounded-full border-4 border-primary object-cover mb-4 sm:mb-0 sm:mr-6 avatar-pulse"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
                    {partner.name}
                  </h3>
                  <div className={`${getLevelClass()} mt-1 inline-block`}>
                    {level}
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{studyTimes}</span>
                    </div>
                    
                    {partner.distance !== undefined && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{formatDistance(partner.distance)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="divider"></div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Sobre</h4>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {partner.about}
                  </p>
                </div>
                
                <div className="divider"></div>
                
                {/* Seção de skills (exemplo - você pode adicionar mais informações no perfil) */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Interesses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag-primary">JavaScript</span>
                    <span className="tag-primary">React</span>
                    <span className="tag-primary">Node.js</span>
                    <span className="tag-primary">TailwindCSS</span>
                    <span className="tag-primary">Frontend</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.267-.465-2.414-1.485-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.134-.135.301-.345.451-.52.146-.174.194-.3.3-.5.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.221-.24-.6-.487-.51-.673-.51-.172 0-.372-.015-.572-.015-.2 0-.523.074-.797.365-.273.3-1.045 1.02-1.045 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.16 5.1 4.43.714.306 1.27.489 1.704.625.714.227 1.365.195 1.88.118.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 017.021 2.91 9.788 9.788 0 012.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                </svg>
                Entrar em contato com {firstName} pelo WhatsApp
              </a>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Lembre-se: o contato deve ser apenas para fins de estudo e networking.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

PartnerCard.displayName = 'PartnerCard';

export default PartnerCard;