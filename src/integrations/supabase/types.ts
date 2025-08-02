export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aceites_fornecedor: {
        Row: {
          contato_id: string
          created_at: string
          data_aceite: string
          detalhes_contexto: Json | null
          id: string
          ip_aceite: unknown | null
          relacionamento_id: string | null
          tipo_aceite: string
          user_agent: string | null
          versao_documento: string
        }
        Insert: {
          contato_id: string
          created_at?: string
          data_aceite?: string
          detalhes_contexto?: Json | null
          id?: string
          ip_aceite?: unknown | null
          relacionamento_id?: string | null
          tipo_aceite: string
          user_agent?: string | null
          versao_documento: string
        }
        Update: {
          contato_id?: string
          created_at?: string
          data_aceite?: string
          detalhes_contexto?: Json | null
          id?: string
          ip_aceite?: unknown | null
          relacionamento_id?: string | null
          tipo_aceite?: string
          user_agent?: string | null
          versao_documento?: string
        }
        Relationships: [
          {
            foreignKeyName: "aceites_fornecedor_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos_fornecedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aceites_fornecedor_relacionamento_id_fkey"
            columns: ["relacionamento_id"]
            isOneToOne: false
            referencedRelation: "relacionamentos_clientes_fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      acoes_recomendadas: {
        Row: {
          created_at: string | null
          descricao: string
          executada: boolean | null
          executada_em: string | null
          executada_por: string | null
          fornecedor_cnpj: string
          fornecedor_id: string
          fornecedor_nome: string
          id: string
          justificativa: string | null
          prioridade: Database["public"]["Enums"]["prioridade_acao"]
          sugerida_em: string | null
          tipo_acao: Database["public"]["Enums"]["tipo_acao_recomendada"]
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao: string
          executada?: boolean | null
          executada_em?: string | null
          executada_por?: string | null
          fornecedor_cnpj: string
          fornecedor_id: string
          fornecedor_nome: string
          id?: string
          justificativa?: string | null
          prioridade: Database["public"]["Enums"]["prioridade_acao"]
          sugerida_em?: string | null
          tipo_acao: Database["public"]["Enums"]["tipo_acao_recomendada"]
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string
          executada?: boolean | null
          executada_em?: string | null
          executada_por?: string | null
          fornecedor_cnpj?: string
          fornecedor_id?: string
          fornecedor_nome?: string
          id?: string
          justificativa?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_acao"]
          sugerida_em?: string | null
          tipo_acao?: Database["public"]["Enums"]["tipo_acao_recomendada"]
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      anexos_pedido: {
        Row: {
          bucket: string | null
          caminho_arquivo: string
          created_at: string
          criado_por: string
          descricao: string | null
          id: string
          item_id: string | null
          nome_arquivo: string
          nome_original: string
          pedido_id: string | null
          tamanho_bytes: number
          tipo_anexo: string | null
          tipo_mime: string
          url_publica: string | null
        }
        Insert: {
          bucket?: string | null
          caminho_arquivo: string
          created_at?: string
          criado_por: string
          descricao?: string | null
          id?: string
          item_id?: string | null
          nome_arquivo: string
          nome_original: string
          pedido_id?: string | null
          tamanho_bytes: number
          tipo_anexo?: string | null
          tipo_mime: string
          url_publica?: string | null
        }
        Update: {
          bucket?: string | null
          caminho_arquivo?: string
          created_at?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          item_id?: string | null
          nome_arquivo?: string
          nome_original?: string
          pedido_id?: string | null
          tamanho_bytes?: number
          tipo_anexo?: string | null
          tipo_mime?: string
          url_publica?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anexos_pedido_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens_pedido"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anexos_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      anexos_sourcing: {
        Row: {
          categoria: string
          created_at: string
          criado_por: string
          descricao: string | null
          id: string
          nome_arquivo: string
          nome_original: string
          projeto_id: string
          publico_fornecedores: boolean | null
          tamanho_bytes: number
          tipo_arquivo: string
          url_arquivo: string
        }
        Insert: {
          categoria: string
          created_at?: string
          criado_por: string
          descricao?: string | null
          id?: string
          nome_arquivo: string
          nome_original: string
          projeto_id: string
          publico_fornecedores?: boolean | null
          tamanho_bytes: number
          tipo_arquivo: string
          url_arquivo: string
        }
        Update: {
          categoria?: string
          created_at?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          nome_arquivo?: string
          nome_original?: string
          projeto_id?: string
          publico_fornecedores?: boolean | null
          tamanho_bytes?: number
          tipo_arquivo?: string
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexos_sourcing_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos_sourcing"
            referencedColumns: ["id"]
          },
        ]
      }
      aprovacoes_pedido: {
        Row: {
          anexos: Json | null
          aprovador_id: string
          comentarios: string | null
          created_at: string
          data_aprovacao: string | null
          data_expiracao: string | null
          data_solicitacao: string
          id: string
          motivo_rejeicao: string | null
          nivel: number
          pedido_id: string
          status_aprovacao: Database["public"]["Enums"]["status_aprovacao"]
          tipo_aprovacao: Database["public"]["Enums"]["tipo_aprovacao"]
          updated_at: string
        }
        Insert: {
          anexos?: Json | null
          aprovador_id: string
          comentarios?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_expiracao?: string | null
          data_solicitacao?: string
          id?: string
          motivo_rejeicao?: string | null
          nivel: number
          pedido_id: string
          status_aprovacao?: Database["public"]["Enums"]["status_aprovacao"]
          tipo_aprovacao?: Database["public"]["Enums"]["tipo_aprovacao"]
          updated_at?: string
        }
        Update: {
          anexos?: Json | null
          aprovador_id?: string
          comentarios?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_expiracao?: string | null
          data_solicitacao?: string
          id?: string
          motivo_rejeicao?: string | null
          nivel?: number
          pedido_id?: string
          status_aprovacao?: Database["public"]["Enums"]["status_aprovacao"]
          tipo_aprovacao?: Database["public"]["Enums"]["tipo_aprovacao"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aprovacoes_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      aprovacoes_requisicao: {
        Row: {
          aprovador_area: string | null
          aprovador_cargo: string | null
          aprovador_id: string
          aprovador_nome: string
          comentarios: string | null
          condicoes_aprovacao: string | null
          created_at: string
          data_expiracao: string | null
          data_resposta: string | null
          data_solicitacao: string
          delegado_para_id: string | null
          delegado_para_nome: string | null
          id: string
          motivo_delegacao: string | null
          motivo_rejeicao: string | null
          nivel: number
          ordem: number
          requisicao_id: string
          status: Database["public"]["Enums"]["status_aprovacao_req"]
          updated_at: string
        }
        Insert: {
          aprovador_area?: string | null
          aprovador_cargo?: string | null
          aprovador_id: string
          aprovador_nome: string
          comentarios?: string | null
          condicoes_aprovacao?: string | null
          created_at?: string
          data_expiracao?: string | null
          data_resposta?: string | null
          data_solicitacao?: string
          delegado_para_id?: string | null
          delegado_para_nome?: string | null
          id?: string
          motivo_delegacao?: string | null
          motivo_rejeicao?: string | null
          nivel: number
          ordem: number
          requisicao_id: string
          status?: Database["public"]["Enums"]["status_aprovacao_req"]
          updated_at?: string
        }
        Update: {
          aprovador_area?: string | null
          aprovador_cargo?: string | null
          aprovador_id?: string
          aprovador_nome?: string
          comentarios?: string | null
          condicoes_aprovacao?: string | null
          created_at?: string
          data_expiracao?: string | null
          data_resposta?: string | null
          data_solicitacao?: string
          delegado_para_id?: string | null
          delegado_para_nome?: string | null
          id?: string
          motivo_delegacao?: string | null
          motivo_rejeicao?: string | null
          nivel?: number
          ordem?: number
          requisicao_id?: string
          status?: Database["public"]["Enums"]["status_aprovacao_req"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aprovacoes_requisicao_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "requisicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      biblioteca_documentos: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          area: string
          areas_permitidas: string[] | null
          atualizado_em: string | null
          cargos_permitidos: string[] | null
          categoria: string | null
          criado_em: string | null
          criado_por: string
          data_validade: string | null
          descricao: string | null
          downloads_count: number | null
          finalidade: string
          id: string
          motivo_rejeicao: string | null
          nome_arquivo: string
          nome_original: string
          notificar_vencimento: boolean | null
          observacoes: string | null
          publico: boolean | null
          status: string | null
          tags: string[] | null
          tamanho_bytes: number
          tipo_arquivo: string
          ultimo_download: string | null
          url_arquivo: string
          versao: number | null
          versao_anterior_id: string | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          area: string
          areas_permitidas?: string[] | null
          atualizado_em?: string | null
          cargos_permitidos?: string[] | null
          categoria?: string | null
          criado_em?: string | null
          criado_por: string
          data_validade?: string | null
          descricao?: string | null
          downloads_count?: number | null
          finalidade: string
          id?: string
          motivo_rejeicao?: string | null
          nome_arquivo: string
          nome_original: string
          notificar_vencimento?: boolean | null
          observacoes?: string | null
          publico?: boolean | null
          status?: string | null
          tags?: string[] | null
          tamanho_bytes: number
          tipo_arquivo: string
          ultimo_download?: string | null
          url_arquivo: string
          versao?: number | null
          versao_anterior_id?: string | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          area?: string
          areas_permitidas?: string[] | null
          atualizado_em?: string | null
          cargos_permitidos?: string[] | null
          categoria?: string | null
          criado_em?: string | null
          criado_por?: string
          data_validade?: string | null
          descricao?: string | null
          downloads_count?: number | null
          finalidade?: string
          id?: string
          motivo_rejeicao?: string | null
          nome_arquivo?: string
          nome_original?: string
          notificar_vencimento?: boolean | null
          observacoes?: string | null
          publico?: boolean | null
          status?: string | null
          tags?: string[] | null
          tamanho_bytes?: number
          tipo_arquivo?: string
          ultimo_download?: string | null
          url_arquivo?: string
          versao?: number | null
          versao_anterior_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biblioteca_documentos_versao_anterior_id_fkey"
            columns: ["versao_anterior_id"]
            isOneToOne: false
            referencedRelation: "biblioteca_documentos"
            referencedColumns: ["id"]
          },
        ]
      }
      business_rule_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          module_id: string
          name: string
          order_index: number
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_id: string
          name: string
          order_index?: number
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_id?: string
          name?: string
          order_index?: number
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_rule_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "business_rule_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_rule_changes: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          change_reason: string | null
          change_type: string
          changed_by: string
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          workspace_rule_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          change_reason?: string | null
          change_type: string
          changed_by: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          workspace_rule_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          change_reason?: string | null
          change_type?: string
          changed_by?: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          workspace_rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_rule_changes_workspace_rule_id_fkey"
            columns: ["workspace_rule_id"]
            isOneToOne: false
            referencedRelation: "workspace_business_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      business_rule_templates: {
        Row: {
          category_id: string
          conflicts: string[] | null
          created_at: string
          default_value: Json | null
          dependencies: string[] | null
          description: string
          id: string
          impact_level: string
          is_core: boolean
          name: string
          options: Json | null
          order_index: number
          requires_approval: boolean
          rule_key: string
          rule_type: string
          updated_at: string
          validation_schema: Json | null
        }
        Insert: {
          category_id: string
          conflicts?: string[] | null
          created_at?: string
          default_value?: Json | null
          dependencies?: string[] | null
          description: string
          id?: string
          impact_level?: string
          is_core?: boolean
          name: string
          options?: Json | null
          order_index?: number
          requires_approval?: boolean
          rule_key: string
          rule_type?: string
          updated_at?: string
          validation_schema?: Json | null
        }
        Update: {
          category_id?: string
          conflicts?: string[] | null
          created_at?: string
          default_value?: Json | null
          dependencies?: string[] | null
          description?: string
          id?: string
          impact_level?: string
          is_core?: boolean
          name?: string
          options?: Json | null
          order_index?: number
          requires_approval?: boolean
          rule_key?: string
          rule_type?: string
          updated_at?: string
          validation_schema?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "business_rule_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_rule_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_rules: {
        Row: {
          action_config: Json | null
          condition_config: Json | null
          condition_type: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          module_id: string
          name: string
          priority: number
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          action_config?: Json | null
          condition_config?: Json | null
          condition_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          module_id: string
          name: string
          priority?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          action_config?: Json | null
          condition_config?: Json | null
          condition_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          module_id?: string
          name?: string
          priority?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_rules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "module_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      cadastro_fornecedor_documentos: {
        Row: {
          cadastro_id: string
          created_at: string
          id: string
          nome_arquivo: string
          tamanho_kb: number | null
          tipo_arquivo: string | null
          url_arquivo: string
        }
        Insert: {
          cadastro_id: string
          created_at?: string
          id?: string
          nome_arquivo: string
          tamanho_kb?: number | null
          tipo_arquivo?: string | null
          url_arquivo: string
        }
        Update: {
          cadastro_id?: string
          created_at?: string
          id?: string
          nome_arquivo?: string
          tamanho_kb?: number | null
          tipo_arquivo?: string | null
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "cadastro_fornecedor_documentos_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: false
            referencedRelation: "cadastro_fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      cadastro_fornecedores: {
        Row: {
          aceite_nda: boolean | null
          aprovado_em: string | null
          aprovado_por: string | null
          categoria_fornecimento: string
          cnpj: string | null
          cnpj_mei: string | null
          contato_email: string
          contato_idioma: string
          contato_local: string | null
          contato_nome: string
          contato_sobrenome: string
          contato_telefone: string
          convite_id: string | null
          cpf: string | null
          created_at: string
          e_mei: boolean | null
          endereco_andar: string | null
          endereco_bairro: string
          endereco_cep: string
          endereco_cidade: string
          endereco_complemento: string | null
          endereco_edificio: string | null
          endereco_estado: string
          endereco_numero: string
          endereco_pais: string
          endereco_rua: string
          endereco_sala: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          nome_completo: string | null
          nome_fantasia: string | null
          origem_cadastro: string
          profissao: string | null
          razao_social: string | null
          regiao_fornecimento: string
          rg_ou_cnh: string | null
          status_cadastro: string | null
          tem_contato_cliente: boolean | null
          tipo_fornecedor: string
          updated_at: string
        }
        Insert: {
          aceite_nda?: boolean | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          categoria_fornecimento: string
          cnpj?: string | null
          cnpj_mei?: string | null
          contato_email: string
          contato_idioma?: string
          contato_local?: string | null
          contato_nome: string
          contato_sobrenome: string
          contato_telefone: string
          convite_id?: string | null
          cpf?: string | null
          created_at?: string
          e_mei?: boolean | null
          endereco_andar?: string | null
          endereco_bairro: string
          endereco_cep: string
          endereco_cidade: string
          endereco_complemento?: string | null
          endereco_edificio?: string | null
          endereco_estado: string
          endereco_numero: string
          endereco_pais?: string
          endereco_rua: string
          endereco_sala?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_completo?: string | null
          nome_fantasia?: string | null
          origem_cadastro: string
          profissao?: string | null
          razao_social?: string | null
          regiao_fornecimento: string
          rg_ou_cnh?: string | null
          status_cadastro?: string | null
          tem_contato_cliente?: boolean | null
          tipo_fornecedor: string
          updated_at?: string
        }
        Update: {
          aceite_nda?: boolean | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          categoria_fornecimento?: string
          cnpj?: string | null
          cnpj_mei?: string | null
          contato_email?: string
          contato_idioma?: string
          contato_local?: string | null
          contato_nome?: string
          contato_sobrenome?: string
          contato_telefone?: string
          convite_id?: string | null
          cpf?: string | null
          created_at?: string
          e_mei?: boolean | null
          endereco_andar?: string | null
          endereco_bairro?: string
          endereco_cep?: string
          endereco_cidade?: string
          endereco_complemento?: string | null
          endereco_edificio?: string | null
          endereco_estado?: string
          endereco_numero?: string
          endereco_pais?: string
          endereco_rua?: string
          endereco_sala?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_completo?: string | null
          nome_fantasia?: string | null
          origem_cadastro?: string
          profissao?: string | null
          razao_social?: string | null
          regiao_fornecimento?: string
          rg_ou_cnh?: string | null
          status_cadastro?: string | null
          tem_contato_cliente?: boolean | null
          tipo_fornecedor?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cadastro_fornecedores_convite_id_fkey"
            columns: ["convite_id"]
            isOneToOne: false
            referencedRelation: "convites_fornecedor"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_fornecimento: {
        Row: {
          ativa: boolean | null
          capacidade_mensal: string | null
          categoria_principal: string
          certificacoes: string[] | null
          contato_id: string
          created_at: string
          data_inicio: string | null
          descricao_servicos: string | null
          id: string
          portfolio_url: string | null
          referencias_clientes: string[] | null
          regiao_atendimento: string[] | null
          subcategorias: string[] | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          capacidade_mensal?: string | null
          categoria_principal: string
          certificacoes?: string[] | null
          contato_id: string
          created_at?: string
          data_inicio?: string | null
          descricao_servicos?: string | null
          id?: string
          portfolio_url?: string | null
          referencias_clientes?: string[] | null
          regiao_atendimento?: string[] | null
          subcategorias?: string[] | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          capacidade_mensal?: string | null
          categoria_principal?: string
          certificacoes?: string[] | null
          contato_id?: string
          created_at?: string
          data_inicio?: string | null
          descricao_servicos?: string | null
          id?: string
          portfolio_url?: string | null
          referencias_clientes?: string[] | null
          regiao_atendimento?: string[] | null
          subcategorias?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_fornecimento_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos_fornecedor"
            referencedColumns: ["id"]
          },
        ]
      }
      contatos_fornecedor: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          created_at: string
          data_verificacao_email: string | null
          departamento: string | null
          email: string
          email_verificado: boolean | null
          fornecedor_id: string
          id: string
          nome: string
          perfil_acesso: string | null
          principal: boolean | null
          sobrenome: string
          telefone: string | null
          token_verificacao: string | null
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string
          data_verificacao_email?: string | null
          departamento?: string | null
          email: string
          email_verificado?: boolean | null
          fornecedor_id: string
          id?: string
          nome: string
          perfil_acesso?: string | null
          principal?: boolean | null
          sobrenome: string
          telefone?: string | null
          token_verificacao?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string
          data_verificacao_email?: string | null
          departamento?: string | null
          email?: string
          email_verificado?: boolean | null
          fornecedor_id?: string
          id?: string
          nome?: string
          perfil_acesso?: string | null
          principal?: boolean | null
          sobrenome?: string
          telefone?: string | null
          token_verificacao?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contatos_fornecedor_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      convites_fornecedor: {
        Row: {
          categorias_solicitadas: string[] | null
          cliente_codigo: string | null
          cliente_nome: string | null
          created_at: string
          data_cadastro: string | null
          data_envio: string
          data_expiracao: string
          data_visualizacao: string | null
          email_contato: string
          enviado_por: string | null
          id: string
          mensagem_convite: string | null
          mensagem_personalizada: string | null
          metadata: Json | null
          nome_empresa: string
          status: string
          tentativas_envio: number
          token_unico: string
          ultimo_erro: string | null
          updated_at: string
        }
        Insert: {
          categorias_solicitadas?: string[] | null
          cliente_codigo?: string | null
          cliente_nome?: string | null
          created_at?: string
          data_cadastro?: string | null
          data_envio?: string
          data_expiracao?: string
          data_visualizacao?: string | null
          email_contato: string
          enviado_por?: string | null
          id?: string
          mensagem_convite?: string | null
          mensagem_personalizada?: string | null
          metadata?: Json | null
          nome_empresa: string
          status?: string
          tentativas_envio?: number
          token_unico?: string
          ultimo_erro?: string | null
          updated_at?: string
        }
        Update: {
          categorias_solicitadas?: string[] | null
          cliente_codigo?: string | null
          cliente_nome?: string | null
          created_at?: string
          data_cadastro?: string | null
          data_envio?: string
          data_expiracao?: string
          data_visualizacao?: string | null
          email_contato?: string
          enviado_por?: string | null
          id?: string
          mensagem_convite?: string | null
          mensagem_personalizada?: string | null
          metadata?: Json | null
          nome_empresa?: string
          status?: string
          tentativas_envio?: number
          token_unico?: string
          ultimo_erro?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      disparo_acao_lote: {
        Row: {
          abertos: number | null
          concluido_em: string | null
          configuracoes: Json | null
          created_at: string | null
          disparado_em: string | null
          disparado_por: string | null
          enviados: number | null
          falhas: number | null
          id: string
          nome_disparo: string
          respondidos: number | null
          status: string | null
          template_id: string | null
          tipo_acao: string
          total_fornecedores: number | null
        }
        Insert: {
          abertos?: number | null
          concluido_em?: string | null
          configuracoes?: Json | null
          created_at?: string | null
          disparado_em?: string | null
          disparado_por?: string | null
          enviados?: number | null
          falhas?: number | null
          id?: string
          nome_disparo: string
          respondidos?: number | null
          status?: string | null
          template_id?: string | null
          tipo_acao: string
          total_fornecedores?: number | null
        }
        Update: {
          abertos?: number | null
          concluido_em?: string | null
          configuracoes?: Json | null
          created_at?: string | null
          disparado_em?: string | null
          disparado_por?: string | null
          enviados?: number | null
          falhas?: number | null
          id?: string
          nome_disparo?: string
          respondidos?: number | null
          status?: string | null
          template_id?: string | null
          tipo_acao?: string
          total_fornecedores?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "disparo_acao_lote_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "template_acao_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      disparo_fornecedor: {
        Row: {
          created_at: string | null
          data_abertura: string | null
          data_envio: string | null
          data_resposta: string | null
          disparo_id: string | null
          erro_envio: string | null
          fornecedor_cnpj: string
          fornecedor_email: string
          fornecedor_id: string
          fornecedor_nome: string
          id: string
          status_envio: string | null
          token_rastreio: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_abertura?: string | null
          data_envio?: string | null
          data_resposta?: string | null
          disparo_id?: string | null
          erro_envio?: string | null
          fornecedor_cnpj: string
          fornecedor_email: string
          fornecedor_id: string
          fornecedor_nome: string
          id?: string
          status_envio?: string | null
          token_rastreio?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_abertura?: string | null
          data_envio?: string | null
          data_resposta?: string | null
          disparo_id?: string | null
          erro_envio?: string | null
          fornecedor_cnpj?: string
          fornecedor_email?: string
          fornecedor_id?: string
          fornecedor_nome?: string
          id?: string
          status_envio?: string | null
          token_rastreio?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disparo_fornecedor_disparo_id_fkey"
            columns: ["disparo_id"]
            isOneToOne: false
            referencedRelation: "disparo_acao_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      excecoes_orcamentarias: {
        Row: {
          aprovada_em: string | null
          aprovada_por: string | null
          created_at: string
          id: string
          justificativa: string
          observacoes: string | null
          orcamento_id: string | null
          requisicao_id: string | null
          status: string | null
          updated_at: string
          valor_excedente: number
        }
        Insert: {
          aprovada_em?: string | null
          aprovada_por?: string | null
          created_at?: string
          id?: string
          justificativa: string
          observacoes?: string | null
          orcamento_id?: string | null
          requisicao_id?: string | null
          status?: string | null
          updated_at?: string
          valor_excedente: number
        }
        Update: {
          aprovada_em?: string | null
          aprovada_por?: string | null
          created_at?: string
          id?: string
          justificativa?: string
          observacoes?: string | null
          orcamento_id?: string | null
          requisicao_id?: string | null
          status?: string | null
          updated_at?: string
          valor_excedente?: number
        }
        Relationships: [
          {
            foreignKeyName: "excecoes_orcamentarias_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "excecoes_orcamentarias_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "requisicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          config: Json | null
          created_at: string
          created_by: string | null
          environment: string
          flag_name: string
          id: string
          is_enabled: boolean
          module_id: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          created_by?: string | null
          environment?: string
          flag_name: string
          id?: string
          is_enabled?: boolean
          module_id: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          created_by?: string | null
          environment?: string
          flag_name?: string
          id?: string
          is_enabled?: boolean
          module_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          cnae_principal_codigo: string | null
          cnae_principal_descricao: string | null
          cnaes_secundarios: Json | null
          cnpj_mei: string | null
          created_at: string
          created_by: string | null
          data_fundacao: string | null
          data_validacao_receita: string | null
          documento: string
          documento_formatado: string
          e_mei: boolean | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          natureza_juridica: string | null
          nome_completo: string | null
          nome_fantasia: string | null
          porte_empresa: string | null
          profissao: string | null
          razao_social: string | null
          rg_ou_cnh: string | null
          situacao_receita: string | null
          status: string
          tipo_documento: string
          ultimo_erro_validacao: string | null
          updated_at: string
          validado_receita: boolean | null
        }
        Insert: {
          cnae_principal_codigo?: string | null
          cnae_principal_descricao?: string | null
          cnaes_secundarios?: Json | null
          cnpj_mei?: string | null
          created_at?: string
          created_by?: string | null
          data_fundacao?: string | null
          data_validacao_receita?: string | null
          documento: string
          documento_formatado: string
          e_mei?: boolean | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          natureza_juridica?: string | null
          nome_completo?: string | null
          nome_fantasia?: string | null
          porte_empresa?: string | null
          profissao?: string | null
          razao_social?: string | null
          rg_ou_cnh?: string | null
          situacao_receita?: string | null
          status?: string
          tipo_documento: string
          ultimo_erro_validacao?: string | null
          updated_at?: string
          validado_receita?: boolean | null
        }
        Update: {
          cnae_principal_codigo?: string | null
          cnae_principal_descricao?: string | null
          cnaes_secundarios?: Json | null
          cnpj_mei?: string | null
          created_at?: string
          created_by?: string | null
          data_fundacao?: string | null
          data_validacao_receita?: string | null
          documento?: string
          documento_formatado?: string
          e_mei?: boolean | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          natureza_juridica?: string | null
          nome_completo?: string | null
          nome_fantasia?: string | null
          porte_empresa?: string | null
          profissao?: string | null
          razao_social?: string | null
          rg_ou_cnh?: string | null
          situacao_receita?: string | null
          status?: string
          tipo_documento?: string
          ultimo_erro_validacao?: string | null
          updated_at?: string
          validado_receita?: boolean | null
        }
        Relationships: []
      }
      global_audit_log: {
        Row: {
          action: string
          assinatura_digital: string | null
          created_at: string
          event_type: string
          hash_verificacao: string | null
          id: string
          ip_address: unknown | null
          module_id: string | null
          new_data: Json | null
          old_data: Json | null
          risk_level: string
          session_id: string | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
          user_id: string
          user_type: string
          workspace_id: string | null
        }
        Insert: {
          action: string
          assinatura_digital?: string | null
          created_at?: string
          event_type: string
          hash_verificacao?: string | null
          id?: string
          ip_address?: unknown | null
          module_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          risk_level?: string
          session_id?: string | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
          user_id: string
          user_type: string
          workspace_id?: string | null
        }
        Update: {
          action?: string
          assinatura_digital?: string | null
          created_at?: string
          event_type?: string
          hash_verificacao?: string | null
          id?: string
          ip_address?: unknown | null
          module_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          risk_level?: string
          session_id?: string | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
          user_id?: string
          user_type?: string
          workspace_id?: string | null
        }
        Relationships: []
      }
      historico_acao_fornecedor: {
        Row: {
          created_at: string | null
          detalhes: Json | null
          disparo_id: string | null
          executado_em: string | null
          executado_por: string | null
          fornecedor_id: string
          fornecedor_nome: string
          id: string
          status_final: string | null
          template_nome: string | null
          tipo_acao: string
        }
        Insert: {
          created_at?: string | null
          detalhes?: Json | null
          disparo_id?: string | null
          executado_em?: string | null
          executado_por?: string | null
          fornecedor_id: string
          fornecedor_nome: string
          id?: string
          status_final?: string | null
          template_nome?: string | null
          tipo_acao: string
        }
        Update: {
          created_at?: string | null
          detalhes?: Json | null
          disparo_id?: string | null
          executado_em?: string | null
          executado_por?: string | null
          fornecedor_id?: string
          fornecedor_nome?: string
          id?: string
          status_final?: string | null
          template_nome?: string | null
          tipo_acao?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_acao_fornecedor_disparo_id_fkey"
            columns: ["disparo_id"]
            isOneToOne: false
            referencedRelation: "disparo_acao_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_pedido: {
        Row: {
          campos_alterados: string[] | null
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          evento: string
          id: string
          ip_address: unknown | null
          origem: string | null
          pedido_id: string
          status_anterior: string | null
          status_novo: string | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          campos_alterados?: string[] | null
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          evento: string
          id?: string
          ip_address?: unknown | null
          origem?: string | null
          pedido_id: string
          status_anterior?: string | null
          status_novo?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          campos_alterados?: string[] | null
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          evento?: string
          id?: string
          ip_address?: unknown | null
          origem?: string | null
          pedido_id?: string
          status_anterior?: string | null
          status_novo?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_requisicao: {
        Row: {
          campos_alterados: string[] | null
          comentario: string | null
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          descricao: string | null
          evento: string
          id: string
          ip_address: unknown | null
          origem: string | null
          publico: boolean | null
          requisicao_id: string
          status_anterior: string | null
          status_novo: string | null
          user_agent: string | null
          usuario_area: string | null
          usuario_id: string | null
          usuario_nome: string
        }
        Insert: {
          campos_alterados?: string[] | null
          comentario?: string | null
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          evento: string
          id?: string
          ip_address?: unknown | null
          origem?: string | null
          publico?: boolean | null
          requisicao_id: string
          status_anterior?: string | null
          status_novo?: string | null
          user_agent?: string | null
          usuario_area?: string | null
          usuario_id?: string | null
          usuario_nome: string
        }
        Update: {
          campos_alterados?: string[] | null
          comentario?: string | null
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          evento?: string
          id?: string
          ip_address?: unknown | null
          origem?: string | null
          publico?: boolean | null
          requisicao_id?: string
          status_anterior?: string | null
          status_novo?: string | null
          user_agent?: string | null
          usuario_area?: string | null
          usuario_id?: string | null
          usuario_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_requisicao_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "requisicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_sourcing: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          etapa: number | null
          id: string
          observacoes: string | null
          projeto_id: string
          usuario_id: string
          usuario_nome: string
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          etapa?: number | null
          id?: string
          observacoes?: string | null
          projeto_id: string
          usuario_id: string
          usuario_nome: string
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          etapa?: number | null
          id?: string
          observacoes?: string | null
          projeto_id?: string
          usuario_id?: string
          usuario_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_sourcing_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos_sourcing"
            referencedColumns: ["id"]
          },
        ]
      }
      integracoes_portal: {
        Row: {
          created_at: string
          dados_enviados: Json | null
          data_sucesso: string | null
          data_tentativa: string
          erro_integracao: string | null
          headers_request: Json | null
          id: string
          ip_origem: unknown | null
          pedido_id: string
          portal_pedido_id: string | null
          portal_url: string | null
          proxima_tentativa: string | null
          resposta_recebida: Json | null
          status_integracao: Database["public"]["Enums"]["status_integracao"]
          tentativa: number
          tipo_operacao: Database["public"]["Enums"]["tipo_operacao_portal"]
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          dados_enviados?: Json | null
          data_sucesso?: string | null
          data_tentativa?: string
          erro_integracao?: string | null
          headers_request?: Json | null
          id?: string
          ip_origem?: unknown | null
          pedido_id: string
          portal_pedido_id?: string | null
          portal_url?: string | null
          proxima_tentativa?: string | null
          resposta_recebida?: Json | null
          status_integracao?: Database["public"]["Enums"]["status_integracao"]
          tentativa?: number
          tipo_operacao: Database["public"]["Enums"]["tipo_operacao_portal"]
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          dados_enviados?: Json | null
          data_sucesso?: string | null
          data_tentativa?: string
          erro_integracao?: string | null
          headers_request?: Json | null
          id?: string
          ip_origem?: unknown | null
          pedido_id?: string
          portal_pedido_id?: string | null
          portal_url?: string | null
          proxima_tentativa?: string | null
          resposta_recebida?: Json | null
          status_integracao?: Database["public"]["Enums"]["status_integracao"]
          tentativa?: number
          tipo_operacao?: Database["public"]["Enums"]["tipo_operacao_portal"]
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_portal_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          aceita_fracionamento: boolean | null
          categoria_familia: string | null
          categoria_id: string | null
          centro_custo_item: string | null
          codigo_fornecedor: string | null
          codigo_interno: string | null
          codigo_interno_cliente: string | null
          codigo_produto: string | null
          created_at: string
          data_entrega_item: string | null
          data_entrega_solicitada: string | null
          descricao: string
          especificacao: string | null
          especificacao_tecnica: string | null
          id: string
          local_entrega: string | null
          lote_serie: string | null
          observacoes: string | null
          observacoes_tecnicas: string | null
          observacoes_tecnicas_detalhadas: string | null
          pedido_id: string
          preco_unitario: number
          projeto_atividade: string | null
          quantidade: number
          sequencia: number
          subcategoria_id: string | null
          tolerancia_atraso: number | null
          tolerancia_atraso_dias: number | null
          unidade: string
          updated_at: string
          valor_total: number
        }
        Insert: {
          aceita_fracionamento?: boolean | null
          categoria_familia?: string | null
          categoria_id?: string | null
          centro_custo_item?: string | null
          codigo_fornecedor?: string | null
          codigo_interno?: string | null
          codigo_interno_cliente?: string | null
          codigo_produto?: string | null
          created_at?: string
          data_entrega_item?: string | null
          data_entrega_solicitada?: string | null
          descricao: string
          especificacao?: string | null
          especificacao_tecnica?: string | null
          id?: string
          local_entrega?: string | null
          lote_serie?: string | null
          observacoes?: string | null
          observacoes_tecnicas?: string | null
          observacoes_tecnicas_detalhadas?: string | null
          pedido_id: string
          preco_unitario: number
          projeto_atividade?: string | null
          quantidade: number
          sequencia: number
          subcategoria_id?: string | null
          tolerancia_atraso?: number | null
          tolerancia_atraso_dias?: number | null
          unidade: string
          updated_at?: string
          valor_total: number
        }
        Update: {
          aceita_fracionamento?: boolean | null
          categoria_familia?: string | null
          categoria_id?: string | null
          centro_custo_item?: string | null
          codigo_fornecedor?: string | null
          codigo_interno?: string | null
          codigo_interno_cliente?: string | null
          codigo_produto?: string | null
          created_at?: string
          data_entrega_item?: string | null
          data_entrega_solicitada?: string | null
          descricao?: string
          especificacao?: string | null
          especificacao_tecnica?: string | null
          id?: string
          local_entrega?: string | null
          lote_serie?: string | null
          observacoes?: string | null
          observacoes_tecnicas?: string | null
          observacoes_tecnicas_detalhadas?: string | null
          pedido_id?: string
          preco_unitario?: number
          projeto_atividade?: string | null
          quantidade?: number
          sequencia?: number
          subcategoria_id?: string | null
          tolerancia_atraso?: number | null
          tolerancia_atraso_dias?: number | null
          unidade?: string
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_requisicao: {
        Row: {
          codigo_produto: string | null
          created_at: string
          data_necessidade: string | null
          descricao: string
          especificacao: string | null
          id: string
          local_entrega: string | null
          observacoes: string | null
          preco_estimado: number | null
          quantidade: number
          requisicao_id: string
          sequencia: number
          unidade: string
          updated_at: string
          urgente: boolean | null
          valor_total_estimado: number | null
        }
        Insert: {
          codigo_produto?: string | null
          created_at?: string
          data_necessidade?: string | null
          descricao: string
          especificacao?: string | null
          id?: string
          local_entrega?: string | null
          observacoes?: string | null
          preco_estimado?: number | null
          quantidade: number
          requisicao_id: string
          sequencia: number
          unidade?: string
          updated_at?: string
          urgente?: boolean | null
          valor_total_estimado?: number | null
        }
        Update: {
          codigo_produto?: string | null
          created_at?: string
          data_necessidade?: string | null
          descricao?: string
          especificacao?: string | null
          id?: string
          local_entrega?: string | null
          observacoes?: string | null
          preco_estimado?: number | null
          quantidade?: number
          requisicao_id?: string
          sequencia?: number
          unidade?: string
          updated_at?: string
          urgente?: boolean | null
          valor_total_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_requisicao_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "requisicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_sourcing: {
        Row: {
          categoria: string | null
          codigo_item: string | null
          created_at: string
          descricao: string
          especificacao: string | null
          id: string
          lote: number | null
          observacoes: string | null
          projeto_id: string
          quantidade: number
          sequencia: number
          subcategoria: string | null
          unidade: string
          updated_at: string
          valor_estimado: number | null
        }
        Insert: {
          categoria?: string | null
          codigo_item?: string | null
          created_at?: string
          descricao: string
          especificacao?: string | null
          id?: string
          lote?: number | null
          observacoes?: string | null
          projeto_id: string
          quantidade: number
          sequencia: number
          subcategoria?: string | null
          unidade: string
          updated_at?: string
          valor_estimado?: number | null
        }
        Update: {
          categoria?: string | null
          codigo_item?: string | null
          created_at?: string
          descricao?: string
          especificacao?: string | null
          id?: string
          lote?: number | null
          observacoes?: string | null
          projeto_id?: string
          quantidade?: number
          sequencia?: number
          subcategoria?: string | null
          unidade?: string
          updated_at?: string
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_sourcing_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos_sourcing"
            referencedColumns: ["id"]
          },
        ]
      }
      job_roles: {
        Row: {
          created_at: string
          created_by: string | null
          department: string
          description: string | null
          id: string
          is_active: boolean
          level: number
          name: string
          permissions_template: Json
          updated_at: string
          visibility_scope: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department: string
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          name: string
          permissions_template?: Json
          updated_at?: string
          visibility_scope?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          name?: string
          permissions_template?: Json
          updated_at?: string
          visibility_scope?: Json
        }
        Relationships: []
      }
      logs_integracao_portal: {
        Row: {
          created_at: string
          dados_enviados: Json | null
          dados_recebidos: Json | null
          data_operacao: string
          erro_detalhes: string | null
          fornecedor_id: string
          id: string
          operacao: string
          pedido_id: string
          portal_pedido_id: string | null
          status: string
          tentativa: number | null
          token_portal: string | null
        }
        Insert: {
          created_at?: string
          dados_enviados?: Json | null
          dados_recebidos?: Json | null
          data_operacao?: string
          erro_detalhes?: string | null
          fornecedor_id: string
          id?: string
          operacao: string
          pedido_id: string
          portal_pedido_id?: string | null
          status: string
          tentativa?: number | null
          token_portal?: string | null
        }
        Update: {
          created_at?: string
          dados_enviados?: Json | null
          dados_recebidos?: Json | null
          data_operacao?: string
          erro_detalhes?: string | null
          fornecedor_id?: string
          id?: string
          operacao?: string
          pedido_id?: string
          portal_pedido_id?: string | null
          status?: string
          tentativa?: number | null
          token_portal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_integracao_portal_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      matriz_avaliacao_sourcing: {
        Row: {
          created_at: string
          criterios_comerciais: Json | null
          criterios_tecnicos: Json | null
          gerada_por_ia: boolean | null
          id: string
          lotes_config: Json | null
          peso_comercial: number
          peso_tecnico: number
          projeto_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criterios_comerciais?: Json | null
          criterios_tecnicos?: Json | null
          gerada_por_ia?: boolean | null
          id?: string
          lotes_config?: Json | null
          peso_comercial?: number
          peso_tecnico?: number
          projeto_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criterios_comerciais?: Json | null
          criterios_tecnicos?: Json | null
          gerada_por_ia?: boolean | null
          id?: string
          lotes_config?: Json | null
          peso_comercial?: number
          peso_tecnico?: number
          projeto_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matriz_avaliacao_sourcing_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos_sourcing"
            referencedColumns: ["id"]
          },
        ]
      }
      module_permissions: {
        Row: {
          area: string | null
          category_access: string[] | null
          cost_center: string | null
          expires_at: string | null
          functional_permissions: Json | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          module_id: string
          notes: string | null
          permissions: Json | null
          real_role: string | null
          role: string
          unit_access: string[] | null
          user_id: string
          visibility_scope: Json | null
        }
        Insert: {
          area?: string | null
          category_access?: string[] | null
          cost_center?: string | null
          expires_at?: string | null
          functional_permissions?: Json | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          module_id: string
          notes?: string | null
          permissions?: Json | null
          real_role?: string | null
          role: string
          unit_access?: string[] | null
          user_id: string
          visibility_scope?: Json | null
        }
        Update: {
          area?: string | null
          category_access?: string[] | null
          cost_center?: string | null
          expires_at?: string | null
          functional_permissions?: Json | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          module_id?: string
          notes?: string | null
          permissions?: Json | null
          real_role?: string | null
          role?: string
          unit_access?: string[] | null
          user_id?: string
          visibility_scope?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "module_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_workspaces: {
        Row: {
          configuration: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          module_id: string
          name: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          module_id: string
          name: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          module_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_workspaces_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          api_prefix: string | null
          config_schema: Json | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          id: string
          is_core: boolean
          name: string
          status: string
          type: string
          updated_at: string
          version: string
        }
        Insert: {
          api_prefix?: string | null
          config_schema?: Json | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_core?: boolean
          name: string
          status?: string
          type: string
          updated_at?: string
          version?: string
        }
        Update: {
          api_prefix?: string | null
          config_schema?: Json | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_core?: boolean
          name?: string
          status?: string
          type?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      orcamentos: {
        Row: {
          ano: number
          aprovado_em: string | null
          aprovado_por: string | null
          categoria: string | null
          centro_custo: string
          created_at: string
          id: string
          observacoes: string | null
          projeto: string | null
          updated_at: string
          valor_disponivel: number | null
          valor_reservado: number
          valor_total: number
          valor_utilizado: number
        }
        Insert: {
          ano: number
          aprovado_em?: string | null
          aprovado_por?: string | null
          categoria?: string | null
          centro_custo: string
          created_at?: string
          id?: string
          observacoes?: string | null
          projeto?: string | null
          updated_at?: string
          valor_disponivel?: number | null
          valor_reservado?: number
          valor_total?: number
          valor_utilizado?: number
        }
        Update: {
          ano?: number
          aprovado_em?: string | null
          aprovado_por?: string | null
          categoria?: string | null
          centro_custo?: string
          created_at?: string
          id?: string
          observacoes?: string | null
          projeto?: string | null
          updated_at?: string
          valor_disponivel?: number | null
          valor_reservado?: number
          valor_total?: number
          valor_utilizado?: number
        }
        Relationships: []
      }
      organizational_config: {
        Row: {
          codigo: string
          config_data: Json | null
          created_at: string
          descricao: string | null
          id: string
          is_active: boolean
          nome: string
          ordem: number | null
          parent_id: string | null
          tipo_config: string
          updated_at: string
        }
        Insert: {
          codigo: string
          config_data?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          is_active?: boolean
          nome: string
          ordem?: number | null
          parent_id?: string | null
          tipo_config: string
          updated_at?: string
        }
        Update: {
          codigo?: string
          config_data?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          is_active?: boolean
          nome?: string
          ordem?: number | null
          parent_id?: string | null
          tipo_config?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizational_config_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "organizational_config"
            referencedColumns: ["id"]
          },
        ]
      }
      participantes_sourcing: {
        Row: {
          created_at: string
          data_convite: string | null
          data_resposta: string | null
          fornecedor_email: string
          fornecedor_id: string
          fornecedor_nome: string
          id: string
          permissoes: Json | null
          projeto_id: string
          status_convite: string
          token_acesso: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_convite?: string | null
          data_resposta?: string | null
          fornecedor_email: string
          fornecedor_id: string
          fornecedor_nome: string
          id?: string
          permissoes?: Json | null
          projeto_id: string
          status_convite?: string
          token_acesso?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_convite?: string | null
          data_resposta?: string | null
          fornecedor_email?: string
          fornecedor_id?: string
          fornecedor_nome?: string
          id?: string
          permissoes?: Json | null
          projeto_id?: string
          status_convite?: string
          token_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participantes_sourcing_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos_sourcing"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          aceita_entrega_parcial: boolean | null
          aprovado_por: string | null
          centro_custo: string | null
          checklist_validacao: Json | null
          checklist_validacao_completo: boolean | null
          condicao_pagamento: string | null
          condicoes_pagamento: string | null
          conta_contabil: string | null
          contrato_vinculado: string | null
          cotacao_id: string | null
          cotacao_vinculada: string | null
          created_at: string
          criado_por: string
          data_aprovacao: string | null
          data_criacao: string
          data_emissao: string | null
          data_entrega_prevista: string | null
          data_entrega_solicitada: string
          data_envio_portal: string | null
          data_resposta_fornecedor: string | null
          deleted_at: string | null
          descontos_acrescimos: number | null
          empresa_id: string
          forma_pagamento: string | null
          fornecedor_cnpj: string | null
          fornecedor_endereco_faturamento: string | null
          fornecedor_id: string
          fornecedor_razao_social: string | null
          fornecedor_responsavel_email: string | null
          fornecedor_responsavel_nome: string | null
          fornecedor_status: string | null
          historico_acoes: Json | null
          id: string
          impostos: Json | null
          instrucoes_entrega: string | null
          local_entrega: string | null
          moeda: string
          numero_pedido: string
          observacoes: string | null
          observacoes_fornecedor: string | null
          observacoes_internas: string | null
          ordem_servico: string | null
          origem_demanda: string | null
          origem_id: string | null
          permite_edicao: boolean | null
          permite_fracionamento: boolean | null
          portal_pedido_id: string | null
          prazo_maximo_atraso: number | null
          projeto_atividade: string | null
          requisicao_id: string | null
          requisicao_vinculada: string | null
          responsavel_interno_email: string | null
          responsavel_interno_id: string | null
          responsavel_interno_nome: string | null
          status: Database["public"]["Enums"]["status_pedido"]
          status_portal: string | null
          tipo: Database["public"]["Enums"]["tipo_pedido"]
          tipo_detalhado: string | null
          tipo_frete: string | null
          transportadora: string | null
          updated_at: string
          valor_total: number
          versao: number
        }
        Insert: {
          aceita_entrega_parcial?: boolean | null
          aprovado_por?: string | null
          centro_custo?: string | null
          checklist_validacao?: Json | null
          checklist_validacao_completo?: boolean | null
          condicao_pagamento?: string | null
          condicoes_pagamento?: string | null
          conta_contabil?: string | null
          contrato_vinculado?: string | null
          cotacao_id?: string | null
          cotacao_vinculada?: string | null
          created_at?: string
          criado_por: string
          data_aprovacao?: string | null
          data_criacao?: string
          data_emissao?: string | null
          data_entrega_prevista?: string | null
          data_entrega_solicitada: string
          data_envio_portal?: string | null
          data_resposta_fornecedor?: string | null
          deleted_at?: string | null
          descontos_acrescimos?: number | null
          empresa_id?: string
          forma_pagamento?: string | null
          fornecedor_cnpj?: string | null
          fornecedor_endereco_faturamento?: string | null
          fornecedor_id: string
          fornecedor_razao_social?: string | null
          fornecedor_responsavel_email?: string | null
          fornecedor_responsavel_nome?: string | null
          fornecedor_status?: string | null
          historico_acoes?: Json | null
          id?: string
          impostos?: Json | null
          instrucoes_entrega?: string | null
          local_entrega?: string | null
          moeda?: string
          numero_pedido: string
          observacoes?: string | null
          observacoes_fornecedor?: string | null
          observacoes_internas?: string | null
          ordem_servico?: string | null
          origem_demanda?: string | null
          origem_id?: string | null
          permite_edicao?: boolean | null
          permite_fracionamento?: boolean | null
          portal_pedido_id?: string | null
          prazo_maximo_atraso?: number | null
          projeto_atividade?: string | null
          requisicao_id?: string | null
          requisicao_vinculada?: string | null
          responsavel_interno_email?: string | null
          responsavel_interno_id?: string | null
          responsavel_interno_nome?: string | null
          status?: Database["public"]["Enums"]["status_pedido"]
          status_portal?: string | null
          tipo?: Database["public"]["Enums"]["tipo_pedido"]
          tipo_detalhado?: string | null
          tipo_frete?: string | null
          transportadora?: string | null
          updated_at?: string
          valor_total?: number
          versao?: number
        }
        Update: {
          aceita_entrega_parcial?: boolean | null
          aprovado_por?: string | null
          centro_custo?: string | null
          checklist_validacao?: Json | null
          checklist_validacao_completo?: boolean | null
          condicao_pagamento?: string | null
          condicoes_pagamento?: string | null
          conta_contabil?: string | null
          contrato_vinculado?: string | null
          cotacao_id?: string | null
          cotacao_vinculada?: string | null
          created_at?: string
          criado_por?: string
          data_aprovacao?: string | null
          data_criacao?: string
          data_emissao?: string | null
          data_entrega_prevista?: string | null
          data_entrega_solicitada?: string
          data_envio_portal?: string | null
          data_resposta_fornecedor?: string | null
          deleted_at?: string | null
          descontos_acrescimos?: number | null
          empresa_id?: string
          forma_pagamento?: string | null
          fornecedor_cnpj?: string | null
          fornecedor_endereco_faturamento?: string | null
          fornecedor_id?: string
          fornecedor_razao_social?: string | null
          fornecedor_responsavel_email?: string | null
          fornecedor_responsavel_nome?: string | null
          fornecedor_status?: string | null
          historico_acoes?: Json | null
          id?: string
          impostos?: Json | null
          instrucoes_entrega?: string | null
          local_entrega?: string | null
          moeda?: string
          numero_pedido?: string
          observacoes?: string | null
          observacoes_fornecedor?: string | null
          observacoes_internas?: string | null
          ordem_servico?: string | null
          origem_demanda?: string | null
          origem_id?: string | null
          permite_edicao?: boolean | null
          permite_fracionamento?: boolean | null
          portal_pedido_id?: string | null
          prazo_maximo_atraso?: number | null
          projeto_atividade?: string | null
          requisicao_id?: string | null
          requisicao_vinculada?: string | null
          responsavel_interno_email?: string | null
          responsavel_interno_id?: string | null
          responsavel_interno_nome?: string | null
          status?: Database["public"]["Enums"]["status_pedido"]
          status_portal?: string | null
          tipo?: Database["public"]["Enums"]["tipo_pedido"]
          tipo_detalhado?: string | null
          tipo_frete?: string | null
          transportadora?: string | null
          updated_at?: string
          valor_total?: number
          versao?: number
        }
        Relationships: []
      }
      permission_overrides: {
        Row: {
          action_key: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          module_id: string
          override_value: boolean
          reason: string | null
          user_id: string
          visibility_override: string | null
        }
        Insert: {
          action_key: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          module_id: string
          override_value: boolean
          reason?: string | null
          user_id: string
          visibility_override?: string | null
        }
        Update: {
          action_key?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          module_id?: string
          override_value?: boolean
          reason?: string | null
          user_id?: string
          visibility_override?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permission_overrides_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_overrides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_admins: {
        Row: {
          created_at: string
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          level: string
          notes: string | null
          permissions: Json | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          level?: string
          notes?: string | null
          permissions?: Json | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          level?: string
          notes?: string | null
          permissions?: Json | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_interventions: {
        Row: {
          actions_taken: Json | null
          client_notified: boolean | null
          created_at: string
          id: string
          impact_level: string
          intervention_type: string
          notification_sent_at: string | null
          reason: string
          resolved_at: string | null
          super_admin_id: string
          target_user_id: string | null
          target_workspace_id: string | null
        }
        Insert: {
          actions_taken?: Json | null
          client_notified?: boolean | null
          created_at?: string
          id?: string
          impact_level?: string
          intervention_type: string
          notification_sent_at?: string | null
          reason: string
          resolved_at?: string | null
          super_admin_id: string
          target_user_id?: string | null
          target_workspace_id?: string | null
        }
        Update: {
          actions_taken?: Json | null
          client_notified?: boolean | null
          created_at?: string
          id?: string
          impact_level?: string
          intervention_type?: string
          notification_sent_at?: string | null
          reason?: string
          resolved_at?: string | null
          super_admin_id?: string
          target_user_id?: string | null
          target_workspace_id?: string | null
        }
        Relationships: []
      }
      portal_fornecedor_users: {
        Row: {
          cadastro_fornecedor_id: string | null
          created_at: string
          email: string
          id: string
          password_hash: string
          reset_token: string | null
          reset_token_expires: string | null
          status: string
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          cadastro_fornecedor_id?: string | null
          created_at?: string
          email: string
          id?: string
          password_hash: string
          reset_token?: string | null
          reset_token_expires?: string | null
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          cadastro_fornecedor_id?: string | null
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          reset_token?: string | null
          reset_token_expires?: string | null
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_fornecedor_users_cadastro_fornecedor_id_fkey"
            columns: ["cadastro_fornecedor_id"]
            isOneToOne: false
            referencedRelation: "cadastro_fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_audit: {
        Row: {
          action: string
          changed_by: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          changed_by: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changed_by?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_audit_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          area: string
          avatar_url: string | null
          cargo: string | null
          centro_custo: string | null
          configuracoes: Json | null
          created_at: string
          department: string | null
          email: string
          employee_id: string | null
          hire_date: string | null
          id: string
          job_role_id: string | null
          nome_completo: string
          primeiro_acesso: boolean | null
          status: Database["public"]["Enums"]["user_status"]
          telefone: string | null
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          area: string
          avatar_url?: string | null
          cargo?: string | null
          centro_custo?: string | null
          configuracoes?: Json | null
          created_at?: string
          department?: string | null
          email: string
          employee_id?: string | null
          hire_date?: string | null
          id: string
          job_role_id?: string | null
          nome_completo: string
          primeiro_acesso?: boolean | null
          status?: Database["public"]["Enums"]["user_status"]
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          area?: string
          avatar_url?: string | null
          cargo?: string | null
          centro_custo?: string | null
          configuracoes?: Json | null
          created_at?: string
          department?: string | null
          email?: string
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          job_role_id?: string | null
          nome_completo?: string
          primeiro_acesso?: boolean | null
          status?: Database["public"]["Enums"]["user_status"]
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos_sourcing: {
        Row: {
          codigo_projeto: string
          condicao_pagamento: string | null
          created_at: string
          criado_por: string
          data_inicio: string | null
          departamento: string
          descricao: string | null
          detalhes_pagamento: string | null
          economia_esperada: number | null
          etapa_atual: number
          gasto_base: number | null
          id: string
          modelo_rfx: string | null
          moeda: string
          nome_projeto: string
          opcao_leilao: string
          prazo_entrega: number | null
          projeto_antecessor_id: string | null
          proprietario_id: string
          regiao_compra: string
          status: string
          tipo_aquisicao: string
          tipo_evento: string
          updated_at: string
          visibilidade_prazo: boolean | null
        }
        Insert: {
          codigo_projeto: string
          condicao_pagamento?: string | null
          created_at?: string
          criado_por: string
          data_inicio?: string | null
          departamento: string
          descricao?: string | null
          detalhes_pagamento?: string | null
          economia_esperada?: number | null
          etapa_atual?: number
          gasto_base?: number | null
          id?: string
          modelo_rfx?: string | null
          moeda?: string
          nome_projeto: string
          opcao_leilao: string
          prazo_entrega?: number | null
          projeto_antecessor_id?: string | null
          proprietario_id: string
          regiao_compra: string
          status?: string
          tipo_aquisicao: string
          tipo_evento: string
          updated_at?: string
          visibilidade_prazo?: boolean | null
        }
        Update: {
          codigo_projeto?: string
          condicao_pagamento?: string | null
          created_at?: string
          criado_por?: string
          data_inicio?: string | null
          departamento?: string
          descricao?: string | null
          detalhes_pagamento?: string | null
          economia_esperada?: number | null
          etapa_atual?: number
          gasto_base?: number | null
          id?: string
          modelo_rfx?: string | null
          moeda?: string
          nome_projeto?: string
          opcao_leilao?: string
          prazo_entrega?: number | null
          projeto_antecessor_id?: string | null
          proprietario_id?: string
          regiao_compra?: string
          status?: string
          tipo_aquisicao?: string
          tipo_evento?: string
          updated_at?: string
          visibilidade_prazo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_sourcing_projeto_antecessor_id_fkey"
            columns: ["projeto_antecessor_id"]
            isOneToOne: false
            referencedRelation: "projetos_sourcing"
            referencedColumns: ["id"]
          },
        ]
      }
      protected_settings: {
        Row: {
          change_reason: string | null
          created_at: string
          id: string
          last_changed_at: string | null
          last_changed_by: string | null
          protection_level: string
          requires_confirmation: boolean | null
          requires_super_admin: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          change_reason?: string | null
          created_at?: string
          id?: string
          last_changed_at?: string | null
          last_changed_by?: string | null
          protection_level?: string
          requires_confirmation?: boolean | null
          requires_super_admin?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          change_reason?: string | null
          created_at?: string
          id?: string
          last_changed_at?: string | null
          last_changed_by?: string | null
          protection_level?: string
          requires_confirmation?: boolean | null
          requires_super_admin?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      registro_comunicado: {
        Row: {
          anexos: Json | null
          conteudo: string
          created_at: string | null
          data_leitura: string | null
          disparo_fornecedor_id: string | null
          disparo_id: string | null
          fornecedor_id: string
          id: string
          lido: boolean | null
          titulo: string
          token_leitura: string | null
        }
        Insert: {
          anexos?: Json | null
          conteudo: string
          created_at?: string | null
          data_leitura?: string | null
          disparo_fornecedor_id?: string | null
          disparo_id?: string | null
          fornecedor_id: string
          id?: string
          lido?: boolean | null
          titulo: string
          token_leitura?: string | null
        }
        Update: {
          anexos?: Json | null
          conteudo?: string
          created_at?: string | null
          data_leitura?: string | null
          disparo_fornecedor_id?: string | null
          disparo_id?: string | null
          fornecedor_id?: string
          id?: string
          lido?: boolean | null
          titulo?: string
          token_leitura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_comunicado_disparo_fornecedor_id_fkey"
            columns: ["disparo_fornecedor_id"]
            isOneToOne: false
            referencedRelation: "disparo_fornecedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_comunicado_disparo_id_fkey"
            columns: ["disparo_id"]
            isOneToOne: false
            referencedRelation: "disparo_acao_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      regras_orcamentarias: {
        Row: {
          ativo: boolean | null
          condicao_config: Json | null
          created_at: string
          created_by: string | null
          emails_notificacao: string[] | null
          id: string
          nivel_controle: string | null
          nome: string
          percentual_alerta: number | null
          permite_excecao: boolean | null
          tipo_condicao: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          condicao_config?: Json | null
          created_at?: string
          created_by?: string | null
          emails_notificacao?: string[] | null
          id?: string
          nivel_controle?: string | null
          nome: string
          percentual_alerta?: number | null
          permite_excecao?: boolean | null
          tipo_condicao: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          condicao_config?: Json | null
          created_at?: string
          created_by?: string | null
          emails_notificacao?: string[] | null
          id?: string
          nivel_controle?: string | null
          nome?: string
          percentual_alerta?: number | null
          permite_excecao?: boolean | null
          tipo_condicao?: string
          updated_at?: string
        }
        Relationships: []
      }
      relacionamentos_clientes_fornecedores: {
        Row: {
          cliente_cnpj: string | null
          cliente_codigo: string | null
          cliente_nome: string | null
          contato_id: string
          convite_id: string | null
          created_at: string
          data_aceite: string | null
          data_fim: string | null
          data_inicio: string | null
          fornecedor_id: string
          id: string
          origem: string
          status: string
          updated_at: string
        }
        Insert: {
          cliente_cnpj?: string | null
          cliente_codigo?: string | null
          cliente_nome?: string | null
          contato_id: string
          convite_id?: string | null
          created_at?: string
          data_aceite?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          fornecedor_id: string
          id?: string
          origem: string
          status?: string
          updated_at?: string
        }
        Update: {
          cliente_cnpj?: string | null
          cliente_codigo?: string | null
          cliente_nome?: string | null
          contato_id?: string
          convite_id?: string | null
          created_at?: string
          data_aceite?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          fornecedor_id?: string
          id?: string
          origem?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relacionamentos_clientes_fornecedores_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos_fornecedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relacionamentos_clientes_fornecedores_convite_id_fkey"
            columns: ["convite_id"]
            isOneToOne: false
            referencedRelation: "convites_fornecedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relacionamentos_clientes_fornecedores_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      requisicoes: {
        Row: {
          aprovador_atual_id: string | null
          aprovador_atual_nome: string | null
          centro_custo: string | null
          conta_contabil: string | null
          cotacao_id: string | null
          created_at: string
          data_aprovacao: string | null
          data_criacao: string
          data_finalizacao: string | null
          data_necessidade: string
          deleted_at: string | null
          descricao: string | null
          id: string
          justificativa: string | null
          numero_requisicao: string
          observacoes: string | null
          pedido_id: string | null
          prioridade: Database["public"]["Enums"]["prioridade_requisicao"]
          solicitante_area: string
          solicitante_id: string
          solicitante_nome: string
          status: Database["public"]["Enums"]["status_requisicao"]
          tipo: Database["public"]["Enums"]["tipo_requisicao"]
          titulo: string
          updated_at: string
          valor_aprovado: number | null
          valor_estimado: number | null
        }
        Insert: {
          aprovador_atual_id?: string | null
          aprovador_atual_nome?: string | null
          centro_custo?: string | null
          conta_contabil?: string | null
          cotacao_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_criacao?: string
          data_finalizacao?: string | null
          data_necessidade: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          justificativa?: string | null
          numero_requisicao?: string
          observacoes?: string | null
          pedido_id?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_requisicao"]
          solicitante_area: string
          solicitante_id: string
          solicitante_nome: string
          status?: Database["public"]["Enums"]["status_requisicao"]
          tipo?: Database["public"]["Enums"]["tipo_requisicao"]
          titulo: string
          updated_at?: string
          valor_aprovado?: number | null
          valor_estimado?: number | null
        }
        Update: {
          aprovador_atual_id?: string | null
          aprovador_atual_nome?: string | null
          centro_custo?: string | null
          conta_contabil?: string | null
          cotacao_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_criacao?: string
          data_finalizacao?: string | null
          data_necessidade?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          justificativa?: string | null
          numero_requisicao?: string
          observacoes?: string | null
          pedido_id?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_requisicao"]
          solicitante_area?: string
          solicitante_id?: string
          solicitante_nome?: string
          status?: Database["public"]["Enums"]["status_requisicao"]
          tipo?: Database["public"]["Enums"]["tipo_requisicao"]
          titulo?: string
          updated_at?: string
          valor_aprovado?: number | null
          valor_estimado?: number | null
        }
        Relationships: []
      }
      reserva_orcamentaria: {
        Row: {
          created_at: string
          data_confirmacao: string | null
          data_expiracao: string | null
          data_reserva: string
          id: string
          motivo_cancelamento: string | null
          orcamento_id: string | null
          requisicao_id: string | null
          status: string | null
          updated_at: string
          valor_realizado: number | null
          valor_reservado: number
        }
        Insert: {
          created_at?: string
          data_confirmacao?: string | null
          data_expiracao?: string | null
          data_reserva?: string
          id?: string
          motivo_cancelamento?: string | null
          orcamento_id?: string | null
          requisicao_id?: string | null
          status?: string | null
          updated_at?: string
          valor_realizado?: number | null
          valor_reservado: number
        }
        Update: {
          created_at?: string
          data_confirmacao?: string | null
          data_expiracao?: string | null
          data_reserva?: string
          id?: string
          motivo_cancelamento?: string | null
          orcamento_id?: string | null
          requisicao_id?: string | null
          status?: string | null
          updated_at?: string
          valor_realizado?: number | null
          valor_reservado?: number
        }
        Relationships: [
          {
            foreignKeyName: "reserva_orcamentaria_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserva_orcamentaria_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "requisicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      resposta_pesquisa_cliente: {
        Row: {
          anonimo: boolean | null
          comentarios: string | null
          created_at: string | null
          disparo_fornecedor_id: string | null
          disparo_id: string | null
          fornecedor_id: string
          id: string
          ip_resposta: unknown | null
          nota_nps: number | null
          respondido_em: string | null
          respostas: Json | null
        }
        Insert: {
          anonimo?: boolean | null
          comentarios?: string | null
          created_at?: string | null
          disparo_fornecedor_id?: string | null
          disparo_id?: string | null
          fornecedor_id: string
          id?: string
          ip_resposta?: unknown | null
          nota_nps?: number | null
          respondido_em?: string | null
          respostas?: Json | null
        }
        Update: {
          anonimo?: boolean | null
          comentarios?: string | null
          created_at?: string | null
          disparo_fornecedor_id?: string | null
          disparo_id?: string | null
          fornecedor_id?: string
          id?: string
          ip_resposta?: unknown | null
          nota_nps?: number | null
          respondido_em?: string | null
          respostas?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "resposta_pesquisa_cliente_disparo_fornecedor_id_fkey"
            columns: ["disparo_fornecedor_id"]
            isOneToOne: false
            referencedRelation: "disparo_fornecedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resposta_pesquisa_cliente_disparo_id_fkey"
            columns: ["disparo_id"]
            isOneToOne: false
            referencedRelation: "disparo_acao_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      role_templates: {
        Row: {
          created_at: string
          default_functional_permissions: Json | null
          default_visibility_scope: Json | null
          description: string | null
          id: string
          is_active: boolean
          module_type: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_functional_permissions?: Json | null
          default_visibility_scope?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean
          module_type: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_functional_permissions?: Json | null
          default_visibility_scope?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean
          module_type?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          auto_resolved: boolean | null
          created_at: string
          description: string
          details: Json | null
          id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          alert_type: string
          auto_resolved?: boolean | null
          created_at?: string
          description: string
          details?: Json | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          alert_type?: string
          auto_resolved?: boolean | null
          created_at?: string
          description?: string
          details?: Json | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: []
      }
      solicitacoes_sourcing: {
        Row: {
          auto_created_project_id: string | null
          categoria: string | null
          created_at: string
          id: string
          observacoes: string | null
          processed_at: string | null
          processed_by: string | null
          recomendacoes_fornecedores: Json | null
          requisicao_id: string
          status: string
          valor_estimado: number | null
        }
        Insert: {
          auto_created_project_id?: string | null
          categoria?: string | null
          created_at?: string
          id?: string
          observacoes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          recomendacoes_fornecedores?: Json | null
          requisicao_id: string
          status?: string
          valor_estimado?: number | null
        }
        Update: {
          auto_created_project_id?: string | null
          categoria?: string | null
          created_at?: string
          id?: string
          observacoes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          recomendacoes_fornecedores?: Json | null
          requisicao_id?: string
          status?: string
          valor_estimado?: number | null
        }
        Relationships: []
      }
      sourcing_category_rules: {
        Row: {
          categoria_codigo: string
          categoria_nome: string
          created_at: string
          criterios_padrao: string[] | null
          evento_sugerido: string | null
          id: string
          is_active: boolean
          leilao_permitido: boolean | null
          peso_comercial_sugerido: number | null
          peso_tecnico_sugerido: number | null
          prazo_maximo_dias: number | null
          prazo_minimo_dias: number | null
          setor_codigo: string | null
          updated_at: string
          validacoes_especificas: string[] | null
        }
        Insert: {
          categoria_codigo: string
          categoria_nome: string
          created_at?: string
          criterios_padrao?: string[] | null
          evento_sugerido?: string | null
          id?: string
          is_active?: boolean
          leilao_permitido?: boolean | null
          peso_comercial_sugerido?: number | null
          peso_tecnico_sugerido?: number | null
          prazo_maximo_dias?: number | null
          prazo_minimo_dias?: number | null
          setor_codigo?: string | null
          updated_at?: string
          validacoes_especificas?: string[] | null
        }
        Update: {
          categoria_codigo?: string
          categoria_nome?: string
          created_at?: string
          criterios_padrao?: string[] | null
          evento_sugerido?: string | null
          id?: string
          is_active?: boolean
          leilao_permitido?: boolean | null
          peso_comercial_sugerido?: number | null
          peso_tecnico_sugerido?: number | null
          prazo_maximo_dias?: number | null
          prazo_minimo_dias?: number | null
          setor_codigo?: string | null
          updated_at?: string
          validacoes_especificas?: string[] | null
        }
        Relationships: []
      }
      sourcing_client_policies: {
        Row: {
          aprovacao_dupla: boolean | null
          cliente_codigo: string
          cliente_nome: string
          created_at: string
          documentos_obrigatorios: string[] | null
          evento_obrigatorio: string | null
          id: string
          is_active: boolean
          leilao_proibido: boolean | null
          observacoes_politica: string | null
          peso_tecnico_minimo: number | null
          prazo_resposta_minimo: number | null
          restricoes_fornecedor: Json | null
          updated_at: string
        }
        Insert: {
          aprovacao_dupla?: boolean | null
          cliente_codigo: string
          cliente_nome: string
          created_at?: string
          documentos_obrigatorios?: string[] | null
          evento_obrigatorio?: string | null
          id?: string
          is_active?: boolean
          leilao_proibido?: boolean | null
          observacoes_politica?: string | null
          peso_tecnico_minimo?: number | null
          prazo_resposta_minimo?: number | null
          restricoes_fornecedor?: Json | null
          updated_at?: string
        }
        Update: {
          aprovacao_dupla?: boolean | null
          cliente_codigo?: string
          cliente_nome?: string
          created_at?: string
          documentos_obrigatorios?: string[] | null
          evento_obrigatorio?: string | null
          id?: string
          is_active?: boolean
          leilao_proibido?: boolean | null
          observacoes_politica?: string | null
          peso_tecnico_minimo?: number | null
          prazo_resposta_minimo?: number | null
          restricoes_fornecedor?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      sourcing_department_templates: {
        Row: {
          categorias_permitidas: string[] | null
          configuracao_padrao: Json | null
          created_at: string
          departamento_codigo: string
          departamento_nome: string
          id: string
          is_active: boolean
          limite_valor_aprovacao: number | null
          requer_multiplas_cotacoes: boolean | null
          responsavel_email: string | null
          responsavel_nome: string | null
          setores_permitidos: string[] | null
          updated_at: string
        }
        Insert: {
          categorias_permitidas?: string[] | null
          configuracao_padrao?: Json | null
          created_at?: string
          departamento_codigo: string
          departamento_nome: string
          id?: string
          is_active?: boolean
          limite_valor_aprovacao?: number | null
          requer_multiplas_cotacoes?: boolean | null
          responsavel_email?: string | null
          responsavel_nome?: string | null
          setores_permitidos?: string[] | null
          updated_at?: string
        }
        Update: {
          categorias_permitidas?: string[] | null
          configuracao_padrao?: Json | null
          created_at?: string
          departamento_codigo?: string
          departamento_nome?: string
          id?: string
          is_active?: boolean
          limite_valor_aprovacao?: number | null
          requer_multiplas_cotacoes?: boolean | null
          responsavel_email?: string | null
          responsavel_nome?: string | null
          setores_permitidos?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      sourcing_event_configurations: {
        Row: {
          campos_obrigatorios: string[] | null
          campos_opcionais: string[] | null
          cor_tema: string | null
          created_at: string
          descricao: string | null
          icone: string | null
          id: string
          is_active: boolean
          nome_exibicao: string
          ordem_exibicao: number | null
          permite_leilao: boolean | null
          peso_comercial_padrao: number | null
          peso_tecnico_padrao: number | null
          prazo_padrao_dias: number | null
          tipo_evento: string
          tooltip_info: string | null
          updated_at: string
        }
        Insert: {
          campos_obrigatorios?: string[] | null
          campos_opcionais?: string[] | null
          cor_tema?: string | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          is_active?: boolean
          nome_exibicao: string
          ordem_exibicao?: number | null
          permite_leilao?: boolean | null
          peso_comercial_padrao?: number | null
          peso_tecnico_padrao?: number | null
          prazo_padrao_dias?: number | null
          tipo_evento: string
          tooltip_info?: string | null
          updated_at?: string
        }
        Update: {
          campos_obrigatorios?: string[] | null
          campos_opcionais?: string[] | null
          cor_tema?: string | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          is_active?: boolean
          nome_exibicao?: string
          ordem_exibicao?: number | null
          permite_leilao?: boolean | null
          peso_comercial_padrao?: number | null
          peso_tecnico_padrao?: number | null
          prazo_padrao_dias?: number | null
          tipo_evento?: string
          tooltip_info?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sourcing_sector_rules: {
        Row: {
          aprovacao_obrigatoria: boolean | null
          campos_obrigatorios: string[] | null
          campos_ocultos: string[] | null
          created_at: string
          evento_padrao: string
          id: string
          is_active: boolean
          leilao_habilitado: boolean
          observacoes: string | null
          peso_comercial_minimo: number | null
          peso_tecnico_minimo: number | null
          setor_codigo: string
          setor_nome: string
          updated_at: string
          valor_minimo_aprovacao: number | null
        }
        Insert: {
          aprovacao_obrigatoria?: boolean | null
          campos_obrigatorios?: string[] | null
          campos_ocultos?: string[] | null
          created_at?: string
          evento_padrao?: string
          id?: string
          is_active?: boolean
          leilao_habilitado?: boolean
          observacoes?: string | null
          peso_comercial_minimo?: number | null
          peso_tecnico_minimo?: number | null
          setor_codigo: string
          setor_nome: string
          updated_at?: string
          valor_minimo_aprovacao?: number | null
        }
        Update: {
          aprovacao_obrigatoria?: boolean | null
          campos_obrigatorios?: string[] | null
          campos_ocultos?: string[] | null
          created_at?: string
          evento_padrao?: string
          id?: string
          is_active?: boolean
          leilao_habilitado?: boolean
          observacoes?: string | null
          peso_comercial_minimo?: number | null
          peso_tecnico_minimo?: number | null
          setor_codigo?: string
          setor_nome?: string
          updated_at?: string
          valor_minimo_aprovacao?: number | null
        }
        Relationships: []
      }
      template_acao_lote: {
        Row: {
          campos_formulario: Json | null
          categoria: string | null
          configuracoes: Json | null
          conteudo_texto: string | null
          created_at: string | null
          created_by: string | null
          finalidade: string
          id: string
          is_ativo: boolean | null
          nome: string
          permite_anonimato: boolean | null
          tipo_acao: string
          updated_at: string | null
          validade_dias: number | null
        }
        Insert: {
          campos_formulario?: Json | null
          categoria?: string | null
          configuracoes?: Json | null
          conteudo_texto?: string | null
          created_at?: string | null
          created_by?: string | null
          finalidade: string
          id?: string
          is_ativo?: boolean | null
          nome: string
          permite_anonimato?: boolean | null
          tipo_acao: string
          updated_at?: string | null
          validade_dias?: number | null
        }
        Update: {
          campos_formulario?: Json | null
          categoria?: string | null
          configuracoes?: Json | null
          conteudo_texto?: string | null
          created_at?: string | null
          created_by?: string | null
          finalidade?: string
          id?: string
          is_ativo?: boolean | null
          nome?: string
          permite_anonimato?: boolean | null
          tipo_acao?: string
          updated_at?: string | null
          validade_dias?: number | null
        }
        Relationships: []
      }
      unidades_operacionais: {
        Row: {
          ativa: boolean | null
          bairro: string
          cep: string
          cidade: string
          codigo_interno: string | null
          complemento: string | null
          created_at: string
          email: string | null
          estado: string
          fornecedor_id: string
          id: string
          logradouro: string
          nome_unidade: string | null
          numero: string
          pais: string
          principal: boolean | null
          responsavel: string | null
          telefone: string | null
          tipo_unidade: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          bairro: string
          cep: string
          cidade: string
          codigo_interno?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          estado: string
          fornecedor_id: string
          id?: string
          logradouro: string
          nome_unidade?: string | null
          numero: string
          pais?: string
          principal?: boolean | null
          responsavel?: string | null
          telefone?: string | null
          tipo_unidade?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          bairro?: string
          cep?: string
          cidade?: string
          codigo_interno?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          estado?: string
          fornecedor_id?: string
          id?: string
          logradouro?: string
          nome_unidade?: string | null
          numero?: string
          pais?: string
          principal?: boolean | null
          responsavel?: string | null
          telefone?: string | null
          tipo_unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidades_operacionais_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      user_import_logs: {
        Row: {
          created_at: string
          errors: Json | null
          failed_imports: number
          filename: string
          id: string
          import_data: Json | null
          imported_by: string
          successful_imports: number
          total_rows: number
        }
        Insert: {
          created_at?: string
          errors?: Json | null
          failed_imports: number
          filename: string
          id?: string
          import_data?: Json | null
          imported_by: string
          successful_imports: number
          total_rows: number
        }
        Update: {
          created_at?: string
          errors?: Json | null
          failed_imports?: number
          filename?: string
          id?: string
          import_data?: Json | null
          imported_by?: string
          successful_imports?: number
          total_rows?: number
        }
        Relationships: []
      }
      user_invites: {
        Row: {
          area: string
          cargo: string | null
          created_at: string
          data_aceite: string | null
          data_envio: string
          data_expiracao: string
          email: string
          enviado_por: string | null
          id: string
          mensagem_personalizada: string | null
          nome_completo: string
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          area: string
          cargo?: string | null
          created_at?: string
          data_aceite?: string | null
          data_envio?: string
          data_expiracao?: string
          email: string
          enviado_por?: string | null
          id?: string
          mensagem_personalizada?: string | null
          nome_completo: string
          status?: string
          token?: string
          updated_at?: string
        }
        Update: {
          area?: string
          cargo?: string | null
          created_at?: string
          data_aceite?: string | null
          data_envio?: string
          data_expiracao?: string
          email?: string
          enviado_por?: string | null
          id?: string
          mensagem_personalizada?: string | null
          nome_completo?: string
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          area_especifica: string | null
          centro_custo_especifico: string | null
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string
          delegado_para: string | null
          id: string
          is_active: boolean
          limite_aprovacao: number | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          area_especifica?: string | null
          centro_custo_especifico?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          delegado_para?: string | null
          id?: string
          is_active?: boolean
          limite_aprovacao?: number | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          area_especifica?: string | null
          centro_custo_especifico?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          delegado_para?: string | null
          id?: string
          is_active?: boolean
          limite_aprovacao?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_delegado_para_fkey"
            columns: ["delegado_para"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          config: Json | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_default: boolean
          module_id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          module_id: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          module_id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_business_rules: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          configured_at: string
          configured_by: string | null
          created_at: string
          custom_value: Json | null
          id: string
          is_enabled: boolean
          notes: string | null
          rule_template_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          configured_at?: string
          configured_by?: string | null
          created_at?: string
          custom_value?: Json | null
          id?: string
          is_enabled?: boolean
          notes?: string | null
          rule_template_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          configured_at?: string
          configured_by?: string | null
          created_at?: string
          custom_value?: Json | null
          id?: string
          is_enabled?: boolean
          notes?: string | null
          rule_template_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_business_rules_rule_template_id_fkey"
            columns: ["rule_template_id"]
            isOneToOne: false
            referencedRelation: "business_rule_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_business_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "module_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      alterar_status_pedido: {
        Args: {
          p_pedido_id: string
          p_novo_status: Database["public"]["Enums"]["status_pedido"]
          p_usuario_id: string
          p_usuario_nome: string
          p_justificativa?: string
        }
        Returns: Json
      }
      apply_job_role_permissions: {
        Args: { user_id: string; job_role_id: string }
        Returns: undefined
      }
      apply_role_template: {
        Args: {
          _user_id: string
          _module_id: string
          _template_id: string
          _category_access?: string[]
          _unit_access?: string[]
        }
        Returns: undefined
      }
      can_change_setting: {
        Args: { p_setting_key: string; p_user_id?: string }
        Returns: boolean
      }
      create_budget_reservation: {
        Args: {
          p_requisicao_id: string
          p_centro_custo: string
          p_valor_reservado: number
          p_categoria?: string
          p_projeto?: string
        }
        Returns: string
      }
      create_portal_user: {
        Args: { p_cadastro_id: string; p_email: string; p_password: string }
        Returns: string
      }
      criar_po_automatico: {
        Args: {
          p_origem: string
          p_origem_id: string
          p_fornecedor_id?: string
          p_fornecedor_cnpj?: string
          p_fornecedor_nome?: string
          p_solicitante_id?: string
          p_centro_custo?: string
          p_projeto?: string
          p_data_entrega_prevista?: string
          p_itens?: Json
          p_observacoes?: string
        }
        Returns: string
      }
      criar_po_manual: {
        Args: { p_dados_pedido: Json; p_itens: Json; p_usuario_id: string }
        Returns: string
      }
      get_effective_permissions: {
        Args: { user_id: string; module_id: string }
        Returns: Json
      }
      get_user_profile: {
        Args: { _user_id?: string }
        Returns: {
          id: string
          nome_completo: string
          email: string
          area: string
          cargo: string
          centro_custo: string
          telefone: string
          avatar_url: string
          status: Database["public"]["Enums"]["user_status"]
          roles: Database["public"]["Enums"]["app_role"][]
          pode_aprovar_nivel_1: boolean
          pode_aprovar_nivel_2: boolean
          limite_aprovacao: number
          pode_criar_requisicoes: boolean
          pode_ver_todos: boolean
        }[]
      }
      get_visibility_scope: {
        Args: { _user_id: string; _module_id: string; _context: string }
        Returns: string
      }
      has_functional_permission: {
        Args: { _user_id: string; _module_id: string; _action: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      register_audit_event: {
        Args: {
          p_event_type: string
          p_action: string
          p_user_id: string
          p_user_type: string
          p_workspace_id?: string
          p_module_id?: string
          p_target_table?: string
          p_target_id?: string
          p_old_data?: Json
          p_new_data?: Json
          p_risk_level?: string
        }
        Returns: string
      }
      registrar_acao_pedido: {
        Args: {
          pedido_id_param: string
          acao: string
          usuario_id_param: string
          usuario_nome: string
          detalhes?: string
        }
        Returns: undefined
      }
      should_apply_budget_control: {
        Args: {
          p_tipo_requisicao: Database["public"]["Enums"]["tipo_requisicao"]
          p_valor_estimado: number
          p_centro_custo: string
          p_categoria?: string
        }
        Returns: boolean
      }
      validar_pedido_para_envio: {
        Args: { pedido_id_param: string }
        Returns: Json
      }
      validate_portal_login: {
        Args: { p_email: string; p_password: string }
        Returns: {
          user_id: string
          cadastro_id: string
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "gestor"
        | "aprovador_nivel_1"
        | "aprovador_nivel_2"
        | "solicitante"
      functional_action:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "approve"
        | "reject"
        | "view_supplier_xray"
        | "suspend_supplier"
        | "approve_supplier"
        | "edit_supplier_data"
        | "invite_supplier"
        | "evaluate_supplier"
        | "qualify_supplier"
        | "create_requisition"
        | "view_all_requisitions"
        | "view_unit_requisitions"
        | "approve_requisition_l1"
        | "approve_requisition_l2"
        | "cancel_requisition"
        | "create_quotation"
        | "send_to_suppliers"
        | "track_responses"
        | "edit_quotation"
        | "cancel_quotation"
        | "resubmit_quotation"
        | "create_order"
        | "approve_order"
        | "send_to_portal"
        | "track_order"
        | "cancel_order"
        | "edit_order"
        | "view_global_dashboard"
        | "view_unit_dashboard"
        | "view_category_dashboard"
        | "export_reports"
        | "view_analytics"
      prioridade_acao: "alta" | "media" | "baixa"
      prioridade_requisicao: "baixa" | "media" | "alta" | "urgente"
      status_aprovacao: "pendente" | "aprovado" | "rejeitado" | "expirado"
      status_aprovacao_req: "pendente" | "aprovada" | "rejeitada" | "delegada"
      status_integracao:
        | "pendente"
        | "enviando"
        | "sucesso"
        | "erro"
        | "timeout"
      status_pedido:
        | "rascunho"
        | "aguardando_aprovacao"
        | "aprovado"
        | "rejeitado"
        | "enviado"
        | "visualizado"
        | "questionado"
        | "confirmado"
        | "alteracao_solicitada"
        | "cancelado"
        | "finalizado"
      status_requisicao:
        | "rascunho"
        | "enviada"
        | "em_aprovacao"
        | "aprovada"
        | "rejeitada"
        | "em_cotacao"
        | "cotacao_recebida"
        | "finalizada"
        | "cancelada"
      tipo_acao_recomendada:
        | "documento_vencendo"
        | "documento_vencido"
        | "avaliacao_pendente"
        | "fornecedor_inativo"
        | "desempenho_baixo"
        | "promover_preferencial"
        | "reavaliar_qualificacao"
        | "solicitar_atualizacao"
      tipo_aprovacao: "individual" | "comite" | "paralelo"
      tipo_operacao_portal:
        | "envio_pedido"
        | "webhook_resposta"
        | "sincronizacao"
        | "reenvio"
      tipo_pedido: "material" | "servico" | "misto"
      tipo_requisicao:
        | "material"
        | "servico"
        | "equipamento"
        | "software"
        | "infraestrutura"
        | "outros"
      tipo_resposta_portal: "aceitar" | "questionar" | "alterar" | "recusar"
      user_status: "ativo" | "inativo" | "pendente_ativacao"
      visibility_scope:
        | "own_only"
        | "unit_only"
        | "category_only"
        | "area_only"
        | "all"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "gestor",
        "aprovador_nivel_1",
        "aprovador_nivel_2",
        "solicitante",
      ],
      functional_action: [
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "reject",
        "view_supplier_xray",
        "suspend_supplier",
        "approve_supplier",
        "edit_supplier_data",
        "invite_supplier",
        "evaluate_supplier",
        "qualify_supplier",
        "create_requisition",
        "view_all_requisitions",
        "view_unit_requisitions",
        "approve_requisition_l1",
        "approve_requisition_l2",
        "cancel_requisition",
        "create_quotation",
        "send_to_suppliers",
        "track_responses",
        "edit_quotation",
        "cancel_quotation",
        "resubmit_quotation",
        "create_order",
        "approve_order",
        "send_to_portal",
        "track_order",
        "cancel_order",
        "edit_order",
        "view_global_dashboard",
        "view_unit_dashboard",
        "view_category_dashboard",
        "export_reports",
        "view_analytics",
      ],
      prioridade_acao: ["alta", "media", "baixa"],
      prioridade_requisicao: ["baixa", "media", "alta", "urgente"],
      status_aprovacao: ["pendente", "aprovado", "rejeitado", "expirado"],
      status_aprovacao_req: ["pendente", "aprovada", "rejeitada", "delegada"],
      status_integracao: ["pendente", "enviando", "sucesso", "erro", "timeout"],
      status_pedido: [
        "rascunho",
        "aguardando_aprovacao",
        "aprovado",
        "rejeitado",
        "enviado",
        "visualizado",
        "questionado",
        "confirmado",
        "alteracao_solicitada",
        "cancelado",
        "finalizado",
      ],
      status_requisicao: [
        "rascunho",
        "enviada",
        "em_aprovacao",
        "aprovada",
        "rejeitada",
        "em_cotacao",
        "cotacao_recebida",
        "finalizada",
        "cancelada",
      ],
      tipo_acao_recomendada: [
        "documento_vencendo",
        "documento_vencido",
        "avaliacao_pendente",
        "fornecedor_inativo",
        "desempenho_baixo",
        "promover_preferencial",
        "reavaliar_qualificacao",
        "solicitar_atualizacao",
      ],
      tipo_aprovacao: ["individual", "comite", "paralelo"],
      tipo_operacao_portal: [
        "envio_pedido",
        "webhook_resposta",
        "sincronizacao",
        "reenvio",
      ],
      tipo_pedido: ["material", "servico", "misto"],
      tipo_requisicao: [
        "material",
        "servico",
        "equipamento",
        "software",
        "infraestrutura",
        "outros",
      ],
      tipo_resposta_portal: ["aceitar", "questionar", "alterar", "recusar"],
      user_status: ["ativo", "inativo", "pendente_ativacao"],
      visibility_scope: [
        "own_only",
        "unit_only",
        "category_only",
        "area_only",
        "all",
      ],
    },
  },
} as const
