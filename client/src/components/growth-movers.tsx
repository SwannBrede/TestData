import { TrendingUp, TrendingDown } from "lucide-react";

interface GrowthMover {
  name: string;
  currentRevenue: string;
  previousRevenue: string;
  growth: string;
  growthPercent: number;
}

interface GrowthMoversProps {
  growingCustomers: GrowthMover[];
  decliningCustomers: GrowthMover[];
}

export function GrowthMovers({ growingCustomers, decliningCustomers }: GrowthMoversProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Growing Customers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="text-xl font-bold text-gray-900">Top 5 Growing Customers</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">Quarter comparison: Q4 2024 vs Q3 2024 revenue</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {growingCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                    <span className="text-sm font-semibold text-green-600">{customer.growth}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {customer.previousRevenue} → {customer.currentRevenue}
                    </span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(customer.growthPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Declining Customers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="text-xl font-bold text-gray-900">Top 5 Declining Customers</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">Quarter comparison: Q4 2024 vs Q3 2024 revenue</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {decliningCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                    <span className="text-sm font-semibold text-red-600">{customer.growth}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {customer.previousRevenue} → {customer.currentRevenue}
                    </span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(Math.abs(customer.growthPercent), 100)}%` }}
                        />
                      </div>
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