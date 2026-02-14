"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OfferForm from "@/components/offers/offer-form";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function OfferDetailsPage() {
    const params = useParams();
    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const response = await api.get(`/offers/${params.id}`);
                setOffer(response.data);
            } catch (error) {
                console.error("Teklif yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOffer();
        }
    }, [params.id]);

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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Teklif Detayı</h1>
            </div>
            {/* Pass initialData and set strict readOnly mode for now or allow editing */}
            <OfferForm initialData={offer} isReadOnly={false} />
        </div>
    );
}
