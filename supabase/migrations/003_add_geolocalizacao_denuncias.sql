-- Adiciona coordenadas geográficas à tabela denuncias
ALTER TABLE denuncias
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Bucket de anexos de denúncias (crie manualmente no Supabase Dashboard:
--   Storage → New bucket → "denuncias-anexos" → Public: false)
-- RLS do bucket: apenas admin/editor podem ler; qualquer um pode inserir.
