export default function TextInput({
  register,
  placeholder,
  type = "text",
}: {
  register: any;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      {...register}
      placeholder={placeholder}
      type={type}
      className="w-full rounded-lg border border-emerald-100 px-3 py-2 focus:ring-2 
                 focus:ring-emerald-200 outline-none bg-white/70 backdrop-blur-sm"
    />
  );
}
