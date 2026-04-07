import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { appDataClient } from '@/lib/static-client';
/**
 * Calculate GST breakdown from total amount (inclusive of 18% GST)
 */
export function calculateGST(totalWithGST) {
    // Total = Subtotal + 18% GST
    // Total = Subtotal * 1.18
    // Subtotal = Total / 1.18
    const subtotal = totalWithGST / 1.18;
    const cgst = subtotal * 0.09; // 9%
    const sgst = subtotal * 0.09; // 9%
    const totalGST = cgst + sgst;
    return {
        subtotal: Math.round(subtotal * 100) / 100,
        cgst: Math.round(cgst * 100) / 100,
        sgst: Math.round(sgst * 100) / 100,
        totalGST: Math.round(totalGST * 100) / 100,
        grandTotal: totalWithGST
    };
}
/**
 * Format currency in Indian format
 */
function formatINR(amount, decimals = 2) {
    return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })}`;
}
/**
 * Create the invoice PDF document
 */
function createInvoicePDF(data) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    // Colors
    const primaryColor = [232, 102, 46]; // Houspire Orange
    const darkGray = [51, 51, 51];
    const lightGray = [107, 114, 128];
    let yPosition = margin;
    // Header - Company Info
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('HOUSPIRE', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Powered Interior Design', margin, yPosition);
    // Company details (right aligned)
    doc.setFontSize(9);
    const companyDetails = [
        'Houspire Interior Design Pvt. Ltd.',
        'Hyderabad, Telangana',
        'India - 500081',
        'GSTIN: 36XXXXX1234X1ZX',
        'Email: support@houspire.ai',
        'Phone: +91 98765 43210'
    ];
    yPosition = margin;
    companyDetails.forEach(line => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, pageWidth - margin - textWidth, yPosition);
        yPosition += 5;
    });
    // Invoice Title
    yPosition = 60;
    doc.setFontSize(28);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    const invoiceTitle = 'TAX INVOICE';
    const titleWidth = doc.getTextWidth(invoiceTitle);
    doc.text(invoiceTitle, (pageWidth - titleWidth) / 2, yPosition);
    // Invoice details box
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const invoiceDetailsY = yPosition;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, invoiceDetailsY, pageWidth - 2 * margin, 25, 'F');
    yPosition += 7;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkGray);
    doc.text('Invoice Number:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.invoiceNumber, margin + 45, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Date:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.invoiceDate, margin + 45, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Order Number:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.orderNumber, margin + 45, yPosition);
    // Customer details
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('BILL TO:', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(data.customerName, margin, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(data.customerEmail, margin, yPosition);
    if (data.customerPhone && data.customerPhone !== 'N/A') {
        yPosition += 5;
        doc.text(data.customerPhone, margin, yPosition);
    }
    yPosition += 5;
    doc.text(data.customerCity + ', India', margin, yPosition);
    // Line items table
    yPosition += 15;
    // Prepare table data
    const tableData = [
        [data.packageName, '1', formatINR(data.basePrice, 0), formatINR(data.basePrice, 0)]
    ];
    // Add addons
    if (data.addons && data.addons.length > 0) {
        data.addons.forEach(addon => {
            tableData.push([
                addon.name,
                '1',
                formatINR(addon.price, 0),
                formatINR(addon.price, 0)
            ]);
        });
    }
    autoTable(doc, {
        startY: yPosition,
        head: [['DESCRIPTION', 'QTY', 'RATE', 'AMOUNT']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: darkGray
        },
        columnStyles: {
            0: { cellWidth: 90 },
            1: { halign: 'center', cellWidth: 20 },
            2: { halign: 'right', cellWidth: 35 },
            3: { halign: 'right', cellWidth: 35 }
        },
        margin: { left: margin, right: margin }
    });
    // Get Y position after table
    yPosition = doc.lastAutoTable.finalY + 10;
    // Totals section (right aligned)
    const totalsX = pageWidth - margin;
    const labelX = totalsX - 60;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    // Subtotal
    doc.text('Subtotal:', labelX, yPosition, { align: 'right' });
    doc.text(formatINR(data.subtotal), totalsX, yPosition, { align: 'right' });
    yPosition += 6;
    doc.text('CGST (9%):', labelX, yPosition, { align: 'right' });
    doc.text(formatINR(data.cgst), totalsX, yPosition, { align: 'right' });
    yPosition += 6;
    doc.text('SGST (9%):', labelX, yPosition, { align: 'right' });
    doc.text(formatINR(data.sgst), totalsX, yPosition, { align: 'right' });
    // Total line
    yPosition += 8;
    doc.setLineWidth(0.5);
    doc.setDrawColor(...primaryColor);
    doc.line(labelX - 10, yPosition - 3, totalsX, yPosition - 3);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', labelX, yPosition, { align: 'right' });
    doc.setTextColor(...primaryColor);
    doc.text(formatINR(data.totalAmount), totalsX, yPosition, { align: 'right' });
    // Payment details
    yPosition += 15;
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('PAYMENT DETAILS:', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(9);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Method: ${data.paymentMethod}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Payment ID: ${data.paymentId}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Payment Date: ${data.paymentDate}`, margin, yPosition);
    // Payment status badge
    yPosition += 2;
    doc.setFillColor(16, 185, 129); // Green
    doc.roundedRect(margin, yPosition, 25, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', margin + 12.5, yPosition + 5, { align: 'center' });
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 30;
    // Separator line
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    // Terms & conditions
    yPosition = footerY + 7;
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.setFont('helvetica', 'italic');
    const termsText = 'This is a computer-generated invoice and does not require a signature.';
    const termsWidth = doc.getTextWidth(termsText);
    doc.text(termsText, (pageWidth - termsWidth) / 2, yPosition);
    yPosition += 5;
    const contactText = 'For queries, contact: support@houspire.ai';
    const contactWidth = doc.getTextWidth(contactText);
    doc.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    const thanksText = 'Thank you for choosing Houspire!';
    const thanksWidth = doc.getTextWidth(thanksText);
    doc.text(thanksText, (pageWidth - thanksWidth) / 2, yPosition);
    return doc;
}
/**
 * Generate invoice PDF from order data
 */
export async function generateInvoice(orderId) {
    try {
        // Fetch order details
        const { data: order, error } = await appDataClient
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        if (error || !order) {
            throw new Error('Order not found');
        }
        // Calculate GST breakdown
        const gst = calculateGST(order.final_price || order.base_price || 0);
        // Parse addons
        let addons = [];
        if (order.selected_addons) {
            if (Array.isArray(order.selected_addons)) {
                addons = order.selected_addons.map((addon) => ({
                    name: addon.name || addon.addon_name || 'Add-on',
                    price: addon.price || addon.addon_price || 0
                }));
            }
        }
        // Prepare invoice data
        const invoiceData = {
            invoiceNumber: `INV-${order.order_number}`,
            invoiceDate: new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            orderNumber: order.order_number,
            customerName: order.customer_name || 'Customer',
            customerEmail: order.customer_email || '',
            customerPhone: order.customer_phone || 'N/A',
            customerCity: order.customer_city || 'India',
            packageName: order.package_name || 'Design Package',
            basePrice: order.base_price || 0,
            addons,
            subtotal: gst.subtotal,
            cgst: gst.cgst,
            sgst: gst.sgst,
            totalAmount: order.final_price || order.base_price || 0,
            paymentMethod: order.payment_method || 'Online Payment',
            paymentId: order.razorpay_payment_id || order.payment_id || 'N/A',
            paymentDate: order.created_at
                ? new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : new Date().toLocaleDateString('en-IN')
        };
        // Create PDF
        const pdf = createInvoicePDF(invoiceData);
        // Return as Blob
        return pdf.output('blob');
    }
    catch (error) {
        console.error('Error generating invoice:', error);
        throw error;
    }
}
/**
 * Save invoice to Supabase Storage and update order
 */
export async function saveInvoiceToStorage(orderId, pdfBlob) {
    try {
        // Get order number for filename
        const { data: order } = await appDataClient
            .from('orders')
            .select('order_number')
            .eq('id', orderId)
            .single();
        if (!order)
            throw new Error('Order not found');
        const fileName = `${order.order_number}.pdf`;
        const filePath = `${orderId}/${fileName}`;
        // Upload to Supabase Storage
        const { error: uploadError } = await appDataClient.storage
            .from('invoices')
            .upload(filePath, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true // Overwrite if exists
        });
        if (uploadError) {
            console.warn('Storage upload failed:', uploadError);
            // Continue without storage - invoice can still be generated on-demand
        }
        // Get public URL if upload succeeded
        const { data: urlData } = appDataClient.storage
            .from('invoices')
            .getPublicUrl(filePath);
        const publicUrl = urlData?.publicUrl || '';
        // Update order with invoice details (cast to any for newly added columns)
        await appDataClient
            .from('orders')
            .update({
            invoice_number: `INV-${order.order_number}`,
            invoice_url: publicUrl || null,
            invoice_generated_at: new Date().toISOString()
        })
            .eq('id', orderId);
        return publicUrl;
    }
    catch (error) {
        console.error('Error saving invoice:', error);
        throw error;
    }
}
/**
 * Generate and save invoice (complete workflow)
 */
export async function generateAndSaveInvoice(orderId) {
    try {
        // Generate PDF
        const pdfBlob = await generateInvoice(orderId);
        // Save to storage
        const invoiceUrl = await saveInvoiceToStorage(orderId, pdfBlob);
        console.log(`Invoice generated and saved for order ${orderId}`);
        return invoiceUrl;
    }
    catch (error) {
        console.error('Error in generate and save invoice:', error);
        throw error;
    }
}
/**
 * Download invoice directly (for customer dashboard)
 */
export async function downloadInvoice(orderId) {
    try {
        // Get order for filename
        const { data: order } = await appDataClient
            .from('orders')
            .select('order_number')
            .eq('id', orderId)
            .single();
        const pdfBlob = await generateInvoice(orderId);
        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Houspire_Invoice_${order?.order_number || orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    catch (error) {
        console.error('Error downloading invoice:', error);
        throw error;
    }
}
/**
 * Open invoice in new tab for printing
 */
export async function printInvoice(orderId) {
    try {
        const pdfBlob = await generateInvoice(orderId);
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
        // Clean up after a delay
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
    catch (error) {
        console.error('Error printing invoice:', error);
        throw error;
    }
}

