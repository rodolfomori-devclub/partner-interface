import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-secondary shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl">
                <span className="text-white">Dev</span>
                <span className="text-primary">Partner</span>
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) => 
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Home
            </NavLink>
            
            <NavLink
              to="/search"
              className={({ isActive }) => 
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Encontrar Partners
            </NavLink>
            
            <NavLink
              to="/nearby"
              className={({ isActive }) => 
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Parceiros Próximos
            </NavLink>
            
            <button
              onClick={toggleTheme}
              className={`theme-toggle ${darkMode ? 'theme-toggle-dark' : 'theme-toggle-light'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {user ? (
              <div className="flex items-center ml-3">
                <Link
                  to="/profile"
                  className="flex items-center group"
                >
                  <img 
                    src={user.avatarUrl} 
                    alt={`Avatar de ${user.name}`}
                    className="h-8 w-8 rounded-full border border-primary mr-2"
                  />
                  <span className="text-white group-hover:text-primary transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to="/register"
                className="btn-primary py-2 px-4 text-sm"
              >
                Cadastrar-se
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className={`theme-toggle mr-2 ${darkMode ? 'theme-toggle-dark' : 'theme-toggle-light'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-white hover:text-primary focus:outline-none"
              aria-expanded="false"
            >
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-secondary-light">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            
            <NavLink
              to="/search"
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Encontrar Partners
            </NavLink>
            
            <NavLink
              to="/nearby"
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Parceiros Próximos
            </NavLink>
            
            {user ? (
              <Link
                to="/profile"
                className="flex items-center px-3 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img 
                  src={user.avatarUrl} 
                  alt={`Avatar de ${user.name}`}
                  className="h-8 w-8 rounded-full border border-primary mr-2"
                />
                <span className="text-white hover:text-primary">
                  Meu Perfil
                </span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cadastrar-se
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;