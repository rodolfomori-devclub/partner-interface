import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { searchService } from '../services/api';
import { formatDistance, formatStudyTimes, formatProgrammingLevel } from '../utils/locationUtils';
import PartnerCard from '../components/partners/PartnerCard';
import LoginModal from '../components/auth/LoginModal';

const SearchPage = () => {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [filters, setFilters] = useState({
    level: '',
    studyTimes: [],
    distance: 'any',
    ignoreLocation: false,
    cep: '',
  });
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else if (user && user.cep) {
      updateFilter('cep', user.cep);
      // Carrega resultados iniciais
      handleSearch();
    }
  }, [isAuthenticated, user]);
  
  // Tratar login bem-sucedido
  const handleLoginSuccess = (userData) => {
    login(userData);
    setShowLoginModal(false);
    
    // Atualizar o CEP nos filtros após login
    if (userData.cep) {
      updateFilter('cep', userData.cep);
    }
    
    // Carregar resultados iniciais após login
    handleSearch();
  };
  
  // Update filter state
  const updateFilter = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  // Toggle study time selection
  const toggleStudyTime = (time) => {
    const currentTimes = [...filters.studyTimes];
    if (currentTimes.includes(time)) {
      updateFilter('studyTimes', currentTimes.filter(t => t !== time));
    } else {
      updateFilter('studyTimes', [...currentTimes, time]);
    }
  };
  
  // Handle search action
  const handleSearch = async () => {
    setLoading(true);
    
    try {
      let searchParams = {
        level: filters.level,
        studyTimes: filters.studyTimes,
      };
      
      // If the user is logged in, exclude them from results
      if (user) {
        searchParams.excludeEmail = user.email;
      }
      
      let response;
      
      // If ignoring location or distance is 'any', use regular search
      if (filters.ignoreLocation || filters.distance === 'any') {
        response = await searchService.searchPartners(searchParams);
      } else {
        // Need a CEP to search by location
        const cep = filters.cep || (user && user.cep);
        
        if (!cep) {
          toast.error('Digite um CEP para buscar por proximidade');
          setLoading(false);
          return;
        }
        
        // Convert distance selection to kilometers
        let radius = 100; // Default to 100km
        if (filters.distance === '10') {
          radius = 10;
        }
        
        response = await searchService.searchNearby(cep, radius, searchParams);
      }
      
      setResults(response);
      
      if (response.length === 0) {
        toast.info('Nenhum partner encontrado com esses filtros');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erro ao buscar partners. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {isAuthenticated ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Encontre um Partner</h1>
          
          {/* Filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtros</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Programming Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nível na Programação
                </label>
                <select
                  id="level"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={filters.level}
                  onChange={(e) => updateFilter('level', e.target.value)}
                >
                  <option value="">Qualquer nível</option>
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
              
              {/* Study Times */}
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horários de Estudo
                </span>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="filter-morning"
                      checked={filters.studyTimes.includes('morning')}
                      onChange={() => toggleStudyTime('morning')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="filter-morning" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Manhã
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="filter-afternoon"
                      checked={filters.studyTimes.includes('afternoon')}
                      onChange={() => toggleStudyTime('afternoon')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="filter-afternoon" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Tarde
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="filter-night"
                      checked={filters.studyTimes.includes('night')}
                      onChange={() => toggleStudyTime('night')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="filter-night" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Noite
                    </label>
                  </div>
                </div>
              </div>
              
              {/* CEP field (conditionally rendered) */}
              {!filters.ignoreLocation && (
                <div>
                  <label htmlFor="search-cep" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CEP para busca por proximidade
                  </label>
                  <input
                    type="text"
                    id="search-cep"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={filters.cep}
                    onChange={(e) => updateFilter('cep', e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    disabled={filters.ignoreLocation}
                  />
                </div>
              )}
              
              {/* Distance filter */}
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Distância
                </label>
                <select
                  id="distance"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={filters.distance}
                  onChange={(e) => updateFilter('distance', e.target.value)}
                  disabled={filters.ignoreLocation}
                >
                  <option value="10">Menos de 10km</option>
                  <option value="100">Menos de 100km</option>
                  <option value="any">Qualquer distância</option>
                </select>
              </div>
              
              {/* Ignore location checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ignore-location"
                  checked={filters.ignoreLocation}
                  onChange={(e) => updateFilter('ignoreLocation', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="ignore-location" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Não quero buscar por localidade
                </label>
              </div>
            </div>
            
            {/* Search button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Buscar Partners'}
              </button>
            </div>
          </div>
          
          {/* Resultados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length > 0 ? (
              results.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                {loading ? (
                  <p className="text-gray-600 dark:text-gray-300">Buscando partners...</p>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum parceiro encontrado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tente ajustar seus filtros para encontrar mais pessoas.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <svg className="h-16 w-16 text-indigo-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Você precisa estar cadastrado e conectado para acessar a funcionalidade de busca de partners.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full sm:w-auto btn-primary px-6 py-2"
              >
                Fazer Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto btn-secondary px-6 py-2"
              >
                Cadastrar-se
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      {showLoginModal && !isAuthenticated && (
        <LoginModal
          onClose={() => navigate('/')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default SearchPage;