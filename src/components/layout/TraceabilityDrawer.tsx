import React, { useState } from 'react';
import {
  X,
  History,
  FileText,
  FileSignature,
  ClipboardCheck,
  Download,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PackageCheck,
  Search
} from 'lucide-react';
import { Transaction, Supplier, STATUS } from '../../types';
import { StatusPill } from '../common/StatusPill';

interface TraceabilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  suppliers: Supplier[];
  onDownloadForm: (formType: string, txn: Transaction) => void;
}

export const TraceabilityDrawer: React.FC<TraceabilityDrawerProps> = ({
  isOpen,
  onClose,
  transactions,
  suppliers,
  onDownloadForm
}) => {
  const [activeTab, setActiveTab] = useState<'processing' | 'completed'>('processing');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const getSupplierName = (id: string) => {
    return suppliers.find(s => s.id === id)?.name || 'Accredited Supplier';
  };

  // Segregate into Processing vs Completed
  const processingTxns = transactions.filter(t => t.status !== STATUS.COMPLETED);
  const completedTxns = transactions.filter(t => t.status === STATUS.COMPLETED);

  const displayedTxns = (activeTab === 'processing' ? processingTxns : completedTxns).filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const supName = t.po ? getSupplierName(t.po.supplierId).toLowerCase() : '';
    return (
      t.pr.no.toLowerCase().includes(q) ||
      t.pr.office.toLowerCase().includes(q) ||
      (t.po?.no.toLowerCase().includes(q) ?? false) ||
      (t.iar?.no.toLowerCase().includes(q) ?? false) ||
      supName.includes(q)
    );
  });

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col justify-between flex-shrink-0 z-20 shadow-xs h-full font-sans select-none">
      {/* Header */}
      <div className="h-13 flex items-center justify-between px-3.5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100 rounded text-slate-700">
            <History size={14} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs tracking-tight">DepEd Traceability Chain</h3>
            <p className="text-[10px] text-slate-400">PR ➔ PO ➔ IAR Life Cycle</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Tabs: Processing vs Completed */}
      <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 bg-slate-50/70 space-y-2">
        <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('processing')}
            className={`py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              activeTab === 'processing'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Processing</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-300/80 text-slate-700'
              }`}
            >
              {processingTxns.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Completed</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-300/80 text-slate-700'
              }`}
            >
              {completedTxns.length}
            </span>
          </button>
        </div>

        {/* Search filter input */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search cycle, PR, PO, or IAR..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-md outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
          />
        </div>
      </div>

      {/* Chain Cycles List (Compact Design) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {displayedTxns.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 space-y-2">
            <div className="w-9 h-9 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              {activeTab === 'processing' ? <Clock size={16} /> : <PackageCheck size={16} />}
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {activeTab === 'processing' ? 'No active cycles in processing' : 'No completed cycles yet'}
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {activeTab === 'processing'
                ? 'All purchase requisitions have reached completion and final property custody.'
                : 'Transactions that have completed physical delivery and full inspection will appear here.'}
            </p>
          </div>
        ) : (
          displayedTxns.map((txn, index) => {
            const cycleTotal = txn.po
              ? (txn.po_items || []).reduce((s, i) => s + i.amount, 0)
              : txn.pr_items.reduce((s, i) => s + i.totalCost, 0);

            // Latest discrepancy stats
            const latestBatch = [...(txn.deliveries || [])].reverse()[0];
            const ddr = latestBatch?.discrepancyRecord;
            const outstandingQty = ddr?.totalOutstanding ?? 0;
            const hasDiscrepancy =
              txn.status === STATUS.PARTIALLY_ACCEPTED ||
              txn.status === STATUS.AWAITING_COMPLETION;

            return (
              <div
                key={txn.id}
                className="bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-2"
              >
                {/* Compact Cycle Header */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-900 font-mono">
                      Cycle #{index + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">• ₱{cycleTotal.toLocaleString()}</span>
                  </div>
                  <StatusPill status={txn.status} />
                </div>

                {/* Vertical Connected Compact Stepper */}
                <div className="space-y-1 pl-0.5">
                  {/* Step 1: PR */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                        <FileText size={10} className="text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-[11px] font-mono">
                            {txn.pr.no}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                          {txn.pr.office}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDownloadForm('Appendix 60 (PR)', txn)}
                      title="Download Appendix 60 (PR)"
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer flex-shrink-0"
                    >
                      <Download size={11} />
                    </button>
                  </div>

                  {/* Connector 1 */}
                  <div className="w-0.5 h-2 bg-slate-200 ml-2.5" />

                  {/* Step 2: PO */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {txn.po ? (
                        <div className="w-5 h-5 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                          <FileSignature size={10} className="text-purple-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center flex-shrink-0">
                          <Clock size={10} className="text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 leading-tight">
                        {txn.po ? (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 text-[11px] font-mono">
                                {txn.po.no}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                              {getSupplierName(txn.po.supplierId)}
                            </p>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">PO Pending Award</span>
                        )}
                      </div>
                    </div>
                    {txn.po && (
                      <button
                        onClick={() => onDownloadForm('Appendix 61 (PO)', txn)}
                        title="Download Appendix 61 (PO)"
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Download size={11} />
                      </button>
                    )}
                  </div>

                  {/* Connector 2 */}
                  <div className="w-0.5 h-2 bg-slate-200 ml-2.5" />

                  {/* Step 3: IAR */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {txn.iar ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                          <ClipboardCheck size={10} className="text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center flex-shrink-0">
                          <Clock size={10} className="text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 leading-tight">
                        {txn.iar ? (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 text-[11px] font-mono">
                                {txn.iar.no}
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[170px]">
                              {txn.status === STATUS.COMPLETED ? 'Fully Accepted' : 'Partially Accepted'}
                            </p>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">IAR Pending Inspection</span>
                        )}
                      </div>
                    </div>
                    {txn.iar && (
                      <button
                        onClick={() => onDownloadForm('Appendix 62 (IAR)', txn)}
                        title="Download Appendix 62 (IAR)"
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Download size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Ultra-compact DDR Alert Strip if Discrepancy Active */}
                {hasDiscrepancy && (
                  <div className="mt-1 pt-1.5 border-t border-rose-100 flex items-center justify-between bg-rose-50/70 px-2 py-1 rounded text-[10px] text-rose-900">
                    <span className="font-bold font-mono flex items-center gap-1">
                      <AlertTriangle size={10} className="text-rose-600" /> DDR Active
                    </span>
                    <span className="font-semibold text-rose-700">
                      {outstandingQty > 0 ? `${outstandingQty} Units Outstanding` : 'Awaiting Replacement'}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 text-[10px] text-slate-500 flex justify-between items-center">
        <span>Active Lifecycle Tracking</span>
        <span className="font-mono font-semibold text-slate-700">{transactions.length} Total Cycles</span>
      </div>
    </aside>
  );
};
