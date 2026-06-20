import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Matricula from './pages/Matricula/Matricula';
import Cursos from './pages/Cursos/Cursos';
import Horarios from './pages/Horarios/Horarios';
import Calificaciones from './pages/Calificaciones/Calificaciones';
import Financiero from './pages/Financiero/Financiero';
import Administrativo from './pages/Administrativo/Administrativo';
import Ejecutivo from './pages/Ejecutivo/Ejecutivo';
import Docente from './pages/Docente/Docente';
import type { ReactNode } from 'react';
import type { UserRole } from './types';

function PrivateRoute({ children, roles }: { children: ReactNode; roles: UserRole[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role as UserRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute roles={['estudiante', 'docente', 'administrativo', 'directivo']}><Dashboard /></PrivateRoute>} />
      <Route path="/matricula" element={<PrivateRoute roles={['estudiante']}><Matricula /></PrivateRoute>} />
      <Route path="/cursos" element={<PrivateRoute roles={['estudiante']}><Cursos /></PrivateRoute>} />
      <Route path="/horarios" element={<PrivateRoute roles={['estudiante']}><Horarios /></PrivateRoute>} />
      <Route path="/calificaciones" element={<PrivateRoute roles={['estudiante']}><Calificaciones /></PrivateRoute>} />
      <Route path="/financiero" element={<PrivateRoute roles={['estudiante']}><Financiero /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute roles={['administrativo']}><Administrativo /></PrivateRoute>} />
      <Route path="/ejecutivo" element={<PrivateRoute roles={['directivo']}><Ejecutivo /></PrivateRoute>} />
      <Route path="/docente/cursos" element={<PrivateRoute roles={['docente']}><Docente /></PrivateRoute>} />
      <Route path="/docente/asistencia" element={<PrivateRoute roles={['docente']}><Docente /></PrivateRoute>} />
      <Route path="/docente/calificaciones" element={<PrivateRoute roles={['docente']}><Docente /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
