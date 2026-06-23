import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mockData, { getTeacherCourses, getCourseStudents } from '../../data/mockData';
import { BookOpen, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { User, GradeFormEntry, GradesState, AttendanceState, AttendanceStatus, Toast } from '../../types';

const GRADE_FIELDS: Array<keyof GradeFormEntry> = ['parcial1', 'parcial2', 'proyecto', 'final'];

export default function Docente() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPeriod = mockData.periods.find(p => p.active);
  const courses = getTeacherCourses(user!.id, currentPeriod?.id ?? 0);

  const [selectedCourse, setSelectedCourse] = useState<number | null>(courses[0]?.id ?? null);

  const tabFromPath = () => {
    const t = location.pathname.split('/').pop() || 'cursos';
    return t === 'docente' ? 'cursos' : t;
  };
  const [activeView, setActiveView] = useState(tabFromPath());

  useEffect(() => {
    const resolved = tabFromPath();
    if (resolved !== activeView) setActiveView(resolved);
  }, [location.pathname]);

  const switchTab = (tabId: string) => {
    navigate(`/docente/${tabId}`, { replace: true });
    setActiveView(tabId);
  };

  const course = mockData.courses.find(c => c.id === selectedCourse);
  const students = selectedCourse ? getCourseStudents(selectedCourse) : [];

  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const [grades, setGrades] = useState<GradesState>({});
  const [savingGrades, setSavingGrades] = useState(false);

  useEffect(() => {
    if (selectedCourse && students.length > 0) {
      const initial: GradesState = {};
      students.forEach(s => {
        const existingGrade = mockData.grades.find(g => g.courseId === selectedCourse && g.studentId === s.id);
        initial[s.id] = {
          parcial1: existingGrade?.parcial1 ?? ('' as const),
          parcial2: existingGrade?.parcial2 ?? ('' as const),
          proyecto: existingGrade?.proyectos ?? ('' as const),
          final: existingGrade?.final ?? ('' as const),
        } as GradeFormEntry;
      });
      setGrades(initial);
    }
  }, [selectedCourse, students.length]);

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    setSavingAttendance(true);
    setTimeout(() => {
      setSavingAttendance(false);
      showToast('Asistencia registrada exitosamente.', 'success');
    }, 600);
  };

  const handleGradeChange = (studentId: number, field: keyof GradeFormEntry, value: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value !== '' ? (parseFloat(value) || 0) as 0 : '' as const }
    } as GradesState));
  };

  const saveGrades = () => {
    setSavingGrades(true);
    setTimeout(() => {
      setSavingGrades(false);
      showToast('Calificaciones registradas exitosamente.', 'success');
    }, 600);
  };

  const calcStudentAverage = (studentId: number) => {
    const g = grades[studentId];
    if (!g) return null;
    const vals = [g.parcial1, g.parcial2, g.proyecto, g.final].filter(v => v !== undefined && v !== '') as number[];
    if (vals.length === 0) return null;
    if (g.final !== undefined && g.final !== '') return Number(g.final);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const courseStats = (() => {
    if (!selectedCourse) return null;
    const selCourse = selectedCourse;
    const enrolledStudents = getCourseStudents(selCourse);
    const total = enrolledStudents.length;
    const courseGrades = mockData.grades.filter(g => g.courseId === selCourse && g.final !== null);
    const passed = courseGrades.filter(g => g.final! >= 6).length;
    const failed = courseGrades.filter(g => g.final! < 6).length;
    const avg = courseGrades.length > 0
      ? (courseGrades.reduce((s, g) => s + (g.final || 0), 0) / courseGrades.length).toFixed(1)
      : 'N/A';
    return { total, passed, failed, avg };
  })();

  const viewTabs = [
    { id: 'cursos', label: 'Mis Cursos', icon: BookOpen },
    { id: 'asistencia', label: 'Asistencia', icon: Clock },
    { id: 'calificaciones', label: 'Calificaciones', icon: CheckCircle },
  ];

  if (courses.length === 0) {
    return (
      <div className="card-body">
        <div className="text-center py-12 px-4 text-text-secondary">
          <BookOpen size={40} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
          <h4 className="text-base mb-1 text-primary">Sin cursos asignados</h4>
          <p className="text-sm">No tienes cursos asignados para el período {currentPeriod?.name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[2000] px-5 py-3 rounded-lg text-sm flex items-center gap-2 shadow-card-lg max-w-[400px] animate-slideIn ${toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}
          role="alert"
        >
          {toast.type === 'success' ? <CheckCircle size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="card-body mb-6">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-primary">{courses.length} curso(s) asignados</span>
          {courseStats && selectedCourse && (
            <>
              <span className="text-border">&middot;</span>
              <span className="inline-flex items-center gap-1"><Users size={13} aria-hidden="true" /> {courseStats.total} estudiantes</span>
              <span>Prom. <span className="font-mono font-semibold">{courseStats.avg}</span></span>
              {courseStats.passed > 0 && <span className="text-success">{courseStats.passed} aprobados</span>}
              {courseStats.failed > 0 && <span className="text-danger">{courseStats.failed} reprobados</span>}
            </>
          )}
        </div>
      </div>

      <div className="flex border-b border-border mb-6 gap-1" role="tablist" aria-label="Vistas del docente">
        {viewTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              className={`px-4 py-2.5 text-sm font-medium bg-transparent border-b-2 -mb-px transition-colors cursor-pointer ${
                isActive ? 'text-primary border-b-primary' : 'text-text-secondary border-transparent hover:text-primary'
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <Icon size={15} className="inline mr-1.5 align-middle" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="card-body mb-4 flex flex-wrap items-center gap-3 text-sm">
        <label htmlFor="course-select" className="font-medium text-primary text-xs">Curso:</label>
        <select
          id="course-select"
          value={selectedCourse || ''}
          onChange={e => setSelectedCourse(Number(e.target.value))}
          className="w-auto min-w-[200px]"
        >
          {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
        </select>
      </div>

      <div id="panel-cursos" role="tabpanel" aria-labelledby="tab-cursos">
        {activeView === 'cursos' && (
          <>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-body">
                <h3 className="text-sm font-semibold mb-3 text-primary">Detalle del Curso</h3>
                {course && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-base text-primary">{course.name}</span>
                      <span className="tag-info">{course.code}</span>
                    </div>
                    <div className="text-sm text-text-secondary space-y-1.5">
                      <p><strong className="text-primary">Horario:</strong> {course.schedule}</p>
                      <p><strong className="text-primary">Aula:</strong> {course.classroom}</p>
                      <p><strong className="text-primary">Créditos:</strong> {course.credits}</p>
                      <p><strong className="text-primary">Capacidad:</strong> {course.enrolled}/{course.capacity}</p>
                      <p className="mt-2 leading-relaxed">{course.description}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-body">
                <h3 className="text-sm font-semibold mb-3 text-primary">Estudiantes Matriculados</h3>
                {students.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table aria-label="Lista de estudiantes matriculados">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nombre</th>
                          <th>Correo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s: User, i: number) => (
                          <tr key={s.id}>
                            <td className="text-text-secondary">{i + 1}</td>
                            <td className="font-medium">{s.name}</td>
                            <td className="text-text-secondary">{s.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    <h4 className="text-sm text-primary mb-1">Sin estudiantes</h4>
                    <p className="text-xs">No hay estudiantes matriculados en este curso.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div id="panel-asistencia" role="tabpanel" aria-labelledby="tab-asistencia">
        {activeView === 'asistencia' && (
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-semibold text-primary">Registro de Asistencia - {course?.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-secondary">Fecha: {new Date().toLocaleDateString()}</span>
                <button className="btn-primary" onClick={saveAttendance} disabled={savingAttendance}>
                  {savingAttendance ? 'Guardando...' : 'Guardar Asistencia'}
                </button>
              </div>
            </div>
            {students.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table aria-label="Registro de asistencia">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Estudiante</th>
                      <th className="text-center">Presente</th>
                      <th className="text-center">Ausente</th>
                      <th className="text-center">Justificado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s: User, i: number) => (
                      <tr key={s.id}>
                        <td className="text-text-secondary">{i + 1}</td>
                        <td className="font-medium">{s.name}</td>
                        {(['presente', 'ausente', 'justificado'] as AttendanceStatus[]).map(status => (
                          <td key={status} className="text-center">
                            <input
                              type="radio"
                              name={`attendance-${s.id}`}
                              checked={attendance[s.id] === status}
                              onChange={() => handleAttendanceChange(s.id, status)}
                              className="w-[18px] h-[18px] cursor-pointer accent-primary"
                              aria-label={`${s.name} - ${status}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <h4 className="text-sm text-primary mb-1">Sin estudiantes</h4>
                <p className="text-xs">No hay estudiantes en este curso.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div id="panel-calificaciones" role="tabpanel" aria-labelledby="tab-calificaciones">
        {activeView === 'calificaciones' && (
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-semibold text-primary">Registro de Calificaciones - {course?.name}</h3>
              <button className="btn-primary" onClick={saveGrades} disabled={savingGrades}>
                {savingGrades ? 'Guardando...' : 'Guardar Calificaciones'}
              </button>
            </div>
            {students.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table aria-label="Registro de calificaciones">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Estudiante</th>
                      <th>Parcial 1</th>
                      <th>Parcial 2</th>
                      <th>Proyecto</th>
                      <th>Final</th>
                      <th>Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s: User, i: number) => {
                      const avg = calcStudentAverage(s.id);
                      const g = grades[s.id] || {} as GradeFormEntry;
                      return (
                        <tr key={s.id}>
                          <td className="text-text-secondary">{i + 1}</td>
                          <td className="font-medium">{s.name}</td>
                          {GRADE_FIELDS.map(field => (
                            <td key={field} className="px-1.5">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                value={g[field] === '' ? '' : g[field]}
                                onChange={e => handleGradeChange(s.id, field, e.target.value)}
                                className="w-14 px-1.5 py-1 border border-border rounded-lg text-xs text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                aria-label={`${s.name} - ${field}`}
                              />
                            </td>
                          ))}
                          <td className="font-semibold">
                            {avg !== null ? (
                              <span className={avg >= 6 ? 'text-success' : 'text-danger'}>
                                {avg.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-text-secondary">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <h4 className="text-sm text-primary mb-1">Sin estudiantes</h4>
                <p className="text-xs">No hay estudiantes en este curso.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}