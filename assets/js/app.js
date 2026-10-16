(() => {
  'use strict';
  const STORAGE = { themes: 'meDebata.themes.v1', scores: 'meDebata.scores.v1', history: 'meDebata.history.v1' };
  const defaults = {
    subjects: ["Bombeiros", "Monges", "Bilionários", "Cachorros", "Políticos", "Estudantes", "Alienígenas", "Funkeiros", "Professores", "Influenciadores", "Filósofos", "Atletas", "Robôs", "Bebês", "Piratas", "Veterinários", "Cientistas", "Advogados", "Jogadores de futebol", "Síndicos", "Médicos", "Programadores", "Turistas", "Super-heróis", "Empresários", "Gatos", "Cantores", "Astronautas", "Juízes", "Chefes de cozinha"],
    verbs: ["defendem", "proíbem", "financiam", "controlam", "substituem", "governam", "destroem", "protegem", "legalizam", "privatizam", "perseguem", "inventam", "banem", "comercializam", "ensinam a dominar", "são superiores a", "deveriam administrar", "precisam salvar", "estão destruindo", "deveriam pagar por", "precisam abolir", "querem conquistar", "deveriam escolher", "não podem usar", "deveriam controlar", "precisam reconstruir", "merecem comandar", "deveriam estudar", "devem financiar", "não entendem"],
    objects: ["parques", "o Brasil", "a cerveja", "a faculdade", "a humanidade", "os videogames", "a economia", "a república", "o capitalismo", "os gatos", "a inteligência artificial", "o futebol", "o casamento", "o dinheiro", "Marte", "as redes sociais", "o transporte público", "os hospitais", "as universidades", "a internet", "as festas universitárias", "os impostos", "a democracia", "o planeta Terra", "os filmes de ação", "a pizza com abacaxi", "as segundas-feiras", "os trabalhos em grupo", "o mercado imobiliário", "os memes"]
  };
  const $ = id => document.getElementById(id);
  const safeParse = (value, fallback) => { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  let themes = safeParse(localStorage.getItem(STORAGE.themes), structuredCloneSafe(defaults));
  let scores = safeParse(localStorage.getItem(STORAGE.scores), {});
  let history = safeParse(localStorage.getItem(STORAGE.history), []);
  let current = { subject: 'Bombeiros', verb: 'defendem', object: 'parques' };
  let roundNumber = history.length + 1;
  let duration = 45, remaining = duration, timerInterval = null, rollingTimeout = null, toastTimeout = null;

  function structuredCloneSafe(obj) { return JSON.parse(JSON.stringify(obj)); }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); $('saved-indicator').textContent = '● Salvo neste navegador'; } catch { $('saved-indicator').textContent = '⚠ Não foi possível salvar'; } }
  function pick(list, fallback) { const valid = Array.isArray(list) ? list.filter(x => typeof x === 'string' && x.trim()) : []; return (valid.length ? valid : [fallback])[Math.floor(Math.random() * (valid.length || 1))]; }
  function thesis(t = current) { return `${t.subject} ${t.verb} ${t.object}.`; }
  function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('show'), 2500); }
  function renderCurrent() { $('subject-result').textContent = current.subject; $('verb-result').textContent = current.verb; $('object-result').textContent = current.object; $('thesis-result').textContent = thesis(); $('round-count').textContent = `Rodada ${roundNumber}`; }
  function spin() {
    const btn = $('spin-btn'); btn.disabled = true; document.querySelector('.reels').classList.add('rolling');
    let ticks = 0;
    const roll = setInterval(() => {
      current = { subject: pick(themes.subjects, 'Pessoas'), verb: pick(themes.verbs, 'debatem'), object: pick(themes.objects, 'ideias') };
      renderCurrent(); ticks++;
      if (ticks >= 12) { clearInterval(roll); document.querySelector('.reels').classList.remove('rolling'); btn.disabled = false; roundNumber = history.length + 1; renderCurrent(); $('winner-select').value = ''; toast('Tese sorteada. Que comece a treta!'); }
    }, 90);
  }
  function stopTimer() { if (timerInterval) clearInterval(timerInterval); timerInterval = null; $('timer-start').textContent = '▶ Iniciar'; }
  function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`; }
  function renderTimer() { $('timer-display').textContent = formatTime(remaining); }
  function startTimer() {
    if (timerInterval) { stopTimer(); return; }
    if (remaining <= 0) remaining = duration;
    $('timer-start').textContent = 'Ⅱ Pausar';
    timerInterval = setInterval(() => { remaining--; renderTimer(); if (remaining <= 0) { stopTimer(); toast('Tempo encerrado! Mediador, dê o veredito.'); } }, 1000);
  }
  function setDuration(value) { stopTimer(); duration = Number(value); remaining = duration; renderTimer(); document.querySelectorAll('.duration-option').forEach(b => b.classList.toggle('active', Number(b.dataset.seconds) === duration)); }
  function nameFor(side) { return $(`player-${side}`).value.trim() || (side === 'for' ? 'Jogador a favor' : 'Jogador contra'); }
  function recordResult() {
    const winner = $('winner-select').value;
    if (!winner) { toast('Escolha quem venceu antes de registrar.'); return; }
    const forName = nameFor('for'), againstName = nameFor('against');
    if (forName.toLowerCase() === againstName.toLowerCase()) { toast('Use nomes diferentes para os dois jogadores.'); return; }
    const entry = { id: Date.now(), thesis: thesis(), forName, againstName, winner, winnerName: winner === 'for' ? forName : winner === 'against' ? againstName : 'Empate', date: new Date().toISOString() };
    if (!scores[forName]) scores[forName] = { wins: 0, losses: 0, draws: 0 };
    if (!scores[againstName]) scores[againstName] = { wins: 0, losses: 0, draws: 0 };
    if (winner === 'for') { scores[forName].wins++; scores[againstName].losses++; }
    else if (winner === 'against') { scores[againstName].wins++; scores[forName].losses++; }
    else { scores[forName].draws++; scores[againstName].draws++; }
    history.unshift(entry); history = history.slice(0, 50);
    save(STORAGE.scores, scores); save(STORAGE.history, history); renderScoreboard(); renderHistory(); roundNumber = history.length + 1; $('round-count').textContent = `Rodada ${roundNumber}`; toast('Resultado registrado! Próxima tese?');
  }
  function renderScoreboard() {
    const root = $('scoreboard'), entries = Object.entries(scores).sort((a,b) => b[1].wins - a[1].wins || a[1].losses - b[1].losses || a[0].localeCompare(b[0]));
    root.classList.toggle('empty-state', !entries.length);
    if (!entries.length) { root.textContent = 'Registre a primeira rodada para montar o placar.'; return; }
    root.innerHTML = entries.map(([name, s]) => `<div class="score-row"><span class="score-name">${escapeHTML(name)}</span><span class="score-meta">${s.wins}V · ${s.losses}D · ${s.draws || 0}E</span><span class="score-wins">${s.wins} vit.</span></div>`).join('');
  }
  function renderHistory() {
    const root = $('history-list');
    if (!history.length) { root.innerHTML = '<li class="empty-state">Nenhum debate registrado ainda.</li>'; return; }
    root.innerHTML = history.slice(0, 10).map(item => `<li class="history-item"><div class="history-thesis">${escapeHTML(item.thesis)}</div><div class="history-result">${escapeHTML(item.forName)} (a favor) × ${escapeHTML(item.againstName)} (contra)<br>🏆 ${escapeHTML(item.winnerName)}</div><div class="history-date">${new Date(item.date).toLocaleString('pt-BR')}</div></li>`).join('');
  }
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function loadEditors() { $('subjects-editor').value = themes.subjects.join('\n'); $('verbs-editor').value = themes.verbs.join('\n'); $('objects-editor').value = themes.objects.join('\n'); }
  function saveThemes() {
    const parse = id => $(id).value.split(/\r?\n/).map(x => x.trim()).filter(Boolean).filter((x,i,a) => a.findIndex(y => y.toLocaleLowerCase() === x.toLocaleLowerCase()) === i);
    const next = { subjects: parse('subjects-editor'), verbs: parse('verbs-editor'), objects: parse('objects-editor') };
    const empty = Object.entries(next).find(([, arr]) => arr.length === 0);
    if (empty) { $('editor-message').textContent = 'Cada roleta precisa ter pelo menos uma opção.'; return; }
    themes = next; save(STORAGE.themes, themes); $('editor-message').textContent = `Salvo! ${themes.subjects.length} sujeitos, ${themes.verbs.length} verbos e ${themes.objects.length} complementos.`; toast('Roletas atualizadas.');
  }
  function downloadJSON(data, filename) { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
  function exportThemes() { downloadJSON({ version: 1, categories: themes }, 'me-debata-temas.json'); toast('Arquivo de temas exportado.'); }
  function importThemes(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const source = parsed.categories || parsed;
        const next = { subjects: source.subjects, verbs: source.verbs, objects: source.objects };
        if (!['subjects','verbs','objects'].every(k => Array.isArray(next[k]) && next[k].some(x => typeof x === 'string' && x.trim()))) throw new Error('Formato inválido');
        themes = Object.fromEntries(Object.entries(next).map(([k,v]) => [k, v.map(x => String(x).trim()).filter(Boolean)]));
        save(STORAGE.themes, themes); loadEditors(); toast('Temas importados com sucesso.');
      } catch { toast('JSON inválido. Use o modelo exportado pelo jogo.'); }
      $('import-file').value = '';
    };
    reader.readAsText(file);
  }

  $('spin-btn').addEventListener('click', spin);
  $('timer-start').addEventListener('click', startTimer);
  $('timer-reset').addEventListener('click', () => { stopTimer(); remaining = duration; renderTimer(); });
  document.querySelectorAll('.duration-option').forEach(b => b.addEventListener('click', () => setDuration(b.dataset.seconds)));
  $('record-btn').addEventListener('click', recordResult);
  $('save-themes-btn').addEventListener('click', saveThemes);
  $('reset-themes-btn').addEventListener('click', () => { themes = structuredCloneSafe(defaults); save(STORAGE.themes, themes); loadEditors(); $('editor-message').textContent = 'Listas padrão restauradas.'; toast('Roletas restauradas.'); });
  $('export-btn').addEventListener('click', exportThemes);
  $('import-btn').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', event => { if (event.target.files[0]) importThemes(event.target.files[0]); });
  $('clear-score-btn').addEventListener('click', () => { if (!confirm('Tem certeza que deseja apagar o placar e todo o histórico deste navegador?')) return; scores = {}; history = []; save(STORAGE.scores, scores); save(STORAGE.history, history); roundNumber = 1; renderScoreboard(); renderHistory(); renderCurrent(); toast('Placar e histórico zerados.'); });

  renderCurrent(); renderTimer(); loadEditors(); renderScoreboard(); renderHistory();
})();
