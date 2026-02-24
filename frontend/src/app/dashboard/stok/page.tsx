import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function StokPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Stok Yönetimi</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Depo 1 */}
                <Card className="hover:border-blue-500 transition-colors cursor-pointer border-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-2xl font-bold text-slate-800">Depo 1</CardTitle>
                        <Package className="h-8 w-8 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium text-slate-500">Ana Depo</p>
                    </CardContent>
                </Card>

                {/* Depo 2 */}
                <Card className="hover:border-green-500 transition-colors cursor-pointer border-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-2xl font-bold text-slate-800">Depo 2</CardTitle>
                        <Package className="h-8 w-8 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium text-slate-500">Ara Depo</p>
                    </CardContent>
                </Card>

                {/* Depo 3 */}
                <Card className="hover:border-orange-500 transition-colors cursor-pointer border-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-2xl font-bold text-slate-800">Depo 3</CardTitle>
                        <Package className="h-8 w-8 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium text-slate-500">Yedek Parça Depo</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
