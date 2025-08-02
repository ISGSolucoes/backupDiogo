
import React from "react";
import { ArrowLeft, Inbox, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DocumentosRecebidos } from "@/components/portal-fornecedor/DocumentosRecebidos";
import { ConvitesRecebidos } from "@/components/portal-fornecedor/ConvitesRecebidos";

export default function PortalFornecedorInbox() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/portal-fornecedor")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Portal
              </Button>
              <div className="text-2xl font-bold text-blue-900">
                🔗 SourceXpress Portal
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">TechSupply Solutions</span>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  TS
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Inbox className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Central de Documentos
              </h1>
              <p className="text-gray-600">
                Convites de sourcing, pedidos, cotações e documentos dos seus clientes
              </p>
            </div>
          </div>

          {/* Tabs para separar tipos de documento */}
          <div className="mb-6">
            <div className="border-b">
              <nav className="-mb-px flex space-x-8">
                <button className="border-transparent text-blue-600 border-b-2 border-blue-600 py-2 px-1 text-sm font-medium">
                  Convites de Sourcing
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium">
                  Documentos Gerais
                </button>
              </nav>
            </div>
          </div>

          <ConvitesRecebidos />
        </div>
      </div>
    </div>
  );
}
