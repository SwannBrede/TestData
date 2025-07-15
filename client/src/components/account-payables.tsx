import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Download, DollarSign, Calendar, Filter } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface AccountPayable {
  apCtrlNumber: string;
  vendInvDate: string;
  vendInvNbr: string;
  company: string;
  companyCode: string;
  poNbr: string | null;
  roNbr: string | null;
  consignment: string;
  entryDate: string;
  lastPayDate: string | null;
  dueDate: string;
  aging: number;
  currency: string;
  amount: string;
  balance: string;
  terms: string;
  status: 'Open' | 'Paid' | 'Overdue' | 'Processing' | 'Partial';
}

interface PayablesTrend {
  month: string;
  amount: number;
  formattedAmount: string;
}

interface PayablesKPIs {
  totalPayablesAmount: string;
  totalPayablesBalance: string;
  trendData: PayablesTrend[];
}

interface AccountPayablesProps {
  payables: AccountPayable[];
  kpis: PayablesKPIs;
}

export function AccountPayables({ payables, kpis }: AccountPayablesProps) {
  const [sortField, setSortField] = useState<keyof AccountPayable>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [entryDateFromFilter, setEntryDateFromFilter] = useState<string>('');
  const [entryDateToFilter, setEntryDateToFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [latePaymentsFilter, setLatePaymentsFilter] = useState<string>('all');
  const [apCtrlNbrFilter, setApCtrlNbrFilter] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [consignmentFilter, setConsignmentFilter] = useState<string>('');

  const handleSort = (field: keyof AccountPayable) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = payables.filter(payable => {
    if (entryDateFromFilter && payable.entryDate < entryDateFromFilter) return false;
    if (entryDateToFilter && payable.entryDate > entryDateToFilter) return false;
    if (statusFilter !== 'all' && payable.status !== statusFilter) return false;
    if (latePaymentsFilter !== 'all') {
      if (latePaymentsFilter === 'overdue' && payable.status !== 'Overdue') return false;
      if (latePaymentsFilter === 'late' && payable.aging < 30) return false;
    }
    if (apCtrlNbrFilter && !payable.apCtrlNumber.toLowerCase().includes(apCtrlNbrFilter.toLowerCase())) return false;
    if (companyFilter && !payable.company.toLowerCase().includes(companyFilter.toLowerCase())) return false;
    if (consignmentFilter && !payable.consignment.toLowerCase().includes(consignmentFilter.toLowerCase())) return false;
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
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Partial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['AP Ctrl Number', 'Vend Inv Date', 'Vend Inv Nbr', 'Company', 'Company Code', 'PO Nbr', 'RO Nbr', 'Consignment', 'Entry Date', 'Last Pay Date', 'Due Date', 'Aging', 'Currency', 'Amount', 'Balance', 'Terms'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(payable => [
        payable.apCtrlNumber,
        payable.vendInvDate,
        payable.vendInvNbr,
        payable.company,
        payable.companyCode,
        payable.poNbr || '',
        payable.roNbr || '',
        payable.consignment,
        payable.entryDate,
        payable.lastPayDate || '',
        payable.dueDate,
        payable.aging,
        payable.currency,
        payable.amount,
        payable.balance,
        payable.terms
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'account-payables.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueStatuses = ['all', ...Array.from(new Set(payables.map(p => p.status)))];

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
                <p className="text-sm font-medium text-gray-600">Total Payables Amount</p>
                <p className="text-xl font-bold text-gray-900">{kpis.totalPayablesAmount}</p>
              </div>
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>

          {/* KPI Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payables Balance</p>
                <p className="text-xl font-bold text-gray-900">{kpis.totalPayablesBalance}</p>
              </div>
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Sparkline Chart - Extended Width */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Payables Trend</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalPayablesBalance}</p>
            </div>
            <span className="text-sm text-green-600 font-medium">+5.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={kpis.trendData}>
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#6366f1" 
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Entry Date From</label>
            <Input
              type="date"
              value={entryDateFromFilter}
              onChange={(e) => setEntryDateFromFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entry Date To</label>
            <Input
              type="date"
              value={entryDateToFilter}
              onChange={(e) => setEntryDateToFilter(e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">AP Ctrl Number</label>
            <Input
              type="text"
              value={apCtrlNbrFilter}
              onChange={(e) => setApCtrlNbrFilter(e.target.value)}
              placeholder="Search AP Ctrl Number..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <Input
              type="text"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              placeholder="Search company..."
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
              <h2 className="text-xl font-semibold text-gray-900">Account Payables</h2>
              <p className="text-sm text-gray-600 mt-1">Showing {sortedData.length} of {payables.length} payables</p>
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('apCtrlNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    AP Ctrl Number <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('vendInvDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Vend Inv Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('vendInvNbr')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Vend Inv Nbr <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('company')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Company <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('companyCode')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Code <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('poNbr')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    PO Nbr <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('roNbr')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    RO Nbr <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('consignment')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Consignment <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-26">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('entryDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Entry Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-26">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('lastPayDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Last Pay Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-26">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('dueDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Due Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('aging')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Aging <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('currency')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Currency <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Amount <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('balance')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Balance <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('terms')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Terms <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((payable, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payable.apCtrlNumber}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.vendInvDate}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.vendInvNbr}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.company}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.companyCode}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.poNbr || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.roNbr || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.consignment}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.entryDate}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.lastPayDate || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.dueDate}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.aging}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.currency}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {payable.amount}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {payable.balance}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                    {payable.terms}
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