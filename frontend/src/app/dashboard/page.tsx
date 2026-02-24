import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import {
    TrendingUp, CheckCircle, AlertTriangle, Clock,
    Plus, FileText, Package, ArrowRight, BarChart3, PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- DUMMY DATA ---
const recentOffers = [
    { id: "1", no: "TKL-202402-01", customer: "Ahmet Lojistik", status: "Bekliyor", date: "12 Şub 2024" },
    { id: "2", no: "TKL-202402-02", customer: "Mehmet Nakliyat", status: "Onaylandı", date: "14 Şub 2024" },
    { id: "3", no: "TKL-202402-03", customer: "Yıldızlar A.Ş.", status: "Üretimde", date: "15 Şub 2024" },
    { id: "4", no: "TKL-202402-04", customer: "Kaya Harfiyat", status: "Bekliyor", date: "18 Şub 2024" },
    { id: "5", no: "TKL-202402-05", customer: "Demir İnşaat", status: "Tamamlandı", date: "20 Şub 2024" },
];

const pendingTasks = [
    { id: "1", task: "TKL-202402-01 için Müşteri Onayı Bekleniyor", type: "Onay", priority: "Yüksek" },
    { id: "2", task: "Depo 1'de 5mm Sac stoku kritik seviyenin altında!", type: "Stok", priority: "Acil" },
    { id: "3", task: "TKL-202402-02 Üretim Planlaması yapılacak", type: "Üretim", priority: "Orta" },
];

const monthlyData = [
    { month: "Eki", height: "h-[40%]" },
    { month: "Kas", height: "h-[60%]" },
    { month: "Ara", height: "h-[80%]" },
    { month: "Oca", height: "h-[50%]" },
    { month: "Şub", height: "h-[100%]" },
];

const popularTypes = [
    { name: "Damper", percent: 45, color: "bg-blue-500" },
    { name: "Küvet Kasa", percent: 35, color: "bg-indigo-500" },
    { name: "Platform", percent: 20, color: "bg-slate-300" },
];
// ------------------

export default function DashboardPage() {
    return (
        <div className="space-y-8 p-6 pb-16">
            {/* --- HEADER & QUICK ACTIONS --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Sisteme genel bakış ve operasyonel metrikler.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/stok" suppressHydrationWarning className={buttonVariants({ variant: "outline" })}>
                        <Package className="mr-2 h-4 w-4" />
                        Depoları Gör
                    </Link>
                    <Link href="/dashboard/offers" suppressHydrationWarning className={buttonVariants({ variant: "outline" })}>
                        <FileText className="mr-2 h-4 w-4" />
                        Tüm Teklifler
                    </Link>
                    <Link href="/dashboard/offers/create" suppressHydrationWarning className={buttonVariants({ variant: "default" })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Teklif
                    </Link>
                </div>
            </div>

            {/* --- 1. SUMMARY CARDS --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bu Ayki Teklifler</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45 Adet</div>
                        <p className="text-xs text-muted-foreground mt-1 text-green-600 font-medium">
                            Geçen aya göre %12 artış ↗
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Satışa Dönme Oranı</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">%68</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Son 30 gündeki tekliflerin onayı
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kritik Stok Uyarısı</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">3 Ürün</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Min. seviyenin altında! Stoklara göz atın.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bekleyen İmalat</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 Kalem</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Üretime girmeyi bekleyen şasi/araç
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* --- 2. VISUAL ANALYTICS --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-slate-500" />
                            Aylık Teklif Trendi
                        </CardTitle>
                        <CardDescription>Son 5 ayın teklif oluşturma performans grafiği</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] w-full flex items-end justify-between px-6 pt-4 mt-4">
                            {monthlyData.map((data, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 w-12 group cursor-pointer">
                                    <div className="w-full h-40 flex items-end justify-center">
                                        <div className={cn("w-10 bg-blue-500 rounded-t-md transition-all group-hover:bg-blue-600", data.height)}></div>
                                    </div>
                                    <span className="text-sm text-slate-500 font-medium group-hover:text-slate-900 transition-colors">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-slate-500" />
                            Popüler Üstyapı Tipleri
                        </CardTitle>
                        <CardDescription>Son 100 teklifte en çok tercih edilenler</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col justify-center h-[200px] space-y-4">
                            {popularTypes.map((type, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span>{type.name}</span>
                                        <span className="text-slate-500">%{type.percent}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full", type.color)} style={{ width: `${type.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- 3. OPERATIONAL TABLES --- */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Son Teklifler</CardTitle>
                            <CardDescription>Sisteme girilen en son 5 teklif</CardDescription>
                        </div>
                        <Link href="/dashboard/offers" suppressHydrationWarning className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                            Tümünü Gör <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Teklif No</TableHead>
                                    <TableHead>Müşteri</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="text-right">Tarih</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOffers.map((offer) => (
                                    <TableRow key={offer.id}>
                                        <TableCell className="font-medium text-slate-700">{offer.no}</TableCell>
                                        <TableCell>{offer.customer}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                offer.status === "Onaylandı" ? "default" :
                                                    offer.status === "Üretimde" ? "secondary" :
                                                        offer.status === "Tamamlandı" ? "outline" : "secondary"
                                            } className={cn(
                                                offer.status === "Onaylandı" && "bg-green-100 text-green-700 hover:bg-green-100",
                                                offer.status === "Üretimde" && "bg-blue-100 text-blue-700 hover:bg-blue-100",
                                                offer.status === "Bekliyor" && "bg-amber-100 text-amber-700 hover:bg-amber-100",
                                            )}>
                                                {offer.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">{offer.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-amber-200">
                    <CardHeader className="bg-amber-50/50 rounded-t-lg border-b border-amber-100 pb-4">
                        <CardTitle className="text-amber-800">Bekleyen İşler / Uyarılar</CardTitle>
                        <CardDescription className="text-amber-700/70">Aksiyon alınması gereken başlıklar</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {pendingTasks.map((task) => (
                                <div key={task.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-slate-800">{task.task}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs font-normal px-1.5 py-0">
                                                {task.type}
                                            </Badge>
                                        </p>
                                    </div>
                                    <Badge variant="destructive" className={cn(
                                        "shadow-none",
                                        task.priority === "Acil" ? "bg-red-500" :
                                            task.priority === "Yüksek" ? "bg-orange-500" : "bg-blue-500"
                                    )}>
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-amber-700 border-amber-200 hover:bg-amber-50">
                            Tüm İşleri Yönet
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
