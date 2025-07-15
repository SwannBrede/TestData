import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ArrowUpDown } from 'lucide-react';

interface PurchaseOrder {
  poStatus: string;
  ageOfPO: number;
  daysPastDeliveryDate: number;
  poDate: string;
  nextDeliveryDate: string;
  poNumber: string;
  vendor: string;
  voNumber: string;
  type: string;
  item: string;
  pn: string;
  description: string;
  qtyOrdered: number;
  qtyBackOrdered: number;
  costEA: string;
  employee: string;
}

interface PurchaseOrdersUpdatedProps {
  data: PurchaseOrder[];
}

export function PurchaseOrdersUpdated({ data }: PurchaseOrdersUpdatedProps) {
  // Sorting state
  const [sortField, setSortField] = useState<keyof PurchaseOrder>('poDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // PO Status Toggle
  const [poStatusFilter, setPOStatusFilter] = useState<'OPEN' | 'CLOSED'>('OPEN');
  
  // Filter states
  const [searchPONumber, setSearchPONumber] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchVendor, setSearchVendor] = useState('');
  const [searchPN, setSearchPN] = useState('');
  const [agingFilter, setAgingFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get unique values for filters
  const agingOptions = ['all', 'on time', 'late'];

  // Filtering logic
  const filteredData = useMemo(() => {
    return data.filter(po => {
      // Main PO Status Filter
      if (poStatusFilter === 'OPEN' && po.poStatus !== 'Open') return false;
      if (poStatusFilter === 'CLOSED' && po.poStatus !== 'Closed') return false;
      
      if (searchPONumber && !po.poNumber.toLowerCase().includes(searchPONumber.toLowerCase())) return false;
      if (searchEmployee && !po.employee.toLowerCase().includes(searchEmployee.toLowerCase())) return false;
      if (searchVendor && !po.vendor.toLowerCase().includes(searchVendor.toLowerCase())) return false;
      if (searchPN && !po.pn.toLowerCase().includes(searchPN.toLowerCase())) return false;
      
      if (agingFilter !== 'all') {
        if (agingFilter === 'on time' && po.daysPastDeliveryDate > 0) return false;
        if (agingFilter === 'late' && po.daysPastDeliveryDate <= 0) return false;
      }
      
      if (startDate && po.poDate < startDate) return false;
      if (endDate && po.poDate > endDate) return false;
      
      return true;
    });
  }, [
    data, poStatusFilter, searchPONumber, searchEmployee, searchVendor, 
    searchPN, agingFilter, startDate, endDate
  ]);

  // Sorting logic
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredData, sortField, sortDirection]);

  const handleSort = (field: keyof PurchaseOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'PO Status', 'Age of PO', 'Days Past Delivery Date', 'PO Date', 'Next Delivery Date',
      'PO Number', 'Vendor', 'VO Number', 'Type', 'Item', 'PN', 'Description',
      'Qty Ordered', 'Qty Back Ordered', 'Cost EA', 'Employee'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedData.map(po => [
        po.poStatus,
        po.ageOfPO,
        po.daysPastDeliveryDate,
        po.poDate,
        po.nextDeliveryDate,
        po.poNumber,
        po.vendor,
        po.voNumber,
        po.type,
        po.item,
        po.pn,
        po.description,
        po.qtyOrdered,
        po.qtyBackOrdered,
        po.costEA,
        po.employee
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase_orders_${poStatusFilter.toLowerCase()}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Open': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAgingColor = (days: number) => {
    if (days <= 0) return 'text-green-600'; // On time
    if (days <= 7) return 'text-yellow-600'; // Slightly late
    return 'text-red-600'; // Late
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Purchase Orders</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Comprehensive purchase order management and tracking</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* OPEN PO / CLOSED PO Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPOStatusFilter('OPEN')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  poStatusFilter === 'OPEN'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                OPEN PO
              </button>
              <button
                onClick={() => setPOStatusFilter('CLOSED')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  poStatusFilter === 'CLOSED'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                CLOSED PO
              </button>
            </div>
            <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
        
        {/* Filter Controls - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">PO Number</label>
            <Input
              placeholder="All"
              value={searchPONumber}
              onChange={(e) => setSearchPONumber(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Aging</label>
            <Select value={agingFilter} onValueChange={setAgingFilter}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {agingOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option === 'all' ? 'All' : option === 'on time' ? 'On Time' : 'Late'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">PO Date</label>
            <div className="grid grid-cols-2 gap-1">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs"
                placeholder="01/05/2025"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs"
                placeholder="15/05/2025"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Employee</label>
            <Input
              placeholder="All"
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        {/* Filter Controls - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
            <Input
              placeholder="All"
              value={searchVendor}
              onChange={(e) => setSearchVendor(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Part Number</label>
            <Input
              placeholder="All"
              value={searchPN}
              onChange={(e) => setSearchPN(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="lg:col-span-3">
            {/* Empty space for alignment */}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
      {/* Scrollable Table Container */}
      <div className="overflow-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '2400px' }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '100px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('poStatus')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  PO Status <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '90px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('ageOfPO')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Age of PO <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '140px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('daysPastDeliveryDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Days Past Delivery Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '110px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('poDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  PO Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '140px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('nextDeliveryDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Next Delivery Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('poNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  PO Number <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '160px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('vendor')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Vendor <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('voNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  VO Number <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '90px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('type')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Type <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '100px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('item')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Item <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '100px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('pn')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  PN <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '200px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('description')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Description <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '110px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('qtyOrdered')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Qty Ordered <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '130px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('qtyBackOrdered')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Qty Back Ordered <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '100px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('costEA')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Cost EA <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleSort('employee')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Employee <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((po, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(po.poStatus)}`}>
                    {po.poStatus}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.ageOfPO}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm">
                  <span className={getAgingColor(po.daysPastDeliveryDate)}>
                    {po.daysPastDeliveryDate}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.poDate}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.nextDeliveryDate}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                  {po.poNumber}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.vendor}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.voNumber}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.type}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.item}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-mono text-gray-900">
                  {po.pn}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.description}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.qtyOrdered}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.qtyBackOrdered}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.costEA}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {po.employee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Showing x of x - Bottom */}
      <div className="p-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-600">
          Showing {sortedData.length} of {data.filter(po => poStatusFilter === 'OPEN' ? po.poStatus === 'Open' : po.poStatus === 'Closed').length} {poStatusFilter.toLowerCase()} purchase orders
        </p>
      </div>
      </CardContent>
    </Card>
  );
}