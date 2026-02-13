import OfferForm from "@/components/offers/offer-form";

export default function CreateOfferPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Yeni Teklif Oluştur</h1>
            </div>
            <OfferForm />
        </div>
    );
}
