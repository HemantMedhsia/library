import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreditCard,
  Calendar,
  Tag,
  Edit3,
  ImageIcon,
  Smile,
} from "lucide-react";

import api from "../../services/api";

// Reusable Components
import FormField from "../../components/common/forms/FormField";
import TextInput from "../../components/common/inputs/TextInput";
import NumberInput from "../../components/common/inputs/NumberInput";
import EmojiPicker from "../../components/common/inputs/EmojiPicker";

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

export default function SavingForm({
  onSuccess,
  initialData,
  id,
}: SavingFormProps) {
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

  const emojiOptions = [
    "🏦",
    "💰",
    "📈",
    "💸",
    "💎",
    "🏠",
    "🎯",
    "🚗",
    "💼",
    "📊",
  ];

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedEmoji(initialData.icon || "");
    }
  }, [initialData, reset]);

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

      onSuccess?.();
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
      
      {/* ====== Row 1 ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Category"
          icon={<Tag size={16} className="text-emerald-500" />}
          error={errors.category?.message}
        >
          <TextInput
            register={register("category", { required: "Category is required" })}
            placeholder="e.g. Emergency Fund"
          />
        </FormField>

        <FormField
          label="Source"
          icon={<Edit3 size={16} className="text-emerald-500" />}
          error={errors.source?.message}
        >
          <TextInput
            register={register("source", { required: "Source is required" })}
            placeholder="e.g. Salary"
          />
        </FormField>
      </div>

      {/* ====== Row 2 ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Saved Amount"
          icon={<CreditCard size={16} className="text-emerald-500" />}
          error={errors.savedAmount?.message}
        >
          <NumberInput
            register={register("savedAmount", {
              required: "Amount is required",
              valueAsNumber: true,
              min: {
                value: 0.01,
                message: "Amount must be greater than 0",
              },
            })}
            placeholder="0.00"
          />
        </FormField>

        <FormField
          label="Date"
          icon={<Calendar size={16} className="text-emerald-500" />}
          error={errors.date?.message}
        >
          <TextInput
            register={register("date", { required: "Date is required" })}
            type="date"
          />
        </FormField>
      </div>

      {/* ====== Emoji Picker ====== */}
      <FormField
        label="Choose Icon"
        icon={<Smile size={16} className="text-emerald-500" />}
      >
        <EmojiPicker
          selected={selectedEmoji}
          emojiList={emojiOptions}
          onSelect={handleEmojiSelect}
        />
      </FormField>

      {/* ====== File URL ====== */}
      <FormField
        label="Receipt URL"
        icon={<ImageIcon size={16} className="text-emerald-500" />}
      >
        <TextInput
          register={register("fileUrl")}
          placeholder="https://example.com/receipt.png"
        />
      </FormField>

      {/* ====== Buttons ====== */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={() => {
            reset(initialData);
            setSelectedEmoji(initialData?.icon || "");
          }}
          className="px-4 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow hover:brightness-105 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : id ? "Update Saving" : "Save Saving"}
        </button>
      </div>
    </form>
  );
}
