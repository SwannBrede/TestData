import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, AlertTriangle, Trash2, Search } from "lucide-react";


interface ScrapEvent {
  partNumber: string;
  roShop: string;
  avgScrapPercent: number;
  scrapCount: number;
}

interface TopScrappedPN {
  partNumber: string;
  scrapCount: number;
}

interface VendorScrapData {
  roShop: string;
  avgScrapPercent: number;
}

interface ScrapQualityProps {
  scrapEvents: ScrapEvent[];
  topScrappedPNs: TopScrappedPN[];
  vendorScrapData: VendorScrapData[];
}

export function ScrapQuality({ scrapEvents, topScrappedPNs, vendorScrapData }: ScrapQualityProps) {
  const [sortField, setSortField] = useState<keyof ScrapEvent>('scrapCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pnSearchFilter, setPnSearchFilter] = useState('');

  const handleSort = (field: keyof ScrapEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter data by PN search
  const filteredData = scrapEvents.filter(event => 
    event.partNumber.toLowerCase().includes(pnSearchFilter.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Get top 5 data for charts
  const top5ScrappedPNs = [...topScrappedPNs].slice(0, 5);
  const top5VendorScrap = [...vendorScrapData].slice(0, 5);

  const exportToCSV = () => {
    const headers = ['PN', 'RO Shop', 'Avg Scrap %', 'Scrap Count'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(event => [
        event.partNumber,
        event.roShop,
        event.avgScrapPercent,
        event.scrapCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scrap-quality.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getScrapColor = (percentage: number) => {
    if (percentage >= 15) return 'text-red-600 font-semibold';
    if (percentage >= 10) return 'text-orange-600 font-medium';
    if (percentage >= 5) return 'text-yellow-600 font-medium';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Scrap Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Scrap Events Table</h3>
                <p className="text-sm text-gray-600 mt-1">Quality analysis and scrap rate tracking by part and vendor</p>
              </div>
            </div>
            <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
          
          {/* PN Search Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Search PN:</span>
            </div>
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Search part number..."
                value={pnSearchFilter}
                onChange={(e) => setPnSearchFilter(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="text-sm text-gray-500">
              {sortedData.length} of {scrapEvents.length} events
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Frozen Header */}
              <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <div className="grid grid-cols-4 gap-6 px-6 py-3">
                  <div className="text-left">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('partNumber')} className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700">
                      PN <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-left">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('roShop')} className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700">
                      RO Shop <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('avgScrapPercent')} className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700">
                      Avg Scrap % <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('scrapCount')} className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700">
                      Scrap Count <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Scrollable Body */}
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-gray-200">
                  {sortedData.map((event, index) => (
                    <div key={index} className="grid grid-cols-4 gap-6 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="text-sm font-medium text-gray-900">
                        {event.partNumber}
                      </div>
                      <div className="text-sm text-gray-900 truncate">
                        {event.roShop}
                      </div>
                      <div className={`text-sm text-right ${getScrapColor(event.avgScrapPercent)}`}>
                        {event.avgScrapPercent}%
                      </div>
                      <div className="text-sm text-gray-900 text-right">
                        {event.scrapCount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {sortedData.length} of {scrapEvents.length} scrap events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Scrapped Part Numbers - Modern Card Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Trash2 className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top 5 Scrapped Part Numbers</h3>
                <p className="text-sm text-gray-600 mt-1">Highest scrap count by part number</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {top5ScrappedPNs.map((item, index) => {
              const maxValue = Math.max(...top5ScrappedPNs.map(p => p.scrapCount));
              const percentage = (item.scrapCount / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-25 rounded-lg border border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                      <span className="text-sm font-bold text-red-700">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.partNumber}</p>
                      <div className="w-32 bg-red-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{item.scrapCount}</p>
                    <p className="text-xs text-gray-500">scraps</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Scrap % by Vendor - Modern Card Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top 5 Scrap % by Vendor</h3>
                <p className="text-sm text-gray-600 mt-1">Highest scrap percentage by repair vendor</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {top5VendorScrap.map((vendor, index) => {
              const maxValue = Math.max(...top5VendorScrap.map(v => v.avgScrapPercent));
              const percentage = (vendor.avgScrapPercent / maxValue) * 100;
              
              // Color coding based on scrap percentage
              const getVendorColor = (scrapPercent: number) => {
                if (scrapPercent >= 15) return { bg: 'from-red-50 to-red-25', border: 'border-red-200', progress: 'from-red-500 to-red-600', text: 'text-red-600', badge: 'bg-red-100 text-red-700' };
                if (scrapPercent >= 10) return { bg: 'from-orange-50 to-orange-25', border: 'border-orange-200', progress: 'from-orange-500 to-orange-600', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' };
                if (scrapPercent >= 5) return { bg: 'from-yellow-50 to-yellow-25', border: 'border-yellow-200', progress: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700' };
                return { bg: 'from-green-50 to-green-25', border: 'border-green-200', progress: 'from-green-500 to-green-600', text: 'text-green-600', badge: 'bg-green-100 text-green-700' };
              };
              
              const colors = getVendorColor(vendor.avgScrapPercent);
              
              return (
                <div key={index} className={`flex items-center justify-between p-4 bg-gradient-to-r ${colors.bg} rounded-lg border ${colors.border}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 ${colors.badge} rounded-full`}>
                      <span className="text-sm font-bold">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{vendor.roShop}</p>
                      <div className="w-40 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`bg-gradient-to-r ${colors.progress} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${colors.text}`}>{vendor.avgScrapPercent}%</p>
                    <p className="text-xs text-gray-500">scrap rate</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}