import { 
  BarChart3, 
  DollarSign, 
  Package, 
  Settings, 
  Plane,
  Truck,
  Wrench,
  Users,
  Zap,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from 'react';
import skymetricsLogo from "@assets/skymetrics-logo.png";
import type { DashboardCategory } from "@/types/dashboard";

interface SidebarProps {
  activeCategory: DashboardCategory;
  onCategorySelect: (category: DashboardCategory) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Sidebar({ activeCategory, onCategorySelect, isCollapsed, onToggleCollapsed }: SidebarProps) {
  const navigationItems = [
    {
      id: 'sales' as const,
      label: 'Sales',
      icon: BarChart3
    },
    {
      id: 'finance' as const,
      label: 'Finance',
      icon: DollarSign
    },
    {
      id: 'inventory' as const,
      label: 'Inventory',
      icon: Package
    },
    {
      id: 'operations' as const,
      label: 'Operations',
      icon: Settings
    },
    {
      id: 'logistics' as const,
      label: 'Logistics',
      icon: Truck
    },
    {
      id: 'repairs' as const,
      label: 'Repairs',
      icon: Wrench
    },
    {
      id: 'management' as const,
      label: 'Management',
      icon: Users
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={skymetricsLogo} 
              alt="SkyMetrics Logo" 
              className="w-8 h-8 rounded-lg object-contain"
            />
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-gray-900">skymetrics</h1>
                <p className="text-xs text-gray-500">Aviation Intelligence</p>
              </div>
            )}
          </div>
        </div>
        {/* Toggle button positioned to overlap the border */}
        <button
          onClick={onToggleCollapsed}
          className="absolute -bottom-3 right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onCategorySelect(item.id)}
              className={`group w-full flex items-center ${isCollapsed ? 'px-2 justify-center' : 'px-3'} py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">John Smith</p>
              <p className="text-xs text-gray-500 truncate">Analytics Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
