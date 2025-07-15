import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Package } from "lucide-react";

interface StuckPackingShipment {
  shipNo: string;
  partNumber: string;
  company: string;
  shipType: 'Standard' | 'Express' | 'Overnight' | 'Ground';
  warehouse: string;
  daysInPacking: number;
  openDate: string;
  expectedShipDate: string;
  priority: 'Critical' | 'High' | 'Medium';
  soNumber: string | null;
  roNumber: string | null;
}

interface AlertsExceptionsProps {
  stuckPackingShipments: StuckPackingShipment[];
}

export function AlertsExceptions({ stuckPackingShipments }: AlertsExceptionsProps) {
  const exportStuckPackingToCSV = () => {
    const headers = ['Ship No', 'PN', 'Company', 'Ship Type', 'Warehouse', 'Days in Packing', 'Open Date', 'Expected Ship Date', 'Priority', 'SO Number', 'RO Number'];
    const csvContent = [
      headers.join(','),
      ...stuckPackingShipments.map(shipment => [
        shipment.shipNo,
        shipment.partNumber,
        shipment.company,
        shipment.shipType,
        shipment.warehouse,
        shipment.daysInPacking,
        shipment.openDate,
        shipment.expectedShipDate,
        shipment.priority,
        shipment.soNumber || 'N/A',
        shipment.roNumber || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stuck-packing-shipments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackingDaysColor = (days: number) => {
    if (days >= 7) return 'text-red-600 font-semibold';
    if (days >= 5) return 'text-orange-600 font-medium';
    if (days >= 3) return 'text-yellow-600 font-medium';
    return 'text-gray-900';
  };

  return (
    <div className="space-y-6">
      {/* Shipments Stuck in Packing */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Shipments Stuck in Packing</h3>
                <p className="text-sm text-gray-600 mt-1">Shipments in packing status for more than 3 days</p>
              </div>
            </div>
            <Button onClick={exportStuckPackingToCSV} size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ship No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ship Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days in Packing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Ship Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SO Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RO Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stuckPackingShipments.map((shipment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {shipment.shipNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.partNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-32 truncate">
                    {shipment.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                    {shipment.shipType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                    {shipment.warehouse}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${getPackingDaysColor(shipment.daysInPacking)}`}>
                    {shipment.daysInPacking} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {shipment.openDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {shipment.expectedShipDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(shipment.priority)}`}>
                      {shipment.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {shipment.soNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {shipment.roNumber || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {stuckPackingShipments.length} shipments stuck in packing status
          </p>
        </div>
      </div>
    </div>
  );
}