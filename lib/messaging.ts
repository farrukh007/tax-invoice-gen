import { InvoiceData } from '@/app/types/invoice';

export const sendWhatsAppMessage = async (phone: string, invoiceData: InvoiceData, pdfBlob: Blob) => {
  // Create a temporary URL for the PDF
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  const message = encodeURIComponent(`
Your invoice #${invoiceData.invoiceNumber} has been generated.

Amount: PKR ${invoiceData.value.toLocaleString()}
GST (${(invoiceData.gst * 100)}%): PKR ${(invoiceData.value * invoiceData.gst).toLocaleString()}
VAT: PKR ${invoiceData.valueAddedTax.toLocaleString()}
Total: PKR ${(invoiceData.value * (1 + invoiceData.gst) + invoiceData.valueAddedTax).toLocaleString()}

Download your invoice here: ${pdfUrl}

Thank you for your business!
  `);

  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
  window.open(whatsappUrl, '_blank');

  // Clean up the temporary URL after a delay
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
};

export const sendEmail = async (email: string, invoiceData: InvoiceData, pdfBlob: Blob) => {
  // Create a File object from the Blob
  const pdfFile = new File([pdfBlob], `invoice-${invoiceData.invoiceNumber}.pdf`, {
    type: 'application/pdf'
  });

  const subject = encodeURIComponent(`Invoice #${invoiceData.invoiceNumber} from InvoiceGen`);
  const body = encodeURIComponent(`
Dear ${invoiceData.clientName},

Please find attached your invoice #${invoiceData.invoiceNumber}.

Invoice Details:
- Date: ${invoiceData.date}
- Amount: PKR ${invoiceData.value.toLocaleString()}
- GST (${(invoiceData.gst * 100)}%): PKR ${(invoiceData.value * invoiceData.gst).toLocaleString()}
- VAT: PKR ${invoiceData.valueAddedTax.toLocaleString()}
- Total: PKR ${(invoiceData.value * (1 + invoiceData.gst) + invoiceData.valueAddedTax).toLocaleString()}

Thank you for your business!

Best regards,
InvoiceGen
  `);

  // Create a FormData object to send the email with attachment
  const formData = new FormData();
  formData.append('to', email);
  formData.append('subject', subject);
  formData.append('body', body);
  formData.append('attachment', pdfFile);

  // For now, we'll use mailto as a fallback since we can't directly attach files
  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
};