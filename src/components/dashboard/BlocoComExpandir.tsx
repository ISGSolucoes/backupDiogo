
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BlocoComExpandirProps {
  titulo: string;
  icone?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  maxHeight?: string;
}

export const BlocoComExpandir = ({
  titulo,
  icone,
  children,
  className,
  defaultOpen = true,
  actions,
  maxHeight = "300px"
}: BlocoComExpandirProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={cn("bg-white rounded-lg border border-slate-200 card-shadow", className)}>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {icone}
          <h3 className="font-semibold text-lg">{titulo}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
