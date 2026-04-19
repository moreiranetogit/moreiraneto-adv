'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';

const COLORS = {
  dourado: '#E8941F',
  branco: '#FFFFFF',
  areia: '#F5E6D3',
  cinzaClaro: '#D3D3D3',
  cinzaEscuro: '#2D2D2D',
  cinzaMedio: '#666666',
  preto: '#000000',
  vermelho: '#EF4444',
  verde: '#10B981',
};

const FONT_FAMILY = "'Sitka Text', Georgia, 'Times New Roman', serif";

export default function AdminArtigosPage() {
  const [artigos, setArtigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adicionandoManual, setAdicionandoManual] = useState(false);

  useEffect(() => {
    // TODO: Buscar artigos do Supabase
    setLoading(false);
  }, []);

  return (
    <div style={{ backgroundColor: COLORS.areia, color: COLORS.cinzaEscuro, fontFamily: FONT_FAMILY, minHeight: '100vh' }}>
      <header style={{ backgroundColor: COLORS.cinzaEscuro, color: COLORS.branco, padding: '20px', borderBottom: `3px solid ${COLORS.dourado}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>📰 Painel Editorial</h1>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Gerencie notícias jurídicas e análises</p>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <button style={{ backgroundColor: COLORS.dourado, color: COLORS.cinzaEscuro, padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setAdicionandoManual(!adicionandoManual)}>
            <Plus size={18} /> Adicionar Notícia
          </button>
        </div>

        {adicionandoManual && (
          <div style={{ backgroundColor: COLORS.branco, borderRadius: '8px', padding: '24px', marginBottom: '32px', border: `2px solid ${COLORS.dourado}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Adicionar Notícia Manual</h2>
            <form onSubmit={(e) => { e.preventDefault(); /* TODO: Enviar para API */ }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>Título</label>
                  <input type="text" required style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.cinzaClaro}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Título da notícia" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>Descrição</label>
                  <textarea style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.cinzaClaro}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', minHeight: '80px' }} placeholder="Resumo da notícia" />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{ backgroundColor: COLORS.verde, color: COLORS.branco, border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Adicionar</button>
                  <button type="button" onClick={() => setAdicionandoManual(false)} style={{ backgroundColor: COLORS.cinzaClaro, color: COLORS.cinzaEscuro, border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div style={{ backgroundColor: COLORS.branco, borderRadius: '8px', padding: '40px', textAlign: 'center', opacity: 0.6 }}>
          {loading ? 'Carregando notícias...' : 'Nenhuma notícia encontrada. Adicione uma para começar!'}
        </div>
      </div>
    </div>
  );
}
