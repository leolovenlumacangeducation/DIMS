import { Transaction, TransactionStages, STATUS } from '../types';

export function getTransactionStages(txn: Transaction): TransactionStages {
  const hasPO = txn.po !== null;
  const hasDeliveries = (txn.deliveries || []).length > 0;
  const hasIAR = txn.iar !== null;
  const latestBatch = [...(txn.deliveries || [])].reverse()[0];
  const ddr = latestBatch?.discrepancyRecord;

  const totalOrdered = txn.po_items?.reduce((s, i) => s + i.qty, 0) || txn.pr_items.reduce((s, i) => s + i.qty, 0);
  const acceptedQty =
    ddr?.totalAccepted ??
    (txn.deliveries || []).reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.acceptedQty, 0), 0);
  const rejectedQty = ddr?.totalRejected ?? 0;
  const undeliveredQty = ddr?.totalUndelivered ?? Math.max(0, totalOrdered - acceptedQty);
  const outstandingQty = ddr?.totalOutstanding ?? (rejectedQty + undeliveredQty);

  // 1. PR Stage
  const prStage = 'Approved';

  // 2. PO Stage
  let poStage: TransactionStages['poStage'] = 'Not Started';
  if (!hasPO) {
    poStage = 'Pending Award';
  } else {
    poStage = 'PO Awarded';
  }

  // 3. Delivery Stage
  let deliveryStage: TransactionStages['deliveryStage'] = 'Not Started';
  if (hasPO && !hasDeliveries) {
    deliveryStage = txn.status === STATUS.DELIVERY_OVERDUE ? 'Delivery Overdue' : 'Awaiting Delivery';
  } else if (hasDeliveries) {
    if (outstandingQty > 0) {
      deliveryStage = 'Partial Delivery';
    } else {
      deliveryStage = 'Complete Delivery';
    }
  }

  // 4. IAR Stage
  let iarStage: TransactionStages['iarStage'] = 'Not Started';
  if (hasDeliveries && !hasIAR) {
    iarStage = 'Awaiting Inspection';
  } else if (hasIAR) {
    if (txn.status === STATUS.COMPLETED) {
      iarStage = 'Fully Accepted';
    } else if (txn.status === STATUS.AWAITING_COMPLETION) {
      iarStage = 'Awaiting Replacement';
    } else if (rejectedQty > 0 && acceptedQty === 0) {
      iarStage = 'Rejected';
    } else if (outstandingQty > 0) {
      iarStage = 'Partially Accepted';
    } else {
      iarStage = 'Fully Accepted';
    }
  }

  // 5. Inventory Posting Stage
  let inventoryPostingStage: TransactionStages['inventoryPostingStage'] = 'Not Eligible';
  if (txn.status === STATUS.COMPLETED) {
    inventoryPostingStage = 'Fully Posted';
  } else if (acceptedQty > 0 && outstandingQty > 0) {
    inventoryPostingStage = 'Partially Eligible (Accepted Only)';
  } else if (hasIAR && acceptedQty === 0) {
    inventoryPostingStage = 'Barred (Missing/Rejected Items)';
  }

  // 6. Payment Stage
  let paymentStage: TransactionStages['paymentStage'] = 'Not Eligible';
  if (txn.status === STATUS.COMPLETED) {
    paymentStage = 'Full Disbursement Eligible';
  } else if (acceptedQty > 0 && txn.po?.paymentRule === 'partial_permitted') {
    paymentStage = 'Partial Progress Billing Eligible';
  }

  // 7. Next Operational Action & Needs Attention Evaluation
  // A record appears under Needs Attention when any of these conditions are true:
  // - PO is pending award
  // - Delivery has not started
  // - Delivery is overdue
  // - IAR is pending inspection
  // - Items are partially accepted
  // - Items are rejected
  // - Replacement is pending
  // - Supplier notice is required
  // - Inventory posting is incomplete
  // - Payment documentation is incomplete
  // - Required fields prevent export
  // - A next operational action is displayed (unresolved operational action)
  //
  // A completed record (PR-2026-09-088) where all items are fully inspected, accepted,
  // posted, and contract completed does NOT need attention.

  let nextAction = 'Review Purchase Requisition';
  let needsAttention = false;
  let attentionReason: string | undefined;

  if (txn.status === STATUS.COMPLETED) {
    nextAction = 'Cycle Complete — All units inspected, accepted & posted';
    needsAttention = false;
    attentionReason = undefined;
  } else if (!hasPO) {
    // Condition: PO is pending award
    nextAction = 'Award Purchase Order (Appendix 61)';
    needsAttention = true;
    attentionReason = 'Pending PO Award (Appendix 61)';
  } else if (!hasDeliveries) {
    // Condition: Delivery has not started or overdue
    if (txn.status === STATUS.DELIVERY_OVERDUE) {
      nextAction = 'Follow up Overdue Delivery / Impose Liquidated Damages';
      needsAttention = true;
      attentionReason = 'Supplier Delivery Overdue';
    } else {
      nextAction = 'Log Initial Delivery Receipt (DR)';
      needsAttention = true;
      attentionReason = 'Awaiting Initial Delivery Receipt';
    }
  } else if (!hasIAR) {
    // Condition: IAR is pending inspection
    nextAction = 'Conduct Inspection & Issue Appendix 62 (IAR)';
    needsAttention = true;
    attentionReason = 'Goods Delivered, Awaiting Technical Inspection & Acceptance';
  } else if (
    txn.status === STATUS.PARTIALLY_ACCEPTED ||
    txn.status === STATUS.AWAITING_COMPLETION ||
    outstandingQty > 0 ||
    rejectedQty > 0
  ) {
    // Condition: Items partially accepted, rejected, replacement pending, notice required
    nextAction = `Log Next Tranche (Batch #${(txn.deliveries?.length || 1) + 1}) / Serve Supplier Notice for ${outstandingQty} units`;
    needsAttention = true;
    attentionReason = `Incomplete Delivery (${outstandingQty} units outstanding - Replacement/Notice Required)`;
  } else {
    nextAction = 'Finalize Custodianship & Accounting Posting';
    needsAttention = true;
    attentionReason = 'Pending Property Custody Documentation';
  }

  return {
    prStage,
    poStage,
    deliveryStage,
    iarStage,
    inventoryPostingStage,
    paymentStage,
    nextAction,
    needsAttention,
    attentionReason
  };
}
