/* Боевые арты Three Houses (сверено с Serenes Forest) и Engage-атаки (только описание).
   mt/hit/avo/crit — бонусы к оружию; eff — против кого эффективен; strikes — число ударов; cost — расход прочности. */
window.FE_ARTS = [
  // Мечи
  { id: 'wrathstrike', name: 'Wrath Strike', game: '3h', type: 'sword', mt: 5, hit: 10, cost: 3, desc: 'Базовый мощный удар.' },
  { id: 'sunder', name: 'Sunder', game: '3h', type: 'sword', mt: 4, crit: 15, cost: 3, desc: 'Удар с повышенным критом.' },
  { id: 'grounder', name: 'Grounder', game: '3h', type: 'sword', mt: 3, hit: 20, crit: 5, eff: ['flier'], cost: 4, desc: 'Эффективен против летунов.' },
  { id: 'hexblade', name: 'Hexblade', game: '3h', type: 'sword', mt: 7, hit: 10, magic: true, cost: 3, desc: 'Магический урон мечом (Mag против Res).' },
  { id: 'windsweep', name: 'Windsweep', game: '3h', type: 'sword', mt: 3, hit: 20, crit: 10, noCounter: true, cost: 5, desc: 'Цель не может контратаковать.' },
  { id: 'haze', name: 'Haze Slice', game: '3h', type: 'sword', mt: 2, avo: 30, cost: 5, desc: 'Высокое уклонение во время атаки.' },
  { id: 'bane', name: 'Bane of Monsters', game: '3h', type: 'sword', mt: 6, crit: 10, eff: ['monster'], cost: 4, desc: 'Эффективен против монстров.' },
  { id: 'sworddance', name: 'Sword Dance', game: '3h', type: 'sword', mt: 1, avo: 20, cost: 2, desc: 'Мощь растёт от Charm (в симуляторе не учтено).' },
  { id: 'foudroyant', name: 'Foudroyant Strike', game: '3h', type: 'sword', mt: 6, hit: 30, crit: 30, eff: ['armor', 'dragon'], cost: 3, desc: 'Только с Thunderbrand.' },
  { id: 'ruptured', name: 'Ruptured Heaven', game: '3h', type: 'sword', mt: 7, hit: 10, crit: 10, eff: ['dragon'], cost: 3, desc: 'Только с Sword of the Creator. Мощь растёт от Mag (не учтено).' },
  // Копья
  { id: 'tempestlance', name: 'Tempest Lance', game: '3h', type: 'lance', mt: 8, hit: 10, cost: 5, desc: 'Сильный удар копьём.' },
  { id: 'shatter', name: 'Shatter Slash', game: '3h', type: 'lance', mt: 4, hit: 10, cost: 3, desc: 'После боя: Def цели −5 на ход.' },
  { id: 'knightkneeler', name: 'Knightkneeler', game: '3h', type: 'lance', mt: 5, hit: 15, eff: ['cavalry'], cost: 4, desc: 'Эффективен против всадников.' },
  { id: 'hitandrun', name: 'Hit and Run', game: '3h', type: 'lance', mt: 4, hit: 10, avo: 20, cost: 4, desc: 'После боя отходит на 1 клетку.' },
  { id: 'swiftstrikes', name: 'Swift Strikes', game: '3h', type: 'lance', mt: 2, strikes: 2, cost: 4, desc: 'Два удара подряд.' },
  { id: 'atrocity', name: 'Atrocity', game: '3h', type: 'lance', mt: 15, hit: 20, eff: ['infantry', 'armor', 'cavalry', 'flier', 'dragon', 'monster'], cost: 3, desc: 'Только с Areadbhar. Эффективен против всех.' },
  // Топоры
  { id: 'smash', name: 'Smash', game: '3h', type: 'axe', mt: 3, hit: 20, crit: 20, cost: 5, desc: 'Универсальный удар топором.' },
  { id: 'spike', name: 'Spike', game: '3h', type: 'axe', mt: 5, hit: 15, crit: 10, cost: 5, desc: 'Улучшенный Smash.' },
  { id: 'helmsplitter', name: 'Helm Splitter', game: '3h', type: 'axe', mt: 7, crit: 5, eff: ['armor'], cost: 5, desc: 'Эффективен против брони.' },
  { id: 'focusedstrike', name: 'Focused Strike', game: '3h', type: 'axe', mt: 0, hit: 30, cost: 3, desc: 'Высокая точность.' },
  { id: 'diamondaxe', name: 'Diamond Axe', game: '3h', type: 'axe', mt: 14, hit: -20, cost: 7, desc: 'Огромный урон, сниженная точность.' },
  { id: 'wildabandon', name: 'Wild Abandon', game: '3h', type: 'axe', mt: 10, hit: -30, crit: 30, cost: 5, desc: 'Рискованный удар с высоким критом.' },
  { id: 'monsterbreaker', name: 'Monster Breaker', game: '3h', type: 'axe', mt: 9, eff: ['monster'], cost: 5, desc: 'Эффективен против монстров.' },
  // Луки
  { id: 'curvedshot', name: 'Curved Shot', game: '3h', type: 'bow', mt: 1, hit: 30, cost: 3, desc: 'Дальность 2–3, высокая точность.' },
  { id: 'deadeye', name: 'Deadeye', game: '3h', type: 'bow', mt: 6, cost: 5, desc: 'Дальность 3–5.' },
  { id: 'heavydraw', name: 'Heavy Draw', game: '3h', type: 'bow', mt: 8, hit: 10, cost: 5, desc: 'Сильный выстрел.' },
  { id: 'waningshot', name: 'Waning Shot', game: '3h', type: 'bow', mt: 4, hit: 10, cost: 3, desc: 'После боя: Str цели −5 на ход.' },
  { id: 'encloser', name: 'Encloser', game: '3h', type: 'bow', mt: 4, hit: 15, cost: 3, desc: 'Цель не может двигаться следующий ход.' },
  { id: 'pointblank', name: 'Point-Blank Volley', game: '3h', type: 'bow', mt: 3, hit: 10, avo: 10, strikes: 2, cost: 4, desc: 'Два выстрела вплотную.' },
  { id: 'fallenstar', name: 'Fallen Star', game: '3h', type: 'bow', mt: 10, hit: 30, crit: 10, eff: ['dragon'], cost: 3, desc: 'Только с Failnaught. Уклоняется от всех атак до следующего хода.' },
  // Кулаки
  { id: 'fadingblow', name: 'Fading Blow', game: '3h', type: 'gauntlet', mt: 6, hit: 10, avo: 30, cost: 3, desc: 'После боя отходит на 1 клетку.' },
  { id: 'mightyblow', name: 'Mighty Blow', game: '3h', type: 'gauntlet', mt: 10, hit: -5, crit: 20, cost: 3, desc: 'Самый сильный удар кулаком.' },
  { id: 'onetwo', name: 'One-Two Punch', game: '3h', type: 'gauntlet', mt: 8, hit: 20, cost: 4, canDouble: true, desc: 'Единственный арт кулака, который позволяет повторный удар.' },
  { id: 'fierceironfist', name: 'Fierce Iron Fist', game: '3h', type: 'gauntlet', mt: 1, crit: 10, strikes: 2, cost: 5, desc: 'Только Grappler. Три удара (в симуляторе — серия из двух).' },
  { id: 'triangleattack', name: 'Triangle Attack', game: '3h', type: 'lance', mt: 8, hit: 30, crit: 40, cost: 3, desc: 'Требует трёх летунов рядом с врагом.' },
  // Engage-атаки (только описание)
  { id: 'astrastorm', name: 'Astra Storm', who: 'Emblem Lyn', game: 'engage', type: 'bow', info: true, desc: 'Серия мощных выстрелов с очень большой дистанции.' },
  { id: 'greataether', name: 'Great Aether', who: 'Emblem Ike', game: 'engage', type: 'axe', info: true, desc: 'Серия ударов с восстановлением HP.' },
  { id: 'twinstrike', name: 'Twin Strike', who: 'Emblem Eirika', game: 'engage', type: 'sword', info: true, desc: 'Два последовательных удара (Eirika и Ephraim).' },
  { id: 'blazinglion', name: 'Blazing Lion', who: 'Emblem Roy', game: 'engage', type: 'sword', info: true, desc: 'Огненный удар, поджигающий клетки вокруг цели.' },
  { id: 'lodestar', name: 'Lodestar Rush', who: 'Emblem Marth', game: 'engage', type: 'sword', info: true, desc: 'Стремительная серия ударов.' },
  { id: 'override', name: 'Override', who: 'Emblem Sigurd', game: 'engage', type: 'lance', info: true, desc: 'Прорыв по прямой с атакой всех врагов на пути.' },
  { id: 'warpragnarok', name: 'Warp Ragnarok', who: 'Emblem Celica', game: 'engage', type: 'tome', info: true, desc: 'Телепорт к цели и мощное заклинание.' },
  { id: 'greatsacrifice', name: 'Great Sacrifice', who: 'Emblem Micaiah', game: 'engage', type: 'tome', info: true, desc: 'Лечит всех союзников ценой собственного HP.' },
  { id: 'quadruplehit', name: 'Quadruple Hit', who: 'Emblem Leif', game: 'engage', type: 'lance', info: true, desc: 'Четыре удара подряд.' },
  { id: 'allforone', name: 'All for One', who: 'Emblem Lucina', game: 'engage', type: 'sword', info: true, desc: 'Атака вместе с союзниками рядом.' },
  { id: 'goddessdance', name: 'Goddess Dance', who: 'Emblem Byleth', game: 'engage', type: 'gauntlet', info: true, desc: 'Даёт союзникам рядом возможность снова действовать.' },
  { id: 'dragonvein', name: 'Dragon Vein', who: 'Emblem Corrin', game: 'engage', type: 'tome', info: true, desc: 'Меняет местность на карте.' },
];
window.FE_ARTS_BY_ID = Object.fromEntries(window.FE_ARTS.map((a) => [a.id, a]));
