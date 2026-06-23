import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import mockData, { getStudentEnrollments } from '../../data/mockData';
import type { Course, DayOfWeek, ScheduleEvent } from '../../types';
import { X, MapPin, User, Clock } from 'lucide-react';

const COLORS = ['bg-primary text-white', 'bg-success text-white', 'bg-warning text-white', 'bg-info text-white', 'bg-secondary text-white', 'bg-info text-white'] as const;
const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HOURS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const DAY_MAP: Record<string, DayOfWeek> = { Lun: 'Lunes', Mar: 'Martes', Mie: 'Miércoles', Jue: 'Jueves', Vie: 'Viernes' };

function parseSchedule(schedule: string): DayOfWeek[] {
  if (!schedule) return [];
  const parts = schedule.split(' ');
  if (parts.length < 3) return [];
  const daysPart = parts[0] as string;
  const days: DayOfWeek[] = [];
  if (daysPart.includes('Lun')) days.push('Lunes');
  if (daysPart.includes('Mar')) days.push('Martes');
  if (daysPart.includes('Mie')) days.push('Miércoles');
  if (daysPart.includes('Jue')) days.push('Jueves');
  if (daysPart.includes('Vie')) days.push('Viernes');
  if (daysPart.includes('-')) {
    const d = daysPart.split('-');
    return d.map(day => DAY_MAP[day]).filter(Boolean) as DayOfWeek[];
  }
  return days;
}

function getHourIndex(time: string): number {
  if (!time) return 0;
  const parts = time.split(':');
  return Math.max(0, parseInt(parts[0] as string, 10) - 7);
}

export default function Horarios() {
  const { user } = useAuth();
  if (!user) return null;
  const currentPeriod = mockData.periods.find(p => p.active);
  const enrollments = getStudentEnrollments(user.id, currentPeriod?.id ?? 0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const currentHourIdx = Math.max(0, Math.min(HOURS.length - 1, Math.floor(currentHour - 7)));

  const todayIdx = now.getDay();
  const todayName = (['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])[todayIdx] as DayOfWeek | undefined;

  const scheduleCells: Record<string, Record<number, ScheduleEvent>> = {};
  DAYS.forEach(d => { scheduleCells[d] = {}; });

  enrollments.forEach((e, idx) => {
    const course: Course | undefined = mockData.courses.find(c => c.id === e.courseId);
    if (!course) return;
    const days = parseSchedule(course.schedule);
    const timeParts = course.schedule?.split(' ');
    const [startStr, endStr] = timeParts?.length >= 3 ? (timeParts[2] as string).split('-') : ['07:00', '08:30'];
    const startIdx = getHourIndex(startStr ?? '07:00');
    const endIdx = getHourIndex(endStr ?? '08:30') || startIdx + 1;
    const color = COLORS[idx % COLORS.length] as string;
    days.forEach(day => {
      const row = scheduleCells[day];
      if (row) row[startIdx] = { course, startIdx, endIdx, color, day };
    });
  });

  const selectedTeacher = selectedCourse
    ? mockData.users.find(u => u.id === selectedCourse.teacherId)
    : null;

  return (
    <div>
      <div className="card-body mb-4">
        <h2 className="text-lg font-semibold text-primary">Horario Semanal - {currentPeriod?.name}</h2>
      </div>

      {selectedCourse && (
        <div className="card-body mb-4 border-l-4 border-l-primary">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-primary">{selectedCourse.name}</div>
              <div className="font-mono text-[11px] text-text-secondary mt-0.5">{selectedCourse.code}</div>
              <div className="text-xs text-text-secondary mt-2 space-y-0.5">
                <div className="flex items-center gap-1"><Clock size={12} aria-hidden="true" /> {selectedCourse.schedule}</div>
                <div className="flex items-center gap-1"><MapPin size={12} aria-hidden="true" /> {selectedCourse.classroom}</div>
                <div className="flex items-center gap-1"><User size={12} aria-hidden="true" /> {selectedTeacher?.name}</div>
              </div>
            </div>
            <button onClick={() => setSelectedCourse(null)} className="p-1 rounded hover:bg-bg text-text-secondary transition-colors" aria-label="Cerrar detalle">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="card p-3">
        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm" role="grid" aria-label="Horario semanal de clases">
              <thead>
                <tr>
                  <th scope="col" className="bg-bg p-2.5 text-center font-semibold text-xs text-primary border border-border rounded-tl-lg">Hora</th>
                  {DAYS.map(d => (
                    <th key={d} scope="col" className={`bg-bg p-2.5 text-center font-semibold text-xs border border-border ${d === todayName ? 'text-primary' : 'text-primary'}`}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hour, hourIdx) => (
                  <tr key={hour} className={hourIdx === currentHourIdx && todayName && DAYS.includes(todayName) ? 'bg-primary-light/30' : ''}>
                    <th scope="row" className={`p-2 text-xs text-center border border-border font-mono font-normal ${hourIdx === currentHourIdx && todayName && DAYS.includes(todayName) ? 'text-primary font-bold' : 'text-text-secondary bg-white/50'}`}>
                      {hour}
                      {hourIdx === currentHourIdx && todayName && DAYS.includes(todayName) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-danger mx-auto mt-0.5" />
                      )}
                    </th>
                    {DAYS.map(day => {
                      const event = scheduleCells[day]?.[hourIdx];
                      const isNow = day === todayName && hourIdx === currentHourIdx;
                      return (
                        <td key={`${day}-${hourIdx}`} className={`min-h-[56px] p-1 border border-border align-top bg-white ${isNow ? 'ring-2 ring-danger/20 ring-inset' : ''}`}>
                          {event && (
                            <button
                              onClick={() => setSelectedCourse(event.course)}
                              className={`w-full text-left p-1.5 rounded text-[0.7rem] font-medium ${event.color} ${selectedCourse?.id === event.course.id ? 'ring-2 ring-white/60' : ''}`}
                            >
                              <div className="font-semibold truncate">{event.course.name}</div>
                              <div className="text-[0.6rem] opacity-80 truncate">{event.course.code} &middot; {event.course.classroom}</div>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 text-text-secondary">
            <CalendarIcon size={40} aria-hidden="true" />
            <h4 className="text-base mb-1 text-primary">Sin horarios disponibles</h4>
            <p className="text-sm">No tienes cursos matriculados para mostrar en el horario.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarIcon({ size, ...props }: { size: number; [key: string]: unknown }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} className="mx-auto mb-3 opacity-50">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}