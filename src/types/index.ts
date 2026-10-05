export interface SchoolProfile {
  agencyName: string;
  schoolName: string;
  schoolId: string;
  regionDivision: string;
  address: string;
  uacsCode: string;
  defaultFundCluster: string;
  divisionSuperintendent: string;
  headOfProcuringEntity: string;
  inspectionCommitteeHead: string;
  supplyOfficer: string;
}

export type FormValidationState = 'Current' | 'Transitional' | 'Historical' | 'For Validation' | 'Superseded';

export interface DepEdForm {
  id: string;
  appendixNumber: string; // e.g. "Appendix 59", "Appendix 60"
  officialTitle: string; // e.g. "Inventory Custodian Slip (ICS)"
  legalFramework: string; // e.g. "RA 12009 / COA GAM Volume II"
  officialSourceDocument: string; // e.g. "COA Circular No. 2015-007 / GAM for NGAs Volume II"
  sourceDocument?: string; // alias for compatibility
  sourceVersionDate: string; // e.g. "January 1, 2016"
  effectiveDate: string; // e.g. "2016-01-01"
  transactionApplicability: string; // e.g. "All requisitions < ₱50k"
  legalBasis: string; // e.g. "DepEd Order No. 41, s. 2021 / COA Circular No. 2022-004"
  templateStatus: FormValidationState;
  lastValidationDate: string; // e.g. "2026-10-05"
  notes: string;
  prefix: string;
  currentSeq: number;
  lifecycle: string;
  retention: string;
  // Compatibility fields for legacy references
  appendix?: string;
  name?: string;
  formRef?: string;
}

export interface ProcurementMode {
  id: string;
  name: string;
  legalFramework: string; // "RA 12009 (New Government Procurement Act)" or "RA 9184 (Transitional/Historical)"
  officialSourceDocument: string; // e.g. "Republic Act No. 12009 / Approved IRR 2024" or "RA 9184 Annex H"
  sourceVersionDate: string; // e.g. "July 2024 / IRR 2024"
  effectiveDate: string; // e.g. "2024-07-20"
  transactionApplicability: string; // e.g. "Goods and consulting up to ₱1,000,000"
  status: FormValidationState; // 'Current' | 'Transitional' | 'Historical' | 'For Validation'
  maxLimit: number;
  quotationReq: string;
  basis: string;
  lastValidationDate: string;
  notes: string;
}

export interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
  category: string;
  standardQty: string;
}

export interface ThresholdRules {
  capitalizationThreshold: number;
  semiExpendableRule: string;
  ppeRule: string;
  consumablesRule: string;
}

export interface UsefulLifeSchedule {
  id: string;
  assetClass: string;
  lifeYears: number;
  depreciationMethod: string;
  salvageValuePct: number;
}

export interface UacsCode {
  id: string;
  code: string;
  title: string;
  type: string;
  formRef: string;
}

export interface FundSource {
  id: string;
  name: string;
  cluster: string;
  active: boolean;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  custodian: string;
  location: string;
}

export interface StorageBin {
  id: string;
  code: string;
  description: string;
  room: string;
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  designation: string;
}

export interface Supplier {
  id: string;
  name: string;
  tin: string;
  address: string;
  tel?: string;
  contactPerson?: string;
}

export interface MasterCatalogItem {
  id: string;
  stockNo: string;
  desc: string;
  defaultUnit: string;
  estimatedCost: number;
}

export const STATUS = {
  PENDING_PO: 'Pending PO',
  PENDING_DELIVERY: 'Pending Delivery',
  DELIVERY_RECEIVED: 'Delivery Received',
  FOR_INSPECTION: 'For Inspection',
  PARTIALLY_ACCEPTED: 'Partially Accepted',
  AWAITING_COMPLETION: 'Awaiting Replacement',
  DELIVERY_OVERDUE: 'Delivery Overdue',
  COMPLETED: 'Completed'
} as const;

export type TransactionStatus = typeof STATUS[keyof typeof STATUS];

// Distinct Procurement Workflow Stages (COA GAM & DepEd Order No. 41)
export type PRStage = 'Draft' | 'Submitted' | 'Approved' | 'Cancelled';
export type POStage = 'Not Started' | 'Pending Award' | 'PO Awarded' | 'Revised' | 'Cancelled';
export type DeliveryStage =
  | 'Not Started'
  | 'Awaiting Delivery'
  | 'Partial Delivery'
  | 'Complete Delivery'
  | 'Delivery Overdue';
export type IARStage =
  | 'Not Started'
  | 'Awaiting Inspection'
  | 'Partially Accepted'
  | 'Fully Accepted'
  | 'Rejected'
  | 'Awaiting Replacement';
export type InventoryPostingStage =
  | 'Not Eligible'
  | 'Partially Eligible (Accepted Only)'
  | 'Fully Posted'
  | 'Barred (Missing/Rejected Items)';
export type PaymentStage =
  | 'Not Eligible'
  | 'Partial Progress Billing Eligible'
  | 'Full Disbursement Eligible'
  | 'Disbursed / Paid';

export interface TransactionStages {
  prStage: PRStage;
  poStage: POStage;
  deliveryStage: DeliveryStage;
  iarStage: IARStage;
  inventoryPostingStage: InventoryPostingStage;
  paymentStage: PaymentStage;
  nextAction: string;
  needsAttention: boolean;
  attentionReason?: string;
}

export interface PRItem {
  id: number;
  stockNo: string;
  desc: string;
  qty: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface POItem {
  id: number;
  stockNo: string;
  desc: string;
  qty: number;
  unit: string;
  unitCost: number;
  amount: number;
}

export type DiscrepancyType =
  | 'Short Delivery'
  | 'Defective Item'
  | 'Wrong Specification'
  | 'Damaged Item'
  | 'Missing Component'
  | 'Wrong Delivery Location';

export interface DeliveryItem {
  id: number;
  stockNo: string;
  desc: string;
  unit: string;
  unitCost: number;
  orderedQty: number;
  previouslyAcceptedQty: number;
  currentDeliveredQty: number;
  acceptedQty: number;
  rejectedQty: number;
  undeliveredQty: number;
  rejectionReason?: string;
  rejectionCategory?: 'Defective' | 'Damaged' | 'Wrong Specification' | 'Missing Accessory' | 'Other';
}

export interface DeliveryDiscrepancyRecord {
  id: string; // e.g. DDR-2026-00015
  poNo: string;
  deliveryBatchNo: number;
  drInvoiceNo: string;
  types: DiscrepancyType[];
  totalOrdered: number;
  totalDelivered: number;
  totalAccepted: number;
  totalRejected: number;
  totalUndelivered: number;
  totalOutstanding: number;
  inspectorFindings: string;
  supplierNoticeDate: string;
  supplierNoticeStatus: 'Pending Notice' | 'Notice Served' | 'Replacement In-Progress' | 'Rectified';
}

export interface DeliveryBatch {
  batchNo: number;
  drInvoiceNo: string;
  deliveryDate: string;
  receivedBy: string;
  deliveryType: 'Initial Delivery' | 'Subsequent Delivery' | 'Replacement Delivery';
  items: DeliveryItem[];
  iarNo?: string;
  iarDate?: string;
  iarStatus?: 'Passed Complete' | 'Partially Accepted' | 'Rejected';
  discrepancyRecord?: DeliveryDiscrepancyRecord;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  version: string;
  notes: string;
}

export interface TransactionSnapshots {
  schoolProfile: {
    schoolName: string;
    schoolId: string;
    regionDivision: string;
    address: string;
    uacsCode: string;
  };
  rcc: string;
  fundCluster: string;
  signatories: {
    requestedByName: string;
    requestedByDesignation: string;
    approvedByName: string;
    approvedByDesignation: string;
    inspectionCommitteeHeadName?: string;
    supplyOfficerName?: string;
  };
  supplier?: {
    id: string;
    name: string;
    tin: string;
    address: string;
  };
  legalFramework?: string;
  legalBasis: string;
  templateVersion: string;
  procurementMode?: string;
  snapshotTimestamp: string;
}

export interface Transaction {
  id: string;
  version: string; // e.g. 'v1.0'
  isLocked: boolean; // Locked upon official approval/award
  lockReason?: string;
  lastSavedTimestamp: string;
  isSimulated?: boolean;
  auditHistory: AuditLogEntry[];
  snapshots?: TransactionSnapshots;
  pr: {
    no: string;
    date: string;
    office: string;
    fundCluster: string;
    responsibilityCenterCode: string;
    purpose: string;
    requestedBy: string;
    approvedBy: string;
  };
  pr_items: PRItem[];
  status: TransactionStatus;
  po: {
    no: string;
    date: string;
    supplierId: string;
    supplierAddress: string;
    mode: string;
    placeOfDelivery: string;
    deliveryDate: string;
    deliveryTerm: string;
    paymentTerm: string;
    paymentRule: 'partial_permitted' | 'full_lot_required';
    orsBursNo: string;
    orsDate: string;
    authorizedOfficial: string;
    accountantSignatory: string;
    amountInWords: string;
  } | null;
  po_items: POItem[] | null;
  deliveries: DeliveryBatch[];
  dr: {
    invoiceNo: string;
    invoiceDate: string;
    receivedBy: string;
    deliveryType: 'Complete' | 'Partial' | 'Subsequent/Replacement';
    batchNo: number;
  } | null;
  iar: {
    no: string;
    dateInspected: string;
    status: string;
    iacChairman: string;
    technicalInspector: string;
    custodianOfficer: string;
    conformanceInspection: boolean;
    acceptanceComplete: boolean;
    acceptanceMode: 'Full Lot Accepted' | 'Partially Accepted';
    remarks: string;
  } | null;
  iar_items: DeliveryItem[] | null;
}
