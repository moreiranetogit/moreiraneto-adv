// ContactSection.jsx + Footer.jsx
Object.assign(window, { MNAContact, MNAFooter });

function MNAContact() {
  return React.createElement('section', {
    id:'contact',
    style:{ background:'#2D2D2D', color:'#fff', padding:'64px 20px', fontFamily:"'Inter',sans-serif" }
  },
    React.createElement('div', { style:{ maxWidth:1200, margin:'0 auto' } },
      React.createElement('h2', { style:{fontSize:36,fontWeight:700,marginBottom:48,textAlign:'center',color:'#E8941F',fontFamily:"'Lora',Georgia,serif"} }, 'Contato'),
      React.createElement('div', { style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,marginBottom:32} },
        // Map placeholder
        React.createElement('div', { style:{borderRadius:8,overflow:'hidden',background:'#1a1a1a',minHeight:220,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(255,255,255,0.08)'} },
          React.createElement('div', { style:{textAlign:'center',color:'#666'} },
            React.createElement('svg', {width:32,height:32,viewBox:'0 0 24 24',fill:'none',stroke:'#E8941F',strokeWidth:1.5,style:{marginBottom:8}},
              React.createElement('path',{d:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'}),
              React.createElement('circle',{cx:12,cy:10,r:3})
            ),
            React.createElement('p',{style:{fontSize:13,color:'#9CA3AF'}},'Rua Belém, 2963, sala 22'),
            React.createElement('p',{style:{fontSize:13,color:'#9CA3AF'}},'Centro — Realeza, PR')
          )
        ),
        // Info
        React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:24} },
          [
            { icon:'📍', label:'Endereço', val:'Rua Belém, nº 2963, sala 22\nCentro — Realeza, PR' },
            { icon:'💬', label:'WhatsApp', val:'(46) 99977-9865' },
            { icon:'✉', label:'E-mail', val:'contato@moreiraneto.adv.br' },
          ].map(({icon,label,val},i)=>
            React.createElement('div', { key:i },
              React.createElement('h3',{style:{fontSize:16,fontWeight:600,color:'#E8941F',marginBottom:4}}, `${icon} ${label}`),
              React.createElement('p',{style:{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.5,whiteSpace:'pre-line'}}, val)
            )
          )
        )
      ),
      React.createElement('div', { style:{display:'flex',gap:12,justifyContent:'center',paddingTop:24,borderTop:'1px solid rgba(255,255,255,0.1)',flexWrap:'wrap'} },
        React.createElement('a',{href:'https://wa.me/5546999779865',target:'_blank',style:{display:'inline-flex',alignItems:'center',gap:8,background:'#25D366',color:'#fff',padding:'10px 20px',borderRadius:8,textDecoration:'none',fontSize:14,fontWeight:600}},'💬 WhatsApp'),
        React.createElement('a',{href:'mailto:contato@moreiraneto.adv.br',style:{display:'inline-flex',alignItems:'center',gap:8,background:'#E8941F',color:'#2D2D2D',padding:'10px 20px',borderRadius:8,textDecoration:'none',fontSize:14,fontWeight:600}},'✉ E-mail'),
        React.createElement('a',{href:'https://maps.app.goo.gl/XZj8Rt4UUsKg2d3M6',target:'_blank',style:{display:'inline-flex',alignItems:'center',gap:8,background:'transparent',color:'#E8941F',border:'2px solid #E8941F',padding:'10px 20px',borderRadius:8,textDecoration:'none',fontSize:14,fontWeight:600}},'📍 Ver no Mapa')
      )
    )
  );
}

function MNAFooter({ onNav }) {
  const NAV = ['Início','Quem Somos','Áreas de Atuação','Radar Jurídico','Adoção AMAA','Contato'];
  return React.createElement('footer', {
    style:{ background:'#2C2C2C', color:'#fff', padding:'48px 20px 20px' }
  },
    React.createElement('div',{style:{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:40,marginBottom:32}},
      React.createElement('div',null,
        React.createElement('h4',{style:{fontSize:15,fontWeight:700,color:'#E8941F',marginBottom:12}},'O Moreira Neto'),
        React.createElement('p',{style:{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.6}},'Advocacia especializada em Direito Agrário, Agronegócio e assessoria jurídica completa. Realeza, Paraná.')
      ),
      React.createElement('div',null,
        React.createElement('h4',{style:{fontSize:15,fontWeight:700,color:'#E8941F',marginBottom:12}},'Navegação'),
        React.createElement('ul',{style:{listStyle:'none',padding:0,margin:0}},
          NAV.map((item,i)=>React.createElement('li',{key:i,style:{marginBottom:6}},
            React.createElement('a',{style:{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',cursor:'pointer'},
              onMouseEnter:e=>e.target.style.color='#E8941F',
              onMouseLeave:e=>e.target.style.color='rgba(255,255,255,0.7)'
            },item)
          ))
        )
      ),
      React.createElement('div',null,
        React.createElement('h4',{style:{fontSize:15,fontWeight:700,color:'#E8941F',marginBottom:12}},'Responsabilidade Social'),
        React.createElement('p',{style:{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.6}},'Apoiamos a AMAA (Associação de Amigos dos Animais de Realeza/PR) na proteção e denúncia de maus-tratos animal.')
      )
    ),
    React.createElement('div',{style:{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:16,textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.4)'}},
      '© 2025 Moreira Neto Advocacia. Todos os direitos reservados.'
    )
  );
}
