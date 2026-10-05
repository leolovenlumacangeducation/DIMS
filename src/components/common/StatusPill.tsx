import React from 'react';
import {
  Clock,
  Truck,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  CalendarX
} from 'lucide-react';
import { STATUS, TransactionStatus } from '../../types';

interface StatusPillProps {
  status: TransactionStatus;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const styles: Record<TransactionStatus, string> = {
    [STATUS.PENDING_PO]: 'bg-blue-50/90 text-blue-700 border-blue-200',
    [STATUS.PENDING_DELIVERY]: 'bg-blue-50/90 text-blue-700 border-blue-200',
    [STATUS.DELIVERY_RECEIVED]: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    [STATUS.FOR_INSPECTION]: 'bg-amber-50 text-amber-700 border-amber-200',
    [STATUS.PARTIALLY_ACCEPTED]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [STATUS.AWAITING_COMPLETION]: 'bg-orange-50 text-orange-700 border-orange-200',
    [STATUS.DELIVERY_OVERDUE]: 'bg-rose-50 text-rose-700 border-rose-200',
    [STATUS.COMPLETED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const icons: Record<TransactionStatus, React.ReactNode> = {
    [STATUS.PENDING_PO]: <Clock size={11} className="text-blue-500" />,
    [STATUS.PENDING_DELIVERY]: <Truck size={11} className="text-blue-500" />,
    [STATUS.DELIVERY_RECEIVED]: <Truck size={11} className="text-cyan-600" />,
    [STATUS.FOR_INSPECTION]: <AlertCircle size={11} className="text-amber-500" />,
    [STATUS.PARTIALLY_ACCEPTED]: <AlertTriangle size={11} className="text-indigo-500" />,
    [STATUS.AWAITING_COMPLETION]: <RotateCcw size={11} className="text-orange-500" />,
    [STATUS.DELIVERY_OVERDUE]: <CalendarX size={11} className="text-rose-500" />,
    [STATUS.COMPLETED]: <CheckCircle size={11} className="text-emerald-500" />,
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border inline-flex items-center gap-1.5 ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {icons[status] || <Clock size={11} />} {status}
    </span>
  );
};
