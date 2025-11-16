export default function SelectInput({
  register,
  options,
}: {
  register: any;
  options: string[];
}) {
  return (
    <select
      {...register}
      className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 
                 focus:ring-emerald-200 outline-none bg-white/70 backdrop-blur-sm"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
