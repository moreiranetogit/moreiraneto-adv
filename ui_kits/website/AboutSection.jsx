// AboutSection.jsx — Quem Somos + Diferenciais
Object.assign(window, { AboutSection });

const DIFERENCIAIS = [
  'Experiência de 20+ anos em Direito Agrário',
  'Equipe especializada em conformidade rural',
  'Atendimento personalizado e estratégico',
  'Soluções criativas dentro da lei',
  'Foco em eficiência e redução de custos',
  'Conhecimento profundo do mercado local',
];

function AboutSection({ onNav }) {
  return React.createElement('section', {
    id: 'about',
    style: { padding:'80px 20px', maxWidth:1280, margin:'0 auto' }
  },
    React.createElement('div', {
      style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }
    },
      // Text column
      React.createElement('div', null,
        React.createElement('p', { style:{fontSize:12,fontWeight:600,letterSpacing:2,color:'#E8941F',textTransform:'uppercase',marginBottom:12} }, 'Quem Somos'),
        React.createElement('h2', { style:{fontFamily:"'Lora',Georgia,serif",fontSize:42,fontWeight:700,color:'#2D2D2D',letterSpacing:'-0.5px',marginBottom:24,lineHeight:1.15} }, 'Seja bem-vindo ao Moreira Neto Advocacia'),
        React.createElement('p', { style:{fontSize:16,color:'#666',lineHeight:1.7,marginBottom:16} },
          'Somos um escritório de advocacia especializado em Direito Agrário, Agronegócio e assessoria jurídica completa. Desde nossa fundação, atendemos produtores rurais, cooperativas e empresas com soluções estratégicas e criativas.'
        ),
        React.createElement('p', { style:{fontSize:16,color:'#666',lineHeight:1.7,marginBottom:28} },
          'Nossa abordagem combina profundo conhecimento do mercado local com expertise jurídica de alto nível. Buscamos soluções eficientes, dentro da lei e ajustadas à realidade de nossos clientes.'
        ),
        React.createElement('button', {
          onClick:()=>onNav&&onNav('radar'),
          style:{ padding:'12px 24px', background:'#E8941F', color:'#2D2D2D', border:'none', borderRadius:6, fontWeight:600, fontSize:14, cursor:'pointer', fontFamily:'inherit', transition:'all 0.3s' },
          onMouseEnter:e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 8px 16px rgba(232,148,31,0.3)';},
          onMouseLeave:e=>{e.target.style.transform='translateY(0)';e.target.style.boxShadow='none';}
        }, 'Leia Radar Jurídico →')
      ),
      // Diferenciais grid
      React.createElement('div', { style:{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12} },
        DIFERENCIAIS.map((item,i) => {
          const [hov,setHov] = React.useState(false);
          return React.createElement('div', {
            key:i, onMouseEnter:()=>setHov(true), onMouseLeave:()=>setHov(false),
            style:{
              padding:18, borderRadius:8, background:'#fff', borderLeft:'4px solid #E8941F',
              boxShadow: hov ? '0 8px 16px rgba(0,0,0,0.10)' : '0 2px 8px rgba(0,0,0,0.06)',
              transform: hov ? 'translateY(-2px)' : 'translateY(0)',
              transition:'all 0.3s',
            }
          },
            React.createElement('p', { style:{fontSize:13,fontWeight:600,color:'#2D2D2D',margin:0} }, `✓ ${item}`)
          );
        })
      )
    )
  );
}
