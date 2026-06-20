export type UserRole = 'estudiante' | 'docente' | 'administrativo' | 'directivo';

export interface BaseUser {
  id: number;
  name: string;
  email: string;
  password: string;
  photo: string | null;
  phone: string;
}

export interface Student extends BaseUser {
  role: 'estudiante';
  career: string;
  semester: number;
}

export interface Teacher extends BaseUser {
  role: 'docente';
  career: string;
  semester: null;
  specialization: string;
}

export interface Admin extends BaseUser {
  role: 'administrativo';
  career: null;
  semester: null;
  position: string;
}

export interface Executive extends BaseUser {
  role: 'directivo';
  career: null;
  semester: null;
  position: string;
}

export type User = Student | Teacher | Admin | Executive;

export interface Career {
  id: number;
  name: string;
  code: string;
  duration: number;
}

export interface Period {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  careerId: number;
  teacherId: number;
  schedule: string;
  capacity: number;
  enrolled: number;
  description: string;
  periodId: number;
  classroom: string;
}

export type EnrollmentStatus = 'activa' | 'completada';

export interface Enrollment {
  studentId: number;
  courseId: number;
  periodId: number;
  status: EnrollmentStatus;
  enrollmentDate: string;
  grade: number | null;
}

export interface Grade {
  studentId: number;
  courseId: number;
  periodId: number;
  parcial1: number | null;
  parcial2: number | null;
  proyectos: number | null;
  final: number | null;
}

export type PaymentStatus = 'pagado' | 'pendiente';

export interface Payment {
  id: number;
  studentId: number;
  concept: string;
  amount: number;
  date: string | null;
  status: PaymentStatus;
  receipt: string | null;
}

export type AttendanceStatus = 'presente' | 'ausente' | 'justificado';

export interface AttendanceRecord {
  courseId: number;
  date: string;
  records: Array<{ studentId: number; status: AttendanceStatus }>;
}

export interface MockData {
  users: User[];
  careers: Career[];
  periods: Period[];
  courses: Course[];
  enrollments: Enrollment[];
  grades: Grade[];
  payments: Payment[];
  attendance: AttendanceRecord[];
}

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
  hasAccess: (...roles: UserRole[]) => boolean;
}

export interface Toast {
  msg: string;
  type: 'success' | 'info' | 'error';
}

export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

export interface ScheduleEvent {
  course: Course;
  startIdx: number;
  endIdx: number;
  color: string;
  day: DayOfWeek;
}

export interface GradeFormEntry {
  parcial1: number | '';
  parcial2: number | '';
  proyecto: number | '';
  final: number | '';
}

export type GradesState = Record<number, GradeFormEntry>;
export type AttendanceState = Record<number, AttendanceStatus>;

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}
