import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { useState } from 'react';

interface RetentionTrendData {
  month: string;
  newCustomers: number;
  returningCustomers: number;
}

interface RetentionTrendProps {
  data: RetentionTrendData[];
}

export function RetentionTrend({ data }: RetentionTrendProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Customer Retention Trend</h3>
            <p className="text-sm text-gray-600 mt-1">New vs returning customers over time</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Start Date"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="End Date"
            />
            {(startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateFilter}
                className="h-auto p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="newCustomersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="returningCustomersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" strokeOpacity={0.6} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                stroke="#d1d5db"
                strokeWidth={1}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                stroke="#d1d5db"
                strokeWidth={1}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              />
              <Tooltip 
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="line"
                wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
              />
              <Line 
                type="monotone" 
                dataKey="newCustomers" 
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#newCustomersGradient)"
                fillOpacity={1}
                dot={{ 
                  fill: '#fff', 
                  stroke: '#10b981', 
                  strokeWidth: 3, 
                  r: 5
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#10b981', 
                  strokeWidth: 3, 
                  fill: '#fff'
                }}
                name="New Customers"
              />
              <Line 
                type="monotone" 
                dataKey="returningCustomers" 
                stroke="#9333ea" 
                strokeWidth={3}
                fill="url(#returningCustomersGradient)"
                fillOpacity={1}
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
                name="Returning Customers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}