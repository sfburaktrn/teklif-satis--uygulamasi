"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2, Trash2, Edit } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    unit: string;
}

interface BomRule {
    id: string;
    groupName: string;
    fieldName: string;
    fieldValue: string | null;
    quantity: number;
    productId: string;
    product: Product;
}

// Commonly used fields from Offer for conditional rules
const OFFER_FIELDS = [
    { value: "hacimTipi", label: "Hacim Tipi" },
    { value: "hacim", label: "Hacim" },
    { value: "kasaUzunlugu", label: "Kasa Uzunluğu" },
    { value: "arkaKapakTipi", label: "Arka Kapak Tipi" },
    { value: "silindirTipi", label: "Silindir Tipi" },
    { value: "kurekTipi", label: "Kürek Tipi" },
    { value: "dingilTipiVeAdeti", label: "Dingil Tipi/Adeti" },
    { value: "stepneTasiyici", label: "Stepne Taşıyıcı" },
    { value: "bisikletKorkulugu", label: "Bisiklet Korkuluğu" },
    { value: "yagTanki", label: "Yağ Tankı" },
];

export default function RulesTable() {
    const [rules, setRules] = useState<BomRule[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<BomRule | null>(null);

    const [ruleType, setRuleType] = useState<"standard" | "conditional">("standard");

    const [formData, setFormData] = useState({
        productId: "",
        groupName: "GENEL",
        fieldName: "GLOBAL",
        fieldValue: "",
        quantity: 1,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rulesRes, productsRes] = await Promise.all([
                api.get("/bom-rules"),
                api.get("/products")
            ]);
            setRules(rulesRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            toast.error("Veriler yüklenirken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                fieldName: ruleType === "standard" ? "GLOBAL" : formData.fieldName,
                fieldValue: ruleType === "standard" ? null : formData.fieldValue || null,
            };

            if (editingRule) {
                await api.put(`/bom-rules/${editingRule.id}`, payload);
                toast.success("Kural güncellendi");
            } else {
                await api.post("/bom-rules", payload);
                toast.success("Kural eklendi");
            }
            setIsModalOpen(false);
            setEditingRule(null);
            fetchData();
        } catch (error) {
            toast.error("İşlem başarısız");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bu kuralı silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/bom-rules/${id}`);
                toast.success("Kural silindi");
                fetchData();
            } catch (error) {
                toast.error("Kural silinemedi");
            }
        }
    };

    const openCreateModal = () => {
        setEditingRule(null);
        setRuleType("standard");
        setFormData({
            productId: "",
            groupName: "GENEL",
            fieldName: "GLOBAL",
            fieldValue: "",
            quantity: 1,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (rule: BomRule) => {
        setEditingRule(rule);
        setRuleType(rule.fieldName === "GLOBAL" ? "standard" : "conditional");
        setFormData({
            productId: rule.productId,
            groupName: rule.groupName || "GENEL",
            fieldName: rule.fieldName,
            fieldValue: rule.fieldValue || "",
            quantity: rule.quantity,
        });
        setIsModalOpen(true);
    };

    const filteredRules = rules.filter(r =>
        r.product?.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.groupName && r.groupName.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Kural veya ürün ara..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Kural Ekle
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ürün (Malzeme)</TableHead>
                            <TableHead>Grup</TableHead>
                            <TableHead>Kural Tipi</TableHead>
                            <TableHead>Koşul Değeri</TableHead>
                            <TableHead>Miktar</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredRules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Kayıtlı kural bulunamadı.</TableCell>
                            </TableRow>
                        ) : (
                            filteredRules.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell className="font-medium">{rule.product?.name}</TableCell>
                                    <TableCell>{rule.groupName}</TableCell>
                                    <TableCell>
                                        {rule.fieldName === "GLOBAL" ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Standart (Her Teklife)</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Koşullu ({rule.fieldName})</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{rule.fieldValue || "-"}</TableCell>
                                    <TableCell>{rule.quantity} {rule.product?.unit}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEditModal(rule)}>
                                            <Edit className="h-4 w-4 text-slate-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingRule ? "Kuralı Düzenle" : "Yeni Kural Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">

                        <div className="grid gap-2">
                            <Label>Hangi Ürün Eklenecek? *</Label>
                            <Select value={formData.productId} onValueChange={(v) => setFormData({ ...formData, productId: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Ürün seçiniz..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Grup Adı</Label>
                            <Input value={formData.groupName} onChange={e => setFormData({ ...formData, groupName: e.target.value })} placeholder="Örn: GENEL, HİDROLİK DORSE" />
                        </div>

                        <div className="grid gap-2">
                            <Label>Miktar (Adet/Birim) *</Label>
                            <Input type="number" step="0.01" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} />
                        </div>

                        <div className="grid gap-2 mt-2">
                            <Label>Kural Tipi</Label>
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={ruleType === "standard"} onChange={() => setRuleType("standard")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                    <span className="text-sm">Standart (Her Teklife Ekle)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={ruleType === "conditional"} onChange={() => setRuleType("conditional")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                    <span className="text-sm">Koşullu (Soruya Bağlı)</span>
                                </label>
                            </div>
                        </div>

                        {ruleType === "conditional" && (
                            <div className="grid gap-4 border p-4 rounded-md bg-slate-50">
                                <div className="grid gap-2">
                                    <Label>Hangi Soru? (Alan Adı)</Label>
                                    <Select value={formData.fieldName} onValueChange={(v) => setFormData({ ...formData, fieldName: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Soru alanı seçiniz..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {OFFER_FIELDS.map(f => (
                                                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                            ))}
                                            <SelectItem value="OTHER">Diğer (Manuel Gir)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>İstenen Cevap (Koşul Değeri)</Label>
                                    <Input value={formData.fieldValue} onChange={e => setFormData({ ...formData, fieldValue: e.target.value })} placeholder="Örn: Hidrolik" />
                                    <p className="text-xs text-muted-foreground">Teklif formunda bu alana bu değer girildiğinde ürün ağacına eklenecektir.</p>
                                </div>
                            </div>
                        )}

                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button onClick={handleSave} disabled={!formData.productId || !formData.quantity}>
                            {editingRule ? "Güncelle" : "Kaydet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
