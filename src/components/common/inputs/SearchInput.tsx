export default function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
