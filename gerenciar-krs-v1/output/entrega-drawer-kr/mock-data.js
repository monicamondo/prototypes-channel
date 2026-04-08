/* ─── Estado da aplicação ────────────────────── */
    let currentObjectiveId = null;
    let showArquivados = false;
    let krSearchTerm = '';
    let krFilterType = 'todos';

    const krData = {
      1: [
        {
          id: 1,
          type: 'quantitativo',
          name: 'Taxa de crescimento de receita',
          unidade: '%',
          polaridade: 'Maior é melhor',
          baseline: 0,
          meta: 20,
          valorAtual: 8,
          peso: 1,
          progresso: 40,
          status: 'red',
          ultimaMedicao: '2026-02-10',
          inativo: false,
          arquivado: false,
          medicoes: [
            { data: '2026-01-15', valor: 4, comentario: 'Início do ciclo' },
            { data: '2026-02-10', valor: 8, comentario: 'Avanço nas vendas' },
          ]
        },
        {
          id: 2,
          type: 'quantitativo',
          name: 'NPS de clientes',
          unidade: 'Pontos',
          polaridade: 'Maior é melhor',
          baseline: 30,
          meta: 70,
          valorAtual: 52,
          peso: 1,
          progresso: 55,
          status: 'red',
          ultimaMedicao: '2026-03-01',
          inativo: false,
          arquivado: false,
          medicoes: [
            { data: '2026-03-01', valor: 52, comentario: '' }
          ]
        },
        {
          id: 3,
          type: 'qualitativo',
          name: 'Implantação do processo de onboarding',
          unidade: null,
          polaridade: null,
          situacaoAtual: 'Processo feito manualmente, sem padrão definido.',
          situacaoDesejada: 'Processo documentado e executado via plataforma digital.',
          progresso: 100,
          status: 'green',
          ultimaMedicao: '2026-03-15',
          inativo: false,
          arquivado: true,
          medicoes: []
        },
        {
          id: 4,
          type: 'quantitativo',
          name: 'Redução de Custo Operacional',
          unidade: '%',
          polaridade: 'Menor é melhor',
          baseline: 100,
          meta: 80,
          valorAtual: 94,
          peso: 1,
          progresso: 30,
          status: 'red',
          ultimaMedicao: '2026-01-20',
          inativo: false,
          arquivado: false,
          medicoes: [
            { data: '2025-12-10', valor: 98, comentario: 'Baseline do ciclo' },
            { data: '2026-01-20', valor: 94, comentario: 'Leve melhora após revisão de contratos' }
          ]
        }
      ],
      2: [
        {
          id: 21,
          type: 'quantitativo',
          name: 'Taxa de Retenção de Clientes',
          unidade: '%',
          polaridade: 'Maior é melhor',
          baseline: 60,
          meta: 85,
          valorAtual: 78,
          peso: 1,
          progresso: 72,
          status: 'yellow',
          ultimaMedicao: '2026-03-10',
          inativo: false,
          arquivado: false,
          medicoes: [
            { data: '2026-01-10', valor: 62, comentario: 'Baseline inicial' },
            { data: '2026-02-05', valor: 71, comentario: 'Campanha de fidelização ativada' },
            { data: '2026-03-10', valor: 78, comentario: 'Resultado parcial Q1' }
          ]
        },
        {
          id: 22,
          type: 'qualitativo',
          name: 'Programa de Fidelidade Implantado',
          unidade: null,
          polaridade: null,
          situacaoAtual: 'Programa em fase de testes com grupo piloto de 200 clientes.',
          situacaoDesejada: 'Programa ativo para todos os clientes com mais de 6 meses de conta.',
          progresso: 0,
          status: 'red',
          ultimaMedicao: null,
          inativo: false,
          arquivado: false,
          medicoes: []
        }
      ],
      3: [
        {
          id: 31,
          type: 'quantitativo',
          name: 'Redução de Despesas com Terceiros',
          unidade: 'R$',
          polaridade: 'Menor é melhor',
          baseline: 500000,
          meta: 380000,
          valorAtual: 430000,
          peso: 1.5,
          progresso: 58,
          status: 'red',
          ultimaMedicao: '2026-02-28',
          inativo: false,
          arquivado: false,
          medicoes: [
            { data: '2026-01-31', valor: 490000, comentario: 'Janeiro: revisão de contratos iniciada' },
            { data: '2026-02-28', valor: 430000, comentario: 'Fevereiro: renegociação de 3 fornecedores' }
          ]
        }
      ],
      4: []
    };
    const objectiveConfigs = {
      1: [
        { label: 'Crítico', color: '#D32F2F', rangeStr: '(-1000 - 50%)', min: -1000, max: 50 },
        { label: 'Abaixo da meta', color: '#F57C00', rangeStr: '(50% - 70%)', min: 50, max: 70 },
        { label: 'Atenção', color: '#FFB300', rangeStr: '(70% - 95%)', min: 70, max: 95 },
        { label: 'Meta atingida', color: '#43A047', rangeStr: '(95% - 120%)', min: 95, max: 120 },
        { label: 'Superação', color: '#0288D1', rangeStr: '(120% - 1000%)', min: 120, max: 1000 }
      ],
      2: [
        { label: 'Risco Elevado', color: '#C2185B', rangeStr: '(-1000 - 60%)', min: -1000, max: 60 },
        { label: 'Dentro do Esperado', color: '#00897B', rangeStr: '(60% - 100%)', min: 60, max: 100 },
        { label: 'Excepcional', color: '#8E24AA', rangeStr: '(100% - 1000%)', min: 100, max: 1000 }
      ],
      3: [
        { label: 'Deficitário', color: '#E53935', rangeStr: '(-1000 - 80%)', min: -1000, max: 80 },
        { label: 'Adequado', color: '#1E88E5', rangeStr: '(80% - 1000%)', min: 80, max: 1000 }
      ]
    };
    const defaultConfig = [
      { label: 'Abaixo da meta', color: '#F4511E', rangeStr: '(-1000 - 70%)', min: -1000, max: 70 },
      { label: 'Atenção', color: '#FFCA28', rangeStr: '(70% - 95%)', min: 70, max: 95 },
      { label: 'Meta atingida', color: '#7CB342', rangeStr: '(95% - 1000%)', min: 95, max: 1000 }
    ];

    function getKRHealth(progresso) {
      if (progresso == null || progresso === undefined) return { label: 'Sem medições', color: '#AAAAAA' };
      const config = objectiveConfigs[currentObjectiveId] || defaultConfig;
      for (const item of config) {
        if (progresso >= item.min && progresso < item.max) return item;
      }
      return config[config.length - 1]; // clamp ao maior possível
    }

    function toggleLegendDropdown() {
      const dropup = document.getElementById('legend-dropup');
      const chevron = document.getElementById('legend-chevron');
      if (dropup.style.display === 'none') {
        dropup.style.display = 'block';
        chevron.classList.replace('fa-chevron-up', 'fa-chevron-down');
      } else {
        dropup.style.display = 'none';
        chevron.classList.replace('fa-chevron-down', 'fa-chevron-up');
      }
    }

    function renderLegend() {
      const dropupContent = document.getElementById('legend-dropup-content');
      const config = objectiveConfigs[currentObjectiveId] || defaultConfig;
      dropupContent.innerHTML = config.map(item => `
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:12px; height:12px; border-radius:50%; background:${item.color}; display:inline-block;"></span>
          <span style="font-size:11px; color:#333;">${item.label}</span>
          <span style="font-size:10px; color:#888;">${item.rangeStr}</span>
        </div>
      `).join('');
    }