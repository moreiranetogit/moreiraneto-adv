-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: Fontes RSS jurídicas
-- Execute no Supabase SQL Editor se o banco já existir (schema já aplicado)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO rss_sources (name, url, site_url, category) VALUES

  -- Advocacia / Geral
  ('Migalhas',       'https://www.migalhas.uol.com.br/rss/quentes',         'https://migalhas.uol.com.br',    'advocacia'),
  ('Conjur',         'https://www.conjur.com.br/rss.xml',                   'https://conjur.com.br',          'advocacia'),
  ('JOTA',           'https://www.jota.info/feed',                          'https://jota.info',              'advocacia'),
  ('Jusbrasil',      'https://www.jusbrasil.com.br/feed',                   'https://jusbrasil.com.br',       'advocacia'),

  -- OAB
  ('OAB Federal',    'https://www.oab.org.br/rss/noticias',                 'https://oab.org.br',             'oab'),
  ('OAB Paraná',     'https://www.oabpr.org.br/feed/',                      'https://oabpr.org.br',           'oab'),

  -- Tribunais Superiores
  ('STJ Notícias',   'https://www.stj.jus.br/sites/portalp/RSS/noticias',   'https://stj.jus.br',            'civil'),
  ('STF Notícias',   'https://portal.stf.jus.br/servicos/rss/noticias.asp', 'https://stf.jus.br',            'advocacia'),
  ('TST Notícias',   'https://www.tst.jus.br/rss',                          'https://tst.jus.br',            'trabalhista'),
  ('TRT9 Notícias',  'https://www.trt9.jus.br/portal/rss/noticias.xhtml',   'https://trt9.jus.br',           'trabalhista'),

  -- Direito Trabalhista
  ('LTr Online',     'https://www.ltr.com.br/feed/',                        'https://ltr.com.br',            'trabalhista'),

  -- Direito de Família
  ('IBDFAM',         'https://ibdfam.org.br/rss.xml',                       'https://ibdfam.org.br',         'familia'),

  -- Direito Agrário
  ('Agrolink',       'https://www.agrolink.com.br/rss',                     'https://agrolink.com.br',       'agrario'),
  ('Canal Rural',    'https://www.canalrural.com.br/feed/',                  'https://canalrural.com.br',     'agrario'),

  -- Direito Animal
  ('IBDA',           'https://ibda.com.br/feed',                            'https://ibda.com.br',           'animal'),
  ('Anda Agency',    'https://www.anda.jor.br/feed/',                       'https://anda.jor.br',           'animal')

ON CONFLICT (url) DO NOTHING;
