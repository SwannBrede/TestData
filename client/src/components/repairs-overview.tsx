import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, LabelList } from "recharts";
import { Wrench, ClipboardList, Clock, AlertTriangle, TrendingUp, Building2, Calendar, DollarSign, Package, Users } from "lucide-react";

interface RepairsKPIs {
  totalROIssued: number;
  openROs: number;
  closedROs: number;
  avgTAT: number;
  totalValue: string;
  completionRate: number;
  monthlyVolume: number;
}

interface ROByYearData {
  year: string;
  roCount: number;
}

interface ROStatusData {
  status: string;
  count: number;
  color: string;
}



interface AgingBucket {
  range: string;
  count: number;
  percentage: number;
}

interface RecentActivity {
  date: string;
  roNumber: string;
  shop: string;
  status: string;
  partNumber: string;
}

interface MonthlyTrend {
  month: string;
  opened: number;
  completed: number;
  value: number;
}

interface RepairsOverviewProps {
  kpis: RepairsKPIs;
  roByYearData: ROByYearData[];
  roStatusData: ROStatusData[];
  agingBuckets: AgingBucket[];
  recentActivity: RecentActivity[];
  monthlyTrends: MonthlyTrend[];
}

export function RepairsOverview({ kpis, roByYearData, roStatusData, agingBuckets, recentActivity, monthlyTrends }: RepairsOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Repairs Overview</h1>
        <p className="text-gray-600 mt-1">Comprehensive repair order tracking and operational insights</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open ROs</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.openROs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Wrench className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed ROs</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.closedROs.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg TAT</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.avgTAT} days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalValue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Volume</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.monthlyVolume}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROs by Year */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ROs by Year</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={roByYearData} margin={{ top: 25, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                axisLine={true} 
                tickLine={true}
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#e2e8f0"
              />
              <YAxis hide={true} />
              <Tooltip 
                formatter={(value) => [`${value} ROs`, 'RO Count']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              />
              <Bar dataKey="roCount" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                <LabelList 
                  dataKey="roCount" 
                  position="top" 
                  style={{ fontSize: '12px', fill: '#64748b', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RO Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RO Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={roStatusData}
                cx="50%"
                cy="40%"
                innerRadius={35}
                outerRadius={70}
                fill="#8884d8"
                dataKey="count"
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                paddingAngle={2}
                labelLine={false}
              >
                {roStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} ROs`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* RO Aging Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Clock className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">RO Aging Analysis</h3>
          </div>
          <div className="space-y-6">
            {agingBuckets.map((bucket, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-20">{bucket.range}</span>
                <div className="flex items-center space-x-3 flex-1 ml-4">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${bucket.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{bucket.count}</span>
                  <span className="text-xs text-gray-500 w-8">{bucket.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ height: '420px' }}>
          <div className="flex items-center mb-6">
            <Package className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-purple-600 text-sm">{activity.roNumber}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{activity.shop}</p>
                  <p className="text-xs text-gray-500">{activity.partNumber} • {activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2" style={{ height: '420px' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Repair Order Trends</h3>
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={monthlyTrends} margin={{ top: 10, right: 20, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#e2e8f0"
              />
              <YAxis 
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => value.toLocaleString()}
                width={25}
                stroke="#e2e8f0"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                formatter={(value, name) => [
                  `${value.toLocaleString()}`,
                  name === 'Opened ROs' ? 'Opened ROs' : name === 'Completed ROs' ? 'Completed ROs' : name
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '0px', fontSize: '10px' }}
                iconType="line"
                style={{ fontSize: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="opened" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                name="Opened ROs"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                name="Completed ROs"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </div>
  );
}