import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Eye, EyeOff, AlertCircle, GraduationCap, Users, Building2, Briefcase } from 'lucide-react';
import type { UserRole } from '../../types';

const roleMeta: Record<UserRole, { label: string; icon: React.ComponentType<{ size?: number }> }> = {
  estudiante: { label: 'Estudiante', icon: GraduationCap },
  docente: { label: 'Docente', icon: Users },
  administrativo: { label: 'Administrativo', icon: Building2 },
  directivo: { label: 'Directivo', icon: Briefcase },
};

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('estudiante');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Ingrese su correo electrónico'); return; }
    if (!password.trim()) { setError('Ingrese su contraseña'); return; }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const quickFill = (role: UserRole) => {
    const users: Record<UserRole, { email: string; password: string }> = {
      estudiante: { email: 'estudiante@mail.com', password: '123456' },
      docente: { email: 'docente@mail.com', password: '123456' },
      administrativo: { email: 'admin@mail.com', password: '123456' },
      directivo: { email: 'directivo@mail.com', password: '123456' },
    };
    const u = users[role];
    setEmail(u.email);
    setPassword(u.password);
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex bg-primary">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden p-12">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/5" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="font-display text-[3.5rem] leading-none text-white font-semibold tracking-tight mb-4">
            LA MEJOR
          </div>
          <div className="text-white/40 text-xs tracking-[0.2em] uppercase mb-8 font-medium">
            Universidad Tecnológica
          </div>
          <div className="w-12 h-px bg-white/20 mx-auto mb-8" />
          <p className="text-white/60 text-sm leading-relaxed">
            Plataforma universitaria para la gestión académica, administrativa y financiera.
            Acceda a sus cursos, calificaciones y más desde un solo lugar.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-white/20 text-[0.65rem] tracking-widest uppercase">
            <span>Excelencia</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Innovación</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Liderazgo</span>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="font-display text-2xl text-white font-semibold tracking-tight">
              LA MEJOR
            </div>
            <div className="text-white/40 text-[0.6rem] tracking-[0.2em] uppercase mt-1">
              Universidad Tecnológica
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-base font-semibold text-primary">Iniciar Sesión</h1>
              <p className="text-xs text-text-secondary mt-1">Ingrese sus credenciales para acceder</p>
            </div>

            {error && (
              <div className="bg-danger-light text-danger px-4 py-2.5 rounded-lg text-sm mb-4 flex items-center gap-2" role="alert">
                <AlertCircle size={16} aria-hidden="true" className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-5">
              <p className="text-[0.65rem] text-text-secondary uppercase tracking-wider font-medium mb-2.5 text-center">
                Seleccionar rol
              </p>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Rol de usuario">
                {(Object.keys(roleMeta) as UserRole[]).map(role => {
                  const isSelected = selectedRole === role;
                  const Icon = roleMeta[role].icon;
                  return (
                    <button
                      key={role}
                      type="button"
                      aria-pressed={isSelected}
                      className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-bg text-text-secondary hover:bg-primary-light hover:text-primary'
                      }`}
                      onClick={() => quickFill(role)}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {roleMeta[role].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-primary">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  placeholder="correo@universidad.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-primary">Contraseña</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full px-3 py-2 pr-10 border border-border rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary cursor-pointer p-1 bg-transparent border-none rounded hover:bg-bg"
                    aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPwd ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" />
                  <span className="text-text-secondary">Recordar usuario</span>
                </label>
              </div>

              <button type="submit" className="btn-primary w-full py-2.5 text-sm" disabled={loading}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Iniciando sesión...</>
                ) : (
                  <><LogIn size={16} aria-hidden="true" /> Iniciar Sesión</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}