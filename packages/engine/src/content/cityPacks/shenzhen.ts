import type { CategoryContent } from '../row.js';

/**
 * Shenzhen Metro station-name pack. DESIGN.md §11.6 "City packs" — station
 * names as their own downloadable content, distinct from the generic transit
 * vocabulary in transit-platform.ts/transit-ticket.ts (开往, 换乘, 站台), which
 * teaches the words but never the real destination names a rider actually
 * has to read on a departure board.
 *
 * PROVENANCE: station names and their lines are drawn from public knowledge
 * of the Shenzhen Metro system map (Lines 1, 2, 3, 4, 5, 7 — the long-running
 * core of the network); see ../cityPacks/PROVENANCE.md for the full entry
 * required by DESIGN.md §11.6 correction 4 / §9.3 gate 2. 55 stations are
 * shipped, not ~400 (DESIGN.md's figure was for its original Chengdu-context
 * imagination) — every entry here is one the author is confident is a real,
 * correctly-named station; stations the author was not sure of were left out
 * rather than guessed, per this task's own instruction that a wrong station
 * name in a "real signage" product is a content-correctness bug.
 *
 * DISTRACTORS (§11.6 correction 2/3): both wrong options on every item are
 * real Shenzhen Metro stations, precomputed here as static literal data (no
 * runtime pairing) and each carries an authored `distractorRationale` entry
 * (correction 3) — same-line siblings where possible ("a rider looking at
 * the wrong platform board ends up here instead"), a same-network
 * cross-line name otherwise. Difficulty tier (low/mid/high) is a simplified,
 * roughly-even split with no independent evidence behind which station name
 * is "harder" than another - a [SIMPLIFICATION], not a curriculum ruling.
 *
 * CODEPOINTS: every Han character below is listed in ../cityPacks/PROVENANCE.md's
 * codepoint-delta table, checked against the existing packages/engine/src/content
 * character set - see that file before running scripts/build-fonts.py.
 */
export const TRANSIT_SHENZHEN: CategoryContent = {
  low: [
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Luohu', 'Laojie', 'Guomao'],
      0,
      'Luóhú · 罗湖. On Line 1 of the Shenzhen Metro.',
      { hanzi: '罗湖', pinyin: 'Luóhú', nl: 'Luohu', en: 'Luohu' },
      undefined,
      {
        distractorRationale: {
          Laojie:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Guomao:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Grand Theater', 'Science Museum', 'Huaqiang Road'],
      0,
      'Dàjùyuàn · 大剧院. On Line 1 of the Shenzhen Metro.',
      { hanzi: '大剧院', pinyin: 'Dàjùyuàn', nl: 'Grand Theater', en: 'Grand Theater' },
      undefined,
      {
        distractorRationale: {
          'Science Museum':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Huaqiang Road':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Gangxia', 'Convention & Exhibition Center', 'Shopping Park'],
      0,
      'Gǎngxià · 岗厦. On Line 1 of the Shenzhen Metro.',
      { hanzi: '岗厦', pinyin: 'Gǎngxià', nl: 'Gangxia', en: 'Gangxia' },
      undefined,
      {
        distractorRationale: {
          'Convention & Exhibition Center':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Shopping Park':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Xiangmi Lake', 'Zhuzilin', 'Chegongmiao'],
      0,
      'Xiāngmì Hú · 香蜜湖. On Line 1 of the Shenzhen Metro.',
      { hanzi: '香蜜湖', pinyin: 'Xiāngmì Hú', nl: 'Xiangmi Lake', en: 'Xiangmi Lake' },
      undefined,
      {
        distractorRationale: {
          Zhuzilin:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Chegongmiao:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shenzhen University', 'Taoyuan', 'Daxin'],
      0,
      'Shēndà · 深大. On Line 1 of the Shenzhen Metro.',
      { hanzi: '深大', pinyin: 'Shēndà', nl: 'Shenzhen University', en: 'Shenzhen University' },
      undefined,
      {
        distractorRationale: {
          Taoyuan:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Daxin:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ["Xin'an", 'Xixiang', 'Gushu'],
      0,
      "Xīn'ān · 新安. On Line 1 of the Shenzhen Metro.",
      { hanzi: '新安', pinyin: "Xīn'ān", nl: "Xin'an", en: "Xin'an" },
      undefined,
      {
        distractorRationale: {
          Xixiang:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Gushu:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Airport East', 'Window of the World', 'Overseas Chinese Town'],
      0,
      'Jīchǎng Dōng · 机场东. On Line 1 of the Shenzhen Metro.',
      { hanzi: '机场东', pinyin: 'Jīchǎng Dōng', nl: 'Airport East', en: 'Airport East' },
      undefined,
      {
        distractorRationale: {
          'Window of the World':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Overseas Chinese Town':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Qiaocheng East', 'Shenzhen Railway Station', 'Luohu'],
      0,
      'Qiáochéng Dōng · 侨城东. On Line 1 of the Shenzhen Metro.',
      { hanzi: '侨城东', pinyin: 'Qiáochéng Dōng', nl: 'Qiaocheng East', en: 'Qiaocheng East' },
      undefined,
      {
        distractorRationale: {
          'Shenzhen Railway Station':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Luohu:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shuiwan', 'Wanxia', 'Gaoxinyuan (Hi-Tech Park)'],
      0,
      'Shuǐwān · 水湾. On Line 2 of the Shenzhen Metro.',
      { hanzi: '水湾', pinyin: 'Shuǐwān', nl: 'Shuiwan', en: 'Shuiwan' },
      undefined,
      {
        distractorRationale: {
          Wanxia:
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          'Gaoxinyuan (Hi-Tech Park)':
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Wanxia', 'Qiaocheng North', 'Yitian'],
      0,
      'Wānxià · 湾厦. On Line 2 of the Shenzhen Metro.',
      { hanzi: '湾厦', pinyin: 'Wānxià', nl: 'Wanxia', en: 'Wanxia' },
      undefined,
      {
        distractorRationale: {
          'Qiaocheng North':
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          Yitian:
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Qiaocheng North', 'Shekou Port', 'Sea World'],
      0,
      'Qiáochéng Běi · 侨城北. On Line 2 of the Shenzhen Metro.',
      { hanzi: '侨城北', pinyin: 'Qiáochéng Běi', nl: 'Qiaocheng North', en: 'Qiaocheng North' },
      undefined,
      {
        distractorRationale: {
          'Shekou Port':
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          'Sea World':
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Civic Center', "Children's Palace", 'Futian'],
      0,
      'Shìmín Zhōngxīn · 市民中心. On Line 4 of the Shenzhen Metro.',
      { hanzi: '市民中心', pinyin: 'Shìmín Zhōngxīn', nl: 'Civic Center', en: 'Civic Center' },
      undefined,
      {
        distractorRationale: {
          "Children's Palace":
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          Futian:
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shangmeilin', 'Lianhua North', 'Minle'],
      0,
      'Shàngméilín · 上梅林. On Line 4 of the Shenzhen Metro.',
      { hanzi: '上梅林', pinyin: 'Shàngméilín', nl: 'Shangmeilin', en: 'Shangmeilin' },
      undefined,
      {
        distractorRationale: {
          'Lianhua North':
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          Minle:
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Qinghu', 'Longhua', 'Futian Checkpoint'],
      0,
      'Qīnghú · 清湖. On Line 4 of the Shenzhen Metro.',
      { hanzi: '清湖', pinyin: 'Qīnghú', nl: 'Qinghu', en: 'Qinghu' },
      undefined,
      {
        distractorRationale: {
          Longhua:
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          'Futian Checkpoint':
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Qianhaiwan', 'University Town', 'Shenzhen North Railway Station'],
      0,
      'Qiánhǎiwān · 前海湾. On Line 5 of the Shenzhen Metro.',
      { hanzi: '前海湾', pinyin: 'Qiánhǎiwān', nl: 'Qianhaiwan', en: 'Qianhaiwan' },
      undefined,
      {
        distractorRationale: {
          'University Town':
            'Also on Line 5, so a rider looking at the wrong platform board ends up here instead.',
          'Shenzhen North Railway Station':
            'Another Line 5 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['University Town', "Bao'an Center", 'Xili'],
      0,
      'Dàxuéchéng · 大学城. On Line 5 of the Shenzhen Metro.',
      { hanzi: '大学城', pinyin: 'Dàxuéchéng', nl: 'University Town', en: 'University Town' },
      undefined,
      {
        distractorRationale: {
          "Bao'an Center":
            'Also on Line 5, so a rider looking at the wrong platform board ends up here instead.',
          Xili: 'Another Line 5 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Huangbeiling', 'Longcheng Square', 'Buji'],
      0,
      'Huángbèilǐng · 黄贝岭. On Line 3 of the Shenzhen Metro.',
      { hanzi: '黄贝岭', pinyin: 'Huángbèilǐng', nl: 'Huangbeiling', en: 'Huangbeiling' },
      undefined,
      {
        distractorRationale: {
          'Longcheng Square':
            'Also on Line 3, so a rider looking at the wrong platform board ends up here instead.',
          Buji: 'Another Line 3 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shenzhen Railway Station', 'Convention & Exhibition Center', 'Shopping Park'],
      0,
      'Shēnzhèn Zhàn · 深圳站. On Line 1 of the Shenzhen Metro.',
      {
        hanzi: '深圳站',
        pinyin: 'Shēnzhèn Zhàn',
        nl: 'Shenzhen Railway Station',
        en: 'Shenzhen Railway Station',
      },
      undefined,
      {
        distractorRationale: {
          'Convention & Exhibition Center':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Shopping Park':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Yannan', 'Huangbeiling', 'Hongling'],
      0,
      'Yànnán · 燕南. On Line 3 of the Shenzhen Metro.',
      { hanzi: '燕南', pinyin: 'Yànnán', nl: 'Yannan', en: 'Yannan' },
      undefined,
      {
        distractorRationale: {
          Huangbeiling:
            'Also on Line 3, so a rider looking at the wrong platform board ends up here instead.',
          Hongling:
            'Another Line 3 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
  ],
  mid: [
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Laojie', 'Guomao', 'Grand Theater'],
      0,
      'Lǎojiē · 老街. On Line 1 of the Shenzhen Metro.',
      { hanzi: '老街', pinyin: 'Lǎojiē', nl: 'Laojie', en: 'Laojie' },
      undefined,
      {
        distractorRationale: {
          Guomao:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Grand Theater':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Science Museum', 'Huaqiang Road', 'Gangxia'],
      0,
      'Kēxuéguǎn · 科学馆. On Line 1 of the Shenzhen Metro.',
      { hanzi: '科学馆', pinyin: 'Kēxuéguǎn', nl: 'Science Museum', en: 'Science Museum' },
      undefined,
      {
        distractorRationale: {
          'Huaqiang Road':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Gangxia:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Convention & Exhibition Center', 'Shopping Park', 'Xiangmi Lake'],
      0,
      'Huìzhǎn Zhōngxīn · 会展中心. On Line 1 of the Shenzhen Metro.',
      {
        hanzi: '会展中心',
        pinyin: 'Huìzhǎn Zhōngxīn',
        nl: 'Convention & Exhibition Center',
        en: 'Convention & Exhibition Center',
      },
      undefined,
      {
        distractorRationale: {
          'Shopping Park':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Xiangmi Lake':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Zhuzilin', 'Chegongmiao', 'Shenzhen University'],
      0,
      'Zhúzilín · 竹子林. On Line 1 of the Shenzhen Metro.',
      { hanzi: '竹子林', pinyin: 'Zhúzilín', nl: 'Zhuzilin', en: 'Zhuzilin' },
      undefined,
      {
        distractorRationale: {
          Chegongmiao:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Shenzhen University':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Taoyuan', 'Daxin', "Xin'an"],
      0,
      'Táoyuán · 桃园. On Line 1 of the Shenzhen Metro.',
      { hanzi: '桃园', pinyin: 'Táoyuán', nl: 'Taoyuan', en: 'Taoyuan' },
      undefined,
      {
        distractorRationale: {
          Daxin:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          "Xin'an":
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Xixiang', 'Gushu', 'Airport East'],
      0,
      'Xīxiāng · 西乡. On Line 1 of the Shenzhen Metro.',
      { hanzi: '西乡', pinyin: 'Xīxiāng', nl: 'Xixiang', en: 'Xixiang' },
      undefined,
      {
        distractorRationale: {
          Gushu:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Airport East':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Window of the World', 'Overseas Chinese Town', 'Qiaocheng East'],
      0,
      'Shìjiè zhī Chuāng · 世界之窗. On Line 1 of the Shenzhen Metro.',
      {
        hanzi: '世界之窗',
        pinyin: 'Shìjiè zhī Chuāng',
        nl: 'Window of the World',
        en: 'Window of the World',
      },
      undefined,
      {
        distractorRationale: {
          'Overseas Chinese Town':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Qiaocheng East':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shekou Port', 'Dongjiaotou', 'Shekou'],
      0,
      'Shékǒu Gǎng · 蛇口港. On Line 2 of the Shenzhen Metro.',
      { hanzi: '蛇口港', pinyin: 'Shékǒu Gǎng', nl: 'Shekou Port', en: 'Shekou Port' },
      undefined,
      {
        distractorRationale: {
          Dongjiaotou:
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          Shekou:
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Dongjiaotou', 'Gaoxinyuan (Hi-Tech Park)', 'Houhai'],
      0,
      'Dōngjiǎotóu · 东角头. On Line 2 of the Shenzhen Metro.',
      { hanzi: '东角头', pinyin: 'Dōngjiǎotóu', nl: 'Dongjiaotou', en: 'Dongjiaotou' },
      undefined,
      {
        distractorRationale: {
          'Gaoxinyuan (Hi-Tech Park)':
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          Houhai:
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Gaoxinyuan (Hi-Tech Park)', 'Yitian', 'Xiasha'],
      0,
      'Gāoxīnyuán · 高新园. On Line 2 of the Shenzhen Metro.',
      {
        hanzi: '高新园',
        pinyin: 'Gāoxīnyuán',
        nl: 'Gaoxinyuan (Hi-Tech Park)',
        en: 'Gaoxinyuan (Hi-Tech Park)',
      },
      undefined,
      {
        distractorRationale: {
          Yitian:
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          Xiasha:
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Futian Checkpoint', 'Qinghu', "Children's Palace"],
      0,
      "Fútián Kǒu'àn · 福田口岸. On Line 4 of the Shenzhen Metro.",
      {
        hanzi: '福田口岸',
        pinyin: "Fútián Kǒu'àn",
        nl: 'Futian Checkpoint',
        en: 'Futian Checkpoint',
      },
      undefined,
      {
        distractorRationale: {
          Qinghu:
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          "Children's Palace":
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Futian', 'Civic Center', 'Lianhua North'],
      0,
      'Fútián · 福田. On Line 4 of the Shenzhen Metro.',
      { hanzi: '福田', pinyin: 'Fútián', nl: 'Futian', en: 'Futian' },
      undefined,
      {
        distractorRationale: {
          'Civic Center':
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          'Lianhua North':
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Minle', 'Shangmeilin', 'Longhua'],
      0,
      'Mínlè · 民乐. On Line 4 of the Shenzhen Metro.',
      { hanzi: '民乐', pinyin: 'Mínlè', nl: 'Minle', en: 'Minle' },
      undefined,
      {
        distractorRationale: {
          Shangmeilin:
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          Longhua:
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Huaqiangbei', 'Huanggang Checkpoint', 'Xili'],
      0,
      'Huáqiángběi · 华强北. On Line 7 of the Shenzhen Metro.',
      { hanzi: '华强北', pinyin: 'Huáqiángběi', nl: 'Huaqiangbei', en: 'Huaqiangbei' },
      undefined,
      {
        distractorRationale: {
          'Huanggang Checkpoint':
            'Also on Line 7, so a rider looking at the wrong platform board ends up here instead.',
          Xili: 'A real Shenzhen station name, but nowhere near this one on the network.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ["Bao'an Center", 'Shenzhen North Railway Station', 'Qianhaiwan'],
      0,
      "Bǎo'ān Zhōngxīn · 宝安中心. On Line 5 of the Shenzhen Metro.",
      { hanzi: '宝安中心', pinyin: "Bǎo'ān Zhōngxīn", nl: "Bao'an Center", en: "Bao'an Center" },
      undefined,
      {
        distractorRationale: {
          'Shenzhen North Railway Station':
            'Also on Line 5, so a rider looking at the wrong platform board ends up here instead.',
          Qianhaiwan:
            'Another Line 5 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shenzhen North Railway Station', 'Xili', 'University Town'],
      0,
      'Shēnzhèn Běizhàn · 深圳北站. On Line 5 of the Shenzhen Metro.',
      {
        hanzi: '深圳北站',
        pinyin: 'Shēnzhèn Běizhàn',
        nl: 'Shenzhen North Railway Station',
        en: 'Shenzhen North Railway Station',
      },
      undefined,
      {
        distractorRationale: {
          Xili: 'Also on Line 5, so a rider looking at the wrong platform board ends up here instead.',
          'University Town':
            'Another Line 5 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Yitian', 'Xiasha', 'Shekou Port'],
      0,
      'Yìtián · 益田. On Line 2 of the Shenzhen Metro.',
      { hanzi: '益田', pinyin: 'Yìtián', nl: 'Yitian', en: 'Yitian' },
      undefined,
      {
        distractorRationale: {
          Xiasha:
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          'Shekou Port':
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Huanggang Checkpoint', 'Huaqiangbei', 'Guomao'],
      0,
      "Huánggǎng Kǒu'àn · 皇岗口岸. On Line 7 of the Shenzhen Metro.",
      {
        hanzi: '皇岗口岸',
        pinyin: "Huánggǎng Kǒu'àn",
        nl: 'Huanggang Checkpoint',
        en: 'Huanggang Checkpoint',
      },
      undefined,
      {
        distractorRationale: {
          Huaqiangbei:
            'Also on Line 7, so a rider looking at the wrong platform board ends up here instead.',
          Guomao: 'A real Shenzhen station name, but nowhere near this one on the network.',
        },
      },
    ],
  ],
  high: [
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Guomao', 'Grand Theater', 'Science Museum'],
      0,
      'Guómào · 国贸. On Line 1 of the Shenzhen Metro.',
      { hanzi: '国贸', pinyin: 'Guómào', nl: 'Guomao', en: 'Guomao' },
      undefined,
      {
        distractorRationale: {
          'Grand Theater':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Science Museum':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Huaqiang Road', 'Gangxia', 'Convention & Exhibition Center'],
      0,
      'Huáqiáng Lù · 华强路. On Line 1 of the Shenzhen Metro.',
      { hanzi: '华强路', pinyin: 'Huáqiáng Lù', nl: 'Huaqiang Road', en: 'Huaqiang Road' },
      undefined,
      {
        distractorRationale: {
          Gangxia:
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Convention & Exhibition Center':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shopping Park', 'Xiangmi Lake', 'Zhuzilin'],
      0,
      'Gòuwù Gōngyuán · 购物公园. On Line 1 of the Shenzhen Metro.',
      { hanzi: '购物公园', pinyin: 'Gòuwù Gōngyuán', nl: 'Shopping Park', en: 'Shopping Park' },
      undefined,
      {
        distractorRationale: {
          'Xiangmi Lake':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Zhuzilin:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Chegongmiao', 'Shenzhen University', 'Taoyuan'],
      0,
      'Chēgōngmiào · 车公庙. On Line 1 of the Shenzhen Metro.',
      { hanzi: '车公庙', pinyin: 'Chēgōngmiào', nl: 'Chegongmiao', en: 'Chegongmiao' },
      undefined,
      {
        distractorRationale: {
          'Shenzhen University':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Taoyuan:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Daxin', "Xin'an", 'Xixiang'],
      0,
      'Dàxīn · 大新. On Line 1 of the Shenzhen Metro.',
      { hanzi: '大新', pinyin: 'Dàxīn', nl: 'Daxin', en: 'Daxin' },
      undefined,
      {
        distractorRationale: {
          "Xin'an":
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          Xixiang:
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Gushu', 'Airport East', 'Window of the World'],
      0,
      'Gùshù · 固戍. On Line 1 of the Shenzhen Metro.',
      { hanzi: '固戍', pinyin: 'Gùshù', nl: 'Gushu', en: 'Gushu' },
      undefined,
      {
        distractorRationale: {
          'Airport East':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Window of the World':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Overseas Chinese Town', 'Qiaocheng East', 'Shenzhen Railway Station'],
      0,
      'Huáqiáochéng · 华侨城. On Line 1 of the Shenzhen Metro.',
      {
        hanzi: '华侨城',
        pinyin: 'Huáqiáochéng',
        nl: 'Overseas Chinese Town',
        en: 'Overseas Chinese Town',
      },
      undefined,
      {
        distractorRationale: {
          'Qiaocheng East':
            'Also on Line 1, so a rider looking at the wrong platform board ends up here instead.',
          'Shenzhen Railway Station':
            'Another Line 1 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Sea World', 'Shekou', 'Wanxia'],
      0,
      'Hǎishàng Shìjiè · 海上世界. On Line 2 of the Shenzhen Metro.',
      { hanzi: '海上世界', pinyin: 'Hǎishàng Shìjiè', nl: 'Sea World', en: 'Sea World' },
      undefined,
      {
        distractorRationale: {
          Shekou:
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          Wanxia:
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Shekou', 'Houhai', 'Qiaocheng North'],
      0,
      'Shékǒu · 蛇口. On Line 2 of the Shenzhen Metro.',
      { hanzi: '蛇口', pinyin: 'Shékǒu', nl: 'Shekou', en: 'Shekou' },
      undefined,
      {
        distractorRationale: {
          Houhai:
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          'Qiaocheng North':
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Houhai', 'Xiasha', 'Shekou Port'],
      0,
      'Hòuhǎi · 后海. On Line 2 of the Shenzhen Metro.',
      { hanzi: '后海', pinyin: 'Hòuhǎi', nl: 'Houhai', en: 'Houhai' },
      undefined,
      {
        distractorRationale: {
          Xiasha:
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          'Shekou Port':
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ["Children's Palace", 'Futian Checkpoint', 'Civic Center'],
      0,
      'Shàonián Gōng · 少年宫. On Line 4 of the Shenzhen Metro.',
      {
        hanzi: '少年宫',
        pinyin: 'Shàonián Gōng',
        nl: "Children's Palace",
        en: "Children's Palace",
      },
      undefined,
      {
        distractorRationale: {
          'Futian Checkpoint':
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          'Civic Center':
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Lianhua North', 'Futian', 'Shangmeilin'],
      0,
      'Liánhuā Běi · 莲花北. On Line 4 of the Shenzhen Metro.',
      { hanzi: '莲花北', pinyin: 'Liánhuā Běi', nl: 'Lianhua North', en: 'Lianhua North' },
      undefined,
      {
        distractorRationale: {
          Futian:
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          Shangmeilin:
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Longhua', 'Minle', 'Qinghu'],
      0,
      'Lónghuá · 龙华. On Line 4 of the Shenzhen Metro.',
      { hanzi: '龙华', pinyin: 'Lónghuá', nl: 'Longhua', en: 'Longhua' },
      undefined,
      {
        distractorRationale: {
          Minle:
            'Also on Line 4, so a rider looking at the wrong platform board ends up here instead.',
          Qinghu:
            'Another Line 4 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Longcheng Square', 'Huangbeiling', 'Hongling'],
      0,
      'Lóngchéng Guǎngchǎng · 龙城广场. On Line 3 of the Shenzhen Metro.',
      {
        hanzi: '龙城广场',
        pinyin: 'Lóngchéng Guǎngchǎng',
        nl: 'Longcheng Square',
        en: 'Longcheng Square',
      },
      undefined,
      {
        distractorRationale: {
          Huangbeiling:
            'Also on Line 3, so a rider looking at the wrong platform board ends up here instead.',
          Hongling:
            'Another Line 3 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Xili', 'Qianhaiwan', "Bao'an Center"],
      0,
      'Xīlì · 西丽. On Line 5 of the Shenzhen Metro.',
      { hanzi: '西丽', pinyin: 'Xīlì', nl: 'Xili', en: 'Xili' },
      undefined,
      {
        distractorRationale: {
          Qianhaiwan:
            'Also on Line 5, so a rider looking at the wrong platform board ends up here instead.',
          "Bao'an Center":
            'Another Line 5 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Buji', 'Yannan', 'Longcheng Square'],
      0,
      'Bùjí · 布吉. On Line 3 of the Shenzhen Metro.',
      { hanzi: '布吉', pinyin: 'Bùjí', nl: 'Buji', en: 'Buji' },
      undefined,
      {
        distractorRationale: {
          Yannan:
            'Also on Line 3, so a rider looking at the wrong platform board ends up here instead.',
          'Longcheng Square':
            'Another Line 3 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Xiasha', 'Shekou Port', 'Sea World'],
      0,
      'Xiàshā · 下沙. On Line 2 of the Shenzhen Metro.',
      { hanzi: '下沙', pinyin: 'Xiàshā', nl: 'Xiasha', en: 'Xiasha' },
      undefined,
      {
        distractorRationale: {
          'Shekou Port':
            'Also on Line 2, so a rider looking at the wrong platform board ends up here instead.',
          'Sea World':
            'Another Line 2 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Shenzhen Metro station. Which station is this?',
      ['Hongling', 'Buji', 'Huangbeiling'],
      0,
      'Hónglǐng · 红岭. On Line 3 of the Shenzhen Metro.',
      { hanzi: '红岭', pinyin: 'Hónglǐng', nl: 'Hongling', en: 'Hongling' },
      undefined,
      {
        distractorRationale: {
          Buji: 'Also on Line 3, so a rider looking at the wrong platform board ends up here instead.',
          Huangbeiling:
            'Another Line 3 stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
  ],
};
