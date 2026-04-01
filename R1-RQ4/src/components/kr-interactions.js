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

    /* ─── Drawer ─────────────────────────────────── */
    function openDrawer(objectiveName, objectiveId) {
      closeAllMenus();
      currentObjectiveId = objectiveId;
      krSearchTerm = '';
      krFilterType = 'todos';
      document.getElementById('drawer-objective-name').textContent = objectiveName;
      document.getElementById('drawer-overlay').classList.add('is-open');
      document.getElementById('drawer-panel').classList.add('is-open');
      renderKRList();
    }

    function closeDrawer() {
      document.getElementById('drawer-overlay').classList.remove('is-open');
      document.getElementById('drawer-panel').classList.remove('is-open');
    }

    function toggleArquivados() {
      showArquivados = !showArquivados;
      const btn = document.getElementById('btn-arquivados');
      btn.style.background = showArquivados ? '#E8F4F8' : '';
      btn.style.borderColor = showArquivados ? '#5C7CFA' : '';
      renderKRList();
    }

    function setKRFilter(type) {
      krFilterType = type;
      ['todos', 'quantitativo', 'qualitativo', 'atrasados'].forEach(t => {
        const btn = document.getElementById('filter-' + t);
        if (btn) btn.classList.toggle('active', t === type);
      });
      renderKRList();
    }

    function applyKRFilter() {
      krSearchTerm = (document.getElementById('kr-search-input').value || '').toLowerCase();
      renderKRList();
    }

    /* ─── Formatador de valor com suporte a moeda ───── */
    function fmtVal(value, unidade) {
      if (value === undefined || value === null) return '—';
      if (unidade === 'R$') {
        return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      if (unidade === '%') return value + unidade;
      return value + (unidade ? ' ' + unidade : '');
    }

    function renderKRList() {
      const body = document.getElementById('drawer-body');
            const allKRs = krData[currentObjectiveId] || [];
      const elCount = document.getElementById('count-arquivados');
      if (elCount) {
        elCount.innerText = allKRs.filter(kr => kr.arquivado).length;
      }

      let list = allKRs.filter(kr => showArquivados || !kr.arquivado);

      // Filtro por tipo
      if (krFilterType !== 'todos') {
        if (krFilterType === 'atrasados') {
          const hoje = new Date();
          list = list.filter(kr => {
            if (kr.type !== 'quantitativo') return false;
            if (!kr.ultimaMedicao) return true;
            const ultima = new Date(kr.ultimaMedicao);
            return Math.floor((hoje - ultima) / (1000 * 60 * 60 * 24)) > 30;
          });
        } else {
          list = list.filter(kr => kr.type === krFilterType);
        }
      }
      // Filtro por busca
      if (krSearchTerm) {
        list = list.filter(kr => kr.name.toLowerCase().includes(krSearchTerm));
      }

      if (list.length === 0) {
        body.innerHTML = `
      <div class="kr-empty">
        <i class="fa fa-flag-o"></i>
        Nenhum Key Result cadastrado para este objetivo.<br/>
        <small style="margin-top:8px;display:block;">Clique em <strong>Incluir KR</strong> para começar.</small>
      </div>`;
        return;
      }

      const statusColor = { red: 'kr-status-red', yellow: 'kr-status-yellow', green: 'kr-status-green', gray: 'kr-status-gray' };
      const statusLabel = { red: 'Abaixo da meta', yellow: 'Atenção', green: 'Meta atingida', gray: 'Sem medições' };

      body.innerHTML = `<div class="kr-list">${list.map(kr => {
        const arqClass = kr.arquivado ? 'kr-card-archived' : '';
        // Alerta de inatividade só se aplica a KRs quantitativos
        const hoje = new Date();
        let alertBadge = '';
        if (!kr.arquivado && kr.type === 'quantitativo') {
          if (!kr.ultimaMedicao) {
            alertBadge = `<span class="kr-alert-badge" title="KR sem atualização há mais de 30 dias">
              <svg viewBox="0 0 16 14" width="16" height="14" xmlns="http://www.w3.org/2000/svg">
                <polygon points="8,1 15,13 1,13" fill="#E6B800" stroke="#C8960A" stroke-width="0.5"/>
                <text x="8" y="11.5" text-anchor="middle" font-size="8" font-weight="bold" fill="#fff">!</text>
              </svg>
            </span>`;
          } else {
            const ultima = new Date(kr.ultimaMedicao);
            const diffDays = Math.floor((hoje - ultima) / (1000 * 60 * 60 * 24));
            if (diffDays > 30) {
              alertBadge = `<span class="kr-alert-badge" title="KR sem atualização há ${diffDays} dias">
                <svg viewBox="0 0 16 14" width="16" height="14" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="8,1 15,13 1,13" fill="#E6B800" stroke="#C8960A" stroke-width="0.5"/>
                  <text x="8" y="11.5" text-anchor="middle" font-size="8" font-weight="bold" fill="#fff">!</text>
                </svg>
              </span>`;
            }
          }
        }
        const barColor = kr.status === 'green' ? '#4CAF50' : kr.status === 'yellow' ? '#E6B800' : '#CC3333';
        const pct = Math.max(0, Math.min(100, kr.progresso));

        // Coluna Últ. Medição (só para quantitativo)
        const ultMedicaoCol = kr.type === 'quantitativo' ? (kr.ultimaMedicao ? `
      <div class="kr-col kr-col-medicao">
        <span class="kr-meta-label">Ult. Medição</span>
        <span class="kr-meta-value">${kr.ultimaMedicao}</span>
        <span class="kr-meta-sub">${fmtVal(kr.valorAtual, kr.unidade)}</span>
      </div>` : `
      <div class="kr-col kr-col-medicao">
        <span class="kr-meta-label">Ult. Medição</span>
        <span class="kr-meta-value" style="color:#999;">—</span>
      </div>`) : '';

        // Body de colunas conforme tipo
        const quantInfo = kr.type === 'quantitativo' ? `
      <div class="kr-col">
        <span class="kr-meta-label">Baseline</span>
        <span class="kr-meta-value">${fmtVal(kr.baseline, kr.unidade)}</span>
      </div>
      <div class="kr-col">
        <span class="kr-meta-label">Atual</span>
        <span class="kr-meta-value">${fmtVal(kr.valorAtual, kr.unidade)}</span>
      </div>
      <div class="kr-col">
        <span class="kr-meta-label">Meta</span>
        <span class="kr-meta-value">${fmtVal(kr.meta, kr.unidade)}</span>
      </div>
      ${ultMedicaoCol}
      <div class="kr-col kr-col-progress">
        <span class="kr-meta-label">Progresso</span>
        <div class="kr-progress-bar-bg">
          <div class="kr-progress-bar-fill" style="width:${pct}%;background:${barColor};"></div>
        </div>
        <div class="kr-progress-pct">${pct}%</div>
      </div>` : `
      <div class="kr-col kr-col-text">
        <span class="kr-meta-label">Situa\u00e7\u00e3o Atual</span>
        <span class="kr-meta-value" style="font-weight:normal; font-size:11px; color:#333; white-space:normal;">${kr.situacaoAtual || '<em style="color:#999;">N\u00e3o informado</em>'}</span>
      </div>
      <div class="kr-col kr-col-text">
        <span class="kr-meta-label">Situa\u00e7\u00e3o Desejada</span>
        <span class="kr-meta-value" style="font-weight:normal; font-size:11px; color:#333; white-space:normal;">${kr.situacaoDesejada || '<em style="color:#999;">N\u00e3o informado</em>'}</span>
      </div>
      <div class="kr-col" style="flex-shrink:0; min-width:90px;">
        <span class="kr-meta-label">Status</span>
        <span class="kr-meta-value" style="color:${barColor};">${kr.progresso === 100 ? '\u2714 Alcan\u00e7ado' : '\u2715 N\u00e3o alcan\u00e7ado'}</span>
      </div>`;

        const arquivarLabel = kr.arquivado ? 'Desarquivar' : 'Arquivar';
        const excluirBloq = kr.medicoes && kr.medicoes.length > 0;

        // Painel expandido: tipos diferentes de conteúdo
        const chartSVG = kr.type === 'quantitativo' ? buildKRChart(kr) : null;

        const detalhePanel = kr.type === 'quantitativo' ? `
      <div class="kr-detail-panel" id="kr-detail-${kr.id}">
        <div class="kr-detail-section-title"><i class="fa fa-bar-chart"></i> Evolu\u00e7\u00e3o</div>
        <div class="kr-chart-wrap">${chartSVG}</div>
        <div class="kr-detail-section-title"><i class="fa fa-info-circle"></i> Informa\u00e7\u00f5es</div>
        <div class="kr-info-grid">
          <div class="kr-info-item"><span class="kr-info-label">Unidade</span><span class="kr-info-value">${kr.unidade || '—'}</span></div>
          <div class="kr-info-item"><span class="kr-info-label">Polaridade</span><span class="kr-info-value">${kr.polaridade || '—'}</span></div>
          <div class="kr-info-item"><span class="kr-info-label">Baseline</span><span class="kr-info-value">${fmtVal(kr.baseline, kr.unidade)}</span></div>
          <div class="kr-info-item"><span class="kr-info-label">Meta</span><span class="kr-info-value">${fmtVal(kr.meta, kr.unidade)}</span></div>
          <div class="kr-info-item"><span class="kr-info-label">Peso</span><span class="kr-info-value">${kr.peso || 1}</span></div>
        </div>
        ${kr.medicoes && kr.medicoes.length > 0 ? renderMedicoes(kr) : '<p style="font-size:11px;color:#888;">Nenhuma medi\u00e7\u00e3o registrada.</p>'}
      </div>` : `
      <div class="kr-detail-panel" id="kr-detail-${kr.id}">
        <div class="kr-detail-section-title"><i class="fa fa-align-left"></i> Descri\u00e7\u00e3o do KR Qualitativo</div>
        <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:12px;">
          <div style="flex:1; min-width:180px;">
            <div class="kr-meta-label" style="margin-bottom:4px;">Situa\u00e7\u00e3o Atual</div>
            <div style="font-size:11px;color:#333;background:#F5F5F5;border:1px solid #DDD;padding:6px 8px;">${kr.situacaoAtual || '<em style="color:#999;">N\u00e3o informado</em>'}</div>
          </div>
          <div style="flex:1; min-width:180px;">
            <div class="kr-meta-label" style="margin-bottom:4px;">Situa\u00e7\u00e3o Desejada</div>
            <div style="font-size:11px;color:#333;background:#F5F5F5;border:1px solid #DDD;padding:6px 8px;">${kr.situacaoDesejada || '<em style="color:#999;">N\u00e3o informado</em>'}</div>
          </div>
        </div>
        <div class="kr-detail-section-title"><i class="fa fa-check-circle"></i> Status de Atingimento</div>
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
          <span style="font-size:13px;font-weight:bold;color:${barColor};">${kr.progresso === 100 ? '\u2714 Alcan\u00e7ado' : '\u2715 N\u00e3o alcan\u00e7ado'}</span>
          ${!kr.arquivado ? `<button class="btn-kr-action" onclick="toggleAlcancadoKR(${kr.id})">
            <i class="fa fa-${kr.progresso === 100 ? 'times' : 'check'}"></i>
            ${kr.progresso === 100 ? 'Desmarcar' : 'Marcar como Alcan\u00e7ado'}
          </button>` : ''}
        </div>
      </div>`;

        // Botão principal: quantitativo → Medição | qualitativo → toggle alcançado
        const primaryAction = kr.type === 'quantitativo' && !kr.arquivado
          ? `<button class="btn-kr-action" onclick="openModalMedicao(${kr.id}, '${kr.name}')">
               <i class="fa fa-plus"></i> Medi\u00e7\u00e3o
             </button>`
          : kr.type === 'qualitativo' && !kr.arquivado
            ? `<button class="btn-kr-action" onclick="toggleAlcancadoKR(${kr.id})" title="${kr.progresso === 100 ? 'Desmarcar' : 'Marcar como alcan\u00e7ado'}">
               <i class="fa fa-${kr.progresso === 100 ? 'times' : 'check'}"></i>
               ${kr.progresso === 100 ? 'Desmarcar' : '\u2714 Alcan\u00e7ado'}
             </button>`
            : '';

        return `
      <div class="kr-card ${arqClass}" id="kr-card-${kr.id}">
        <div class="kr-card-header">
          <span class="kr-status-dot ${statusColor[kr.status] || 'kr-status-gray'}"
            title="${statusLabel[kr.status] || ''}"></span>
          <span class="kr-card-name" onclick="toggleKRDetail(${kr.id})" title="Clique para ver detalhes">${kr.name}</span>
          ${alertBadge}
          <div class="kr-card-actions" style="margin-left:auto;">
            ${primaryAction}
            <button class="btn-kr-action" onclick="editarKR(${kr.id})" title="Editar">
              <i class="fa fa-pencil"></i>
            </button>
            <button class="btn-kr-action" onclick="toggleArquivarKR(${kr.id})">
              <i class="fa fa-archive"></i> ${arquivarLabel}
            </button>
            <button class="btn-kr-action danger"
              ${excluirBloq
            ? `onclick="alert('Este KR n\u00e3o pode ser exclu\u00eddo, pois possui medi\u00e7\u00f5es registradas. Para manter o hist\u00f3rico, utilize a op\u00e7\u00e3o de arquivamento.')" title="Possui medi\u00e7\u00f5es \u2014 use Arquivar"`
            : `onclick="excluirKR(${kr.id})" title="Excluir KR"`}>
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="kr-card-body">
          ${quantInfo}
        </div>
        ${detalhePanel}
      </div>`;
      }).join('')}</div>`;
    }

    function renderMedicoes(kr) {
      return `
    <div class="medicoes-section">
      <div class="medicoes-header">
        <span><i class="fa fa-history"></i> Histórico de Medições</span>
        <span style="font-size:10px;color:#666;">${kr.medicoes.length} registro(s)</span>
      </div>
      <table class="medicoes-table">
        <thead>
          <tr>
            <th style="width:100px;">Data</th>
            <th style="width:80px;">Valor</th>
            <th>Comentário</th>
            <th style="width:60px;text-align:center;">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${kr.medicoes.map((m, i) => `
            <tr>
              <td>${m.data}</td>
              <td>${fmtVal(m.valor, kr.unidade)}</td>
              <td>${m.comentario || '<span style="color:#999;">\u2014</span>'}</td>
              <td style="text-align:center;">
                <button class="btn-kr-action" style="font-size:9px;padding:1px 5px;"
                  onclick="editarMedicao(${kr.id}, ${i})"><i class="fa fa-pencil"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
    }

    /* ─── Toggle Alcançado (KR Qualitativo) ─────── */
    function toggleAlcancadoKR(krId) {
      const lista = krData[currentObjectiveId];
      const kr = lista && lista.find(k => k.id === krId);
      if (!kr || kr.type !== 'qualitativo') return;
      kr.progresso = kr.progresso === 100 ? 0 : 100;
      kr.status = kr.progresso === 100 ? 'green' : 'red';
      renderKRList();
    }

    /* ─── Gráfico SVG (RF004) ────────────────────── */
    function buildKRChart(kr) {
      const meds = kr.medicoes;
      const W = 500, H = 80, PAD = 10;

      if (!meds || meds.length === 0) {
        return `<svg viewBox="0 0 ${W} ${H}"><text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-size="11" fill="#999">Nenhuma medição registrada</text></svg>`;
      }

      const vals = meds.map(m => m.valor);
      const minV = Math.min(kr.baseline, ...vals);
      const maxV = Math.max(kr.meta, ...vals);
      const range = maxV - minV || 1;

      const toX = i => PAD + (i / Math.max(meds.length - 1, 1)) * (W - PAD * 2);
      const toY = v => H - PAD - ((v - minV) / range) * (H - PAD * 2);

      // Linha da meta (tracejada)
      const metaY = toY(kr.meta);
      const metaLine = `<line x1="${PAD}" y1="${metaY}" x2="${W - PAD}" y2="${metaY}" stroke="#4CAF50" stroke-width="1" stroke-dasharray="4,3" opacity="0.7"/>`;
      const metaLabel = `<text x="${W - PAD + 2}" y="${metaY + 4}" font-size="9" fill="#4CAF50">Meta</text>`;

      const pts = meds.map((m, i) => `${toX(i)},${toY(m.valor)}`).join(' ');
      const polyline = `<polyline points="${pts}" fill="none" stroke="#1565C0" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

      const dots = meds.map((m, i) => {
        const cx = toX(i), cy = toY(m.valor);
        const color = m.valor >= kr.meta * 0.95 ? '#4CAF50' : m.valor >= kr.meta * 0.70 ? '#E6B800' : '#CC3333';
        return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${color}" stroke="#fff" stroke-width="1"/>
          <title>${m.data}: ${m.valor} ${kr.unidade}</title>`;
      }).join('');

      const dateLabels = meds.map((m, i) => {
        const anchor = i === 0 ? 'start' : i === meds.length - 1 ? 'end' : 'middle';
        return `<text x="${toX(i)}" y="${H + 2}" text-anchor="${anchor}" font-size="8" fill="#888">${m.data.slice(0, 5)}</text>`;
      }).join('');

      return `<svg viewBox="0 0 ${W} ${H + 12}" style="overflow:visible">
        ${metaLine}${metaLabel}
        ${polyline}${dots}
        ${dateLabels}
      </svg>`;
    }

    /* ─── Toggle Detalhe do KR ───────────────────── */
    function toggleKRDetail(krId) {
      const panel = document.getElementById('kr-detail-' + krId);
      if (panel) panel.classList.toggle('is-open');
    }

    /* ─── Modal KR ───────────────────────────────── */
    function openModalKR(krId) {
      document.getElementById('modal-kr-title').textContent = krId ? 'Editar Key Result' : 'Incluir Key Result';
      switchKRTab('quantitativo');
      document.getElementById('modal-kr-overlay').classList.add('is-open');
    }

    function closeModalKR() {
      document.getElementById('modal-kr-overlay').classList.remove('is-open');
    }

    function salvarKR() {
      const kr = {
        id: Date.now(),
        type: document.querySelector('.kr-type-tab.active').dataset.tab,
        name: document.querySelector('#panel-' + document.querySelector('.kr-type-tab.active').dataset.tab + ' input[type="text"]').value || 'Novo KR',
        unidade: '%',
        polaridade: 'Maior é melhor',
        baseline: 0,
        meta: 100,
        valorAtual: 0,
        peso: 1,
        progresso: 0,
        status: 'gray',
        ultimaMedicao: null,
        inativo: true,
        arquivado: false,
        medicoes: []
      };
      if (!krData[currentObjectiveId]) krData[currentObjectiveId] = [];
      krData[currentObjectiveId].push(kr);
      closeModalKR();
      renderKRList();
    }

    function editarKR(id) {
      openModalKR(id);
    }

    function toggleArquivarKR(id) {
      const lista = krData[currentObjectiveId];
      const kr = lista.find(k => k.id === id);
      if (kr) {
        kr.arquivado = !kr.arquivado;
        renderKRList();
      }
    }

    function excluirKR(id) {
      if (!confirm('Deseja excluir este KR?')) return;
      krData[currentObjectiveId] = krData[currentObjectiveId].filter(k => k.id !== id);
      renderKRList();
    }

    function switchKRTab(tab) {
      document.querySelectorAll('.kr-type-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
      });
      document.querySelectorAll('.kr-type-panel').forEach(p => {
        p.classList.toggle('active', p.id === 'panel-' + tab);
      });
    }

    /* ─── Modal Medição ──────────────────────────── */
    let currentMedicaoKRId = null;

    function openModalMedicao(krId, krName) {
      currentMedicaoKRId = krId;
      document.getElementById('medicao-kr-name').textContent = krName;
      document.getElementById('medicao-valor').value = '';
      document.getElementById('medicao-comentario').value = '';
      document.getElementById('modal-medicao-overlay').classList.add('is-open');
    }

    function closeModalMedicao() {
      document.getElementById('modal-medicao-overlay').classList.remove('is-open');
    }

    function salvarMedicao() {
      const valor = parseFloat(document.getElementById('medicao-valor').value);
      const data = document.getElementById('medicao-data').value;
      const comentario = document.getElementById('medicao-comentario').value;

      if (isNaN(valor)) { alert('Informe um valor válido.'); return; }

      const lista = krData[currentObjectiveId];
      const kr = lista.find(k => k.id === currentMedicaoKRId);
      if (kr) {
        kr.medicoes.push({ data, valor, comentario });
        kr.valorAtual = valor;
        // Recalcula progresso (Maior é melhor)
        if (kr.meta !== kr.baseline) {
          const p = Math.round(((valor - kr.baseline) / (kr.meta - kr.baseline)) * 100);
          kr.progresso = p;
          kr.status = p >= 95 ? 'green' : p >= 70 ? 'yellow' : 'red';
        }
        kr.inativo = false;
        kr.ultimaMedicao = data;
      }
      closeModalMedicao();
      renderKRList();
    }

    function editarMedicao(krId, idx) {
      const kr = krData[currentObjectiveId].find(k => k.id === krId);
      if (!kr) return;
      const m = kr.medicoes[idx];
      document.getElementById('medicao-kr-name').textContent = kr.name;
      document.getElementById('medicao-data').value = m.data;
      document.getElementById('medicao-valor').value = m.valor;
      document.getElementById('medicao-comentario').value = m.comentario;
      currentMedicaoKRId = krId;
      document.getElementById('modal-medicao-overlay').classList.add('is-open');
    }

    /* ─── Context Menu (DS-Channel Submenu) ──────── */
    function closeAllMenus() {
      // Usado para fechar submenus flutuantes por gatilho global.
      document.querySelectorAll('.legacy-action-submenu.is-open').forEach(menu => {
        menu.classList.remove('is-open');
      });
    }

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.legacy-action-submenu-wrapper .action-icon');

      // Close other existing menus
      document.querySelectorAll('.legacy-action-submenu.is-open').forEach(menu => {
        if (trigger && menu.previousElementSibling === trigger) return;
        menu.classList.remove('is-open');
      });

      if (trigger) {
        const submenu = trigger.nextElementSibling;
        if (submenu && submenu.classList.contains('legacy-action-submenu')) {
          submenu.classList.toggle('is-open');
        }
      }
    });

    /* ─── Prevent modal overlay click from closing modals ─ */
    document.querySelectorAll('.modal-box').forEach(box => {
      box.addEventListener('click', e => e.stopPropagation());
    });

    document.getElementById('modal-kr-overlay').addEventListener('click', closeModalKR);
    document.getElementById('modal-medicao-overlay').addEventListener('click', closeModalMedicao);
    document.getElementById('modal-editar-objetivo-overlay').addEventListener('click', closeModalEditarObjetivo);
    document.getElementById('modal-confirmacao-overlay').addEventListener('click', closeModalConfirmacao);
    document.getElementById('modal-remover-overlay').addEventListener('click', closeModalRemover);

    /* ─── Modal Desabilitar (Lâmpada) ─────────────── */
    function openModalConfirmacao() {
      document.getElementById('modal-confirmacao-overlay').classList.add('is-open');
    }

    function closeModalConfirmacao() {
      document.getElementById('modal-confirmacao-overlay').classList.remove('is-open');
    }

    /* ─── Modal Remover ─────────────── */
    function openModalRemover() {
      document.getElementById('modal-remover-overlay').classList.add('is-open');
    }

    function closeModalRemover() {
      document.getElementById('modal-remover-overlay').classList.remove('is-open');
    }

    /* ─── Modal Editar Objetivo Estratégico ───────── */
    function openModalEditarObjetivo() {
      document.getElementById('modal-editar-objetivo-overlay').classList.add('is-open');
    }

    function closeModalEditarObjetivo() {
      document.getElementById('modal-editar-objetivo-overlay').classList.remove('is-open');
    }

    /* ─── Navbar Interactions ──────────────────────────── */
    (function () {
      var navbar = document.getElementById('legacy-navbar');
      if (!navbar) return;
      var items = navbar.querySelectorAll('.navbar-item');

      items.forEach(function (item) {
        var trigger = item.querySelector('.navbar-item-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = item.classList.contains('is-open');
          // Fecha todos
          items.forEach(function (i) { i.classList.remove('is-open'); });
          // Abre este se estava fechado
          if (!isOpen) {
            closeAllMenus(); // se houver outro popover do sistema aberto
            item.classList.add('is-open');
          }
        });
      });

      // Clique fora fecha tudo
      document.addEventListener('click', function () {
        items.forEach(function (i) { i.classList.remove('is-open'); });
      });

      // Evita fechar ao clicar dentro do dropdown
      navbar.querySelectorAll('.navbar-dropdown').forEach(function (dd) {
        dd.addEventListener('click', function (e) { e.stopPropagation(); });
      });
    })();
