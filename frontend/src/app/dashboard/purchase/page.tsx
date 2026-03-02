"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Plus, Search, Loader2, Trash2, ShoppingCart, CheckCircle, Clock } from "lucide-react";
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

interface PurchaseRequest {
    id: string;
    requestNo: string;
    department: string;
    requesterName: string;
    status: string;
    createdAt: string;
}

export default function PurchasePage() {
    const [requests, setRequests] = useState<PurchaseRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const response = await api.get("/purchase");
            setRequests(response.data);
        } catch (error) {
            console.error("Satın alma talepleri yüklenirken hata oluştu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Bu talebi silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/purchase/${id}`);
                toast.success("Talep başarıyla silindi.");
                fetchRequests();
            } catch (error) {
                console.error("Silme işlemi başarısız:", error);
                toast.error("Talep silinirken bir hata oluştu.");
            }
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Satın Alma Talepleri</h1>
                    <p className="text-muted-foreground">
                        Malzeme ihtiyaç taleplerini ve onay formlarını buradan yönetin.
                    </p>
                </div>
                <div className={buttonVariants({ variant: "default" })}>
                    <Link href="/dashboard/purchase/create" className="flex items-center gap-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Talep Oluştur
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Taleplerde ara..."
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Talep No</TableHead>
                            <TableHead>Birim</TableHead>
                            <TableHead>Talep Eden</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Yükleniyor...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Henüz satın alma talebi bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium text-blue-600">{req.requestNo}</TableCell>
                                    <TableCell>{req.department || "-"}</TableCell>
                                    <TableCell>{req.requesterName || "-"}</TableCell>
                                    <TableCell>
                                        {format(new Date(req.createdAt), "d MMMM yyyy", { locale: tr })}
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${req.status === "Bekliyor" ? "bg-amber-100 text-amber-700" :
                                            req.status === "Onaylandı" ? "bg-green-100 text-green-700" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                            {req.status === "Bekliyor" ? <Clock className="w-3.5 h-3.5" /> : req.status === "Onaylandı" ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                                            {req.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className={buttonVariants({ variant: "outline", size: "sm" })}>
                                                <Link href={`/dashboard/purchase/${req.id}`}>
                                                    Detay & Onay
                                                </Link>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(req.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
