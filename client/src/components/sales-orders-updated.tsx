import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, Calendar } from "lucide-react";

interface SalesOrderUpdated {
  soStatus: 'Open' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'On Hold';
  soDate: string;
  soNbr: string;
  customer: string;
  custRef: string;
  employee: string;
  type: string;
  pn: string;
  pnDescription: string;
  qty: number;
  condition: string;
  sl: string;
  qtyOrd: number;
  qtyInv: number;
  price: string;
  soTotal: string;
  soTyl: string;
  invoiceStatus: 'NOT INVOICED' | 'PARTIAL' | 'INVOICED' | 'PAID';
  invoiceNbr: string;
  postDate: string;
  consignment: string;
  mfgCode: string;
  country: string;
  poNbr: string;
  poVendor: string;
  poStatus: string;
  poCost: string;
}

interface SalesOrdersUpdatedProps {
  data: SalesOrderUpdated[];
}

export function SalesOrdersUpdated({ data }: SalesOrdersUpdatedProps) {
  // Filters
  const [searchSO, setSearchSO] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchPN, setSearchPN] = useState('');
  const [searchConsignment, setSearchConsignment] = useState('');
  const [soStatusFilter, setSoStatusFilter] = useState('all');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Sorting
  const [sortField, setSortField] = useState<keyof SalesOrderUpdated>('soDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const soStatuses = ['all', 'Open', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'On Hold'];
  const invoiceStatuses = ['all', 'NOT INVOICED', 'PARTIAL', 'INVOICED', 'PAID'];

  const handleSort = (field: keyof SalesOrderUpdated) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusColor = (status: string, type: 'so' | 'invoice' | 'po') => {
    if (type === 'so') {
      switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-800';
        case 'Confirmed': return 'bg-green-100 text-green-800';
        case 'Shipped': return 'bg-purple-100 text-purple-800';
        case 'Delivered': return 'bg-emerald-100 text-emerald-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'On Hold': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'invoice') {
      switch (status) {
        case 'NOT INVOICED': return 'bg-gray-100 text-gray-800';
        case 'PARTIAL': return 'bg-yellow-100 text-yellow-800';
        case 'INVOICED': return 'bg-blue-100 text-blue-800';
        case 'PAID': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-800';
        case 'Closed': return 'bg-green-100 text-green-800';
        case 'Hold': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  // Filter data
  const filteredData = data.filter(order => {
    const matchesSO = order.soNbr.toLowerCase().includes(searchSO.toLowerCase());
    const matchesCustomer = order.customer.toLowerCase().includes(searchCustomer.toLowerCase());
    const matchesEmployee = order.employee.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesPN = order.pn.toLowerCase().includes(searchPN.toLowerCase()) || 
                     order.pnDescription.toLowerCase().includes(searchPN.toLowerCase());
    const matchesConsignment = order.consignment.toLowerCase().includes(searchConsignment.toLowerCase());
    const matchesSOStatus = soStatusFilter === 'all' || order.soStatus === soStatusFilter;
    const matchesInvoiceStatus = invoiceStatusFilter === 'all' || order.invoiceStatus === invoiceStatusFilter;
    
    let matchesDateRange = true;
    if (startDate && endDate) {
      const orderDate = new Date(order.soDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesDateRange = orderDate >= start && orderDate <= end;
    }

    return matchesSO && matchesCustomer && matchesEmployee && matchesPN && 
           matchesConsignment && matchesSOStatus && matchesInvoiceStatus && matchesDateRange;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string' && aValue.includes('$')) {
      aValue = parseFloat(aValue.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[$,]/g, ''));
    }

    if (sortField === 'soDate' || sortField === 'postDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const exportToCSV = () => {
    const headers = [
      'SO Status', 'SO Date', 'SO Number', 'Customer', 'Cust Ref', 'Employee', 'Type',
      'PN', 'PN Description', 'Qty', 'Condition', 'SL', 'Qty Ord', 'Qty Inv', 'Price', 'SO Total',
      'SO TYL', 'Invoice Status', 'Invoice Number', 'Post Date', 'Consignment', 'MFG Code',
      'Country', 'PO Number', 'PO Vendor', 'PO Status', 'PO Cost'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedData.map(order => [
        order.soStatus, order.soDate, order.soNbr, order.customer, order.custRef, order.employee,
        order.type, order.pn, order.pnDescription, order.qty, order.condition, order.sl,
        order.qtyOrd, order.qtyInv, order.price, order.soTotal, order.soTyl, order.invoiceStatus,
        order.invoiceNbr, order.postDate, order.consignment, order.mfgCode, order.country,
        order.poNbr, order.poVendor, order.poStatus, order.poCost
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sales Orders</h3>
            <p className="text-sm text-gray-600 mt-1">Comprehensive sales order management and tracking</p>
          </div>
          <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
        
        {/* Filter Controls - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Employee</label>
            <Input
              placeholder="All"
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">SO Status</label>
            <Select value={soStatusFilter} onValueChange={setSoStatusFilter}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Multiple values" />
              </SelectTrigger>
              <SelectContent>
                {soStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">SO Date</label>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">SO Nbr</label>
            <Input
              placeholder="All"
              value={searchSO}
              onChange={(e) => setSearchSO(e.target.value)}
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
            <label className="block text-xs font-medium text-gray-700 mb-1">PN</label>
            <Input
              placeholder="All"
              value={searchPN}
              onChange={(e) => setSearchPN(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Invoice Status</label>
            <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {invoiceStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All' : status}
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
          <div className="hidden lg:block">
            {/* Empty spacer to maintain alignment */}
          </div>
        </div>
      </div>
      
      {/* Scrollable Table Container */}
      <div className="overflow-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('soStatus')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  SO Status <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('soDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  SO Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('soNbr')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  SO Nbr <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('customer')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Customer <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cust. Ref
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('employee')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Employee <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('pn')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  PN <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PN Description
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('qty')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Qty <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SL
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty Ord
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty Inv.
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('price')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Price <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('soTotal')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  SO Total <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SO TYL
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('invoiceStatus')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Invoice Status <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Nbr
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('postDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Post Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => handleSort('consignment')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Consignment <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MFG Code
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO Nbr
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO Vendor
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO Status
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.soStatus, 'so')}`}>
                    {order.soStatus}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{order.soDate}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.soNbr}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.custRef}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{order.employee}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.type}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.pn}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">{order.pnDescription}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{order.qty}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.condition}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.sl}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{order.qtyOrd}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{order.qtyInv}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{order.price}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{order.soTotal}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.soTyl}</td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.invoiceStatus, 'invoice')}`}>
                    {order.invoiceStatus}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{order.invoiceNbr}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.postDate}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{order.consignment}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.mfgCode}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.country}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{order.poNbr}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{order.poVendor}</td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.poStatus, 'po')}`}>
                    {order.poStatus}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{order.poCost}</td>
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