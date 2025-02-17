"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Filter, Eye } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Report templates
const reportTemplates = [
  { id: 'detailed', name: 'Detailed Report', description: 'Comprehensive analysis with all metrics' },
  { id: 'summary', name: 'Summary Report', description: 'High-level overview of key metrics' },
  { id: 'client', name: 'Client Report', description: 'Client-focused analysis' },
  { id: 'importer', name: 'Importer Report', description: 'Importer-focused analysis' }
];

// Mock data
const invoiceData = [
  { month: 'Jan', count: 120, value: 450000 },
  { month: 'Feb', count: 150, value: 520000 },
  { month: 'Mar', count: 180, value: 600000 },
  { month: 'Apr', count: 210, value: 750000 },
  { month: 'May', count: 240, value: 820000 },
  { month: 'Jun', count: 270, value: 900000 },
];

const topImporters = [
  { name: 'Importer A', invoices: 450 },
  { name: 'Importer B', invoices: 380 },
  { name: 'Importer C', invoices: 320 },
];

const topClients = [
  { name: 'Client X', invoices: 520 },
  { name: 'Client Y', invoices: 420 },
  { name: 'Client Z', invoices: 380 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Custom axis components to avoid defaultProps warnings
const CustomXAxis = (props: any) => <XAxis {...props} allowDataOverflow={false} />;
const CustomYAxis = (props: any) => <YAxis {...props} allowDataOverflow={false} />;

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [selectedTemplate, setSelectedTemplate] = useState('detailed');
  const [selectedImporter, setSelectedImporter] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');

  const handleGenerateReport = () => {
    // Implementation for generating and downloading report
    console.log('Generating report with template:', selectedTemplate);
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
          <div className="flex items-center space-x-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {reportTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport}>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Importers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
              <p className="text-xs text-muted-foreground">
                +12 new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">
                +19 new this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Importers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topImporters}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <CustomXAxis dataKey="name" />
                    <CustomYAxis />
                    <Tooltip />
                    <Bar dataKey="invoices" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topClients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <CustomXAxis dataKey="name" />
                    <CustomYAxis />
                    <Tooltip />
                    <Bar dataKey="invoices" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={invoiceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis dataKey="month" />
                  <CustomYAxis yAxisId="left" />
                  <CustomYAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    name="Invoice Count"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    name="Invoice Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}