import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Personnel,
  Supplier,
  MasterCatalogItem,
  UsefulLifeSchedule,
  UacsCode,
  Station,
  StorageBin,
  DepEdForm,
  FundSource,
  ProcurementMode,
  UnitOfMeasure
} from '../../types';
import { MASTER_DATA } from '../../data/mockData';

interface AddMasterDataModalsProps {
  // Active modal flags
  addPersonnelModal: boolean;
  setAddPersonnelModal: (open: boolean) => void;
  onAddPersonnel: (person: Omit<Personnel, 'id'>) => void;

  addSupplierModal: boolean;
  setAddSupplierModal: (open: boolean) => void;
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;

  addItemModal: boolean;
  setAddItemModal: (open: boolean) => void;
  onAddItem: (item: Omit<MasterCatalogItem, 'id'>) => void;

  addUsefulLifeModal: boolean;
  setAddUsefulLifeModal: (open: boolean) => void;
  onAddUsefulLife: (ul: Omit<UsefulLifeSchedule, 'id'>) => void;

  addUacsModal: boolean;
  setAddUacsModal: (open: boolean) => void;
  onAddUacs: (uacs: Omit<UacsCode, 'id'>) => void;

  addStationModal: boolean;
  setAddStationModal: (open: boolean) => void;
  onAddStation: (station: Omit<Station, 'id'>) => void;

  addBinModal: boolean;
  setAddBinModal: (open: boolean) => void;
  onAddBin: (bin: Omit<StorageBin, 'id'>) => void;

  addFormModal: boolean;
  setAddFormModal: (open: boolean) => void;
  onAddForm: (form: Omit<DepEdForm, 'id'>) => void;

  addFundSourceModal: boolean;
  setAddFundSourceModal: (open: boolean) => void;
  onAddFundSource: (fs: Omit<FundSource, 'id'>) => void;

  addProcurementModeModal: boolean;
  setAddProcurementModeModal: (open: boolean) => void;
  onAddProcurementMode: (pm: Omit<ProcurementMode, 'id'>) => void;

  addUomModal: boolean;
  setAddUomModal: (open: boolean) => void;
  onAddUom: (uom: Omit<UnitOfMeasure, 'id'>) => void;
}

export const AddMasterDataModals: React.FC<AddMasterDataModalsProps> = ({
  addPersonnelModal,
  setAddPersonnelModal,
  onAddPersonnel,
  addSupplierModal,
  setAddSupplierModal,
  onAddSupplier,
  addItemModal,
  setAddItemModal,
  onAddItem,
  addUsefulLifeModal,
  setAddUsefulLifeModal,
  onAddUsefulLife,
  addUacsModal,
  setAddUacsModal,
  onAddUacs,
  addStationModal,
  setAddStationModal,
  onAddStation,
  addBinModal,
  setAddBinModal,
  onAddBin,
  addFormModal,
  setAddFormModal,
  onAddForm,
  addFundSourceModal,
  setAddFundSourceModal,
  onAddFundSource,
  addProcurementModeModal,
  setAddProcurementModeModal,
  onAddProcurementMode,
  addUomModal,
  setAddUomModal,
  onAddUom
}) => {
  // Local states for inputs
  const [newPersonnel, setNewPersonnel] = useState({ name: '', role: '', designation: '' });
  const [newSupplier, setNewSupplier] = useState({ name: '', tin: '', address: '' });
  const [newItem, setNewItem] = useState({ stockNo: '', desc: '', defaultUnit: 'pc', estimatedCost: 0 });
  const [newUsefulLife, setNewUsefulLife] = useState({ assetClass: '', lifeYears: 5, depreciationMethod: 'Straight Line', salvageValuePct: 5 });
  const [newUacs, setNewUacs] = useState({ code: '', title: '', type: 'Consumable Supplies', formRef: 'Appx 60 / 63' });
  const [newStation, setNewStation] = useState({ name: '', code: '', custodian: '', location: '' });
  const [newBin, setNewBin] = useState({ code: '', description: '', room: 'Supply Depot Room 101' });
  const [newForm, setNewForm] = useState<Omit<DepEdForm, 'id'>>({
    appendixNumber: '',
    officialTitle: '',
    sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016',
    effectiveDate: '2016-01-01',
    legalBasis: 'DepEd Order No. 41, s. 2021',
    templateStatus: 'For Validation',
    lastValidationDate: new Date().toISOString().split('T')[0],
    notes: 'Prescribed DepEd procurement form.',
    prefix: '',
    currentSeq: 1,
    lifecycle: 'Requisition / Issuance',
    retention: '10 Years',
    appendix: '',
    name: '',
    formRef: 'GAM Vol II'
  });
  const [newFundSource, setNewFundSource] = useState({ name: '', cluster: '01 - Regular Agency Fund', active: true });
  const [newProcurementMode, setNewProcurementMode] = useState({ name: '', maxLimit: 1000000, quotationReq: '3 Price Quotations', basis: 'RA 9184 Revised IRR' });
  const [newUom, setNewUom] = useState({ code: '', name: '', category: 'General Consumables', standardQty: '1 pc' });

  return (
    <>
      {/* 1. Add Personnel Modal */}
      {addPersonnelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddPersonnelModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddPersonnelModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add School Personnel</h3>
                <p className="text-[11px] text-slate-500">Register new signatory for official procurement documents.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Personnel Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Clara O. Santos"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newPersonnel.name}
                    onChange={e => setNewPersonnel({ ...newPersonnel, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Role / Function</label>
                  <input
                    type="text"
                    placeholder="e.g. Inspector, Supply Custodian, BAC Chair"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newPersonnel.role}
                    onChange={e => setNewPersonnel({ ...newPersonnel, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Official Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Teacher III, Master Teacher I, Admin Officer II"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newPersonnel.designation}
                    onChange={e => setNewPersonnel({ ...newPersonnel, designation: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddPersonnelModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newPersonnel.name.trim()) return;
                    onAddPersonnel(newPersonnel);
                    setNewPersonnel({ name: '', role: '', designation: '' });
                    setAddPersonnelModal(false);
                  }}
                  disabled={!newPersonnel.name.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Personnel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Supplier Modal */}
      {addSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddSupplierModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddSupplierModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Accredited Supplier</h3>
                <p className="text-[11px] text-slate-500">Register verified merchant for Purchase Orders.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company / Supplier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mindanao Tech & Office Solutions"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newSupplier.name}
                    onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">TIN (Taxpayer Identification No.)</label>
                  <input
                    type="text"
                    placeholder="e.g. 456-789-012-000"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                    value={newSupplier.tin}
                    onChange={e => setNewSupplier({ ...newSupplier, tin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Business Address (Required for Appendix 61 PO)</label>
                  <input
                    type="text"
                    placeholder="e.g. F.S. Pajares Avenue, San Pedro District, Pagadian City"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newSupplier.address}
                    onChange={e => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddSupplierModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newSupplier.name.trim()) return;
                    onAddSupplier(newSupplier);
                    setNewSupplier({ name: '', tin: '', address: '' });
                    setAddSupplierModal(false);
                  }}
                  disabled={!newSupplier.name.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Item Modal */}
      {addItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddItemModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddItemModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Catalog Stock Item</h3>
                <p className="text-[11px] text-slate-500">Add standard stock item with estimated cost.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Stock No. / Item Code</label>
                  <input
                    type="text"
                    placeholder="e.g. IT-005 or OS-008"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                    value={newItem.stockNo}
                    onChange={e => setNewItem({ ...newItem, stockNo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Item Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Flash Drive 64GB USB 3.0"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newItem.desc}
                    onChange={e => setNewItem({ ...newItem, desc: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Default Unit</label>
                    <select
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                      value={newItem.defaultUnit}
                      onChange={e => setNewItem({ ...newItem, defaultUnit: e.target.value })}
                    >
                      {MASTER_DATA.units.map((u: string) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estimated Cost (₱)</label>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                      value={newItem.estimatedCost || ''}
                      onChange={e => setNewItem({ ...newItem, estimatedCost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddItemModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newItem.desc.trim()) return;
                    onAddItem(newItem);
                    setNewItem({ stockNo: '', desc: '', defaultUnit: 'pc', estimatedCost: 0 });
                    setAddItemModal(false);
                  }}
                  disabled={!newItem.desc.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Useful Life Modal */}
      {addUsefulLifeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddUsefulLifeModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddUsefulLifeModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Service Life Schedule</h3>
                <p className="text-[11px] text-slate-500">Configure depreciation schedule for DepEd asset category.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Asset Category / Class</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Laboratory Equipment"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newUsefulLife.assetClass}
                    onChange={e => setNewUsefulLife({ ...newUsefulLife, assetClass: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Useful Life (Years)</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs text-center"
                      value={newUsefulLife.lifeYears}
                      onChange={e => setNewUsefulLife({ ...newUsefulLife, lifeYears: Number(e.target.value) || 5 })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Salvage Value (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs text-center"
                      value={newUsefulLife.salvageValuePct}
                      onChange={e => setNewUsefulLife({ ...newUsefulLife, salvageValuePct: Number(e.target.value) || 5 })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddUsefulLifeModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newUsefulLife.assetClass.trim()) return;
                    onAddUsefulLife(newUsefulLife);
                    setNewUsefulLife({ assetClass: '', lifeYears: 5, depreciationMethod: 'Straight Line', salvageValuePct: 5 });
                    setAddUsefulLifeModal(false);
                  }}
                  disabled={!newUsefulLife.assetClass.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add UACS Modal */}
      {addUacsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddUacsModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddUacsModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add UACS Expense Object</h3>
                <p className="text-[11px] text-slate-500">GAM Volume II unified accounting object code.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">UACS Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-02-03-090"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                    value={newUacs.code}
                    onChange={e => setNewUacs({ ...newUacs, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Object Title / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Fuel, Oil and Lubricants Expense"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newUacs.title}
                    onChange={e => setNewUacs({ ...newUacs, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Classification Type</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newUacs.type}
                    onChange={e => setNewUacs({ ...newUacs, type: e.target.value })}
                  >
                    <option value="Consumable Supplies">Consumable Supplies</option>
                    <option value="Semi-Expendable (≤ ₱50k)">Semi-Expendable (≤ ₱50k)</option>
                    <option value="Capital Property (> ₱50k)">Capital Property (&gt; ₱50k)</option>
                    <option value="Operating Expense">Operating Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">GAM Form Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Appx 60 / Appx 63"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                    value={newUacs.formRef}
                    onChange={e => setNewUacs({ ...newUacs, formRef: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddUacsModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newUacs.code.trim() || !newUacs.title.trim()) return;
                    onAddUacs(newUacs);
                    setNewUacs({ code: '', title: '', type: 'Consumable Supplies', formRef: 'Appx 60 / 63' });
                    setAddUacsModal(false);
                  }}
                  disabled={!newUacs.code.trim() || !newUacs.title.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add UACS Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Add Station Modal */}
      {addStationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddStationModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddStationModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Office / Station</h3>
                <p className="text-[11px] text-slate-500">Register station for Requisition Slips (RIS/ICS/PAR).</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Station / Department Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior High STEM Laboratory"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newStation.name}
                    onChange={e => setNewStation({ ...newStation, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Station Code</label>
                  <input
                    type="text"
                    placeholder="e.g. LAB-STEM"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                    value={newStation.code}
                    onChange={e => setNewStation({ ...newStation, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Accountable Custodian / Teacher</label>
                  <input
                    type="text"
                    placeholder="e.g. STEM Coordinator"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newStation.custodian}
                    onChange={e => setNewStation({ ...newStation, custodian: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Campus Physical Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior High Building, Room 204"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newStation.location}
                    onChange={e => setNewStation({ ...newStation, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddStationModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newStation.name.trim()) return;
                    onAddStation(newStation);
                    setNewStation({ name: '', code: '', custodian: '', location: '' });
                    setAddStationModal(false);
                  }}
                  disabled={!newStation.name.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Station
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add Storage Bin Modal */}
      {addBinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddBinModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddBinModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Storage Bin / Shelf</h3>
                <p className="text-[11px] text-slate-500">Define physical bin code for annual count (RPCI).</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bin / Shelf Code</label>
                  <input
                    type="text"
                    placeholder="e.g. BIN-B3 or RACK-SC2"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                    value={newBin.code}
                    onChange={e => setNewBin({ ...newBin, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Storage Item Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Cleaning & Maintenance Chemicals"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newBin.description}
                    onChange={e => setNewBin({ ...newBin, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Facility / Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Supply Depot Room 101"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newBin.room}
                    onChange={e => setNewBin({ ...newBin, room: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddBinModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newBin.code.trim() || !newBin.description.trim()) return;
                    onAddBin(newBin);
                    setNewBin({ code: '', description: '', room: 'Supply Depot Room 101' });
                    setAddBinModal(false);
                  }}
                  disabled={!newBin.code.trim() || !newBin.description.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Storage Bin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Add Form Modal */}
      {addFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddFormModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddFormModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Prescribed Form / Appendix</h3>
                <p className="text-[11px] text-slate-500">Configure GAM Volume II document sequence & lifecycle.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Prescribed Appendix</label>
                    <input
                      type="text"
                      placeholder="e.g. Appendix 68"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                      value={newForm.appendix}
                      onChange={e => setNewForm({ ...newForm, appendix: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Document Prefix</label>
                    <input
                      type="text"
                      placeholder="e.g. RSMI-2026-"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                      value={newForm.prefix}
                      onChange={e => setNewForm({ ...newForm, prefix: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Form Name / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Report of Supplies and Materials Issued (RSMI)"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newForm.name}
                    onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Next Sequence #</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs text-center"
                      value={newForm.currentSeq}
                      onChange={e => setNewForm({ ...newForm, currentSeq: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">COA Retention</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Years"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                      value={newForm.retention}
                      onChange={e => setNewForm({ ...newForm, retention: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lifecycle Stage</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newForm.lifecycle}
                    onChange={e => setNewForm({ ...newForm, lifecycle: e.target.value })}
                  >
                    <option value="Procurement / Requisition">Procurement / Requisition</option>
                    <option value="Contract / Awarding">Contract / Awarding</option>
                    <option value="Delivery & Inspection Verification">Delivery & Inspection Verification</option>
                    <option value="Requisition / Issuance">Requisition / Issuance</option>
                    <option value="Custody & Property Tracking">Custody & Property Tracking</option>
                    <option value="Physical Inventory & Audit">Physical Inventory & Audit</option>
                    <option value="Disposal & Condemnation">Disposal & Condemnation</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddFormModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const title = newForm.officialTitle?.trim() || newForm.name?.trim() || '';
                    const appx = newForm.appendixNumber?.trim() || newForm.appendix?.trim() || '';
                    if (!appx || !title) return;
                    onAddForm({
                      ...newForm,
                      appendixNumber: appx,
                      officialTitle: title,
                      appendix: appx,
                      name: title
                    });
                    setNewForm({
                      appendixNumber: '',
                      officialTitle: '',
                      sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
                      sourceVersionDate: 'January 1, 2016',
                      effectiveDate: '2016-01-01',
                      legalBasis: 'DepEd Order No. 41, s. 2021',
                      templateStatus: 'For Validation',
                      lastValidationDate: new Date().toISOString().split('T')[0],
                      notes: 'Prescribed DepEd procurement form.',
                      prefix: '',
                      currentSeq: 1,
                      lifecycle: 'Requisition / Issuance',
                      retention: '10 Years',
                      appendix: '',
                      name: '',
                      formRef: 'GAM Vol II'
                    });
                    setAddFormModal(false);
                  }}
                  disabled={!(newForm.appendixNumber?.trim() || newForm.appendix?.trim()) || !(newForm.officialTitle?.trim() || newForm.name?.trim())}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Register Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Add Fund Source Modal */}
      {addFundSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddFundSourceModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddFundSourceModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add School Fund Source</h3>
                <p className="text-[11px] text-slate-500">Register new appropriation account (e.g. MOOE, SEF, PTA, Canteen).</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fund Source Name / Account</label>
                  <input
                    type="text"
                    placeholder="e.g. PTA Voluntary Special Project Fund"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newFundSource.name}
                    onChange={e => setNewFundSource({ ...newFundSource, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fund Cluster Code (UACS)</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newFundSource.cluster}
                    onChange={e => setNewFundSource({ ...newFundSource, cluster: e.target.value })}
                  >
                    <option value="01 - Regular Agency Fund">01 - Regular Agency Fund (National DepEd)</option>
                    <option value="03 - Special Account - Locally Funded">03 - Special Account (SEF - Local Government)</option>
                    <option value="07 - Trust Receipts / Canteen">07 - Trust Receipts (School Canteen & Rentals)</option>
                    <option value="08 - Special Trust Fund">08 - Special Trust Fund (Donations / Brigada)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddFundSourceModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newFundSource.name.trim()) return;
                    onAddFundSource(newFundSource);
                    setNewFundSource({ name: '', cluster: '01 - Regular Agency Fund', active: true });
                    setAddFundSourceModal(false);
                  }}
                  disabled={!newFundSource.name.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Fund Source
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Add Procurement Mode Modal */}
      {addProcurementModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddProcurementModeModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddProcurementModeModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Procurement Mode (RA 9184)</h3>
                <p className="text-[11px] text-slate-500">Configure procurement method, statutory limit, and quotation rules.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Procurement Mode Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Negotiated Procurement - Emergency Cases"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newProcurementMode.name}
                    onChange={e => setNewProcurementMode({ ...newProcurementMode, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Threshold Cap (₱)</label>
                    <input
                      type="number"
                      placeholder="0 (Unlimited)"
                      min="0"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                      value={newProcurementMode.maxLimit || ''}
                      onChange={e => setNewProcurementMode({ ...newProcurementMode, maxLimit: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quotation Req.</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Quotations"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                      value={newProcurementMode.quotationReq}
                      onChange={e => setNewProcurementMode({ ...newProcurementMode, quotationReq: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Legal Basis / IRR Annex</label>
                  <input
                    type="text"
                    placeholder="e.g. RA 9184 Sec. 53.2"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                    value={newProcurementMode.basis}
                    onChange={e => setNewProcurementMode({ ...newProcurementMode, basis: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddProcurementModeModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newProcurementMode.name.trim()) return;
                    onAddProcurementMode(newProcurementMode);
                    setNewProcurementMode({ name: '', maxLimit: 1000000, quotationReq: '3 Price Quotations', basis: 'RA 9184 Revised IRR' });
                    setAddProcurementModeModal(false);
                  }}
                  disabled={!newProcurementMode.name.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Procurement Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. Add UOM Modal */}
      {addUomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setAddUomModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setAddUomModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Unit of Measure</h3>
                <p className="text-[11px] text-slate-500">Standardize item packaging and requisition packaging.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">UOM Code</label>
                    <input
                      type="text"
                      placeholder="e.g. tub or can"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 font-mono text-xs"
                      value={newUom.code}
                      onChange={e => setNewUom({ ...newUom, code: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Standard Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Canister (500g)"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                      value={newUom.name}
                      onChange={e => setNewUom({ ...newUom, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Supplies Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Kitchen & Canteen Supplies"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newUom.category}
                    onChange={e => setNewUom({ ...newUom, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Standard Item Count / Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 can contains 500 grams net"
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-slate-400 text-xs"
                    value={newUom.standardQty}
                    onChange={e => setNewUom({ ...newUom, standardQty: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAddUomModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newUom.code.trim() || !newUom.name.trim()) return;
                    onAddUom(newUom);
                    setNewUom({ code: '', name: '', category: 'General Consumables', standardQty: '1 pc' });
                    setAddUomModal(false);
                  }}
                  disabled={!newUom.code.trim() || !newUom.name.trim()}
                  className="px-4 py-1.5 font-medium bg-slate-900 disabled:opacity-50 text-white hover:bg-slate-800 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Add Unit of Measure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
