-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRAÇÃO: Tabela de Interesses de Adoção
-- ═══════════════════════════════════════════════════════════════════════════
-- Registra quando alguém manifesta interesse em adotar um animal
-- Envia mensagem automática para WhatsApp da Fátima (presidente AMAA)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS interesses_adocao (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- ANIMAL
  animal_id         UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  animal_nome       TEXT NOT NULL,  -- snapshot do nome do animal no momento

  -- INTERESSADO
  nome              TEXT NOT NULL,
  cpf               TEXT NOT NULL,

  -- RASTREAMENTO
  mensagem_enviada  BOOLEAN NOT NULL DEFAULT FALSE,
  enviado_para_fatima TIMESTAMPTZ,
  id_mensagem_whatsapp TEXT,  -- ID da mensagem enviada (para rastreamento)

  -- STATUS
  status            TEXT NOT NULL DEFAULT 'pendente',  -- pendente | confirmado | rejeitado | adotado
  observacoes       TEXT,

  -- AUDITORIA
  ip_address        TEXT,
  user_agent        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_interesses_animal_id ON interesses_adocao(animal_id);
CREATE INDEX idx_interesses_status ON interesses_adocao(status);
CREATE INDEX idx_interesses_created_at ON interesses_adocao(created_at DESC);
CREATE INDEX idx_interesses_cpf ON interesses_adocao(cpf);

-- TRIGGER: atualiza updated_at
CREATE TRIGGER interesses_adocao_updated_at
  BEFORE UPDATE ON interesses_adocao
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE interesses_adocao ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode inserir um interesse (sem autenticação necessária)
CREATE POLICY "Público pode registrar interesse de adoção"
  ON interesses_adocao FOR INSERT WITH CHECK (TRUE);

-- Admin e editor podem visualizar todos os interesses
CREATE POLICY "Admin e editor veem interesses"
  ON interesses_adocao FOR SELECT USING (
    current_user_role() IN ('admin', 'editor')
  );

-- Admin e editor podem atualizar interesses (status, observações)
CREATE POLICY "Admin e editor atualizam interesses"
  ON interesses_adocao FOR UPDATE USING (
    current_user_role() IN ('admin', 'editor')
  );

-- Admin pode deletar interesses (limpeza de dados)
CREATE POLICY "Admin deleta interesses"
  ON interesses_adocao FOR DELETE USING (
    current_user_role() = 'admin'
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- COMENTÁRIOS
-- ═══════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE interesses_adocao IS
  'Registro de pessoas interessadas em adotar animais. Quando alguém preenche o formulário, um WhatsApp é disparado para a presidente da AMAA (Fátima).';

COMMENT ON COLUMN interesses_adocao.cpf IS
  'CPF do interessado em adoção — usado para afastar curiosos e pessoas mal intencionadas.';

COMMENT ON COLUMN interesses_adocao.mensagem_enviada IS
  'Flag indicando se a mensagem de WhatsApp foi enviada com sucesso para Fátima.';

COMMENT ON COLUMN interesses_adocao.id_mensagem_whatsapp IS
  'ID da mensagem enviada via WhatsApp (para rastreamento e possível retry se falhar).';

COMMENT ON COLUMN interesses_adocao.animal_nome IS
  'Snapshot do nome do animal no momento da adoção — preserva histórico mesmo se animal for renomeado.';
