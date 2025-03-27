import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LocationSearch from '../components/location/LocationSearch';
import AvatarOrbitAnimation from '../components/location/AvatarOrbitAnimation';
import PartnerCard from '../components/partners/PartnerCard';
import NetworkAnimation from '../components/common/NetworkAnimation';

const NearbyPage = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const pageTopRef = useRef(null);
  
  // Function to handle search results and scroll to top
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setHasSearched(true);
    
    // Scroll to top of results after a short delay
    setTimeout(() => {
      if (pageTopRef.current) {
        pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  };
  
  // Set up a clean search state if user arrives from another page
  useEffect(() => {
    setHasSearched(false);
    setSearchResults([]);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="relative min-h-screen">
      {/* Animação de fundo */}
      <NetworkAnimation />
      
      <div className="container-section">
        <div className="max-w-6xl mx-auto" ref={pageTopRef}>
          {/* Seção de busca ou animação */}
          {!hasSearched ? (
            <div className="mb-12">
              {/* Animação de órbita de avatares */}
              <AvatarOrbitAnimation />
              
              {/* Formulário de pesquisa */}
              <div className="max-w-xl mx-auto mt-8">
                <LocationSearch 
                  onSearch={handleSearchResults} 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Título dos resultados */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {searchResults.length > 0 
                    ? `Encontramos ${searchResults.length} partners` 
                    : 'Nenhum partner encontrado'}
                </h1>
                
                <button 
                  onClick={() => {
                    setHasSearched(false);
                    setSearchResults([]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Nova Busca
                </button>
              </div>
              
              {/* Resultados da pesquisa */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                  <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Buscando partners próximos...</p>
                </div>
              ) : (
                <>
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {searchResults.map((partner) => (
                        <PartnerCard key={partner.id} partner={partner} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-secondary-light rounded-xl p-8 text-center shadow-lg">
                      <div className="flex flex-col items-center">
                        <svg className="h-20 w-20 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                          Nenhum partner encontrado nessa área
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Tente aumentar a distância de busca ou procurar em outra localidade
                        </p>
                        <button 
                          onClick={() => {
                            setHasSearched(false);
                            setSearchResults([]);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="btn-primary"
                        >
                          Tentar Novamente
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyPage;