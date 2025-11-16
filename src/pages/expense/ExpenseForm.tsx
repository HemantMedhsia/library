import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreditCard,
  Calendar,
  Tag,
  Edit3,
  ImageIcon,
  Smile,
} from "lucide-react";
import { motion } from "framer-motion";

import api from "../../services/api";

// Reusable Components
import FormField from "../../components/common/forms/FormField";
import TextInput from "../../components/common/inputs/TextInput";
import NumberInput from "../../components/common/inputs/NumberInput";
import SelectInput from "../../components/common/inputs/SelectInput";
import TextareaInput from "../../components/common/inputs/TextareaInput";
import EmojiPicker from "../../components/common/inputs/EmojiPicker";

type ExpenseFormData = {
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  fileUrl?: string;
  icon?: string;
};

interface ExpenseFormProps {
  onSuccess?: () => void;
  expense?: ExpenseFormData & { id?: number };
}

export default function ExpenseForm({ onSuccess, expense }: ExpenseFormProps) {
  const emojiOptions = [
    "🍕",
    "🍔",
    "🛍️",
    "💡",
    "🎬",
    "🏠",
    "🚗",
    "💻",
    "🎁",
    "💼",
  ];

  const [selectedEmoji, setSelectedEmoji] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>();

  // Pre-fill
  useEffect(() => {
    if (expense) {
      reset(expense);
      setSelectedEmoji(expense.icon || "");
    }
  }, [expense]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (expense?.id) {
        await api.put(`/expense/update/${expense.id}`, data);
      } else {
        await api.post(`/expense/create-expense`, data);
      }

      onSuccess?.();
    } catch (e) {
      console.error(e);
      alert("Error saving expense");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Title"
          icon={<Edit3 size={16} />}
          error={errors.title?.message}
        >
          <TextInput
            register={register("title", { required: "Required" })}
            placeholder="e.g. Grocery"
          />
        </FormField>

        <FormField
          label="Amount"
          icon={<CreditCard size={16} />}
          error={errors.amount?.message}
        >
          <NumberInput
            register={register("amount", {
              required: "Required",
              valueAsNumber: true,
            })}
            placeholder="0.00"
          />
        </FormField>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Date"
          icon={<Calendar size={16} />}
          error={errors.date?.message}
        >
          <TextInput
            register={register("date", { required: "Required" })}
            type="date"
          />
        </FormField>

        <FormField
          label="Category"
          icon={<Tag size={16} />}
          error={errors.category?.message}
        >
          <SelectInput
            register={register("category", { required: "Required" })}
            options={[
              "Food",
              "Transport",
              "Bills",
              "Entertainment",
              "Shopping",
              "Other",
            ]}
          />
        </FormField>
      </div>

      {/* Emoji Picker */}
      <FormField label="Choose Emoji" icon={<Smile size={16} />}>
        <EmojiPicker
          selected={selectedEmoji}
          onSelect={(em) => {
            setSelectedEmoji(em);
            setValue("icon", em);
          }}
          emojiList={emojiOptions}
        />
      </FormField>

      {/* Receipt URL */}
      <FormField label="Receipt URL" icon={<ImageIcon size={16} />}>
        <TextInput register={register("fileUrl")} placeholder="https://..." />
      </FormField>

      {/* Description */}
      <FormField label="Description" error={errors.description?.message}>
        <TextareaInput
          register={register("description", { required: "Required" })}
          placeholder="Notes..."
        />
      </FormField>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setSelectedEmoji("");
          }}
          className="px-4 py-2 rounded-lg border bg-emerald-50 text-emerald-700"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
        >
          {isSubmitting
            ? "Saving..."
            : expense
            ? "Update Expense"
            : "Save Expense"}
        </button>
      </div>
    </motion.form>
  );
}
