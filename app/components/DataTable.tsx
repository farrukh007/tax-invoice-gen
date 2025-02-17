"use client";

import React from 'react';
import { InvoiceData } from '../types/invoice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';

interface DataTableProps {
  data: InvoiceData[];
}

export const DataTable: React.FC<DataTableProps> = ({ data = [] }) => {
  const formatNumber = (value: number | undefined): string => {
    if (typeof value !== 'number') return '0';
    return value.toLocaleString('en-PK', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="font-semibold text-gray-900 dark:text-white">Serial No.</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Invoice #</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Date</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Client NTN</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Client Name</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Importer NTN</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Importer Name</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Goods</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">GD Number</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">HS Code</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">FBR Code</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white text-right">QTY Units</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Value (PKR)</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white text-right">GST (%)</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white text-right">VAT (PKR)</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Unit Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={row.invoiceNumber || index} 
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="text-gray-900 dark:text-gray-100">{index + 1}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.invoiceNumber}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.date}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.clientNTN}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.clientName}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.importerNTN}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.importerName}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.particularsOfGoods}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.gdNumber}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.hsCode}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">{row.fbrCode}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 text-right">{formatNumber(row.qtyUnits)}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 text-right">{formatNumber(row.value)}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 text-right">{row.gst ? (row.gst * 100).toFixed(0) : '0'}%</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 text-right">{formatNumber(row.valueAddedTax)}</TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 text-right">{formatNumber(row.unitPrice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};