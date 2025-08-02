
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const IAReButton = () => {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggle = () => {
    setIsActive(prev => !prev);
    if (!isActive) {
      setMessage("Olá! Sou a Rê. Como posso te ajudar hoje?");
    } else {
      setMessage("");
    }
  };

  return (
    <div className={cn(
      "fixed bottom-6 right-6 transition-all duration-300 ease-in-out",
      isActive ? "scale-100" : "scale-100"
    )}>
      {/* AI Assistant dialog */}
      {isActive && (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 mb-4 w-[320px] transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center border-b border-slate-200 p-3 bg-sourcexpress-purple/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sourcexpress-purple text-white flex items-center justify-center font-bold">
                R
              </div>
              <span className="font-medium">Rê - Assistente IA</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 h-[200px] overflow-y-auto">
            <div className="bg-slate-100 rounded-lg p-3 text-sm">
              {message}
            </div>
            
            {/* Placeholder for chat history */}
            <div className="py-2 text-xs text-center text-slate-500">
              Aguardando sua pergunta...
            </div>
          </div>
          
          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Digite ou fale com a Rê..."
                  className="w-full p-2 pl-3 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sourcexpress-purple focus:border-transparent"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2">
                  <Mic className="h-4 w-4 text-slate-400 hover:text-sourcexpress-purple" />
                </Button>
              </div>
              <Button size="sm">Enviar</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main trigger button */}
      <Button 
        onClick={handleToggle}
        className={cn(
          "rounded-full h-14 w-14 shadow-lg",
          isActive 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-sourcexpress-purple hover:bg-sourcexpress-purple/90"
        )}
      >
        {isActive ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <Mic className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-white animate-pulse-subtle"></span>
          </div>
        )}
      </Button>
    </div>
  );
};
