export const assetPath = (name) => `/storefront/assets/${name}`

export const homeBanners = [
  { id: 'telegram', image: assetPath('home-banner-2.jpg'), label: '加入 V6 红包频道' },
  { id: 'rebate', image: assetPath('home-banner.jpg'), label: '手续费全免' },
  { id: 'verify', image: assetPath('home-banner-3.jpg'), label: '验资送 U' },
]

export const gameTabs = [
  { id: 'hot', label: '热门游戏', icon: '🔥' },
  { id: 'lottery', label: '区块彩票', icon: '⑧' },
  { id: 'hash', label: '哈希游戏', icon: 'Ⓣ' },
]

export const gameCards = [
  { id: 'minute-odd-even', title: '1分彩单双', image: assetPath('game-01.jpg'), category: ['hot', 'lottery'], streak: '单区块连', result: '单', periods: 5, path: '/pages/hash/one-minute-parity' },
  { id: 'tail-odd-even', title: '尾数单双', image: assetPath('game-02.png'), category: ['hot', 'lottery'], streak: '单区块连', result: '单', periods: 13, path: '/pages/hash/tail-parity' },
  { id: 'hash-6', title: '6秒哈希', image: assetPath('game-03.png'), category: ['hot', 'hash'], streak: '双区块连', result: '双', periods: 6, path: '/pages/hash/six-second' },
  { id: 'hash-9', title: '9秒哈希', image: assetPath('game-04.png'), category: ['hot', 'hash'], streak: '最大连', result: '赢', periods: 7, path: '/pages/hash/nine-second' },
  { id: 'lucky-hash', title: '幸运哈希', image: assetPath('game-05.jpg'), category: ['hot', 'hash'], streak: '双区块连', result: '双', periods: 4, path: '/pages/hash/lucky-hash' },
  { id: 'sum-odd-even', title: '和值单双', image: assetPath('game-06.jpg'), category: ['hot', 'lottery'], streak: '单区块连', result: '单', periods: 7, path: '/pages/hash/sum-parity' },
  { id: 'hash-15', title: '15秒哈希', image: assetPath('game-07.jpg'), category: ['hot', 'hash'], streak: '双区块连', result: '双', periods: 6, path: '/pages/hash/fifteen-second' },
  { id: 'hash-30', title: '30秒哈希', image: assetPath('game-08.jpg'), category: ['hot', 'hash'], streak: '最大连', result: '大', periods: 7, path: '/pages/hash/thirty-second' },
  { id: 'tail-size', title: '尾数大小', image: assetPath('game-09.jpg'), category: ['lottery'], streak: '最大连', result: '小', periods: 6, path: '/pages/hash/tail-big-small' },
  { id: 'three-minute-odd-even', title: '3分彩单双', image: assetPath('game-10.jpg'), category: ['lottery'], streak: '单区块连', result: '单', periods: 8, path: '/pages/hash/three-min-parity' },
  { id: 'baccarat', title: '哈希百家乐', image: assetPath('game-11.jpg'), category: ['hash'], streak: '最大连', result: '庄', periods: 4, path: '/pages/hash/lucky-banker-player' },
  { id: 'bull', title: '哈希牛牛', image: assetPath('game-12.jpg'), category: ['hash'], streak: '最大连', result: '闲', periods: 5, path: '/pages/hash/niuniu' },
  { id: 'dragon-tiger', title: '五张牛牛', image: assetPath('game-13.jpg'), category: ['hash'], streak: '最大连', result: '和', periods: 1, path: '/pages/hash/five-card-niuniu' },
  { id: 'sic-bo', title: '幸运哈希', image: assetPath('game-14.jpg'), category: ['hash'], streak: '最大连', result: '大', periods: 5, path: '/pages/hash/lucky-hash' },
]

export const rankRows = [
  { block: '70358027', player: 'ev***777', time: '00:59:19', profit: '94', game: '尾数单双' },
  { block: '70345028', player: 'ev***777', time: '14:08:35', profit: '47', game: '6秒哈希' },
  { block: '70288349', player: 'ce***001', time: '14:43:50', profit: '94', game: '尾数单双' },
  { block: '70288347', player: 'ce***001', time: '14:43:43', profit: '94', game: '尾数单双' },
  { block: '70287132', player: 'ev***777', time: '13:42:47', profit: '94', game: '6秒哈希' },
  { block: '70286618', player: 'g6***888', time: '13:12:08', profit: '66', game: '9秒哈希' },
]

export const walletVendors = [
  { id: 'tokenpocket', name: 'TokenPocket', detail: 'TokenPocket钱包', image: assetPath('tokenpocket.svg'), tone: '#2f88ff' },
  { id: 'safepal', name: 'SAFEPAL', detail: 'SafePal钱包', monogram: 'S', tone: '#161b2b' },
  { id: 'mathwallet', name: 'MathWallet', detail: 'MathWallet钱包', monogram: 'M', tone: '#5769ff' },
  { id: 'binance', name: 'BINANCE', detail: '币安交易所', monogram: '◆', tone: '#f4b71b' },
  { id: 'htx', name: 'HTX', detail: 'HTX交易所', image: assetPath('huobi.png'), tone: '#267cff' },
  { id: 'coincola', name: 'CoinCola', detail: 'CoinCola交易所', monogram: 'C', tone: '#358df5' },
]

export const bottomNavItems = [
  { id: 'home', label: '首页', path: '/pages/index/index', icon: 'home', activeImage: assetPath('tab-home-active.png') },
  { id: 'entertainment', label: '娱乐', path: '/pages/entertainment/index', icon: 'entertainment' },
  { id: 'deposit', label: '存款', path: '/pages/deposit/index', icon: 'deposit' },
  { id: 'benefit', label: '福利', path: '/pages/benefit/index', icon: 'benefit', activeImage: assetPath('tab-benefit-active.png') },
  { id: 'user', label: '我的', path: '/pages/user/user', icon: 'user', activeImage: assetPath('tab-user-active.png') },
]

export const benefits = [
  { id: 'weekly-rank', title: '周榜业绩榜单奖励', caption: '最高奖励', amount: '888T', art: '👑', className: 'sf-benefit-card--crown', path: '/pages/benefit/detail?activity=weekly' },
  { id: 'winning-streak', title: '连赢不断 奖励不断', caption: '最高可得奖励', amount: '128T', art: '×10', className: 'sf-benefit-card--streak', path: '/pages/benefit/detail?activity=winning' },
  { id: 'first-deposit', title: 'G6哈希 首存即送', caption: '首存额外加赠', amount: '1%', art: '💎', className: 'sf-benefit-card--deposit', path: '/pages/benefit/detail?activity=first' },
  { id: 'fee-free', title: '投注手续费全免', caption: '畅玩哈希', amount: '0手续费', art: '免', className: 'sf-benefit-card--fee', path: '/pages/benefit/fee-free' },
  { id: 'verify-u', title: '验资送U', caption: '千万奖池', amount: '验资即送', art: 'U', className: 'sf-benefit-card--verify', path: '/pages/benefit/verify-u' },
]

export const walletCurrencies = [
  { id: 'USDT', name: 'USDT', icon: assetPath('usdt.svg'), balance: '0.00', commission: '0.00' },
  { id: 'TRX', name: 'TRX', icon: assetPath('trx.svg'), balance: '0.00', commission: '0.00' },
  { id: 'CNY', name: 'CNY', icon: assetPath('wallet-cny.png'), balance: '0.00', commission: '0.00' },
]

export const userPrimaryActions = [
  { id: 'deposit', label: '充值', image: assetPath('action-deposit.png'), path: '/pages/deposit/index' },
  { id: 'withdraw', label: '提现', image: assetPath('action-withdraw.png'), path: '/pages/wallet/withdraw' },
]

export const userMoneyActions = [
  { id: 'red-packet', label: '发红包', image: assetPath('menu-red-packet.png'), path: '/pages/wallet/red_packet' },
  { id: 'energy', label: '能量租赁', image: assetPath('menu-energy.png'), path: '/pages/energy/rental' },
  { id: 'commission', label: '佣金转余额', image: assetPath('menu-commission.png'), path: '/pages/wallet/commission_transfer' },
  { id: 'exchange', label: '兑换中心', image: assetPath('menu-exchange.png'), path: '/pages/wallet/exchange' },
]

export const userMenuActions = [
  { id: 'share', label: '分享赚钱', image: assetPath('menu-share.png'), path: '/pages/agent/index' },
  { id: 'security', label: '账户设置', image: assetPath('menu-security.png'), path: '/pages/security/center', badge: '4' },
  { id: 'details', label: '账变明细', image: assetPath('menu-account-details.png'), path: '/pages/records/account_details' },
  { id: 'bet-record', label: '投注记录', image: assetPath('menu-bet-record.png'), path: '/pages/records/bet_record' },
  { id: 'buy-coin', label: '购买虚拟币', image: assetPath('menu-buy-coin.png') },
  { id: 'help', label: '帮助中心', image: assetPath('menu-help.png'), path: '/pages/help/index' },
  { id: 'download', label: '相关下载', image: assetPath('menu-download.png'), path: '/pages/download/index' },
  { id: 'service', label: '联系客服', image: assetPath('menu-service.png') },
]

export const sideMenuItems = [
  { id: 'lottery', label: '常用彩票', icon: '⑧', path: '/pages/index/index?tab=lottery' },
  { id: 'favorite', label: '我的收藏', icon: '♥' },
  { id: 'electronic', label: '热门电子', icon: '🔥', path: '/pages/entertainment/index' },
  { id: 'hash', label: '哈希游戏', icon: 'Ⓣ', path: '/pages/index/index?tab=hash' },
  { id: 'benefit', label: '优惠活动', icon: '🎁', path: '/pages/benefit/index' },
  { id: 'energy', label: '能量/租赁', icon: '⚡', path: '/pages/energy/rental' },
  { id: 'bandwidth', label: '带宽租赁', icon: '⚡' },
  { id: 'exchange', label: '货币兑换', icon: '◉', path: '/pages/wallet/exchange' },
]

export const helpWallets = [
  { id: 'imtoken', name: 'imToken', monogram: '◡', tone: '#2f83a9' },
  { id: 'tronlink', name: 'tronlink', monogram: '△', tone: '#3155ac' },
  { id: 'bitpie', name: '比特派', monogram: '✤', tone: '#273b91' },
  { id: 'ownbit', name: 'Ownbit', monogram: '◔', tone: '#4da1da' },
  { id: 'trust', name: 'Trust', monogram: '♢', tone: '#3976a6' },
  { id: 'okx', name: '欧易WEB3', monogram: '▦', tone: '#111' },
]

export const helpTopics = [
  { id: 'deposit', label: '充值教程', icon: '▰' },
  { id: 'bet', label: '投注教程', icon: '♟' },
  { id: 'play', label: '玩法教程', icon: '◉' },
  { id: 'query', label: '查询教程', icon: '⌕' },
  { id: 'address', label: '添加地址', icon: '⬡' },
  { id: 'security', label: '安全教程', icon: '✓' },
]

export const downloadGroups = {
  official: [
    { id: 'app', name: 'G6哈希手机APP', detail: '官方客户端（移动端）', icon: '☁' },
  ],
  wallet: [
    { id: 'tokenpocket', name: 'TokenPocket', detail: '去中心化钱包', image: assetPath('tokenpocket.svg') },
    { id: 'tronlink', name: 'TronLink', detail: 'TRON 官方钱包', icon: '△' },
    { id: 'imtoken', name: 'imToken', detail: '多链数字钱包', icon: '◡' },
  ],
  exchange: [
    { id: 'binance', name: 'BINANCE', detail: '数字资产交易平台', icon: '◆' },
    { id: 'htx', name: 'HTX', detail: '数字资产交易平台', image: assetPath('huobi.png') },
  ],
  other: [
    { id: 'vpn', name: '网络工具', detail: '备用访问工具（演示）', icon: '◎' },
  ],
}

export const prizeRanks = [
  ['1', '888T'], ['2', '588T'], ['3', '388T'], ['4', '128T'], ['5', '128T'],
  ['6', '128T'], ['7', '128T'], ['8', '128T'], ['9', '128T'], ['10', '128T'],
]

export const prizeRules = [
  '领取方式：达到活动要求的会员，系统将于次日自动派发到会员账户，加赠金额上限为 8888 元。',
  '所获加赠需完成 1 倍流水后即可申请提款。',
  '同一手机号、姓名、邮箱、隐含卡号或虚拟币地址等信息的游戏账号，仅可参与一次。',
  '以非正常方式套取优惠的账号将取消活动资格；本演示页面不进行真实风控判断。',
  '为避免文字理解差异，活动规则以页面展示为准。',
]

export const teamMetrics = [
  ['充值', '0 USDT'], ['提款', '0 USDT'], ['总投注', '0 USDT'], ['总有效流水', '0 USDT'],
  ['总盈亏', '0 USDT'], ['总中奖', '0 USDT'], ['实时工资', '0 USDT'], ['活动', '0 USDT'],
  ['新增人数', '1'], ['团队人数', '1'],
]
