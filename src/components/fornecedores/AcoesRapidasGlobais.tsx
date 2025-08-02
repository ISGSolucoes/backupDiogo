import React, { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Calendar, 
  RefreshCw, 
  FileUp, 
  FileText, 
  XOctagon, 
  CheckCircle,
  Upload,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SolicitarRegistro } from "./SolicitarRegistro";
import { BotaoAcoesRecomendadas } from "./BotaoAcoesRecomendadas";
import { CadastroFornecedorModal } from "./CadastroFornecedorModal";

interface AcoesRapidasGlobaisProps {
  children?: ReactNode;
  onNovoFornecedorClick?: () => void;
}

export const AcoesRapidasGlobais: React.FC<AcoesRapidasGlobaisProps> = ({ children, onNovoFornecedorClick }) => {
  // Estado para controlar os modais
  const [showConvidarModal, setShowConvidarModal] = useState(false);
  const [showRequalificarSheet, setShowRequalificarSheet] = useState(false);
  const [showAtualizarSheet, setShowAtualizarSheet] = useState(false);
  const [showExportarModal, setShowExportarModal] = useState(false);
  const [showInativarSheet, setShowInativarSheet] = useState(false);
  const [showReativarSheet, setShowReativarSheet] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  
  // Estado para termo de busca em diversos modais
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para opções de exportação
  const [exportOptions, setExportOptions] = useState({
    format: "csv",
    includeDocuments: false,
    includeInactive: false,
  });
  
  // Fornecedores mock para os modais de demonstração
  const fornecedoresMock = [
    { id: "1", nome: "Tech Solutions Ltda", cnpj: "12.345.678/0001-90", status: "ativo", ultimaAtualizacao: "10/01/2023" },
    { id: "2", nome: "ABC Materiais", cnpj: "98.765.432/0001-10", status: "qualificado", ultimaAtualizacao: "15/03/2023" },
    { id: "3", nome: "Transportes Rápidos SA", cnpj: "45.678.912/0001-34", status: "inativo", ultimaAtualizacao: "05/02/2023" },
    { id: "4", nome: "Consultoria ME", cnpj: "23.456.789/0001-21", status: "em_registro", ultimaAtualizacao: "20/05/2023" },
  ];
  
  // Filtrar fornecedores baseado no termo de busca
  const filteredFornecedores = fornecedoresMock.filter(f => 
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.cnpj.includes(searchTerm)
  );
  
  // Filtros específicos para cada ação
  const fornecedoresParaRequalificar = fornecedoresMock.filter(f => f.status === "qualificado");
  const fornecedoresParaAtualizar = fornecedoresMock.filter(f => 
    new Date(f.ultimaAtualizacao.split('/').reverse().join('-')) < new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
  );
  const fornecedoresAtivos = fornecedoresMock.filter(f => f.status !== "inativo");
  const fornecedoresInativos = fornecedoresMock.filter(f => f.status === "inativo");
  
  // Novos estados para os novos modais
  const [file, setFile] = useState<File | null>(null);
  
  // Funções para cada ação
  const handleConvidarClick = () => {
    setSearchTerm("");
    setShowConvidarModal(true);
  };
  
  const handleEnviarConvite = () => {
    toast.success("Convite enviado com sucesso!");
    setShowConvidarModal(false);
  };
  
  const handleRequalificarClick = () => {
    setShowRequalificarSheet(true);
  };
  
  const handleEnviarRequalificacao = () => {
    toast.success("Solicitação de requalificação enviada!");
    setShowRequalificarSheet(false);
  };
  
  const handleAtualizarClick = () => {
    setShowAtualizarSheet(true);
  };
  
  const handleEnviarAtualizacao = () => {
    toast.success("Solicitação de atualização cadastral enviada!");
    setShowAtualizarSheet(false);
  };
  
  const handleExportarClick = () => {
    setExportOptions({
      format: "csv",
      includeDocuments: false,
      includeInactive: false,
    });
    setShowExportarModal(true);
  };
  
  const handleExportar = () => {
    toast.success(`Exportação em ${exportOptions.format.toUpperCase()} iniciada!`);
    setShowExportarModal(false);
  };
  
  const handleInativarClick = () => {
    setShowInativarSheet(true);
  };
  
  const handleConfirmarInativacao = () => {
    toast.success("Fornecedores selecionados foram inativados!");
    setShowInativarSheet(false);
  };
  
  const handleReativarClick = () => {
    setShowReativarSheet(true);
  };
  
  const handleConfirmarReativacao = () => {
    toast.success("Fornecedores selecionados foram reativados!");
    setShowReativarSheet(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    console.log("Importando arquivo:", file?.name);
    setShowImportModal(false);
    toast.success("Importação iniciada com sucesso!");
  };

  const handleNovoFornecedor = () => {
    setShowCadastroModal(true);
    if (onNovoFornecedorClick) onNovoFornecedorClick();
  };
  
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Ações Rápidas</h3>
          
          <BotaoAcoesRecomendadas />
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            {children}
            <SolicitarRegistro />
            
            {/* Novos botões movidos do cabeçalho */}
            <Link to="/controle-documental">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Controle Documental
              </Button>
            </Link>
            
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Fornecedores
            </Button>
            
            <Button onClick={handleNovoFornecedor}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={handleConvidarClick}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" /> 
              Convidar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRequalificarClick}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> 
              Requalificar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleAtualizarClick}
              className="flex items-center gap-2"
            >
              <FileUp className="h-4 w-4" /> 
              Atualizar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExportarClick}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> 
              Exportar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleInativarClick}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <XOctagon className="h-4 w-4" /> 
              Inativar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleReativarClick}
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" /> 
              Reativar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Modal de Convidar */}
      <Dialog open={showConvidarModal} onOpenChange={setShowConvidarModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convidar Fornecedores</DialogTitle>
            <DialogDescription>
              Busque fornecedores para enviar convite por e-mail ou WhatsApp.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Buscar por nome ou CNPJ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            
            <div className="max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFornecedores.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <Checkbox id={`select-${fornecedor.id}`} />
                      </TableCell>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.cnpj}</TableCell>
                      <TableCell>{fornecedor.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-start">
            <div className="flex gap-2 w-full justify-between">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowConvidarModal(false)}
                >
                  Cancelar
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEnviarConvite}>
                  Enviar Convite
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sheet de Requalificar */}
      <Sheet open={showRequalificarSheet} onOpenChange={setShowRequalificarSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Requalificar Fornecedores</SheetTitle>
            <SheetDescription>
              Selecione os fornecedores que deseja solicitar requalificação.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-4">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fornecedoresParaRequalificar.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <Checkbox id={`requalify-${fornecedor.id}`} />
                      </TableCell>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setShowRequalificarSheet(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnviarRequalificacao}>
              Enviar Solicitação
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Sheet de Atualizar */}
      <Sheet open={showAtualizarSheet} onOpenChange={setShowAtualizarSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Solicitar Atualização Cadastral</SheetTitle>
            <SheetDescription>
              Fornecedores que não atualizam cadastro há mais de 6 meses.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-4">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fornecedoresParaAtualizar.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <Checkbox id={`update-${fornecedor.id}`} />
                      </TableCell>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.ultimaAtualizacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setShowAtualizarSheet(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnviarAtualizacao}>
              Solicitar Atualização
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Modal de Exportar */}
      <Dialog open={showExportarModal} onOpenChange={setShowExportarModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Fornecedores</DialogTitle>
            <DialogDescription>
              Selecione as opções desejadas para exportação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Formato</h4>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="format-csv" 
                    checked={exportOptions.format === "csv"}
                    onCheckedChange={() => setExportOptions({...exportOptions, format: "csv"})}
                  />
                  <label htmlFor="format-csv">CSV</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="format-pdf" 
                    checked={exportOptions.format === "pdf"}
                    onCheckedChange={() => setExportOptions({...exportOptions, format: "pdf"})}
                  />
                  <label htmlFor="format-pdf">PDF</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="format-xls" 
                    checked={exportOptions.format === "xls"}
                    onCheckedChange={() => setExportOptions({...exportOptions, format: "xls"})}
                  />
                  <label htmlFor="format-xls">XLS</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Opções</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-docs" 
                    checked={exportOptions.includeDocuments}
                    onCheckedChange={(checked) => 
                      setExportOptions({...exportOptions, includeDocuments: !!checked})
                    }
                  />
                  <label htmlFor="include-docs">Incluir documentos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-inactive" 
                    checked={exportOptions.includeInactive}
                    onCheckedChange={(checked) => 
                      setExportOptions({...exportOptions, includeInactive: !!checked})
                    }
                  />
                  <label htmlFor="include-inactive">Incluir fornecedores inativos</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExportar}>
              Exportar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sheet de Inativar */}
      <Sheet open={showInativarSheet} onOpenChange={setShowInativarSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Inativar Fornecedores</SheetTitle>
            <SheetDescription>
              Selecione os fornecedores que deseja inativar. Esta ação pode afetar processos em andamento.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-4">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fornecedoresAtivos.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <Checkbox id={`inactivate-${fornecedor.id}`} />
                      </TableCell>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setShowInativarSheet(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmarInativacao}>
              Confirmar Inativação
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Sheet de Reativar */}
      <Sheet open={showReativarSheet} onOpenChange={setShowReativarSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Reativar Fornecedores</SheetTitle>
            <SheetDescription>
              Selecione os fornecedores inativos que deseja reativar.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-4">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fornecedoresInativos.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <Checkbox id={`reactivate-${fornecedor.id}`} />
                      </TableCell>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setShowReativarSheet(false)}>
              Cancelar
            </Button>
            <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={handleConfirmarReativacao}>
              Confirmar Reativação
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Modal de Importar Fornecedores */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
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

      {/* Modal de Cadastro de Fornecedor */}
      <CadastroFornecedorModal 
        open={showCadastroModal}
        onOpenChange={setShowCadastroModal}
      />
    </div>
  );
};
