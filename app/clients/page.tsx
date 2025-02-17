"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '../components/DataTable';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Search, Upload, UserPlus, Edit, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from "@/components/ui/use-toast";

interface Client {
  id: string;
  serialNumber: string;
  ntn: string;
  strn: string;
  cnic: string;
  customerName: string;
  businessName: string;
  address: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState<Partial<Client>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Map CSV headers to our field names
          const headerMap: { [key: string]: string } = {
            'Ser#': 'serialNumber',
            'NTN': 'ntn',
            'STRN': 'strn',
            'CNIC': 'cnic',
            'Customer Name': 'customerName',
            'Business Name': 'businessName',
            'Address': 'address'
          };
          return headerMap[header] || header;
        },
        complete: (results) => {
          const newClients = results.data.map((row: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            serialNumber: row.serialNumber,
            ntn: row.ntn,
            strn: row.strn,
            cnic: row.cnic,
            customerName: row.customerName,
            businessName: row.businessName,
            address: row.address
          }));

          // Check for duplicates
          const uniqueClients = newClients.filter(newClient => 
            !clients.some(existingClient => 
              existingClient.ntn === newClient.ntn || 
              existingClient.cnic === newClient.cnic
            )
          );

          if (uniqueClients.length !== newClients.length) {
            toast({
              title: "Duplicate Entries Found",
              description: "Some clients were skipped due to duplicate NTN or CNIC numbers.",
              variant: "destructive"
            });
          }

          setClients(prev => [...prev, ...uniqueClients]);
        }
      });
    }
  };

  const handleAddClient = () => {
    // Validate required fields
    if (!newClient.businessName || !newClient.customerName || !newClient.ntn || !newClient.cnic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates
    const isDuplicate = clients.some(client => 
      client.ntn === newClient.ntn || 
      client.cnic === newClient.cnic
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Client",
        description: "A client with this NTN or CNIC already exists.",
        variant: "destructive"
      });
      return;
    }

    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      serialNumber: (clients.length + 1).toString(),
      ntn: newClient.ntn || '',
      strn: newClient.strn || '',
      cnic: newClient.cnic || '',
      customerName: newClient.customerName || '',
      businessName: newClient.businessName || '',
      address: newClient.address || ''
    };

    setClients(prev => [...prev, client]);
    setNewClient({});
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Client added successfully.",
    });
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    toast({
      title: "Success",
      description: "Client deleted successfully.",
    });
  };

  const filteredClients = clients.filter(client => 
    Object.values(client).some(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    { header: 'Ser#', accessorKey: 'serialNumber' },
    { header: 'NTN', accessorKey: 'ntn' },
    { header: 'STRN', accessorKey: 'strn' },
    { header: 'CNIC', accessorKey: 'cnic' },
    { header: 'Customer Name', accessorKey: 'customerName' },
    { header: 'Business Name', accessorKey: 'businessName' },
    { header: 'Address', accessorKey: 'address' },
    {
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => console.log('Edit', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDeleteClient(row.original.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="relative">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ntn">NTN</Label>
                      <Input
                        id="ntn"
                        value={newClient.ntn || ''}
                        onChange={(e) => setNewClient(prev => ({ ...prev, ntn: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="strn">STRN</Label>
                      <Input
                        id="strn"
                        value={newClient.strn || ''}
                        onChange={(e) => setNewClient(prev => ({ ...prev, strn: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cnic">CNIC</Label>
                      <Input
                        id="cnic"
                        value={newClient.cnic || ''}
                        onChange={(e) => setNewClient(prev => ({ ...prev, cnic: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={newClient.customerName || ''}
                        onChange={(e) => setNewClient(prev => ({ ...prev, customerName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={newClient.businessName || ''}
                        onChange={(e) => setNewClient(prev => ({ ...prev, businessName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newClient.address || ''}
                        onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddClient}>Add Client</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={filteredClients}
          />
        </Card>
      </motion.div>
    </div>
  );
}