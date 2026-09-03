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
    methodLabel: '充值及提现资料核验',
    condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址两组材料必须同时核对一致。',
    reply: '已同时提交最近充值与提现材料，申请修改登录密码。',
    passwordSubmitted: true,
    recharge: {
      walletAddress: 'TQ8DemoRechargeWallet407K6L2',
      historyWalletAddress: 'TQ8DemoRechargeWallet407K6L2',
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
      historyWalletAddress: 'TV6DemoWithdrawWallet407P3N8',
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
    id: 'GR202609030002',
    requestNo: 'GR202609030002',
    memberId: '326',
    username: 'nova326',
    sourcePage: '安全中心 · 谷歌二次验证',
    recoveryType: 'google-auth',
    recoveryTypeLabel: '谷歌二次验证找回',
    method: 'transaction-proof',
    methodLabel: '充值及提现资料核验',
    condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址两组材料必须同时核对一致。',
    recharge: {
      walletAddress: 'TG7DemoRechargeWallet326H4S8',
      historyWalletAddress: 'TG7DemoRechargeWallet326H4S8',
      reference: '最近成功充值：350.00 USDT · 2026-09-01 13:12',
      screenshots: [{
        name: '最近充值截图-演示.png',
        type: 'image/png',
        size: 123980,
        dataUrl: evidencePreview('最近充值凭证', ['币种：USDT', '实际到账：350.00', '时间：2026-09-01 13:12']),
      }],
    },
    withdrawal: {
      walletAddress: 'TH3DemoWithdrawWallet326J6N1',
      historyWalletAddress: 'TH3DemoWithdrawWallet326J6N1',
      reference: '最近成功提现：120.00 USDT · 2026-09-02 09:45',
      screenshots: [{
        name: '最近提现截图-演示.png',
        type: 'image/png',
        size: 119840,
        dataUrl: evidencePreview('最近提现凭证', ['币种：USDT', '实际到账：120.00', '时间：2026-09-02 09:45'], '#16a34a'),
      }],
    },
    status: '待审核',
    submittedAt: '2026-09-03 10:18:36',
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
    method: 'transaction-proof',
    methodLabel: '充值及提现资料核验',
    condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址两组材料必须同时核对一致。',
    recharge: {
      walletAddress: 'TA6DemoRechargeWallet288R9M4',
      historyWalletAddress: 'TA6DemoRechargeWallet288R9M4',
      reference: '最近成功充值：600.00 USDT · 2026-08-25 12:58',
      screenshots: [{
        name: '最近充值截图-演示.png',
        type: 'image/png',
        size: 128640,
        dataUrl: evidencePreview('最近充值凭证', ['币种：USDT', '实际到账：600.00', '时间：2026-08-25 12:58']),
      }],
    },
    withdrawal: {
      walletAddress: 'TB4DemoWithdrawWallet288D3P7',
      historyWalletAddress: 'TB4DemoWithdrawWallet288D3P7',
      reference: '最近成功提现：180.00 USDT · 2026-08-27 16:32',
      screenshots: [{
        name: '最近提现截图-演示.png',
        type: 'image/png',
        size: 119360,
        dataUrl: evidencePreview('最近提现凭证', ['币种：USDT', '实际到账：180.00', '时间：2026-08-27 16:32'], '#16a34a'),
      }],
    },
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
    method: 'transaction-proof',
    methodLabel: '充值及提现资料核验',
    condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址两组材料必须同时核对一致。',
    recharge: {
      walletAddress: 'TC5DemoRechargeWallet185N2V8',
      historyWalletAddress: 'TC5DemoRechargeWallet185N2V8',
      reference: '最近成功充值：220.00 USDT · 2026-08-26 11:05',
      screenshots: [{
        name: '最近充值截图-演示.png',
        type: 'image/png',
        size: 121440,
        dataUrl: evidencePreview('最近充值凭证', ['币种：USDT', '实际到账：220.00', '时间：2026-08-26 11:05']),
      }],
    },
    withdrawal: {
      walletAddress: 'TD9DemoWithdrawWallet185AWFX',
      historyWalletAddress: 'TD9DemoWithdrawWallet185AWFX',
      reference: '最近成功提现：88.00 USDT · 2026-08-27 17:48',
      screenshots: [{
        name: '最近提现截图-演示.png',
        type: 'image/png',
        size: 116820,
        dataUrl: evidencePreview('最近提现凭证', ['币种：USDT', '实际到账：88.00', '地址尾号：AWFX'], '#16a34a'),
      }],
    },
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
    method: 'transaction-proof',
    methodLabel: '充值及提现资料核验',
    condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址两组材料必须同时核对一致。',
    recharge: {
      walletAddress: 'TE8DemoRechargeWallet219L7Q9',
      historyWalletAddress: 'TE8DemoRechargeWallet219L7Q9',
      reference: '最近成功充值：300.00 USDT · 2026-08-24 09:16',
      screenshots: [{
        name: '最近充值截图-演示.png',
        type: 'image/png',
        size: 124760,
        dataUrl: evidencePreview('最近充值凭证', ['币种：USDT', '实际到账：300.00', '时间：2026-08-24 09:16']),
      }],
    },
    withdrawal: {
      walletAddress: 'TF2DemoWithdrawWallet219C5K3',
      historyWalletAddress: 'TF2DemoWithdrawWallet219C5K3',
      reference: '最近成功提现：100.00 USDT · 2026-08-25 21:40',
      screenshots: [{
        name: '最近提现截图-演示.png',
        type: 'image/png',
        size: 117920,
        dataUrl: evidencePreview('最近提现凭证', ['币种：USDT', '实际到账：100.00', '时间：2026-08-25 21:40'], '#16a34a'),
      }],
    },
    status: '已驳回',
    submittedAt: '2026-08-26 09:18:02',
    reviewer: 'admin1',
    reviewedAt: '2026-08-26 09:35:46',
    rejectReason: '提现截图与历史演示记录不一致，请核对两组资料后重新提交。',
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
