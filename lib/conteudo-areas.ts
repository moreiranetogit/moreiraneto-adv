// Conteúdo estruturado das 6 áreas de atuação
// Edite este arquivo para atualizar o conteúdo das páginas

export interface Area {
  id: string;
  slug: string;
  titulo: string;
  descricaoCurta: string;
  imagem: string;
  cor: string;
  introducao: string[];
  questoes: Array<{
    titulo: string;
    descricao: string;
  }>;
  exemplos: Array<{
    cenario: string;
    descricao: string;
  }>;
  diferenciais: Array<{
    titulo: string;
    descricao: string;
  }>;
}

export const AREAS: Area[] = [
  {
    id: '1',
    slug: 'direito-agrario',
    titulo: 'Direito Agrário',
    descricaoCurta: 'Assessoria completa em negócios rurais, arrendamento, parceria agrícola e financiamento.',
    imagem: '/mna-direito-agrario.png',
    cor: '#8B7355',
    introducao: [
      'O Direito Agrário é a especialidade que sustenta a economia rural e o desenvolvimento do agronegócio. Para produtores, cooperativas e empresas rurais, ter uma assessoria jurídica especializada não é luxo — é necessidade. No Moreira Neto, entendemos os desafios únicos do produtor rural: desde a negociação de contratos até a gestão de dívidas em momentos de crise, passando por financiamentos complexos e parcerias que precisam estar blindadas legalmente.',
      'Nossa abordagem é estratégica: buscamos soluções antes do litígio. Quando as dificuldades aparecem — e aparecem — oferecemos desde renegociações extrajudiciais até processos de recuperação judicial, sempre focando em manter seu negócio em funcionamento. Não é sobre vencer em juízo; é sobre garantir que você continue produzindo.',
      'Há mais de 20 anos atuamos nessa área, conhecendo cada detalhe da legislação rural, as jurisprudências que mais impactam produtores e as estratégias que funcionam na prática. Somos locais, entendemos a realidade de Realeza e região.',
    ],
    questoes: [
      {
        titulo: 'Arrendamento e Parceria Agrícola',
        descricao: 'Estruturação, revisão e renegociação de contratos; resolução de conflitos sobre produtividade e responsabilidades',
      },
      {
        titulo: 'Financiamentos Rurais',
        descricao: 'Análise de cláusulas contratuais, defesa em executivas, renegociação com bancos e instituições de crédito',
      },
      {
        titulo: 'Gestão e Solução de Dívidas',
        descricao: 'Estruturação de planos de pagamento, negociação com credores, análise de viabilidade financeira',
      },
      {
        titulo: 'Recuperação Judicial',
        descricao: 'Orientação completa sobre quando recorrer ao processo, documentação necessária, estratégia processual',
      },
      {
        titulo: 'Compra, Venda e Permuta de Terras',
        descricao: 'Análise de documentação, regularização de propriedades, transferência segura de domínio',
      },
      {
        titulo: 'Conformidade Ambiental',
        descricao: 'Licenças ambientais, conformidade com legislação de preservação, defesa em autuações',
      },
      {
        titulo: 'Conflitos Comunitários',
        descricao: 'Disputes sobre limites de propriedade, direitos de passagem, uso de água — resolvidas extrajudicialmente quando possível',
      },
    ],
    exemplos: [
      {
        cenario: 'Cenário 1: Arrendamento em Crise',
        descricao: 'Um produtor de soja contratou arrendamento de terras há 5 anos. Houve má colheita por seca; o proprietário quer rescindir o contrato e cobrar perdas. A situação parecia perdida judicialmente. Solução: Analisamos o contrato, encontramos cláusulas favoráveis ao arrendatário quanto ao risco climático. Negociamos extrajudicialmente uma redução temporária da renda e extensão do prazo. O produtor mantém a terra, o proprietário recebe (reduzido, mas seguro). Ambos saem vivos.',
      },
      {
        cenario: 'Cenário 2: Recuperação Judicial',
        descricao: 'Um cooperativista tinha dívida de R$ 400 mil com o banco. Execução iminente. Processualmente, a defesa era fraca. Solução: Montamos plano de recuperação judicial, reestruturando a dívida e permitindo que o produtor continuasse operando durante o processo. Resultado: débito reduzido a 60% do valor original, com parcelamento viável.',
      },
      {
        cenario: 'Cenário 3: Financiamento com Cláusulas Leoninas',
        descricao: 'Financiamento de plantação com cláusulas leoninas (juros escalonados, garantias excessivas). Produtor estava pagando mais em multa que em principal. Solução: Acionamos discussão sobre abusividade contratual, negociamos redução de encargos; cliente economizou R$ 120 mil.',
      },
    ],
    diferenciais: [
      {
        titulo: 'Estratégia Antes do Litígio',
        descricao: 'Nossa prioridade é negociação e reestruturação. Você só vai ao juízo se realmente não houver outra saída — e quando isso acontece, estamos preparados com tática inteligente, não ataque frontal.',
      },
      {
        titulo: 'Conhecimento do Mercado Local',
        descricao: 'Não somos advogados genéricos. Conhecemos os bancos que atuam em Realeza, as cooperativas locais, as práticas costumeiras da região. Isso pesa muito nas negociações.',
      },
      {
        titulo: 'Gestão de Dívidas e Recuperação',
        descricao: 'Essa é uma especialidade nossa. Não tratamos dívida como derrota; tratamos como problema a ser reorganizado. Muitos produtores que nos procuram acham que perderam tudo — saem com a propriedade salva e negócio reestruturado.',
      },
      {
        titulo: 'Soluções Criativas Dentro da Lei',
        descricao: 'Sabemos os limites legais, mas exploramos todas as possibilidades dentro deles. Renegociação de prazos, redução de encargos, troca de garantias, reestruturação de parcerias — existem caminhos que você não vê sozinho.',
      },
    ],
  },
  {
    id: '2',
    slug: 'direito-civil',
    titulo: 'Direito Civil',
    descricaoCurta: 'Consultoria em contratos, sucessões, responsabilidade civil e questões patrimoniais.',
    imagem: '/mna-area-civil-web.jpg',
    cor: '#4A90E2',
    introducao: [
      'Direito Civil é a base de qualquer vida em sociedade: contratos que assinamos, heranças que deixamos para filhos, acidentes que causam prejuízos. Para pessoas e empresas, uma boa consultoria em Direito Civil evita problemas futuros e resolve rapidamente os que surgem.',
      'No Moreira Neto, nossa abordagem é sempre estratégica: antes de pensar em processo, pensamos em solução. Um contrato bem revisto economiza anos de litígio. Uma negociação bem conduzida preserva relações. Quando a via extrajudicial não funciona, atuamos judicialmente — mas com inteligência, não com agressão.',
    ],
    questoes: [
      {
        titulo: 'Revisão e Elaboração de Contratos',
        descricao: 'Contratos de prestação de serviço, locação, parceria comercial, compra e venda; análise de cláusulas abusivas',
      },
      {
        titulo: 'Conflitos Contratuais',
        descricao: 'Discussões sobre interpretação de cláusulas, inadimplência, rescisão; negociação antes da ação',
      },
      {
        titulo: 'Sucessão e Heranças',
        descricao: 'Planejamento sucessório, inventário, partilha de bens, conflitos entre herdeiros',
      },
      {
        titulo: 'Responsabilidade Civil',
        descricao: 'Análise de danos (morais, materiais), quantificação, defesa em ações ou negociação de indenizações',
      },
      {
        titulo: 'Questões Patrimoniais',
        descricao: 'Posse, propriedade, usucapião, condomínios, divisão de bens',
      },
      {
        titulo: 'Contratos Imobiliários',
        descricao: 'Compra, venda, permuta de imóvel; análise de documentação; regularização de propriedades',
      },
    ],
    exemplos: [
      {
        cenario: 'Cenário 1: Contrato Mal Feito',
        descricao: 'Um comerciante contratou reforma em sua loja. Obra não ficou conforme prometido; contratante desapareceu. Cliente queria processar, mas recuperaria zero porque o contato não tinha documentação. Solução: Estruturamos correspondência extrajudicial com fundamento em Lei do Consumidor, ameaçando ação em pequenas causas e publicação em órgãos de proteção. Contratante voltou, refez obra. Sem juízo.',
      },
      {
        cenario: 'Cenário 2: Sucessão Familiar',
        descricao: 'Morte de produtor rural sem testamento; herança de 300 hectares, 5 filhos, todos querendo coisas diferentes. Situação tensa. Solução: Conduzimos mediação de sucessão, ajudamos filhos a entender opções (vender, dividir, um fica com terra e paga aos outros). Resultado: partilha amigável, sem brigas de família, sem processo.',
      },
      {
        cenario: 'Cenário 3: Indenização por Dano',
        descricao: 'Cliente sofreu acidente com produto defeituoso; empresa se nega a indenizar. Solução: Acionamos Lei de Responsabilidade Civil, estruturamos caso com provas técnicas, enviamos notificação fundamentada. Empresa, vendo risco real, ofereceu acordo 30% acima do que cliente esperava.',
      },
    ],
    diferenciais: [
      {
        titulo: 'Solução Antes da Ação',
        descricao: 'Processamos quando necessário, mas nossa meta é fechar acordos. Isso poupa seu tempo, dinheiro e relacionamentos.',
      },
      {
        titulo: 'Atuação Judicial Inteligente',
        descricao: 'Quando vamos ao juízo, sabemos qual é o caminho mais rápido e eficiente. Recursos bem dosados, documentação impecável, estratégia clara.',
      },
      {
        titulo: 'Multidisciplinar',
        descricao: 'Direito Civil toca heranças, contratos, imóveis, responsabilidade. Nosso escritório tem expertise em todas essas frentes; você não precisa de múltiplos advogados.',
      },
      {
        titulo: 'Prevenção',
        descricao: 'Boa parte do Direito Civil é sobre evitar problemas. Revisamos contratos antes você assinar; planejamos sucessão antes da morte; analisamos riscos antes de decisões.',
      },
    ],
  },
  {
    id: '3',
    slug: 'direito-trabalho',
    titulo: 'Direito do Trabalho',
    descricaoCurta: 'Defesa trabalhista, cumprimento de NR-31 e conformidade regulatória rural.',
    imagem: '/mna-area-trabalhista.jpg',
    cor: '#F5A623',
    introducao: [
      'No meio rural, a relação entre patrão e empregado é especial: muitas vezes são gerações de trabalho junto, relações de confiança que vão além do contrato. Mas confiança não substitui legalidade. Conformidade com leis trabalhistas — especialmente a NR-31 (norma de segurança do trabalho rural) — é obrigatória e complexa.',
      'Para o produtor ou empresa rural, estar em dia com trabalhadores significa: menos ações trabalhistas, menos multas, menos stress. Para o trabalhador rural, ter direitos reconhecidos é dignidade. No Moreira Neto, atuamos nos dois lados com inteligência: ajudamos empresas a se regularizarem sem quebrantar, e defendemos trabalhadores quando necessário.',
      'Nossa abordagem é sempre estratégica: antes de ir a juízo, tentamos resolver pela negociação. Um acordo bem feito economiza custas e permite que ambos saiam da relação de forma respeitosa.',
    ],
    questoes: [
      {
        titulo: 'Conformidade Trabalhista Rural (NR-31)',
        descricao: 'Análise de cumprimento, orientação sobre equipamentos de proteção, documentação de segurança',
      },
      {
        titulo: 'Contratação e Desligamento',
        descricao: 'Estruturação de contratos, cumprimento de procedimentos de aviso prévio, justa causa documentada',
      },
      {
        titulo: 'Conflitos Salariais',
        descricao: 'Atrasos, não-pagamento de horas extras, diferenças salariais; negociação ou defesa em ação',
      },
      {
        titulo: 'Acidentes do Trabalho',
        descricao: 'Comunicação ao INSS, responsabilidade da empresa, indenizações; defesa em ações regressivas',
      },
      {
        titulo: 'Rescisão Contratual Estratégica',
        descricao: 'Planejamento de desligamentos para evitar ações futuras; orientação sobre multas e indenizações',
      },
      {
        titulo: 'Questões de Segurança Ocupacional',
        descricao: 'Análise de denúncias, cumprimento de inspeções, defesa em autuações',
      },
    ],
    exemplos: [
      {
        cenario: 'Cenário 1: Trabalho Informal',
        descricao: 'Proprietário rural mantinha funcionários sem registro (trabalho informal). Funcionário se acidenta e move ação. Empresa não tem cobertura. Solução: Analisamos situação, negociamos com trabalhador antes de juízo (oferta de indenização + futura regularização), evitamos condenação maior. Depois, ajudamos proprietário a regularizar todos os outros funcionários, implementando conformidade.',
      },
      {
        cenario: 'Cenário 2: Horas Extras Não Pagas',
        descricao: 'Funcionário reclama não-pagamento de horas extras acumuladas. Empresa disputa o valor. Solução: Fizemos auditoria dos registros, identificamos déficit real, negociamos acordo pelo valor real + multa negociada (menor que a que juízo imporia). Resolvido em 3 meses, não em 3 anos.',
      },
      {
        cenario: 'Cenário 3: NR-31 Não Cumprida',
        descricao: 'NR-31 não está sendo cumprida (faltam equipamentos, documentação deficiente). Risco de autuação. Solução: Mapeamos não-conformidades, orientamos sobre compras e implementação, documentamos conformidade progressiva. Empresa evitou multa pesada.',
      },
    ],
    diferenciais: [
      {
        titulo: 'Foco em Negociação, Não Confronto',
        descricao: 'Processos trabalhistas são emocionantes mas caros. Nossa primeira tentativa é sempre acordo, preservando a dignidade do trabalhador e a viabilidade da empresa.',
      },
      {
        titulo: 'Atuação Judicial Eficiente',
        descricao: 'Quando precisamos processar, sabemos os caminhos rápidos. Recursos bem estruturados, argumentação clara, documentação impecável.',
      },
      {
        titulo: 'Especialização em Contexto Rural',
        descricao: 'NR-31, relações especiais do trabalho rural, particularidades da zona agrícola. Não somos generalistas.',
      },
      {
        titulo: 'Prevenção de Conflitos',
        descricao: 'Ajudamos você a estruturar conformidade agora, evitando problemas depois. Análise de contratos, orientação sobre desligamentos, documentação correta.',
      },
    ],
  },
  {
    id: '4',
    slug: 'direito-familia',
    titulo: 'Direito de Família',
    descricaoCurta: 'Assistência em separações, heranças, guarda e acordos familiares.',
    imagem: '/mna-area-familia-web.jpg',
    cor: '#E94B3C',
    introducao: [
      'Direito de Família toca o mais pessoal: casamento, separação, filhos, herança. São questões que carregam emoção, história, dignidade. Por isso mesmo, precisam de abordagem inteligente: quando a relação chegou ao fim, não precisamos adicionar agressividade e trauma.',
      'No Moreira Neto, nossa filosofia é clara: separação não é guerra. Existem interesses legítimos de ambos, e uma boa advocacia os protege sem destruir famílias. Quando há filhos envolvidos, essa abordagem é ainda mais crítica.',
      'Também reconhecemos uma realidade nova: pet é membro da família. Não é propriedade como um carro. Quando casais se separam ou alguém precisa regularizar a guarda de um animal de estimação, isso merece tratamento jurídico sério.',
    ],
    questoes: [
      {
        titulo: 'Separação Amigável e Litigiosa',
        descricao: 'Planejamento estratégico, negociação de divisão de bens, guarda de filhos',
      },
      {
        titulo: 'Guarda de Filhos',
        descricao: 'Determinação de guarda compartilhada ou exclusiva, alteração de arranjos existentes, defesa em conflitos',
      },
      {
        titulo: 'Pensão Alimentícia',
        descricao: 'Fixação, alteração, cobrança de inadimplência; defesa contra ações abusivas',
      },
      {
        titulo: 'Divisão de Patrimônio',
        descricao: 'Análise de bens comuns, partilha equitativa, imóveis, negócios',
      },
      {
        titulo: 'Regulamentação de Guarda de Pets',
        descricao: 'Determinação de posse/custódia de animais de estimação, visitação',
      },
      {
        titulo: 'Herança e Sucessão Familiar',
        descricao: 'Inventário, partilha, resolução de conflitos entre herdeiros',
      },
      {
        titulo: 'Questões de Paternidade',
        descricao: 'Investigação e reconhecimento de paternidade, pensão decorrente',
      },
    ],
    exemplos: [
      {
        cenario: 'Cenário 1: Separação com Filhos',
        descricao: 'Casal se separando, duas crianças pequenas, muito desentendimento. Ambos queriam guarda exclusiva, ambos ameaçavam processo. Solução: Orientamos ambos sobre realidade legal (juíz tenderia a guarda compartilhada), benefícios para filhos dessa forma, e facilitamos mediação. Resultado: acordo de guarda compartilhada, pensão justa, crianças com acesso a ambos os pais. Evitou processo de 5 anos.',
      },
      {
        cenario: 'Cenário 2: Divisão de Patrimônio',
        descricao: 'Separação litigiosa com bens comuns. Marido tinha empresa, propriedades, contas. Mulher buscava ser excluída. Solução: Analisamos patrimônio, estruturamos divisão que protegeu ambos (empresa estruturada para continuidade, bens imóveis dividos, dívidas distribuídas). Acordo judicialmente homologado, sem roubo de ninguém.',
      },
      {
        cenario: 'Cenário 3: Guarda de Pet',
        descricao: 'Casal se separa. Quem fica com o cachorro? Ambos querem. Solução: Regulamentamos guarda compartilhada do pet, com cronograma de visitação e custos de veterinário e alimentação divididos. Sem ver isso como "propriedade", mas como responsabilidade familiar.',
      },
    ],
    diferenciais: [
      {
        titulo: 'Mediação e Solução Amigável',
        descricao: 'Separação é dolorosa; não precisa ser guerra. Facilitamos acordos que respeitam todos, especialmente filhos.',
      },
      {
        titulo: 'Atuação Judicial Estratégica',
        descricao: 'Se processo for necessário, atuamos com clareza. Argumentação sólida, documentação impecável, defesa eficiente.',
      },
      {
        titulo: 'Sensibilidade a Dinâmicas Familiares',
        descricao: 'Questões de família não são lógica pura; envolvem emoção, história, filhos. Entendemos isso e ajudamos você a navegar com inteligência.',
      },
      {
        titulo: 'Inovação: Guarda de Pets',
        descricao: 'Reconhecemos a realidade de que animais são membros da família. Oferecemos regularização jurídica séria para essas situações.',
      },
    ],
  },
  {
    id: '5',
    slug: 'direito-animal',
    titulo: 'Direito Animal',
    descricaoCurta: 'Proteção animal, denúncia de maus-tratos e conformidade legal com bem-estar animal.',
    imagem: '/mna-area-animal-web.jpg',
    cor: '#7ED321',
    introducao: [
      'Proteção animal não é luxo nem sentimentalismo — é questão de lei, dignidade e responsabilidade. No Brasil, maus-tratos a animais são crime (Lei Araçoiaba, Lei de Proteção Animal). Para donos de pets, criar e cuidar de animais de estimação é privilégio que vem com obrigações legais.',
      'O Moreira Neto, ao lado da AMAA (Associação de Amigos dos Animais de Realeza/PR), oferece assessoria jurídica completa em direito animal: desde denúncia estratégica de maus-tratos até suporte a vítimas de abusos contra seus pets, passando por regulamentação de guarda e ações de indenização.',
    ],
    questoes: [
      {
        titulo: 'Denúncia de Maus-Tratos',
        descricao: 'Como denunciar legalmente, que órgãos acionados (Polícia Civil, Polícia Ambiental, MP), documentação necessária, proteção de denunciante',
      },
      {
        titulo: 'Guarda e Regulamentação de Pets',
        descricao: 'Determinação de posse/custódia em separações, heranças, casos de negligência',
      },
      {
        titulo: 'Ações de Indenização por Maus-Tratos',
        descricao: 'Quando animal é ferido por terceiro, responsabilidade civil do agressor, quantificação de danos',
      },
      {
        titulo: 'Suporte a Vítimas com Pets Feridos',
        descricao: 'Acompanhamento jurídico de pessoas cujos animais de estimação foram prejudicados, defesa de direitos',
      },
      {
        titulo: 'Negligência e Abandono',
        descricao: 'Acionamento de medidas legais contra proprietários que abandonam ou negligenciam animais',
      },
      {
        titulo: 'Ferimentos a Animais Causados por Terceiros',
        descricao: 'Quando outro cão ataca seu; quando carro atropela; quando pessoa agride; responsabilização do responsável',
      },
    ],
    exemplos: [
      {
        cenario: 'Cenário 1: Denúncia de Maus-Tratos',
        descricao: 'Vizinho deixa cães presos ao relento, sem água, magros, feridos. Você e comunidade tentam denunciar, mas não sabem por onde começar. Solução: Orientamos sobre como documentar (fotos, vídeos, relatórios), a qual órgão denunciar (Delegacia de Polícia, Polícia Ambiental, Ministério Público), como proteger sua identidade. Acompanhamos o processo até condenação do abusador.',
      },
      {
        cenario: 'Cenário 2: Indenização por Ataque',
        descricao: 'Seu cão foi atacado por cão solto de vizinho; levou 15 pontos, internação, trauma. Vizinho se nega a pagar veterinário. Solução: Acionamos responsabilidade civil do vizinho (é obrigação dele manter animal sob controle), quantificamos custos veterinários + sofrimento do animal, enviamos notificação formal. Vizinho paga acordo ou responde em ação.',
      },
      {
        cenario: 'Cenário 3: Separação com Pet Negligenciado',
        descricao: 'Casal que se separa; ambos queriam ficar com o pet. Animal estava sendo negligenciado por ambos. Solução: Regulamentamos guarda do animal com terceiro de confiança (ou instituição de proteção) até que condições adequadas fossem atendidas; exigimos veterinário aprovasse nova guarda.',
      },
    ],
    diferenciais: [
      {
        titulo: 'Especialização + Sensibilidade',
        descricao: 'Não tratamos animal como propriedade desimportante. Entendemos que é ser vivo que merece proteção legal.',
      },
      {
        titulo: 'Rede com AMAA',
        descricao: 'Parceria com a Associação de Amigos dos Animais de Realeza permite recursos, documentação especializada, apoio em denúncias.',
      },
      {
        titulo: 'Atuação Estratégica em Denúncias',
        descricao: 'Saber denunciar corretamente evita que abusador escape por tecnicismo. Orientamos documentação, órgão certo, timing estratégico.',
      },
      {
        titulo: 'Suporte Integral',
        descricao: 'Do momento do abuso até a condenação, você tem advogado acompanhando. Não é apenas ação judicial; é proteção de direitos de quem foi prejudicado.',
      },
    ],
  },
  {
    id: '6',
    slug: 'direito-geral',
    titulo: 'Direito Geral',
    descricaoCurta: 'Consultoria em diversos temas jurídicos e assessoria administrativa.',
    imagem: '/mna-area-geral-web.jpg',
    cor: '#9B59B6',
    introducao: [
      'Nem tudo cabe perfeitamente em categorias. Existem questões jurídicas diversas que afetam pessoas e empresas: desde consultoria sobre direitos consumeristas até assessoria administrativa, passando por questões comerciais pontuais.',
      'O Moreira Neto oferece consultoria jurídica generalista para essas situações, com a mesma filosofia: solução estratégica antes de litígio, atuação judicial inteligente quando necessário.',
    ],
    questoes: [
      {
        titulo: 'Consultoria Comercial Diversa',
        descricao: 'Análise de oportunidades, riscos em negócios, parcerias comerciais',
      },
      {
        titulo: 'Direitos do Consumidor',
        descricao: 'Defesa contra práticas abusivas, cobranças indevidas, produtos/serviços defeituosos',
      },
      {
        titulo: 'Questões Administrativas',
        descricao: 'Licenças, conformidade regulatória, orientação sobre órgãos públicos',
      },
      {
        titulo: 'Conflitos Pontuais',
        descricao: 'Situações que não se enquadram em áreas específicas, mas precisam de orientação jurídica',
      },
      {
        titulo: 'Negociações Gerais',
        descricao: 'Quando você precisa resolver algo sem ir a juízo; atuamos como facilitadores',
      },
    ],
    exemplos: [
      {
        cenario: 'Cenário 1: Cobrança Indevida',
        descricao: 'Empresa recebeu cobrança de dívida antiga que já tinha pago. Credor insiste, ameaça protesto. Solução: Reunimos comprovantes de pagamento, enviamos notificação formal, acionamos cadastro de protesto. Credor recua, reconhece erro.',
      },
      {
        cenario: 'Cenário 2: Vício em Produto',
        descricao: 'Consumidor comprou produto que apresenta vício. Loja se nega a trocar. Solução: Acionamos Lei do Consumidor, oferecemos negociação (troca ou reembolso), orientamos sobre direitos. Loja cede antes de ação.',
      },
    ],
    diferenciais: [
      {
        titulo: 'Flexibilidade',
        descricao: 'Questões diversas precisam de abordagem customizada. Não oferecemos solução genérica.',
      },
      {
        titulo: 'Estratégia Extrajudicial',
        descricao: 'Antes de juízo, tentamos resolver. Acordos bem estruturados economizam tempo e dinheiro.',
      },
      {
        titulo: 'Rede Especializada',
        descricao: 'Se necessário, articulamos com especialistas em áreas complementares. Você tem um ponto de contato; a gente coordena.',
      },
    ],
  },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find(area => area.slug === slug);
}

export function getAllAreasSlug(): string[] {
  return AREAS.map(area => area.slug);
}
