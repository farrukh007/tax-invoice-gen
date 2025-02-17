export interface Client {
  id: number;
  serialNumber: string;
  ntn: string;
  strn: string;
  cnic: string;
  customerName: string;
  businessName: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Importer {
  id: number;
  serialNumber: string;
  businessName: string;
  name: string;
  cnic: string;
  ntn: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  clientId: number;
  importerId: number;
  particularsOfGoods: string;
  gdNumber: string;
  hsCode: string;
  fbrCode: string;
  qtyUnits: number;
  value: number;
  gst: number;
  valueAddedTax: number;
  unitPrice: number;
  created_at: string;
  updated_at: string;
}