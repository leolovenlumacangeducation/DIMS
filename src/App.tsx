import React, { useState } from 'react';
import { CheckCircle, History, X } from 'lucide-react';
import {
  Transaction,
  Personnel,
  Supplier,
  MasterCatalogItem,
  UsefulLifeSchedule,
  UacsCode,
  FundSource,
  Station,
  StorageBin,
  DepEdForm,
  ProcurementMode,
  UnitOfMeasure
} from './types';
import {
  DEFAULT_SCHOOL_PROFILE,
  INITIAL_PERSONNEL,
  INITIAL_DEPED_FORMS,
  INITIAL_THRESHOLD_RULES,
  INITIAL_USEFUL_LIFE_SCHEDULE,
  INITIAL_UACS_CODES,
  INITIAL_FUND_SOURCES,
  INITIAL_STATIONS,
  INITIAL_STORAGE_BINS,
  MASTER_DATA,
  INITIAL_PROCUREMENT_MODES,
  INITIAL_UNITS_OF_MEASURE,
  initialTransactions
} from './data/mockData';

// Layout & View Components
import { Sidebar, MainNavTab } from './components/layout/Sidebar';
import { TraceabilityDrawer } from './components/layout/TraceabilityDrawer';
import { PurchaseRequestsView } from './components/views/PurchaseRequestsView';
import { PurchaseOrdersView } from './components/views/PurchaseOrdersView';
import { SettingsView } from './components/views/settings/SettingsView';

// Modals
import { ModalCreatePR } from './components/modals/ModalCreatePR';
import { ModalAwardPO } from './components/modals/ModalAwardPO';
import { ModalLogDelivery } from './components/modals/ModalLogDelivery';
import { ModalInspectIAR } from './components/modals/ModalInspectIAR';
import { ModalViewDDR } from './components/modals/ModalViewDDR';
import { ModalSupplierNotice } from './components/modals/ModalSupplierNotice';
import { DownloadFormModal } from './components/modals/DownloadFormModal';
import { AddMasterDataModals } from './components/modals/AddMasterDataModals';
import { PreExportValidationModal } from './components/modals/PreExportValidationModal';
import { validateFormExport, FormValidationResult } from './utils/formValidation';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('pr');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [modalState, setModalState] = useState<{ type: string | null; txn: Transaction | null }>({ type: null, txn: null });
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [downloadModal, setDownloadModal] = useState<{ formType: string; txn: Transaction } | null>(null);
  const [validationModal, setValidationModal] = useState<FormValidationResult | null>(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  // School profile & Master Personnel state
  const [schoolProfile, setSchoolProfile] = useState(DEFAULT_SCHOOL_PROFILE);
  const [personnelList, setPersonnelList] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [addPersonnelModal, setAddPersonnelModal] = useState(false);

  // Master Suppliers & Catalog Items state
  const [supplierList, setSupplierList] = useState<Supplier[]>(MASTER_DATA.suppliers);
  const [addSupplierModal, setAddSupplierModal] = useState(false);

  const [masterItemList, setMasterItemList] = useState<MasterCatalogItem[]>(MASTER_DATA.items);
  const [addItemModal, setAddItemModal] = useState(false);

  // DepEd Inventory Master Data States
  const [thresholdRules, setThresholdRules] = useState(INITIAL_THRESHOLD_RULES);
  const [usefulLifeList, setUsefulLifeList] = useState<UsefulLifeSchedule[]>(INITIAL_USEFUL_LIFE_SCHEDULE);
  const [addUsefulLifeModal, setAddUsefulLifeModal] = useState(false);

  const [uacsList, setUacsList] = useState<UacsCode[]>(INITIAL_UACS_CODES);
  const [addUacsModal, setAddUacsModal] = useState(false);

  const [fundSources, setFundSources] = useState<FundSource[]>(INITIAL_FUND_SOURCES);
  const [addFundSourceModal, setAddFundSourceModal] = useState(false);

  const [stationsList, setStationsList] = useState<Station[]>(INITIAL_STATIONS);
  const [addStationModal, setAddStationModal] = useState(false);

  const [storageBins, setStorageBins] = useState<StorageBin[]>(INITIAL_STORAGE_BINS);
  const [addBinModal, setAddBinModal] = useState(false);

  const [depedFormsList, setDepedFormsList] = useState<DepEdForm[]>(INITIAL_DEPED_FORMS);
  const [addFormModal, setAddFormModal] = useState(false);

  const [procurementModesList, setProcurementModesList] = useState<ProcurementMode[]>(INITIAL_PROCUREMENT_MODES);
  const [addProcurementModeModal, setAddProcurementModeModal] = useState(false);

  const [uomList, setUomList] = useState<UnitOfMeasure[]>(INITIAL_UNITS_OF_MEASURE);
  const [addUomModal, setAddUomModal] = useState(false);

  // Modal Triggers
  const openModal = (type: string, txn: Transaction | null = null) => {
    setModalState({ type, txn });
  };

  const closeModal = () => {
    setModalState({ type: null, txn: null });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    closeModal();
  };

  const updateWholeTransaction = (updatedTxn: Transaction) => {
    setTransactions(prev => prev.map(t => (t.id === updatedTxn.id ? updatedTxn : t)));
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleDownloadForm = (formType: string, txn: Transaction) => {
    const valResult = validateFormExport(formType, txn, schoolProfile);
    if (!valResult.isValid) {
      setValidationModal(valResult);
    } else {
      setDownloadModal({ formType, txn });
    }
  };

  const handleSaveSettings = () => {
    setSaveSuccessToast(true);
    setTimeout(() => {
      setSaveSuccessToast(false);
    }, 2800);
  };

  // CRUD Handlers
  const handleAddPersonnel = (person: Omit<Personnel, 'id'>) => {
    const newEntry: Personnel = {
      id: `P${(personnelList.length + 1).toString().padStart(2, '0')}`,
      ...person
    };
    setPersonnelList([...personnelList, newEntry]);
  };

  const handleDeletePersonnel = (id: string) => {
    setPersonnelList(personnelList.filter(p => p.id !== id));
  };

  const handleAddSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newEntry: Supplier = {
      id: `S${(supplierList.length + 1).toString().padStart(2, '0')}`,
      ...supplier
    };
    setSupplierList([...supplierList, newEntry]);
  };

  const handleDeleteSupplier = (id: string) => {
    setSupplierList(supplierList.filter(s => s.id !== id));
  };

  const handleAddItem = (item: Omit<MasterCatalogItem, 'id'>) => {
    const newEntry: MasterCatalogItem = {
      id: `ITM-${(masterItemList.length + 1).toString().padStart(3, '0')}`,
      ...item
    };
    setMasterItemList([...masterItemList, newEntry]);
  };

  const handleDeleteItem = (id: string) => {
    setMasterItemList(masterItemList.filter(i => i.id !== id));
  };

  const handleAddUsefulLife = (ul: Omit<UsefulLifeSchedule, 'id'>) => {
    const newEntry: UsefulLifeSchedule = {
      id: `UL-${(usefulLifeList.length + 1).toString().padStart(2, '0')}`,
      ...ul
    };
    setUsefulLifeList([...usefulLifeList, newEntry]);
  };

  const handleDeleteUsefulLife = (id: string) => {
    setUsefulLifeList(usefulLifeList.filter(u => u.id !== id));
  };

  const handleAddUacs = (uacs: Omit<UacsCode, 'id'>) => {
    const newEntry: UacsCode = {
      id: `U-${(uacsList.length + 1).toString().padStart(2, '0')}`,
      ...uacs
    };
    setUacsList([...uacsList, newEntry]);
  };

  const handleDeleteUacs = (id: string) => {
    setUacsList(uacsList.filter(u => u.id !== id));
  };

  const handleAddStation = (station: Omit<Station, 'id'>) => {
    const newEntry: Station = {
      id: `ST-${(stationsList.length + 1).toString().padStart(2, '0')}`,
      ...station
    };
    setStationsList([...stationsList, newEntry]);
  };

  const handleDeleteStation = (id: string) => {
    setStationsList(stationsList.filter(s => s.id !== id));
  };

  const handleAddBin = (bin: Omit<StorageBin, 'id'>) => {
    const newEntry: StorageBin = {
      id: `BIN-${(storageBins.length + 1).toString().padStart(2, '0')}`,
      ...bin
    };
    setStorageBins([...storageBins, newEntry]);
  };

  const handleDeleteBin = (id: string) => {
    setStorageBins(storageBins.filter(b => b.id !== id));
  };

  const handleAddForm = (form: Omit<DepEdForm, 'id'>) => {
    const newEntry: DepEdForm = {
      id: `FRM-${Date.now().toString().slice(-4)}`,
      ...form
    };
    setDepedFormsList([...depedFormsList, newEntry]);
  };

  const handleDeleteForm = (id: string) => {
    setDepedFormsList(depedFormsList.filter(f => f.id !== id));
  };

  const handleAddFundSource = (fs: Omit<FundSource, 'id'>) => {
    const newEntry: FundSource = {
      id: `FS-${(fundSources.length + 1).toString().padStart(2, '0')}`,
      ...fs
    };
    setFundSources([...fundSources, newEntry]);
  };

  const handleDeleteFundSource = (id: string) => {
    setFundSources(fundSources.filter(f => f.id !== id));
  };

  const handleAddProcurementMode = (pm: Omit<ProcurementMode, 'id'>) => {
    const newEntry: ProcurementMode = {
      id: `PM-${(procurementModesList.length + 1).toString().padStart(2, '0')}`,
      ...pm
    };
    setProcurementModesList([...procurementModesList, newEntry]);
  };

  const handleDeleteProcurementMode = (id: string) => {
    setProcurementModesList(procurementModesList.filter(p => p.id !== id));
  };

  const handleAddUom = (uom: Omit<UnitOfMeasure, 'id'>) => {
    const newEntry: UnitOfMeasure = {
      id: `UOM-${(uomList.length + 1).toString().padStart(2, '0')}`,
      ...uom
    };
    setUomList([...uomList, newEntry]);
  };

  const handleDeleteUom = (id: string) => {
    setUomList(uomList.filter(u => u.id !== id));
  };

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans text-slate-800 overflow-hidden text-xs select-none">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle size={15} className="text-emerald-400" />
          <span className="font-semibold text-xs">Settings & Master Data saved successfully!</span>
        </div>
      )}

      {/* Modular Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        schoolProfile={schoolProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 py-3 flex-1">
          {/* Top secondary header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded font-semibold">
                {schoolProfile.schoolName} • ID: {schoolProfile.schoolId}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Audited & Saved: {lastSavedTime}
              </span>
            </div>
            {activeTab !== 'settings' && (
              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="flex items-center gap-1.5 text-[11px] font-medium bg-white border border-slate-200 px-3 py-1 rounded-md hover:bg-slate-50 text-slate-700 shadow-xs transition-all cursor-pointer"
              >
                <History size={13} className="text-slate-500" />
                {rightSidebarOpen ? 'Hide Traceability Chain' : 'Show Traceability Chain'}
              </button>
            )}
          </div>

          {/* Module 1: Purchase Requests */}
          {activeTab === 'pr' && (
            <PurchaseRequestsView
              transactions={transactions}
              supplierList={supplierList}
              onOpenCreatePR={() => openModal('CREATE_PR')}
              onOpenAwardPO={txn => openModal('AWARD_PO', txn)}
              onDownloadForm={handleDownloadForm}
              onSaveAmendment={updateWholeTransaction}
            />
          )}

          {/* Module 2: Purchase Orders */}
          {activeTab === 'po' && (
            <PurchaseOrdersView
              transactions={transactions}
              supplierList={supplierList}
              onOpenLogDelivery={txn => openModal('LOG_DELIVERY', txn)}
              onOpenInspectIAR={txn => openModal('INSPECT_IAR', txn)}
              onOpenViewDDR={txn => openModal('VIEW_DDR', txn)}
              onOpenSupplierNotice={txn => openModal('SUPPLIER_NOTICE', txn)}
              onDownloadForm={handleDownloadForm}
              onSaveAmendment={updateWholeTransaction}
            />
          )}

          {/* Module 3: Settings & Master Data */}
          {activeTab === 'settings' && (
            <SettingsView
              schoolProfile={schoolProfile}
              setSchoolProfile={setSchoolProfile}
              personnelList={personnelList}
              onOpenAddPersonnel={() => setAddPersonnelModal(true)}
              onDeletePersonnel={handleDeletePersonnel}
              depedFormsList={depedFormsList}
              onOpenAddForm={() => setAddFormModal(true)}
              onDeleteForm={handleDeleteForm}
              thresholdRules={thresholdRules}
              setThresholdRules={setThresholdRules}
              usefulLifeList={usefulLifeList}
              onOpenAddUsefulLife={() => setAddUsefulLifeModal(true)}
              onDeleteUsefulLife={handleDeleteUsefulLife}
              uacsList={uacsList}
              onOpenAddUacs={() => setAddUacsModal(true)}
              onDeleteUacs={handleDeleteUacs}
              fundSources={fundSources}
              onOpenAddFundSource={() => setAddFundSourceModal(true)}
              onDeleteFundSource={handleDeleteFundSource}
              stationsList={stationsList}
              onOpenAddStation={() => setAddStationModal(true)}
              onDeleteStation={handleDeleteStation}
              storageBins={storageBins}
              onOpenAddBin={() => setAddBinModal(true)}
              onDeleteBin={handleDeleteBin}
              supplierList={supplierList}
              onOpenAddSupplier={() => setAddSupplierModal(true)}
              onDeleteSupplier={handleDeleteSupplier}
              procurementModesList={procurementModesList}
              onOpenAddProcurementMode={() => setAddProcurementModeModal(true)}
              onDeleteProcurementMode={handleDeleteProcurementMode}
              masterItemList={masterItemList}
              onOpenAddItem={() => setAddItemModal(true)}
              onDeleteItem={handleDeleteItem}
              uomList={uomList}
              onOpenAddUom={() => setAddUomModal(true)}
              onDeleteUom={handleDeleteUom}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </div>
      </main>

      {/* Modular Right Traceability Drawer */}
      {activeTab !== 'settings' && (
        <TraceabilityDrawer
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          transactions={transactions}
          suppliers={supplierList}
          onDownloadForm={handleDownloadForm}
        />
      )}

      {/* Action Modals */}
      {modalState.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={closeModal} />
          <div className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full overflow-hidden animate-in zoom-in-95 duration-200 max-h-[96vh] flex flex-col ${
            modalState.type === 'CREATE_PR' ||
            modalState.type === 'AWARD_PO' ||
            modalState.type === 'INSPECT_IAR' ||
            modalState.type === 'LOG_DELIVERY' ||
            modalState.type === 'VIEW_DDR' ||
            modalState.type === 'SUPPLIER_NOTICE'
              ? 'w-[98vw] max-w-[98vw] h-[95vh]'
              : 'max-w-xl'
          }`}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="p-6 overflow-y-auto">
              {modalState.type === 'CREATE_PR' && (
                <ModalCreatePR
                  schoolProfile={schoolProfile}
                  stationsList={stationsList}
                  fundSources={fundSources}
                  personnelList={personnelList}
                  masterItemList={masterItemList}
                  uomList={uomList}
                  onSave={newTxn => {
                    setTransactions([newTxn, ...transactions]);
                    closeModal();
                  }}
                  onClose={closeModal}
                />
              )}
              {modalState.type === 'AWARD_PO' && modalState.txn && (
                <ModalAwardPO
                  txn={modalState.txn}
                  schoolProfile={schoolProfile}
                  supplierList={supplierList}
                  procurementModesList={procurementModesList}
                  personnelList={personnelList}
                  onSave={updateTransaction}
                  onClose={closeModal}
                />
              )}
              {modalState.type === 'LOG_DELIVERY' && modalState.txn && (
                <ModalLogDelivery
                  txn={modalState.txn}
                  schoolProfile={schoolProfile}
                  personnelList={personnelList}
                  onSave={updateTransaction}
                  onClose={closeModal}
                />
              )}
              {modalState.type === 'INSPECT_IAR' && modalState.txn && (
                <ModalInspectIAR
                  txn={modalState.txn}
                  schoolProfile={schoolProfile}
                  personnelList={personnelList}
                  onSave={updateTransaction}
                  onClose={closeModal}
                />
              )}
              {modalState.type === 'VIEW_DDR' && modalState.txn && (
                <ModalViewDDR
                  txn={modalState.txn}
                  schoolProfile={schoolProfile}
                  personnelList={personnelList}
                  supplierList={supplierList}
                  onOpenSupplierNotice={() => openModal('SUPPLIER_NOTICE', modalState.txn)}
                  onClose={closeModal}
                />
              )}
              {modalState.type === 'SUPPLIER_NOTICE' && modalState.txn && (
                <ModalSupplierNotice
                  txn={modalState.txn}
                  schoolProfile={schoolProfile}
                  personnelList={personnelList}
                  supplierList={supplierList}
                  onClose={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Small Modals for Master Data with Add Icons */}
      <AddMasterDataModals
        addPersonnelModal={addPersonnelModal}
        setAddPersonnelModal={setAddPersonnelModal}
        onAddPersonnel={handleAddPersonnel}
        addSupplierModal={addSupplierModal}
        setAddSupplierModal={setAddSupplierModal}
        onAddSupplier={handleAddSupplier}
        addItemModal={addItemModal}
        setAddItemModal={setAddItemModal}
        onAddItem={handleAddItem}
        addUsefulLifeModal={addUsefulLifeModal}
        setAddUsefulLifeModal={setAddUsefulLifeModal}
        onAddUsefulLife={handleAddUsefulLife}
        addUacsModal={addUacsModal}
        setAddUacsModal={setAddUacsModal}
        onAddUacs={handleAddUacs}
        addStationModal={addStationModal}
        setAddStationModal={setAddStationModal}
        onAddStation={handleAddStation}
        addBinModal={addBinModal}
        setAddBinModal={setAddBinModal}
        onAddBin={handleAddBin}
        addFormModal={addFormModal}
        setAddFormModal={setAddFormModal}
        onAddForm={handleAddForm}
        addFundSourceModal={addFundSourceModal}
        setAddFundSourceModal={setAddFundSourceModal}
        onAddFundSource={handleAddFundSource}
        addProcurementModeModal={addProcurementModeModal}
        setAddProcurementModeModal={setAddProcurementModeModal}
        onAddProcurementMode={handleAddProcurementMode}
        addUomModal={addUomModal}
        setAddUomModal={setAddUomModal}
        onAddUom={handleAddUom}
      />

      {/* Printable / Downloadable Voucher Preview Modal */}
      {downloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={() => setDownloadModal(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-[98vw] max-w-5xl max-h-[95vh] overflow-y-auto p-6 z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setDownloadModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <DownloadFormModal
              formType={downloadModal.formType}
              txn={downloadModal.txn}
              schoolProfile={schoolProfile}
              personnelList={personnelList}
              supplierList={supplierList}
              onClose={() => setDownloadModal(null)}
            />
          </div>
        </div>
      )}

      {/* Pre-Export Statutory Validation Audit Modal */}
      {validationModal && (
        <PreExportValidationModal
          validationResult={validationModal}
          onClose={() => setValidationModal(null)}
        />
      )}
    </div>
  );
}
