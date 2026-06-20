import type { MockData, User, Enrollment } from '../types';

const mockData: MockData = {
  users: [
    {
      id: 1, name: 'Ana María García López', email: 'estudiante@mail.com',
      password: '123456', role: 'estudiante', career: 'Ingeniería en Sistemas',
      semester: 6, photo: null, phone: '+503 7890-1234'
    },
    {
      id: 2, name: 'Carlos Ernesto Méndez Rivera', email: 'estudiante2@mail.com',
      password: '123456', role: 'estudiante', career: 'Ingeniería Civil',
      semester: 4, photo: null, phone: '+503 7890-2345'
    },
    {
      id: 3, name: 'Diana Lissette Flores Ramírez', email: 'estudiante3@mail.com',
      password: '123456', role: 'estudiante', career: 'Arquitectura',
      semester: 8, photo: null, phone: '+503 7890-3456'
    },
    {
      id: 4, name: 'Roberto Alejandro Castillo Herrera', email: 'estudiante4@mail.com',
      password: '123456', role: 'estudiante', career: 'Ingeniería en Sistemas',
      semester: 2, photo: null, phone: '+503 7890-4567'
    },
    {
      id: 5, name: 'María José Rivas Quintanilla', email: 'estudiante5@mail.com',
      password: '123456', role: 'estudiante', career: 'Arquitectura',
      semester: 5, photo: null, phone: '+503 7890-5678'
    },
    {
      id: 6, name: 'José Daniel Martínez Guerrero', email: 'estudiante6@mail.com',
      password: '123456', role: 'estudiante', career: 'Ingeniería Civil',
      semester: 7, photo: null, phone: '+503 7890-6789'
    },
    {
      id: 7, name: 'Katherine Michelle Sandoval Vega', email: 'estudiante7@mail.com',
      password: '123456', role: 'estudiante', career: 'Administración de Empresas',
      semester: 3, photo: null, phone: '+503 7890-7890'
    },
    {
      id: 8, name: 'Fernando Alonso Peña Martínez', email: 'estudiante8@mail.com',
      password: '123456', role: 'estudiante', career: 'Ingeniería en Sistemas',
      semester: 9, photo: null, phone: '+503 7890-8901'
    },
    {
      id: 9, name: 'Gabriela Beatriz Ortiz Henríquez', email: 'estudiante9@mail.com',
      password: '123456', role: 'estudiante', career: 'Administración de Empresas',
      semester: 6, photo: null, phone: '+503 7890-9012'
    },
    {
      id: 10, name: 'Luis Fernando Molina Aguilar', email: 'estudiante10@mail.com',
      password: '123456', role: 'estudiante', career: 'Arquitectura',
      semester: 4, photo: null, phone: '+503 7890-0123'
    },
    {
      id: 11, name: 'Dr. Ricardo Alberto Mendoza Vega', email: 'docente@mail.com',
      password: '123456', role: 'docente', career: 'Ingeniería en Sistemas',
      semester: null, photo: null, phone: '+503 7654-3210',
      specialization: 'Bases de Datos y Redes'
    },
    {
      id: 12, name: 'Msc. Elena Patricia Rivas de García', email: 'docente2@mail.com',
      password: '123456', role: 'docente', career: 'Arquitectura',
      semester: null, photo: null, phone: '+503 7654-4321',
      specialization: 'Diseño Arquitectónico y Urbanismo'
    },
    {
      id: 13, name: 'Ing. Mario Ernesto Serrano Portillo', email: 'docente3@mail.com',
      password: '123456', role: 'docente', career: 'Ingeniería Civil',
      semester: null, photo: null, phone: '+503 7654-5432',
      specialization: 'Estructuras y Materiales'
    },
    {
      id: 14, name: 'Msc. Silvia Jeaneth Martínez Linares', email: 'docente4@mail.com',
      password: '123456', role: 'docente', career: 'Administración de Empresas',
      semester: null, photo: null, phone: '+503 7654-6543',
      specialization: 'Gestión Empresarial y Mercadeo'
    },
    {
      id: 15, name: 'Dr. Oscar Armando Flores Benítez', email: 'docente5@mail.com',
      password: '123456', role: 'docente', career: 'Ingeniería en Sistemas',
      semester: null, photo: null, phone: '+503 7654-7654',
      specialization: 'Matemáticas y Estadística'
    },
    {
      id: 16, name: 'Lic. Laura Beatriz Hernández', email: 'admin@mail.com',
      password: '123456', role: 'administrativo', career: null,
      semester: null, photo: null, phone: '+503 7123-4567',
      position: 'Coordinadora Académica'
    },
    {
      id: 17, name: 'Dr. Francisco Javier Aguilar Rivera', email: 'directivo@mail.com',
      password: '123456', role: 'directivo', career: null,
      semester: null, photo: null, phone: '+503 7123-5678',
      position: 'Rector'
    }
  ],

  careers: [
    { id: 1, name: 'Ingeniería en Sistemas', code: 'IS', duration: 10 },
    { id: 2, name: 'Ingeniería Civil', code: 'IC', duration: 10 },
    { id: 3, name: 'Arquitectura', code: 'ARQ', duration: 10 },
    { id: 4, name: 'Administración de Empresas', code: 'ADE', duration: 8 }
  ],

  periods: [
    { id: 1, name: '2025-1', startDate: '2025-01-15', endDate: '2025-06-30', active: false },
    { id: 2, name: '2025-2', startDate: '2025-07-15', endDate: '2025-12-20', active: false },
    { id: 3, name: '2026-1', startDate: '2026-01-15', endDate: '2026-06-30', active: true },
    { id: 4, name: '2026-2', startDate: '2026-07-15', endDate: '2026-12-20', active: false },
    { id: 5, name: '2027-1', startDate: '2027-01-15', endDate: '2027-01-15', active: false }
  ],

  courses: [
    { id: 1, name: 'Programación I', code: 'IS-301', credits: 4, careerId: 1,
      teacherId: 11, schedule: 'Lun-Mie 07:00-08:30', capacity: 30,
      enrolled: 25, description: 'Fundamentos de programación estructurada.',
      periodId: 3, classroom: 'LAB-01' },
    { id: 2, name: 'Bases de Datos I', code: 'IS-302', credits: 4, careerId: 1,
      teacherId: 11, schedule: 'Mar-Jue 07:00-08:30', capacity: 30,
      enrolled: 22, description: 'Modelado y gestión de bases de datos relacionales.',
      periodId: 3, classroom: 'LAB-02' },
    { id: 3, name: 'Cálculo I', code: 'IS-303', credits: 5, careerId: 1,
      teacherId: 15, schedule: 'Lun-Mie-Vie 09:00-10:00', capacity: 40,
      enrolled: 38, description: 'Cálculo diferencial e integral.',
      periodId: 3, classroom: 'A-101' },
    { id: 4, name: 'Redes de Computadoras', code: 'IS-401', credits: 4, careerId: 1,
      teacherId: 11, schedule: 'Mar-Jue 13:00-14:30', capacity: 25,
      enrolled: 20, description: 'Protocolos de red y arquitectura TCP/IP.',
      periodId: 3, classroom: 'LAB-03' },
    { id: 5, name: 'Resistencia de Materiales', code: 'IC-301', credits: 5, careerId: 2,
      teacherId: 13, schedule: 'Lun-Mie 13:00-15:00', capacity: 35,
      enrolled: 30, description: 'Propiedades mecánicas de los materiales.',
      periodId: 3, classroom: 'A-201' },
    { id: 6, name: 'Diseño Arquitectónico I', code: 'ARQ-301', credits: 5, careerId: 3,
      teacherId: 12, schedule: 'Lun-Mie-Vie 14:00-16:00', capacity: 25,
      enrolled: 20, description: 'Fundamentos del diseño arquitectónico.',
      periodId: 3, classroom: 'TALLER-01' },
    { id: 7, name: 'Contabilidad General', code: 'ADE-301', credits: 4, careerId: 4,
      teacherId: 14, schedule: 'Mar-Jue 09:00-10:30', capacity: 35,
      enrolled: 32, description: 'Principios de contabilidad financiera.',
      periodId: 3, classroom: 'A-301' },
    { id: 8, name: 'Estructuras de Datos', code: 'IS-402', credits: 4, careerId: 1,
      teacherId: 15, schedule: 'Mar-Jue 15:00-16:30', capacity: 30,
      enrolled: 28, description: 'Implementación y análisis de estructuras de datos.',
      periodId: 3, classroom: 'LAB-02' },
    { id: 9, name: 'Urbanismo y Paisaje', code: 'ARQ-401', credits: 4, careerId: 3,
      teacherId: 12, schedule: 'Mar-Jue 10:00-11:30', capacity: 25,
      enrolled: 18, description: 'Planificación urbana y diseño de paisajes.',
      periodId: 3, classroom: 'A-202' },
    { id: 10, name: 'Matemáticas Discretas', code: 'IS-304', credits: 4, careerId: 1,
      teacherId: 15, schedule: 'Lun-Mie 10:00-11:30', capacity: 35,
      enrolled: 33, description: 'Lógica, conjuntos, grafos y combinatoria.',
      periodId: 3, classroom: 'A-102' }
  ],

  enrollments: [
    { studentId: 1, courseId: 1, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 1, courseId: 2, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 1, courseId: 3, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 1, courseId: 10, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 1, courseId: 4, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 2, courseId: 5, periodId: 3, status: 'activa', enrollmentDate: '2026-01-12', grade: null },
    { studentId: 3, courseId: 6, periodId: 3, status: 'activa', enrollmentDate: '2026-01-11', grade: null },
    { studentId: 3, courseId: 9, periodId: 3, status: 'activa', enrollmentDate: '2026-01-11', grade: null },
    { studentId: 4, courseId: 1, periodId: 3, status: 'activa', enrollmentDate: '2026-01-13', grade: null },
    { studentId: 4, courseId: 8, periodId: 3, status: 'activa', enrollmentDate: '2026-01-13', grade: null },
    { studentId: 4, courseId: 3, periodId: 3, status: 'activa', enrollmentDate: '2026-01-13', grade: null },
    { studentId: 5, courseId: 6, periodId: 3, status: 'activa', enrollmentDate: '2026-01-14', grade: null },
    { studentId: 6, courseId: 5, periodId: 3, status: 'activa', enrollmentDate: '2026-01-14', grade: null },
    { studentId: 7, courseId: 7, periodId: 3, status: 'activa', enrollmentDate: '2026-01-15', grade: null },
    { studentId: 8, courseId: 1, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 8, courseId: 8, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 8, courseId: 10, periodId: 3, status: 'activa', enrollmentDate: '2026-01-10', grade: null },
    { studentId: 9, courseId: 7, periodId: 3, status: 'activa', enrollmentDate: '2026-01-12', grade: null },
    { studentId: 10, courseId: 9, periodId: 3, status: 'activa', enrollmentDate: '2026-01-16', grade: null },
    { studentId: 3, courseId: 6, periodId: 2, status: 'completada', enrollmentDate: '2025-07-10', grade: 8.5 },
    { studentId: 1, courseId: 1, periodId: 2, status: 'completada', enrollmentDate: '2025-07-10', grade: 9.0 },
    { studentId: 1, courseId: 3, periodId: 2, status: 'completada', enrollmentDate: '2025-07-10', grade: 7.5 },
    { studentId: 1, courseId: 2, periodId: 2, status: 'completada', enrollmentDate: '2025-07-10', grade: 8.5 },
    { studentId: 4, courseId: 1, periodId: 2, status: 'completada', enrollmentDate: '2025-07-11', grade: 8.0 },
    { studentId: 7, courseId: 7, periodId: 2, status: 'completada', enrollmentDate: '2025-07-12', grade: 9.5 },
    { studentId: 3, courseId: 9, periodId: 2, status: 'completada', enrollmentDate: '2025-07-10', grade: 7.0 },
    { studentId: 5, courseId: 6, periodId: 2, status: 'completada', enrollmentDate: '2025-07-14', grade: 9.0 },
    { studentId: 8, courseId: 10, periodId: 2, status: 'completada', enrollmentDate: '2025-07-10', grade: 8.5 },
    { studentId: 9, courseId: 7, periodId: 2, status: 'completada', enrollmentDate: '2025-07-12', grade: 7.5 },
  ],

  grades: [
    { studentId: 1, courseId: 1, periodId: 2, parcial1: 8.5, parcial2: 9.0, proyectos: 9.5, final: 9.0 },
    { studentId: 1, courseId: 3, periodId: 2, parcial1: 7.0, parcial2: 7.5, proyectos: 8.0, final: 7.5 },
    { studentId: 1, courseId: 2, periodId: 2, parcial1: 8.0, parcial2: 8.5, proyectos: 9.0, final: 8.5 },
    { studentId: 4, courseId: 1, periodId: 2, parcial1: 7.5, parcial2: 8.0, proyectos: 8.5, final: 8.0 },
    { studentId: 7, courseId: 7, periodId: 2, parcial1: 9.0, parcial2: 9.5, proyectos: 10.0, final: 9.5 },
    { studentId: 3, courseId: 6, periodId: 2, parcial1: 8.0, parcial2: 8.5, proyectos: 9.0, final: 8.5 },
    { studentId: 3, courseId: 9, periodId: 2, parcial1: 6.5, parcial2: 7.0, proyectos: 7.5, final: 7.0 },
    { studentId: 5, courseId: 6, periodId: 2, parcial1: 8.5, parcial2: 9.0, proyectos: 9.5, final: 9.0 },
    { studentId: 8, courseId: 10, periodId: 2, parcial1: 8.0, parcial2: 8.5, proyectos: 9.0, final: 8.5 },
    { studentId: 9, courseId: 7, periodId: 2, parcial1: 7.5, parcial2: 7.0, proyectos: 8.0, final: 7.5 },
    { studentId: 1, courseId: 1, periodId: 3, parcial1: 9.0, parcial2: null, proyectos: null, final: null },
    { studentId: 1, courseId: 2, periodId: 3, parcial1: 8.5, parcial2: null, proyectos: null, final: null },
    { studentId: 1, courseId: 3, periodId: 3, parcial1: 7.0, parcial2: null, proyectos: null, final: null },
    { studentId: 1, courseId: 4, periodId: 3, parcial1: null, parcial2: null, proyectos: null, final: null },
    { studentId: 1, courseId: 10, periodId: 3, parcial1: 9.5, parcial2: null, proyectos: null, final: null },
    { studentId: 4, courseId: 1, periodId: 3, parcial1: 7.5, parcial2: null, proyectos: null, final: null },
    { studentId: 4, courseId: 3, periodId: 3, parcial1: 6.5, parcial2: null, proyectos: null, final: null },
    { studentId: 4, courseId: 8, periodId: 3, parcial1: 8.0, parcial2: null, proyectos: null, final: null },
    { studentId: 2, courseId: 5, periodId: 3, parcial1: 8.0, parcial2: null, proyectos: null, final: null },
    { studentId: 6, courseId: 5, periodId: 3, parcial1: 7.0, parcial2: null, proyectos: null, final: null },
    { studentId: 3, courseId: 6, periodId: 3, parcial1: 8.5, parcial2: null, proyectos: null, final: null },
    { studentId: 3, courseId: 9, periodId: 3, parcial1: 9.0, parcial2: null, proyectos: null, final: null },
    { studentId: 7, courseId: 7, periodId: 3, parcial1: 8.0, parcial2: null, proyectos: null, final: null },
    { studentId: 9, courseId: 7, periodId: 3, parcial1: 7.5, parcial2: null, proyectos: null, final: null },
    { studentId: 8, courseId: 1, periodId: 3, parcial1: 6.0, parcial2: null, proyectos: null, final: null },
    { studentId: 8, courseId: 8, periodId: 3, parcial1: 7.0, parcial2: null, proyectos: null, final: null },
    { studentId: 8, courseId: 10, periodId: 3, parcial1: 8.5, parcial2: null, proyectos: null, final: null },
    { studentId: 5, courseId: 6, periodId: 3, parcial1: null, parcial2: null, proyectos: null, final: null },
    { studentId: 10, courseId: 9, periodId: 3, parcial1: 7.0, parcial2: null, proyectos: null, final: null },
  ],

  payments: [
    { id: 1, studentId: 1, concept: 'Matrícula 2026-1', amount: 250.00, date: '2026-01-05', status: 'pagado', receipt: 'REC-2026-001' },
    { id: 2, studentId: 1, concept: 'Curso Programación I', amount: 120.00, date: '2026-01-10', status: 'pagado', receipt: 'REC-2026-002' },
    { id: 3, studentId: 1, concept: 'Curso Bases de Datos I', amount: 120.00, date: '2026-01-10', status: 'pagado', receipt: 'REC-2026-003' },
    { id: 4, studentId: 1, concept: 'Curso Cálculo I', amount: 120.00, date: '2026-01-10', status: 'pagado', receipt: 'REC-2026-004' },
    { id: 5, studentId: 1, concept: 'Curso Matemáticas Discretas', amount: 120.00, date: '2026-01-10', status: 'pagado', receipt: 'REC-2026-005' },
    { id: 6, studentId: 1, concept: 'Curso Redes de Computadoras', amount: 120.00, date: null, status: 'pendiente', receipt: null },
    { id: 7, studentId: 2, concept: 'Matrícula 2026-1', amount: 250.00, date: '2026-01-08', status: 'pagado', receipt: 'REC-2026-006' },
    { id: 8, studentId: 2, concept: 'Curso Resistencia de Materiales', amount: 120.00, date: '2026-01-08', status: 'pagado', receipt: 'REC-2026-007' },
    { id: 9, studentId: 3, concept: 'Matrícula 2026-1', amount: 250.00, date: '2026-01-07', status: 'pagado', receipt: 'REC-2026-008' },
    { id: 10, studentId: 3, concept: 'Curso Diseño Arquitectónico I', amount: 120.00, date: '2026-01-07', status: 'pagado', receipt: 'REC-2026-009' },
    { id: 11, studentId: 3, concept: 'Curso Urbanismo y Paisaje', amount: 120.00, date: null, status: 'pendiente', receipt: null },
    { id: 12, studentId: 4, concept: 'Matrícula 2026-1', amount: 250.00, date: null, status: 'pendiente', receipt: null },
    { id: 13, studentId: 4, concept: 'Curso Programación I', amount: 120.00, date: null, status: 'pendiente', receipt: null },
    { id: 14, studentId: 4, concept: 'Curso Estructuras de Datos', amount: 120.00, date: null, status: 'pendiente', receipt: null },
    { id: 15, studentId: 4, concept: 'Curso Cálculo I', amount: 120.00, date: null, status: 'pendiente', receipt: null },
    { id: 16, studentId: 7, concept: 'Matrícula 2026-1', amount: 250.00, date: '2026-01-12', status: 'pagado', receipt: 'REC-2026-010' },
    { id: 17, studentId: 7, concept: 'Curso Contabilidad General', amount: 120.00, date: '2026-01-12', status: 'pagado', receipt: 'REC-2026-011' },
    { id: 18, studentId: 5, concept: 'Matrícula 2026-1', amount: 250.00, date: null, status: 'pendiente', receipt: null },
    { id: 19, studentId: 8, concept: 'Matrícula 2026-1', amount: 250.00, date: '2026-01-06', status: 'pagado', receipt: 'REC-2026-012' },
    { id: 20, studentId: 8, concept: 'Curso Programación I', amount: 120.00, date: '2026-01-06', status: 'pagado', receipt: 'REC-2026-013' },
    { id: 21, studentId: 8, concept: 'Curso Estructuras de Datos', amount: 120.00, date: '2026-01-06', status: 'pagado', receipt: 'REC-2026-014' },
    { id: 22, studentId: 8, concept: 'Curso Matemáticas Discretas', amount: 120.00, date: '2026-01-06', status: 'pagado', receipt: 'REC-2026-015' },
    { id: 23, studentId: 9, concept: 'Matrícula 2026-1', amount: 250.00, date: null, status: 'pendiente', receipt: null },
    { id: 24, studentId: 10, concept: 'Matrícula 2026-1', amount: 250.00, date: '2026-01-14', status: 'pagado', receipt: 'REC-2026-016' },
    { id: 25, studentId: 6, concept: 'Matrícula 2026-1', amount: 250.00, date: null, status: 'pendiente', receipt: null },
  ],

  attendance: [
    { courseId: 1, date: '2026-02-03', records: [
      { studentId: 1, status: 'presente' }, { studentId: 4, status: 'presente' }, { studentId: 8, status: 'ausente' }
    ]},
    { courseId: 1, date: '2026-02-05', records: [
      { studentId: 1, status: 'presente' }, { studentId: 4, status: 'justificado' }, { studentId: 8, status: 'presente' }
    ]},
    { courseId: 1, date: '2026-02-10', records: [
      { studentId: 1, status: 'presente' }, { studentId: 4, status: 'presente' }, { studentId: 8, status: 'presente' }
    ]},
  ]
};

export const getStudentEnrollments = (studentId: number, periodId: number): Enrollment[] => {
  return mockData.enrollments.filter(e => e.studentId === studentId && e.periodId === periodId && e.status === 'activa');
};

export const getEnrolledCourseIds = (studentId: number, periodId: number): number[] => {
  return mockData.enrollments
    .filter(e => e.studentId === studentId && e.periodId === periodId && e.status === 'activa')
    .map(e => e.courseId);
};

export const getStudentPayments = (studentId: number) => {
  return mockData.payments.filter(p => p.studentId === studentId);
};

export const getStudentGrades = (studentId: number, periodId: number) => {
  return mockData.grades.filter(g => g.studentId === studentId && g.periodId === periodId);
};

export const getTeacherCourses = (teacherId: number, periodId: number) => {
  return mockData.courses.filter(c => c.teacherId === teacherId && c.periodId === periodId);
};

export const getCourseStudents = (courseId: number) => {
  const enrollments = mockData.enrollments.filter(e => e.courseId === courseId && e.status === 'activa');
  return enrollments.map(e => {
    const student = mockData.users.find(u => u.id === e.studentId);
    return { ...student, enrollment: e } as User & { enrollment: Enrollment };
  });
};

export const getTeacherById = (id: number) => mockData.users.find(u => u.id === id);
export const getCourseById = (id: number) => mockData.courses.find(c => c.id === id);
export const getCareerById = (id: number) => mockData.careers.find(c => c.id === id);
export const getStudentById = (id: number) => mockData.users.find(u => u.id === id && u.role === 'estudiante');

export default mockData;
