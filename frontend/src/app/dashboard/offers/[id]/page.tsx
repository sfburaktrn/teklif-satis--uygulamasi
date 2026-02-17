"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OfferForm from "@/components/offers/offer-form";
import api from "@/lib/api";
import { Loader2, FileText, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BomItem } from "@/types/bom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function OfferDetailsPage() {
    const params = useParams();
    const offerId = params.id as string;

    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Tab state: "offer" or "bom"
    const [activeTab, setActiveTab] = useState<"offer" | "bom">("offer");

    // BOM state
    const [bom, setBom] = useState<BomItem[]>([]);
    const [bomLoading, setBomLoading] = useState(false);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const response = await api.get(`/offers/${offerId}`);
                setOffer(response.data);
            } catch (error) {
                console.error("Teklif yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        if (offerId) {
            fetchOffer();
        }
    }, [offerId]);

    // Fetch BOM when tab switches to "bom"
    useEffect(() => {
        if (activeTab === "bom" && bom.length === 0) {
            setBomLoading(true);
            fetch(`http://localhost:3001/bom/${offerId}`)
                .then((res) => {
                    if (!res.ok) throw new Error("BOM verisi alınamadı");
                    return res.json();
                })
                .then((data) => setBom(data))
                .catch((err) => console.error(err))
                .finally(() => setBomLoading(false));
        }
    }, [activeTab, offerId, bom.length]);

    // PDF Generation
    const generatePdfDoc = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Ürün Ağacı (BOM) Listesi", 14, 20);
        doc.setFontSize(12);
        doc.text(`Teklif No: ${offer?.teklifNo || offerId}`, 14, 30);
        doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 36);

        const tableColumn = [
            "SIRA NO", "GRUP", "MALZEME ADI", "MİKTAR", "MİKTAR 2",
            "BİRİM", "SİPARİŞ ADETİ", "TOPLAM", "TEDARİKÇİ",
        ];
        const tableRows = bom.map((item) => [
            item.siraNo,
            item.groupName,
            item.productName,
            item.quantity,
            item.quantity2 || "",
            item.unit,
            item.orderCount,
            item.total,
            item.supplier || "",
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: "grid",
            headStyles: { fillColor: [0, 51, 102] },
            styles: { fontSize: 8, cellPadding: 2 },
        });
        return doc;
    };

    const handlePdfExport = () => generatePdfDoc().save(`urun-agaci-${offerId}.pdf`);
    const handlePdfPreview = () => window.open(generatePdfDoc().output("bloburl"), "_blank");

    const handleExcelExport = () => {
        const ws = XLSX.utils.json_to_sheet(
            bom.map((item) => ({
                "SIRA NO": item.siraNo,
                "GRUP": item.groupName,
                "MALZEME ADI": item.productName,
                "MİKTAR": item.quantity,
                "MİKTAR 2": item.quantity2 || "",
                "BİRİM": item.unit,
                "SİPARİŞ ADETİ": item.orderCount,
                "TOPLAM": item.total,
                "TEDARİKÇİ": item.supplier || "",
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ürün Ağacı");
        XLSX.writeFile(wb, `urun-agaci-${offerId}.xlsx`);
    };

    // --- RENDER ---

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                Teklif bulunamadı.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {activeTab === "offer" ? "Teklif Detayı" : "Ürün Ağacı (BOM)"}
                </h1>

                {activeTab === "offer" ? (
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setActiveTab("bom")}
                    >
                        <FileText className="h-4 w-4" />
                        Ürün Ağacı (BOM)
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePdfPreview}>
                            <Download className="mr-2 h-4 w-4" />
                            PDF Önizle
                        </Button>
                        <Button variant="outline" onClick={handlePdfExport}>
                            <Download className="mr-2 h-4 w-4" />
                            PDF İndir
                        </Button>
                        <Button variant="outline" onClick={handleExcelExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Excel İndir
                        </Button>
                    </div>
                )}
            </div>

            {/* OFFER TAB */}
            {activeTab === "offer" && (
                <OfferForm initialData={offer} isReadOnly={false} />
            )}

            {/* BOM TAB */}
            {activeTab === "bom" && (
                <div className="space-y-4">
                    {/* Teklife Dön butonu */}
                    <Button
                        variant="ghost"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setActiveTab("offer")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Teklife Dön
                    </Button>

                    {bomLoading ? (
                        <div className="flex h-[30vh] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Malzeme Listesi ({bom.length} kalem)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 text-muted-foreground">
                                            <tr>
                                                <th className="h-12 px-4 font-medium">SIRA NO</th>
                                                <th className="h-12 px-4 font-medium">GRUP</th>
                                                <th className="h-12 px-4 font-medium">MALZEME ADI</th>
                                                <th className="h-12 px-4 font-medium text-right">MİKTAR</th>
                                                <th className="h-12 px-4 font-medium text-right">MİKTAR 2</th>
                                                <th className="h-12 px-4 font-medium">BİRİM</th>
                                                <th className="h-12 px-4 font-medium text-right">SİPARİŞ ADETİ</th>
                                                <th className="h-12 px-4 font-medium text-right">TOPLAM</th>
                                                <th className="h-12 px-4 font-medium">TEDARİKÇİ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bom.map((item) => (
                                                <tr
                                                    key={item.siraNo}
                                                    className="border-b transition-colors hover:bg-muted/50"
                                                >
                                                    <td className="p-4">{item.siraNo}</td>
                                                    <td className="p-4 font-medium">{item.groupName}</td>
                                                    <td className="p-4">{item.productName}</td>
                                                    <td className="p-4 text-right">{item.quantity}</td>
                                                    <td className="p-4 text-right">{item.quantity2 || ""}</td>
                                                    <td className="p-4">{item.unit}</td>
                                                    <td className="p-4 text-right">{item.orderCount}</td>
                                                    <td className="p-4 text-right font-bold">{item.total}</td>
                                                    <td className="p-4">{item.supplier || ""}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
