import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, Package, Truck, CheckCircle } from "lucide-react";

interface Shipment {
  shipNo: string;
  openDate: string;
  status: 'Open' | 'Packing' | 'Shipped' | 'Delivered' | 'In Transit' | 'Closed';
  shipDate: string | null;
  shipViaAirwayBill: string | null;
  partNumber: string;
  qtyInv: number;
  qtyRes: number;
  company: string;
  country: string;
  shipType: 'Standard' | 'Express' | 'Overnight' | 'Ground';
  soNumber: string | null;
  roNumber: string | null;
  warehouse: string;
}

interface ShippingKPIs {
  openShipments: number;
  packingShipments: number;
  closedShipments: number;
}

interface ShippingMonitorProps {
  openShipments: Shipment[];
  closedShipments: Shipment[];
  kpis: ShippingKPIs;
}

export function ShippingMonitor({ openShipments, closedShipments, kpis }: ShippingMonitorProps) {
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [sortField, setSortField] = useState<keyof Shipment>('openDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [shipNoFilter, setShipNoFilter] = useState<string>('');
  const [shipDateFromFilter, setShipDateFromFilter] = useState<string>('');
  const [shipDateToFilter, setShipDateToFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [airwayBillFilter, setAirwayBillFilter] = useState<string>('');

  const handleSort = (field: keyof Shipment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get current data based on filter
  const currentShipments = shipmentStatusFilter === 'OPEN' ? openShipments : closedShipments;
  
  const filteredData = currentShipments.filter(shipment => {
    if (shipNoFilter && !shipment.shipNo.toLowerCase().includes(shipNoFilter.toLowerCase())) return false;
    if (shipDateFromFilter && shipment.shipDate && new Date(shipment.shipDate) < new Date(shipDateFromFilter)) return false;
    if (shipDateToFilter && shipment.shipDate && new Date(shipment.shipDate) > new Date(shipDateToFilter)) return false;
    if (statusFilter !== 'all' && shipment.status !== statusFilter) return false;
    if (warehouseFilter !== 'all' && shipment.warehouse !== warehouseFilter) return false;
    if (companyFilter !== 'all' && shipment.company !== companyFilter) return false;
    if (airwayBillFilter && shipment.shipViaAirwayBill && !shipment.shipViaAirwayBill.toLowerCase().includes(airwayBillFilter.toLowerCase())) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'openDate' || sortField === 'shipDate') {
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
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Packing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'In Transit': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['Ship No', 'Open Date', 'Status', 'Ship Date', 'Ship Via & Airway Bill', 'PN', 'Qty Inv', 'Qty Res', 'Company', 'Country', 'Ship Type', 'SO', 'RO', 'Warehouse'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(shipment => [
        shipment.shipNo,
        shipment.openDate,
        shipment.status,
        shipment.shipDate || '',
        shipment.shipViaAirwayBill || '',
        shipment.partNumber,
        shipment.qtyInv,
        shipment.qtyRes,
        shipment.company,
        shipment.country,
        shipment.shipType,
        shipment.soNumber || '',
        shipment.roNumber || '',
        shipment.warehouse
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shipmentStatusFilter.toLowerCase()}-shipments.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueStatuses = ['all', 'Open', 'Packing', 'Shipped', 'In Transit', 'Delivered', 'Closed'];
  const uniqueWarehouses = ['all', ...Array.from(new Set([...openShipments, ...closedShipments].map(s => s.warehouse)))];
  const uniqueCompanies = ['all', ...Array.from(new Set([...openShipments, ...closedShipments].map(s => s.company)))];

  const ShipmentTable = ({ 
    shipments, 
    sortField, 
    sortDirection, 
    onSort, 
    title, 
    description, 
    exportFilename 
  }: {
    shipments: Shipment[];
    sortField: keyof Shipment;
    sortDirection: 'asc' | 'desc';
    onSort: (field: keyof Shipment) => void;
    title: string;
    description: string;
    exportFilename: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <Button onClick={() => exportToCSV(shipments, exportFilename)} size="sm" className="flex items-center space-x-2">
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
                <Button variant="ghost" size="sm" onClick={() => onSort('shipNo')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Ship No <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => onSort('openDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Open Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => onSort('shipDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Ship Date <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ship Via & AWB
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => onSort('partNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  PN <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty Inv/Res
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Button variant="ghost" size="sm" onClick={() => onSort('company')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                  Company <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                References
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium bg-purple-600">
                  {shipment.shipNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {shipment.openDate}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {shipment.shipDate || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-32 truncate">
                  {shipment.shipViaAirwayBill || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {shipment.partNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {shipment.qtyInv}/{shipment.qtyRes}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-32 truncate">
                  {shipment.company}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {shipment.country}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {shipment.soNumber && <div className="bg-purple-600">SO: {shipment.soNumber}</div>}
                  {shipment.roNumber && <div className="text-green-600">RO: {shipment.roNumber}</div>}
                  {!shipment.soNumber && !shipment.roNumber && <span className="text-gray-400">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {shipments.length} shipments
        </p>
      </div>
    </div>
  );

  const FilterPanel = ({ 
    shipNoFilter, 
    setShipNoFilter,
    shipDateFromFilter,
    setShipDateFromFilter,
    shipDateToFilter,
    setShipDateToFilter,
    statusFilter,
    setStatusFilter,
    warehouseFilter,
    setWarehouseFilter,
    companyFilter,
    setCompanyFilter,
    airwayBillFilter,
    setAirwayBillFilter
  }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Filter Panel</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ship No</label>
          <Input
            placeholder="Search Ship No"
            value={shipNoFilter}
            onChange={(e) => setShipNoFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ship Date From</label>
          <Input
            type="date"
            value={shipDateFromFilter}
            onChange={(e) => setShipDateFromFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ship Date To</label>
          <Input
            type="date"
            value={shipDateToFilter}
            onChange={(e) => setShipDateToFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
          <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              {uniqueWarehouses.map(warehouse => (
                <SelectItem key={warehouse} value={warehouse}>
                  {warehouse === 'all' ? 'All Warehouses' : warehouse}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCompanies.map(company => (
                <SelectItem key={company} value={company}>
                  {company === 'all' ? 'All Companies' : company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Airway Bill</label>
          <Input
            placeholder="Search AWB"
            value={airwayBillFilter}
            onChange={(e) => setAirwayBillFilter(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.openShipments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Packing Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.packingShipments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.closedShipments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header with Title and Toggle + Export */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Monitor</h3>
              <p className="text-sm text-gray-600">Track shipments and logistics operations</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant={shipmentStatusFilter === 'OPEN' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShipmentStatusFilter('OPEN')}
                >
                  Open
                </Button>
                <Button
                  variant={shipmentStatusFilter === 'CLOSED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShipmentStatusFilter('CLOSED')}
                >
                  Closed
                </Button>
              </div>
              <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ship #</label>
              <Input
                placeholder="Search Ship #"
                value={shipNoFilter}
                onChange={(e) => setShipNoFilter(e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ship Date From</label>
              <Input
                type="date"
                value={shipDateFromFilter}
                onChange={(e) => setShipDateFromFilter(e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ship Date To</label>
              <Input
                type="date"
                value={shipDateToFilter}
                onChange={(e) => setShipDateToFilter(e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'all' ? 'All' : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueWarehouses.map(warehouse => (
                    <SelectItem key={warehouse} value={warehouse}>
                      {warehouse === 'all' ? 'All' : warehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCompanies.map(company => (
                    <SelectItem key={company} value={company}>
                      {company === 'all' ? 'All' : company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('shipNo')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Ship # <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('openDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Open Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('shipDate')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Ship Date <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Ship Via & AWB
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('partNumber')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    PN <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Qty Inv/Res
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('company')} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">
                    Company <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  References
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((shipment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-purple-600">
                    {shipment.shipNo}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {shipment.openDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {shipment.shipDate || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {shipment.shipViaAirwayBill || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.partNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {shipment.qtyInv}/{shipment.qtyRes}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {shipment.company}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {shipment.country}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {shipment.soNumber && <div className="text-purple-600">SO: {shipment.soNumber}</div>}
                    {shipment.roNumber && <div className="text-green-600">RO: {shipment.roNumber}</div>}
                    {!shipment.soNumber && !shipment.roNumber && <span className="text-gray-400">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {sortedData.length} of {currentShipments.length} shipments
          </p>
        </div>
      </div>
    </div>
  );
}