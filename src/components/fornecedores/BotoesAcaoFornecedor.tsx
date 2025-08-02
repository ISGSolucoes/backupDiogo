
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IAReButton } from "@/components/dashboard/IAReButton";
import { CadastroFornecedorModal } from "./CadastroFornecedorModal";

interface BotoesAcaoFornecedorProps {
  onImportarClick?: () => void;
  onNovoFornecedorClick?: () => void;
}

export const BotoesAcaoFornecedor = ({ onImportarClick, onNovoFornecedorClick }: BotoesAcaoFornecedorProps) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    // Aqui iria a lógica para importar o arquivo
    console.log("Importando arquivo:", file?.name);
    setShowImportModal(false);
    if (onImportarClick) onImportarClick();
  };

  const handleNovoFornecedor = () => {
    setShowCadastroModal(true);
    if (onNovoFornecedorClick) onNovoFornecedorClick();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Importar Fornecedores
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Fornecedores</DialogTitle>
            <DialogDescription>
              Faça upload de uma planilha contendo os dados dos fornecedores.
              O arquivo deve estar no formato .xlsx, .csv ou .xls.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Formatos aceitos: .xlsx, .xls, .csv
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportModal(false)}>Cancelar</Button>
            <Button onClick={handleImport} disabled={!file}>Importar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button onClick={handleNovoFornecedor}>
        <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
      </Button>

      <IAReButton />

      <CadastroFornecedorModal 
        open={showCadastroModal}
        onOpenChange={setShowCadastroModal}
      />
    </div>
  );
};
