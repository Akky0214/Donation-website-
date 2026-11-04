import { jsPDF } from 'jspdf';
import { DonationReceipt } from '../types/donation';

const TRUST_NAME = 'Kindred Horizons Public Charitable Trust';
const TRUST_PAN = 'AAATK9412F';
const TRUST_80G_URN = 'AAATK9412FE20234';
const TRUST_DARPAN_ID = 'DL/2023/0381920';
const TRUST_ADDRESS = '14/B Barakhamba Road, Connaught Place, New Delhi 110001';

/**
 * Downloads a structured CSV file formatted for Indian Income Tax Return (Schedule 80G) filing.
 */
export const downloadConsolidatedCsv = (receipts: DonationReceipt[]): void => {
  if (!receipts || receipts.length === 0) return;

  const headers = [
    'Receipt Number',
    'Transaction Date',
    'Donor Name',
    'Donor PAN (For Form 10BE)',
    'Donor Email',
    'Donor Phone',
    'Cause / Project Title',
    'Gross Donation (INR)',
    'Processing Fee Covered (INR)',
    'Total Paid (INR)',
    'Section 80G Eligible Deduction (50% INR)',
    'Payment Frequency',
    'Payment Mode',
    'Payment Details',
    'Donee Trust Name',
    'Donee Trust PAN',
    'Section 80G URN',
    'NGO Darpan ID',
    'Trust Registered Address',
    'Form 10BE Status'
  ];

  const rows = receipts.map((r) => [
    `"${r.receiptId}"`,
    `"${r.transactionDate}"`,
    `"${(r.donorName || 'Anonymous Donor').replace(/"/g, '""')}"`,
    `"${r.donorPAN || 'NOT PROVIDED'}"`,
    `"${(r.donorEmail || '').replace(/"/g, '""')}"`,
    `"${(r.donorPhone || '').replace(/"/g, '""')}"`,
    `"${(r.campaignTitle || 'General Humanitarian Relief').replace(/"/g, '""')}"`,
    r.amount,
    r.feeCovered || 0,
    r.totalPaid,
    r.taxDeductibleAmount || Math.round(r.totalPaid * 0.5),
    `"${r.frequency === 'monthly' ? 'Monthly Recurring' : 'One-Time'}"`,
    `"${r.paymentMethod}"`,
    `"${r.upiVpa ? `UPI: ${r.upiVpa}` : r.cardLast4 ? `Card ending ${r.cardLast4}` : 'Online Transfer'}"`,
    `"${TRUST_NAME}"`,
    `"${TRUST_PAN}"`,
    `"${r.section80GRegNo || TRUST_80G_URN}"`,
    `"${r.darpanId || TRUST_DARPAN_ID}"`,
    `"${TRUST_ADDRESS}"`,
    '"Eligible under Rule 18AB / Form 10BE"'
  ]);

  // Include summary line at the bottom
  const totalAmount = receipts.reduce((sum, r) => sum + r.totalPaid, 0);
  const totalEligible = receipts.reduce((sum, r) => sum + (r.taxDeductibleAmount || Math.round(r.totalPaid * 0.5)), 0);

  const summaryRow = [
    '"TOTALS"',
    `"${receipts.length} transactions"`,
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    totalAmount,
    totalEligible,
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '"50% Deductible under Sec 80G(5)(vi)"'
  ];

  const csvLines = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
    summaryRow.join(',')
  ];

  const csvContent = '\uFEFF' + csvLines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  anchor.download = `Kindred_Horizons_80G_Donation_History_${dateStr}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * Generates and downloads an audit-ready, multi-page consolidated Section 80G PDF statement
 * suitable for submission to Chartered Accountants (CA) or Income Tax Department (ITR).
 */
export const downloadConsolidatedPdf = (receipts: DonationReceipt[]): void => {
  if (!receipts || receipts.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Primary Donor info (from the first receipt with PAN or name)
  const donorWithPan = receipts.find((r) => r.donorPAN) || receipts[0];
  const donorName = donorWithPan.donorName || 'Generous Contributor';
  const donorPAN = donorWithPan.donorPAN || 'Not Provided';
  const donorEmail = donorWithPan.donorEmail || 'N/A';
  const donorPhone = donorWithPan.donorPhone || 'N/A';

  const totalPaid = receipts.reduce((sum, r) => sum + r.totalPaid, 0);
  const totalDeductible = receipts.reduce((sum, r) => sum + (r.taxDeductibleAmount || Math.round(r.totalPaid * 0.5)), 0);

  let currentY = 14;

  // --- TOP BANNER / TRUST HEADER ---
  doc.setFillColor(28, 25, 23); // stone-900
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(TRUST_NAME.toUpperCase(), margin + 6, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(214, 211, 209); // stone-300
  doc.text(
    `PAN: ${TRUST_PAN}  |  80G URN: ${TRUST_80G_URN}  |  NGO Darpan: ${TRUST_DARPAN_ID}`,
    margin + 6,
    currentY + 13
  );
  doc.text(
    `Regd. Office: ${TRUST_ADDRESS}`,
    margin + 6,
    currentY + 18
  );

  currentY += 30;

  // --- DOCUMENT TITLE ---
  doc.setTextColor(28, 25, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CONSOLIDATED DONATION STATEMENT & SECTION 80G SUMMARY', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 113, 108); // stone-500
  const statementDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  doc.text(`Issued for Assessment Year 2026-27 (FY 2025-26)  •  Generated on: ${statementDate}`, margin, currentY + 5);

  currentY += 12;

  // --- TWO-COLUMN INFO BOXES ---
  const boxWidth = (contentWidth - 6) / 2;
  const boxHeight = 28;

  // Donor Details Box
  doc.setFillColor(250, 248, 245); // #FAF8F5
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, currentY, boxWidth, boxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 113, 108);
  doc.text('DONOR / ASSESSEE INFORMATION', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(28, 25, 23);
  doc.text(donorName, margin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(68, 64, 60);
  doc.text(`Permanent Account No (PAN): ${donorPAN}`, margin + 4, currentY + 17);
  doc.text(`Email: ${donorEmail}  |  Phone: ${donorPhone}`, margin + 4, currentY + 22);

  // Statement Metrics Box
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(margin + boxWidth + 6, currentY, boxWidth, boxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 113, 108);
  doc.text('STATUTORY 80G EXEMPTION SUMMARY', margin + boxWidth + 10, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(68, 64, 60);
  doc.text(`Total Donations Count: ${receipts.length} transactions`, margin + boxWidth + 10, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text(`Total Contributed: INR ${totalPaid.toLocaleString('en-IN')}`, margin + boxWidth + 10, currentY + 18);

  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text(`Eligible Deduction (50%): INR ${totalDeductible.toLocaleString('en-IN')}`, margin + boxWidth + 10, currentY + 23);

  currentY += boxHeight + 8;

  // --- ITEMISED DONATIONS TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(28, 25, 23);
  doc.text('ITEMISED CONTRIBUTIONS LEDGER', margin, currentY);

  currentY += 4;

  // Table Header
  const colX = {
    ref: margin + 3,
    date: margin + 30,
    cause: margin + 55,
    mode: margin + 118,
    amount: margin + 148,
    deductible: margin + 180
  };

  doc.setFillColor(245, 245, 244);
  doc.setDrawColor(214, 211, 209);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.line(margin, currentY + 7, margin + contentWidth, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(68, 64, 60);
  doc.text('RECEIPT REF', colX.ref, currentY + 4.8);
  doc.text('DATE', colX.date, currentY + 4.8);
  doc.text('CAUSE / FIELD CAMPAIGN', colX.cause, currentY + 4.8);
  doc.text('MODE', colX.mode, currentY + 4.8);
  doc.text('PAID (INR)', colX.amount, currentY + 4.8, { align: 'right' });
  doc.text('50% 80G (INR)', colX.deductible, currentY + 4.8, { align: 'right' });

  currentY += 7;

  // Table Rows
  receipts.forEach((r, idx) => {
    // Check if we need a new page
    if (currentY > 260) {
      doc.addPage();
      currentY = 16;

      // Repeat Table Header
      doc.setFillColor(245, 245, 244);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(68, 64, 60);
      doc.text('RECEIPT REF', colX.ref, currentY + 4.8);
      doc.text('DATE', colX.date, currentY + 4.8);
      doc.text('CAUSE / FIELD CAMPAIGN', colX.cause, currentY + 4.8);
      doc.text('MODE', colX.mode, currentY + 4.8);
      doc.text('PAID (INR)', colX.amount, currentY + 4.8, { align: 'right' });
      doc.text('50% 80G (INR)', colX.deductible, currentY + 4.8, { align: 'right' });
      currentY += 7;
    }

    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, currentY, contentWidth, 7.5, 'F');
    }

    doc.setDrawColor(240, 240, 238);
    doc.line(margin, currentY + 7.5, margin + contentWidth, currentY + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(28, 25, 23);
    doc.text(`#${r.receiptId}`, colX.ref, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(87, 83, 78);
    doc.text(r.transactionDate || '-', colX.date, currentY + 5);

    // Truncate campaign title if long
    let title = r.campaignTitle || 'General Humanitarian Relief';
    if (title.length > 36) {
      title = title.substring(0, 34) + '...';
    }
    doc.text(title, colX.cause, currentY + 5);

    const modeText = r.paymentMethod.replace(' (Verified)', '').replace('Mock ', '');
    doc.text(modeText, colX.mode, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 25, 23);
    doc.text(r.totalPaid.toLocaleString('en-IN'), colX.amount, currentY + 5, { align: 'right' });

    const ded = r.taxDeductibleAmount || Math.round(r.totalPaid * 0.5);
    doc.setTextColor(22, 101, 52);
    doc.text(ded.toLocaleString('en-IN'), colX.deductible, currentY + 5, { align: 'right' });

    currentY += 7.5;
  });

  // Table Total Row
  doc.setFillColor(245, 245, 244);
  doc.rect(margin, currentY, contentWidth, 8, 'F');
  doc.setDrawColor(168, 162, 158);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  doc.line(margin, currentY + 8, margin + contentWidth, currentY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(28, 25, 23);
  doc.text('CONSOLIDATED TOTALS', colX.ref, currentY + 5.5);
  doc.text(`INR ${totalPaid.toLocaleString('en-IN')}`, colX.amount, currentY + 5.5, { align: 'right' });
  doc.setTextColor(22, 101, 52);
  doc.text(`INR ${totalDeductible.toLocaleString('en-IN')}`, colX.deductible, currentY + 5.5, { align: 'right' });

  currentY += 14;

  // Check if we need room for statutory declaration
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // --- STATUTORY DECLARATION & AUDIT STAMP ---
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.roundedRect(margin, currentY, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('STATUTORY SECTION 80G FORM 10BE COMPLIANCE DECLARATION', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  const declarationText =
    'Certified that Kindred Horizons Public Charitable Trust is recognized under Section 80G(5)(vi) of the Income Tax Act, 1961. ' +
    'The above donations have been accepted towards educational, health, drinking water and disaster relief objectives and ' +
    'duly accounted for. The trust files annual Form 10BD with the Income Tax Department enabling automated pre-filling of ' +
    'Schedule 80G in donor ITR.';
  doc.text(doc.splitTextToSize(declarationText, contentWidth - 8), margin + 4, currentY + 10);

  currentY += 30;

  // --- SIGNATURES & TRUSTEES ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(68, 64, 60);
  doc.text('FOR KINDRED HORIZONS PUBLIC CHARITABLE TRUST', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text(
    'Lavanya Gurbhele (Managing Trustee)  •  Bhakti Kapse, Aarya Sarode & Aastha Kelelkar (Co-Trustees)',
    margin,
    currentY + 5
  );
  doc.text(
    'This is a digitally verified statement issued under Rule 18AB of the Income Tax Rules, 1962. No physical signature required.',
    margin,
    currentY + 9
  );

  // Save the PDF
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`Kindred_Horizons_80G_Consolidated_Statement_${dateStr}.pdf`);
};
