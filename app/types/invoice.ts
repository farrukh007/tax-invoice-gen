export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientNTN: string;
  clientName: string;
  importerNTN: string;
  importerName: string;
  particularsOfGoods: string;
  gdNumber: string;
  hsCode: string;
  fbrCode: string;
  qtyUnits: number;
  value: number;
  gst: number;
  valueAddedTax: number;
  unitPrice: number;
  // Additional fields
  currency: string;
  paymentTerms: string;
  dueDate: string;
  remarks: string;
}

export interface Template {
  id: string;
  name: string;
  preview: string;
  component: React.ComponentType<{ data: InvoiceData }>;
}

export interface SidebarItem {
  name: string;
  icon: React.ComponentType;
  href: string;
}