"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '../components/DataTable';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Search, Download, Eye, Trash2 } from 'lucide-react';
import { addDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  clientName: string;
  importerName: string;
  particularsOfGoods: string;
  fbrCode: string;
  value: number;
  status: 'generated' | 'pending';
  pdfUrl?: string;
}

export default function InvoicesPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [selectedImporter, setSelectedImporter] = useState<string | undefined>(undefined);
  const [selectedClient, setSelectedClient] = useState<string | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Mock data - replace with actual data from your database
  const importers = [
    { id: '1', name: 'Importer 1' },
    { id: '2', name: 'Importer 2' },
  ];

  const clients = [
    { id: '1', name: 'Client 1' },
    { id: '2', name: 'Client 2' },
  ];

  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      date: '2024-03-20',
      clientName: 'Client 1',
      importerName: 'Importer 1',
      particularsOfGoods: 'Electronics',
      fbrCode: 'FBR-123',
      value: 50000,
      status: 'generated',
      pdfUrl: '#'
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      date: '2024-03-21',
      clientName: 'Client 2',
      importerName: 'Importer 2',
      particularsOfGoods: 'Auto Parts',
      fbrCode: 'FBR-124',
      value: 75000,
      status: 'generated',
      pdfUrl: '#'
    },
  ];

  const columns = [
    { header: 'Invoice #', accessorKey: 'invoiceNumber' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Client', accessorKey: 'clientName' },
    { header: 'Importer', accessorKey: 'importerName' },
    { header: 'Particulars', accessorKey: 'particularsOfGoods' },
    { header: 'FBR Code', accessorKey: 'fbrCode' },
    { 
      header: 'Value', 
      accessorKey: 'value',
      cell: ({ row }: any) => `PKR ${row.original.value.toLocaleString()}`
    },
    {
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setSelectedInvoice(row.original);
              setIsPreviewOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.open(row.original.pdfUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Invoices</h1>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Importer</Label>
              <Select value={selectedImporter} onValueChange={setSelectedImporter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select importer" />
                </SelectTrigger>
                <SelectContent>
                  {importers.map((importer) => (
                    <SelectItem key={importer.id} value={importer.id}>
                      {importer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <DataTable
            columns={columns}
            data={mockInvoices}
          />
        </Card>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Invoice Number</Label>
                      <p className="text-lg font-medium">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <p className="text-lg font-medium">{selectedInvoice.date}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Client</Label>
                      <p className="text-lg font-medium">{selectedInvoice.clientName}</p>
                    </div>
                    <div>
                      <Label>Importer</Label>
                      <p className="text-lg font-medium">{selectedInvoice.importerName}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Particulars of Goods</Label>
                    <p className="text-lg font-medium">{selectedInvoice.particularsOfGoods}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>FBR Code</Label>
                      <p className="text-lg font-medium">{selectedInvoice.fbrCode}</p>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <p className="text-lg font-medium">PKR {selectedInvoice.value.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => window.open(selectedInvoice.pdfUrl, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}