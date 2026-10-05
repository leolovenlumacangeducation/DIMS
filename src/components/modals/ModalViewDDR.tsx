import React from 'react';
import {
  AlertTriangle,
  Printer,
  FileText,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  Transaction,
  SchoolProfile,
  Personnel,
  Supplier,
  DeliveryDiscrepancyRecord,
  DiscrepancyType
} from '../../types';

interface ModalViewDDRProps {
  txn: Transaction;
  schoolProfile: SchoolProfile;
  personnelList: Personnel[];
  supplierList: Supplier[];
  onOpenSupplierNotice: () => void;
  onClose: () => void;
}

export const ModalViewDDR: React.FC<ModalViewDDRProps> = ({
  txn,
  schoolProfile,
  personnelList,
  supplierList,
  onOpenSupplierNotice,
  onClose
}) => {
  // Find current or latest discrepancy record
  const latestBatch = [...(txn.deliveries || [])].reverse()[0];
  const ddr: DeliveryDiscrepancyRecord =
    latestBatch?.discrepancyRecord || {
      id: 'DDR-2026-00015',
      poNo: txn.po?.no || 'PO-2026-00125',
      deliveryBatchNo: latestBatch?.batchNo || 1,
      drInvoiceNo: txn.dr?.invoiceNo || 'INV-2026-8841',
      types: ['Short Delivery', 'Defective Item'],
      totalOrdered: txn.po_items?.reduce((s, i) => s + i.qty, 0) || 20,
      totalDelivered: 15,
      totalAccepted: 14,
      totalRejected: 1,
      totalUndelivered: 5,
      totalOutstanding: 6,
      inspectorFindings:
        'Inspected delivered items against contract specifications. Defective display noted on 1 unit; 5 units short of delivery order quantity.',
      supplierNoticeDate: '2026-10-13',
      supplierNoticeStatus: 'Notice Served'
    };

  const supplier = supplierList.find(s => s.id === txn.po?.supplierId);
  const allDiscrepancyOptions: DiscrepancyType[] = [
    'Short Delivery',
    'Defective Item',
    'Wrong Specification',
    'Damaged Item',
    'Missing Component',
    'Wrong Delivery Location'
  ];

  return (
    <div className="space-y-4 text-xs font-sans w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
              <AlertTriangle size={16} />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Delivery Discrepancy & Exception Record (DDR)
            </h2>
            <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              {ddr.id}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Internal DepEd Supply Control & Exception Document • DepEd Order No. 41, s. 2021
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium text-xs cursor-pointer shadow-2xs"
          >
            <Printer size={13} /> Print DDR Record
          </button>
          <button
            onClick={onOpenSupplierNotice}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-md font-bold text-xs cursor-pointer shadow-xs"
          >
            <Send size={13} /> View Supplier Deficiency Notice <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Main Document Body */}
      <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4 text-slate-800 shadow-2xs">
        {/* Letterhead summary */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-3 text-[11px]">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Department of Education • Division Office</div>
            <div className="font-bold text-slate-900 text-xs">{schoolProfile.schoolName}</div>
            <div className="text-slate-500">{schoolProfile.address} • School ID: {schoolProfile.schoolId}</div>
          </div>
          <div className="text-right space-y-0.5 font-mono text-[11px]">
            <div><span className="text-slate-500 font-sans">Reference PO:</span> <strong>{ddr.poNo}</strong></div>
            <div><span className="text-slate-500 font-sans">DR / Invoice No.:</span> <strong>{ddr.drInvoiceNo}</strong></div>
            <div><span className="text-slate-500 font-sans">Delivery Batch:</span> <strong>Batch #{ddr.deliveryBatchNo}</strong></div>
          </div>
        </div>

        {/* Discrepancy Type Classification Checklist */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
            Discrepancy Classification (Physical & Specification Audit)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {allDiscrepancyOptions.map((type, idx) => {
              const isChecked = ddr.types.includes(type);
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    isChecked
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                      : 'bg-slate-50/60 border-slate-200 text-slate-400'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                      isChecked ? 'bg-rose-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </span>
                  <span>{type}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantities Comparison Breakdown */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 p-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
            Quantity Reconciliation Matrix
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2.5 text-center">PO Quantity</th>
                <th className="p-2.5 text-center">Physically Delivered</th>
                <th className="p-2.5 text-center text-emerald-800 bg-emerald-50">Accepted (Compliant)</th>
                <th className="p-2.5 text-center text-rose-800 bg-rose-50">Rejected (Defective)</th>
                <th className="p-2.5 text-center text-amber-800 bg-amber-50">Undelivered</th>
                <th className="p-2.5 text-center text-purple-900 bg-purple-50">Total Outstanding</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-mono text-center font-bold text-sm divide-x divide-slate-100">
                <td className="p-3 text-slate-900">{ddr.totalOrdered}</td>
                <td className="p-3 text-blue-900">{ddr.totalDelivered}</td>
                <td className="p-3 text-emerald-700 bg-emerald-50/50">{ddr.totalAccepted}</td>
                <td className="p-3 text-rose-700 bg-rose-50/50">{ddr.totalRejected}</td>
                <td className="p-3 text-amber-700 bg-amber-50/50">{ddr.totalUndelivered}</td>
                <td className="p-3 text-purple-800 bg-purple-50/50">{ddr.totalOutstanding}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Findings & Evidence Notes */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase">
            Inspectorate Findings & Technical Discrepancy Evidence
          </label>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
            {ddr.inspectorFindings}
          </div>
        </div>

        {/* Attached Verification Records Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-700 block text-[11px] uppercase">
              Attached Evidentiary Documents
            </span>
            <ul className="text-slate-600 space-y-1 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" /> Supplier Delivery Receipt / Sales Invoice ({ddr.drInvoiceNo})
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" /> Inspection & Acceptance Report ({txn.iar?.no || 'IAR Draft'})
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" /> Physical Defect Test Photos & Serial Number Logs
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-700 block text-[11px] uppercase">
              Administrative & Supplier Notice Status
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Notice Served Date:</span>
                <span className="font-mono font-semibold">{ddr.supplierNoticeDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Notice Status:</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                  {ddr.supplierNoticeStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cure Period:</span>
                <span className="font-semibold text-rose-800">7 Calendar Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* DepEd Custody and Accounting Warning */}
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px] flex items-start gap-2">
          <ShieldAlert size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>DepEd Accounting Safeguard:</strong> This Discrepancy Record certifies that{' '}
            <strong>{ddr.totalOutstanding} units are NOT part of government property</strong>. Supply officers are prohibited from issuing Inventory Custodian Slips (ICS) or Property Acknowledgement Receipts (PAR) for undelivered or rejected items.
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
        >
          Close DDR
        </button>
      </div>
    </div>
  );
};
