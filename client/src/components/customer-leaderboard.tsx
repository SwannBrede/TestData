import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";

interface CustomerLeaderboardData {
  name: string;
  revenue: string;
  orders: number;
  aov: string;
  conversionRate: string;
  lastPurchase: string;
  lastSONumber: string;
  region: string;
}

interface CustomerLeaderboardProps {
  data: CustomerLeaderboardData[];
}

export function CustomerLeaderboard({ data }: CustomerLeaderboardProps) {
  const [sortField, setSortField] = useState<keyof CustomerLeaderboardData>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (field: keyof CustomerLeaderboardData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = data.filter(customer => {
    if (searchTerm === '') return true;
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.lastSONumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
            <h3 className="text-xl font-bold text-gray-900">Customer Leaderboard</h3>
            <p className="text-sm text-gray-600 mt-1">Top performing customers ranked by key metrics</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-96">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '180px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Customer Name
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>
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
                    onClick={() => handleSort('orders')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Orders
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '140px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('lastSONumber')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Last SO Number
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
                    Conversion
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '130px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('lastPurchase')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    Last Purchase
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap" style={{ width: '180px' }}>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.region}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left font-medium" style={{ width: '120px' }}>
                    {customer.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left" style={{ width: '100px' }}>
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left" style={{ width: '120px' }}>
                    {customer.aov}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center" style={{ width: '140px' }}>
                    {customer.lastSONumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center" style={{ width: '120px' }}>
                    {customer.conversionRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left" style={{ width: '130px' }}>
                    {customer.lastPurchase}
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