export const STOREFRONT_PREFIX = '/front'
export const STOREFRONT_HOME = `${STOREFRONT_PREFIX}/pages/index/index`

const route = (targetPath, title, module, renderer) => ({
  targetPath,
  path: `${STOREFRONT_PREFIX}${targetPath}`,
  title,
  module,
  renderer,
})

// 目标 H5 公开构建中的 66 条 pages 路由。路由、版本说明与回归测试共用本清单。
export const storefrontRoutes = [
  route('/pages/index/index', '首页', '门户与导航', 'home'),
  route('/pages/entertainment/index', '娱乐', '门户与导航', 'entertainment'),
  route('/pages/entertainment/game-list', '全部游戏', '门户与导航', 'game-list'),
  route('/pages/user/user', '用户中心', '门户与导航', 'user'),
  route('/pages/service/index', '在线客服', '帮助与服务', 'service'),
  route('/pages/help/index', '帮助中心', '帮助与服务', 'help'),
  route('/pages/help/hijack-guide', '防劫持教程', '帮助与服务', 'hijack-guide'),
  route('/pages/download/index', '相关下载', '帮助与服务', 'download'),
  route('/pages/prize/index', '奖池实时余额', '门户与导航', 'prize'),
  route('/pages/agent/index', '推广代理', '推广代理', 'agent'),

  route('/pages/login/login', '登录', '登录与注册', 'login'),
  route('/pages/login/recover-password', '找回密码', '登录与注册', 'recover-password'),
  route('/pages/register/register', '注册账户', '登录与注册', 'register'),
  route('/pages/agreement/agreement', '协议', '登录与注册', 'agreement'),
  route('/pages/captcha-test/index', 'H5安全验证测试', '登录与注册', 'captcha-test'),

  route('/pages/deposit/index', '充值', '钱包与资金', 'deposit'),
  route('/pages/wallet/withdraw', '提现', '钱包与资金', 'withdraw'),
  route('/pages/wallet/commission_transfer', '佣金转余额', '钱包与资金', 'commission-transfer'),
  route('/pages/wallet/exchange', '货币兑换', '钱包与资金', 'exchange'),
  route('/pages/wallet/fixed_rate_wallet', '固率钱包', '钱包与资金', 'fixed-wallet'),
  route('/pages/wallet/fixed_rate_wallet_records', '固率钱包记录', '钱包与资金', 'fixed-wallet-records'),
  route('/pages/wallet/red_packet', '红包中心', '红包与转账', 'red-packet'),
  route('/pages/wallet/red_packet_records', '红包记录', '红包与转账', 'red-packet-records'),
  route('/pages/wallet/red_packet_detail', '发出红包详情', '红包与转账', 'red-packet-detail'),
  route('/pages/wallet/receive_red_packet', '领取红包', '红包与转账', 'receive-red-packet'),
  route('/pages/energy/rental', '快速租赁', '钱包与资金', 'energy-rental'),

  route('/pages/records/account_details', '账变明细', '记录中心', 'account-records'),
  route('/pages/records/bet_record', '投注记录', '记录中心', 'hash-records'),
  route('/pages/records/lottery-bets', '彩票投注记录', '记录中心', 'lottery-records'),

  route('/pages/security/center', '账户设置', '账户安全', 'security-center'),
  route('/pages/security/account-bind', '账户管理', '账户安全', 'account-bind'),
  route('/pages/security/email-bind', '绑定邮箱', '账户安全', 'email-bind'),
  route('/pages/security/google-authenticator', '谷歌验证器', '账户安全', 'google-authenticator'),
  route('/pages/security/login-password', '修改登录密码', '账户安全', 'login-password'),
  route('/pages/security/recharge-password', '设置资金密码', '账户安全', 'recharge-password'),
  route('/pages/security/security-question', '设置密保', '账户安全', 'security-question'),
  route('/pages/security/onboarding', '账户安全设置', '账户安全', 'security-onboarding'),

  route('/pages/benefit/index', '福利中心', '福利活动', 'benefit'),
  route('/pages/benefit/detail', '福利详情', '福利活动', 'benefit-detail'),
  route('/pages/benefit/lucky5', '幸运排列5', '福利活动', 'benefit-lucky5'),
  route('/pages/benefit/fee-free', '手续费全免', '福利活动', 'benefit-fee-free'),
  route('/pages/benefit/verify-u', '验资送U', '福利活动', 'benefit-verify-u'),

  route('/pages/hash/detail', '哈希游戏', '哈希游戏', 'hash-detail'),
  route('/pages/hash/order-detail', '哈希注单详情', '哈希游戏', 'hash-order-detail'),
  route('/pages/hash/tail-parity', '尾数单双', '哈希游戏', 'hash-game'),
  route('/pages/hash/sum-parity', '和值单双', '哈希游戏', 'hash-game'),
  route('/pages/hash/lucky-hash', '幸运哈希', '哈希游戏', 'hash-game'),
  route('/pages/hash/one-minute-parity', '1分彩单双', '哈希游戏', 'hash-game'),
  route('/pages/hash/six-second', '6秒哈希', '哈希游戏', 'hash-game'),
  route('/pages/hash/nine-second', '9秒哈希', '哈希游戏', 'hash-game'),
  route('/pages/hash/fifteen-second', '15秒哈希', '哈希游戏', 'hash-game'),
  route('/pages/hash/thirty-second', '30秒哈希', '哈希游戏', 'hash-game'),
  route('/pages/hash/tail-big-small', '尾数大小', '哈希游戏', 'hash-game'),
  route('/pages/hash/three-min-parity', '3分彩单双', '哈希游戏', 'hash-game'),
  route('/pages/hash/five-min-parity', '5分彩单双', '哈希游戏', 'hash-game'),
  route('/pages/hash/lucky-banker-player', '幸运庄闲', '哈希游戏', 'hash-game'),
  route('/pages/hash/niuniu', '牛牛', '哈希游戏', 'hash-game'),
  route('/pages/hash/five-card-niuniu', '五张牛牛', '哈希游戏', 'hash-game'),
  route('/pages/hash/tail-parity-guide', '哈希玩法教程', '哈希游戏', 'hash-guide'),
  route('/pages/hash/sum-parity-guide', '和值玩法教程', '哈希游戏', 'hash-guide'),
  route('/pages/hash/banker-player-guide', '庄闲牛牛教程', '哈希游戏', 'hash-guide'),

  route('/pages/lottery/game', '区块彩票', '区块彩票', 'lottery-game'),
  route('/pages/lottery/tron-minute', '哈希一分彩', '区块彩票', 'lottery-game'),
  route('/pages/lottery/long-dragon', '长龙投注', '区块彩票', 'lottery-long-dragon'),
  route('/pages/lottery/chase', '追号投注', '区块彩票', 'lottery-chase'),
  route('/pages/lottery/order-detail', '彩票注单详情', '区块彩票', 'lottery-order-detail'),
]

export const storefrontRouteMap = Object.fromEntries(storefrontRoutes.map((item) => [item.path, item]))

export function normalizeStorefrontPath(pathname) {
  if (pathname === STOREFRONT_PREFIX || pathname === `${STOREFRONT_PREFIX}/` || pathname === `${STOREFRONT_PREFIX}/home`) return STOREFRONT_HOME
  return storefrontRouteMap[pathname] ? pathname : STOREFRONT_HOME
}

export function toStorefrontPath(targetPath) {
  if (!targetPath) return STOREFRONT_HOME
  if (targetPath.startsWith(STOREFRONT_PREFIX)) return targetPath
  return `${STOREFRONT_PREFIX}${targetPath.startsWith('/') ? targetPath : `/${targetPath}`}`
}
