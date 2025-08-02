
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentoFormData, TipoDocumento } from "@/types/documentos";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FormularioDocumentoProps {
  onSubmit: (data: DocumentoFormData) => void;
  fornecedorId?: string;
  isLoading?: boolean;
}

export const FormularioDocumento = ({ 
  onSubmit, 
  fornecedorId,
  isLoading = false 
}: FormularioDocumentoProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<DocumentoFormData>({
    defaultValues: {
      tipo: "outro",
      nome: "",
      validade: undefined,
      arquivo: null
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      form.setValue("arquivo", file);
    }
  };

  const handleSubmit = (data: DocumentoFormData) => {
    if (!data.arquivo) {
      toast.error("Selecione um arquivo para upload");
      return;
    }
    
    onSubmit(data);
    form.reset();
    setSelectedFile(null);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Upload de Documento</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento*</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="certidao">Certidão</SelectItem>
                      <SelectItem value="contrato">Contrato</SelectItem>
                      <SelectItem value="formulario">Formulário</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome/Referência*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Certidão Negativa de Débitos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="validade"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Validade (opcional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="arquivo"
              render={() => (
                <FormItem>
                  <FormLabel>Arquivo*</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden" 
                        id="file-upload" 
                      />
                      <label 
                        htmlFor="file-upload"
                        className="cursor-pointer flex items-center justify-center w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile ? selectedFile.name : "Selecionar arquivo"}
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Formatos aceitos: PDF, DOC, DOCX, JPG, PNG
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="ml-auto block" 
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? (
              <>Enviando...</>
            ) : (
              <>Fazer Upload</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
