import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import mockData, { getEnrolledCourseIds } from '../../data/mockData';
import { BookOpen, CheckCircle, AlertCircle, Search, User, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { Toast } from '../../types';

export default function Matricula() {
  const { user } = useAuth();
  if (!user) return null;
  const currentPeriod = mockData.periods.find(p => p.active);
  const careerCourses = mockData.courses.filter(c => {
    const career = mockData.careers.find(ca => ca.name === ('career' in user ? user.career : ''));
    return c.careerId === career?.id && c.periodId === currentPeriod?.id;
  });

  const enrolledIds = getEnrolledCourseIds(user.id, currentPeriod?.id ?? 0);

  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [localEnrolledIds, setLocalEnrolledIds] = useState<number[]>(enrolledIds);
  const [search, setSearch] = useState('');

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEnroll = (courseId: number) => {
    setEnrolling(courseId);
    setTimeout(() => {
      setLocalEnrolledIds(prev => [...prev, courseId]);
      setEnrolling(null);
      showToast('Matrícula exitosa. Curso agregado a tu plan de estudios.');
    }, 600);
  };

  const handleDrop = (courseId: number) => {
    setLocalEnrolledIds(prev => prev.filter(id => id !== courseId));
    showToast('Matrícula cancelada. El curso ha sido eliminado de tu plan.', 'info');
  };

  const filteredCourses = careerCourses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const enrolledCourses = mockData.courses.filter(c => localEnrolledIds.includes(c.id));

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-[2000] px-5 py-3 rounded text-sm flex items-center gap-2 shadow-card-lg max-w-[400px] animate-slideIn ${toast.type === 'success' ? 'bg-success text-white' : toast.type === 'info' ? 'bg-primary text-white' : 'bg-danger text-white'}`} role="alert">
          {toast.type === 'success' ? <CheckCircle size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
          {toast.msg}
        </div>
      )}

      <div className="card-body mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-primary">Matrícula de Cursos - {currentPeriod?.name}</h2>
          <div className="relative w-full sm:max-w-[280px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
            <input
              aria-label="Buscar cursos"
              placeholder="Buscar cursos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border rounded text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
        {localEnrolledIds.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Matrícula Actual ({localEnrolledIds.length} cursos)</h3>
            <div className="flex flex-wrap gap-2">
              {enrolledCourses.map(c => (
                <span key={c.id} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary-light text-primary text-xs font-medium">
                  <BookOpen size={11} aria-hidden="true" />
                  {c.code}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Cursos Disponibles
          <span className="ml-2 font-mono text-[11px] text-text-secondary">({filteredCourses.length})</span>
        </h3>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map(course => {
              const isEnrolled = localEnrolledIds.includes(course.id);
              const teacher = mockData.users.find(u => u.id === course.teacherId);
              const fillPercent = isEnrolled ? 100 : (course.enrolled / course.capacity) * 100;
              const fillColor = fillPercent > 80 ? 'bg-danger' : fillPercent > 50 ? 'bg-warning' : 'bg-primary';
              return (
                <div key={course.id} className={`rounded border p-5 transition-all hover:shadow-sm ${
                  isEnrolled ? 'border-l-4 border-l-success bg-white border-border' :
                  fillPercent > 80 ? 'border-l-4 border-l-warning bg-white border-border' :
                  'border-l-4 border-l-primary bg-white border-border'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-sm text-primary">{course.name}</div>
                      <div className="text-xs text-text-secondary">{course.code} | {course.credits} créditos</div>
                    </div>
                    {isEnrolled && <span className="tag-success">Matriculado</span>}
                    {!isEnrolled && course.enrolled >= course.capacity && (
                      <span className="tag-warning">Completo</span>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary mt-1 flex items-center gap-1"><User size={13} aria-hidden="true" /> {teacher?.name}</div>
                  <div className="text-xs text-text-secondary mt-1 flex items-center gap-1"><Clock size={13} aria-hidden="true" /> {course.schedule} | {course.classroom}</div>
                  <div className="text-xs text-text-secondary mt-2 flex items-center gap-2">
                    <span>Cupos: {course.enrolled}/{course.capacity}</span>
                    <div className="flex-1 max-w-[120px] h-1.5 bg-bg rounded-full overflow-hidden" role="progressbar" aria-valuenow={course.enrolled} aria-valuemin={0} aria-valuemax={course.capacity} aria-label={`${course.enrolled} de ${course.capacity} cupos ocupados`}>
                      <div className={`h-full rounded-full ${fillColor}`} style={{ width: `${fillPercent}%` }} />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {!isEnrolled ? (
                      <Button variant="primary" disabled={course.enrolled >= course.capacity || enrolling === course.id} loading={enrolling === course.id} onClick={() => handleEnroll(course.id)}>
                        {enrolling === course.id ? 'Matriculando...' : 'Matricular'}
                      </Button>
                    ) : (
                      <Button variant="danger" onClick={() => handleDrop(course.id)}>
                        Cancelar Matrícula
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary mt-2 leading-relaxed">
                    {course.description}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 text-text-secondary">
            <BookOpen size={40} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
            <h4 className="text-base mb-1 text-primary">No hay cursos disponibles</h4>
            <p className="text-sm">{search ? 'No se encontraron cursos con ese criterio de búsqueda.' : 'No hay cursos disponibles para tu carrera en este período.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}