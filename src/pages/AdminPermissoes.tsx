
import React from 'react';
import { PermissionTable } from '@/components/admin/PermissionTable';

const AdminPermissoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <PermissionTable />
      </div>
    </div>
  );
};

export default AdminPermissoes;
