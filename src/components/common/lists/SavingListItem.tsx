import { Eye, Edit3, Trash2 } from "lucide-react";

export default function SavingListItem({
  saving,
  onView,
  onEdit,
  onDelete,
}: {
  saving: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-between items-center p-4 hover:bg-emerald-50 rounded-lg transition">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{saving.icon || "💰"}</span>
        <div>
          <p className="font-medium text-emerald-800">{saving.source}</p>
          <p className="text-xs text-emerald-500">
            {saving.category} • {saving.date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <p className="font-semibold text-emerald-600">
          ₹{saving.savedAmount.toLocaleString()}
        </p>

        <button onClick={onView} className="text-emerald-500 hover:text-emerald-700">
          <Eye size={17} />
        </button>

        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
          <Edit3 size={17} />
        </button>

        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
