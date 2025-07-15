import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Download, DollarSign, Calendar, Filter } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface AccountReceivable {
  arCtrlNumber: string;
  customer: string;
  companyCode: string;
  description: string;
  consignmentCode: string;
  entryDate: string;
  finalDate: string;
  dueDate: string;
  aging: number;
  lastPayDate: string | null;
  invoiceAmount: string;
  balance: string;
  status: 'Open' | 'Paid' | 'Overdue' | 'Partial';
}

interface ReceivablesTrend {
  month: string;
  amount: number;
  formattedAmount: string;
}

interface ReceivablesKPIs {
  totalReceivablesAmount: string;
  totalReceivablesBalance: string;
  trendData: ReceivablesTrend[];
}

interface AccountReceivablesProps {
  receivables: AccountReceivable[];
  kpis: ReceivablesKPIs;
}

export function AccountReceivables({ receivables, kpis }: AccountReceivablesProps) {
  const [sortField, setSortField] = useState<keyof AccountReceivable>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [invoiceDateFromFilter, setInvoiceDateFromFilter] = useState<string>('');
  const [invoiceDateToFilter, setInvoiceDateToFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [latePaymentsFilter, setLatePaymentsFilter] = useState<string>('all');
  const [arCtrlNbrFilter, setArCtrlNbrFilter] = useState<string>('');
  const [customerFilter, setCustomerFilter] = useState<string>('');
  const [consignmentFilter, setConsignmentFilter] = useState<string>('');

  const handleSort = (field: keyof AccountReceivable) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = receivables.filter(receivable => {
    if (invoiceDateFromFilter && receivable.entryDate < invoiceDateFromFilter) return false;
    if (invoiceDateToFilter && receivable.entryDate > invoiceDateToFilter) return false;
    if (statusFilter !== 'all' && receivable.status !== statusFilter) return false;
    if (latePaymentsFilter !== 'all') {
      if (latePaymentsFilter === 'overdue' && receivable.status !== 'Overdue') return false;
      if (latePaymentsFilter === 'late' && receivable.aging < 30) return false;
    }
    if (arCtrlNbrFilter && !receivable.arCtrlNumber.toLowerCase().includes(arCtrlNbrFilter.toLowerCase())) return false;
    if (customerFilter && !receivable.customer.toLowerCase().includes(customerFilter.toLowerCase())) return false;
    if (consignmentFilter && !receivable.consignmentCode.toLowerCase().includes(consignmentFilter.toLowerCase())) return false;
    return true;
  });

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredData, sortField, sortDirection]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['AR Ctrl Nbr', 'Customer', 'Company Code', 'Description', 'Consignment Code', 'Entry Date', 'Final Date', 'Due Date', 'Aging', 'Last Pay Date', 'Invoice Amount', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(receivable => [
        receivable.arCtrlNumber,
        receivable.customer,
        receivable.companyCode,
        receivable.description,
        receivable.consignmentCode,
        receivable.entryDate,
        receivable.finalDate,
        receivable.dueDate,
        receivable.aging,
        receivable.lastPayDate || '',
        receivable.invoiceAmount,
        receivable.balance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'account-receivables.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueStatuses = ['all', ...Array.from(new Set(receivables.map(r => r.status)))];

  return (
    <div className="space-y-6">
      {/* Top Section - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPI Cards Column */}
        <div className="flex flex-col space-y-4 h-full">
          {/* KPI Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receivables Amount</p>
                <p className="text-xl font-bold text-gray-900">{kpis.totalReceivablesAmount}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* KPI Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receivables Balance</p>
                <p className="text-xl font-bold text-gray-900">{kpis.totalReceivablesBalance}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Sparkline Chart - Extended Width */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Receivables Trend</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalReceivablesBalance}</p>
            </div>
            <span className="text-sm text-green-600 font-medium">+7.8%</span>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={kpis.trendData}>
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">7-month trend</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-purple-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-900">Filters</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date From</label>
            <Input
              type="date"
              value={invoiceDateFromFilter}
              onChange={(e) => setInvoiceDateFromFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date To</label>
            <Input
              type="date"
              value={invoiceDateToFilter}
              onChange={(e) => setInvoiceDateToFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Late Payments</label>
            <Select value={latePaymentsFilter} onValueChange={setLatePaymentsFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="late">Late (30+ days)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AR Ctrl Number</label>
            <Input
              type="text"
              value={arCtrlNbrFilter}
              onChange={(e) => setArCtrlNbrFilter(e.target.value)}
              placeholder="Search AR Ctrl Number..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <Input
              type="text"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              placeholder="Search customer..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consignment</label>
            <Input
              type="text"
              value={consignmentFilter}
              onChange={(e) => setConsignmentFilter(e.target.value)}
              placeholder="Search consignment..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section - Full Width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Account Receivables</h2>
              <p className="text-sm text-gray-600 mt-1">Showing {sortedData.length} of {receivables.length} receivables</p>
            </div>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('arCtrlNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    AR Ctrl Nbr <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('customer')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Customer <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('companyCode')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Company Code <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('description')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Description <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('consignmentCode')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Consignment Code <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('entryDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Entry Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('finalDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Final Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('dueDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Due Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('aging')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Aging <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('lastPayDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Last Pay Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('invoiceAmount')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Invoice Amount <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('balance')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Balance <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((receivable, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {receivable.arCtrlNumber}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.customer}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.companyCode}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.description}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.consignmentCode}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.entryDate}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.finalDate}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.dueDate}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.aging}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {receivable.lastPayDate || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {receivable.invoiceAmount}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {receivable.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}