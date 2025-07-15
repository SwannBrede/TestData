import { LineChart, Line, BarChart, Bar, ComposedChart, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, FileText, Wrench, CreditCard, Package, ArrowUpDown, Download, AlertTriangle, Users, Calendar } from "lucide-react";

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
  const [dateFilter, setDateFilter] = useState<string>('this-month');

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
    <div className="space-y-6">
      {/* Sales Performance and Financial Health - Side by Side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sales Performance Section - KPI Cards + Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
            <p className="text-sm text-gray-600 mt-1">Revenue and quotes performance with trend analysis</p>
          </div>
          
          {/* Sales KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Sales Revenue</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">{companyPulse.mtdSales}</p>
                    <p className="text-sm text-gray-600">MTD • YTD: $14.2M</p>
                    <p className="text-xs text-green-600 font-medium">+11.8% vs LM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Quotes Value</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">{companyPulse.mtdQuotes}</p>
                    <p className="text-sm text-gray-600">MTD • YTD: $89.4M</p>
                    <p className="text-xs text-red-600 font-medium">-5.2% vs LM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesQuotesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => {
                    const labels = { sales: 'Sales', quotes: 'Quotes' };
                    return [`$${value.toLocaleString()}`, labels[name as keyof typeof labels]];
                  }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="sales" />
                <Line type="monotone" dataKey="quotes" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="quotes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health Section - KPI Cards + Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Financial Health</h3>
            <p className="text-sm text-gray-600 mt-1">Cash flow and balance analysis with trends</p>
          </div>
          
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <CreditCard className="w-6 h-6 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Accounts Receivable</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">{companyPulse.arBalance}</p>
                    <p className="text-sm text-gray-600">Current • YTD: $18.7M</p>
                    <p className="text-xs text-green-600 font-medium">Healthy</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <CreditCard className="w-6 h-6 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Accounts Payable</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">{companyPulse.apBalance}</p>
                    <p className="text-sm text-gray-600">Current • YTD: $16.1M</p>
                    <p className="text-xs text-orange-600 font-medium">Monitor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => {
                    const labels = { receivables: 'Receivables', payables: 'Payables' };
                    return [`$${value.toLocaleString()}`, labels[name as keyof typeof labels]];
                  }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Bar dataKey="receivables" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="receivables" />
                <Bar dataKey="payables" fill="#EF4444" radius={[4, 4, 0, 0]} name="payables" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operations Overview Section - KPI Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Operations Overview</h3>
          <p className="text-sm text-gray-600 mt-1">Repair orders, shipments, and forecast metrics</p>
        </div>
        
        {/* Operations KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Wrench className="w-6 h-6 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Repair Orders</span>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">{companyPulse.openROs}</p>
                  <p className="text-sm text-gray-600">Open • YTD: 456 Total</p>
                  <p className="text-xs text-gray-600">$1.15M Value</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Package className="w-6 h-6 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Shipments</span>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">{companyPulse.incomingShipments}</p>
                  <p className="text-sm text-gray-600">Incoming • YTD: 1,247</p>
                  <p className="text-xs text-green-600 font-medium">On Track</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">90d Forecast</span>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">{companyPulse.forecast90d}</p>
                  <p className="text-sm text-gray-600">Projected • YTD: $28.4M</p>
                  <p className="text-xs text-emerald-600 font-medium">+8.3% Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Spend & Employee Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Repair Vendors - Enhanced with more metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Repair Vendors (YTD Spend)</h3>
            <p className="text-sm text-gray-600 mt-1">Vendor performance and spending analysis</p>
          </div>
          <div className="px-4 pt-4 pb-0 h-[28rem] overflow-y-auto">
            <div className="space-y-3 pb-4">
              {vendorSpendData.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block">{vendor.vendor}</span>
                      <span className="text-xs text-gray-500">{Math.floor(Math.random() * 20) + 10} ROs completed</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 max-w-40">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ 
                            width: `${(vendor.spend / Math.max(...vendorSpendData.map(v => v.spend))) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-lg min-w-24 text-right">
                      ${vendor.spend.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Employee Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
              <div className="flex items-center space-x-3">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => exportToCSV(employeePerformance, 'team-performance.csv')} 
                  size="sm" 
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 h-[28rem] overflow-y-auto">
            <div className="space-y-3">
              {sortedEmployees.map((employee, index) => {
                const conversionRate = employee.conversionPercent;
                const isTopPerformer = index < 3;
                // Calculate quotes dollar value and sales count
                const salesValue = parseFloat(employee.salesAmount.replace(/[$,]/g, ''));
                const quotesValue = Math.round(salesValue / (conversionRate / 100));
                const salesCount = Math.round(employee.quotesCount * (conversionRate / 100));
                return (
                  <div key={index} className={`p-4 rounded-lg border ${isTopPerformer ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isTopPerformer ? 'bg-purple-100' : 'bg-gray-200'}`}>
                          <Users className={`w-5 h-5 ${isTopPerformer ? 'text-purple-600' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.quotesCount} quotes • ${quotesValue.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{employee.salesAmount}</p>
                        <p className="text-sm text-gray-600">{salesCount} sales</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Conversion Rate</span>
                        <span>{conversionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isTopPerformer ? 'bg-purple-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(conversionRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Exceptions & Alerts - Enhanced */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Exceptions & Alerts</h3>
              <p className="text-sm text-gray-600 mt-1">Cross-departmental alerts requiring attention</p>
            </div>
            <Button 
              onClick={() => exportToCSV(exceptionsAlerts, 'exceptions-alerts.csv')} 
              size="sm" 
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exceptionsAlerts.map((alert, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                        {alert.type}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{alert.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{alert.description}</td>
                    <td className="px-4 py-3 text-sm">
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