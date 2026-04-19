// Header.jsx — MNA Website Header
Object.assign(window, { MNAHeader });

function MNAHeader({ activeSection, onNav }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const NAV = [
    { label: 'Início', href: 'home' },
    { label: 'Quem Somos', href: 'about' },
    { label: 'Áreas de Atuação', href: 'areas' },
    { label: 'Radar Jurídico', href: 'radar' },
    { label: 'Adoção AMAA', href: 'amaa' },
    { label: 'Denúncias', href: 'denuncia' },
    { label: 'Contato', href: 'contact' },
  ];
  return React.createElement('header', {
    style: {
      background: '#2C2C2C',
      borderBottom: '3px solid #E8941F',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      position: 'sticky', top: 0, zIndex: 50,
    }
  },
    React.createElement('div', {
      style: { maxWidth: 1280, margin: '0 auto', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }
    },
      // Logo
      React.createElement('div', {
        onClick: () => onNav && onNav('home'),
        style: { cursor: 'pointer', flexShrink: 0 }
      },
        React.createElement('img', {
          src: '../../assets/mna-logo-web.png', alt: 'MNA',
          style: { height: 44, width: 'auto' },
          onError: (e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }
        }),
        React.createElement('div', { style: { display:'none', color:'#E8941F', fontWeight:700, fontSize:18 } }, 'MNA')
      ),
      // Nav desktop
      React.createElement('nav', { style: { display:'flex', gap:24, flex:1, justifyContent:'center' } },
        NAV.map(item =>
          React.createElement('a', {
            key: item.href,
            onClick: () => onNav && onNav(item.href),
            style: {
              color: activeSection === item.href ? '#E8941F' : '#fff',
              fontSize: 13, fontWeight: 500, cursor:'pointer', textDecoration:'none',
              transition:'color 0.2s', whiteSpace:'nowrap',
            },
            onMouseEnter: e => e.target.style.color = '#E8941F',
            onMouseLeave: e => e.target.style.color = activeSection === item.href ? '#E8941F' : '#fff',
          }, item.label)
        )
      ),
      // Icons
      React.createElement('div', { style: { display:'flex', gap:14, alignItems:'center', flexShrink:0 } },
        React.createElement('a', { href:'https://wa.me/5546999779865', target:'_blank', style:{ color:'#E8941F' } },
          React.createElement('svg', { width:22, height:22, viewBox:'0 0 24 24', fill:'none', stroke:'#E8941F', strokeWidth:'1.5' },
            React.createElement('path', { d:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
          )
        ),
        React.createElement('a', { href:'mailto:contato@moreiraneto.adv.br', style:{ color:'#E8941F' } },
          React.createElement('svg', { width:18, height:18, viewBox:'0 0 24 24', fill:'none', stroke:'#E8941F', strokeWidth:'1.5' },
            React.createElement('rect', { x:2, y:4, width:20, height:16, rx:2 }),
            React.createElement('path', { d:'m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' })
          )
        )
      )
    )
  );
}
