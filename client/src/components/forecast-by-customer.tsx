import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, TrendingUp, TrendingDown, Search, Filter } from "lucide-react";

interface CustomerForecastData {
  customer: string;
  forecastedRevenue: string;
  runRate: string;
  varianceVsTarget: string;
  variancePercent: number;
  region: string;
}

interface ForecastByCustomerProps {
  data: CustomerForecastData[];
}

export function ForecastByCustomer({ data }: ForecastByCustomerProps) {
  const [sortField, setSortField] = useState<keyof CustomerForecastData>('forecastedRevenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: keyof CustomerForecastData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (typeof aValue === 'string' && aValue.includes('$')) {
      aValue = parseFloat(aValue.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[$,]/g, ''));
    } else if (typeof aValue === 'string' && (aValue.includes('%') || aValue.includes('+'))) {
      aValue = parseFloat(aValue.replace(/[%+]/g, ''));
      bValue = parseFloat(bValue.replace(/[%+]/g, ''));
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Customer Forecast Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">12-month forecasted revenue projections and performance variance by customer</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('customer')}
                  className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                >
                  Customer
                  <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('forecastedRevenue')}
                  className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                >
                  Forecasted Revenue (12M)
                  <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('runRate')}
                  className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                >
                  Monthly Run Rate
                  <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('varianceVsTarget')}
                  className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                >
                  Variance vs Target
                  <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('region')}
                  className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                >
                  Region
                  <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((customer, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.customer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {customer.forecastedRevenue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.runRate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {customer.variancePercent >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      customer.variancePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {customer.varianceVsTarget}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.region}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}