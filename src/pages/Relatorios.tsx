
import { BarChart2 } from "lucide-react";

const Relatorios = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200 card-shadow">
        <div className="text-center">
          <BarChart2 className="mx-auto h-12 w-12 text-sourcexpress-blue mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Módulo de Relatórios</h1>
          <p className="mt-2 text-slate-500">
            Visualize relatórios e indicadores estratégicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
