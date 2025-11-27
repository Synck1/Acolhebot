
import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { EmergencyButton } from "@/components/EmergencyButton";
import { MessageCircle, Sparkles, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"start" | "await_confirmation" | "chatting">("start");

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Lógica de fluxo
    if (step === "start") {
      // Primeira mensagem: envia saudação e muda estado
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oi! Eu sou o AcolheBot 🎗 — quer conversar agora?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setStep("await_confirmation");
      return;
    }

    if (step === "await_confirmation") {
      if (/sim|quero|pode/i.test(text)) {
        setStep("chatting");
        // Mensagem de acolhimento inicial
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Poxa, sinto muito 😔 Quer me contar mais? Tô aqui pra ouvir.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Tudo bem, posso ficar por aqui se quiser conversar depois.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
      return;
    }

    if (step === "chatting") {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || "Desculpe, não consegui processar sua mensagem.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Desculpe, ocorreu um erro. Tente novamente.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-full p-2.5">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                AcolheBot
                <span className="text-sm font-normal text-muted-foreground">•</span>
                <span className="flex items-center gap-1.5">
                  Setembro Amarelo
                  <Sparkles className="h-4 w-4 text-accent" />
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">Estamos aqui para ouvir você</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden">
        <div className="container max-w-3xl mx-auto px-6 h-full flex flex-col py-8">
          <div className="flex-1 overflow-y-auto space-y-6 mb-6 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-primary/30 rounded-full p-6 mb-4">
                  <MessageCircle className="h-12 w-12 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-medium text-foreground mb-2">
                  Como posso ajudar você hoje?
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Este é um espaço seguro. Compartilhe seus pensamentos e sentimentos.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-soft">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div className="pt-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </main>

      {/* Emergency Button */}
      <EmergencyButton />

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container max-w-3xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Em caso de emergência, use o botão vermelho</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
