import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13' | 'ITF' | 'pharmacode';

export const getBarcodeFormat = (importerNTN: string): BarcodeFormat => {
  if (importerNTN.length <= 8) {
    return 'CODE39';
  } else if (importerNTN.length === 13) {
    return 'EAN13';
  } else if (importerNTN.startsWith('ITF')) {
    return 'ITF';
  } else if (importerNTN.startsWith('PH')) {
    return 'pharmacode';
  }
  return 'CODE128';
};

export const generateBarcode = (element: SVGSVGElement, data: string, importerNTN: string) => {
  const format = getBarcodeFormat(importerNTN);
  
  const options = {
    format,
    width: 2,
    height: 50,
    displayValue: true,
    fontSize: 12,
    margin: 10,
    background: 'transparent',
    lineColor: '#000000'
  };

  if (format === 'pharmacode') {
    options.height = 40;
    options.width = 3;
  } else if (format === 'ITF') {
    options.width = 1.5;
  }

  try {
    JsBarcode(element, data, options);
  } catch (error) {
    console.error('Error generating barcode:', error);
    // Fallback to CODE128 if the selected format fails
    JsBarcode(element, data, {
      ...options,
      format: 'CODE128'
    });
  }
};

export const generateQRCode = async (
  element: HTMLCanvasElement,
  data: {
    invoice: string;
    importer: string;
    fbr: string;
    [key: string]: string;
  }
) => {
  const qrData = JSON.stringify(data);
  
  try {
    await QRCode.toCanvas(element, qrData, {
      width: 100,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};