"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  FileText, 
  Settings, 
  Users, 
  BarChart, 
  ChevronLeft,
  ChevronRight,
  Receipt,
  FileSpreadsheet,
  Building2,
  PieChart,
  Cog,
  LogOut,
  Sun,
  Moon,
  Laptop,
  User,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useAuth } from '../auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { 
    name: 'Dashboard', 
    icon: Home, 
    href: '/',
    description: 'Overview of your business',
    color: 'text-blue-500'
  },
  { 
    name: 'Invoices', 
    icon: Receipt, 
    href: '/invoices',
    description: 'Manage your invoices',
    color: 'text-purple-500'
  },
  { 
    name: 'Clients', 
    icon: Building2, 
    href: '/clients',
    description: 'Your client database',
    color: 'text-green-500'
  },
  { 
    name: 'Importers', 
    icon: Truck, 
    href: '/importers',
    description: 'Manage importers',
    color: 'text-orange-500'
  },
  { 
    name: 'Reports', 
    icon: PieChart, 
    href: '/reports',
    description: 'Business analytics',
    color: 'text-yellow-500'
  },
  { 
    name: 'Settings', 
    icon: Cog, 
    href: '/settings',
    description: 'Configure your workspace',
    color: 'text-gray-500'
  },
];

const sidebarVariants = {
  expanded: {
    width: "240px",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  collapsed: {
    width: "80px",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

export const Sidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { signOut, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return Moon;
    if (theme === 'light') return Sun;
    return Laptop;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className="relative h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg flex flex-col"
    >
      <div className="flex-none p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Receipt className="h-8 w-8 text-primary flex-shrink-0" />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent whitespace-nowrap"
                >
                  InvoiceGen
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  onHoverStart={() => setHoveredItem(item.name)}
                  onHoverEnd={() => setHoveredItem(null)}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", item.color)} />
                  
                  {isExpanded && (
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 flex-1"
                    >
                      <p className="font-medium">{item.name}</p>
                      <AnimatePresence>
                        {hoveredItem === item.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs text-gray-500 dark:text-gray-400"
                          >
                            {item.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-none p-4 border-t border-gray-200 dark:border-gray-800">
        {user && (
          <div className="mb-4">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Avatar className="flex-shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {isExpanded && (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full",
              isExpanded ? "justify-start space-x-2" : "justify-center"
            )}
            onClick={toggleTheme}
          >
            <ThemeIcon className="h-4 w-4 flex-shrink-0" />
            {isExpanded && <span>{theme === 'dark' ? 'Dark Mode' : theme === 'light' ? 'Light Mode' : 'System Theme'}</span>}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
              isExpanded ? "justify-start space-x-2" : "justify-center"
            )}
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {isExpanded && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};