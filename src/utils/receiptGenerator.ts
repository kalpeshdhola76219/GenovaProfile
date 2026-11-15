/**
 * Client-Side Receipt Generator (PDF / PNG)
 * Generates an official, lightweight receipt containing:
 * - Receipt / Order ID
 * - Recovery Code
 * - Amount Paid
 * - Template Name
 * - Date of Payment
 * - Business Name (GenovaProfile)
 * - Restore URL (https://<host>/#restore)
 */
import { jsPDF } from 'jspdf';
import { BUSINESS } from '../config/business';

export interface GenerateReceiptData {
  receiptId: string;
  orderId?: string;
  recoveryCode?: string;
  amount: number;
  templateName: string;
  paidAt?: string;
  mobile?: string;
  restoreUrl?: string;
}

export function downloadReceiptPDF(data: GenerateReceiptData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6', // Sleek, modern pocket-sized receipt
  });

  const restoreUrl = data.restoreUrl || `${window.location.origin}/#restore`;
  const dateStr = data.paidAt ? new Date(data.paidAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : new Date().toLocaleDateString('en-IN');

  // Header Background
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, 105, 26, 'F');

  // Brand title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(BUSINESS.name, 10, 11);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text('Official Payment & Purchase Receipt', 10, 17);

  // Status Badge
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.roundedRect(68, 8, 27, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('VERIFIED PAID', 72, 13.5);

  let y = 34;

  // Receipt Details Table
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.setFontSize(8);
  doc.text('RECEIPT ID', 10, y);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text(data.receiptId || data.orderId || 'GP-RECEIPT', 10, y + 4.5);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('DATE & TIME', 10, y);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(dateStr, 10, y + 4.5);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('DESIGN TEMPLATE', 10, y);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(data.templateName, 10, y + 4.5);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('AMOUNT PAID', 10, y);
  doc.setTextColor(5, 150, 105); // Emerald-600
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`INR ${data.amount}.00`, 10, y + 5);

  // Recovery Code Box (Critical Highlight)
  y += 16;
  doc.setFillColor(241, 245, 249); // Slate-100
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.roundedRect(10, y, 85, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(67, 56, 202); // Indigo-700
  doc.text('YOUR RECOVERY CODE (KEEP SAFE):', 14, y + 6);
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(data.recoveryCode || 'CODE SAVED', 14, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Required to restore your document on another phone or computer.', 14, y + 20);

  // Retention & Restore Information
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SECURE RETENTION: 30 DAYS', 10, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Download and save your document now. To restore later, visit:', 10, y + 4);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.text(restoreUrl, 10, y + 8.5);

  // Footer Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`${BUSINESS.name}   Support: ${BUSINESS.email}`, 10, 142);

  // Trigger browser download
  const cleanPrefix = BUSINESS.name.replace(/\s+/g, '_');
  doc.save(`${cleanPrefix}_Receipt_${(data.receiptId || data.orderId || 'purchase').replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`);
}
