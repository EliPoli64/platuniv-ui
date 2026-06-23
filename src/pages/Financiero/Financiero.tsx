import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentPayments } from '../../data/mockData';
import { DollarSign, CheckCircle, AlertCircle, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { Toast, Payment } from '../../types';

export default function Financiero() {
  const { user } = useAuth();
  if (!user) return null;
  const [showReceipt, setShowReceipt] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const payments = getStudentPayments(user.id);
  const pendingPayments = payments.filter(p => p.status === 'pendiente');
  const paidPayments = payments.filter(p => p.status === 'pagado');
  const totalPaid = paidPayments.reduce((s, p) => s + p.amount, 0);
  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePay = (_paymentId: number) => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      showToast('Pago procesado exitosamente. Recibo generado.');
    }, 1000);
  };

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-[2000] px-5 py-3 rounded text-sm flex items-center gap-2 shadow-card-lg max-w-[400px] animate-slideIn ${toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`} role="alert">
          {toast.type === 'success' ? <CheckCircle size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
          {toast.msg}
        </div>
      )}

      <div className="card-body mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-primary">Financiero</h2>
          <div className="flex items-center gap-3 text-xs">
            <span>
              <span className="text-text-secondary">Pendiente: </span>
              <span className="font-bold font-mono text-warning">${totalPending.toFixed(2)}</span>
            </span>
            <span className="text-border">&middot;</span>
            <span>
              <span className="text-text-secondary">Pagado: </span>
              <span className="font-bold font-mono text-success">${totalPaid.toFixed(2)}</span>
            </span>
            <span className="text-border">&middot;</span>
            <span className="font-mono text-xs text-text-secondary">{payments.length} transacciones</span>
            {totalPending > 0 ? (
              <span className="tag-warning">{pendingPayments.length} pendiente(s)</span>
            ) : (
              <span className="tag-success">Al día</span>
            )}
          </div>
        </div>
      </div>

      {pendingPayments.length > 0 && (
        <div className="card-body mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Pagos Pendientes</h3>
          </div>
          <div className="overflow-x-auto rounded border border-border">
            <table aria-label="Pagos pendientes">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium">{p.concept}</td>
                    <td className="font-semibold text-warning font-mono">${p.amount.toFixed(2)}</td>
                    <td className="text-text-secondary">Próximamente</td>
                    <td><span className="tag-warning">Pendiente</span></td>
                    <td>
                      <Button variant="success" onClick={() => handlePay(p.id)} disabled={paying}>
                        {paying ? 'Procesando...' : 'Pagar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Historial de Pagos</h3>
        </div>
        {paidPayments.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded border border-border">
              <table aria-label="Historial de pagos">
                <thead>
                  <tr>
                    <th>Recibo</th>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {paidPayments.map(p => (
                    <tr key={p.id}>
                      <td className="font-mono text-xs">{p.receipt}</td>
                      <td>{p.concept}</td>
                      <td className="font-semibold font-mono">${p.amount.toFixed(2)}</td>
                      <td className="text-text-secondary">{p.date}</td>
                      <td><span className="tag-success">Pagado</span></td>
                      <td>
                        <Button variant="outline" icon={Download} onClick={() => setShowReceipt(showReceipt === p.id ? null : p.id)}>
                          Recibo
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showReceipt && paidPayments.find(p => p.id === showReceipt) && (() => {
              const p = paidPayments.find(p => p.id === showReceipt) as Payment;
              return (
                <div className="bg-white border-2 border-dashed border-border rounded p-6 mt-4" id={`receipt-${p.id}`}>
                  <div className="text-center mb-4">
                    <h4 className="font-display text-lg text-primary">LA MEJOR</h4>
                    <p className="text-xs text-text-secondary mt-1">Recibo de Pago</p>
                    <h4 className="text-sm font-semibold text-primary mt-2">{p.receipt}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-border"><span className="text-text-secondary">Fecha de emisión:</span><span>{p.date}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-border"><span className="text-text-secondary">Estudiante:</span><span className="font-medium">{user.name}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-border"><span className="text-text-secondary">Carrera:</span><span>{'career' in user ? user.career : '-'}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-border"><span className="text-text-secondary">Concepto:</span><span>{p.concept}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-border"><span className="text-text-secondary">Método de pago:</span><span>Tarjeta de Crédito/Débito</span></div>
                    <div className="flex justify-between py-2 text-base font-bold">
                      <span>Total pagado:</span>
                      <span className="text-success">${p.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          <div className="text-center py-12 px-4 text-text-secondary">
            <DollarSign size={40} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
            <h4 className="text-base mb-1 text-primary">Sin pagos registrados</h4>
            <p className="text-sm">Aún no hay pagos registrados en tu cuenta.</p>
          </div>
        )}
      </div>
    </div>
  );
}