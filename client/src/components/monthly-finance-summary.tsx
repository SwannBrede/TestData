import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";

interface MonthlyFinanceData {
  month: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  openAR: number;
  openAP: number;
  formattedRevenue: string;
  formattedExpenses: string;
  formattedNetProfit: string;
  formattedOpenAR: string;
  formattedOpenAP: string;
}

interface TopClient {
  name: string;
  revenue: string;
  percentage: number;
}

interface TopVendor {
  name: string;
  cost: string;
  percentage: number;
}

interface FinanceSummaryKPIs {
  totalRevenue: string;
  totalExpenses: string;
  totalNetProfit: string;
  totalOpenAR: string;
  totalOpenAP: string;
  netProfitTrend: 'positive' | 'negative';
}

interface MonthlyFinanceSummaryProps {
  monthlyData: MonthlyFinanceData[];
  topClients: TopClient[];
  topVendors: TopVendor[];
  kpis: FinanceSummaryKPIs;
}

export function MonthlyFinanceSummary({ monthlyData, topClients, topVendors, kpis }: MonthlyFinanceSummaryProps) {
  const [sortField, setSortField] = useState<keyof MonthlyFinanceData>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof MonthlyFinanceData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...monthlyData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'month') {
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
    const headers = ['Month', 'Revenue', 'Expenses', 'Net Profit', 'Open AR', 'Open AP'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(item => [
        item.month,
        item.formattedRevenue,
        item.formattedExpenses,
        item.formattedNetProfit,
        item.formattedOpenAR,
        item.formattedOpenAP
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monthly-finance-summary.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalRevenue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Receipt className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalExpenses}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className={`w-8 h-8 ${kpis.netProfitTrend === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${kpis.netProfitTrend === 'positive' ? 'text-green-900' : 'text-red-900'}`}>
                {kpis.totalNetProfit}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open AR</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalOpenAR}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open AP</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalOpenAP}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Finance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Finance Summary</h3>
              <p className="text-sm text-gray-600 mt-1">Financial performance by month</p>
            </div>
            <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('month')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Month <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('revenue')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Revenue <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('expenses')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Expenses <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('netProfit')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Net Profit <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('openAR')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Open AR <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('openAP')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Open AP <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-left font-medium">
                    {item.formattedRevenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-left font-medium">
                    {item.formattedExpenses}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-left font-medium ${
                    item.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.formattedNetProfit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 text-left font-medium">
                    {item.formattedOpenAR}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 text-left font-medium">
                    {item.formattedOpenAP}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Profit Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Net Profit Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" strokeOpacity={0.6} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#d1d5db"
              strokeWidth={1}
              axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#d1d5db"
              strokeWidth={1}
              axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-sm">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: payload[0].stroke }}
                          />
                          Net Profit:
                        </span>
                        <span className="font-medium text-gray-900 ml-2">
                          ${payload[0].value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="netProfit" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#ffffff', stroke: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Clients and Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Clients by Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clients by Revenue for the Month</h3>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-700">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{client.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{client.revenue}</div>
                  <div className="text-sm text-gray-500">{client.percentage}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Vendors by Cost */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Vendors by Cost for the Month</h3>
          <div className="space-y-4">
            {topVendors.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-red-700">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{vendor.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{vendor.cost}</div>
                  <div className="text-sm text-gray-500">{vendor.percentage}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}