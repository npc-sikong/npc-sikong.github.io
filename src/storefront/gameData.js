export const HASH_GAME_ITEMS = [
  { slug: 'sum-parity', path: '/pages/hash/sum-parity', name: '和值单双', shortName: '和值单双', template: 'parity', options: ['单', '双'], odds: '1.94', cycle: 60, guidePath: '/pages/hash/sum-parity-guide' },
  { slug: 'lucky-hash', path: '/pages/hash/lucky-hash', name: '幸运哈希', shortName: '幸运哈希', template: 'lucky', options: ['HASH'], trendOptions: ['赢', '输'], odds: '—', cycle: 60, guidePath: '/pages/hash/tail-parity-guide?game=lucky-hash' },
  { slug: 'six-second', path: '/pages/hash/six-second', name: '6秒哈希', shortName: '6秒哈希', template: 'quick', options: ['单', '双', '大', '小'], odds: '1.95', cycle: 6, guidePath: '/pages/hash/tail-parity-guide?game=six-second' },
  { slug: 'nine-second', path: '/pages/hash/nine-second', name: '9秒哈希', shortName: '9秒哈希', template: 'quick', options: ['单', '双', '大', '小'], odds: '1.95', cycle: 9, guidePath: '/pages/hash/tail-parity-guide?game=nine-second' },
  { slug: 'fifteen-second', path: '/pages/hash/fifteen-second', name: '15秒哈希', shortName: '15秒哈希', template: 'quick', options: ['单', '双', '大', '小'], odds: '1.95', cycle: 15, guidePath: '/pages/hash/tail-parity-guide?game=fifteen-second' },
  { slug: 'lucky-banker-player', path: '/pages/hash/lucky-banker-player', name: '幸运庄闲', shortName: '幸运庄闲', template: 'banker', options: ['庄', '闲', '和'], odds: '—', cycle: 60, guidePath: '/pages/hash/banker-player-guide' },
  { slug: 'niuniu', path: '/pages/hash/niuniu', name: '牛牛', shortName: '牛牛', template: 'niuniu', options: ['押闲（自动）'], trendOptions: ['庄', '和', '闲'], odds: '1-10倍浮动', cycle: 60, guidePath: '/pages/hash/banker-player-guide?game=niuniu' },
  { slug: 'five-card-niuniu', path: '/pages/hash/five-card-niuniu', name: '五张牛牛', shortName: '五张牛牛', template: 'niuniu', options: ['押闲（自动）'], trendOptions: ['庄', '和', '闲'], odds: '1-10倍浮动', cycle: 60, guidePath: '/pages/hash/banker-player-guide?game=five-card-niuniu' },
  { slug: 'thirty-second', path: '/pages/hash/thirty-second', name: '30秒哈希', shortName: '30秒哈希', template: 'quick', options: ['单', '双', '大', '小'], odds: '1.95', cycle: 30, guidePath: '/pages/hash/tail-parity-guide?game=thirty-second' },
  { slug: 'tail-big-small', path: '/pages/hash/tail-big-small', name: '尾数大小', shortName: '尾数大小', template: 'size', options: ['大', '小'], odds: '1.94', cycle: 60, guidePath: '/pages/hash/tail-parity-guide?game=tail-big-small' },
  { slug: 'three-min-parity', path: '/pages/hash/three-min-parity', name: '3分彩单双', shortName: '3分彩单双', template: 'parity', options: ['单', '双'], odds: '1.94', cycle: 180, guidePath: '/pages/hash/tail-parity-guide?game=three-min-parity' },
  { slug: 'five-min-parity', path: '/pages/hash/five-min-parity', name: '5分彩单双', shortName: '5分彩单双', template: 'parity', options: ['单', '双'], odds: '1.94', cycle: 300, guidePath: '/pages/hash/tail-parity-guide?game=five-min-parity' },
  { slug: 'tail-parity', path: '/pages/hash/tail-parity', name: '尾数单双', shortName: '尾数单双', template: 'parity', options: ['单', '双'], odds: '1.94', cycle: 60, guidePath: '/pages/hash/tail-parity-guide?game=tail-parity' },
  { slug: 'one-minute-parity', path: '/pages/hash/one-minute-parity', name: '1分彩单双', shortName: '1分彩单双', template: 'parity', options: ['单', '双'], odds: '1.94', cycle: 60, guidePath: '/pages/hash/tail-parity-guide?game=one-minute-parity' },
]

export const HASH_GAME_ROUTE_MAP = Object.fromEntries(HASH_GAME_ITEMS.map((item) => [item.path, item]))

export function resolveHashGame(path = '') {
  const cleanPath = String(path || '').split('?')[0]
  return HASH_GAME_ROUTE_MAP[cleanPath] || HASH_GAME_ITEMS.find((item) => cleanPath.includes(item.slug)) || HASH_GAME_ITEMS.at(-1)
}

export const HASH_DRAWS = [
  { block: '70419860', result: '4', parity: '双', size: '小', hash: '...e923744', fullHash: 'e923744fa65ad2f82ea25ce09de109f6d59269874a06f83d85cb5905be48a314', time: '12:48:20' },
  { block: '70419840', result: '2', parity: '双', size: '小', hash: '...84ef7c2', fullHash: '84ef7c2529d518021de48c00f412aa7809348bd29318a981a678d7e33f0cc092', time: '12:47:20' },
  { block: '70419820', result: '7', parity: '单', size: '大', hash: '...3e99007', fullHash: '3e990079a1658754273be15794672b445e67eeb2d52cf04bcd930fba849016c7', time: '12:46:20' },
  { block: '70419800', result: '3', parity: '单', size: '小', hash: '...3db23bf', fullHash: '3db23bfaa850917299acdc37376a15c58a7686845c451f00121b68c21265d423', time: '12:45:20' },
  { block: '70419780', result: '8', parity: '双', size: '大', hash: '...a921d41', fullHash: 'a921d41bbd39e60511ab11ee3831e508505dfa421481ec4d157e3a3d546913a8', time: '12:44:20' },
  { block: '70419760', result: '5', parity: '单', size: '大', hash: '...014fe25', fullHash: '014fe2537e5ab3c207d67555e001e40a5444259fd960e5ef85d0900589488365', time: '12:43:20' },
  { block: '70419740', result: '6', parity: '双', size: '大', hash: '...f902336', fullHash: 'f9023368bbc3a0cfcbd50a611fc4b15788cb0988b83d7c78feb919c39e638906', time: '12:42:20' },
]

export const HASH_TREND = ['双', '单', '双', '单', '双', '单', '双', '双', '单', '双', '双', '单', '单', '双', '单', '单', '双', '双', '双', '单', '双', '单', '单', '双', '单', '双', '双', '单']

export const CURRENCIES = [
  { code: 'USDT', name: 'USDT', symbol: '₮', balance: '0.00', color: 'green' },
  { code: 'TRX', name: 'TRX', symbol: 'T', balance: '0.00', color: 'red' },
  { code: 'CNY', name: '人民币', symbol: '¥', balance: '0.00', color: 'blue' },
]

export const LOTTERY_GAMES = [
  { name: '哈希一分彩', path: '/pages/lottery/tron-minute', source: 'TRON 波场区块', issue: '202608271248', cycle: 60 },
  { name: '波场一分彩', path: '/pages/lottery/tron-minute?source=tron', source: 'TRON 波场区块', issue: '202608271248', cycle: 60 },
  { name: '以太坊一分彩', path: '/pages/lottery/tron-minute?source=eth', source: 'Ethereum 区块', issue: '202608271248', cycle: 60 },
]

export const LOTTERY_POSITION_NAMES = ['万位', '千位', '百位', '十位', '个位']
export const LOTTERY_NUMBERS = Array.from({ length: 10 }, (_, index) => index)

export const LOTTERY_RESULTS = [
  { issue: '202608271247', numbers: [6, 1, 9, 3, 8], sum: 27, time: '12:47' },
  { issue: '202608271246', numbers: [2, 7, 4, 0, 5], sum: 18, time: '12:46' },
  { issue: '202608271245', numbers: [9, 8, 1, 6, 3], sum: 27, time: '12:45' },
  { issue: '202608271244', numbers: [0, 4, 7, 2, 6], sum: 19, time: '12:44' },
  { issue: '202608271243', numbers: [5, 3, 8, 9, 1], sum: 26, time: '12:43' },
  { issue: '202608271242', numbers: [1, 6, 0, 4, 7], sum: 18, time: '12:42' },
]

export const LOTTERY_ORDERS = [
  { id: 'L202608271247001', issue: '202608271247', play: '五星直选 · 复式', pick: '6,1,9,3,8', amount: '2.00', status: '未中奖', prize: '0.00' },
  { id: 'L202608271246032', issue: '202608271246', play: '一星定位胆', pick: '个位 5', amount: '10.00', status: '已中奖', prize: '19.60' },
]

export const LOTTERY_PERIODS = Array.from({ length: 12 }, (_, index) => ({
  issue: String(202608271249 + index),
  time: `${String(12 + Math.floor((49 + index) / 60)).padStart(2, '0')}:${String((49 + index) % 60).padStart(2, '0')}`,
}))

export const LONG_DRAGONS = [
  { id: 1, game: '哈希一分彩', play: '总和单双', result: '单', count: 8, issue: '202608271248', odds: '1.95' },
  { id: 2, game: '哈希一分彩', play: '总和大小', result: '大', count: 6, issue: '202608271248', odds: '1.95' },
  { id: 3, game: '波场一分彩', play: '万位单双', result: '双', count: 5, issue: '202608271248', odds: '1.95' },
  { id: 4, game: '以太坊一分彩', play: '个位大小', result: '小', count: 4, issue: '202608271248', odds: '1.95' },
]

export const GAME_GROUPS = [
  { id: 'hash', label: '哈希游戏' },
  { id: 'lottery', label: '区块彩票' },
  { id: 'recent', label: '最近玩过' },
]
