import { User, StickyNote, Calendar, Star, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecaoContextual } from "./SecaoContextual";

export const BlocoMinhaArea = () => {
  const notasPessoais = [
    {
      titulo: "Reunião com diretor",
      conteudo: "Apresentar relatório de economia Q1 - focar nos resultados de sourcing",
      data: "Ontem"
    },
    {
      titulo: "Contato - ABC Materiais",
      conteudo: "João Silva - (11) 99999-0000 - Gerente comercial",
      data: "2 dias atrás"
    }
  ];

  const agendaSemanal = [
    {
      titulo: "Reunião de planejamento mensal",
      data: "Segunda, 09:00",
      tipo: "Reunião",
      local: "Sala 3"
    },
    {
      titulo: "Análise de propostas - EV-007",
      data: "Terça, 14:00",
      tipo: "Análise",
      local: "Home office"
    },
    {
      titulo: "Apresentação para diretoria",
      data: "Sexta, 16:00",
      tipo: "Apresentação",
      local: "Auditório"
    }
  ];

  const favoritos = [
    {
      tipo: "Fornecedor",
      nome: "Alpha Materiais",
      categoria: "Construção",
      ultimoContato: "3 dias"
    },
    {
      tipo: "Categoria",
      nome: "Material de Escritório",
      gastoMensal: "R$ 12.300",
      fornecedores: 8
    }
  ];

  return (
    <SecaoContextual
      titulo="Minha Área"
      icone={User}
      contador={notasPessoais.length + agendaSemanal.length}
    >
      {/* Notas Pessoais */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-yellow-500" />
            Minhas Notas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {notasPessoais.map((nota, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm">{nota.titulo}</span>
                  <span className="text-xs text-slate-500">{nota.data}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{nota.conteudo}</p>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-xs">
              + Adicionar nota
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agenda da Semana */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            Agenda da Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {agendaSemanal.map((evento, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="font-semibold text-sm">{evento.titulo}</span>
                  <p className="text-sm text-slate-600">{evento.data}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {evento.tipo}
                    </Badge>
                    <span className="text-xs text-slate-500">{evento.local}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs">
                  Editar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favoritos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {favoritos.map((favorito, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{favorito.nome}</span>
                    <Badge variant="secondary" className="text-xs">
                      {favorito.tipo}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {favorito.tipo === "Fornecedor" 
                      ? `${favorito.categoria} • Último contato: ${favorito.ultimoContato}`
                      : `${favorito.gastoMensal} • ${favorito.fornecedores} fornecedores`
                    }
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Acessar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mini Calculadora */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calculator className="h-4 w-4 text-purple-500" />
            Mini Calc
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-100 rounded">
              <p className="text-xs text-slate-500">Economia Mês</p>
              <p className="font-semibold text-sm">R$ 31.200</p>
            </div>
            <div className="p-2 bg-slate-100 rounded">
              <p className="text-xs text-slate-500">% Meta</p>
              <p className="font-semibold text-sm text-green-600">112%</p>
            </div>
            <div className="p-2 bg-slate-100 rounded">
              <p className="text-xs text-slate-500">Contratos</p>
              <p className="font-semibold text-sm">24</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </SecaoContextual>
  );
};