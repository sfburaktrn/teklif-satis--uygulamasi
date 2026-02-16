import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Teklif Yönetim Sistemi</h2>
                    <p className="text-muted-foreground max-w-[600px]">
                        Yeni bir teklif oluşturmak için aşağıdaki butonu kullanabilirsiniz.
                    </p>
                </div>

                <Link 
                    href="/dashboard/offers/create" 
                    className={cn(
                        buttonVariants({ variant: "default", size: "lg" }), 
                        "h-16 px-8 text-lg gap-2 bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    <Plus className="h-6 w-6" />
                    YENİ TEKLİF OLUŞTUR
                </Link>
            </div>
        </div>
    );
}
