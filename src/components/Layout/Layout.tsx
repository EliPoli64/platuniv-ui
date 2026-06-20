import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, BookOpen, Calendar,
  ClipboardList, DollarSign, Settings, BarChart3,
  LogOut, Menu, X, UserCheck, BookMarked
} from 'lucide-react';
import type { UserRole, NavItem } from '../../types';

const roleNavItems: Record<UserRole, NavItem[]> = {
  estudiante: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/matricula', label: 'Matrícula', icon: BookMarked },
    { path: '/cursos', label: 'Cursos', icon: BookOpen },
    { path: '/horarios', label: 'Horarios', icon: Calendar },
    { path: '/calificaciones', label: 'Calificaciones', icon: ClipboardList },
    { path: '/financiero', label: 'Financiero', icon: DollarSign },
  ],
  docente: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/docente/cursos', label: 'Mis Cursos', icon: BookOpen },
    { path: '/docente/asistencia', label: 'Asistencia', icon: UserCheck },
    { path: '/docente/calificaciones', label: 'Calificaciones', icon: ClipboardList },
  ],
  administrativo: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin', label: 'Gestión Académica', icon: Settings },
  ],
  directivo: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ejecutivo', label: 'Dashboard Ejecutivo', icon: BarChart3 },
  ],
};

const roleLabel: Record<UserRole, string> = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  administrativo: 'Administrativo',
  directivo: 'Directivo',
};

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = roleNavItems[user?.role as UserRole] || [];
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className="flex min-h-screen bg-bg">
      <button
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm ${sidebarOpen ? 'block' : 'hidden'} md:hidden`}
        onClick={closeSidebar}
        aria-label="Cerrar menú"
      />
      <aside className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-primary flex flex-col transition-transform duration-300 md:static md:translate-x-0 md:h-auto md:min-h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 pt-8 pb-6">
          <div className="font-display text-[1.6rem] leading-none text-white font-semibold tracking-tight">
            LA MEJOR
          </div>
          <div className="text-[0.65rem] text-white/50 mt-1.5 font-medium tracking-wider uppercase">
            Universidad Tecnológica
          </div>
        </div>
        <div className="mx-5 h-px bg-white/10" />
        <nav className="flex-1 px-4 py-5 space-y-0.5" aria-label="Navegación principal">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-all duration-150 ${
                    isActive
                      ? 'bg-secondary/30 text-white font-medium shadow-sm border-l-2 border-l-secondary ml-0'
                      : 'text-white/70 hover:text-white hover:bg-white/10 border-l-2 border-l-transparent ml-0'
                  }`
                }
                onClick={closeSidebar}
              >
                <Icon size={18} aria-hidden="true" className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="mx-5 h-px bg-white/10" />
        <div className="px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all no-underline cursor-pointer"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-border sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 bg-transparent border-none rounded-lg cursor-pointer text-primary hover:bg-bg md:hidden"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {sidebarOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-primary leading-tight">{user?.name}</div>
                <div className="text-[0.7rem] text-text-secondary tracking-wider uppercase">{roleLabel[user?.role as UserRole] || user?.role}</div>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white">
                {initials}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8 animate-fadeIn">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded focus:border focus:border-border">
            Saltar al contenido principal
          </a>
          <div id="main-content">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}