"use client";

import { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FileUpload } from './components/FileUpload';
import { TemplateSelector } from './components/TemplateSelector';
import { StandardInvoice } from './components/templates/StandardInvoice';
import { ModernInvoice } from './components/templates/ModernInvoice';
import { MinimalInvoice } from './components/templates/MinimalInvoice';
import { ProfessionalInvoice } from './components/templates/ProfessionalInvoice';
import { ClassicInvoice } from './components/templates/ClassicInvoice';
import { BusinessInvoice } from './components/templates/BusinessInvoice';
import { ElegantInvoice } from './components/templates/ElegantInvoice';
import { DataTable } from './components/DataTable';
import { InvoiceData, Template } from './types/invoice';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Mail, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card } from '@/components/ui/card';
import { SendInvoiceDialog } from './components/SendInvoiceDialog';
import { Progress } from '@/components/ui/progress';
import { useAuth } from './auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showPreview, setShowPreview] = useState(false);
  const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    } else if (user && !localStorage.getItem('authToken')) {
      // If user exists but no token, sign out
      signOut();
    }
  }, [user, isLoading, router, signOut]);

  if (isLoading || !user) {
    return null;
  }

  const templates: Template[] = [
    {
      id: 'standard',
      name: 'Standard Invoice',
      preview: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      component: StandardInvoice
    },
    {
      id: 'modern',
      name: 'Modern Invoice',
      preview: 'https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      component: ModernInvoice
    },
    {
      id: 'minimal',
      name: 'Minimal Invoice',
      preview: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      component: MinimalInvoice
    },
    {
      id: 'professional',
      name: 'Professional Invoice',
      preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      component: ProfessionalInvoice
    },
    {
      id: 'classic',
      name: 'Classic Invoice',
      preview: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      component: ClassicInvoice
    },
    {
      id: 'business',
      name: 'Business Invoice',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      component: BusinessInvoice
    },
    {
      id: 'elegant',
      name: 'Elegant Invoice',
      preview: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      component: ElegantInvoice
    }
  ];

  const handleFileUpload = (data: InvoiceData[]) => {
    setInvoiceData(data);
    setShowPreview(false);
    setCurrentInvoiceIndex(0);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleProceed = () => {
    setShowPreview(true);
  };

  const handleNext = () => {
    if (currentInvoiceIndex < invoiceData.length - 1) {
      setCurrentInvoiceIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentInvoiceIndex > 0) {
      setCurrentInvoiceIndex(prev => prev - 1);
    }
  };

  const handleGenerateAllPDFs = async () => {
    if (!invoiceRef.current || !invoiceData.length) return;
    
    setIsPdfGenerating(true);
    setPdfProgress(0);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 16
    });

    // Set PDF metadata
    pdf.setProperties({
      title: `Invoices-${new Date().toISOString().split('T')[0]}`,
      subject: 'Tax Invoices',
      author: 'InvoiceGen',
      keywords: 'invoice, tax, business',
      creator: 'InvoiceGen'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - (2 * margin);
    const contentHeight = pageHeight - (2 * margin);
    
    const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component;

    for (let i = 0; i < invoiceData.length; i++) {
      setPdfProgress(Math.round((i / invoiceData.length) * 100));

      const tempDiv = document.createElement('div');
      tempDiv.style.width = '210mm';
      tempDiv.style.height = '297mm';
      tempDiv.style.padding = '0';
      tempDiv.style.margin = '0';
      document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);
      
      await new Promise<void>((resolve) => {
        root.render(
          <div style={{ width: '210mm', height: '297mm', padding: '0', margin: '0', backgroundColor: 'white' }}>
            {SelectedTemplateComponent && <SelectedTemplateComponent data={invoiceData[i]} />}
          </div>
        );
        
        setTimeout(resolve, 100);
      });

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 210 * 3.78,
        windowHeight: 297 * 3.78
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      if (i > 0) {
        pdf.addPage();
      }

      // Calculate scaling to fit content while maintaining aspect ratio
      const imgAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = contentWidth / contentHeight;
      
      let imgWidth = contentWidth;
      let imgHeight = contentWidth / imgAspectRatio;
      
      if (imgHeight > contentHeight) {
        imgHeight = contentHeight;
        imgWidth = contentHeight * imgAspectRatio;
      }

      const xOffset = margin + (contentWidth - imgWidth) / 2;
      const yOffset = margin + (contentHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');

      root.unmount();
      document.body.removeChild(tempDiv);
    }

    setPdfProgress(100);
    const blob = pdf.output('blob');
    setPdfBlob(blob);
    pdf.save(`invoices-${selectedTemplate}-${new Date().getTime()}.pdf`);
    
    setTimeout(() => {
      setIsPdfGenerating(false);
      setPdfProgress(0);
    }, 1000);
  };

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component;

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Invoice Generator</h1>
        </motion.div>

        <div className="space-y-8">
          {!invoiceData.length && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}

          {invoiceData.length > 0 && !showPreview && (
            <>
              <DataTable data={invoiceData} />
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
              />
              <div className="flex justify-end">
                <Button onClick={handleProceed} size="lg">
                  Proceed to Preview
                </Button>
              </div>
            </>
          )}

          {showPreview && (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Invoice Preview</h2>
                  <TemplateSelector
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={handleTemplateSelect}
                    compact
                  />
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentInvoiceIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-lg"
                      ref={invoiceRef}
                    >
                      {SelectedTemplateComponent && (
                        <SelectedTemplateComponent data={invoiceData[currentInvoiceIndex]} />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevious}
                      disabled={currentInvoiceIndex === 0}
                      className="rounded-full shadow-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentInvoiceIndex === invoiceData.length - 1}
                      className="rounded-full shadow-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-gray-500">
                    Invoice {currentInvoiceIndex + 1} of {invoiceData.length}
                  </span>

                  <div className="flex space-x-4">
                    {isPdfGenerating ? (
                      <div className="flex-1 space-y-2">
                        <Progress value={pdfProgress} className="h-2" />
                        <p className="text-sm text-gray-500 text-center">
                          Generating PDFs... {pdfProgress}%
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleGenerateAllPDFs}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Generate All PDFs</span>
                      </Button>
                    )}
                    <SendInvoiceDialog
                      invoice={invoiceData[currentInvoiceIndex]}
                      pdfBlob={pdfBlob || undefined}
                      type="email"
                    />
                    <SendInvoiceDialog
                      invoice={invoiceData[currentInvoiceIndex]}
                      type="whatsapp"
                    />
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}