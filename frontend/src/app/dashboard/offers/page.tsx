"use client";

import Link from "next/link";
import { Plus, Search, Filter, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

interface Offer {
    id: string;
    teklifNo: string;
    musteriAdi: string;
    createdAt: string;
    satisSorumlusu: string;
    siparisAdeti: number;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teklifler</h1>
                    <p className="text-muted-foreground">
                        Tüm tekliflerinizi buradan yönetin.
                    </p>
                </div>
                <Link href="/dashboard/offers/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Teklif Oluştur
                    </Button>
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
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Yükleniyor...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : offers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Henüz teklif bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            offers.map((offer) => (
                                <TableRow key={offer.id}>
                                    <TableCell className="font-medium">{offer.teklifNo}</TableCell>
                                    <TableCell>{offer.musteriAdi}</TableCell>
                                    <TableCell>{offer.satisSorumlusu || "-"}</TableCell>
                                    <TableCell>{offer.siparisAdeti || "-"}</TableCell>
                                    <TableCell>
                                        {format(new Date(offer.createdAt), "d MMMM yyyy", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Link href={`/dashboard/offers/${offer.id}`}>
                                            <Button variant="ghost" size="sm">
                                                Detay
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(offer.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
