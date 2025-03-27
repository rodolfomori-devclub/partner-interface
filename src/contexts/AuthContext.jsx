import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Verificar se há dados do usuário no localStorage
    const savedUser = localStorage.getItem('userData');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Verificar se o token expirou (30 dias)
      if (userData.expiry) {
        const expiry = new Date(userData.expiry);
        const now = new Date();
        
        // Se a data de expiração já passou, fazer logout
        if (now > expiry) {
          localStorage.removeItem('userData');
          return null;
        }
      }
      
      return userData;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [user]);

  const login = (userData) => {
    // Se não tiver expiry, adicionar (30 dias)
    if (!userData.expiry) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      userData.expiry = expiryDate.toISOString();
    }
    
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prevUser => {
      // Manter a data de expiração anterior
      const expiry = prevUser?.expiry || null;
      
      return {
        ...prevUser,
        ...updatedData,
        expiry
      };
    });
  };

  // Verificar a expiração do token a cada carregamento da página
  useEffect(() => {
    if (user && user.expiry) {
      const expiry = new Date(user.expiry);
      const now = new Date();
      
      if (now > expiry) {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};