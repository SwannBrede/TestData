import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

interface ShipmentStatusData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyShipmentData {
  month: string;
  open: number;
  closed: number;
}

interface ShippingTimeData {
  month: string;
  avgDays: number;
}

interface ShippingVolumeData {
  month: string;
  '2024': number;
  '2025': number;
}

interface CountryDistributionData {
  country: string;
  shipments: number;
  percentage: number;
}

interface LogisticsKPIsProps {
  shipmentStatusData: ShipmentStatusData[];
  monthlyShipmentData: MonthlyShipmentData[];
  shippingTimeData: ShippingTimeData[];
  shippingVolumeData: ShippingVolumeData[];
  countryDistributionData: CountryDistributionData[];
}

export function LogisticsKPIs({ 
  shipmentStatusData, 
  monthlyShipmentData, 
  shippingTimeData, 
  shippingVolumeData, 
  countryDistributionData 
}: LogisticsKPIsProps) {
  const CustomLabel = ({ x, y, width, height, value }: any) => {
    return (
      <text x={x + width + 8} y={y + height / 2} fill="#1f2937" textAnchor="start" dominantBaseline="middle" fontSize="14" fontWeight="600">
        {value}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* First Row - 3 Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Open vs Closed Shipments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Open vs Closed Shipments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyShipmentData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} shipments`, name === 'open' ? 'Open' : 'Closed']} 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                itemStyle={{ marginRight: '20px', fontSize: '12px' }}
              />
              <Bar dataKey="open" fill="#8b5cf6" name="Open" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closed" fill="#10b981" name="Closed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Status Ratio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Shipment Status Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={shipmentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {shipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} shipments`, 'Count']} 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Distribution by Country */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Shipment Distribution by Country</h3>
          <div className="space-y-4">
            {countryDistributionData.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-700 w-20 text-right">{country.country}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-8 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(country.shipments / Math.max(...countryDistributionData.map(c => c.shipments))) * 100}%` }}
                    >
                      <span className="text-white text-sm font-semibold">{country.shipments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row - 2 Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avg Shipping Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Avg Shipping Time (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shippingTimeData} margin={{ top: 20, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} days`, 'Avg Days to Ship']} 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgDays" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Shipping Volume */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Shipping Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shippingVolumeData} margin={{ top: 20, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} shipments`, name]} 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                itemStyle={{ marginRight: '20px', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="2024" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
                name="2024"
              />
              <Line 
                type="monotone" 
                dataKey="2025" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ef4444' }}
                name="2025"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </div>
  );
}