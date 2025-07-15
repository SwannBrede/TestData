import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Filter, Download, ExternalLink } from "lucide-react";

interface Quote {
  quoteNumber: string;
  date: string;
  customer: string;
  salesperson: string;
  partNumber: string;
  quantity: number;
  quotedPrice: string;
  status: 'Open' | 'Expired' | 'Converted';
  linkedSO: string | null;
}

interface QuotesTableProps {
  data: Quote[];
}

export function QuotesTable({ data }: QuotesTableProps) {
  const [sortField, setSortField] = useState<keyof Quote>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (field: keyof Quote) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = data.filter(quote => {
    if (statusFilter !== 'all' && quote.status !== statusFilter) return false;
    if (customerFilter !== 'all' && quote.customer !== customerFilter) return false;
    if (salespersonFilter !== 'all' && quote.salesperson !== salespersonFilter) return false;
    if (searchTerm && !quote.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string' && aValue.includes('$')) {
      aValue = parseFloat(aValue.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[$,]/g, ''));
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Converted': return 'bg-blue-100 text-blue-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['Quote Number', 'Date', 'Customer', 'Salesperson', 'Part Number', 'Quantity', 'Quoted Price', 'Status', 'Linked SO'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(quote => [
        quote.quoteNumber,
        quote.date,
        quote.customer,
        quote.salesperson,
        quote.partNumber,
        quote.quantity,
        quote.quotedPrice,
        quote.status,
        quote.linkedSO || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueCustomers = ['all', ...Array.from(new Set(data.map(q => q.customer)))];
  const uniqueSalespeople = ['all', ...Array.from(new Set(data.map(q => q.salesperson)))];
  const statuses = ['all', 'Open', 'Expired', 'Converted'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quotes</h3>
            <p className="text-sm text-gray-600 mt-1">Track quotes and conversion pipeline</p>
          </div>
          <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center space-x-4 space-y-2">
          <Input
            placeholder="Search Quote# or Part Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-56"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Customer" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCustomers.map(customer => (
                <SelectItem key={customer} value={customer}>
                  {customer === 'all' ? 'All Customers' : customer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={salespersonFilter} onValueChange={setSalespersonFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Salesperson" />
            </SelectTrigger>
            <SelectContent>
              {uniqueSalespeople.map(person => (
                <SelectItem key={person} value={person}>
                  {person === 'all' ? 'All Salespeople' : person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('quoteNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Quote Number <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('customer')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Customer <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('salesperson')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Salesperson <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('partNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Part Number <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('quantity')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Quantity <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('quotedPrice')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Quoted Price <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Linked SO
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((quote, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {quote.quoteNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {quote.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {quote.customer}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {quote.salesperson}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {quote.partNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {quote.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {quote.quotedPrice}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {quote.linkedSO ? (
                    <div className="flex items-center justify-center">
                      <span className="text-sm bg-purple-600 font-medium">{quote.linkedSO}</span>
                      <ExternalLink className="w-3 h-3 ml-1 bg-purple-600" />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {sortedData.length} of {data.length} quotes
        </p>
      </div>
    </div>
  );
}