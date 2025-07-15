export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  iconColor: string;
}

export interface PerformanceData {
  period: string;
  totalSales: string;
  orders: string;
  aov: string;
  grossMargin: string;
}

export interface TopCustomer {
  name: string;
  revenue: string;
  orders: number;
  margin: string;
}

export interface TopPartNumber {
  partNumber: string;
  revenue: string;
  quantity: number;
  margin: string;
}

export interface ChannelData {
  name: string;
  value: string;
  percentage: number;
}

export interface SalesTrendData {
  date: string;
  sales: number;
  formattedSales: string;
}

export interface CumulativeSalesData {
  day: number;
  currentMonth: number;
  previousMonth: number;
}

export interface FunnelData {
  totalQuotes: {
    value: string;
    count: number;
  };
  ordersGenerated: {
    value: string;
    count: number;
  };
  conversionRate: string;
}

export interface SparklineData {
  day: number;
  value: number;
}

export interface SparklineMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  data: SparklineData[];
  color: string;
}

export interface SalesAnalytics {
  kpiMetrics: KPIMetric[];
  performanceData: PerformanceData[];
  topCustomers: TopCustomer[];
  topPartNumbers: TopPartNumber[];
  salesByChannel: ChannelData[];
  lastUpdated: string;
}

export interface SalesTrends {
  salesTrendData: SalesTrendData[];
  cumulativeSalesData: CumulativeSalesData[];
  funnelData: FunnelData;
  sparklineMetrics: SparklineMetric[];
  lastUpdated: string;
}

export interface CustomerLeaderboardData {
  name: string;
  revenue: string;
  orders: number;
  aov: string;
  grossMargin: string;
  conversionRate: string;
  lastPurchase: string;
  region: string;
}

export interface RetentionTrendData {
  month: string;
  newCustomers: number;
  returningCustomers: number;
}

export interface GrowthMover {
  name: string;
  currentRevenue: string;
  previousRevenue: string;
  growth: string;
  growthPercent: number;
}

export interface SegmentData {
  name: string;
  value: number;
  formattedValue: string;
  color: string;
}

export interface CustomerAnalytics {
  leaderboard: CustomerLeaderboardData[];
  retentionTrend: RetentionTrendData[];
  growingCustomers: GrowthMover[];
  decliningCustomers: GrowthMover[];
  regionData: SegmentData[];
  segmentData: SegmentData[];
  lastUpdated: string;
}

export interface ProductLeaderboardData {
  partNumber: string;
  description: string;
  revenue: string;
  quantitySold: number;
  orders: number;
  aov: string;
  grossMargin: string;
  category: string;
}

export interface TopProductRevenue {
  partNumber: string;
  description: string;
  revenue: string;
  orders: number;
  category: string;
}

export interface TopProductQuantity {
  partNumber: string;
  description: string;
  quantity: number;
  revenue: string;
  category: string;
}

export interface ProductTrendData {
  month: string;
  revenue: number;
  quantity: number;
  formattedRevenue: string;
}

export interface ProductAnalytics {
  leaderboard: ProductLeaderboardData[];
  topByRevenue: TopProductRevenue[];
  topByQuantity: TopProductQuantity[];
  productTrends: { [productId: string]: ProductTrendData[] };
  products: { id: string; name: string; category: string; }[];
  channelData: ChannelData[];
  lastUpdated: string;
}

export interface ForecastVsActualData {
  month: string;
  actualRevenue: number;
  forecastRevenue: number;
  actualOrders: number;
  forecastOrders: number;
  actualMargin: number;
  forecastMargin: number;
  formattedActualRevenue: string;
  formattedForecastRevenue: string;
}

export interface CurrentPeriodData {
  forecastedRevenue: {
    value: string;
    vsTarget: string;
    vsLastMonth: string;
    targetTrend: 'positive' | 'negative';
    monthTrend: 'positive' | 'negative';
  };
  forecastedOrders: {
    value: string;
    vsTarget: string;
    vsLastMonth: string;
    targetTrend: 'positive' | 'negative';
    monthTrend: 'positive' | 'negative';
  };
  forecastedMargin: {
    value: string;
    vsTarget: string;
    vsLastMonth: string;
    targetTrend: 'positive' | 'negative';
    monthTrend: 'positive' | 'negative';
  };
  periodName: string;
}

export interface CustomerForecastData {
  customer: string;
  forecastedRevenue: string;
  runRate: string;
  varianceVsTarget: string;
  variancePercent: number;
  region: string;
}

export interface ProductForecastData {
  partNumber: string;
  productName: string;
  forecastedRevenue: string;
  forecastedQuantity: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  category: string;
}

export interface ForecastingAnalytics {
  forecastVsActual: ForecastVsActualData[];
  currentPeriod: CurrentPeriodData;
  customerForecasts: CustomerForecastData[];
  productForecasts: ProductForecastData[];
  lastUpdated: string;
}

export interface SalesOrder {
  soNumber: string;
  date: string;
  customer: string;
  salesperson: string;
  partNumber: string;
  quantity: number;
  unitPrice: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  grossMargin: string;
  totalValue: string;
}

export interface Quote {
  quoteNumber: string;
  date: string;
  customer: string;
  salesperson: string;
  partNumber: string;
  quantity: number;
  quotedPrice: string;
  status: 'Open' | 'Expired' | 'Converted';
  linkedSO: string | null;
}

export interface PurchaseOrder {
  poNumber: string;
  date: string;
  vendor: string;
  partNumber: string;
  quantity: number;
  unitCost: string;
  totalCost: string;
  status: 'Pending' | 'Confirmed' | 'Received' | 'Cancelled';
  linkedRef: string | null;
  refType: 'SO' | 'Quote' | null;
}

export interface OperationsData {
  salesOrders: SalesOrder[];
  quotes: Quote[];
  purchaseOrders: PurchaseOrder[];
  lastUpdated: string;
}

export interface InventoryItem {
  partNumber: string;
  description: string;
  condition: 'New' | 'Serviceable' | 'Repairable' | 'Scrap';
  qtyAvailable: number;
  qtyOnHand: number;
  qtyOnRepair: number;
  roNumber: string | null;
  soNumber: string | null;
  stockLine: string;
  serialNumber: string;
  itemCost: string;
  repairCost: string;
  aging: number;
  recDate: string;
  application: string;
  consignment: string;
  warehouse: string;
  location: string;
}

export interface InventoryKPIs {
  totalStockQty: number;
  uniquePartNumbers: number;
  stockValue: string;
  qtyOnRepair: number;
  avgAging: number;
}

export interface LotData {
  lotNumber: string;
  consignment: string;
  originalCost: string;
  totalItemRepairCost: string;
  remainingRepairCost: string;
  totalCostSoldItems: string;
  totalLotCost: string;
  totalSalesVolume: string;
}

export interface ConsignmentData {
  name: string;
  value: number;
  color: string;
}

export interface WarehouseData {
  name: string;
  value: number;
}

export interface AgingData {
  ageRange: string;
  value: number;
  color: string;
}

export interface ROIncoming {
  roNumber: string;
  partNumber: string;
  serial: string;
  qty: number;
  totalCost: string;
  recDate: string;
  condition: 'New' | 'Serviceable' | 'Repairable';
  consignment: string;
  taggedBy: string;
}

export interface POIncoming {
  poNumber: string;
  partNumber: string;
  serial: string;
  qty: number;
  unitCost: string;
  recDate: string;
  condition: 'New' | 'Serviceable' | 'Repairable';
  consignment: string;
  taggedBy: string;
}

export interface IncomingKPIs {
  unitsReceived: number;
  totalReceivedValue: string;
  topPartNumbers: string[];
}

export interface LowStockAlert {
  partNumber: string;
  description: string;
  currentStock: number;
  reorderPoint: number;
  supplier: string;
  leadTime: number;
  stockValue: string;
  lastSale: string;
  category: string;
  warehouse: string;
  urgency: 'Critical' | 'High' | 'Medium';
}

export interface AgingInventoryAlert {
  partNumber: string;
  description: string;
  daysInStock: number;
  quantity: number;
  stockValue: string;
  lastMovement: string;
  condition: 'New' | 'Serviceable' | 'Repairable';
  consignment: string;
  warehouse: string;
  category: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface InventoryData {
  overview: {
    kpis: InventoryKPIs;
    inventory: InventoryItem[];
  };
  lotsDistribution: {
    lots: LotData[];
    consignmentData: ConsignmentData[];
    warehouseData: WarehouseData[];
    agingData: AgingData[];
  };
  incomingParts: {
    kpis: IncomingKPIs;
    roIncoming: ROIncoming[];
    poIncoming: POIncoming[];
  };
  alerts: {
    lowStockAlerts: LowStockAlert[];
    agingInventoryAlerts: AgingInventoryAlert[];
  };
  lastUpdated: string;
}

export interface AccountPayable {
  apCtrlNumber: string;
  vendor: string;
  invoiceDate: string;
  dueDate: string;
  entryDate: string;
  amount: string;
  balance: string;
  terms: string;
  status: 'Open' | 'Paid' | 'Overdue' | 'Processing';
  aging: number;
  company: string;
  poNumber: string | null;
  roNumber: string | null;
  consignment: string;
}

export interface AccountReceivable {
  arCtrlNumber: string;
  customer: string;
  invoiceDate: string;
  dueDate: string;
  amount: string;
  balance: string;
  status: 'Open' | 'Paid' | 'Overdue' | 'Partial';
  aging: number;
  lastPaymentDate: string | null;
  consignment: string;
}

export interface PayablesTrend {
  month: string;
  amount: number;
  formattedAmount: string;
}

export interface PayablesKPIs {
  totalPayablesAmount: string;
  totalPayablesBalance: string;
  trendData: PayablesTrend[];
}

export interface ReceivablesTrend {
  month: string;
  amount: number;
  formattedAmount: string;
}

export interface ReceivablesKPIs {
  totalReceivablesAmount: string;
  totalReceivablesBalance: string;
  trendData: ReceivablesTrend[];
}

export interface CashFlowData {
  month: string;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  formattedInflows: string;
  formattedOutflows: string;
  formattedNetCashFlow: string;
}

export interface CashFlowKPIs {
  totalIn: string;
  totalOut: string;
  netCash: string;
  monthlyAvg: string;
  netCashTrend: 'positive' | 'negative';
}

export interface OverdueReceivable {
  customer: string;
  amount: string;
  aging: number;
  dueDate: string;
  expectedDate: string;
  company: string;
}

export interface OverduePayable {
  vendor: string;
  amount: string;
  aging: number;
  dueDate: string;
  expectedDate: string;
  company: string;
}

export interface CompanyOverdueData {
  name: string;
  value: number;
  color: string;
}

export interface AgingBucketData {
  bucket: string;
  receivables: number;
  payables: number;
}

export interface MonthlyFinanceData {
  month: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  openAR: number;
  openAP: number;
  formattedRevenue: string;
  formattedExpenses: string;
  formattedNetProfit: string;
  formattedOpenAR: string;
  formattedOpenAP: string;
}

export interface TopClient {
  name: string;
  revenue: string;
  percentage: number;
}

export interface TopVendor {
  name: string;
  cost: string;
  percentage: number;
}

export interface FinanceSummaryKPIs {
  totalRevenue: string;
  totalExpenses: string;
  totalNetProfit: string;
  totalOpenAR: string;
  totalOpenAP: string;
  netProfitTrend: 'positive' | 'negative';
}

export interface FinanceData {
  accountPayables: {
    kpis: PayablesKPIs;
    payables: AccountPayable[];
  };
  accountReceivables: {
    kpis: ReceivablesKPIs;
    receivables: AccountReceivable[];
  };
  cashFlow: {
    kpis: CashFlowKPIs;
    data: CashFlowData[];
  };
  latePayments: {
    overdueReceivables: OverdueReceivable[];
    overduePayables: OverduePayable[];
    companyOverdueData: CompanyOverdueData[];
    agingBuckets: AgingBucketData[];
  };
  monthlySummary: {
    kpis: FinanceSummaryKPIs;
    monthlyData: MonthlyFinanceData[];
    topClients: TopClient[];
    topVendors: TopVendor[];
  };
  lastUpdated: string;
}

export interface RepairOrder {
  partNumber: string;
  upgradeTo: string | null;
  stockLine: string;
  condition: 'Serviceable' | 'Repairable' | 'Scrap' | 'New';
  serialNumber: string;
  totalYield: string;
  stock: number;
  repairShop: string;
  roNumber: string;
  roDate: string;
  shipDate: string | null;
  daysROToShip: number | null;
  status: 'In Progress' | 'Shipped' | 'Received' | 'Completed' | 'Delayed';
  awbWHToRS: string | null;
  receivedAtShop: string | null;
  awbRSToWH: string | null;
}

export interface LogisticsOrder {
  pn: string;
  upgradeTo: string | null;
  stockLine: string;
  condition: 'Serviceable' | 'Repairable' | 'Scrap' | 'New';
  serialNumber: string;
  manifest: string;
  totalYield: string;
  sold: number;
  stock: number;
  repairShop: string;
  roNumber: string;
  roDate: string;
  shipDate: string | null;
  daysROToShip: number | null;
  status: 'In Progress' | 'Shipped' | 'Received' | 'Completed' | 'Delayed';
  awbWHToRS: string | null;
  receivedAtShop: string | null;
  awbRSToWH: string | null;
  warehouse: string;
  rsToWHSCUT: string | null;
  location: string;
  awbToCust: string | null;
  freightOut: string | null;
  freightIn: string | null;
  consignment: string;
  lot: string;
}

export interface ROKPIs {
  totalRO: number;
  totalUnitsInStock: number;
  totalUnitsSold: number;
  totalYield: string;
}

export interface Shipment {
  shipNo: string;
  openDate: string;
  status: 'Open' | 'Packing' | 'Shipped' | 'Delivered' | 'In Transit' | 'Closed';
  shipDate: string | null;
  shipViaAirwayBill: string | null;
  partNumber: string;
  qtyInv: number;
  qtyRes: number;
  company: string;
  country: string;
  shipType: 'Standard' | 'Express' | 'Overnight' | 'Ground';
  soNumber: string | null;
  roNumber: string | null;
  warehouse: string;
}

export interface ShippingKPIs {
  openShipments: number;
  packingShipments: number;
  closedShipments: number;
}

export interface ShipmentStatusData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyShipmentData {
  month: string;
  open: number;
  closed: number;
}

export interface ShippingTimeData {
  month: string;
  avgDays: number;
}

export interface ShippingVolumeData {
  month: string;
  '2024': number;
  '2025': number;
}

export interface CountryDistributionData {
  country: string;
  shipments: number;
  percentage: number;
}



export interface StuckPackingShipment {
  shipNo: string;
  partNumber: string;
  company: string;
  shipType: 'Standard' | 'Express' | 'Overnight' | 'Ground';
  warehouse: string;
  daysInPacking: number;
  openDate: string;
  expectedShipDate: string;
  priority: 'Critical' | 'High' | 'Medium';
  soNumber: string | null;
  roNumber: string | null;
}

export interface RepairOrderDetail {
  roDate: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  aging: number;
  roNumber: string;
  roShop: string;
  item: string;
  pnOut: string;
  pnIn: string;
  modified: string;
  description: string;
  serialNumber: string;
  qtyReser: number;
  qtyRepaired: number;
  repairCost: number;
  freight: number;
  newSL: string;
  retCond: string;
  lot: string;
  soNumber: string;
  location: string;
  whs: string;
  consignCd: string;
  mainComponent: string;
  slAwb: string;
  nextDelDate: string;
  vendorAckDate: string;
  lastDelDate: string;
  dayShip: number;
  recWhs: string;
  recBackQuant: number;
  shipDateFrom: string;
  shNumber: string;
  scrapPercent: number;
}

export interface LogisticsData {
  repairOrderOverview: {
    kpis: ROKPIs;
    repairOrders: RepairOrder[];
    logisticsOrders: LogisticsOrder[];
  };
  shippingMonitor: {
    kpis: ShippingKPIs;
    openShipments: Shipment[];
    closedShipments: Shipment[];
  };
  logisticsKPIs: {
    shipmentStatusData: ShipmentStatusData[];
    monthlyShipmentData: MonthlyShipmentData[];
    shippingTimeData: ShippingTimeData[];
    shippingVolumeData: ShippingVolumeData[];
    countryDistributionData: CountryDistributionData[];
  };
  alertsExceptions: {
    stuckPackingShipments: StuckPackingShipment[];
  };
  lastUpdated: string;
}

export interface RepairsKPIs {
  totalROIssued: number;
  openROs: number;
  closedROs: number;
  avgTAT: number;
}

export interface ROByYearData {
  year: string;
  roCount: number;
}

export interface ROStatusData {
  status: string;
  count: number;
  color: string;
}



export interface TATRecord {
  roShop: string;
  roDate: string;
  shipDate: string;
  deliveryDate: string;
  tatInternal: number;
  tatExternal: number;
}

export interface TATKPIs {
  longestTAT: number;
  shortestTAT: number;
  percentOverTarget: number;
}

export interface VendorTATData {
  roShop: string;
  avgTAT: number;
}

export interface TATDistributionData {
  range: string;
  internal: number;
  external: number;
}

export interface ScrapEvent {
  partNumber: string;
  roShop: string;
  avgScrapPercent: number;
  scrapCount: number;
}

export interface TopScrappedPN {
  partNumber: string;
  scrapCount: number;
}

export interface VendorScrapData {
  roShop: string;
  avgScrapPercent: number;
}

export interface VendorRecap {
  roShop: string;
  qtyOfROs: number;
  totalROAmount: string;
  totalROAmountNum: number;
}

export interface VendorAmountData {
  roShop: string;
  roAmount: number;
}

export interface VendorVolumeData {
  roShop: string;
  roCount: number;
}

export interface VendorSpendData {
  roShop: string;
  roAmount: number;
  color: string;
}

export interface RepairsData {
  overview: {
    kpis: RepairsKPIs;
    roByYearData: ROByYearData[];
    roStatusData: ROStatusData[];
  };
  roDetails: {
    repairOrders: RepairOrderDetail[];
  };

  tatAnalysis: {
    kpis: TATKPIs;
    tatRecords: TATRecord[];
    vendorTATData: VendorTATData[];
    tatDistribution: TATDistributionData[];
  };
  scrapQuality: {
    scrapEvents: ScrapEvent[];
    topScrappedPNs: TopScrappedPN[];
    vendorScrapData: VendorScrapData[];
  };
  vendorInsights: {
    vendorRecap: VendorRecap[];
    vendorAmountData: VendorAmountData[];
    vendorVolumeData: VendorVolumeData[];
    vendorSpendData: VendorSpendData[];
  };
  lastUpdated: string;
}

export interface ManagementData {
  executiveOverview: {
    companyPulse: {
      mtdSales: string;
      mtdQuotes: string;
      openROs: number;
      arBalance: string;
      apBalance: string;
      incomingShipments: number;
      forecast90d: string;
    };
    salesQuotesTrend: Array<{
      month: string;
      sales: number;
      quotes: number;
    }>;
    cashFlowData: Array<{
      month: string;
      payables: number;
      receivables: number;
    }>;
    vendorSpendData: Array<{
      vendor: string;
      spend: number;
    }>;
    pnPerformanceData: Array<{
      pnId: string;
      timesQuoted: number;
      timesSold: number;
      revenue: number;
    }>;
    employeePerformance: Array<{
      name: string;
      salesAmount: string;
      quotesCount: number;
      conversionPercent: number;
      totalAmount: string;
    }>;
    keyAccounts: Array<{
      customer: string;
      quotesCount: number;
      salesCount: number;
      conversionPercent: number;
      revenue: string;
    }>;
    logisticsStatus: Array<{
      shipmentId: string;
      type: 'Inbound' | 'Outbound';
      status: 'In Transit' | 'Delivered' | 'Delayed' | 'Processing';
      expectedDate: string;
      delayFlag: boolean;
    }>;
    exceptionsAlerts: Array<{
      type: string;
      department: string;
      description: string;
      status: 'Open' | 'In Progress' | 'Resolved';
    }>;
  };
  lastUpdated: string;
}

export type DashboardCategory = 'sales' | 'finance' | 'inventory' | 'operations' | 'logistics' | 'repairs' | 'management';
export type SalesTab = 'executive-snapshot' | 'trends' | 'customers' | 'products' | 'forecasting';
export type OperationsTab = 'sales-orders' | 'quotes' | 'purchase-orders';
export type InventoryTab = 'overview' | 'lots-distribution' | 'incoming-parts' | 'alerts';
export type FinanceTab = 'account-payables' | 'account-receivables' | 'cash-flow' | 'late-payments' | 'monthly-summary';
export type LogisticsTab = 'repair-order-overview' | 'shipping-monitor' | 'logistics-kpis' | 'alerts-exceptions';
export type RepairsTab = 'overview' | 'ro-details' | 'tat-analysis' | 'scrap-quality' | 'vendor-insights';
export type ManagementTab = 'executive-overview';
