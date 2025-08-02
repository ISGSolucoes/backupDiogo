
import { cn } from "@/lib/utils";

interface CardDeStatusProps {
  titulo: string;
  valor: string;
  tipo?: "default" | "success" | "warning" | "danger";
}

export const CardDeStatus = ({
  titulo,
  valor,
  tipo = "default"
}: CardDeStatusProps) => {
  const getTypeStyles = () => {
    switch (tipo) {
      case "success":
        return "bg-green-50 border-green-200 text-green-700";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "danger":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-white border-slate-200";
    }
  };

  return (
    <div className={cn(
      "rounded-lg border p-5 card-shadow flex-1",
      getTypeStyles()
    )}>
      <p className="text-sm font-medium mb-2">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
    </div>
  );
};
