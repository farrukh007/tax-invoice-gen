"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { sendWhatsAppMessage, sendEmail } from '@/lib/messaging';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SendInvoiceDialogProps {
  invoice: InvoiceData;
  pdfBlob?: Blob;
  type: 'whatsapp' | 'email';
}

export const SendInvoiceDialog: React.FC<SendInvoiceDialogProps> = ({ invoice, pdfBlob, type }) => {
  const [contact, setContact] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!contact) {
      setError('Please enter a valid contact');
      return;
    }

    if (!pdfBlob) {
      setError('Please generate the PDF first');
      return;
    }

    try {
      if (type === 'whatsapp') {
        // Remove any non-numeric characters and ensure proper format
        const formattedPhone = contact.replace(/\D/g, '');
        await sendWhatsAppMessage(formattedPhone, invoice, pdfBlob);
      } else {
        await sendEmail(contact, invoice, pdfBlob);
      }

      setIsOpen(false);
      setContact('');
      setError(null);
    } catch (err) {
      setError('Failed to send invoice. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2"
          disabled={!pdfBlob}
        >
          {type === 'email' ? (
            <>
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send WhatsApp</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Send Invoice via {type === 'email' ? 'Email' : 'WhatsApp'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="contact">
              {type === 'email' ? 'Email Address' : 'Phone Number'}
            </Label>
            <Input
              id="contact"
              type={type === 'email' ? 'email' : 'tel'}
              placeholder={type === 'email' ? 'client@example.com' : '+92 XXX XXXXXXX'}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          {!pdfBlob && (
            <p className="text-sm text-muted-foreground">
              Please generate the PDF first by clicking the "Generate All PDFs" button.
            </p>
          )}
          <Button 
            onClick={handleSend} 
            className="w-full"
            disabled={!pdfBlob}
          >
            Send Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};