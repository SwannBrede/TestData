import { TrendingUp, Package } from "lucide-react";

interface TopProductRevenue {
  partNumber: string;
  description: string;
  revenue: string;
  orders: number;
  category: string;
}

interface TopProductQuantity {
  partNumber: string;
  description: string;
  quantity: number;
  revenue: string;
  category: string;
}

interface TopMoversProps {
  topByRevenue: TopProductRevenue[];
  topByQuantity: TopProductQuantity[];
}

export function TopMovers({ topByRevenue, topByQuantity }: TopMoversProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Products by Revenue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="text-xl font-bold text-gray-900">Top 5 Products by Revenue</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">Highest revenue generating products</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topByRevenue.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{product.partNumber}</span>
                    <span className="text-sm font-semibold text-green-600">{product.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 max-w-xs truncate">{product.description}</span>
                    <span className="text-xs text-gray-500">{product.orders} orders</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${((index + 1) / topByRevenue.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products by Quantity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="text-xl font-bold text-gray-900">Top 5 Products by Quantity</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">Most frequently sold products by volume</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topByQuantity.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{product.partNumber}</span>
                    <span className="text-sm font-semibold text-blue-600">{product.quantity.toLocaleString()} units</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 max-w-xs truncate">{product.description}</span>
                    <span className="text-xs text-gray-500">{product.revenue}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${((index + 1) / topByQuantity.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}