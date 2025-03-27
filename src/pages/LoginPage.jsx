import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { userService } from '../services/api';
import NetworkAnimation from '../components/common/NetworkAnimation';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    whatsapp: ''
  });
  const [error, setError] = useState('');

  // Substitua a função handleWhatsAppChange no LoginPage.jsx com esta implementação aprimorada:

// Formatação para o WhatsApp
const handleWhatsAppChange = (e) => {
  // Remove qualquer caractere que não seja número
  let value = e.target.value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  
  // Aplica a formatação (XX) XXXXX-XXXX
  let formattedValue = '';
  
  if (value.length <= 2) {
    // Apenas DDD: (XX
    formattedValue = value.length ? `(${value}` : '';
  } else if (value.length <= 7) {
    // DDD + primeiros dígitos: (XX) XXXXX
    formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  } else {
    // Formato completo: (XX) XXXXX-XXXX
    formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  }
  
  setCredentials(prev => ({
    ...prev,
    whatsapp: formattedValue
  }));
};
  // Atualizar dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagem de erro quando o usuário começa a digitar
    if (error) setError('');
  };

  // Formatação para o WhatsApp
  
  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validação básica
    if (!credentials.email.trim() || !credentials.whatsapp.trim()) {
      setError('Email e WhatsApp são obrigatórios');
      return;
    }
    
    setLoading(true);
    
    try {
      // Fazer requisição para verificar credenciais
      const userData = await userService.verifyCredentials(
        credentials.email,
        credentials.whatsapp
      );
      
      // Definir duração do token para 30 dias
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      // Salvar data de expiração junto com dados do usuário
      const userWithExpiry = {
        ...userData,
        expiry: expiryDate.toISOString()
      };
      
      // Atualizar contexto de autenticação e localStorage
      login(userWithExpiry);
      
      toast.success('Login realizado com sucesso!');
      
      // Redirecionar para a página inicial
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Email ou WhatsApp incorretos. Verifique suas informações e tente novamente.');
      toast.error('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background animation */}
      <NetworkAnimation />
      
      <div className="container max-w-md px-4">
        <div className="bg-white dark:bg-secondary-light rounded-xl p-8 shadow-xl relative z-10 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Entre para encontrar seu partner de estudos ideal
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="input-label">
                Email do DevClub
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="input-field"
                placeholder="seu.email@devclub.com"
                required
              />
            </div>
            
            {/* WhatsApp Field */}
            <div>
              <label htmlFor="whatsapp" className="input-label">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={credentials.whatsapp}
                onChange={handleWhatsAppChange}
                className="input-field"
                placeholder="(99) 99999-9999"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Digite o mesmo número que você usou no cadastro
              </p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary py-3 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
            
            {/* Registration Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ainda não tem uma conta?{' '}
                <Link to="/register" className="text-primary hover:text-primary-dark transition-colors font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;