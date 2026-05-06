// Invoice Generator with GST Support
export function calculateGST(amount) {
    const gstRate = 0.18; // 18% GST
    const subtotal = Math.round((amount / (1 + gstRate)) * 100) / 100;
    const gstAmount = Math.round((amount - subtotal) * 100) / 100;
    return {
        subtotal,
        gstAmount,
        total: amount,
        gstRate: 18
    };
}
export function generateInvoiceHTML(payment, project, user) {
    const { subtotal, gstAmount, gstRate } = calculateGST(payment.amount);
    const invoiceDate = new Date(payment.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${payment.invoice_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background: #f5f5f5;
          padding: 20px;
        }
        .invoice {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #E8662E;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #E8662E;
        }
        .logo-subtitle {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h1 {
          font-size: 32px;
          color: #333;
          margin-bottom: 8px;
        }
        .invoice-number {
          font-size: 14px;
          color: #666;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .details-section h3 {
          font-size: 12px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }
        .details-section p {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
        }
        .details-section strong {
          display: block;
          font-size: 16px;
          margin-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background: #f8f8f8;
          text-align: left;
          padding: 12px 16px;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
          border-bottom: 2px solid #eee;
        }
        td {
          padding: 16px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }
        .amount { text-align: right; }
        .subtotal-row td {
          font-weight: 500;
          border-top: 2px solid #eee;
        }
        .gst-row td {
          color: #666;
        }
        .total-row td {
          font-size: 18px;
          font-weight: bold;
          background: #f8f8f8;
          color: #E8662E;
        }
        .discount-row td {
          color: #22c55e;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .footer p {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }
        .footer .thank-you {
          font-size: 16px;
          color: #E8662E;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .payment-info {
          background: #f8f8f8;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 30px;
        }
        .payment-info p {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
        .payment-info strong {
          color: #333;
        }
        @media print {
          body { background: white; padding: 0; }
          .invoice { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div>
            <div class="logo">HOUSPIRE</div>
            <div class="logo-subtitle">AI-Powered Interior Design</div>
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <div class="invoice-number">${payment.invoice_number}</div>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-section">
            <h3>Bill To</h3>
            <p>
              <strong>${user.full_name || 'Customer'}</strong>
              ${user.email}<br>
              ${user.phone ? `${user.phone}<br>` : ''}
              ${payment.gst_number ? `GSTIN: ${payment.gst_number}` : ''}
            </p>
          </div>
          <div class="details-section">
            <h3>Invoice Details</h3>
            <p>
              <strong>Date: ${invoiceDate}</strong>
              Payment ID: ${payment.payment_id}<br>
              Order ID: ${payment.order_id}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="amount">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Interior Design Package<br>
                <span style="color: #666; font-size: 12px;">
                  Room: ${project.room_type}${project.design_style ? ` | Style: ${project.design_style}` : ''}
                </span>
              </td>
              <td class="amount">₹${subtotal.toFixed(2)}</td>
            </tr>
            ${payment.promo_code && payment.discount_amount ? `
            <tr class="discount-row">
              <td>Discount (Code: ${payment.promo_code})</td>
              <td class="amount">-₹${payment.discount_amount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="subtotal-row">
              <td>Subtotal</td>
              <td class="amount">₹${subtotal.toFixed(2)}</td>
            </tr>
            <tr class="gst-row">
              <td>GST @ ${gstRate}% (IGST)</td>
              <td class="amount">₹${gstAmount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>Total Amount</td>
              <td class="amount">₹${payment.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="payment-info">
          <p><strong>Payment Status:</strong> Paid ✓</p>
          <p><strong>Payment Method:</strong> Online Payment (Razorpay)</p>
        </div>

        <div class="footer">
          <p class="thank-you">Thank you for choosing Houspire! 🏠</p>
          <p>For support, contact: hello@houspire.ai</p>
          <p>Houspire Interior Design Pvt. Ltd.</p>
          <p>GSTIN: XXXXXXXXXXXXXXXXX</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
export function downloadInvoice(payment, project, user) {
    const html = generateInvoiceHTML(payment, project, user);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Houspire_Invoice_${payment.invoice_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
export function printInvoice(payment, project, user) {
    const html = generateInvoiceHTML(payment, project, user);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}
