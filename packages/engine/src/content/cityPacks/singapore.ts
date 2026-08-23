import type { CategoryContent } from '../row.js';

/**
 * Singapore MRT station-name pack. DESIGN.md §11.6 "City packs" — see
 * shenzhen.ts's header for the shared rationale (real station names, not
 * generic transit vocabulary; distractors precomputed with authored
 * `distractorRationale`; provenance in ../cityPacks/PROVENANCE.md).
 *
 * PROVENANCE: station names, their official Chinese names and their lines
 * are drawn from public knowledge of the Singapore MRT system (North South,
 * East West, North East, Circle and Downtown Lines). 49 stations are
 * shipped. As with the Shenzhen pack, coverage is bounded by confidence, not
 * padded to a round number - several MRT stations the author could not
 * confidently name in Chinese (e.g. several West Region EWL extensions) were
 * left out rather than guessed.
 *
 * A structural note specific to Singapore: MRT platform signage is
 * primarily English, with the station's Chinese name shown in smaller type
 * beneath it (not the Chinese-primary signage of a mainland metro), so the
 * pedagogical framing here is "the Chinese name printed under the English
 * one on the platform sign," not "signage a Chinese-illiterate rider could
 * not otherwise navigate."
 *
 * CODEPOINTS: see ../cityPacks/PROVENANCE.md's codepoint-delta table.
 */
export const TRANSIT_SINGAPORE: CategoryContent = {
  low: [
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Ang Mo Kio', 'Yishun', 'Woodlands'],
      0,
      'Hóngmàoqiáo · 宏茂桥. On the North South Line of the Singapore MRT.',
      { hanzi: '宏茂桥', pinyin: 'Hóngmàoqiáo', nl: 'Ang Mo Kio', en: 'Ang Mo Kio' },
      undefined,
      {
        distractorRationale: {
          Yishun:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Woodlands:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Choa Chu Kang', 'Jurong East', 'Clementi'],
      0,
      'Càicuògǎng · 蔡厝港. On the North South Line of the Singapore MRT.',
      { hanzi: '蔡厝港', pinyin: 'Càicuògǎng', nl: 'Choa Chu Kang', en: 'Choa Chu Kang' },
      undefined,
      {
        distractorRationale: {
          'Jurong East':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Clementi:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Queenstown', 'Outram Park', 'City Hall'],
      0,
      'Nǚhuáng Zhèn · 女皇镇. On the North South Line of the Singapore MRT.',
      { hanzi: '女皇镇', pinyin: 'Nǚhuáng Zhèn', nl: 'Queenstown', en: 'Queenstown' },
      undefined,
      {
        distractorRationale: {
          'Outram Park':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'City Hall':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['City Hall', 'Marina Bay', 'Marina South Pier'],
      0,
      'Zhèngfǔ Dàshà · 政府大厦. On the North South Line of the Singapore MRT.',
      { hanzi: '政府大厦', pinyin: 'Zhèngfǔ Dàshà', nl: 'City Hall', en: 'City Hall' },
      undefined,
      {
        distractorRationale: {
          'Marina Bay':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Marina South Pier':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Marina South Pier', 'Orchard', 'Somerset'],
      0,
      'Bīnhǎi Nán Mǎtóu · 滨海南码头. On the North South Line of the Singapore MRT.',
      {
        hanzi: '滨海南码头',
        pinyin: 'Bīnhǎi Nán Mǎtóu',
        nl: 'Marina South Pier',
        en: 'Marina South Pier',
      },
      undefined,
      {
        distractorRationale: {
          Orchard:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Somerset:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Somerset', 'Novena', 'Toa Payoh'],
      0,
      'Suǒměisāi · 索美塞. On the North South Line of the Singapore MRT.',
      { hanzi: '索美塞', pinyin: 'Suǒměisāi', nl: 'Somerset', en: 'Somerset' },
      undefined,
      {
        distractorRationale: {
          Novena:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Toa Payoh':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Toa Payoh', 'Sembawang', 'Ang Mo Kio'],
      0,
      'Dàbāyáo · 大巴窑. On the North South Line of the Singapore MRT.',
      { hanzi: '大巴窑', pinyin: 'Dàbāyáo', nl: 'Toa Payoh', en: 'Toa Payoh' },
      undefined,
      {
        distractorRationale: {
          Sembawang:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Ang Mo Kio':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Pasir Ris', 'Paya Lebar', 'Aljunied'],
      0,
      'Bāxīlì · 巴西立. On the East West Line of the Singapore MRT.',
      { hanzi: '巴西立', pinyin: 'Bāxīlì', nl: 'Pasir Ris', en: 'Pasir Ris' },
      undefined,
      {
        distractorRationale: {
          'Paya Lebar':
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Aljunied:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Kallang', 'Tiong Bahru', 'Commonwealth'],
      0,
      'Jiālěng · 加冷. On the East West Line of the Singapore MRT.',
      { hanzi: '加冷', pinyin: 'Jiālěng', nl: 'Kallang', en: 'Kallang' },
      undefined,
      {
        distractorRationale: {
          'Tiong Bahru':
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Commonwealth:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Tanjong Pagar', 'Lakeside', 'Pasir Ris'],
      0,
      'Dānróngbāgé · 丹戎巴葛. On the East West Line of the Singapore MRT.',
      { hanzi: '丹戎巴葛', pinyin: 'Dānróngbāgé', nl: 'Tanjong Pagar', en: 'Tanjong Pagar' },
      undefined,
      {
        distractorRationale: {
          Lakeside:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          'Pasir Ris':
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Farrer Park', 'Rochor', 'Jalan Besar'],
      0,
      'Huālā Gōngyuán · 花拉公园. On the Downtown Line of the Singapore MRT.',
      { hanzi: '花拉公园', pinyin: 'Huālā Gōngyuán', nl: 'Farrer Park', en: 'Farrer Park' },
      undefined,
      {
        distractorRationale: {
          Rochor:
            'Also on the Downtown Line, so a rider looking at the wrong platform board ends up here instead.',
          'Jalan Besar':
            'Another Downtown Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Aljunied', 'Bugis', 'Tanjong Pagar'],
      0,
      'Āyùní · 阿裕尼. On the East West Line of the Singapore MRT.',
      { hanzi: '阿裕尼', pinyin: 'Āyùní', nl: 'Aljunied', en: 'Aljunied' },
      undefined,
      {
        distractorRationale: {
          Bugis:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          'Tanjong Pagar':
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Hougang', 'Chinatown', 'HarbourFront'],
      0,
      'Hòugǎng · 后港. On the North East Line of the Singapore MRT.',
      { hanzi: '后港', pinyin: 'Hòugǎng', nl: 'Hougang', en: 'Hougang' },
      undefined,
      {
        distractorRationale: {
          Chinatown:
            'Also on the North East Line, so a rider looking at the wrong platform board ends up here instead.',
          HarbourFront:
            'Another North East Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['MacPherson', 'Bras Basah', 'one-north'],
      0,
      'Màibōshēn · 麦波申. On the Circle Line of the Singapore MRT.',
      { hanzi: '麦波申', pinyin: 'Màibōshēn', nl: 'MacPherson', en: 'MacPherson' },
      undefined,
      {
        distractorRationale: {
          'Bras Basah':
            'Also on the Circle Line, so a rider looking at the wrong platform board ends up here instead.',
          'one-north':
            'Another Circle Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Rochor', 'Farrer Park', 'Jalan Besar'],
      0,
      'Wúcáo · 梧槽. On the Downtown Line of the Singapore MRT.',
      { hanzi: '梧槽', pinyin: 'Wúcáo', nl: 'Rochor', en: 'Rochor' },
      undefined,
      {
        distractorRationale: {
          'Farrer Park':
            'Also on the Downtown Line, so a rider looking at the wrong platform board ends up here instead.',
          'Jalan Besar':
            'Another Downtown Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Clarke Quay', 'Hougang', 'HarbourFront'],
      0,
      'Kèlā Mǎtóu · 克拉码头. On the North East Line of the Singapore MRT.',
      { hanzi: '克拉码头', pinyin: 'Kèlā Mǎtóu', nl: 'Clarke Quay', en: 'Clarke Quay' },
      undefined,
      {
        distractorRationale: {
          Hougang:
            'Also on the North East Line, so a rider looking at the wrong platform board ends up here instead.',
          HarbourFront:
            'Another North East Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Bras Basah', 'Dakota', 'MacPherson'],
      0,
      'Bùlāshì Bāshā · 布拉士巴沙. On the Circle Line of the Singapore MRT.',
      { hanzi: '布拉士巴沙', pinyin: 'Bùlāshì Bāshā', nl: 'Bras Basah', en: 'Bras Basah' },
      undefined,
      {
        distractorRationale: {
          Dakota:
            'Also on the Circle Line, so a rider looking at the wrong platform board ends up here instead.',
          MacPherson:
            'Another Circle Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
  ],
  mid: [
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Yishun', 'Woodlands', 'Choa Chu Kang'],
      0,
      'Yìshùn · 义顺. On the North South Line of the Singapore MRT.',
      { hanzi: '义顺', pinyin: 'Yìshùn', nl: 'Yishun', en: 'Yishun' },
      undefined,
      {
        distractorRationale: {
          Woodlands:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Choa Chu Kang':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Jurong East', 'Clementi', 'Queenstown'],
      0,
      'Yùláng Dōng · 裕廊东. On the North South Line of the Singapore MRT.',
      { hanzi: '裕廊东', pinyin: 'Yùláng Dōng', nl: 'Jurong East', en: 'Jurong East' },
      undefined,
      {
        distractorRationale: {
          Clementi:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Queenstown:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Outram Park', 'City Hall', 'Raffles Place'],
      0,
      'Ōunányuán · 欧南园. On the North South Line of the Singapore MRT.',
      { hanzi: '欧南园', pinyin: 'Ōunányuán', nl: 'Outram Park', en: 'Outram Park' },
      undefined,
      {
        distractorRationale: {
          'City Hall':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Raffles Place':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Raffles Place', 'Marina South Pier', 'Dhoby Ghaut'],
      0,
      'Láifóshìfāng · 莱佛士坊. On the North South Line of the Singapore MRT.',
      { hanzi: '莱佛士坊', pinyin: 'Láifóshìfāng', nl: 'Raffles Place', en: 'Raffles Place' },
      undefined,
      {
        distractorRationale: {
          'Marina South Pier':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Dhoby Ghaut':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Dhoby Ghaut', 'Somerset', 'Newton'],
      0,
      'Duōměigē · 多美歌. On the North South Line of the Singapore MRT.',
      { hanzi: '多美歌', pinyin: 'Duōměigē', nl: 'Dhoby Ghaut', en: 'Dhoby Ghaut' },
      undefined,
      {
        distractorRationale: {
          Somerset:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Newton:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Newton', 'Toa Payoh', 'Bishan'],
      0,
      'Niǔdùn · 纽顿. On the North South Line of the Singapore MRT.',
      { hanzi: '纽顿', pinyin: 'Niǔdùn', nl: 'Newton', en: 'Newton' },
      undefined,
      {
        distractorRationale: {
          'Toa Payoh':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Bishan:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Bishan', 'Ang Mo Kio', 'Yishun'],
      0,
      'Bìshān · 碧山. On the North South Line of the Singapore MRT.',
      { hanzi: '碧山', pinyin: 'Bìshān', nl: 'Bishan', en: 'Bishan' },
      undefined,
      {
        distractorRationale: {
          'Ang Mo Kio':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Yishun:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Tampines', 'Aljunied', 'Redhill'],
      0,
      'Dànbīnní · 淡滨尼. On the East West Line of the Singapore MRT.',
      { hanzi: '淡滨尼', pinyin: 'Dànbīnní', nl: 'Tampines', en: 'Tampines' },
      undefined,
      {
        distractorRationale: {
          Aljunied:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Redhill:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Lavender', 'Commonwealth', 'Chinese Garden'],
      0,
      'Láomíngdá · 劳明达. On the East West Line of the Singapore MRT.',
      { hanzi: '劳明达', pinyin: 'Láomíngdá', nl: 'Lavender', en: 'Lavender' },
      undefined,
      {
        distractorRationale: {
          Commonwealth:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          'Chinese Garden':
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Buona Vista', 'Pasir Ris', 'Tampines'],
      0,
      'Bōnàwéisīdá · 波那维斯达. On the East West Line of the Singapore MRT.',
      { hanzi: '波那维斯达', pinyin: 'Bōnàwéisīdá', nl: 'Buona Vista', en: 'Buona Vista' },
      undefined,
      {
        distractorRationale: {
          'Pasir Ris':
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Tampines:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Farrer Road', 'Holland Village', 'Dakota'],
      0,
      'Huālā Lù · 花拉路. On the Circle Line of the Singapore MRT.',
      { hanzi: '花拉路', pinyin: 'Huālā Lù', nl: 'Farrer Road', en: 'Farrer Road' },
      undefined,
      {
        distractorRationale: {
          'Holland Village':
            'Also on the Circle Line, so a rider looking at the wrong platform board ends up here instead.',
          Dakota:
            'Another Circle Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Redhill', 'Tanjong Pagar', 'Buona Vista'],
      0,
      'Hóngshān · 红山. On the East West Line of the Singapore MRT.',
      { hanzi: '红山', pinyin: 'Hóngshān', nl: 'Redhill', en: 'Redhill' },
      undefined,
      {
        distractorRationale: {
          'Tanjong Pagar':
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          'Buona Vista':
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Holland Village', 'Dakota', 'MacPherson'],
      0,
      'Hélán Cūn · 荷兰村. On the Circle Line of the Singapore MRT.',
      { hanzi: '荷兰村', pinyin: 'Hélán Cūn', nl: 'Holland Village', en: 'Holland Village' },
      undefined,
      {
        distractorRationale: {
          Dakota:
            'Also on the Circle Line, so a rider looking at the wrong platform board ends up here instead.',
          MacPherson:
            'Another Circle Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['HarbourFront', 'Chinatown', 'Hougang'],
      0,
      'Gǎngwān · 港湾. On the North East Line of the Singapore MRT.',
      { hanzi: '港湾', pinyin: 'Gǎngwān', nl: 'HarbourFront', en: 'HarbourFront' },
      undefined,
      {
        distractorRationale: {
          Chinatown:
            'Also on the North East Line, so a rider looking at the wrong platform board ends up here instead.',
          Hougang:
            'Another North East Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Jalan Besar', 'Rochor', 'Farrer Park'],
      0,
      'Rělán Wùshā · 惹兰勿刹. On the Downtown Line of the Singapore MRT.',
      { hanzi: '惹兰勿刹', pinyin: 'Rělán Wùshā', nl: 'Jalan Besar', en: 'Jalan Besar' },
      undefined,
      {
        distractorRationale: {
          Rochor:
            'Also on the Downtown Line, so a rider looking at the wrong platform board ends up here instead.',
          'Farrer Park':
            'Another Downtown Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Chinese Garden', 'Lavender', 'Bugis'],
      0,
      'Zhōngguó Yuán · 中国园. On the East West Line of the Singapore MRT.',
      { hanzi: '中国园', pinyin: 'Zhōngguó Yuán', nl: 'Chinese Garden', en: 'Chinese Garden' },
      undefined,
      {
        distractorRationale: {
          Lavender:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Bugis:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
  ],
  high: [
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Woodlands', 'Choa Chu Kang', 'Jurong East'],
      0,
      'Wùlán · 兀兰. On the North South Line of the Singapore MRT.',
      { hanzi: '兀兰', pinyin: 'Wùlán', nl: 'Woodlands', en: 'Woodlands' },
      undefined,
      {
        distractorRationale: {
          'Choa Chu Kang':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Jurong East':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Clementi', 'Queenstown', 'Outram Park'],
      0,
      'Jīnwéntài · 金文泰. On the North South Line of the Singapore MRT.',
      { hanzi: '金文泰', pinyin: 'Jīnwéntài', nl: 'Clementi', en: 'Clementi' },
      undefined,
      {
        distractorRationale: {
          Queenstown:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          'Outram Park':
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Chinatown', 'Hougang', 'HarbourFront'],
      0,
      'Niúchēshuǐ · 牛车水. On the North East Line of the Singapore MRT.',
      { hanzi: '牛车水', pinyin: 'Niúchēshuǐ', nl: 'Chinatown', en: 'Chinatown' },
      undefined,
      {
        distractorRationale: {
          Hougang:
            'Also on the North East Line, so a rider looking at the wrong platform board ends up here instead.',
          HarbourFront:
            'Another North East Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Marina Bay', 'Dhoby Ghaut', 'Orchard'],
      0,
      'Bīnhǎiwān · 滨海湾. On the North South Line of the Singapore MRT.',
      { hanzi: '滨海湾', pinyin: 'Bīnhǎiwān', nl: 'Marina Bay', en: 'Marina Bay' },
      undefined,
      {
        distractorRationale: {
          'Dhoby Ghaut':
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Orchard:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Orchard', 'Newton', 'Novena'],
      0,
      'Wūjié · 乌节. On the North South Line of the Singapore MRT.',
      { hanzi: '乌节', pinyin: 'Wūjié', nl: 'Orchard', en: 'Orchard' },
      undefined,
      {
        distractorRationale: {
          Newton:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Novena:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Novena', 'Bishan', 'Sembawang'],
      0,
      'Nuòwéinà · 诺维娜. On the North South Line of the Singapore MRT.',
      { hanzi: '诺维娜', pinyin: 'Nuòwéinà', nl: 'Novena', en: 'Novena' },
      undefined,
      {
        distractorRationale: {
          Bishan:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Sembawang:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Sembawang', 'Yishun', 'Woodlands'],
      0,
      'Sānbāwàng · 三巴旺. On the North South Line of the Singapore MRT.',
      { hanzi: '三巴旺', pinyin: 'Sānbāwàng', nl: 'Sembawang', en: 'Sembawang' },
      undefined,
      {
        distractorRationale: {
          Yishun:
            'Also on the North South Line, so a rider looking at the wrong platform board ends up here instead.',
          Woodlands:
            'Another North South Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Bedok', 'Redhill', 'Tiong Bahru'],
      0,
      'Wùluò · 勿洛. On the East West Line of the Singapore MRT.',
      { hanzi: '勿洛', pinyin: 'Wùluò', nl: 'Bedok', en: 'Bedok' },
      undefined,
      {
        distractorRationale: {
          Redhill:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          'Tiong Bahru':
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Bugis', 'Chinese Garden', 'Lakeside'],
      0,
      'Wǔjíshì · 武吉士. On the East West Line of the Singapore MRT.',
      { hanzi: '武吉士', pinyin: 'Wǔjíshì', nl: 'Bugis', en: 'Bugis' },
      undefined,
      {
        distractorRationale: {
          'Chinese Garden':
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Lakeside:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['one-north', 'Bras Basah', 'Farrer Road'],
      0,
      'Wěiyī · 纬壹. On the Circle Line of the Singapore MRT.',
      { hanzi: '纬壹', pinyin: 'Wěiyī', nl: 'one-north', en: 'one-north' },
      undefined,
      {
        distractorRationale: {
          'Bras Basah':
            'Also on the Circle Line, so a rider looking at the wrong platform board ends up here instead.',
          'Farrer Road':
            'Another Circle Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Paya Lebar', 'Lavender', 'Bugis'],
      0,
      'Bāyēlìbā · 巴耶利峇. On the East West Line of the Singapore MRT.',
      { hanzi: '巴耶利峇', pinyin: 'Bāyēlìbā', nl: 'Paya Lebar', en: 'Paya Lebar' },
      undefined,
      {
        distractorRationale: {
          Lavender:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Bugis:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Tiong Bahru', 'Buona Vista', 'Paya Lebar'],
      0,
      'Zhōngbālǔ · 中峇鲁. On the East West Line of the Singapore MRT.',
      { hanzi: '中峇鲁', pinyin: 'Zhōngbālǔ', nl: 'Tiong Bahru', en: 'Tiong Bahru' },
      undefined,
      {
        distractorRationale: {
          'Buona Vista':
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          'Paya Lebar':
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Dakota', 'MacPherson', 'Bras Basah'],
      0,
      'Dákētǎ · 达科塔. On the Circle Line of the Singapore MRT.',
      { hanzi: '达科塔', pinyin: 'Dákētǎ', nl: 'Dakota', en: 'Dakota' },
      undefined,
      {
        distractorRationale: {
          MacPherson:
            'Also on the Circle Line, so a rider looking at the wrong platform board ends up here instead.',
          'Bras Basah':
            'Another Circle Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Little India', 'Hougang', 'HarbourFront'],
      0,
      'Xiǎo Yìndù · 小印度. On the North East Line of the Singapore MRT.',
      { hanzi: '小印度', pinyin: 'Xiǎo Yìndù', nl: 'Little India', en: 'Little India' },
      undefined,
      {
        distractorRationale: {
          Hougang:
            'Also on the North East Line, so a rider looking at the wrong platform board ends up here instead.',
          HarbourFront:
            'Another North East Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Commonwealth', 'Bedok', 'Kallang'],
      0,
      'Liánbāng · 联邦. On the East West Line of the Singapore MRT.',
      { hanzi: '联邦', pinyin: 'Liánbāng', nl: 'Commonwealth', en: 'Commonwealth' },
      undefined,
      {
        distractorRationale: {
          Bedok:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          Kallang:
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
    [
      'On a sign at a Singapore MRT station. Which station is this?',
      ['Lakeside', 'Bugis', 'Tanjong Pagar'],
      0,
      'Húpàn · 湖畔. On the East West Line of the Singapore MRT.',
      { hanzi: '湖畔', pinyin: 'Húpàn', nl: 'Lakeside', en: 'Lakeside' },
      undefined,
      {
        distractorRationale: {
          Bugis:
            'Also on the East West Line, so a rider looking at the wrong platform board ends up here instead.',
          'Tanjong Pagar':
            'Another East West Line stop, easy to confuse with the correct one from a glance at the sign.',
        },
      },
    ],
  ],
};
