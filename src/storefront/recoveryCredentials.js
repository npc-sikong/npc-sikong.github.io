export const RECOVERY_CREDENTIALS = {
  login: {
    key: 'login',
    label: '登录密码',
    type: 'login',
    placeholder: '请输入6-20位登录密码',
  },
  security: {
    key: 'security',
    label: '密保答案',
    type: 'security',
    placeholder: '请输入当前密保答案',
  },
  fund: {
    key: 'fund',
    label: '资金密码',
    type: 'fund',
    placeholder: '请输入6位资金密码',
  },
  google: {
    key: 'google',
    label: '谷歌验证码',
    type: 'google',
    placeholder: '请输入6位谷歌验证码',
  },
}

const TARGET_CREDENTIAL_KEYS = {
  login: ['security', 'fund'],
  security: ['login', 'fund'],
  fund: ['security', 'login'],
  google: ['security', 'fund'],
}

export function recoveryCredentialsFor(target, { securityConfigured = false } = {}) {
  return (TARGET_CREDENTIAL_KEYS[target] || [])
    .map((key) => ({
      ...RECOVERY_CREDENTIALS[key],
      available: key !== 'security' || securityConfigured,
      unavailableReason: key === 'security' && !securityConfigured ? '当前未设置密保' : '',
    }))
}

export function recoveryCredentialPairAvailable(credentials = []) {
  return credentials.length === 2 && credentials.every((credential) => credential.available !== false)
}

export function validateRecoveryCredentialValues(payload, securityProfile, notify) {
  if (!payload?.selectedKeys?.includes('security')) return true
  if (!securityProfile?.configured || !securityProfile?.answer) {
    notify?.('当前未设置密保，请使用绑定地址充值找回')
    return false
  }
  if (String(payload.values?.security || '').trim() !== securityProfile.answer) {
    notify?.('密保答案不正确')
    return false
  }
  return true
}
