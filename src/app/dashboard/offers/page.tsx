import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const mockOffers = [
    {
        id: "TK-2024-001",
        customer: "ABC Lojistik A.Ş.",
        date: "10.02.2024",
        total: "€ 45.000,00",
        status: "Onaylandı",
    },
    {
        id: "TK-2024-002",
        customer: "XYZ Nakliyat Ltd. Şti.",
        date: "12.02.2024",
        total: "€ 32.500,00",
        status: "Bekliyor",
    },
    {
        id: "TK-2024-003",
        customer: "Mehmet Demir",
        date: "13.02.2024",
        total: "€ 28.000,00",
        status: "Taslak",
    },
    {
        id: "TK-2024-004",
        customer: "Ayşe Yılmaz",
        date: "14.02.2024",
        total: "€ 55.000,00",
        status: "Reddedildi",
    },
];

export default function OffersPage() {
    return (
        <div className="space-y-6">
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
                        Yeni Teklif
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

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Teklif No</TableHead>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Tutar</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockOffers.map((offer) => (
                            <TableRow key={offer.id}>
                                <TableCell className="font-medium">{offer.id}</TableCell>
                                <TableCell>{offer.customer}</TableCell>
                                <TableCell>{offer.date}</TableCell>
                                <TableCell>{offer.total}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        offer.status === "Onaylandı" ? "default" :
                                            offer.status === "Bekliyor" ? "secondary" :
                                                offer.status === "Reddedildi" ? "destructive" : "outline"
                                    }>
                                        {offer.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        Detay
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
