import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Filter } from "lucide-react";

interface ProductLeaderboardData {
  partNumber: string;
  description: string;
  revenue: string;
  quantitySold: number;
  orders: number;
  aov: string;
  conversionRate: string;
  lastSoldDate: string;
  category: string;
}

interface ProductLeaderboardProps {
  data: ProductLeaderboardData[];
}

export function ProductLeaderboard({ data }: ProductLeaderboardProps) {
  const [sortField, setSortField] = useState<keyof ProductLeaderboardData>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [partNumberFilter, setPartNumberFilter] = useState<string>('');

  const handleSort = (field: keyof ProductLeaderboardData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = data.filter(product => 
    partNumberFilter === '' || product.partNumber.toLowerCase().includes(partNumberFilter.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (typeof aValue === 'string' && aValue.includes('$')) {
      aValue = parseFloat(aValue.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[$,]/g, ''));
    } else if (typeof aValue === 'string' && aValue.includes('%')) {
      aValue = parseFloat(aValue.replace('%', ''));
      bValue = parseFloat(bValue.replace('%', ''));
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });



  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Product Leaderboard</h3>
            <p className="text-sm text-gray-600 mt-1">Top performing products ranked by sales metrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={partNumberFilter}
                onChange={(e) => setPartNumberFilter(e.target.value)}
                placeholder="Filter by Part Number"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-96">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '160px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('partNumber')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Part Number
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '240px' }}>
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('revenue')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Revenue
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('quantitySold')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Qty Sold
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '80px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('orders')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Orders
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('aov')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    AOV
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('conversionRate')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Conversion Rate
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('lastSoldDate')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Last Sold Date
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap" style={{ width: '160px' }}>
                    <div className="text-sm font-medium text-gray-900">{product.partNumber}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4" style={{ width: '240px' }}>
                    <div className="text-sm text-gray-900 truncate">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left font-medium" style={{ width: '100px' }}>
                    {product.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left" style={{ width: '100px' }}>
                    {product.quantitySold.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left" style={{ width: '80px' }}>
                    {product.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left" style={{ width: '100px' }}>
                    {product.aov}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center" style={{ width: '120px' }}>
                    {product.conversionRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left" style={{ width: '120px' }}>
                    {product.lastSoldDate}
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