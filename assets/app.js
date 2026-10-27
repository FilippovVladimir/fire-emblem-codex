/* Кодекс Fire Emblem — роутер и страницы */
(function () {
  const app = document.getElementById('app');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* приватный режим */ } }
  };
  const pct = (x) => (Math.round(x * 10) / 10).toFixed(x >= 99.95 || x < 0.05 ? 0 : 1) + '%';
  const STAT_KEYS = ['hp', 'str', 'mag', 'skl', 'spd', 'lck', 'def', 'res', 'con'];
  const STAT_RU = { hp: 'HP', str: 'Str', mag: 'Mag', skl: 'Skl', spd: 'Spd', lck: 'Lck', def: 'Def', res: 'Res', con: 'Con' };
  const TERRAIN = {
    plain: { n: 'Plain', avo: 0, def: 0 }, forest: { n: 'Forest (+20 Avo, +1 Def)', avo: 20, def: 1 },
    fort: { n: 'Fort (+20 Avo, +2 Def)', avo: 20, def: 2 }, mountain: { n: 'Mountain (+30 Avo, +1 Def)', avo: 30, def: 1 },
    throne: { n: 'Throne (+30 Avo, +3 Def)', avo: 30, def: 3 }, pillar: { n: 'Pillar (+20 Avo, +1 Def)', avo: 20, def: 1 }
  };
  const WORLD_COL = {
    Archanea: ['#3f6fd8', '#1d3a8a'], Valentia: ['#2e9b6a', '#145a3c'], Jugdral: ['#b0473c', '#5e1f19'], Elibe: ['#d08a2c', '#7a4a10'],
    Magvel: ['#7b54c4', '#3b2370'], Tellius: ['#3a9bb3', '#18505f'], Ylisse: ['#4c6fd1', '#273c86'], 'Hoshido / Nohr': ['#a3466a', '#4d1c33'],
    'Fódlan': ['#c19a3a', '#5a4510'], Elyos: ['#d05a8a', '#6a2244']
  };
  const heroWorld = (h) => (FE_GAMES_BY_ID[h.game] || {}).world;
  const heroGrad = (h) => { const c = (h && WORLD_COL[heroWorld(h)]) || null; return c ? `linear-gradient(135deg,${c[0]},${c[1]})` : null; };
  const avatar = (h) => `<div class="avatar" style="background:${heroGrad(h) || '#666'}">${esc(h.name.slice(0, 2))}</div>`;
  const gameShort = (id) => { const g = FE_GAMES_BY_ID[id]; return g ? g.title : id; };

  /* ---------- Иконки (монохромные, наследуют цвет) ---------- */
  const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICONS = {
    scroll: I('<path d="M8 3h11a2 2 0 0 1 2 2v2h-4"/><path d="M17 7v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2h11"/><path d="M8 3a2 2 0 0 0-2 2v12"/><path d="M9 8h5M9 12h5"/>'),
    swords: I('<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4M7 17l-3 3M3 19l2 2"/>'),
    shield: I('<path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6z"/><path d="M12 8v8M8 12h8"/>'),
    castle: I('<path d="M3 21V8l3 2V5h3v3h6V5h3v5l3-2v13z"/><path d="M10 21v-5h4v5"/>'),
    sword: I('<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/>'),
    gem: I('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 6 3-6M12 9v12"/>'),
    spark: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'),
    swirl: I('<path d="M12 12a3 3 0 1 1 3-3"/><path d="M15 9a6 6 0 1 1-6-6"/><path d="M9 3a9 9 0 1 1-6 9"/>'),
    dice: I('<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/>'),
    scale: I('<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>'),
  };

  /* ---------- Тема ---------- */
  document.getElementById('themeBtn').onclick = () => {
    const root = document.documentElement;
    const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = cur === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('fe-theme', root.dataset.theme); } catch (e) { }
  };

  /* ---------- Роутер ---------- */
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, q] = raw.split('?');
    const parts = path.split('/').filter(Boolean);
    return { route: parts[0] || '', param: parts[1], q: new URLSearchParams(q || '') };
  }
  const ROUTES = {};
  function render() {
    const r = parseHash();
    document.querySelectorAll('#nav a').forEach((a) => {
      const on = a.getAttribute('href') === '#/' + r.route;
      a.classList.toggle('on', on);
      if (on) a.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
    clearTimeout(fightTimer);
    (ROUTES[r.route] || ROUTES[''])(r);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);
  const orn = (title) => `<div class="orn"><span class="diamond">◆</span><h2>${title}</h2></div>`;

  /* ================= ГЛАВНАЯ ================= */
  ROUTES[''] = () => {
    const sections = [
      ['mechanics', 'scroll', 'Механики', `${FE_MECHANICS.length} гайдов с формулами по каждой игре.`],
      ['sim', 'swords', 'Симулятор боя', 'Прогноз, тысячи боёв Монте-Карло и анимированная арена.'],
      ['heroes', 'shield', 'Герои', `${FE_HEROES.length} персонажей серии без спойлеров.`],
      ['games', 'castle', 'Игры', `${FE_GAMES.length} игр: чем отличаются, с какой начать.`],
      ['weapons', 'sword', 'Оружие', `${FE_WEAPONS.length} видов оружия из пяти поколений.`],
      ['items', 'gem', 'Предметы', 'Легендарное оружие, щиты, кольца, бустеры.'],
      ['skills', 'spark', 'Навыки', `${FE_SKILLS.length} навыков с формулами активации.`],
      ['arts', 'swirl', 'Боевые арты', 'Приёмы Three Houses и Engage-атаки.'],
      ['tools', 'dice', 'Инструменты', 'Истинная точность, вес, уровни, глоссарий.'],
    ];
    app.innerHTML = `
<section class="hero">
  <svg class="hero-deco" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 L92 26 V74 L50 98 L8 74 V26 Z" fill="none" stroke="#e3c374" stroke-width="1.5"/><path d="M50 14 L82 32 V68 L50 86 L18 68 V32 Z" fill="none" stroke="#e3c374" stroke-width=".6"/><path d="M50 22 L64 50 L50 78 L36 50 Z" fill="#e3c374"/></svg>
  <div class="eyebrow">Справочник тактика</div>
  <h1>Кодекс <span>Fire Emblem</span></h1>
  <p>Все механики серии простым языком и с формулами. Проверьте любую из них в симуляторе боя — с реальными героями, оружием и навыками.</p>
  <div class="row" style="margin-top:20px">
    <a class="btn primary" href="#/sim">${ICONS.swords.replace('<svg', '<svg class="ico"')} Открыть симулятор</a>
    <a class="btn" href="#/mechanics">Читать гайды</a>
  </div>
  <div class="hero-stats"><div><b>${FE_MECHANICS.length}</b>гайдов</div><div><b>${FE_GAMES.length}</b>игр</div><div><b>${FE_HEROES.length}</b>героев</div><div><b>${FE_WEAPONS.length + FE_ITEMS.length}</b>предметов и оружия</div></div>
</section>
<div class="grid g3x">${sections.map(([r, ic, t, d]) => `<a class="card sect-card" href="#/${r}"><div class="ic">${ICONS[ic]}</div><h3>${t}</h3><p>${d}</p></a>`).join('')}</div>
<div class="grid g2" style="margin-top:28px">
  <div class="card" id="quiz"></div>
  <div class="card">
    <h2 style="margin-top:0">С чего начать читать</h2>
    <ol class="steps">
      ${['forecast', 'weight', 'doubling', 'truehit', 'triangle', 'growths'].map((id) => `<li><a href="#/mechanics/${id}">${esc(FE_MECH_BY_ID[id].en)}</a> <span class="muted">· ${esc(FE_MECH_BY_ID[id].title)}</span></li>`).join('')}
    </ol>
    <div class="tip"><b>Знаете ли вы?</b> В GBA-частях и Three Houses показанные 90% Hit на самом деле означают ≈98% — из-за системы двух случайных чисел. <a href="#/mechanics/truehit">Подробнее</a></div>
  </div>
</div>`;
    renderQuiz(document.getElementById('quiz'));
  };

  function renderQuiz(box) {
    const Q = [
      ['Опыт в тактических играх?', [['new', 'Новичок'], ['some', 'Немного'], ['vet', 'Ветеран']]],
      ['Что для вас важнее?', [['story', 'Сюжет и персонажи'], ['tactics', 'Тактика и челлендж'], ['social', 'Отношения и кастомизация']]],
      ['На чём играете?', [['switch', 'Switch / Switch 2'], ['3ds', '3DS'], ['retro', 'Ретро / любая']]],
    ];
    const ans = {};
    const score = () => {
      const s = { FE7: 0, FE8: 0, FE9: 0, FE13: 0, FE14: 0, FE16: 0, FE17: 0, FE5: 0, FE15: 0 };
      if (ans[0] === 'new') { s.FE16 += 3; s.FE7 += 3; s.FE8 += 3; s.FE13 += 3; s.FE17 += 2; }
      if (ans[0] === 'some') { s.FE9 += 2; s.FE17 += 3; s.FE13 += 2; s.FE16 += 2; s.FE14 += 1; }
      if (ans[0] === 'vet') { s.FE14 += 3; s.FE5 += 3; s.FE17 += 2; s.FE9 += 1; }
      if (ans[1] === 'story') { s.FE16 += 3; s.FE9 += 3; s.FE7 += 2; s.FE15 += 2; }
      if (ans[1] === 'tactics') { s.FE17 += 3; s.FE14 += 3; s.FE5 += 2; }
      if (ans[1] === 'social') { s.FE16 += 3; s.FE13 += 3; s.FE14 += 1; s.FE17 += 1; }
      if (ans[2] === 'switch') { s.FE16 += 4; s.FE17 += 4; }
      if (ans[2] === '3ds') { s.FE13 += 4; s.FE14 += 4; s.FE15 += 3; }
      if (ans[2] === 'retro') { s.FE7 += 3; s.FE8 += 3; s.FE9 += 2; s.FE5 += 2; }
      return Object.entries(s).sort((a, b) => b[1] - a[1]);
    };
    const draw = () => {
      const done = Object.keys(ans).length === Q.length;
      let res = '';
      if (done) {
        const top = score().slice(0, 2).map(([id]) => FE_GAMES_BY_ID[id]);
        const extra = top[0].id === 'FE14' ? ' Начните с версии <b>Birthright</b>, а для челленджа — <b>Conquest</b>.' : '';
        res = `<div class="quiz-res"><b>Рекомендуем: Fire Emblem: ${esc(top[0].title)}</b> (${top[0].year}, ${esc(top[0].platform)}).<br>${esc(top[0].desc)}${extra}<br><span class="muted">Запасной вариант: ${esc(top[1].title)}.</span> <a href="#/games">Все игры →</a></div>`;
      }
      box.innerHTML = `<h2 style="margin-top:0">С какой игры начать?</h2>` + Q.map(([q, opts], i) => `
        <div class="quiz-q"><b>${q}</b><div class="chips">${opts.map(([v, t]) => `<button class="chip ${ans[i] === v ? 'on' : ''}" data-q="${i}" data-v="${v}">${t}</button>`).join('')}</div></div>`).join('') + res;
      box.querySelectorAll('.chip').forEach((b) => b.onclick = () => { ans[b.dataset.q] = b.dataset.v; draw(); });
    };
    draw();
  }

  /* ================= МЕХАНИКИ ================= */
  ROUTES.mechanics = (r) => {
    if (r.param && FE_MECH_BY_ID[r.param]) return renderArticle(FE_MECH_BY_ID[r.param]);
    app.innerHTML = `<div class="page-head"><div class="eyebrow">Гайды</div><h1>Механики</h1><p>Каждая микро-механика серии: как работает, по какой формуле и чем отличается между играми. Внутри некоторых гайдов есть мини-калькуляторы.</p></div>` +
      FE_MECH_CATS.map((c) => orn(c.name) + `<div class="grid g3">${FE_MECHANICS.filter((m) => m.cat === c.id).map((m) =>
        `<a class="card sect-card mech-card" href="#/mechanics/${m.id}"><h3>${esc(m.en)}</h3><div class="sub-ru">${esc(m.title)}</div><p>${esc(m.lead)}</p></a>`).join('')}</div>`).join('');
  };

  function renderArticle(m) {
    const i = FE_MECHANICS.indexOf(m), prev = FE_MECHANICS[i - 1], next = FE_MECHANICS[i + 1];
    const cat = FE_MECH_CATS.find((c) => c.id === m.cat);
    app.innerHTML = `<div class="mech-layout">
      <aside class="mech-side">${FE_MECH_CATS.map((c) => `<h4>${c.name}</h4>${FE_MECHANICS.filter((x) => x.cat === c.id).map((x) =>
        `<a href="#/mechanics/${x.id}" class="${x === m ? 'on' : ''}" title="${esc(x.title)}">${esc(x.en)}</a>`).join('')}`).join('')}</aside>
      <article class="article">
        <a href="#/mechanics" class="eyebrow">← ${esc(cat.name)}</a>
        <h1 style="margin-top:6px">${esc(m.en)}</h1><div class="sub-ru" style="font-size:14px;color:var(--gold);margin:-2px 0 10px">${esc(m.title)}</div><p class="lead">${esc(m.lead)}</p>
        ${m.body}
        <div class="pager">${prev ? `<a class="btn" href="#/mechanics/${prev.id}">← ${esc(prev.en)}</a>` : '<span></span>'}${next ? `<a class="btn" href="#/mechanics/${next.id}">${esc(next.en)} →</a>` : ''}</div>
      </article></div>`;
    app.querySelectorAll('.tbl').forEach((t) => { if (!t.parentElement.classList.contains('tbl-wrap')) { const w = document.createElement('div'); w.className = 'tbl-wrap'; t.replaceWith(w); w.appendChild(t); } });
    mountWidgets(app);
  }

  /* ---------- Виджеты ---------- */
  function mountWidgets(root) {
    root.querySelectorAll('[data-widget]').forEach((el) => (WIDGETS[el.dataset.widget] || (() => { }))(el));
  }
  const WIDGETS = {
    truehit(el) {
      el.className = 'widget';
      el.innerHTML = `<h4>◆ Калькулятор истинной точности</h4>
        <label class="field">Показанный Hit: <b id="thv">80</b><input type="range" min="0" max="100" value="80" id="ths"></label>
        <div class="out-row"><div><div class="lbl">1RN · FE1–5</div><div class="big-out" id="th1"></div></div>
        <div><div class="lbl">2RN · GBA, Awakening, 3H</div><div class="big-out" id="th2" style="color:var(--gold)"></div></div>
        <div><div class="lbl">Гибрид · Fates, Engage</div><div class="big-out" id="th3" style="color:var(--accent)"></div></div></div>
        <svg viewBox="0 0 320 210" style="width:100%;max-width:460px;margin-top:10px" id="thc" role="img" aria-label="График истинной точности"></svg>`;
      const s = el.querySelector('#ths'), svg = el.querySelector('#thc');
      const X = (h) => 30 + h * 2.8, Y = (p) => 190 - p * 1.8;
      const line = (mode) => Array.from({ length: 101 }, (_, h) => `${X(h)},${Y(FE.trueHit(h, mode) * 100)}`).join(' ');
      const base = `<g stroke="var(--border)">${[0, 25, 50, 75, 100].map((v) => `<line x1="30" x2="310" y1="${Y(v)}" y2="${Y(v)}"/><text x="24" y="${Y(v) + 4}" fill="var(--muted)" stroke="none" font-size="9" text-anchor="end">${v}</text><text x="${X(v)}" y="204" fill="var(--muted)" stroke="none" font-size="9" text-anchor="middle">${v}</text>`).join('')}</g>
        <polyline fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3" points="${line('1rn')}"/>
        <polyline fill="none" stroke="var(--gold)" stroke-width="2.5" points="${line('2rn')}"/>
        <polyline fill="none" stroke="var(--accent)" stroke-width="2" points="${line('hybrid')}"/>`;
      const upd = () => {
        const h = +s.value;
        el.querySelector('#thv').textContent = h + '%';
        el.querySelector('#th1').textContent = pct(FE.trueHit(h, '1rn') * 100);
        el.querySelector('#th2').textContent = pct(FE.trueHit(h, '2rn') * 100);
        el.querySelector('#th3').textContent = pct(FE.trueHit(h, 'hybrid') * 100);
        svg.innerHTML = base + `<line x1="${X(h)}" x2="${X(h)}" y1="10" y2="190" stroke="var(--red)" stroke-dasharray="2 2"/><circle cx="${X(h)}" cy="${Y(FE.trueHit(h, '2rn') * 100)}" r="4" fill="var(--gold)"/><circle cx="${X(h)}" cy="${Y(FE.trueHit(h, 'hybrid') * 100)}" r="3.5" fill="var(--accent)"/>`;
      };
      s.oninput = upd; upd();
    },
    doubling(el) {
      el.className = 'widget';
      el.innerHTML = `<h4>◆ Удвоит ли юнит?</h4><div class="wgrid">
        <label>Игра<select id="dr">${Object.values(FE.RULES).map((r) => `<option value="${r.id}">${r.name}</option>`).join('')}</select></label>
        <label>Spd<input type="number" id="ds" value="18"></label><label id="dwl">Вес оружия<input type="number" id="dw" value="12"></label>
        <label id="dcl"><span>Con</span><input type="number" id="dc" value="8"></label><label>AS врага<input type="number" id="de" value="12"></label></div>
        <div class="out-row"><div><div class="lbl">Ваша AS</div><div class="big-out" id="das"></div></div><div><div class="lbl">Результат</div><div class="big-out" id="dres"></div></div></div><p class="muted" id="dnote"></p>`;
      const g = (id) => +el.querySelector('#' + id).value;
      const upd = () => {
        const R = FE.RULES[el.querySelector('#dr').value];
        const statName = { gba: 'Con', awakening: '—', fates: '—', '3h': 'Str', engage: 'Bld' }[R.id];
        el.querySelector('#dcl span').textContent = statName;
        el.querySelector('#dcl').style.opacity = R.usesWeight ? 1 : .4;
        el.querySelector('#dwl').style.opacity = R.usesWeight ? 1 : .4;
        const v = g('dc');
        const as = R.as({ spd: g('ds'), con: v, str: v }, { wt: g('dw') });
        const diff = as - g('de');
        el.querySelector('#das').textContent = as;
        const res = el.querySelector('#dres');
        if (diff >= R.double) { res.textContent = '×2 удваивает'; res.className = 'big-out adv'; }
        else if (diff <= -R.double) { res.textContent = 'Враг удваивает'; res.className = 'big-out dis'; }
        else { res.textContent = 'Без удвоения'; res.className = 'big-out'; }
        el.querySelector('#dnote').textContent = `Формула: AS = ${R.f.as}; порог: +${R.double}. Разница сейчас: ${diff >= 0 ? '+' : ''}${diff}.`;
      };
      el.oninput = upd; upd();
    },
    weightall(el) {
      el.className = 'widget';
      const GAMES = [
        ['FE1–FE4, Echoes', (s, w) => s.spd - w],
        ['FE5–FE8 (Con)', (s, w) => s.spd - Math.max(0, w - s.con)],
        ['Tellius / DS (Str)', (s, w) => s.spd - Math.max(0, w - s.str)],
        ['Awakening / Fates', (s) => s.spd],
        ['Three Houses (Str/5)', (s, w) => s.spd - Math.max(0, w - Math.floor(s.str / 5))],
        ['Engage (Bld)', (s, w) => s.spd - Math.max(0, w - s.con)],
      ];
      el.innerHTML = `<h4>◆ Одно оружие — шесть систем веса</h4>
        <div class="wgrid"><label>Spd<input type="number" id="was" value="15"></label><label>Str<input type="number" id="wat" value="14"></label>
        <label>Con / Bld<input type="number" id="wac" value="8"></label><label>Вес оружия: <b id="wavv">12</b><input type="range" min="0" max="25" value="12" id="waw"></label></div>
        <div class="wa-bars" id="wab"></div><p class="muted" style="font-size:12.5px;margin-bottom:0">Полоса — итоговая AS в процентах от Spd. Красная — потеряно больше трети скорости.</p>`;
      const g = (id) => +el.querySelector('#' + id).value;
      const upd = () => {
        const s = { spd: g('was'), str: g('wat'), con: g('wac') }, w = g('waw');
        el.querySelector('#wavv').textContent = w;
        el.querySelector('#wab').innerHTML = GAMES.map(([n, f]) => {
          const as = f(s, w), p = s.spd > 0 ? Math.max(0, Math.min(100, as / s.spd * 100)) : 0;
          return `<span>${n}</span><div class="track"><i class="${p < 67 ? 'low' : ''}" style="width:${p}%"></i></div><b class="mono">${as}</b>`;
        }).join('');
      };
      el.oninput = upd; upd();
    },
    damage(el) {
      el.className = 'widget';
      el.innerHTML = `<h4>◆ Калькулятор урона</h4><div class="wgrid">
        <label>Str / Mag<input type="number" id="ks" value="15"></label><label>Mt оружия<input type="number" id="km" value="8"></label>
        <label>Треугольник<select id="kt"><option value="0">нейтрально</option><option value="1">преимущество (+1)</option><option value="-1">недостаток (−1)</option></select></label>
        <label>Эффективно<select id="ke"><option value="1">нет</option><option value="2">да, ×2</option><option value="3">да, ×3</option></select></label>
        <label>Def / Res цели<input type="number" id="kd" value="10"></label><label>HP цели<input type="number" id="kh" value="30"></label></div>
        <div class="out-row"><div><div class="lbl">Урон</div><div class="big-out" id="ko"></div></div><div><div class="lbl">Крит (×3)</div><div class="big-out" id="kc" style="color:var(--gold)"></div></div><div><div class="lbl">Ударов до убийства</div><div class="big-out" id="kn"></div></div></div>`;
      const g = (id) => +el.querySelector('#' + id).value;
      const upd = () => {
        const dmg = Math.max(0, g('ks') + (g('km') + g('kt')) * g('ke') - g('kd'));
        el.querySelector('#ko').textContent = dmg;
        el.querySelector('#kc').textContent = dmg * 3;
        el.querySelector('#kn').textContent = dmg > 0 ? Math.ceil(g('kh') / dmg) : '∞';
      };
      el.oninput = upd; upd();
    }
  };

  /* ================= СИМУЛЯТОР ================= */
  const weaponsFor = (rules) => FE_WEAPONS.filter((w) => w.game === rules);
  function mapWeapon(w, rules) {
    const list = weaponsFor(rules);
    return list.find((x) => x.name === w.name) || list.find((x) => x.type === w.type) || list[0];
  }
  const W_FIELDS = ['id', 'name', 'type', 'mt', 'hit', 'crit', 'wt', 'magic', 'brave', 'eff', 'fu', 'foeFu', 'avo', 'ddg', 'critx', 'noFollow', 'noCrit', 'note'];
  const cloneW = (w) => { const o = {}; W_FIELDS.forEach((k) => { if (w[k] !== undefined) o[k] = Array.isArray(w[k]) ? w[k].slice() : w[k]; }); o.eff = o.eff || []; return o; };
  function unitFromHero(id, rules) {
    const h = FE_HEROES_BY_ID[id];
    const w = mapWeapon(FE_WEAPONS_BY_ID[h.weapon] || { name: '', type: 'sword' }, rules);
    return Object.assign({ hero: id, name: h.name, curHp: h.stats.hp, move: h.move, weapon: cloneW(w), skills: h.skills.filter((s) => FE_SKILLS_BY_ID[s] && FE_SKILLS_BY_ID[s].sim), art: '', equip: '', terrain: 'plain', bonus: { hit: 0, avo: 0, crit: 0, dmg: 0 } }, h.stats);
  }
  let SIM = store.get('fe-sim-v2', null);
  if (!SIM || !SIM.a || !SIM.d) SIM = { rules: 'gba', rn: '', triHit: '', triDmg: '', speed: 1, a: unitFromHero('lyn', 'gba'), d: unitFromHero('hector', 'gba') };
  const saveSim = () => store.set('fe-sim-v2', SIM);

  window.feSendToSim = (heroId, side) => {
    const h = FE_HEROES_BY_ID[heroId];
    if (SIM.rules !== h.rules) {
      SIM.rules = h.rules;
      const o = side === 'a' ? 'd' : 'a';
      SIM[o].weapon = cloneW(mapWeapon(SIM[o].weapon, h.rules));
    }
    SIM[side] = unitFromHero(heroId, SIM.rules);
    saveSim();
    location.hash = '#/sim';
  };

  const simSkills = () => FE_SKILLS.filter((s) => s.sim);
  const eqItems = () => FE_ITEMS.filter((i) => i.eq);
  function weaponNote(w) {
    const p = [];
    if (w.brave) p.push('двойной удар');
    if (w.fu) p.push(`скорость удвоения ${w.fu > 0 ? '+' : ''}${w.fu}`);
    if (w.foeFu) p.push(`врагу +${w.foeFu} к удвоению`);
    if (w.noFollow) p.push('без повторного удара');
    if (w.critx) p.push(`крит ×${w.critx}`);
    if (w.avo) p.push(`Avo ${w.avo > 0 ? '+' : ''}${w.avo}`);
    if (w.ddg) p.push(`Ddg ${w.ddg > 0 ? '+' : ''}${w.ddg}`);
    if (w.noCrit) p.push('без крита');
    return p.join(' · ');
  }

  const OPEN = new Set();
  const sub = (side, key, title, sel, body) => `<details class="sub" data-sub="${side}-${key}" ${OPEN.has(side + '-' + key) ? 'open' : ''}><summary><b>${title}</b><span class="sel">${esc(sel)}</span></summary><div class="sub-body">${body}</div></details>`;
  function unitPanel(side) {
    const u = SIM[side], enemy = side === 'd';
    const R = FE.RULES[SIM.rules];
    const games = FE_GAMES.filter((g) => FE_HEROES.some((h) => h.game === g.id));
    const wl = weaponsFor(SIM.rules);
    const types = [...new Set(wl.map((w) => w.type))];
    const conLbl = SIM.rules === 'engage' ? 'Bld' : 'Con';
    return `<div class="card unit-panel ${enemy ? 'enemy' : ''}" data-side="${side}">
      <h3><span class="side-dot"></span>${enemy ? 'Защитник' : 'Атакующий'}</h3>
      <div class="panel-row">
        <select data-k="hero" class="full" aria-label="Герой"><option value="">— Свой юнит —</option>${games.map((g) => `<optgroup label="${esc(g.title)}">${FE_HEROES.filter((h) => h.game === g.id).map((h) => `<option value="${h.id}" ${u.hero === h.id ? 'selected' : ''}>${esc(h.name)} (${esc(h.ru)})</option>`).join('')}</optgroup>`).join('')}</select>
        <input data-k="name" value="${esc(u.name)}" placeholder="Имя" aria-label="Имя">
      </div>
      <div class="stat-in">
        ${STAT_KEYS.map((k) => `<label title="${k === 'con' && !R.usesWeight ? 'В этой игре вес не учитывается' : ''}" style="${k === 'con' && SIM.rules !== 'gba' && SIM.rules !== 'engage' ? 'opacity:.45' : ''}">${k === 'con' ? conLbl : STAT_RU[k]}<input type="number" inputmode="numeric" data-k="${k}" value="${u[k]}"></label>`).join('')}
        <label>Тек. HP<input type="number" inputmode="numeric" data-k="curHp" value="${u.curHp}"></label>
      </div>
      <div class="panel-row">
        <label class="field">Unit type<select data-k="move">${Object.entries(FE_MOVE).map(([k, v]) => `<option value="${k}" ${u.move === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        <label class="field">Terrain<select data-k="terrain">${Object.entries(TERRAIN).map(([k, v]) => `<option value="${k}" ${u.terrain === k ? 'selected' : ''}>${v.n}</option>`).join('')}</select></label>
      </div>
      <div class="sec-lbl">Weapon · оружие</div>
      <select data-k="weaponId" class="full" aria-label="Оружие">${types.map((t) => `<optgroup label="${FE_WTYPES[t]}">${wl.filter((w) => w.type === t).map((w) => `<option value="${esc(w.id)}" ${u.weapon.id === w.id ? 'selected' : ''}>${esc(w.name)} — Mt ${w.mt} / Hit ${w.hit}${w.crit ? ' / Crit ' + w.crit : ''}</option>`).join('')}</optgroup>`).join('')}<option value="custom" ${u.weapon.id === 'custom' ? 'selected' : ''}>✎ Своё оружие</option></select>
      <div class="wnote">${esc(weaponNote(u.weapon))}</div>
      ${sub(side, 'wpn', 'Настроить оружие', `Mt ${u.weapon.mt} · Hit ${u.weapon.hit} · Crit ${u.weapon.crit}${R.usesWeight ? ' · Wt ' + (u.weapon.wt || 0) : ''}`, `
        <div class="wpn-in">
          ${['mt', 'hit', 'crit', 'wt'].map((k) => `<label style="${k === 'wt' && !R.usesWeight ? 'opacity:.45' : ''}">${{ mt: 'Mt', hit: 'Hit', crit: 'Crit', wt: 'Wt' }[k]}<input type="number" inputmode="numeric" data-k="w.${k}" value="${u.weapon[k] || 0}"></label>`).join('')}
        </div>
        <div class="panel-row" style="margin-top:8px">
          <label class="field">Тип<select data-k="w.type">${Object.entries(FE_WTYPES).map(([k, v]) => `<option value="${k}" ${u.weapon.type === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
          <label class="field">Effective vs<select data-k="w.eff"><option value="">—</option>${Object.entries(FE_MOVE).filter(([k]) => k !== 'infantry').map(([k, v]) => `<option value="${k}" ${u.weapon.eff[0] === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        </div>
        <div class="row" style="margin-top:8px;font-size:13px;gap:14px">
          <label><input type="checkbox" data-k="w.magic" ${u.weapon.magic ? 'checked' : ''}> Магия</label>
          <label><input type="checkbox" data-k="w.brave" ${u.weapon.brave ? 'checked' : ''}> Brave</label>
        </div>`)}
      <div class="panel-row" style="margin-top:10px">
        <label class="field">Снаряжение<select data-k="equip" aria-label="Снаряжение"><option value="">—</option>${['shield', 'ring'].map((c) => `<optgroup label="${c === 'shield' ? 'Shields' : 'Rings'}">${eqItems().filter((i) => i.cat === c).map((i) => `<option value="${i.id}" ${u.equip === i.id ? 'selected' : ''}>${esc(i.name)} (${esc(i.stats)})</option>`).join('')}</optgroup>`).join('')}</select></label>
        ${!enemy ? `<label class="field">Combat Art (3H)<select data-k="art" aria-label="Боевой арт"><option value="">—</option>${Object.keys(FE_WTYPES).filter((t) => FE_ARTS.some((a) => a.type === t && !a.info)).map((t) => `<optgroup label="${FE_WTYPES[t]}">${FE_ARTS.filter((a) => a.type === t && !a.info).map((a) => `<option value="${a.id}" ${u.art === a.id ? 'selected' : ''}>${esc(a.name)}${a.mt ? ' · Mt+' + a.mt : ''}</option>`).join('')}</optgroup>`).join('')}</select></label>` : '<span></span>'}
      </div>
      ${sub(side, 'skills', 'Skills', u.skills.map((id) => (FE_SKILLS_BY_ID[id] || {}).name).filter(Boolean).join(', ') || 'нет', `
        <div class="chips skill-chips">${simSkills().map((s) => `<button type="button" class="chip ${u.skills.includes(s.id) ? 'on' : ''}" data-skill="${s.id}" title="${esc(s.ru + ': ' + s.desc + ' ' + (s.formula || ''))}">${esc(s.name)}</button>`).join('')}</div>`)}
      ${sub(side, 'bonus', 'Бонусы', ['hit', 'avo', 'crit', 'dmg'].filter((k) => +u.bonus[k]).map((k) => k + ' +' + u.bonus[k]).join(', ') || 'поддержки, ранги', `
        <div class="wpn-in">${['hit', 'avo', 'crit', 'dmg'].map((k) => `<label>${{ hit: 'Hit', avo: 'Avo', crit: 'Crit', dmg: 'Dmg' }[k]}<input type="number" data-k="b.${k}" value="${u.bonus[k]}"></label>`).join('')}</div>`)}
    </div>`;
  }

  ROUTES.sim = () => {
    app.innerHTML = `<div class="page-head"><div class="eyebrow">Лаборатория</div><h1>Симулятор боя</h1><p>Выберите правила игры и героев или задайте статы вручную. Прогноз — по формулам игры, вероятности — по 4000 боёв.</p></div>
      <div class="card sim-top">
        <label class="field">Правила игры<select id="simRules">${Object.values(FE.RULES).map((r) => `<option value="${r.id}" ${SIM.rules === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}</select></label>
        <label class="field">Система RN<select id="simRn"><option value="">как в игре</option><option value="1rn" ${SIM.rn === '1rn' ? 'selected' : ''}>1RN (честная)</option><option value="2rn" ${SIM.rn === '2rn' ? 'selected' : ''}>2RN (усреднённая)</option><option value="hybrid" ${SIM.rn === 'hybrid' ? 'selected' : ''}>Гибрид (Fates)</option></select></label>
        <button class="btn" id="simSwap">⇄ Поменять местами</button>
        <details><summary>Weapon Triangle: свои значения</summary><div class="tri-opts">
        <label class="field" title="Пусто — значение по умолчанию для игры">Hit<input type="number" id="simTH" value="${SIM.triHit}" placeholder="авто" style="width:80px;min-width:0"></label>
        <label class="field" title="Пусто — значение по умолчанию для игры">Dmg<input type="number" id="simTD" value="${SIM.triDmg}" placeholder="авто" style="width:80px;min-width:0"></label></div></details>
      </div>
      <div class="sim-grid">
        <div id="panelA">${unitPanel('a')}</div>
        <div class="sim-mid" id="simOut"></div>
        <div id="panelD">${unitPanel('d')}</div>
      </div>
      <a class="sim-dock" id="simDock" href="#simOut"></a>`;
    const rerenderPanels = () => {
      document.getElementById('panelA').innerHTML = unitPanel('a');
      document.getElementById('panelD').innerHTML = unitPanel('d');
    };
    document.getElementById('simDock').onclick = (e) => { e.preventDefault(); document.getElementById('simOut').scrollIntoView({ behavior: 'smooth' }); };
    document.getElementById('simRules').onchange = (e) => {
      SIM.rules = e.target.value;
      ['a', 'd'].forEach((s) => { if (SIM[s].weapon.id !== 'custom') SIM[s].weapon = cloneW(mapWeapon(SIM[s].weapon, SIM.rules)); });
      rerenderPanels(); update(true);
    };
    document.getElementById('simRn').onchange = (e) => { SIM.rn = e.target.value; update(); };
    document.getElementById('simTH').oninput = (e) => { SIM.triHit = e.target.value; update(); };
    document.getElementById('simTD').oninput = (e) => { SIM.triDmg = e.target.value; update(); };
    document.getElementById('simSwap').onclick = () => { const t = SIM.a; SIM.a = SIM.d; SIM.d = t; SIM.d.art = ''; rerenderPanels(); update(true); };

    const grid = app.querySelector('.sim-grid');
    const onField = (e) => {
      const panel = e.target.closest('.unit-panel'); if (!panel) return;
      const side = panel.dataset.side, u = SIM[side];
      const chip = e.target.closest('[data-skill]');
      if (chip && e.type === 'click') {
        const id = chip.dataset.skill;
        u.skills = u.skills.includes(id) ? u.skills.filter((x) => x !== id) : u.skills.concat(id);
        chip.classList.toggle('on');
        const sel = panel.querySelector('[data-sub$="-skills"] .sel');
        if (sel) sel.textContent = u.skills.map((x) => (FE_SKILLS_BY_ID[x] || {}).name).filter(Boolean).join(', ') || 'нет';
        return update();
      }
      const k = e.target.dataset.k; if (!k || e.type === 'click') return;
      if (e.type === 'input' && e.target.tagName === 'SELECT') return;
      const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      let full = false;
      if (k === 'hero') {
        if (v) { SIM[side] = unitFromHero(v, SIM.rules); full = true; } else u.hero = '';
      } else if (k === 'weaponId') {
        if (v !== 'custom') u.weapon = cloneW(FE_WEAPONS_BY_ID[v]); else u.weapon.id = 'custom';
        panel.parentElement.innerHTML = unitPanel(side);
      } else if (k.startsWith('w.')) {
        const f = k.slice(2);
        u.weapon[f] = f === 'eff' ? (v ? [v] : []) : (typeof v === 'boolean' || f === 'type') ? v : +v;
        if (f === 'type') { u.weapon.magic = FE.MAGIC_TYPES.includes(v); panel.querySelector('[data-k="w.magic"]').checked = u.weapon.magic; }
        if (u.weapon.id !== 'custom') { u.weapon.id = 'custom'; panel.querySelector('[data-k=weaponId]').value = 'custom'; }
      } else if (k.startsWith('b.')) u.bonus[k.slice(2)] = +v || 0;
      else if (STAT_KEYS.includes(k) || k === 'curHp') {
        const old = +u[k]; u[k] = +v;
        if (k === 'hp' && +u.curHp === old) { u.curHp = +v; const c = panel.querySelector('[data-k=curHp]'); if (c) c.value = v; }
        if (u.hero) { u.hero = ''; panel.querySelector('[data-k=hero]').value = ''; }
      } else u[k] = v;
      if (full) rerenderPanels();
      update(full);
    };
    grid.addEventListener('input', onField);
    grid.addEventListener('change', onField);
    grid.addEventListener('click', onField);
    grid.addEventListener('toggle', (e) => { const k = e.target.dataset && e.target.dataset.sub; if (k) (e.target.open ? OPEN.add(k) : OPEN.delete(k)); }, true);
    update(true);
  };

  function toEngine(u, isA) {
    const n = (x) => +x || 0;
    const e = { name: u.name || (isA ? 'Атакующий' : 'Защитник'), hero: u.hero, moveType: u.move, skills: u.skills, art: isA ? u.art : '', equip: u.equip, terrain: TERRAIN[u.terrain], bonus: u.bonus };
    STAT_KEYS.forEach((k) => (e[k] = n(u[k])));
    e.hp = Math.max(1, e.hp);
    e.curHp = Math.max(1, Math.min(n(u.curHp) || e.hp, e.hp));
    e.weapon = Object.assign({}, u.weapon, { mt: n(u.weapon.mt), hit: n(u.weapon.hit), crit: n(u.weapon.crit), wt: n(u.weapon.wt) });
    return e;
  }

  let mcTimer = null;
  function update() {
    saveSim();
    const out = document.getElementById('simOut'); if (!out) return;
    clearTimeout(fightTimer);
    const A = toEngine(SIM.a, true), D = toEngine(SIM.d, false);
    const opts = { rn: SIM.rn || undefined };
    if (SIM.triHit !== '' && SIM.triHit != null) opts.triHit = +SIM.triHit;
    if (SIM.triDmg !== '' && SIM.triDmg != null) opts.triDmg = +SIM.triDmg;
    const f = FE.forecast(A, D, SIM.rules, opts);
    const R = f.rules;
    const triIcon = (t) => (t > 0 ? ' <span class="adv" title="Преимущество треугольника">▲</span>' : t < 0 ? ' <span class="dis" title="Недостаток треугольника">▼</span>' : '');
    const strikes = (x) => x.strikes ? (x.strikes > 1 ? `<span class="x2">×${x.strikes}</span>` : '1') : '<span class="muted">—</span>';
    const row = (lbl, a, d) => `<tr><td>${a}</td><td class="k">${lbl}</td><td>${d}</td></tr>`;
    const art = A.art ? FE_ARTS_BY_ID[A.art] : null;
    const dc = f.d.strikes > 0;
    out.innerHTML = `
    <div class="card fc">
      <div class="fc-head"><div class="nm a">${esc(A.name)}</div><div class="vs">VS</div><div class="nm d">${esc(D.name)}</div></div>
      <table class="fc-tbl">
        ${row('HP', `${A.curHp}/${A.hp}`, `${D.curHp}/${D.hp}`)}
        ${row('Dmg', `${f.a.dmg}${triIcon(f.a.tri)}${f.a.effective ? ' <span class="tag gold">эфф.</span>' : ''}`, `${dc ? f.d.dmg : '—'}${dc ? triIcon(f.d.tri) : ''}${f.d.effective && dc ? ' <span class="tag gold">эфф.</span>' : ''}`)}
        ${row('Hit', f.a.hit, dc ? f.d.hit : '—')}
        ${row('True Hit', pct(f.a.trueHit), dc ? pct(f.d.trueHit) : '—')}
        ${row('Crit', f.a.crit, dc ? f.d.crit : '—')}
        ${row('AS', f.a.as, f.d.as)}
        ${row('Удары', strikes(f.a), strikes(f.d))}
      </table>
      <p class="fc-note">${R.name} · RN: ${({ '1rn': '1RN', '2rn': '2RN', hybrid: 'гибрид' })[f.mode]} · удвоение при AS +${R.double}${art ? ` · арт: ${esc(art.name)}${R.artNoDouble && !art.canDouble ? ' (без удвоения)' : ''}` : ''}${R.breakOnAdv ? ' · Break' : ''}</p>
    </div>
    <div class="card fc" style="margin-top:14px">
      <div class="card-title"><b>Арена</b><div class="row" style="gap:6px"><button class="btn sm ghost" id="speedBtn" title="Скорость анимации">${SIM.speed === 2 ? '2×' : '1×'}</button><button class="btn sm ghost" id="skipBtn" title="Показать результат сразу">⏭</button><button class="btn primary sm" id="fightBtn">⚔ В бой!</button></div></div>
      <div class="arena" id="arena"></div>
      <div class="blog" id="blog"><div class="muted">Нажмите «В бой!», чтобы бросить кости.</div></div>
    </div>
    <div class="card fc" style="margin-top:14px" id="mcBox"><div class="prob muted">Считаю вероятности…</div></div>
    <details class="card" style="margin-top:14px"><summary><b>Как посчитано</b> — формулы и промежуточные значения</summary>${breakdown(f, A, D)}</details>`;
    drawArena(A, D);
    document.getElementById('fightBtn').onclick = () => fight(A, D, opts);
    document.getElementById('skipBtn').onclick = () => { skip = true; };
    document.getElementById('speedBtn').onclick = (e) => { SIM.speed = SIM.speed === 2 ? 1 : 2; e.currentTarget.textContent = SIM.speed === 2 ? '2×' : '1×'; saveSim(); };
    const dock = document.getElementById('simDock');
    clearTimeout(mcTimer);
    mcTimer = setTimeout(() => {
      const mc = FE.monteCarlo(A, D, SIM.rules, opts, 4000);
      const box = document.getElementById('mcBox'); if (!box) return;
      const maxC = Math.max(...Object.values(mc.distD));
      const bars = Array.from({ length: D.curHp + 1 }, (_, hp) => `<i style="height:${((mc.distD[hp] || 0) / maxC) * 100}%" title="HP ${hp}: ${pct((mc.distD[hp] || 0) / mc.n * 100)}"></i>`).join('');
      box.innerHTML = `<div class="card-title"><b>Вероятности</b><span class="muted" style="font-size:12px">${mc.n} боёв</span></div>
        <div class="prob"><div class="lbl"><span>${esc(D.name)} погибает</span><b>${pct(mc.pKillD * 100)}</b></div><div class="bar"><i style="width:${mc.pKillD * 100}%;background:var(--blue)"></i></div></div>
        <div class="prob"><div class="lbl"><span>${esc(A.name)} погибает</span><b>${pct(mc.pKillA * 100)}</b></div><div class="bar"><i style="width:${mc.pKillA * 100}%;background:var(--red)"></i></div></div>
        <div class="prob row" style="justify-content:space-between;font-size:13px"><span>Ср. урон по защитнику: <b>${mc.avgDmgD.toFixed(1)}</b></span><span>по атакующему: <b>${mc.avgDmgA.toFixed(1)}</b></span></div>
        <div style="font-size:12px;padding:0 14px 6px" class="muted">Оставшееся HP защитника:</div>
        <div class="dist">${bars}</div><div class="dist-lbl"><span>0 HP</span><span>${D.curHp} HP</span></div>`;
      if (dock) dock.innerHTML = `<span>Dmg <span class="v a">${f.a.dmg}${f.a.strikes > 1 ? '×' + f.a.strikes : ''}</span></span><span>Hit <span class="v">${Math.round(f.a.trueHit)}%</span></span><span>Убийство <span class="v a">${pct(mc.pKillD * 100)}</span></span><span>Риск <span class="v d">${pct(mc.pKillA * 100)}</span></span>`;
    }, 120);
  }

  function breakdown(f, A, D) {
    const R = f.rules, pa = f.pa, pd = f.pd;
    const line = (p, foeP) => `<tr><td>AS</td><td>${R.f.as}${p.w.wt && R.usesWeight ? ` (вес ${p.w.wt})` : ''}</td><td><b>${p.as}</b></td></tr>
      <tr><td>Атака</td><td>${p.magic ? 'Mag' : 'Str'} + Mt${p.effective ? '×' + R.eff : ''}${p.tri ? ' ± треуг.' : ''} + бонусы</td><td><b>${p.power}</b></td></tr>
      <tr><td>Защита</td><td>${foeP.magic ? 'Res' : 'Def'} + местность + снаряжение</td><td><b>${p.defFor(foeP.magic)}</b></td></tr>
      <tr><td>Точность</td><td>${R.f.hit}</td><td><b>${p.rawHit}</b></td></tr>
      <tr><td>Уклонение</td><td>${R.f.avo} + местность</td><td><b>${p.avoFor(foeP.magic)}</b></td></tr>
      <tr><td>Крит</td><td>${R.f.crit}</td><td><b>${p.rawCrit}</b></td></tr>
      <tr><td>Уклон. от крита</td><td>${R.f.ddg}</td><td><b>${p.ddg}</b></td></tr>`;
    return `<div class="tbl-wrap"><table class="tbl breakdown"><tr><th colspan="3" style="color:var(--blue)">${esc(A.name)}</th></tr>${line(pa, pd)}
      <tr><th colspan="3" style="color:var(--red)">${esc(D.name)}</th></tr>${line(pd, pa)}</table></div>
      <p class="muted" style="font-size:12.5px">Hit в прогнозе = Точность − Уклонение цели; Урон = Атака − Защита; крит ×${R.critMult}. Активные навыки: ${[...pa.procs, ...pd.procs].map((s) => s.name).join(', ') || 'нет'}.</p>`;
  }

  /* ---------- Арена ---------- */
  function drawArena(A, D) {
    const el = document.getElementById('arena'); if (!el) return;
    const tok = (u, k) => {
      const h = FE_HEROES_BY_ID[u.hero];
      const bg = heroGrad(h) || (k === 'a' ? 'linear-gradient(135deg,#4a76d8,#233f8c)' : 'linear-gradient(135deg,#d0584c,#7a231c)');
      return `<div class="fighter ${k}" id="f${k}"><span class="glow"></span><div class="token" style="background:${bg}">${esc((u.name || '?').slice(0, 2))}</div>
        <div class="fname">${esc(u.name)}</div><div class="hpmini"><i style="width:${u.curHp / u.hp * 100}%"></i></div><div class="hpnum">${u.curHp}/${u.hp}</div></div>`;
    };
    el.innerHTML = `<div class="flash"></div>${tok(A, 'a')}<div class="center">VS</div>${tok(D, 'd')}`;
  }
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function anim(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function pop(k, text, cls) {
    const f = document.getElementById('f' + k); if (!f) return;
    const p = document.createElement('span');
    p.className = 'pop ' + cls; p.textContent = text;
    f.appendChild(p);
    setTimeout(() => p.remove(), 1300);
  }
  function setHp(k, v, m) {
    const f = document.getElementById('f' + k); if (!f) return;
    f.querySelector('.hpmini i').style.width = (v / m) * 100 + '%';
    f.querySelector('.hpnum').textContent = `${v}/${m}`;
    f.classList.toggle('dead', v <= 0);
  }

  let fightTimer = null, skip = false;
  function fight(A, D, opts) {
    clearTimeout(fightTimer);
    skip = false;
    drawArena(A, D);
    const r = FE.battle(A, D, SIM.rules, opts);
    const log = document.getElementById('blog');
    log.innerHTML = '';
    let i = 0;
    const max = { a: A.hp, d: D.hp };
    const nm = (k) => `<span class="${k}">${esc(k === 'a' ? A.name : D.name)}</span>`;
    const other = (k) => (k === 'a' ? 'd' : 'a');
    const step = () => {
      const quick = skip || reduceMotion();
      if (i >= r.log.length) {
        const end = r.hp.d <= 0 ? `${nm('d')} повержен(а)!` : r.hp.a <= 0 ? `${nm('a')} пал(а)…` : 'Оба выжили.';
        log.insertAdjacentHTML('beforeend', `<div><b>${end}</b></div>`);
        log.scrollTop = log.scrollHeight;
        setHp('a', r.hp.a, max.a); setHp('d', r.hp.d, max.d);
        const ar = document.getElementById('arena');
        if (ar) ar.insertAdjacentHTML('beforeend', `<div class="result">${r.hp.d <= 0 ? '🏆 Победа' : r.hp.a <= 0 ? '💀 Поражение' : '— Ничья —'}</div>`);
        return;
      }
      const e = r.log[i++];
      const o = other(e.k);
      const fa = document.getElementById('f' + e.k), fo = document.getElementById('f' + o);
      let t = '', delay = 760;
      if (e.type === 'hit') {
        if (!quick) { anim(fa, e.k === 'a' ? 'lunge-r' : 'lunge-l'); setTimeout(() => { anim(fo, 'hit'); if (e.crit) anim(document.querySelector('#arena .flash'), 'on'); }, 170); }
        setTimeout(() => {
          if (!quick) pop(o, (e.crit ? 'КРИТ! ' : '') + '−' + e.dmg, e.crit ? 'crit' : 'dmg');
          if (e.heal && !quick) pop(e.k, '+' + e.heal, 'heal');
          setHp('a', e.hpA, max.a); setHp('d', e.hpD, max.d);
        }, quick ? 0 : 190);
        if (e.skills.length && !quick) { anim(fa, 'skill'); pop(e.k, e.skills[0].replace(' (защ.)', '') + '!', 'skill'); }
        t = `${nm(e.k)} ${e.kill ? 'наносит смертельный удар' : 'наносит'} <b>${e.dmg}</b> урона${e.crit ? ' <span class="crit">— КРИТ!</span>' : ''}`;
        if (e.skills.length) t += ` <span class="tag gold">${e.skills.map(esc).join(', ')}</span>`;
        if (e.heal) t += ` (+${e.heal} HP)`;
      } else if (e.type === 'miss') {
        if (!quick) { anim(fa, e.k === 'a' ? 'lunge-r' : 'lunge-l'); setTimeout(() => { anim(fo, o === 'a' ? 'dodge-l' : 'dodge-r'); pop(o, 'Промах', 'miss'); }, 170); }
        t = `${nm(e.k)} промахивается`;
      } else if (e.type === 'skill') {
        if (!quick) { anim(fa, 'skill'); pop(e.k, e.skill + '!', 'skill'); }
        t = `${nm(e.k)} активирует <span class="tag gold">${esc(e.skill)}</span>`; delay = 520;
      } else if (e.type === 'reflect') {
        if (!quick) { anim(fo, 'hit'); pop(o, '−' + e.dmg, 'dmg'); }
        setHp('a', e.hpA, max.a); setHp('d', e.hpD, max.d);
        t = `${nm(e.k)} отражает ${e.dmg} урона (Counter)`;
      } else if (e.type === 'break') {
        if (!quick) pop(e.k, 'BREAK', 'brk');
        t = `${nm(e.k)} получает <b>Break</b> — не сможет контратаковать`; delay = 640;
      } else if (e.type === 'broken') {
        t = `${nm(e.k)} оглушён (Break) и пропускает удар`; delay = 420;
      }
      log.insertAdjacentHTML('beforeend', `<div>${t}</div>`);
      log.scrollTop = log.scrollHeight;
      fightTimer = setTimeout(step, quick ? 0 : delay / (SIM.speed || 1));
    };
    step();
  }

  /* ================= ГЕРОИ ================= */
  function statBars(st) {
    return `<div class="statbars">${STAT_KEYS.filter((k) => k !== 'con').map((k) => `<span>${STAT_RU[k]}</span><div class="bar"><i style="width:${Math.min(100, (st[k] / (k === 'hp' ? 65 : 36)) * 100)}%"></i></div><b class="mono">${st[k]}</b>`).join('')}</div>`;
  }
  ROUTES.heroes = (r) => {
    const st = { game: r.q.get('game') || '', q: '', move: '' };
    app.innerHTML = `<div class="page-head"><div class="eyebrow">База</div><h1>Герои</h1><p>Ключевые персонажи серии — кратко и без сюжетных спойлеров. Статы — ориентировочный билд середины/конца игры для симулятора, а не точные базовые значения.</p></div>
      <div class="filters"><input type="search" id="hq" placeholder="Поиск по имени, классу…" aria-label="Поиск">
        <select id="hg" aria-label="Игра"><option value="">Все игры</option>${FE_GAMES.filter((g) => FE_HEROES.some((h) => h.game === g.id)).map((g) => `<option value="${g.id}" ${st.game === g.id ? 'selected' : ''}>${esc(g.title)}</option>`).join('')}</select>
        <select id="hm" aria-label="Тип"><option value="">Все типы</option>${Object.entries(FE_MOVE).slice(0, 4).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
      <div class="grid g3" id="hlist"></div>`;
    const draw = () => {
      const q = st.q.toLowerCase();
      const list = FE_HEROES.filter((h) => (!st.game || h.game === st.game) && (!st.move || h.move === st.move) &&
        (!q || (h.name + h.ru + h.cls + h.tags.join(' ')).toLowerCase().includes(q)));
      document.getElementById('hlist').innerHTML = list.length ? list.map((h) => `<div class="card hero-card" data-id="${h.id}" tabindex="0" role="button">
        <div class="hd">${avatar(h)}<div><div class="nm">${esc(h.name)} <span class="muted" style="font-weight:400">· ${esc(h.ru)}</span></div><div class="sub">${esc(gameShort(h.game))} · ${esc(h.cls)}</div></div></div>
        <p>${esc(h.desc)}</p><div>${h.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div></div>`).join('') : '<div class="empty">Никого не нашли</div>';
    };
    document.getElementById('hq').oninput = (e) => { st.q = e.target.value; draw(); };
    document.getElementById('hg').onchange = (e) => { st.game = e.target.value; draw(); };
    document.getElementById('hm').onchange = (e) => { st.move = e.target.value; draw(); };
    const list = document.getElementById('hlist');
    list.onclick = (e) => { const c = e.target.closest('.hero-card'); if (c) heroModal(FE_HEROES_BY_ID[c.dataset.id]); };
    list.onkeydown = (e) => { if (e.key === 'Enter') { const c = e.target.closest('.hero-card'); if (c) heroModal(FE_HEROES_BY_ID[c.dataset.id]); } };
    draw();
  };

  function modal(html) {
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="icon-btn x" aria-label="Закрыть">✕</button>${html}</div>`;
    const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    bg.onclick = (e) => { if (e.target === bg || e.target.closest('.x')) close(); };
    document.addEventListener('keydown', onKey);
    document.body.appendChild(bg);
    return { bg, close };
  }
  function heroModal(h) {
    const g = FE_GAMES_BY_ID[h.game];
    const w = FE_WEAPONS_BY_ID[h.weapon];
    const m = modal(`<div class="row" style="gap:14px">${avatar(h)}<div><h2 style="margin:0">${esc(h.name)}</h2><div class="muted">${esc(h.ru)} · ${esc(h.cls)}</div></div></div>
      <p>${esc(h.desc)}</p>
      <p class="muted" style="font-size:13.5px">Игра: <a href="#/games">${esc(g.title)}</a> (${g.year}) · Мир: ${esc(g.world)} · Тип: ${FE_MOVE[h.move]}</p>
      ${statBars(h.stats)}
      <p style="font-size:13.5px">Оружие: <b>${esc(w ? w.name : '—')}</b>${h.skills.length ? ' · Навыки: ' + h.skills.map((s) => `<span class="tag gold">${esc((FE_SKILLS_BY_ID[s] || {}).name || s)}</span>`).join('') : ''}<br><span class="muted">Правила симулятора: ${FE.RULES[h.rules].name}</span></p>
      <div class="row"><button class="btn primary" data-s="a">⚔ Атакующим в симулятор</button><button class="btn" data-s="d">🛡 Защитником</button></div>`);
    m.bg.querySelectorAll('[data-s]').forEach((b) => b.onclick = () => { m.close(); feSendToSim(h.id, b.dataset.s); });
  }

  /* ================= ИГРЫ ================= */
  ROUTES.games = () => {
    const st = { kind: 'all' };
    app.innerHTML = `<div class="page-head"><div class="eyebrow">База</div><h1>Игры серии</h1><p>Все основные части и главные спин-оффы. Только завязка и особенности геймплея — без спойлеров. Звёзды — насколько игра подходит новичку.</p></div>
      <div class="filters chips" id="gk"><button class="chip on" data-k="all">Все</button><button class="chip" data-k="main">Основная серия</button><button class="chip" data-k="spin">Спин-оффы</button><button class="chip" data-k="west">Вышли на Западе</button><button class="chip" data-k="easy">Для новичков</button></div>
      <div id="glist"></div>`;
    const draw = () => {
      const list = FE_GAMES.filter((g) => st.kind === 'all' || (st.kind === 'main' && !g.spin) || (st.kind === 'spin' && g.spin) || (st.kind === 'west' && !/^Нет/.test(g.west)) || (st.kind === 'easy' && g.beginner >= 4));
      const eras = [...new Set(list.map((g) => g.era))];
      document.getElementById('glist').innerHTML = eras.map((era) => `<div class="timeline-era">${esc(era)}</div><div class="grid g2">${list.filter((g) => g.era === era).map((g) => {
        const n = FE_HEROES.filter((h) => h.game === g.id).length;
        return `<div class="card game-card"><div class="row" style="justify-content:space-between"><span class="yr">${g.year} · ${esc(g.platform)}</span><span class="stars" title="Для новичков: ${g.beginner}/5">${'★'.repeat(g.beginner)}<span class="muted">${'☆'.repeat(5 - g.beginner)}</span></span></div>
        <h3>${esc(g.title)}</h3><div class="ru">${esc(g.ru)} · ${esc(g.world)} · Запад: ${esc(g.west)}</div>
        <p>${esc(g.desc)}</p><div>${g.features.map((f) => `<span class="tag blue">${esc(f)}</span>`).join('')}</div>
        ${n ? `<p style="margin-bottom:0"><a href="#/heroes?game=${g.id}">Герои игры (${n}) →</a></p>` : ''}</div>`;
      }).join('')}</div>`).join('') || '<div class="empty">Ничего</div>';
    };
    document.getElementById('gk').onclick = (e) => {
      const b = e.target.closest('.chip'); if (!b) return;
      st.kind = b.dataset.k; e.currentTarget.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b)); draw();
    };
    draw();
  };

  /* ================= ОРУЖИЕ ================= */
  ROUTES.weapons = () => {
    const st = { game: 'gba', type: '', q: '', sort: null, dir: 1 };
    app.innerHTML = `<div class="page-head"><div class="eyebrow">База</div><h1>Оружие</h1><p>Характеристики оружия по поколениям, сверенные с Serenes Forest и Fire Emblem Wiki. Mt — мощь, Hit — точность, Crit — шанс крита, Wt — вес (в Awakening и Fates веса нет). Легендарное оружие — в <a href="#/items">предметах</a>.</p></div>
      <div class="filters"><select id="wg" aria-label="Игра">${Object.entries(FE_RULE_GAMES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
      <select id="wt" aria-label="Тип"><option value="">Все типы</option>${Object.entries(FE_WTYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
      <input type="search" id="wq" placeholder="Поиск…" aria-label="Поиск"></div><div class="card tbl-wrap" style="padding:0" id="wlist"></div>`;
    const draw = () => {
      const noWt = st.game === 'awakening' || st.game === 'fates';
      const cols = [['name', 'Название'], ['type', 'Тип'], ['mt', 'Mt'], ['hit', 'Hit'], ['crit', 'Crit']].concat(noWt ? [] : [['wt', 'Wt']]).concat([['rng', 'Дальн.'], ['note', 'Особое']]);
      let list = FE_WEAPONS.filter((w) => w.game === st.game && (!st.type || w.type === st.type) && (!st.q || w.name.toLowerCase().includes(st.q.toLowerCase())));
      if (st.sort) list = list.slice().sort((a, b) => (a[st.sort] > b[st.sort] ? 1 : a[st.sort] < b[st.sort] ? -1 : 0) * st.dir);
      document.getElementById('wlist').innerHTML = `<table class="tbl" style="margin:0"><tr>${cols.map(([k, n]) => `<th class="sort" data-k="${k}">${n}${st.sort === k ? (st.dir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('')}</tr>
        ${list.map((w) => `<tr><td><b>${esc(w.name)}</b></td><td>${FE_WTYPES[w.type]}</td><td class="mono">${w.mt}</td><td class="mono">${w.hit}</td><td class="mono">${w.crit}</td>${noWt ? '' : `<td class="mono">${w.wt}</td>`}<td class="mono">${w.rng}</td>
        <td>${w.brave ? '<span class="tag gold">Храброе</span>' : ''}${(w.eff || []).filter((e) => !(w.type === 'bow' && e === 'flier')).map((e) => `<span class="tag blue">эфф.: ${FE_MOVE[e]}</span>`).join('')}${w.type === 'bow' ? '<span class="tag">эфф.: Летун</span>' : ''} ${esc(w.note || '')}</td></tr>`).join('')}</table>`;
    };
    document.getElementById('wg').onchange = (e) => { st.game = e.target.value; if ((st.game === 'awakening' || st.game === 'fates') && st.sort === 'wt') st.sort = null; draw(); };
    document.getElementById('wt').onchange = (e) => { st.type = e.target.value; draw(); };
    document.getElementById('wq').oninput = (e) => { st.q = e.target.value; draw(); };
    document.getElementById('wlist').onclick = (e) => { const th = e.target.closest('th.sort'); if (!th) return; const k = th.dataset.k; st.dir = st.sort === k ? -st.dir : (['mt', 'hit', 'crit', 'wt'].includes(k) ? -1 : 1); st.sort = k; draw(); };
    draw();
  };

  /* ================= ПРЕДМЕТЫ ================= */
  ROUTES.items = (r) => {
    const st = { cat: r.q.get('cat') || 'legend', q: '', game: '' };
    const games = [...new Set(FE_ITEMS.map((i) => i.game))];
    app.innerHTML = `<div class="page-head"><div class="eyebrow">База</div><h1>Предметы</h1><p>Легендарное оружие, щиты, кольца, усилители и всё остальное, что лежит в инвентаре. Щиты и кольца с пометкой «в симуляторе» можно экипировать на юнита.</p></div>
      <div class="filters"><div class="chips" id="ic">${Object.entries(FE_ITEM_CATS).map(([k, c]) => `<button class="chip ${st.cat === k ? 'on' : ''}" data-c="${k}">${c.n}</button>`).join('')}</div></div>
      <div class="filters"><input type="search" id="iq" placeholder="Поиск предмета…" aria-label="Поиск"><select id="ig" aria-label="Игра"><option value="">Все игры</option>${games.map((g) => `<option value="${g}">${esc(gameShort(g))}</option>`).join('')}</select></div>
      <p class="cat-intro" id="iintro"></p><div class="grid g3" id="ilist"></div>`;
    const draw = () => {
      const q = st.q.toLowerCase();
      document.getElementById('iintro').textContent = FE_ITEM_CATS[st.cat].d;
      const list = FE_ITEMS.filter((i) => i.cat === st.cat && (!st.game || i.game === st.game) && (!q || (i.name + i.desc).toLowerCase().includes(q)));
      document.getElementById('ilist').innerHTML = list.map((i) => `<div class="card item-card"><div class="hd"><h3>${esc(i.name)}</h3><span class="tag" title="${esc(gameShort(i.game))}">${i.game}</span></div>
        <div class="st">${esc(i.stats)}</div><p>${esc(i.desc)}</p>
        <div>${i.type ? `<span class="tag blue">${FE_WTYPES[i.type]}</span>` : ''}${i.eq ? '<span class="tag gold">в симуляторе</span>' : ''}</div></div>`).join('') || '<div class="empty">Ничего не найдено</div>';
    };
    document.getElementById('ic').onclick = (e) => { const b = e.target.closest('.chip'); if (!b) return; st.cat = b.dataset.c; e.currentTarget.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b)); draw(); };
    document.getElementById('iq').oninput = (e) => { st.q = e.target.value; draw(); };
    document.getElementById('ig').onchange = (e) => { st.game = e.target.value; draw(); };
    draw();
  };

  /* ================= НАВЫКИ ================= */
  ROUTES.skills = () => {
    const st = { cat: '', q: '' };
    app.innerHTML = `<div class="page-head"><div class="eyebrow">База</div><h1>Навыки</h1><p>Самые известные навыки серии. Значения по Awakening, если не сказано иное. Значок «⚔ сим» — навык работает в симуляторе.</p></div>
      <div class="filters"><input type="search" id="sq" placeholder="Поиск навыка…" aria-label="Поиск"><div class="chips" id="sc"><button class="chip on" data-c="">Все</button>${Object.entries(FE_SKILL_CATS).map(([k, v]) => `<button class="chip" data-c="${k}">${v}</button>`).join('')}</div></div>
      <div class="grid g3" id="slist"></div>`;
    const draw = () => {
      const q = st.q.toLowerCase();
      const list = FE_SKILLS.filter((s) => (!st.cat || s.cat === st.cat) && (!q || (s.name + s.ru + s.desc).toLowerCase().includes(q)));
      document.getElementById('slist').innerHTML = list.map((s) => `<div class="card skill-card"><div class="row" style="justify-content:space-between"><h3>${esc(s.name)}</h3>${s.sim ? '<span class="tag gold" title="Есть в симуляторе">⚔ сим</span>' : ''}</div>
        <div class="ru">${esc(s.ru)} · ${FE_SKILL_CATS[s.cat]}</div><p>${esc(s.desc)}</p>${s.formula ? `<div class="formula">${esc(s.formula)}</div>` : ''}
        <div>${s.games.map((g) => `<span class="tag" title="${esc(gameShort(g))}">${g}</span>`).join('')}</div></div>`).join('') || '<div class="empty">Ничего не найдено</div>';
    };
    document.getElementById('sq').oninput = (e) => { st.q = e.target.value; draw(); };
    document.getElementById('sc').onclick = (e) => { const b = e.target.closest('.chip'); if (!b) return; st.cat = b.dataset.c; e.currentTarget.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b)); draw(); };
    draw();
  };

  /* ================= АРТЫ ================= */
  ROUTES.arts = () => {
    const sign = (v) => (v ? (v > 0 ? '+' : '') + v : '—');
    const row = (a) => `<tr><td><b>${esc(a.name)}</b></td><td>${FE_WTYPES[a.type]}</td><td class="mono">${sign(a.mt)}</td><td class="mono">${sign(a.hit)}</td><td class="mono">${sign(a.avo)}</td><td class="mono">${sign(a.crit)}</td><td class="mono">${a.cost || '—'}</td><td>${a.eff ? a.eff.map((e) => `<span class="tag blue">эфф.: ${FE_MOVE[e]}</span>`).join('') : ''}${a.strikes ? '<span class="tag gold">2 удара</span>' : ''} ${esc(a.desc)}</td></tr>`;
    const head = '<tr><th>Арт</th><th>Оружие</th><th>Mt</th><th>Hit</th><th>Avo</th><th>Crit</th><th>Прочн.</th><th>Эффект</th></tr>';
    app.innerHTML = `<div class="page-head"><div class="eyebrow">База</div><h1>Боевые арты</h1><p>Приёмы оружия из Three Houses (сверено с Serenes Forest) и Engage-атаки Эмблем. Арты Three Houses можно выбрать для атакующего в <a href="#/sim">симуляторе</a>.</p></div>
      <div class="tip">В Three Houses арт тратит прочность оружия и <b>не даёт повторного удара</b> (кроме One-Two Punch), зато бонусы и эффективность часто позволяют убить с одного удара. Подробнее — <a href="#/mechanics/battalions">в гайде</a>.</div>
      ${orn('Three Houses')}<div class="card tbl-wrap" style="padding:0"><table class="tbl" style="margin:0">${head}${FE_ARTS.filter((a) => a.game === '3h').map(row).join('')}</table></div>
      ${orn('Engage-атаки')}<p class="muted">Engage-атака доступна только во время Engage, не даёт повторного удара и у каждой Эмблемы своя. Точные числа зависят от уровня связи, поэтому здесь — только описание.</p>
      <div class="grid g3">${FE_ARTS.filter((a) => a.game === 'engage').map((a) => `<div class="card item-card"><div class="hd"><h3>${esc(a.name)}</h3><span class="tag blue">${FE_WTYPES[a.type]}</span></div><div class="st">${esc(a.who)}</div><p>${esc(a.desc)}</p></div>`).join('')}</div>`;
  };

  /* ================= ИНСТРУМЕНТЫ ================= */
  ROUTES.tools = () => {
    app.innerHTML = `<div class="page-head"><div class="eyebrow">Лаборатория</div><h1>Инструменты</h1><p>Калькуляторы для проверки механик и словарь терминов сообщества.</p></div>
      <div class="grid g2"><div data-widget="truehit"></div><div data-widget="doubling"></div></div>
      <div data-widget="weightall"></div>
      <div class="card" style="margin-top:18px" id="lvl"></div>
      <div class="card" style="margin-top:18px"><h2 style="margin-top:0">Глоссарий</h2><dl class="gl">${FE_GLOSSARY.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>`;
    mountWidgets(app);
    levelSim(document.getElementById('lvl'));
  };

  function levelSim(box) {
    const K = ['hp', 'str', 'mag', 'skl', 'spd', 'lck', 'def', 'res'];
    const st = store.get('fe-lvl-v1', { from: 1, to: 20, base: [18, 5, 1, 9, 11, 5, 4, 2], gr: [80, 40, 5, 55, 60, 40, 20, 25], cap: [60, 20, 20, 20, 20, 30, 20, 20] });
    box.innerHTML = `<h2 style="margin-top:0">Симулятор уровней</h2><p class="muted">Задайте базовые статы, шансы роста (%) и максимумы. Симулятор проведёт 10 000 прокачек и покажет диапазон, в который попадает 80% результатов.</p>
      <div class="row"><label class="field">С уровня<input type="number" id="lf" value="${st.from}" style="width:80px"></label><label class="field">До уровня<input type="number" id="lt" value="${st.to}" style="width:80px"></label>
      <button class="btn primary" id="lrun">🎲 Прокачать</button></div>
      <div class="tbl-wrap"><table class="tbl" style="max-width:640px"><tr><th></th>${K.map((k) => `<th>${STAT_RU[k]}</th>`).join('')}</tr>
      ${[['base', 'База'], ['gr', 'Рост %'], ['cap', 'Кап']].map(([r, n]) => `<tr><td>${n}</td>${K.map((k, i) => `<td><input type="number" inputmode="numeric" data-r="${r}" data-i="${i}" value="${st[r][i]}" style="width:54px;padding:5px"></td>`).join('')}</tr>`).join('')}</table></div>
      <div id="lres"></div>`;
    const run = () => {
      box.querySelectorAll('input[data-r]').forEach((i) => (st[i.dataset.r][+i.dataset.i] = +i.value || 0));
      st.from = +box.querySelector('#lf').value || 1; st.to = Math.max(st.from, +box.querySelector('#lt').value || st.from);
      store.set('fe-lvl-v1', st);
      const N = 10000, lv = st.to - st.from, res = K.map(() => []);
      let one = null;
      for (let n = 0; n < N; n++) {
        const s = st.base.slice();
        for (let l = 0; l < lv; l++) for (let i = 0; i < K.length; i++) if (Math.random() * 100 < st.gr[i]) s[i] = Math.min(st.cap[i], s[i] + 1);
        s.forEach((v, i) => res[i].push(v));
        if (!one) one = s;
      }
      const q = (arr, p) => arr[Math.floor(p * (arr.length - 1))];
      box.querySelector('#lres').innerHTML = `<div class="lv-res"><b></b><span class="muted" style="font-size:12px">10–90 перцентиль · ▮ среднее</span><span class="muted" style="font-size:12px">ср. (один прогон) · диапазон</span>${K.map((k, i) => {
        const a = res[i].sort((x, y) => x - y), mean = a.reduce((x, y) => x + y, 0) / N, lo = q(a, .1), hi = q(a, .9), cap = st.cap[i] || 1;
        return `<b>${STAT_RU[k]}</b><div class="range" title="${lo}–${hi}"><i style="left:${lo / cap * 100}%;width:${Math.max(1, (hi - lo) / cap * 100)}%"></i><b style="left:${Math.min(99, mean / cap * 100)}%"></b></div><span class="mono">${mean.toFixed(1)} <span class="muted">(${one[i]})</span> · ${lo}–${hi}</span>`;
      }).join('')}</div>`;
    };
    box.querySelector('#lrun').onclick = run;
    run();
  }

  render();
})();
