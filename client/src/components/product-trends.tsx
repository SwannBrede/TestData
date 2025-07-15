import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, X } from 'lucide-react';
import { useState as useReactState } from 'react';

interface ProductTrendData {
  month: string;
  revenue: number;
  quantity: number;
  formattedRevenue: string;
}

interface ProductTrendsProps {
  data: { [productId: string]: ProductTrendData[] };
  products: { id: string; name: string; category: string; }[];
}

export function ProductTrends({ data, products }: ProductTrendsProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [metricType, setMetricType] = useState<'revenue' | 'quantity'>('revenue');
  const [startDate, setStartDate] = useReactState('');
  const [endDate, setEndDate] = useReactState('');

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const currentData = data[selectedProduct] || [];
  const selectedProductInfo = products.find(p => p.id === selectedProduct);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'revenue' ? 'Revenue' : 'Quantity'}: {
                entry.name === 'revenue' ? entry.payload.formattedRevenue : `${entry.value.toLocaleString()} units`
              }
            </p>
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
            <h3 className="text-xl font-bold text-gray-900">Product Performance Trends</h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedProductInfo ? `${selectedProductInfo.name} (${selectedProductInfo.category})` : 'Select a product to view trends'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-gray-500 text-xs">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilter}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                variant={metricType === 'quantity' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMetricType('quantity')}
                className="text-xs"
              >
                Quantity
              </Button>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <div className="flex items-center space-x-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
                className="text-xs"
              >
                Line
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="text-xs"
              >
                Bar
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6" style={{ marginLeft: '20px', marginRight: '30px', marginTop: '5px' }}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={currentData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6040ED" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6040ED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  axisLine={false}
                  tickFormatter={(value) => 
                    metricType === 'revenue' ? `$${(value / 1000).toFixed(0)}K` : `${value}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey={metricType}
                  stroke="#6040ED" 
                  strokeWidth={3}
                  dot={{ fill: '#ffffff', stroke: '#6040ED', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#6040ED', strokeWidth: 0 }}
                  fill="url(#colorGradient)"
                />
              </LineChart>
            ) : (
              <BarChart data={currentData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6040ED" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6040ED" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  axisLine={false}
                  tickFormatter={(value) => 
                    metricType === 'revenue' ? `$${(value / 1000).toFixed(0)}K` : `${value}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey={metricType}
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}