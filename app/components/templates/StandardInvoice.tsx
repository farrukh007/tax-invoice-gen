"use client";

import React, { useEffect, useRef } from 'react';
import { InvoiceData } from '@/app/types/invoice';
import { generateBarcode, generateQRCode } from '@/lib/barcode-utils';

interface StandardInvoiceProps {
  data: InvoiceData;
}

export const StandardInvoice: React.FC<StandardInvoiceProps> = ({ data }) => {
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
    <div className="max-w-4xl mx-auto bg-white p-8">
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">TAX INVOICE</h1>
          <p className="text-gray-600 text-lg">#{data.invoiceNumber}</p>
          <p className="text-gray-600">Issue Date: {data.date}</p>
        </div>
        <div className="flex flex-col items-end space-y-4">
          <svg ref={barcodeRef} className="mb-2"></svg>
          <canvas ref={qrCodeRef}></canvas>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="border-r pr-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Client Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Business Name:</span> {data.clientName}</p>
            <p><span className="font-medium">NTN:</span> {data.clientNTN}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Importer Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Business Name:</span> {data.importerName}</p>
            <p><span className="font-medium">NTN:</span> {data.importerNTN}</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border">GD Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border">HS Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border">FBR Code</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 border">Quantity</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 border">Unit Price</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 border">Amount</th>
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
  );
};