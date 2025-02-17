"use client";

import React, { useEffect, useRef } from 'react';
import { InvoiceData } from '@/app/types/invoice';
import { generateBarcode, generateQRCode } from '@/lib/barcode-utils';

interface ClassicInvoiceProps {
  data: InvoiceData;
}

export const ClassicInvoice: React.FC<ClassicInvoiceProps> = ({ data }) => {
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
    <div className="p-8 max-w-4xl mx-auto border-8 border-double border-gray-200">
      <div className="text-center border-b-2 border-gray-200 pb-8 mb-8">
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-4xl font-serif mb-2">TAX INVOICE</h1>
            <p className="text-gray-600">#{data.invoiceNumber}</p>
            <p className="text-gray-600 mt-2">Issue Date: {data.date}</p>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <svg ref={barcodeRef}></svg>
            <canvas ref={qrCodeRef}></canvas>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="border-r border-gray-200 pr-12">
          <h2 className="font-serif text-xl mb-4 border-b border-gray-200 pb-2">Client Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Business Name:</span> {data.clientName}</p>
            <p><span className="font-semibold">NTN:</span> {data.clientNTN}</p>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-xl mb-4 border-b border-gray-200 pb-2">Importer Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Business Name:</span> {data.importerName}</p>
            <p><span className="font-semibold">NTN:</span> {data.importerNTN}</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-2 border-gray-200 px-4 py-3 text-left font-serif">Description</th>
              <th className="border-2 border-gray-200 px-4 py-3 text-left font-serif">GD Number</th>
              <th className="border-2 border-gray-200 px-4 py-3 text-left font-serif">HS Code</th>
              <th className="border-2 border-gray-200 px-4 py-3 text-left font-serif">FBR Code</th>
              <th className="border-2 border-gray-200 px-4 py-3 text-right font-serif">Quantity</th>
              <th className="border-2 border-gray-200 px-4 py-3 text-right font-serif">Unit Price</th>
              <th className="border-2 border-gray-200 px-4 py-3 text-right font-serif">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-3">{data.particularsOfGoods}</td>
              <td className="border border-gray-200 px-4 py-3">{data.gdNumber}</td>
              <td className="border border-gray-200 px-4 py-3">{data.hsCode}</td>
              <td className="border border-gray-200 px-4 py-3">{data.fbrCode}</td>
              <td className="border border-gray-200 px-4 py-3 text-right">{data.qtyUnits.toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-3 text-right">PKR {data.unitPrice.toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-3 text-right">PKR {data.value.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-72">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 text-right font-semibold">Subtotal:</td>
                <td className="py-2 text-right pl-8">PKR {data.value.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-right font-semibold">GST ({(data.gst * 100).toFixed(0)}%):</td>
                <td className="py-2 text-right pl-8">PKR {(data.value * data.gst).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-right font-semibold">Value Added Tax:</td>
                <td className="py-2 text-right pl-8">PKR {data.valueAddedTax.toLocaleString()}</td>
              </tr>
              <tr className="border-t-2 border-gray-200">
                <td className="py-2 text-right font-bold font-serif">Total Amount:</td>
                <td className="py-2 text-right pl-8 font-bold">
                  PKR {(data.value * (1 + data.gst) + data.valueAddedTax).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
        <p>This is a computer-generated document. No signature is required.</p>
      </div>
    </div>
  );
};