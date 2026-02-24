"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Loader2, Trash2, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OfferItem {
    id: string;
    imalatNo: string;
    status: string;
}

interface Offer {
    id: string;
    teklifNo: string;
    musteriAdi: string;
    createdAt: string;
    satisSorumlusu: string;
    siparisAdeti: number;
    items?: OfferItem[];
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const fetchOffers = async () => {
        try {
            const response = await api.get("/offers");
            setOffers(response.data);
        } catch (error) {
            console.error("Teklifler yüklenirken hata oluştu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Bu teklifi silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/offers/${id}`);
                toast.success("Teklif başarıyla silindi.");
                fetchOffers(); // Refresh list
            } catch (error) {
                console.error("Silme işlemi başarısız:", error);
                toast.error("Teklif silinirken bir hata oluştu.");
            }
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teklifler</h1>
                    <p className="text-muted-foreground">
                        Tüm tekliflerinizi buradan yönetin.
                    </p>
                </div>
                <Link href="/dashboard/offers/create" className={buttonVariants({ variant: "default" })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Teklif Oluştur
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tekliflerde ara..."
                        className="pl-8"
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Teklif No</TableHead>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Satış Sorumlusu</TableHead>
                            <TableHead>Adet</TableHead>
                            <TableHead>Oluşturulma Tarihi</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Yükleniyor...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : offers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Henüz teklif bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            offers.map((offer) => (
                                <React.Fragment key={offer.id}>
                                    <TableRow className={cn("hover:bg-muted/50 cursor-pointer", expandedRows[offer.id] && "bg-muted/50")} onClick={() => toggleRow(offer.id)}>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                {expandedRows[offer.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-medium">{offer.teklifNo}</TableCell>
                                        <TableCell>{offer.musteriAdi}</TableCell>
                                        <TableCell>{offer.satisSorumlusu || "-"}</TableCell>
                                        <TableCell>{offer.siparisAdeti || "-"}</TableCell>
                                        <TableCell>
                                            {format(new Date(offer.createdAt), "d MMMM yyyy", { locale: tr })}
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/offers/${offer.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                                                    Teklif Detayı
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(offer.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Nested Items Row */}
                                    {expandedRows[offer.id] && offer.items && offer.items.length > 0 && (
                                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                                            <TableCell colSpan={7} className="p-0 border-b-0">
                                                <div className="pl-14 pr-6 py-4 bg-muted/10 border-t">
                                                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">İmalat Kalemleri ({offer.items.length} Adet)</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {offer.items.map(item => (
                                                            <div key={item.id} className="flex items-center justify-between bg-white border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow">
                                                                <div>
                                                                    <div className="font-mono text-sm font-bold text-blue-700">{item.imalatNo}</div>
                                                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                                        Durum: <span className="font-medium text-black px-1.5 py-0.5 bg-gray-100 rounded-sm">{item.status || 'Bekliyor'}</span>
                                                                    </div>
                                                                </div>
                                                                <Link href={`/dashboard/offers/${offer.id}/bom?item=${item.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 text-xs" })}>
                                                                    <FileText className="h-3 w-3 mr-1" />
                                                                    Rapor
                                                                </Link>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

