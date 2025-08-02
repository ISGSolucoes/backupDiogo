import React from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DetalhesEventoFornecedor } from "@/components/portal-fornecedor/DetalhesEventoFornecedor";

export default function PortalFornecedorEvento() {
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
                onClick={() => navigate("/portal-fornecedor/inbox")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar aos Convites
              </Button>
              <div className="text-2xl font-bold text-blue-900">
                🔗 SourceXpress Portal
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
          <DetalhesEventoFornecedor />
        </div>
      </div>
    </div>
  );
}