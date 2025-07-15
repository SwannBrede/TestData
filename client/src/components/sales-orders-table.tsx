import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Filter, Download, Calendar } from "lucide-react";

interface SalesOrder {
  soNumber: string;
  date: string;
  customer: string;
  salesperson: string;
  partNumber: string;
  quantity: number;
  unitPrice: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  grossMargin: string;
  totalValue: string;
}

interface SalesOrdersTableProps {
  data: SalesOrder[];
}

export function SalesOrdersTable({ data }: SalesOrdersTableProps) {
  const [sortField, setSortField] = useState<keyof SalesOrder>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (field: keyof SalesOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = data.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (customerFilter !== 'all' && order.customer !== customerFilter) return false;
    if (salespersonFilter !== 'all' && order.salesperson !== salespersonFilter) return false;
    if (searchTerm && !order.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.soNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string' && aValue.includes('$')) {
      aValue = parseFloat(aValue.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[$,]/g, ''));
    } else if (typeof aValue === 'string' && aValue.includes('%')) {
      aValue = parseFloat(aValue.replace('%', ''));
      bValue = parseFloat(bValue.replace('%', ''));
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['SO Number', 'Date', 'Customer', 'Salesperson', 'Part Number', 'Quantity', 'Unit Price', 'Status', 'Gross Margin %', 'Total Value'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(order => [
        order.soNumber,
        order.date,
        order.customer,
        order.salesperson,
        order.partNumber,
        order.quantity,
        order.unitPrice,
        order.status,
        order.grossMargin,
        order.totalValue
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueCustomers = ['all', ...Array.from(new Set(data.map(o => o.customer)))];
  const uniqueSalespeople = ['all', ...Array.from(new Set(data.map(o => o.salesperson)))];
  const statuses = ['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales Orders</h3>
            <p className="text-sm text-gray-600 mt-1">Manage and track sales order pipeline</p>
          </div>
          <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center space-x-4 space-y-2">
          <Input
            placeholder="Search SO# or Part Number"
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
                <Button variant="ghost" size="sm" onClick={() => handleSort('soNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  SO Number <ArrowUpDown className="ml-1 w-3 h-3" />
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
                <Button variant="ghost" size="sm" onClick={() => handleSort('unitPrice')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Unit Price <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('grossMargin')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Margin % <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('totalValue')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Total Value <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.soNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {order.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {order.salesperson}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.partNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {order.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {order.unitPrice}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {order.grossMargin}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {order.totalValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {sortedData.length} of {data.length} sales orders
        </p>
      </div>
    </div>
  );
}