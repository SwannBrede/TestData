import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SegmentData {
  name: string;
  value: number;
  formattedValue: string;
  color: string;
}

interface SegmentBreakdownProps {
  regionData: SegmentData[];
  segmentData: SegmentData[];
}

export function SegmentBreakdown({ regionData, segmentData }: SegmentBreakdownProps) {
  const currentData = regionData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.formattedValue}</p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / currentData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
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
            <h3 className="text-xl font-bold text-gray-900">Revenue by Region</h3>
            <p className="text-sm text-gray-600 mt-1">Geographic distribution of revenue</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-80">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="h-80">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Region</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData} margin={{ top: 8, right: 5, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" strokeOpacity={0.6} />
                <XAxis 
                  dataKey="name" 
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
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
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
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}