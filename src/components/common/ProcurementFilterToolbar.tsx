import React from 'react';
import {
  Search,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { Supplier } from '../../types';

export interface FilterToolbarState {
  searchQuery: string;
  office: string;
  supplierId: string;
  fundCluster: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  needsAttentionOnly: boolean;
}

interface ProcurementFilterToolbarProps {
  filters: FilterToolbarState;
  onFilterChange: (newFilters: FilterToolbarState) => void;
  onClearFilters: () => void;
  offices: string[];
  suppliers: Supplier[];
  fundClusters: string[];
  statuses: string[];
  totalRecords: number;
  filteredCount: number;
  needsAttentionCount?: number;
  showSupplierFilter?: boolean;
}

export const ProcurementFilterToolbar: React.FC<ProcurementFilterToolbarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  offices,
  suppliers,
  fundClusters,
  statuses,
  totalRecords,
  filteredCount,
  needsAttentionCount = 0,
  showSupplierFilter = true
}) => {
  const isFiltered =
    Boolean(filters.searchQuery) ||
    Boolean(filters.office) ||
    Boolean(filters.supplierId) ||
    Boolean(filters.fundCluster) ||
    Boolean(filters.status) ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo) ||
    filters.needsAttentionOnly;

  const update = (field: keyof FilterToolbarState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-2xs space-y-2 text-xs">
      {/* Row 1: Primary Search, Needs Attention Toggle, Result Count & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by PR, PO, IAR #, supplier, or item description..."
              value={filters.searchQuery}
              onChange={e => update('searchQuery', e.target.value)}
              className="w-full pl-7 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-400 text-slate-800 placeholder:text-slate-400 transition-colors"
            />
          </div>

          {/* Needs Attention Toggle with Live Count Badge */}
          <button
            onClick={() => update('needsAttentionOnly', !filters.needsAttentionOnly)}
            title="Filter records with unresolved operational actions"
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              filters.needsAttentionOnly
                ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <AlertTriangle size={12} className={filters.needsAttentionOnly ? 'text-rose-600' : 'text-slate-400'} />
            <span>Needs Attention</span>
            <span
              className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                filters.needsAttentionOnly
                  ? 'bg-rose-200 text-rose-900'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {needsAttentionCount}
            </span>
          </button>
        </div>

        {/* Counts & Clear */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Showing <strong className="text-slate-800 font-bold">{filteredCount}</strong> of {totalRecords} records
          </span>

          {isFiltered && (
            <button
              onClick={onClearFilters}
              title="Clear all filters and restore full list"
              className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer border border-slate-200"
            >
              <RotateCcw size={11} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Secondary Dropdown Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 pt-1 border-t border-slate-100">
        {/* Office / Section */}
        <div>
          <select
            value={filters.office}
            onChange={e => update('office', e.target.value)}
            className="w-full py-1 px-2 text-[11px] bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="">All Offices</option>
            {offices.map(off => (
              <option key={off} value={off}>
                {off}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier (if applicable) */}
        {showSupplierFilter && (
          <div>
            <select
              value={filters.supplierId}
              onChange={e => update('supplierId', e.target.value)}
              className="w-full py-1 px-2 text-[11px] bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-slate-400 truncate"
            >
              <option value="">All Suppliers</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Fund Cluster */}
        <div>
          <select
            value={filters.fundCluster}
            onChange={e => update('fundCluster', e.target.value)}
            className="w-full py-1 px-2 text-[11px] bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-slate-400 truncate"
          >
            <option value="">All Fund Clusters</option>
            {fundClusters.map(fc => (
              <option key={fc} value={fc}>
                {fc}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={filters.status}
            onChange={e => update('status', e.target.value)}
            className="w-full py-1 px-2 text-[11px] bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="">All Statuses</option>
            {statuses.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5">
          <span className="text-[10px] text-slate-400 font-semibold">From:</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => update('dateFrom', e.target.value)}
            className="w-full bg-transparent text-[11px] text-slate-700 outline-none cursor-pointer"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5">
          <span className="text-[10px] text-slate-400 font-semibold">To:</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => update('dateTo', e.target.value)}
            className="w-full bg-transparent text-[11px] text-slate-700 outline-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
