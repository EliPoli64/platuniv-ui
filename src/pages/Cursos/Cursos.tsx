import { useAuth } from '../../contexts/AuthContext';
import mockData, { getStudentEnrollments } from '../../data/mockData';
import { BookOpen, User, Clock, MapPin } from 'lucide-react';

export default function Cursos() {
  const { user } = useAuth();
  if (!user) return null;
  const currentPeriod = mockData.periods.find(p => p.active);
  const enrollments = getStudentEnrollments(user.id, currentPeriod?.id ?? 0);

  return (
    <div>
      <div className="card-body mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Mis Cursos - {currentPeriod?.name}</h2>
          <span className="tag-info">
            {enrollments.length} cursos
          </span>
        </div>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map(e => {
            const course = mockData.courses.find(c => c.id === e.courseId);
            const teacher = mockData.users.find(u => u.id === course?.teacherId);
            const isFull = course ? course.enrolled >= course.capacity : false;
            return (
              <div key={e.courseId} className="card border-l-4 border-l-primary hover:border-l-secondary transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-[1.05rem] text-primary">{course?.name}</div>
                    <div className="text-xs text-text-secondary">{course?.code}</div>
                  </div>
                  <span className={`tag ${isFull ? 'tag-warning' : 'tag-success'}`}>
                    {isFull ? 'Completo' : `${course?.enrolled}/${course?.capacity}`}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mt-1 flex items-center gap-1"><User size={13} aria-hidden="true" /> {teacher?.name}</div>
                <div className="text-xs text-text-secondary mt-1 flex items-center gap-1"><Clock size={13} aria-hidden="true" /> {course?.schedule}</div>
                <div className="text-xs text-text-secondary mt-1 flex items-center gap-1"><MapPin size={13} aria-hidden="true" /> {course?.classroom}</div>
                <div className="text-xs text-text-secondary mt-2">
                  <strong>Créditos:</strong> {course?.credits}
                </div>
                <div className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {course?.description}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-body">
          <div className="text-center py-12 px-4 text-text-secondary">
            <BookOpen size={40} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
            <h4 className="text-base mb-1 text-primary">No tienes cursos matriculados</h4>
            <p className="text-sm">Dirígete al módulo de matrícula para inscribirte en cursos.</p>
          </div>
        </div>
      )}
    </div>
  );
}