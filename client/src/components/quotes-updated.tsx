import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ArrowUpDown } from 'lucide-react';

interface Quote {
  quoteDate: string;
  quoteNbr: string;
  customer: string;
  employee: string;
  item: string;
  partNumber: string;
  partDesc: string;
  businessType: string;
  type: string;
  cond: string;
  stockLine: string;
  qtyReq: number;
  status: string;
  qtyQuoted: number;
  amountQuoted: string;
  quoteTotal: string;
  soNumber: string;
  consignment: string;
  mfgCode: string;
}

interface QuotesUpdatedProps {
  data: Quote[];
}

export function QuotesUpdated({ data }: QuotesUpdatedProps) {
  // Sorting state
  const [sortField, setSortField] = useState<keyof Quote>('quoteDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter states
  const [searchCQNumber, setSearchCQNumber] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchPartNumber, setSearchPartNumber] = useState('');
  const [searchConsignment, setSearchConsignment] = useState('');
  const [searchMfgCode, setSearchMfgCode] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get unique values for filters
  const statuses = ['all', ...Array.from(new Set(data.map(quote => quote.status)))];
  const businessTypes = ['all', ...Array.from(new Set(data.map(quote => quote.businessType)))];

  // Filtering logic
  const filteredData = useMemo(() => {
    return data.filter(quote => {
      if (searchCQNumber && !quote.quoteNbr.toLowerCase().includes(searchCQNumber.toLowerCase())) return false;
      if (searchCustomer && !quote.customer.toLowerCase().includes(searchCustomer.toLowerCase())) return false;
      if (searchEmployee && !quote.employee.toLowerCase().includes(searchEmployee.toLowerCase())) return false;
      if (searchPartNumber && !quote.partNumber.toLowerCase().includes(searchPartNumber.toLowerCase())) return false;
      if (searchConsignment && !quote.consignment.toLowerCase().includes(searchConsignment.toLowerCase())) return false;
      if (searchMfgCode && !quote.mfgCode.toLowerCase().includes(searchMfgCode.toLowerCase())) return false;
      if (statusFilter !== 'all' && quote.status !== statusFilter) return false;
      if (businessTypeFilter !== 'all' && quote.businessType !== businessTypeFilter) return false;
      
      if (startDate && quote.quoteDate < startDate) return false;
      if (endDate && quote.quoteDate > endDate) return false;
      
      return true;
    });
  }, [
    data, searchCQNumber, searchCustomer, searchEmployee, searchPartNumber, 
    searchConsignment, searchMfgCode, statusFilter, businessTypeFilter, startDate, endDate
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

  const handleSort = (field: keyof Quote) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Quote Date', 'CQ #', 'Customer', 'Employee', 'Item', 'Part Number', 'Part Desc',
      'Business Type', 'Type', 'Cond', 'Stock Line', 'Qty Req', 'Status', 'Qty Quoted',
      'Amount Quoted', 'Quote Total $', 'SO Number', 'Consignment', 'MFG Code'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedData.map(quote => [
        quote.quoteDate,
        quote.quoteNbr,
        quote.customer,
        quote.employee,
        quote.item,
        quote.partNumber,
        quote.partDesc,
        quote.businessType,
        quote.type,
        quote.cond,
        quote.stockLine,
        quote.qtyReq,
        quote.status,
        quote.qtyQuoted,
        quote.amountQuoted,
        quote.quoteTotal,
        quote.soNumber,
        quote.consignment,
        quote.mfgCode
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Open': 'bg-blue-100 text-blue-800',
      'Converted': 'bg-green-100 text-green-800',
      'Expired': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-gray-100 text-gray-800',
      'Won': 'bg-green-100 text-green-800',
      'Lost': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Quotes</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Comprehensive quote management and tracking</p>
          </div>
          <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
        
        {/* Filter Controls - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">CQ Number</label>
            <Input
              placeholder="All"
              value={searchCQNumber}
              onChange={(e) => setSearchCQNumber(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Quote Date</label>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
            <Input
              placeholder="All"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Part Number</label>
            <Input
              placeholder="All"
              value={searchPartNumber}
              onChange={(e) => setSearchPartNumber(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Business Type</label>
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Consignment</label>
            <Input
              placeholder="All"
              value={searchConsignment}
              onChange={(e) => setSearchConsignment(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">MFG Code</label>
            <Input
              placeholder="All"
              value={searchMfgCode}
              onChange={(e) => setSearchMfgCode(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
      {/* Scrollable Table Container */}
      <div className="overflow-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('quoteDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Quote Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('quoteNbr')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Quote # <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('customer')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Customer <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('employee')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Employee <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('item')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Item <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('partNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Part Number <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('partDesc')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Part Desc <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('businessType')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Business Type <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('type')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Type <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('cond')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Cond <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('stockLine')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Stock Line <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('qtyReq')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Qty Req <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Status <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('qtyQuoted')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Qty Quoted <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('amountQuoted')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Amount Quoted <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('quoteTotal')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Quote Total $ <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('soNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  SO Number <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('consignment')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Consignment <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('mfgCode')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  MFG Code <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((quote, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.quoteDate}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                  {quote.quoteNbr}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.customer}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.employee}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.item}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-mono text-gray-900">
                  {quote.partNumber}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.partDesc}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.businessType}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.type}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.cond}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.stockLine}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.qtyReq}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.qtyQuoted}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.amountQuoted}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                  {quote.quoteTotal}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.soNumber}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.consignment}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                  {quote.mfgCode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Showing x of x - Bottom */}
      <div className="p-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-600">
          Showing {sortedData.length} of {data.length} quotes
        </p>
      </div>
      </CardContent>
    </Card>
  );
}