"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Settings,
    Package,
    Users,
    LogOut,
    Archive
} from "lucide-react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Teklifler",
        href: "/dashboard/offers",
        icon: FileText,
    },
    {
        title: "Ürün Ağacı",
        href: "/dashboard/bom",
        icon: Package,
    },
    {
        title: "Stok",
        href: "/dashboard/stok",
        icon: Archive,
    },
    {
        title: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-slate-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-slate-800">
                <h1 className="text-2xl font-bold tracking-wider">ÖZÜNLÜ</h1>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            suppressHydrationWarning
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-800",
                                isActive ? "bg-slate-800 text-blue-400" : "text-slate-400"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-slate-800 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}
