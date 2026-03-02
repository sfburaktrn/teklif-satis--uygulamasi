"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface ItemForm {
    description: string;
    productStatus: string;
    neededQuantity: number;
    stockQuantity: number;
    requestedQuantity: number;
    unit: string;
}

export default function CreatePurchaseRequestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        department: "",
        requestType: "",
        requestReason: "",
        requesterName: "",
        departmentManager: "",
        generalManager: "",
    });

    const [items, setItems] = useState<ItemForm[]>([
        {
            description: "",
            productStatus: "1",
            neededQuantity: 1,
            stockQuantity: 0,
            requestedQuantity: 1,
            unit: "Adet",
        }
    ]);

    const handleFormChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleItemChange = (index: number, key: keyof ItemForm, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, {
            description: "",
            productStatus: "1",
            neededQuantity: 1,
            stockQuantity: 0,
            requestedQuantity: 1,
            unit: "Adet",
        }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation basic
        if (!form.department || !form.requesterName) {
            toast.error("Lütfen Talep Eden Birim ve İsim alanlarını doldurun.");
            return;
        }

        if (items.some(i => !i.description || i.requestedQuantity <= 0)) {
            toast.error("Lütfen tüm kalemlerin tanımını ve miktarını doğru girin.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/purchase", {
                ...form,
                items: items.map(item => ({
                    ...item,
                    neededQuantity: Number(item.neededQuantity),
                    stockQuantity: Number(item.stockQuantity),
                    requestedQuantity: Number(item.requestedQuantity),
                }))
            });
            toast.success("Talep başarıyla oluşturuldu.");
            router.push("/dashboard/purchase");
        } catch (error) {
            console.error(error);
            toast.error("Kaydedilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 pb-24 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <div className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <Link href="/dashboard/purchase">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Yeni Satın Alma Talebi</h1>
                    <p className="text-muted-foreground">
                        Malzeme ihtiyaç onay formu oluşturun.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Genel Bilgiler</CardTitle>
                    <CardDescription>Talebeye ait ana bilgiler ve yöneticiler</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Talep Eden Birim</Label>
                        <Select value={form.department} onValueChange={(v) => handleFormChange("department", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Birim Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kalite Yönetimi">Kalite Yönetimi</SelectItem>
                                <SelectItem value="Yönetimin Sorumluluğu">Yönetimin Sorumluluğu</SelectItem>
                                <SelectItem value="Kaynak Yönetimi">Kaynak Yönetimi</SelectItem>
                                <SelectItem value="Ürün Gerçekleştirme">Ürün Gerçekleştirme</SelectItem>
                                <SelectItem value="Ölçme Analiz">Ölçme Analiz İyileştirme</SelectItem>
                                <SelectItem value="Diğer">Diğer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Talep Türü</Label>
                        <Select value={form.requestType} onValueChange={(v) => handleFormChange("requestType", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Talep Türü Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">Zorunlu (A)</SelectItem>
                                <SelectItem value="B">Zorunlu Olmayan (B)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Talep Nedeni</Label>
                        <Select value={form.requestReason} onValueChange={(v) => handleFormChange("requestReason", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Neden Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Yeni Sipariş (1)</SelectItem>
                                <SelectItem value="2">Stok (2)</SelectItem>
                                <SelectItem value="3">Tamir (3)</SelectItem>
                                <SelectItem value="4">Diğer (4)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Talep Eden Kişi</Label>
                        <Input
                            placeholder="İsim Soyisim"
                            value={form.requesterName}
                            onChange={(e) => handleFormChange("requesterName", e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b">
                    <div>
                        <CardTitle>Talep Edilen Malzemeler</CardTitle>
                        <CardDescription>İstenilen miktar ve ürün durumu</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                        <Plus className="h-4 w-4" /> Kalem Ekle
                    </Button>
                </CardHeader>
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Malzeme Tanımı</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>İhtiyaç</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Talep</TableHead>
                                <TableHead>Birim</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index} className="hover:bg-transparent">
                                    <TableCell>
                                        <Input
                                            placeholder="Malzeme adı..."
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={item.productStatus} onValueChange={(v) => handleItemChange(index, "productStatus", v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Standart (1)</SelectItem>
                                                <SelectItem value="2">Yeni (2)</SelectItem>
                                                <SelectItem value="3">Muadil (3)</SelectItem>
                                                <SelectItem value="4">Satış Şartı (4)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number" min="0" step="0.1"
                                            value={item.neededQuantity}
                                            onChange={(e) => handleItemChange(index, "neededQuantity", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number" min="0" step="0.1"
                                            value={item.stockQuantity}
                                            onChange={(e) => handleItemChange(index, "stockQuantity", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number" min="0.1" step="0.1"
                                            value={item.requestedQuantity}
                                            onChange={(e) => handleItemChange(index, "requestedQuantity", e.target.value)}
                                            className="font-bold border-blue-200 bg-blue-50 focus-visible:ring-blue-500"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={item.unit} onValueChange={(v) => handleItemChange(index, "unit", v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Adet">Adet</SelectItem>
                                                <SelectItem value="Kg">Kg</SelectItem>
                                                <SelectItem value="Mt">Metre</SelectItem>
                                                <SelectItem value="Lt">Litre</SelectItem>
                                                <SelectItem value="Takım">Takım</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => removeItem(index)}
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto font-medium gap-2">
                    {loading ? "Göderiliyor..." : <><Save className="w-5 h-5" /> Talebi Kaydet</>}
                </Button>
            </div>
        </form>
    );
}
