import React, { useState } from 'react';
import { Scale, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Transaction,
  Supplier,
  ProcurementMode,
  SchoolProfile,
  Personnel,
  STATUS
} from '../../types';
import { MASTER_DATA } from '../../data/mockData';
import { numberToWords } from '../../utils/numberToWords';
import { validatePOAward } from '../../utils/formValidation';

interface ModalAwardPOProps {
  txn: Transaction;
  schoolProfile: SchoolProfile;
  supplierList: Supplier[];
  procurementModesList: ProcurementMode[];
  personnelList: Personnel[];
  onSave: (txnId: string, updates: Partial<Transaction>) => void;
  onClose: () => void;
}

export const ModalAwardPO: React.FC<ModalAwardPOProps> = ({
  txn,
  schoolProfile,
  supplierList,
  procurementModesList,
  personnelList,
  onSave,
  onClose
}) => {
  const selectedSupplierDefault = supplierList[0] || MASTER_DATA.suppliers[0];
  const [po, setPo] = useState({
    supplierId: selectedSupplierDefault?.id || 'S01',
    supplierAddress: selectedSupplierDefault?.address || 'Banale District, Pagadian City',
    mode: procurementModesList[0]?.name || 'Small Value Procurement (Negotiated Modality)',
    placeOfDelivery: `${schoolProfile.schoolName}, ${schoolProfile.address}`,
    deliveryDate: '2026-10-12',
    deliveryTerm: MASTER_DATA.deliveryTerms[1] || 'Within 15 calendar days upon receipt of PO',
    paymentTerm: MASTER_DATA.paymentTerms[0] || '30 calendar days upon complete inspection & IAR',
    paymentRule: 'partial_permitted' as 'partial_permitted' | 'full_lot_required',
    orsBursNo: `ORS-${new Date().getFullYear().toString().slice(-2)}-10-${Math.floor(Math.random() * 900 + 100)}`,
    orsDate: new Date().toISOString().split('T')[0],
    authorizedOfficial: schoolProfile.headOfProcuringEntity || personnelList[0]?.id || 'P01',
    accountantSignatory: personnelList.find(p => p.role.includes('Accountant'))?.id || 'P06'
  });

  const [poItems, setPoItems] = useState(
    txn.pr_items.map(item => ({ ...item, amount: item.totalCost }))
  );

  const totalAwarded = poItems.reduce((sum, item) => sum + item.amount, 0);

  const handleSupplierChange = (supId: string) => {
    const sup = supplierList.find(s => s.id === supId);
    setPo({
      ...po,
      supplierId: supId,
      supplierAddress: sup?.address || 'Pagadian City'
    });
  };

  const validation = validatePOAward(po, poItems);

  const handleSave = () => {
    if (!validation.isValid) return;

    const year = new Date().getFullYear();
    const poNum = `PO-${year}-${Math.floor(Math.random() * 900 + 100)}`;
    const selectedSupplier = supplierList.find(s => s.id === po.supplierId);
    const now = new Date().toISOString();

    const newAuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: now,
      action: 'Purchase Order Awarded (Appendix 61)',
      actor: 'Supply Officer / Property Custodian',
      version: txn.version || 'v1.0',
      notes: `Awarded ${poNum} to ${selectedSupplier?.name || 'Accredited Supplier'} via ${po.mode}. Contract sum: ₱${totalAwarded.toLocaleString()}`
    };

    const updatedSnapshots = {
      schoolProfile: txn.snapshots?.schoolProfile || {
        schoolName: schoolProfile.schoolName,
        schoolId: schoolProfile.schoolId,
        regionDivision: schoolProfile.regionDivision,
        address: schoolProfile.address,
        uacsCode: schoolProfile.uacsCode
      },
      rcc: txn.pr.responsibilityCenterCode,
      fundCluster: txn.pr.fundCluster,
      signatories: {
        requestedByName: txn.snapshots?.signatories.requestedByName || txn.pr.requestedBy,
        requestedByDesignation: txn.snapshots?.signatories.requestedByDesignation || 'Requisitioning Officer',
        approvedByName: schoolProfile.headOfProcuringEntity,
        approvedByDesignation: 'Secondary School Principal IV (HOPE)'
      },
      supplier: selectedSupplier ? {
        id: selectedSupplier.id,
        name: selectedSupplier.name,
        tin: selectedSupplier.tin,
        address: selectedSupplier.address
      } : undefined,
      legalFramework: 'RA 12009 / RA 9184 Standard Contract Rules',
      legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009 Contract Requirements',
      templateVersion: 'GAM Vol. II Appendix 61 (COA Circular 2015-007)',
      procurementMode: po.mode,
      snapshotTimestamp: now
    };

    onSave(txn.id, {
      status: STATUS.PENDING_DELIVERY,
      isLocked: true,
      lockReason: 'Official Purchase Order Contract Awarded and Committed',
      lastSavedTimestamp: now,
      isSimulated: false,
      auditHistory: [newAuditEntry, ...(txn.auditHistory || [])],
      snapshots: updatedSnapshots,
      po: {
        no: poNum,
        date: new Date().toISOString().split('T')[0],
        amountInWords: numberToWords(totalAwarded),
        ...po
      },
      po_items: poItems
    });
  };

  return (
    <div className="space-y-4 text-xs w-full">
      <div className="border-b border-slate-100 pb-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Award Purchase Order</h2>
          <span className="text-[10px] font-mono px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">
            APPENDIX 61 (GAM VOL II)
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">Generating official contract award for {txn.pr.no}</p>
      </div>

      {/* DepEd Prescribed Contract Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Awarded Supplier (Merchant Registry) *
          </label>
          <select
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-semibold"
            value={po.supplierId}
            onChange={e => handleSupplierChange(e.target.value)}
          >
            {supplierList.map(s => (
              <option key={s.id} value={s.id}>{s.name} (TIN: {s.tin})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Supplier Registered Business Address *
          </label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400"
            value={po.supplierAddress}
            onChange={e => setPo({ ...po, supplierAddress: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Procurement Mode *
          </label>
          <select
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-medium"
            value={po.mode}
            onChange={e => setPo({ ...po, mode: e.target.value })}
          >
            {procurementModesList.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Place of Delivery *
          </label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400"
            value={po.placeOfDelivery}
            onChange={e => setPo({ ...po, placeOfDelivery: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Delivery Term *
          </label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400"
            value={po.deliveryTerm}
            onChange={e => setPo({ ...po, deliveryTerm: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Payment Term *
          </label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400"
            value={po.paymentTerm}
            onChange={e => setPo({ ...po, paymentTerm: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            ORS / BURS Obligation Number *
          </label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-mono"
            value={po.orsBursNo}
            onChange={e => setPo({ ...po, orsBursNo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Chief Accountant Signatory *
          </label>
          <select
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-medium"
            value={po.accountantSignatory}
            onChange={e => setPo({ ...po, accountantSignatory: e.target.value })}
          >
            {personnelList.filter(p => p.role.includes('Accountant') || p.designation.includes('Accountant') || p.role.includes('Admin')).map(p => (
              <option key={p.id} value={p.id}>{p.name} - {p.designation}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contract Line Items */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200">
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Awarded Contract Line Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
              <tr>
                <th className="p-3 w-28">Stock No.</th>
                <th className="p-3">Item Description</th>
                <th className="p-3 w-28 text-center">Quantity</th>
                <th className="p-3 w-32 text-right">Award Unit Cost</th>
                <th className="p-3 w-36 text-right">Contract Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {poItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-slate-600">{item.stockNo}</td>
                  <td className="p-3 font-medium text-slate-800">{item.desc}</td>
                  <td className="p-3 text-center text-slate-600 font-semibold">{item.qty} {item.unit}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      className="w-full border border-slate-200 rounded-md text-xs p-1.5 text-right outline-none focus:border-slate-400 bg-slate-50 focus:bg-white font-medium"
                      value={item.unitCost}
                      onChange={e => {
                        const n = [...poItems];
                        n[idx].unitCost = parseFloat(e.target.value) || 0;
                        n[idx].amount = n[idx].unitCost * n[idx].qty;
                        setPoItems(n);
                      }}
                    />
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 font-mono text-xs">
                    ₱{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <p className="text-xs text-slate-500 font-mono tracking-tight">
            Amount in Words: <strong className="text-slate-800">{numberToWords(totalAwarded)}</strong>
          </p>
          <div className="text-right">
            <span className="text-slate-500 text-xs font-semibold mr-2">Total Contract Sum:</span>
            <span className="text-base font-bold text-slate-900 font-mono">₱{totalAwarded.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* COA Mandatory Liquidated Damages Clause */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
        <Scale size={14} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <span>
          <strong>DepEd & COA Liquidated Damages Clause:</strong> In case of failure to make the full delivery within the time specified above, a penalty of one-tenth (1/10) of one percent for every day of delay shall be imposed on the undelivered item/s.
        </span>
      </div>

      {/* Explanatory Validation Summary Strip */}
      <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
        validation.isValid
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-rose-50/90 border-rose-200 text-rose-900'
      }`}>
        <div className="flex items-center gap-2 flex-1">
          {validation.isValid ? (
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
          )}
          <span className="font-medium">
            {validation.summaryMessage}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200 flex-shrink-0">
          {validation.isValid ? 'READY' : `${validation.missingFields.length} MISSING`}
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!validation.isValid}
          title={validation.isValid ? 'Award official Appendix 61 PO contract' : validation.summaryMessage}
          className="px-4 py-1.5 font-semibold bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer transition-all"
        >
          Generate Appendix 61 PO
        </button>
      </div>
    </div>
  );
};
