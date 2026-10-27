/* Гайды по механикам. body — HTML. Виджеты: <div data-widget="..."></div> (см. app.js).
   Формулы сверены с Serenes Forest и Fire Emblem Wiki (окт. 2026). */
window.FE_MECH_CATS = [
  { id: 'combat', name: 'Бой', icon: '⚔️' },
  { id: 'growth', name: 'Развитие', icon: '📈' },
  { id: 'map', name: 'Карта и тактика', icon: '🗺️' },
  { id: 'systems', name: 'Системы серий', icon: '💍' },
];

window.FE_MECHANICS = [
  /* ===================== БОЙ ===================== */
  { id: 'forecast', en: 'Combat Forecast', cat: 'combat', title: 'Порядок боя и прогноз', lead: 'Кто бьёт первым, сколько раз и в каком порядке.',
    body: `
<p>Каждая атака в Fire Emblem — мини-раунд между <b>инициатором</b> (тем, кто напал) и <b>защитником</b>. Перед атакой игра показывает <b>прогноз боя</b>: урон, точность (Hit), шанс крита (Crit) и «×2», если кто-то бьёт дважды.</p>
<h3>Стандартный порядок ударов</h3>
<ol class="steps">
  <li><b>Инициатор</b> бьёт первым.</li>
  <li><b>Защитник</b> контратакует, если инициатор в дальности его оружия.</li>
  <li><b>Повторный удар (follow-up)</b> — тот, кто быстрее на порог удвоения, бьёт ещё раз.</li>
</ol>
<p>Бой заканчивается, как только у кого-то HP = 0. Храброе (Brave) оружие превращает каждую атаку в два удара подряд: с удвоением — 4 удара.</p>
<h3>Что ломает порядок</h3>
<ul>
  <li><b>Vantage</b> — защитник при HP ≤ 50% бьёт первым.</li>
  <li><b>Desperation</b> — инициатор при HP ≤ 50% наносит повторный удар сразу, до контратаки.</li>
  <li><b>Дальность</b>: лучник на 2 клетках не получит контратаку от мечника.</li>
  <li><b>Break</b> (Engage) — удар инициатора с преимуществом треугольника лишает цель контратаки.</li>
  <li><b>Windsweep</b> и похожие арты (Three Houses) запрещают контратаку.</li>
</ul>
<div class="tip"><b>Совет:</b> лучшая защита — не получать контратаку. Атакуйте магов и лучников в ближнем бою, а рыцарей — с дистанции.</div>` },

  { id: 'damage', en: 'Attack & Damage', cat: 'combat', title: 'Атака и урон', lead: 'Как считается урон и почему 0 — тоже число.',
    body: `
<div class="formula"><span class="fl">Атака (GBA)</span> = Str (или Mag) + (Mt + бонус треугольника) × Эффективность + поддержки</div>
<div class="formula"><span class="fl">Урон</span> = (Атака − Def/Res цели − бонус местности) × Крит</div>
<div class="formula"><span class="fl">Крит</span> = ×3 (в FE4–FE5 — ×2; у некоторых видов оружия в Fates — ×4)</div>
<p>Физическое оружие (мечи, копья, топоры, луки) использует <b>Str</b> против <b>Def</b>. Магия — <b>Mag</b> против <b>Res</b>. Урон не бывает отрицательным: если защита выше атаки — будет «0».</p>
<h3>Нюансы по играм</h3>
<table class="tbl"><tr><th>Игра</th><th>Особенность</th></tr>
<tr><td>FE1–FE5</td><td>Магический урон не зависит от Mag — только от мощи книги.</td></tr>
<tr><td>GBA</td><td>Магические мечи (Light Brand, Runesword) на дистанции бьют по Res и используют половину Str.</td></tr>
<tr><td>Awakening</td><td>Высокий ранг оружия добавляет к атаке (меч: +1/+2/+3 на C/B/A).</td></tr>
<tr><td>Fates</td><td>Многие оружия дают штрафы к статам после боя (Silver) или во время (Brave: Def/Res −4).</td></tr>
<tr><td>Three Houses</td><td>Защита — это Prt и Rsl: Def/Res + бонусы щита, батальона и умений.</td></tr></table>
<div data-widget="damage"></div>` },

  { id: 'weight', en: 'Weight & Constitution', cat: 'combat', title: 'Вес оружия и телосложение', lead: 'Полный разбор: как вес замедляет юнита в каждой игре и что его компенсирует.',
    body: `
<p><b>Вес (Wt)</b> — скрытый «налог» на скорость. Он почти никогда не меняет урон, но уменьшает <b>скорость атаки (AS)</b>, а от неё зависят <b>удвоение</b> и (в большинстве игр) <b>уклонение</b>. Поэтому тяжёлое оружие может сделать удар сильнее, но в итоге снизить урон за бой — юнит перестаёт бить дважды.</p>
<div class="formula"><span class="fl">Общая идея</span>: AS = Spd − max(0, Вес − «грузоподъёмность»)</div>
<p>Что считается «грузоподъёмностью», каждая эпоха решала по-своему:</p>
<table class="tbl"><tr><th>Игра</th><th>Формула AS</th><th>Что гасит вес</th></tr>
<tr><td>FE1, FE2, FE3, FE4</td><td>Spd − Wt</td><td>Ничего. В FE4 AS может уйти в минус.</td></tr>
<tr><td>Thracia 776 (FE5)</td><td>Spd − max(0, Wt − Con)</td><td>Con — но только для физического оружия. Вес книг вычитается полностью.</td></tr>
<tr><td>FE6, FE7, FE8 (GBA)</td><td>Spd − max(0, Wt − Con)</td><td>Телосложение (Con). Почти не растёт с уровнем.</td></tr>
<tr><td>Path of Radiance, Radiant Dawn, Shadow Dragon (DS)</td><td>Spd − max(0, Wt − Str)</td><td>Сила. Сильные юниты «не замечают» вес.</td></tr>
<tr><td>New Mystery (FE12), Awakening</td><td>Spd</td><td>Вес не влияет вообще.</td></tr>
<tr><td>Fates</td><td>Spd ± модификатор оружия</td><td>Веса нет. Вместо него у оружия «скорость удвоения −3» (Steel) или +5 (Excalibur, Pursuer).</td></tr>
<tr><td>Echoes</td><td>Spd − Wt</td><td>Ничего; Spd в меню уже показана с учётом веса.</td></tr>
<tr><td>Three Houses</td><td>Spd − max(0, Wt − Str/5)</td><td>Пятая часть силы. Вес щита/снаряжения добавляется к весу оружия.</td></tr>
<tr><td>Engage</td><td>Spd − max(0, Wt − Bld)</td><td>Телосложение (Build), которое здесь растёт с уровнем. Spd в меню уже с учётом веса.</td></tr>
<tr><td>Fortune's Weave</td><td>—</td><td>Build снижает «стоимость» тяжёлого оружия и снаряжения (точная формула пока не опубликована).</td></tr></table>
<h3>Пример: Steel Axe в трёх играх</h3>
<p>Юнит со Spd 12, Str 10, Con 9 берёт стальной топор:</p>
<ul>
<li><b>FE7</b>: Wt 15 − Con 9 = 6 → AS = 12 − 6 = <b>6</b>. Почти любой враг его удвоит.</li>
<li><b>Three Houses</b>: Wt 12 − Str/5 (2) = 10 → AS = <b>2</b>. Ещё хуже — поэтому в 3H так ценны умения «Weight −3/−5».</li>
<li><b>Awakening</b>: веса нет → AS = <b>12</b>. Можно брать самое сильное оружие.</li>
</ul>
<div data-widget="weightall"></div>
<h3>Где ещё работает вес и телосложение</h3>
<ul>
<li><b>Спасение (GBA)</b>: Aid ≥ Con цели. Aid пехоты = Con − 1, всадников-мужчин = 25 − Con, всадниц = 20 − Con. Тяжёлый (с высоким Con) юнит может быть неспасаемым.</li>
<li><b>Tellius</b>: появился отдельный стат <b>Weight</b> (вес тела) для спасения; Con используется для Shove в Radiant Dawn: Con + 2 ≥ вес цели.</li>
<li><b>Thracia 776</b>: вор может украсть оружие, только если его Con больше веса предмета.</li>
<li><b>Engage</b>: Shove и Smite работают, если Build толкающего больше Build цели.</li>
<li><b>Path of Radiance</b>: навык Colossus срабатывает при Con выше, чем у врага.</li>
</ul>
<h3>Как справляться с весом</h3>
<ul>
<li><b>GBA</b>: Body Ring (+2 Con), или держать лёгкое оружие для «удвоения» и тяжёлое — для убийства.</li>
<li><b>Three Houses</b>: умения Weight −3 / −5, не надевать тяжёлые щиты на хрупких мечников.</li>
<li><b>Engage</b>: классы с высоким ростом Build, Bond-кольца и навыки на Build.</li>
<li>Всегда сравнивайте прогноз: «Silver» без удвоения часто слабее «Iron» с удвоением.</li>
</ul>` },

  { id: 'doubling', en: 'Attack Speed & Doubling', cat: 'combat', title: 'Скорость атаки и удвоение', lead: 'Повторный удар — главный множитель урона в серии.',
    body: `
<p>Повторный удар (doubling, follow-up) происходит, если <b>скорость атаки (AS)</b> одного бойца выше, чем у другого, на порог. AS — это Spd с учётом веса оружия (подробнее — <a href="#/mechanics/weight">гайд по весу</a>).</p>
<table class="tbl"><tr><th>Игра</th><th>Порог удвоения</th></tr>
<tr><td>FE1, FE2, FE4, Echoes</td><td>AS выше хотя бы на 1 (в FE4 нужен ещё навык Pursuit)</td></tr>
<tr><td>FE3</td><td>+3</td></tr>
<tr><td>FE5–FE12 (вкл. GBA и Tellius)</td><td>+4</td></tr>
<tr><td>Awakening</td><td>+5</td></tr>
<tr><td>Fates</td><td>+5 (с модификаторами оружия)</td></tr>
<tr><td>Three Houses</td><td>+4</td></tr>
<tr><td>Engage</td><td>+5</td></tr>
<tr><td>Fortune's Weave</td><td>+4</td></tr></table>
<h3>Исключения</h3>
<ul>
<li><b>Арты</b> в Three Houses и Echoes, Engage-атаки — не удваивают.</li>
<li><b>Fates</b>: Hand Axe и другое метательное оружие не удваивает и даёт врагу +5 к скорости удвоения. Навык Wary Fighter отключает удвоение обоим.</li>
<li><b>Awakening</b>: Mire не удваивает; Raider-оружие и Parallel Falchion дают +3 к скорости удвоения.</li>
<li><b>Engage</b>: громовые книги (Thunder, Thoron) не удваивают.</li>
</ul>
<div data-widget="doubling"></div>` },

  { id: 'hit', en: 'Hit & Avoid', cat: 'combat', title: 'Точность и уклонение', lead: 'Откуда берётся число Hit в прогнозе.',
    body: `
<div class="formula"><span class="fl">Hit в прогнозе</span> = Точность атакующего − Уклонение цели (0…100)</div>
<table class="tbl"><tr><th>Игра</th><th>Точность</th><th>Уклонение</th></tr>
<tr><td>GBA</td><td>Hit + Skl×2 + Lck/2</td><td>AS×2 + Lck</td></tr>
<tr><td>Path of Radiance</td><td>Hit + Skl×2 + Lck</td><td>AS×2 + Lck</td></tr>
<tr><td>Awakening / Fates</td><td>Hit + (Skl×3 + Lck)/2</td><td>(Spd×3 + Lck)/2</td></tr>
<tr><td>Echoes</td><td>Физ.: Hit + Skl · Маг.: Hit + (Skl+Lck)/2</td><td>Физ.: AS · Маг.: (Spd+Lck)/2</td></tr>
<tr><td>Three Houses</td><td>Физ.: Hit + Dex · Маг.: Hit + (Dex+Lck)/2</td><td>Физ.: AS · Маг.: (Spd+Lck)/2</td></tr>
<tr><td>Engage</td><td>Hit + Dex×2 + Lck/2</td><td>Spd×2 + Lck/2 (Spd уже с весом)</td></tr></table>
<p>К точности добавляются треугольник оружия, ранги (S-ранг в GBA: +5), поддержки и навыки. К уклонению — <b>местность</b>: лес +20, форт +20, горы +30 (GBA).</p>
<div class="tip">Число в прогнозе — не настоящий шанс! Почти во всех играх с FE6 работает <a href="#/mechanics/truehit">истинная точность</a>.</div>` },

  { id: 'truehit', en: 'True Hit (RNG)', cat: 'combat', title: 'Истинная точность (RNG)', lead: 'Почему 80% почти никогда не промахиваются, а 30% почти никогда не попадают.',
    body: `
<p>Игра генерирует случайные числа (RN). Как они сравниваются с показанным Hit — зависит от игры.</p>
<h3>1RN — «честная» точность</h3>
<div class="formula">Попадание, если RN (0–99) &lt; Hit. Истинная = показанной.</div>
<p>FE1–FE5 (Thracia 776 ограничивает шанс 1…99%).</p>
<h3>2RN — «усреднённая»</h3>
<div class="formula">Попадание, если (RN₁ + RN₂) / 2 &lt; Hit</div>
<p>FE6–FE12, <b>Awakening</b> и <b>Three Houses</b>. Высокие шансы становятся выше (90 → ~98%), низкие — ниже (30 → ~18%).</p>
<h3>Гибрид — Fates, Echoes, Engage</h3>
<div class="formula">Hit &lt; 50: как 1RN<br>Hit ≥ 50: RN (0–9999) &lt; Hit×100 + (40/3)·Hit·sin((0.02·Hit − 1)·180°)</div>
<p>Низкие шансы честные, высокие «подтянуты» вверх, но мягче, чем в 2RN: 80% → ~90%.</p>
<div data-widget="truehit"></div>
<p class="muted">Крит и проки навыков во всех играх — один RN: 10% крита — это ровно 10%.</p>` },

  { id: 'crit', en: 'Critical Hits', cat: 'combat', title: 'Критические удары', lead: 'Тройной урон и как его избегать.',
    body: `
<div class="formula"><span class="fl">Шанс крита</span> = Crit атакующего − Dodge (уклонение от крита) цели</div>
<table class="tbl"><tr><th>Игра</th><th>Crit</th><th>Dodge</th></tr>
<tr><td>GBA</td><td>Crit + Skl/2 + классовый бонус (+15 у Swordmaster/Berserker; в FE6 +30) + S-ранг +5</td><td>Lck</td></tr>
<tr><td>Path of Radiance</td><td>Crit + Skl/2 (+15 Swordmaster/Sniper/Berserker)</td><td>Lck</td></tr>
<tr><td>Awakening</td><td>Crit + Skl/2</td><td>Lck</td></tr>
<tr><td>Fates</td><td>Crit + (Skl − 4)/2 + классовый (+5…+20)</td><td>Lck/2 + бонус оружия</td></tr>
<tr><td>Three Houses</td><td>Crit + (Dex + Lck)/2</td><td>Lck</td></tr>
<tr><td>Engage</td><td>Crit + Dex/2</td><td>Lck</td></tr></table>
<p>Крит умножает урон <b>на 3</b> (FE4–FE5 — ×2; Killer-оружие Fates и навык Brute Force в Engage — ×4). Промах не может быть критом.</p>
<div class="tip"><b>Luck</b> недооценён: он защищает от критов. Против боссов с Killer-оружием юнит с высоким Lck гораздо безопаснее.</div>` },

  { id: 'triangle', en: 'Weapon Triangle', cat: 'combat', title: 'Треугольник оружия', lead: 'Камень-ножницы-бумага серии и его варианты.',
    body: `
<div class="tri-wrap"><svg viewBox="0 0 260 220" class="tri-svg" aria-label="Треугольник оружия">
<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<g stroke="currentColor" stroke-width="2" fill="none" marker-end="url(#ar)" class="tri-arrows">
<path d="M118 42 L58 160"/><path d="M78 182 L182 182"/><path d="M202 160 L142 42"/></g>
<g class="tri-node"><circle cx="130" cy="28" r="22"/><text x="130" y="33">Sword</text></g>
<g class="tri-node"><circle cx="48" cy="182" r="22"/><text x="48" y="187">Axe</text></g>
<g class="tri-node"><circle cx="212" cy="182" r="22"/><text x="212" y="187">Lance</text></g>
</svg><p class="muted">Стрелка = «побеждает»: Sword → Axe → Lance → Sword</p></div>
<table class="tbl"><tr><th>Игра</th><th>Бонус преимущества (недостаток — с минусом)</th></tr>
<tr><td>FE4</td><td>Hit +20</td></tr>
<tr><td>FE5</td><td>Hit +5</td></tr>
<tr><td>FE6</td><td>Hit +10, Mt +1</td></tr>
<tr><td>FE7, FE8</td><td>Hit +15, Mt +1. Плюс магический: Anima → Light → Dark → Anima</td></tr>
<tr><td>FE9, FE10</td><td>Hit +10, Mt +1</td></tr>
<tr><td>Awakening</td><td>По рангу оружия: E — Hit +5; D — +10; C — +10 и Атк +1; B — +15 и Атк +1</td></tr>
<tr><td>Fates</td><td>По рангу: E +5; D +10; C +10/+1; B +15/+1; A — Hit +20 и Атк +2. Расширенный: Sword/Tome → Axe/Bow → Lance/Dagger</td></tr>
<tr><td>Echoes, Three Houses</td><td>Нет треугольника (в 3H его роль играют Breaker-умения)</td></tr>
<tr><td>Engage</td><td>Без бонусов к статам: удар <b>инициатора</b> с преимуществом вызывает <b>Break</b> — цель не контратакует до своей следующей фазы. Броня иммунна к Break. Кулаки (Arts) «ломают» луки, кинжалы и книги</td></tr>
<tr><td>Heroes</td><td>Атака +20%</td></tr></table>
<p><b>Reaver-оружие</b> (Lancereaver и т.п.) переворачивает треугольник и удваивает его эффект.</p>` },

  { id: 'effective', en: 'Effective Damage', cat: 'combat', title: 'Эффективный урон', lead: 'Почему лучник убивает пегаса с одного выстрела.',
    body: `
<div class="formula"><span class="fl">Атака</span> = Str + Mt × Множитель (если оружие эффективно против цели)</div>
<p>Множитель применяется к <b>мощи оружия</b>, а не к итоговому урону.</p>
<table class="tbl"><tr><th>Игра</th><th>Множитель</th></tr>
<tr><td>FE6, FE8</td><td>×3</td></tr>
<tr><td>FE7</td><td>×2 в международной версии, ×3 в японской</td></tr>
<tr><td>Path of Radiance</td><td>×2</td></tr>
<tr><td>Radiant Dawn, Awakening, Fates, Echoes</td><td>×3</td></tr>
<tr><td>Three Houses, Engage</td><td>×3 (бонус от навыков и артов — ×2)</td></tr></table>
<table class="tbl"><tr><th>Тип цели</th><th>Против кого эффективно</th></tr>
<tr><td>Flying</td><td>Луки, Wind/Excalibur, Grounder</td></tr>
<tr><td>Armored</td><td>Armorslayer, Hammer, Rapier, Helm Splitter</td></tr>
<tr><td>Cavalry</td><td>Horseslayer / Beast Killer, Rapier, Knightkneeler</td></tr>
<tr><td>Dragon</td><td>Wyrmslayer, Falchion, легендарное оружие FE7</td></tr>
<tr><td>Monster (3H)</td><td>Seraphim, Bane of Monsters</td></tr></table>
<div class="tip">Защита от эффективности: Delphi Shield (FE7), Aurora / Kadmos / Lampos Shield (3H). Все щиты — в <a href="#/items">базе предметов</a>.</div>` },

  { id: 'range', en: 'Range, Brave Weapons & Counters', cat: 'combat', title: 'Дальность, храброе оружие и контратака', lead: 'Как не получить сдачи.',
    body: `
<ul>
<li><b>1</b> — ближний бой (мечи, большинство копий и топоров).</li>
<li><b>2</b> — луки: не контратакуют вплотную.</li>
<li><b>1–2</b> — метательное оружие и магия: контратакуют всегда, но обычно слабее.</li>
<li><b>3–10</b> — осадная магия (Bolting, Purge) и баллисты: без контратаки.</li>
</ul>
<h3>Храброе (Brave) оружие</h3>
<p>Каждая атака = два удара подряд. В классических частях (GBA, Awakening) работает и в защите. В <b>Fates, Three Houses, Engage</b> — только при собственной атаке. Кастеты в 3H и Arts в Engage ведут себя так же.</p>` },

  { id: 'magicstaff', en: 'Magic & Staves', cat: 'combat', title: 'Магия и посохи', lead: 'Маги, лекари и как считается попадание посохов.',
    body: `
<p>Магия бьёт по <b>Res</b>, обычно имеет дальность 1–2. Маги хрупкие, но обходят высокую броню рыцарей.</p>
<h3>Точность статусных посохов (FE7)</h3>
<div class="formula"><span class="fl">Шанс</span> = (30 + Mag×5 + Skl) − (Res цели × 5 + Расстояние × 2)</div>
<p>Поэтому Sleep и Silence эффективны против физиков с низкой Res и почти бесполезны против магов.</p>
<h3>Лечение (GBA)</h3>
<div class="formula"><span class="fl">Heal</span> = Mag + 10 · <span class="fl">Mend</span> = Mag + 20 · <span class="fl">Recover</span> = полное HP</div>
<p>В Three Houses заклинания — заряды, восстанавливающиеся после битвы, и у них есть вес. В Engage точность посохов = Hit + Mag + Dex.</p>` },

  { id: 'skillproc', en: 'Skill Activation', cat: 'combat', title: 'Как срабатывают навыки', lead: 'Скилл-проки: шанс, приоритет, Nihil.',
    body: `
<p>Активируемые навыки проверяются при каждом ударе по своей формуле — почти всегда от <b>Skl/Dex</b>. Значения для Awakening:</p>
<table class="tbl"><tr><th>Навык</th><th>Шанс</th><th>Эффект</th></tr>
<tr><td>Luna</td><td>Skl%</td><td>Игнорирует 50% Def/Res</td></tr>
<tr><td>Sol</td><td>Skl%</td><td>Лечит на половину урона</td></tr>
<tr><td>Ignis</td><td>Skl%</td><td>+Mag/2 к физ. атаке или +Str/2 к магии</td></tr>
<tr><td>Astra</td><td>Skl/2 %</td><td>5 ударов по 50%</td></tr>
<tr><td>Aether</td><td>Skl/2 %</td><td>Удар с Sol + удар с Luna</td></tr>
<tr><td>Lethality</td><td>Skl/4 %</td><td>Мгновенное убийство</td></tr>
<tr><td>Vengeance</td><td>Skl×2 %</td><td>+ (MaxHP−HP)/2</td></tr>
<tr><td>Pavise / Aegis</td><td>Skl%</td><td>−50% урона (ближний / дальний и магия)</td></tr>
<tr><td>Miracle</td><td>Lck%</td><td>Выживание с 1 HP</td></tr></table>
<p>Если срабатывают несколько атакующих навыков, применяется самый приоритетный (Aether &gt; Astra &gt; Luna/Sol…). <b>Nihil</b> отключает проки врага.</p>
<p>Все навыки — в <a href="#/skills">базе навыков</a>; большинство можно попробовать в <a href="#/sim">симуляторе</a>.</p>` },

  /* ===================== РАЗВИТИЕ ===================== */
  { id: 'growths', en: 'Growth Rates', cat: 'growth', title: 'Рост характеристик', lead: 'Growth rates, средние статы и почему ваш Сейн бесполезен.',
    body: `
<p>При каждом повышении уровня для каждой характеристики бросается RN: если он меньше <b>шанса роста</b> (growth), стат растёт на +1.</p>
<div class="formula"><span class="fl">Средний стат</span> = База + Growth × (Уровень − Базовый уровень)</div>
<p>Например, Spd-growth 60% за 10 уровней даст в среднем +6, но и +3, и +9 вполне реальны.</p>
<h3>Особенности по играм</h3>
<ul>
<li><b>Fixed growths</b> — фиксированный рост без удачи (FE9 Hard, Fates/Three Houses опционально; в Engage на Maddening по умолчанию).</li>
<li><b>Классовые growth</b> (Awakening, Fates, 3H, Engage) — итог = личный + классовый.</li>
<li><b>Защита от пустых уровней</b> — в некоторых играх (FE9, FE10, 3H) гарантируется минимум +1–2 стата.</li>
<li><b>Капы</b> — максимумы класса.</li>
<li><b>Afa's Drops</b> (+5%) и <b>Aptitude</b> (+20%) повышают все шансы роста.</li>
</ul>
<div class="tip">Попробуйте <a href="#/tools">симулятор уровней</a>: он покажет, как сильно разнятся результаты при одних и тех же шансах.</div>` },

  { id: 'exp', en: 'Experience (EXP)', cat: 'growth', title: 'Опыт', lead: 'Кому отдавать убийства.',
    body: `
<p>Уровень = 100 EXP. Опыт зависит от разницы уровней атакующего и цели; продвинутые классы считаются как «уровень + 20».</p>
<h3>GBA (упрощённо)</h3>
<div class="formula"><span class="fl">EXP за урон</span> ≈ (31 + Ур. врага − Свой ур.) / Сила класса</div>
<div class="formula"><span class="fl">Бонус за убийство</span> ≈ (Ур. врага × Сила класса) − (Свой ур. × Сила класса) + 20</div>
<p>Промах даёт 1 EXP, лечение посохом — фиксированный опыт. Боссы дают крупный бонус.</p>
<h3>Важно</h3>
<ul><li><b>Убийства</b> дают гораздо больше опыта, чем урон — отдавайте их юнитам, которых нужно прокачать.</li>
<li><b>BEXP</b> (FE9–10) — бонусный опыт за быстрое прохождение, раздаётся вручную; рост идёт в статах с наибольшими шансами.</li></ul>` },

  { id: 'classes', en: 'Classes & Promotion', cat: 'growth', title: 'Классы и повышение', lead: 'Promotion, reclass, сертификаты.',
    body: `
<p>Большинство юнитов начинают в <b>базовом классе</b> и с 10 уровня могут <b>повыситься</b> предметом — получая бонусы к статам и новые типы оружия.</p>
<table class="tbl"><tr><th>Игры</th><th>Система</th></tr>
<tr><td>GBA</td><td>Печати (Hero Crest, Knight Crest…). Уровень сбрасывается до 1.</td></tr>
<tr><td>FE8</td><td>Ветвящиеся повышения: Cavalier → Paladin или Great Knight.</td></tr>
<tr><td>Awakening / Fates</td><td>Master Seal — повышение, Second Seal — смена класса с сохранением навыков.</td></tr>
<tr><td>Three Houses</td><td>Тренировка навыков у профессора и экзамен с печатью.</td></tr>
<tr><td>Engage</td><td>Master Seal / Second Seal + наследование навыков Эмблем за SP.</td></tr></table>
<div class="tip"><b>Когда повышаться?</b> На 20 уровне — больше статов в сумме; раньше — быстрее сильный класс. Все предметы повышения — в <a href="#/items">базе предметов</a>.</div>` },

  { id: 'wrank', en: 'Weapon Ranks', cat: 'growth', title: 'Ранги оружия', lead: 'E, D, C, B, A, S — и что они дают.',
    body: `
<p>Чтобы держать оружие, нужен его ранг. Ранг растёт от использования (WEXP).</p>
<ul>
<li><b>GBA</b>: S-ранг даёт Hit +5 и Crit +5; в FE6–FE8 только один S-ранг на юнита.</li>
<li><b>Awakening</b>: бонусы рангов (C / B / A): меч — Атк +1/+2/+3; копьё, лук, книга — Атк +1 / Атк +1 и Hit +5 / Атк +2 и Hit +5; топор — Hit +5 / +10 / Атк +1 и Hit +10. Ранг также усиливает треугольник.</li>
<li><b>Fates</b>: ранг определяет силу треугольника (до Hit +20, Атк +2 на A).</li>
<li><b>Three Houses</b>: «уровни навыков» открывают классы и боевые арты.</li>
</ul>` },

  { id: 'durability', en: 'Durability', cat: 'growth', title: 'Прочность оружия', lead: 'Экономика серии.',
    body: `
<p>В большинстве частей оружие ломается после N использований (Iron ≈ 45, Silver ≈ 20). Каждая атака тратит 1 единицу.</p>
<ul><li><b>Fates и Engage</b> — оружие вечное, баланс через штрафы и цену.</li>
<li><b>Three Houses</b> — сломанное оружие очень слабое, но чинится у кузнеца.</li>
<li><b>Echoes</b> — оружие не ломается, у юнита один слот оружия.</li>
<li>Боевые арты в 3H тратят несколько единиц прочности за раз.</li>
<li>Навык <b>Armsthrift</b> (Awakening) — шанс Lck×2 % не потратить прочность.</li></ul>` },

  /* ===================== КАРТА ===================== */
  { id: 'terrain', en: 'Movement & Terrain', cat: 'map', title: 'Передвижение и местность', lead: 'Лес, горы, форты и стоимость клеток.',
    body: `
<p>Каждая клетка стоит очки передвижения (Mov) и даёт бонусы стоящему на ней.</p>
<table class="tbl"><tr><th>Клетка</th><th>Avo</th><th>Def</th><th>Особое</th></tr>
<tr><td>Plain</td><td>0</td><td>0</td><td></td></tr>
<tr><td>Forest</td><td>+20</td><td>+1</td><td>Дорого для всадников</td></tr>
<tr><td>Mountain</td><td>+30</td><td>+1</td><td>Недоступны всадникам</td></tr>
<tr><td>Fort</td><td>+20</td><td>+2</td><td>Лечит 20% HP за ход</td></tr>
<tr><td>Throne / Gate</td><td>+30</td><td>+3</td><td>Лечит; обычно там стоит босс</td></tr>
<tr><td>Pillar</td><td>+20</td><td>+1</td><td></td></tr></table>
<p class="muted">Значения GBA (FE7). В других частях бонусы похожи по смыслу, но отличаются. Летуны обычно игнорируют стоимость местности, но и не получают бонусов.</p>
<div class="tip"><b>Канто</b> у всадников позволяет «ударить и отойти» — основа безопасной агрессии.</div>` },

  { id: 'rescue', en: 'Rescue, Aid & Con', cat: 'map', title: 'Спасение, Aid и Con', lead: 'Как поднять союзника и унести его из-под удара.',
    body: `
<p>В FE5–FE10 юнит может <b>спасти</b> (Rescue) союзника. Пока он несёт союзника, его Spd и Skl уменьшаются вдвое.</p>
<div class="formula"><span class="fl">GBA</span>: можно спасти, если Aid ≥ Con цели<br>Aid: пехота = Con − 1 · всадники = 25 − Con · всадницы = 20 − Con</div>
<div class="formula"><span class="fl">Thracia 776</span>: Con спасающего &gt; Con цели (всадники считаются как Con 20)</div>
<div class="formula"><span class="fl">Tellius</span>: используется отдельный стат Weight (вес тела)</div>
<p>Трюк <b>Rescue → Drop</b>: спасти, сделать шаг и поставить союзника, «протащив» его дальше его передвижения. В современных частях роль спасения выполняют Swap, Shove, Reposition и Pair Up. Подробнее про Con — в <a href="#/mechanics/weight">гайде по весу</a>.</p>` },

  { id: 'ai', en: 'Enemy AI & Baiting', cat: 'map', title: 'Поведение ИИ и бейт', lead: 'Как враги выбирают цель — и как этим пользоваться.',
    body: `
<p>Враги обычно оценивают: могу ли я убить, сколько урона нанесу и сколько получу в ответ. Упрощённо: приоритет — <b>убийство</b>, затем <b>максимальный урон</b>.</p>
<ul>
<li><b>Бейт</b>: поставьте танка в лес на краю зоны угрозы — враги нападут на него, а не на хрупких магов.</li>
<li><b>Зона угрозы</b>: в современных частях можно подсветить, куда достают враги. Проверяйте её каждый ход.</li>
<li>Некоторые враги стоят на месте, пока вы не подойдёте; боссы часто не сходят с трона.</li>
<li>Воры бегут к сундукам, лекари лечат союзников.</li>
</ul>` },

  { id: 'fog', en: 'Fog of War', cat: 'map', title: 'Туман войны', lead: 'Когда не видно врагов.',
    body: `
<p>На картах с <b>туманом</b> видны только клетки в радиусе обзора ваших юнитов (у воров — больше). Факелы (Torch, +4 к обзору) и посох Torch расширяют обзор.</p>
<ul><li>Двигайтесь медленно и держите построение.</li>
<li>Воры — ваши разведчики.</li>
<li>Сначала разведка, потом атака.</li></ul>` },

  { id: 'difficulty', en: 'Difficulty & Permadeath', cat: 'map', title: 'Сложность и перманентная смерть', lead: 'Classic vs Casual, Phoenix и перемотка.',
    body: `
<p>Фирменная черта серии — <b>перманентная смерть</b>: павший юнит не возвращается (смерть лорда = Game Over).</p>
<table class="tbl"><tr><th>Режим</th><th>Смысл</th></tr>
<tr><td>Classic</td><td>Перманентная смерть.</td></tr>
<tr><td>Casual (с FE12)</td><td>Павшие возвращаются после главы.</td></tr>
<tr><td>Phoenix (Fates)</td><td>Павшие возвращаются на следующем ходу.</td></tr></table>
<h3>Перемотка времени</h3>
<ul><li><b>Mila's Turnwheel</b> (Echoes), <b>Divine Pulse</b> (Three Houses), <b>Draconic Time Crystal</b> (Engage) — откат ходов ограниченное число раз.</li></ul>
<div class="tip">Новичкам: Casual не делает бой проще, он просто снимает стресс. Играйте как удобно.</div>` },

  /* ===================== СИСТЕМЫ ===================== */
  { id: 'supports', en: 'Supports', cat: 'systems', title: 'Поддержки (Supports)', lead: 'Дружба в Fire Emblem даёт реальные бонусы.',
    body: `
<p>Юниты, сражающиеся рядом, открывают диалоги поддержки <b>C → B → A</b> (иногда S — романтика/брак).</p>
<ul><li><b>GBA</b>: бонус зависит от <b>сродства</b> (Fire, Thunder, Wind, Ice, Dark, Light, Anima) обоих и работает в пределах 3 клеток: Hit, Avo, Crit, Ddg и немного Атк/Защ.</li>
<li>В GBA число рангов поддержки на юнита ограничено (5).</li>
<li><b>Awakening / Fates</b>: S-поддержка → брак → дети с наследованием навыков и классов.</li>
<li><b>Three Houses</b>: поддержки дают бонусы к Hit, Avo, Crit и влияют на эпилоги.</li></ul>` },

  { id: 'pairup', en: 'Pair Up & Stances', cat: 'systems', title: 'Pair Up и стойки (Awakening, Fates)', lead: 'Два юнита в одной клетке.',
    body: `
<h3>Awakening</h3>
<p><b>Pair Up</b>: юнит «несёт» напарника и получает бонусы к статам. Напарник может ударить или блокировать:</p>
<div class="formula"><span class="fl">Dual Strike</span> = (Skl ведущего + Skl напарника) / 4 + бонус поддержки + навыки<br><span class="fl">Dual Guard</span> = (Def ведущего + Def напарника) / 4 + бонус поддержки + навыки</div>
<h3>Fates</h3>
<ul><li><b>Attack Stance</b> — союзник рядом с атакующим добавляет удар (Dual Strike), но без блоков.</li>
<li><b>Guard Stance</b> — напарник даёт статы и блок, который заполняется шкалой и гарантированно блокирует атаку.</li>
<li>Враги тоже используют стойки!</li></ul>` },

  { id: 'battalions', en: 'Battalions & Gambits', cat: 'systems', title: 'Батальоны и гамбиты (Three Houses)', lead: 'Отряды поддержки и ваши «спецатаки».',
    body: `
<p><b>Батальон</b> экипируется юниту, даёт бонусы к статам и открывает <b>гамбит</b> — специальное действие без контратаки.</p>
<ul><li>Гамбиты бьют по площади или по одной цели.</li>
<li>Гамбит гарантированно попадает по монстрам и ломает их барьеры.</li>
<li>При получении урона батальон теряет выносливость; при 0 бонусы пропадают.</li>
<li><b>Combat Arts</b> — приёмы оружия: бонус Mt/Hit/Crit, эффективность, но трата прочности и <b>без повторного удара</b>.</li></ul>
<p>Все арты — в <a href="#/arts">базе артов</a>.</p>` },

  { id: 'engage', en: 'Emblem Rings & Engage', cat: 'systems', title: 'Кольца Эмблем и Engage', lead: 'Главная механика Fire Emblem Engage.',
    body: `
<p>Юнит экипирует <b>Кольцо Эмблемы</b> — духа героя прошлых игр — и получает пассивные бонусы и синхро-навыки.</p>
<ul><li><b>Engage</b>: при заполненной шкале юнит сливается с Эмблемой на 3 хода: новое оружие, навыки и одна мощная <b>Engage-атака</b> (без повторного удара).</li>
<li><b>Bond</b> — уровень связи с Эмблемой открывает навыки, которые можно унаследовать за SP.</li>
<li><b>Break</b> — удар инициатора с преимуществом треугольника лишает врага контратаки. Основа тактики Engage.</li>
<li><b>Bond-кольца</b> — малые бонусы от второстепенных героев.</li></ul>` },
];
window.FE_MECH_BY_ID = Object.fromEntries(window.FE_MECHANICS.map((m) => [m.id, m]));

window.FE_GLOSSARY = [
  ['AS', 'Attack Speed — скорость атаки с учётом веса оружия. Определяет удвоение и (обычно) уклонение.'],
  ['Avo', 'Avoid — уклонение. Вычитается из точности врага.'],
  ['BEXP', 'Bonus Experience — бонусный опыт в FE9/FE10, раздаётся вручную.'],
  ['Bld / Con', 'Build / Constitution — телосложение. Снижает штраф от веса и определяет, кого можно спасти.'],
  ['Break', 'Engage: удар инициатора с преимуществом треугольника — цель не контратакует.'],
  ['Canto', 'Возможность двигаться после действия.'],
  ['Chip damage', 'Небольшой урон, который готовит убийство другим юнитом.'],
  ['Crit', 'Критический удар: урон ×3.'],
  ['Ddg', 'Dodge — уклонение от крита.'],
  ['Dex / Skl', 'Dexterity / Skill — мастерство. Точность, крит, шанс навыков.'],
  ['Doubling', 'Повторный удар, если AS выше на порог (4 или 5 в зависимости от игры).'],
  ['Feed', 'Отдавать убийства слабому юниту, чтобы его прокачать.'],
  ['Growth', 'Шанс роста характеристики при повышении уровня.'],
  ['Jagen', 'Архетип: сильный юнит на старте с плохим ростом (по имени Джейгена из FE1).'],
  ['Lck', 'Luck — удача. Немного точности/уклонения, защита от критов.'],
  ['LTC', 'Low Turn Count — прохождение глав за минимум ходов.'],
  ['Mt', 'Might — мощь оружия.'],
  ['Prf', 'Personal — личное оружие, доступное одному персонажу.'],
  ['Proc', 'Срабатывание случайного навыка.'],
  ['Prt / Rsl', 'Protection / Resilience — итоговая физ./маг. защита в Three Houses.'],
  ['RN', 'Random Number — случайное число для проверок.'],
  ['Rescue', 'Подобрать союзника на свою клетку.'],
  ['Reclass', 'Смена класса (Second Seal и аналоги).'],
  ['Tank', 'Юнит, который держит удары врагов.'],
  ['True Hit', 'Реальный шанс попадания с учётом системы RN.'],
  ['WEXP', 'Опыт владения оружием.'],
  ['Wt', 'Weight — вес оружия или снаряжения.'],
];
