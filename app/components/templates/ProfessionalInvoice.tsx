"use client";

import React, { useEffect, useRef } from 'react';
import { InvoiceData } from '@/app/types/invoice';
import { generateBarcode, generateQRCode } from '@/lib/barcode-utils';

interface ProfessionalInvoiceProps {
  data: InvoiceData;
}

export const ProfessionalInvoice: React.FC<ProfessionalInvoiceProps> = ({ data }) => {
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">TAX INVOICE</h1>
            <p className="opacity-80">#{data.invoiceNumber}</p>
            <p className="opacity-80 mt-2">Issue Date: {data.date}</p>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <div className="bg-white/90 p-2 rounded">
              <svg ref={barcodeRef}></svg>
            </div>
            <div className="bg-white/90 p-2 rounded">
              <canvas ref={qrCodeRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12 bg-gray-50 p-8 rounded-lg">
        <div>
          <h2 className="text-lg font-bold mb-4 text-blue-800">Client Information</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Business Name:</span>
              <span>{data.clientName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">NTN:</span>
              <span>{data.clientNTN}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4 text-blue-800">Importer Information</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Business Name:</span>
              <span>{data.importerName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">NTN:</span>
              <span>{data.importerNTN}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="px-6 py-4 text-left">Description</th>
              <th className="px-6 py-4 text-left">GD Number</th>
              <th className="px-6 py-4 text-left">HS Code</th>
              <th className="px-6 py-4 text-left">FBR Code</th>
              <th className="px-6 py-4 text-right">Quantity</th>
              <th className="px-6 py-4 text-right">Unit Price</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4">{data.particularsOfGoods}</td>
              <td className="px-6 py-4">{data.gdNumber}</td>
              <td className="px-6 py-4">{data.hsCode}</td>
              <td className="px-6 py-4">{data.fbrCode}</td>
              <td className="px-6 py-4 text-right">{data.qtyUnits.toLocaleString()}</td>
              <td className="px-6 py-4 text-right">PKR {data.unitPrice.toLocaleString()}</td>
              <td className="px-6 py-4 text-right">PKR {data.value.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-80 bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Subtotal:</span>
              <span>PKR {data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">GST ({(data.gst * 100).toFixed(0)}%):</span>
              <span>PKR {(data.value * data.gst).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Value Added Tax:</span>
              <span>PKR {data.valueAddedTax.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-blue-800">
              <span>Total Amount:</span>
              <span>PKR {(data.value * (1 + data.gst) + data.valueAddedTax).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
        <p>This is a computer-generated document. No signature is required.</p>
      </div>
    </div>
  );
};