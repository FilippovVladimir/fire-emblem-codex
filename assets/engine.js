/* Боевой движок: правила разных поколений Fire Emblem + симуляция боя.
   Формулы собраны по открытым данным сообщества (Serenes Forest, FE Wiki) и местами упрощены. */
(function () {
  const fl = Math.floor;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Классический треугольник: меч > топор > копьё > меч
  const PHYS_TRI = { sword: 'axe', axe: 'lance', lance: 'sword' };
  // Магический треугольник GBA: анима > свет > тьма > анима
  const MAG_TRI = { anima: 'light', light: 'dark', dark: 'anima' };
  // Fates: меч/магия > топор/лук > копьё/кинжал > меч/магия
  const FATES_GROUP = { sword: 0, anima: 0, light: 0, dark: 0, tome: 0, axe: 1, bow: 1, lance: 2, dagger: 2 };
  // Engage: меч > топор > копьё > меч; кулаки (art) ломают луки, кинжалы и книги
  const ENGAGE_TRI = { sword: ['axe'], axe: ['lance'], lance: ['sword'], gauntlet: ['bow', 'dagger', 'anima', 'tome', 'light', 'dark'] };

  function triangle(rules, a, b) {
    // возвращает +1 (преимущество), -1 (недостаток), 0
    if (!a || !b) return 0;
    if (rules.tri === 'none') return 0;
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

  const RULES = {
    gba: {
      id: 'gba', name: 'GBA (FE6–FE8)', double: 4, rn: '2rn', tri: 'classic', magTri: true,
      triHit: 15, triDmg: 1, eff: 3, critMult: 3, artNoDouble: false,
      as: (u, w) => u.spd - Math.max(0, w.wt - u.con),
      hit: (u, w) => w.hit + u.skl * 2 + fl(u.lck / 2),
      avo: (u, as) => as * 2 + u.lck,
      crit: (u, w) => w.crit + fl(u.skl / 2),
      ddg: (u) => u.lck,
      f: {
        as: 'Spd − max(0, Wt − Con)', hit: 'Hit оружия + Skl×2 + Lck/2', avo: 'AS×2 + Lck',
        crit: 'Crit оружия + Skl/2', ddg: 'Lck'
      }
    },
    awakening: {
      id: 'awakening', name: 'Awakening (FE13)', double: 4, rn: '1rn', tri: 'classic', magTri: false,
      triHit: 15, triDmg: 1, eff: 3, critMult: 3, artNoDouble: false,
      as: (u, w) => u.spd - Math.max(0, w.wt - u.str),
      hit: (u, w) => w.hit + fl(u.skl * 1.5) + fl(u.lck / 2),
      avo: (u, as) => fl(as * 1.5) + fl(u.lck / 2),
      crit: (u, w) => w.crit + fl(u.skl / 2),
      ddg: (u) => u.lck,
      f: {
        as: 'Spd − max(0, Wt − Str)', hit: 'Hit оружия + Skl×1.5 + Lck/2', avo: 'Spd×1.5 + Lck/2',
        crit: 'Crit оружия + Skl/2', ddg: 'Lck'
      }
    },
    fates: {
      id: 'fates', name: 'Fates (FE14)', double: 5, rn: 'hybrid', tri: 'fates', magTri: false,
      triHit: 15, triDmg: 1, eff: 3, critMult: 3, artNoDouble: false,
      as: (u, w) => u.spd - Math.max(0, w.wt),
      hit: (u, w) => w.hit + fl((u.skl * 3 + u.lck) / 2),
      avo: (u, as) => fl((as * 3 + u.lck) / 2),
      crit: (u, w) => w.crit + fl((u.skl - 4) / 2),
      ddg: (u) => fl(u.lck / 2),
      f: {
        as: 'Spd (− штрафы оружия)', hit: 'Hit оружия + (Skl×3 + Lck)/2', avo: '(Spd×3 + Lck)/2',
        crit: 'Crit оружия + (Skl − 4)/2', ddg: 'Lck/2'
      }
    },
    '3h': {
      id: '3h', name: 'Three Houses (FE16)', double: 4, rn: '1rn', tri: 'none', magTri: false,
      triHit: 0, triDmg: 0, eff: 3, critMult: 3, artNoDouble: true,
      as: (u, w) => u.spd - Math.max(0, w.wt - fl(u.str / 5)),
      hit: (u, w) => w.magic ? w.hit + fl((u.skl + u.lck) / 2) : w.hit + u.skl,
      avo: (u, as, magicIncoming) => magicIncoming ? fl((u.spd + u.lck) / 2) : as,
      crit: (u, w) => w.crit + fl((u.skl + u.lck) / 2),
      ddg: (u) => u.lck,
      f: {
        as: 'Spd − max(0, Wt − Str/5)', hit: 'Физ.: Hit оружия + Dex · Маг.: Hit + (Dex + Lck)/2',
        avo: 'Физ.: AS · Маг.: (Spd + Lck)/2', crit: 'Crit оружия + (Dex + Lck)/2', ddg: 'Lck'
      }
    },
    engage: {
      id: 'engage', name: 'Engage (FE17)', double: 5, rn: '2rn', tri: 'engage', magTri: false,
      triHit: 0, triDmg: 0, eff: 3, critMult: 3, artNoDouble: true, breakOnAdv: true,
      as: (u, w) => u.spd - Math.max(0, w.wt - u.con),
      hit: (u, w) => w.hit + u.skl * 2 + fl(u.lck / 2),
      avo: (u, as) => as * 2 + fl(u.lck / 2),
      crit: (u, w) => w.crit + fl(u.skl / 2),
      ddg: (u) => u.lck,
      f: {
        as: 'Spd − max(0, Wt − Bld)', hit: 'Hit оружия + Dex×2 + Lck/2', avo: 'AS×2 + Lck/2',
        crit: 'Crit оружия + Dex/2', ddg: 'Lck'
      }
    }
  };

  /* ---------- Истинная точность ---------- */
  const trueHitCache = {};
  function trueHit(h, mode) {
    h = clamp(Math.round(h), 0, 100);
    const key = mode + h;
    if (key in trueHitCache) return trueHitCache[key];
    let p;
    if (mode === '1rn' || (mode === 'hybrid' && h < 50)) p = h / 100;
    else {
      let c = 0;
      for (let a = 0; a < 100; a++) for (let b = 0; b < 100; b++) {
        const v = mode === '2rn' ? (a + b) / 2 : (3 * a + b) / 4;
        if (v < h) c++;
      }
      p = c / 10000;
    }
    return (trueHitCache[key] = p);
  }
  function rollHit(h, mode) {
    h = clamp(h, 0, 100);
    const a = Math.floor(Math.random() * 100), b = Math.floor(Math.random() * 100);
    if (mode === '1rn' || (mode === 'hybrid' && h < 50)) return a < h;
    if (mode === '2rn') return (a + b) / 2 < h;
    return (3 * a + b) / 4 < h;
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
    const ctx = { initiating, hpPct: (u.curHp ?? u.hp) / u.hp, foeType: fw.type, myType: w.type, phase: initiating ? 'player' : 'enemy' };
    const mods = { hit: 0, avo: 0, crit: 0, ddg: 0, dmg: 0, as: 0, prt: 0 };
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
    // Бонусы из формы (поддержки, ранги и т.п.)
    const b = u.bonus || {};
    mods.hit += +b.hit || 0; mods.avo += +b.avo || 0; mods.crit += +b.crit || 0; mods.dmg += +b.dmg || 0;
    const ter = u.terrain || { avo: 0, def: 0 };

    const tri = triangle(rules, w.type, fw.type);
    const triHit = tri * (opts.triHit ?? rules.triHit), triDmg = tri * (opts.triDmg ?? rules.triDmg);
    const as = rules.as(s, w) + mods.as;
    const effective = (w.eff || []).includes(foe.moveType);
    const mt = w.mt * (effective ? rules.eff : 1);
    const power = (w.magic ? s.mag : s.str) + mt + triDmg + mods.dmg;
    return {
      u, s, w, art, ctx, mods, procs, vantage, desperation, tri, triHit, effective,
      as, power, magic: !!w.magic,
      rawHit: rules.hit(s, w) + mods.hit + triHit,
      rawCrit: rules.crit(s, w) + mods.crit,
      ddg: rules.ddg(s) + mods.ddg,
      avoFor: (magicIncoming) => rules.avo(s, as, magicIncoming) + mods.avo + (ter.avo || 0),
      defFor: (magicIncoming) => (magicIncoming ? s.res : s.def) + (ter.def || 0) + mods.prt,
      brave: !!(w.brave || (art && art.strikes === 2)),
      canCounter: u.canCounter !== false && w.mt !== undefined && !!u.weapon
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
      return { dmg, hit, crit, trueHit: trueHit(hit, mode) * 100, critDmg: dmg * rules.critMult };
    };
    const fa = side(a, d), fd = side(d, a);
    const diff = a.as - d.as;
    const noDoubleA = a.art && (rules.artNoDouble || a.art.noDouble);
    fa.doubles = !noDoubleA && diff >= rules.double;
    fd.doubles = diff <= -rules.double;
    fa.strikes = (fa.doubles ? 2 : 1) * (a.brave ? 2 : 1);
    fd.strikes = d.canCounter ? (fd.doubles ? 2 : 1) * (d.brave ? 2 : 1) : 0;
    if (a.art && a.art.noCounter) fd.strikes = 0;
    fa.as = a.as; fd.as = d.as;
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
    let broken = { a: false, d: false };

    const procRate = (sk, p) => sk.sim.rate(p.s);
    const hasProc = (p, id) => p.procs.find((s) => s.id === id);

    function strike(k, isFollow) {
      const o = other(k);
      if (hp.a <= 0 || hp.d <= 0) return;
      if (broken[k]) { log.push({ k, type: 'broken' }); return; }
      const att = P[k], def = P[o], fc = F[k];
      // Астра / Эфир / Адепт — активируются при атаке
      const astra = hasProc(att, 'astra'), aether = hasProc(att, 'aether'), adept = hasProc(att, 'adept');
      if (astra && chance(procRate(astra, att))) {
        log.push({ k, type: 'skill', skill: astra.name });
        for (let i = 0; i < 5 && hp[o] > 0; i++) single(k, { half: true });
        return;
      }
      if (aether && chance(procRate(aether, att))) {
        log.push({ k, type: 'skill', skill: aether.name });
        single(k, { sol: true });
        if (hp[o] > 0) single(k, { luna: true });
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
      if (!rollHit(fc.hit, mode)) { log.push({ k, type: 'miss' }); return; }
      let defVal = def.defFor(att.magic);
      let bonus = 0;
      const names = [];
      for (const sk of att.procs) {
        const id = sk.id;
        if (['astra', 'aether', 'adept'].includes(id)) continue;
        if (id === 'luna' && !fx.luna && chance(procRate(sk, att))) { fx.luna = true; names.push(sk.name); }
        if (id === 'sol' && !fx.sol && chance(procRate(sk, att))) { fx.sol = true; names.push(sk.name); }
        if (id === 'ignis' && chance(procRate(sk, att))) { bonus += fl((att.magic ? att.s.res : att.s.def) / 2); names.push(sk.name); }
        if (id === 'vengeance' && chance(procRate(sk, att))) { bonus += fl((max[k] - hp[k]) / 2); names.push(sk.name); }
        if (id === 'lethality' && chance(procRate(sk, att))) { fx.kill = true; names.push(sk.name); }
      }
      if (fx.luna) defVal = fl(defVal / 2);
      let dmg = Math.max(0, att.power + bonus - defVal);
      if (fx.half) dmg = fl(dmg / 2);
      const isCrit = chance(fc.crit);
      if (isCrit) dmg *= rules.critMult;
      // Защитные навыки
      for (const sk of def.procs) {
        if (sk.id === 'pavise' && !att.magic && chance(procRate(sk, def))) { dmg = fl(dmg / 2); names.push(sk.name + ' (враг)'); }
        if (sk.id === 'aegis' && att.magic && chance(procRate(sk, def))) { dmg = fl(dmg / 2); names.push(sk.name + ' (враг)'); }
        if (sk.id === 'greatshield' && chance(procRate(sk, def))) { dmg = 0; names.push(sk.name + ' (враг)'); }
      }
      if (fx.kill) dmg = hp[o];
      if (dmg >= hp[o] && hp[o] > 1) {
        const mir = def.procs.find((s) => s.id === 'miracle');
        if (mir && chance(procRate(mir, def))) { dmg = hp[o] - 1; names.push(mir.name + ' (враг)'); }
      }
      hp[o] = Math.max(0, hp[o] - dmg);
      let heal = 0;
      if (fx.sol) { heal = Math.min(dmg, max[k] - hp[k]); hp[k] += heal; }
      log.push({ k, type: 'hit', dmg, crit: isCrit, skills: names, heal, hpA: hp.a, hpD: hp.d, kill: fx.kill });
      // Контрудар (Counter): возвращает урон в ближнем бою
      if (def.procs.find((s) => s.id === 'counter') && dmg > 0 && hp[o] > 0 && !att.magic) {
        hp[k] = Math.max(0, hp[k] - dmg);
        log.push({ k: o, type: 'reflect', dmg, hpA: hp.a, hpD: hp.d });
      }
      // Engage: Break — удар с преимуществом лишает противника контратаки
      if (rules.breakOnAdv && att.tri === 1 && hp[o] > 0) { if (!broken[o]) log.push({ k: o, type: 'break' }); broken[o] = true; }
    }

    const order = [];
    const counterFirst = f.pd.vantage && f.d.strikes > 0;
    const brA = f.pa.brave ? 2 : 1, brD = f.pd.brave ? 2 : 1;
    const push = (k, n) => { for (let i = 0; i < n; i++) order.push(k); };
    if (counterFirst) { push('d', brD); push('a', brA); }
    else {
      push('a', brA);
      if (f.a.doubles && f.pa.desperation) push('a', brA);
      if (f.d.strikes) push('d', brD);
    }
    if (f.a.doubles && !(f.pa.desperation && !counterFirst)) push('a', brA);
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

  window.FE = { RULES, trueHit, forecast, battle, monteCarlo, triangle };
})();
