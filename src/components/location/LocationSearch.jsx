import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { searchService } from '../../services/api';

/**
 * Componente de pesquisa por localização
 * Permite buscar parceiros próximos por CEP ou geolocalização
 */
const LocationSearch = ({ onSearch, isLoading, setIsLoading }) => {
  const [cep, setCep] = useState('');
  const [distance, setDistance] = useState('50');
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Função para formatar o CEP enquanto digita
  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 8) {
      // Formatação do CEP para 00000-000
      const formattedCep = value.length > 5 
        ? `${value.slice(0, 5)}-${value.slice(5)}` 
        : value;
        
      setCep(formattedCep);
    }
  };
  
  // Função para buscar por CEP
  const searchByCep = async () => {
    // Verificar se CEP é válido
    const numericCep = cep.replace(/\D/g, '');
    
    if (numericCep.length !== 8) {
      toast.error('Por favor, informe um CEP válido com 8 dígitos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await searchService.searchNearby(numericCep, parseInt(distance), {});
      onSearch(response);
      
      if (response.length === 0) {
        toast.info('Nenhum parceiro encontrado nessa área. Tente aumentar a distância.');
      } else {
        toast.success(`Encontramos ${response.length} parceiros perto de você!`);
      }
    } catch (error) {
      console.error('Erro ao buscar por CEP:', error);
      toast.error('Não foi possível realizar a busca. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para obter localização atual
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada pelo seu navegador');
      return;
    }
    
    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setIsLoading(true);
          
          // Obter CEP a partir das coordenadas usando API de geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
          );
          
          const data = await response.json();
          
          // Extrair o CEP do resultado
          const postalCode = data.address?.postcode?.replace(/\D/g, '');
          
          if (postalCode) {
            setCep(postalCode.length > 5 
              ? `${postalCode.slice(0, 5)}-${postalCode.slice(5)}` 
              : postalCode);
              
            // Buscar parceiros com o CEP obtido
            const searchResponse = await searchService.searchNearby(postalCode, parseInt(distance), {});
            onSearch(searchResponse);
            
            if (searchResponse.length === 0) {
              toast.info('Nenhum parceiro encontrado nessa área. Tente aumentar a distância.');
            } else {
              toast.success(`Encontramos ${searchResponse.length} parceiros perto de você!`);
            }
          } else {
            toast.error('Não foi possível obter o CEP da sua localização. Por favor, digite manualmente.');
          }
        } catch (error) {
          console.error('Erro ao obter localização:', error);
          toast.error('Não foi possível obter sua localização. Por favor, digite seu CEP manualmente.');
        } finally {
          setGettingLocation(false);
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Erro de geolocalização:', error);
        setGettingLocation(false);
        
        let errorMessage = 'Não foi possível obter sua localização.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Você negou a permissão de localização.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização indisponíveis.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao obter sua localização.';
            break;
          default:
            errorMessage = 'Ocorreu um erro desconhecido ao obter sua localização.';
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [distance, onSearch, setIsLoading]);
  
  return (
    <div className="bg-white dark:bg-secondary-light rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Encontrar por localização</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="cep" className="input-label">
            CEP
          </label>
          <input
            type="text"
            id="cep"
            placeholder="00000-000"
            className="input-field"
            value={cep}
            onChange={handleCepChange}
            maxLength={9}
          />
        </div>
        
        <div>
          <label htmlFor="distance" className="input-label">
            Distância (em km)
          </label>
          <select
            id="distance"
            className="input-field"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          >
            <option value="10">Até 10 km</option>
            <option value="25">Até 25 km</option>
            <option value="50">Até 50 km</option>
            <option value="100">Até 100 km</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            className="btn-primary"
            onClick={searchByCep}
            disabled={isLoading || cep.replace(/\D/g, '').length !== 8}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Buscar
              </span>
            )}
          </button>
          
          <button
            type="button"
            className="btn-secondary"
            onClick={getCurrentLocation}
            disabled={isLoading || gettingLocation}
          >
            {gettingLocation ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Localizando...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Usar Minha Localização
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;