-- ═══════════════════════════════════════════════════════════════════════════
-- SCHEMA — moreiraneto.adv.br
-- Executar no Supabase SQL Editor: supabase.com → seu projeto → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ── EXTENSÕES ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── ENUM: ROLES ─────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'voluntaria_amaa');

-- ── ENUM: STATUS DE ARTIGO ──────────────────────────────────────────────────
CREATE TYPE article_status AS ENUM ('pending', 'published', 'rejected');

-- ── ENUM: STATUS DE ANIMAL ──────────────────────────────────────────────────
CREATE TYPE animal_status AS ENUM ('pending', 'published', 'adopted', 'rejected');

-- ── ENUM: STATUS DE DENÚNCIA ────────────────────────────────────────────────
CREATE TYPE denuncia_status AS ENUM ('nova', 'em_apuracao', 'encerrada');

-- ── ENUM: CATEGORIAS DO PORTAL ──────────────────────────────────────────────
CREATE TYPE article_category AS ENUM (
  'agrario',
  'civil',
  'trabalhista',
  'familia',
  'animal',
  'advocacia',
  'oab'
);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELA: profiles (estende auth.users do Supabase)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        user_role NOT NULL DEFAULT 'voluntaria_amaa',
  avatar_url  TEXT,
  phone       TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: cria profile automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'voluntaria_amaa')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: atualiza updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELA: rss_sources
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE rss_sources (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  url          TEXT NOT NULL UNIQUE,
  site_url     TEXT,
  category     article_category NOT NULL,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_fetched TIMESTAMPTZ,
  fetch_count  INTEGER NOT NULL DEFAULT 0,
  error_count  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELA: articles
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE articles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE,
  excerpt      TEXT,
  content      TEXT,
  category     article_category NOT NULL,
  image_url    TEXT,
  source_url   TEXT,
  source_name  TEXT,
  rss_source_id UUID REFERENCES rss_sources(id) ON DELETE SET NULL,
  author_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status       article_status NOT NULL DEFAULT 'pending',
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  read_count   INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX articles_category_idx  ON articles(category);
CREATE INDEX articles_status_idx    ON articles(status);
CREATE INDEX articles_published_idx ON articles(published_at DESC) WHERE status = 'published';
CREATE INDEX articles_slug_idx      ON articles(slug);

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Gera slug automaticamente a partir do título
CREATE OR REPLACE FUNCTION generate_article_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Simplificação do título para slug
    base_slug := LOWER(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          TRANSLATE(NEW.title,
            'áàãâäéèêëíìîïóòõôöúùûüçñÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇÑ',
            'aaaaaaeeeeiiiiooooouuuucnAAAAAAAAEEEEIIIIOOOOOUUUUCN'
          ),
        '[^a-z0-9\s-]', '', 'g'),
      '\s+', '-', 'g')
    );
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM articles WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_slug
  BEFORE INSERT OR UPDATE OF title ON articles
  FOR EACH ROW EXECUTE FUNCTION generate_article_slug();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELA: animals (AMAA — cadastro para adoção)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE animals (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome             TEXT NOT NULL,
  especie          TEXT NOT NULL,  -- cachorro | gato | coelho | ave | outro
  raca             TEXT,
  sexo             TEXT NOT NULL,  -- macho | femea
  porte            TEXT NOT NULL,  -- mini | pequeno | medio | grande | gigante
  idade_categoria  TEXT NOT NULL,  -- filhote | jovem | adulto | senior
  situacao         TEXT NOT NULL DEFAULT 'lar-temporario', -- lar-temporario | abrigo-amaa | rua
  temperamento     TEXT[],         -- array de chips selecionados
  convivencia      TEXT[],
  comportamento    TEXT,
  -- Saúde
  castrado         TEXT NOT NULL DEFAULT 'pendente', -- sim | nao | pendente
  vacinado         TEXT NOT NULL DEFAULT 'pendente',
  vermifugado      TEXT NOT NULL DEFAULT 'pendente',
  antipulga        TEXT NOT NULL DEFAULT 'pendente',
  microchip        TEXT NOT NULL DEFAULT 'nao',
  tratamento_ativo BOOLEAN NOT NULL DEFAULT FALSE,
  obs_saude        TEXT,
  -- Apresentação
  descricao        TEXT NOT NULL,
  adotante_ideal   TEXT,
  fotos            TEXT[],         -- URLs do Supabase Storage
  urgencia         TEXT NOT NULL DEFAULT 'verde', -- verde | amarelo | vermelho
  -- Controle
  status           animal_status NOT NULL DEFAULT 'pending',
  voluntaria_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at      TIMESTAMPTZ,
  adopted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX animals_status_idx   ON animals(status);
CREATE INDEX animals_urgencia_idx ON animals(urgencia) WHERE status = 'published';

CREATE TRIGGER animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELA: denuncias (formulário público de maus-tratos)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE denuncias (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Localização
  endereco       TEXT NOT NULL,
  bairro         TEXT,
  cidade         TEXT,
  estado         TEXT DEFAULT 'PR',
  -- Animal
  tipo_animal    TEXT NOT NULL,
  qtd_animais    TEXT,
  -- Abuso
  tipo_abuso     TEXT[] NOT NULL,  -- múltipla escolha
  descricao      TEXT NOT NULL,
  frequencia     TEXT,
  -- Suspeito (opcional)
  suspeito_desc  TEXT,
  -- Denunciante
  anonima        BOOLEAN NOT NULL DEFAULT FALSE,
  contato_nome   TEXT,
  contato_tel    TEXT,
  contato_email  TEXT,
  -- Arquivos (URLs do Storage)
  anexos         TEXT[],
  -- Controle
  status         denuncia_status NOT NULL DEFAULT 'nova',
  atendida_por   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  obs_interna    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX denuncias_status_idx    ON denuncias(status);
CREATE INDEX denuncias_created_idx   ON denuncias(created_at DESC);

CREATE TRIGGER denuncias_updated_at
  BEFORE UPDATE ON denuncias
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS — ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

-- Helper: retorna a role do usuário autenticado
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role LANGUAGE sql SECURITY DEFINER AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

-- ── profiles ────────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê próprio perfil"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin vê todos os perfis"
  ON profiles FOR SELECT USING (current_user_role() = 'admin');

CREATE POLICY "Usuário atualiza próprio perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin gerencia todos os perfis"
  ON profiles FOR ALL USING (current_user_role() = 'admin');

-- ── articles ────────────────────────────────────────────────────────────────
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público lê artigos publicados"
  ON articles FOR SELECT USING (status = 'published');

CREATE POLICY "Editor e admin veem todos"
  ON articles FOR SELECT USING (
    current_user_role() IN ('admin', 'editor')
  );

CREATE POLICY "Editor e admin inserem artigos"
  ON articles FOR INSERT WITH CHECK (
    current_user_role() IN ('admin', 'editor')
  );

CREATE POLICY "Editor e admin atualizam artigos"
  ON articles FOR UPDATE USING (
    current_user_role() IN ('admin', 'editor')
  );

CREATE POLICY "Admin deleta artigos"
  ON articles FOR DELETE USING (current_user_role() = 'admin');

-- ── rss_sources ─────────────────────────────────────────────────────────────
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público lê fontes ativas"
  ON rss_sources FOR SELECT USING (active = TRUE);

CREATE POLICY "Admin gerencia fontes RSS"
  ON rss_sources FOR ALL USING (current_user_role() = 'admin');

-- ── animals ─────────────────────────────────────────────────────────────────
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público vê animais publicados"
  ON animals FOR SELECT USING (status = 'published');

CREATE POLICY "Voluntária vê seus próprios cadastros"
  ON animals FOR SELECT USING (voluntaria_id = auth.uid());

CREATE POLICY "Admin e editor veem todos os animais"
  ON animals FOR SELECT USING (
    current_user_role() IN ('admin', 'editor')
  );

CREATE POLICY "Voluntária cadastra animais"
  ON animals FOR INSERT WITH CHECK (
    current_user_role() IN ('admin', 'editor', 'voluntaria_amaa')
    AND voluntaria_id = auth.uid()
  );

CREATE POLICY "Voluntária edita seus animais pendentes"
  ON animals FOR UPDATE USING (
    voluntaria_id = auth.uid() AND status = 'pending'
  );

CREATE POLICY "Admin e editor aprovam/rejeitam animais"
  ON animals FOR UPDATE USING (
    current_user_role() IN ('admin', 'editor')
  );

-- ── denuncias ───────────────────────────────────────────────────────────────
ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode inserir denúncia"
  ON denuncias FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin e editor veem denúncias"
  ON denuncias FOR SELECT USING (
    current_user_role() IN ('admin', 'editor')
  );

CREATE POLICY "Admin e editor atualizam denúncias"
  ON denuncias FOR UPDATE USING (
    current_user_role() IN ('admin', 'editor')
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════════════════
-- Execute no painel do Supabase → Storage → New Bucket:
--
-- 1. Bucket: "article-images"   → Public: TRUE
-- 2. Bucket: "animal-photos"    → Public: TRUE
-- 3. Bucket: "denuncia-anexos"  → Public: FALSE (privado)
--
-- Ou via SQL (requer Supabase Storage habilitado):
INSERT INTO storage.buckets (id, name, public) VALUES
  ('article-images', 'article-images', TRUE),
  ('animal-photos',  'animal-photos',  TRUE),
  ('denuncia-anexos','denuncia-anexos', FALSE)
ON CONFLICT DO NOTHING;

-- Políticas de Storage para animal-photos (upload por voluntárias autenticadas)
CREATE POLICY "Voluntárias fazem upload de fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'animal-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Público vê fotos de animais"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('article-images', 'animal-photos'));

-- ═══════════════════════════════════════════════════════════════════════════
-- DADOS INICIAIS — RSS Sources (populado depois com os sites do usuário)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO rss_sources (name, url, site_url, category) VALUES
  -- Direito Geral / Advocacia
  ('Migalhas',    'https://www.migalhas.uol.com.br/rss/quentes',    'https://migalhas.uol.com.br',  'advocacia'),
  ('Conjur',      'https://www.conjur.com.br/rss.xml',              'https://conjur.com.br',        'advocacia'),
  ('JOTA',        'https://www.jota.info/feed',                     'https://jota.info',            'advocacia'),
  ('STJ Notícias','https://www.stj.jus.br/sites/portalp/RSS/noticias','https://stj.jus.br',         'civil'),
  ('TST Notícias','https://www.tst.jus.br/rss',                    'https://tst.jus.br',           'trabalhista'),
  -- OAB / Advocacia PR
  ('OAB Federal', 'https://www.oab.org.br/rss/noticias',           'https://oab.org.br',           'oab'),
  -- Direito Agrário
  ('Agrolink',    'https://www.agrolink.com.br/rss',               'https://agrolink.com.br',      'agrario'),
  -- Direito de Família
  ('IBDFAM',      'https://ibdfam.org.br/rss.xml',                 'https://ibdfam.org.br',        'familia'),
  -- Direito Animal
  ('IBDA',        'https://ibda.com.br/feed',                      'https://ibda.com.br',          'animal')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- FIM DO SCHEMA
-- Próximo passo: criar o primeiro usuário admin via Supabase Auth →
-- Authentication → Users → Invite User
-- Depois, no SQL Editor, promover para admin:
--   UPDATE profiles SET role = 'admin' WHERE id = 'UUID_DO_SEU_USUARIO';
-- ═══════════════════════════════════════════════════════════════════════════
