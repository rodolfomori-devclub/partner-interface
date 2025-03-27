// Crie um novo arquivo em src/utils/formatUtils.js

/**
 * Formata um número de telefone no padrão brasileiro (XX) XXXXX-XXXX
 * @param {string} value - Valor a ser formatado (números apenas)
 * @returns {string} - Valor formatado
 */
export const formatPhoneNumber = (value) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limitedValue = numericValue.slice(0, 11);
    
    // Aplica a formatação (XX) XXXXX-XXXX
    let formattedValue = '';
    
    if (limitedValue.length <= 2) {
      // Apenas DDD: (XX
      formattedValue = limitedValue.length ? `(${limitedValue}` : '';
    } else if (limitedValue.length <= 7) {
      // DDD + primeiros dígitos: (XX) XXXXX
      formattedValue = `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2)}`;
    } else {
      // Formato completo: (XX) XXXXX-XXXX
      formattedValue = `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2, 7)}-${limitedValue.slice(7)}`;
    }
    
    return formattedValue;
  };
  
  /**
   * Remove a formatação de um número de telefone
   * @param {string} value - Valor formatado
   * @returns {string} - Apenas os números
   */
  export const unformatPhoneNumber = (value) => {
    return value.replace(/\D/g, '');
  };
  
  /**
   * Verifica se um número de telefone brasileiro é válido
   * @param {string} value - Número de telefone (formatado ou não)
   * @returns {boolean} - true se for válido
   */
  export const isValidPhoneNumber = (value) => {
    const numericValue = unformatPhoneNumber(value);
    // Telefone brasileiro: 10 ou 11 dígitos (com 9 na frente para celular)
    return numericValue.length >= 10 && numericValue.length <= 11;
  };