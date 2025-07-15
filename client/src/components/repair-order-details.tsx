import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter } from "lucide-react";

interface RepairOrderDetail {
  roDate: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  aging: number;
  roNumber: string;
  roShop: string;
  item: string;
  pnOut: string;
  pnIn: string;
  modified: string;
  description: string;
  serialNumber: string;
  qtyReser: number;
  qtyRepaired: number;
  repairCost: number;
  freight: number;
  newSL: string;
  retCond: string;
  lot: string;
  soNumber: string;
  location: string;
  whs: string;
  consignCd: string;
  mainComponent: string;
  slAwb: string;
  nextDelDate: string;
  vendorAckDate: string;
  lastDelDate: string;
  dayShip: number;
  recWhs: string;
  recBackQuant: number;
  shipDateFrom: string;
  shNumber: string;
  scrapPercent: number;
}

interface RepairOrderDetailsProps {
  repairOrders: RepairOrderDetail[];
}

export function RepairOrderDetails({ repairOrders }: RepairOrderDetailsProps) {
  const [searchFilters, setSearchFilters] = useState({
    shop: '',
    partNumber: '',
    status: 'all'
  });

  const filteredOrders = useMemo(() => {
    return repairOrders.filter(order => {
      const shopMatch = !searchFilters.shop || order.roShop.toLowerCase().includes(searchFilters.shop.toLowerCase());
      const pnMatch = !searchFilters.partNumber || 
                     order.pnOut.toLowerCase().includes(searchFilters.partNumber.toLowerCase()) ||
                     order.pnIn.toLowerCase().includes(searchFilters.partNumber.toLowerCase());
      const statusMatch = searchFilters.status === 'all' || order.status === searchFilters.status;
      
      return shopMatch && pnMatch && statusMatch;
    });
  }, [repairOrders, searchFilters]);

  const exportToCSV = () => {
    const headers = [
      'RO Date', 'Status', 'Aging', 'RO Nbr', 'RO Shop', 'Item', 'PN Out', 'PN IN', 
      'Modified', 'Description', 'SN', 'Qty Reser.', 'Qty Repaired', 'Repair C.', 
      'Freight', 'New SL', 'Ret. Cond.', 'Lot', 'SO Nbr', 'Location', 'WHS', 
      'Consign. Cd', 'Main Compon.', 'SL AWB', 'Next Del Date', 'Vendor Ack D.', 
      'Last Del Date', 'Day Ship (+4)', 'Rec. WHS', 'Rec. back Quant.', 
      'Ship Date from', 'SH Nbr', 'Scrap %'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.roDate,
        order.status,
        order.aging,
        order.roNumber,
        order.roShop,
        order.item,
        order.pnOut,
        order.pnIn,
        order.modified,
        `"${order.description}"`,
        order.serialNumber,
        order.qtyReser,
        order.qtyRepaired,
        order.repairCost,
        order.freight,
        order.newSL,
        order.retCond,
        order.lot,
        order.soNumber,
        order.location,
        order.whs,
        order.consignCd,
        order.mainComponent,
        order.slAwb,
        order.nextDelDate,
        order.vendorAckDate,
        order.lastDelDate,
        order.dayShip,
        order.recWhs,
        order.recBackQuant,
        order.shipDateFrom,
        order.shNumber,
        order.scrapPercent
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repair-order-details.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgingColor = (aging: number) => {
    if (aging > 60) return 'text-red-600 font-semibold';
    if (aging > 30) return 'text-orange-600 font-medium';
    if (aging > 14) return 'text-yellow-600 font-medium';
    return 'text-gray-900';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Repair Order Details</h3>
              <p className="text-sm text-gray-600 mt-1">Comprehensive repair order tracking and management</p>
            </div>
            <Button onClick={exportToCSV} size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">Filters</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Shop</label>
                <Input
                  placeholder="Filter by repair shop..."
                  value={searchFilters.shop}
                  onChange={(e) => setSearchFilters({...searchFilters, shop: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Part Number</label>
                <Input
                  placeholder="Filter by PN..."
                  value={searchFilters.partNumber}
                  onChange={(e) => setSearchFilters({...searchFilters, partNumber: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={searchFilters.status} onValueChange={(value) => setSearchFilters({...searchFilters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Repair Orders Table */}
        <div className="overflow-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">RO Date</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-50">Status</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px] bg-gray-50">Aging</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-50">RO Nbr</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px] bg-gray-50">RO Shop</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">Item</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">PN Out</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">PN IN</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">Modified</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] bg-gray-50">Description</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">SN</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">Qty Reser.</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">Qty Repaired</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">Repair C.</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px] bg-gray-50">Freight</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px] bg-gray-50">New SL</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">Ret. Cond.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-gray-50">Lot</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">SO Nbr</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">Location</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-gray-50">WHS</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">Consign. Cd</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-50">Main Compon.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">SL AWB</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-50">Next Del Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-50">Vendor Ack D.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-50">Last Del Date</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] bg-gray-50">Day Ship (+4)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">Rec. WHS</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-50">Rec. back Quant.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[110px] bg-gray-50">Ship Date from</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] bg-gray-50">SH Nbr</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px] bg-gray-50">Scrap %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.roDate}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm text-center ${getAgingColor(order.aging)}`}>
                    {order.aging} days
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-purple-600">{order.roNumber}</td>
                  <td className="px-3 py-4 text-sm text-gray-900 max-w-32 truncate">{order.roShop}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.item}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.pnOut}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.pnIn}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.modified}</td>
                  <td className="px-3 py-4 text-sm text-gray-900 max-w-28 truncate" title={order.description}>{order.description}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.serialNumber}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-900">{order.qtyReser}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-900">{order.qtyRepaired}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">${order.repairCost.toLocaleString()}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">${order.freight}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.newSL}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.retCond}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.lot}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-purple-600">{order.soNumber}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.location}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.whs}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.consignCd}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.mainComponent}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.slAwb}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.nextDelDate}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.vendorAckDate}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.lastDelDate}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-900">{order.dayShip}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.recWhs}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-900">{order.recBackQuant}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.shipDateFrom}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{order.shNumber}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-900">{order.scrapPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer - Results Summary */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {repairOrders.length} repair orders
          </p>
        </div>
      </div>
    </div>
  );
}