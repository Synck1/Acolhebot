import { AlertCircle, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const EmergencyButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-emergency animate-pulse-soft hover:animate-none z-50 flex items-center gap-2 px-6 py-6"
        >
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Emergência</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-destructive flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Precisa de ajuda agora?
          </DialogTitle>
          <DialogDescription className="text-base pt-4 space-y-4">
            <p className="text-foreground">
              Se você estiver em risco imediato ou pensando em se machucar, procure ajuda agora. 
              Seguem opções:
            </p>
            
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Ligar para o CVV (Brasil)</p>
                  <a 
                    href="tel:188" 
                    className="text-2xl font-bold text-destructive hover:underline"
                  >
                    188
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">Atendimento 24h gratuito</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Acessar site do CVV</p>
                  <a 
                    href="https://cvv.org.br" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    cvv.org.br
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">Chat, email e mais informações</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Você não está sozinho. Há pessoas que se importam e querem ajudar.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
