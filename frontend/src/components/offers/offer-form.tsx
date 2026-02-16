"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, Save, Printer, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { offerFormSchema } from "@/constants/offer-form-fields";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    teklifNo: z.string().optional(),
    musteriAdi: z.string().min(1, "Zorunlu"),
}).catchall(z.any());

interface OfferFormProps {
    initialData?: any;
    isReadOnly?: boolean;
}

export default function OfferForm({ initialData, isReadOnly = false }: OfferFormProps) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            teklifNo: "OTOMATİK OLUŞTURULACAK",
            musteriAdi: "",
        },
    });

    const yurtIciDisi = form.watch("yurtIciDisi");
    const tescilUlkesi = form.watch("tescilUlkesi");
    const hacimTipi = form.watch("hacimTipi");
    const dingilTipiVeAdeti = form.watch("dingilTipiVeAdeti");
    const lastikMarkasi = form.watch("lastikMarkasi");

    // Multi-step form state
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper to validate current step fields before moving next
    const validateStep = async () => {
        const sections = offerFormSchema;
        // Step 1: general (index 0)
        // Step 2: kasa (index 1)
        // Step 3: sasi (index 2)
        // Step 4: diger (index 3)

        const sectionIndex = currentStep - 1;
        if (sectionIndex < sections.length) {
            const fields = sections[sectionIndex].fields.map(f => f.name);
            const result = await form.trigger(fields as any);
            return result;
        }
        return true;
    };

    const handleNext = async () => {
        const isValid = await validateStep();
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        if (yurtIciDisi === "Yurt İçi (Yi)") {
            form.setValue("tescilUlkesi", "Türkiye");
        } else if (yurtIciDisi === "Yurt Dışı (YD)" && tescilUlkesi === "Türkiye") {
            form.setValue("tescilUlkesi", ""); // Clear selection if it was Türkiye
        }
    }, [yurtIciDisi, form, tescilUlkesi]);

    // Auto-fill logic for "03-ŞASİ/YÜRÜYEN İLE İLGİLİ BİLGİLER" (Tires)
    useEffect(() => {
        if (!lastikMarkasi) return;

        // Auto-fill based on Tire Brand
        // Values from user image: 385/65 R22.5, 6 ADT
        const tireStats = {
            "Goodyear": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
            "Continantel": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
            "Bridgestone": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
            "Pirelli": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
            "Lassa": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
            "Michelin": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
            "Hankook": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
            "Özünlü Seçimi": { lastikEbadi: "385/65 R22.5", toplamLastikJantAdeti: "6 ADT" },
        };

        const stats = (tireStats as any)[lastikMarkasi];
        if (stats) {
            form.setValue("lastikEbadi", stats.lastikEbadi, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            form.setValue("toplamLastikJantAdeti", stats.toplamLastikJantAdeti, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
    }, [lastikMarkasi, form]);

    // Auto-fill logic for "03-ŞASİ/YÜRÜYEN İLE İLGİLİ BİLGİLER"
    useEffect(() => {
        if (!dingilTipiVeAdeti) return;

        // Map for Chassis values
        // All current options map to the same values, but structure allows for future variation
        const chassisData: Record<string, any> = {
            "TRAX Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma": { dingilMesafesi: "4850", dingillerArasiMesafe: "1310", besinciTekerYuksekligi: "1350 mm", dingilYuku: "27.000 kg" },
            "BPW Kampana - 3 ADT - 1 ve 2. Dingil Kaldırma": { dingilMesafesi: "4850", dingillerArasiMesafe: "1310", besinciTekerYuksekligi: "1350 mm", dingilYuku: "27.000 kg" },
            "BPW Disk - 3 ADT - 1 ve 2. Dingil Kaldırma": { dingilMesafesi: "4850", dingillerArasiMesafe: "1310", besinciTekerYuksekligi: "1350 mm", dingilYuku: "27.000 kg" },
            "TRAX Kampana - 3 ADT - 1. Dingil Kaldırma": { dingilMesafesi: "4850", dingillerArasiMesafe: "1310", besinciTekerYuksekligi: "1350 mm", dingilYuku: "27.000 kg" },
            "BPW Kampana - 3 ADT - 1. Dingil Kaldırma": { dingilMesafesi: "4850", dingillerArasiMesafe: "1310", besinciTekerYuksekligi: "1350 mm", dingilYuku: "27.000 kg" },
            "BPW Disk - 3 ADT - 1. Dingil Kaldırma": { dingilMesafesi: "4850", dingillerArasiMesafe: "1310", besinciTekerYuksekligi: "1350 mm", dingilYuku: "27.000 kg" }
        };

        const data = chassisData[dingilTipiVeAdeti];

        if (data) {
            Object.keys(data).forEach((key) => {
                form.setValue(key as any, data[key], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            });
        }
    }, [dingilTipiVeAdeti, form]);

    // Auto-fill logic for "02-KASA/KUVET İLE İLGİLİ BİLGİLER"
    useEffect(() => {
        if (!hacimTipi) return;

        // Data mapping based on the user's provided image
        // Format: "Hacim Tipi": { ...fields }
        const volumeData: Record<string, any> = {
            "20 m3 (5-4-4-5)": { hacim: "20", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1380", kuvetTabanSacKalinligi: "5", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "20 m3 (6-4-4-5)": { hacim: "20", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1380", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "20 m3 (6-5-5-5)": { hacim: "20", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1380", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "18 m3 (5-4-4-5)": { hacim: "18", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1260", kuvetTabanSacKalinligi: "5", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "18 m3 (6-4-4-5)": { hacim: "18", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1260", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "18 m3 (6-5-5-5)": { hacim: "18", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1260", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "19 m3 (5-4-4-5)": { hacim: "19", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1320", kuvetTabanSacKalinligi: "5", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "19 m3 (6-4-4-5)": { hacim: "19", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1320", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "19 m3 (6-5-5-5)": { hacim: "19", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1320", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "22 m3 (5-4-4-5)": { hacim: "22", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "5", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "22 m3 (6-4-4-5)": { hacim: "22", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "22 m3 (6-5-5-5)": { hacim: "22", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "18+2 m3 (5-4-4-5)": { hacim: "18+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1380", kuvetTabanSacKalinligi: "5", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "18+2 m3 (6-4-4-5)": { hacim: "18+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1380", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "18+2 m3 (6-5-5-5)": { hacim: "18+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1380", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "19+2 m3 (5-4-4-5)": { hacim: "19+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "5", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "19+2 m3 (6-4-4-5)": { hacim: "19+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "19+2 m3 (6-5-5-5)": { hacim: "19+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "20+2 m3 (5-4-4-5)": { hacim: "20+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "5", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "20+2 m3 (6-4-4-5)": { hacim: "20+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "20+2 m3 (6-5-5-5)": { hacim: "20+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1500", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "22+2 m3 (6-4-4-5)": { hacim: "22+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1600", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "4", kuvetOnDuvarSacKalinligi: "4", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" },
            "22+2 m3 (6-5-5-5)": { hacim: "22+2", kasaUzunlugu: "8450", kasaGenisligi: "2434", kasaYuksekligi: "1600", kuvetTabanSacKalinligi: "6", kuvetYanDuvarSacKalinligi: "5", kuvetOnDuvarSacKalinligi: "5", kuvetArkaKapakSacKalinligi: "5", damperSacMalzemesi: "Hardox", siperlik: "Var", emniyetKilitlemesi: "Yok", govdeEtekSaci: "Var" }
        };

        const data = volumeData[hacimTipi];

        if (data) {
            Object.keys(data).forEach((key) => {
                form.setValue(key as any, data[key], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            });
        }
    }, [hacimTipi, form]);

    // Initial offer number fetch
    useEffect(() => {
        // Only fetch if creating new offer (no initialData)
        if (!initialData && !isReadOnly) {
            const fetchNextNumber = async () => {
                try {
                    const res = await api.get("/offers/next-number");
                    if (res.data) {
                        form.setValue("teklifNo", res.data);
                    }
                } catch (error) {
                    console.error("Teklif numarası alınamadı:", error);
                }
            };
            fetchNextNumber();
        }
    }, [initialData, isReadOnly, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const sanitize = (val: any) => (val === "" ? undefined : val);

            const payload = {
                ...values,
                siparisAdeti: values.siparisAdeti ? Number(values.siparisAdeti) : undefined,
                onayTarihi: sanitize(values.onayTarihi) ? new Date(values.onayTarihi).toISOString() : undefined,
                talepTarihi: sanitize(values.talepTarihi) ? new Date(values.talepTarihi).toISOString() : undefined,
                kamyonTeslimTarihi: sanitize(values.kamyonTeslimTarihi) ? new Date(values.kamyonTeslimTarihi).toISOString() : undefined,
            };

            // Remove empty string values from payload
            Object.keys(payload).forEach(key => {
                if ((payload as any)[key] === "") {
                    (payload as any)[key] = undefined;
                }
            });

            if (initialData?.id) {
                await api.patch(`/offers/${initialData.id}`, payload);
                toast.success("Teklif güncellendi.");
            } else {
                await api.post("/offers", payload);
                toast.success("Teklif başarıyla oluşturuldu.");
            }

            router.push("/dashboard/offers");
        } catch (error) {
            console.error("Teklif oluşturma hatası:", error);
            toast.error("Teklif oluşturulurken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Helper to find section by ID
    const getSection = (id: string) => offerFormSchema.find((s) => s.id === id);

    const SectionRenderer = ({ sectionId }: { sectionId: string }) => {
        const section = getSection(sectionId);
        if (!section) return null;

        return (
            <div className="border-2 border-black mb-4">
                {/* Section Header */}
                <div className="bg-[#3b82f6] text-white text-center font-bold py-1 border-b-2 border-black text-xs md:text-sm uppercase tracking-tight">
                    {section.title}
                </div>

                {/* Fields */}
                <div className="flex flex-col">
                    {section.fields.map((field) => {
                        // Filter options dynamically
                        let options = field.options;
                        if (field.name === "tescilUlkesi" && yurtIciDisi === "Yurt Dışı (YD)") {
                            options = field.options?.filter(o => o !== "Türkiye");
                        }

                        if (field.type === "volumeGroup") {
                            // Extract volume and thickness from current values if any
                            // Value format: "20 m3 (5-4-4-5)"
                            const currentValue = form.watch("hacimTipi");
                            const [currentVolume, currentThicknessPart] = currentValue ? currentValue.split(" (") : ["", ""];
                            const currentThickness = currentThicknessPart ? currentThicknessPart.replace(")", "") : "";

                            const volumes = ["18 m3", "19 m3", "20 m3", "22 m3", "18+2 m3", "19+2 m3", "20+2 m3", "22+2 m3"];
                            const thicknesses = ["5-4-4-5", "6-4-4-5", "6-5-5-5"];

                            return (
                                <div
                                    key={field.name}
                                    className="flex border-b border-black last:border-b-0 h-8"
                                >
                                    {/* Label Column */}
                                    <div className="w-[40%] bg-gray-200 border-r border-black flex items-center px-2 text-[10px] md:text-[11px] font-semibold text-black leading-tight shrink-0">
                                        {field.label}
                                    </div>

                                    {/* Input Column - Dual Select */}
                                    <div className="w-[60%] bg-white flex">
                                        {/* Volume Select */}
                                        <div className="w-1/2 border-r border-gray-300">
                                            <Select
                                                value={currentVolume}
                                                onValueChange={(vol) => {
                                                    form.setValue("hacimTipi", vol + "_", { shouldValidate: false });
                                                }}
                                            >
                                                <SelectTrigger className="h-full w-full rounded-none border-0 focus:ring-0 px-2 text-xs shadow-none">
                                                    <SelectValue placeholder="Hacim Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {volumes.map(v => <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Thickness Select */}
                                        <div className="w-1/2">
                                            <Select
                                                value={currentThickness}
                                                disabled={!currentVolume || !currentVolume.includes}
                                                onValueChange={(thick) => {
                                                    if (currentVolume) {
                                                        const cleanVolume = currentVolume.endsWith("_") ? currentVolume.slice(0, -1) : currentVolume;
                                                        form.setValue("hacimTipi", `${cleanVolume} (${thick})`, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-full w-full rounded-none border-0 focus:ring-0 px-2 text-xs shadow-none disabled:opacity-50">
                                                    <SelectValue placeholder="Kalınlık Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {thicknesses.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={field.name}
                                className={cn(
                                    "flex border-b border-black last:border-b-0",
                                    field.type === "textarea" ? "min-h-[100px]" : "h-8"
                                )}
                            >
                                {/* Label Column */}
                                <div className="w-[40%] bg-gray-200 border-r border-black flex items-center px-2 text-[10px] md:text-[11px] font-semibold text-black leading-tight shrink-0">
                                    {field.label}
                                </div>

                                {/* Input Column */}
                                <div className="w-[60%] bg-white relative">
                                    <FormField
                                        control={form.control}
                                        name={field.name}
                                        render={({ field: formField }) => (
                                            <FormItem className="space-y-0 h-full w-full">
                                                <FormControl>
                                                    {field.type === "select" ? (
                                                        <Select
                                                            onValueChange={(value) => {
                                                                formField.onChange(value);
                                                                if (field.name === "hacim") {
                                                                    const dimensions: Record<string, { l: string; w: string; h: string }> = {
                                                                        "18 m³": { l: "8450", w: "2434", h: "1260" },
                                                                        "19 m³": { l: "8450", w: "2434", h: "1320" },
                                                                        "20 m³": { l: "8450", w: "2434", h: "1380" },
                                                                        "22 m³": { l: "8450", w: "2434", h: "1500" },
                                                                        "18+2 m³": { l: "8450", w: "2434", h: "1380" },
                                                                        "19+2 m³": { l: "8450", w: "2434", h: "1500" },
                                                                        "20+2 m³": { l: "8450", w: "2434", h: "1500" },
                                                                        "22+2 m³": { l: "8450", w: "2434", h: "1600" },
                                                                    };

                                                                    const selected = dimensions[value];
                                                                    if (selected) {
                                                                        form.setValue("kasaUzunlugu", selected.l);
                                                                        form.setValue("kasaGenisligi", selected.w);
                                                                        form.setValue("kasaYuksekligi", selected.h);
                                                                    }
                                                                }
                                                            }}
                                                            value={formField.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="h-full w-full rounded-none border-0 focus:ring-0 px-2 text-xs shadow-none">
                                                                    <SelectValue placeholder="" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {options?.map((option) => (
                                                                    <SelectItem key={option} value={option} className="text-xs">
                                                                        {option}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : field.type === "date" ? (
                                                        <div className="flex h-full w-full items-center">
                                                            <Input
                                                                type="date"
                                                                className="h-full w-full rounded-none border-0 focus-visible:ring-0 px-2 text-xs bg-transparent shadow-none"
                                                                {...formField}
                                                                value={formField.value ?? ""}
                                                            />
                                                        </div>
                                                    ) : field.type === "radio" ? (
                                                        <RadioGroup
                                                            onValueChange={formField.onChange}
                                                            defaultValue={formField.value}
                                                            className="flex h-full items-center space-x-3 px-2"
                                                        >
                                                            {field.options?.map((option) => (
                                                                <div key={option} className="flex items-center space-x-1">
                                                                    <RadioGroupItem value={option} id={`${field.name}-${option}`} className="h-3 w-3 border-black text-black" />
                                                                    <label htmlFor={`${field.name}-${option}`} className="text-[10px] whitespace-nowrap cursor-pointer">{option}</label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    ) : field.type === "number" ? (
                                                        <Input
                                                            className="h-full w-full rounded-none border-0 focus-visible:ring-0 px-2 text-xs bg-transparent shadow-none"
                                                            {...formField}
                                                            value={formField.value ?? ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Sadece rakam girilmesine izin ver
                                                                if (/^\d*$/.test(value)) {
                                                                    formField.onChange(value);
                                                                }
                                                            }}
                                                            inputMode="numeric"
                                                        />
                                                    ) : field.type === "textarea" ? (
                                                        <Textarea
                                                            className="w-full h-full rounded-none border-0 focus-visible:ring-0 p-2 text-xs resize-none bg-transparent shadow-none"
                                                            {...formField}
                                                            value={formField.value ?? ""}
                                                        />
                                                    ) : (
                                                        <Input
                                                            className="h-full w-full rounded-none border-0 focus-visible:ring-0 px-2 text-xs bg-transparent shadow-none"
                                                            {...formField}
                                                            value={formField.value ?? ""}
                                                            disabled={field.name === "teklifNo"}
                                                        />
                                                    )}
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-4 print:p-0 md:max-w-4xl mx-auto">
                    {/* PERSISTENT HEADER (Logo + Order No) */}
                    <div className="bg-[#1e293b] text-white p-3 flex items-center justify-between mb-6 border-2 border-black">
                        {/* Logo Area */}
                        <div className="bg-white px-2 py-1 flex items-center justify-center rounded-sm">
                            <div className="relative w-40 h-12">
                                <Image
                                    src="/ozunlu-logo.png"
                                    alt="Özünlü Damper Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg md:text-xl font-bold tracking-wider text-center flex-1 mx-4">
                            SİPARİŞ FORMU / ORDER FORM
                        </h2>

                        {/* Order No */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm whitespace-nowrap">ORDER NO :</span>
                                <div className="min-w-[120px] h-6 bg-transparent border-b border-white flex items-center justify-center font-mono text-sm px-2">
                                    {initialData?.teklifNo || form.watch("teklifNo")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEPPER UI */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            {["GENEL BİLGİLER", "KASA/KUVET", "ŞASİ/YÜRÜYEN", "DİĞER", "ÖNİZLEME"].map((stepName, index) => {
                                const stepNum = index + 1;
                                const isActive = stepNum === currentStep;
                                const isCompleted = stepNum < currentStep;

                                return (
                                    <div key={stepNum} className="flex flex-col items-center flex-1">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors",
                                            isActive ? "bg-blue-600 text-white" :
                                                isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                                        )}>
                                            {isCompleted ? "✓" : stepNum}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] md:text-xs text-center font-medium",
                                            isActive ? "text-blue-600" : "text-gray-500"
                                        )}>
                                            {stepName}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-300 ease-in-out"
                                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* FORM CONTENT BASED ON STEP */}
                    <div className="min-h-[400px]">
                        {currentStep === 1 && <SectionRenderer sectionId="general" />}
                        {currentStep === 2 && <SectionRenderer sectionId="kasa" />}
                        {currentStep === 3 && <SectionRenderer sectionId="sasi" />}
                        {currentStep === 4 && <SectionRenderer sectionId="diger" />}
                        {currentStep === 5 && (
                            <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                                <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4 text-center">
                                    <h3 className="text-green-800 font-bold text-lg">Önizleme Modu</h3>
                                    <p className="text-green-700 text-sm">Lütfen bilgileri son kez kontrol ediniz. Değişiklik yapmak için "Geri" butonunu kullanabilirsiniz.</p>
                                </div>
                                <SectionRenderer sectionId="general" />
                                <SectionRenderer sectionId="kasa" />
                                <SectionRenderer sectionId="sasi" />
                                <SectionRenderer sectionId="diger" />

                                {/* Specific Footer Area for 'Özel Notlar' (Only on Step 5/Preview) */}
                                <div className="border-2 border-black flex flex-col mt-4">
                                    <div className="bg-[#3b82f6] text-white text-center font-bold py-1 border-b-2 border-black text-xs uppercase">
                                        Özel Uygulama Notları ve Açıklamalar
                                    </div>
                                    <div className="bg-gray-300 min-h-[120px] relative">
                                        <FormField
                                            control={form.control}
                                            name="ozelNotlar"
                                            render={({ field }) => (
                                                <Textarea
                                                    className="w-full h-full bg-transparent border-0 focus-visible:ring-0 resize-none p-2 text-sm z-10 relative"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* 'Özel Notlar' should be available in Step 4 as well? Or just 5? 
                             The user said "Step 1-4 sections, Step 5 Preview". 
                             'ozelNotlar' is technically part of 'diger' conceptually but styled differently. 
                             Let's add it to Step 4 as well for data entry. 
                         */}
                        {currentStep === 4 && (
                            <div className="border-2 border-black flex flex-col mt-4">
                                <div className="bg-[#3b82f6] text-white text-center font-bold py-1 border-b-2 border-black text-xs uppercase">
                                    Özel Uygulama Notları ve Açıklamalar
                                </div>
                                <div className="bg-gray-300 min-h-[120px] relative">
                                    <FormField
                                        control={form.control}
                                        name="ozelNotlar"
                                        render={({ field }) => (
                                            <Textarea
                                                className="w-full h-full bg-transparent border-0 focus-visible:ring-0 resize-none p-2 text-sm z-10 relative"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                    </div>

                    {/* NAVIGATION BUTTONS */}
                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="w-32"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Geri
                        </Button>

                        {currentStep < 5 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="w-32 bg-blue-600 hover:bg-blue-700"
                            >
                                İleri
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" type="button" onClick={() => window.print()}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Yazdır
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-40 bg-green-600 hover:bg-green-700 text-white font-bold"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {initialData ? "GÜNCELLE" : "KAYDET"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    );
}
