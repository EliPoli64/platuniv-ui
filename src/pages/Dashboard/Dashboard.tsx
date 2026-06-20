import { useAuth } from '../../contexts/AuthContext';
import mockData, { getStudentEnrollments, getStudentPayments, getTeacherCourses, getCourseStudents } from '../../data/mockData';
import { BookOpen, DollarSign, TrendingUp, Award, Users, Calendar } from 'lucide-react';
import type { User } from '../../types';

export default function Dashboard() {
  const { user } = useAuth();
  const currentPeriod = mockData.periods.find(p => p.active);

  const renderEstudiante = () => {
    const enrollments = getStudentEnrollments(user!.id, currentPeriod!.id);
    const totalCredits = enrollments.reduce((sum, e) => {
      const course = mockData.courses.find(c => c.id === e.courseId);
      return sum + (course ? course.credits : 0);
    }, 0);
    const payments = getStudentPayments(user!.id);
    const pendingPayments = payments.filter(p => p.status === 'pendiente');
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    const completedCourses = mockData.enrollments.filter(e => e.studentId === user!.id && e.status === 'completada');
    const avgGrade = completedCourses.length > 0
      ? (completedCourses.reduce((sum, e) => sum + (e.grade || 0), 0) / completedCourses.length).toFixed(1)
      : 'N/A';

    return (
      <>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6" role="list" aria-label="Resumen del estudiante">
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-primary text-white"><BookOpen size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{enrollments.length}</div>
              <div className="text-xs text-text-secondary mt-0.5">Cursos Matriculados</div>
              <div className="text-xs text-text-secondary">{totalCredits} créditos</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-success text-white"><TrendingUp size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{avgGrade}</div>
              <div className="text-xs text-text-secondary mt-0.5">Promedio General</div>
              <div className="text-xs text-text-secondary">{completedCourses.length} cursos completados</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-warning text-white"><DollarSign size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">${totalPending.toFixed(2)}</div>
              <div className="text-xs text-text-secondary mt-0.5">Pagos Pendientes</div>
              <div className="text-xs text-text-secondary">{pendingPayments.length} facturas</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-info text-white"><Award size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{(user as any).semester}°</div>
              <div className="text-xs text-text-secondary mt-0.5">Semestre Actual</div>
              <div className="text-xs text-text-secondary">{(user as any).career}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-body">
            <h3 className="text-sm font-semibold mb-3 text-primary">Mis Cursos</h3>
            {enrollments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {enrollments.map(e => {
                  const course = mockData.courses.find(c => c.id === e.courseId);
                  const teacher = mockData.users.find(u => u.id === course?.teacherId);
                  return (
                    <div key={e.courseId} className="rounded-lg border border-border p-3.5 hover:border-secondary/40 transition-colors">
                      <div className="text-sm font-medium text-primary">{course?.name}</div>
                      <div className="text-xs text-text-secondary mt-0.5">{course?.code} &middot; {course?.schedule}</div>
                      <div className="text-xs text-text-secondary">{teacher?.name}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <BookOpen size={32} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
                <h4 className="text-sm text-primary mb-1">Sin cursos</h4>
                <p className="text-xs">No tienes cursos matriculados en este período.</p>
              </div>
            )}
          </div>
          <div className="card-body">
            <h3 className="text-sm font-semibold mb-3 text-primary">Próximos Vencimientos</h3>
            {pendingPayments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {pendingPayments.slice(0, 4).map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <div>
                      <div className="text-xs font-medium text-primary">{p.concept}</div>
                      <div className="text-xs text-text-secondary">Vence pronto</div>
                    </div>
                    <span className="font-semibold text-warning text-sm">${p.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <DollarSign size={32} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
                <h4 className="text-sm text-primary mb-1">Sin pagos pendientes</h4>
                <p className="text-xs">Estás al día con tus pagos.</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderDocente = () => {
    const courses = getTeacherCourses(user!.id, currentPeriod!.id);
    const totalStudents = courses.reduce((sum, c) => sum + c.enrolled, 0);

    return (
      <>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6" role="list" aria-label="Resumen del docente">
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-primary text-white"><BookOpen size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{courses.length}</div>
              <div className="text-xs text-text-secondary mt-0.5">Cursos Asignados</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-success text-white"><Users size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{totalStudents}</div>
              <div className="text-xs text-text-secondary mt-0.5">Estudiantes</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-info text-white"><Calendar size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{currentPeriod?.name}</div>
              <div className="text-xs text-text-secondary mt-0.5">Período Activo</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: '#6366f1' }}><Award size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{(user as any).specialization?.split(' ')[0]}</div>
              <div className="text-xs text-text-secondary mt-0.5">Especialidad</div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h3 className="text-sm font-semibold mb-3 text-primary">Mis Cursos ({currentPeriod?.name})</h3>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courses.map(course => {
                const students = getCourseStudents(course.id);
                const pct = (students.length / course.capacity) * 100;
                return (
                  <div key={course.id} className="rounded-lg border border-border p-4 hover:border-secondary/40 transition-colors">
                    <div className="text-sm font-medium text-primary">{course.name}</div>
                    <div className="text-xs text-text-secondary">{course.code}</div>
                    <div className="text-xs text-text-secondary mt-2 flex items-center gap-1">
                      <Calendar size={13} aria-hidden="true" /> {course.schedule}
                    </div>
                    <div className="text-xs text-text-secondary flex items-center gap-1">
                      <Users size={13} aria-hidden="true" /> {students.length}/{course.capacity} estudiantes
                    </div>
                    <div className="mt-2.5 h-1.5 bg-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        role="progressbar"
                        aria-valuenow={students.length}
                        aria-valuemin={0}
                        aria-valuemax={course.capacity}
                        aria-label={`${course.name}: ${students.length} de ${course.capacity} estudiantes`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <BookOpen size={32} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
              <h4 className="text-sm text-primary mb-1">Sin cursos asignados</h4>
              <p className="text-xs">No tienes cursos asignados en este período.</p>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderAdmin = () => {
    const students = mockData.users.filter(u => u.role === 'estudiante');
    const teachers = mockData.users.filter(u => u.role === 'docente');
    const activeEnrollments = mockData.enrollments.filter(e => e.status === 'activa');
    const totalPayments = mockData.payments.filter(p => p.status === 'pagado').reduce((s, p) => s + p.amount, 0);

    return (
      <>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6" role="list" aria-label="Resumen administrativo">
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-primary text-white"><Users size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{students.length}</div>
              <div className="text-xs text-text-secondary mt-0.5">Estudiantes</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-success text-white"><Users size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{teachers.length}</div>
              <div className="text-xs text-text-secondary mt-0.5">Docentes</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-info text-white"><BookOpen size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{activeEnrollments.length}</div>
              <div className="text-xs text-text-secondary mt-0.5">Matrículas Activas</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-warning text-white"><DollarSign size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">${totalPayments.toFixed(2)}</div>
              <div className="text-xs text-text-secondary mt-0.5">Ingresos ({currentPeriod?.name})</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-body">
            <h3 className="text-sm font-semibold mb-3 text-primary">Distribución por Carrera</h3>
            <div className="flex flex-col gap-3">
              {mockData.careers.map(career => {
                const count = mockData.users.filter((u: User) => u.role === 'estudiante' && u.career === career.name).length;
                const total = mockData.users.filter((u: User) => u.role === 'estudiante').length;
                return (
                  <div key={career.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-primary">{career.name}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        role="progressbar"
                        aria-valuenow={count}
                        aria-valuemin={0}
                        aria-valuemax={total}
                        aria-label={`${career.name}: ${count} estudiantes`}
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card-body">
            <h3 className="text-sm font-semibold mb-3 text-primary">Actividad Reciente</h3>
            <p className="text-xs text-text-secondary mb-4">Últimas matrículas registradas en el sistema.</p>
            <div className="flex flex-col gap-2">
              {mockData.enrollments.filter(e => e.status === 'activa').slice(0, 5).map((e, i) => {
                const student = mockData.users.find(u => u.id === e.studentId);
                const course = mockData.courses.find(c => c.id === e.courseId);
                return (
                  <div key={i} className="text-xs py-1.5 border-b border-border last:border-b-0">
                    <strong className="text-primary">{student?.name}</strong> se matriculó en <strong className="text-primary">{course?.name}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDirectivo = () => {
    const students = mockData.users.filter(u => u.role === 'estudiante');
    const totalPaid = mockData.payments.filter(p => p.status === 'pagado').reduce((s, p) => s + p.amount, 0);
    const totalPending = mockData.payments.filter(p => p.status === 'pendiente').reduce((s, p) => s + p.amount, 0);

    const completedEnrollments = mockData.enrollments.filter(e => e.status === 'completada');
    const passed = completedEnrollments.filter(e => e.grade! >= 6.0).length;
    const failed = completedEnrollments.filter(e => e.grade! < 6.0).length;
    const passRate = completedEnrollments.length > 0 ? ((passed / completedEnrollments.length) * 100).toFixed(1) : '0';
    const failPct = completedEnrollments.length > 0 ? ((failed / completedEnrollments.length) * 100) : 0;

    return (
      <>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6" role="list" aria-label="Resumen directivo">
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-primary text-white"><Users size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{students.length}</div>
              <div className="text-xs text-text-secondary mt-0.5">Estudiantes Activos</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-success text-white"><DollarSign size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">${totalPaid.toFixed(2)}</div>
              <div className="text-xs text-text-secondary mt-0.5">Ingresos Totales</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-warning text-white"><TrendingUp size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">{passRate}%</div>
              <div className="text-xs text-text-secondary mt-0.5">Tasa de Aprobación</div>
            </div>
          </div>
          <div className="card-stat" role="listitem">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-danger text-white"><DollarSign size={20} aria-hidden="true" /></div>
            <div>
              <div className="text-2xl font-bold leading-tight text-primary">${totalPending.toFixed(2)}</div>
              <div className="text-xs text-text-secondary mt-0.5">Morosidad</div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h3 className="text-sm font-semibold mb-3 text-primary">Resumen Ejecutivo - {currentPeriod?.name}</h3>
          <p className="text-xs text-text-secondary mb-4">Use el Dashboard Ejecutivo para ver gráficos y estadísticas detalladas.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold mb-2 text-primary">Rendimiento Académico</div>
              <div className="text-xs mb-1 flex justify-between">
                <span>Aprobados</span>
                <span className="text-success font-semibold">{passed}</span>
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-success rounded-full"
                  role="progressbar"
                  aria-valuenow={passed}
                  aria-valuemin={0}
                  aria-valuemax={completedEnrollments.length}
                  aria-label={`Aprobados: ${passed} de ${completedEnrollments.length}`}
                  style={{ width: `${passRate}%` }}
                />
              </div>
              <div className="text-xs mb-1 flex justify-between">
                <span>Reprobados</span>
                <span className="text-danger font-semibold">{failed}</span>
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger rounded-full"
                  role="progressbar"
                  aria-valuenow={failed}
                  aria-valuemin={0}
                  aria-valuemax={completedEnrollments.length}
                  aria-label={`Reprobados: ${failed} de ${completedEnrollments.length}`}
                  style={{ width: `${failPct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-2 text-primary">Indicadores Financieros</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Ingresos por matrícula</span>
                  <span className="font-semibold">${totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pendiente de cobro</span>
                  <span className="font-semibold text-warning">${totalPending.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Morosidad</span>
                  <span className="font-semibold text-danger">{totalPaid + totalPending > 0 ? ((totalPending / (totalPaid + totalPending)) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="card-body mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold bg-primary text-white shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">Saludos, {user?.name?.split(' ')[0]}</h2>
            <p className="text-xs text-text-secondary">
              {(user as any)?.role === 'estudiante' ? `${(user as any).career} - Semestre ${(user as any).semester}` :
               (user as any)?.role === 'docente' ? (user as any).specialization :
               (user as any)?.role === 'administrativo' ? (user as any).position :
               (user as any)?.role === 'directivo' ? (user as any).position : ''}
              {' | '}{currentPeriod?.name}
            </p>
          </div>
        </div>
      </div>

      {user?.role === 'estudiante' && renderEstudiante()}
      {user?.role === 'docente' && renderDocente()}
      {user?.role === 'administrativo' && renderAdmin()}
      {user?.role === 'directivo' && renderDirectivo()}
    </div>
  );
}