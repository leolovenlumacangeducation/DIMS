import {
  SchoolProfile,
  DepEdForm,
  ProcurementMode,
  UnitOfMeasure,
  ThresholdRules,
  UsefulLifeSchedule,
  UacsCode,
  FundSource,
  Station,
  StorageBin,
  Personnel,
  MasterCatalogItem,
  Supplier,
  Transaction,
  STATUS
} from '../types';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  agencyName: 'Department of Education',
  schoolName: 'Pagadian City National Comprehensive High School',
  schoolId: '303906',
  regionDivision: 'Region IX – Zamboanga Peninsula - Division of Pagadian City',
  address: 'Banale, Pagadian City, Zamboanga del Sur 7016',
  uacsCode: '07-001-09-09339',
  defaultFundCluster: '01 – Regular Agency Fund',
  divisionSuperintendent: 'Schools Division Superintendent',
  headOfProcuringEntity: 'Alna A. Lasala',
  inspectionCommitteeHead: 'Juan Dela Cruz',
  supplyOfficer: 'Maria Santos'
};

export const INITIAL_DEPED_FORMS: DepEdForm[] = [
  {
    id: 'FRM-59',
    appendixNumber: 'Appendix 59',
    officialTitle: 'Inventory Custodian Slip (ICS)',
    legalFramework: 'COA GAM Volume II / COA Circular No. 2022-004',
    officialSourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016 (GAM Vol. II)',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Issuance and custody tracking of tangible semi-expendable items costing ₱50,000 and below',
    legalBasis: 'DepEd Order No. 41, s. 2021 / COA Circular No. 2022-004 (Tangible items < ₱50,000)',
    templateStatus: 'Current',
    lastValidationDate: '2026-10-05',
    notes: 'Prescribed form used by Property/Supply Unit to issue tangible items below ₱50,000 threshold to end-user teachers and staff.',
    prefix: 'ICS-2026-',
    currentSeq: 28,
    lifecycle: 'Semi-Expendable Custody (< ₱50k)',
    retention: 'Life of Asset + 10 Years',
    appendix: 'Appendix 59',
    name: 'Inventory Custodian Slip (ICS)',
    formRef: 'GAM Vol II Appx 59'
  },
  {
    id: 'FRM-60',
    appendixNumber: 'Appendix 60',
    officialTitle: 'Purchase Request (PR)',
    legalFramework: 'RA 12009 (New Government Procurement Act) / COA GAM Volume II',
    officialSourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016 (GAM Vol. II)',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Initiation of all supply requisitions, learning tools, materials, and equipment',
    legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009 & Approved IRR',
    templateStatus: 'Current',
    lastValidationDate: '2026-10-05',
    notes: 'Prescribed form for initiating requisition of supplies, instructional materials, and equipment prior to procurement award.',
    prefix: 'PR-2026-',
    currentSeq: 4,
    lifecycle: 'Procurement / Requisition',
    retention: '10 Years',
    appendix: 'Appendix 60',
    name: 'Purchase Request (PR)',
    formRef: 'GAM Vol II Appx 60'
  },
  {
    id: 'FRM-61',
    appendixNumber: 'Appendix 61',
    officialTitle: 'Purchase Order (PO)',
    legalFramework: 'RA 12009 (New Government Procurement Act) / COA GAM Volume II',
    officialSourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016 (GAM Vol. II)',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Formal contract commitment with accredited suppliers for goods and equipment delivery',
    legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009 Contract Standards (with RA 9184 transitional reference)',
    templateStatus: 'Current',
    lastValidationDate: '2026-10-05',
    notes: 'Formal contract between DepEd School and winning accredited supplier specifying specifications, delivery timeline, and liquidated damages.',
    prefix: 'PO-2026-',
    currentSeq: 99,
    lifecycle: 'Contract Awarding & Obligation',
    retention: '10 Years',
    appendix: 'Appendix 61',
    name: 'Purchase Order (PO)',
    formRef: 'GAM Vol II Appx 61'
  },
  {
    id: 'FRM-62',
    appendixNumber: 'Appendix 62',
    officialTitle: 'Inspection and Acceptance Report (IAR)',
    legalFramework: 'DepEd Order No. 41, s. 2021 / COA GAM Volume II, Sec. 16',
    officialSourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016 (GAM Vol. II)',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Receiving, technical inspection, and property custody acceptance for all deliveries',
    legalBasis: 'DepEd Order No. 41, s. 2021 (Inspection and Acceptance Protocol) / GAM Vol. II Sec. 16',
    templateStatus: 'Current',
    lastValidationDate: '2026-10-05',
    notes: 'Prescribed dual-certification report for Inspection and Acceptance Committee (IAC) technical verification and Property Custodian custody acceptance.',
    prefix: 'IAR-2026-',
    currentSeq: 9,
    lifecycle: 'Receiving, IAC Inspection & Acceptance',
    retention: '10 Years',
    appendix: 'Appendix 62',
    name: 'Inspection & Acceptance Report (IAR)',
    formRef: 'GAM Vol II Appx 62'
  },
  {
    id: 'FRM-63',
    appendixNumber: 'Appendix 63',
    officialTitle: 'Requisition and Issue Slip (RIS)',
    legalFramework: 'COA GAM Volume II / DepEd Property Management Guidelines',
    officialSourceDocument: 'COA GAM for NGAs Volume II',
    sourceDocument: 'COA GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Stockroom withdrawal and issuance of consumable inventory to departments',
    legalBasis: 'COA GAM for NGAs Volume II / DepEd Property Management Manual',
    templateStatus: 'For Validation',
    lastValidationDate: '2026-10-05',
    notes: 'Form mapping under field validation for electronic issuance against division ERP protocols.',
    prefix: 'RIS-2026-',
    currentSeq: 14,
    lifecycle: 'Stockroom Issuance to End-Users',
    retention: '5 Years',
    appendix: 'Appendix 63',
    name: 'Requisition & Issue Slip (RIS)',
    formRef: 'GAM Vol II Appx 63'
  },
  {
    id: 'FRM-65',
    appendixNumber: 'Appendix 65',
    officialTitle: 'Semi-Expendable Property Card (SPC)',
    legalFramework: 'COA Circular No. 2022-004 / GAM Volume II',
    officialSourceDocument: 'COA Circular No. 2022-004',
    sourceVersionDate: 'May 31, 2022',
    effectiveDate: '2022-06-01',
    transactionApplicability: 'Per-item ledger tracking for tangible semi-expendable assets below ₱50k threshold',
    legalBasis: 'COA Circular No. 2022-004 Increasing Semi-Expendable Threshold to ₱50,000',
    templateStatus: 'For Validation',
    lastValidationDate: '2026-10-05',
    notes: 'Stockroom ledger card mapping under validation for digital property card automation.',
    prefix: 'SPC-2026-',
    currentSeq: 22,
    lifecycle: 'Semi-Expendable Property Ledger',
    retention: '10 Years',
    appendix: 'Appendix 65',
    name: 'Semi-Expendable Property Card (SPC)',
    formRef: 'GAM Vol II Appx 65'
  },
  {
    id: 'FRM-66',
    appendixNumber: 'Appendix 66',
    officialTitle: 'Property Card (PC)',
    legalFramework: 'COA GAM Volume II',
    officialSourceDocument: 'COA GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Physical ledger card for Property, Plant and Equipment (PPE)',
    legalBasis: 'COA Circular No. 2015-007 / GAM Vol. II',
    templateStatus: 'For Validation',
    lastValidationDate: '2026-10-05',
    notes: 'Property unit ledger card maintained for capital assets; awaiting integration with national asset registry.',
    prefix: 'PC-2026-',
    currentSeq: 19,
    lifecycle: 'Capital PPE Ledger Tracking',
    retention: 'Permanent',
    appendix: 'Appendix 66',
    name: 'Property Card (PC)',
    formRef: 'GAM Vol II Appx 66'
  },
  {
    id: 'FRM-71',
    appendixNumber: 'Appendix 71',
    officialTitle: 'Property Acknowledgment Receipt (PAR)',
    legalFramework: 'COA GAM Volume II, Sec. 21 / DepEd Order No. 41, s. 2021',
    officialSourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016 (GAM Vol. II)',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Issuance of Property, Plant and Equipment (PPE costing above ₱50,000) to accountable teachers/staff',
    legalBasis: 'DepEd Order No. 41, s. 2021 / COA GAM Volume II, Sec. 21',
    templateStatus: 'Current',
    lastValidationDate: '2026-10-05',
    notes: 'Prescribed form used by Supply Unit to issue capital assets to individual end-users with inventory property tags.',
    prefix: 'PAR-2026-',
    currentSeq: 12,
    lifecycle: 'Capital PPE Custodianship (≥ ₱50,000)',
    retention: 'Life of Asset + 10 Years',
    appendix: 'Appendix 71',
    name: 'Property Acknowledgment Receipt (PAR)',
    formRef: 'GAM Vol II Appx 71'
  },
  {
    id: 'FRM-74',
    appendixNumber: 'Appendix 74',
    officialTitle: 'Inventory and Inspection Report of Unserviceable Property (IIRUP)',
    legalFramework: 'COA GAM Volume II, Sec. 24 / DepEd Disposal Guidelines',
    officialSourceDocument: 'COA GAM for NGAs Volume II',
    sourceDocument: 'COA GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Condemnation, appraisal, and disposal of damaged or unserviceable school property',
    legalBasis: 'COA GAM Volume II, Sec. 24 / DepEd Disposal Guidelines',
    templateStatus: 'For Validation',
    lastValidationDate: '2026-10-05',
    notes: 'Form mapping under division property validation for electronic waste disposal workflow.',
    prefix: 'IIRUP-2026-',
    currentSeq: 2,
    lifecycle: 'Condemnation & Disposal',
    retention: '10 Years',
    appendix: 'Appendix 74',
    name: 'Inventory & Inspection of Unserviceable Property (IIRUP)',
    formRef: 'GAM Vol II Appx 74'
  },
  {
    id: 'FRM-76',
    appendixNumber: 'Appendix 76',
    officialTitle: 'Property Transfer Report (PTR)',
    legalFramework: 'COA GAM Volume II, Sec. 26 / DepEd Order No. 41, s. 2021',
    officialSourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceDocument: 'COA Circular No. 2015-007 / GAM for NGAs Volume II',
    sourceVersionDate: 'January 1, 2016 (GAM Vol. II)',
    effectiveDate: '2016-01-01',
    transactionApplicability: 'Official transfer of property and equipment between schools, stations, or accountable officers',
    legalBasis: 'DepEd Order No. 41, s. 2021 / COA GAM Volume II, Sec. 26',
    templateStatus: 'Current',
    lastValidationDate: '2026-10-05',
    notes: 'Prescribed form used to document inter-school or inter-department transfers of property without cash exchange.',
    prefix: 'PTR-2026-',
    currentSeq: 5,
    lifecycle: 'School-to-School Asset Relocation',
    retention: '10 Years',
    appendix: 'Appendix 76',
    name: 'Property Transfer Report (PTR)',
    formRef: 'GAM Vol II Appx 76'
  },
  {
    id: 'FRM-LEGACY-72',
    appendixNumber: 'Appendix 72 (Legacy NGAS)',
    officialTitle: 'Old NGAS Property Acknowledgment Receipt',
    legalFramework: 'New Government Accounting System (NGAS Manual 2002)',
    officialSourceDocument: 'NGAS Manual 2002',
    sourceDocument: 'NGAS Manual 2002',
    sourceVersionDate: 'January 1, 2002',
    effectiveDate: '2002-01-01',
    transactionApplicability: 'Historical records archival only',
    legalBasis: 'Superseded by COA Circular No. 2015-007 (GAM Vol. II Appendix 71)',
    templateStatus: 'Superseded',
    lastValidationDate: '2026-10-05',
    notes: 'Legacy pre-GAM form number superseded by Appendix 71 under GAM for NGAs Volume II.',
    prefix: 'OLD-PAR-',
    currentSeq: 0,
    lifecycle: 'Historical Archive Only',
    retention: 'Permanent Archival',
    appendix: 'Appendix 72 (Legacy)',
    name: 'Old NGAS PAR (Superseded)',
    formRef: 'NGAS 2002 Appx 72'
  }
];

export const INITIAL_PROCUREMENT_MODES: ProcurementMode[] = [
  {
    id: 'PM-01',
    name: 'Small Value Procurement (Negotiated Modality)',
    legalFramework: 'RA 12009 (New Government Procurement Act)',
    officialSourceDocument: 'Republic Act No. 12009 / Approved IRR 2024 (GPPB Advisory No. 09-2026)',
    sourceVersionDate: 'July 2024 / Approved IRR 2024',
    effectiveDate: '2024-07-20',
    transactionApplicability: 'Procurement of goods and consulting services up to ₱1,000,000 threshold',
    status: 'Current',
    maxLimit: 1000000,
    quotationReq: 'At least 3 Price Quotations from PhilGEPS-registered suppliers',
    basis: 'RA 12009 Approved IRR / Annex on Negotiated Modalities',
    lastValidationDate: '2026-10-05',
    notes: 'Primary simplified procurement modality for public high schools under RA 12009.'
  },
  {
    id: 'PM-02',
    name: 'Direct Retail Purchase of Goods',
    legalFramework: 'RA 12009 (New Government Procurement Act)',
    officialSourceDocument: 'Republic Act No. 12009 Section on Direct Retail Purchase',
    sourceVersionDate: 'July 2024 / Approved IRR 2024',
    effectiveDate: '2024-07-20',
    transactionApplicability: 'Immediate retail store purchase for urgently needed supplies and consumables',
    status: 'Current',
    maxLimit: 250000,
    quotationReq: 'Direct purchase from established physical or electronic retail establishments',
    basis: 'RA 12009 Direct Retail Purchase Provision',
    lastValidationDate: '2026-10-05',
    notes: 'Permitted retail purchase mode replacing conventional shopping under modernized procurement.'
  },
  {
    id: 'PM-03',
    name: 'Competitive Bidding (Default Procurement Mode)',
    legalFramework: 'RA 12009 (New Government Procurement Act)',
    officialSourceDocument: 'Republic Act No. 12009 Section 10',
    sourceVersionDate: 'July 2024 / Approved IRR 2024',
    effectiveDate: '2024-07-20',
    transactionApplicability: 'High-value contracts exceeding standard statutory threshold limits',
    status: 'Current',
    maxLimit: 0,
    quotationReq: 'Public Advertisement in PhilGEPS & DepEd Portal with formal BAC bidding',
    basis: 'RA 12009 Section 10 Default Rule',
    lastValidationDate: '2026-10-05',
    notes: 'Statutory default mode of procurement for all Philippine government agencies.'
  },
  {
    id: 'PM-04',
    name: 'Direct Contracting (Single-Source Supplier)',
    legalFramework: 'RA 12009 (New Government Procurement Act)',
    officialSourceDocument: 'Republic Act No. 12009 Section 50 / GPPB Guidelines',
    sourceVersionDate: 'July 2024 / Approved IRR 2024',
    effectiveDate: '2024-07-20',
    transactionApplicability: 'Proprietary goods, exclusive distributorships, and specialized curriculum kits',
    status: 'Current',
    maxLimit: 0,
    quotationReq: 'Valid Exclusive Distributor Certificate and manufacturer proof of single source',
    basis: 'RA 12009 Single Source Procurement',
    lastValidationDate: '2026-10-05',
    notes: 'Permitted when no suitable alternative is commercially available in the domestic market.'
  },
  {
    id: 'PM-05',
    name: 'Agency-to-Agency (Procurement Service - DBM)',
    legalFramework: 'RA 12009 (New Government Procurement Act)',
    officialSourceDocument: 'RA 12009 Inter-Agency Procurement Provisions / PS-DBM Rules',
    sourceVersionDate: 'July 2024 / Approved IRR 2024',
    effectiveDate: '2024-07-20',
    transactionApplicability: 'Common-use supplies and equipment (CSE) available in PS-DBM depot',
    status: 'Current',
    maxLimit: 0,
    quotationReq: 'Agency Procurement Request (APR) through Virtual Store / PS-DBM Depot',
    basis: 'Procurement Service - Department of Budget and Management',
    lastValidationDate: '2026-10-05',
    notes: 'Mandatory source for standard government common-use office supplies.'
  },
  {
    id: 'PM-06',
    name: 'Shopping (Sec. 52.1.b - Ordinary Supplies, RA 9184)',
    legalFramework: 'RA 9184 and its Revised IRR (Transitional Framework)',
    officialSourceDocument: 'Republic Act No. 9184 / 2016 Revised IRR Annex H',
    sourceVersionDate: 'October 2016 (RA 9184 IRR)',
    effectiveDate: '2003-01-26',
    transactionApplicability: 'Transitional mode for ongoing contracts and historical multi-year obligations',
    status: 'Transitional',
    maxLimit: 250000,
    quotationReq: '3 Price Quotations from bona fide suppliers',
    basis: 'RA 9184 Revised IRR Annex H (Transitional reference per GPPB Advisory No. 09-2026)',
    lastValidationDate: '2026-10-05',
    notes: 'Transitional framework mode preserved for ongoing contracts during RA 12009 phase-in.'
  },
  {
    id: 'PM-07',
    name: 'Small Value Procurement (Sec. 53.9 - RA 9184 Historical)',
    legalFramework: 'RA 9184 and its Revised IRR (Historical Framework)',
    officialSourceDocument: 'Republic Act No. 9184 / 2016 Revised IRR Annex H',
    sourceVersionDate: 'October 2016 (RA 9184 IRR)',
    effectiveDate: '2003-01-26',
    transactionApplicability: 'Historical records and prior fiscal-year procurement audits',
    status: 'Historical',
    maxLimit: 1000000,
    quotationReq: '3 Price Quotations (Prior framework rule)',
    basis: 'RA 9184 Section 53.9 Historical Archive',
    lastValidationDate: '2026-10-05',
    notes: 'Historical statutory basis preserved for audit trail and prior-year COA review.'
  }
];

export const INITIAL_UNITS_OF_MEASURE: UnitOfMeasure[] = [
  { id: 'UOM-01', code: 'ream', name: 'Ream (500 sheets)', category: 'Paper & Stationery', standardQty: '500 sheets' },
  { id: 'UOM-02', code: 'pc', name: 'Piece', category: 'General Consumables', standardQty: '1 individual item' },
  { id: 'UOM-03', code: 'unit', name: 'Unit / Equipment Set', category: 'ICT & Machinery', standardQty: '1 complete system' },
  { id: 'UOM-04', code: 'box', name: 'Box', category: 'Packaged Supplies', standardQty: 'Varies (e.g. 50 pcs)' },
  { id: 'UOM-05', code: 'pack', name: 'Pack', category: 'General Supplies', standardQty: 'Varies (e.g. 10/12 pcs)' },
  { id: 'UOM-06', code: 'set', name: 'Set', category: 'Toolkits & Science Kits', standardQty: '1 kit assortment' },
  { id: 'UOM-07', code: 'roll', name: 'Roll', category: 'Tapes & Electrical', standardQty: '1 roll / spool' },
  { id: 'UOM-08', code: 'pad', name: 'Pad', category: 'Forms & Paper', standardQty: '50/100 sheets per pad' },
  { id: 'UOM-09', code: 'bottle', name: 'Bottle', category: 'Inks & Chemicals', standardQty: '1 bottle (e.g. 500ml)' },
  { id: 'UOM-10', code: 'meter', name: 'Meter', category: 'Cables & Fabrics', standardQty: '1 linear meter' },
  { id: 'UOM-11', code: 'bundle', name: 'Bundle', category: 'Textbooks & Modules', standardQty: '25/50 copies' },
  { id: 'UOM-12', code: 'dozen', name: 'Dozen', category: 'Writing Tools', standardQty: '12 pieces' }
];

export const INITIAL_THRESHOLD_RULES: ThresholdRules = {
  capitalizationThreshold: 50000,
  semiExpendableRule: 'Items costing ₱50,000 and below are classified as Semi-Expendable, issued via Inventory Custodian Slip (ICS - Appx 59) and tracked in Semi-Expendable Property Cards (Appx 65).',
  ppeRule: 'Items costing above ₱50,000 are classified as Property, Plant & Equipment (PPE), issued via Property Acknowledgement Receipt (PAR - Appx 71) with Property Stickers.',
  consumablesRule: 'Supplies consumed within 1 year are issued via Requisition and Issue Slip (RIS - Appx 63) and summarized in RSMI.'
};

export const INITIAL_USEFUL_LIFE_SCHEDULE: UsefulLifeSchedule[] = [
  { id: 'UL-01', assetClass: 'ICT Equipment (Desktops, Laptops, Tablets)', lifeYears: 5, depreciationMethod: 'Straight Line', salvageValuePct: 5 },
  { id: 'UL-02', assetClass: 'Printers, Scanners & Peripherals', lifeYears: 3, depreciationMethod: 'Straight Line', salvageValuePct: 5 },
  { id: 'UL-03', assetClass: 'School Furniture, Armchairs & Desks', lifeYears: 7, depreciationMethod: 'Straight Line', salvageValuePct: 5 },
  { id: 'UL-04', assetClass: 'Science & Laboratory Apparatus', lifeYears: 5, depreciationMethod: 'Straight Line', salvageValuePct: 5 },
  { id: 'UL-05', assetClass: 'Textbooks, Manuals & Learning Modules', lifeYears: 3, depreciationMethod: 'Straight Line', salvageValuePct: 0 },
  { id: 'UL-06', assetClass: 'TVL Heavy Tools & Workshop Machinery', lifeYears: 10, depreciationMethod: 'Straight Line', salvageValuePct: 5 }
];

export const INITIAL_UACS_CODES: UacsCode[] = [
  { id: 'U-01', code: '5-02-03-010', title: 'Office Supplies Expense', type: 'Consumable Supplies', formRef: 'Appx 60 (PR) / Appx 63 (RIS)' },
  { id: 'U-02', code: '5-02-03-020', title: 'Accountable Forms Expense', type: 'Printed DepEd Forms', formRef: 'Appx 60 / Appx 64 (RSMI)' },
  { id: 'U-03', code: '5-02-03-080', title: 'Medical, Dental & Clinic Supplies', type: 'Health & Clinic Supplies', formRef: 'Appx 60 / Appx 63 (RIS)' },
  { id: 'U-04', code: '5-02-03-990', title: 'Other Supplies and Materials', type: 'Operating Supplies', formRef: 'Appx 60 / Appx 65 (Stock Card)' },
  { id: 'U-05', code: '1-04-05-020', title: 'Semi-Expendable ICT Equipment', type: 'Semi-Expendable (≤ ₱50k)', formRef: 'Appx 59 (ICS)' },
  { id: 'U-06', code: '1-06-05-020', title: 'ICT Equipment (PPE)', type: 'Capital Property (> ₱50k)', formRef: 'Appx 71 (PAR)' },
  { id: 'U-07', code: '1-06-06-010', title: 'Furniture and Fixtures (PPE)', type: 'Capital Property (> ₱50k)', formRef: 'Appx 71 (PAR)' }
];

export const INITIAL_FUND_SOURCES: FundSource[] = [
  { id: 'FS-01', name: 'School MOOE (Maintenance & Other Operating) - 01', cluster: '01 - Regular Agency Fund', active: true },
  { id: 'FS-02', name: 'Special Education Fund (SEF - LGU)', cluster: '03 - Special Account', active: true },
  { id: 'FS-03', name: 'Learning Resource Fund (LRF / BE-LCP)', cluster: '01 - Regular Agency Fund', active: true },
  { id: 'FS-04', name: 'DepEd Computerization Program (DCP)', cluster: '01 - Regular Agency Fund', active: true }
];

export const INITIAL_STATIONS: Station[] = [
  { id: 'ST-01', name: 'Principal\'s Office / Admin', code: 'ADM-01', custodian: 'Alna A. Lasala', location: 'Administrative Building 2F' },
  { id: 'ST-02', name: 'Supply Depot & Property Unit', code: 'SUP-01', custodian: 'Maria Santos', location: 'Ground Floor, Bldg A' },
  { id: 'ST-03', name: 'ICT Laboratory & Server Hub', code: 'ICT-01', custodian: 'Engr. Roberto Gomez', location: 'Science & Tech Bldg 3F' },
  { id: 'ST-04', name: 'Science Laboratory (Biology/Chem)', code: 'SCI-01', custodian: 'Dr. Elena Ramos', location: 'Science Complex 1F' },
  { id: 'ST-05', name: 'Faculty Learning Resource Center', code: 'FLR-01', custodian: 'Clara Fernandez', location: 'Academic Wing B' },
  { id: 'ST-06', name: 'TVL Workshop / Industrial Arts', code: 'TVL-01', custodian: 'Danilo Cruz', location: 'TVL Workshop Hall' }
];

export const INITIAL_STORAGE_BINS: StorageBin[] = [
  { id: 'BIN-01', code: 'BIN-A1', description: 'Office Paper & Continuous Forms', room: 'Supply Depot Rm 101' },
  { id: 'BIN-02', code: 'BIN-A2', description: 'Toners, Inks & Cartridges', room: 'Supply Depot Rm 101' },
  { id: 'BIN-03', code: 'BIN-B1', description: 'ICT Peripherals & Network Cables', room: 'Secure Stockroom 102' },
  { id: 'BIN-04', code: 'BIN-B2', description: 'Laboratory Glassware & Reagents', room: 'Science Prep Stockroom' }
];

export const INITIAL_PERSONNEL: Personnel[] = [
  { id: 'P01', name: 'Alna A. Lasala', role: 'School Head', designation: 'Secondary School Principal IV (HOPE)' },
  { id: 'P02', name: 'Maria Santos', role: 'Property Custodian', designation: 'Supply Officer I / Custodian' },
  { id: 'P03', name: 'Engr. Roberto Gomez', role: 'ICT Coordinator', designation: 'Master Teacher II / ICT Coordinator' },
  { id: 'P04', name: 'Juan Dela Cruz', role: 'Inspection Committee Head', designation: 'Teacher III / IAC Chairman' },
  { id: 'P05', name: 'Dr. Elena Ramos', role: 'Department Head', designation: 'Head Teacher VI - Science' },
  { id: 'P06', name: 'Atty. Rodolfo Navarro', role: 'Chief Accountant', designation: 'Division Accountant III' }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'S01', name: 'Metro Tech Solutions Inc.', tin: '008-941-284-000', address: 'Door 3, LKK Commercial Center, Rizal Avenue, Pagadian City', tel: '(062) 214-5581', contactPerson: 'Michael Chang' },
  { id: 'S02', name: 'Pagadian Paper World & School Supplies', tin: '142-882-901-000', address: 'F.S. Pajares Avenue, Gatas District, Pagadian City', tel: '(062) 214-9922', contactPerson: 'Corazon Tan' },
  { id: 'S03', name: 'EduScience Trading & Lab Equipment', tin: '229-410-093-000', address: 'Veterans Avenue, Zamboanga City', tel: '(062) 991-3401', contactPerson: 'Engr. Felipe Cruz' }
];

export const INITIAL_MASTER_CATALOG_ITEMS: MasterCatalogItem[] = [
  { id: 'ITM-01', stockNo: 'IT-001', desc: 'DepEd Learner Laptop, Core i5, 16GB RAM, 512GB SSD', defaultUnit: 'unit', estimatedCost: 35000 },
  { id: 'ITM-02', stockNo: 'PAP-001', desc: 'Bond Paper A4, 70gsm, 500 sheets/ream', defaultUnit: 'ream', estimatedCost: 250 },
  { id: 'ITM-03', stockNo: 'IT-004', desc: 'Printer, Continuous Ink Tank for Science Dept', defaultUnit: 'unit', estimatedCost: 12000 },
  { id: 'ITM-04', stockNo: 'IT-005', desc: 'Enterprise Wi-Fi 6 Access Point & Gigabit Router', defaultUnit: 'unit', estimatedCost: 6500 }
];

export const MASTER_DATA = {
  fundClusters: ['01 - Regular Agency Fund', '03 - Special Account', '07 - Trust Receipts'],
  deliveryTerms: ['Within 7 calendar days upon receipt of PO', 'Within 15 calendar days upon receipt of PO', 'Within 30 calendar days upon receipt of PO'],
  paymentTerms: ['30 calendar days upon complete inspection & IAR', '15 calendar days upon complete inspection', 'Cash on Delivery (COD)'],
  suppliers: INITIAL_SUPPLIERS
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-001',
    version: 'v1.0',
    isLocked: true,
    lockReason: 'Official Delivery Discrepancy & Partial Acceptance Committed',
    lastSavedTimestamp: '2026-10-05T14:15:00.000Z',
    isSimulated: true,
    auditHistory: [
      {
        id: 'AUD-001',
        timestamp: '2026-10-01T08:30:00.000Z',
        action: 'Purchase Request Created (Appendix 60)',
        actor: 'Engr. Roberto Gomez (ICT Coordinator)',
        version: 'v1.0',
        notes: 'Simulated record — seeded for workflow testing (Demo date: October 5, 2026)'
      },
      {
        id: 'AUD-002',
        timestamp: '2026-10-03T10:15:00.000Z',
        action: 'Purchase Order Awarded (Appendix 61)',
        actor: 'Maria Santos (Supply Officer)',
        version: 'v1.0',
        notes: 'PO-2026-00125 awarded to Metro Tech Solutions Inc. Contract sum: ₱700,000'
      },
      {
        id: 'AUD-003',
        timestamp: '2026-10-05T14:15:00.000Z',
        action: 'IAR Dual Inspection & Discrepancy Record Issued (Appendix 62)',
        actor: 'Juan Dela Cruz (IAC Chairman)',
        version: 'v1.0',
        notes: 'Batch #1: 15 delivered, 14 accepted, 1 rejected (SN: LPT-9941), 5 undelivered. Total 6 units outstanding.'
      }
    ],
    snapshots: {
      schoolProfile: {
        schoolName: 'Pagadian City National Comprehensive High School',
        schoolId: '303906',
        regionDivision: 'Region IX – Zamboanga Peninsula - Division of Pagadian City',
        address: 'Banale, Pagadian City, Zamboanga del Sur 7016',
        uacsCode: '07-001-09-09339'
      },
      rcc: '07-001-09-09339',
      fundCluster: 'DepEd Computerization Program (DCP)',
      signatories: {
        requestedByName: 'Engr. Roberto Gomez',
        requestedByDesignation: 'School ICT Coordinator',
        approvedByName: 'Alna A. Lasala',
        approvedByDesignation: 'Secondary School Principal IV',
        inspectionCommitteeHeadName: 'Juan Dela Cruz',
        supplyOfficerName: 'Maria Santos'
      },
      supplier: {
        id: 'S01',
        name: 'Metro Tech Solutions Inc.',
        tin: '008-941-284-000',
        address: 'Door 3, LKK Commercial Center, Rizal Avenue, Pagadian City'
      },
      legalFramework: 'RA 12009 / RA 9184 Transitional',
      legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009',
      templateVersion: 'GAM Vol. II Appendix 60, 61, 62 Standards',
      procurementMode: 'Small Value Procurement (Negotiated Modality)',
      snapshotTimestamp: '2026-10-05T14:15:00.000Z'
    },
    pr: {
      no: 'PR-2026-10-001',
      date: '2026-10-01',
      office: 'ICT Laboratory & Server Hub',
      fundCluster: 'DepEd Computerization Program (DCP)',
      responsibilityCenterCode: '07-001-09-09339',
      purpose: 'DepEd Computerization Program (DCP) IT Hardware for Grade 10-12 Laboratories',
      requestedBy: 'P03',
      approvedBy: 'P01'
    },
    pr_items: [
      { id: 1, stockNo: 'IT-001', desc: 'DepEd Learner Laptop, Core i5, 16GB RAM, 512GB SSD', qty: 20, unit: 'unit', unitCost: 35000, totalCost: 700000 }
    ],
    status: STATUS.PARTIALLY_ACCEPTED,
    po: {
      no: 'PO-2026-00125',
      date: '2026-10-03',
      supplierId: 'S01',
      supplierAddress: 'Door 3, LKK Commercial Center, Rizal Avenue, Pagadian City',
      mode: 'Small Value Procurement (Negotiated Modality)',
      placeOfDelivery: 'Pagadian City National Comprehensive High School Supply Depot',
      deliveryDate: '2026-10-10',
      deliveryTerm: 'Within 7 calendar days upon receipt of PO',
      paymentTerm: '30 calendar days upon complete inspection & IAR',
      paymentRule: 'partial_permitted',
      orsBursNo: 'ORS-26-10-0142',
      orsDate: '2026-10-03',
      authorizedOfficial: 'P01',
      accountantSignatory: 'P06',
      amountInWords: 'SEVEN HUNDRED THOUSAND PESOS ONLY'
    },
    po_items: [
      { id: 1, stockNo: 'IT-001', desc: 'DepEd Learner Laptop, Core i5, 16GB RAM, 512GB SSD', qty: 20, unit: 'unit', unitCost: 35000, amount: 700000 }
    ],
    deliveries: [
      {
        batchNo: 1,
        drInvoiceNo: 'INV-2026-8841',
        deliveryDate: '2026-10-04',
        receivedBy: 'Maria Santos (Supply Officer I)',
        deliveryType: 'Initial Delivery',
        items: [
          {
            id: 1,
            stockNo: 'IT-001',
            desc: 'DepEd Learner Laptop, Core i5, 16GB RAM, 512GB SSD',
            unit: 'unit',
            unitCost: 35000,
            orderedQty: 20,
            previouslyAcceptedQty: 0,
            currentDeliveredQty: 15,
            acceptedQty: 14,
            rejectedQty: 1,
            undeliveredQty: 5,
            rejectionReason: 'Unit SN: LPT-9941 failed physical inspection: Defective screen display and damaged power adapter casing.',
            rejectionCategory: 'Defective'
          }
        ],
        iarNo: 'IAR-2026-0012',
        iarDate: '2026-10-05',
        iarStatus: 'Partially Accepted',
        discrepancyRecord: {
          id: 'DDR-2026-00015',
          poNo: 'PO-2026-00125',
          deliveryBatchNo: 1,
          drInvoiceNo: 'INV-2026-8841',
          types: ['Short Delivery', 'Defective Item'],
          totalOrdered: 20,
          totalDelivered: 15,
          totalAccepted: 14,
          totalRejected: 1,
          totalUndelivered: 5,
          totalOutstanding: 6,
          inspectorFindings: 'Inspected 15 delivered units against PO specs. 14 units passed technical benchmarks. 1 unit rejected due to flickering LCD display and fractured adapter casing. 5 units missing from shipment manifest.',
          supplierNoticeDate: '2026-10-05',
          supplierNoticeStatus: 'Notice Served'
        }
      }
    ],
    dr: {
      invoiceNo: 'INV-2026-8841',
      invoiceDate: '2026-10-04',
      receivedBy: 'Maria Santos',
      deliveryType: 'Partial',
      batchNo: 1
    },
    iar: {
      no: 'IAR-2026-0012',
      dateInspected: '2026-10-05',
      status: 'Partially Accepted',
      iacChairman: 'P04',
      technicalInspector: 'P03',
      custodianOfficer: 'Maria Santos',
      conformanceInspection: true,
      acceptanceComplete: false,
      acceptanceMode: 'Partially Accepted',
      remarks: 'Partial delivery (Batch #1). PO Quantity: 20 units | Delivered: 15 units | Accepted: 14 units | Rejected: 1 unit – defective display (SN: LPT-9941) | Undelivered: 5 units. Supplier to replace 1 rejected unit and deliver 5 remaining units (Total outstanding: 6 units). Maximum quantity eligible for property inventory posting: 14 units.'
    },
    iar_items: [
      {
        id: 1,
        stockNo: 'IT-001',
        desc: 'DepEd Learner Laptop, Core i5, 16GB RAM, 512GB SSD',
        unit: 'unit',
        unitCost: 35000,
        orderedQty: 20,
        previouslyAcceptedQty: 0,
        currentDeliveredQty: 15,
        acceptedQty: 14,
        rejectedQty: 1,
        undeliveredQty: 5,
        rejectionReason: 'Unit SN: LPT-9941 failed physical inspection: Defective screen display and damaged power adapter casing.',
        rejectionCategory: 'Defective'
      }
    ]
  },
  {
    id: 'TXN-002',
    version: 'v1.0',
    isLocked: true,
    lockReason: 'Official PO Contract Awarded (Awaiting Supplier Delivery)',
    lastSavedTimestamp: '2026-10-05T11:00:00.000Z',
    isSimulated: true,
    auditHistory: [
      {
        id: 'AUD-004',
        timestamp: '2026-10-04T09:00:00.000Z',
        action: 'Purchase Request Approved (Appendix 60)',
        actor: 'Alna A. Lasala (Principal IV)',
        version: 'v1.0',
        notes: 'Simulated record — seeded for workflow testing (Demo date: October 5, 2026)'
      },
      {
        id: 'AUD-005',
        timestamp: '2026-10-05T10:30:00.000Z',
        action: 'Purchase Order Awarded (Appendix 61)',
        actor: 'Maria Santos (Supply Officer)',
        version: 'v1.0',
        notes: 'PO-2026-00126 awarded to Pagadian Paper World & School Supplies. Delivery period: 7 calendar days.'
      }
    ],
    snapshots: {
      schoolProfile: {
        schoolName: 'Pagadian City National Comprehensive High School',
        schoolId: '303906',
        regionDivision: 'Region IX – Zamboanga Peninsula - Division of Pagadian City',
        address: 'Banale, Pagadian City, Zamboanga del Sur 7016',
        uacsCode: '07-001-09-09339'
      },
      rcc: '07-001-09-09339',
      fundCluster: 'School MOOE (Maintenance & Other Operating) - 01',
      signatories: {
        requestedByName: 'Alna A. Lasala',
        requestedByDesignation: 'Secondary School Principal IV',
        approvedByName: 'Alna A. Lasala',
        approvedByDesignation: 'Secondary School Principal IV'
      },
      supplier: {
        id: 'S02',
        name: 'Pagadian Paper World & School Supplies',
        tin: '142-882-901-000',
        address: 'F.S. Pajares Avenue, Gatas District, Pagadian City'
      },
      legalFramework: 'RA 12009 / RA 9184 Transitional',
      legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009 (Direct Retail / Shopping)',
      templateVersion: 'GAM Vol. II Appendix 60, 61 Standards',
      procurementMode: 'Direct Retail Purchase of Goods',
      snapshotTimestamp: '2026-10-05T10:30:00.000Z'
    },
    pr: {
      no: 'PR-2026-10-002',
      date: '2026-10-04',
      office: 'Principal\'s Office / Admin',
      fundCluster: 'School MOOE (Maintenance & Other Operating) - 01',
      responsibilityCenterCode: '07-001-09-09339',
      purpose: 'Bond paper, test papers, and instructional duplication supplies for Mid-Year Examinations',
      requestedBy: 'P01',
      approvedBy: 'P01'
    },
    pr_items: [
      { id: 1, stockNo: 'PAP-001', desc: 'Bond Paper A4, 70gsm, 500 sheets/ream', qty: 100, unit: 'ream', unitCost: 250, totalCost: 25000 }
    ],
    status: STATUS.PENDING_DELIVERY,
    po: {
      no: 'PO-2026-00126',
      date: '2026-10-05',
      supplierId: 'S02',
      supplierAddress: 'F.S. Pajares Avenue, Gatas District, Pagadian City',
      mode: 'Direct Retail Purchase of Goods',
      placeOfDelivery: 'Pagadian City National Comprehensive High School Supply Depot',
      deliveryDate: '2026-10-12',
      deliveryTerm: 'Within 7 calendar days upon receipt of PO',
      paymentTerm: '15 calendar days upon complete inspection',
      paymentRule: 'full_lot_required',
      orsBursNo: 'ORS-26-10-0155',
      orsDate: '2026-10-05',
      authorizedOfficial: 'P01',
      accountantSignatory: 'P06',
      amountInWords: 'TWENTY FIVE THOUSAND PESOS ONLY'
    },
    po_items: [
      { id: 1, stockNo: 'PAP-001', desc: 'Bond Paper A4, 70gsm, 500 sheets/ream', qty: 100, unit: 'ream', unitCost: 250, amount: 25000 }
    ],
    deliveries: [],
    dr: null,
    iar: null,
    iar_items: null
  },
  {
    id: 'TXN-003',
    version: 'v1.0',
    isLocked: false,
    lastSavedTimestamp: '2026-10-05T08:00:00.000Z',
    isSimulated: true,
    auditHistory: [
      {
        id: 'AUD-006',
        timestamp: '2026-10-05T08:00:00.000Z',
        action: 'Purchase Request Created (Appendix 60)',
        actor: 'Dr. Elena Ramos (Science Dept Head)',
        version: 'v1.0',
        notes: 'Simulated record — seeded for workflow testing (Demo date: October 5, 2026)'
      }
    ],
    snapshots: {
      schoolProfile: {
        schoolName: 'Pagadian City National Comprehensive High School',
        schoolId: '303906',
        regionDivision: 'Region IX – Zamboanga Peninsula - Division of Pagadian City',
        address: 'Banale, Pagadian City, Zamboanga del Sur 7016',
        uacsCode: '07-001-09-09339'
      },
      rcc: '07-001-09-09339',
      fundCluster: 'Learning Resource Fund (LRF / BE-LCP)',
      signatories: {
        requestedByName: 'Dr. Elena Ramos',
        requestedByDesignation: 'Head Teacher VI - Science Dept Head',
        approvedByName: 'Alna A. Lasala',
        approvedByDesignation: 'Secondary School Principal IV'
      },
      legalFramework: 'RA 12009 (New Government Procurement Act) / GAM Vol. II',
      legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009',
      templateVersion: 'GAM Vol. II Appendix 60 Standards',
      snapshotTimestamp: '2026-10-05T08:00:00.000Z'
    },
    pr: {
      no: 'PR-2026-10-003',
      date: '2026-10-05',
      office: 'Science Laboratory (Biology/Chem)',
      fundCluster: 'Learning Resource Fund (LRF / BE-LCP)',
      responsibilityCenterCode: '07-001-09-09339',
      purpose: 'Classroom science kits, instructional modules and laboratory printers for science department',
      requestedBy: 'P05',
      approvedBy: 'P01'
    },
    pr_items: [
      { id: 1, stockNo: 'IT-004', desc: 'Printer, Continuous Ink Tank for Science Dept', qty: 3, unit: 'unit', unitCost: 12000, totalCost: 36000 }
    ],
    status: STATUS.PENDING_PO,
    po: null,
    po_items: null,
    deliveries: [],
    dr: null,
    iar: null,
    iar_items: null
  },
  {
    id: 'TXN-004',
    version: 'v1.0',
    isLocked: true,
    lockReason: 'Contract 100% Completed, Inspected, and Accepted into Property Custody',
    lastSavedTimestamp: '2026-09-26T16:00:00.000Z',
    isSimulated: true,
    auditHistory: [
      {
        id: 'AUD-007',
        timestamp: '2026-09-15T10:00:00.000Z',
        action: 'Purchase Request Approved (Appendix 60)',
        actor: 'Alna A. Lasala (Principal IV)',
        version: 'v1.0',
        notes: 'Simulated record — seeded for workflow testing (Historical archive)'
      },
      {
        id: 'AUD-008',
        timestamp: '2026-09-18T14:00:00.000Z',
        action: 'Purchase Order Awarded (Appendix 61)',
        actor: 'Maria Santos (Supply Officer)',
        version: 'v1.0',
        notes: 'PO-2026-00099 awarded to Pagadian Paper World & School Supplies.'
      },
      {
        id: 'AUD-009',
        timestamp: '2026-09-26T15:30:00.000Z',
        action: 'IAR Full Inspection & 100% Acceptance (Appendix 62)',
        actor: 'Juan Dela Cruz (IAC Chairman)',
        version: 'v1.0',
        notes: '100% of units inspected, accepted, and recorded into property custody.'
      }
    ],
    snapshots: {
      schoolProfile: {
        schoolName: 'Pagadian City National Comprehensive High School',
        schoolId: '303906',
        regionDivision: 'Region IX – Zamboanga Peninsula - Division of Pagadian City',
        address: 'Banale, Pagadian City, Zamboanga del Sur 7016',
        uacsCode: '07-001-09-09339'
      },
      rcc: '07-001-09-09339',
      fundCluster: 'School MOOE (Maintenance & Other Operating) - 01',
      signatories: {
        requestedByName: 'Engr. Roberto Gomez',
        requestedByDesignation: 'School ICT Coordinator',
        approvedByName: 'Alna A. Lasala',
        approvedByDesignation: 'Secondary School Principal IV',
        inspectionCommitteeHeadName: 'Juan Dela Cruz',
        supplyOfficerName: 'Maria Santos'
      },
      supplier: {
        id: 'S02',
        name: 'Pagadian Paper World & School Supplies',
        tin: '142-882-901-000',
        address: 'F.S. Pajares Avenue, Gatas District, Pagadian City'
      },
      legalFramework: 'RA 12009 / RA 9184 / GAM Vol. II',
      legalBasis: 'DepEd Order No. 41, s. 2021 / RA 12009',
      templateVersion: 'GAM Vol. II Appendix 60, 61, 62 Standards',
      procurementMode: 'Small Value Procurement (Negotiated Modality)',
      snapshotTimestamp: '2026-09-18T14:00:00.000Z'
    },
    pr: {
      no: 'PR-2026-09-088',
      date: '2026-09-15',
      office: 'Faculty Learning Resource Center',
      fundCluster: 'School MOOE (Maintenance & Other Operating) - 01',
      responsibilityCenterCode: '07-001-09-09339',
      purpose: 'High-speed wireless routers and networking patch panels for Grade 7-9 Building',
      requestedBy: 'P03',
      approvedBy: 'P01'
    },
    pr_items: [
      { id: 1, stockNo: 'IT-005', desc: 'Enterprise Wi-Fi 6 Access Point & Gigabit Router', qty: 5, unit: 'unit', unitCost: 6500, totalCost: 32500 }
    ],
    status: STATUS.COMPLETED,
    po: {
      no: 'PO-2026-00099',
      date: '2026-09-18',
      supplierId: 'S02',
      supplierAddress: 'F.S. Pajares Avenue, Gatas District, Pagadian City',
      mode: 'Small Value Procurement (Negotiated Modality)',
      placeOfDelivery: 'Pagadian City National Comprehensive High School Supply Depot',
      deliveryDate: '2026-09-25',
      deliveryTerm: 'Within 7 calendar days upon receipt of PO',
      paymentTerm: '30 calendar days upon complete inspection & IAR',
      paymentRule: 'partial_permitted',
      orsBursNo: 'ORS-26-09-0091',
      orsDate: '2026-09-17',
      authorizedOfficial: 'P01',
      accountantSignatory: 'P06',
      amountInWords: 'THIRTY TWO THOUSAND FIVE HUNDRED PESOS ONLY'
    },
    po_items: [
      { id: 1, stockNo: 'IT-005', desc: 'Enterprise Wi-Fi 6 Access Point & Gigabit Router', qty: 5, unit: 'unit', unitCost: 6500, amount: 32500 }
    ],
    deliveries: [
      {
        batchNo: 1,
        drInvoiceNo: 'INV-2026-7719',
        deliveryDate: '2026-09-24',
        receivedBy: 'Maria Santos (Supply Officer)',
        deliveryType: 'Initial Delivery',
        items: [
          {
            id: 1,
            stockNo: 'IT-005',
            desc: 'Enterprise Wi-Fi 6 Access Point & Gigabit Router',
            unit: 'unit',
            unitCost: 6500,
            orderedQty: 5,
            previouslyAcceptedQty: 0,
            currentDeliveredQty: 5,
            acceptedQty: 5,
            rejectedQty: 0,
            undeliveredQty: 0,
            rejectionReason: '',
            rejectionCategory: undefined
          }
        ],
        iarNo: 'IAR-2026-0008',
        iarDate: '2026-09-26',
        iarStatus: 'Passed Complete'
      }
    ],
    dr: {
      invoiceNo: 'INV-2026-7719',
      invoiceDate: '2026-09-24',
      receivedBy: 'Maria Santos',
      deliveryType: 'Complete',
      batchNo: 1
    },
    iar: {
      no: 'IAR-2026-0008',
      dateInspected: '2026-09-26',
      status: 'Passed Complete',
      iacChairman: 'P04',
      technicalInspector: 'P03',
      custodianOfficer: 'Maria Santos',
      conformanceInspection: true,
      acceptanceComplete: true,
      acceptanceMode: 'Full Lot Accepted',
      remarks: '100% complete delivery. All 5 units inspected and verified compliant with technical specifications. Accepted in full for inventory custody and Property Card recording.'
    },
    iar_items: [
      {
        id: 1,
        stockNo: 'IT-005',
        desc: 'Enterprise Wi-Fi 6 Access Point & Gigabit Router',
        unit: 'unit',
        unitCost: 6500,
        orderedQty: 5,
        previouslyAcceptedQty: 0,
        currentDeliveredQty: 5,
        acceptedQty: 5,
        rejectedQty: 0,
        undeliveredQty: 0
      }
    ]
  }
];
