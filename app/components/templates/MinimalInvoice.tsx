"use client";

import React, { useEffect, useRef } from 'react';
import { InvoiceData } from '@/app/types/invoice';
import { generateBarcode, generateQRCode } from '@/lib/barcode-utils';

interface MinimalInvoiceProps {
  data: InvoiceData;
}

export const MinimalInvoice: React.FC<MinimalInvoiceProps> = ({ data }) => {
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
    <div className="p-8 max-w-4xl mx-auto font-light">
      <div className="border-b pb-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-extralight mb-2">TAX INVOICE</h1>
            <p className="text-gray-500">#{data.invoiceNumber}</p>
            <p className="text-gray-500 mt-2">Issue Date: {data.date}</p>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <svg ref={barcodeRef}></svg>
            <canvas ref={qrCodeRef}></canvas>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16 mb-16">
        <div>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Client Information</h2>
          <div className="space-y-1">
            <p className="text-lg">{data.clientName}</p>
            <p className="text-gray-500">NTN: {data.clientNTN}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Importer Information</h2>
          <div className="space-y-1">
            <p className="text-lg">{data.importerName}</p>
            <p className="text-gray-500">NTN: {data.importerNTN}</p>
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
              <td className="py-4">{data.particularsOfGoods}</td>
              <td className="py-4">{data.gdNumber}</td>
              <td className="py-4">{data.hsCode}</td>
              <td className="py-4">{data.fbrCode}</td>
              <td className="py-4 text-right">{data.qtyUnits.toLocaleString()}</td>
              <td className="py-4 text-right">PKR {data.unitPrice.toLocaleString()}</td>
              <td className="py-4 text-right">PKR {data.value.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>PKR {data.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">GST ({(data.gst * 100).toFixed(0)}%)</span>
            <span>PKR {(data.value * data.gst).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Value Added Tax</span>
            <span>PKR {data.valueAddedTax.toLocaleString()}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-medium">
            <span>Total Amount</span>
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