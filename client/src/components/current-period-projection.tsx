import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react";

interface CurrentPeriodData {
  forecastedRevenue: {
    value: string;
    vsTarget: string;
    vsLastMonth: string;
    targetTrend: 'positive' | 'negative';
    monthTrend: 'positive' | 'negative';
  };
  forecastedOrders: {
    value: string;
    vsTarget: string;
    vsLastMonth: string;
    targetTrend: 'positive' | 'negative';
    monthTrend: 'positive' | 'negative';
  };
  periodName: string;
}

interface CurrentPeriodProjectionProps {
  data: CurrentPeriodData;
}

export function CurrentPeriodProjection({ data }: CurrentPeriodProjectionProps) {
  const metrics = [
    {
      id: 'revenue',
      label: 'Forecasted Revenue',
      value: data.forecastedRevenue.value,
      vsTarget: data.forecastedRevenue.vsTarget,
      vsLastMonth: data.forecastedRevenue.vsLastMonth,
      targetTrend: data.forecastedRevenue.targetTrend,
      monthTrend: data.forecastedRevenue.monthTrend,
      icon: TrendingUp,
      color: 'bg-purple-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'orders',
      label: 'Forecasted Orders',
      value: data.forecastedOrders.value,
      vsTarget: data.forecastedOrders.vsTarget,
      vsLastMonth: data.forecastedOrders.vsLastMonth,
      targetTrend: data.forecastedOrders.targetTrend,
      monthTrend: data.forecastedOrders.monthTrend,
      icon: Target,
      color: 'bg-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">{data.periodName} Projections</h3>
        <p className="text-sm text-gray-600 mt-1">Current period forecast summary with target and trend comparisons</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className={`${metric.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-600">{metric.label}</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">vs Target:</span>
                    <div className="flex items-center">
                      {metric.targetTrend === 'positive' ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.targetTrend === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.vsTarget}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">vs Last Month:</span>
                    <div className="flex items-center">
                      {metric.monthTrend === 'positive' ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.monthTrend === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.vsLastMonth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}