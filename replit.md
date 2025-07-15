# Aviation Industry Dashboard Application

## Overview

This is a full-stack TypeScript web application designed for aviation industry business analytics and dashboard management. The application features a React frontend with shadcn/ui components and an Express.js backend, utilizing PostgreSQL with Drizzle ORM for data persistence.

## Recent Changes

### January 13, 2025 - Responsive Design & Navigation Enhancements
- Implemented collapsible/retractable sidebar functionality matching reference platform design
- Added smooth 300ms animation transition between expanded (256px) and collapsed (64px) states
- Positioned toggle button to overlap border line for authentic UX matching screenshot reference
- Applied comprehensive responsive design across all 7 department sections (Sales, Operations, Inventory, Finance, Logistics, Repairs, Management)
- Updated layout containers from fixed max-width constraints to responsive full-width design
- Implemented adaptive padding and spacing: p-4 lg:p-6 for mobile-first responsive behavior
- Enhanced grid layouts with better breakpoint progression: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Reduced excessive side spacing throughout application for better screen utilization
- Ensured consistent responsive behavior across all tabs and categories, not just Sales section
- **Added smooth scroll-to-top functionality**: Implemented automatic scroll-to-top for all section and tab navigation to improve user experience and maintain consistent view state when switching between different dashboard areas
- **Implemented frozen table functionality for Product Leaderboard**: Added scrollable table with frozen headers and frozen Part Number column to handle 500+ part numbers with perfect column alignment and dual-axis sticky positioning

### January 13, 2025 - Sequence7 Brand Color Integration
- Updated entire application color scheme to match Sequence7 purple branding (replacing blue highlights)
- Systematically converted all blue color references (text-blue-600, bg-blue-600, border-blue) to purple equivalents
- Updated CSS custom properties with Sequence7 brand colors (hsl(264, 89%, 58%))
- Applied purple color scheme across all 40+ components in 7 departments while maintaining functionality
- Enhanced brand consistency throughout aviation analytics platform with modern purple gradient themes

### January 13, 2025 - Sales Executive Snapshot Redesign
- Restructured the Sales > Executive Snapshot view into 3 distinct sections:
  - **Section A - Key Metrics**: 6 KPI cards (Total Sales, Quotes Value, Orders, AOV, Conversion Rate, Gross Margin)
  - **Section B - Performance Summary**: Time-based performance table with periods (Yesterday, Last 7 Days, MTD, Last 30 Days)
  - **Section C - Revenue Breakdown**: Top 5 customers table, Top 5 part numbers table, and sales by channel horizontal bar chart
- Updated data structure to support new dashboard layout with proper TypeScript interfaces
- Enhanced styling with clear section headers and descriptions
- Added error handling for missing data with default empty states

### January 13, 2025 - Sales Trends Tab Implementation
- Built complete Sales > Trends tab with 4 interactive sections:
  - **Section A - Sales Trend Chart**: Line chart with daily sales data and view toggles (daily/weekly/monthly)
  - **Section B - Cumulative Sales Chart**: Dual-line chart comparing current vs previous month cumulative performance
  - **Section C - Funnel View**: Horizontal funnel visualization showing quotes to orders conversion with rates
  - **Section D - Sparkline Metrics**: 4 mini-trend cards (Orders per Day, Quotes per Day, AOV Trend, Gross Margin Trend)
- Integrated Recharts library for professional chart visualizations
- Created comprehensive mock data structure for 30-day trends analysis
- Added responsive design with aviation-themed styling and interactive tooltips

### January 13, 2025 - Sales Customers Tab Implementation
- Built complete Sales > Customers tab with 4 analytical sections:
  - **Section A - Customer Leaderboard**: Sortable table with filters for region, displaying customer performance metrics
  - **Section B - Retention Trend**: Line chart showing new vs returning customer acquisition over time
  - **Section C - Growth Movers**: Side-by-side tables showing top 5 growing and declining customers with revenue trends
  - **Section D - Segment Breakdown**: Interactive pie/bar chart with region and customer segment revenue distribution
- Added comprehensive customer analytics data structure with 12 sample customers across 3 regions
- Implemented sortable columns, region filtering, and dual chart view options (pie/bar)
- Created growth visualization with progress bars and trend indicators for customer performance tracking

### January 13, 2025 - Sales Products Tab Implementation
- Built complete Sales > Products tab with 4 analytical sections:
  - **Section A - Product Leaderboard**: Sortable table with category filters showing product performance metrics (revenue, quantity, orders, AOV, margins)
  - **Section B - Top Movers**: Side-by-side tables displaying top 5 products by revenue and top 5 by quantity sold
  - **Section C - Product Trends**: Interactive line/bar chart with product selection and revenue/quantity metric toggles
  - **Section D - Sales by Channel**: Pie/bar chart showing product sales distribution across 5 channels (Direct, Distributor, Online, OEM, Aftermarket)
- Created comprehensive product analytics with 12 aviation parts across 8 categories (Engine Parts, Avionics, Landing Gear, etc.)
- Implemented advanced filtering, sorting, and interactive chart controls with real-time data switching
- Added product trend analysis with 7-month historical data for top products with revenue/quantity tracking

### January 13, 2025 - Sales Forecasting Tab Implementation
- Built complete Sales > Forecasting tab with 4 predictive analytics sections:
  - **Section A - Forecast vs Actual**: Dual-bar chart comparing actual vs forecasted performance with revenue/orders/margin toggles
  - **Section B - Current Period Projection**: KPI cards for January 2025 forecasts ($2.85M revenue, 53 orders, 36.5% margin) with target variance
  - **Section C - Forecast by Customer**: Sortable table showing customer revenue projections, run rates, and target variance (+22.1% to -12.8% range)
  - **Section D - Forecast by Product**: Table/card view with product forecasts, quantities, and confidence levels (High/Medium/Low indicators)
- Created comprehensive forecasting data with 7-month historical forecast vs actual tracking
- Implemented confidence level visualization with color-coded badges and interactive table/chart view toggles
- Added variance analysis and trend indicators for performance against targets and previous periods

### January 13, 2025 - Operations Section Implementation
- Built complete Operations section with 3 comprehensive table-based tabs:
  - **Tab 1 - Sales Orders**: Table with SO Number, Date, Customer, Salesperson, Part Number, Quantity, Unit Price, Status, Gross Margin %, Total Value
  - **Tab 2 - Quotes**: Table with Quote Number, Date, Customer, Salesperson, Part Number, Quantity, Quoted Price, Status (Open/Expired/Converted), Linked SO
  - **Tab 3 - Purchase Orders**: Table with PO Number, Date, Vendor, Part Number, Quantity, Unit Cost, Total Cost, Status, Linked SO or Quote
- Implemented comprehensive filtering, sorting, and CSV export functionality for all three tables
- Created aviation industry mock data with realistic part numbers, vendors, and cross-referenced orders
- Added status color-coding (confirmed, shipped, delivered, pending, cancelled) and linked reference indicators
- Enabled multi-filter search by date range, status, customer, salesperson, vendor, and part numbers

### January 13, 2025 - Inventory Section Implementation
- Built complete Inventory section with 3 comprehensive tabs covering full inventory management:
  - **Tab 1 - Inventory Overview**: KPI dashboard (Total Stock Qty: 8,456, Unique PNs: 342, Stock Value: $12.8M, Qty on Repair: 156, Avg Aging: 67 days) with detailed inventory table and comprehensive filter panel (PN, Condition, Consignment, Stock Line, Serial, Warehouse, Location)
  - **Tab 2 - Lots & Stock Distribution**: Lot management table with cost tracking and sales performance, plus interactive charts for stock distribution by consignment (pie chart), warehouse distribution (bar chart), and stock aging analysis (0-30, 30-90, 90-180, 180+ days)
  - **Tab 3 - Incoming Parts**: Split-screen layout with RO Incoming (last 10 days) and PO Incoming (last 10 days) tables, plus KPIs for units received (247), total value ($3.2M), and top 3 part numbers by volume
- Created comprehensive aviation inventory mock data with 12 detailed inventory items including engines, avionics, hydraulics, and landing gear components
- Implemented condition-based color coding (New, Serviceable, Repairable, Scrap) and cross-references to RO/SO numbers
- Added realistic lot tracking with cost analysis, consignment management, and warehouse/location organization
- Integrated Recharts visualizations for stock distribution analysis and aging reports

### January 13, 2025 - Finance Section Implementation
- Built complete Finance section with 5 comprehensive tabs covering full financial management:
  - **Tab 1 - Account Payables**: AP table with vendor invoices, KPI cards ($4.8M total payables, $2.3M balance), trend chart, and filters (Entry Date, Status, Company, Consignment)
  - **Tab 2 - Account Receivables**: AR table with customer invoices, KPI cards ($6.2M total receivables, $3.8M balance), trend chart, and filters (Entry Date, Status, Consignment)
  - **Tab 3 - Cash Flow Overview**: Monthly inflows vs outflows bar chart with net cash flow line, KPI cards ($8.4M in, $6.2M out, $2.2M net), and time period filter
  - **Tab 4 - Late Payments**: Split tables for overdue receivables/payables, pie chart by company, and aging buckets bar chart (0-30, 31-60, 60+ days)
  - **Tab 5 - Monthly Finance Summary**: Monthly performance table, KPI cards ($8.4M revenue, $6.2M expenses, $2.2M profit), net profit trend chart, and top 5 clients/vendors bar charts
- Created comprehensive aviation finance mock data with 10 AP/AR records each, 7 months of cash flow data, and overdue payment tracking
- Implemented status color-coding (Open, Paid, Overdue, Processing, Partial), aging analysis, and cross-references to PO/RO numbers
- Added interactive charts for trend analysis, cash flow visualization, and aging bucket distribution
- Integrated comprehensive filtering, sorting, and CSV export functionality across all finance tables

### January 13, 2025 - Logistics Section Implementation
- Built complete Logistics section with 4 comprehensive tabs covering full logistics and repair order management:
  - **Tab 1 - Repair Order Overview**: KPI dashboard (Total RO: 156, Units In Stock: 342, Units Sold: 189, Total Yield: $4.2M) with RO logistics table featuring 16 columns including upgrade paths, AWB tracking, and repair shop management, plus comprehensive filter panel (Repair Shop, PN, RO Number, RO Date range)
  - **Tab 2 - Shipping Monitor**: Tabbed interface with Open/Closed shipments, KPI cards (28 open, 12 packing, 156 closed), detailed shipping tables with AWB tracking, and dual filter panels for comprehensive shipment management
  - **Tab 3 - Logistics KPIs**: Interactive charts dashboard including shipment status pie chart, monthly open vs closed bar chart, average shipping time line chart, shipping volume comparison (2024 vs 2025), and country distribution analysis with detailed breakdown
  - **Tab 4 - Alerts & Exceptions**: Exception monitoring with shipments missing AWB/dates table and RO delays >30 days table, featuring alert-style color coding and priority indicators for operational issues
- Created comprehensive aviation logistics mock data with 10 repair orders, 6 open/5 closed shipments, 7 months of KPI data, and exception tracking
- Implemented status-based color coding (In Progress, Shipped, Received, Completed, Delayed), condition tracking (New, Serviceable, Repairable, Scrap), and cross-references between RO/SO/shipment numbers
- Added tabbed interface for shipping monitor with separate open/closed views, interactive charts with Recharts, and comprehensive exception management
- Integrated logistics flow tracking from repair orders through shipping with AWB management and delay monitoring

### January 13, 2025 - Repairs Section Implementation
- Built complete Repairs section as the 6th department with 5 comprehensive tabs covering full repair operations and vendor management:
  - **Tab 1 - Overview**: KPI dashboard (Total RO Issued: 1,247, Open ROs: 89, Closed ROs: 1,158, Avg TAT: 23 days) with ROs by year bar chart and RO status breakdown pie chart showing distribution across Open, In Progress, Completed, On Hold, and Cancelled statuses
  - **Tab 2 - RO Pipeline**: Pipeline snapshot KPIs (89 open ROs, 34 aging >30 days) with detailed repair orders table featuring 9 columns (RO Date, Number, Status, Shop, PN In/Out, Description, Qty, Main Component), plus interactive charts for RO count by main component and consignment code analysis
  - **Tab 3 - TAT Analysis**: TAT highlights KPIs (Longest: 67 days, Shortest: 8 days, 23% over target) with turnaround time table, average TAT per vendor bar chart, and TAT distribution histogram comparing internal vs external processing times
  - **Tab 4 - Scrap & Quality**: Scrap events table with quality metrics, top scrapped part numbers bar chart, and scrap percentage by vendor analysis with color-coded risk indicators (>15% red, 10-15% orange, 5-10% yellow, <5% green)
  - **Tab 5 - Vendor Insights**: Comprehensive vendor performance with RO amount/volume horizontal bar charts, vendor spend share pie chart, and vendor recap table showing quantity of ROs and total amounts with sortable columns and CSV export
- Created comprehensive aviation repairs mock data with 1,247 total ROs across 4 years, 10 detailed repair orders, 7 vendor TAT records, 10 scrap events, and 7 vendor performance records
- Implemented status-based color coding (Open, In Progress, Completed, On Hold, Cancelled), scrap rate risk indicators, and comprehensive vendor performance analytics
- Added interactive charts with Recharts for year-over-year trends, component analysis, TAT distribution, and vendor spend visualization
- Integrated cross-references between repair orders, part numbers, and vendor relationships with comprehensive filtering and export capabilities

### January 13, 2025 - Management Section Implementation
- Built complete Management section as the 7th department with comprehensive Executive Overview dashboard:
  - **Company Pulse KPIs**: 7 key metrics cards (MTD Sales: $2.3M, MTD Quotes: $17.3M, Open ROs: 123, A/R Balance: $2.9M, A/P Balance: $2.6M, Incoming Shipments: 98, Forecast 90d: $6.1M)
  - **Sales & Quotes Month Trend**: Interactive line chart showing 7-month sales vs quotes performance with dual-line visualization
  - **Cash Flow Analysis**: Bar chart comparing payables vs receivables across months with trend analysis
  - **Top Repair Vendors**: Horizontal bar chart showing YTD spend across 7 major repair vendors (Pratt & Whitney: $3.56M, Boeing Service: $2.78M, etc.)
  - **PN Performance Bubble Chart**: Scatter plot visualization showing part number performance with times quoted vs times sold, bubble size representing revenue
  - **Employee Performance Table**: Sortable table with 7 sales team members showing sales amounts, quote counts, conversion rates, and total performance metrics
  - **Key Accounts Funnel**: Table displaying 8 major airline customers with quotes/sales conversion analysis and revenue tracking
  - **Logistics Status Monitor**: Real-time table showing inbound/outbound shipments with status tracking and delay flags
  - **Exceptions & Alerts**: Comprehensive alert system covering all departments (Finance, Inventory, Logistics, Sales, Repairs) with status tracking
- Created comprehensive executive-level mock data with 7 employees, 8 key airline customers, 8 shipments, and 8 exception alerts across all departments
- Implemented multi-departmental KPI aggregation with cross-functional analytics and real-time status monitoring
- Added comprehensive sorting, filtering, and CSV export functionality across all executive tables and reports
- Integrated executive dashboard as central command center with visibility across all 6 operational departments

### January 14, 2025 - Chart Styling Consistency & Logistics KPIs Enhancement
- **Logistics KPIs Chart Styling Update**: Applied consistent premium chart styling across all 4 logistics KPI charts
  - **Shipment Status Ratio**: Transformed pie chart to donut chart with innerRadius=60, enhanced tooltips with modern styling
  - **Monthly Open vs Closed Shipments**: Enhanced bar chart with rounded corners, legend, proper margins, and consistent purple/green color scheme
  - **Average Shipping Time**: Updated line chart with purple theme, activeDot interactions, and enhanced styling
  - **Monthly Shipping Volume**: Added legend, enhanced dual-line chart with proper 2024/2025 color coding and activeDot features
  - **Shipment Distribution by Country**: Converted to full-width horizontal bar chart (removed country breakdown section), enhanced with proper margins and purple theme
- **Chart Style Consistency**: All charts now use consistent styling patterns: no axis lines, light gray grid, proper margins, enhanced tooltips with shadows, and purple color scheme
- **Shipping Monitor Table Restructuring**: Completed transition from tabbed interface to single table with Open/Closed toggle buttons, moved filters to top, implemented scrollable table with sticky headers

### January 14, 2025 - RO Pipeline Tab Complete Removal
- **Removed entire "RO Pipeline" tab from Repairs section**: Deleted component file (ro-pipeline.tsx), navigation tab, conditional rendering, TypeScript interfaces (RepairOrderRO, PipelineKPIs, ComponentData, ConsignmentData), and all associated JSON data structures
- **Updated RepairsTab type definition**: Removed 'ro-pipeline' from allowed tab values, maintaining type safety across the application  
- **Cleaned up data dependencies**: Removed roPipeline section from repairs.json file and eliminated all related component imports and prop passing
- **Fixed chart cropping issues**: Added proper margins to bar chart (25px top) and repositioned donut chart to prevent value labels from being cropped

### January 14, 2025 - TAT Analysis Tab Enhancements
- **Added RO Number and Shop filters**: Implemented search filters for RO Number and Shop with real-time filtering functionality and results count display
- **Implemented frozen table headers**: Added sticky headers with z-index positioning and scrollable table body (max-height: 384px) for better navigation through large datasets
- **Enhanced table structure**: Added RO Number column as first column with font-medium styling, updated data structure with roNumber field for all TAT records
- **Modernized chart styling**: Applied consistent premium styling to both vendor TAT and distribution charts with purple color scheme, enhanced tooltips with shadows, and removed axis lines
- **Added scrollable vendor chart**: Implemented dynamic height calculation for vendor TAT chart based on filtered data count (minimum 300px, 40px per vendor) with search functionality
- **Integrated vendor search filter**: Added search input for vendor filtering with live results count and scrollable chart container for handling 100+ vendors efficiently

### January 14, 2025 - Management Section Complete Redesign
- **Redesigned KPI cards layout**: Transformed from gradient cards to executive snapshot style matching Sales section with clean white cards, larger icons, and proper spacing
- **Modernized Top Repair Vendors**: Converted to scrollable horizontal bar chart with YTD spend labeling and proper margins to prevent chart cropping
- **Removed irrelevant sections**: Eliminated Part Number Performance bubble chart, Key Accounts Funnel table, and Logistics Status Monitor as requested
- **Enhanced Employee Performance**: Redesigned to modern card-based layout with conversion rate progress bars, top performer highlighting (purple theme), and user-friendly team member visualization
- **Streamlined interface**: Reduced from 9 sections to 5 focused sections (Company Pulse, Sales/Quotes Trend, Cash Flow, Vendor Spend, Team Performance, Exceptions) for cleaner management overview
- **Improved chart consistency**: Applied consistent styling across all charts with enhanced tooltips, proper margins, and purple color scheme matching application branding

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES Modules (type: "module")
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **API Design**: RESTful endpoints with `/api` prefix

### Development Environment
- **Runtime**: Node.js with tsx for TypeScript execution
- **Development Server**: Vite development server with HMR
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Package Management**: npm with lockfile version 3

## Key Components

### Database Schema (shared/schema.ts)
- **Users Table**: Basic user authentication with username/password
- **Sales Data Table**: Comprehensive sales analytics including metrics like total sales, order counts, customer retention rates
- **Validation**: Zod schemas for type-safe data validation and insertion

### Frontend Components
- **Dashboard System**: Multi-category dashboard supporting sales, finance, inventory, operations, and fleet management
- **KPI Cards**: Visual metric displays with trend indicators
- **Performance Tables**: Tabular data presentation with time-based comparisons
- **Quick Insights**: Regional performance and recent order widgets
- **Sidebar Navigation**: Category-based navigation with aviation-themed styling

### Backend Infrastructure
- **Storage Interface**: Abstract storage layer with in-memory implementation for development
- **Route Registration**: Modular route system with HTTP server creation
- **Middleware**: Request logging, JSON parsing, error handling
- **Development Integration**: Vite middleware integration for seamless development experience

## Data Flow

### Client-Side Data Management
1. React Query handles all server-side state management
2. Components fetch data through standardized query functions
3. Static JSON data serves as development fallback (client/public/data/sales.json)
4. Type-safe data interfaces ensure consistency across the application

### Server-Side Request Handling
1. Express middleware processes incoming requests
2. Route handlers interact with storage interface
3. Database operations through Drizzle ORM
4. Structured error handling with appropriate HTTP status codes

### Database Operations
1. Drizzle ORM provides type-safe database interactions
2. Migration system manages schema changes
3. Environment-based configuration for different deployment stages
4. Connection pooling through Neon serverless infrastructure

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive primitive component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variant management

### Data and State Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities

### Development Tools
- **Replit Integration**: Custom plugins for Replit development environment
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundling for production builds

## Deployment Strategy

### Production Build Process
1. **Frontend**: Vite builds optimized React application to `dist/public`
2. **Backend**: ESBuild compiles TypeScript server code to `dist/index.js`
3. **Database**: Drizzle migrations ensure schema consistency
4. **Static Assets**: Frontend build includes all necessary static files

### Environment Configuration
- **Development**: Local development with Vite dev server and tsx execution
- **Production**: Node.js execution of compiled backend with served static frontend
- **Database**: Environment variable-based PostgreSQL connection configuration

### Key Architectural Decisions

#### Frontend Technology Stack
- **Problem**: Need for rapid UI development with consistent design system
- **Solution**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **Rationale**: Provides accessible components with customizable styling while maintaining development speed

#### Database and ORM Choice
- **Problem**: Type-safe database operations with modern PostgreSQL features
- **Solution**: Drizzle ORM with Neon Database
- **Rationale**: Offers better TypeScript integration than traditional ORMs while supporting serverless PostgreSQL deployment

#### State Management Approach
- **Problem**: Complex server state synchronization in dashboard application
- **Solution**: TanStack Query for server state, local React state for UI state
- **Rationale**: Separates concerns between server data caching and local UI state management

#### Monorepo Structure
- **Problem**: Shared types and utilities between frontend and backend
- **Solution**: Shared directory with common TypeScript definitions
- **Rationale**: Ensures type consistency across the full stack while maintaining clear separation of concerns