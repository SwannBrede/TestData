import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Filter, Download, ExternalLink } from "lucide-react";

interface PurchaseOrder {
  poNumber: string;
  date: string;
  vendor: string;
  partNumber: string;
  quantity: number;
  unitCost: string;
  totalCost: string;
  status: 'Pending' | 'Confirmed' | 'Received' | 'Cancelled';
  linkedRef: string | null;
  refType: 'SO' | 'Quote' | null;
}

interface PurchaseOrdersTableProps {
  data: PurchaseOrder[];
}

export function PurchaseOrdersTable({ data }: PurchaseOrdersTableProps) {
  const [sortField, setSortField] = useState<keyof PurchaseOrder>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (field: keyof PurchaseOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = data.filter(po => {
    if (statusFilter !== 'all' && po.status !== statusFilter) return false;
    if (vendorFilter !== 'all' && po.vendor !== vendorFilter) return false;
    if (searchTerm && !po.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !po.poNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Received': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['PO Number', 'Date', 'Vendor', 'Part Number', 'Quantity', 'Unit Cost', 'Total Cost', 'Status', 'Linked Reference'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(po => [
        po.poNumber,
        po.date,
        po.vendor,
        po.partNumber,
        po.quantity,
        po.unitCost,
        po.totalCost,
        po.status,
        po.linkedRef || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueVendors = ['all', ...Array.from(new Set(data.map(po => po.vendor)))];
  const statuses = ['all', 'Pending', 'Confirmed', 'Received', 'Cancelled'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Purchase Orders</h3>
            <p className="text-sm text-gray-600 mt-1">Track vendor purchase orders and procurement</p>
          </div>
          <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center space-x-4 space-y-2">
          <Input
            placeholder="Search PO# or Part Number"
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
          <Select value={vendorFilter} onValueChange={setVendorFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              {uniqueVendors.map(vendor => (
                <SelectItem key={vendor} value={vendor}>
                  {vendor === 'all' ? 'All Vendors' : vendor}
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
                <Button variant="ghost" size="sm" onClick={() => handleSort('poNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  PO Number <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('vendor')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Vendor <ArrowUpDown className="ml-1 w-3 h-3" />
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
                <Button variant="ghost" size="sm" onClick={() => handleSort('unitCost')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Unit Cost <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('totalCost')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Total Cost <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Linked Ref
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((po, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {po.poNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {po.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {po.vendor}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {po.partNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {po.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {po.unitCost}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {po.totalCost}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(po.status)}`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {po.linkedRef ? (
                    <div className="flex items-center justify-center">
                      <span className="text-sm bg-purple-600 font-medium">{po.linkedRef}</span>
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
          Showing {sortedData.length} of {data.length} purchase orders
        </p>
      </div>
    </div>
  );
}