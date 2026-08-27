export const navGroups = [
  {
    label: '会员管理', icon: 'Users', children: [
      ['/member/wage-report', '会员工资报表'],
      ['/member/wallet', '会员钱包列表'],
      ['/member/tag', '会员标签'],
      ['/member/list', '会员列表'],
    ],
  },
  {
    label: '链上配置', icon: 'Link2', children: [
      ['/blockchain/collection-record', '归集记录'],
      ['/blockchain/energy-config', '能量租赁'],
      ['/blockchain/energy-order', '能量租赁记录'],
      ['/blockchain/collection-config', '归集配置'],
      ['/blockchain/scan-cursor', '扫链游标'],
      ['/blockchain/api-key', '波场API配置'],
      ['/blockchain/cold-wallet', '冷钱包管理'],
      ['/blockchain/hot-wallet', '热钱包管理'],
      ['/blockchain/status', '运行状态'],
    ],
  },
  {
    label: '代理管理', icon: 'UserRound', children: [
      ['/agent/profile', '代理资料'],
      ['/agent/team-analysis', '团队分析表'],
      ['/agent/invite-link', '邀请链接'],
      ['/agent/income', '推广收益明细'],
      ['/agent/user-default-scheme', '默认赔率返水方案'],
      ['/agent/setting', '推广设置'],
    ],
  },
  {
    label: '运营管理', icon: 'FileText', children: [
      ['/operate/home-group', '首页分组配置'],
      ['/operate/app-version', 'App版本管理'],
      ['/operate/advertisement', '广告管理'],
      ['/operate/activity', '活动管理'],
      ['/operate/activity-type', '活动类型'],
      ['/operate/announcement', '公告管理'],
    ],
  },
  {
    label: '游戏管理', icon: 'Gamepad2', children: [
      ['/game/line', '游戏线路'],
      ['/game/factory', '游戏厂商'],
      ['/game/transfer-payout', '转账派奖单'],
      ['/game/transfer-bet', '转账投注记录'],
      ['/game/transfer-address', '转账投注地址'],
      ['/game/platform-scheme', '平台赔率与结算方案'],
      { section: '哈希游戏管理' },
      ['/game/hash/bet', '哈希游戏投注记录'],
      ['/game/base', '自营游戏配置'],
    ],
  },
  {
    label: '风控管理', icon: 'ShieldAlert', children: [
      ['/risk/game-profit-loss', '游戏盈亏风控设置'],
    ],
  },
  {
    label: '资金管理', icon: 'WalletCards', children: [
      ['/finance/turnover-requirement', '流水要求'],
      ['/finance/red-packet-quota', '红包领取次数'],
      ['/finance/red-packet-receive', '红包领取记录'],
      ['/finance/red-packet', '红包发放记录'],
      ['/finance/settlement-service-fee', '结算服务费'],
      ['/finance/currency-exchange-record', '兑换记录'],
      ['/finance/fixed-wallet', '固率钱包'],
      ['/finance/currency-exchange', '货币兑换'],
      ['/finance/fund-pool-address', '资金池地址'],
      ['/finance/user-change', '用户账变记录'],
      ['/finance/finance-data', '财务数据表'],
      ['/finance/withdraw-order', '提现订单管理'],
      ['/finance/market-data', '市场数据表'],
      ['/finance/recharge-order', '充值订单管理'],
      ['/finance/game-wallet', '游戏钱包地址列表'],
      ['/finance/bank', '银行列表'],
      ['/finance/withdraw-channel', '提现渠道'],
      ['/finance/withdraw-type', '提现类型'],
      ['/finance/recharge-channel', '充值渠道'],
      ['/finance/recharge-type', '充值类型'],
      ['/finance/payment-merchant', '支付商户'],
    ],
  },
  {
    label: '权限管理', icon: 'LockKeyhole', children: [
      ['/permission/admin', '管理员'],
      ['/permission/role', '角色管理'],
      ['/permission/menu', '菜单管理'],
    ],
  },
  {
    label: '自营区块彩票', icon: 'Ticket', children: [
      ['/lottery/game', '彩票彩种配置'],
      ['/lottery/rule', '彩票玩法赔率'],
      ['/lottery/draw', '彩票开奖记录'],
      ['/lottery/bet', '彩票注单记录'],
      ['/lottery/chase', '彩票追号记录'],
    ],
  },
  {
    label: '系统设置', icon: 'Settings', children: [
      ['/setting/data-source', '数据源配置'],
      ['/setting/captcha', '安全验证'],
      { section: '通道配置' },
      ['/setting/channel/customer-service', '客服配置'],
      ['/setting/channel/email', '邮件配置'],
      { section: '网站设置' },
      ['/setting/website/withdraw-account', '提现账户设置'],
      ['/setting/website/information', '网站信息'],
      ['/setting/website/protocol', '政策协议'],
      { section: '消息通知' },
      ['/setting/message/short_letter', '短信设置'],
      { section: '用户设置' },
      ['/setting/user/security-question', '密保问题'],
      ['/setting/user/setup', '用户设置'],
      ['/setting/user/login_register', '登录注册'],
      ['/setting/storage', '存储设置'],
      { section: '系统维护' },
      ['/setting/system/journal', '系统日志'],
      ['/setting/system/login_log', '登录日志'],
    ],
  },
]

const f = (label, placeholder = `请输入${label}`, type = 'text') => ({ label, placeholder, type })
const s = (label, placeholder = '请选择') => ({ label, placeholder, type: 'select' })
const d = (label) => ({ label, placeholder: '开始时间', type: 'date-range' })
const page = (title, options = {}) => ({ title, count: 0, ...options })

const CRUD = ['编辑', '删除']
const DETAIL = ['详情']

export const lotteryRuleRows = [
  { id: 1, system: '时时彩', family: '前三码', subgroup: '前三直选', play: '前三直选复式', playType: '直选复式', configOdds: '1000', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 10, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 2, system: '时时彩', family: '前三码', subgroup: '前三直选', play: '前三直选单式', playType: '直选单式', configOdds: '1000', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 10, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 3, system: '时时彩', family: '前三码', subgroup: '前三直选', play: '前三直选和值', playType: '直选和值', configOdds: '1000', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 10, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 4, system: '时时彩', family: '前三码', subgroup: '前三直选', play: '前三直选跨度', playType: '直选跨度', configOdds: '1000', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 10, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 5, system: '时时彩', family: '前三码', subgroup: '前三直选', play: '前三组合', playType: '组合', configOdds: '1000|100|10', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 0, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 6, system: '时时彩', family: '前三码', subgroup: '前三组选', play: '前三组三', playType: '组三', configOdds: '333.333', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 10, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 7, system: '时时彩', family: '前三码', subgroup: '前三组选', play: '前三组六', playType: '组六', configOdds: '166.666', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 1, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 8, system: '时时彩', family: '前三码', subgroup: '前三组选', play: '前三组选和值', playType: '组选和值', configOdds: '333.333|166.666', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 3, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 9, system: '时时彩', family: '前三码', subgroup: '前三组选', play: '前三组选包胆', playType: '组选包胆', configOdds: '333.333|166.666', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 10, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
  { id: 10, system: '时时彩', family: '前三码', subgroup: '前三组选', play: '前三混合组选', playType: '混合组选', configOdds: '333.333|166.666', extraRate: '0.005000', totalBets: 1000, canWinBets: 1, challengeThreshold: 10, unitLimits: { USDT: '39999', TRX: '128888', CNY: '300000' }, challengeLimits: { USDT: '3000', TRX: '9000', CNY: '20000' }, enabled: true, allowExtra: true },
].map((row) => ({ ...row, system: '时彩' }))

export const teamAnalysisRows = [
  {
    id: '133', username: 'evan777', parentMember: '-', status: '启用',
    teamSize: 4, newRegistrations: 3, directCount: 2, activeCount: 4, rechargeUsers: 2,
    turnover: { USDT: 2300, TRX: 18800, CNY: 15400 }, recharge: { USDT: 350, TRX: 2300, CNY: 2100 },
    profitLoss: { USDT: -184, TRX: 760, CNY: -1232 }, wage: { USDT: 62.1, TRX: 507.6, CNY: 415.8 },
  },
  {
    id: '185', username: 'sky185', parentMember: 'evan777 / 133', status: '启用',
    teamSize: 2, newRegistrations: 1, directCount: 1, activeCount: 2, rechargeUsers: 2,
    turnover: { USDT: 1400, TRX: 9600, CNY: 8200 }, recharge: { USDT: 350, TRX: 1200, CNY: 900 },
    profitLoss: { USDT: -112, TRX: -640, CNY: -656 }, wage: { USDT: 37.8, TRX: 259.2, CNY: 221.4 },
  },
  {
    id: '219', username: 'mango219', parentMember: 'evan777 / 133', status: '启用',
    teamSize: 1, newRegistrations: 0, directCount: 0, activeCount: 1, rechargeUsers: 0,
    turnover: { USDT: 600, TRX: 2800, CNY: 3600 }, recharge: { USDT: 0, TRX: 0, CNY: 0 },
    profitLoss: { USDT: 24, TRX: -196, CNY: 288 }, wage: { USDT: 16.2, TRX: 75.6, CNY: 97.2 },
  },
  {
    id: '241', username: 'nova241', parentMember: 'sky185 / 185', status: '启用',
    teamSize: 1, newRegistrations: 0, directCount: 0, activeCount: 1, rechargeUsers: 1,
    turnover: { USDT: 400, TRX: 1800, CNY: 2400 }, recharge: { USDT: 200, TRX: 800, CNY: 600 },
    profitLoss: { USDT: -36, TRX: 126, CNY: -192 }, wage: { USDT: 10.8, TRX: 48.6, CNY: 64.8 },
  },
  {
    id: '288', username: 'orbit288', parentMember: '-', status: '启用',
    teamSize: 37, newRegistrations: 12, directCount: 5, activeCount: 24, rechargeUsers: 9,
    turnover: { USDT: 68540.25, TRX: 228600, CNY: 398200 }, recharge: { USDT: 18200, TRX: 65800, CNY: 88600 },
    profitLoss: { USDT: -5483.22, TRX: 9144, CNY: -31856 }, wage: { USDT: 1850.59, TRX: 6172.2, CNY: 10751.4 },
  },
  {
    id: '291', username: 'evanmm88', parentMember: 'orbit288 / 288', status: '启用',
    teamSize: 11, newRegistrations: 4, directCount: 3, activeCount: 7, rechargeUsers: 3,
    turnover: { USDT: 18620.5, TRX: 58400, CNY: 107900 }, recharge: { USDT: 5100, TRX: 16200, CNY: 26300 },
    profitLoss: { USDT: -1173.09, TRX: -3504, CNY: -7553 }, wage: { USDT: 502.75, TRX: 1576.8, CNY: 2913.3 },
  },
  {
    id: '301', username: 'test301', parentMember: 'orbit288 / 288', status: '停用',
    teamSize: 1, newRegistrations: 0, directCount: 0, activeCount: 0, rechargeUsers: 0,
    turnover: { USDT: 0, TRX: 0, CNY: 0 }, recharge: { USDT: 0, TRX: 0, CNY: 0 },
    profitLoss: { USDT: 0, TRX: 0, CNY: 0 }, wage: { USDT: 0, TRX: 0, CNY: 0 },
  },
]

export const pageConfigs = {
  '/version-notes': page('版本说明', { type: 'version-notes' }),
  '/workbench': page('工作台', { type: 'dashboard' }),
  '/risk/game-profit-loss': page('游戏盈亏风控设置', { type: 'game-risk-control' }),

  '/member/wage-report': page('会员工资报表', {
    count: 3584,
    filters: [f('受益用户名', '模糊查询'), f('受益会员ID', '精确查询'), s('工资类型', '全部'), s('币种', '全部'), s('结算状态', '全部'), d('结算时间'), f('投注订单号', '精确查询')],
    actions: ['更多筛选', '导出', '下载文件'],
    columns: ['记录ID', '受益会员', '工资类型', '币种', '有效流水', '基准比例', '比较比例', '实际工资比例', '工资金额', '投注会员', '下级来源会员', '投注订单号', '游戏', '玩法 / 选项', '结算状态', '钱包流水号', '创建时间', '结算时间'],
    rows: [
      ['4681', 'evan777\nID：133', '用户实时工资', 'USDT', '111', '0', '0', '0', '0 USDT', 'evan777', 'evan777', 'LT20260825130915133421965', 'lottery', '-', '已发放', '-', '2026-08-25 13:10:00', '2026-08-25 13:10:00'],
      ['4679', 'evan777\nID：133', '用户实时工资', 'USDT', '100', '0.027', '0', '0.027', '2.7 USDT', 'evan777', 'evan777', 'HB2026082500591413305378668', 'hash', 'ws_ds / ws_shuang', '已发放', 'UC2026082501000212653330', '2026-08-25 01:00:02', '2026-08-25 01:00:02'],
    ],
  }),
  '/member/wallet': page('会员钱包列表', {
    count: 180,
    note: '展示每位会员的链上充值钱包。余额列显示最近一次刷新的缓存值；可刷新本页余额或对单个钱包手动触发归集。',
    filters: [f('关键词', '按会员ID / 钱包地址搜索'), s('状态', '全部状态')],
    actions: ['刷新本页余额'], rowActions: ['复制', '触发归集'],
    columns: ['会员ID', '钱包地址', 'USDT 余额', 'TRX 余额', '余额更新时间', '链', '状态', '创建时间', '操作'],
    rows: [
      ['292', 'TE8hwLnreraPFwPxQgYSMArqgzB8pSsGNi', '--', '--', '从未刷新', 'TRON', '正常', '2026-08-20 18:59:09'],
      ['290', 'TQmFRrzGToRbg92MUHr7jv6MEgkCt2zv8E', '0', '0', '2026-08-20 17:09:17', 'TRON', '正常', '2026-08-20 09:40:23'],
    ],
  }),
  '/member/tag': page('会员标签', {
    count: 1, filters: [f('标签名称', '请输入标签名称'), s('状态', '请选择状态')], actions: ['新增标签'], rowActions: CRUD,
    columns: ['ID', '标签名称', '状态', '排序', '备注', '更新时间', '操作'],
    rows: [['1', '黑名单', '启用', '0', '1', '2026-03-24 21:00:23']],
    footerNote: '标签状态变更后立即对会员筛选生效',
  }),
  '/member/list': page('会员列表', {
    type: 'member-list', count: 155,
    filters: [f('关键词', '账号 / 姓名 / 邮箱 / 手机号'), f('会员账号', '请输入会员账号'), f('真实姓名', '请输入真实姓名'), s('账号状态', '请选择状态'), d('注册时间')],
    actions: ['展开筛选', '新增会员', '标签管理', '批量添加标签', '批量取消标签', '批量禁用', '批量启用'], rowActions: ['详情', '编辑', '重置密码'],
    columns: ['ID', '会员信息', '联系方式', '会员标签', '账户信息', '代理信息', '注册/登录', '状态', '操作'],
  }),

  '/blockchain/collection-record': page('归集记录', {
    count: 2466, note: '只读列表，展示归集（定时/事件/手动触发）的每一笔转出记录及其链上确认状态。',
    filters: [f('来源地址', '按来源地址模糊搜索'), f('目的地址', '按目的地址模糊搜索'), s('币种', '全部币种'), s('链', '全部链'), s('状态', '全部状态'), d('创建时间')], rowActions: ['复制'],
    columns: ['ID', '链', '币种', '来源地址', '目的地址', '金额', '手续费', '状态', '触发方式', '记录类型', '交易哈希', '失败原因', '重试次数', '创建时间', '更新时间'],
    rows: [['2466', 'TRON', 'TRX', 'TQMmqbDSXdA3bbDmZvKSRXmDSVxoFoAWFX', 'TXCGJPhRwA6PLKNDWZum2qdc5i7JY2t5iY', '46', '0', '已确认', '充值事件', '归集转账', 'b45aa100...8c57', '-', '0', '2026-08-22 13:19:07', '2026-08-22 13:20:10']],
  }),
  '/blockchain/energy-config': page('能量租赁', {
    count: 0, note: '用于配置能量租赁三方。归集/提现广播 USDT 前按优先级尝试租入能量，减少 TRX 燃烧。', actions: ['新增配置'], rowActions: CRUD,
    columns: ['ID', '三方名称', '三方编码', '接口地址', '租赁范围', '单笔预估能量', '优先级', '状态', '备注', '操作'],
  }),
  '/blockchain/energy-order': page('能量租赁记录', {
    count: 0, note: '只读列表，记录每一次向三方发起的能量租赁及最终状态，用于账单对账。',
    filters: [f('钱包地址', '按收能量的钱包地址模糊搜索'), f('三方编码', '如 catfee'), s('状态', '全部状态'), d('创建时间')],
    columns: ['ID', '三方编码', '三方订单号', '钱包地址', '能量数量', '状态', '失败原因', '配置ID', '创建时间', '更新时间'],
  }),
  '/blockchain/collection-config': page('归集配置', {
    count: 1, filters: [s('网络', '全部网络')], actions: ['新增配置'], rowActions: ['编辑'],
    columns: ['ID', '链', '资产', '钱包类型', '归集阈值', '保留余额', '归集目的地', '状态', '备注', '操作'],
    rows: [['1', 'TRON', 'TRX', '用户钱包', '10', '4', '热钱包 staging-kms-出款', '启用', '冷钱包归归归TRX']],
  }),
  '/blockchain/scan-cursor': page('扫链游标', {
    warning: '重置游标会导致 bc-server 从指定区块重新扫描，可能产生重复事件。仅在初始化或数据修复时使用。', actions: ['刷新'], rowActions: ['重置区块'],
    columns: ['ID', '链', '资产', '扫描类型', '当前区块', '状态', '最后错误', '更新时间', '操作'],
    rows: [['2', 'TRON', 'TRX', 'deposit', '70372833', '正常', '-', '2026/8/25 13:23:58'], ['5', 'TRON', 'TRX', 'fastlane', '70372869', '正常', '-', '2026/8/25 13:24:00'], ['1', 'TRON', 'USDT', 'deposit', '70372833', '正常', '-', '2026/8/25 13:24:00']],
  }),
  '/blockchain/api-key': page('波场API配置', {
    note: '管理 Trongrid API Key 池。服务按分组和优先级自动轮询，禁用后将在下一次池刷新时生效。', actions: ['新增 API Key'], rowActions: ['编辑'],
    columns: ['ID', '标签', '分组', '优先级', '每日上限', '今日用量', '总调用', '总成功', '冷却到期', '状态', '备注'],
    rows: [['1', 'trongrid-key-1', 'ALL', '100', '不限', '9918', '9918', '9917', '-', '停用', 'Primary Trongrid key'], ['2', 'trongrid-scan-key', 'SCAN', '50', '5000', '0%', '0', '0', '-', '停用', 'staging rotation']],
  }),
  '/blockchain/cold-wallet': page('冷钱包管理', {
    count: 3, filters: [s('网络', '全部网络')], actions: ['添加冷钱包'],
    columns: ['ID', '标签', '链', '资产', '地址', '状态', '备注', '创建时间'],
    rows: [['1', 'b-cold', 'TRON', 'USDT', 'TUJf5xPxfxKA1zTDqidj2BPFfA272DBHx2', '启用', '我自己的冷钱包', '2026/7/1 10:46:17'], ['2', 'trx-冷钱包', 'TRON', 'TRX', 'TUJf5xPxfxKA1zTDqidj2BPFfA272DBHx2', '启用', '-', '2026/7/6 17:07:01'], ['3', '测试', 'TRON', 'USDT', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', '停用', '-', '2026/7/12 01:26:24']],
  }),
  '/blockchain/hot-wallet': page('热钱包管理', {
    count: 4, filters: [s('网络', '全部网络')], actions: ['新增热钱包', '导入热钱包', '余额告警设置'], rowActions: ['刷新余额', '清退转出'],
    columns: ['ID', '标签', '链', '地址', 'USDT余额', 'TRX余额', '排序', '状态', '备注', '操作'],
    rows: [['4', 'staging-kms-出款', 'TRON', 'TXCGJPhRwA6PLKNDWZum2qdc5i7JY2t5iY', '882', '1021.64116', '0', '启用', '-'], ['1', 'testOutWallet', 'TRON', 'TBRjxZnSGdYyVhGkqPbJ8yodhDkyKa6HeV', '100', '45.877', '1', '停用', '-']],
  }),
  '/blockchain/status': page('运行状态', { type: 'status', actions: ['刷新'] }),

  '/agent/profile': page('代理资料', {
    count: 1, filters: [f('关键词', '代理编码 / 推广链接'), s('代理状态'), s('佣金模式')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '会员ID', '代理编码', '佣金模式', '佣金比例', '结算周期', '状态', '操作'], rows: [['9', '133', '1', '比例', '0.027', '1', '启用']],
  }),
  '/agent/team-analysis': page('团队分析表', { type: 'team-analysis', count: teamAnalysisRows.length }),
  '/agent/invite-link': page('邀请链接', {
    count: 21, kicker: '只读回查', subtitle: '回查用户创建的开户链接和默认方案，确认注册入口是否按配置生效。',
    filters: [f('关键词', '代理线编码 / 名称 / 用户ID'), s('开户类型', '请选择开户类型'), s('状态', '请选择状态')], rowActions: ['查看'],
    columns: ['ID', '用户ID', '代理线编码', '链接名称', '开户类型', '已注册', '注册上限', '状态', '创建时间', '操作'],
    rows: [['47', '185', 'CGSUHSY4', '普通邀请链接', '普通会员', '1', '0', '启用', '2026-08-20 18:48:22'], ['46', '133', 'QANGFB2K', '普通邀请链接', '普通会员', '0', '0', '启用', '2026-08-20 14:39:47']],
  }),
  '/agent/income': page('推广收益明细', {
    count: 3584, kicker: '只读回查', subtitle: '按投注订单回查用户返水、返水差额和赔率差额收益，辅助核对入账结果。',
    filters: [f('关键词', '订单号 / 用户ID / 流水号'), s('收益类型', '请选择收益类型'), s('游戏类型', '请选择游戏类型'), s('入账状态', '请选择入账状态')], rowActions: ['查看'],
    columns: ['ID', '投注订单', '投注用户', '受益用户', '来源用户', '收益类型', '游戏类型', '有效流水', '基准比例', '比较比例', '收益金额', '入账状态', '创建时间', '入账时间', '操作'],
    rows: [['4681', 'LT20260825130915133421965', '133', '133', '133', '用户实时工资', '彩票', '111', '0', '0', '0', '已入账', '2026-08-25 13:10:00', '2026-08-25 13:10:00']],
  }),
  '/agent/user-default-scheme': page('默认赔率返水方案', {
    count: 1, filters: [f('关键词', '方案名称 / 备注'), s('默认'), s('状态')], actions: ['新增默认方案'], rowActions: ['编辑'],
    columns: ['ID', '方案名称', '彩票赔率', '彩票实时', '电子', '真人', '体育', '捕鱼', '竞技', '默认', '状态', '更新时间', '操作'],
    rows: [['1', '默认赔率方案', '1940', '0.027', '0', '0', '0', '0', '0', '是', '启用', '1779855060']],
  }),
  '/agent/setting': page('推广设置', { type: 'promotion-settings' }),

  '/operate/home-group': page('首页分组配置', {
    count: 3, filters: [f('关键词', '分组编码 / 分组名称'), s('场景', '请选择场景'), s('状态', '请选择状态')], actions: ['新增'], rowActions: ['数据来源', '编辑', '删除'],
    columns: ['ID', '分组编码', '分组名称', '场景', '适用终端', '数据来源', '样式', '状态', '排序', '备注', '操作'],
    rows: [['2', 'hash_game', '哈希游戏', '首页', 'h5', '手动配置', '默认样式', '启用', '2', '-'], ['3', 'hash_lottery', '区块彩票', '首页', 'h5', '手动配置', '默认样式', '启用', '1', '-'], ['1', 'hot_game', '热门游戏', '首页', 'h5', '手动配置', '默认样式', '启用', '0', '11']],
  }),
  '/operate/app-version': page('App版本管理', {
    count: 0, type: 'intro-table', subtitle: '构建号决定版本新旧；发布错误时可撤回，已经安装的用户仍需用更高构建号修复。', actions: ['新建版本'], filters: [s('平台'), s('状态')],
    columns: ['平台', '版本', '更新策略', '更新说明', '状态', '发布时间', '操作'],
  }),
  '/operate/advertisement': page('广告管理', {
    count: 3, filters: [f('关键词', '标题 / 副标题'), s('场景', '请选择场景'), s('状态', '请选择状态')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '标题', '场景', '图片', '跳转类型', '状态', '排序', '备注', '操作'], rows: [['3', '测试222', '首页', '-', '外链', '启用', '0', '-'], ['2', '测试一下', '首页', '-', '外链', '启用', '0', '-'], ['1', '测试', '首页', '-', '站内', '启用', '0', '-']],
  }),
  '/operate/activity': page('活动管理', {
    filters: [f('关键词', '标题'), s('活动类型'), s('状态')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '标题', '活动类型', '时效', '开始时间', '结束时间', '状态', '排序', '操作'],
  }),
  '/operate/activity-type': page('活动类型', {
    count: 3, filters: [f('关键词', '类型编码 / 类型名称'), s('奖励模式'), s('状态')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '类型编码', '类型名称', '奖励模式', '领取方式', '发放方式', '状态', '排序', '操作'],
    rows: [['3', 'weekly_trx_rank', '周榜TRX流水榜', '自动', '用户领取', '自动发放', '启用', '0'], ['2', 'win_streak', '连赢活动', '自动', '系统触发', '自动发放', '启用', '0'], ['1', 'first_recharge', '首充活动', '自动', '系统触发', '自动发放', '启用', '0']],
  }),
  '/operate/announcement': page('公告管理', {
    count: 1, filters: [f('关键词', '标题 / 摘要'), s('发布状态'), s('置顶')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '标题', '摘要', '置顶', '发布状态', '排序', '操作'], rows: [['1', '测试一下', '测试一下', '是', '已发布', '0']],
  }),

  '/game/line': page('游戏线路', {
    count: 1, filters: [f('关键词', '线路编码 / 线路名称 / 商户账号'), s('线路类型', '请选择类型'), s('钱包模式', '请选择钱包模式'), s('状态', '请选择状态')], actions: ['新增线路'], rowActions: CRUD,
    columns: ['ID', '线路编码', '线路名称', '线路类型', '钱包模式', '商户账号', '接口地址', '状态', '更新时间', '操作'], rows: [['1', 'zy', '自营游戏', '自营', '免转钱包', '11', '111', '启用', '2026-04-28 11:41:46']],
  }),
  '/game/factory': page('游戏厂商', {
    count: 2, filters: [s('线路', '请选择线路'), f('关键词', '厂商编码 / 厂商名称'), s('状态', '请选择状态')], actions: ['新增厂商'], rowActions: CRUD,
    columns: ['ID', '线路', '厂商编码', '厂商名称', '子平台', '钱包代码', '状态', '更新时间', '操作'], rows: [['4', '自营游戏', 'hash_cp', '区块彩票', '-', '-', '启用', '2026-04-28 11:44:21'], ['3', '自营游戏', 'hash_game', '哈希游戏', '-', '-', '启用', '2026-04-28 11:44:00']],
  }),
  '/game/transfer-payout': page('转账派奖单', {
    count: 8, filters: [f('关键词', '派奖单号 / 投注订单号 / 收款地址'), f('游戏ID'), s('状态', '请选择状态')], rowActions: DETAIL,
    columns: ['ID', '派奖单号', '投注订单号', '游戏ID', '收款地址', '派奖金额', '交易哈希', '状态', '重试次数', '创建时间', '操作'], rows: [['25', 'GTP2026082414083605948927', 'GTB2026082414083585763540', '8', 'TDZpNX6xTJ6DKnG2PPiyjxste6EbGMP1bS', '97', '77be378d...bf625', '已确认成功', '0', '2026-08-24 14:08:36']],
  }),
  '/game/transfer-bet': page('转账投注记录', {
    count: 16, filters: [f('关键词', '交易哈希 / 订单号 / 地址'), s('币种', '全部'), s('游戏', '全部游戏'), s('事件状态', '全部'), s('派奖状态', '全部'), d('投注时间')], actions: ['更多筛选', '异步导出', '下载文件'], rowActions: ['复制', '详情'],
    columns: ['ID', '币种', '游戏', '用户', '投注订单号', '交易哈希', '来源地址', '玩法 / 投注项', '期号', '转账金额', '投注金额', '有效投注', '确认出款', '平台输赢', '事件状态', '派奖状态', '投注时间', '操作'],
    rows: [['56', 'usdt', '6秒哈希', 'evan777（133）', 'GTB2026082414083585763540', '44e6bc9e...513500', 'TDZpNX6x...GMP1bS', 'ws_dashuang / 双', '202608240101014', '50', '50', '50', '97', '-47', '已结算', '确认成功', '2026-08-24 14:08:35']],
  }),
  '/game/transfer-address': page('转账投注地址', {
    count: 6, filters: [f('关键词', '收款地址 / 备注'), f('游戏ID'), s('规则类型', '请选择规则类型'), s('状态', '请选择状态')], rowActions: ['复制', '删除'],
    columns: ['ID', '游戏ID', '规则类型', '收款地址', '资产', '监控状态', '状态', '备注', '创建时间', '操作'], rows: [['14', '14', '大小', 'TKksYLu9soviyuvdPtcgkgdPe19orP9XsF', 'all', '未同步', '启用', '-', '2026-08-04 16:36:56'], ['13', '14', '单双', 'TFN56WhwGU7gdieJ3MArh9865x5G8SJ2rJ', 'all', '未同步', '启用', '-', '2026-08-04 16:36:55']],
  }),
  '/game/platform-scheme': page('平台赔率与结算方案', { type: 'scheme' }),
  '/game/hash/bet': page('哈希游戏投注记录', {
    count: 3103, filters: [f('游戏名称', '请输入游戏名称'), f('期号', '请输入期号'), f('订单号', '请输入订单号'), f('用户名', '请输入用户名'), s('状态'), s('币种', '全部'), d('下单时间')], actions: ['返回', '异步导出', '下载文件'], rowActions: DETAIL,
    columns: ['ID', '订单号', '用户ID', '用户名', '游戏名称', '期号', '区块高度', '币种', '投注总额', '有效投注', '有效流水', '派彩金额', '净盈亏', '状态', '下单时间', '操作'], rows: [['4221', 'HB2026082500591413305378668', '133', 'evan777', '尾数单双', '202608240515026', '70358027', 'USDT', '100', '100', '100', '194', '94', '已中奖', '2026-08-25 00:59:14'], ['4220', 'HB2026082500582113349743044', '133', 'evan777', '尾数单双', '202608240515007', '70358008', 'USDT', '100', '100', '0', '0', '0', '已退回', '2026-08-25 00:58:21']],
  }),
  '/game/base': page('自营游戏配置', {
    count: 14, wideActions: true, filters: [s('线路', '请选择线路'), s('厂商', '请选择厂商'), f('关键词', '游戏编码 / 游戏名称'), s('游戏类型', '请选择类型'), s('来源', '请选择来源'), s('状态', '请选择状态'), s('热门', '请选择热门状态'), s('推荐', '请选择推荐状态')], actions: ['新增游戏'], rowActions: ['盘口配置', '游戏限红', '投注记录', '编辑', '删除'],
    columns: ['ID', '游戏信息', '线路 / 厂商', '类型', '热门', '推荐', '排序', '状态', '更新时间', '操作'], rows: [['5', '1分彩单双\n编码：hash_1fcds\n来源：自营', '自营游戏 / 哈希游戏', '哈希游戏', '是', '否', '0', '启用', '2026-07-19 22:52:07'], ['2', '尾数单双\n编码：hash_wsds\n来源：自营', '自营游戏 / 哈希游戏', '哈希游戏', '是', '否', '0', '启用', '2026-07-08 14:16:56']],
  }),

  '/finance/turnover-requirement': page('流水要求', {
    count: 75, kicker: '只读回查', subtitle: '查询用户因红包等权益产生的提现流水限制和完成进度。', filters: [f('关键词', '来源单号 / 流水号 / Trace'), f('用户ID', '精确匹配用户ID'), f('用户账号', '按用户账号搜索'), s('币种', '请选择币种'), s('来源', '请选择来源'), s('状态', '请选择状态')], rowActions: ['查看'],
    columns: ['ID', '用户账号', '用户ID', '币种', '来源', '奖励金额', '倍数', '要求流水', '已完成流水', '状态', '创建时间', '操作'], rows: [['94', 'testB002', '154', 'USDT', '充值', '600', '1', '600', '0', '未完成', '2026-08-25 05:58:33'], ['89', 'allen2', '142', 'CNY', '充值', '100', '1', '100', '100', '已完成', '2026-08-22 16:23:42']],
  }),
  '/finance/red-packet-quota': page('红包领取次数', {
    kicker: '只读回查', subtitle: '查询用户红包领取次数余额与已用次数；调整请使用后台次数调整接口。', filters: [f('关键词', '用户ID'), s('状态', '请选择状态')], rowActions: ['查看'],
    columns: ['ID', '用户ID', '可用次数', '已用次数', '状态', '更新时间', '操作'],
  }),
  '/finance/red-packet-receive': page('红包领取记录', {
    count: 9, kicker: '只读回查', subtitle: '查询每笔红包领取明细、入账流水、次数扣减和关联流水要求。', filters: [f('关键词', '红包单号 / 领取编号 / 流水号 / 用户ID'), s('币种'), s('领取方式'), s('状态')], rowActions: ['查看'],
    columns: ['ID', '红包单号', '领取用户', '发放用户', '币种', '领取金额', '次数变动', '流水倍数', '领取时间', 'Trace ID', '操作'], rows: [['19', 'RP20260717000928413941', '153', '134', 'USDT', '2', '0', '1', '2026-07-17 00:10:05', 'trace-red-packet-receive-1784218205']],
  }),
  '/finance/red-packet': page('红包发放记录', {
    count: 29, kicker: '只读回查', subtitle: '查询红包发放主单、扣款流水、领取进度、退款状态和 trace_id。', filters: [f('关键词', '红包单号 / 领取编号 / 流水号 / 用户ID'), s('币种'), s('模式'), s('领取方式'), s('状态')], rowActions: ['查看'],
    columns: ['ID', '红包单号', '领取编号', '发放用户', '币种', '模式', '总金额', '已领金额', '已领个数', '状态', '过期时间', '创建时间', '操作'], rows: [['44', 'RP20260820134456542028', 'red1787204698515_133_519822', '133', 'CNY', '拼手气', '11', '0', '0', '已退款', '2026-08-20 23:44:53', '2026-08-20 13:44:56']],
  }),
  '/finance/settlement-service-fee': page('结算服务费', {
    type: 'metric-table', subtitle: '仅后台可见。每条记录对应一笔中奖订单，服务费为展示派奖与实际结算派奖的封顶后差额。', filters: [f('订单 / 用户', '投注订单号或用户 ID'), f('游戏 ID'), s('币种')], rowActions: ['详情'],
    columns: ['投注订单', '用户 ID', '游戏 ID', '方案版本', '投注金额', '展示赔率', '服务费点数', '结算赔率', '展示派奖', '实际派奖', '服务费', '操作'], rows: [['HB2026082500591413305378668', '133', '2', '#2', '100.000000', '1.940', '0', '1.940', '194.000000', '194.000000', '0.000000'], ['GTB2026082414083585763540', '133', '8', '#2', '50.000000', '1.940', '0', '1.940', '97.000000', '97.000000', '0.000000']],
  }),
  '/finance/currency-exchange-record': page('兑换记录', {
    filters: [f('兑换订单号', '精确查询订单号'), f('用户账户名', '模糊查询'), f('用户ID', '精确查询'), s('资金类型', '全部'), s('持有货币', '全部'), s('转换货币', '全部'), d('转换时间')], actions: ['更多筛选', '导出', '下载文件'],
    columns: ['兑换订单号', '用户ID', '用户账户名', '资金类型', '持有货币', '持有金额', '转换货币', '转换金额', '真实汇率', '用户汇率', '盈利比例', '盈利金额', '转换时间'],
  }),
  '/finance/fixed-wallet': page('固率钱包', { type: 'fixed-wallet' }),
  '/finance/currency-exchange': page('货币兑换', {
    count: 8, filters: [s('资金类型', '全部'), s('兑换方向', '全部'), s('状态', '全部')], actions: ['立即同步'], rowActions: ['编辑'],
    columns: ['资金类型', '兑换方向', '真实汇率', '盈利比例', '用户汇率', '最小金额', '最大金额', '状态', '同步时间', '最近错误', '操作'], rows: [['余额', 'USDT → TRX', '2.90909090909', '0.1%', '2.90618181818', '1', '100', '启用', '2026-08-25 13:00:00', '-'], ['余额', 'USDT → CNY', '6.72', '0%', '6.72', '0', '0', '启用', '2026-08-25 13:00:00', '-'], ['佣金', 'CNY → USDT', '0.148809523809', '0%', '0.148809523809', '0', '0', '启用', '2026-08-25 13:00:00', '-']],
  }),
  '/finance/fund-pool-address': page('资金池地址', {
    count: 8, filters: [f('关键词', '名称 / 地址 / 备注'), s('类型', '全部'), s('状态', '全部')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '名称', '类型', 'TRX地址', 'USDT余额', 'TRX余额', '累计派彩', '状态', '排序', '备注', '更新时间', '操作'], rows: [['8', 'qtdz3', '其他地址', 'TA7kGFG11Rxbs6xf9feEEk34MziTtzNDfa', '0', '0', '12313', '启用', '0', '-', '2026-05-13 21:38:17'], ['4', 'pcdz', '派彩地址', 'TV1sDKejowhLrUEkEBccVGqNs96txfXoqT', '0', '0', '231932', '启用', '0', '-', '2026-06-26 16:28:30']],
  }),
  '/finance/user-change': page('用户账变记录', {
    count: 8435, kicker: '只读回查', subtitle: '查看用户余额与冻结额变动流水，保留业务单号和 trace_id 追踪。', filters: [f('用户账号', '输入部分用户账号'), f('用户ID', '输入完整用户ID'), f('流水号', '输入完整流水号'), f('业务单号', '输入完整业务单号'), s('钱包类型', '请选择钱包类型'), s('资产', '请选择资产'), s('业务类型', '请选择业务类型'), s('方向', '请选择方向'), f('Trace ID', '输入完整 Trace ID'), d('创建时间')], actions: ['导出', '下载文件'], rowActions: ['查看'],
    columns: ['ID', '用户账号', '用户ID', '流水号', '钱包类型', '资产', '业务类型', '业务单号', '方向', '变动金额', '变动后余额', '冻结变动额', 'Trace ID', '创建时间', '操作'], rows: [['21108', 'evan777', '133', 'UC2026082513093311084944', '普通余额（USDT）', 'USDT', '结算', 'LT20260825130915133421965', '增加', '107.115', '12883.888643', '0', '-', '2026-08-25 13:09:33']],
  }),
  '/finance/finance-data': page('财务数据表', { type: 'finance-report' }),
  '/finance/withdraw-order': page('提现订单管理', {
    count: 17, kicker: '只读回查', subtitle: '查看会员提现申请、审核与出款信息。演示原型保留审核、同步与人工处理反馈。', filters: [f('关键词', '订单号 / 三方单号'), f('用户账号', '按用户账号搜索'), s('状态', '请选择状态'), s('三方状态', '请选择三方状态'), s('审核状态', '请选择审核状态'), s('资金来源', '请选择资金来源'), s('币种', '请选择币种'), f('方式类型', '请输入方式类型')], actions: ['导出', '下载文件'], rowActions: ['查看', '审核通过', '驳回', '同步三方'],
    columns: ['用户账号', 'ID', '订单号', '三方订单号', '用户ID', '渠道ID', '资产', '资金来源', '申请金额', '手续费', '实到金额', '提现状态', '审核状态', '三方状态', '审核时间', '创建时间', '审核账号', '操作'], rows: [['allen2', '9790', 'WD2026082312204304495522', '-', '142', '0', 'CNY', '普通余额', '201.00', '0.00', '201.00', '提现中', '待审核', '未提交', '-', '2026-08-23 12:20:43', '-'], ['ceshi0001', '9787', 'WD2026082311474267943544', 'DF202608231148211580439', '183', '9502', 'USDT', '普通余额', '23', '1', '22', '提现中', '审核通过', '三方失败', '2026-08-23 11:48:06', '2026-08-22 15:43:47', 'admin']],
  }),
  '/finance/market-data': page('市场数据表', { type: 'market-report' }),
  '/finance/recharge-order': page('充值订单管理', {
    count: 29, kicker: '只读回查', subtitle: '查看会员充值订单状态、金额和回调结果。', filters: [f('订单号', '输入完整订单号'), f('三方订单号', '输入完整三方订单号'), f('用户名', '输入部分用户名'), f('用户ID', '输入完整用户ID'), f('渠道编码', '输入完整渠道编码'), f('商户编码', '输入完整商户编码'), s('资产', '请选择资产'), s('支付模式', '请选择支付模式'), s('状态', '请选择状态'), d('创建时间')], actions: ['导出', '下载文件'], rowActions: ['查看', '同步三方'],
    columns: ['ID', '用户名', '用户ID', '订单号', '三方订单号', '渠道编码', '商户编码', '商户名', '资产', '支付模式', '充值金额', '到账金额', '奖励金额', '状态', '回调时间', '支付时间', '创建时间', '操作'], rows: [['9734', 'testB002', '154', 'R20260825055832350398501273870336', '0208e30b...039a4', 'auto_chain', '-', '商户不存在（0）', 'usdt', '本地', '600', '600', '0', '充值成功', '2026-08-25 05:58:32', '2026-08-25 05:58:32', '2026-08-25 05:58:32']],
  }),
  '/finance/game-wallet': page('游戏钱包地址列表', {
    count: 6, note: '展示每个游戏的转账投注收款地址。可批量刷新余额，或手动触发归集。', filters: [s('游戏', '全部游戏'), s('玩法规则', '全部规则'), s('状态', '全部状态'), f('关键词', '按游戏ID / 钱包地址搜索')], actions: ['刷新本页余额'], rowActions: ['复制', '触发归集'],
    columns: ['游戏', '玩法规则', '收款地址', 'USDT 余额', 'TRX 余额', '余额更新时间', '状态', '创建时间', '操作'], rows: [['30秒哈希 ID 14', '大小', 'TKksYLu9soviyuvdPtcgkgdPe19orP9XsF', '0', '0', '2026-08-17 22:01:07', '正常', '2026-08-04 16:36:56'], ['6秒哈希 ID 8', '单双', 'TVVMjhMnvTrNbVvXBX1N9Bc3P7jirvKx4Y', '0', '62', '2026-08-17 22:01:07', '正常', '2026-07-30 00:24:40']],
  }),
  '/finance/bank': page('银行列表', {
    count: 288, kicker: '支持增删改查', subtitle: '维护银行基础档案和图标，用于银行卡相关收付配置。', filters: [f('关键词', '银行编码 / 银行名称 / 简称'), s('状态', '请选择状态')], actions: ['新增银行'], rowActions: CRUD,
    columns: ['ID', '银行编码', '银行名称', '简称', '国家编码', '图标', '状态', '排序', '更新时间', '操作'], rows: [['9303', 'ICBC', '工商银行', '-', 'CN', '-', '启用', '1000', '-'], ['9304', 'CCB', '建设银行', '-', 'CN', '-', '启用', '990', '-'], ['9302', 'ABC', '中国农业银行', '农行', 'CN', '-', '启用', '980', '2026-03-25 09:00:00']],
  }),
  '/finance/withdraw-channel': page('提现渠道', {
    count: 6, kicker: '支持增删改查', subtitle: '维护各提现类型下的提现方式、手续费与限额策略。', filters: [f('关键词', '方式编码 / 方式名称'), f('资产代码', 'cny / usdt / trx'), s('网络代码'), s('收款方式'), s('状态')], actions: ['新增提现方式'], rowActions: CRUD,
    columns: ['ID', '方式编码', '方式名称', '提现类型', '支付商户', '资产代码', '网络代码', '收款方式', '最低提现', '最高提现', '状态', '排序', '操作'], rows: [['9513', '666', '备付金-银行卡', '9201', '9009', 'cny', '银行卡', '银行卡', '200', '20000', '启用', '80'], ['9502', 'USDT_TRC20_WITHDRAW', 'USDT提现主通道', '9202', '9003', 'usdt', 'TRC20', 'USDT', '20', '10000', '启用', '80']],
  }),
  '/finance/withdraw-type': page('提现类型', {
    count: 4, kicker: '支持增删改查', subtitle: '维护提现币种类型主数据，提现方式在子级配置。', filters: [f('关键词', '类型编码 / 类型名称'), s('状态')], actions: ['新增提现类型'], rowActions: CRUD,
    columns: ['ID', '类型编码', '类型名称', '币种', '图标', '状态', '排序', '更新时间', '操作'], rows: [['9201', 'bank_withdraw', '银行卡提现', 'CNY', '-', '启用', '90', '2026-03-25 09:00:00'], ['9202', 'usdt_withdraw', 'USDT链上提现', 'USDT', '-', '启用', '80', '2026-03-25 09:00:00']],
  }),
  '/finance/recharge-channel': page('充值渠道', {
    count: 9, kicker: '支持增删改查', subtitle: '维护充值通道、限额、费率和支付模式，作为充值单的上游入口。', filters: [f('关键词', '通道编码 / wayCode / 通道名称 / 资产'), s('支付模式'), s('状态')], actions: ['新增充值渠道'], rowActions: CRUD,
    columns: ['ID', '通道编码 / wayCode', '通道名称', '展示名称', '充值类型', '支付商户', '资产代码', '支付模式', '热门', '最小充值', '最大充值', '奖励模式', '奖励值', '状态', '排序', '操作'], rows: [['9411', 'WECHAT', 'HiPay WeChat Pay', 'HiPay WeChat', '9106', '9005', 'CNY', '三方', '否', '100', '10000', '固定值', '0', '启用', '22'], ['9408', 'USDT', 'USDT', 'USDT', '9104', '9003', 'USDT', '本地', '否', '10', '1000', '固定值', '0', '启用', '1']],
  }),
  '/finance/recharge-type': page('充值类型', {
    count: 3, filters: [f('关键词', '类型编码 / 类型名称'), s('状态'), s('充值模式')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '类型编码', '类型名称', '图标', '充值模式', '状态', '排序', '操作'], rows: [['9106', 'CNY', 'CNY', '-', '三方充值', '启用', '3'], ['9105', 'TRX', 'TRX', '-', '本地充值', '启用', '2'], ['9104', 'USDT', 'USDT', '-', '本地充值', '启用', '1']],
  }),
  '/finance/payment-merchant': page('支付商户', {
    count: 8, filters: [f('关键词', '商户代码 / 商户名称'), s('状态', '请选择状态')], actions: ['新增'], rowActions: ['查询余额', '编辑', '删除'],
    columns: ['ID', '商户代码', '商户名称', '平台', '代收URL', '代付URL', '状态', '排序', '备注', '操作'], rows: [['9005', 'HIPAY_CNY_MAIN', 'HiPay CNY Main', 'HIPAY', 'https://gopay.hihipay.net/hipay_load/gateway/Pay_Index.html', 'https://gopay.hihipay.net/hipay_withdraw/gateway/withdraw', '启用', '20', 'HiPay CNY merchant'], ['9004', 'XMFPAY_CNY_MAIN', 'XMFPay CNY主通道', 'XMFPay', 'https://api.xmfpay.xyz/api/pay/order', '-', '启用', '10', 'XMFPay CNY充值商户']],
  }),

  '/permission/admin': page('管理员', {
    count: 8, filters: [f('管理员账号', '请输入'), f('管理员名称', '请输入'), s('管理员角色')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '头像', '账号', '名称', '角色', '创建时间', '最近登录时间', '最近登录IP', '状态', '操作'], rows: [['8', '头像', 'evan011', 'evan01', 'evan测试', '2026-08-22 18:07:21', '2026-08-22 18:07:39', '47.242.192.4', '启用'], ['7', '头像', 'admin1', 'admin1', '管理员', '2026-08-14 18:25:38', '2026-08-25 13:21:18', '45.196.233.162', '启用'], ['1', '头像', 'admin', 'admin', '系统管理员', '2022-01-16 16:26:39', '2026-08-25 11:08:02', '67.230.170.186', '启用']],
  }),
  '/permission/role': page('角色管理', {
    count: 4, actions: ['新增'], rowActions: ['编辑', '权限设置', '删除'],
    columns: ['ID', '名称', '备注', '排序', '管理员人数', '创建时间', '操作'], rows: [['4', '管理员', '-', '0', '2', '2026-08-14 18:24:31'], ['3', 'evan测试', '-', '0', '5', '2026-05-25 11:51:13'], ['2', '运营', '11', '0', '1', '2026-04-29 07:01:18'], ['1', '审核员', '审核数据', '0', '0', '2022-11-17 18:04:11']],
  }),
  '/permission/menu': page('菜单管理', {
    type: 'tree-table', actions: ['新增', '展开/折叠'], rowActions: ['新增', '编辑', '删除'],
    columns: ['菜单名称', '类型', '图标', '权限标识', '状态', '排序', '更新时间', '操作'],
  }),

  '/lottery/game': page('彩票彩种配置', {
    count: 40, wideActions: true, note: '区块彩票彩种配置。「每期区块数」是排期与期号↔区块映射的权威依据，40 款彩票共用 8 套玩法体系。', filters: [f('彩种名称', '请输入彩种名称'), s('玩法体系', '全部'), s('分类', '全部'), s('状态', '全部')], actions: ['新增彩种'], rowActions: ['编辑', '玩法赔率', '期数限红', '删除'],
    columns: ['ID', '彩种', '分类', '玩法体系', '开奖周期', '链', '抽水率', '页面投注限额', '快捷金额', '排序', '热门', '状态', '操作'], rows: [['1', '哈希一分彩\nhxyfc', '分分彩', '时时彩', '1 分钟 / 20 块', 'tron', '0', 'USDT 0.1 ~ 5000000\nTRX 1 ~ 5000000\nCNY 1 ~ 5000000', '5,10,20,50,100', '1', '热门', '启用'], ['2', '哈希三分彩\nhxsfc', '分分彩', '时时彩', '3 分钟 / 60 块', 'tron', '0', 'USDT 0.1 ~ 5000000\nTRX 1 ~ 5000000', '5,10,20,50,100', '2', '-', '启用']],
  }),
  '/lottery/rule': page('彩票玩法赔率', { type: 'lottery-rule', count: 896 }),
  '/lottery/draw': page('彩票开奖记录', {
    count: 2473, note: '每期的开奖区块与派生号码。「重新派生」用于区块哈希已就位但号码异常时补救；「手动结算」用于结算任务漏跑。', filters: [f('彩种', '请输入彩种名称'), f('期号', '请输入期号'), f('区块号', '请输入区块号'), s('状态', '全部'), d('开奖时间')], rowActions: ['重新派生', '手动结算'],
    columns: ['彩种', '期号', '开奖区块', '区块哈希', '开奖号码', '投注 / 派奖', '盈亏', '状态', '开奖时间', '操作'], rows: [['波场六合彩', '2026082502473', '71222400', '待出块', '-', '投注 0 / 派奖 0', '0', '待开奖', '-'], ['波场六合彩', '2026082402472', '71193600', '待出块', '-', '投注 0 / 派奖 0', '0', '待开奖', '-']],
  }),
  '/lottery/bet': page('彩票注单记录', {
    type: 'lottery-bet', count: 140, filters: [f('彩种', '彩种名称'), f('玩法', '如：前三组三'), f('期号', '期号'), f('订单号', '订单号'), f('用户名', '用户名'), s('状态', '全部'), s('币种', '全部'), s('投注方式', '全部'), s('单挑', '全部'), d('下单时间')], rowActions: ['详情'],
    columns: ['订单号', '用户', '彩种 / 玩法', '期号', '投注内容', '注数 × 单注', '投注额', '结算赔率', '中奖 / 输赢', '状态', '下单时间', '操作'], rows: [['LT20260825130915133421965', '- / ID 133', '哈希一分彩 / 后三组合', '2026082518629', '0,1,2,3,4,5,6,7,8,9 | ...', '1110 × 0.1', '111 USDT', '965 / 档位 1940', '107.115 / -3.885', '已中奖', '2026-08-25 13:09:15'], ['LT20260825130811133357795', '- / ID 133', '哈希一分彩 / 中三直选和值', '2026082518628', '6,7,8', '109 × 1', '109 USDT', '965 / 档位 1940', '0 / -109', '未中奖', '2026-08-25 13:08:11']],
  }),
  '/lottery/chase': page('彩票追号记录', {
    count: 4, note: '用户的追号计划。管理员可在异常情况下终止追号，终止后剩余期次不再下注。', filters: [f('追号单号', '追号单号'), f('用户名', '用户名'), f('彩种', '彩种名称'), s('状态', '全部'), d('创建时间')], rowActions: ['详情', '终止'],
    columns: ['追号单号', '用户', '彩种 / 玩法', '进度', '计划总额', '策略', '状态', '创建时间', '操作'], rows: [['LC20260825012059133203460', '- / ID 133', '哈希一分彩 / 前三直选和值', '20% / 1 / 5 期', '1775 USDT', '中奖停止 / 过期取消', '中奖停止', '2026-08-25 01:20:59'], ['LC20260822110731133301514', '- / ID 133', '哈希一分彩 / 一星定位胆', '25% / 1 / 4 期', '200 CNY', '中奖停止 / 过期取消', '中奖停止', '2026-08-22 11:07:31']],
  }),

  '/setting/data-source': page('数据源配置', {
    count: 3, filters: [f('关键词', '名称 / 编码 / 网关地址 / 接口地址'), s('状态', '请选择状态')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '名称', '编码', 'API Key', '网关地址', '接口地址', '状态', '排序', '备注', '更新时间', '操作'], rows: [['3', 'Tokenview address monitor', '2', 'P21r********IzJm', 'https://services.tokenview.io', '-', '启用', '100', 'Tokenview地址监控充值数据源', '2026-06-13 14:42:28'], ['4', 'CoinGecko汇率源', '3', '********', 'https://api.coingecko.com/api/v3', '/simple/price', '启用', '0', '货币兑换汇率源', '2026-07-06 16:08:34']],
  }),
  '/setting/captcha': page('安全验证', { type: 'captcha-settings' }),
  '/setting/channel/customer-service': page('客服配置', { type: 'service-settings' }),
  '/setting/channel/email': page('邮件配置', { type: 'email-settings' }),
  '/setting/website/withdraw-account': page('提现账户设置', { type: 'blank' }),
  '/setting/website/information': page('网站信息', { type: 'blank' }),
  '/setting/website/protocol': page('政策协议', { type: 'blank' }),
  '/setting/message/short_letter': page('短信设置', {
    type: 'simple-setting-table', columns: ['短信渠道', '状态', '操作'], rowActions: ['设置'], rows: [['阿里云短信', '开启'], ['腾讯云短信', '关闭']],
  }),
  '/setting/user/security-question': page('密保问题', {
    count: 3, filters: [f('关键词', '请输入密保问题'), s('状态', '请选择状态')], actions: ['新增'], rowActions: CRUD,
    columns: ['ID', '密保问题', '状态', '排序', '更新时间', '操作'], rows: [['3', '3.您初中班主任的姓名是？', '启用', '0', '2026-05-20 00:25:43'], ['1', '1.您的学号是多少？', '启用', '0', '2026-05-20 00:26:36'], ['2', '2.您小学班主任的姓名是？', '启用', '1', '2026-05-20 00:26:20']],
  }),
  '/setting/user/setup': page('用户设置', { type: 'user-settings' }),
  '/setting/user/login_register': page('登录注册', { type: 'login-register' }),
  '/setting/storage': page('存储设置', {
    type: 'simple-setting-table', warning: '切换存储方式后，需要将资源文件传输至新的存储端；请勿随意切换存储方式。', columns: ['储存方式', '储存位置', '状态', '操作'], rowActions: ['设置'], rows: [['本地存储', '存储在本地服务器', '关闭'], ['七牛云存储', '存储在七牛云，请前往七牛云开通存储服务', '关闭'], ['阿里云OSS', '存储在阿里云，请前往阿里云开通存储服务', '开启'], ['腾讯云COS', '存储在腾讯云，请前往腾讯云开通存储服务', '关闭']],
  }),
  '/setting/system/journal': page('系统日志', {
    count: 1217, filters: [f('管理员', '请输入'), s('访问方式'), f('来源IP', '请输入'), d('访问时间'), f('访问链接', '请输入')],
    columns: ['记录ID', '操作', '管理员', '访问链接', '访问方式', '来源IP', '错误信息', '执行耗时(毫秒)', '日志时间'], rows: [['1217', '角色列表', 'admin1', '/api/system/role/list', 'GET', '45.202.254.78', '-', '31', '2026-08-25 13:26:29'], ['1216', '保存三方渠道手续费', 'admin', '/api/finance/deposit-withdraw-fee/config/save', 'POST', '67.230.170.186', '-', '334', '2026-08-24 21:40:13']],
  }),
  '/setting/system/login_log': page('登录日志', {
    count: 956, filters: [f('用户名称', '请输入'), s('状态'), d('登录时间')],
    columns: ['用户名称', '登录地址', '浏览器', '操作系统', '状态', '失败原因', '登录时间'], rows: [['evan', '47.242.192.4', 'Chrome', 'Mac OS X', '成功', '-', '2026-08-25 13:27:17'], ['admin1', '45.196.233.162', 'Chrome', 'Mac OS X', '成功', '-', '2026-08-25 13:21:18'], ['admin', '67.230.170.186', 'Chrome', 'Mac OS X', '成功', '-', '2026-08-25 11:08:02']],
  }),
  '/user/setting': page('个人设置', { type: 'personal-settings' }),
}

export const modalSchemas = {
  '/member/tag': { title: '新增标签', fields: ['标签名称', '状态', '排序', '备注'] },
  '/member/list': { title: '新增会员', fields: ['用户名', '登录密码', '哈希实时工资', '比例选择'] },
  '/blockchain/energy-config': { title: '新增能量租赁配置', fields: ['三方编码', '三方名称', '接口地址', 'API Key', 'API Secret', '最小租赁数量', '最大租赁数量', '单笔预估能量', '优先级', '备注'] },
  '/blockchain/collection-config': { title: '新增归集配置', fields: ['网络', '资产', '钱包类型', '归集阈值', '保留余额', '归集目的地', '状态', '备注'] },
  '/blockchain/api-key': { title: '新增 API Key', fields: ['标签', 'API Key', '分组', '优先级', '每日上限', '冷却时间（秒）', '状态', '备注'] },
  '/blockchain/cold-wallet': { title: '添加冷钱包', tip: '冷钱包仅作归集目的地使用，系统不持有私钥，请确保地址准确。', fields: ['标签', '网络', '资产', '地址', '备注'] },
  '/blockchain/hot-wallet': {
    新增热钱包: { title: '新增热钱包', tip: 'KMS 托管热钱包：私钥全程在 KMS 内、永不导出，出款由 KMS 签名。', fields: ['标签', 'KMS KeyId', '网络', '排序', '备注'] },
    导入热钱包: { title: '导入热钱包', tip: '导入仅用于演示操作流程；原型不会上传或保存真实密钥。', fields: ['标签', '网络', '钱包地址', '私钥 / 助记词', 'KMS KeyId', '排序', '备注'] },
    余额告警设置: { title: '余额告警设置', fields: ['告警开关', 'USDT 告警阈值', 'TRX 告警阈值', '告警通知方式', '通知对象', '检查间隔（分钟）', '备注'] },
  },
  '/agent/profile': { title: '新增代理资料', fields: ['会员ID', '代理编码', '代理状态', '佣金模式', '佣金比例', '结算周期', '默认方案', '彩票赔率系数', '哈希实时比例', '彩票实时比例', '电子日结比例', '真人日结比例', '体育日结比例', '捕鱼日结比例', '竞技日结比例', '允许下级', '推广链接', '备注'] },
  '/agent/user-default-scheme': { title: '新增默认方案', fields: ['方案名称', '彩票赔率', '彩票实时比例', '电子比例', '真人比例', '体育比例', '捕鱼比例', '竞技比例', '默认方案', '状态', '备注'] },
  '/operate/home-group': { title: '新增分组', fields: ['分组编码', '分组名称', '场景', '适用终端', '样式', '图标', '状态', '排序', '备注'] },
  '/operate/app-version': { title: '新建 App 版本', tip: '发布后，同平台上一条版本转为历史；构建号只能递增。', fields: ['平台', '版本号', '构建号', '发布状态', '强制更新', '最低可用构建号', '下载链接', 'APK SHA-256', '更新说明'] },
  '/operate/advertisement': { title: '新增广告', fields: ['场景', '标题', '副标题', '图片', '内容', '按钮文案', '跳转类型', '跳转值', '终端范围', '弹窗规则', '状态', '排序', '备注'] },
  '/operate/activity': { title: '新增活动', fields: ['活动类型', '活动时效', '开始时间', '结束时间', '标题', '横版图', '详情', '状态', '排序', '备注'] },
  '/operate/activity-type': { title: '新增活动类型', fields: ['类型编码', '类型名称', '奖励模式', '领取方式', '发放方式', '规则配置', '状态', '排序', '备注'] },
  '/operate/announcement': { title: '新增公告', fields: ['标题', '摘要', '正文', '封面', '置顶', '发布状态', '排序', '备注'] },
  '/game/line': { title: '新增线路', fields: ['线路编码', '线路名称', '线路类型', '钱包模式', '状态', '商户ID', '商户账号', '接口地址', '签名Key', '商户Token', '商户密钥', '登录密码', '盐值1', '盐值2', '盐值3', '扩展配置'] },
  '/game/factory': { title: '新增厂商', fields: ['所属线路', '厂商编码', '厂商名称', '状态', 'LOGO 地址', '子平台', '钱包代码', '排序', '备注'] },
  '/game/base': { title: '新增游戏', fields: ['所属线路', '所属厂商', '游戏编码', '游戏名称', '游戏类型', '来源', '封面图', '图标', '状态', '热门', '推荐', '排序', '开奖源', '期号间隔', '提前封盘', '开奖延迟', '间隔区块', '每天期数', '开奖号位数', '期号前缀', '区块间隔', '封盘自动下一区块', '备注'] },
  '/finance/currency-exchange': { title: '编辑货币兑换', fields: ['资金类型', '兑换方向', '真实汇率', '盈利比例', '用户汇率', '最小金额', '最大金额', '自动同步', '状态', '备注'] },
  '/finance/fund-pool-address': { title: '新增资金池地址', fields: ['名称', '类型', 'TRX地址', 'USDT余额', 'TRX余额', '累计派彩', '排序', '备注', '状态'] },
  '/finance/bank': { title: '新增银行列表', fields: ['银行编码', '银行名称', '简称', '国家编码', '银行图标', '状态', '排序', '备注'] },
  '/finance/withdraw-channel': { title: '新增提现方式', fields: ['方式编码 / model', '方式名称', '提现类型', '支付商户', '资产代码', '网络代码', '收款方式', '最低提现', '最高提现', '单日次数', '单日额度', '手续费模式', '手续费值', '扩展配置', '状态', '排序', '备注'] },
  '/finance/withdraw-type': { title: '新增提现类型', fields: ['类型编码', '类型名称', '币种', '展示图标', '状态', '排序', '备注'] },
  '/finance/recharge-channel': { title: '新增充值渠道', fields: ['通道编码 / wayCode', '通道名称', '展示名称', '充值类型', '支付商户', '资产代码', '支付模式', '限制VIP', 'VIP等级', '展示图标', '热门', '最小充值', '最大充值', '快捷金额', '手续费模式', '汇率', '奖励模式', '奖励值', '手续费值', '充值提示', '状态', '排序', '备注'] },
  '/finance/recharge-type': { title: '新增充值类型', fields: ['类型编码', '类型名称', '图标', '充值模式', '状态', '排序', '备注'] },
  '/finance/payment-merchant': { title: '新增商户', fields: ['商户代码', '商户名称', '平台类型', 'MD5商户密钥', '代付密钥', '商户号', '商户私钥', '平台公钥', '代收URL', '查单URL', '余额URL', '商品名', '回调路径', '代收回调URL', '代付URL', '代付查单URL', '代付回调路径', '代付回调', '代付反查路径', '图标', '状态', '排序', '备注'] },
  '/permission/admin': { title: '新增管理员', fields: ['账号', '头像', '名称', '角色', '密码', '确认密码', '管理员状态', '多处登录'] },
  '/permission/role': { title: '新增角色', fields: ['名称', '备注', '排序', '状态'] },
  '/permission/menu': { title: '新增菜单', fields: ['菜单类型', '父级菜单', '菜单名称', '菜单图标', '路由路径', '是否显示', '菜单状态', '菜单排序'] },
  '/lottery/game': {
    新增彩种: { title: '新增彩种', fields: ['彩种名称', '彩种编码', '玩法体系', '分类', '每期区块数', '链', '抽水率', '排序', 'USDT 最小/最大', 'TRX 最小/最大', 'CNY 最小/最大', '快捷金额', '状态', '热门'] },
    编辑: { title: '编辑彩种', fields: ['彩种名称', '彩种编码', '玩法体系', '分类', '每期区块数', '封盘时间（秒）', '链', '抽水率', '排序', 'USDT 最小/最大', 'TRX 最小/最大', 'CNY 最小/最大', '快捷金额', '状态', '热门'] },
  },
  '/lottery/rule': { title: '编辑玩法', fields: ['玩法', '配置赔率', '允许额外抽水', '额外抽水率', '总注数', '可中注数', '单挑阈值', '单注限额', '单挑限额'] },
  '/setting/data-source': { title: '新增数据源', fields: ['名称', '数据源编码', 'API Key', '网关地址', '接口地址', '状态', '排序', '备注'] },
  '/setting/message/short_letter': { title: '短信渠道设置', fields: ['短信渠道', 'AccessKey ID', 'AccessKey Secret', '短信签名', '验证码模板 ID', '通知模板 ID', '验证码有效期（分钟）', '发送频率限制', '状态', '备注'] },
  '/setting/user/security-question': { title: '新增密保问题', fields: ['密保问题', '状态', '排序'] },
  '/setting/storage': { title: '存储设置', tip: '切换存储方式前，请确认历史资源已迁移且访问域名可用。', fields: ['储存方式', 'AccessKey', 'SecretKey', 'Bucket', 'Region', '访问域名', '目录前缀', 'HTTPS', '状态', '备注'] },
}

export const detailSchemas = {
  '/agent/invite-link': {
    title: '邀请链接详情',
    tabs: [
      { name: '基本信息' },
      { name: '注册记录', columns: ['会员ID', '用户名', '注册IP', '注册时间'], rows: [['291', 'evanmm88', '47.242.192.4', '2026-08-20 18:48:44']] },
    ],
  },
  '/agent/income': {
    title: '推广收益详情',
    tabs: [
      { name: '基本信息' },
      { name: '关联注单', columns: ['投注订单号', '投注用户', '游戏', '有效投注', '结算结果', '结算时间'], rows: [['HB2026082500591413305378668', 'evan777', 'hash', '100.00 USDT', '-23.00 USDT', '2026-08-25 01:00:02']] },
      { name: '入账流水', columns: ['钱包流水号', '钱包类型', '币种', '入账金额', '状态', '入账时间'], rows: [['UC2026082501000212653330', '佣金钱包', 'USDT', '2.7000', '成功', '2026-08-25 01:00:02']] },
    ],
  },
  '/operate/home-group': {
    title: '首页分组数据来源',
    tabs: [
      { name: '数据来源', columns: ['来源类型', '来源编码', '来源名称', '展示数量', '排序', '状态'], rows: [['游戏厂商', 'HASH', '哈希游戏', '8', '1', '启用'], ['活动', 'NEW_USER', '新人活动', '4', '2', '启用']] },
      { name: '关联内容', columns: ['内容ID', '内容名称', '所属类型', '终端', '状态'], rows: [['14', '哈希五分彩', '游戏', '全部终端', '启用']] },
    ],
  },
  '/game/transfer-payout': {
    title: '转账派奖单详情',
    tabs: [
      { name: '基本信息' },
      { name: '派奖明细', columns: ['派奖单号', '投注订单号', '用户ID', '币种', '应派奖', '实派奖', '状态'], rows: [['TP20260825130915001', 'TB20260825130858001', '133', 'USDT', '194.00', '194.00', '已完成']] },
      { name: '链上交易', columns: ['网络', '收款地址', '交易哈希', '区块高度', '确认数', '链上状态'], rows: [['TRON', 'TQMmqbDSXdA3bbDmZvKSRXmDSVxoFoAWFX', 'b45aa100...8c57', '70372840', '20', '已确认']] },
      { name: '处理日志', columns: ['节点', '处理结果', '失败原因', '处理时间'], rows: [['创建派奖任务', '成功', '-', '2026-08-25 13:09:15'], ['广播链上交易', '成功', '-', '2026-08-25 13:09:21']] },
    ],
  },
  '/game/transfer-bet': {
    title: '转账投注详情',
    tabs: [
      { name: '基本信息' },
      { name: '投注内容', columns: ['游戏', '玩法', '投注选项', '赔率', '投注金额', '有效投注'], rows: [['哈希分分彩', '单双', '双', '1.940', '100.00 USDT', '100.00 USDT']] },
      { name: '链上交易', columns: ['网络', '来源地址', '收款地址', '交易哈希', '区块高度', '确认数'], rows: [['TRON', 'TE8hwLnreraPFwPxQgYSMArqgzB8pSsGNi', 'TXCGJPhRwA6PLKNDWZum2qdc5i7JY2t5iY', '8f0f91aa...7c2d', '70372820', '20']] },
      { name: '派奖信息', columns: ['开奖结果', '输赢金额', '派奖金额', '派奖状态', '派奖时间'], rows: [['双', '94.00 USDT', '194.00 USDT', '已派奖', '2026-08-25 13:10:00']] },
      { name: '处理日志', columns: ['事件', '状态', '说明', '时间'], rows: [['交易入账', '成功', '链上交易已确认', '2026-08-25 13:08:58'], ['注单结算', '成功', '结算完成', '2026-08-25 13:10:00']] },
    ],
  },
  '/game/base': {
    投注记录: {
      title: '游戏投注记录',
      tabs: [
        { name: '注单记录', columns: ['订单号', '用户名', '期号', '玩法 / 选项', '投注金额', '输赢', '状态', '下单时间'], rows: [['HB2026082500591413305378668', 'evan777', '202608250059', '单双 / 双', '100 USDT', '-23 USDT', '已结算', '2026-08-25 00:59:14']] },
        { name: '统计汇总', columns: ['币种', '注单数', '投注额', '有效投注', '用户输赢'], rows: [['USDT', '1', '100.00', '100.00', '-23.00']] },
      ],
    },
  },
  '/game/hash/bet': {
    title: '哈希投注详情',
    tabs: [
      { name: '基本信息' },
      { name: '投注内容', columns: ['游戏', '期号', '玩法', '选项', '赔率', '投注额'], rows: [['哈希分分彩', '202608250059', '单双', '双', '1.940', '100 USDT']] },
      { name: '开奖结算', columns: ['开奖区块', '区块哈希', '开奖号码', '用户输赢', '结算状态', '结算时间'], rows: [['70372820', '000000...8f0f91', '8', '-23 USDT', '已结算', '2026-08-25 01:00:02']] },
      { name: '帐变流水', columns: ['流水号', '钱包类型', '币种', '业务类型', '变动金额', '余额', '时间'], rows: [['UC2026082501000212653330', '普通钱包', 'USDT', '投注结算', '-23.00', '577.00', '2026-08-25 01:00:02']] },
    ],
  },
  '/finance/turnover-requirement': {
    title: '流水要求详情',
    tabs: [
      { name: '基本信息' },
      { name: '流水进度', columns: ['业务类型', '来源单号', '要求流水', '已完成流水', '完成比例', '状态'], rows: [['红包', 'RP202608220001', '100.00', '35.00', '35%', '进行中']] },
      { name: '关联账变', columns: ['流水号', '币种', '变动金额', '业务类型', '创建时间'], rows: [['UC2026082209450012', 'USDT', '10.00', '红包入账', '2026-08-22 09:45:00']] },
    ],
  },
  '/finance/red-packet-quota': {
    title: '红包次数详情',
    tabs: [
      { name: '基本信息' },
      { name: '使用记录', columns: ['领取编号', '红包单号', '扣减次数', '状态', '使用时间'], rows: [['RR202608220001', 'RP202608220001', '1', '成功', '2026-08-22 09:45:00']] },
      { name: '调整记录', columns: ['调整前', '调整数量', '调整后', '调整原因', '操作人', '时间'], rows: [['3', '+2', '5', '活动补发', 'admin1', '2026-08-21 20:12:08']] },
    ],
  },
  '/finance/red-packet-receive': {
    title: '红包领取详情',
    tabs: [
      { name: '基本信息' },
      { name: '入账流水', columns: ['流水号', '钱包类型', '币种', '入账金额', '状态', '时间'], rows: [['UC2026082209450012', '普通钱包', 'USDT', '10.00', '成功', '2026-08-22 09:45:00']] },
      { name: '流水要求', columns: ['要求ID', '要求流水', '已完成流水', '状态', '创建时间'], rows: [['75', '100.00', '35.00', '进行中', '2026-08-22 09:45:01']] },
    ],
  },
  '/finance/red-packet': {
    title: '红包发放详情',
    tabs: [
      { name: '基本信息' },
      { name: '领取明细', columns: ['领取编号', '用户ID', '用户名', '币种', '领取金额', '状态', '领取时间'], rows: [['RR202608220001', '133', 'evan777', 'USDT', '10.00', '已领取', '2026-08-22 09:45:00']] },
      { name: '资金流水', columns: ['流水号', '钱包类型', '方向', '币种', '金额', '状态', '时间'], rows: [['UC2026082209450012', '普通钱包', '支出', 'USDT', '10.00', '成功', '2026-08-22 09:45:00']] },
      { name: '退款记录', columns: ['退款单号', '退款金额', '退款原因', '状态', '退款时间'], rows: [] },
    ],
  },
  '/finance/settlement-service-fee': {
    title: '结算服务费详情',
    tabs: [
      { name: '基本信息' },
      { name: '关联注单', columns: ['投注订单号', '用户ID', '游戏', '展示派奖', '实际派奖', '服务费', '结算时间'], rows: [['HB2026082500591413305378668', '133', 'hash', '194.00', '194.00', '0.00', '2026-08-25 01:00:02']] },
    ],
  },
  '/finance/user-change': {
    title: '用户账变详情',
    tabs: [
      { name: '基本信息' },
      { name: '关联业务', columns: ['业务类型', '业务单号', '业务状态', 'Trace ID', '创建时间'], rows: [['投注结算', 'HB2026082500591413305378668', '已完成', 'trace_20260825010002', '2026-08-25 01:00:02']] },
    ],
  },
  '/finance/withdraw-order': {
    title: '提现订单详情',
    tabs: [
      { name: '订单信息' },
      { name: '收款信息', columns: ['收款方式', '收款人', '银行 / 网络', '收款账号 / 地址', '开户地址'], rows: [['链上钱包', '-', 'TRON', 'TQMmqbDSXdA3bbDmZvKSRXmDSVxoFoAWFX', '-']] },
      { name: '审核记录', columns: ['审核节点', '审核结果', '审核人', '审核备注', '审核时间'], rows: [['风控审核', '待审核', '-', '-', '-']] },
      { name: '三方代付', columns: ['商户', '三方单号', '提交金额', '三方状态', '错误信息', '更新时间'], rows: [['staging-pay', '-', '100.00 USDT', '未提交', '-', '2026-08-25 13:21:18']] },
      { name: '操作日志', columns: ['操作', '操作人', '说明', '来源IP', '时间'], rows: [['创建订单', '用户', '提交提现申请', '47.242.192.4', '2026-08-25 13:21:18']] },
    ],
  },
  '/finance/recharge-order': {
    title: '充值订单详情',
    tabs: [
      { name: '订单信息' },
      { name: '支付信息', columns: ['支付模式', '充值渠道', '支付商户', '应付金额', '实付金额', '到账金额'], rows: [['链上充值', 'TRON-USDT', 'staging-pay', '600.00 USDT', '600.00 USDT', '600.00 USDT']] },
      { name: '回调记录', columns: ['回调类型', '回调状态', '响应码', '响应内容', '回调时间'], rows: [['充值入账', '成功', '200', 'success', '2026-08-25 12:58:32']] },
      { name: '操作日志', columns: ['操作', '操作人', '说明', '来源IP', '时间'], rows: [['订单创建', 'SYSTEM', '检测到链上充值', '127.0.0.1', '2026-08-25 12:58:21']] },
    ],
  },
  '/lottery/bet': {
    title: '彩票注单详情',
    tabs: [
      { name: '基本信息' },
      { name: '投注内容', columns: ['彩种', '期号', '玩法', '投注内容', '赔率', '投注金额', '有效投注'], rows: [['哈希三分彩', '202608250420', '前三组三', '1,2,3', '1.940', '100 USDT', '100 USDT']] },
      { name: '开奖信息', columns: ['开奖区块', '区块哈希', '开奖号码', '开奖状态', '开奖时间'], rows: [['70372820', '000000...8f0f91', '1,2,3,4,5', '已开奖', '2026-08-25 13:10:00']] },
      { name: '结算明细', columns: ['中奖金额', '服务费', '实派奖', '用户输赢', '结算状态', '结算时间'], rows: [['194.00', '0.00', '194.00', '94.00', '已结算', '2026-08-25 13:10:02']] },
      { name: '帐变流水', columns: ['流水号', '业务类型', '币种', '变动金额', '变动后余额', '时间'], rows: [['UC2026082513100212', '彩票派奖', 'USDT', '+194.00', '771.00', '2026-08-25 13:10:02']] },
    ],
  },
  '/lottery/chase': {
    title: '彩票追号详情',
    tabs: [
      { name: '基本信息' },
      { name: '追号期次', columns: ['序号', '期号', '倍数', '投注金额', '执行状态', '中奖金额', '结算时间'], rows: [['1', '202608250420', '1', '10 USDT', '已完成', '0', '2026-08-25 13:10:02'], ['2', '202608250421', '1', '10 USDT', '待执行', '-', '-']] },
      { name: '终止记录', columns: ['操作人', '终止原因', '剩余期数', '终止时间'], rows: [] },
    ],
  },
}

export const memberRows = [
  { id: 292, user: 'evanqqq', status: '正常', nickname: 'evanqqq', invite: 'CSHAWIT1', phone: '-', email: '-', balances: ['0.00', '0.00', '0.00'], agent: '-', level: 0, wage: '0%', registered: '2026-08-20 18:59:08', login: '2026-08-20 18:59:33', ip: '47.242.192.4' },
  { id: 291, user: 'evanmm88', status: '正常', nickname: 'evanmm88', invite: 'HLOZX4B6', phone: '-', email: '-', balances: ['0.00', '0.00', '0.00'], agent: 'ceshi0003', level: 2, wage: '2.68%', registered: '2026-08-20 18:48:44', login: '2026-08-20 18:48:44', ip: '47.242.192.4' },
  { id: 290, user: 'ceshi1112', status: '正常', nickname: 'ceshi1112', invite: 'WYDUEBOX', phone: '-', email: '-', balances: ['0.00', '50.00', '0.00'], agent: 'ceshi0001', level: 2, wage: '2.26%', registered: '2026-08-20 09:40:21', login: '2026-08-20 09:40:21', ip: '47.242.192.4' },
  { id: 289, user: 'orange', status: '正常', nickname: 'orange', invite: 'CYDZCPCG', phone: '-', email: '-', balances: ['0.00', '33.00', '0.00'], agent: '-', level: 0, wage: '1.7%', registered: '2026-08-20 00:32:29', login: '2026-08-20 00:32:57', ip: '47.242.192.4' },
  { id: 288, user: 'Appleee', status: '正常', nickname: 'Appleee', invite: 'YPV05FNS', phone: '-', email: '-', balances: ['0.00', '0.00', '0.00'], agent: '-', level: 0, wage: '0%', registered: '2026-08-19 19:32:18', login: '2026-08-19 19:33:44', ip: '47.242.192.4' },
]

export const menuTreeRows = [
  ['工作台', '菜单', '▣', 'index:console', '正常', '9999', '2026-03-23 11:50:08'],
  ['会员管理', '目录', '♙', '-', '正常', '998', '2026-03-24 20:59:54'],
  ['链上配置', '目录', '⌁', '-', '正常', '80', '2026-07-01 10:42:54'],
  ['代理管理', '目录', '♙', '-', '正常', '54', '2026-05-27 10:09:15'],
  ['运营管理', '目录', '▤', '-', '正常', '53', '2026-05-26 16:55:32'],
  ['游戏管理', '目录', '▧', '-', '正常', '52', '2026-05-26 15:04:45'],
  ['风控管理', '目录', '!', '-', '正常', '51', '2026-08-27 04:20:00'],
  ['资金管理', '目录', '▣', '-', '正常', '50', '2026-06-17 18:25:50'],
  ['权限管理', '目录', '▢', '-', '正常', '44', '2022-09-08 16:36:41'],
  ['自营区块彩票', '目录', '⚑', '-', '正常', '22', '2026-08-21 20:41:40'],
  ['系统设置', '目录', '⚙', '-', '正常', '0', '2022-09-08 16:38:42'],
]
