import { Eye } from "lucide-react";

export default function ExpenseListItem({
  exp,
  onView,
  onEdit,
  onDelete,
}: {
  exp: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-between items-center p-4 hover:bg-emerald-50 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{exp.icon || "💵"}</span>
        <div>
          <p className="font-medium text-emerald-800">{exp.title}</p>
          <p className="text-xs text-emerald-500">
            {exp.category} • {exp.date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="font-semibold text-emerald-600">₹{exp.amount}</p>

        <button onClick={onView} className="text-emerald-500 hover:text-emerald-700">
          <Eye size={16} />
        </button>

        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
          ✏️
        </button>

        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          🗑️
        </button>
      </div>
    </div>
  );
}
