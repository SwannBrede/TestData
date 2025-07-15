import { TrendingUp, TrendingDown, DollarSign, FileText, ShoppingCart, BarChart3, Percent, Clock } from "lucide-react";
import type { KPIMetric } from "@/types/dashboard";

interface KPICardProps {
  metric: KPIMetric;
}

export function KPICard({ metric }: KPICardProps) {
  const isPositive = metric.changeType === 'positive';
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dollar': return <DollarSign className="w-6 h-6" />;
      case 'quote': return <FileText className="w-6 h-6" />;
      case 'orders': return <ShoppingCart className="w-6 h-6" />;
      case 'average': return <BarChart3 className="w-6 h-6" />;
      case 'percent': return <Percent className="w-6 h-6" />;
      case 'clock': return <Clock className="w-6 h-6" />;
      default: return <BarChart3 className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.iconColor}`}>
          {getIcon(metric.icon)}
        </div>
      </div>
    </div>
  );
}
