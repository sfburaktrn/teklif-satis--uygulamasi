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

const formSchema = z.object({
    teklifNo: z.string().min(1, "Zorunlu"),
    musteriAdi: z.string().min(1, "Zorunlu"),
}).catchall(z.any());

export default function OfferForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teklifNo: "",
            musteriAdi: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
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
                    {section.fields.map((field) => (
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
                                                        onValueChange={formField.onChange}
                                                        defaultValue={formField.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-full w-full rounded-none border-0 focus:ring-0 px-2 text-xs shadow-none">
                                                                <SelectValue placeholder="" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {field.options?.map((option) => (
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
                                                ) : field.type === "textarea" ? (
                                                    <Textarea
                                                        className="w-full h-full rounded-none border-0 focus-visible:ring-0 p-2 text-xs resize-none bg-transparent shadow-none"
                                                        {...formField}
                                                    />
                                                ) : (
                                                    <Input
                                                        className="h-full w-full rounded-none border-0 focus-visible:ring-0 px-2 text-xs bg-transparent shadow-none"
                                                        {...formField}
                                                    />
                                                )}
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    ))}
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
                            <div className="w-24 h-6 bg-transparent border-b border-white"></div>
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
                        <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white min-w-[200px]">
                            <Save className="mr-2 h-4 w-4" />
                            KAYDET VE OLUŞTUR
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
}
