import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, DollarSign, Package, Building2, Search } from "lucide-react";
interface VendorRecap {
  roShop: string;
  qtyOfROs: number;
  totalROAmount: string;
  totalROAmountNum: number;
}

interface VendorInsightsProps {
  vendorRecap: VendorRecap[];
  vendorAmountData: any[];
  vendorVolumeData: any[];
  vendorSpendData: any[];
  topRepairShops: any[];
}

export function VendorInsights({ vendorRecap, vendorAmountData, vendorVolumeData, vendorSpendData, topRepairShops }: VendorInsightsProps) {
  const [sortField, setSortField] = useState<keyof VendorRecap>('totalROAmountNum');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [vendorSearchFilter, setVendorSearchFilter] = useState('');

  const handleSort = (field: keyof VendorRecap) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter vendors by search term
  const filteredVendors = vendorRecap.filter(vendor => 
    vendor.roShop.toLowerCase().includes(vendorSearchFilter.toLowerCase())
  );

  const sortedData = [...filteredVendors].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'totalROAmount') {
      aValue = a.totalROAmountNum;
      bValue = b.totalROAmountNum;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const exportToCSV = () => {
    const headers = ['RO Shop', 'Qty of ROs', 'Total RO Amount'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(vendor => [
        vendor.roShop,
        vendor.qtyOfROs,
        vendor.totalROAmount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendor-insights.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate key metrics
  const totalSpend = vendorRecap.reduce((sum, v) => sum + v.totalROAmountNum, 0);
  const totalROs = vendorRecap.reduce((sum, v) => sum + v.qtyOfROs, 0);
  const avgCostPerRO = totalSpend / totalROs;

  return (
    <div className="space-y-6">
      {/* Key Metrics - YTD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total RO Spend (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">${(totalSpend / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Repair Orders (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">{totalROs.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Avg Cost per RO (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">${(avgCostPerRO / 1000).toFixed(0)}k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Performance Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vendor Performance</h3>
            <Button onClick={exportToCSV} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          {/* Vendor Search Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Search Vendor:</span>
            </div>
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Search vendor name..."
                value={vendorSearchFilter}
                onChange={(e) => setVendorSearchFilter(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="text-sm text-gray-500">
              {sortedData.length} of {vendorRecap.length} vendors
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-h-96 overflow-y-auto">
            <div className="grid gap-4 pr-2">
              {sortedData.map((vendor, index) => {
              const spendPercentage = (vendor.totalROAmountNum / totalSpend) * 100;
              const volumePercentage = (vendor.qtyOfROs / totalROs) * 100;
              const avgCost = vendor.totalROAmountNum / vendor.qtyOfROs;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-700">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{vendor.roShop}</p>
                      <div className="flex items-center space-x-6 mt-1">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${(spendPercentage / Math.max(...sortedData.map(v => (v.totalROAmountNum / totalSpend) * 100))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{spendPercentage.toFixed(1)}% spend</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${(volumePercentage / Math.max(...sortedData.map(v => (v.qtyOfROs / totalROs) * 100))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{volumePercentage.toFixed(1)}% volume</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{vendor.qtyOfROs}</p>
                      <p className="text-xs text-gray-500">ROs</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{vendor.totalROAmount}</p>
                      <p className="text-xs text-gray-500">total spend</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">${(avgCost / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-gray-500">avg/RO</p>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}