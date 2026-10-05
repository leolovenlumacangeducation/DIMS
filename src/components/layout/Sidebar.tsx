import React from 'react';
import {
  FileText,
  FileSignature,
  Settings,
  School,
  UserCircle,
  Package,
  ClipboardList
} from 'lucide-react';
import { SchoolProfile } from '../../types';

export type MainNavTab = 'pr' | 'po' | 'settings';

interface SidebarProps {
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  schoolProfile: SchoolProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, schoolProfile }) => {
  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-20">
      <div>
        {/* Brand header */}
        <div className="h-14 flex items-center px-4 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center shadow-xs">
              <School size={15} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none text-xs tracking-tight">DepEd Supply</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">ACQUISITION</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">
            ACQUISITION & CONTRACTS
          </p>

          <button
            onClick={() => onTabChange('pr')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pr'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText size={15} className={activeTab === 'pr' ? 'text-white' : 'text-slate-400'} />
            Purchase Requests
          </button>

          <button
            onClick={() => onTabChange('po')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'po'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileSignature size={15} className={activeTab === 'po' ? 'text-white' : 'text-slate-400'} />
            Purchase Orders
          </button>

          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-5">
            CONFIGURATION & AUDIT
          </p>

          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings size={15} className={activeTab === 'settings' ? 'text-white' : 'text-slate-400'} />
            Settings & Master Data
          </button>
        </nav>
      </div>

      {/* Profile Card at bottom */}
      <div className="p-3 border-t border-slate-100 m-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2.5">
          <UserCircle size={26} className="text-slate-400 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-slate-800 truncate text-[11px]">System Admin</p>
            <p className="text-[10px] text-slate-500 truncate">School ID: {schoolProfile.schoolId}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
