import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  History,
  FileText,
  FileSignature,
  ClipboardCheck,
  Building,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Check,
  Info,
  Scale
} from 'lucide-react';
import { Transaction, Supplier, SchoolProfile } from '../../types';
import { getTransactionStages } from '../../utils/transactionStages';
import { StatusPill } from '../common/StatusPill';

interface TransactionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  txn: Transaction;
  suppliers: Supplier[];
  schoolProfile?: SchoolProfile;
  onSaveAmendment?: (updatedTxn: Transaction) => void;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  isOpen,
  onClose,
  txn,
  suppliers,
  schoolProfile,
  onSaveAmendment
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'stages' | 'snapshots' | 'audit'>('details');
  const [isAmending, setIsAmending] = useState(false);
  const [amendmentReason, setAmendmentReason] = useState('');

  if (!isOpen) return null;

  const stages = getTransactionStages(txn);
  const supplier = suppliers.find(s => s.id === txn.po?.supplierId);

  // Delivery discrepancy counts
  const latestBatch = [...(txn.deliveries || [])].reverse()[0];
  const ddr = latestBatch?.discrepancyRecord;
  const totalOrdered = txn.po_items?.reduce((s, i) => s + i.qty, 0) || txn.pr_items.reduce((s, i) => s + i.qty, 0);
  const totalAccepted =
    ddr?.totalAccepted ??
    (txn.deliveries || []).reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.acceptedQty, 0), 0);
  const totalRejected = ddr?.totalRejected ?? 0;
  const totalUndelivered = ddr?.totalUndelivered ?? Math.max(0, totalOrdered - totalAccepted);
  const totalOutstanding = ddr?.totalOutstanding ?? (totalRejected + totalUndelivered);

  const handleCreateAmendment = () => {
    if (!amendmentReason.trim()) return;
    const currentVersionNum = parseFloat(txn.version?.replace('v', '') || '1.0');
    const newVersion = `v${(currentVersionNum + 0.1).toFixed(1)}`;
    const now = new Date().toISOString();

    const newAuditEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: now,
      action: 'Document Amendment Initiated',
      actor: 'Supply Officer / Property Custodian',
      version: newVersion,
      notes: `Amendment: ${amendmentReason}`
    };

    const updated: Transaction = {
      ...txn,
      version: newVersion,
      isLocked: false,
      isSimulated: false,
      lockReason: `Unlocked for official amendment ${newVersion}`,
      lastSavedTimestamp: now,
      auditHistory: [newAuditEntry, ...(txn.auditHistory || [])]
    };

    if (onSaveAmendment) {
      onSaveAmendment(updated);
    }
    setIsAmending(false);
    setAmendmentReason('');
  };

  const legalBasisDisplay = txn.snapshots?.legalBasis || 'DepEd Order No. 41, s. 2021 / RA 12009';
  const templateVersionDisplay = txn.snapshots?.templateVersion || 'GAM Vol. II Appendix 60, 61, 62 Standards';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity" onClick={onClose} />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-200 text-xs font-sans">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 font-mono">
                {txn.pr.no}
              </span>
              {txn.po?.no && (
                <span className="font-mono text-purple-900 font-semibold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 text-[10px]">
                  {txn.po.no}
                </span>
              )}
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-mono font-bold text-[10px]">
                {txn.version || 'v1.0'}
              </span>
              {txn.isLocked ? (
                <span
                  title={txn.lockReason || 'Locked Official Government Record'}
                  className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[10px] flex items-center gap-1 border border-amber-200"
                >
                  <Lock size={10} /> Locked Record
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-semibold text-[10px] flex items-center gap-1">
                  <Unlock size={10} /> Draft State
                </span>
              )}
            </div>

            {/* Prominent Next Operational Action Strip */}
            <div className="flex items-center gap-1.5 text-blue-950 bg-blue-50/90 px-2.5 py-1 rounded-md border border-blue-200 font-medium">
              <Clock size={12} className="text-blue-700 flex-shrink-0" />
              <span>Next Operational Action: <strong className="font-bold text-blue-900">{stages.nextAction}</strong></span>
            </div>

            {/* Legal Basis, Template Version & Simulation metadata */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 pt-0.5">
              <span>Basis: <strong className="text-slate-700">{legalBasisDisplay}</strong></span>
              <span>•</span>
              <span>Template: <strong className="text-slate-700">{templateVersionDisplay}</strong></span>
            </div>

            <div className="text-[10px] text-slate-400 font-mono">
              {txn.isSimulated ? (
                <span className="text-amber-700 font-semibold bg-amber-50/70 px-1.5 py-0.2 rounded">
                  Simulated record — seeded for workflow testing (Demo date: October 5, 2026)
                </span>
              ) : (
                <span>Last saved: {new Date(txn.lastSavedTimestamp).toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusPill status={txn.status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Specifications & Quantities
          </button>
          <button
            onClick={() => setActiveTab('stages')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'stages'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Workflow Stages
          </button>
          <button
            onClick={() => setActiveTab('snapshots')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'snapshots'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck size={13} className={activeTab === 'snapshots' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Historical Snapshot</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'audit'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Audit History</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[9px] font-mono font-bold">
              {(txn.auditHistory || []).length}
            </span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: FULL SPECIFICATIONS & RECONCILIATION */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Delivery Reconciliation Matrix (if deliveries logged) */}
              {(txn.deliveries || []).length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Physical Inspection & Delivery Reconciliation
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Total Ordered: {totalOrdered}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block font-semibold">Accepted Qty</span>
                      <strong className="text-base font-bold text-emerald-900 font-mono">{totalAccepted}</strong>
                      <span className="text-[9px] text-emerald-700 block">Eligible for stock card</span>
                    </div>
                    <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 block font-semibold">Rejected Qty</span>
                      <strong className="text-base font-bold text-rose-900 font-mono">{totalRejected}</strong>
                      <span className="text-[9px] text-rose-700 block">Barred from inventory</span>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-amber-700 block font-semibold">Undelivered Qty</span>
                      <strong className="text-base font-bold text-amber-900 font-mono">{totalUndelivered}</strong>
                      <span className="text-[9px] text-amber-700 block">Awaiting shipment</span>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-[10px] text-purple-700 block font-semibold">Outstanding Qty</span>
                      <strong className="text-base font-bold text-purple-900 font-mono">{totalOutstanding}</strong>
                      <span className="text-[9px] text-purple-700 block">Notice / Cure</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Purpose block */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                  Requisition Purpose & Justification
                </h4>
                <p className="text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-100">
                  "{txn.pr.purpose}"
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400">Fund Cluster:</span>{' '}
                    <strong className="text-slate-800">{txn.pr.fundCluster}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Responsibility Center Code:</span>{' '}
                    <strong className="font-mono text-slate-800">{txn.pr.responsibilityCenterCode}</strong>
                  </div>
                </div>
              </div>

              {/* Line Items Full Specifications */}
              <div>
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                  Line Item Specifications ({txn.pr_items.length})
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {txn.pr_items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white hover:bg-slate-50/50 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] text-slate-400 font-bold mr-2">
                            #{idx + 1} • {item.stockNo}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{item.desc}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          ₱{item.totalCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                        <span>Quantity: <strong className="text-slate-700">{item.qty} {item.unit}</strong></span>
                        <span className="font-mono">Unit Cost: ₱{item.unitCost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Metadata if PO Awarded */}
              {txn.po && (
                <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-950 font-mono">{txn.po.no}</span>
                    <span className="text-[10px] text-purple-800 font-semibold">{txn.po.mode}</span>
                  </div>
                  <p className="font-bold text-slate-800">{supplier?.name}</p>
                  <p className="text-[11px] text-slate-500">{txn.po.supplierAddress}</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pt-1 border-t border-purple-200/60 font-mono">
                    <div>ORS No: {txn.po.orsBursNo}</div>
                    <div>Delivery Term: {txn.po.deliveryTerm}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPLICIT WORKFLOW STAGES */}
          {activeTab === 'stages' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Current Operational Status & Action
                </span>
                <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-600" />
                  {stages.nextAction}
                </p>
                {stages.needsAttention && (
                  <p className="text-[10px] text-rose-700 mt-1 font-semibold flex items-center gap-1">
                    <AlertTriangle size={11} /> {stages.attentionReason}
                  </p>
                )}
              </div>

              {/* Explicit Multi-Stage Roster */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">1. Purchase Request (PR) Stage</p>
                    <p className="text-[10px] text-slate-400">Appendix 60 Requisition & Approval</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 rounded font-semibold text-[11px]">
                    {stages.prStage}
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">2. Purchase Order (PO) Stage</p>
                    <p className="text-[10px] text-slate-400">Appendix 61 Contract Award & Obligation</p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded font-semibold text-[11px]">
                    {stages.poStage}
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">3. Delivery Stage</p>
                    <p className="text-[10px] text-slate-400">Supplier Delivery Receipt (DR) Manifest</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded font-semibold text-[11px]">
                    {stages.deliveryStage}
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">4. Inspection & Acceptance (IAR) Stage</p>
                    <p className="text-[10px] text-slate-400">Appendix 62 IAC Physical & Technical Conformance</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded font-semibold text-[11px]">
                    {stages.iarStage}
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">5. Inventory Posting Stage</p>
                    <p className="text-[10px] text-slate-400">Stock Card / ICS / PAR asset ledger posting</p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]">
                    {stages.inventoryPostingStage}
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">6. Payment & Disbursement Stage</p>
                    <p className="text-[10px] text-slate-400">Accounting disbursement voucher (DV)</p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]">
                    {stages.paymentStage}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORICAL SNAPSHOT */}
          {activeTab === 'snapshots' && (
            <div className="space-y-3">
              {/* Statutory Mandatory Label */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <ShieldCheck size={16} className="text-blue-700" />
                  <span>Historical Snapshot Protection</span>
                </div>
                <p className="text-[11px] text-blue-900/90 leading-relaxed italic">
                  Historical values captured when this transaction was committed. They may differ from current Settings master data.
                </p>
              </div>

              {txn.snapshots ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Snapshot vs. Current Settings Master Data Comparison
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      Captured: {new Date(txn.snapshots.snapshotTimestamp).toLocaleString()}
                    </span>
                  </div>

                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                      <tr>
                        <th className="p-2.5 w-36">Field Dimension</th>
                        <th className="p-2.5">Historical Value (Captured)</th>
                        <th className="p-2.5">Current Settings Master Data</th>
                        <th className="p-2.5 w-28 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* School Name */}
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700">School Name</td>
                        <td className="p-2.5 text-slate-900 font-medium">{txn.snapshots.schoolProfile.schoolName}</td>
                        <td className="p-2.5 text-slate-600">{schoolProfile?.schoolName || txn.snapshots.schoolProfile.schoolName}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Immutable
                          </span>
                        </td>
                      </tr>

                      {/* School ID */}
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700">School ID</td>
                        <td className="p-2.5 font-mono text-slate-900 font-semibold">{txn.snapshots.schoolProfile.schoolId}</td>
                        <td className="p-2.5 font-mono text-slate-600">{schoolProfile?.schoolId || txn.snapshots.schoolProfile.schoolId}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Immutable
                          </span>
                        </td>
                      </tr>

                      {/* Responsibility Center Code */}
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700">RCC Code</td>
                        <td className="p-2.5 font-mono text-slate-900">{txn.snapshots.rcc}</td>
                        <td className="p-2.5 font-mono text-slate-600">{schoolProfile?.uacsCode || txn.snapshots.rcc}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Immutable
                          </span>
                        </td>
                      </tr>

                      {/* Fund Cluster */}
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700">Fund Cluster</td>
                        <td className="p-2.5 text-slate-900">{txn.snapshots.fundCluster}</td>
                        <td className="p-2.5 text-slate-600">{schoolProfile?.defaultFundCluster || txn.snapshots.fundCluster}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Immutable
                          </span>
                        </td>
                      </tr>

                      {/* Requesting Signatory */}
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700">Requisitioner</td>
                        <td className="p-2.5 text-slate-900">
                          {txn.snapshots.signatories.requestedByName} ({txn.snapshots.signatories.requestedByDesignation})
                        </td>
                        <td className="p-2.5 text-slate-600">Preserved as committed</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Immutable
                          </span>
                        </td>
                      </tr>

                      {/* Approving Official */}
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700">Approving (HOPE)</td>
                        <td className="p-2.5 text-slate-900">
                          {txn.snapshots.signatories.approvedByName} ({txn.snapshots.signatories.approvedByDesignation})
                        </td>
                        <td className="p-2.5 text-slate-600">{schoolProfile?.headOfProcuringEntity || txn.snapshots.signatories.approvedByName}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Immutable
                          </span>
                        </td>
                      </tr>

                      {/* Legal Basis & Template */}
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-700">Legal Basis</td>
                        <td className="p-2.5 text-slate-900">{txn.snapshots.legalBasis}</td>
                        <td className="p-2.5 text-slate-600 font-mono text-[11px]">{txn.snapshots.templateVersion}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Immutable
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500">
                  <Clock size={16} className="mx-auto mb-1 text-slate-400" />
                  <p className="font-semibold text-xs">Standard Initial System Snapshot Active</p>
                  <p className="text-[11px] text-slate-400">
                    Snapshots are sealed automatically upon official document commitment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT HISTORY */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Audit Trail & Controlled Versioning History
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-semibold">
                  {(txn.auditHistory || []).length} registered events
                </span>
              </div>

              <div className="space-y-2">
                {(txn.auditHistory || []).map((entry, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold font-mono px-1.5 py-0.2 bg-slate-100 rounded text-slate-800">
                        {entry.version}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{entry.action}</p>
                    <p className="text-[11px] text-slate-600">{entry.notes}</p>
                    <p className="text-[10px] text-slate-400 italic">By: {entry.actor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Controlled Amendment Trigger */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex flex-col gap-2">
          {isAmending ? (
            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 text-xs block">
                Initiate Controlled Amendment:
              </span>
              <textarea
                value={amendmentReason}
                onChange={e => setAmendmentReason(e.target.value)}
                placeholder="State statutory reason for amendment (e.g. Supplier requested delivery extension, price adjustment per BAC resolution)..."
                rows={2}
                className="w-full p-2 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAmending(false)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAmendment}
                  disabled={!amendmentReason.trim()}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Confirm & Create Version
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              {txn.isLocked ? (
                <button
                  onClick={() => setIsAmending(true)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Unlock size={12} /> Create Controlled Amendment / Revision
                </button>
              ) : (
                <span className="text-[11px] text-slate-500">Record is in editable draft state.</span>
              )}

              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
