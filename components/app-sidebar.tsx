"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  Box,
  FileText,
  Share2,
  ClipboardList,
  Briefcase,
  Folder,
  Key,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  GalleryVerticalEnd,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useUserSession } from "@/lib/hooks/use-user-session";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard className="h-4 w-4" />,
  Clients: <Users className="h-4 w-4" />,
  "All Clients": <Users className="h-4 w-4" />,
  "Add Client": <UserCog className="h-4 w-4" />,
  Packages: <Package className="h-4 w-4" />,
  "all Package": <Box className="h-4 w-4" />,
  Template: <FileText className="h-4 w-4" />,
  Distribution: <Share2 className="h-4 w-4" />,
  "Clients to Agents": <Share2 className="h-4 w-4" />,
  "Task Categories": <ClipboardList className="h-4 w-4" />,
  Agents: <UserCog className="h-4 w-4" />,
  "All Agents": <Users className="h-4 w-4" />,
  "Add Agent": <UserCog className="h-4 w-4" />,
  "Assign-tasks": <ClipboardList className="h-4 w-4" />,
  "Agent Activity Logs": <FileText className="h-4 w-4" />,
  "Manage Access": <Shield className="h-4 w-4" />,
  "Team Management": <Briefcase className="h-4 w-4" />,
  "Role Permissions": <Key className="h-4 w-4" />,
  "User Management": <Users className="h-4 w-4" />,
  Tasks: <ClipboardList className="h-4 w-4" />,
  Projects: <Folder className="h-4 w-4" />,
};

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const [submenuOpen, setSubmenuOpen] = React.useState<Record<string, boolean>>({});
  const { user, loading } = useUserSession();
  const router = useRouter();
  const role = user?.role ?? "user";

  const data = {
    navItems: [
      { title: "Dashboard", url: role === "admin" ? "/admin" : "/agent", roles: ["admin", "agent"] },
      {
        title: "Clients",
        roles: ["admin"],
        children: [
          { title: "All Clients", url: "/admin/clients", roles: ["admin"] },
          { title: "Add Client", url: "/admin/clients/onboarding", roles: ["admin"] },
        ],
      },
      {
        title: "Packages",
        roles: ["admin"],
        children: [
          { title: "all Package", url: "/admin/packages", roles: ["admin"] },
          { title: "Template", url: "/admin/templates", roles: ["admin"] },
        ],
      },
      {
        title: "Distribution",
        roles: ["admin"],
        children: [{ title: "Clients to Agents", url: "/admin/distribution/client-agent", roles: ["admin"] }],
      },
      {
        title: "Tasks",
        roles: ["admin"],
        children: [{ title: "All Tasks", url: "/admin/tasks", roles: ["admin"] },{ title: "Task Categories", url: "/admin/tasks/tasks-categories", roles: ["admin"] }],
      },
      {
        title: "Agents",
        roles: ["admin"],
        children: [
          { title: "All Agents", url: "/admin/agents", roles: ["admin"] },
          { title: "Add Agent", url: "/admin/agents/create", roles: ["admin"] },
          { title: "Assign-tasks", url: "/admin/agents/assign-tasks", roles: ["admin"] },
          { title: "Agent Activity Logs", url: "/admin/agents/activity-logs", roles: ["admin"] },
          { title: "Manage Access", url: "/admin/agents/manage-access", roles: ["admin"] },
        ],
      },
      { title: "Team Management", url: "/admin/teams", roles: ["admin"] },
      { title: "Role Permissions", url: "/admin/role-permissions", roles: ["admin"] },
      { title: "User Management", url: "/admin/user", roles: ["admin"] },
      { title: "Tasks", url: "/agent/tasks", roles: ["agent"] },
      { title: "Projects", url: "/agent/projects", roles: ["agent"] },
    ],
  };

  const toggleSubmenu = (title: string) => {
    setSubmenuOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Close sidebar when navigating on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="shadow-lg bg-white/95 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
          transition: { type: "spring", damping: 25, stiffness: 200 }
        }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64",
          "bg-gradient-to-b from-slate-50 via-white to-slate-50",
          "border-r border-gray-200/80 shadow-xl",
          "flex flex-col",
          className
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GalleryVerticalEnd className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Birds Of Eden
                </h1>
                <p className="text-xs text-gray-500">Enterprise Plan</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Role Badge */}
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md px-2 py-0.5">
              <Shield className="h-3 w-3 mr-1" />
              {role.charAt(0).toUpperCase() + role.slice(1)} Area
            </Badge>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                <Bell className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {data.navItems
              .filter((item) => !item.roles || item.roles.includes(role))
              .map((item) => {
                const hasChildren = !!item.children;
                const isActive = hasChildren
                  ? item.children?.some((child) => child.url === pathname)
                  : item.url === pathname;

                if (hasChildren) {
                  return (
                    <div key={item.title} className="space-y-1">
                      <motion.div
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSubmenu(item.title)}
                        className={cn(
                          "cursor-pointer p-2.5 rounded-lg flex items-center justify-between",
                          "transition-all duration-200 group",
                          "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50",
                          "hover:shadow-sm hover:border-gray-200/50 border border-transparent",
                          isActive && "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200/50 shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            "bg-gradient-to-br from-gray-100 to-gray-200",
                            "group-hover:from-cyan-100 group-hover:to-blue-100",
                            isActive && "from-cyan-500 to-blue-500 text-white shadow-md"
                          )}>
                            {iconMap[item.title]}
                          </div>
                          <span className={cn(
                            "font-medium transition-colors duration-200",
                            "text-gray-700 group-hover:text-gray-900",
                            isActive && "text-cyan-700"
                          )}>
                            {item.title}
                          </span>
                        </div>
                        <motion.div
                          animate={{ 
                            rotate: submenuOpen[item.title] ? 90 : 0,
                            color: isActive ? "#0891b2" : "#6b7280"
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </motion.div>

                      <AnimatePresence>
                        {submenuOpen[item.title] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-6 space-y-1"
                          >
                            {item.children
                              ?.filter((child) => child.roles?.includes(role))
                              .map((child) => (
                                <Link
                                  key={child.title}
                                  href={child.url}
                                  className={cn(
                                    "flex items-center gap-3 p-2.5 rounded-lg",
                                    "transition-all duration-200 hover:bg-gray-50",
                                    child.url === pathname && "bg-cyan-50 text-cyan-700 font-medium"
                                  )}
                                >
                                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                                  <div className="p-1.5 rounded-md bg-gray-100">
                                    {iconMap[child.title]}
                                  </div>
                                  <span className="text-sm font-medium text-gray-600">
                                    {child.title}
                                  </span>
                                </Link>
                              ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={cn(
                      "block p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50",
                      isActive && "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200/50 shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200",
                        isActive && "from-cyan-500 to-blue-500 text-white shadow-md"
                      )}>
                        {iconMap[item.title]}
                      </div>
                      <span className={cn(
                        "font-medium text-gray-700",
                        isActive && "text-cyan-700"
                      )}>
                        {item.title}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm mb-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
              <AvatarFallback className="bg-gradient-to-tr from-cyan-500 to-blue-500 text-white font-semibold">
                {user?.name?.substring(0, 2) || "US"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              signOut().then((success) => {
                if (success) {
                  router.push("/auth/sign-in"); // ✅ works now
                }
              });
            }}
          >
  <LogOut className="h-4 w-4" />
  <span className="font-medium">Sign out</span>
</Button>
        </div>
      </motion.aside>

      {/* Spacer for desktop */}
      {sidebarOpen && <div className="w-64 flex-shrink-0 hidden md:block" />}
    </>
  );
}