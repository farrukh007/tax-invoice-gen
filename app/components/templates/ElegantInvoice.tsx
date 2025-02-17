"use client";

import React, { useEffect, useRef } from 'react';
import { InvoiceData } from '@/app/types/invoice';
import { generateBarcode, generateQRCode } from '@/lib/barcode-utils';

interface ElegantInvoiceProps {
  data: InvoiceData;
}

export const ElegantInvoice: React.FC<ElegantInvoiceProps> = ({ data }) => {
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
    <div className="p-12 max-w-[210mm] mx-auto bg-gradient-to-br from-gray-50 to-white">
      <div className="relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-16 translate-y-16"></div>
        
        <div className="relative bg-white shadow-xl rounded-xl p-8 border border-gray-100">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-light mb-2">TAX INVOICE</h1>
              <div className="space-y-1 text-gray-600">
                <p>Invoice #: {data.invoiceNumber}</p>
                <p>Date: {data.date}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-4">
              <div className="bg-white p-2 shadow rounded">
                <svg ref={barcodeRef}></svg>
              </div>
              <div className="bg-white p-2 shadow rounded">
                <canvas ref={qrCodeRef}></canvas>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Client Information</h2>
              <div className="space-y-2">
                <p className="text-xl">{data.clientName}</p>
                <p className="text-gray-600">NTN: {data.clientNTN}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Importer Information</h2>
              <div className="space-y-2">
                <p className="text-xl">{data.importerName}</p>
                <p className="text-gray-600">NTN: {data.importerNTN}</p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 text-left font-normal text-gray-500">Description</th>
                  <th className="py-4 text-left font-normal text-gray-500">GD Number</th>
                  <th className="py-4 text-left font-normal text-gray-500">HS Code</th>
                  <th className="py-4 text-left font-normal text-gray-500">FBR Code</th>
                  <th className="py-4 text-right font-normal text-gray-500">Quantity</th>
                  <th className="py-4 text-right font-normal text-gray-500">Unit Price</th>
                  <th className="py-4 text-right font-normal text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-6">{data.particularsOfGoods}</td>
                  <td className="py-6">{data.gdNumber}</td>
                  <td className="py-6">{data.hsCode}</td>
                  <td className="py-6">{data.fbrCode}</td>
                  <td className="py-6 text-right">{data.qtyUnits.toLocaleString()}</td>
                  <td className="py-6 text-right">PKR {data.unitPrice.toLocaleString()}</td>
                  <td className="py-6 text-right">PKR {data.value.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>PKR {data.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST ({(data.gst * 100).toFixed(0)}%)</span>
                  <span>PKR {(data.value * data.gst).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Value Added Tax</span>
                  <span>PKR {data.valueAddedTax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between font-medium text-lg">
                  <span>Total Amount</span>
                  <span>PKR {(data.value * (1 + data.gst) + data.valueAddedTax).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t text-center text-sm text-gray-500">
            <p>This is a computer-generated document. No signature is required.</p>
            <p className="mt-1">Powered by InvoiceGen</p>
          </div>
        </div>
      </div>
    </div>
  );
};