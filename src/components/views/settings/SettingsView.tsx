import React, { useState } from 'react';
import {
  Building2,
  UserCircle,
  FileCheck,
  Scale,
  Landmark,
  Layers,
  Truck,
  Package,
  Tag,
  Save,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import {
  SchoolProfile,
  Personnel,
  DepEdForm,
  ThresholdRules,
  UsefulLifeSchedule,
  UacsCode,
  FundSource,
  Station,
  StorageBin,
  Supplier,
  ProcurementMode,
  MasterCatalogItem,
  UnitOfMeasure
} from '../../../types';

export type SettingsSubTab =
  | 'profile'
  | 'personnel'
  | 'forms'
  | 'thresholds'
  | 'uacs'
  | 'stations'
  | 'suppliers'
  | 'items'
  | 'uom';

interface SettingsViewProps {
  schoolProfile: SchoolProfile;
  setSchoolProfile: React.Dispatch<React.SetStateAction<SchoolProfile>>;
  personnelList: Personnel[];
  onOpenAddPersonnel: () => void;
  onDeletePersonnel: (id: string) => void;
  depedFormsList: DepEdForm[];
  onOpenAddForm: () => void;
  onDeleteForm: (id: string) => void;
  thresholdRules: ThresholdRules;
  setThresholdRules: React.Dispatch<React.SetStateAction<ThresholdRules>>;
  usefulLifeList: UsefulLifeSchedule[];
  onOpenAddUsefulLife: () => void;
  onDeleteUsefulLife: (id: string) => void;
  uacsList: UacsCode[];
  onOpenAddUacs: () => void;
  onDeleteUacs: (id: string) => void;
  fundSources: FundSource[];
  onOpenAddFundSource: () => void;
  onDeleteFundSource: (id: string) => void;
  stationsList: Station[];
  onOpenAddStation: () => void;
  onDeleteStation: (id: string) => void;
  storageBins: StorageBin[];
  onOpenAddBin: () => void;
  onDeleteBin: (id: string) => void;
  supplierList: Supplier[];
  onOpenAddSupplier: () => void;
  onDeleteSupplier: (id: string) => void;
  procurementModesList: ProcurementMode[];
  onOpenAddProcurementMode: () => void;
  onDeleteProcurementMode: (id: string) => void;
  masterItemList: MasterCatalogItem[];
  onOpenAddItem: () => void;
  onDeleteItem: (id: string) => void;
  uomList: UnitOfMeasure[];
  onOpenAddUom: () => void;
  onDeleteUom: (id: string) => void;
  onSaveSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  schoolProfile,
  setSchoolProfile,
  personnelList,
  onOpenAddPersonnel,
  onDeletePersonnel,
  depedFormsList,
  onOpenAddForm,
  onDeleteForm,
  thresholdRules,
  setThresholdRules,
  usefulLifeList,
  onOpenAddUsefulLife,
  onDeleteUsefulLife,
  uacsList,
  onOpenAddUacs,
  onDeleteUacs,
  fundSources,
  onOpenAddFundSource,
  onDeleteFundSource,
  stationsList,
  onOpenAddStation,
  onDeleteStation,
  storageBins,
  onOpenAddBin,
  onDeleteBin,
  supplierList,
  onOpenAddSupplier,
  onDeleteSupplier,
  procurementModesList,
  onOpenAddProcurementMode,
  onDeleteProcurementMode,
  masterItemList,
  onOpenAddItem,
  onDeleteItem,
  uomList,
  onOpenAddUom,
  onDeleteUom,
  onSaveSettings
}) => {
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('profile');
  const [personnelFilter, setPersonnelFilter] = useState('ALL');
  const [personnelSearch, setPersonnelSearch] = useState('');
  const [formSearch, setFormSearch] = useState('');
  const [formStatusFilter, setFormStatusFilter] = useState('ALL');
  const [procurementModeFilter, setProcurementModeFilter] = useState('ALL');
  const [uomSearch, setUomSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  // Filtered lists
  const filteredPersonnel = personnelList.filter(p => {
    const matchesCategory =
      personnelFilter === 'ALL' ||
      (personnelFilter === 'HEAD' && p.role.includes('Head')) ||
      (personnelFilter === 'BAC' && (p.role.includes('BAC') || p.role.includes('Admin'))) ||
      (personnelFilter === 'INSPECTOR' && (p.role.includes('Inspector') || p.role.includes('ICT'))) ||
      (personnelFilter === 'CUSTODIAN' && (p.role.includes('Custodian') || p.role.includes('Supply')));

    const matchesSearch =
      p.name.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.role.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.designation.toLowerCase().includes(personnelSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const filteredForms = depedFormsList.filter(f => {
    const q = formSearch.toLowerCase();
    const title = (f.officialTitle || f.name || '').toLowerCase();
    const appx = (f.appendixNumber || f.appendix || '').toLowerCase();
    const doc = (f.officialSourceDocument || f.sourceDocument || '').toLowerCase();
    const framework = (f.legalFramework || '').toLowerCase();
    const legal = (f.legalBasis || '').toLowerCase();
    const pfx = (f.prefix || '').toLowerCase();

    const matchesSearch =
      !formSearch.trim() ||
      title.includes(q) ||
      appx.includes(q) ||
      doc.includes(q) ||
      framework.includes(q) ||
      legal.includes(q) ||
      pfx.includes(q);

    const matchesStatus =
      formStatusFilter === 'ALL' ||
      f.templateStatus === formStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredProcurementModes = procurementModesList.filter(pm => {
    if (procurementModeFilter === 'ALL') return true;
    return pm.status === procurementModeFilter;
  });

  const filteredUom = uomList.filter(u =>
    u.name.toLowerCase().includes(uomSearch.toLowerCase()) ||
    u.code.toLowerCase().includes(uomSearch.toLowerCase()) ||
    u.category.toLowerCase().includes(uomSearch.toLowerCase())
  );

  const filteredItems = masterItemList.filter(i =>
    i.desc.toLowerCase().includes(itemSearch.toLowerCase()) ||
    i.stockNo.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Settings & Master Data</h2>
          <p className="text-[11px] text-slate-500">
            Configure permanent school profiles, financial codes, and signatory master data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveSettings}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
          >
            <Save size={13} className="text-white" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/90 pb-2 overflow-x-auto">
        <button
          onClick={() => setSettingsSubTab('profile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'profile'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Building2 size={13} className={settingsSubTab === 'profile' ? 'text-white' : 'text-slate-500'} />
          School Profile
        </button>

        <button
          onClick={() => setSettingsSubTab('personnel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'personnel'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <UserCircle size={13} className={settingsSubTab === 'personnel' ? 'text-white' : 'text-slate-500'} />
          Signatories & IAC/BAC
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'personnel' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {personnelList.length}
          </span>
        </button>

        <button
          onClick={() => setSettingsSubTab('forms')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'forms'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <FileCheck size={13} className={settingsSubTab === 'forms' ? 'text-white' : 'text-slate-500'} />
          Forms & Appendices
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'forms' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {depedFormsList.length}
          </span>
        </button>

        <button
          onClick={() => setSettingsSubTab('thresholds')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'thresholds'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Scale size={13} className={settingsSubTab === 'thresholds' ? 'text-white' : 'text-slate-500'} />
          Thresholds & COA Rules
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'thresholds' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {usefulLifeList.length}
          </span>
        </button>

        <button
          onClick={() => setSettingsSubTab('uacs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'uacs'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Landmark size={13} className={settingsSubTab === 'uacs' ? 'text-white' : 'text-slate-500'} />
          Financial & UACS
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'uacs' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {uacsList.length + fundSources.length}
          </span>
        </button>

        <button
          onClick={() => setSettingsSubTab('stations')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'stations'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Layers size={13} className={settingsSubTab === 'stations' ? 'text-white' : 'text-slate-500'} />
          Offices & Storage
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'stations' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {stationsList.length + storageBins.length}
          </span>
        </button>

        <button
          onClick={() => setSettingsSubTab('suppliers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'suppliers'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Truck size={13} className={settingsSubTab === 'suppliers' ? 'text-white' : 'text-slate-500'} />
          Suppliers & Modes
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'suppliers' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {supplierList.length + procurementModesList.length}
          </span>
        </button>

        <button
          onClick={() => setSettingsSubTab('items')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'items'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Package size={13} className={settingsSubTab === 'items' ? 'text-white' : 'text-slate-500'} />
          Master Catalog
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'items' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {masterItemList.length}
          </span>
        </button>

        <button
          onClick={() => setSettingsSubTab('uom')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            settingsSubTab === 'uom'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Tag size={13} className={settingsSubTab === 'uom' ? 'text-white' : 'text-slate-500'} />
          Units of Measure
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            settingsSubTab === 'uom' ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {uomList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: School Profile */}
      {settingsSubTab === 'profile' && (
        <div className="space-y-3.5">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <Building2 size={15} className="text-slate-600" />
                <span>STATIC SCHOOL PROFILE (ENTITY DATA)</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Appendix 60, 61 & 62 Prescribed Entity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">School / Entity Name</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.schoolName}
                  onChange={e => setSchoolProfile({ ...schoolProfile, schoolName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">School ID / Station Code</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors font-mono"
                  value={schoolProfile.schoolId}
                  onChange={e => setSchoolProfile({ ...schoolProfile, schoolId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Region & Division</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.regionDivision}
                  onChange={e => setSchoolProfile({ ...schoolProfile, regionDivision: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Complete Address</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.address}
                  onChange={e => setSchoolProfile({ ...schoolProfile, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Responsibility Center / UACS Code</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors font-mono"
                  value={schoolProfile.uacsCode}
                  onChange={e => setSchoolProfile({ ...schoolProfile, uacsCode: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Default Fund Cluster</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.defaultFundCluster}
                  onChange={e => setSchoolProfile({ ...schoolProfile, defaultFundCluster: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck size={15} className="text-slate-600" />
                <span>APPROVING OFFICIALS & DIVISION SUPERINTENDENCY</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400">COA & Division Governance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Schools Division Superintendent (SDS)</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.divisionSuperintendent}
                  onChange={e => setSchoolProfile({ ...schoolProfile, divisionSuperintendent: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Head of Procuring Entity (HOPE / Principal)</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.headOfProcuringEntity}
                  onChange={e => setSchoolProfile({ ...schoolProfile, headOfProcuringEntity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Inspection & Acceptance Committee Head (IAC)</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.inspectionCommitteeHead}
                  onChange={e => setSchoolProfile({ ...schoolProfile, inspectionCommitteeHead: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Property & Supply Officer (Custodianship)</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg text-xs px-3 py-2 bg-slate-50/60 text-slate-800 outline-none focus:bg-white focus:border-slate-400 transition-colors"
                  value={schoolProfile.supplyOfficer}
                  onChange={e => setSchoolProfile({ ...schoolProfile, supplyOfficer: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Personnel & Signatories */}
      {settingsSubTab === 'personnel' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search personnel name or role..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-slate-400 w-52 sm:w-64"
                  value={personnelSearch}
                  onChange={e => setPersonnelSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                {['ALL', 'HEAD', 'BAC', 'INSPECTOR', 'CUSTODIAN'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPersonnelFilter(cat)}
                    className={`px-2 py-1 rounded cursor-pointer transition-all ${
                      personnelFilter === cat ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenAddPersonnel}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <Plus size={13} />
              Add Personnel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Personnel Name</th>
                  <th className="p-3">Official Role / Function</th>
                  <th className="p-3">Designation Title</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPersonnel.map(person => (
                  <tr key={person.id} className="hover:bg-slate-50/50 group">
                    <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {person.name.charAt(0)}
                      </div>
                      {person.name}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {person.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{person.designation}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeletePersonnel(person.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Personnel"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DepEd Prescribed Forms & Appendices */}
      {settingsSubTab === 'forms' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search appendix, title, or legal basis..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-slate-400 w-64"
                  value={formSearch}
                  onChange={e => setFormSearch(e.target.value)}
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                {['ALL', 'Current', 'Transitional', 'Historical', 'For Validation', 'Superseded'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFormStatusFilter(st)}
                    className={`px-2 py-1 rounded cursor-pointer transition-all ${
                      formStatusFilter === st ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'All Appendices' : st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenAddForm}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <Plus size={13} />
              Add Form / Sequence
            </button>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/95 backdrop-blur-xs sticky top-0 border-b border-slate-200 text-slate-600 font-semibold z-10 shadow-2xs">
                <tr>
                  <th className="p-3 w-28">Appendix No.</th>
                  <th className="p-3 w-52">Official Form Title & Applicability</th>
                  <th className="p-3 text-center w-32">Validation State</th>
                  <th className="p-3 w-48">Legal Framework & Basis</th>
                  <th className="p-3 w-48">Official Source & Version</th>
                  <th className="p-3 w-24">Prefix & Seq</th>
                  <th className="p-3">Statutory Notes & Retention</th>
                  <th className="p-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredForms.map(form => {
                  const status = form.templateStatus || 'Current';
                  let statusBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (status === 'Transitional') statusBadgeClass = 'bg-blue-50 text-blue-800 border-blue-200';
                  if (status === 'Historical') statusBadgeClass = 'bg-purple-50 text-purple-800 border-purple-200';
                  if (status === 'For Validation') statusBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
                  if (status === 'Superseded') statusBadgeClass = 'bg-rose-50 text-rose-800 border-rose-200 line-through';
                  if (status === 'Legacy') statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <tr key={form.id} className="hover:bg-slate-50/50 group">
                      {/* Appendix */}
                      <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {form.appendixNumber || form.appendix}
                      </td>

                      {/* Title & Transaction Applicability */}
                      <td className="p-3">
                        <span className="font-bold text-slate-800 block">
                          {form.officialTitle || form.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                          {form.transactionApplicability || form.lifecycle}
                        </span>
                      </td>

                      {/* Validation State */}
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block whitespace-nowrap ${statusBadgeClass}`}>
                          {status}
                        </span>
                        <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                          Checked: {form.lastValidationDate || '2026-10-05'}
                        </span>
                      </td>

                      {/* Legal Framework & Basis */}
                      <td className="p-3 text-[11px]">
                        <p className="font-semibold text-slate-800">{form.legalFramework || 'RA 12009 / GAM Vol. II'}</p>
                        <p className="text-[10px] text-slate-500">{form.legalBasis || 'DepEd Order No. 41, s. 2021'}</p>
                      </td>

                      {/* Source Document */}
                      <td className="p-3 text-[11px] text-slate-700">
                        <p className="font-semibold text-slate-800">{form.officialSourceDocument || form.sourceDocument || 'GAM Volume II'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Ver: {form.sourceVersionDate || '2016-01-01'}</p>
                      </td>

                      {/* Prefix & Next Seq */}
                      <td className="p-3">
                        <span className="font-mono text-blue-700 bg-blue-50/50 rounded px-1.5 py-0.5 inline-block text-[10px] font-bold">
                          {form.prefix}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          Seq: #{form.currentSeq.toString().padStart(3, '0')}
                        </span>
                      </td>

                      {/* Notes & Retention */}
                      <td className="p-3 text-[11px]">
                        <p className="text-slate-600 line-clamp-2 italic">{form.notes || 'Prescribed DepEd procurement form.'}</p>
                        <span className="text-[10px] text-slate-400 font-mono font-medium block mt-0.5">
                          Retention: {form.retention}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteForm(form.id)}
                          className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete Form Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Thresholds & COA Rules */}
      {settingsSubTab === 'thresholds' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COA Circular 2022-004</span>
              <h3 className="font-bold text-slate-900 text-sm">Capitalization Threshold</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900">₱{thresholdRules.capitalizationThreshold.toLocaleString()}</span>
                <span className="text-slate-400 text-xs">per item</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Items exceeding this unit threshold are recorded as capital PPE (PAR). Items below or equal are Semi-Expendable (ICS).
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Semi-Expendable (≤ ₱50k)</span>
              <h3 className="font-bold text-slate-900 text-sm">Inventory Custodian Slip (ICS)</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {thresholdRules.semiExpendableRule}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Capital PPE (&gt; ₱50k)</span>
              <h3 className="font-bold text-slate-900 text-sm">Property Acknowledgement (PAR)</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {thresholdRules.ppeRule}
              </p>
            </div>
          </div>

          {/* Useful Life Schedule Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  DepEd Prescribed Useful Life Schedule (COA Circular)
                </h3>
                <p className="text-[11px] text-slate-500">Asset depreciation schedule for property reconciliation.</p>
              </div>
              <button
                onClick={onOpenAddUsefulLife}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={13} />
                Add Schedule
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Asset Category / Class</th>
                  <th className="p-3 text-center">Service Life (Years)</th>
                  <th className="p-3">Depreciation Method</th>
                  <th className="p-3 text-center">Salvage Value</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usefulLifeList.map(ul => (
                  <tr key={ul.id} className="hover:bg-slate-50/50 group">
                    <td className="p-3 font-semibold text-slate-800">{ul.assetClass}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{ul.lifeYears} Years</td>
                    <td className="p-3 text-slate-600">{ul.depreciationMethod}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{ul.salvageValuePct}%</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteUsefulLife(ul.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Schedule"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Financial & UACS Codes */}
      {settingsSubTab === 'uacs' && (
        <div className="space-y-4">
          {/* Fund Sources */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Active Fund Sources & Clusters
                </h3>
                <p className="text-[11px] text-slate-500">Appropriations for Purchase Requests and PO Awards.</p>
              </div>
              <button
                onClick={onOpenAddFundSource}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={13} />
                Add Fund Source
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5">
              {fundSources.map(fs => (
                <div key={fs.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 relative group">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-xs">{fs.name}</span>
                    <button
                      onClick={() => onDeleteFundSource(fs.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Fund Source"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="inline-block mt-2 font-mono text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded">
                    {fs.cluster}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* UACS Codes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Unified Accounts Code Structure (UACS) Object Codes
                </h3>
                <p className="text-[11px] text-slate-500">GAM Volume II unified accounting classification.</p>
              </div>
              <button
                onClick={onOpenAddUacs}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={13} />
                Add UACS Code
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3 font-mono">UACS Object Code</th>
                  <th className="p-3">Object Title / Expense Description</th>
                  <th className="p-3">Category Classification</th>
                  <th className="p-3">GAM Reference</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uacsList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 group">
                    <td className="p-3 font-mono font-bold text-slate-800">{u.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{u.title}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {u.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{u.formRef}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteUacs(u.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete UACS"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Stations & Storage Bins */}
      {settingsSubTab === 'stations' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Requisitioning Offices & Stations
                </h3>
                <p className="text-[11px] text-slate-500">School departments, learning centers, and science labs.</p>
              </div>
              <button
                onClick={onOpenAddStation}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={13} />
                Add Station
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3 font-mono">Code</th>
                  <th className="p-3">Office / Station Name</th>
                  <th className="p-3">Accountable Custodian</th>
                  <th className="p-3">Campus Physical Location</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stationsList.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/50 group">
                    <td className="p-3 font-mono font-bold text-slate-700">{st.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{st.name}</td>
                    <td className="p-3 text-slate-600">{st.custodian}</td>
                    <td className="p-3 text-slate-500">{st.location}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteStation(st.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Station"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Storage Bins */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Supply Depot Storage Bins & Shelves (RPCI Audit)
                </h3>
                <p className="text-[11px] text-slate-500">Physical stockroom bin locations for inventory counting.</p>
              </div>
              <button
                onClick={onOpenAddBin}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={13} />
                Add Bin / Shelf
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5">
              {storageBins.map(bin => (
                <div key={bin.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 relative group">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-blue-900 text-xs">{bin.code}</span>
                    <button
                      onClick={() => onDeleteBin(bin.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Bin"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="font-medium text-slate-800 text-[11px] mt-1">{bin.description}</p>
                  <span className="inline-block mt-2 text-[10px] text-slate-400 font-medium">
                    {bin.room}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Suppliers & Procurement Modes */}
      {settingsSubTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Accredited Merchants & Suppliers
                </h3>
                <p className="text-[11px] text-slate-500">DepEd verified vendors with TIN for Purchase Orders.</p>
              </div>
              <button
                onClick={onOpenAddSupplier}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={13} />
                Add Supplier
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3 font-mono">ID</th>
                  <th className="p-3">Merchant Name</th>
                  <th className="p-3 font-mono">Taxpayer Identification (TIN)</th>
                  <th className="p-3">Business Address</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierList.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 group">
                    <td className="p-3 font-mono font-bold text-slate-600">{s.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                    <td className="p-3 font-mono text-slate-700">{s.tin}</td>
                    <td className="p-3 text-slate-600 text-[11px]">{s.address}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteSupplier(s.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Supplier"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Procurement Frameworks & Modes (RA 12009 & RA 9184) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Procurement Frameworks & Modes (RA 12009 & RA 9184)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Current procurement governed by <strong>RA 12009 (New Government Procurement Act & Approved IRR)</strong>; RA 9184 and its IRR preserved for transitional and historical reference (GPPB Advisory No. 09-2026).
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Framework Status Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                  {['ALL', 'Current', 'Transitional', 'Historical'].map(st => (
                    <button
                      key={st}
                      onClick={() => setProcurementModeFilter(st)}
                      className={`px-2 py-1 rounded cursor-pointer transition-all ${
                        procurementModeFilter === st ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st === 'ALL' ? 'All Modes' : st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onOpenAddProcurementMode}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <Plus size={13} />
                  Add Mode
                </button>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3 w-56">Procurement Mode & Applicability</th>
                  <th className="p-3 w-44">Legal Framework</th>
                  <th className="p-3 text-center w-28">Status</th>
                  <th className="p-3 w-32">Maximum Limit</th>
                  <th className="p-3 w-48">Quotation Requirements</th>
                  <th className="p-3">Official Source & Basis</th>
                  <th className="p-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProcurementModes.map(pm => {
                  let statusClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (pm.status === 'Transitional') statusClass = 'bg-blue-50 text-blue-800 border-blue-200';
                  if (pm.status === 'Historical') statusClass = 'bg-purple-50 text-purple-800 border-purple-200';

                  return (
                    <tr key={pm.id} className="hover:bg-slate-50/50 group">
                      <td className="p-3">
                        <span className="font-semibold text-slate-900 block">{pm.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{pm.transactionApplicability}</span>
                      </td>
                      <td className="p-3 text-slate-700 text-[11px] font-medium">
                        {pm.legalFramework}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${statusClass}`}>
                          {pm.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700">
                        {pm.maxLimit > 0 ? `₱${pm.maxLimit.toLocaleString()}` : 'No Statutory Cap'}
                      </td>
                      <td className="p-3 text-slate-600 text-[11px]">{pm.quotationReq}</td>
                      <td className="p-3 text-[11px]">
                        <p className="font-mono text-slate-700">{pm.officialSourceDocument || pm.basis}</p>
                        <p className="text-[10px] text-slate-400 italic mt-0.5">{pm.notes}</p>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteProcurementMode(pm.id)}
                          className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete Mode"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: Master Catalog Items */}
      {settingsSubTab === 'items' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search catalog items..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-slate-400 w-64"
                  value={itemSearch}
                  onChange={e => setItemSearch(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onOpenAddItem}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus size={13} />
              Add Catalog Item
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
              <tr>
                <th className="p-3 font-mono">Stock No.</th>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Default Unit</th>
                <th className="p-3 text-right">Standard Estimated Cost</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 group">
                  <td className="p-3 font-mono font-bold text-slate-700">{item.stockNo}</td>
                  <td className="p-3 font-semibold text-slate-900">{item.desc}</td>
                  <td className="p-3 text-center font-medium text-slate-600">{item.defaultUnit}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ₱{item.estimatedCost.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 9: Units of Measure */}
      {settingsSubTab === 'uom' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search unit of measure..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-slate-400 w-64"
                  value={uomSearch}
                  onChange={e => setUomSearch(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onOpenAddUom}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus size={13} />
              Add Unit of Measure
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
              <tr>
                <th className="p-3 font-mono">UOM Code</th>
                <th className="p-3">Unit Name</th>
                <th className="p-3">Category Classification</th>
                <th className="p-3">Standard Packaging Qty</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUom.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 group">
                  <td className="p-3 font-mono font-bold text-blue-700 bg-blue-50/30 rounded inline-block px-1.5 py-0.5 mt-2">
                    {u.code}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.category}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{u.standardQty}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteUom(u.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete UOM"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
