import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, Clock, TrendingUp, TrendingDown, Search, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TATRecord {
  roNumber: string;
  roShop: string;
  roDate: string;
  shipDate: string;
  deliveryDate: string;
  tatInternal: number;
  tatExternal: number;
}

interface TATKPIs {
  longestTAT: number;
  shortestTAT: number;
  percentOverTarget: number;
}

interface VendorTATData {
  roShop: string;
  avgTAT: number;
}

interface TATDistributionData {
  range: string;
  internal: number;
  external: number;
}

interface TATAnalysisProps {
  tatRecords: TATRecord[];
  kpis: TATKPIs;
  vendorTATData: VendorTATData[];
  tatDistribution: TATDistributionData[];
}

export function TATAnalysis({ tatRecords, kpis, vendorTATData, tatDistribution }: TATAnalysisProps) {
  const [sortField, setSortField] = useState<keyof TATRecord>('roDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [roNumberFilter, setRoNumberFilter] = useState('');
  const [shopFilter, setShopFilter] = useState('');
  const [vendorSearchFilter, setVendorSearchFilter] = useState('');

  const handleSort = (field: keyof TATRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = tatRecords.filter(record => {
      const matchesRoNumber = roNumberFilter === '' || 
        record.roNumber.toLowerCase().includes(roNumberFilter.toLowerCase());
      const matchesShop = shopFilter === '' || 
        record.roShop.toLowerCase().includes(shopFilter.toLowerCase());
      return matchesRoNumber && matchesShop;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'roDate' || sortField === 'shipDate' || sortField === 'deliveryDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [tatRecords, sortField, sortDirection, roNumberFilter, shopFilter]);

  const filteredVendorData = useMemo(() => {
    return vendorTATData.filter(vendor => 
      vendorSearchFilter === '' || 
      vendor.roShop.toLowerCase().includes(vendorSearchFilter.toLowerCase())
    );
  }, [vendorTATData, vendorSearchFilter]);

  const exportToCSV = () => {
    const headers = ['RO Number', 'RO Shop', 'RO Date', 'Ship Date', 'Delivery Date', 'TAT Internal', 'TAT External'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map(record => [
        record.roNumber,
        record.roShop,
        record.roDate,
        record.shipDate,
        record.deliveryDate,
        record.tatInternal,
        record.tatExternal
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tat-analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* TAT Highlights KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Longest TAT</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.longestTAT} days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shortest TAT</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.shortestTAT} days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">% TAT &gt; Target</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.percentOverTarget}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* TAT Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Turnaround Time Table</h3>
              <p className="text-sm text-gray-600 mt-1">Detailed TAT analysis by repair shop</p>
            </div>
            <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
          
          {/* Filter Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Search RO Number..."
                value={roNumberFilter}
                onChange={(e) => setRoNumberFilter(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Search Shop..."
                value={shopFilter}
                onChange={(e) => setShopFilter(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedData.length} of {tatRecords.length} records
            </div>
          </div>
        </div>
        
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('roNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    RO Number <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('roShop')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    RO Shop <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('roDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    RO Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('shipDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Ship Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('deliveryDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Delivery Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('tatInternal')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    TAT Internal <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('tatExternal')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    TAT External <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.roNumber}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.roShop}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.roDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.shipDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.deliveryDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{record.tatInternal} days</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{record.tatExternal} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedData.length} of {tatRecords.length} TAT records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average TAT per Vendor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Avg TAT per Vendor</h3>
                <p className="text-sm text-gray-600 mt-1">Average turnaround time by repair vendor</p>
              </div>
            </div>
            
            {/* Vendor Search Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Search Vendor:</span>
              </div>
              <div className="flex-1 max-w-xs">
                <Input
                  placeholder="Search vendor..."
                  value={vendorSearchFilter}
                  onChange={(e) => setVendorSearchFilter(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredVendorData.length} of {vendorTATData.length} vendors
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredVendorData.map((vendor, index) => (
                <div key={vendor.roShop} className="flex items-center">
                  <div className="w-40 text-sm text-gray-700 font-medium truncate pr-3">
                    {vendor.roShop}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-300"
                      style={{ 
                        width: `${Math.min((vendor.avgTAT / Math.max(...filteredVendorData.map(v => v.avgTAT))) * 100, 100)}%`,
                        minWidth: '30px'
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {vendor.avgTAT} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredVendorData.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No vendors found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TAT Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200" style={{ height: '500px' }}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">TAT Distribution: Internal vs External</h3>
            <p className="text-sm text-gray-600 mt-1">Comparison of internal and external processing times</p>
          </div>
          
          <div className="p-1" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tatDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  height={30}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  width={40}
                />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'internal' ? 'Internal' : 'External']}
                  labelFormatter={(label) => `${label}`}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '5px' }}
                  iconType="circle"
                  verticalAlign="bottom"
                  height={20}
                  formatter={(value) => {
                    const color = value === 'Internal TAT' ? 'hsl(264, 89%, 58%)' : 'hsl(14, 83%, 60%)';
                    return <span style={{ fontSize: '10px', color }}>{value}</span>;
                  }}
                />
                <Bar 
                  dataKey="internal" 
                  fill="hsl(264, 89%, 58%)" 
                  name="Internal TAT"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="external" 
                  fill="hsl(14, 83%, 60%)" 
                  name="External TAT"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}