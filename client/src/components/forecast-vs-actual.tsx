import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface ForecastVsActualData {
  month: string;
  actualRevenue: number;
  forecastRevenue: number;
  actualOrders: number;
  forecastOrders: number;
  formattedActualRevenue: string;
  formattedForecastRevenue: string;
}

interface ForecastVsActualProps {
  data: {
    2024: ForecastVsActualData[];
    2025: ForecastVsActualData[];
  };
}

export function ForecastVsActual({ data }: ForecastVsActualProps) {
  const [metricType, setMetricType] = useState<'revenue' | 'orders'>('revenue');
  const [selectedYear, setSelectedYear] = useState<'2024' | '2025'>('2024');

  const getMetricData = () => {
    switch (metricType) {
      case 'revenue':
        return {
          actualKey: 'actualRevenue',
          forecastKey: 'forecastRevenue',
          label: 'Revenue',
          format: (value: number) => value === 0 ? '$0.00M' : `$${(value / 1000000).toFixed(1)}M`
        };
      case 'orders':
        return {
          actualKey: 'actualOrders',
          forecastKey: 'forecastOrders',
          label: 'Orders',
          format: (value: number) => value.toString()
        };
      default:
        return {
          actualKey: 'actualRevenue',
          forecastKey: 'forecastRevenue',
          label: 'Revenue',
          format: (value: number) => value === 0 ? '$0.00M' : `$${(value / 1000000).toFixed(1)}M`
        };
    }
  };

  const metricConfig = getMetricData();
  const currentData = data[selectedYear] || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label} {selectedYear}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium ml-2" style={{ color: entry.color }}>
                {metricConfig.format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Forecast vs Actual Performance</h3>
            <p className="text-sm text-gray-600 mt-1">Monthly comparison of forecasted vs actual {metricConfig.label.toLowerCase()} for {selectedYear}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Select value={selectedYear} onValueChange={(value: '2024' | '2025') => setSelectedYear(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={metricType === 'revenue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMetricType('revenue')}
                className="text-xs"
              >
                Revenue
              </Button>
              <Button
                variant={metricType === 'orders' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMetricType('orders')}
                className="text-xs"
              >
                Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#cbd5e1"
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#cbd5e1"
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={metricConfig.format}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                style={{ fontSize: '11px' }}
              />
              <Bar 
                dataKey={metricConfig.actualKey}
                fill="url(#actualGradient)"
                name={`Actual ${metricConfig.label}`}
                radius={[4, 4, 0, 0]}
                stroke="#7c3aed"
                strokeWidth={1}
              />
              <Bar 
                dataKey={metricConfig.forecastKey}
                fill="url(#forecastGradient)"
                name={`Forecast ${metricConfig.label}`}
                radius={[4, 4, 0, 0]}
                stroke="#a78bfa"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}