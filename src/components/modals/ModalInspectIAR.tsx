import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Info,
  Building,
  Package,
  Layers,
  AlertCircle
} from 'lucide-react';
import {
  Transaction,
  SchoolProfile,
  Personnel,
  STATUS,
  DeliveryItem,
  DiscrepancyType,
  DeliveryDiscrepancyRecord
} from '../../types';
import { validateIARIssuance } from '../../utils/formValidation';

interface ModalInspectIARProps {
  txn: Transaction;
  schoolProfile: SchoolProfile;
  personnelList: Personnel[];
  onSave: (txnId: string, updates: Partial<Transaction>) => void;
  onClose: () => void;
}

export const ModalInspectIAR: React.FC<ModalInspectIARProps> = ({
  txn,
  schoolProfile,
  personnelList,
  onSave,
  onClose
}) => {
  const currentBatchNo = txn.dr?.batchNo || (txn.deliveries?.length || 0) + 1;

  // Initialize inspect items from current delivery manifest or po_items
  const initialItems: DeliveryItem[] = (txn.iar_items && txn.iar_items.length > 0
    ? txn.iar_items
    : (txn.po_items || []).map((poItem, idx) => {
        const pastAccepted = (txn.deliveries || []).reduce((acc, batch) => {
          const match = batch.items.find(i => i.stockNo === poItem.stockNo);
          return acc + (match?.acceptedQty || 0);
        }, 0);

        const currentDelivered = Math.max(0, poItem.qty - pastAccepted);

        return {
          id: idx + 1,
          stockNo: poItem.stockNo,
          desc: poItem.desc,
          unit: poItem.unit,
          unitCost: poItem.unitCost,
          orderedQty: poItem.qty,
          previouslyAcceptedQty: pastAccepted,
          currentDeliveredQty: currentDelivered,
          acceptedQty: currentDelivered, // defaults to delivered
          rejectedQty: 0,
          undeliveredQty: Math.max(0, poItem.qty - pastAccepted - currentDelivered),
          rejectionReason: '',
          rejectionCategory: 'Defective' as const
        };
      })
  ).map((item, idx) => {
    // Ensure all computed quantities are synchronized
    const ordered = item.orderedQty || txn.po_items?.[idx]?.qty || 0;
    const pastAcc = item.previouslyAcceptedQty || 0;
    const delivered = item.currentDeliveredQty ?? ordered - pastAcc;
    const accepted = item.acceptedQty ?? delivered;
    const rejected = Math.max(0, delivered - accepted);
    const undelivered = Math.max(0, ordered - pastAcc - delivered);

    return {
      ...item,
      orderedQty: ordered,
      previouslyAcceptedQty: pastAcc,
      currentDeliveredQty: delivered,
      acceptedQty: accepted,
      rejectedQty: rejected,
      undeliveredQty: undelivered,
      rejectionReason: item.rejectionReason || '',
      rejectionCategory: item.rejectionCategory || 'Defective'
    };
  });

  const [inspectItems, setInspectItems] = useState<DeliveryItem[]>(initialItems);

  // DepEd Inspectorate Team fields
  const [iar, setIar] = useState({
    dateInspected: new Date().toISOString().split('T')[0],
    iacChairman:
      personnelList.find(p => p.role.includes('Inspector') || p.designation.includes('Teacher III'))?.id ||
      'P04',
    technicalInspector:
      personnelList.find(p => p.role.includes('ICT') || p.role.includes('Property'))?.id ||
      'P03',
    custodianOfficer: schoolProfile.supplyOfficer || personnelList[4]?.name || 'Maria Santos',
    conformanceInspection: true,
    acceptanceMode: 'Partially Accepted' as 'Full Lot Accepted' | 'Partially Accepted',
    remarks: ''
  });

  // Handle accepted quantity changes
  const handleAcceptedChange = (idx: number, newAccepted: number) => {
    const updated = [...inspectItems];
    const item = updated[idx];
    const safeAccepted = Math.max(0, Math.min(newAccepted, item.currentDeliveredQty));
    const rejected = Math.max(0, item.currentDeliveredQty - safeAccepted);
    const undelivered = Math.max(0, item.orderedQty - item.previouslyAcceptedQty - item.currentDeliveredQty);

    updated[idx] = {
      ...item,
      acceptedQty: safeAccepted,
      rejectedQty: rejected,
      undeliveredQty: undelivered
    };
    setInspectItems(updated);
  };

  const handleReasonChange = (idx: number, reason: string) => {
    const updated = [...inspectItems];
    updated[idx].rejectionReason = reason;
    setInspectItems(updated);
  };

  const handleCategoryChange = (
    idx: number,
    cat: 'Defective' | 'Damaged' | 'Wrong Specification' | 'Missing Accessory' | 'Other'
  ) => {
    const updated = [...inspectItems];
    updated[idx].rejectionCategory = cat;
    setInspectItems(updated);
  };

  // Computations across all line items
  const totalOrdered = inspectItems.reduce((s, i) => s + i.orderedQty, 0);
  const totalPastAccepted = inspectItems.reduce((s, i) => s + i.previouslyAcceptedQty, 0);
  const totalCurrentDelivered = inspectItems.reduce((s, i) => s + i.currentDeliveredQty, 0);
  const totalAcceptedNow = inspectItems.reduce((s, i) => s + i.acceptedQty, 0);
  const totalRejectedNow = inspectItems.reduce((s, i) => s + i.rejectedQty, 0);
  const totalUndeliveredNow = inspectItems.reduce((s, i) => s + i.undeliveredQty, 0);

  // Outstanding obligation = PO Quantity - (Previously Accepted + Current Accepted) = Rejected + Undelivered
  const totalCumulativeAccepted = totalPastAccepted + totalAcceptedNow;
  const totalOutstanding = totalOrdered - totalCumulativeAccepted;

  // Determine Case Classification
  let deliveryCase = 'Complete';
  let caseBadge = { text: '100% Complete & Compliant', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };

  if (totalOutstanding > 0) {
    if (totalAcceptedNow === 0 && totalRejectedNow > 0) {
      deliveryCase = 'Case D';
      caseBadge = {
        text: 'Case D — Wrong Specification / 100% Non-Compliant',
        color: 'bg-purple-50 text-purple-800 border-purple-300'
      };
    } else if (totalRejectedNow > 0 && totalUndeliveredNow > 0) {
      deliveryCase = 'Case C';
      caseBadge = {
        text: 'Case C — Short Delivery + Defective Items',
        color: 'bg-rose-50 text-rose-800 border-rose-300'
      };
    } else if (totalRejectedNow > 0 && totalUndeliveredNow === 0) {
      deliveryCase = 'Case B';
      caseBadge = {
        text: 'Case B — Defective Items (Awaiting Replacement)',
        color: 'bg-amber-50 text-amber-800 border-amber-300'
      };
    } else if (totalUndeliveredNow > 0 && totalRejectedNow === 0) {
      deliveryCase = 'Case A';
      caseBadge = {
        text: 'Case A — Short Quantity Only (Partial Delivery)',
        color: 'bg-blue-50 text-blue-800 border-blue-300'
      };
    }
  }

  // Financial values
  const acceptedCostNow = inspectItems.reduce((s, i) => s + i.acceptedQty * i.unitCost, 0);
  const outstandingCost = inspectItems.reduce(
    (s, i) => s + (i.rejectedQty + i.undeliveredQty) * i.unitCost,
    0
  );
  const totalPOCost = (txn.po_items || []).reduce((s, i) => s + i.amount, 0);

  // Auto-compose DepEd Order No. 41 Remarks
  const generatedRemarks =
    totalOutstanding === 0
      ? `Full Delivery Complete (Batch #${currentBatchNo}). PO Quantity: ${totalOrdered} units. Inspected, compliant, and 100% accepted into school inventory.`
      : `Partial Delivery (Batch #${currentBatchNo}). PO Quantity: ${totalOrdered} units | Physically Delivered: ${totalCurrentDelivered} units | Accepted: ${totalAcceptedNow} units | Rejected: ${totalRejectedNow} unit(s) | Undelivered: ${totalUndeliveredNow} units.
Supplier Outstanding Obligation: ${totalRejectedNow > 0 ? `${totalRejectedNow} unit(s) for replacement/rectification` : ''}${totalRejectedNow > 0 && totalUndeliveredNow > 0 ? ' + ' : ''}${totalUndeliveredNow > 0 ? `${totalUndeliveredNow} unit(s) undelivered` : ''} (Total Outstanding: ${totalOutstanding} units).
Eligible for Property Inventory Posting: ${totalAcceptedNow} units only. Missing and rejected goods strictly barred from government property books until rectified.`;

  const finalRemarks = iar.remarks.trim() || generatedRemarks;

  const handleApproveIAR = () => {
    const year = new Date().getFullYear();
    const iarNum = txn.iar?.no || `IAR-${year}-${Math.floor(Math.random() * 900 + 100)}`;
    const ddrNum = `DDR-${year}-${Math.floor(Math.random() * 90000 + 10000)}`;

    // Build DDR if there is any discrepancy
    let discrepancyRecord: DeliveryDiscrepancyRecord | undefined = undefined;
    const discrepancyTypes: DiscrepancyType[] = [];

    if (totalUndeliveredNow > 0) discrepancyTypes.push('Short Delivery');
    if (totalRejectedNow > 0) {
      inspectItems.forEach(item => {
        if (item.rejectedQty > 0) {
          if (item.rejectionCategory === 'Defective') discrepancyTypes.push('Defective Item');
          if (item.rejectionCategory === 'Damaged') discrepancyTypes.push('Damaged Item');
          if (item.rejectionCategory === 'Wrong Specification') discrepancyTypes.push('Wrong Specification');
          if (item.rejectionCategory === 'Missing Accessory') discrepancyTypes.push('Missing Component');
        }
      });
    }

    // Unique types
    const uniqueDiscrepancyTypes = Array.from(new Set(discrepancyTypes)) as DiscrepancyType[];

    if (totalOutstanding > 0) {
      discrepancyRecord = {
        id: ddrNum,
        poNo: txn.po?.no || '',
        deliveryBatchNo: currentBatchNo,
        drInvoiceNo: txn.dr?.invoiceNo || 'N/A',
        types: uniqueDiscrepancyTypes.length > 0 ? uniqueDiscrepancyTypes : ['Short Delivery'],
        totalOrdered,
        totalDelivered: totalCurrentDelivered,
        totalAccepted: totalAcceptedNow,
        totalRejected: totalRejectedNow,
        totalUndelivered: totalUndeliveredNow,
        totalOutstanding,
        inspectorFindings: inspectItems
          .filter(i => i.rejectedQty > 0 || i.undeliveredQty > 0)
          .map(i => `${i.desc}: Accepted ${i.acceptedQty}, Rejected ${i.rejectedQty}${i.rejectionReason ? ` (${i.rejectionReason})` : ''}, Undelivered ${i.undeliveredQty}`)
          .join('; '),
        supplierNoticeDate: new Date().toISOString().split('T')[0],
        supplierNoticeStatus: 'Notice Served'
      };
    }

    // Determine final status
    let nextStatus: typeof STATUS[keyof typeof STATUS] = STATUS.COMPLETED;
    if (totalOutstanding > 0) {
      if (totalRejectedNow > 0) {
        nextStatus = STATUS.AWAITING_COMPLETION;
      } else {
        nextStatus = STATUS.PARTIALLY_ACCEPTED;
      }
    }

    // Append this delivery to batch history
    const newDeliveryBatch = {
      batchNo: currentBatchNo,
      drInvoiceNo: txn.dr?.invoiceNo || 'N/A',
      deliveryDate: txn.dr?.invoiceDate || iar.dateInspected,
      receivedBy: iar.custodianOfficer,
      deliveryType:
        currentBatchNo === 1
          ? ('Initial Delivery' as const)
          : totalRejectedNow > 0
          ? ('Replacement Delivery' as const)
          : ('Subsequent Delivery' as const),
      items: inspectItems,
      iarNo: iarNum,
      iarDate: iar.dateInspected,
      iarStatus:
        totalOutstanding === 0
          ? ('Passed Complete' as const)
          : ('Partially Accepted' as const),
      discrepancyRecord
    };

    const pastBatches = (txn.deliveries || []).filter(b => b.batchNo !== currentBatchNo);
    const now = new Date().toISOString();
    const newAuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      action: totalOutstanding === 0
        ? 'Inspection & Acceptance Certified (Appendix 62) - 100% Accepted'
        : `Inspection & Acceptance Certified (Appendix 62) - ${totalAcceptedNow} Accepted, ${totalOutstanding} Outstanding`,
      actor: `${iar.iacChairman} (IAC Chairman) / ${iar.custodianOfficer} (Custodian)`,
      version: txn.version || 'v1.0',
      notes: finalRemarks
    };

    onSave(txn.id, {
      status: nextStatus,
      isLocked: true,
      lastSavedTimestamp: now,
      auditHistory: [newAuditEntry, ...(txn.auditHistory || [])],
      deliveries: [...pastBatches, newDeliveryBatch],
      iar: {
        no: iarNum,
        dateInspected: iar.dateInspected,
        status: totalOutstanding === 0 ? 'Complete' : 'Partially Accepted',
        iacChairman: iar.iacChairman,
        technicalInspector: iar.technicalInspector,
        custodianOfficer: iar.custodianOfficer,
        conformanceInspection: iar.conformanceInspection,
        acceptanceComplete: totalOutstanding === 0,
        acceptanceMode: totalOutstanding === 0 ? 'Full Lot Accepted' : 'Partially Accepted',
        remarks: finalRemarks
      },
      iar_items: inspectItems
    });

    onClose();
  };

  return (
    <div className="space-y-4 text-xs w-full font-sans">
      {/* Header with Appendix 62 & DepEd Order No. 41 reference */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Inspection & Acceptance Report (IAR)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">
              APPENDIX 62 (GAM VOL II)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold">
              DO NO. 41, S. 2021
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            DepEd Receiving & Technical Inspection Verification • PO: <strong>{txn.po?.no}</strong> • DR/Invoice: <strong>{txn.dr?.invoiceNo}</strong> (Batch #{currentBatchNo})
          </p>
        </div>

        {/* Dynamic Case Classification Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 shadow-2xs ${caseBadge.color}`}>
            {totalOutstanding > 0 ? <AlertTriangle size={13} /> : <CheckCircle size={13} />}
            {caseBadge.text}
          </span>
        </div>
      </div>

      {/* DepEd Crucial Guidance Alert */}
      {totalOutstanding > 0 ? (
        <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-950">
              Incomplete Delivery Rule (DepEd Order No. 41, s. 2021 & GAM Volume II):
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              An incomplete delivery <strong>must not be treated as a completed contract</strong>. The system strictly differentiates between <strong>Accepted ({totalAcceptedNow})</strong>, <strong>Rejected ({totalRejectedNow})</strong>, and <strong>Undelivered ({totalUndeliveredNow})</strong> quantities.
              Missing and defective units <strong>will NOT be posted to property/inventory cards</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">100% Contract Fulfillment:</span> All {totalOrdered} items have passed physical and technical inspection. Full lot eligible for government property inventory and disbursement voucher processing.
          </div>
        </div>
      )}

      {/* Physical Inspection Quantities Matrix (The Core System Control) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-slate-700" />
            <span className="font-bold text-slate-800 text-xs">
              Delivery Line Classification & Physical Inspection Matrix
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Rule: <em>Rejected ≠ Undelivered</em> • Both remain supplier obligation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
              <tr>
                <th className="p-3">PO Item & Specifications</th>
                <th className="p-3 text-center w-24">Ordered</th>
                <th className="p-3 text-center w-28 bg-slate-50">Past Accepted</th>
                <th className="p-3 text-center w-28 bg-blue-50/60 text-blue-900">Delivered Now</th>
                <th className="p-3 text-center w-36 bg-emerald-50/80 text-emerald-900">
                  Accepted (Pass) *
                </th>
                <th className="p-3 text-center w-32 bg-rose-50/60 text-rose-900">Rejected (Fail)</th>
                <th className="p-3 text-center w-32 bg-amber-50/60 text-amber-900">Undelivered</th>
                <th className="p-3 text-center w-32 bg-purple-50/60 text-purple-900">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspectItems.map((item, idx) => {
                const itemOutstanding = item.rejectedQty + item.undeliveredQty;
                return (
                  <React.Fragment key={idx}>
                    <tr className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{item.desc}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span>Stock #{item.stockNo}</span>
                          <span>•</span>
                          <span>Unit Cost: ₱{item.unitCost.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-700 font-mono">
                        {item.orderedQty} {item.unit}
                      </td>
                      <td className="p-3 text-center font-semibold text-emerald-700 font-mono bg-slate-50">
                        {item.previouslyAcceptedQty} {item.unit}
                      </td>
                      <td className="p-3 text-center font-bold text-blue-900 font-mono bg-blue-50/30">
                        {item.currentDeliveredQty} {item.unit}
                      </td>
                      <td className="p-2 text-center bg-emerald-50/40">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={item.currentDeliveredQty}
                            value={item.acceptedQty}
                            onChange={e => handleAcceptedChange(idx, parseInt(e.target.value) || 0)}
                            className="w-20 border border-emerald-400 bg-white rounded-md p-1.5 text-center font-mono font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 text-xs shadow-2xs"
                          />
                          <span className="text-[10px] font-semibold text-emerald-800">{item.unit}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold font-mono bg-rose-50/30">
                        <span className={item.rejectedQty > 0 ? 'text-rose-700 font-extrabold' : 'text-slate-400'}>
                          {item.rejectedQty} {item.unit}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold font-mono bg-amber-50/30">
                        <span className={item.undeliveredQty > 0 ? 'text-amber-700 font-extrabold' : 'text-slate-400'}>
                          {item.undeliveredQty} {item.unit}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold font-mono bg-purple-50/30">
                        <span className={itemOutstanding > 0 ? 'text-purple-800 font-extrabold' : 'text-emerald-700'}>
                          {itemOutstanding} {item.unit}
                        </span>
                      </td>
                    </tr>

                    {/* Rejection Details Row if Rejected > 0 */}
                    {item.rejectedQty > 0 && (
                      <tr className="bg-rose-50/40 border-b border-rose-100">
                        <td colSpan={8} className="p-3 pl-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <span className="text-[10px] uppercase font-bold text-rose-800 flex items-center gap-1 flex-shrink-0">
                              <XCircle size={12} className="text-rose-600" />
                              Rejection Defect Note ({item.rejectedQty} {item.unit}):
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <label className="text-[10px] font-semibold text-slate-600">Category:</label>
                              <select
                                value={item.rejectionCategory}
                                onChange={e => handleCategoryChange(idx, e.target.value as any)}
                                className="border border-rose-300 rounded px-2 py-1 bg-white text-xs text-rose-900 font-medium"
                              >
                                <option value="Defective">Defective / Damaged Display</option>
                                <option value="Damaged">Damaged Casing / Packaging</option>
                                <option value="Wrong Specification">Wrong Technical Specification</option>
                                <option value="Missing Accessory">Missing Cable / Accessory</option>
                                <option value="Other">Other Non-Compliance</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              value={item.rejectionReason}
                              onChange={e => handleReasonChange(idx, e.target.value)}
                              placeholder="Specify exact defect (e.g. Broken screen, missing power brick, wrong processor)..."
                              className="flex-1 border border-rose-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800 outline-none focus:ring-1 focus:ring-rose-400"
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-100/90 font-bold text-slate-800 border-t border-slate-300 text-xs">
              <tr>
                <td className="p-3 text-right">TOTAL SUMMARY:</td>
                <td className="p-3 text-center font-mono">{totalOrdered}</td>
                <td className="p-3 text-center font-mono text-emerald-800">{totalPastAccepted}</td>
                <td className="p-3 text-center font-mono text-blue-900">{totalCurrentDelivered}</td>
                <td className="p-3 text-center font-mono text-emerald-900 bg-emerald-100/50">
                  {totalAcceptedNow}
                </td>
                <td className="p-3 text-center font-mono text-rose-800 bg-rose-100/50">
                  {totalRejectedNow}
                </td>
                <td className="p-3 text-center font-mono text-amber-800 bg-amber-100/50">
                  {totalUndeliveredNow}
                </td>
                <td className="p-3 text-center font-mono text-purple-900 bg-purple-100/50">
                  {totalOutstanding}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mathematical Verification Summary Card */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">1. PO Contract Required</span>
            <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
              {totalOrdered} units <span className="text-[10px] text-slate-500 font-normal">(₱{totalPOCost.toLocaleString()})</span>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200">
            <span className="text-[10px] text-emerald-700 uppercase font-bold block">2. Accepted into Inventory</span>
            <div className="text-sm font-extrabold text-emerald-900 font-mono mt-0.5">
              {totalCumulativeAccepted} units <span className="text-[10px] text-emerald-700 font-normal">({Math.round((totalCumulativeAccepted / totalOrdered) * 100)}%)</span>
            </div>
          </div>

          <div className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-200">
            <span className="text-[10px] text-rose-700 uppercase font-bold block">3. Defective / Rejected</span>
            <div className="text-sm font-extrabold text-rose-900 font-mono mt-0.5">
              {totalRejectedNow} units <span className="text-[10px] text-rose-700 font-normal">(for replacement)</span>
            </div>
          </div>

          <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-200">
            <span className="text-[10px] text-purple-700 uppercase font-bold block">4. Total Outstanding Obligation</span>
            <div className="text-sm font-extrabold text-purple-900 font-mono mt-0.5">
              {totalOutstanding} units <span className="text-[10px] text-purple-700 font-normal">(₱{outstandingCost.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Section DepEd Order No. 41 Verification Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: Technical Inspection (IAC Committee) */}
        <div className="border border-blue-200 rounded-xl p-3.5 bg-blue-50/30 space-y-3">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <ClipboardCheck size={14} className="text-blue-600" />
              1. INSPECTION VERIFICATION (Inspectorate Team)
            </span>
            <span className="text-[10px] font-semibold text-blue-700">DepEd Order No. 41</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Date Inspected *</label>
              <input
                type="date"
                value={iar.dateInspected}
                onChange={e => setIar({ ...iar, dateInspected: e.target.value })}
                className="w-full border border-slate-300 rounded-md p-1.5 bg-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">IAC Committee Head *</label>
              <select
                value={iar.iacChairman}
                onChange={e => setIar({ ...iar, iacChairman: e.target.value })}
                className="w-full border border-slate-300 rounded-md p-1.5 bg-white text-xs outline-none focus:border-blue-500 font-medium"
              >
                {personnelList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Technical Inspector *</label>
            <select
              value={iar.technicalInspector}
              onChange={e => setIar({ ...iar, technicalInspector: e.target.value })}
              className="w-full border border-slate-300 rounded-md p-1.5 bg-white text-xs outline-none focus:border-blue-500 font-medium"
            >
              {personnelList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.designation})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-blue-200 cursor-pointer shadow-2xs">
            <input
              type="checkbox"
              checked={iar.conformanceInspection}
              onChange={e => setIar({ ...iar, conformanceInspection: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 accent-blue-600"
            />
            <span className="text-[11px] text-slate-700 leading-snug">
              <strong>Certified Inspection Findings:</strong> I hereby certify that the physical goods were inspected against the contract specifications, brand/model, test benchmarks, and physical condition. The items accepted ({totalAcceptedNow}) passed; defected items ({totalRejectedNow}) are documented for return and replacement.
            </span>
          </label>
        </div>

        {/* Column 2: Acceptance & Custody (Property Custodian) */}
        <div className="border border-emerald-200 rounded-xl p-3.5 bg-emerald-50/30 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-600" />
              2. ACCEPTANCE & PROPERTY CUSTODY (Supply Officer)
            </span>
            <span className="text-[10px] font-semibold text-emerald-700">GAM Volume II</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Acceptance Date *</label>
              <input
                type="date"
                value={txn.dr?.invoiceDate || iar.dateInspected}
                readOnly
                className="w-full border border-slate-300 rounded-md p-1.5 bg-slate-50 text-xs text-slate-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Property Custodian *</label>
              <input
                type="text"
                value={iar.custodianOfficer}
                onChange={e => setIar({ ...iar, custodianOfficer: e.target.value })}
                className="w-full border border-slate-300 rounded-md p-1.5 bg-white text-xs outline-none focus:border-emerald-500 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Explicit DepEd Acceptance Mode */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">DepEd Acceptance Mode *</label>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-2 rounded-lg border text-center font-bold text-xs ${
                  totalOutstanding === 0
                    ? 'border-emerald-400 bg-emerald-100/60 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                Full Lot Accepted (100%)
              </div>
              <div
                className={`p-2 rounded-lg border text-center font-bold text-xs ${
                  totalOutstanding > 0
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                Partially Accepted ({totalAcceptedNow} Units)
              </div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-[11px] text-slate-700 space-y-1.5 shadow-2xs">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Building size={13} className="text-emerald-700" />
              Property & Accounting Enforcement:
            </div>
            <p className="leading-snug">
              <strong>Accepted Qty = Maximum Qty for Property Posting:</strong> Only the{' '}
              <strong className="text-emerald-900">{totalAcceptedNow} accepted units</strong> will be posted to the{' '}
              <em>Stock Card / Supplies Ledger / Semi-Expendable Card / Property Card</em>.
              The {totalOutstanding} missing/rejected units are <strong>strictly barred</strong> from government books.
            </p>
          </div>
        </div>
      </div>

      {/* Official DepEd Order No. 41 Remarks Box */}
      <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            Official Appendix 62 Discrepancy & Custody Remarks *
          </label>
          <span className="text-[10px] text-slate-400 font-mono">DepEd Order No. 41 Compliant</span>
        </div>
        <textarea
          rows={3}
          value={iar.remarks || generatedRemarks}
          onChange={e => setIar({ ...iar, remarks: e.target.value })}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 bg-slate-50/50 outline-none focus:bg-white focus:border-slate-400 font-mono leading-relaxed"
        />
        <div className="flex justify-between items-center text-[10px] text-slate-500">
          <span>Auto-formatted based on inspection line matrix. Edit if additional specific details apply.</span>
          <button
            type="button"
            onClick={() => setIar({ ...iar, remarks: generatedRemarks })}
            className="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Reset to Generated Remarks
          </button>
        </div>
      </div>

      {/* Partial Payment Guidance Banner */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-slate-600 flex-shrink-0" />
          <span className="text-slate-700">
            <strong>Payment Processing Rule:</strong>{' '}
            {txn.po?.paymentRule === 'partial_permitted' ? (
              <span>
                Contract allows progress billing. Max <strong>₱{acceptedCostNow.toLocaleString()}</strong> eligible for partial disbursement voucher. <strong>₱{outstandingCost.toLocaleString()}</strong> withheld until replacement.
              </span>
            ) : (
              <span>
                Contract requires <strong>Full Lot Delivery</strong>. Progress payment prohibited. Entire ₱{totalPOCost.toLocaleString()} withheld until complete rectification.
              </span>
            )}
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 flex-shrink-0">
          Eligible: ₱{acceptedCostNow.toLocaleString()}
        </div>
      </div>

      {/* Explanatory Validation Summary Strip */}
      {(() => {
        const validation = validateIARIssuance(
          {
            dateInspected: iar.dateInspected,
            iacChairman: iar.iacChairman,
            technicalInspector: iar.technicalInspector,
            custodianOfficer: iar.custodianOfficer,
            conformanceInspection: iar.conformanceInspection,
            remarks: iar.remarks || generatedRemarks
          },
          inspectItems
        );

        return (
          <>
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                validation.isValid
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/90 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                {validation.isValid ? (
                  <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                )}
                <span className="font-medium">{validation.summaryMessage}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200 flex-shrink-0">
                {validation.isValid ? 'READY' : `${validation.missingFields.length} MISSING`}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveIAR}
                disabled={!validation.isValid}
                title={validation.isValid ? 'Issue official Appendix 62' : validation.summaryMessage}
                className="px-5 py-2 font-bold bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-white rounded-lg text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle size={14} />
                {totalOutstanding > 0
                  ? 'Issue Appendix 62 (Partially Accepted)'
                  : 'Approve & Issue Appendix 62 (Complete)'}
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );
};
