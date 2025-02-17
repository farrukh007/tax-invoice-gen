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

interface Importer {
  id: string;
  serialNumber: string;
  businessName: string;
  name: string;
  cnic: string;
  ntn: string;
  address: string;
  phone: string;
}

export default function ImportersPage() {
  const [importers, setImporters] = useState<Importer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newImporter, setNewImporter] = useState<Partial<Importer>>({});
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
            'Business Name': 'businessName',
            'Name': 'name',
            'CNIC': 'cnic',
            'NTN': 'ntn',
            'Address': 'address',
            'Phone': 'phone'
          };
          return headerMap[header] || header;
        },
        complete: (results) => {
          const newImporters = results.data.map((row: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            serialNumber: row.serialNumber,
            businessName: row.businessName,
            name: row.name,
            cnic: row.cnic,
            ntn: row.ntn,
            address: row.address,
            phone: row.phone
          }));

          // Check for duplicates
          const uniqueImporters = newImporters.filter(newImporter => 
            !importers.some(existingImporter => 
              existingImporter.ntn === newImporter.ntn || 
              existingImporter.cnic === newImporter.cnic
            )
          );

          if (uniqueImporters.length !== newImporters.length) {
            toast({
              title: "Duplicate Entries Found",
              description: "Some importers were skipped due to duplicate NTN or CNIC numbers.",
              variant: "destructive"
            });
          }

          setImporters(prev => [...prev, ...uniqueImporters]);
        }
      });
    }
  };

  const handleAddImporter = () => {
    // Validate required fields
    if (!newImporter.businessName || !newImporter.name || !newImporter.ntn || !newImporter.cnic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates
    const isDuplicate = importers.some(importer => 
      importer.ntn === newImporter.ntn || 
      importer.cnic === newImporter.cnic
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Importer",
        description: "An importer with this NTN or CNIC already exists.",
        variant: "destructive"
      });
      return;
    }

    const importer: Importer = {
      id: Math.random().toString(36).substr(2, 9),
      serialNumber: (importers.length + 1).toString(),
      businessName: newImporter.businessName || '',
      name: newImporter.name || '',
      cnic: newImporter.cnic || '',
      ntn: newImporter.ntn || '',
      address: newImporter.address || '',
      phone: newImporter.phone || ''
    };

    setImporters(prev => [...prev, importer]);
    setNewImporter({});
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Importer added successfully.",
    });
  };

  const handleDeleteImporter = (id: string) => {
    setImporters(prev => prev.filter(importer => importer.id !== id));
    toast({
      title: "Success",
      description: "Importer deleted successfully.",
    });
  };

  const filteredImporters = importers.filter(importer => 
    Object.values(importer).some(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    { header: 'Ser#', accessorKey: 'serialNumber' },
    { header: 'Business Name', accessorKey: 'businessName' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'CNIC', accessorKey: 'cnic' },
    { header: 'NTN', accessorKey: 'ntn' },
    { header: 'Address', accessorKey: 'address' },
    { header: 'Phone', accessorKey: 'phone' },
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
            onClick={() => handleDeleteImporter(row.original.id)}
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
          <h1 className="text-3xl font-bold text-gray-900">Importers</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search importers..."
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
                    Add Importer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Importer</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={newImporter.businessName || ''}
                        onChange={(e) => setNewImporter(prev => ({ ...prev, businessName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newImporter.name || ''}
                        onChange={(e) => setNewImporter(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cnic">CNIC</Label>
                      <Input
                        id="cnic"
                        value={newImporter.cnic || ''}
                        onChange={(e) => setNewImporter(prev => ({ ...prev, cnic: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ntn">NTN</Label>
                      <Input
                        id="ntn"
                        value={newImporter.ntn || ''}
                        onChange={(e) => setNewImporter(prev => ({ ...prev, ntn: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newImporter.address || ''}
                        onChange={(e) => setNewImporter(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newImporter.phone || ''}
                        onChange={(e) => setNewImporter(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddImporter}>Add Importer</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={filteredImporters}
          />
        </Card>
      </motion.div>
    </div>
  );
}