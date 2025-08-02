
import { FileSearch } from "lucide-react";

const Cleanse = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200 card-shadow p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <FileSearch className="h-8 w-8 text-sourcexpress-purple" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Módulo de Cleanse</h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">
            Tratamento e qualificação da base de dados de fornecedores
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cleanse;
