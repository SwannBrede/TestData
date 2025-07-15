import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Filter, Download, Package, Wrench, TrendingUp, Clock } from "lucide-react";

interface RepairOrder {
  partNumber: string;
  upgradeTo: string | null;
  stockLine: string;
  condition: 'Serviceable' | 'Repairable' | 'Scrap' | 'New';
  serialNumber: string;
  totalYield: string;
  stock: number;
  repairShop: string;
  roNumber: string;
  roDate: string;
  shipDate: string | null;
  daysROToShip: number | null;
  status: 'In Progress' | 'Shipped' | 'Received' | 'Completed' | 'Delayed';
  awbWHToRS: string | null;
  receivedAtShop: string | null;
  awbRSToWH: string | null;
}

interface ROKPIs {
  totalRO: number;
  totalUnitsInStock: number;
  totalUnitsSold: number;
  totalYield: string;
}

interface RepairOrderOverviewProps {
  repairOrders: RepairOrder[];
  kpis: ROKPIs;
}

export function RepairOrderOverview({ repairOrders, kpis }: RepairOrderOverviewProps) {
  const [sortField, setSortField] = useState<keyof RepairOrder>('roDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [repairShopFilter, setRepairShopFilter] = useState<string>('all');
  const [partNumberFilter, setPartNumberFilter] = useState<string>('');
  const [roNumberFilter, setRONumberFilter] = useState<string>('');
  const [roDateFromFilter, setRODateFromFilter] = useState<string>('');
  const [roDateToFilter, setRODateToFilter] = useState<string>('');

  const handleSort = (field: keyof RepairOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = repairOrders.filter(ro => {
    if (repairShopFilter !== 'all' && ro.repairShop !== repairShopFilter) return false;
    if (partNumberFilter && !ro.partNumber.toLowerCase().includes(partNumberFilter.toLowerCase())) return false;
    if (roNumberFilter && !ro.roNumber.toLowerCase().includes(roNumberFilter.toLowerCase())) return false;
    if (roDateFromFilter && new Date(ro.roDate) < new Date(roDateFromFilter)) return false;
    if (roDateToFilter && new Date(ro.roDate) > new Date(roDateToFilter)) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string' && aValue.includes('$')) {
      aValue = parseFloat(aValue.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[$,]/g, ''));
    }

    if (sortField === 'roDate' || sortField === 'shipDate' || sortField === 'receivedAtShop') {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Received': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Serviceable': return 'bg-blue-100 text-blue-800';
      case 'Repairable': return 'bg-yellow-100 text-yellow-800';
      case 'Scrap': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['PN', 'Upgrade To', 'Stock Line', 'Condition', 'Serial Number', 'Total Yield', 'Stock', 'Repair Shop', 'RO Number', 'RO Date', 'Ship Date', 'Days RO to Ship', 'Status', 'AWB: WH to RS', 'Received at Shop', 'AWB: RS to WH'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(ro => [
        ro.partNumber,
        ro.upgradeTo || '',
        ro.stockLine,
        ro.condition,
        ro.serialNumber,
        ro.totalYield,
        ro.stock,
        ro.repairShop,
        ro.roNumber,
        ro.roDate,
        ro.shipDate || '',
        ro.daysROToShip || '',
        ro.status,
        ro.awbWHToRS || '',
        ro.receivedAtShop || '',
        ro.awbRSToWH || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repair-order-overview.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueRepairShops = ['all', ...Array.from(new Set(repairOrders.map(ro => ro.repairShop)))];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Wrench className="w-8 h-8 bg-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total RO</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalRO}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Units In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalUnitsInStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 bg-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalUnitsSold}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Yield</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalYield}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main RO Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">RO Logistics Table</h3>
                  <p className="text-sm text-gray-600 mt-1">Repair order tracking and logistics management</p>
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
                      <Button variant="ghost" size="sm" onClick={() => handleSort('partNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                        PN <ArrowUpDown className="ml-1 w-3 h-3" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upgrade To
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Line
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('totalYield')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                        Yield <ArrowUpDown className="ml-1 w-3 h-3" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('stock')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                        Stock <ArrowUpDown className="ml-1 w-3 h-3" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('repairShop')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                        Repair Shop <ArrowUpDown className="ml-1 w-3 h-3" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('roNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                        RO Number <ArrowUpDown className="ml-1 w-3 h-3" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('roDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                        RO Date <ArrowUpDown className="ml-1 w-3 h-3" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('daysROToShip')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                        Days to Ship <ArrowUpDown className="ml-1 w-3 h-3" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((ro, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ro.partNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {ro.upgradeTo || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {ro.stockLine}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(ro.condition)}`}>
                          {ro.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {ro.serialNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {ro.totalYield}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {ro.stock}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-32 truncate">
                        {ro.repairShop}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium bg-purple-600">
                        {ro.roNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {ro.roDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {ro.daysROToShip || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ro.status)}`}>
                          {ro.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {sortedData.length} of {repairOrders.length} repair orders
              </p>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filter Panel</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repair Shop</label>
                <Select value={repairShopFilter} onValueChange={setRepairShopFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Repair Shops" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueRepairShops.map(shop => (
                      <SelectItem key={shop} value={shop}>
                        {shop === 'all' ? 'All Repair Shops' : shop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PN</label>
                <Input
                  placeholder="Search PN"
                  value={partNumberFilter}
                  onChange={(e) => setPartNumberFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RO Number</label>
                <Input
                  placeholder="Search RO Number"
                  value={roNumberFilter}
                  onChange={(e) => setRONumberFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RO Date From</label>
                <Input
                  type="date"
                  value={roDateFromFilter}
                  onChange={(e) => setRODateFromFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RO Date To</label>
                <Input
                  type="date"
                  value={roDateToFilter}
                  onChange={(e) => setRODateToFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}