"use client";

import React, { useEffect, useRef } from 'react';
import { InvoiceData } from '@/app/types/invoice';
import { generateBarcode, generateQRCode } from '@/lib/barcode-utils';

interface ModernInvoiceProps {
  data: InvoiceData;
}

export const ModernInvoice: React.FC<ModernInvoiceProps> = ({ data }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      generateBarcode(barcodeRef.current, data.invoiceNumber, data.importerNTN);
    }

    if (qrCodeRef.current) {
      generateQRCode(qrCodeRef.current, {
        invoice: data.invoiceNumber,
        importer: data.importerNTN,
        fbr: data.fbrCode
      });
    }
  }, [data]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-primary text-white p-8 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">TAX INVOICE</h1>
            <p className="opacity-80">#{data.invoiceNumber}</p>
            <p className="opacity-80 mt-2">Issue Date: {data.date}</p>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <div className="bg-white p-2 rounded">
              <svg ref={barcodeRef}></svg>
            </div>
            <div className="bg-white p-2 rounded">
              <canvas ref={qrCodeRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-b-lg shadow-lg">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-primary">Client Information</h2>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Business Name:</span> {data.clientName}</p>
              <p className="text-gray-700"><span className="font-medium">NTN:</span> {data.clientNTN}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 text-primary">Importer Information</h2>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Business Name:</span> {data.importerName}</p>
              <p className="text-gray-700"><span className="font-medium">NTN:</span> {data.importerNTN}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border">GD Number</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border">HS Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border">FBR Code</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 border">Quantity</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 border">Unit Price</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border">{data.particularsOfGoods}</td>
                <td className="px-6 py-4 border">{data.gdNumber}</td>
                <td className="px-6 py-4 border">{data.hsCode}</td>
                <td className="px-6 py-4 border">{data.fbrCode}</td>
                <td className="px-6 py-4 text-right border">{data.qtyUnits.toLocaleString()}</td>
                <td className="px-6 py-4 text-right border">PKR {data.unitPrice.toLocaleString()}</td>
                <td className="px-6 py-4 text-right border">PKR {data.value.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-80 space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Subtotal:</span>
              <span>PKR {data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">GST ({(data.gst * 100).toFixed(0)}%):</span>
              <span>PKR {(data.value * data.gst).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Value Added Tax:</span>
              <span>PKR {data.valueAddedTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total Amount:</span>
              <span>PKR {(data.value * (1 + data.gst) + data.valueAddedTax).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
          <p>This is a computer-generated document. No signature is required.</p>
        </div>
      </div>
    </div>
  );
};