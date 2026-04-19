// HeroSection.jsx — MNA Hero with araucária + CTAs
Object.assign(window, { MNAHero });

function MNAHero({ onNav }) {
  return React.createElement('section', {
    id: 'home',
    style: { background: '#fff', padding: '60px 20px 60px', display:'flex', flexDirection:'column', alignItems:'center' }
  },
    // Full hero image — no text overlay, logo is embedded in the image
    React.createElement('div', { style:{ width:'100%', maxWidth:900, marginBottom:40 } },
      React.createElement('img', {
        src: '../../assets/mna-araucarias.png',
        alt: 'Moreira Neto Advocacia — Araucárias',
        style:{ width:'100%', height:'auto', display:'block', borderRadius:8 },
        onError: e => {
          e.target.src = '../../assets/mna-logo-araucaria-web.jpg';
          e.target.onError = null;
        }
      })
    ),
    // CTAs below the image — never overlapping the logo
    React.createElement('div', { style:{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' } },
      React.createElement('button', {
        onClick: () => onNav && onNav('contact'),
        style:{ padding:'16px 32px', background:'#E8941F', color:'#2D2D2D', border:'none', borderRadius:6, fontWeight:600, fontSize:15, cursor:'pointer', transition:'all 0.3s', fontFamily:'inherit' },
        onMouseEnter: e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 8px 16px rgba(232,148,31,0.3)'; },
        onMouseLeave: e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none'; },
      }, 'Agende uma Consulta'),
      React.createElement('button', {
        onClick: () => onNav && onNav('areas'),
        style:{ padding:'16px 32px', background:'#1a1a1a', color:'#E8941F', border:'2px solid #E8941F', borderRadius:6, fontWeight:600, fontSize:15, cursor:'pointer', transition:'all 0.3s', fontFamily:'inherit' },
        onMouseEnter: e => { e.target.style.background='#E8941F'; e.target.style.color='#1a1a1a'; },
        onMouseLeave: e => { e.target.style.background='#1a1a1a'; e.target.style.color='#E8941F'; },
      }, 'Conheça Nossas Áreas')
    )
  );
}
