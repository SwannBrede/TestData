import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface LotData {
  lotNumber: string;
  consignment: string;
  originalCost: string;
  totalItemRepairCost: string;
  remainingRepairCost: string;
  totalCostSoldItems: string;
  totalLotCost: string;
  totalSalesVolume: string;
}

interface ConsignmentData {
  name: string;
  value: number;
  color: string;
}

interface WarehouseData {
  name: string;
  value: number;
}

interface AgingData {
  ageRange: string;
  value: number;
  color: string;
}

interface LotsStockDistributionProps {
  lots: LotData[];
  consignmentData: ConsignmentData[];
  warehouseData: WarehouseData[];
  agingData: AgingData[];
}

export function LotsStockDistribution({ lots, consignmentData, warehouseData, agingData }: LotsStockDistributionProps) {
  const [sortField, setSortField] = useState<keyof LotData>('lotNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof LotData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLots = [...lots].sort((a, b) => {
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

  const exportToCSV = () => {
    const headers = ['Lot Number', 'Consignment', 'Original Cost', 'Total Item Repair Cost', 'Remaining Repair Cost', 'Total Cost of Sold Items', 'Total Lot Cost', 'Total Sales Volume'];
    const csvContent = [
      headers.join(','),
      ...sortedLots.map(lot => [
        lot.lotNumber,
        lot.consignment,
        lot.originalCost,
        lot.totalItemRepairCost,
        lot.remainingRepairCost,
        lot.totalCostSoldItems,
        lot.totalLotCost,
        lot.totalSalesVolume
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lots-distribution.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Lot Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lot Management</h3>
              <p className="text-sm text-gray-600 mt-1">Track lot costs and sales performance</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('lotNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Lot Number <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('consignment')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Consignment <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('originalCost')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Original Cost <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('totalItemRepairCost')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Item Repair Cost <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('remainingRepairCost')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Remaining Repair <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('totalCostSoldItems')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Sold Items Cost <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('totalLotCost')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Total Lot Cost <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('totalSalesVolume')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Sales Volume <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedLots.map((lot, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lot.lotNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {lot.consignment}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    {lot.originalCost}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    {lot.totalItemRepairCost}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    {lot.remainingRepairCost}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    {lot.totalCostSoldItems}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {lot.totalLotCost}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    {lot.totalSalesVolume}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {sortedLots.length} lots
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Qty by Consignment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Consignment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={consignmentData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {consignmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Qty by Warehouse */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Warehouse</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={warehouseData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} units`, 'Quantity']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                label={({ value }) => (
                  <text 
                    x={0} 
                    y={-8} 
                    textAnchor="middle" 
                    fontSize="12" 
                    fill="#374151"
                    fontWeight="500"
                  >
                    {value}
                  </text>
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Aging */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Aging Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={agingData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ ageRange, percent }) => `${ageRange} ${(percent * 100).toFixed(0)}%`}
              >
                {agingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}