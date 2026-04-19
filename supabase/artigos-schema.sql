-- ============================================================================
-- SCHEMA: PAINEL EDITORIAL - RADAR JURÍDICO
-- ============================================================================
-- Tabelas para gerenciar notícias jurídicas, análises e publicações
-- Data: 2026-04-14
-- ============================================================================

-- 1. CATEGORIAS DE DIREITO
CREATE TABLE IF NOT EXISTS categorias (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT DEFAULT '#E8941F',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. FONTES RSS / SITES MONITORADOS
CREATE TABLE IF NOT EXISTS fontes_rss (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  tipo TEXT DEFAULT 'rss', -- 'rss' | 'web' (para web scraping)
  categoria_id BIGINT REFERENCES categorias(id),
  ativo BOOLEAN DEFAULT true,
  ultima_busca TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ARTIGOS (notícias + análises)
CREATE TABLE IF NOT EXISTS artigos (
  id BIGSERIAL PRIMARY KEY,

  -- DADOS BÁSICOS
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT, -- resumo/abstract
  conteudo TEXT, -- conteúdo completo
  categoria_id BIGINT REFERENCES categorias(id),

  -- FONTE ORIGINAL
  fonte_nome TEXT, -- ex: "STJ", "Conjur", "Agro Link"
  fonte_url TEXT, -- URL original da notícia
  fonte_id BIGINT REFERENCES fontes_rss(id),

  -- ANÁLISE JURÍDICA
  analise_texto TEXT, -- texto da análise gerada pela skill
  analise_gerada_em TIMESTAMP, -- quando a análise foi gerada
  analise_editada_manualmente BOOLEAN DEFAULT false,

  -- STATUS DO EDITORIAL
  status TEXT DEFAULT 'pendente', -- 'pendente' | 'aprovado' | 'rejeitado' | 'publicado'
  motivo_rejeicao TEXT, -- por que foi rejeitado

  -- PUBLICAÇÃO
  data_publicacao TIMESTAMP, -- quando foi publicado
  data_expiracao TIMESTAMP, -- opcional: quando deixa de ser exibido
  views_count INTEGER DEFAULT 0,

  -- METADADOS
  tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- tags adicionais
  autor_original TEXT, -- quem escreveu a notícia original
  imagem_url TEXT, -- imagem de capa

  -- AUDITORIA
  criado_por UUID REFERENCES auth.users(id),
  editado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. HISTÓRICO DE ANÁLISES (para rastrear mudanças)
CREATE TABLE IF NOT EXISTS artigos_analise_historico (
  id BIGSERIAL PRIMARY KEY,
  artigo_id BIGINT REFERENCES artigos(id) ON DELETE CASCADE,

  analise_anterior TEXT,
  analise_nova TEXT,
  motivo_edicao TEXT,

  editado_por UUID REFERENCES auth.users(id),
  editado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. APROVAÇÕES E REJEIÇÕES
CREATE TABLE IF NOT EXISTS artigos_acoes (
  id BIGSERIAL PRIMARY KEY,
  artigo_id BIGINT REFERENCES artigos(id) ON DELETE CASCADE,

  acao TEXT NOT NULL, -- 'aprovado' | 'rejeitado' | 'editado' | 'publicado'
  comentario TEXT,
  dados_adicionais JSONB, -- pode guardar qualquer dado relevante

  realizado_por UUID REFERENCES auth.users(id),
  realizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX idx_artigos_status ON artigos(status);
CREATE INDEX idx_artigos_categoria ON artigos(categoria_id);
CREATE INDEX idx_artigos_fonte ON artigos(fonte_id);
CREATE INDEX idx_artigos_data_criacao ON artigos(criado_em DESC);
CREATE INDEX idx_artigos_data_publicacao ON artigos(data_publicacao DESC);
CREATE INDEX idx_artigos_slug ON artigos(slug);

CREATE INDEX idx_fontes_categoria ON fontes_rss(categoria_id);
CREATE INDEX idx_fontes_ativo ON fontes_rss(ativo);

CREATE INDEX idx_acoes_artigo ON artigos_acoes(artigo_id);
CREATE INDEX idx_acoes_usuario ON artigos_acoes(realizado_por);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE artigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE artigos_acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE artigos_analise_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE fontes_rss ENABLE ROW LEVEL SECURITY;

-- ARTIGOS: Admin vê todos; Editor vê todos; Público vê apenas publicados
CREATE POLICY "artigos_admin_full" ON artigos
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "artigos_editor_gerenciar" ON artigos
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'editor'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'editor'
    )
  );

CREATE POLICY "artigos_public_ver_publicados" ON artigos
  FOR SELECT USING (status = 'publicado' OR auth.uid() IS NULL);

-- ACOES: Apenas admin/editor vê; apenas quem criou pode ver suas ações
CREATE POLICY "acoes_admin_editor_full" ON artigos_acoes
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'editor')
    )
  );

-- ANÁLISE HISTÓRICO: Apenas admin/editor
CREATE POLICY "historico_admin_editor_full" ON artigos_analise_historico
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'editor')
    )
  );

-- ============================================================================
-- DADOS INICIAIS: CATEGORIAS
-- ============================================================================

INSERT INTO categorias (slug, nome, descricao, cor) VALUES
  ('direito-agrario', 'Direito Agrário', 'Notícias sobre direito agrário, agronegócio, terras rurais', '#8B7355'),
  ('direito-civil', 'Direito Civil', 'Notícias sobre direito civil, contratos, propriedade', '#4A6B8A'),
  ('direito-trabalhista', 'Direito Trabalhista', 'Notícias sobre direito do trabalho, NR-31, conformidade rural', '#6B4A8A'),
  ('direito-familia', 'Direito de Família', 'Notícias sobre família, sucessão, guarda', '#8A6B4A'),
  ('direito-animal', 'Direito Animal', 'Notícias sobre proteção animal, maus-tratos, direitos', '#2D6A4F'),
  ('direito-geral', 'Direito Geral', 'Notícias gerais de direito e legislação', '#666666')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- DADOS INICIAIS: FONTES RSS
-- ============================================================================

INSERT INTO fontes_rss (nome, url, tipo, categoria_id, ativo) VALUES
  -- Tribunais
  ('Superior Tribunal de Justiça', 'https://www.stj.jus.br/sites/rss/RssTitulos', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-geral'), true),
  ('Supremo Tribunal Federal', 'https://www.stf.jus.br/rss/rss.xml', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-geral'), true),
  ('Tribunal Superior do Trabalho', 'https://www.tst.jus.br/', 'web',
    (SELECT id FROM categorias WHERE slug = 'direito-trabalhista'), true),

  -- Portais Jurídicos Gerais
  ('Conjur', 'https://www.conjur.com.br/feed.xml', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-geral'), true),
  ('Migalhas', 'https://www.migalhas.com.br/feed', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-geral'), true),

  -- Especializadas em Direito Agrário
  ('Direito Rural', 'https://direitorural.com.br/feed/', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-agrario'), true),
  ('Direito Agrário', 'https://direitoagrario.com/feed/', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-agrario'), true),
  ('Direito News', 'https://www.direitonews.com.br/feed', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-geral'), true),
  ('A Modireito', 'https://www.amodireito.com.br/feed', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-geral'), true),

  -- Agronegócio
  ('CNA Brasil', 'https://www.cnabrasil.org.br/feed', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-agrario'), true),
  ('The Agribiz', 'https://www.theagribiz.com/feed', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-agrario'), true),
  ('Agrolink', 'https://www.agrolink.com.br/rss.xml', 'rss',
    (SELECT id FROM categorias WHERE slug = 'direito-agrario'), true)
ON CONFLICT (url) DO NOTHING;

-- ============================================================================
-- VIEWS E FUNÇÕES AUXILIARES
-- ============================================================================

-- VIEW: Artigos pendentes com contagem
CREATE OR REPLACE VIEW artigos_pendentes AS
SELECT
  a.id,
  a.titulo,
  a.fonte_nome,
  a.categoria_id,
  c.nome as categoria_nome,
  a.descricao,
  a.criado_em,
  COUNT(*) OVER () as total_pendentes
FROM artigos a
LEFT JOIN categorias c ON a.categoria_id = c.id
WHERE a.status = 'pendente'
ORDER BY a.criado_em DESC;

-- FUNÇÃO: Atualizar slug automaticamente
CREATE OR REPLACE FUNCTION gerar_slug(titulo TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(titulo, '[^\w\s-]', ''),
      '\s+',
      '-',
      'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- FUNÇÃO: Log de ação automático
CREATE OR REPLACE FUNCTION registrar_acao()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO artigos_acoes (artigo_id, acao, realizado_por, realizado_em)
    VALUES (NEW.id, NEW.status, auth.uid(), CURRENT_TIMESTAMP);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Registra mudanças de status
CREATE TRIGGER trigger_registrar_acao
AFTER UPDATE ON artigos
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION registrar_acao();

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

COMMENT ON TABLE artigos IS 'Tabela principal: notícias jurídicas com análises e status editorial';
COMMENT ON TABLE fontes_rss IS 'Fontes de notícias monitoradas (RSS + web scraping)';
COMMENT ON TABLE categorias IS 'Categorias de direito para organização das notícias';
