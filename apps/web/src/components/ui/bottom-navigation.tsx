/**
 * Bottom navigation component for mobile devices
 * Provides a native app-like navigation experience
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { 
  Settings, 
  Users, 
  UserCheck, 
  UserPlus, 
  Gift,
  Home
} from "lucide-react";

/**
 * Bottom navigation component with active state highlighting
 * 
 * @returns BottomNavigation JSX element
 */
export function BottomNavigation() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Hide bottom navigation for unauthenticated users
  if (loading || !user) {
    return null;
  }

  /**
   * Navigation items for bottom navigation
   */
  const navItems = [
    {
      href: "/onboarding",
      label: "Setup",
      icon: Settings,
      active: pathname === "/onboarding"
    },
    {
      href: "/matches",
      label: "Matches",
      icon: Users,
      active: pathname === "/matches"
    },
    {
      href: "/cohorts",
      label: "Cohorts",
      icon: UserCheck,
      active: pathname === "/cohorts"
    },
    {
      href: "/connections",
      label: "Connections",
      icon: UserPlus,
      active: pathname === "/connections"
    },
    {
      href: "/referrals",
      label: "Referrals",
      icon: Gift,
      active: pathname === "/referrals"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-white border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-colors",
                  item.active
                    ? "text-primary-600"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  item.active && "text-primary-600"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  item.active && "text-primary-600"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
