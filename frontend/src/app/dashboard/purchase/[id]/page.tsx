"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, CheckCircle, Trash2, Save, ShoppingCart, FileText } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function PurchaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [quoteForm, setQuoteForm] = useState({
        supplierName: "",
        brand: "",
        unitPrice: 0,
        currency: "TRY",
        deliveryTime: "",
    });

    const fetchRequest = async () => {
        try {
            const res = await api.get(`/purchase/${params.id}`);
            setRequest(res.data);
        } catch (error) {
            toast.error("Talep detayları alınamadı.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) fetchRequest();
    }, [params.id]);

    const openQuoteModal = (itemId: string) => {
        setSelectedItemId(itemId);
        setQuoteForm({ supplierName: "", brand: "", unitPrice: 0, currency: "TRY", deliveryTime: "" });
        setIsQuoteModalOpen(true);
    };

    const handleAddQuote = async () => {
        if (!quoteForm.supplierName || quoteForm.unitPrice <= 0) {
            toast.error("Lütfen firma adı ve geçerli bir birim fiyat girin.");
            return;
        }

        try {
            const dataToSubmit = {
                ...quoteForm,
                unitPrice: Number(quoteForm.unitPrice),
                totalPrice: Number(quoteForm.unitPrice), // A simple total, or calculate: unitPrice * requestedQty
            };

            await api.post(`/purchase/items/${selectedItemId}/quotes`, dataToSubmit);
            toast.success("Teklif eklendi.");
            setIsQuoteModalOpen(false);
            fetchRequest(); // Refresh
        } catch (error) {
            toast.error("Teklif eklenirken hata oluştu.");
        }
    };

    const handleDeleteQuote = async (quoteId: string) => {
        if (!confirm("Teklifi silmek istediğinize emin misiniz?")) return;
        try {
            await api.delete(`/purchase/quotes/${quoteId}`);
            toast.success("Teklif silindi.");
            fetchRequest();
        } catch (error) {
            toast.error("Silme başarısız.");
        }
    };

    const handleApproveQuote = async (itemId: string, quoteId: string, itemRequestedQty: number) => {
        const approvedQtyStr = prompt("Onaylanacak miktarı giriniz:", itemRequestedQty.toString());
        if (approvedQtyStr === null) return;

        const approvedQuantity = Number(approvedQtyStr);
        if (isNaN(approvedQuantity) || approvedQuantity <= 0) {
            toast.error("Geçersiz miktar.");
            return;
        }

        try {
            await api.post(`/purchase/items/${itemId}/quotes/${quoteId}/approve`, { approvedQuantity });
            toast.success("Teklif onaylandı!");
            // Update request status if all items are approved (or just set it directly for simplicity)

            // For now, let's also update the main request status to "Onaylandı" if not already
            if (request.status !== "Onaylandı") {
                await api.patch(`/purchase/${request.id}`, { status: "Onaylandı" });
            }

            fetchRequest();
        } catch (error) {
            toast.error("Onaylama işlemi başarısız.");
        }
    };

    if (loading) return <div className="p-10 flex justify-center">Yükleniyor...</div>;
    if (!request) return <div className="p-10 text-center text-red-500">Talep bulunamadı.</div>;

    return (
        <div className="space-y-6 p-6 pb-24 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={buttonVariants({ variant: "ghost", size: "icon" })}>
                        <Link href="/dashboard/purchase">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Talep Detayı & Mukayese</h1>
                        <p className="text-muted-foreground">
                            {request.requestNo} numaralı satın alma talebi
                        </p>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${request.status === "Onaylandı" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                    {request.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="bg-slate-50 border-b pb-4">
                            <CardTitle className="text-lg">Genel Bilgiler</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block mb-1">Tarih</span>
                                <span className="font-medium">{format(new Date(request.createdAt), "dd MMMM yyyy HH:mm", { locale: tr })}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Talep Eden Birim</span>
                                <span className="font-medium">{request.department || "-"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Talep Eden Kişi</span>
                                <span className="font-medium">{request.requesterName || "-"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Talep Nedeni & Türü</span>
                                <span className="font-medium">Neden: {request.requestReason || "-"} / Tür: {request.requestType || "-"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {request.items?.map((item: any, index: number) => (
                        <Card key={item.id} className="overflow-hidden border-2 border-slate-100">
                            <CardHeader className="bg-white border-b flex flex-row items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-blue-900">{item.description}</CardTitle>
                                        <CardDescription className="flex items-center gap-4 mt-1">
                                            <span>Miktar: <b>{item.requestedQuantity} {item.unit}</b></span>
                                            <span>Stok: {item.stockQuantity}</span>
                                            {item.approvedQuantity && (
                                                <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                                                    Onaylanan: {item.approvedQuantity} {item.unit}
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => openQuoteModal(item.id)} className="gap-2 shrink-0">
                                    <Plus className="w-4 h-4" /> Firma Teklifi Ekle
                                </Button>
                            </CardHeader>
                            <div className="bg-slate-50 p-4">
                                <h4 className="text-sm font-semibold text-slate-500 mb-3 ml-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> MUKAYESE TABLOSU
                                </h4>
                                {item.quotes && item.quotes.length > 0 ? (
                                    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-100/50">
                                                <TableRow>
                                                    <TableHead>Firma / Tedarikçi</TableHead>
                                                    <TableHead>Marka</TableHead>
                                                    <TableHead>Termin</TableHead>
                                                    <TableHead className="text-right">Birim Fiyat</TableHead>
                                                    <TableHead className="text-right">Toplam Fiyat</TableHead>
                                                    <TableHead className="text-right w-[200px]">İşlem</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {item.quotes.map((quote: any) => {
                                                    const isSelected = item.selectedQuoteId === quote.id;
                                                    const computedTotal = quote.unitPrice * item.requestedQuantity;

                                                    return (
                                                        <TableRow key={quote.id} className={isSelected ? "bg-green-50 hover:bg-green-50/80" : ""}>
                                                            <TableCell className="font-semibold text-slate-800">
                                                                {isSelected && <CheckCircle className="w-4 h-4 text-green-600 inline mr-2" />}
                                                                {quote.supplierName}
                                                            </TableCell>
                                                            <TableCell>{quote.brand || "-"}</TableCell>
                                                            <TableCell>{quote.deliveryTime || "-"}</TableCell>
                                                            <TableCell className="text-right font-medium">
                                                                {quote.unitPrice.toLocaleString('tr-TR')} {quote.currency}
                                                            </TableCell>
                                                            <TableCell className="text-right font-bold text-slate-900">
                                                                {computedTotal.toLocaleString('tr-TR')} {quote.currency}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {!isSelected && (
                                                                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 h-8" onClick={() => handleApproveQuote(item.id, quote.id, item.requestedQuantity)}>
                                                                            Seç ve Onayla
                                                                        </Button>
                                                                    )}
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDeleteQuote(quote.id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground bg-white rounded-md border border-dashed">
                                        Bu kalem için henüz firmalardan teklif girilmemiş.
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yeni Teklif Ekle</DialogTitle>
                        <DialogDescription>
                            Firmadan alınan teklif bilgilerini giriniz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Firma Adı</Label>
                            <Input
                                className="col-span-3"
                                value={quoteForm.supplierName}
                                autoFocus
                                onChange={e => setQuoteForm({ ...quoteForm, supplierName: e.target.value })}
                                placeholder="Örn: Anadolu Pazarlama"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Marka</Label>
                            <Input
                                className="col-span-3"
                                value={quoteForm.brand}
                                onChange={e => setQuoteForm({ ...quoteForm, brand: e.target.value })}
                                placeholder="Örn: SKF"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Birim Fiyat</Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={quoteForm.unitPrice || ""}
                                    onChange={e => setQuoteForm({ ...quoteForm, unitPrice: Number(e.target.value) })}
                                />
                                <select
                                    className="flex h-10 w-[80px] items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={quoteForm.currency}
                                    onChange={e => setQuoteForm({ ...quoteForm, currency: e.target.value })}
                                >
                                    <option value="TRY">TL</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Termin</Label>
                            <Input
                                className="col-span-3"
                                value={quoteForm.deliveryTime}
                                onChange={e => setQuoteForm({ ...quoteForm, deliveryTime: e.target.value })}
                                placeholder="Örn: 3 Gün"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsQuoteModalOpen(false)}>İptal</Button>
                        <Button type="button" onClick={handleAddQuote} className="gap-2"><Save className="w-4 h-4" /> Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
