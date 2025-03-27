import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { userService } from '../../services/api';
import Modal from '../common/Modal';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(false);
  
  // Update credentials
  const updateCredentials = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!credentials.email.trim() || !credentials.whatsapp.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify credentials with API
      const userData = await userService.verifyCredentials(
        credentials.email,
        credentials.whatsapp
      );
      
      // Notify parent component of successful login
      onLoginSuccess(userData);
      
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Email ou WhatsApp incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal title="Acesse seu Perfil" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email do DevClub
          </label>
          <input
            type="email"
            id="login-email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={credentials.email}
            onChange={(e) => updateCredentials('email', e.target.value)}
            placeholder="seu.email@devclub.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="login-whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            WhatsApp
          </label>
          <input
            type="tel"
            id="login-whatsapp"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={credentials.whatsapp}
            onChange={(e) => updateCredentials('whatsapp', e.target.value)}
            placeholder="(99) 99999-9999"
            required
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Acessar'}
          </button>
        </div>
        
        <div className="text-sm text-center text-gray-500 dark:text-gray-400 pt-2">
          <p>
            Para acessar seu perfil, informe o email e WhatsApp
            cadastrados anteriormente.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;