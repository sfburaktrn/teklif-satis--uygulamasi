"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BomItem } from "@/types/bom";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

export default function BomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [bom, setBom] = useState<BomItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBom = async () => {
            try {
                const res = await fetch(`http://localhost:3001/bom/${id}`);
                if (!res.ok) throw new Error("BOM verisi alınamadı");
                const data = await res.json();
                setBom(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBom();
    }, [id]);

    const generatePdfDoc = () => {
        const doc = new jsPDF();

        // Add Turkish font support if needed, or use standard font
        // doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
        // doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        // doc.setFont("Roboto");

        doc.setFontSize(18);
        doc.text("Ürün Ağacı (BOM) Listesi", 14, 20);

        doc.setFontSize(12);
        doc.text(`Teklif ID: ${id}`, 14, 30);
        doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 36);

        const tableColumn = ["SIRA NO", "GRUP", "MALZEME ADI", "MİKTAR", "MİKTAR 2", "BİRİM", "SİPARİŞ ADETİ", "TOPLAM", "TEDARİKÇİ"];
        const tableRows: any[] = [];

        bom.forEach(item => {
            const rowData = [
                item.siraNo,
                item.groupName,
                item.productName,
                item.quantity,
                item.quantity2 || "-",
                item.unit,
                item.orderCount,
                item.total,
                item.supplier || ""
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102] },
            styles: { fontSize: 8, cellPadding: 2 },
        });

        return doc;
    };

    const handlePdfExport = () => {
        const doc = generatePdfDoc();
        doc.save(`urun-agaci-${id}.pdf`);
    };

    const handlePdfPreview = () => {
        const doc = generatePdfDoc();
        window.open(doc.output('bloburl'), '_blank');
    };

    const handleExcelExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            bom.map(item => ({
                "SIRA NO": item.siraNo,
                "GRUP": item.groupName,
                "MALZEME ADI": item.productName,
                "MİKTAR": item.quantity,
                "MİKTAR 2": item.quantity2 || "-",
                "BİRİM": item.unit,
                "SİPARİŞ ADETİ": item.orderCount,
                "TOPLAM": item.total,
                "TEDARİKÇİ": item.supplier || "-"
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ürün Ağacı");
        XLSX.writeFile(workbook, `urun-agaci-${id}.xlsx`);
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Ürün Ağacı (BOM)</h1>
                <div className="space-x-2">
                    <Button onClick={handlePdfPreview} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        PDF Önizle
                    </Button>
                    <Button onClick={handlePdfExport} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        PDF İndir
                    </Button>
                    <Button onClick={handleExcelExport} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Excel İndir
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Malzeme Listesi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
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
                                    <tr key={item.siraNo} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4">{item.siraNo}</td>
                                        <td className="p-4 font-medium">{item.groupName}</td>
                                        <td className="p-4">{item.productName}</td>
                                        <td className="p-4 text-right">{item.quantity}</td>
                                        <td className="p-4 text-right">{item.quantity2 || "-"}</td>
                                        <td className="p-4">{item.unit}</td>
                                        <td className="p-4 text-right">{item.orderCount}</td>
                                        <td className="p-4 text-right font-bold">{item.total}</td>
                                        <td className="p-4">{item.supplier || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
