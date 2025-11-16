export default function NumberInput({
  register,
  placeholder,
}: {
  register: any;
  placeholder?: string;
}) {
  return (
    <input
      {...register}
      type="number"
      step="0.01"
      placeholder={placeholder}
      className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 
                 focus:ring-emerald-200 outline-none bg-white/70 backdrop-blur-sm"
    />
  );
}
