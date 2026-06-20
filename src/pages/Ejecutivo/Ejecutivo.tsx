import { useState } from 'react';
import mockData from '../../data/mockData';
import { TrendingUp, Award, DollarSign, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import type { User } from '../../types';

const COLORS = ['#111844', '#4B5694', '#7288AE', '#2d7d46', '#a6701e', '#b91c1c'];

interface IncomeEntry {
  name: string;
  amount: number;
}

interface PeriodIncome {
  name: string;
  ingresos: number;
}

interface CareerCount {
  name: string;
  count: number;
}

interface PassRateEntry {
  name: string;
  'Tasa Aprobación': number | string;
}

export default function Ejecutivo() {
  const [periodFilter, setPeriodFilter] = useState(mockData.periods.find(p => p.active)?.id || 3);
  const [careerFilter, setCareerFilter] = useState('todas');

  const students = mockData.users.filter(u => u.role === 'estudiante') as User[];
  const selectedPeriod = mockData.periods.find(p => p.id === periodFilter);

  const filteredStudents = careerFilter === 'todas'
    ? students
    : students.filter(s => s.career === careerFilter);

  const getPeriodEnrollments = (periodId: number) => {
    return mockData.enrollments.filter(e => e.periodId === periodId);
  };

  const selectedEnrollments = getPeriodEnrollments(periodFilter);
  const selectedCompletadas = selectedEnrollments.filter(e => e.status === 'completada');
  const passed = selectedCompletadas.filter(e => e.grade! >= 6).length;
  const passRate = selectedCompletadas.length > 0 ? ((passed / selectedCompletadas.length) * 100).toFixed(1) : '0';
  const dropout = selectedCompletadas.filter(e => e.grade! < 6).length;
  const avgGeneral = selectedCompletadas.length > 0
    ? (selectedCompletadas.reduce((s, e) => s + (e.grade || 0), 0) / selectedCompletadas.length).toFixed(1)
    : '0';

  const allPayments = mockData.payments;
  const periodPayments = allPayments.filter(p => {
    const enrollment = mockData.enrollments.find(e => e.studentId === p.studentId && e.periodId === periodFilter);
    return enrollment || p.id % 3 === periodFilter % 3;
  });
  const totalPaid = periodPayments.filter(p => p.status === 'pagado').reduce((s, p) => s + p.amount, 0);
  const totalPendingAmt = periodPayments.filter(p => p.status === 'pendiente').reduce((s, p) => s + p.amount, 0);
  const morosidad = totalPaid + totalPendingAmt > 0 ? ((totalPendingAmt / (totalPaid + totalPendingAmt)) * 100).toFixed(1) : '0';

  const incomeByConcept: IncomeEntry[] = [
    { name: 'Matrícula', amount: periodPayments.filter(p => p.concept.includes('Matrícula') && p.status === 'pagado').reduce((s, p) => s + p.amount, 0) },
    { name: 'Cursos', amount: periodPayments.filter(p => !p.concept.includes('Matrícula') && p.status === 'pagado').reduce((s, p) => s + p.amount, 0) },
  ];

  const incomeByPeriod: PeriodIncome[] = mockData.periods.map(p => ({
    name: p.name,
    ingresos: mockData.payments.filter(pay => {
      const enrollment = mockData.enrollments.find(e => e.studentId === pay.studentId && e.periodId === p.id);
      return (enrollment || pay.id % 3 === p.id % 3) && pay.status === 'pagado';
    }).reduce((s, pay) => s + pay.amount, 0),
  }));

  const studentsByCareer: CareerCount[] = mockData.careers.map(c => ({
    name: c.name.split(' ').slice(0, 2).join(' '),
    count: mockData.users.filter(u => u.role === 'estudiante' && u.career === c.name).length,
  }));

  const passRateByCareer: PassRateEntry[] = mockData.careers.map(c => {
    const careerEnrollments = selectedCompletadas.filter(e => {
      const student = mockData.users.find(u => u.id === e.studentId);
      return student?.career === c.name;
    });
    const passedCount = careerEnrollments.filter(e => typeof e.grade === 'number' && e.grade >= 6).length;
    return {
      name: c.name.split(' ').slice(0, 2).join(' '),
      'Tasa Aprobación': careerEnrollments.length > 0 ? Number(((passedCount / careerEnrollments.length) * 100).toFixed(1)) : 0,
    };
  });

  return (
    <div>
      <div className="card-body mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <label htmlFor="period-filter" className="font-medium text-primary text-xs">Período:</label>
            <select id="period-filter" value={periodFilter} onChange={e => setPeriodFilter(Number(e.target.value))} className="w-auto">
              {mockData.periods.map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.active ? '(Activo)' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="career-filter" className="font-medium text-primary text-xs">Carrera:</label>
            <select id="career-filter" value={careerFilter} onChange={e => setCareerFilter(e.target.value)} className="w-auto">
              <option value="todas">Todas las carreras</option>
              {mockData.careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6" role="list" aria-label="Indicadores ejecutivos">
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-primary text-white"><Users size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{filteredStudents.length}</div>
            <div className="text-xs text-text-secondary mt-0.5">Estudiantes Activos</div>
          </div>
        </div>
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-success text-white"><DollarSign size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">${totalPaid.toFixed(2)}</div>
            <div className="text-xs text-text-secondary mt-0.5">Ingresos ({selectedPeriod?.name})</div>
          </div>
        </div>
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-info text-white"><Award size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{passRate}%</div>
            <div className="text-xs text-text-secondary mt-0.5">Tasa de Aprobación</div>
          </div>
        </div>
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-warning text-white"><TrendingUp size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{avgGeneral}</div>
            <div className="text-xs text-text-secondary mt-0.5">Promedio General</div>
          </div>
        </div>
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-danger text-white"><DollarSign size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{morosidad}%</div>
            <div className="text-xs text-text-secondary mt-0.5">Morosidad</div>
          </div>
        </div>
        <div className="card-stat" role="listitem">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: '#e91e63' }}><TrendingUp size={20} aria-hidden="true" /></div>
          <div>
            <div className="text-2xl font-bold leading-tight text-primary">{dropout}</div>
            <div className="text-xs text-text-secondary mt-0.5">Reprobados</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="card-body">
          <h3 className="text-sm font-semibold mb-3 text-primary">Ingresos por Período</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incomeByPeriod}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12} tick={{ fill: '#7C7F96' }} />
              <YAxis fontSize={12} tick={{ fill: '#7C7F96' }} />
              <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: '1px solid #d0d6e4', fontSize: '13px' }} />
              <Bar dataKey="ingresos" fill="#111844" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-body">
          <h3 className="text-sm font-semibold mb-3 text-primary">Ingresos por Concepto ({selectedPeriod?.name})</h3>
          <div className="flex items-center justify-center" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={incomeByConcept} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {incomeByConcept.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: '1px solid #d0d6e4', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-body">
          <h3 className="text-sm font-semibold mb-3 text-primary">Estudiantes por Carrera</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={studentsByCareer} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" fontSize={12} tick={{ fill: '#7C7F96' }} />
              <YAxis dataKey="name" type="category" width={120} fontSize={11} tick={{ fill: '#7C7F96' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #d0d6e4', fontSize: '13px' }} />
              <Bar dataKey="count" fill="#4B5694" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-body">
          <h3 className="text-sm font-semibold mb-3 text-primary">Tasa de Aprobación por Carrera ({selectedPeriod?.name})</h3>
          {passRateByCareer.some(c => Number(c['Tasa Aprobación']) > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={passRateByCareer}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={11} angle={-20} textAnchor="end" tick={{ fill: '#7C7F96' }} />
                <YAxis domain={[0, 100]} fontSize={12} unit="%" tick={{ fill: '#7C7F96' }} />
                <Tooltip formatter={(v) => `${Number(v)}%`} contentStyle={{ borderRadius: '8px', border: '1px solid #d0d6e4', fontSize: '13px' }} />
                <Bar dataKey="Tasa Aprobación" fill="#7288AE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-text-secondary flex flex-col items-center justify-center" style={{ height: 280 }}>
              <h4 className="text-sm text-primary mb-1">Sin datos</h4>
              <p className="text-xs">No hay calificaciones completadas para este período.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className="text-sm font-semibold mb-3 text-primary">Proyección de Ingresos</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={incomeByPeriod}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} tick={{ fill: '#7C7F96' }} />
            <YAxis fontSize={12} tick={{ fill: '#7C7F96' }} />
            <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: '1px solid #d0d6e4', fontSize: '13px' }} />
            <Line type="monotone" dataKey="ingresos" stroke="#111844" strokeWidth={2.5} dot={{ r: 4, fill: '#111844' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}