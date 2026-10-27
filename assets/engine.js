/* Боевой движок: правила разных поколений Fire Emblem + симуляция боя.
   Формулы сверены с Serenes Forest и Fire Emblem Wiki (окт. 2026). */
(function () {
  const fl = Math.floor;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const MAGIC_TYPES = ['anima', 'light', 'dark', 'tome'];

  // Классический треугольник: меч > топор > копьё > меч
  const PHYS_TRI = { sword: 'axe', axe: 'lance', lance: 'sword' };
  // Магический треугольник GBA: анима > свет > тьма > анима
  const MAG_TRI = { anima: 'light', light: 'dark', dark: 'anima' };
  // Fates: меч/магия > топор/лук > копьё/кинжал > меч/магия
  const FATES_GROUP = { sword: 0, anima: 0, light: 0, dark: 0, tome: 0, axe: 1, bow: 1, lance: 2, dagger: 2 };
  // Engage: меч > топор > копьё > меч; кулаки (Arts) ломают луки, кинжалы и книги
  const ENGAGE_TRI = { sword: ['axe'], axe: ['lance'], lance: ['sword'], gauntlet: ['bow', 'dagger', 'anima', 'tome', 'light', 'dark'] };

  function triangle(rules, a, b) {
    if (!a || !b || rules.tri === 'none') return 0;
    if (rules.tri === 'fates') {
      const ga = FATES_GROUP[a], gb = FATES_GROUP[b];
      if (ga === undefined || gb === undefined) return 0;
      if ((ga + 1) % 3 === gb) return 1;
      if ((gb + 1) % 3 === ga) return -1;
      return 0;
    }
    if (rules.tri === 'engage') {
      if ((ENGAGE_TRI[a] || []).includes(b)) return 1;
      if ((ENGAGE_TRI[b] || []).includes(a)) return -1;
      return 0;
    }
    if (PHYS_TRI[a] === b) return 1;
    if (PHYS_TRI[b] === a) return -1;
    if (rules.magTri) {
      if (MAG_TRI[a] === b) return 1;
      if (MAG_TRI[b] === a) return -1;
    }
    return 0;
  }

  /* s — статы, w — оружие (wt уже включает вес снаряжения) */
  const RULES = {
    gba: {
      id: 'gba', name: 'GBA (FE7, межд. версия)', double: 4, rn: '2rn', tri: 'classic', magTri: true,
      triHit: 15, triDmg: 1, eff: 2, critMult: 3, artNoDouble: false, braveInitOnly: false, usesWeight: true,
      as: (s, w) => s.spd - Math.max(0, w.wt - s.con),
      hit: (s, w) => w.hit + s.skl * 2 + fl(s.lck / 2),
      avo: (s, as) => as * 2 + s.lck,
      crit: (s, w) => w.crit + fl(s.skl / 2),
      ddg: (s) => s.lck,
      f: { as: 'Spd − max(0, Wt − Con)', hit: 'Hit оружия + Skl×2 + Lck/2', avo: 'AS×2 + Lck', crit: 'Crit оружия + Skl/2', ddg: 'Lck' }
    },
    awakening: {
      id: 'awakening', name: 'Awakening (FE13)', double: 5, rn: '2rn', tri: 'classic', magTri: false,
      triHit: 15, triDmg: 1, eff: 3, critMult: 3, artNoDouble: false, braveInitOnly: false, usesWeight: false,
      as: (s, w) => s.spd + (w.fu || 0),
      hit: (s, w) => w.hit + fl((s.skl * 3 + s.lck) / 2),
      avo: (s) => fl((s.spd * 3 + s.lck) / 2),
      crit: (s, w) => w.crit + fl(s.skl / 2),
      ddg: (s) => s.lck,
      f: { as: 'Spd (вес не влияет)', hit: 'Hit оружия + (Skl×3 + Lck)/2', avo: '(Spd×3 + Lck)/2', crit: 'Crit оружия + Skl/2', ddg: 'Lck' }
    },
    fates: {
      id: 'fates', name: 'Fates (FE14)', double: 5, rn: 'hybrid', tri: 'fates', magTri: false,
      triHit: 15, triDmg: 1, eff: 3, critMult: 3, artNoDouble: false, braveInitOnly: true, usesWeight: false,
      as: (s, w) => s.spd + (w.fu || 0),
      hit: (s, w) => w.hit + fl((s.skl * 3 + s.lck) / 2),
      avo: (s) => fl((s.spd * 3 + s.lck) / 2),
      crit: (s, w) => w.crit + fl((s.skl - 4) / 2),
      ddg: (s) => fl(s.lck / 2),
      f: { as: 'Spd ± модификатор удвоения оружия', hit: 'Hit оружия + (Skl×3 + Lck)/2', avo: '(Spd×3 + Lck)/2', crit: 'Crit оружия + (Skl − 4)/2', ddg: 'Lck/2' }
    },
    '3h': {
      id: '3h', name: 'Three Houses (FE16)', double: 4, rn: '2rn', tri: 'none', magTri: false,
      triHit: 0, triDmg: 0, eff: 3, critMult: 3, artNoDouble: true, braveInitOnly: true, usesWeight: true,
      as: (s, w) => s.spd - Math.max(0, w.wt - fl(s.str / 5)),
      hit: (s, w) => w.magic ? w.hit + fl((s.skl + s.lck) / 2) : w.hit + s.skl,
      avo: (s, as, magicIncoming) => magicIncoming ? fl((s.spd + s.lck) / 2) : as,
      crit: (s, w) => w.crit + fl((s.skl + s.lck) / 2),
      ddg: (s) => s.lck,
      f: { as: 'Spd − max(0, Wt − Str/5)', hit: 'Физ.: Hit + Dex · Маг.: Hit + (Dex + Lck)/2', avo: 'Физ.: AS · Маг.: (Spd + Lck)/2', crit: 'Crit оружия + (Dex + Lck)/2', ddg: 'Lck' }
    },
    engage: {
      id: 'engage', name: 'Engage (FE17)', double: 5, rn: 'hybrid', tri: 'engage', magTri: false,
      triHit: 0, triDmg: 0, eff: 3, critMult: 3, artNoDouble: true, braveInitOnly: true, breakOnAdv: true, usesWeight: true,
      as: (s, w) => s.spd - Math.max(0, w.wt - s.con),
      hit: (s, w) => w.hit + s.skl * 2 + fl(s.lck / 2),
      avo: (s, as) => as * 2 + fl(s.lck / 2),
      crit: (s, w) => w.crit + fl(s.skl / 2),
      ddg: (s) => s.lck,
      f: { as: 'Spd − max(0, Wt − Bld)', hit: 'Hit оружия + Dex×2 + Lck/2', avo: 'AS×2 + Lck/2', crit: 'Crit оружия + Dex/2', ddg: 'Lck' }
    }
  };

  /* ---------- Истинная точность ----------
     1RN: RN < Hit. 2RN: (RN1+RN2)/2 < Hit.
     Гибрид (Fates/Echoes/Engage): при Hit ≥ 50 один RN (0–9999) сравнивается с
     Hit×100 + (40/3)·Hit·sin((0.02·Hit − 1)·180°). */
  const hybridThreshold = (h) => h * 100 + (40 / 3) * h * Math.sin(((0.02 * h - 1) * 180 * Math.PI) / 180);
  const trueHitCache = {};
  function trueHit(h, mode) {
    h = clamp(Math.round(h), 0, 100);
    const key = mode + h;
    if (key in trueHitCache) return trueHitCache[key];
    let p;
    if (mode === '1rn' || (mode === 'hybrid' && h < 50)) p = h / 100;
    else if (mode === 'hybrid') p = clamp(Math.ceil(hybridThreshold(h)), 0, 10000) / 10000;
    else {
      let c = 0;
      for (let a = 0; a < 100; a++) for (let b = 0; b < 100; b++) if ((a + b) / 2 < h) c++;
      p = c / 10000;
    }
    return (trueHitCache[key] = p);
  }
  function rollHit(h, mode) {
    h = clamp(Math.round(h), 0, 100);
    if (mode === '1rn' || (mode === 'hybrid' && h < 50)) return Math.floor(Math.random() * 100) < h;
    if (mode === 'hybrid') return Math.floor(Math.random() * 10000) < hybridThreshold(h);
    const a = Math.floor(Math.random() * 100), b = Math.floor(Math.random() * 100);
    return (a + b) / 2 < h;
  }
  const chance = (p) => Math.random() * 100 < p;

  /* ---------- Подготовка бойца ---------- */
  function skillsOf(u, foe) {
    const nihil = (foe.skills || []).includes('nihil');
    return (u.skills || []).map((id) => window.FE_SKILLS_BY_ID[id]).filter((s) => s && s.sim && !(nihil && s.sim.proc));
  }

  function prepare(u, foe, rules, initiating, opts) {
    const w = Object.assign({ mt: 0, hit: 0, crit: 0, wt: 0, eff: [] }, u.weapon || {});
    const fw = foe.weapon || {};
    const art = initiating && u.art ? window.FE_ARTS_BY_ID[u.art] : null;
    const s = { hp: u.hp, str: u.str, mag: u.mag, skl: u.skl, spd: u.spd, lck: u.lck, def: u.def, res: u.res, con: u.con };
    const ctx = { initiating, hpPct: (u.curHp ?? u.hp) / u.hp, foeType: fw.type, myType: w.type };
    const mods = { hit: 0, avo: 0, crit: 0, ddg: 0, dmg: 0, as: 0, prt: 0, rsl: 0 };
    // Снаряжение (щиты, кольца)
    const eq = u.equip ? (window.FE_ITEMS_BY_ID || {})[u.equip] : null;
    if (eq && eq.eq) {
      const e = eq.eq;
      if (e.wt && rules.usesWeight) w.wt += e.wt;
      mods.prt += e.prt || 0; mods.rsl += e.rsl || 0; mods.hit += e.hit || 0; mods.avo += e.avo || 0; mods.crit += e.crit || 0;
      if (e.spd) s.spd += e.spd;
      if (e.lck) s.lck += e.lck;
    }
    const procs = [];
    let vantage = false, desperation = false;
    for (const sk of skillsOf(u, foe)) {
      const e = sk.sim;
      if (e.when && !e.when(ctx)) continue;
      if (e.stats) for (const k in e.stats) s[k] += e.stats[k];
      if (e.mods) for (const k in e.mods) mods[k] += e.mods[k];
      if (e.proc) procs.push(sk);
      if (e.vantage) vantage = true;
      if (e.desperation) desperation = true;
    }
    if (art) {
      w.mt += art.mt || 0; w.hit += art.hit || 0; w.crit += art.crit || 0;
      mods.avo += art.avo || 0;
      if (art.eff) w.eff = (w.eff || []).concat(art.eff);
      if (art.magic) w.magic = true;
    }
    mods.avo += w.avo || 0; mods.ddg += w.ddg || 0;
    const b = u.bonus || {};
    mods.hit += +b.hit || 0; mods.avo += +b.avo || 0; mods.crit += +b.crit || 0; mods.dmg += +b.dmg || 0;
    const ter = u.terrain || { avo: 0, def: 0 };

    const tri = triangle(rules, w.type, fw.type);
    const triHit = tri * (opts.triHit ?? rules.triHit), triDmg = tri * (opts.triDmg ?? rules.triDmg);
    const as = rules.as(s, w) + mods.as;
    const effective = (w.eff || []).includes(foe.moveType) && !(foe.antiEff || []).includes(foe.moveType);
    const mt = (w.mt + triDmg) * (effective ? rules.eff : 1);
    const power = (w.magic ? s.mag : s.str) + mt + mods.dmg;
    const braveActive = !!(w.brave && (!rules.braveInitOnly || initiating)) || !!(art && art.strikes === 2);
    return {
      u, s, w, art, ctx, mods, procs, vantage, desperation, tri, triHit, effective,
      as, power, magic: !!w.magic, critMult: w.critx || rules.critMult,
      rawHit: rules.hit(s, w) + mods.hit + triHit,
      rawCrit: w.noCrit ? 0 : rules.crit(s, w) + mods.crit,
      ddg: rules.ddg(s) + mods.ddg,
      avoFor: (magicIncoming) => rules.avo(s, as, magicIncoming) + mods.avo + (ter.avo || 0),
      defFor: (magicIncoming) => (magicIncoming ? s.res + mods.rsl : s.def + mods.prt) + (ter.def || 0),
      brave: braveActive,
      noFollow: !!w.noFollow,
      foeFu: w.foeFu || 0,
      canCounter: u.canCounter !== false && !!u.weapon
    };
  }

  /* ---------- Прогноз ---------- */
  function forecast(A, D, rulesId, opts = {}) {
    const rules = RULES[rulesId];
    const mode = opts.rn || rules.rn;
    const a = prepare(A, D, rules, true, opts), d = prepare(D, A, rules, false, opts);
    const side = (x, y) => {
      const dmg = Math.max(0, x.power - y.defFor(x.magic));
      const hit = clamp(x.rawHit - y.avoFor(x.magic), 0, 100);
      const crit = clamp(x.rawCrit - y.ddg, 0, 100);
      return { dmg, hit, crit, trueHit: trueHit(hit, mode) * 100, critDmg: dmg * x.critMult };
    };
    const fa = side(a, d), fd = side(d, a);
    // Fates: часть оружия даёт противнику +5 к скорости для удвоения
    const asA = a.as + d.foeFu, asD = d.as + a.foeFu;
    const diff = asA - asD;
    const noDoubleA = a.noFollow || (a.art && !a.art.canDouble && (rules.artNoDouble || a.art.noDouble));
    fa.doubles = !noDoubleA && diff >= rules.double;
    fd.doubles = !d.noFollow && -diff >= rules.double;
    fa.strikes = (fa.doubles ? 2 : 1) * (a.brave ? 2 : 1);
    fd.strikes = d.canCounter ? (fd.doubles ? 2 : 1) * (d.brave ? 2 : 1) : 0;
    if (a.art && a.art.noCounter) fd.strikes = 0;
    fa.as = asA; fd.as = asD;
    fa.effective = a.effective; fd.effective = d.effective;
    fa.tri = a.tri; fd.tri = d.tri;
    return { a: fa, d: fd, pa: a, pd: d, rules, mode };
  }

  /* ---------- Один бой ---------- */
  function battle(A, D, rulesId, opts = {}) {
    const f = forecast(A, D, rulesId, opts);
    const { rules, mode } = f;
    const hp = { a: A.curHp ?? A.hp, d: D.curHp ?? D.hp };
    const max = { a: A.hp, d: D.hp };
    const log = [];
    const P = { a: f.pa, d: f.pd }, F = { a: f.a, d: f.d };
    const other = (k) => (k === 'a' ? 'd' : 'a');
    const broken = { a: false, d: false };
    const procRate = (sk, p) => sk.sim.rate(p.s);
    const hasProc = (p, id) => p.procs.find((s) => s.id === id);

    function strike(k) {
      const o = other(k);
      if (hp.a <= 0 || hp.d <= 0) return;
      if (broken[k]) { log.push({ k, type: 'broken' }); return; }
      const att = P[k];
      const astra = hasProc(att, 'astra'), aether = hasProc(att, 'aether'), adept = hasProc(att, 'adept');
      if (aether && chance(procRate(aether, att))) {
        log.push({ k, type: 'skill', skill: aether.name });
        single(k, { sol: true });
        if (hp[o] > 0) single(k, { luna: true });
        return;
      }
      if (astra && chance(procRate(astra, att))) {
        log.push({ k, type: 'skill', skill: astra.name });
        for (let i = 0; i < 5 && hp[o] > 0; i++) single(k, { half: true });
        return;
      }
      single(k, {});
      if (adept && hp[o] > 0 && hp[k] > 0 && chance(procRate(adept, att))) {
        log.push({ k, type: 'skill', skill: adept.name });
        single(k, {});
      }
    }

    function single(k, fx) {
      const o = other(k);
      if (hp.a <= 0 || hp.d <= 0) return;
      const att = P[k], def = P[o], fc = F[k];
      if (!rollHit(fc.hit, mode)) { log.push({ k, type: 'miss', hpA: hp.a, hpD: hp.d }); return; }
      let defVal = def.defFor(att.magic);
      let bonus = 0;
      const names = [];
      for (const sk of att.procs) {
        const id = sk.id;
        if (['astra', 'aether', 'adept'].includes(id)) continue;
        if (id === 'luna' && !fx.luna && chance(procRate(sk, att))) { fx.luna = true; names.push(sk.name); }
        if (id === 'sol' && !fx.sol && chance(procRate(sk, att))) { fx.sol = true; names.push(sk.name); }
        if (id === 'ignis' && chance(procRate(sk, att))) { bonus += fl((att.magic ? att.s.str : att.s.mag) / 2); names.push(sk.name); }
        if (id === 'vengeance' && chance(procRate(sk, att))) { bonus += fl((max[k] - hp[k]) / 2); names.push(sk.name); }
        if (id === 'lethality' && chance(procRate(sk, att))) { fx.kill = true; names.push(sk.name); }
      }
      if (fx.luna) defVal = fl(defVal / 2);
      let dmg = Math.max(0, att.power + bonus - defVal);
      if (fx.half) dmg = fl(dmg / 2);
      const isCrit = chance(fc.crit);
      if (isCrit) dmg *= att.critMult;
      for (const sk of def.procs) {
        if (sk.id === 'pavise' && !att.magic && att.w.type !== 'bow' && chance(procRate(sk, def))) { dmg = fl(dmg / 2); names.push(sk.name + ' (защ.)'); }
        if (sk.id === 'aegis' && (att.magic || att.w.type === 'bow') && chance(procRate(sk, def))) { dmg = fl(dmg / 2); names.push(sk.name + ' (защ.)'); }
        if (sk.id === 'greatshield' && chance(procRate(sk, def))) { dmg = 0; names.push(sk.name + ' (защ.)'); }
      }
      if (fx.kill) dmg = hp[o];
      if (dmg >= hp[o] && hp[o] > 1) {
        const mir = def.procs.find((s) => s.id === 'miracle');
        if (mir && chance(procRate(mir, def))) { dmg = hp[o] - 1; names.push(mir.name + ' (защ.)'); }
      }
      hp[o] = Math.max(0, hp[o] - dmg);
      let heal = 0;
      if (fx.sol) { heal = Math.min(fl(dmg / 2), max[k] - hp[k]); hp[k] += heal; }
      log.push({ k, type: 'hit', dmg, crit: isCrit, skills: names, heal, hpA: hp.a, hpD: hp.d, kill: fx.kill });
      // Counter (Awakening): возвращает урон соседнему атакующему, если удар не смертелен
      if (def.procs.find((s) => s.id === 'counter') && dmg > 0 && hp[o] > 0 && !att.magic && att.w.type !== 'bow') {
        hp[k] = Math.max(0, hp[k] - dmg);
        log.push({ k: o, type: 'reflect', dmg, hpA: hp.a, hpD: hp.d });
      }
      // Engage: Break — только инициатор, бронированные иммунны
      if (rules.breakOnAdv && k === 'a' && att.tri === 1 && hp[o] > 0 && D.moveType !== 'armor' && !broken[o]) {
        broken[o] = true; log.push({ k: o, type: 'break' });
      }
    }

    const order = [];
    const counterFirst = f.pd.vantage && f.d.strikes > 0;
    const brA = f.pa.brave ? 2 : 1, brD = f.pd.brave ? 2 : 1;
    const push = (k, n) => { for (let i = 0; i < n; i++) order.push(k); };
    const desp = f.a.doubles && f.pa.desperation && !counterFirst;
    if (counterFirst) { push('d', brD); push('a', brA); }
    else {
      push('a', brA);
      if (desp) push('a', brA);
      if (f.d.strikes) push('d', brD);
    }
    if (f.a.doubles && !desp) push('a', brA);
    if (f.d.doubles && f.d.strikes) push('d', brD);

    for (const k of order) {
      if (hp.a <= 0 || hp.d <= 0) break;
      strike(k);
    }
    return { log, hp, max, forecast: f };
  }

  /* ---------- Монте-Карло ---------- */
  function monteCarlo(A, D, rulesId, opts = {}, n = 10000) {
    let killA = 0, killD = 0, dmgToD = 0, dmgToA = 0;
    const distD = {}, distA = {};
    for (let i = 0; i < n; i++) {
      const r = battle(A, D, rulesId, opts);
      if (r.hp.d <= 0) killD++;
      if (r.hp.a <= 0) killA++;
      dmgToD += (D.curHp ?? D.hp) - r.hp.d;
      dmgToA += (A.curHp ?? A.hp) - r.hp.a;
      distD[r.hp.d] = (distD[r.hp.d] || 0) + 1;
      distA[r.hp.a] = (distA[r.hp.a] || 0) + 1;
    }
    return { n, pKillD: killD / n, pKillA: killA / n, avgDmgD: dmgToD / n, avgDmgA: dmgToA / n, distD, distA };
  }

  window.FE = { RULES, trueHit, forecast, battle, monteCarlo, triangle, MAGIC_TYPES };
})();
