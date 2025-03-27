// Formatar a distância para exibição amigável
export const formatDistance = (distance) => {
    if (!distance && distance !== 0) return 'Distância não disponível';
    
    if (distance < 1) {
      // Converter para metros se menos de 1km
      return `${Math.round(distance * 1000)}m`;
    } else if (distance < 10) {
      // Mais precisão para distâncias menores
      return `${distance.toFixed(1)}km`;
    } else {
      // Arredondar para números inteiros para distâncias maiores
      return `${Math.round(distance)}km`;
    }
  };
  
  // Validar CEP
  export const validateCEP = (cep) => {
    // Remove não-dígitos
    const numericCEP = cep.replace(/\D/g, '');
    
    // CEP brasileiro deve ter 8 dígitos
    return numericCEP.length === 8;
  };
  
  // Formatar CEP para exibição (XXXXX-XXX)
  export const formatCEP = (cep) => {
    const numericCEP = cep.replace(/\D/g, '');
    if (numericCEP.length !== 8) return cep;
    
    return `${numericCEP.substring(0, 5)}-${numericCEP.substring(5)}`;
  };
  
  // Converter horários de estudo para texto legível
  export const formatStudyTimes = (times) => {
    if (!times || !Array.isArray(times) || times.length === 0) {
      return 'Não especificado';
    }
    
    const labels = {
      morning: 'Manhã',
      afternoon: 'Tarde',
      night: 'Noite'
    };
    
    return times.map(time => labels[time] || time).join(', ');
  };
  
  // Converter nível de programação para texto legível
  export const formatProgrammingLevel = (level) => {
    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    
    return labels[level] || level;
  };