
import { useState } from "react";

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const useCep = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarCep = async (cep: string): Promise<CepData | null> => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');
    
    // Valida se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
      setError("CEP deve ter 8 dígitos");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar CEP");
      }

      const data: CepData = await response.json();
      
      if (data.erro) {
        setError("CEP não encontrado");
        return null;
      }

      return data;
    } catch (err) {
      setError("Erro ao buscar dados do CEP");
      console.error("Erro na busca do CEP:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCep, loading, error };
};
