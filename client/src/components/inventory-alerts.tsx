import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, Clock, Package, TrendingDown } from "lucide-react";

interface LowStockAlert {
  partNumber: string;
  description: string;
  currentStock: number;
  reorderPoint: number;
  supplier: string;
  leadTime: number;
  stockValue: string;
  lastSale: string;
  category: string;
  warehouse: string;
  urgency: 'Critical' | 'High' | 'Medium';
}

interface AgingInventoryAlert {
  partNumber: string;
  description: string;
  daysInStock: number;
  quantity: number;
  stockValue: string;
  lastMovement: string;
  condition: 'New' | 'Serviceable' | 'Repairable';
  consignment: string;
  warehouse: string;
  category: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

interface InventoryAlertsProps {
  lowStockAlerts: LowStockAlert[];
  agingInventoryAlerts: AgingInventoryAlert[];
}

export function InventoryAlerts({ lowStockAlerts, agingInventoryAlerts }: InventoryAlertsProps) {
  const exportLowStockToCSV = () => {
    const headers = ['Part Number', 'Description', 'Current Stock', 'Reorder Point', 'Supplier', 'Stock Value', 'Last Sale', 'Category', 'Warehouse', 'Urgency'];
    const csvContent = [
      headers.join(','),
      ...lowStockAlerts.map(alert => [
        alert.partNumber,
        alert.description,
        alert.currentStock,
        alert.reorderPoint,
        alert.supplier,
        alert.stockValue,
        alert.lastSale,
        alert.category,
        alert.warehouse,
        alert.urgency
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'low-stock-alerts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportAgingInventoryToCSV = () => {
    const headers = ['Part Number', 'Description', 'Days in Stock', 'Quantity', 'Stock Value', 'Last Movement', 'Condition', 'Consignment', 'Warehouse', 'Category', 'Risk Level'];
    const csvContent = [
      headers.join(','),
      ...agingInventoryAlerts.map(alert => [
        alert.partNumber,
        alert.description,
        alert.daysInStock,
        alert.quantity,
        alert.stockValue,
        alert.lastMovement,
        alert.condition,
        alert.consignment,
        alert.warehouse,
        alert.category,
        alert.riskLevel
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aging-inventory-alerts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Serviceable': return 'bg-blue-100 text-blue-800';
      case 'Repairable': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Low Stock Alerts</h3>
                <p className="text-sm text-gray-600 mt-1">Parts below reorder point requiring immediate attention</p>
              </div>
            </div>
            <Button onClick={exportLowStockToCSV} size="sm" className="flex items-center space-x-2">
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
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sale
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockAlerts.map((alert, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {alert.partNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-48 truncate">
                    {alert.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {alert.currentStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                    {alert.reorderPoint}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-32 truncate">
                    {alert.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {alert.stockValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {alert.lastSale}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(alert.urgency)}`}>
                      {alert.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {lowStockAlerts.length} parts below reorder point
          </p>
        </div>
      </div>

      {/* Aging Inventory Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Aging Inventory Alerts</h3>
                <p className="text-sm text-gray-600 mt-1">Parts aging over 180 days with no movement</p>
              </div>
            </div>
            <Button onClick={exportAgingInventoryToCSV} size="sm" className="flex items-center space-x-2">
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
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days in Stock
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Movement
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consignment
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agingInventoryAlerts.map((alert, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {alert.partNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-48 truncate">
                    {alert.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`font-medium ${alert.daysInStock > 365 ? 'text-red-600' : alert.daysInStock > 270 ? 'text-orange-600' : 'text-yellow-600'}`}>
                      {alert.daysInStock} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {alert.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {alert.stockValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {alert.lastMovement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(alert.condition)}`}>
                      {alert.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-32 truncate">
                    {alert.consignment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(alert.riskLevel)}`}>
                      {alert.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {agingInventoryAlerts.length} parts aging over 180 days
          </p>
        </div>
      </div>
    </div>
  );
}