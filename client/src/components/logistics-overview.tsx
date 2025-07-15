import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, Package, Wrench, TrendingUp, Clock } from "lucide-react";

interface LogisticsOrder {
  pn: string;
  upgradeTo: string | null;
  stockLine: string;
  condition: 'Serviceable' | 'Repairable' | 'Scrap' | 'New';
  serialNumber: string;
  manifest: string;
  totalYield: string;
  sold: number;
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
  warehouse: string;
  rsToWHSCUT: string | null;
  location: string;
  awbToCust: string | null;
  freightOut: string | null;
  freightIn: string | null;
  consignment: string;
  lot: string;
}

interface LogisticsKPIs {
  totalRO: number;
  totalUnitsInStock: number;
  totalUnitsSold: number;
  totalYield: string;
}

interface LogisticsOverviewProps {
  logisticsOrders: LogisticsOrder[];
  kpis: LogisticsKPIs;
}

export function LogisticsOverview({ logisticsOrders, kpis }: LogisticsOverviewProps) {
  const [sortField, setSortField] = useState<keyof LogisticsOrder>('roDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [repairShopFilter, setRepairShopFilter] = useState<string>('');
  const [partNumberFilter, setPartNumberFilter] = useState<string>('');
  const [roNumberFilter, setRONumberFilter] = useState<string>('');
  const [roDateFromFilter, setRODateFromFilter] = useState<string>('');
  const [roDateToFilter, setRODateToFilter] = useState<string>('');

  const handleSort = (field: keyof LogisticsOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = logisticsOrders.filter(order => {
    if (repairShopFilter && !order.repairShop.toLowerCase().includes(repairShopFilter.toLowerCase())) return false;
    if (partNumberFilter && !order.pn.toLowerCase().includes(partNumberFilter.toLowerCase())) return false;
    if (roNumberFilter && !order.roNumber.toLowerCase().includes(roNumberFilter.toLowerCase())) return false;
    if (roDateFromFilter && new Date(order.roDate) < new Date(roDateFromFilter)) return false;
    if (roDateToFilter && new Date(order.roDate) > new Date(roDateToFilter)) return false;
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
    const headers = [
      'PN', 'Upgrade To', 'Stock Line', 'Condition', 'Serial Number', 'Manifest', 'Total Yield', 'Sold', 'Stock',
      'Repair Shop', 'RO Number', 'RO Date', 'Ship Date', 'Days RO to Ship', 'Status', 'AWB - WH to RS',
      'Received at Shop', 'AWB - RS to WH', 'Warehouse', 'RS to WHS/CUT', 'Location', 'AWB to Cust',
      'Freight Out', 'Freight In', 'Consignment', 'Lot'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedData.map(order => [
        order.pn,
        order.upgradeTo || '',
        order.stockLine,
        order.condition,
        order.serialNumber,
        order.manifest,
        order.totalYield,
        order.sold,
        order.stock,
        order.repairShop,
        order.roNumber,
        order.roDate,
        order.shipDate || '',
        order.daysROToShip || '',
        order.status,
        order.awbWHToRS || '',
        order.receivedAtShop || '',
        order.awbRSToWH || '',
        order.warehouse,
        order.rsToWHSCUT || '',
        order.location,
        order.awbToCust || '',
        order.freightOut || '',
        order.freightIn || '',
        order.consignment,
        order.lot
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logistics_overview_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Logistic Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Comprehensive logistics and repair order tracking</p>
        </div>
        <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total RO</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalRO}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Units In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalUnitsInStock}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalUnitsSold}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Yield</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalYield}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Filters */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Shop</label>
              <Input
                placeholder="All"
                value={repairShopFilter}
                onChange={(e) => setRepairShopFilter(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">PN</label>
              <Input
                placeholder="All"
                value={partNumberFilter}
                onChange={(e) => setPartNumberFilter(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">RO Number</label>
              <Input
                placeholder="All"
                value={roNumberFilter}
                onChange={(e) => setRONumberFilter(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">RO Date</label>
              <div className="grid grid-cols-2 gap-1">
                <Input
                  type="date"
                  value={roDateFromFilter}
                  onChange={(e) => setRODateFromFilter(e.target.value)}
                  className="h-8 text-xs"
                />
                <Input
                  type="date"
                  value={roDateToFilter}
                  onChange={(e) => setRODateToFilter(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '3600px' }}>
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('pn')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    PN <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('upgradeTo')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Upgrade To <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('stockLine')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Stock Line <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('condition')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Condition <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('serialNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Serial Number <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('manifest')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Manifest <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('totalYield')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Total Yield <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('sold')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Sold <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('stock')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Stock <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('repairShop')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Repair Shop <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('roNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    RO Number <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('roDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    RO Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('shipDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Ship Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('daysROToShip')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Days RO to Ship <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Status <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('awbWHToRS')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    AWB - WH to RS <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('receivedAtShop')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Received at Shop <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('awbRSToWH')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    AWB - RS to WH <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('warehouse')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Warehouse <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('rsToWHSCUT')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    RS to WHS/CUT <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('location')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Location <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('awbToCust')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    AWB to Cust <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('freightOut')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Freight Out <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('freightIn')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Freight In <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('consignment')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Consignment <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('lot')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Lot <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-mono text-gray-900">
                    {order.pn}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.upgradeTo || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.stockLine}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(order.condition)}`}>
                      {order.condition}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-mono text-gray-900">
                    {order.serialNumber}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.manifest}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                    {order.totalYield}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.sold}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.stock}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.repairShop}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                    {order.roNumber}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.roDate}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.shipDate || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.daysROToShip || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.awbWHToRS || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.receivedAtShop || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.awbRSToWH || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.warehouse}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.rsToWHSCUT || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.location}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.awbToCust || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.freightOut || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.freightIn || '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.consignment}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-left text-sm text-gray-900">
                    {order.lot}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Showing x of x - Bottom */}
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Showing {sortedData.length} of {logisticsOrders.length} logistics orders
          </p>
        </div>
      </div>
    </div>
  );
}