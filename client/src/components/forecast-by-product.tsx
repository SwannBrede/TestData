import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, CheckCircle, AlertCircle, XCircle, Search, Filter } from "lucide-react";

interface ProductForecastData {
  partNumber: string;
  productName: string;
  forecastedRevenue: string;
  forecastedQuantity: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  category: string;
}

interface ForecastByProductProps {
  data: ProductForecastData[];
}

export function ForecastByProduct({ data }: ForecastByProductProps) {
  const [sortField, setSortField] = useState<keyof ProductForecastData>('forecastedRevenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewType, setViewType] = useState<'table' | 'chart'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: keyof ProductForecastData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
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

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Low':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Product Forecast Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">12-month forecasted revenue projections by product with monthly run rates and variance analysis</p>
          </div>

        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('partNumber')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                  >
                    Part Number
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('productName')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                  >
                    Product Name
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('forecastedRevenue')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                  >
                    Forecasted Revenue
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('forecastedQuantity')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                  >
                    Monthly Run Rate
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('confidenceLevel')}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700 justify-start"
                  >
                    Variance vs Target
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.partNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {product.forecastedRevenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {product.forecastedQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`${product.confidenceLevel.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {product.confidenceLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}