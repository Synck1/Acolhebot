import { useState } from "react";
import { Send, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="relative flex-1">
        <SmilePlus className="absolute left-4 bottom-4 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          disabled={disabled}
          className="min-h-[56px] max-h-[120px] resize-none border-input focus:border-primary pl-12"
          rows={1}
        />
      </div>
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        size="lg"
        className="h-[56px] w-[56px] flex-shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};
