import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Calendar, Tag, Edit3, ImageIcon, Smile } from "lucide-react";
import ExpenseField from "./ExpenseField";
import api from "../../services/api";

type ExpenseFormData = {
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  fileUrl?: string;
  icon?: string;
};

export default function ExpenseForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      title: "",
      category: "",
      amount: undefined,
      date: "",
      description: "",
      icon: "",
      fileUrl: "",
    },
  });

  const [selectedEmoji, setSelectedEmoji] = useState("");

  const emojiOptions = ["🍕", "🍔", "🍱", "🍻", "🚗", "💡", "🎬", "🛍️", "🏠", "💼"];

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setValue("icon", emoji);
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      await api.post("/expense/create-expense", data);
      alert("Expense saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving expense!");
    } finally {
      reset();
      setSelectedEmoji("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:col-span-2 flex flex-col gap-4"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExpenseField
          label="Title"
          icon={<Edit3 size={16} className="text-emerald-500" />}
          error={errors.title?.message}
        >
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="e.g. Grocery Shopping"
            className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none"
          />
        </ExpenseField>

        <ExpenseField
          label="Amount"
          icon={<CreditCard size={16} className="text-emerald-500" />}
          error={errors.amount?.message}
        >
          <input
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
              min: { value: 0.01, message: "Amount must be greater than 0" },
            })}
            placeholder="0.00"
            type="number"
            step="0.01"
            className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none"
          />
        </ExpenseField>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExpenseField
          label="Date"
          icon={<Calendar size={16} className="text-emerald-500" />}
          error={errors.date?.message}
        >
          <input
            {...register("date", { required: "Date is required" })}
            type="date"
            className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none"
          />
        </ExpenseField>

        <ExpenseField
          label="Category"
          icon={<Tag size={16} className="text-emerald-500" />}
          error={errors.category?.message}
        >
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none"
          >
            <option value="">Choose category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </ExpenseField>
      </div>

      {/* Emoji Picker */}
      <ExpenseField
        label="Choose Emoji"
        icon={<Smile size={16} className="text-emerald-500" />}
      >
        <div className="flex flex-wrap gap-2">
          {emojiOptions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiSelect(emoji)}
              className={`text-xl p-2 rounded-full border transition ${
                selectedEmoji === emoji
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-emerald-100 hover:border-emerald-300"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </ExpenseField>

      {/* File URL */}
      <ExpenseField
        label="Receipt URL"
        icon={<ImageIcon size={16} className="text-emerald-500" />}
      >
        <input
          {...register("fileUrl")}
          placeholder="https://example.com/bill.jpg"
          className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none"
        />
      </ExpenseField>

      {/* Description */}
      <ExpenseField label="Description" error={errors.description?.message}>
        <textarea
          {...register("description", {
            required: "Description is required",
            maxLength: { value: 200, message: "Max 200 characters" },
          })}
          placeholder="Add a brief note..."
          rows={4}
          className="w-full rounded-xl border border-emerald-100 px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
        />
      </ExpenseField>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setSelectedEmoji("");
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
          {isSubmitting ? "Saving..." : "Save Expense"}
        </button>
      </div>
    </form>
  );
}
