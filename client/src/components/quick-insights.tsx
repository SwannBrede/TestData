import type { TopCustomer, TopPartNumber, ChannelData } from "@/types/dashboard";

interface QuickInsightsProps {
  topCustomers: TopCustomer[];
  topPartNumbers: TopPartNumber[];
  salesByChannel: ChannelData[];
}

export function QuickInsights({ topCustomers = [], topPartNumbers = [], salesByChannel = [] }: QuickInsightsProps) {
  return (
    <div className="space-y-6">
      {/* Top Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="px-6 py-5 border-b border-gray-100">
            <h4 className="text-xl font-bold text-gray-900">Top 5 Customers</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCustomers.length > 0 ? topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {customer.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {customer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {customer.conversionRate}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No customer data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Part Numbers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="px-6 py-5 border-b border-gray-100">
            <h4 className="text-xl font-bold text-gray-900">Top 5 Part Numbers</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PN
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPartNumbers.length > 0 ? topPartNumbers.map((part, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {part.partNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {part.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {part.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {part.conversionRate}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No part number data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sales by Type Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
        <h4 className="text-xl font-bold text-gray-900 mb-4">Sales by Type</h4>
        <div className="space-y-4">
          {salesByChannel.length > 0 ? salesByChannel.map((type, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-24">{type.name}</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-purple-600 h-4 rounded-full transition-all duration-300" 
                    style={{ width: `${type.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 w-24 text-right">{type.value}</span>
            </div>
          )) : (
            <div className="text-center text-sm text-gray-500">
              No type data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
