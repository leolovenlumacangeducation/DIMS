import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle
} from 'lucide-react';
import { FormValidationResult } from '../../utils/formValidation';

interface PreExportValidationModalProps {
  validationResult: FormValidationResult;
  onProceedAnyway?: () => void;
  onClose: () => void;
}

export const PreExportValidationModal: React.FC<PreExportValidationModalProps> = ({
  validationResult,
  onClose
}) => {
  const { formType, recordNumber, recordState, errors, fieldChecks, isValid, validationSummary } = validationResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {isValid ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Pre-Export Document Compliance Audit
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {formType} • Record: <strong className="text-slate-800">{recordNumber}</strong> ({recordState})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {!isValid ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-950">
                <AlertTriangle size={15} className="text-rose-600 flex-shrink-0" />
                <span>Export Blocked: Incomplete Required Government Audit Fields</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                {validationSummary} Under COA Circular No. 2015-007, RA 12009, and DepEd Order No. 41, s. 2021, vouchers with missing signatories, unassigned codes, or unfulfilled terms cannot be officially exported or printed.
              </p>
              <div className="p-2 bg-rose-100/60 rounded-md text-[10px] text-rose-950 font-mono">
                Draft record {recordNumber} has been preserved without loss of entered data.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>All mandatory government fields verified and compliant with GAM Volume II & RA 12009. Ready for Export.</span>
            </div>
          )}

          {/* Missing Fields Summary */}
          {errors.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-rose-700">
                Missing Required Fields ({errors.length}):
              </h4>
              <ul className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {errors.map((err, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-rose-900">
                    <XCircle size={13} className="text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Audit Checklist */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Statutory Field Audit Checklist:
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {fieldChecks.map((chk, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 flex items-center justify-between text-xs ${
                    chk.passed ? 'bg-white' : 'bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {chk.passed ? (
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-rose-600 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold text-[11px] ${chk.passed ? 'text-slate-800' : 'text-rose-900 font-bold'}`}>
                        {chk.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {chk.requirement}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold flex-shrink-0 ${
                      chk.passed
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {chk.passed ? 'VERIFIED' : 'MISSING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close & Correct Record
          </button>
          <span className="text-[10px] text-slate-400 italic">
            Draft data is safely preserved. Correct the required fields to enable official export.
          </span>
        </div>
      </div>
    </div>
  );
};
