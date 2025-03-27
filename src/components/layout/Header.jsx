import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Header = () => {
  const { user } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled ? 'bg-secondary/95 shadow-md backdrop-blur-sm' : 'bg-secondary'
      }`}
    >
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
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Encontrar Partners
            </NavLink>

            <NavLink
              to="/nearby"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Partners Próximos
            </NavLink>

            <button
              onClick={toggleTheme}
              className={`theme-toggle ml-2 ${
                darkMode ? 'theme-toggle-dark' : 'theme-toggle-light'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center ml-4">
                <Link to="/profile" className="flex items-center group ml-2">
                  <div className="relative">
                    <img
                      src={user.avatarUrl}
                      alt={`Avatar de ${user.name}`}
                      className="h-9 w-9 rounded-full border-2 border-primary object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Indicador online */}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-secondary"></span>
                  </div>
                  <span className="ml-2 text-white group-hover:text-primary transition-colors font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">
                  Entrar
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Cadastrar-se
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className={`theme-toggle mr-2 ${
                darkMode ? 'theme-toggle-dark' : 'theme-toggle-light'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-white hover:text-primary focus:outline-none"
              aria-expanded="false"
            >
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu com animação */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-secondary-light/80 backdrop-blur-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive
                  ? 'text-primary bg-secondary-dark/50'
                  : 'text-white hover:text-primary hover:bg-secondary-dark/30'
              }`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive
                  ? 'text-primary bg-secondary-dark/50'
                  : 'text-white hover:text-primary hover:bg-secondary-dark/30'
              }`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Encontrar Partners
          </NavLink>

          <NavLink
            to="/nearby"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive
                  ? 'text-primary bg-secondary-dark/50'
                  : 'text-white hover:text-primary hover:bg-secondary-dark/30'
              }`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Partners Próximos
          </NavLink>

          {user ? (
            <Link
              to="/profile"
              className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-white hover:text-primary hover:bg-secondary-dark/30 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={user.avatarUrl}
                alt={`Avatar de ${user.name}`}
                className="h-8 w-8 rounded-full border-2 border-primary mr-2"
              />
              <span>Meu Perfil</span>
            </Link>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:text-primary hover:bg-secondary-dark/30 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-primary hover:text-primary-light hover:bg-secondary-dark/30 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cadastrar-se
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
