import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NetworkAnimation from '../components/common/NetworkAnimation';
import { searchService } from '../services/api';
import { formatDistance } from '../utils/locationUtils';
import PartnerCard from '../components/partners/PartnerCard';

// Componentes memorizados para reduzir re-renderizações
const StatCard = memo(({ number, label }) => (
  <div className="stat-container">
    <div className="stat-number">{number}</div>
    <div className="stat-label">{label}</div>
  </div>
));

const InfoCard = memo(({ icon, title, description }) => (
  <div className="bg-secondary-light rounded-lg p-6 transition-all hover:shadow-green">
    <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
));

// Componentes de seção
const HeroSection = memo(({ isAuthenticated }) => (
  <div className="text-center mb-16">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
      <span className="text-white">Encontre seu </span>
      <span className="text-primary">Partner</span>
      <span className="text-white"> de Estudos Ideal</span>
    </h1>
    
    <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/80 mb-12">
      Conecte-se com outros alunos do DevClub, estude juntos
      e evolua mais rápido na sua jornada como dev.
    </p>
    
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link
        to="/search"
        className="btn-primary"
      >
        Encontrar Partners
      </Link>
      
      <Link
        to={isAuthenticated ? "/profile" : "/register"}
        className="btn-secondary"
      >
        {isAuthenticated ? "Meu Perfil" : "Cadastrar-se"}
      </Link>
    </div>
  </div>
));

const StatsSection = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
    <StatCard number="500+" label="Partners Cadastrados" />
    <StatCard number="50+" label="Cidades" />
    <StatCard number="1000+" label="Conexões Realizadas" />
  </div>
));

const HowItWorksSection = memo(() => (
  <div className="mb-20">
    <h2 className="text-3xl font-bold text-center mb-12">
      <span className="text-white">Como o </span>
      <span className="text-primary">Encontre um Partner</span>
      <span className="text-white"> funciona</span>
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <InfoCard 
        icon={
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        title="Crie seu perfil"
        description="Cadastre-se com seus dados e preferências de estudo para que outros alunos do DevClub possam te encontrar."
      />
      
      <InfoCard
        icon={
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        title="Encontre partners"
        description="Busque por outros alunos com base no nível, horários de estudo e proximidade geográfica."
      />
      
      <InfoCard
        icon={
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        }
        title="Conecte-se"
        description="Entre em contato via WhatsApp para marcar sessões de estudo e networking com outros devs."
      />
    </div>
  </div>
));

const FinalCTA = memo(() => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold mb-6 text-white">
      Pronto para encontrar seu próximo partner de estudos?
    </h2>
    <p className="text-lg text-white/70 mb-8">
      Junte-se a centenas de alunos do DevClub que já estão conectados e evoluindo juntos.
    </p>
    <Link to="/register" className="btn-primary">
      Encontrar Partners
    </Link>
  </div>
));

// Seção de parceiros próximos otimizada
const NearbyPartnersSection = memo(({ nearbyPartners, loading, isAuthenticated }) => (
  <div className="bg-secondary-light/50 backdrop-blur-sm rounded-xl p-6 mb-24">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">Pessoas estudando perto de você</h2>
      <Link to="/search" className="text-primary hover:text-primary-light text-sm font-medium">
        Ver mais
      </Link>
    </div>
    
    {loading ? (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ) : nearbyPartners.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nearbyPartners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        {isAuthenticated ? (
          <p className="text-white/70">
            Não encontramos partners próximos de você. 
            <Link to="/search" className="text-primary ml-1 hover:underline">
              Tente uma busca com outros filtros
            </Link>
          </p>
        ) : (
          <p className="text-white/70">
            <Link to="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link> para ver pessoas estudando perto de você
          </p>
        )}
      </div>
    )}
  </div>
));

// Componente principal da Home otimizado
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [nearbyPartners, setNearbyPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar partners próximos com useCallback para melhor performance
  const fetchNearbyPartners = useCallback(async () => {
    if (user && user.cep) {
      setLoading(true);
      try {
        const response = await searchService.searchNearby(user.cep, 50, {
          excludeEmail: user.email
        });
        setNearbyPartners(response.slice(0, 4)); // Limitar a 4 pessoas
      } catch (error) {
        console.error('Error fetching nearby partners:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  // Usar useEffect com dependências apropriadas
  useEffect(() => {
    if (isAuthenticated) {
      fetchNearbyPartners();
    }
  }, [isAuthenticated, fetchNearbyPartners]);

  return (
    <div className="relative min-h-screen">
      {/* Background network animation - lazy loaded para melhorar performance inicial */}
      <NetworkAnimation />
      
      <div className="container-section min-h-[90vh] flex flex-col justify-center">
        <HeroSection isAuthenticated={isAuthenticated} />
        <StatsSection />
        <NearbyPartnersSection 
          nearbyPartners={nearbyPartners} 
          loading={loading} 
          isAuthenticated={isAuthenticated}
        />
        <HowItWorksSection />
        <FinalCTA />
      </div>
    </div>
  );
};

export default HomePage;