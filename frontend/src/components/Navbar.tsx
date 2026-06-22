import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { useTheme } from '../utils/ThemeContext'

const NAV_LINKS = [
  { to: '/dashboard',   label: 'Dashboard',     icon: '🏠' },
  { to: '/earnings',    label: 'Ingresos',       icon: '💵' },
  { to: '/statistics',  label: 'Estadísticas',   icon: '📊' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al cambiar de ruta
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleLogout = () => { logout(); navigate('/login') }

  const linkCls = (to: string) =>
    `transition-colors ${
      location.pathname === to
        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
    }`

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-emerald-600 shrink-0">
          <span className="text-2xl">💰</span> BudgetMate
        </Link>

        {/* Links — solo visibles en md+ */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} className={linkCls(l.to)}>{l.label}</Link>
          ))}
        </div>

        {/* Controles derechos */}
        <div className="flex items-center gap-2">
          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-base"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Nombre usuario — solo sm+ */}
          {user && (
            <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 select-none">
              {user.firstName}
            </span>
          )}

          {/* Salir — solo md+ */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:block text-sm bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Salir
            </button>
          )}

          {/* Hamburguesa — solo visible en móvil */}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className={`block w-4.5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-4.5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4.5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </Link>
          ))}

          {/* Separador + Salir en móvil */}
          {user && (
            <>
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors w-full text-left"
              >
                <span className="text-base">🚪</span>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
