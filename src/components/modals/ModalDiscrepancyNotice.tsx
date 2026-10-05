import React from 'react';
import {
  AlertTriangle,
  Printer,
  X,
  FileWarning,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send
} from 'lucide-react';
import { Transaction, SchoolProfile, Supplier } from '../../types';

interface ModalDiscrepancyNoticeProps {
  txn: Transaction;
  schoolProfile: SchoolProfile;
  supplierList: Supplier[];
  onClose: () => void;
}

export const ModalDiscrepancyNotice: React.FC<ModalDiscrepancyNoticeProps> = ({
  txn,
  schoolProfile,
  supplierList,
  onClose
}) => {
  const supplier = supplierList.find(s => s.id === txn.po?.supplierId);
  const latestDelivery = txn.deliveries[txn.deliveries.length - 1];
  const ddr = latestDelivery?.discrepancyRecord;

  // Compute aggregate numbers if discrepancy record exists or fallback to iar_items
  const totalOrdered = ddr?.totalOrdered || txn.po_items?.reduce((s, i) => s + i.qty, 0) || 0;
  const totalDelivered = ddr?.totalDelivered || txn.iar_items?.reduce((s, i) => s + i.currentDeliveredQty, 0) || 0;
  const totalAccepted = ddr?.totalAccepted || txn.iar_items?.reduce((s, i) => s + i.acceptedQty, 0) || 0;
  const totalRejected = ddr?.totalRejected || txn.iar_items?.reduce((s, i) => s + i.rejectedQty, 0) || 0;
  const totalUndelivered = ddr?.totalUndelivered || (totalOrdered - totalDelivered);
  const totalOutstanding = totalRejected + totalUndelivered;

  return (
    <div className="space-y-4 text-xs w-full">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              DEPED ORDER NO. 41, S. 2021 & DO NO. 4, S. 2024
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Delivery Discrepancy Record (DDR) & Supplier Notice
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
          >
            <Printer size={13} /> Print Notice
          </button>
        </div>
      </div>

      {/* DDR Identification Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-amber-900 text-sm">
              {ddr?.id || `DDR-2026-${txn.id.slice(-4)}`}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/70 text-amber-900 border border-amber-300">
              DEFICIENCY IDENTIFIED
            </span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1">
            Contract Ref: <strong>{txn.po?.no}</strong> • DR/Invoice: <strong>{latestDelivery?.drInvoiceNo || txn.dr?.invoiceNo}</strong> • Delivery Batch #{latestDelivery?.batchNo || 1}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(ddr?.types || ['Short Delivery', 'Defective Item']).map(type => (
            <span
              key={type}
              className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded-md text-[11px] font-bold shadow-2xs"
            >
              ☑ {type}
            </span>
          ))}
        </div>
      </div>

      {/* 4-Way Quantities Accounting Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">1. PO Ordered</span>
          <span className="text-lg font-bold text-slate-800 font-mono mt-1 block">{totalOrdered}</span>
          <span className="text-[10px] text-slate-400">Total Contract</span>
        </div>

        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200 text-center">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">2. Delivered</span>
          <span className="text-lg font-bold text-blue-800 font-mono mt-1 block">{totalDelivered}</span>
          <span className="text-[10px] text-blue-600">On Delivery Slip</span>
        </div>

        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-center">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">3. Accepted</span>
          <span className="text-lg font-bold text-emerald-800 font-mono mt-1 block">{totalAccepted}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">✓ Govt Property</span>
        </div>

        <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">4. Rejected</span>
          <span className="text-lg font-bold text-rose-800 font-mono mt-1 block">{totalRejected}</span>
          <span className="text-[10px] text-rose-600 font-semibold">For Replacement</span>
        </div>

        <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">5. Undelivered</span>
          <span className="text-lg font-bold text-amber-800 font-mono mt-1 block">{totalUndelivered}</span>
          <span className="text-[10px] text-amber-600 font-semibold">Missing Units</span>
        </div>

        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-900 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Outstanding</span>
          <span className="text-lg font-bold text-amber-400 font-mono mt-1 block">{totalOutstanding}</span>
          <span className="text-[10px] text-slate-300 font-semibold">Due from Supplier</span>
        </div>
      </div>

      {/* Discrepant Line Items Detailed Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-800 text-xs">Itemized Physical Inspection & Deficiency Log</span>
          <span className="text-[10px] text-slate-500 font-medium">DepEd Inspectorate Committee Findings</span>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
            <tr>
              <th className="p-3">Stock No. & Description</th>
              <th className="p-3 text-center">Ordered</th>
              <th className="p-3 text-center">Delivered</th>
              <th className="p-3 text-center text-emerald-700">Accepted</th>
              <th className="p-3 text-center text-rose-700">Rejected</th>
              <th className="p-3 text-center text-amber-700">Undelivered</th>
              <th className="p-3">Inspection Findings & Rejection Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(latestDelivery?.items || txn.iar_items || []).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-3">
                  <span className="font-semibold text-slate-900 block">{item.desc}</span>
                  <span className="font-mono text-slate-400 text-[10px]">Stock #{item.stockNo}</span>
                </td>
                <td className="p-3 text-center font-bold text-slate-700 font-mono">{item.orderedQty}</td>
                <td className="p-3 text-center font-bold text-blue-700 font-mono">{item.currentDeliveredQty}</td>
                <td className="p-3 text-center font-bold text-emerald-700 font-mono bg-emerald-50/40">
                  {item.acceptedQty}
                </td>
                <td className="p-3 text-center font-bold text-rose-700 font-mono bg-rose-50/40">
                  {item.rejectedQty}
                </td>
                <td className="p-3 text-center font-bold text-amber-700 font-mono bg-amber-50/40">
                  {item.undeliveredQty}
                </td>
                <td className="p-3">
                  {item.rejectedQty > 0 || item.undeliveredQty > 0 ? (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-rose-700 uppercase block">
                        Defect: {item.rejectionCategory || 'Non-Compliant'}
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {item.rejectionReason || 'Non-conformance to technical requirements or damaged in transit.'}
                      </p>
                    </div>
                  ) : (
                    <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Complete & Compliant
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Official Formal Notice to Supplier (DepEd Prescribed Rectification Letter) */}
      <div className="border border-slate-300 p-5 rounded-xl bg-white space-y-3 shadow-xs">
        <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-slate-700" />
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              FORMAL NOTICE OF DELIVERY DEFICIENCY TO SUPPLIER
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 font-semibold">
            Date Issued: {new Date().toISOString().split('T')[0]}
          </span>
        </div>

        <div className="text-xs space-y-2 text-slate-800 leading-relaxed">
          <p>
            <strong>TO:</strong> {supplier?.name || 'Awarded Merchant'}<br />
            <strong>ADDRESS:</strong> {txn.po?.supplierAddress || supplier?.address}<br />
            <strong>TIN:</strong> {supplier?.tin}
          </p>

          <p>
            Please be formally notified that during the official physical inspection conducted on{' '}
            <strong>{latestDelivery?.iarDate || txn.iar?.dateInspected || 'the delivery date'}</strong> for Purchase Order{' '}
            <strong>{txn.po?.no}</strong>, the DepEd Inspectorate Committee has rejected{' '}
            <strong className="text-rose-700">{totalRejected} unit(s)</strong> due to defect/non-conformance, with{' '}
            <strong className="text-amber-700">{totalUndelivered} unit(s)</strong> missing from the contractual delivery.
          </p>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1 font-mono">
            <div>• Units Accepted & Recorded into Government Custody: <strong>{totalAccepted} units</strong></div>
            <div>• Defective Units to be Rectified/Replaced: <strong>{totalRejected} units</strong></div>
            <div>• Missing Units to be Completed: <strong>{totalUndelivered} units</strong></div>
            <div className="pt-1 border-t border-slate-200 font-bold text-slate-900">
              • Total Outstanding Supplier Obligation: {totalOutstanding} units
            </div>
          </div>

          <p className="text-[11px] text-slate-700">
            Pursuant to <strong>DepEd Order No. 41, s. 2021</strong> and the Revised IRR of RA 9184, you are instructed to immediately collect the rejected items, rectify or replace with compliant stock, and deliver the remaining units within the contractual delivery schedule. Failure to complete delivery within the prescribed deadline shall incur liquidated damages of one-tenth (1/10) of one percent for every day of delay on the unperformed portion.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-center text-xs">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Inspected by IAC Chairman:</p>
            <p className="font-bold text-slate-900 mt-3 uppercase">{txn.iar?.iacChairman || 'Inspection Officer'}</p>
            <p className="text-[10px] text-slate-500">Inspection & Acceptance Committee</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Noted by Property Custodian:</p>
            <p className="font-bold text-slate-900 mt-3 uppercase">{schoolProfile.supplyOfficer || 'Maria Santos'}</p>
            <p className="text-[10px] text-slate-500">Supply and Property Officer I</p>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-4 py-1.5 font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs cursor-pointer shadow-xs"
        >
          Close Record
        </button>
      </div>
    </div>
  );
};
