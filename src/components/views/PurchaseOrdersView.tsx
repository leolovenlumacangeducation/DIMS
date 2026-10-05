import React, { useState } from 'react';
import {
  FileSignature,
  Truck,
  ClipboardCheck,
  CheckCircle,
  Download,
  AlertTriangle,
  RotateCcw,
  Send,
  Building,
  ShieldAlert,
  Info,
  Layers,
  ArrowRight,
  LayoutGrid,
  List,
  Eye,
  Lock,
  Unlock,
  Clock
} from 'lucide-react';
import { Transaction, Supplier, STATUS } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { getTransactionStages } from '../../utils/transactionStages';
import {
  ProcurementFilterToolbar,
  FilterToolbarState
} from '../common/ProcurementFilterToolbar';
import { TransactionDetailDrawer } from '../modals/TransactionDetailDrawer';

interface PurchaseOrdersViewProps {
  transactions: Transaction[];
  supplierList: Supplier[];
  schoolProfile?: SchoolProfile;
  onOpenLogDelivery: (txn: Transaction) => void;
  onOpenInspectIAR: (txn: Transaction) => void;
  onOpenViewDDR: (txn: Transaction) => void;
  onOpenSupplierNotice: (txn: Transaction) => void;
  onDownloadForm: (formType: string, txn: Transaction) => void;
  onSaveAmendment?: (updatedTxn: Transaction) => void;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({
  transactions,
  supplierList,
  schoolProfile,
  onOpenLogDelivery,
  onOpenInspectIAR,
  onOpenViewDDR,
  onOpenSupplierNotice,
  onDownloadForm,
  onSaveAmendment
}) => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [drawerTxn, setDrawerTxn] = useState<Transaction | null>(null);

  const [filters, setFilters] = useState<FilterToolbarState>({
    searchQuery: '',
    office: '',
    supplierId: '',
    fundCluster: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    needsAttentionOnly: false
  });

  const getSupplier = (id: string) => {
    return supplierList.find(s => s.id === id);
  };

  const poTransactions = transactions.filter(t => t.po !== null);
  const needsAttentionCount = poTransactions.filter(t => getTransactionStages(t).needsAttention).length;

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      office: '',
      supplierId: '',
      fundCluster: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      needsAttentionOnly: false
    });
  };

  // Extract dropdown options
  const offices = Array.from(new Set(poTransactions.map(t => t.pr.office))).filter(Boolean);
  const fundClusters = Array.from(new Set(poTransactions.map(t => t.pr.fundCluster))).filter(Boolean);
  const statuses = Array.from(new Set(poTransactions.map(t => t.status))).filter(Boolean);

  const filteredTransactions = poTransactions.filter(txn => {
    const stages = getTransactionStages(txn);
    const supplier = getSupplier(txn.po?.supplierId || '');

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const itemDesc = (txn.po_items || []).map(i => i.desc).join(' ').toLowerCase();
      const matches =
        (txn.po?.no.toLowerCase().includes(q) ?? false) ||
        txn.pr.no.toLowerCase().includes(q) ||
        (supplier?.name.toLowerCase().includes(q) ?? false) ||
        (txn.dr?.invoiceNo.toLowerCase().includes(q) ?? false) ||
        (txn.iar?.no.toLowerCase().includes(q) ?? false) ||
        itemDesc.includes(q);
      if (!matches) return false;
    }

    if (filters.office && txn.pr.office !== filters.office) return false;
    if (filters.supplierId && txn.po?.supplierId !== filters.supplierId) return false;
    if (filters.fundCluster && txn.pr.fundCluster !== filters.fundCluster) return false;
    if (filters.status && txn.status !== filters.status) return false;

    // Date range against PO Date
    if (filters.dateFrom && (txn.po?.date || '') < filters.dateFrom) return false;
    if (filters.dateTo && (txn.po?.date || '') > filters.dateTo) return false;

    if (filters.needsAttentionOnly && !stages.needsAttention) return false;

    return true;
  });

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* View Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-1 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Purchase Orders & Receiving Management
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            DepEd Order No. 41, s. 2021 & GAM Volume II • Multi-Tranche Receiving, Dual-Certification IAR & Pre-Export Audit
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center gap-0.5">
            <button
              onClick={() => setViewMode('card')}
              title="Card Grid View"
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Cards</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              title="Compact Table View"
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List size={14} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ProcurementFilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        offices={offices}
        suppliers={supplierList}
        fundClusters={fundClusters}
        statuses={statuses}
        totalRecords={poTransactions.length}
        filteredCount={filteredTransactions.length}
        needsAttentionCount={needsAttentionCount}
        showSupplierFilter={true}
      />

      {/* CARD VIEW */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3.5">
          {filteredTransactions.map(txn => {
            const supplier = getSupplier(txn.po?.supplierId || '');
            const totalPO = txn.po_items?.reduce((s, i) => s + i.amount, 0) || 0;
            const isIncomplete =
              txn.status === STATUS.PARTIALLY_ACCEPTED || txn.status === STATUS.AWAITING_COMPLETION;
            const isForInspection =
              txn.status === STATUS.FOR_INSPECTION || txn.status === STATUS.DELIVERY_RECEIVED;

            const stages = getTransactionStages(txn);

            // Delivery reconciliation logic
            const latestBatch = [...(txn.deliveries || [])].reverse()[0];
            const ddr = latestBatch?.discrepancyRecord;

            const totalOrdered = txn.po_items?.reduce((s, i) => s + i.qty, 0) || 0;
            const acceptedQty =
              ddr?.totalAccepted ??
              (txn.deliveries || []).reduce(
                (acc, b) => acc + b.items.reduce((sum, item) => sum + item.acceptedQty, 0),
                0
              );
            const rejectedQty = ddr?.totalRejected ?? 0;
            const undeliveredQty = ddr?.totalUndelivered ?? Math.max(0, totalOrdered - acceptedQty);
            const outstandingQty = ddr?.totalOutstanding ?? (rejectedQty + undeliveredQty);

            const unitCost = txn.po_items?.[0]?.unitCost || 0;
            const acceptedAmount = acceptedQty * unitCost;
            const outstandingAmount = outstandingQty * unitCost;

            // Incomplete delivery case classification
            let caseTitle = 'Incomplete Delivery';
            if (rejectedQty > 0 && undeliveredQty > 0) {
              caseTitle = 'Case C — Short Delivery + Defective Items';
            } else if (rejectedQty > 0 && undeliveredQty === 0) {
              caseTitle = 'Case B — Defective Items (Awaiting Replacement)';
            } else if (undeliveredQty > 0 && rejectedQty === 0) {
              caseTitle = 'Case A — Short Quantity Only';
            }

            const currentBatchCount = txn.deliveries?.length || 0;

            return (
              <div
                key={txn.id}
                className={`bg-white p-3.5 rounded-xl border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs space-y-2.5 ${
                  isIncomplete ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Header row */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileSignature size={15} className="text-purple-600 flex-shrink-0" />
                      <span className="font-extrabold text-slate-900 text-xs tracking-tight font-mono">
                        {txn.po?.no}
                      </span>
                      <span className="px-1.5 py-0.2 bg-purple-50 text-purple-800 rounded font-mono font-bold text-[9px]">
                        {txn.version || 'v1.0'}
                      </span>
                      {txn.isLocked ? (
                        <span title="Locked Official Government Record" className="text-slate-400">
                          <Lock size={11} />
                        </span>
                      ) : (
                        <span title="Draft State" className="text-slate-400">
                          <Unlock size={11} />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onDownloadForm('Appendix 61 (PO)', txn)}
                        title="Download Appendix 61 (PO) - Pre-Export Validated"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      >
                        <Download size={13} />
                      </button>
                      <button
                        onClick={() => setDrawerTxn(txn)}
                        title="View Full Specifications, Audit Trail & Workflow Stages"
                        className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors cursor-pointer"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Explicit Multi-Stage Progression Strip */}
                  <div className="mt-2 p-1.5 bg-slate-50/80 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">Delivery Stage:</span>
                      <span className="font-bold text-amber-900 bg-amber-100/70 px-1.5 py-0.2 rounded font-mono">
                        {stages.deliveryStage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">IAR Acceptance:</span>
                      <span className="font-semibold text-emerald-900 font-mono">
                        {stages.iarStage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">Inventory Posting:</span>
                      <span className="font-semibold text-slate-800 font-mono truncate max-w-[170px]" title={stages.inventoryPostingStage}>
                        {stages.inventoryPostingStage}
                      </span>
                    </div>
                  </div>

                  {/* Supplier & Contract Metadata */}
                  <div className="space-y-1.5 mt-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {supplier?.name || 'Accredited Supplier'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">{txn.po?.mode}</p>
                      <p className="text-[10px] text-slate-400 truncate">{txn.po?.supplierAddress}</p>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-[10px] text-slate-600 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Ref PR:</span>
                        <span className="font-semibold bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-800 font-mono">
                          {txn.pr.no}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">ORS / BURS No:</span>
                        <span className="font-mono font-semibold text-slate-700">{txn.po?.orsBursNo}</span>
                      </div>

                      {txn.dr && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Latest DR / Invoice:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {txn.dr.invoiceNo} (Batch #{txn.dr.batchNo || currentBatchCount})
                          </span>
                        </div>
                      )}

                      {txn.iar && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Inspection & Acceptance:</span>
                          <span className="font-semibold text-emerald-700 flex items-center gap-1 font-mono">
                            {txn.iar.no}
                            <button
                              onClick={() => onDownloadForm('Appendix 62 (IAR)', txn)}
                              title="Download Appendix 62 (IAR)"
                              className="p-0.5 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            >
                              <Download size={10} />
                            </button>
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-semibold text-xs">
                        <span className="text-slate-500">Contract Sum:</span>
                        <span className="font-bold text-slate-900 font-mono">₱{totalPO.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Incomplete Delivery Control Card */}
                    {isIncomplete && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-950">
                            <AlertTriangle size={13} className="text-amber-600" />
                            <span>{caseTitle}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded">
                            {outstandingQty} Outstanding
                          </span>
                        </div>

                        {/* Quantity Breakdown Grid */}
                        <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                          <div className="p-1 bg-white rounded border border-slate-200">
                            <span className="text-slate-400 block font-medium">PO Qty</span>
                            <span className="font-bold font-mono text-slate-800">{totalOrdered}</span>
                          </div>
                          <div className="p-1 bg-emerald-50 rounded border border-emerald-200">
                            <span className="text-emerald-700 block font-medium">Accepted</span>
                            <span className="font-bold font-mono text-emerald-900">{acceptedQty}</span>
                          </div>
                          <div className="p-1 bg-rose-50 rounded border border-rose-200">
                            <span className="text-rose-700 block font-medium">Rejected</span>
                            <span className="font-bold font-mono text-rose-900">{rejectedQty}</span>
                          </div>
                          <div className="p-1 bg-amber-50 rounded border border-amber-200">
                            <span className="text-amber-700 block font-medium">Undelivered</span>
                            <span className="font-bold font-mono text-amber-900">{undeliveredQty}</span>
                          </div>
                        </div>

                        {/* Statutory Safeguard Note */}
                        <div className="bg-white p-1.5 rounded-lg border border-amber-200 text-[10px] text-slate-700 space-y-0.5">
                          <p className="leading-snug">
                            <strong>{acceptedQty} of {totalOrdered} units</strong> eligible for inventory posting. Rejected and undelivered goods are strictly barred from school stock cards.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 100% Completed Card */}
                    {txn.status === STATUS.COMPLETED && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2 text-[10px] text-emerald-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={13} className="text-emerald-600" />
                          <span><strong>100% Contract Fulfilled:</strong> All {totalOrdered} units accepted in property custody.</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-800">
                          ₱{totalPO.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {txn.status === STATUS.PENDING_DELIVERY && (
                    <button
                      onClick={() => onOpenLogDelivery(txn)}
                      className="w-full py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Truck size={13} /> Log Delivery Receipt (DR)
                    </button>
                  )}

                  {isForInspection && (
                    <button
                      onClick={() => onOpenInspectIAR(txn)}
                      className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ClipboardCheck size={13} /> Inspect Goods & Issue Appendix 62 (IAR)
                    </button>
                  )}

                  {isIncomplete && (
                    <div className="space-y-1">
                      <button
                        onClick={() => onOpenLogDelivery(txn)}
                        className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Layers size={13} /> Log Next Tranche (Batch #{currentBatchCount + 1})
                      </button>

                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => onOpenViewDDR(txn)}
                          title="View Delivery Discrepancy Record (DDR)"
                          className="py-1 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded-md text-[10px] font-bold border border-rose-200 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <AlertTriangle size={11} /> View DDR Record
                        </button>

                        <button
                          onClick={() => onOpenSupplierNotice(txn)}
                          title="Official Supplier Deficiency Notice"
                          className="py-1 bg-orange-50 text-orange-900 hover:bg-orange-100 rounded-md text-[10px] font-bold border border-orange-200 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Send size={11} /> Supplier Notice
                        </button>
                      </div>
                    </div>
                  )}

                  {txn.status === STATUS.COMPLETED && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onDownloadForm('Appendix 62 (IAR)', txn)}
                        className="flex-1 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Download size={12} /> Appendix 62 (IAR)
                      </button>
                      <button
                        onClick={() => onDownloadForm('Appendix 61 (PO)', txn)}
                        className="py-1 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Download size={12} /> PO
                      </button>
                      <button
                        onClick={() => setDrawerTxn(txn)}
                        className="py-1 px-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW (Sticky Header Contract & Delivery Ledger) */
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto max-h-[620px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/95 backdrop-blur-xs sticky top-0 border-b border-slate-200 text-slate-600 font-bold text-[11px] z-10 shadow-2xs">
                <tr>
                  <th className="p-3 w-36">PO Number</th>
                  <th className="p-3 w-48">Supplier & Mode</th>
                  <th className="p-3 w-28">Ref PR</th>
                  <th className="p-3 text-right w-28">Contract Sum</th>
                  <th className="p-3 text-center w-52">Delivery Status (Acc / Rej / Out)</th>
                  <th className="p-3 text-center w-36">Delivery / IAR Stage</th>
                  <th className="p-3 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map(txn => {
                  const supplier = getSupplier(txn.po?.supplierId || '');
                  const totalPO = txn.po_items?.reduce((s, i) => s + i.amount, 0) || 0;
                  const latestBatch = [...(txn.deliveries || [])].reverse()[0];
                  const ddr = latestBatch?.discrepancyRecord;

                  const totalOrdered = txn.po_items?.reduce((s, i) => s + i.qty, 0) || 0;
                  const acceptedQty =
                    ddr?.totalAccepted ??
                    (txn.deliveries || []).reduce(
                      (acc, b) => acc + b.items.reduce((sum, item) => sum + item.acceptedQty, 0),
                      0
                    );
                  const rejectedQty = ddr?.totalRejected ?? 0;
                  const undeliveredQty = ddr?.totalUndelivered ?? Math.max(0, totalOrdered - acceptedQty);
                  const outstandingQty = ddr?.totalOutstanding ?? (rejectedQty + undeliveredQty);

                  const isIncomplete =
                    txn.status === STATUS.PARTIALLY_ACCEPTED || txn.status === STATUS.AWAITING_COMPLETION;
                  const isForInspection =
                    txn.status === STATUS.FOR_INSPECTION || txn.status === STATUS.DELIVERY_RECEIVED;

                  const stages = getTransactionStages(txn);

                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* PO Number */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <FileSignature size={14} className="text-purple-600 flex-shrink-0" />
                          <span className="font-bold text-slate-900 font-mono text-xs">
                            {txn.po?.no}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {txn.version || 'v1.0'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          Date: {txn.po?.date}
                        </span>
                      </td>

                      {/* Supplier */}
                      <td className="p-3">
                        <span className="font-bold text-slate-800 block text-xs truncate max-w-[190px]">
                          {supplier?.name || 'Accredited Supplier'}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block max-w-[190px]">
                          {txn.po?.mode}
                        </span>
                      </td>

                      {/* Ref PR */}
                      <td className="p-3">
                        <span className="font-mono text-xs font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {txn.pr.no}
                        </span>
                      </td>

                      {/* Contract Sum */}
                      <td className="p-3 text-right">
                        <span className="font-extrabold text-slate-900 font-mono text-xs block">
                          ₱{totalPO.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{txn.po?.orsBursNo}</span>
                      </td>

                      {/* Delivery Reconciliation Matrix */}
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-1 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold" title="Accepted Compliant">
                            {acceptedQty} Acc
                          </span>
                          <span className="text-slate-300">/</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${rejectedQty > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'}`} title="Rejected Defective">
                            {rejectedQty} Rej
                          </span>
                          <span className="text-slate-300">/</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${outstandingQty > 0 ? 'bg-purple-100 text-purple-900' : 'bg-slate-100 text-slate-400'}`} title="Total Outstanding">
                            {outstandingQty} Out
                          </span>
                        </div>
                      </td>

                      {/* Explicit Stage */}
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 block mb-0.5">
                          {stages.deliveryStage}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          {stages.iarStage}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onDownloadForm('Appendix 61 (PO)', txn)}
                            title="Download Appendix 61 (PO) - Pre-Export Validated"
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                          </button>

                          <button
                            onClick={() => setDrawerTxn(txn)}
                            title="View Full Specifications & Audit Trail"
                            className="p-1 hover:bg-purple-50 text-slate-400 hover:text-purple-700 rounded transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>

                          {txn.status === STATUS.PENDING_DELIVERY && (
                            <button
                              onClick={() => onOpenLogDelivery(txn)}
                              className="px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded text-[10px] font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <Truck size={11} /> Log DR
                            </button>
                          )}

                          {isForInspection && (
                            <button
                              onClick={() => onOpenInspectIAR(txn)}
                              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <ClipboardCheck size={11} /> Inspect
                            </button>
                          )}

                          {isIncomplete && (
                            <>
                              <button
                                onClick={() => onOpenLogDelivery(txn)}
                                title="Log Subsequent Delivery / Replacement"
                                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                              >
                                <Layers size={10} /> Next
                              </button>
                              <button
                                onClick={() => onOpenViewDDR(txn)}
                                title="View Delivery Discrepancy Record (DDR)"
                                className="p-1 hover:bg-rose-100 text-rose-700 bg-rose-50 rounded border border-rose-200 cursor-pointer"
                              >
                                <AlertTriangle size={11} />
                              </button>
                              <button
                                onClick={() => onOpenSupplierNotice(txn)}
                                title="Supplier Deficiency Notice"
                                className="p-1 hover:bg-orange-100 text-orange-800 bg-orange-50 rounded border border-orange-200 cursor-pointer"
                              >
                                <Send size={11} />
                              </button>
                            </>
                          )}

                          {txn.status === STATUS.COMPLETED && (
                            <button
                              onClick={() => onDownloadForm('Appendix 62 (IAR)', txn)}
                              title="Download Appendix 62 (IAR)"
                              className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Download size={11} /> IAR
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Showing {filteredTransactions.length} of {poTransactions.length} Purchase Orders</span>
            <span className="font-medium text-slate-700">Appendix 61 & 62 Contract Control Ledger • COA GAM Vol II</span>
          </div>
        </div>
      )}

      {/* Slide-out Full Specification & Audit Drawer */}
      {drawerTxn && (
        <TransactionDetailDrawer
          isOpen={Boolean(drawerTxn)}
          onClose={() => setDrawerTxn(null)}
          txn={drawerTxn}
          suppliers={supplierList}
          schoolProfile={schoolProfile}
          onSaveAmendment={updated => {
            if (onSaveAmendment) onSaveAmendment(updated);
            setDrawerTxn(updated);
          }}
        />
      )}
    </div>
  );
};
