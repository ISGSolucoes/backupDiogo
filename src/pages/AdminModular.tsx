
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminModular = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a nova estrutura admin
    navigate('/admin', { replace: true });
  }, [navigate]);

  return null;
};

export default AdminModular;
