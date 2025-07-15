import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineData {
  day: number;
  value: number;
}

interface SparklineMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  data: SparklineData[];
  color: string;
}

interface SparklineMetricsProps {
  metrics: SparklineMetric[];
}

export function SparklineMetrics({ metrics }: SparklineMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
          </div>
          
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metric.data}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-gray-500">30-day trend</p>
          </div>
        </div>
      ))}
    </div>
  );
}