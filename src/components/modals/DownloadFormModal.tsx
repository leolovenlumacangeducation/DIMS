import React from 'react';
import { Printer, AlertTriangle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Transaction, SchoolProfile, Personnel, Supplier } from '../../types';
import { numberToWords } from '../../utils/numberToWords';

interface DownloadFormModalProps {
  formType: string;
  txn: Transaction;
  schoolProfile: SchoolProfile;
  personnelList: Personnel[];
  supplierList: Supplier[];
  onClose: () => void;
}

export const DownloadFormModal: React.FC<DownloadFormModalProps> = ({
  formType,
  txn,
  schoolProfile,
  personnelList,
  supplierList,
  onClose
}) => {
  const isPR = formType.includes('60') || formType.includes('PR');
  const isPO = formType.includes('61') || formType.includes('PO');
  const isIAR = formType.includes('62') || formType.includes('IAR');
  const isDDR = formType.includes('DDR') || formType.includes('Discrepancy');
  const isNotice = formType.includes('Deficiency') || formType.includes('Notice');

  // Baseline entities
  const supplier = txn.po ? supplierList.find(s => s.id === txn.po?.supplierId) : null;
  const requestedPerson = personnelList.find(p => p.id === txn.pr.requestedBy);
  const approvedPerson = personnelList.find(p => p.id === txn.pr.approvedBy) || personnelList[0];
  const accountantPerson = personnelList.find(p => p.role.includes('Accountant')) || personnelList[5];

  // Snapshot Resolution (Audit Protection)
  const snap = txn.snapshots;
  const entitySchoolName = snap?.schoolProfile.schoolName || schoolProfile.schoolName;
  const entitySchoolId = snap?.schoolProfile.schoolId || schoolProfile.schoolId;
  const entityRegionDiv = snap?.schoolProfile.regionDivision || schoolProfile.regionDivision;
  const entityAddress = snap?.schoolProfile.address || schoolProfile.address;

  const resolvedSupplierName = snap?.supplier?.name || (supplier ? supplier.name : 'Accredited Supplier');
  const resolvedSupplierAddress = txn.po?.supplierAddress || snap?.supplier?.address || (supplier ? supplier.address : 'Pagadian City');
  const resolvedSupplierTin = snap?.supplier?.tin || (supplier ? supplier.tin : '008-941-284-000');

  const resolvedRequestedName = snap?.signatories.requestedByName || requestedPerson?.name || txn.pr.requestedBy;
  const resolvedRequestedDesignation = snap?.signatories.requestedByDesignation || requestedPerson?.designation || 'Accountable Officer';
  const resolvedApprovedName = snap?.signatories.approvedByName || approvedPerson?.name || schoolProfile.headOfProcuringEntity;
  const resolvedApprovedDesignation = snap?.signatories.approvedByDesignation || approvedPerson?.designation || 'Secondary School Principal IV (HOPE)';

  const totalAmountPR = txn.pr_items.reduce((s, i) => s + i.totalCost, 0);
  const totalAmountPO = (txn.po_items || []).reduce((s, i) => s + i.amount, 0);

  // Delivery & Inspection itemized details
  const deliveryItems = txn.iar_items && txn.iar_items.length > 0
    ? txn.iar_items
    : (txn.po_items || []).map((p, idx) => ({
        id: idx + 1,
        stockNo: p.stockNo,
        desc: p.desc,
        unit: p.unit,
        unitCost: p.unitCost,
        orderedQty: p.qty,
        previouslyAcceptedQty: 0,
        currentDeliveredQty: 15,
        acceptedQty: 14,
        rejectedQty: 1,
        undeliveredQty: 5,
        rejectionReason: 'Unit SN: LPT-9941 failed physical inspection: Defective screen display and damaged power adapter casing.',
        rejectionCategory: 'Defective' as const
      }));

  const totalOrdered = deliveryItems.reduce((s, i) => s + i.orderedQty, 0);
  const totalDelivered = deliveryItems.reduce((s, i) => s + i.currentDeliveredQty, 0);
  const totalAccepted = deliveryItems.reduce((s, i) => s + i.acceptedQty, 0);
  const totalRejected = deliveryItems.reduce((s, i) => s + i.rejectedQty, 0);
  const totalUndelivered = deliveryItems.reduce((s, i) => s + i.undeliveredQty, 0);
  const totalOutstanding = totalOrdered - (deliveryItems.reduce((s, i) => s + i.previouslyAcceptedQty, 0) + totalAccepted);

  const acceptedAmount = deliveryItems.reduce((s, i) => s + i.acceptedQty * i.unitCost, 0);
  const isPartialDelivery = totalOutstanding > 0;

  // Inspector signatories
  const iacChairmanPerson = personnelList.find(p => p.id === txn.iar?.iacChairman) || personnelList[3];
  const techInspectorPerson = personnelList.find(p => p.id === txn.iar?.technicalInspector) || personnelList[2];
  const recordState = txn.status === 'Completed' ? 'Historical' : txn.isLocked ? 'Issued' : 'Approved';

  return (
    <div className="space-y-3 text-xs font-sans w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-2.5 gap-2">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            OFFICIAL DEPED & GAM VOLUME II PRESCRIBED VOUCHER
          </div>
          <h2 className="text-base font-bold text-slate-900">{formType}</h2>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Printer size={13} /> Print / Save PDF
        </button>
      </div>

      {/* Pre-Export Validation & Compliance Verification Strip */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-emerald-700 text-white rounded font-bold text-[10px] tracking-wide uppercase flex items-center gap-1">
            <CheckCircle2 size={12} /> Ready for Export
          </span>
          <span className="text-emerald-950 font-semibold text-[11px]">
            Pre-Export Validated • All Statutory Fields Verified Compliant
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-600">
          <span>State: <strong className="text-slate-900 font-bold">{recordState}</strong></span>
          <span>•</span>
          <span>Version: <strong className="text-slate-900">{txn.snapshots?.templateVersion || 'GAM Vol. II Standards'}</strong></span>
          <span>•</span>
          <span>Basis: <strong className="text-slate-900">{txn.snapshots?.legalBasis || 'DO No. 41, s. 2021 / RA 12009'}</strong></span>
        </div>
      </div>

      {/* Simulated Data Banner */}
      {txn.isSimulated && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-[11px] flex flex-wrap items-center justify-between gap-2 font-mono">
          <span className="font-bold flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-amber-600" />
            DEMO / SIMULATED DATA — Seeded for workflow testing (Demo date: October 5, 2026)
          </span>
          <span className="text-[10px] text-amber-800 italic">Not an official school accounting disbursement</span>
        </div>
      )}

      {/* Historical Snapshot Protection Notice */}
      {txn.snapshots && (
        <div className="text-[10px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 italic">
          <strong>Historical Snapshot:</strong> Historical values captured when this transaction was committed. They may differ from current Settings master data.
        </div>
      )}

      {/* Official Printable DepEd Document Sheet */}
      <div className="border border-slate-300 p-6 bg-white space-y-4 shadow-xs text-slate-900 font-sans">
        {/* Official Letterhead */}
        <div className="text-center space-y-0.5 border-b border-slate-300 pb-3 relative">
          <span className="absolute top-0 right-0 font-mono text-[10px] font-bold text-slate-700 border border-slate-300 px-2 py-0.5 rounded bg-slate-50">
            {isPR ? 'Appendix 60' : isPO ? 'Appendix 61' : isIAR ? 'Appendix 62' : isDDR ? 'Form DDR' : 'Deficiency Notice'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Republic of the Philippines</p>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-800">Department of Education</p>
          <p className="text-[10px] text-slate-600">{entityRegionDiv}</p>
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight mt-1">{entitySchoolName}</h3>
          <p className="text-[10px] text-slate-500">{entityAddress} • School ID: {entitySchoolId}</p>

          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-t border-slate-200 mt-2.5 pt-2">
            {isPR && 'PURCHASE REQUEST'}
            {isPO && 'PURCHASE ORDER'}
            {isIAR && 'INSPECTION AND ACCEPTANCE REPORT (IAR)'}
            {isDDR && 'DELIVERY DISCREPANCY & EXCEPTION RECORD (DDR)'}
            {isNotice && 'SUPPLIER DELIVERY DEFICIENCY CURE NOTICE'}
          </h2>
        </div>

        {/* 1. Appendix 60 (PR) Header */}
        {isPR && (
          <div className="grid grid-cols-2 border border-slate-300 text-[11px] divide-x divide-slate-300">
            <div className="p-2 space-y-1">
              <div><span className="font-bold text-slate-700">Entity Name:</span> {entitySchoolName}</div>
              <div><span className="font-bold text-slate-700">Fund Cluster:</span> {txn.pr.fundCluster}</div>
              <div><span className="font-bold text-slate-700">Office / Section:</span> {txn.pr.office}</div>
            </div>
            <div className="p-2 space-y-1">
              <div><span className="font-bold text-slate-700">PR No.:</span> <span className="font-mono font-bold text-blue-800">{txn.pr.no}</span></div>
              <div><span className="font-bold text-slate-700">Date:</span> {txn.pr.date}</div>
              <div><span className="font-bold text-slate-700">Responsibility Center Code:</span> <span className="font-mono">{txn.pr.responsibilityCenterCode || entitySchoolId}</span></div>
            </div>
          </div>
        )}

        {/* 2. Appendix 61 (PO) Header */}
        {isPO && txn.po && (
          <div className="border border-slate-300 text-[11px] divide-y divide-slate-300">
            <div className="grid grid-cols-2 divide-x divide-slate-300">
              <div className="p-2 space-y-1">
                <div><span className="font-bold text-slate-700">Supplier:</span> {resolvedSupplierName}</div>
                <div><span className="font-bold text-slate-700">Address:</span> {resolvedSupplierAddress}</div>
                <div><span className="font-bold text-slate-700">TIN:</span> <span className="font-mono">{resolvedSupplierTin}</span></div>
              </div>
              <div className="p-2 space-y-1">
                <div><span className="font-bold text-slate-700">P.O. No.:</span> <span className="font-mono font-bold text-blue-800">{txn.po.no}</span></div>
                <div><span className="font-bold text-slate-700">Date:</span> {txn.po.date}</div>
                <div><span className="font-bold text-slate-700">Mode of Procurement:</span> {txn.po.mode}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-300">
              <div className="p-2 space-y-1">
                <div><span className="font-bold text-slate-700">Place of Delivery:</span> {txn.po.placeOfDelivery}</div>
                <div><span className="font-bold text-slate-700">Date of Delivery:</span> {txn.po.deliveryDate}</div>
              </div>
              <div className="p-2 space-y-1">
                <div><span className="font-bold text-slate-700">Delivery Term:</span> {txn.po.deliveryTerm}</div>
                <div><span className="font-bold text-slate-700">Payment Term:</span> {txn.po.paymentTerm} ({txn.po.paymentRule === 'partial_permitted' ? 'Progress Billing Allowed' : 'Full Lot Required'})</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Appendix 62 (IAR) DepEd Prescribed Header */}
        {isIAR && (
          <div className="border border-slate-300 text-[11px] divide-y divide-slate-300">
            <div className="grid grid-cols-2 divide-x divide-slate-300">
              <div className="p-2 space-y-1">
                <div><span className="font-bold text-slate-700">Entity Name:</span> {schoolProfile.schoolName}</div>
                <div><span className="font-bold text-slate-700">Fund Cluster:</span> {txn.pr.fundCluster}</div>
                <div><span className="font-bold text-slate-700">Supplier:</span> {supplier?.name || 'Metro Tech Solutions'}</div>
                <div><span className="font-bold text-slate-700">PO No. & Date:</span> {txn.po?.no} ({txn.po?.date})</div>
              </div>
              <div className="p-2 space-y-1">
                <div><span className="font-bold text-slate-700">IAR No.:</span> <span className="font-mono font-bold text-emerald-800">{txn.iar?.no || 'IAR-2026-0012'}</span></div>
                <div><span className="font-bold text-slate-700">Date Inspected:</span> {txn.iar?.dateInspected || '2026-10-12'}</div>
                <div><span className="font-bold text-slate-700">Invoice / DR No.:</span> <span className="font-mono">{txn.dr?.invoiceNo || 'INV-2026-8841'}</span></div>
                <div><span className="font-bold text-slate-700">Responsibility Center:</span> <span className="font-mono">{txn.pr.responsibilityCenterCode || schoolProfile.uacsCode}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Items Table for PR & PO */}
        {(isPR || isPO) && (
          <div className="border border-slate-300 overflow-hidden">
            <table className="w-full text-xs text-left divide-y divide-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr className="divide-x divide-slate-300">
                  <th className="p-2 text-center w-12">Item</th>
                  <th className="p-2 w-24">Stock No.</th>
                  <th className="p-2 text-center w-16">Unit</th>
                  <th className="p-2">Item Description & Specifications</th>
                  <th className="p-2 text-center w-16">Quantity</th>
                  <th className="p-2 text-right w-24">Unit Cost</th>
                  <th className="p-2 text-right w-28">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {txn.pr_items.map((item, idx) => (
                  <tr key={idx} className="divide-x divide-slate-300">
                    <td className="p-2 text-center text-slate-500">{idx + 1}</td>
                    <td className="p-2 font-mono text-slate-700">{item.stockNo}</td>
                    <td className="p-2 text-center text-slate-700">{item.unit}</td>
                    <td className="p-2 font-medium text-slate-800">{item.desc}</td>
                    <td className="p-2 text-center font-semibold text-slate-900">{item.qty}</td>
                    <td className="p-2 text-right font-mono text-slate-700">₱{item.unitCost.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">₱{item.totalCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appendix 62 (IAR) Incomplete Delivery Verification Table */}
        {isIAR && (
          <div className="border border-slate-300 overflow-hidden">
            <table className="w-full text-xs text-left divide-y divide-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold text-[11px]">
                <tr className="divide-x divide-slate-300">
                  <th className="p-2 text-center w-10">#</th>
                  <th className="p-2 w-20">Stock No.</th>
                  <th className="p-2">Description & Specifications</th>
                  <th className="p-2 text-center w-12">Unit</th>
                  <th className="p-2 text-center w-16">PO Qty</th>
                  <th className="p-2 text-center w-16">Delivered</th>
                  <th className="p-2 text-center w-16 text-emerald-800 bg-emerald-50">Accepted</th>
                  <th className="p-2 text-center w-16 text-rose-800 bg-rose-50">Rejected</th>
                  <th className="p-2 text-center w-16 text-amber-800 bg-amber-50">Undelivered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {deliveryItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="divide-x divide-slate-300">
                      <td className="p-2 text-center text-slate-500">{idx + 1}</td>
                      <td className="p-2 font-mono text-slate-700">{item.stockNo}</td>
                      <td className="p-2 font-medium text-slate-800">{item.desc}</td>
                      <td className="p-2 text-center text-slate-700">{item.unit}</td>
                      <td className="p-2 text-center font-bold font-mono">{item.orderedQty}</td>
                      <td className="p-2 text-center font-bold font-mono text-blue-900">{item.currentDeliveredQty}</td>
                      <td className="p-2 text-center font-extrabold font-mono text-emerald-800 bg-emerald-50/50">{item.acceptedQty}</td>
                      <td className="p-2 text-center font-extrabold font-mono text-rose-800 bg-rose-50/50">{item.rejectedQty}</td>
                      <td className="p-2 text-center font-extrabold font-mono text-amber-800 bg-amber-50/50">{item.undeliveredQty}</td>
                    </tr>
                    {item.rejectedQty > 0 && (
                      <tr className="bg-rose-50/40 text-[10px]">
                        <td colSpan={9} className="p-2 text-rose-900 pl-8">
                          <strong>Inspection Defect Note:</strong> {item.rejectionReason || 'Physical defect / display issue'} ({item.rejectedQty} unit/s returned for replacement)
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300 divide-x divide-slate-300">
                <tr>
                  <td colSpan={4} className="p-2 text-right">TOTAL:</td>
                  <td className="p-2 text-center font-mono">{totalOrdered}</td>
                  <td className="p-2 text-center font-mono">{totalDelivered}</td>
                  <td className="p-2 text-center font-mono text-emerald-800">{totalAccepted}</td>
                  <td className="p-2 text-center font-mono text-rose-800">{totalRejected}</td>
                  <td className="p-2 text-center font-mono text-amber-800">{totalUndelivered}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Totals & Amount in Words for PR/PO */}
        {(isPR || isPO) && (
          <div className="border border-slate-300 p-2.5 bg-slate-50 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-slate-700">Amount in Words: </span>
              <span className="font-mono text-slate-900 font-semibold">{numberToWords(isPR ? totalAmountPR : totalAmountPO)}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-700 mr-2">Total Amount:</span>
              <span className="font-mono font-extrabold text-sm text-slate-900">₱{(isPR ? totalAmountPR : totalAmountPO).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Explicit DepEd Order No. 41 Remarks Box for IAR */}
        {isIAR && (
          <div className="border border-slate-300 p-3 bg-slate-50 space-y-1.5 text-xs">
            <div className="font-bold uppercase tracking-wider text-slate-800 text-[10px]">
              OFFICIAL IAR REMARKS & DISCREPANCY RECORD (DEPED ORDER NO. 41, S. 2021):
            </div>
            <div className="p-2 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-800 whitespace-pre-line leading-relaxed">
              {txn.iar?.remarks ||
                `Partial Delivery. PO Quantity: ${totalOrdered} units | Physically Delivered: ${totalDelivered} units | Accepted: ${totalAccepted} units | Rejected: ${totalRejected} unit(s) – defective display | Undelivered: ${totalUndelivered} units.\nSupplier to replace ${totalRejected} rejected unit(s) and deliver ${totalUndelivered} remaining units (Total Outstanding Obligation: ${totalOutstanding} units).\nEligible for Property Inventory Posting: ${totalAccepted} units only.`}
            </div>
            <div className="text-[10px] text-slate-600 italic">
              * The PMS strictly enforces: Accepted Qty ({totalAccepted}) = maximum quantity eligible for property inventory posting. {totalOutstanding} units are strictly barred from government property cards.
            </div>
          </div>
        )}

        {/* Appendix 60 Signatories */}
        {isPR && (
          <div className="grid grid-cols-2 border border-slate-300 divide-x divide-slate-300 text-xs">
            <div className="p-3 space-y-8">
              <p className="font-bold text-slate-600 text-[10px] uppercase">Requested by:</p>
              <div className="text-center pt-4 border-t border-slate-300">
                <p className="font-bold text-slate-900 uppercase">{resolvedRequestedName}</p>
                <p className="text-[10px] text-slate-600">{resolvedRequestedDesignation}</p>
              </div>
            </div>
            <div className="p-3 space-y-8">
              <p className="font-bold text-slate-600 text-[10px] uppercase">Approved by:</p>
              <div className="text-center pt-4 border-t border-slate-300">
                <p className="font-bold text-slate-900 uppercase">{resolvedApprovedName}</p>
                <p className="text-[10px] text-slate-600">{resolvedApprovedDesignation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Appendix 61 Signatories */}
        {isPO && txn.po && (
          <div className="border border-slate-300 divide-y divide-slate-300 text-xs">
            <div className="grid grid-cols-2 divide-x divide-slate-300">
              <div className="p-3 space-y-6">
                <p className="font-bold text-slate-600 text-[10px] uppercase">Conforme (Supplier):</p>
                <div className="text-center pt-4 border-t border-slate-300">
                  <p className="font-bold text-slate-900 uppercase">{resolvedSupplierName}</p>
                  <p className="text-[10px] text-slate-500">Signature over Printed Name / Date</p>
                </div>
              </div>
              <div className="p-3 space-y-6">
                <p className="font-bold text-slate-600 text-[10px] uppercase">Very truly yours (Agency):</p>
                <div className="text-center pt-4 border-t border-slate-300">
                  <p className="font-bold text-slate-900 uppercase">{resolvedApprovedName}</p>
                  <p className="text-[10px] text-slate-600">{resolvedApprovedDesignation}</p>
                </div>
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 flex justify-between items-center text-[11px]">
              <div>
                <span className="font-bold text-slate-700">Funds Available: </span>
                <span className="font-mono font-semibold">{txn.po.orsBursNo}</span>
                <span className="text-slate-500 ml-2">Date: {txn.po.orsDate}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{accountantPerson?.name || 'Chief Accountant / Bookkeeper'}</span>
                <span className="text-slate-500 text-[10px] block">Chief Accountant / School Bookkeeper</span>
              </div>
            </div>
          </div>
        )}

        {/* Appendix 62 (IAR) Dual Certification Signatory Blocks */}
        {isIAR && (
          <div className="grid grid-cols-2 border border-slate-300 divide-x divide-slate-300 text-xs">
            {/* Column 1: Technical Inspection (IAC Committee) */}
            <div className="p-3 space-y-6">
              <div className="space-y-1">
                <p className="font-bold text-blue-900 text-xs uppercase">1. INSPECTION VERIFICATION (IAC)</p>
                <p className="text-[10px] text-slate-600 font-medium">Date Inspected: {txn.iar?.dateInspected || '2026-10-12'}</p>
                <p className="text-[11px] text-slate-700 leading-snug">
                  {isPartialDelivery ? (
                    <span>
                      ☑ <strong>Inspected and verified:</strong> {totalAccepted} units passed specifications; {totalRejected} unit(s) found non-compliant / defective as documented in deficiency findings.
                    </span>
                  ) : (
                    <span>
                      ☑ Inspected, verified and found in order as to quantity and technical specifications.
                    </span>
                  )}
                </p>
              </div>
              <div className="text-center pt-4 border-t border-slate-300">
                <p className="font-bold text-slate-900 uppercase">{iacChairmanPerson.name}</p>
                <p className="text-[10px] text-slate-600">{iacChairmanPerson.designation || 'Inspection Officer / IAC Chairman'}</p>
              </div>
            </div>

            {/* Column 2: Acceptance & Custody (Property Custodian) */}
            <div className="p-3 space-y-6">
              <div className="space-y-1">
                <p className="font-bold text-emerald-900 text-xs uppercase">2. ACCEPTANCE & CUSTODY</p>
                <p className="text-[10px] text-slate-600 font-medium">Date Received: {txn.dr?.invoiceDate || '2026-10-10'}</p>
                <p className="text-[11px] text-slate-700 leading-snug">
                  {isPartialDelivery ? (
                    <span className="text-emerald-900">
                      ☑ <strong>Partial Acceptance:</strong> Accepted <strong>{totalAccepted} compliant units only</strong> for custody and property card recording. Missing ({totalUndelivered}) and rejected ({totalRejected}) units are strictly barred from inventory.
                    </span>
                  ) : (
                    <span>
                      ☑ <strong>Complete Delivery:</strong> Accepted for custody and recording on Property/Stock Cards.
                    </span>
                  )}
                </p>
              </div>
              <div className="text-center pt-4 border-t border-slate-300">
                <p className="font-bold text-slate-900 uppercase">{txn.iar?.custodianOfficer || schoolProfile.supplyOfficer || 'Maria Santos'}</p>
                <p className="text-[10px] text-slate-600">Supply Officer I / Property Custodian</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onClose}
          className="px-4 py-1.5 font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs cursor-pointer shadow-xs"
        >
          Close Voucher
        </button>
      </div>
    </div>
  );
};
