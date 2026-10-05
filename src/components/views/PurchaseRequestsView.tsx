import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle,
  Download,
  LayoutGrid,
  List,
  Building,
  Calendar,
  Layers,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  Clock,
  Eye
} from 'lucide-react';
import { Transaction, Supplier, STATUS } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { getTransactionStages } from '../../utils/transactionStages';
import {
  ProcurementFilterToolbar,
  FilterToolbarState
} from '../common/ProcurementFilterToolbar';
import { TransactionDetailDrawer } from '../modals/TransactionDetailDrawer';

interface PurchaseRequestsViewProps {
  transactions: Transaction[];
  supplierList: Supplier[];
  schoolProfile?: SchoolProfile;
  onOpenCreatePR: () => void;
  onOpenAwardPO: (txn: Transaction) => void;
  onDownloadForm: (formType: string, txn: Transaction) => void;
  onSaveAmendment?: (updatedTxn: Transaction) => void;
}

export const PurchaseRequestsView: React.FC<PurchaseRequestsViewProps> = ({
  transactions,
  supplierList,
  schoolProfile,
  onOpenCreatePR,
  onOpenAwardPO,
  onDownloadForm,
  onSaveAmendment
}) => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [drawerTxn, setDrawerTxn] = useState<Transaction | null>(null);

  const needsAttentionCount = transactions.filter(t => getTransactionStages(t).needsAttention).length;

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

  // Distinct filter options
  const offices = Array.from(new Set(transactions.map(t => t.pr.office))).filter(Boolean);
  const fundClusters = Array.from(new Set(transactions.map(t => t.pr.fundCluster))).filter(Boolean);
  const statuses = Array.from(new Set(transactions.map(t => t.status))).filter(Boolean);

  const filteredTransactions = transactions.filter(txn => {
    const stages = getTransactionStages(txn);

    // Search query matches PR no, office, purpose, or item description
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const itemDesc = txn.pr_items.map(i => i.desc).join(' ').toLowerCase();
      const matchesSearch =
        txn.pr.no.toLowerCase().includes(q) ||
        txn.pr.office.toLowerCase().includes(q) ||
        txn.pr.purpose.toLowerCase().includes(q) ||
        (txn.po?.no.toLowerCase().includes(q) ?? false) ||
        (txn.iar?.no.toLowerCase().includes(q) ?? false) ||
        itemDesc.includes(q);
      if (!matchesSearch) return false;
    }

    if (filters.office && txn.pr.office !== filters.office) return false;
    if (filters.fundCluster && txn.pr.fundCluster !== filters.fundCluster) return false;
    if (filters.status && txn.status !== filters.status) return false;

    // Supplier filter
    if (filters.supplierId && txn.po?.supplierId !== filters.supplierId) return false;

    // Date range
    if (filters.dateFrom && txn.pr.date < filters.dateFrom) return false;
    if (filters.dateTo && txn.pr.date > filters.dateTo) return false;

    // Needs attention filter
    if (filters.needsAttentionOnly && !stages.needsAttention) return false;

    return true;
  });

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-1 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Purchase Requests (Appendix 60)
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            GAM Volume II • Requisition Initiation, Explicit Procurement Lifecycle & Pre-Export Audit
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Card / Table View Switcher */}
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

          {/* New PR Button */}
          <button
            onClick={onOpenCreatePR}
            className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} /> + New Purchase Request
          </button>
        </div>
      </div>

      {/* Compact Filter Toolbar */}
      <ProcurementFilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        offices={offices}
        suppliers={supplierList}
        fundClusters={fundClusters}
        statuses={statuses}
        totalRecords={transactions.length}
        filteredCount={filteredTransactions.length}
        needsAttentionCount={needsAttentionCount}
        showSupplierFilter={true}
      />

      {/* CARD VIEW */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3.5">
          {filteredTransactions.map(txn => {
            const totalCost = txn.pr_items.reduce((s, i) => s + i.totalCost, 0);
            const stages = getTransactionStages(txn);

            return (
              <div
                key={txn.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-2.5"
              >
                <div>
                  {/* Card Header: PR No, Version, Locked state & Download */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-blue-600 flex-shrink-0" />
                      <span className="font-extrabold text-slate-900 text-xs tracking-tight font-mono">
                        {txn.pr.no}
                      </span>
                      <span className="px-1.5 py-0.2 bg-blue-50 text-blue-800 rounded font-mono font-bold text-[9px]">
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
                        onClick={() => onDownloadForm('Appendix 60 (PR)', txn)}
                        title="Download Appendix 60 (PR) - Subject to Pre-Export Validation"
                        className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      >
                        <Download size={13} />
                      </button>
                      <button
                        onClick={() => setDrawerTxn(txn)}
                        title="View Full Specifications, Audit Trail & Workflow Stages"
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Explicit Multi-Stage Progression Strip */}
                  <div className="mt-2 p-1.5 bg-slate-50/80 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">Requisition State:</span>
                      <span className="font-bold text-blue-900 bg-blue-100/70 px-1.5 py-0.2 rounded font-mono">
                        PR {stages.prStage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">PO Stage:</span>
                      <span className="font-semibold text-purple-900 font-mono">
                        {stages.poStage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium">Delivery & Inspection:</span>
                      <span className="font-semibold text-emerald-900 font-mono">
                        {stages.iarStage}
                      </span>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>
                        Office: <strong className="text-slate-800">{txn.pr.office}</strong>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">Date: {txn.pr.date}</span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-[11px] text-slate-700 italic line-clamp-2">
                      "{txn.pr.purpose}"
                    </div>

                    {/* Items summary */}
                    <div className="border border-slate-200/80 rounded-lg overflow-hidden">
                      <table className="w-full text-[10px] text-left">
                        <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100">
                          <tr>
                            <th className="p-1.5">Item Description</th>
                            <th className="p-1.5 text-center w-16">Qty</th>
                            <th className="p-1.5 text-right w-20">Unit Cost</th>
                            <th className="p-1.5 text-right w-20">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {txn.pr_items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-1.5 font-medium text-slate-800 truncate max-w-[130px]" title={item.desc}>
                                {item.desc}
                              </td>
                              <td className="p-1.5 text-center text-slate-600 font-semibold">
                                {item.qty} {item.unit}
                              </td>
                              <td className="p-1.5 text-right font-mono text-slate-500">
                                ₱{item.unitCost.toLocaleString()}
                              </td>
                              <td className="p-1.5 text-right font-mono font-bold text-slate-800">
                                ₱{item.totalCost.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Estimated Budget & Next Action */}
                    <div className="flex justify-between items-center pt-1 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Next Operational Action:</span>
                        <span className="font-semibold text-slate-800 text-[10px] truncate max-w-[180px] block" title={stages.nextAction}>
                          {stages.nextAction}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Estimated Budget:</span>
                        <span className="font-extrabold text-slate-900 text-xs font-mono">
                          ₱{totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="pt-2 border-t border-slate-100">
                  {txn.status === STATUS.PENDING_PO ? (
                    <button
                      onClick={() => onOpenAwardPO(txn)}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs text-center cursor-pointer active:scale-95"
                    >
                      Award Purchase Order
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-200/60 flex items-center justify-center gap-1.5 cursor-default">
                        <CheckCircle size={13} className="text-emerald-600" />
                        <span>PO Awarded ({txn.po?.no})</span>
                      </div>
                      <button
                        onClick={() => setDrawerTxn(txn)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer"
                        title="View Full Specifications & Audit Trail"
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
        /* TABLE VIEW (Sticky Header, Compact & Detailed Government Procurement Roster) */
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto max-h-[620px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/95 backdrop-blur-xs sticky top-0 border-b border-slate-200 text-slate-600 font-bold text-[11px] z-10 shadow-2xs">
                <tr>
                  <th className="p-3 w-36">PR Number</th>
                  <th className="p-3 w-28">Date Filed</th>
                  <th className="p-3 w-48">Requisitioning Office</th>
                  <th className="p-3">Purpose & Requested Items</th>
                  <th className="p-3 text-right w-36">Estimated Budget</th>
                  <th className="p-3 text-center w-36">PR / PO Stage</th>
                  <th className="p-3 text-center w-40">Next Action</th>
                  <th className="p-3 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map(txn => {
                  const totalCost = txn.pr_items.reduce((s, i) => s + i.totalCost, 0);
                  const itemCount = txn.pr_items.length;
                  const firstItem = txn.pr_items[0];
                  const stages = getTransactionStages(txn);

                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* PR Number */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <FileText size={14} className="text-blue-600 flex-shrink-0" />
                          <span className="font-bold text-slate-900 font-mono text-xs">
                            {txn.pr.no}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {txn.version || 'v1.0'}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        {txn.pr.date}
                      </td>

                      {/* Office */}
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 block text-xs">
                          {txn.pr.office}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {txn.pr.fundCluster.split('-')[0].trim()}
                        </span>
                      </td>

                      {/* Purpose & Items */}
                      <td className="p-3">
                        <p className="text-xs text-slate-800 line-clamp-1 italic mb-1" title={txn.pr.purpose}>
                          "{txn.pr.purpose}"
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="font-medium text-slate-700 truncate max-w-[200px]" title={firstItem?.desc}>
                            {firstItem?.desc} ({firstItem?.qty} {firstItem?.unit})
                          </span>
                          {itemCount > 1 && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono text-[9px] font-bold flex-shrink-0">
                              +{itemCount - 1} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="p-3 text-right">
                        <span className="font-extrabold text-slate-900 font-mono text-xs block">
                          ₱{totalCost.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">Estimated Sum</span>
                      </td>

                      {/* PR / PO Stage */}
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 block mb-0.5">
                          PR {stages.prStage}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          {stages.poStage}
                        </span>
                      </td>

                      {/* Next Action */}
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md inline-block max-w-[150px] truncate" title={stages.nextAction}>
                          {stages.nextAction}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onDownloadForm('Appendix 60 (PR)', txn)}
                            title="Download Appendix 60 (PR) - Pre-Export Validated"
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                          </button>

                          <button
                            onClick={() => setDrawerTxn(txn)}
                            title="View Full Specifications & Audit Trail"
                            className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-700 rounded transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>

                          {txn.status === STATUS.PENDING_PO && (
                            <button
                              onClick={() => onOpenAwardPO(txn)}
                              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer whitespace-nowrap ml-1"
                            >
                              Award PO
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
            <span>Showing {filteredTransactions.length} of {transactions.length} Purchase Requests</span>
            <span className="font-medium text-slate-700">Appendix 60 Prescribed Format • DepEd DO 41, s. 2021</span>
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
