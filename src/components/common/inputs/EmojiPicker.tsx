import { motion } from "framer-motion";

export default function EmojiPicker({
  selected,
  onSelect,
  emojiList,
}: {
  selected?: string;
  onSelect: (emoji: string) => void;
  emojiList: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {emojiList.map((emoji) => (
        <motion.button
          key={emoji}
          type="button"
          whileHover={{ scale: 1.1 }}
          onClick={() => onSelect(emoji)}
          className={`text-xl p-2 rounded-full border transition ${
            selected === emoji
              ? "border-emerald-500 bg-emerald-50"
              : "border-emerald-100 hover:border-emerald-300"
          }`}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
}
