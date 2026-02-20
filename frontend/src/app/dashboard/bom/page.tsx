"use client";

import { useState } from "react";
import ProductsTable from "@/components/bom/ProductsTable";
import RulesTable from "@/components/bom/RulesTable";
import { Package, SearchCode } from "lucide-react";

export default function BOMPage() {
    const [activeTab, setActiveTab] = useState<"products" | "rules">("products");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Ürün Ağacı Yönetimi
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Sistemdeki malzemeleri ve tekliflerde geçerli olacak kuralları yönetin.
                    </p>
                </div>
            </div>

            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`${activeTab === "products"
                                ? "border-slate-900 text-slate-900"
                                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                            } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium items-center gap-2`}
                    >
                        <Package className="h-5 w-5" />
                        Ürünler (Malzemeler)
                    </button>
                    <button
                        onClick={() => setActiveTab("rules")}
                        className={`${activeTab === "rules"
                                ? "border-slate-900 text-slate-900"
                                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                            } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium items-center gap-2`}
                    >
                        <SearchCode className="h-5 w-5" />
                        Kurallar
                    </button>
                </nav>
            </div>

            <main className="mt-6">
                {activeTab === "products" ? <ProductsTable /> : <RulesTable />}
            </main>
        </div>
    );
}
