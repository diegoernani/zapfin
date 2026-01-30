import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquareText, BookOpen, Send, DollarSign } from "lucide-react";

const navigation = [
  { name: 'Simulator', href: '/', icon: MessageSquareText },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Setup Guide', href: '/setup', icon: BookOpen },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-border/50 sticky top-0 left-0">
      <div className="p-6">
        <div className="flex items-center gap-3 text-primary font-bold text-xl font-display">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <DollarSign className="w-6 h-6" />
          </div>
          ZapFin
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 translate-x-1"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground hover:translate-x-1"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl">
        <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
        <p className="text-xs text-gray-400 mb-3">Check the setup guide for connection instructions.</p>
        <Link href="/setup">
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors border border-white/10">
            Read Docs
          </button>
        </Link>
      </div>
    </div>
  );
}
