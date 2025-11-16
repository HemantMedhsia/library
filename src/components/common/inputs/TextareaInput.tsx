export default function TextareaInput({
  register,
  placeholder,
}: {
  register: any;
  placeholder?: string;
}) {
  return (
    <textarea
      {...register}
      rows={4}
      placeholder={placeholder}
      className="w-full rounded-xl border border-emerald-100 px-3 py-2 focus:ring-2 
                 focus:ring-emerald-200 outline-none resize-none bg-white/70 backdrop-blur-sm"
    />
  );
}
