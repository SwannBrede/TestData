import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FunnelData {
  totalQuotes: {
    value: string;
    count: number;
  };
  ordersGenerated: {
    value: string;
    count: number;
  };
  conversionRate: string;
}

interface FunnelViewProps {
  data: FunnelData;
}

export function FunnelView({ data }: FunnelViewProps) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const stages = [
    {
      label: 'Total Quotes',
      value: data.totalQuotes.value,
      count: data.totalQuotes.count,
      width: 100,
      color: 'bg-purple-100 border-purple-300'
    },
    {
      label: 'Orders Generated',
      value: data.ordersGenerated.value,
      count: data.ordersGenerated.count,
      width: 65,
      color: 'bg-green-100 border-green-300'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sales Funnel</h3>
            <p className="text-sm text-gray-600 mt-1">Quote to order conversion overview</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="text-xs border border-gray-300 rounded px-2 py-1"
              placeholder="Start date"
            />
            <span className="text-xs text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="text-xs border border-gray-300 rounded px-2 py-1"
              placeholder="End date"
            />
            {(dateRange.start || dateRange.end) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({ start: '', end: '' })}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">{stage.value}</span>
                  <span className="text-sm text-gray-500 ml-2">({stage.count} items)</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-lg h-12 flex items-center justify-center">
                  <div 
                    className={`${stage.color} border-2 rounded-lg h-10 flex items-center justify-center transition-all duration-300`}
                    style={{ width: `${stage.width}%` }}
                  >
                    <span className="text-sm font-medium text-gray-700">{stage.value}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Conversion Rate */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
              <span className="text-xl font-bold text-gray-900">{data.conversionRate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}