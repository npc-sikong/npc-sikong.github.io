export const ACCOUNT_CURRENCIES = [
  { code: 'USDT', name: 'USDT', symbol: '₮', balance: 2688.42, commission: 166.8, color: 'green' },
  { code: 'TRX', name: 'TRX', symbol: 'T', balance: 15320.6, commission: 588.2, color: 'red' },
  { code: 'CNY', name: '人民币', symbol: '¥', balance: 5200, commission: 320, color: 'blue' },
]

export const DEPOSIT_CHANNELS = [
  { id: 'trc20', currency: 'USDT', label: 'USDT-TRC20', protocol: 'TRC20', min: 10, max: 500000, address: 'TV8uQp7N2k6QZB8G6HashDemoV6Y2P3s' },
  { id: 'trx', currency: 'TRX', label: 'TRX', protocol: 'TRON', min: 50, max: 3000000, address: 'TK4o9Q7mDemoHashTRX8y62Wn6Vj7L' },
  { id: 'cny', currency: 'CNY', label: '支付宝快捷支付', protocol: 'CNY', min: 100, max: 50000, address: '' },
]

export const WITHDRAW_METHODS = [
  { id: 'trc20', label: 'TRC20地址', currency: 'USDT', account: 'TV8u...V6Y2P3s', fee: '1 USDT', min: 20 },
  { id: 'alipay', label: '支付宝', currency: 'CNY', account: '陈** · 138****8899', fee: '0.5%', min: 100 },
  { id: 'bank', label: '银行卡', currency: 'CNY', account: '招商银行 · 6225 **** 3208', fee: '2 CNY', min: 100 },
]

export const SECURITY_QUESTIONS = [
  '1.您的学号是多少？',
  '2.您小学班主任的姓名是？',
  '3.您初中班主任的姓名是？',
  '4.您高中班主任的姓名是？',
  '5.您父亲的姓名是？',
  '6.您母亲的姓名是？',
  '7.您第一所学校的名称是？',
  '8.您最喜欢的城市是？',
  '15.您的出生地是？',
]

export const BANKS = ['中国工商银行', '中国建设银行', '中国农业银行', '中国银行', '招商银行', '交通银行', '邮储银行', '平安银行']

export const PROMO_DOMAINS = [
  { id: 1, label: '默认推广链接 - h5.hash-demo.test', value: 'https://h5.hash-demo.test/r/G6HASH88' },
  { id: 2, label: '活动推广 - h5.hash-demo.test', value: 'https://h5.hash-demo.test/r/G6HASH88' },
]

export const RED_PACKET_RECORDS = [
  { id: 'RP202608270001', type: 'send', mode: '拼手气红包', currency: 'USDT', amount: 88, count: 8, claimed: 5, remaining: 31.28, status: '领取中', condition: '仅会员领取', time: '2026-08-27 11:28', link: 'https://h5.hash-demo.test/receive?no=RP202608270001' },
  { id: 'RP202608260016', type: 'send', mode: '固定金额红包', currency: 'TRX', amount: 300, count: 10, claimed: 10, remaining: 0, status: '已领完', condition: '无限制', time: '2026-08-26 20:16', link: 'https://h5.hash-demo.test/receive?no=RP202608260016' },
  { id: 'RP202608250009', type: 'receive', mode: '拼手气红包', currency: 'USDT', amount: 6.66, count: 1, claimed: 1, remaining: 0, status: '已领取', condition: '仅会员领取', time: '2026-08-25 09:33', link: '' },
]

export const ACCOUNT_RECORDS = [
  { id: 'D20260827102801', category: '充提明细', type: '充值', currency: 'USDT', amount: '+200.00', status: '成功', time: '2026-08-27 10:28' },
  { id: 'W20260826190132', category: '充提明细', type: '提现', currency: 'TRX', amount: '-500.00', status: '处理中', time: '2026-08-26 19:01' },
  { id: 'B20260826121108', category: '福利明细', type: '首充加赠', currency: 'USDT', amount: '+2.00', status: '成功', time: '2026-08-26 12:11' },
  { id: 'T20260825161620', category: '互转明细', type: '余额转账', currency: 'CNY', amount: '-188.00', status: '成功', time: '2026-08-25 16:16' },
  { id: 'E20260824103012', category: '兑换明细', type: '余额兑换', currency: 'TRX', amount: '+735.20', status: '成功', time: '2026-08-24 10:30' },
]

export const HASH_RECORDS = [
  { id: 'H20260827124801', game: '尾数单双', pick: '单', currency: 'USDT', amount: '10.00', result: '7 · 单', profit: '+9.40', status: '已中奖', time: '12:48:20' },
  { id: 'H20260827124719', game: '30秒哈希', pick: '大', currency: 'TRX', amount: '50.00', result: '2 · 小', profit: '-50.00', status: '未中奖', time: '12:47:30' },
  { id: 'H20260827124608', game: '幸运庄闲', pick: '闲', currency: 'USDT', amount: '20.00', result: '—', profit: '—', status: '开奖中', time: '12:46:10' },
]

export const LOTTERY_RECORDS = [
  { id: 'L202608271247001', game: '哈希一分彩', issue: '202608271247', play: '五星直选 · 复式', pick: '6,1,9,3,8', currency: 'USDT', amount: '2.00', status: '未中奖' },
  { id: 'L202608271246032', game: '波场一分彩', issue: '202608271246', play: '一星定位胆', pick: '个位 5', currency: 'USDT', amount: '10.00', status: '已中奖' },
]

export const BENEFITS = [
  { id: 'deposit', title: 'G6哈希 首存即送', accent: '首存额外加赠', scope: '全体会员', turnover: '1倍', time: '长期有效', receive: '自动到账' },
  { id: 'streak', title: '连赢不断 奖励不断', accent: '最高可得奖励', scope: '全体会员', turnover: '1倍', time: '长期有效', receive: '联系客服' },
  { id: 'rank', title: '周榜业绩榜单奖励', accent: '最高奖励', scope: '全体会员', turnover: '1倍', time: '每周结算', receive: '每周一自动发放' },
]

export const STREAK_REWARDS = [
  ['连赢 3 次', '3 USDT'],
  ['连赢 5 次', '8 USDT'],
  ['连赢 8 次', '28 USDT'],
  ['连赢 12 次', '88 USDT'],
]

export const RANK_REWARDS = [
  ['第 1 名', '888 USDT'],
  ['第 2 名', '388 USDT'],
  ['第 3 名', '188 USDT'],
  ['第 4-10 名', '58 USDT'],
]

export const LUCKY5_REWARDS = [
  ['一等奖', '10000', '5位全中'],
  ['二等奖', '500', '后4位相同'],
  ['三等奖', '100', '后3位相同'],
  ['四等奖', '20', '后2位相同'],
  ['五等奖', '5', '后1位相同'],
]

export const SECURITY_MENU = [
  { id: 'google', title: '谷歌验证器管理', subtitle: '查看恢复码与重新绑定设置', route: '/pages/security/google-authenticator', status: '已绑定' },
  { id: 'account', title: '账户管理', subtitle: '可绑定TRC20地址、支付宝与银行卡', route: '/pages/security/account-bind', status: '已设置' },
  { id: 'fund', title: '修改资金密码', subtitle: '保障账户资金交易安全', route: '/pages/security/recharge-password', status: '已设置' },
  { id: 'question', title: '密保管理', subtitle: '设置或更换密保问题，保障账户安全', route: '/pages/security/security-question', status: '' },
  { id: 'login', title: '修改登录密码', subtitle: '定期修改，有效提高账户安全', route: '/pages/security/login-password', status: '' },
]

export const FIXED_WALLET_RECORDS = [
  { id: 'FW20260827001', direction: '存入固率钱包', source: '100.00 USDT', target: '735.20 TRX', rate: '1 USDT = 7.352 TRX', time: '2026-08-27 09:10' },
  { id: 'FW20260825008', direction: '从固率钱包取出', source: '300.00 TRX', target: '40.80 USDT', rate: '1 TRX = 0.136 USDT', time: '2026-08-25 20:31' },
]

export const ENERGY_PACKAGES = {
  energy: ['2笔', '5笔', '10笔', '20笔'],
  bandwidth: ['5千', '1万', '5万'],
}
