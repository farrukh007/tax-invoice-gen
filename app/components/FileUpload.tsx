"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { InvoiceData } from '../types/invoice';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileUpload: (data: InvoiceData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        return header.trim().replace(/\s+/g, '');
      },
      transform: (value: string) => {
        value = value.trim();
        if (value === '') return null;
        const num = Number(value);
        return !isNaN(num) && value.match(/^-?\d*\.?\d+$/) ? num : value;
      },
      complete: (results) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const parsedData = results.data.map((row: any) => ({
          serialNumber: row.SerialNumber,
          invoiceNumber: row.InvoiceNumber,
          date: row.Date,
          clientNTN: row.ClientNTN,
          clientName: row.ClientName,
          importerNTN: row.ImporterNTN,
          importerName: row.ImporterName,
          particularsOfGoods: row.ParticularsofGoods,
          gdNumber: row.GDNumber,
          hsCode: row.HSCode,
          fbrCode: row.FBRCode,
          qtyUnits: Number(row.QTYUnits) || 0,
          value: Number(row.Value) || 0,
          gst: Number(row.GST) / 100 || 0,
          valueAddedTax: Number(row.ValueAddedTax) || 0,
          unitPrice: Number(row.UnitPrice) || 0
        }));

        const validData = parsedData.filter(row => {
          return (
            row.invoiceNumber &&
            row.date &&
            row.clientName &&
            row.importerName &&
            row.particularsOfGoods &&
            row.value > 0 &&
            row.fbrCode
          );
        });

        if (validData.length === 0) {
          console.error('No valid data found in CSV');
          return;
        }

        setTimeout(() => {
          setUploadComplete(true);
          setIsUploading(false);
          onFileUpload(validData);
        }, 500);
      },
      error: (error: any) => {
        console.error('Error parsing CSV:', error);
        setIsUploading(false);
        setUploadProgress(0);
      }
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-lg shadow-lg p-1"
    >
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all relative overflow-hidden
          ${isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-primary dark:border-gray-600 dark:hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {!isUploading && !uploadComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="text-xl font-medium text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop the CSV file here' : 'Upload your CSV file'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Drag and drop your file here or click to browse
                </p>
              </div>
            </motion.div>
          )}

          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Processing your file...
                </p>
                <div className="w-64 mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {uploadProgress}% complete
                </p>
              </div>
            </motion.div>
          )}

          {uploadComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                File uploaded successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};