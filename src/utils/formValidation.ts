import { Transaction, SchoolProfile, Supplier, Personnel, DeliveryItem, POItem } from '../types';
import { numberToWords } from './numberToWords';

export interface FieldValidationCheck {
  field: string;
  label: string;
  passed: boolean;
  currentValue?: string | number | null;
  requirement: string;
}

export interface FormValidationResult {
  isValid: boolean;
  formType: 'Appendix 60 (PR)' | 'Appendix 61 (PO)' | 'Appendix 62 (IAR)';
  recordNumber: string;
  recordState: 'Draft' | 'For Review' | 'Approved' | 'Issued' | 'Historical';
  templateVersion: string;
  legalBasis: string;
  legalFramework: string;
  validationSummary: string;
  errors: string[];
  warnings: string[];
  fieldChecks: FieldValidationCheck[];
}

export interface ModalValidationSummary {
  isValid: boolean;
  summaryMessage: string;
  missingFields: string[];
}

/**
 * Creates human-readable summary message following DepEd requirements:
 * e.g. "Cannot submit yet: complete Purpose / Operational Justification."
 * e.g. "3 fields still required: Purpose, approving official, and item specification."
 */
export function formatValidationSummary(
  missingFields: string[],
  actionVerb: 'submit' | 'export' | 'award' | 'issue' = 'submit'
): string {
  if (missingFields.length === 0) {
    return 'Ready — All mandatory government audit fields complete';
  }
  if (missingFields.length === 1) {
    return `Cannot ${actionVerb} yet: complete ${missingFields[0]}.`;
  }
  if (missingFields.length === 2) {
    return `2 fields still required: ${missingFields[0]} and ${missingFields[1]}.`;
  }
  const allExceptLast = missingFields.slice(0, -1).join(', ');
  const last = missingFields[missingFields.length - 1];
  return `${missingFields.length} fields still required: ${allExceptLast}, and ${last}.`;
}

/**
 * Real-time validation for New Purchase Request modal
 */
export function validatePRCreation(
  pr: {
    office: string;
    fundCluster: string;
    responsibilityCenterCode: string;
    purpose: string;
    requestedBy: string;
    approvedBy: string;
  },
  items: Array<{
    id?: number;
    stockNo: string;
    desc: string;
    qty: number;
    unit: string;
    unitCost: number;
    totalCost?: number;
  }>
): ModalValidationSummary {
  const missing: string[] = [];

  if (!pr.office || pr.office.trim().length === 0) {
    missing.push('Requesting office');
  }
  if (!pr.fundCluster || pr.fundCluster.trim().length === 0) {
    missing.push('Fund cluster');
  }
  if (!pr.responsibilityCenterCode || pr.responsibilityCenterCode.trim().length === 0) {
    missing.push('Responsibility Center Code (RCC)');
  }
  if (!pr.purpose || pr.purpose.trim().length < 5) {
    missing.push('Purpose / Operational Justification');
  }
  if (!pr.requestedBy || pr.requestedBy.trim().length === 0) {
    missing.push('Requesting official signatory');
  }
  if (!pr.approvedBy || pr.approvedBy.trim().length === 0) {
    missing.push('Approving official signatory');
  }
  if (!items || items.length === 0) {
    missing.push('At least one line item');
  } else {
    const invalidItems = items.some(
      i => !i.desc || i.desc.trim().length === 0 || !i.unit || i.qty <= 0 || i.unitCost <= 0
    );
    if (invalidItems) {
      missing.push('Item specification, quantity, unit, and unit cost');
    }
  }

  return {
    isValid: missing.length === 0,
    summaryMessage: formatValidationSummary(missing, 'submit'),
    missingFields: missing
  };
}

/**
 * Real-time validation for Award Purchase Order modal
 */
export function validatePOAward(
  po: {
    supplierId: string;
    supplierAddress: string;
    mode: string;
    placeOfDelivery: string;
    deliveryDate: string;
    deliveryTerm: string;
    paymentTerm: string;
    orsBursNo: string;
    orsDate: string;
    authorizedOfficial: string;
    accountantSignatory: string;
  },
  poItems: POItem[]
): ModalValidationSummary {
  const missing: string[] = [];

  if (!po.supplierId || po.supplierId.trim().length === 0) {
    missing.push('Awarded supplier');
  }
  if (!po.supplierAddress || po.supplierAddress.trim().length === 0) {
    missing.push('Supplier address');
  }
  if (!po.mode || po.mode.trim().length === 0) {
    missing.push('Procurement mode');
  }
  if (!po.deliveryTerm || po.deliveryTerm.trim().length === 0) {
    missing.push('Delivery terms');
  }
  if (!po.paymentTerm || po.paymentTerm.trim().length === 0) {
    missing.push('Payment terms');
  }
  if (!po.orsBursNo || po.orsBursNo.trim().length === 0) {
    missing.push('ORS/BURS obligation number');
  }
  if (!po.authorizedOfficial || po.authorizedOfficial.trim().length === 0) {
    missing.push('Authorized official (HOPE)');
  }
  if (!po.accountantSignatory || po.accountantSignatory.trim().length === 0) {
    missing.push('Chief accountant signatory');
  }
  if (!poItems || poItems.length === 0) {
    missing.push('Contract line items');
  } else {
    const invalidCosts = poItems.some(i => i.qty <= 0 || i.unitCost <= 0 || i.amount <= 0);
    if (invalidCosts) {
      missing.push('Valid line item prices and quantities');
    }
  }

  return {
    isValid: missing.length === 0,
    summaryMessage: formatValidationSummary(missing, 'award'),
    missingFields: missing
  };
}

/**
 * Real-time validation for Inspection and Acceptance (IAR) modal
 */
export function validateIARIssuance(
  iar: {
    dateInspected: string;
    iacChairman: string;
    technicalInspector: string;
    custodianOfficer: string;
    conformanceInspection: boolean;
    remarks: string;
  },
  items: DeliveryItem[]
): ModalValidationSummary {
  const missing: string[] = [];

  if (!iar.dateInspected || iar.dateInspected.trim().length === 0) {
    missing.push('Date inspected');
  }
  if (!iar.iacChairman || iar.iacChairman.trim().length === 0) {
    missing.push('IAC inspection chairman');
  }
  if (!iar.technicalInspector || iar.technicalInspector.trim().length === 0) {
    missing.push('Technical inspector signatory');
  }
  if (!iar.custodianOfficer || iar.custodianOfficer.trim().length === 0) {
    missing.push('Property custodian signatory');
  }
  if (!iar.conformanceInspection) {
    missing.push('Technical conformance certification checkbox');
  }
  if (!iar.remarks || iar.remarks.trim().length < 5) {
    missing.push('Official inspection remarks & findings');
  }
  if (!items || items.length === 0) {
    missing.push('Inspected line items breakdown');
  }

  return {
    isValid: missing.length === 0,
    summaryMessage: formatValidationSummary(missing, 'issue'),
    missingFields: missing
  };
}

/**
 * Pre-export validation for Appendix 60 (Purchase Request)
 */
export function validateAppendix60(
  txn: Transaction,
  schoolProfile: SchoolProfile
): FormValidationResult {
  const checks: FieldValidationCheck[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Entity details
  const hasEntityName = Boolean(schoolProfile.schoolName && schoolProfile.schoolName.trim().length > 3);
  checks.push({
    field: 'schoolProfile.schoolName',
    label: 'School / Entity Name',
    passed: hasEntityName,
    currentValue: schoolProfile.schoolName,
    requirement: 'Mandatory DepEd official school name'
  });
  if (!hasEntityName) errors.push('School/entity name is required.');

  const hasSchoolId = Boolean(schoolProfile.schoolId && schoolProfile.schoolId.trim().length > 0);
  checks.push({
    field: 'schoolProfile.schoolId',
    label: 'School ID / Station Code',
    passed: hasSchoolId,
    currentValue: schoolProfile.schoolId,
    requirement: 'Official 6-digit DepEd School ID'
  });
  if (!hasSchoolId) errors.push('School ID is required.');

  // PR Number
  const hasPRNo = Boolean(txn.pr.no && txn.pr.no.trim().length > 3);
  checks.push({
    field: 'pr.no',
    label: 'PR Tracking Number',
    passed: hasPRNo,
    currentValue: txn.pr.no,
    requirement: 'Prescribed PR-YYYY-MM-XXXX format'
  });
  if (!hasPRNo) errors.push('PR Number is required.');

  // Responsibility Center Code (RCC)
  const hasRCC = Boolean(txn.pr.responsibilityCenterCode && txn.pr.responsibilityCenterCode.trim().length > 0);
  checks.push({
    field: 'pr.responsibilityCenterCode',
    label: 'Responsibility Center Code (RCC)',
    passed: hasRCC,
    currentValue: txn.pr.responsibilityCenterCode,
    requirement: 'Valid DepEd 12-digit Responsibility Center Code'
  });
  if (!hasRCC) errors.push('Responsibility Center Code (RCC) is required.');

  // Fund Cluster
  const hasFundCluster = Boolean(txn.pr.fundCluster && txn.pr.fundCluster.trim().length > 0);
  checks.push({
    field: 'pr.fundCluster',
    label: 'Fund Cluster',
    passed: hasFundCluster,
    currentValue: txn.pr.fundCluster,
    requirement: 'Appropriation source (e.g. Regular Agency Fund 01, School MOOE)'
  });
  if (!hasFundCluster) errors.push('Fund Cluster is required.');

  // Requisitioning Office / Section
  const hasOffice = Boolean(txn.pr.office && txn.pr.office.trim().length > 0);
  checks.push({
    field: 'pr.office',
    label: 'Requesting Office / Section',
    passed: hasOffice,
    currentValue: txn.pr.office,
    requirement: 'Designated requesting department, laboratory, or office'
  });
  if (!hasOffice) errors.push('Requesting office is required.');

  // Purpose
  const hasPurpose = Boolean(txn.pr.purpose && txn.pr.purpose.trim().length > 5);
  checks.push({
    field: 'pr.purpose',
    label: 'Purpose / Operational Justification',
    passed: hasPurpose,
    currentValue: txn.pr.purpose,
    requirement: 'Explicit programmatic justification for requisition'
  });
  if (!hasPurpose) errors.push('Purpose / Justification is required.');

  // Signatories: Requesting Official
  const hasRequestedBy = Boolean(txn.pr.requestedBy && txn.pr.requestedBy.trim().length > 0);
  checks.push({
    field: 'pr.requestedBy',
    label: 'Requesting Official Signatory',
    passed: hasRequestedBy,
    currentValue: txn.pr.requestedBy,
    requirement: 'Designated accountable officer requesting goods'
  });
  if (!hasRequestedBy) errors.push('Requesting Official signatory is required.');

  // Signatories: Approving Official (HOPE)
  const hasApprovedBy = Boolean(txn.pr.approvedBy && txn.pr.approvedBy.trim().length > 0);
  checks.push({
    field: 'pr.approvedBy',
    label: 'Approving Official (Head of Procuring Entity)',
    passed: hasApprovedBy,
    currentValue: txn.pr.approvedBy,
    requirement: 'Principal or School Head authorized to obligate'
  });
  if (!hasApprovedBy) errors.push('Approving Official signatory is required.');

  // PR Items Validation
  const hasItems = Boolean(txn.pr_items && txn.pr_items.length > 0);
  checks.push({
    field: 'pr_items.count',
    label: 'Requisition Line Items',
    passed: hasItems,
    currentValue: txn.pr_items?.length || 0,
    requirement: 'At least one line item with valid specifications'
  });
  if (!hasItems) errors.push('At least one item is required in the Purchase Request.');

  let allUnitsValid = true;
  let allCostsValid = true;
  let allQuantitiesValid = true;
  let allDescriptionsValid = true;

  (txn.pr_items || []).forEach(item => {
    if (!item.desc || item.desc.trim().length === 0) allDescriptionsValid = false;
    if (!item.unit || item.unit.trim().length === 0) allUnitsValid = false;
    if (item.unitCost <= 0 || isNaN(item.unitCost)) allCostsValid = false;
    if (item.qty <= 0 || isNaN(item.qty)) allQuantitiesValid = false;
  });

  checks.push({
    field: 'pr_items.desc',
    label: 'Item Descriptions & Specifications',
    passed: allDescriptionsValid,
    requirement: 'Clear specifications for all requisitioned items'
  });
  if (!allDescriptionsValid) errors.push('All items must have a clear description and specification.');

  checks.push({
    field: 'pr_items.unit',
    label: 'Units of Measure (UOM)',
    passed: allUnitsValid,
    requirement: 'Standard prescribed DepEd UOM (unit, pc, ream, etc.)'
  });
  if (!allUnitsValid) errors.push('All items must have a valid Unit of Measure.');

  checks.push({
    field: 'pr_items.qty',
    label: 'Item Quantities & Totals',
    passed: allQuantitiesValid,
    requirement: 'Positive non-zero quantity'
  });
  if (!allQuantitiesValid) errors.push('All item quantities must be greater than zero.');

  checks.push({
    field: 'pr_items.unitCost',
    label: 'Unit Cost & Computations',
    passed: allCostsValid,
    requirement: 'Positive estimated unit cost and mathematical subtotal'
  });
  if (!allCostsValid) errors.push('All items must have a valid unit cost.');

  const totalCost = (txn.pr_items || []).reduce((s, i) => s + i.totalCost, 0);
  checks.push({
    field: 'pr_items.totalCost',
    label: 'Total Requisition Sum & Words',
    passed: totalCost > 0,
    currentValue: `₱${totalCost.toLocaleString()}`,
    requirement: 'Computed monetary subtotal with Amount in Words'
  });

  const recordState: FormValidationResult['recordState'] = txn.isLocked
    ? 'Issued'
    : txn.status === 'Completed'
    ? 'Historical'
    : 'Approved';

  const missingLabels = checks.filter(c => !c.passed).map(c => c.label);

  return {
    isValid: errors.length === 0,
    formType: 'Appendix 60 (PR)',
    recordNumber: txn.pr.no,
    recordState,
    templateVersion: txn.snapshots?.templateVersion || 'GAM Vol. II Appendix 60 (COA Circular 2015-007)',
    legalBasis: txn.snapshots?.legalBasis || 'DepEd Order No. 41, s. 2021 / RA 12009',
    legalFramework: txn.snapshots?.legalFramework || 'RA 12009 (New Government Procurement Act) / GAM Vol. II',
    validationSummary: formatValidationSummary(missingLabels, 'export'),
    errors,
    warnings,
    fieldChecks: checks
  };
}

/**
 * Pre-export validation for Appendix 61 (Purchase Order)
 */
export function validateAppendix61(
  txn: Transaction,
  schoolProfile: SchoolProfile
): FormValidationResult {
  const checks: FieldValidationCheck[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!txn.po) {
    return {
      isValid: false,
      formType: 'Appendix 61 (PO)',
      recordNumber: txn.pr.no,
      recordState: 'Draft',
      templateVersion: 'GAM Vol. II Appendix 61',
      legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009',
      legalFramework: 'RA 12009 / GAM Vol. II',
      validationSummary: 'Cannot export yet: Purchase Order has not been created or awarded.',
      errors: ['Purchase Order has not been created or awarded yet.'],
      warnings: [],
      fieldChecks: [
        {
          field: 'po',
          label: 'PO Award Record',
          passed: false,
          requirement: 'Awarded Purchase Order contract'
        }
      ]
    };
  }

  // School Entity Name & ID
  checks.push({
    field: 'schoolProfile.schoolName',
    label: 'School / Entity Name',
    passed: Boolean(schoolProfile.schoolName),
    currentValue: schoolProfile.schoolName,
    requirement: 'Mandatory DepEd official school name'
  });
  if (!schoolProfile.schoolName) errors.push('School/entity name is required.');

  checks.push({
    field: 'schoolProfile.schoolId',
    label: 'School ID',
    passed: Boolean(schoolProfile.schoolId),
    currentValue: schoolProfile.schoolId,
    requirement: 'DepEd School ID'
  });
  if (!schoolProfile.schoolId) errors.push('School ID is required.');

  // Fund Cluster & RCC
  checks.push({
    field: 'pr.fundCluster',
    label: 'Fund Cluster',
    passed: Boolean(txn.pr.fundCluster),
    currentValue: txn.pr.fundCluster,
    requirement: 'Government fund cluster'
  });
  if (!txn.pr.fundCluster) errors.push('Fund Cluster is required.');

  checks.push({
    field: 'pr.responsibilityCenterCode',
    label: 'Responsibility Center Code',
    passed: Boolean(txn.pr.responsibilityCenterCode),
    currentValue: txn.pr.responsibilityCenterCode,
    requirement: 'UACS Responsibility Center Code'
  });
  if (!txn.pr.responsibilityCenterCode) errors.push('Responsibility Center Code is required.');

  // PO Number
  const hasPONo = Boolean(txn.po.no && txn.po.no.trim().length > 3);
  checks.push({
    field: 'po.no',
    label: 'PO Contract Number',
    passed: hasPONo,
    currentValue: txn.po.no,
    requirement: 'Prescribed PO-YYYY-XXXXX format'
  });
  if (!hasPONo) errors.push('PO Number is required.');

  // Supplier Information
  const hasSupplier = Boolean(txn.po.supplierId && txn.po.supplierId.trim().length > 0);
  checks.push({
    field: 'po.supplierId',
    label: 'Supplier Details (Name & TIN)',
    passed: hasSupplier,
    currentValue: txn.po.supplierId,
    requirement: 'Accredited PhilGEPS supplier record with TIN'
  });
  if (!hasSupplier) errors.push('Supplier details are required.');

  const hasSupplierAddress = Boolean(txn.po.supplierAddress && txn.po.supplierAddress.trim().length > 3);
  checks.push({
    field: 'po.supplierAddress',
    label: 'Supplier Registered Business Address',
    passed: hasSupplierAddress,
    currentValue: txn.po.supplierAddress,
    requirement: 'Official registered physical address of supplier'
  });
  if (!hasSupplierAddress) errors.push('Supplier address is required.');

  // Procurement Mode
  const hasMode = Boolean(txn.po.mode && txn.po.mode.trim().length > 0);
  checks.push({
    field: 'po.mode',
    label: 'Mode of Procurement',
    passed: hasMode,
    currentValue: txn.po.mode,
    requirement: 'Statutory procurement mode (RA 12009 / RA 9184)'
  });
  if (!hasMode) errors.push('Mode of Procurement is required.');

  // Delivery Terms
  const hasDeliveryTerm = Boolean(txn.po.deliveryTerm && txn.po.deliveryTerm.trim().length > 0);
  checks.push({
    field: 'po.deliveryTerm',
    label: 'Delivery Terms & Schedule',
    passed: hasDeliveryTerm,
    currentValue: txn.po.deliveryTerm,
    requirement: 'Explicit calendar days upon receipt of PO'
  });
  if (!hasDeliveryTerm) errors.push('Delivery Terms are required.');

  // Payment Terms
  const hasPaymentTerm = Boolean(txn.po.paymentTerm && txn.po.paymentTerm.trim().length > 0);
  checks.push({
    field: 'po.paymentTerm',
    label: 'Payment Terms',
    passed: hasPaymentTerm,
    currentValue: txn.po.paymentTerm,
    requirement: 'Prescribed government payment schedule'
  });
  if (!hasPaymentTerm) errors.push('Payment Terms are required.');

  // ORS / BURS Number
  const hasORS = Boolean(txn.po.orsBursNo && txn.po.orsBursNo.trim().length > 0);
  checks.push({
    field: 'po.orsBursNo',
    label: 'ORS / BURS Obligation Number',
    passed: hasORS,
    currentValue: txn.po.orsBursNo,
    requirement: 'Mandatory Obligation Request and Status Number'
  });
  if (!hasORS) errors.push('ORS/BURS Number is required for formal contract issuance.');

  // Amount in Words
  const hasAmountInWords = Boolean(txn.po.amountInWords && txn.po.amountInWords.trim().length > 5);
  checks.push({
    field: 'po.amountInWords',
    label: 'Total Contract Sum in Words',
    passed: hasAmountInWords,
    currentValue: txn.po.amountInWords,
    requirement: 'Exact written legal monetary amount'
  });
  if (!hasAmountInWords) errors.push('Amount in Words is required to prevent contract ambiguity.');

  // Signatories: Authorized HOPE & Chief Accountant
  const hasAuthOfficial = Boolean(txn.po.authorizedOfficial && txn.po.authorizedOfficial.trim().length > 0);
  checks.push({
    field: 'po.authorizedOfficial',
    label: 'Authorized Official (HOPE Signatory)',
    passed: hasAuthOfficial,
    currentValue: txn.po.authorizedOfficial,
    requirement: 'School Head / Principal signature block'
  });
  if (!hasAuthOfficial) errors.push('Authorized Official signatory is required.');

  const hasAccountant = Boolean(txn.po.accountantSignatory && txn.po.accountantSignatory.trim().length > 0);
  checks.push({
    field: 'po.accountantSignatory',
    label: 'Chief Accountant / Head of Accounting Signatory',
    passed: hasAccountant,
    currentValue: txn.po.accountantSignatory,
    requirement: 'Signatory certifying funds availability and ORS'
  });
  if (!hasAccountant) errors.push('Chief Accountant signatory is required.');

  // PO Items
  const hasPOItems = Boolean(txn.po_items && txn.po_items.length > 0);
  checks.push({
    field: 'po_items.count',
    label: 'Contract Line Items & Quantities',
    passed: hasPOItems,
    currentValue: txn.po_items?.length || 0,
    requirement: 'Must match approved requisition specifications'
  });
  if (!hasPOItems) errors.push('PO must contain at least one line item.');

  const recordState: FormValidationResult['recordState'] = txn.isLocked
    ? 'Issued'
    : txn.status === 'Completed'
    ? 'Historical'
    : 'Approved';

  const missingLabels = checks.filter(c => !c.passed).map(c => c.label);

  return {
    isValid: errors.length === 0,
    formType: 'Appendix 61 (PO)',
    recordNumber: txn.po.no,
    recordState,
    templateVersion: txn.snapshots?.templateVersion || 'GAM Vol. II Appendix 61 (COA Circular 2015-007)',
    legalBasis: txn.snapshots?.legalBasis || 'DepEd Order No. 41, s. 2021 / RA 12009',
    legalFramework: txn.snapshots?.legalFramework || 'RA 12009 / RA 9184 Standard Contract Rules',
    validationSummary: formatValidationSummary(missingLabels, 'export'),
    errors,
    warnings,
    fieldChecks: checks
  };
}

/**
 * Pre-export validation for Appendix 62 (Inspection and Acceptance Report)
 */
export function validateAppendix62(
  txn: Transaction,
  schoolProfile: SchoolProfile
): FormValidationResult {
  const checks: FieldValidationCheck[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!txn.iar) {
    return {
      isValid: false,
      formType: 'Appendix 62 (IAR)',
      recordNumber: txn.po?.no || txn.pr.no,
      recordState: 'Draft',
      templateVersion: 'GAM Vol. II Appendix 62',
      legalBasis: 'DepEd Order No. 41, s. 2021 / COA GAM Volume II, Sec. 16',
      legalFramework: 'RA 12009 / COA GAM Volume II',
      validationSummary: 'Cannot export yet: Inspection and Acceptance Report has not been conducted or generated.',
      errors: ['Inspection and Acceptance Report has not been generated or inspected yet.'],
      warnings: [],
      fieldChecks: [
        {
          field: 'iar',
          label: 'IAR Inspection Record',
          passed: false,
          requirement: 'Completed physical inspection and property acceptance'
        }
      ]
    };
  }

  // School Entity Name & ID
  checks.push({
    field: 'schoolProfile.schoolName',
    label: 'School / Entity Name',
    passed: Boolean(schoolProfile.schoolName),
    currentValue: schoolProfile.schoolName,
    requirement: 'Mandatory DepEd official school name'
  });
  if (!schoolProfile.schoolName) errors.push('School/entity name is required.');

  checks.push({
    field: 'schoolProfile.schoolId',
    label: 'School ID',
    passed: Boolean(schoolProfile.schoolId),
    currentValue: schoolProfile.schoolId,
    requirement: 'DepEd School ID'
  });
  if (!schoolProfile.schoolId) errors.push('School ID is required.');

  // IAR Number
  const hasIARNo = Boolean(txn.iar.no && txn.iar.no.trim().length > 3);
  checks.push({
    field: 'iar.no',
    label: 'IAR Tracking Number',
    passed: hasIARNo,
    currentValue: txn.iar.no,
    requirement: 'Prescribed IAR-YYYY-XXXX format'
  });
  if (!hasIARNo) errors.push('IAR Number is required.');

  // Date Inspected
  const hasDate = Boolean(txn.iar.dateInspected && txn.iar.dateInspected.trim().length > 0);
  checks.push({
    field: 'iar.dateInspected',
    label: 'Date Inspected',
    passed: hasDate,
    currentValue: txn.iar.dateInspected,
    requirement: 'Date IAC physical verification was performed'
  });
  if (!hasDate) errors.push('Date Inspected is required.');

  // Delivery Receipt Reference
  const latestBatch = [...(txn.deliveries || [])].reverse()[0];
  const hasDR = Boolean((txn.dr?.invoiceNo && txn.dr.invoiceNo.trim().length > 0) || (latestBatch?.drInvoiceNo));
  checks.push({
    field: 'dr.invoiceNo',
    label: 'Delivery Receipt / Supplier Invoice No.',
    passed: hasDR,
    currentValue: txn.dr?.invoiceNo || latestBatch?.drInvoiceNo,
    requirement: 'Supplier manifest number accompanying goods'
  });
  if (!hasDR) errors.push('Delivery Receipt / Invoice No. is required.');

  // Inspection Committee Chairman
  const hasChairman = Boolean(txn.iar.iacChairman && txn.iar.iacChairman.trim().length > 0);
  checks.push({
    field: 'iar.iacChairman',
    label: 'IAC Inspection Committee Chairman Signatory',
    passed: hasChairman,
    currentValue: txn.iar.iacChairman,
    requirement: 'Official Chairman certifying technical conformance'
  });
  if (!hasChairman) errors.push('IAC Chairman signatory is required.');

  // Property Custodian Officer
  const hasCustodian = Boolean(txn.iar.custodianOfficer && txn.iar.custodianOfficer.trim().length > 0);
  checks.push({
    field: 'iar.custodianOfficer',
    label: 'Supply / Property Custodian Signatory',
    passed: hasCustodian,
    currentValue: txn.iar.custodianOfficer,
    requirement: 'Accountable officer accepting custody of items'
  });
  if (!hasCustodian) errors.push('Property Custodian signatory is required.');

  // Conformance Certification
  checks.push({
    field: 'iar.conformanceInspection',
    label: 'Inspection Committee Conformance Certification',
    passed: txn.iar.conformanceInspection === true,
    currentValue: txn.iar.conformanceInspection ? 'Certified' : 'Not Certified',
    requirement: 'Must be explicitly certified as inspected'
  });
  if (!txn.iar.conformanceInspection) errors.push('Technical inspection certification checkbox must be checked.');

  // Remarks / findings
  const hasRemarks = Boolean(txn.iar.remarks && txn.iar.remarks.trim().length > 5);
  checks.push({
    field: 'iar.remarks',
    label: 'Official Inspection Findings & Custody Remarks',
    passed: hasRemarks,
    currentValue: txn.iar.remarks,
    requirement: 'Detailed inspection breakdown and custody remarks'
  });
  if (!hasRemarks) errors.push('Official Inspection Remarks are required.');

  // Items inspected
  const hasIARItems = Boolean((txn.iar_items && txn.iar_items.length > 0) || (txn.deliveries && txn.deliveries.length > 0));
  checks.push({
    field: 'iar_items.count',
    label: 'Inspected Line Items Breakdown',
    passed: hasIARItems,
    requirement: 'Itemized breakdown with Accepted, Rejected, and Undelivered quantities'
  });
  if (!hasIARItems) errors.push('IAR items inspection breakdown is required.');

  const recordState: FormValidationResult['recordState'] = txn.status === 'Completed'
    ? 'Historical'
    : txn.isLocked
    ? 'Issued'
    : 'Approved';

  const missingLabels = checks.filter(c => !c.passed).map(c => c.label);

  return {
    isValid: errors.length === 0,
    formType: 'Appendix 62 (IAR)',
    recordNumber: txn.iar.no,
    recordState,
    templateVersion: txn.snapshots?.templateVersion || 'GAM Vol. II Appendix 62 Standards',
    legalBasis: txn.snapshots?.legalBasis || 'DepEd Order No. 41, s. 2021 / COA GAM Volume II, Sec. 16',
    legalFramework: txn.snapshots?.legalFramework || 'RA 12009 / COA GAM Volume II / DO No. 41, s. 2021',
    validationSummary: formatValidationSummary(missingLabels, 'export'),
    errors,
    warnings,
    fieldChecks: checks
  };
}

export function validateFormExport(
  formType: string,
  txn: Transaction,
  schoolProfile: SchoolProfile
): FormValidationResult {
  if (formType.includes('Appendix 60') || formType.includes('PR')) {
    return validateAppendix60(txn, schoolProfile);
  }
  if (formType.includes('Appendix 61') || formType.includes('PO')) {
    return validateAppendix61(txn, schoolProfile);
  }
  if (formType.includes('Appendix 62') || formType.includes('IAR')) {
    return validateAppendix62(txn, schoolProfile);
  }
  return {
    isValid: true,
    formType: 'Appendix 60 (PR)',
    recordNumber: txn.pr.no,
    recordState: 'Approved',
    templateVersion: 'GAM Vol. II Standards',
    legalBasis: 'DepEd Order No. 41, s. 2021',
    legalFramework: 'RA 12009 / GAM Vol. II',
    validationSummary: 'Ready for Export',
    errors: [],
    warnings: [],
    fieldChecks: []
  };
}
