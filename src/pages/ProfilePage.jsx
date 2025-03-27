import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { validateCEP } from '../utils/locationUtils';
import LoginModal from '../components/auth/LoginModal';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, updateUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    studyTimes: [],
    cep: '',
    level: '',
    about: '',
  });
  
  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        whatsapp: user.whatsapp || '',
        studyTimes: user.studyTimes || [],
        cep: user.cep || '',
        level: user.level || '',
        about: user.about || '',
      });
    }
  }, [user]);
  
  // Show login modal if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);
  
  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Toggle study time selection
  const toggleStudyTime = (time) => {
    const currentTimes = [...formData.studyTimes];
    if (currentTimes.includes(time)) {
      updateFormData('studyTimes', currentTimes.filter(t => t !== time));
    } else {
      updateFormData('studyTimes', [...currentTimes, time]);
    }
  };
  
  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // Handle save profile changes
  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    
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
    
    if (!formData.about.trim()) {
      toast.error('O campo sobre você é obrigatório');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await userService.updateUser(user.id, formData);
      
      // Update user data in context
      updateUser(response);
      
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Handle login success
  const handleLoginSuccess = (userData) => {
    login(userData);
    setShowLoginModal(false);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">
          Faça login para acessar seu perfil
        </p>
        
        {showLoginModal && (
          <LoginModal
            onClose={() => navigate('/')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Editar Perfil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Sair
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center mb-8">
            <img
              src={user.avatarUrl}
              alt={`Avatar de ${user.name}`}
              className="h-24 w-24 rounded-full border-2 border-indigo-500"
            />
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.email}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <input
                type="text"
                id="name"
                className="px-1 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            {/* WhatsApp field */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                className=" focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.whatsapp}
                onChange={(e) => updateFormData('whatsapp', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            {/* Study Times field */}
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={!isEditing}
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={!isEditing}
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={!isEditing}
                  />
                  <label htmlFor="night" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Noite
                  </label>
                </div>
              </div>
            </div>
            
            {/* CEP field */}
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                CEP
              </label>
              <input
                type="text"
                id="cep"
                className="px-1 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.cep}
                onChange={(e) => updateFormData('cep', e.target.value)}
                disabled={!isEditing}
                maxLength={9}
              />
            </div>
            
            {/* Level field */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nível na Programação
              </label>
              <select
                id="level"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.level}
                onChange={(e) => updateFormData('level', e.target.value)}
                disabled={!isEditing}
              >
                <option value="">Selecione seu nível</option>
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>
            
            {/* About field */}
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sobre você
              </label>
              <textarea
                id="about"
                rows={4}
                className="px-1 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.about}
                onChange={(e) => updateFormData('about', e.target.value)}
                disabled={!isEditing}
                placeholder="Descreva seu nível na programação, o que está estudando e que tipo de parceiro você procura"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;