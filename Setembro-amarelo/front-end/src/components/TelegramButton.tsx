import { Send } from "lucide-react";

export const TelegramButton = () => {
  return (
    <a
      href="https://t.me/acolher_bot"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir AcolheBot no Telegram"
      title="AcolheBot no Telegram"
      className="ml-3 rounded-full p-2 bg-[#0088cc] hover:bg-[#007ab3] text-white flex items-center justify-center transition-colors"
    >
      <Send className="h-4 w-4" />
    </a>
  );
};

export default TelegramButton;
