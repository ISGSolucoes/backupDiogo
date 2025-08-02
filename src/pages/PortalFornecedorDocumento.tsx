
import React from 'react';
import { useParams } from 'react-router-dom';

const PortalFornecedorDocumento = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-4">Documento {id}</h1>
      <p className="text-muted-foreground">Detalhes do documento</p>
    </div>
  );
};

export default PortalFornecedorDocumento;
