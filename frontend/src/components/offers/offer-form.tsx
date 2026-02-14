"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, Save, Printer } from "lucide-react";
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

import { useEffect } from "react";
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

    useEffect(() => {
        if (yurtIciDisi === "Yurt İçi (Yi)") {
            form.setValue("tescilUlkesi", "Türkiye");
        } else if (yurtIciDisi === "Yurt Dışı (YD)" && tescilUlkesi === "Türkiye") {
            form.setValue("tescilUlkesi", ""); // Clear selection if it was Türkiye
        }
    }, [yurtIciDisi, form, tescilUlkesi]);

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
        try {
            const sanitize = (val: any) => (val === "" ? undefined : val);

            const payload = {
                ...values,
                siparisAdeti: values.siparisAdeti ? Number(values.siparisAdeti) : undefined,
                onayTarihi: sanitize(values.onayTarihi) ? new Date(values.onayTarihi).toISOString() : undefined,
                talepTarihi: sanitize(values.talepTarihi) ? new Date(values.talepTarihi).toISOString() : undefined,
                kamyonTeslimTarihi: sanitize(values.kamyonTeslimTarihi) ? new Date(values.kamyonTeslimTarihi).toISOString() : undefined,
            };

            // Remove empty string values from payload to prevent backend errors
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
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[1000px] bg-white p-1 shadow-2xl overflow-hidden">

                    {/* Form Header */}
                    <div className="bg-[#1e293b] text-white p-3 flex items-center justify-between mb-4 border-2 border-black">
                        {/* Logo Area */}
                        <div className="bg-white px-2 py-1 flex items-center justify-center">
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
                        <h2 className="text-lg md:text-xl font-bold tracking-wider text-center flex-1">
                            SİPARİŞ FORMU / ORDER FORM
                        </h2>

                        {/* Order No */}
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm whitespace-nowrap">ORDER NO :</span>
                            <div className="min-w-[120px] h-6 bg-transparent border-b border-white flex items-center justify-center font-mono text-sm px-2">
                                {form.watch("teklifNo")}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1">
                        {/* Left Column */}
                        <div className="flex flex-col">
                            <SectionRenderer sectionId="general" />
                            <SectionRenderer sectionId="sasi" />
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col">
                            <SectionRenderer sectionId="kasa" />
                            <SectionRenderer sectionId="diger" />

                            {/* Specific Footer Area for 'Özel Notlar' */}
                            <div className="border-2 border-black flex flex-col mt-auto mb-4">
                                <div className="bg-[#3b82f6] text-white text-center font-bold py-1 border-b-2 border-black text-xs uppercase">
                                    Özel Uygulama Notları ve Açıklamalar
                                </div>

                                {/* Grey Box Area */}
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
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex justify-between items-center mt-4 px-4 pb-4 print:hidden">
                        <Button variant="outline" type="button" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" />
                            Yazdır
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white min-w-[200px]">
                                <Save className="mr-2 h-4 w-4" />
                                {initialData ? "GÜNCELLE" : "KAYDET VE OLUŞTUR"}
                            </Button>
                        )}
                    </div>

                </form>
            </Form>
        </div>
    );
}
