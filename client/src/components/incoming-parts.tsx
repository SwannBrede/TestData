import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, Package } from "lucide-react";

interface ROIncoming {
  roNumber: string;
  partNumber: string;
  serial: string;
  qty: number;
  totalCost: string;
  recDate: string;
  condition: 'New' | 'Serviceable' | 'Repairable';
  consignment: string;
  taggedBy: string;
}

interface POIncoming {
  poNumber: string;
  partNumber: string;
  serial: string;
  qty: number;
  unitCost: string;
  recDate: string;
  condition: 'New' | 'Serviceable' | 'Repairable';
  consignment: string;
  taggedBy: string;
}

interface IncomingKPIs {
  unitsReceived: number;
  totalReceivedValue: string;
  topPartNumbers: string[];
}

interface IncomingPartsProps {
  roIncoming: ROIncoming[];
  poIncoming: POIncoming[];
  kpis: IncomingKPIs;
}

export function IncomingParts({ roIncoming, poIncoming, kpis }: IncomingPartsProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Serviceable': return 'bg-blue-100 text-blue-800';
      case 'Repairable': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportROToCSV = () => {
    const headers = ['RO Number', 'PN', 'Serial', 'Qty', 'Total Cost', 'Rec Date', 'Condition', 'Consignment', 'Tagged By'];
    const csvContent = [
      headers.join(','),
      ...roIncoming.map(item => [
        item.roNumber,
        item.partNumber,
        item.serial,
        item.qty,
        item.totalCost,
        item.recDate,
        item.condition,
        item.consignment,
        item.taggedBy
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ro-incoming.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPOToCSV = () => {
    const headers = ['PO Number', 'PN', 'Serial', 'Qty', 'Unit Cost', 'Rec Date', 'Condition', 'Consignment', 'Tagged By'];
    const csvContent = [
      headers.join(','),
      ...poIncoming.map(item => [
        item.poNumber,
        item.partNumber,
        item.serial,
        item.qty,
        item.unitCost,
        item.recDate,
        item.condition,
        item.consignment,
        item.taggedBy
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'po-incoming.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Units Received (7d)</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.unitsReceived}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Received Value</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalReceivedValue}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RO Incoming Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">RO Incoming (Last 7 Days)</h3>
                <p className="text-sm text-gray-600 mt-1">Repair order receipts</p>
              </div>
              <Button onClick={exportROToCSV} size="sm" className="flex items-center space-x-2">
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
                    RO Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rec Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tagged By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roIncoming.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.roNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.partNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.serial}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.qty}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.totalCost}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.recDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.taggedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {roIncoming.length} RO receipts
            </p>
          </div>
        </div>

        {/* PO Incoming Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">PO Incoming (Last 7 Days)</h3>
                <p className="text-sm text-gray-600 mt-1">Purchase order receipts</p>
              </div>
              <Button onClick={exportPOToCSV} size="sm" className="flex items-center space-x-2">
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
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rec Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tagged By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {poIncoming.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.poNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.partNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.serial}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.qty}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.unitCost}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.recDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.taggedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {poIncoming.length} PO receipts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}