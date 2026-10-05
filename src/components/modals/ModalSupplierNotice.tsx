import React from 'react';
import { Printer, AlertOctagon, Send, FileSignature, CheckCircle } from 'lucide-react';
import { Transaction, SchoolProfile, Personnel, Supplier } from '../../types';

interface ModalSupplierNoticeProps {
  txn: Transaction;
  schoolProfile: SchoolProfile;
  personnelList: Personnel[];
  supplierList: Supplier[];
  onClose: () => void;
}

export const ModalSupplierNotice: React.FC<ModalSupplierNoticeProps> = ({
  txn,
  schoolProfile,
  personnelList,
  supplierList,
  onClose
}) => {
  const supplier = supplierList.find(s => s.id === txn.po?.supplierId);
  const supplyOfficer = personnelList.find(p => p.role.includes('Property') || p.role.includes('Supply')) || personnelList[4];
  const schoolHead = personnelList.find(p => p.role.includes('School Head')) || personnelList[0];

  // Derive discrepancy quantities from deliveries or iar_items
  const latestBatch = [...(txn.deliveries || [])].reverse()[0];
  const ddr = latestBatch?.discrepancyRecord;

  const totalOrdered = ddr?.totalOrdered || txn.po_items?.reduce((s, i) => s + i.qty, 0) || 20;
  const totalDelivered = ddr?.totalDelivered || 15;
  const totalAccepted = ddr?.totalAccepted || 14;
  const totalRejected = ddr?.totalRejected || 1;
  const totalUndelivered = ddr?.totalUndelivered || 5;
  const totalOutstanding = ddr?.totalOutstanding || 6;

  const invoiceNo = ddr?.drInvoiceNo || txn.dr?.invoiceNo || 'INV-2026-8841';
  const noticeDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 text-xs font-sans w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-800 rounded-lg">
              <AlertOctagon size={16} />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Notice of Incomplete / Deficient Delivery
            </h2>
            <span className="text-[10px] font-mono font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
              OFFICIAL SUPPLIER CURE NOTICE
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Formal DepEd Supply Notice to Supplier pursuant to DepEd Order No. 41, s. 2021 & RA 9184 IRR
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
        >
          <Printer size={13} /> Print Notice / Save PDF
        </button>
      </div>

      {/* Official Printable DepEd Notice Sheet */}
      <div className="border border-slate-300 p-6 bg-white space-y-5 shadow-xs text-slate-900 font-sans">
        {/* DepEd Letterhead */}
        <div className="text-center space-y-0.5 border-b border-slate-300 pb-3 relative">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Republic of the Philippines</p>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-800">Department of Education</p>
          <p className="text-[10px] text-slate-600">{schoolProfile.regionDivision}</p>
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight mt-1">{schoolProfile.schoolName}</h3>
          <p className="text-[10px] text-slate-500">{schoolProfile.address} • School ID: {schoolProfile.schoolId}</p>

          <h2 className="text-xs font-extrabold uppercase tracking-widest text-rose-900 border-t border-slate-200 mt-2.5 pt-2">
            NOTICE OF INCOMPLETE DELIVERY & DEFECTIVE GOODS
          </h2>
        </div>

        {/* Notice Meta Details */}
        <div className="grid grid-cols-2 text-xs border border-slate-200 p-3 bg-slate-50/50 rounded-lg">
          <div className="space-y-1">
            <div><span className="font-bold text-slate-700">TO (Supplier):</span> <strong className="text-slate-900">{supplier?.name || 'Metro Tech Solutions'}</strong></div>
            <div><span className="font-bold text-slate-700">Business Address:</span> {supplier?.address || txn.po?.supplierAddress}</div>
            <div><span className="font-bold text-slate-700">TIN:</span> <span className="font-mono">{supplier?.tin || '000-000-000-000'}</span></div>
          </div>
          <div className="space-y-1 text-right">
            <div><span className="font-bold text-slate-700">Date of Notice:</span> <span className="font-mono">{noticeDate}</span></div>
            <div><span className="font-bold text-slate-700">Purchase Order No.:</span> <span className="font-mono font-bold text-blue-800">{txn.po?.no}</span></div>
            <div><span className="font-bold text-slate-700">Sales Invoice / DR No.:</span> <span className="font-mono">{invoiceNo}</span></div>
          </div>
        </div>

        {/* Formal Notice Salutation & Body */}
        <div className="space-y-3 text-xs text-slate-800 leading-relaxed">
          <p>
            <strong>Sir / Madam:</strong>
          </p>
          <p>
            Please be advised that upon physical receipt and comprehensive technical inspection conducted by the School Inspectorate Team (IAC) on{' '}
            <strong>{txn.iar?.dateInspected || 'October 12, 2026'}</strong> for the items delivered under Purchase Order No.{' '}
            <strong>{txn.po?.no}</strong>, the following discrepancies and deficiencies were officially noted:
          </p>

          {/* Deficiency Summary Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
                <tr>
                  <th className="p-2">Deficiency Category</th>
                  <th className="p-2 text-center w-24">Required Qty</th>
                  <th className="p-2 text-center w-24">Arrived Qty</th>
                  <th className="p-2 text-center w-28 text-emerald-800">Accepted Qty</th>
                  <th className="p-2 text-center w-32 text-rose-800">Deficient / Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-medium">
                    1. Short Delivery (Undelivered goods required by contract)
                  </td>
                  <td className="p-2 text-center font-mono">{totalOrdered}</td>
                  <td className="p-2 text-center font-mono">{totalDelivered}</td>
                  <td className="p-2 text-center font-mono text-emerald-700">{totalAccepted}</td>
                  <td className="p-2 text-center font-mono font-bold text-amber-700">
                    {totalUndelivered} units missing
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">
                    2. Rejected Units (Damaged, defective display, or non-compliant)
                  </td>
                  <td className="p-2 text-center font-mono">—</td>
                  <td className="p-2 text-center font-mono">{totalDelivered}</td>
                  <td className="p-2 text-center font-mono text-emerald-700">{totalAccepted}</td>
                  <td className="p-2 text-center font-mono font-bold text-rose-700">
                    {totalRejected} unit(s) for replacement
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={4} className="p-2 text-right uppercase">
                    TOTAL OUTSTANDING SUPPLIER OBLIGATION:
                  </td>
                  <td className="p-2 text-center font-mono font-extrabold text-sm text-purple-900">
                    {totalOutstanding} units
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legal basis and Cure instruction */}
          <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1.5">
            <div className="font-bold">Required Action & Cure Notice (DepEd Order No. 41, s. 2021):</div>
            <p>
              In view thereof, you are hereby given a <strong>Cure Period of seven (7) calendar days</strong> from receipt of this notice to:
            </p>
            <ol className="list-decimal pl-5 space-y-0.5">
              <li>Deliver the remaining <strong>{totalUndelivered} undelivered units</strong> in full compliance with PO specifications; and</li>
              <li>Rectify or replace the <strong>{totalRejected} rejected unit(s)</strong> with brand new, defect-free units conforming to contract standards.</li>
            </ol>
            <p className="pt-1 text-[11px] text-amber-900">
              Pursuant to the 2016 Revised IRR of RA 9184 and the terms of PO No. {txn.po?.no}, failure to complete delivery and rectify defects within the stipulated cure period shall compel the Procuring Entity to impose <strong>Liquidated Damages of one-tenth (1/10) of one percent (1%) for every day of delay</strong> on the undelivered portion, and may warrant rescission of contract and supplier forfeiture.
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 pt-6 border-t border-slate-300 text-xs">
          <div className="space-y-8 p-2">
            <p className="font-bold text-slate-600 text-[10px] uppercase">Prepared and Issued by:</p>
            <div className="pt-4 border-t border-slate-300 text-center">
              <p className="font-bold uppercase text-slate-900">{supplyOfficer.name}</p>
              <p className="text-[10px] text-slate-600">{supplyOfficer.designation || 'School Property Custodian / Supply Officer I'}</p>
            </div>
          </div>

          <div className="space-y-8 p-2">
            <p className="font-bold text-slate-600 text-[10px] uppercase">Noted and Approved by:</p>
            <div className="pt-4 border-t border-slate-300 text-center">
              <p className="font-bold uppercase text-slate-900">{schoolHead.name}</p>
              <p className="text-[10px] text-slate-600">{schoolHead.designation || 'Secondary School Principal II / Head of Procuring Entity'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
        >
          Close Notice
        </button>
      </div>
    </div>
  );
};
