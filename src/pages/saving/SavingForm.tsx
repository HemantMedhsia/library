import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Calendar, Tag, Edit3, ImageIcon, Smile } from "lucide-react";
import api from "../../services/api";
import SavingField from "./SavingField";

type SavingFormData = {
    category: string;
    source: string;
    savedAmount: number;
    date: string;
    icon?: string;
    fileUrl?: string;
};

interface SavingFormProps {
    onSuccess?: () => void;
    initialData?: SavingFormData;
    id?: number;
}

export default function SavingForm({ onSuccess, initialData, id }: SavingFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SavingFormData>({
        defaultValues: initialData || {
            category: "",
            source: "",
            savedAmount: undefined,
            date: "",
            icon: "",
            fileUrl: "",
        },
    });

    const [selectedEmoji, setSelectedEmoji] = useState(initialData?.icon || "");

    useEffect(() => {
        if (initialData) {
            reset(initialData);
            setSelectedEmoji(initialData.icon || "");
        }
    }, [initialData, reset]);

    const emojiOptions = ["🏦", "💰", "📈", "💸", "💎", "🏠", "🎯", "🚗", "💼", "📊"];

    const handleEmojiSelect = (emoji: string) => {
        setSelectedEmoji(emoji);
        setValue("icon", emoji);
    };

    const onSubmit = async (data: SavingFormData) => {
        try {
            if (id) {
                
                await api.put(`/saving/update/${id}`, data);
                alert("Saving updated successfully!");
            } else {
                
                await api.post("/saving/create", data);
                alert("Saving added successfully!");
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        } finally {
            reset();
            setSelectedEmoji("");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Input Fields same as before */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SavingField label="Category" icon={<Tag size={16} className="text-emerald-500" />} error={errors.category?.message}>
                    <input {...register("category", { required: "Category is required" })} placeholder="e.g. Local Fund" className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none" />
                </SavingField>

                <SavingField label="Source" icon={<Edit3 size={16} className="text-emerald-500" />} error={errors.source?.message}>
                    <input {...register("source", { required: "Source is required" })} placeholder="e.g. Salary" className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none" />
                </SavingField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SavingField label="Saved Amount" icon={<CreditCard size={16} className="text-emerald-500" />} error={errors.savedAmount?.message}>
                    <input {...register("savedAmount", { required: "Amount is required", valueAsNumber: true, min: { value: 0.01, message: "Amount must be greater than 0" } })} placeholder="0.00" type="number" step="0.01" className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none" />
                </SavingField>

                <SavingField label="Date" icon={<Calendar size={16} className="text-emerald-500" />} error={errors.date?.message}>
                    <input {...register("date", { required: "Date is required" })} type="date" className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none" />
                </SavingField>
            </div>

            <SavingField label="Choose Icon" icon={<Smile size={16} className="text-emerald-500" />}>
                <div className="flex flex-wrap gap-2">
                    {emojiOptions.map((emoji) => (
                        <button key={emoji} type="button" onClick={() => handleEmojiSelect(emoji)} className={`text-xl p-2 rounded-full border transition ${selectedEmoji === emoji ? "border-emerald-500 bg-emerald-50" : "border-emerald-100 hover:border-emerald-300"}`}>
                            {emoji}
                        </button>
                    ))}
                </div>
            </SavingField>

            <SavingField label="Receipt URL" icon={<ImageIcon size={16} className="text-emerald-500" />}>
                <input {...register("fileUrl")} placeholder="https://example.com/receipt.png" className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none" />
            </SavingField>

            <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => reset(initialData)} className="px-4 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                    Reset
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow hover:brightness-105 disabled:opacity-60">
                    {isSubmitting ? "Saving..." : id ? "Update Saving" : "Save Saving"}
                </button>
            </div>
        </form>
    );
}
