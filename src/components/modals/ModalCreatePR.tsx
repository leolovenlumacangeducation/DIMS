import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  SchoolProfile,
  Station,
  FundSource,
  Personnel,
  MasterCatalogItem,
  UnitOfMeasure,
  Transaction,
  STATUS
} from '../../types';
import { numberToWords } from '../../utils/numberToWords';
import { validatePRCreation } from '../../utils/formValidation';

interface ModalCreatePRProps {
  schoolProfile: SchoolProfile;
  stationsList: Station[];
  fundSources: FundSource[];
  personnelList: Personnel[];
  masterItemList: MasterCatalogItem[];
  uomList: UnitOfMeasure[];
  onSave: (newTxn: Transaction) => void;
  onClose: () => void;
}

export const ModalCreatePR: React.FC<ModalCreatePRProps> = ({
  schoolProfile,
  stationsList,
  fundSources,
  personnelList,
  masterItemList,
  uomList,
  onSave,
  onClose
}) => {
  const [pr, setPr] = useState({
    office: stationsList[1]?.name || 'Admin',
    fundCluster: fundSources[0]?.name || schoolProfile.defaultFundCluster,
    responsibilityCenterCode: schoolProfile.uacsCode,
    purpose: '',
    requestedBy: personnelList[1]?.id || 'P02',
    approvedBy: personnelList.find(p => p.role === 'School Head')?.id || personnelList[0]?.id || 'P01'
  });

  const [items, setItems] = useState([
    { id: 1, stockNo: 'OS-001', desc: 'Bond Paper A4, 70gsm', qty: 10, unit: 'ream', unitCost: 250, totalCost: 2500 }
  ]);

  const getItemDetails = (stockNo: string) => {
    return masterItemList.find(i => i.stockNo.toLowerCase() === stockNo.toLowerCase());
  };

  const handleItemChange = (idx: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === 'stockNo') {
      const itemMaster = getItemDetails(value as string);
      if (itemMaster) {
        newItems[idx] = {
          ...newItems[idx],
          stockNo: value as string,
          desc: itemMaster.desc,
          unit: itemMaster.defaultUnit,
          unitCost: itemMaster.estimatedCost,
          totalCost: newItems[idx].qty * itemMaster.estimatedCost
        };
      } else {
        newItems[idx] = { ...newItems[idx], stockNo: value as string };
      }
    } else {
      (newItems[idx] as any)[field] = value;
      if (field === 'qty' || field === 'unitCost') {
        const qty = field === 'qty' ? (parseInt(value as string) || 0) : newItems[idx].qty;
        const cost = field === 'unitCost' ? (parseFloat(value as string) || 0) : newItems[idx].unitCost;
        newItems[idx].totalCost = qty * cost;
      }
    }
    setItems(newItems);
  };

  const totalEstimatedCost = items.reduce((sum, item) => sum + item.totalCost, 0);

  // Real-time pre-submission validation
  const validation = validatePRCreation(pr, items);

  const handleSubmit = () => {
    if (!validation.isValid) return;

    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 900 + 100);
    const requestedPerson = personnelList.find(p => p.id === pr.requestedBy);
    const approvedPerson = personnelList.find(p => p.id === pr.approvedBy);
    const now = new Date().toISOString();

    const newTxn: Transaction = {
      id: `TXN-${Date.now()}`,
      version: 'v1.0',
      isLocked: false,
      lastSavedTimestamp: now,
      isSimulated: false,
      auditHistory: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: now,
          action: 'Purchase Request Created (Appendix 60)',
          actor: requestedPerson ? `${requestedPerson.name} (${requestedPerson.designation})` : 'Requisitioning Officer',
          version: 'v1.0',
          notes: `Requisition created for ${items.length} line item(s). Total estimated cost: ₱${totalEstimatedCost.toLocaleString()}`
        }
      ],
      snapshots: {
        schoolProfile: {
          schoolName: schoolProfile.schoolName,
          schoolId: schoolProfile.schoolId,
          regionDivision: schoolProfile.regionDivision,
          address: schoolProfile.address,
          uacsCode: schoolProfile.uacsCode
        },
        rcc: pr.responsibilityCenterCode,
        fundCluster: pr.fundCluster,
        signatories: {
          requestedByName: requestedPerson?.name || 'Requisitioning Officer',
          requestedByDesignation: requestedPerson?.designation || 'Teacher / Dept Head',
          approvedByName: approvedPerson?.name || schoolProfile.headOfProcuringEntity,
          approvedByDesignation: approvedPerson?.designation || 'Secondary School Principal IV'
        },
        legalFramework: 'RA 12009 (New Government Procurement Act) / GAM Vol. II',
        legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009 & Approved IRR',
        templateVersion: 'GAM Vol. II Appendix 60 (COA Circular 2015-007)',
        snapshotTimestamp: now
      },
      pr: {
        no: `PR-${year}-10-${seq}`,
        date: new Date().toISOString().split('T')[0],
        ...pr
      },
      pr_items: items,
      status: STATUS.PENDING_PO,
      po: null,
      po_items: null,
      deliveries: [],
      dr: null,
      iar: null,
      iar_items: null
    };
    onSave(newTxn);
  };

  return (
    <div className="space-y-4 text-xs w-full">
      <div className="border-b border-slate-100 pb-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">New Purchase Request</h2>
          <span className="text-[10px] font-mono px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold">
            APPENDIX 60 (GAM VOL II)
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">{schoolProfile.schoolName} • School ID: {schoolProfile.schoolId}</p>
      </div>

      {/* DepEd Mandatory Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Office / Section *
          </label>
          <select
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-medium"
            value={pr.office}
            onChange={e => setPr({ ...pr, office: e.target.value })}
          >
            {stationsList.map(s => (
              <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Fund Cluster *
          </label>
          <select
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-medium"
            value={pr.fundCluster}
            onChange={e => setPr({ ...pr, fundCluster: e.target.value })}
          >
            {fundSources.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Responsibility Center Code (RCC) *
          </label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-mono"
            value={pr.responsibilityCenterCode}
            onChange={e => setPr({ ...pr, responsibilityCenterCode: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Approving Official (HOPE) *
          </label>
          <select
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-medium"
            value={pr.approvedBy}
            onChange={e => setPr({ ...pr, approvedBy: e.target.value })}
          >
            {personnelList.filter(p => p.role.includes('Head') || p.role.includes('Principal') || p.role.includes('Admin')).map(p => (
              <option key={p.id} value={p.id}>{p.name} - {p.designation}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Purpose / Operational Justification *
          </label>
          <input
            type="text"
            placeholder="Specific educational justification (e.g. Conduct of 3rd Quarter Periodical Examinations, Grade 10 Science lab classes...)"
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 placeholder:text-slate-400"
            value={pr.purpose}
            onChange={e => setPr({ ...pr, purpose: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Requesting Official *
          </label>
          <select
            className="w-full border border-slate-200 rounded-md text-xs bg-white p-2 outline-none focus:border-slate-400 font-medium"
            value={pr.requestedBy}
            onChange={e => setPr({ ...pr, requestedBy: e.target.value })}
          >
            {personnelList.map(p => (
              <option key={p.id} value={p.id}>{p.name} - {p.designation}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Requisition Items & Technical Specifications
          </span>
          <button
            onClick={() => setItems([...items, { id: Date.now(), stockNo: '', desc: '', qty: 1, unit: 'pc', unitCost: 0, totalCost: 0 }])}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold cursor-pointer shadow-2xs"
          >
            <Plus size={12} /> Add Item
          </button>
        </div>

        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50/50">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Stock No."
                  className="w-full border border-slate-200 rounded-md text-[11px] bg-white p-1.5 outline-none font-mono focus:border-slate-400"
                  value={item.stockNo}
                  onChange={e => handleItemChange(idx, 'stockNo', e.target.value)}
                />
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="Detailed Item Description & Specification *"
                  className="w-full border border-slate-200 rounded-md text-xs bg-white p-1.5 outline-none focus:border-slate-400 font-medium"
                  value={item.desc}
                  onChange={e => handleItemChange(idx, 'desc', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <select
                  className="w-full border border-slate-200 rounded-md text-[11px] bg-white p-1.5 outline-none focus:border-slate-400"
                  value={item.unit}
                  onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                >
                  {uomList.map(u => (
                    <option key={u.code} value={u.code}>{u.code}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  className="w-full border border-slate-200 rounded-md text-xs bg-white p-1.5 outline-none text-center focus:border-slate-400 font-semibold"
                  value={item.qty}
                  onChange={e => handleItemChange(idx, 'qty', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <input
                  type="number"
                  placeholder="Cost"
                  min="0"
                  className="w-full border border-slate-200 rounded-md text-xs bg-white p-1.5 outline-none text-right focus:border-slate-400 font-mono"
                  value={item.unitCost || ''}
                  onChange={e => handleItemChange(idx, 'unitCost', e.target.value)}
                />
              </div>
              <div className="col-span-1 text-center">
                {items.length > 1 && (
                  <button
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    title="Remove Item"
                    className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">
            Amount in Words: <strong className="text-slate-800">{numberToWords(totalEstimatedCost)}</strong>
          </span>
          <div className="text-right">
            <span className="text-slate-500 mr-2 text-xs font-semibold">Total Estimated Amount:</span>
            <span className="text-base font-bold text-slate-900 font-mono">₱{totalEstimatedCost.toLocaleString()}</span>
          </div>
        </div>
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

      {/* Form Action Controls */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 items-center">
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!validation.isValid}
          title={validation.isValid ? 'Submit official Appendix 60 PR' : validation.summaryMessage}
          className="px-4 py-1.5 font-semibold bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer transition-all"
        >
          Submit Appendix 60 PR
        </button>
      </div>
    </div>
  );
};
