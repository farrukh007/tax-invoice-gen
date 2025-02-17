"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    setShowPrompt(true);
    setTimeout(() => setShowPrompt(false), 3000);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toggleTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-64 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-sm"
          >
            {theme === 'dark' ? (
              <p className="text-gray-700 dark:text-gray-300">
                Prefer a darker screen? Switch to Dark Mode for a comfortable viewing experience, especially in low-light settings.
              </p>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                Want a brighter view? Switch to Light Mode for a crisp and clear interface, perfect for daytime use.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}