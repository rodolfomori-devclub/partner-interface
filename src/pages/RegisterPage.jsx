import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { userService } from '../services/api';
import { validateCEP } from '../utils/locationUtils';
import Modal from '../components/common/Modal';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    studyTimes: [],
    cep: '',
    level: '',
    about: '',
  });
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleStudyTime = (time) => {
    const currentTimes = [...formData.studyTimes];
    if (currentTimes.includes(time)) {
      updateFormData('studyTimes', currentTimes.filter(t => t !== time));
    } else {
      updateFormData('studyTimes', [...currentTimes, time]);
    }
  };
  
  const handleNext = () => {
    if (step === 1) {
      // Validate step 1 fields
      if (!formData.name.trim()) {
        toast.error('Digite seu nome');
        return;
      }
      
      if (!formData.email.trim() || !formData.email.includes('@')) {
        toast.error('Digite um email válido');
        return;
      }
      
      if (!formData.whatsapp.trim() || formData.whatsapp.replace(/\D/g, '').length < 10) {
        toast.error('Digite um número de WhatsApp válido');
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      // Validate step 2 fields
      if (formData.studyTimes.length === 0) {
        toast.error('Selecione pelo menos um horário de estudo');
        return;
      }
      
      if (!formData.cep.trim() || !validateCEP(formData.cep)) {
        toast.error('Digite um CEP válido');
        return;
      }
      
      if (!formData.level) {
        toast.error('Selecione seu nível na programação');
        return;
      }
      
      setStep(3);
    }
  };
  
  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };
  
  const handleSubmit = () => {
    if (!formData.about.trim()) {
      toast.error('Preencha o campo sobre você');
      return;
    }
    
    // Show terms modal before submitting
    setShowTermsModal(true);
  };
  
  const finalizeRegistration = async () => {
    if (!termsAccepted) {
      toast.error('Você precisa aceitar os termos para continuar');
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate avatar URL using robohash
      const avatarUrl = `https://robohash.org/${encodeURIComponent(formData.email)}?set=set3&size=200x200`;
      
      // Send registration data to API
      const userData = {
        ...formData,
        avatarUrl,
      };
      
      const response = await userService.register(userData);
      
      // Store user data and login
      login(response);
      
      toast.success('Cadastro realizado com sucesso!');
      navigate('/search');
    } catch (error) {
      if (error.status === 409) {
        toast.error('Este email já está cadastrado. Acesse seu perfil para editar suas informações.');
      } else {
        toast.error('Erro ao realizar cadastro. Tente novamente.');
        console.error('Registration error:', error);
      }
    } finally {
      setLoading(false);
      setShowTermsModal(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cadastre-se</h1>
          
          {/* Progress bar */}
          <div className="relative pt-1 mb-8">
            <div className="flex mb-2 justify-between">
              <span className={`text-xs font-semibold inline-block ${step >= 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Dados Pessoais
              </span>
              <span className={`text-xs font-semibold inline-block ${step >= 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Preferências de Estudo
              </span>
              <span className={`text-xs font-semibold inline-block ${step >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Sobre Você
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
              <div
                style={{ width: `${(step / 3) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
              ></div>
            </div>
          </div>
          
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email do DevClub
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="seu.email@devclub.com"
                />
              </div>
              
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.whatsapp}
                  onChange={(e) => updateFormData('whatsapp', e.target.value)}
                  placeholder="(99) 99999-9999"
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Study Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Melhor horário para estudos (selecione pelo menos um)
                </label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="morning"
                      checked={formData.studyTimes.includes('morning')}
                      onChange={() => toggleStudyTime('morning')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="morning" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Manhã
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="afternoon"
                      checked={formData.studyTimes.includes('afternoon')}
                      onChange={() => toggleStudyTime('afternoon')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="afternoon" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Tarde
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="night"
                      checked={formData.studyTimes.includes('night')}
                      onChange={() => toggleStudyTime('night')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="night" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Noite
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CEP
                </label>
                <input
                  type="text"
                  id="cep"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.cep}
                  onChange={(e) => updateFormData('cep', e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
              
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nível na Programação
                </label>
                <select
                  id="level"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.level}
                  onChange={(e) => updateFormData('level', e.target.value)}
                >
                  <option value="">Selecione seu nível</option>
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Step 3: About You */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fale sobre você
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Descreva seu nível na programação, o que está estudando e que tipo de parceiro de estudos você procura.
                </p>
                <textarea
                  id="about"
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.about}
                  onChange={(e) => updateFormData('about', e.target.value)}
                  placeholder="Ex: Estou iniciando em programação, estudando HTML, CSS e JavaScript. Procuro alguém para fazer projetos juntos e trocar conhecimento."
                />
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Voltar
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Próximo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Terms Modal */}
      {showTermsModal && (
        <Modal title="Leia antes de continuar" onClose={() => setShowTermsModal(false)}>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Ao se cadastrar no nosso sistema, encontre um partner, você autoriza outros alunos do DevClub entrarem em contato com você via WhatsApp para estudar.
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-bold">
              É TERMINANTEMENTE proibido entrar em contato com qualquer outro fim que não seja estudos e networking.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Caso desobedeça essa regra, o usuário fica passível de exclusão do sistema.
            </p>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Li, e concordo
              </label>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={finalizeRegistration}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!termsAccepted || loading}
              >
                {loading ? 'Cadastrando...' : 'Confirmar Cadastro'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RegisterPage;