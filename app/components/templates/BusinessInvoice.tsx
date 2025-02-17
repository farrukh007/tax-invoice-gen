"use client";

import React, { useEffect, useRef } from 'react';
import { InvoiceData } from '@/app/types/invoice';
import { generateBarcode, generateQRCode } from '@/lib/barcode-utils';

interface BusinessInvoiceProps {
  data: InvoiceData;
}

export const BusinessInvoice: React.FC<BusinessInvoiceProps> = ({ data }) => {
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
    <div className="p-12 max-w-[210mm] mx-auto bg-white">
      <div className="border-4 border-primary/20 p-8">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-primary">TAX INVOICE</h1>
            <p className="text-gray-600 text-lg">#{data.invoiceNumber}</p>
            <p className="text-gray-600">Issue Date: {data.date}</p>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <div className="bg-white p-2 shadow-lg rounded">
              <svg ref={barcodeRef} className="mb-2"></svg>
            </div>
            <div className="bg-white p-2 shadow-lg rounded">
              <canvas ref={qrCodeRef}></canvas>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="border-r border-gray-200 pr-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">Client Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name:</span>
                <span className="font-medium">{data.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">NTN:</span>
                <span className="font-medium">{data.clientNTN}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Importer Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name:</span>
                <span className="font-medium">{data.importerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">NTN:</span>
                <span className="font-medium">{data.importerNTN}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5">
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">GD Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">HS Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">FBR Code</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Quantity</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Unit Price</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
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
          <div className="w-80 space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">PKR {data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">GST ({(data.gst * 100).toFixed(0)}%):</span>
              <span className="font-medium">PKR {(data.value * data.gst).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Value Added Tax:</span>
              <span className="font-medium">PKR {data.valueAddedTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3 bg-primary/5 px-4 rounded-lg">
              <span className="font-bold text-primary">Total Amount:</span>
              <span className="font-bold text-primary">
                PKR {(data.value * (1 + data.gst) + data.valueAddedTax).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
          <p>This is a computer-generated document. No signature is required.</p>
          <p className="mt-1">Powered by InvoiceGen</p>
        </div>
      </div>
    </div>
  );
};