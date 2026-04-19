// AreaCard.jsx — Practice area card
Object.assign(window, { AreaCard, AreasSection });

const AREAS_DATA = [
  { slug:'direito-agrario', titulo:'Direito Agrário', descricaoCurta:'Assessoria completa em negócios rurais, arrendamento, parceria agrícola e financiamento.', imagem:'../../assets/mna-area-geral-web.jpg' },
  { slug:'direito-civil', titulo:'Direito Civil', descricaoCurta:'Consultoria em contratos, sucessões, responsabilidade civil e questões patrimoniais.', imagem:'../../assets/mna-area-civil-web.jpg' },
  { slug:'direito-trabalho', titulo:'Direito do Trabalho', descricaoCurta:'Defesa trabalhista, cumprimento de NR-31 e conformidade regulatória rural.', imagem:'../../assets/mna-area-trabalhista.jpg' },
  { slug:'direito-familia', titulo:'Direito de Família', descricaoCurta:'Assistência em separações, heranças, guarda e acordos familiares.', imagem:'../../assets/mna-area-familia-web.jpg' },
  { slug:'direito-animal', titulo:'Direito Animal', descricaoCurta:'Proteção animal, denúncia de maus-tratos e conformidade legal com bem-estar animal.', imagem:'../../assets/mna-area-animal-web.jpg' },
  { slug:'direito-geral', titulo:'Direito Geral', descricaoCurta:'Consultoria em diversos temas jurídicos e assessoria administrativa.', imagem:'../../assets/mna-area-geral-web.jpg' },
];

function AreaCard({ area, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return React.createElement('div', {
    onClick, onMouseEnter:()=>setHovered(true), onMouseLeave:()=>setHovered(false),
    style:{
      borderRadius:12, overflow:'hidden', cursor:'pointer',
      boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.10)',
      transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
      transition:'all 0.3s', background:'#fff', display:'flex', flexDirection:'column',
    }
  },
    React.createElement('div', { style:{width:'100%', height:220, overflow:'hidden', background:'#f0f0f0'} },
      React.createElement('img', {
        src: area.imagem, alt: area.titulo,
        style:{ width:'100%', height:'100%', objectFit:'cover' },
        onError: e => { e.target.parentElement.style.background='linear-gradient(135deg,#2C2C2C,#E8941F33)'; e.target.style.display='none'; }
      })
    ),
    React.createElement('div', { style:{padding:24, flex:1, display:'flex', flexDirection:'column'} },
      React.createElement('h3', { style:{fontFamily:"'Lora',Georgia,serif", fontSize:22, fontWeight:700, color:'#2D2D2D', marginBottom:10} }, area.titulo),
      React.createElement('p', { style:{fontSize:14, color:'#666', lineHeight:1.6, flex:1, marginBottom:16} }, area.descricaoCurta),
      React.createElement('div', { style:{fontSize:14, fontWeight:600, color:'#E8941F', display:'flex', alignItems:'center', gap:6} }, 'Saiba Mais ', React.createElement('span', null, '›'))
    )
  );
}

function AreasSection({ onAreaClick }) {
  return React.createElement('section', {
    id:'areas', style:{ background:'#fff', padding:'80px 20px' }
  },
    React.createElement('div', { style:{ maxWidth:1280, margin:'0 auto' } },
      React.createElement('div', { style:{textAlign:'center', marginBottom:56} },
        React.createElement('p', { style:{fontSize:12, fontWeight:600, letterSpacing:2, color:'#E8941F', textTransform:'uppercase', marginBottom:10} }, 'Expertise Jurídica'),
        React.createElement('h2', { style:{fontFamily:"'Lora',Georgia,serif", fontSize:42, fontWeight:700, color:'#2D2D2D', letterSpacing:'-0.5px', marginBottom:12} }, 'Áreas de Atuação'),
        React.createElement('p', { style:{fontSize:17, color:'#666', maxWidth:700, margin:'0 auto', lineHeight:1.6} }, 'Expertise especializada em diversos ramos do Direito, oferecendo soluções estratégicas e personalizadas')
      ),
      React.createElement('div', { style:{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:28} },
        AREAS_DATA.map((area,i) => React.createElement(AreaCard, { key:i, area, onClick:()=>onAreaClick&&onAreaClick(area) }))
      )
    )
  );
}
