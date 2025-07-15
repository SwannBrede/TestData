import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, FileText, Wrench, CreditCard, Package, ArrowUpDown, Download, AlertTriangle, Users } from "lucide-react";

interface CompanyPulseKPIs {
  mtdSales: string;
  mtdQuotes: string;
  openROs: number;
  arBalance: string;
  apBalance: string;
  incomingShipments: number;
  forecast90d: string;
}

interface SalesQuotesTrendData {
  month: string;
  sales: number;
  quotes: number;
}

interface CashFlowData {
  month: string;
  payables: number;
  receivables: number;
}

interface VendorSpendData {
  vendor: string;
  spend: number;
}

interface EmployeePerformanceData {
  name: string;
  salesAmount: string;
  quotesCount: number;
  conversionPercent: number;
  totalAmount: string;
}

interface ExceptionAlertData {
  type: string;
  department: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

interface ExecutiveOverviewProps {
  companyPulse: CompanyPulseKPIs;
  salesQuotesTrend: SalesQuotesTrendData[];
  cashFlowData: CashFlowData[];
  vendorSpendData: VendorSpendData[];
  employeePerformance: EmployeePerformanceData[];
  exceptionsAlerts: ExceptionAlertData[];
}

export function ExecutiveOverview({
  companyPulse,
  salesQuotesTrend,
  cashFlowData,
  vendorSpendData,
  employeePerformance,
  exceptionsAlerts
}: ExecutiveOverviewProps) {
  const [employeeSortField, setEmployeeSortField] = useState<keyof EmployeePerformanceData>('totalAmount');
  const [employeeSortDirection, setEmployeeSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleEmployeeSort = (field: keyof EmployeePerformanceData) => {
    if (employeeSortField === field) {
      setEmployeeSortDirection(employeeSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setEmployeeSortField(field);
      setEmployeeSortDirection('desc');
    }
  };

  const sortedEmployees = [...employeePerformance].sort((a, b) => {
    let aValue = a[employeeSortField];
    let bValue = b[employeeSortField];

    if (employeeSortField === 'salesAmount' || employeeSortField === 'totalAmount') {
      aValue = parseFloat(aValue.toString().replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.toString().replace(/[$,]/g, ''));
    }

    if (employeeSortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-purple-100 text-purple-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Company Pulse KPI Cards - Modern Grid Layout */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Command Center</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-xl p-2">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-green-700">MTD Sales</p>
                <p className="text-lg font-bold text-gray-900">{companyPulse.mtdSales}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-xl p-2">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-purple-700">MTD Quotes</p>
                <p className="text-lg font-bold text-gray-900">{companyPulse.mtdQuotes}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-sm border border-orange-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-xl p-2">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-orange-700">Open ROs</p>
                <p className="text-lg font-bold text-gray-900">{companyPulse.openROs}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-xl p-2">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-purple-700">A/R Balance</p>
                <p className="text-lg font-bold text-gray-900">{companyPulse.arBalance}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-sm border border-red-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-xl p-2">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-red-700">A/P Balance</p>
                <p className="text-lg font-bold text-gray-900">{companyPulse.apBalance}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-sm border border-indigo-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-indigo-500 rounded-xl p-2">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-indigo-700">Incoming Shipments</p>
                <p className="text-lg font-bold text-gray-900">{companyPulse.incomingShipments}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-sm border border-emerald-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-emerald-500 rounded-xl p-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-emerald-700">Forecast (90d)</p>
                <p className="text-lg font-bold text-gray-900">{companyPulse.forecast90d}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Grid Layout - 3 Column for better balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Quotes Trend - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Sales &amp; Quotes Performance</h3>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Sales</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Quotes</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesQuotesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'sales' ? 'Sales' : 'Quotes']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} name="sales" />
              <Line type="monotone" dataKey="quotes" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} name="quotes" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Flow - Single column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Cash Flow Overview</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={10} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'payables' ? 'Payables' : 'Receivables']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="payables" fill="#EF4444" radius={[4, 4, 0, 0]} name="payables" />
              <Bar dataKey="receivables" fill="#10B981" radius={[4, 4, 0, 0]} name="receivables" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Repair Vendors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Repair Vendors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorSpendData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="vendor" type="category" width={140} stroke="#6b7280" fontSize={11} />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'YTD Spend']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="spend" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PN Performance Bubble Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Part Number Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={pnPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="timesQuoted" name="Times Quoted" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="timesSold" name="Times Sold" stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value, name, props) => [
                  name === 'Times Quoted' ? `${value} quotes` : `${value} sales`,
                  name
                ]}
                labelFormatter={(label, payload) => 
                  payload?.[0]?.payload ? `PN: ${payload[0].payload.pnId}` : ''
                }
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Scatter dataKey="revenue" fill="#F59E0B" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section - Modern Card Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Employee Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Employee Performance</h3>
              <Button 
                onClick={() => exportToCSV(employeePerformance, 'employee-performance.csv')} 
                size="sm" 
                className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleEmployeeSort('name')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Name <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleEmployeeSort('salesAmount')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Sales $ <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleEmployeeSort('quotesCount')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Quotes # <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleEmployeeSort('conversionPercent')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Conv % <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleEmployeeSort('totalAmount')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Total $ <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEmployees.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {employee.salesAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {employee.quotesCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {employee.conversionPercent}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      {employee.totalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Accounts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Key Accounts Funnel</h3>
              <Button 
                onClick={() => exportToCSV(keyAccounts, 'key-accounts.csv')} 
                size="sm" 
                className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleAccountSort('customer')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Customer <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleAccountSort('quotesCount')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      #Quotes <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleAccountSort('salesCount')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      #Sales <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleAccountSort('conversionPercent')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Conversion % <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Button variant="ghost" size="sm" onClick={() => handleAccountSort('revenue')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                      Revenue $ <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAccounts.map((account, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-32 truncate">
                      {account.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {account.quotesCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {account.salesCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {account.conversionPercent}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      {account.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row - Status Monitoring */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Logistics Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Logistics Monitor</h3>
              <Button 
                onClick={() => exportToCSV(logisticsStatus, 'logistics-status.csv')} 
                size="sm" 
                className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delay Flag
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logisticsStatus.map((shipment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium bg-purple-600">
                      {shipment.shipmentId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      {shipment.type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {shipment.expectedDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {shipment.delayFlag && (
                        <AlertTriangle className="w-4 h-4 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exceptions & Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                Alert Center
              </h3>
              <Button 
                onClick={() => exportToCSV(exceptionsAlerts, 'exceptions-alerts.csv')} 
                size="sm" 
                className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exceptionsAlerts.map((alert, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {alert.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {alert.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-48 truncate">
                      {alert.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}