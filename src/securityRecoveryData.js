function evidencePreview(title, lines, accent = '#1677ff') {
  const rows = lines.map((line, index) => `<text x="36" y="${104 + index * 30}" font-size="17" fill="#334155">${line}</text>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420"><rect width="720" height="420" fill="#f4f7fb"/><rect x="22" y="22" width="676" height="376" rx="18" fill="#fff" stroke="#dce4ef"/><rect x="22" y="22" width="676" height="58" rx="18" fill="${accent}"/><rect x="22" y="62" width="676" height="18" fill="${accent}"/><text x="48" y="60" font-size="23" font-weight="700" fill="#fff">${title}</text>${rows}<text x="36" y="370" font-size="14" fill="#94a3b8">本地演示凭证 · 不连接真实账户</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const initialSecurityProfile = {
  configured: false,
  question: '',
  answer: '',
  tip: '',
  resetGranted: false,
}

export const initialSecurityRecoveryRequests = [
  {
    id: 'PR202609030001',
    requestNo: 'PR202609030001',
    memberId: '407',
    username: 'demo407',
    sourcePage: '登录页 · 找回密码',
    recoveryType: 'login-password',
    recoveryTypeLabel: '登录密码找回',
    method: 'transaction-proof',
    methodLabel: '充值及提现资料',
    condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址两组材料必须同时核对一致。',
    reply: '已同时提交最近充值与提现材料，申请修改登录密码。',
    passwordSubmitted: true,
    recharge: {
      walletAddress: 'TQ8DemoRechargeWallet407K6L2',
      reference: '最近成功充值：100.00 USDT · 2026-09-01 18:26',
      screenshots: [{
        name: '最近充值截图-演示.png',
        type: 'image/png',
        size: 126640,
        dataUrl: evidencePreview('最近充值凭证', ['币种：USDT', '实际到账：100.00', '时间：2026-09-01 18:26']),
      }],
    },
    withdrawal: {
      walletAddress: 'TV6DemoWithdrawWallet407P3N8',
      reference: '最近成功提现：60.00 USDT · 2026-09-02 20:18',
      screenshots: [{
        name: '最近提现截图-演示.png',
        type: 'image/png',
        size: 118220,
        dataUrl: evidencePreview('最近提现凭证', ['币种：USDT', '实际到账：60.00', '时间：2026-09-02 20:18'], '#16a34a'),
      }],
    },
    status: '待审核',
    submittedAt: '2026-09-03 03:58:20',
    reviewer: '',
    reviewedAt: '',
    rejectReason: '',
  },
  {
    id: 'SR202608280003',
    requestNo: 'SR202608280003',
    memberId: '288',
    username: 'orbit288',
    sourcePage: '更换密保',
    recoveryType: 'security-question',
    recoveryTypeLabel: '密保找回',
    securityQuestion: '3.您初中班主任的姓名是？',
    method: 'first-deposit',
    methodLabel: '首次充值',
    condition: '提供首次充值的币种、金额、日期或订单号，或上传当次充值截图。',
    reply: '首次充值为 600 USDT，约在 2026-08-25 中午完成，订单尾号 001。',
    screenshots: [{
      name: '首次充值凭证-演示.png',
      type: 'image/png',
      size: 128640,
      dataUrl: evidencePreview('首次充值凭证', ['币种：USDT', '实际到账：600.00', '时间：2026-08-25 12:58']),
    }],
    status: '待审核',
    submittedAt: '2026-08-28 04:52:18',
    reviewer: '',
    reviewedAt: '',
    rejectReason: '',
  },
  {
    id: 'SR202608270012',
    requestNo: 'SR202608270012',
    memberId: '185',
    username: 'sky185',
    sourcePage: '添加TRC20地址',
    recoveryType: 'security-question',
    recoveryTypeLabel: '密保找回',
    securityQuestion: '7.您第一所学校的名称是？',
    method: 'recent-withdrawal',
    methodLabel: '最近成功提现',
    condition: '提供最近一笔成功提现的币种、金额、时间及收款地址后 6 位，或上传提现记录截图。',
    reply: '',
    screenshots: [{
      name: '提现记录-演示.png',
      type: 'image/png',
      size: 116820,
      dataUrl: evidencePreview('最近成功提现', ['币种：USDT', '实际到账：88.00', '地址尾号：AWFX'], '#16a34a'),
    }],
    status: '审核通过',
    submittedAt: '2026-08-27 18:26:40',
    reviewer: 'admin1',
    reviewedAt: '2026-08-27 18:41:12',
    rejectReason: '',
    reviewRemark: '客服核验通过，会员密保已恢复为未设置状态。',
  },
  {
    id: 'SR202608260008',
    requestNo: 'SR202608260008',
    memberId: '219',
    username: 'mango219',
    sourcePage: '更换密保',
    recoveryType: 'security-question',
    recoveryTypeLabel: '密保找回',
    securityQuestion: '12.您最喜欢的城市是？',
    method: 'common-wallet',
    methodLabel: '历史常用钱包',
    condition: '提供历史常用钱包地址或地址尾号，并说明充值、提现等使用场景，或上传钱包记录截图。',
    reply: '常用 TRC20 钱包地址尾号为 7L9Q，曾用于充值。',
    screenshots: [],
    status: '已驳回',
    submittedAt: '2026-08-26 09:18:02',
    reviewer: 'admin1',
    reviewedAt: '2026-08-26 09:35:46',
    rejectReason: '提供的钱包尾号与历史记录不一致，请补充可核对的交易信息。',
  },
]

export function createInitialSecurityProfile() {
  return { ...initialSecurityProfile }
}

export function createInitialSecurityRecoveryRequests() {
  return initialSecurityRecoveryRequests.map((request) => ({
    ...request,
    screenshots: (request.screenshots || []).map((image) => ({ ...image })),
    recharge: request.recharge ? {
      ...request.recharge,
      screenshots: (request.recharge.screenshots || []).map((image) => ({ ...image })),
    } : undefined,
    withdrawal: request.withdrawal ? {
      ...request.withdrawal,
      screenshots: (request.withdrawal.screenshots || []).map((image) => ({ ...image })),
    } : undefined,
  }))
}
