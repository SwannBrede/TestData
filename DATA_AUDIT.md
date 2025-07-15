# SkyMetrics Data Audit - Real Data Integration Plan

## Overview
This document catalogs all KPI metrics and data points currently used in the SkyMetrics dashboard to identify real data source requirements for production deployment.

## Sales Department

### KPI Metrics (6 cards)
1. **Total Sales (30 days)** - `$2.4M, +12.5%`
   - Source: Sales transactions/invoicing system
   - Calculation: SUM(sales_amount) WHERE date >= CURRENT_DATE - 30

2. **Quotes Value (30 days)** - `$3.8M, +18.3%`
   - Source: CRM/Quote management system
   - Calculation: SUM(quote_total) WHERE status='active' AND date >= CURRENT_DATE - 30

3. **Orders** - `1,247, +8.2%`
   - Source: Order management system
   - Calculation: COUNT(orders) WHERE date >= CURRENT_DATE - 30

4. **Average Order Value** - `$1,925, +3.9%`
   - Source: Sales transactions
   - Calculation: AVG(order_total) WHERE date >= CURRENT_DATE - 30

5. **Conversion Rate** - `32.8%, -2.1%`
   - Source: CRM pipeline data
   - Calculation: (orders_count / quotes_count) * 100

6. **Gross Margin** - `34.2%, -1.3%`
   - Source: Cost/pricing system
   - Calculation: ((revenue - cost) / revenue) * 100

### Performance Table Data
- **Time periods**: Yesterday, Last 7 Days, MTD, Last 30 Days
- **Metrics per period**: Total Sales, Orders, AOV, Gross Margin
- **Source**: Sales transaction history with date aggregations

### Revenue Breakdown
- **Top 5 Customers**: Customer name, revenue amount
- **Top 5 Part Numbers**: Part number, revenue amount  
- **Sales by Channel**: 5 channels with percentage distribution

### Trends Analytics
- **Daily Sales Data**: 30-day trend with revenue/orders
- **Cumulative Sales**: Current vs previous month comparison
- **Funnel Data**: Quotes to orders conversion metrics
- **Sparkline Metrics**: Orders/day, Quotes/day, AOV trend, Margin trend

### Customer Analytics
- **Customer Leaderboard**: 12 customers with performance metrics
- **Retention Trend**: New vs returning customer acquisition
- **Growth Analysis**: Growing vs declining customers
- **Segment Breakdown**: Regional and segment revenue distribution

### Product Analytics
- **Product Performance**: 12 aviation parts across 8 categories
- **Top Movers**: Revenue and quantity leaders
- **Product Trends**: 7-month historical data
- **Channel Distribution**: Sales across 5 channels

### Forecasting
- **Forecast vs Actual**: 7-month historical comparison
- **Current Period Projections**: January 2025 forecasts
- **Customer Forecasts**: Revenue projections by customer
- **Product Forecasts**: Quantities and confidence levels

## Operations Department

### Core Tables (3 tabs)
1. **Sales Orders Table**
   - Fields: SO Number, Date, Customer, Salesperson, Part Number, Qty, Unit Price, Status, Margin%, Total
   - Source: ERP/Order management system
   - Current data: 12 orders with aviation part numbers

2. **Quotes Table**
   - Fields: Quote Number, Date, Customer, Salesperson, Part Number, Qty, Quoted Price, Status, Linked SO
   - Source: CRM/Quote system
   - Current data: 12 quotes with cross-references

3. **Purchase Orders Table**
   - Fields: PO Number, Date, Vendor, Part Number, Qty, Unit Cost, Total Cost, Status, Linked SO/Quote
   - Source: Procurement system
   - Current data: 12 POs with vendor relationships

## Inventory Department

### Overview KPIs (5 metrics)
1. **Total Stock Qty**: 8,456 units
2. **Unique Part Numbers**: 342 parts
3. **Stock Value**: $12.8M
4. **Qty on Repair**: 156 units
5. **Average Aging**: 67 days

### Inventory Table (12+ items)
- **Core Fields**: Part Number, Description, Condition, Quantities, Serial Numbers, Costs, Aging, Locations
- **Source**: Inventory management system
- **Cross-references**: RO numbers, SO numbers, stock lines

### Lots & Stock Distribution
- **Lot Management**: Original costs, repair costs, sales volumes
- **Distribution Charts**: Consignment, warehouse, aging analysis
- **Source**: Lot tracking and warehouse management systems

### Incoming Parts
- **RO Incoming**: Last 10 days of repair order receipts
- **PO Incoming**: Last 10 days of purchase order receipts
- **KPIs**: Units received (247), Total value ($3.2M), Top part numbers

## Finance Department

### Account Payables
- **KPIs**: Total payables ($4.8M), Balance ($2.3M), 7-month trend
- **AP Table**: 10 records with vendor details, aging, cross-references
- **Source**: Accounting system (AP module)

### Account Receivables
- **KPIs**: Total receivables ($6.2M), Balance ($3.8M), 7-month trend
- **AR Table**: 10 records with customer details, aging, payments
- **Source**: Accounting system (AR module)

### Cash Flow Overview
- **Monthly Data**: 7 months of inflows vs outflows
- **KPIs**: Total in ($8.4M), Total out ($6.2M), Net ($2.2M)
- **Source**: General ledger cash accounts

### Late Payments
- **Overdue Tables**: Receivables and payables past due
- **Aging Analysis**: 0-30, 31-60, 60+ day buckets
- **Company Distribution**: Pie chart by company overdue amounts

### Monthly Finance Summary
- **Performance Table**: Monthly revenue, expenses, profit
- **Charts**: Net profit trend, top clients/vendors
- **Source**: Financial statements and GL data

## Logistics Department

### Repair Order Overview
- **KPIs**: Total RO (156), Units in stock (342), Units sold (189), Yield ($4.2M)
- **RO Table**: 10 orders with 16 columns including upgrade paths, AWB tracking
- **Source**: Repair order management system

### Shipping Monitor
- **Shipment Tables**: Open (6) and closed (5) shipments
- **KPIs**: Open shipments (28), Packing (12), Closed (156)
- **Source**: Shipping/logistics system with AWB tracking

### Logistics KPIs
- **Charts**: Shipment status, monthly trends, shipping times, volume comparison, country distribution
- **Source**: Shipping analytics and performance metrics

### Alerts & Exceptions
- **Missing AWB Table**: Shipments without tracking
- **Delayed RO Table**: Repair orders >30 days
- **Source**: Exception monitoring systems

## Repairs Department

### Overview KPIs
- **Total RO Issued**: 1,247
- **Open ROs**: 89
- **Closed ROs**: 1,158
- **Average TAT**: 23 days

### RO Pipeline
- **Pipeline Table**: 10 detailed repair orders
- **Charts**: RO count by component, consignment analysis
- **Source**: Repair workflow management

### TAT Analysis
- **TAT Metrics**: Longest (67 days), Shortest (8 days), Over target (23%)
- **Charts**: TAT per vendor, distribution histogram
- **Source**: Repair performance tracking

### Scrap & Quality
- **Scrap Events**: 10 events with quality metrics
- **Charts**: Top scrapped parts, scrap percentage by vendor
- **Source**: Quality management system

### Vendor Insights
- **Performance Tables**: 7 vendors with RO amounts/volumes
- **Charts**: Vendor spend analysis, performance metrics
- **Source**: Vendor management system

## Management Department (Executive Overview)

### Company Pulse KPIs (7 metrics)
1. **MTD Sales**: $2.3M
2. **MTD Quotes**: $17.3M
3. **Open ROs**: 123
4. **A/R Balance**: $2.9M
5. **A/P Balance**: $2.6M
6. **Incoming Shipments**: 98
7. **Forecast 90d**: $6.1M

### Executive Analytics
- **Employee Performance**: 7 sales team members
- **Key Accounts**: 8 major airline customers
- **Logistics Status**: 8 shipments with real-time tracking
- **Exceptions & Alerts**: 8 alerts across all departments

## Real Data Integration Requirements

### Primary Systems Needed
1. **ERP System**: Sales orders, purchase orders, inventory
2. **CRM System**: Quotes, customer relationships, pipeline
3. **Accounting System**: AP, AR, GL, financial statements
4. **Inventory Management**: Stock levels, locations, movements
5. **Repair Management**: RO workflow, TAT tracking, vendor performance
6. **Shipping/Logistics**: AWB tracking, shipment status, performance
7. **Quality System**: Scrap tracking, vendor quality metrics

### API Integration Points
- Sales transaction data (real-time)
- Inventory movements and stock levels
- Financial account balances and transactions
- Repair order status and timelines
- Shipping tracking and logistics data
- Customer and vendor master data

### Data Refresh Frequency
- **Real-time**: Inventory levels, order status
- **Daily**: Sales figures, financial balances
- **Weekly**: Performance analytics, trends
- **Monthly**: Forecasting, executive summaries

## Next Steps for Real Data Implementation
1. Identify available API endpoints from client systems
2. Map data fields to dashboard requirements
3. Remove/replace KPIs without data sources
4. Implement data connectors and transformation layer
5. Add data validation and error handling
6. Create data refresh scheduling system