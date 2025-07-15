import { Button } from "@/components/ui/button";
import { Download, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverdueReceivable {
  arCtrlNumber: string;
  customer: string;
  amount: string;
  aging: number;
  dueDate: string;
  company: string;
}

interface OverduePayable {
  apCtrlNumber: string;
  vendor: string;
  amount: string;
  aging: number;
  dueDate: string;
  company: string;
}

interface CompanyOverdueData {
  name: string;
  value: number;
  color: string;
}

interface AgingBucketData {
  bucket: string;
  receivables: number;
  payables: number;
}

interface LatePaymentsProps {
  overdueReceivables: OverdueReceivable[];
  overduePayables: OverduePayable[];
  companyOverdueData: CompanyOverdueData[];
  agingBuckets: AgingBucketData[];
}

export function LatePayments({ overdueReceivables, overduePayables, companyOverdueData, agingBuckets }: LatePaymentsProps) {
  const exportReceivablesToCSV = () => {
    const headers = ['AR #', 'Customer', 'Amount', 'Aging', 'Due Date'];
    const csvContent = [
      headers.join(','),
      ...overdueReceivables.map(item => [
        item.arCtrlNumber,
        item.customer,
        item.amount,
        item.aging,
        item.dueDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'overdue-receivables.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPayablesToCSV = () => {
    const headers = ['AP #', 'Vendor', 'Amount', 'Aging', 'Due Date'];
    const csvContent = [
      headers.join(','),
      ...overduePayables.map(item => [
        item.apCtrlNumber,
        item.vendor,
        item.amount,
        item.aging,
        item.dueDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'overdue-payables.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAgingColor = (aging: number) => {
    if (aging <= 30) return 'text-yellow-600';
    if (aging <= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Split Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Receivables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Overdue Receivables</h3>
                  <p className="text-sm text-gray-600 mt-1">Customer payments past due</p>
                </div>
              </div>
              <Button onClick={exportReceivablesToCSV} size="sm" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
          
          <div className="overflow-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20">
                    AR #
                  </th>
                  <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aging
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueReceivables.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="w-32 px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 whitespace-nowrap">
                      {item.arCtrlNumber}
                    </td>
                    <td className="w-48 px-4 py-3 text-sm text-gray-900 truncate">
                      {item.customer}
                    </td>
                    <td className="w-28 px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                      {item.amount}
                    </td>
                    <td className={`w-24 px-4 py-3 whitespace-nowrap text-sm font-medium text-left ${getAgingColor(item.aging)}`}>
                      {item.aging} days
                    </td>
                    <td className="w-32 px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {overdueReceivables.length} overdue receivables
            </p>
          </div>
        </div>

        {/* Overdue Payables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Overdue Payables</h3>
                  <p className="text-sm text-gray-600 mt-1">Vendor payments past due</p>
                </div>
              </div>
              <Button onClick={exportPayablesToCSV} size="sm" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
          
          <div className="overflow-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20">
                    AP #
                  </th>
                  <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aging
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overduePayables.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="w-32 px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 whitespace-nowrap">
                      {item.apCtrlNumber}
                    </td>
                    <td className="w-48 px-4 py-3 text-sm text-gray-900 truncate">
                      {item.vendor}
                    </td>
                    <td className="w-28 px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                      {item.amount}
                    </td>
                    <td className={`w-24 px-4 py-3 whitespace-nowrap text-sm font-medium text-left ${getAgingColor(item.aging)}`}>
                      {item.aging} days
                    </td>
                    <td className="w-32 px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {overduePayables.length} overdue payables
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Amount by Company */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Overdue Amount by Company</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={companyOverdueData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {companyOverdueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 mb-2">{payload[0].payload.name}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: payload[0].payload.color }}
                            />
                            Amount:
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
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Aging Buckets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Aging Buckets</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agingBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.6} />
              <XAxis 
                dataKey="bucket" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
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
                              {entry.name === 'receivables' ? 'Receivables' : 'Payables'}:
                            </span>
                            <span className="font-medium text-gray-900 ml-2">
                              ${entry.value.toLocaleString()}
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
                dataKey="receivables" 
                fill="#10B981" 
                name="receivables"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="payables" 
                fill="#EF4444" 
                name="payables"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}