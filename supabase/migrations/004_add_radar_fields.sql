-- Campos para integração PAA/Radar Jurídico
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS origem              TEXT DEFAULT 'rss',
  ADD COLUMN IF NOT EXISTS tags               TEXT[],
  ADD COLUMN IF NOT EXISTS destaque           BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS comentario_editorial TEXT,
  ADD COLUMN IF NOT EXISTS status_fonte       TEXT DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS status_etica       TEXT DEFAULT 'pendente';

-- Índice para filtrar por origem no admin
CREATE INDEX IF NOT EXISTS idx_articles_origem ON articles(origem);

-- Índice para destaques
CREATE INDEX IF NOT EXISTS idx_articles_destaque ON articles(destaque) WHERE destaque = TRUE;

COMMENT ON COLUMN articles.origem IS 'rss | paa_radar | manual';
COMMENT ON COLUMN articles.status_fonte IS 'pendente | aprovado | reprovado | nao_aplicavel';
COMMENT ON COLUMN articles.status_etica IS 'pendente | aprovado | reprovado | nao_aplicavel';
COMMENT ON COLUMN articles.comentario_editorial IS 'Comentário editorial dos agentes PAA — visível apenas no painel admin.';
