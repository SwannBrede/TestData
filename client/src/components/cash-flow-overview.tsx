import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from "recharts";

interface CashFlowData {
  month: string;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  formattedInflows: string;
  formattedOutflows: string;
  formattedNetCashFlow: string;
}

interface CashFlowKPIs {
  totalIn: string;
  totalOut: string;
  netCash: string;
  monthlyAvg: string;
  netCashTrend: 'positive' | 'negative';
}

interface CashFlowOverviewProps {
  data: CashFlowData[];
  kpis: CashFlowKPIs;
}

export function CashFlowOverview({ data, kpis }: CashFlowOverviewProps) {
  const [timePeriod, setTimePeriod] = useState<string>('ytd');

  const getFilteredData = () => {
    // For now, return all data since we're using mock data
    // In real implementation, this would filter based on timePeriod
    return data;
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Inflows</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalIn}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Outflows</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalOut}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`bg-gradient-to-r ${kpis.netCashTrend === 'positive' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} p-3 rounded-xl`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${kpis.netCashTrend === 'positive' ? 'text-green-900' : 'text-red-900'}`}>
                {kpis.netCash}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Average</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.monthlyAvg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Cash Flow Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Monthly inflows vs outflows with net cash flow trend</p>
          </div>
          <div className="w-48">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="last6">Last 6 Months</SelectItem>
                <SelectItem value="last12">Last 12 Months</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Combined Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.6} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-sm">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
                      {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.name === 'inflows' ? 'Inflows' : 
                             entry.name === 'outflows' ? 'Outflows' : 'Net Cash Flow'}:
                          </span>
                          <span className="font-medium text-gray-900 ml-2">
                            {typeof entry.value === 'number' 
                              ? `$${(entry.value / 1000000).toFixed(2)}M`
                              : entry.value
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="inflows" 
              fill="#10B981" 
              name="inflows"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="outflows" 
              fill="#EF4444" 
              name="outflows"
              radius={[2, 2, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="netCashFlow" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              name="netCashFlow"
              dot={{ fill: '#ffffff', stroke: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Cash Flow Summary</h3>
          <p className="text-sm text-gray-600 mt-1">Detailed breakdown by month</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inflows
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outflows
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Cash Flow
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                    {item.formattedInflows}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right font-medium">
                    {item.formattedOutflows}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                    item.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.formattedNetCashFlow}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.netCashFlow >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600 inline" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 inline" />
                    )}
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