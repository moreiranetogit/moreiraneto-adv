-- Adiciona colunas de análise jurídica à tabela articles
-- Executar no Supabase SQL Editor antes de deployar

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS analise_texto TEXT,
  ADD COLUMN IF NOT EXISTS analise_editada_manualmente BOOLEAN NOT NULL DEFAULT FALSE;
