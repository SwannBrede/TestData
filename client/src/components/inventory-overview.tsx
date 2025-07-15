import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Filter, Download, Package, Calculator, Clock, Wrench } from "lucide-react";

interface InventoryItem {
  aging: number;
  recDate: string;
  partNumber: string;
  description: string;
  qtyAvailable: number;
  qtyOnHand: number;
  qtyOnRepair: number;
  roNumber: string | null;
  soNumber: string | null;
  conditionCode: string;
  stockLine: string;
  serialNumber: string;
  itemCost: string;
  repairCost: string;
  applicationCode: string;
  mfgCode: string;
  consignmentCode: string;
  quoted: number;
  lastQuoted: string;
  trace: string;
  locationCode: string;
  warehouseCode: string;
  lot: string;
  tsn: string;
  csn: string;
  cycleRem: string;
  taggedBy: string;
  tagDate: string;
}

interface InventoryKPIs {
  totalStockQty: number;
  uniquePartNumbers: number;
  stockValue: string;
  qtyOnRepair: number;
  avgAging: number;
}

interface InventoryOverviewProps {
  kpis: InventoryKPIs;
  inventory: InventoryItem[];
}

export function InventoryOverview({ kpis, inventory }: InventoryOverviewProps) {
  const [sortField, setSortField] = useState<keyof InventoryItem>('recDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [partNumberFilter, setPartNumberFilter] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('');
  const [consignmentFilter, setConsignmentFilter] = useState<string>('');
  const [mfgFilter, setMfgFilter] = useState<string>('');
  const [soNumberFilter, setSoNumberFilter] = useState<string>('');
  const [lotFilter, setLotFilter] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = inventory.filter(item => {
    if (partNumberFilter && !item.partNumber.toLowerCase().includes(partNumberFilter.toLowerCase())) return false;
    if (conditionFilter && !item.conditionCode.toLowerCase().includes(conditionFilter.toLowerCase())) return false;
    if (consignmentFilter && !item.consignmentCode.toLowerCase().includes(consignmentFilter.toLowerCase())) return false;
    if (mfgFilter && !item.mfgCode.toLowerCase().includes(mfgFilter.toLowerCase())) return false;
    if (soNumberFilter && item.soNumber && !item.soNumber.toLowerCase().includes(soNumberFilter.toLowerCase())) return false;
    if (lotFilter && !item.lot.toLowerCase().includes(lotFilter.toLowerCase())) return false;
    if (warehouseFilter && !item.warehouseCode.toLowerCase().includes(warehouseFilter.toLowerCase())) return false;
    if (locationFilter && !item.locationCode.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

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
    const headers = ['PN', 'Description', 'Condition', 'Qty Available', 'Qty On Hand', 'Qty on Repair', 'RO Number', 'SO Number', 'Stock Line', 'Serial Number', 'Item Cost', 'Repair Cost', 'Aging', 'Rec Date', 'Application'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(item => [
        item.partNumber,
        item.description,
        item.condition,
        item.qtyAvailable,
        item.qtyOnHand,
        item.qtyOnRepair,
        item.roNumber || '',
        item.soNumber || '',
        item.stockLine,
        item.serialNumber,
        item.itemCost,
        item.repairCost,
        item.aging,
        item.recDate,
        item.application
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-overview.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stock Qty</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalStockQty.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Part Numbers</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.uniquePartNumbers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.stockValue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Qty on Repair</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.qtyOnRepair}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Aging</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.avgAging} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Inventory List</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage stock levels and track inventory</p>
                </div>
                <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>
            
            {/* Filter Panel Above Table */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PN</label>
                  <Input
                    type="text"
                    placeholder="Search PN..."
                    value={partNumberFilter}
                    onChange={(e) => setPartNumberFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Consignment Code</label>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={consignmentFilter}
                    onChange={(e) => setConsignmentFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Condition Code</label>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mfg Code</label>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={mfgFilter}
                    onChange={(e) => setMfgFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SO #</label>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={soNumberFilter}
                    onChange={(e) => setSoNumberFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Lot</label>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={lotFilter}
                    onChange={(e) => setLotFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Warehouse Code</label>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={warehouseFilter}
                    onChange={(e) => setWarehouseFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Location Code</label>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>

            <div className="max-h-[600px] overflow-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Aging</th>
                    <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Rec Date</th>
                    <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">PN</th>
                    <th className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Description</th>
                    <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Qty Available</th>
                    <th className="w-14 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Qty OH</th>
                    <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Qty On Repair</th>
                    <th className="w-14 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">RO #</th>
                    <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">SO #</th>
                    <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Condition Code</th>
                    <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Stock Line</th>
                    <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Serial #</th>
                    <th className="w-18 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Item Cost</th>
                    <th className="w-18 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Repair Cost</th>
                    <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Application Code</th>
                    <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Mfg Code</th>
                    <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Consignment Code</th>
                    <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">#Quoted</th>
                    <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Last Quoted</th>
                    <th className="w-14 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Trace</th>
                    <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Location Code</th>
                    <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Warehouse Code</th>
                    <th className="w-14 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Lot</th>
                    <th className="w-14 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">TSN</th>
                    <th className="w-14 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">CSN</th>
                    <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Cycle Rem</th>
                    <th className="w-18 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Tagged By</th>
                    <th className="w-18 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Tag Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.aging}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.recDate}</td>
                      <td className="px-3 py-3 text-xs text-left font-medium text-purple-600 whitespace-nowrap">{item.partNumber}</td>
                      <td className="px-3 py-3 text-xs text-left truncate" title={item.description}>{item.description}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.qtyAvailable}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.qtyOnHand}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.qtyOnRepair}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.roNumber || '-'}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.soNumber || '-'}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.conditionCode}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.stockLine}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.serialNumber}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.itemCost}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.repairCost}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.applicationCode}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.mfgCode}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.consignmentCode}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.quoted}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.lastQuoted}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.trace}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.locationCode}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.warehouseCode}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.lot}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.tsn}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.csn}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.cycleRem}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.taggedBy}</td>
                      <td className="px-3 py-3 text-xs text-left whitespace-nowrap">{item.tagDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {sortedData.length} of {inventory.length} inventory items
              </p>
        </div>
      </div>
    </div>
  );
}