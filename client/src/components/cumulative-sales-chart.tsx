import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CumulativeSalesData {
  day: number;
  currentMonth: number;
  previousMonth: number;
}

interface CumulativeSalesChartProps {
  data: CumulativeSalesData[];
}

export function CumulativeSalesChart({ data }: CumulativeSalesChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Cumulative Sales</h3>
        <p className="text-sm text-gray-600 mt-1">Current month vs previous month comparison</p>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 5, left: -10, bottom: 25 }}>
              <defs>
                <linearGradient id="currentMonthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="previousMonthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" strokeOpacity={0.6} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                stroke="#d1d5db"
                strokeWidth={1}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                label={{ value: 'Day of Month', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '11px', fill: '#6b7280' } }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                stroke="#d1d5db"
                strokeWidth={1}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`, 
                  name === 'currentMonth' ? 'Current Month' : 'Previous Month'
                ]}
                labelFormatter={(label) => `Day ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  fontSize: '12px',
                  fontWeight: '500',
                  backdropFilter: 'blur(8px)'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}
                cursor={{ stroke: '#9333ea', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Legend 
                verticalAlign="top"
                height={12}
                wrapperStyle={{ fontSize: '12px', fontWeight: '500', paddingBottom: '0px', marginBottom: '0px' }}
              />
              <Line 
                type="monotone" 
                dataKey="currentMonth" 
                stroke="#9333ea" 
                strokeWidth={3}
                dot={{ 
                  fill: '#fff', 
                  stroke: '#9333ea', 
                  strokeWidth: 3, 
                  r: 5
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#9333ea', 
                  strokeWidth: 3, 
                  fill: '#fff'
                }}
                name="Current Month"
                fill="url(#currentMonthGradient)"
                fillOpacity={1}
              />
              <Line 
                type="monotone" 
                dataKey="previousMonth" 
                stroke="#94a3b8" 
                strokeWidth={3}
                strokeDasharray="8 8"
                dot={{ 
                  fill: '#fff', 
                  stroke: '#94a3b8', 
                  strokeWidth: 3, 
                  r: 4
                }}
                activeDot={{ 
                  r: 7, 
                  stroke: '#94a3b8', 
                  strokeWidth: 3, 
                  fill: '#fff'
                }}
                name="Previous Month"
                fill="url(#previousMonthGradient)"
                fillOpacity={0.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}