import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { KPICard } from "@/components/kpi-card";
import { PerformanceTable } from "@/components/performance-table";
import { QuickInsights } from "@/components/quick-insights";
import { SalesTrendChart } from "@/components/sales-trend-chart";
import { CumulativeSalesChart } from "@/components/cumulative-sales-chart";
import { FunnelView } from "@/components/funnel-view";
import { SparklineMetrics } from "@/components/sparkline-metrics";
import { CustomerLeaderboard } from "@/components/customer-leaderboard";
import { RetentionTrend } from "@/components/retention-trend";
import { GrowthMovers } from "@/components/growth-movers";
import { SegmentBreakdown } from "@/components/segment-breakdown";
import { ProductLeaderboard } from "@/components/product-leaderboard";
import { TopMovers } from "@/components/top-movers";
import { ProductTrends } from "@/components/product-trends";

import { ForecastVsActual } from "@/components/forecast-vs-actual";
import { CurrentPeriodProjection } from "@/components/current-period-projection";
import { ForecastByCustomer } from "@/components/forecast-by-customer";
import { ForecastByProduct } from "@/components/forecast-by-product";
import { SalesOrdersUpdated } from "@/components/sales-orders-updated";
import { QuotesUpdated } from "@/components/quotes-updated";
import { PurchaseOrdersUpdated } from "@/components/purchase-orders-updated";
import { InventoryOverview } from "@/components/inventory-overview";
import { LotsStockDistribution } from "@/components/lots-stock-distribution";
import { IncomingParts } from "@/components/incoming-parts";
import { InventoryAlerts } from "@/components/inventory-alerts";
import { AccountPayables } from "@/components/account-payables";
import { AccountReceivables } from "@/components/account-receivables";
import { CashFlowOverview } from "@/components/cash-flow-overview";
import { LatePayments } from "@/components/late-payments";
import { MonthlyFinanceSummary } from "@/components/monthly-finance-summary";
import { RepairOrderOverview } from "@/components/repair-order-overview";
import { LogisticsOverview } from "@/components/logistics-overview";
import { ShippingMonitor } from "@/components/shipping-monitor";
import { LogisticsKPIs } from "@/components/logistics-kpis";
import { AlertsExceptions } from "@/components/alerts-exceptions";
import { RepairsOverview } from "@/components/repairs-overview";
import { RepairOrderDetails } from "@/components/repair-order-details";

import { TATAnalysis } from "@/components/tat-analysis";
import { ScrapQuality } from "@/components/scrap-quality";
import { VendorInsights } from "@/components/vendor-insights";
import { ExecutiveOverview } from "@/components/executive-overview";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import clientLogo from "@assets/client-logo.png";
import type { DashboardCategory, SalesTab, OperationsTab, InventoryTab, FinanceTab, LogisticsTab, RepairsTab, ManagementTab, SalesAnalytics, SalesTrends, CustomerAnalytics, ProductAnalytics, ForecastingAnalytics, OperationsData, InventoryData, FinanceData, LogisticsData, RepairsData, ManagementData } from "@/types/dashboard";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<DashboardCategory>('sales');
  const [activeTab, setActiveTab] = useState<SalesTab>('executive-snapshot');
  const [activeOperationsTab, setActiveOperationsTab] = useState<OperationsTab>('sales-orders');
  const [activeInventoryTab, setActiveInventoryTab] = useState<InventoryTab>('overview');
  const [activeFinanceTab, setActiveFinanceTab] = useState<FinanceTab>('account-payables');
  const [activeLogisticsTab, setActiveLogisticsTab] = useState<LogisticsTab>('repair-order-overview');
  const [activeRepairsTab, setActiveRepairsTab] = useState<RepairsTab>('overview');
  const [activeManagementTab, setActiveManagementTab] = useState<ManagementTab>('executive-overview');

  const { data: salesData, isLoading, refetch } = useQuery<SalesAnalytics>({
    queryKey: ['/data/sales.json'],
    queryFn: async () => {
      const response = await fetch('/data/sales.json');
      if (!response.ok) {
        throw new Error('Failed to load sales data');
      }
      return response.json();
    }
  });

  const { data: trendsData, isLoading: trendsLoading } = useQuery<SalesTrends>({
    queryKey: ['/data/sales-trends.json'],
    queryFn: async () => {
      const response = await fetch('/data/sales-trends.json');
      if (!response.ok) {
        throw new Error('Failed to load trends data');
      }
      return response.json();
    }
  });

  const { data: customerAnalytics, isLoading: customerLoading } = useQuery<CustomerAnalytics>({
    queryKey: ['/data/customer-analytics.json'],
    queryFn: async () => {
      const response = await fetch('/data/customer-analytics.json');
      if (!response.ok) {
        throw new Error('Failed to load customer analytics data');
      }
      return response.json();
    }
  });

  const { data: productAnalytics, isLoading: productLoading } = useQuery<ProductAnalytics>({
    queryKey: ['/data/product-analytics.json'],
    queryFn: async () => {
      const response = await fetch('/data/product-analytics.json');
      if (!response.ok) {
        throw new Error('Failed to load product analytics data');
      }
      return response.json();
    }
  });

  const { data: forecastingAnalytics, isLoading: forecastingLoading } = useQuery<ForecastingAnalytics>({
    queryKey: ['/data/forecasting-analytics.json'],
    queryFn: async () => {
      const response = await fetch('/data/forecasting-analytics.json');
      if (!response.ok) {
        throw new Error('Failed to load forecasting analytics data');
      }
      return response.json();
    }
  });

  const { data: operationsData, isLoading: operationsLoading } = useQuery<OperationsData>({
    queryKey: ['/data/operations.json'],
    queryFn: async () => {
      const response = await fetch('/data/operations.json');
      if (!response.ok) {
        throw new Error('Failed to load operations data');
      }
      return response.json();
    }
  });

  const { data: operationsUpdatedData, isLoading: operationsUpdatedLoading } = useQuery({
    queryKey: ['/data/operations_updated.json'],
    queryFn: async () => {
      const response = await fetch('/data/operations_updated.json');
      if (!response.ok) {
        throw new Error('Failed to load updated operations data');
      }
      return response.json();
    }
  });

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery<InventoryData>({
    queryKey: ['/data/inventory_new.json'],
    queryFn: async () => {
      const response = await fetch('/data/inventory_new.json');
      if (!response.ok) {
        throw new Error('Failed to load inventory data');
      }
      return response.json();
    }
  });

  const { data: financeData, isLoading: financeLoading } = useQuery<FinanceData>({
    queryKey: ['/data/finance.json'],
    queryFn: async () => {
      const response = await fetch('/data/finance.json');
      if (!response.ok) {
        throw new Error('Failed to load finance data');
      }
      return response.json();
    }
  });

  const { data: logisticsData, isLoading: logisticsLoading } = useQuery<LogisticsData>({
    queryKey: ['/data/logistics.json'],
    queryFn: async () => {
      const response = await fetch('/data/logistics.json');
      if (!response.ok) {
        throw new Error('Failed to load logistics data');
      }
      return response.json();
    }
  });

  const { data: repairsData, isLoading: repairsLoading } = useQuery<RepairsData>({
    queryKey: ['/data/repairs.json'],
    queryFn: async () => {
      const response = await fetch('/data/repairs.json');
      if (!response.ok) {
        throw new Error('Failed to load repairs data');
      }
      return response.json();
    }
  });

  const { data: managementData, isLoading: managementLoading } = useQuery<ManagementData>({
    queryKey: ['/data/management.json'],
    queryFn: async () => {
      const response = await fetch('/data/management.json');
      if (!response.ok) {
        throw new Error('Failed to load management data');
      }
      return response.json();
    }
  });

  const scrollToTop = () => {
    // Find the scrollable content area by ID
    const contentArea = document.getElementById('scrollable-content');
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback to window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: DashboardCategory) => {
    setActiveCategory(category);
    setLocation(`/dashboard/${category}`);
    scrollToTop();
    if (category === 'sales') {
      setActiveTab('executive-snapshot');
    } else if (category === 'operations') {
      setActiveOperationsTab('sales-orders');
    } else if (category === 'inventory') {
      setActiveInventoryTab('overview');
    } else if (category === 'finance') {
      setActiveFinanceTab('account-payables');
    } else if (category === 'logistics') {
      setActiveLogisticsTab('repair-order-overview');
    } else if (category === 'repairs') {
      setActiveRepairsTab('overview');
    } else if (category === 'management') {
      setActiveManagementTab('executive-overview');
    }
  };

  const handleTabSelect = (tab: SalesTab) => {
    setActiveTab(tab);
    scrollToTop();
  };

  const handleRefresh = () => {
    refetch();
  };

  const getCategoryTitle = (category: DashboardCategory) => {
    const titles = {
      sales: 'Sales Dashboard',
      operations: 'Operations Dashboard',
      inventory: 'Inventory Dashboard',
      finance: 'Finance Dashboard',
      logistics: 'Logistics Dashboard',
      repairs: 'Repairs Dashboard',
      management: 'Management Dashboard'
    };
    return titles[category] || 'Dashboard';
  };

  const salesTabs = [
    { id: 'executive-snapshot', label: 'Executive Snapshot' },
    { id: 'trends', label: 'Trends' },
    { id: 'customers', label: 'Customers' },
    { id: 'products', label: 'Products' },
    { id: 'forecasting', label: 'Forecasting' }
  ] as const;

  const operationsTabs = [
    { id: 'sales-orders', label: 'Sales Orders' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'purchase-orders', label: 'Purchase Orders' }
  ] as const;

  const handleOperationsTabSelect = (tab: OperationsTab) => {
    setActiveOperationsTab(tab);
    scrollToTop();
  };

  const inventoryTabs = [
    { id: 'overview', label: 'Inventory Overview' },
    { id: 'lots-distribution', label: 'Lots & Stock Distribution' },
    { id: 'incoming-parts', label: 'Incoming Parts (PO & RO)' },
    { id: 'alerts', label: 'Alerts' }
  ] as const;

  const handleInventoryTabSelect = (tab: InventoryTab) => {
    setActiveInventoryTab(tab);
    scrollToTop();
  };

  const financeTabs = [
    { id: 'account-payables', label: 'Account Payables' },
    { id: 'account-receivables', label: 'Account Receivables' },
    { id: 'cash-flow', label: 'Cash Flow Overview' },
    { id: 'late-payments', label: 'Late Payments' },
    { id: 'monthly-summary', label: 'Monthly Finance Summary' }
  ] as const;

  const handleFinanceTabSelect = (tab: FinanceTab) => {
    setActiveFinanceTab(tab);
    scrollToTop();
  };

  const logisticsTabs = [
    { id: 'repair-order-overview', label: 'Logistic Overview' },
    { id: 'shipping-monitor', label: 'Shipping Monitor' },
    { id: 'logistics-kpis', label: 'Logistics KPIs' },
    { id: 'alerts-exceptions', label: 'Alerts & Exceptions' }
  ] as const;

  const handleLogisticsTabSelect = (tab: LogisticsTab) => {
    setActiveLogisticsTab(tab);
    scrollToTop();
  };

  const repairsTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ro-details', label: 'RO Details' },
    { id: 'tat-analysis', label: 'TAT Analysis' },
    { id: 'scrap-quality', label: 'Scrap & Quality' },
    { id: 'vendor-insights', label: 'Vendor Insights' }
  ] as const;

  const handleRepairsTabSelect = (tab: RepairsTab) => {
    setActiveRepairsTab(tab);
    scrollToTop();
  };

  const managementTabs = [
    { id: 'executive-overview', label: 'Executive Overview' }
  ] as const;

  const handleManagementTabSelect = (tab: ManagementTab) => {
    setActiveManagementTab(tab);
    scrollToTop();
  };

  if (isLoading || trendsLoading || customerLoading || productLoading || forecastingLoading || operationsLoading || inventoryLoading || financeLoading || logisticsLoading || repairsLoading || managementLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          activeCategory={activeCategory} 
          onCategorySelect={handleCategorySelect} 
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin bg-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 divide-x divide-gray-200">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategorySelect={handleCategorySelect}
        isCollapsed={isCollapsed}
        onToggleCollapsed={() => setIsCollapsed(!isCollapsed)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden" id="main-content">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img 
                src={clientLogo} 
                alt="Client Logo" 
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {getCategoryTitle(activeCategory)}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {salesData?.lastUpdated || 'Unknown'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleRefresh} className="text-sm bg-purple-600 hover:bg-purple-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </header>

        {/* Tab Navigation - Sales category */}
        {activeCategory === 'sales' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
            <nav className="flex space-x-4 lg:space-x-8">
              {salesTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Navigation - Operations category */}
        {activeCategory === 'operations' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
            <nav className="flex space-x-4 lg:space-x-8">
              {operationsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleOperationsTabSelect(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    activeOperationsTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Navigation - Inventory category */}
        {activeCategory === 'inventory' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
            <nav className="flex space-x-4 lg:space-x-8">
              {inventoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleInventoryTabSelect(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    activeInventoryTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Navigation - Finance category */}
        {activeCategory === 'finance' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
            <nav className="flex space-x-4 lg:space-x-8">
              {financeTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleFinanceTabSelect(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    activeFinanceTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Navigation - Logistics category */}
        {activeCategory === 'logistics' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
            <nav className="flex space-x-4 lg:space-x-8">
              {logisticsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleLogisticsTabSelect(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    activeLogisticsTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Navigation - Repairs category */}
        {activeCategory === 'repairs' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
            <nav className="flex space-x-4 lg:space-x-8">
              {repairsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleRepairsTabSelect(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    activeRepairsTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Navigation - Management category */}
        {activeCategory === 'management' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
            <nav className="flex space-x-4 lg:space-x-8">
              {managementTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleManagementTabSelect(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    activeManagementTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-6" id="scrollable-content">
          {activeCategory === 'sales' && activeTab === 'executive-snapshot' ? (
            <div className="max-w-full space-y-6 lg:space-y-8">
              {/* Section A - KPI Cards & Sales by Type */}
              {salesData?.kpiMetrics && (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
                    <p className="text-sm text-gray-600 mt-1">Performance indicators for the last 30 days</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* KPI Cards - Takes 3 columns */}
                    <div className="lg:col-span-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {salesData.kpiMetrics.map((metric) => (
                          <KPICard key={metric.id} metric={metric} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Sales by Type - Takes 1 column */}
                    <div className="lg:col-span-1">
                      {salesData?.salesByType && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                          <h4 className="text-xl font-bold text-gray-900 mb-4">Sales by Type</h4>
                          <div className="space-y-4">
                            {salesData.salesByType.map((type, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 w-20">{type.name}</span>
                                <div className="flex items-center flex-1 mx-4">
                                  <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div 
                                      className="bg-purple-600 h-4 rounded-full transition-all duration-300" 
                                      style={{ width: `${type.percentage}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 w-20 text-right">{type.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section B - Performance Summary */}
              {salesData?.performanceData && (
                <PerformanceTable data={salesData.performanceData} />
              )}

              {/* Section C - Revenue Breakdown */}
              {salesData && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
                    <p className="text-sm text-gray-600 mt-1">Top customers and part numbers</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top 5 Customers */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="px-6 py-5 border-b border-gray-100">
                        <h4 className="text-xl font-bold text-gray-900">Top 5 Customers</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Orders
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Conversion Rate %
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {salesData.topCustomers.map((customer, index) => (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {customer.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {customer.revenue}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {customer.orders}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                  {customer.conversionRate}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Top 5 Part Numbers */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="px-6 py-5 border-b border-gray-100">
                        <h4 className="text-xl font-bold text-gray-900">Top 5 Part Numbers</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PN
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Conversion Rate %
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {salesData.topPartNumbers.map((part, index) => (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {part.partNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {part.revenue}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {part.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                  {part.conversionRate}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeCategory === 'sales' && activeTab === 'trends' ? (
            <div className="max-w-full space-y-6 lg:space-y-8">
              {/* Section A - Sales Trend Chart */}
              {trendsData?.salesTrendData && (
                <SalesTrendChart data={trendsData.salesTrendData} />
              )}

              {/* Section B - Cumulative Sales Chart */}
              {trendsData?.cumulativeSalesData && (
                <CumulativeSalesChart data={trendsData.cumulativeSalesData} />
              )}

              {/* Section C - Funnel View */}
              {trendsData?.funnelData && (
                <FunnelView data={trendsData.funnelData} />
              )}

              {/* Section D - Sparkline Metrics */}
              {trendsData?.sparklineMetrics && (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Key Trends</h3>
                    <p className="text-sm text-gray-600 mt-1">30-day performance indicators with trend visualization</p>
                  </div>
                  <SparklineMetrics metrics={trendsData.sparklineMetrics} />
                </div>
              )}
            </div>
          ) : activeCategory === 'sales' && activeTab === 'customers' ? (
            <div className="max-w-full space-y-6 lg:space-y-8">
              {/* Section A - Customer Leaderboard */}
              {customerAnalytics?.leaderboard && (
                <CustomerLeaderboard data={customerAnalytics.leaderboard} />
              )}

              {/* Section B - Retention Trend */}
              {customerAnalytics?.retentionTrend && (
                <RetentionTrend data={customerAnalytics.retentionTrend} />
              )}

              {/* Section C - Growth Movers */}
              {customerAnalytics?.growingCustomers && customerAnalytics?.decliningCustomers && (
                <GrowthMovers 
                  growingCustomers={customerAnalytics.growingCustomers}
                  decliningCustomers={customerAnalytics.decliningCustomers}
                />
              )}

              {/* Section D - Segment Breakdown */}
              {customerAnalytics?.regionData && customerAnalytics?.segmentData && (
                <SegmentBreakdown 
                  regionData={customerAnalytics.regionData}
                  segmentData={customerAnalytics.segmentData}
                />
              )}
            </div>
          ) : activeCategory === 'sales' && activeTab === 'products' ? (
            <div className="max-w-full space-y-6 lg:space-y-8">
              {/* Section A - Product Leaderboard */}
              {productAnalytics?.leaderboard && (
                <ProductLeaderboard data={productAnalytics.leaderboard} />
              )}

              {/* Section B - Top Movers */}
              {productAnalytics?.topByRevenue && productAnalytics?.topByQuantity && (
                <TopMovers 
                  topByRevenue={productAnalytics.topByRevenue}
                  topByQuantity={productAnalytics.topByQuantity}
                />
              )}

              {/* Section C - Product Trends */}
              {productAnalytics?.productTrends && productAnalytics?.products && (
                <ProductTrends 
                  data={productAnalytics.productTrends}
                  products={productAnalytics.products}
                />
              )}


            </div>
          ) : activeCategory === 'sales' && activeTab === 'forecasting' ? (
            <div className="max-w-full space-y-6 lg:space-y-8">
              {/* Section A - Forecast vs Actual */}
              {forecastingAnalytics?.forecastVsActual && (
                <ForecastVsActual data={forecastingAnalytics.forecastVsActual} />
              )}

              {/* Section B - Forecast by Customer */}
              {forecastingAnalytics?.customerForecasts && (
                <ForecastByCustomer data={forecastingAnalytics.customerForecasts} />
              )}

              {/* Section C - Forecast by Product */}
              {forecastingAnalytics?.productForecasts && (
                <ForecastByProduct data={forecastingAnalytics.productForecasts} />
              )}
            </div>
          ) : activeCategory === 'operations' && activeOperationsTab === 'sales-orders' ? (
            <div className="max-w-full">
              {operationsUpdatedData?.salesOrdersUpdated && (
                <SalesOrdersUpdated data={operationsUpdatedData.salesOrdersUpdated} />
              )}
            </div>
          ) : activeCategory === 'operations' && activeOperationsTab === 'quotes' ? (
            <div className="max-w-full">
              {operationsUpdatedData?.quotes && (
                <QuotesUpdated data={operationsUpdatedData.quotes} />
              )}
            </div>
          ) : activeCategory === 'operations' && activeOperationsTab === 'purchase-orders' ? (
            <div className="max-w-full">
              {operationsUpdatedData?.purchaseOrders && (
                <PurchaseOrdersUpdated data={operationsUpdatedData.purchaseOrders} />
              )}
            </div>
          ) : activeCategory === 'inventory' && activeInventoryTab === 'overview' ? (
            <div className="max-w-full">
              {inventoryData?.overview && (
                <InventoryOverview 
                  kpis={inventoryData.overview.kpis}
                  inventory={inventoryData.overview.inventory}
                />
              )}
            </div>
          ) : activeCategory === 'inventory' && activeInventoryTab === 'lots-distribution' ? (
            <div className="max-w-full">
              {inventoryData?.lotsDistribution && (
                <LotsStockDistribution 
                  lots={inventoryData.lotsDistribution.lots}
                  consignmentData={inventoryData.lotsDistribution.consignmentData}
                  warehouseData={inventoryData.lotsDistribution.warehouseData}
                  agingData={inventoryData.lotsDistribution.agingData}
                />
              )}
            </div>
          ) : activeCategory === 'inventory' && activeInventoryTab === 'incoming-parts' ? (
            <div className="max-w-full">
              {inventoryData?.incomingParts && (
                <IncomingParts 
                  roIncoming={inventoryData.incomingParts.roIncoming}
                  poIncoming={inventoryData.incomingParts.poIncoming}
                  kpis={inventoryData.incomingParts.kpis}
                />
              )}
            </div>
          ) : activeCategory === 'inventory' && activeInventoryTab === 'alerts' ? (
            <div className="max-w-full">
              {inventoryData?.alerts && (
                <InventoryAlerts 
                  lowStockAlerts={inventoryData.alerts.lowStockAlerts}
                  agingInventoryAlerts={inventoryData.alerts.agingInventoryAlerts}
                />
              )}
            </div>
          ) : activeCategory === 'finance' && activeFinanceTab === 'account-payables' ? (
            <div className="max-w-full">
              {financeData?.accountPayables && (
                <AccountPayables 
                  payables={financeData.accountPayables.payables}
                  kpis={financeData.accountPayables.kpis}
                />
              )}
            </div>
          ) : activeCategory === 'finance' && activeFinanceTab === 'account-receivables' ? (
            <div className="max-w-full">
              {financeData?.accountReceivables && (
                <AccountReceivables 
                  receivables={financeData.accountReceivables.receivables}
                  kpis={financeData.accountReceivables.kpis}
                />
              )}
            </div>
          ) : activeCategory === 'finance' && activeFinanceTab === 'cash-flow' ? (
            <div className="max-w-full">
              {financeData?.cashFlow && (
                <CashFlowOverview 
                  data={financeData.cashFlow.data}
                  kpis={financeData.cashFlow.kpis}
                />
              )}
            </div>
          ) : activeCategory === 'finance' && activeFinanceTab === 'late-payments' ? (
            <div className="max-w-full">
              {financeData?.latePayments && (
                <LatePayments 
                  overdueReceivables={financeData.latePayments.overdueReceivables}
                  overduePayables={financeData.latePayments.overduePayables}
                  companyOverdueData={financeData.latePayments.companyOverdueData}
                  agingBuckets={financeData.latePayments.agingBuckets}
                />
              )}
            </div>
          ) : activeCategory === 'finance' && activeFinanceTab === 'monthly-summary' ? (
            <div className="max-w-full">
              {financeData?.monthlySummary && (
                <MonthlyFinanceSummary 
                  monthlyData={financeData.monthlySummary.monthlyData}
                  topClients={financeData.monthlySummary.topClients}
                  topVendors={financeData.monthlySummary.topVendors}
                  kpis={financeData.monthlySummary.kpis}
                />
              )}
            </div>
          ) : activeCategory === 'logistics' && activeLogisticsTab === 'repair-order-overview' ? (
            <div className="max-w-full">
              {logisticsData?.repairOrderOverview && (
                <LogisticsOverview 
                  logisticsOrders={logisticsData.repairOrderOverview.logisticsOrders}
                  kpis={logisticsData.repairOrderOverview.kpis}
                />
              )}
            </div>
          ) : activeCategory === 'logistics' && activeLogisticsTab === 'shipping-monitor' ? (
            <div className="max-w-full">
              {logisticsData?.shippingMonitor && (
                <ShippingMonitor 
                  openShipments={logisticsData.shippingMonitor.openShipments}
                  closedShipments={logisticsData.shippingMonitor.closedShipments}
                  kpis={logisticsData.shippingMonitor.kpis}
                />
              )}
            </div>
          ) : activeCategory === 'logistics' && activeLogisticsTab === 'logistics-kpis' ? (
            <div className="max-w-full">
              {logisticsData?.logisticsKPIs && (
                <LogisticsKPIs 
                  shipmentStatusData={logisticsData.logisticsKPIs.shipmentStatusData}
                  monthlyShipmentData={logisticsData.logisticsKPIs.monthlyShipmentData}
                  shippingTimeData={logisticsData.logisticsKPIs.shippingTimeData}
                  shippingVolumeData={logisticsData.logisticsKPIs.shippingVolumeData}
                  countryDistributionData={logisticsData.logisticsKPIs.countryDistributionData}
                />
              )}
            </div>
          ) : activeCategory === 'logistics' && activeLogisticsTab === 'alerts-exceptions' ? (
            <div className="max-w-full">
              {logisticsData?.alertsExceptions && (
                <AlertsExceptions 
                  stuckPackingShipments={logisticsData.alertsExceptions.stuckPackingShipments}
                />
              )}
            </div>
          ) : activeCategory === 'repairs' && activeRepairsTab === 'overview' ? (
            <div className="max-w-full">
              {repairsData?.overview && (
                <RepairsOverview 
                  kpis={repairsData.overview.kpis}
                  roByYearData={repairsData.overview.roByYearData}
                  roStatusData={repairsData.overview.roStatusData}
                  agingBuckets={repairsData.overview.agingBuckets}
                  recentActivity={repairsData.overview.recentActivity}
                  monthlyTrends={repairsData.overview.monthlyTrends}
                />
              )}
            </div>
          ) : activeCategory === 'repairs' && activeRepairsTab === 'ro-details' ? (
            <div className="max-w-full">
              {repairsData?.roDetails && (
                <RepairOrderDetails 
                  repairOrders={repairsData.roDetails.repairOrders}
                />
              )}
            </div>
          ) : activeCategory === 'repairs' && activeRepairsTab === 'tat-analysis' ? (
            <div className="max-w-full">
              {repairsData?.tatAnalysis && (
                <TATAnalysis 
                  tatRecords={repairsData.tatAnalysis.tatRecords}
                  kpis={repairsData.tatAnalysis.kpis}
                  vendorTATData={repairsData.tatAnalysis.vendorTATData}
                  tatDistribution={repairsData.tatAnalysis.tatDistribution}
                />
              )}
            </div>
          ) : activeCategory === 'repairs' && activeRepairsTab === 'scrap-quality' ? (
            <div className="max-w-full">
              {repairsData?.scrapQuality && (
                <ScrapQuality 
                  scrapEvents={repairsData.scrapQuality.scrapEvents}
                  topScrappedPNs={repairsData.scrapQuality.topScrappedPNs}
                  vendorScrapData={repairsData.scrapQuality.vendorScrapData}
                />
              )}
            </div>
          ) : activeCategory === 'repairs' && activeRepairsTab === 'vendor-insights' ? (
            <div className="max-w-full">
              {repairsData?.vendorInsights && (
                <VendorInsights 
                  vendorRecap={repairsData.vendorInsights.vendorRecap}
                  vendorAmountData={repairsData.vendorInsights.vendorAmountData}
                  vendorVolumeData={repairsData.vendorInsights.vendorVolumeData}
                  vendorSpendData={repairsData.vendorInsights.vendorSpendData}
                  topRepairShops={repairsData.overview.topRepairShops}
                />
              )}
            </div>
          ) : activeCategory === 'management' && activeManagementTab === 'executive-overview' ? (
            <div className="max-w-full">
              {managementData?.executiveOverview && (
                <ExecutiveOverview 
                  companyPulse={managementData.executiveOverview.companyPulse}
                  salesQuotesTrend={managementData.executiveOverview.salesQuotesTrend}
                  cashFlowData={managementData.executiveOverview.cashFlowData}
                  vendorSpendData={managementData.executiveOverview.vendorSpendData}
                  employeePerformance={managementData.executiveOverview.employeePerformance}
                  exceptionsAlerts={managementData.executiveOverview.exceptionsAlerts}
                />
              )}
            </div>
          ) : (
            <div className="max-w-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeCategory === 'sales' 
                    ? `${salesTabs.find(t => t.id === activeTab)?.label} Coming Soon`
                    : `${getCategoryTitle(activeCategory)} Coming Soon`
                  }
                </h3>
                <p className="text-gray-600">
                  This section is under development and will be available soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
