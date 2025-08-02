
import { useState } from "react";
import { Calculator, PercentIcon, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BlocoComExpandir } from "./BlocoComExpandir";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MiniCalc = () => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [mode, setMode] = useState<"saving" | "discount">("saving");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);
    
    if (isNaN(num1) || isNaN(num2)) {
      setResult("Valores inválidos");
      return;
    }
    
    if (mode === "saving") {
      // Calcular economia percentual
      const calculatedResult = Math.round(((num1 - num2) / num1) * 100);
      setResult(`💰 Economia de ${calculatedResult}%`);
    } else {
      // Calcular valor com desconto aplicado
      const discountAmount = num1 * (num2 / 100);
      const finalValue = num1 - discountAmount;
      setResult(`Novo valor: R$ ${finalValue.toFixed(2)}`);
    }
  };

  return (
    <BlocoComExpandir 
      titulo="Mini Calculadora" 
      icone={
        <div className="icon-container icon-container-amber">
          <Calculator className="h-5 w-5" />
        </div>
      }
    >
      <div className="p-4 space-y-4">
        <div className="text-xs text-slate-600 mb-1">🧮 Calcular:</div>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "saving" | "discount")} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="saving" className="text-xs">
              <PercentIcon className="h-3.5 w-3.5 mr-1" /> Economia
            </TabsTrigger>
            <TabsTrigger value="discount" className="text-xs">
              <DollarSign className="h-3.5 w-3.5 mr-1" /> Desconto
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saving" className="space-y-3 mt-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Valor original (R$)
              </label>
              <Input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="1000,00"
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Valor final (R$)
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="800,00"
                className="text-sm"
              />
            </div>
            
            <Button onClick={calculate} className="w-full text-sm">
              Calcular Economia
            </Button>
          </TabsContent>
          
          <TabsContent value="discount" className="space-y-3 mt-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Valor base (R$)
              </label>
              <Input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="2000,00"
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Desconto aplicado (%)
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="15"
                className="text-sm"
              />
            </div>
            
            <Button onClick={calculate} className="w-full text-sm">
              Calcular Valor Final
            </Button>
          </TabsContent>
        </Tabs>
        
        {result && (
          <div className={cn(
            "mt-3 p-2 rounded text-center font-medium",
            result.includes("inválid") 
              ? "bg-red-100 text-red-800" 
              : "bg-green-100 text-green-800"
          )}>
            {result}
          </div>
        )}
      </div>
    </BlocoComExpandir>
  );
};
