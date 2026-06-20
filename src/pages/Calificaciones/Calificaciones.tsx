import { useAuth } from '../../contexts/AuthContext';
import mockData, { getStudentGrades } from '../../data/mockData';
import { ClipboardList, TrendingUp, Award } from 'lucide-react';
import type { Period, Course, Grade } from '../../types';

export default function Calificaciones() {
  const { user } = useAuth();
  if (!user) return null;
  const allPeriods = mockData.periods;

  const renderGradesForPeriod = (period: Period) => {
    const periodEnrollments = mockData.enrollments.filter(
      e => e.studentId === user.id && e.periodId === period.id
    );
    const periodGrades = getStudentGrades(user.id, period.id);

    let totalWeighted = 0;
    let totalCredits = 0;
    const gradeRows = periodEnrollments.map(e => {
      const course: Course | undefined = mockData.courses.find(c => c.id === e.courseId);
      const gradeInfo: Grade | undefined = periodGrades.find(g => g.courseId === e.courseId);
      const gradeDetail: (number | string)[] = gradeInfo ? [
        gradeInfo.parcial1 ?? '-',
        gradeInfo.parcial2 ?? '-',
        gradeInfo.proyectos ?? '-',
        gradeInfo.final ?? '-',
      ] : ['-', '-', '-', '-'];

      let finalGrade: number | string | null | undefined = gradeInfo?.final;
      if (finalGrade === null || finalGrade === undefined) {
        const vals = [gradeInfo?.parcial1, gradeInfo?.parcial2, gradeInfo?.proyectos].filter(v => v !== null && v !== undefined);
        if (vals.length > 0) finalGrade = (vals as number[]).reduce((a, b) => a + b, 0) / vals.length;
      }
      if (e.status === 'completada' && e.grade !== null) finalGrade = e.grade;
      if (finalGrade === null || finalGrade === undefined) finalGrade = '-';

      if (typeof finalGrade === 'number' && course) {
        totalWeighted += finalGrade * course.credits;
        totalCredits += course.credits;
      }

      return { course, gradeDetail, finalGrade, status: e.status };
    });

    const average = totalCredits > 0 ? (totalWeighted / totalCredits).toFixed(1) : '--';

    return (
      <div key={period.id} className="mb-8 last:mb-0">
        <h3 className="text-base font-semibold mb-3 text-primary flex items-center gap-2">
          {period.name}
          {period.active && <span className="tag-success text-[0.6rem]">Activo</span>}
        </h3>
        {gradeRows.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table aria-label={`Calificaciones del período ${period.name}`}>
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th>Código</th>
                    <th>Parcial 1</th>
                    <th>Parcial 2</th>
                    <th>Proyectos</th>
                    <th>Final</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeRows.map((row, i) => (
                    <tr key={i}>
                      <td className="font-medium">{row.course?.name}</td>
                      <td className="text-text-secondary">{row.course?.code}</td>
                      {row.gradeDetail.map((g, j) => (
                        <td key={j}>
                          {g !== '-' ? g : <span className="text-text-secondary">-</span>}
                        </td>
                      ))}
                      <td className="font-semibold">
                        {typeof row.finalGrade === 'number' ? (
                          <span className={row.finalGrade >= 6 ? 'text-success' : 'text-danger'}>
                            {row.finalGrade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-text-secondary">Pendiente</span>
                        )}
                      </td>
                      <td>
                        {row.status === 'completada' ? (
                          <span className="tag-success">Completado</span>
                        ) : (
                          <span className="tag-info">En curso</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-right text-sm">
              <strong>Promedio Ponderado: </strong>
              <span className={`font-bold ${average !== '--' && parseFloat(average) >= 6 ? 'text-success' : 'text-primary'}`}>
                {average}
              </span>
            </div>
          </>
        ) : (
          <div className="p-4 text-text-secondary text-sm bg-bg rounded-lg">
            Sin calificaciones para este período.
          </div>
        )}
      </div>
    );
  };

  const completedCourses = mockData.enrollments.filter(e => e.studentId === user.id && e.status === 'completada');
  const avgGrade = completedCourses.length > 0
    ? (completedCourses.reduce((sum, e) => sum + (e.grade || 0), 0) / completedCourses.length).toFixed(1)
    : 'N/A';

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6" role="list" aria-label="Resumen de calificaciones">
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-primary text-white"><ClipboardList size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{completedCourses.length}</div>
            <div className="text-xs text-text-secondary mt-0.5">Cursos Completados</div>
          </div>
        </div>
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-success text-white"><TrendingUp size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{avgGrade}</div>
            <div className="text-xs text-text-secondary mt-0.5">Promedio General</div>
          </div>
        </div>
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-info text-white"><Award size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{'semester' in user ? `${user.semester}°` : '-'}</div>
            <div className="text-xs text-text-secondary mt-0.5">Semestre</div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <h2 className="text-lg font-semibold mb-4 text-primary">Calificaciones por Período</h2>
        {allPeriods.filter(p => {
          return mockData.enrollments.some(e => e.studentId === user.id && e.periodId === p.id);
        }).map(p => renderGradesForPeriod(p))}
      </div>
    </div>
  );
}