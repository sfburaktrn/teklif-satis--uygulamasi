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
import api from "@/lib/api";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    code: string;
    unit: string;
    category: string;
    supplier: string;
    currentStock: number;
    minStockLevel: number;
    price: number;
    currency: string;
}

export default function ProductsTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        unit: "Adet",
        category: "",
        supplier: "",
        price: 0,
        currency: "TRY"
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/products");
            setProducts(response.data);
        } catch (error) {
            toast.error("Ürünler yüklenirken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = async () => {
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
                toast.success("Ürün güncellendi");
            } else {
                await api.post("/products", formData);
                toast.success("Ürün eklendi");
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error("İşlem başarısız");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/products/${id}`);
                toast.success("Ürün silindi");
                fetchProducts();
            } catch (error) {
                toast.error("Ürün silinemedi (Kurallara bağlı olabilir)");
            }
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({ name: "", code: "", unit: "Adet", category: "", supplier: "", price: 0, currency: "TRY" });
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            code: product.code || "",
            unit: product.unit || "Adet",
            category: product.category || "",
            supplier: product.supplier || "",
            price: product.price || 0,
            currency: product.currency || "TRY",
        });
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Ürün ara..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Ürün Ekle
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kod</TableHead>
                            <TableHead>Ürün Adı</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Tedarikçi</TableHead>
                            <TableHead>Birim</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Kayıtlı ürün bulunamadı.</TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.code || "-"}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category || "-"}</TableCell>
                                    <TableCell>{product.supplier || "-"}</TableCell>
                                    <TableCell>{product.unit}</TableCell>
                                    <TableCell>{product.price} {product.currency}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                                            <Edit className="h-4 w-4 text-slate-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Ürün Adı *</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Stok Kodu</Label>
                                <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Kategori</Label>
                                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tedarikçi</Label>
                                <Input value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Birim</Label>
                                <Input value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Fiyat</Label>
                                <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button onClick={handleSave} disabled={!formData.name}>{editingProduct ? "Güncelle" : "Kaydet"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
