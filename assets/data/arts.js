/* Боевые арты (Three Houses) и Engage-атаки (упрощённо).
   mt/hit/avo/crit — бонусы к оружию; eff — против кого эффективен; strikes — число ударов. */
window.FE_ARTS = [
  // Three Houses — мечи
  { id: 'wrathstrike', name: 'Wrath Strike', game: '3h', type: 'sword', mt: 5, hit: 10, crit: 0, cost: 3, desc: 'Базовый мощный удар.' },
  { id: 'grounder', name: 'Grounder', game: '3h', type: 'sword', mt: 3, hit: 20, crit: 0, eff: ['flier'], cost: 3, desc: 'Эффективен против летунов.' },
  { id: 'bane', name: 'Bane of Monsters', game: '3h', type: 'sword', mt: 6, hit: 0, crit: 0, eff: ['monster'], cost: 4, desc: 'Эффективен против монстров.' },
  { id: 'haze', name: 'Haze Slice', game: '3h', type: 'sword', mt: 1, hit: 0, avo: 30, crit: 0, cost: 5, desc: 'Высокое уклонение при атаке.' },
  { id: 'windsweep', name: 'Windsweep', game: '3h', type: 'sword', mt: 1, hit: 0, crit: 0, cost: 3, desc: 'Цель не сможет контратаковать.', noCounter: true },
  { id: 'hexblade', name: 'Hexblade', game: '3h', type: 'sword', mt: 7, hit: 10, crit: 0, magic: true, cost: 3, desc: 'Магический урон мечом (против Res).' },
  { id: 'assassinate', name: 'Assassinate', game: '3h', type: 'sword', mt: 3, hit: 0, crit: 20, cost: 5, desc: 'Высокий крит, урон в спину.' },
  // Копья
  { id: 'tempestlance', name: 'Tempest Lance', game: '3h', type: 'lance', mt: 8, hit: 10, crit: 0, cost: 3, desc: 'Сильный удар копьём.' },
  { id: 'knightkneeler', name: 'Knightkneeler', game: '3h', type: 'lance', mt: 3, hit: 0, crit: 0, eff: ['cavalry'], cost: 3, desc: 'Эффективен против всадников.' },
  { id: 'shatter', name: 'Shatter Slash', game: '3h', type: 'lance', mt: 3, hit: 10, crit: 0, cost: 3, desc: 'Снижает Def цели на 5.' },
  { id: 'hitandrun', name: 'Hit and Run', game: '3h', type: 'lance', mt: 0, hit: 10, crit: 0, cost: 3, desc: 'Отступает на 1 клетку после атаки.' },
  // Топоры
  { id: 'smash', name: 'Smash', game: '3h', type: 'axe', mt: 3, hit: 20, crit: 20, cost: 2, desc: 'Универсальный удар топором.' },
  { id: 'helmsplitter', name: 'Helm Splitter', game: '3h', type: 'axe', mt: 3, hit: -10, crit: 0, eff: ['armor'], cost: 3, desc: 'Эффективен против брони.' },
  { id: 'focusedstrike', name: 'Focused Strike', game: '3h', type: 'axe', mt: 0, hit: 30, crit: 0, cost: 4, desc: 'Высокая точность.' },
  { id: 'diamondaxe', name: 'Diamond Axe', game: '3h', type: 'axe', mt: 14, hit: -30, crit: 0, cost: 4, desc: 'Огромный урон, низкая точность.' },
  // Луки
  { id: 'curvedshot', name: 'Curved Shot', game: '3h', type: 'bow', mt: 1, hit: 30, crit: 0, cost: 3, desc: 'Дальность +1, высокая точность.' },
  { id: 'deadeye', name: 'Deadeye', game: '3h', type: 'bow', mt: 3, hit: -20, crit: 0, cost: 5, desc: 'Дальность +3.' },
  { id: 'heavydraw', name: 'Heavy Draw', game: '3h', type: 'bow', mt: 8, hit: 0, crit: 0, cost: 5, desc: 'Сильный выстрел.' },
  { id: 'waningshot', name: 'Waning Shot', game: '3h', type: 'bow', mt: 1, hit: 0, crit: 0, cost: 3, desc: 'Снижает Str цели на 4.' },
  // Кастеты
  { id: 'fadingblow', name: 'Fading Blow', game: '3h', type: 'gauntlet', mt: 5, hit: 0, avo: 30, crit: 0, cost: 3, desc: 'Удар с отступом.' },
  { id: 'fierceironfist', name: 'Fierce Iron Fist', game: '3h', type: 'gauntlet', mt: 0, hit: 0, crit: 0, strikes: 2, cost: 5, desc: 'Три удара за атаку (в симуляторе — эффект храброго оружия).' },
  // Engage (упрощённо: как бонус к одной атаке)
  { id: 'astrastorm', name: 'Astra Storm (Лин)', game: 'engage', type: 'bow', mt: 0, hit: 0, crit: 0, strikes: 2, desc: 'Engage-атака Эмблемы Лин: град выстрелов с большой дистанции. В симуляторе — двойная серия ударов.' },
  { id: 'greataether', name: 'Great Aether (Айк)', game: 'engage', type: 'axe', mt: 5, hit: 20, crit: 0, strikes: 2, desc: 'Engage-атака Эмблемы Айка: серия ударов с восстановлением HP.' },
  { id: 'twinstrike', name: 'Twin Strike (Эйрика)', game: 'engage', type: 'sword', mt: 0, hit: 10, crit: 0, strikes: 2, desc: 'Engage-атака Эмблемы Эйрики: удар вместе с братом.' },
  { id: 'blazinglion', name: 'Blazing Lion (Рой)', game: 'engage', type: 'sword', mt: 6, hit: 0, crit: 0, desc: 'Engage-атака Эмблемы Роя: мощный огненный удар по области.' },
  { id: 'lodestar', name: 'Lodestar Rush (Март)', game: 'engage', type: 'sword', mt: 0, hit: 10, crit: 0, strikes: 2, desc: 'Engage-атака Эмблемы Марта: стремительная серия ударов.' },
];
window.FE_ARTS_BY_ID = Object.fromEntries(window.FE_ARTS.map((a) => [a.id, a]));
