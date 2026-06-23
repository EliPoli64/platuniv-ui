import { useState, type ReactNode } from 'react';
import mockData from '../../data/mockData';
import { Users, BookOpen, Search, Edit, Trash2, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { User, Course, Period } from '../../types';

interface TabDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TABS: TabDef[] = [
  { id: 'students', label: 'Estudiantes', icon: Users },
  { id: 'teachers', label: 'Docentes', icon: Users },
  { id: 'courses', label: 'Cursos', icon: BookOpen },
  { id: 'periods', label: 'Períodos', icon: Calendar },
];

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

export default function Administrativo() {
  const [activeTab, setActiveTab] = useState('students');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const students = mockData.users.filter(u => u.role === 'estudiante') as User[];
  const teachers = mockData.users.filter(u => u.role === 'docente') as User[];
  const courses = mockData.courses;
  const periods = mockData.periods;

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.career ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    (('specialization' in t ? t.specialization : '') ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPeriods = periods.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function renderTable<T extends { id: number }>(title: string, data: T[], columns: Column<T>[], emptyMsg: string) {
    return (
      <div className="card-body" role="tabpanel" aria-labelledby={`tab-${title.toLowerCase()}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 id={`tabpanel-${title.toLowerCase()}`} className="text-sm font-semibold text-primary">{title}</h3>
          <div className="relative w-full sm:max-w-[280px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
            <input
              aria-label={`Buscar ${title.toLowerCase()}`}
              placeholder={`Buscar ${title.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border rounded text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
        {data.length > 0 ? (
          <div className="overflow-x-auto rounded border border-border">
            <table aria-label={title}>
              <thead>
                <tr>
                  {columns.map(col => <th key={col.key}>{col.label}</th>)}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                      </td>
                    ))}
                    <td>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" icon={Edit} onClick={() => showToast('Editar: Funcionalidad simulada')}>
                          Editar
                        </Button>
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => showToast('Eliminar: Funcionalidad simulada')}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 text-text-secondary">
            <Search size={32} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
            <h4 className="text-base mb-1 text-primary">{emptyMsg}</h4>
          </div>
        )}
      </div>
    );
  }

  const studentCols: Column<User>[] = [
    { key: 'id', label: 'ID', render: s => `#${s.id}` },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo' },
    { key: 'career', label: 'Carrera', render: s => ('career' in s ? s.career : '-') },
    { key: 'semester', label: 'Semestre', render: s => ('semester' in s ? `${s.semester}°` : '-') },
  ];

  const teacherCols: Column<User>[] = [
    { key: 'id', label: 'ID', render: t => `#${t.id}` },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo' },
    { key: 'specialization', label: 'Especialización', render: t => ('specialization' in t ? t.specialization : '-') },
  ];

  const courseCols: Column<Course>[] = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nombre' },
    { key: 'credits', label: 'Créditos', render: c => c.credits },
    {
      key: 'teacherId', label: 'Docente',
      render: c => {
        const teacher = mockData.users.find(u => u.id === c.teacherId);
        return teacher?.name || 'Sin asignar';
      }
    },
    {
      key: 'enrolled', label: 'Cupos',
      render: c => `${c.enrolled}/${c.capacity}`
    },
    { key: 'schedule', label: 'Horario' },
  ];

  const periodCols: Column<Period>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'startDate', label: 'Fecha Inicio' },
    { key: 'endDate', label: 'Fecha Fin' },
    {
      key: 'active', label: 'Estado',
      render: p => p.active
        ? <span className="tag-success">Activo</span>
        : <span className="tag-muted">Inactivo</span>
    },
  ];

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-[2000] px-5 py-3 rounded text-sm flex items-center gap-2 shadow-card-lg max-w-[400px] animate-slideIn bg-primary text-white" role="alert">
          <span>{toast}</span>
        </div>
      )}

      <div className="card-body mb-6">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-primary">Catálogo:</span>
          <span className="bg-primary-light text-primary rounded-full px-2.5 py-0.5 font-medium inline-flex items-center gap-1"><Users size={12} aria-hidden="true" /> {students.length} Estudiantes</span>
          <span className="bg-primary-light text-primary rounded-full px-2.5 py-0.5 font-medium inline-flex items-center gap-1"><Users size={12} aria-hidden="true" /> {teachers.length} Docentes</span>
          <span className="bg-primary-light text-primary rounded-full px-2.5 py-0.5 font-medium inline-flex items-center gap-1"><BookOpen size={12} aria-hidden="true" /> {courses.length} Cursos</span>
          <span className="bg-primary-light text-primary rounded-full px-2.5 py-0.5 font-medium inline-flex items-center gap-1"><Calendar size={12} aria-hidden="true" /> {periods.length} Períodos</span>
        </div>
      </div>

      <div className="flex border-b border-border mb-6 gap-1" role="tablist" aria-label="Secciones administrativas">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tab.id === 'students' ? students.length
            : tab.id === 'teachers' ? teachers.length
            : tab.id === 'courses' ? courses.length
            : periods.length;
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
              onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            >
              <Icon size={15} className="inline mr-1.5 align-middle" aria-hidden="true" />
              {tab.label}
              <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${isActive ? 'bg-primary text-white' : 'bg-bg text-text-secondary'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div id="panel-students" role="tabpanel" aria-labelledby="tab-students">
        {activeTab === 'students' && renderTable('Estudiantes', filteredStudents, studentCols, 'No se encontraron estudiantes.')}
      </div>

      <div id="panel-teachers" role="tabpanel" aria-labelledby="tab-teachers">
        {activeTab === 'teachers' && renderTable('Docentes', filteredTeachers, teacherCols, 'No se encontraron docentes.')}
      </div>

      <div id="panel-courses" role="tabpanel" aria-labelledby="tab-courses">
        {activeTab === 'courses' && renderTable('Cursos', filteredCourses, courseCols, 'No se encontraron cursos.')}
      </div>

      <div id="panel-periods" role="tabpanel" aria-labelledby="tab-periods">
        {activeTab === 'periods' && renderTable('Períodos Académicos', filteredPeriods, periodCols, 'No se encontraron períodos.')}
      </div>
    </div>
  );
}