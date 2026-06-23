import { useAuth } from '../../contexts/AuthContext';
import mockData, { getStudentGrades } from '../../data/mockData';
import type { Period, Course, Grade } from '../../types';

export default function Calificaciones() {
  const { user } = useAuth();
  if (!user) return null;
  const allPeriods = mockData.periods;

  const completedCourses = mockData.enrollments.filter(e => e.studentId === user.id && e.status === 'completada');
  const avgGrade = completedCourses.length > 0
    ? (completedCourses.reduce((sum, e) => sum + (e.grade || 0), 0) / completedCourses.length).toFixed(1)
    : 'N/A';

  const totalCareerCredits = mockData.careers.find(ca => ca.name === ('career' in user ? user.career : ''))?.duration || 0;
  const earnedCredits = completedCourses.reduce((sum, e) => {
    const course = mockData.courses.find(c => c.id === e.courseId);
    return sum + (course?.credits || 0);
  }, 0);
  const progressPct = totalCareerCredits > 0 ? Math.min(100, (earnedCredits / totalCareerCredits) * 100) : 0;

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
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
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
                      <td className="font-mono text-xs text-text-secondary">{row.course?.code}</td>
                      {row.gradeDetail.map((g, j) => (
                        <td key={j} className="font-mono text-xs">
                          {g !== '-' ? g : <span className="text-text-secondary">-</span>}
                        </td>
                      ))}
                      <td className="font-semibold font-mono text-xs">
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
            <div className="mt-3 text-right text-xs">
              <strong className="text-text-secondary">Promedio Ponderado: </strong>
              <span className={`font-bold font-mono ${average !== '--' && parseFloat(average) >= 6 ? 'text-success' : 'text-primary'}`}>
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

  return (
    <div>
      <div className="card-body mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-primary">Calificaciones</h2>
          <div className="text-xs text-text-secondary text-right">
            <span className="font-medium text-primary">{completedCourses.length}</span> cursos completados &middot;
            Promedio: <span className="font-bold font-mono text-primary">{avgGrade}</span> &middot;
            {'semester' in user ? `${user.semester}° semestre` : ''}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Progreso de carrera</span>
            <span className="font-mono">{earnedCredits}/{totalCareerCredits} créditos</span>
          </div>
          <div className="h-1.5 bg-bg rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} role="progressbar" aria-valuenow={earnedCredits} aria-valuemin={0} aria-valuemax={totalCareerCredits} />
          </div>
        </div>
      </div>

      <div className="card-body">
        {allPeriods.filter(p => {
          return mockData.enrollments.some(e => e.studentId === user.id && e.periodId === p.id);
        }).map(p => renderGradesForPeriod(p))}
      </div>
    </div>
  );
}