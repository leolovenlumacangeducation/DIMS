import React, { useState } from 'react';
import { Package, Truck, Info, AlertTriangle, Layers } from 'lucide-react';
import { Transaction, SchoolProfile, Personnel, STATUS, DeliveryItem } from '../../types';

interface ModalLogDeliveryProps {
  txn: Transaction;
  schoolProfile: SchoolProfile;
  personnelList: Personnel[];
  onSave: (txnId: string, updates: Partial<Transaction>) => void;
  onClose: () => void;
}

export const ModalLogDelivery: React.FC<ModalLogDeliveryProps> = ({
  txn,
  schoolProfile,
  personnelList,
  onSave,
  onClose
}) => {
  const currentBatchNo = (txn.deliveries?.length || 0) + 1;
  const isSubsequent = currentBatchNo > 1;

  // Compute previously accepted totals per item across past batches
  const initialItems: DeliveryItem[] = (txn.po_items || []).map((poItem, idx) => {
    const pastAccepted = (txn.deliveries || []).reduce((acc, batch) => {
      const match = batch.items.find(i => i.stockNo === poItem.stockNo);
      return acc + (match?.acceptedQty || 0);
    }, 0);

    const remainingToDeliver = Math.max(0, poItem.qty - pastAccepted);

    return {
      id: idx + 1,
      stockNo: poItem.stockNo,
      desc: poItem.desc,
      unit: poItem.unit,
      unitCost: poItem.unitCost,
      orderedQty: poItem.qty,
      previouslyAcceptedQty: pastAccepted,
      currentDeliveredQty: remainingToDeliver, // Defaults to remaining balance
      acceptedQty: remainingToDeliver,
      rejectedQty: 0,
      undeliveredQty: 0,
      rejectionReason: '',
      rejectionCategory: 'Other'
    };
  });

  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>(initialItems);

  const [dr, setDr] = useState({
    invoiceNo: isSubsequent
      ? `DR-2026-${Math.floor(Math.random() * 900 + 100)}`
      : 'INV-2026-8841',
    invoiceDate: new Date().toISOString().split('T')[0],
    receivedBy: schoolProfile.supplyOfficer || personnelList[4]?.name || 'Maria Santos',
    deliveryType: isSubsequent
      ? ('Subsequent/Replacement' as const)
      : ('Partial' as const)
  });

  const handleQtyChange = (idx: number, val: number) => {
    const updated = [...deliveryItems];
    updated[idx].currentDeliveredQty = Math.max(0, val);
    setDeliveryItems(updated);
  };

  const handleConfirm = () => {
    const now = new Date().toISOString();
    const newAuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      action: `Delivery Receipt Logged (Batch #${currentBatchNo})`,
      actor: dr.receivedBy,
      version: txn.version || 'v1.0',
      notes: `Received DR/Invoice ${dr.invoiceNo} with ${totalCurrentlyDelivered} physical items delivered at supply depot. Status advanced to For Inspection.`
    };

    onSave(txn.id, {
      status: STATUS.FOR_INSPECTION,
      lastSavedTimestamp: now,
      auditHistory: [newAuditEntry, ...(txn.auditHistory || [])],
      dr: {
        invoiceNo: dr.invoiceNo,
        invoiceDate: dr.invoiceDate,
        receivedBy: dr.receivedBy,
        deliveryType: dr.deliveryType,
        batchNo: currentBatchNo
      },
      iar_items: deliveryItems
    });
    onClose();
  };

  const totalCurrentlyDelivered = deliveryItems.reduce((s, i) => s + i.currentDeliveredQty, 0);
  const totalPOOrdered = deliveryItems.reduce((s, i) => s + i.orderedQty, 0);
  const totalPastAccepted = deliveryItems.reduce((s, i) => s + i.previouslyAcceptedQty, 0);
  const totalRemainingTarget = totalPOOrdered - totalPastAccepted;

  return (
    <div className="space-y-4 text-xs w-full font-sans">
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {isSubsequent ? `Log Subsequent Delivery Tranche #${currentBatchNo}` : 'Log Supplier Delivery Receipt (DR)'}
            </h2>
            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold">
              BATCH #{currentBatchNo} RECEIVING MANIFEST
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Physical receipt at school supply depot for PO <strong>{txn.po?.no}</strong> ({txn.po?.supplierAddress})
          </p>
        </div>

        {isSubsequent && (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg font-bold text-[11px] flex items-center gap-1.5 shadow-2xs">
            <Layers size={13} className="text-amber-700" /> Subsequent Tranche / Replacement Delivery
          </span>
        )}
      </div>

      {/* DepEd Order No. 41 Custodianship Rule Alert */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 flex items-start gap-2.5">
        <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">
            DepEd Order No. 41, s. 2021 Receiving Rule:
          </div>
          <p className="text-[11px] leading-relaxed text-blue-900">
            The Delivery Receipt (DR) is evidence of what physically arrived at the depot. <strong>It is NOT final acceptance</strong>. Goods are placed into <strong>"FOR INSPECTION"</strong> status. Missing or defective items will not be inventoried or eligible for payment until the Inspectorate Team completes physical and specification inspection.
          </p>
        </div>
      </div>

      {/* DR / Manifest Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Supplier DR / Sales Invoice No. *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none focus:border-blue-500 font-mono font-bold text-slate-900"
            value={dr.invoiceNo}
            onChange={e => setDr({ ...dr, invoiceNo: e.target.value })}
            placeholder="e.g. INV-9923 or DR-1049"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Date Arrived at Depot *
          </label>
          <input
            type="date"
            className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none focus:border-blue-500"
            value={dr.invoiceDate}
            onChange={e => setDr({ ...dr, invoiceDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Receiving Custodian Officer *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none focus:border-blue-500 font-semibold text-slate-800"
            value={dr.receivedBy}
            onChange={e => setDr({ ...dr, receivedBy: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Delivery Tranche Classification *
          </label>
          <select
            className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none focus:border-blue-500 font-medium text-slate-800"
            value={dr.deliveryType}
            onChange={e => setDr({ ...dr, deliveryType: e.target.value as any })}
          >
            <option value="Partial">Partial Delivery (Tranche #{currentBatchNo})</option>
            <option value="Complete">Complete Delivery (100% of order)</option>
            <option value="Subsequent/Replacement">Replacement & Balance Delivery</option>
          </select>
        </div>
      </div>

      {/* Item Quantities Verification Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-slate-700" />
            <span className="font-bold text-slate-800 text-xs">
              Physical Receiving Count vs PO Contract Obligation
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Depot: {txn.po?.placeOfDelivery || txn.pr.office}
          </span>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
            <tr>
              <th className="p-3">Stock No. & Description</th>
              <th className="p-3 text-center w-28">PO Contract Qty</th>
              <th className="p-3 text-center w-32 bg-slate-50">Past Accepted</th>
              <th className="p-3 text-center w-40 bg-blue-50 text-blue-900">Physically Arrived Now *</th>
              <th className="p-3 text-center w-36">Remaining Undelivered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deliveryItems.map((item, idx) => {
              const remainingAfterCurrent = Math.max(
                0,
                item.orderedQty - item.previouslyAcceptedQty - item.currentDeliveredQty
              );

              return (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{item.desc}</span>
                    <span className="font-mono text-slate-400 text-[10px]">Stock #{item.stockNo}</span>
                  </td>
                  <td className="p-3 text-center font-bold text-slate-700 font-mono">
                    {item.orderedQty} {item.unit}
                  </td>
                  <td className="p-3 text-center font-bold text-emerald-700 font-mono bg-slate-50">
                    {item.previouslyAcceptedQty} {item.unit}
                  </td>
                  <td className="p-2 text-center bg-blue-50/40">
                    <div className="flex items-center justify-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max={item.orderedQty - item.previouslyAcceptedQty}
                        className="w-24 border border-blue-400 rounded-md p-1.5 text-center font-mono font-bold text-blue-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-2xs"
                        value={item.currentDeliveredQty}
                        onChange={e => handleQtyChange(idx, parseInt(e.target.value) || 0)}
                      />
                      <span className="text-[10px] text-blue-800 font-bold">{item.unit}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold font-mono">
                    <span className={remainingAfterCurrent > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700'}>
                      {remainingAfterCurrent} {item.unit}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Tranche Reconciliation Summary */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <div className="text-slate-600 font-medium">
            Physical Items Arriving on this DR: <strong className="text-blue-900 font-bold font-mono">{totalCurrentlyDelivered}</strong> units
            {isSubsequent && (
              <span className="ml-2 text-emerald-700 font-semibold">
                (Target Outstanding Balance: {totalRemainingTarget} units)
              </span>
            )}
          </div>
          <div className="text-slate-500 text-right">
            Total Contract Target: <strong className="text-slate-900 font-mono">{totalPOOrdered}</strong> units • Previously Accepted: <strong className="text-emerald-800 font-mono">{totalPastAccepted}</strong> units
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
        >
          Cancel
        </button>
        <button
          disabled={!dr.invoiceNo.trim() || totalCurrentlyDelivered === 0}
          onClick={handleConfirm}
          className="px-5 py-2 font-bold bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-sm cursor-pointer flex items-center gap-2"
        >
          <Truck size={14} /> Confirm Depot Physical Receipt & Route for Inspection
        </button>
      </div>
    </div>
  );
};
