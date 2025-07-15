import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";

interface SalesTrendData {
  date: string;
  sales: number;
  formattedSales: string;
}

interface SalesTrendChartProps {
  data: SalesTrendData[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filterDataByRange = (data: SalesTrendData[]) => {
    if (!dateRange.start || !dateRange.end) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const formatDateForDisplay = (dateStr: string, type: 'daily' | 'weekly' | 'monthly') => {
    const date = new Date(dateStr);
    
    if (type === 'daily') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (type === 'weekly') {
      return `Week ${Math.ceil(date.getDate() / 7)}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  };

  const processData = (type: 'daily' | 'weekly' | 'monthly') => {
    let filteredData = filterDataByRange(data);
    
    if (type === 'daily') {
      return filteredData.map(item => ({
        ...item,
        displayDate: formatDateForDisplay(item.date, 'daily')
      }));
    }
    
    if (type === 'weekly') {
      // Group data by weeks (7-day periods)
      const weeklyData = [];
      for (let i = 0; i < filteredData.length; i += 7) {
        const weekData = filteredData.slice(i, i + 7);
        const weekTotal = weekData.reduce((sum, day) => sum + day.sales, 0);
        const weekStart = weekData[0]?.date || '';
        
        weeklyData.push({
          date: weekStart,
          displayDate: formatDateForDisplay(weekStart, 'weekly'),
          sales: weekTotal,
          formattedSales: `$${weekTotal.toLocaleString()}`
        });
      }
      return weeklyData;
    }
    
    if (type === 'monthly') {
      // Group data by months
      const monthlyData: { [key: string]: { sales: number, count: number, firstDate: string } } = {};
      
      filteredData.forEach(item => {
        const date = new Date(item.date);
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { sales: 0, count: 0, firstDate: item.date };
        }
        monthlyData[monthKey].sales += item.sales;
        monthlyData[monthKey].count += 1;
      });
      
      return Object.entries(monthlyData).map(([month, data]) => ({
        date: data.firstDate,
        displayDate: month,
        sales: data.sales,
        formattedSales: `$${data.sales.toLocaleString()}`
      }));
    }
    
    return filteredData.map(item => ({
      ...item,
      displayDate: formatDateForDisplay(item.date, 'daily')
    }));
  };

  const processedData = processData(viewType);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sales Trend</h3>
            <p className="text-sm text-gray-600 mt-1">
              {viewType === 'daily' && 'Daily sales performance over the last 30 days'}
              {viewType === 'weekly' && 'Weekly sales performance aggregated by 7-day periods'}
              {viewType === 'monthly' && 'Monthly sales performance comparison'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2 mr-4">
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
            
            {/* View Type Buttons */}
            <Button
              variant={viewType === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('daily')}
              className="text-xs"
            >
              Daily
            </Button>
            <Button
              variant={viewType === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('weekly')}
              className="text-xs"
            >
              Weekly
            </Button>
            <Button
              variant={viewType === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('monthly')}
              className="text-xs"
            >
              Monthly
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData} margin={{ top: 5, right: 5, left: -10, bottom: 15 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" strokeOpacity={0.6} />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11, angle: -45, textAnchor: 'end', fill: '#6b7280' }}
                stroke="#d1d5db"
                strokeWidth={1}
                interval="preserveStartEnd"
                height={40}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickFormatter={(value) => {
                  if (viewType === 'daily') {
                    return value; // Already formatted as "Jan 15"
                  } else if (viewType === 'weekly') {
                    return value; // Already formatted as "Week 1"
                  } else {
                    return value; // Already formatted as "Jan 2025"
                  }
                }}
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
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
                labelFormatter={(label) => `${label}`}
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
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#9333ea" 
                strokeWidth={3}
                dot={{ 
                  fill: '#fff', 
                  stroke: '#9333ea', 
                  strokeWidth: 3, 
                  r: 5,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#9333ea', 
                  strokeWidth: 3, 
                  fill: '#fff',
                  filter: 'drop-shadow(0 4px 8px rgba(147,51,234,0.3))'
                }}
                fill="url(#salesGradient)"
                fillOpacity={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}