
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { EmergencyButton } from "@/components/EmergencyButton";
import TelegramButton from "@/components/TelegramButton";
import { MessageCircle, Sparkles, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Gera ou recupera ID de sessão do localStorage
const getOrCreateSessionId = (): string => {
  const key = 'acolhebot_session_id';
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"start" | "await_confirmation" | "chatting">("start");
  const stepRef = useRef(step);
  const sessionIdRef = useRef(getOrCreateSessionId());

  // Sincroniza ref com state
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Usa a ref para pegar o valor atual do step
    const currentStep = stepRef.current;

    // Lógica de fluxo
    if (currentStep === "start") {
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

    if (currentStep === "await_confirmation") {
      if (/sim|quero|pode/i.test(text)) {
        setStep("chatting");
        // Mensagem de acolhimento inicial
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Que bom que você quer conversar! Estou aqui para ouvir você. 😊",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      } else {
        // Se nega ou escreve algo, passa para chatting E chama a API
        setStep("chatting");
        // Continua para o bloco "chatting" abaixo (não faz return)
      }
    }

    if (currentStep === "await_confirmation" || currentStep === "chatting") {
      setIsLoading(true);
      try {
        // Filtra o histórico: Remove mensagens antes da primeira interação de chat
        // (remove a saudação inicial "Oi! Eu sou o AcolheBot")
        const historyForBackend = messages.filter(
          (msg) => !msg.text.includes("Oi! Eu sou o AcolheBot")
        );

        console.log("[Frontend] Enviando para backend:", { 
          message: text,
          sessionId: sessionIdRef.current,
          historyLength: historyForBackend.length,
          history: historyForBackend
        });

        const response = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: text,
            history: historyForBackend,
            sessionId: sessionIdRef.current
          }),
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
            <div className="bg-primary rounded-full p-2.5 flex items-center">
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
            <div className="ml-auto flex items-center">
              <TelegramButton />
              <span className="ml-3 text-sm font-medium text-black">Também estamos no Telegram</span>
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
