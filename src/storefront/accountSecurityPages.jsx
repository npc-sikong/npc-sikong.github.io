import { useEffect, useMemo, useRef, useState } from 'react'
import { CreditCard, KeyRound, Landmark, LockKeyhole, ShieldCheck, Smartphone, UserRoundCheck, Wallet } from 'lucide-react'
import { BANKS, DEPOSIT_CHANNELS, SECURITY_MENU, SECURITY_QUESTIONS } from './accountData'
import CredentialPairRecoveryPanel from './CredentialPairRecoveryPanel'
import { recoveryCredentialPairAvailable, recoveryCredentialsFor, validateRecoveryCredentialValues } from './recoveryCredentials'
import { SecurityRecoveryPanel } from './SecurityRecoveryModal'
import StorefrontRequirementEntry from './StorefrontRequirementEntry'
import {
  ActionRow,
  Badge,
  Card,
  ConfirmModal,
  CopyLine,
  EmptyState,
  Field,
  GhostButton,
  GoogleVerificationModal,
  Hint,
  Modal,
  PageShell,
  PasswordField,
  PillTabs,
  PrimaryButton,
  QrPlaceholder,
  SearchBox,
  SectionTitle,
  Segmented,
  SelectField,
  SelectSheet,
  SummaryGrid,
  useSfaActions,
} from './accountUi'

const securityIcons = {
  google: <Smartphone size={20} />,
  account: <Wallet size={20} />,
  fund: <LockKeyhole size={20} />,
  question: <ShieldCheck size={20} />,
  login: <KeyRound size={20} />,
}

export function SecurityCenterPage(props) {
  const actions = useSfaActions(props)
  const [logout, setLogout] = useState(false)
  const securityConfigured = Boolean(props.securityProfile?.configured)
  const googleBound = props.googleBound ?? true
  const securityMenu = useMemo(() => SECURITY_MENU.map((item) => {
    if (item.id === 'question') return {
      ...item,
      title: securityConfigured ? '更换密保' : '设置密保',
      subtitle: securityConfigured ? '验证原密保后可设置新的问题和答案' : '首次设置密保问题、答案和提示',
      status: securityConfigured ? '已设置' : '未设置',
    }
    if (item.id === 'google') return {
      ...item,
      subtitle: googleBound ? '可更换，或使用双凭据/充值验证重置解绑' : '使用资金密码、密保和新谷歌码完成绑定',
      status: googleBound ? '已绑定' : '未绑定',
    }
    return item
  }), [googleBound, securityConfigured])

  return (
    <PageShell title="安全中心" onBack={actions.back} message={actions.localMessage}>
      <Card className="sfa-security-banner"><div className="sfa-security-emblem"><ShieldCheck size={31} /></div><div><strong>{securityConfigured ? '账户保护已开启' : '账户保护待完善'}</strong><small>{securityConfigured ? '建议定期检查安全配置与恢复方式' : '请先设置密保，再进行敏感账户操作'}</small></div><Badge tone={securityConfigured ? 'success' : 'warning'}>{securityConfigured ? '安全' : '待设置'}</Badge></Card>
      <SectionTitle>账户安全</SectionTitle>
      <Card className="sfa-action-list">{securityMenu.map((item) => <ActionRow key={item.id} title={item.title} subtitle={item.subtitle} status={item.status} icon={securityIcons[item.id]} onClick={() => actions.go(item.route)} />)}</Card>
      <Card className="sfa-action-list"><ActionRow title="退出登录" subtitle="清空当前设备的本地登录状态" icon={<UserRoundCheck size={20} />} danger onClick={() => setLogout(true)} /></Card>
      <ConfirmModal open={logout} title="确认退出当前账号？" content="退出后将清空本地登录态，需要重新登录才能继续访问会员页面。" confirmText="确认退出" danger onCancel={() => { setLogout(false); actions.notify('已取消退出') }} onConfirm={() => { setLogout(false); actions.notify('已退出登录', 'success'); actions.go('/pages/login/login') }} />
    </PageShell>
  )
}

const accountTypes = [
  { value: 'trc20', label: 'TRC20', icon: <Wallet size={18} /> },
  { value: 'alipay', label: '支付宝', icon: <Landmark size={18} /> },
  { value: 'bank', label: '银行卡', icon: <CreditCard size={18} /> },
  { value: 'bobi', label: '波币', icon: <Wallet size={18} />, disabled: true },
  { value: 'okpay', label: 'OKPAY', icon: <Wallet size={18} />, disabled: true },
]

export function AccountBindPage(props) {
  const actions = useSfaActions(props)
  const requestedType = String(props?.type || props?.path || '').toLowerCase()
  const initialType = accountTypes.find((item) => requestedType.includes(item.value) && !item.disabled)?.value || 'trc20'
  const securityConfigured = Boolean(props.securityProfile?.configured)
  const currentQuestion = props.securityProfile?.question || ''
  const [type, setType] = useState(initialType)
  const [formOpen, setFormOpen] = useState(Boolean(props?.type) && securityConfigured)
  const [fundPassword, setFundPassword] = useState('')
  const [answer, setAnswer] = useState('')
  const [bankSheet, setBankSheet] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const [googleCode, setGoogleCode] = useState('')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const securityRecoveryCredentials = recoveryCredentialsFor('security', {
    securityConfigured,
    googleBound: props.googleBound !== false,
  })
  const [recoveryMethod, setRecoveryMethod] = useState(recoveryCredentialPairAvailable(securityRecoveryCredentials) ? 'credentials' : 'transfer')
  const [bindings, setBindings] = useState({ trc20: ['TV8u...V6Y2P3s'], alipay: [], bank: [] })
  const [forms, setForms] = useState({
    trc20: { address: '' },
    alipay: { name: '', account: '' },
    bank: { bank: '', name: '', card: '', province: '', city: '', branch: '' },
  })

  const updateForm = (key, value) => setForms((current) => ({ ...current, [type]: { ...current[type], [key]: value } }))
  const currentBindings = bindings[type] || []
  const typeLabel = accountTypes.find((item) => item.value === type)?.label || '账户'
  const filteredBanks = BANKS.filter((item) => item.includes(bankSearch.trim()))

  useEffect(() => {
    if (securityConfigured) return
    setFormOpen(false)
    setRecoveryOpen(false)
  }, [securityConfigured])

  const chooseType = (value) => {
    const item = accountTypes.find((candidate) => candidate.value === value)
    if (item?.disabled) return actions.notify(`${item.label}暂未开放`)
    setType(value)
    setFormOpen(false)
    setGoogleCode('')
  }

  const openForm = () => {
    if (!securityConfigured) {
      actions.notify('请先设置密保，再绑定收款账户')
      actions.go('/pages/security/security-question')
      return
    }
    setFormOpen(true)
  }

  const validate = () => {
    const form = forms[type]
    if (!securityConfigured) return actions.notify('请先设置密保')
    if (type === 'trc20' && !/^T[A-Za-z0-9]{20,}$/.test(form.address)) return actions.notify('请输入正确的TRC20地址')
    if (type === 'alipay' && (!form.name.trim() || !form.account.trim())) return actions.notify('请填写完整绑定信息')
    if (type === 'bank' && (!form.bank || !form.name.trim() || !form.card.trim())) return actions.notify('请填写完整银行卡信息')
    if (!/^\d{6}$/.test(fundPassword)) return actions.notify('请输入6位资金密码')
    if (!answer.trim()) return actions.notify('请输入密保答案')
    if (props.securityProfile?.answer && answer.trim() !== props.securityProfile.answer) return actions.notify('密保答案不正确')
    if (!/^\d{6}$/.test(googleCode)) return actions.notify('请输入6位谷歌验证码')
    finishBind()
  }

  const finishBind = () => {
    const value = type === 'trc20' ? forms.trc20.address : type === 'alipay' ? `${forms.alipay.name} · ${forms.alipay.account}` : `${forms.bank.bank} · ${forms.bank.card}`
    setBindings((current) => ({ ...current, [type]: [...(current[type] || []), value] }))
    setFormOpen(false)
    setFundPassword('')
    setAnswer('')
    setGoogleCode('')
    actions.notify(`绑定${typeLabel}成功`, 'success')
  }

  const finishSecurityRecovery = ({ amount, currency } = {}) => {
    props.setSecurityProfile?.({ configured: false, question: '', answer: '', tip: '', resetGranted: true })
    setRecoveryOpen(false)
    setFormOpen(false)
    actions.notify(amount ? `${amount} ${currency} 已计入钱包，密保已恢复为未设置` : '两项凭据验证通过，密保已恢复为未设置', 'success')
    actions.go('/pages/security/security-question')
  }

  const openSecurityRecovery = () => {
    setRecoveryMethod(recoveryCredentialPairAvailable(securityRecoveryCredentials) ? 'credentials' : 'transfer')
    setRecoveryOpen(true)
  }

  const handleBack = () => {
    if (recoveryOpen) {
      setRecoveryOpen(false)
      return
    }
    if (formOpen) {
      setFormOpen(false)
      return
    }
    actions.back()
  }

  return (
    <PageShell title={recoveryOpen ? '找回密保' : formOpen ? `绑定${typeLabel}` : '账户管理'} onBack={handleBack} message={actions.localMessage} right={<button className="sfa-header-link" type="button" onClick={() => actions.go('/pages/service/index')}>帮助</button>}>
      <StorefrontRequirementEntry path="/front/pages/security/account-bind" />
      {recoveryOpen ? (
        <>
          <Hint>找回密保提供两条独立路径：固定验证“登录密码＋资金密码”，或使用绑定地址充值验证；通过后旧密保清空，再设置新密保并继续绑定{typeLabel}。</Hint>
          <Segmented items={[{ value: 'credentials', label: '双凭据找回' }, { value: 'transfer', label: '绑定地址充值找回' }]} value={recoveryMethod} onChange={setRecoveryMethod} />
          {recoveryMethod === 'credentials' ? <CredentialPairRecoveryPanel
            identityKey={`account-bind-security-${type}`}
            targetLabel="密保"
            availableCredentials={securityRecoveryCredentials}
            actionText="验证并找回密保"
            beforeVerify={(payload) => validateRecoveryCredentialValues(payload, props.securityProfile, actions.notify)}
            onVerified={finishSecurityRecovery}
          /> : <SecurityRecoveryPanel
            identityKey={`account-bind-security-${type}`}
            title="绑定地址充值找回"
            purpose={`演示到账后清空旧密保，再设置新密保并继续绑定${typeLabel}`}
            actionText="我已转账并找回密保"
            onVerified={finishSecurityRecovery}
          />}
        </>
      ) : formOpen ? <>
        <Card className="sfa-security-form-card">
          <SectionTitle>账户信息与安全验证</SectionTitle>
          {type === 'trc20' ? <><SelectField label="币种选择" value="USDT · TRC20协议" onClick={() => actions.notify('当前仅支持TRC20协议')} /><Field label="USDT-TRC20地址" value={forms.trc20.address} onChange={(value) => updateForm('address', value)} placeholder="请输入TRC20地址" right={<button type="button" onClick={() => { updateForm('address', DEPOSIT_CHANNELS[0].address); actions.notify('已粘贴演示地址') }}>粘贴</button>} /></> : null}
          {type === 'alipay' ? <><Field label="姓名" value={forms.alipay.name} onChange={(value) => updateForm('name', value)} placeholder="请输入支付宝真实姓名" /><Field label="支付宝账号" value={forms.alipay.account} onChange={(value) => updateForm('account', value)} placeholder="请输入支付宝账号" /></> : null}
          {type === 'bank' ? <><SelectField label="开户银行" value={forms.bank.bank} onClick={() => setBankSheet(true)} /><Field label="姓名" value={forms.bank.name} onChange={(value) => updateForm('name', value)} placeholder="请输入持卡人姓名" /><Field label="银行卡号" value={forms.bank.card} onChange={(value) => updateForm('card', value.replace(/\D/g, ''))} placeholder="请输入银行卡号" /><div className="sfa-two-columns"><Field label="开户省份（选填）" value={forms.bank.province} onChange={(value) => updateForm('province', value)} /><Field label="开户城市（选填）" value={forms.bank.city} onChange={(value) => updateForm('city', value)} /></div><Field label="开户支行（选填）" value={forms.bank.branch} onChange={(value) => updateForm('branch', value)} /></> : null}
          <PasswordField label="资金密码" value={fundPassword} onChange={(value) => setFundPassword(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" />
          <div className="sfa-security-question-value"><small>当前密保问题</small><strong>{currentQuestion || '尚未设置密保'}</strong></div>
          <Field label="密保答案" value={answer} onChange={setAnswer} placeholder="请输入答案" right={<button type="button" onClick={openSecurityRecovery}>忘记密保？</button>} />
          <Field label="谷歌验证码" value={googleCode} onChange={(value) => setGoogleCode(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位谷歌验证码" />
          <Hint>账户信息、资金密码、密保答案和谷歌验证码在本页一次提交，无需再打开验证弹窗。</Hint>
          <div className="sfa-inline-actions"><GhostButton onClick={() => setFormOpen(false)}>取消</GhostButton><PrimaryButton onClick={validate}>确认绑定</PrimaryButton></div>
        </Card>
        <Modal open={bankSheet} title="选择开户银行" onClose={() => setBankSheet(false)}>
          <SearchBox value={bankSearch} onChange={setBankSearch} placeholder="搜索银行名称、简称或编码" onSearch={() => actions.notify(filteredBanks.length ? `找到${filteredBanks.length}家银行` : '没有匹配的银行')} />
          {filteredBanks.length ? <div className="sfa-option-list">{filteredBanks.map((bank) => <button type="button" key={bank} onClick={() => { updateForm('bank', bank); setBankSheet(false) }}><span><strong>{bank}</strong></span></button>)}</div> : <EmptyState title="没有匹配的银行" />}
        </Modal>
      </> : <>
        <PillTabs items={accountTypes} value={type} onChange={chooseType} />
        <SectionTitle action="+添加" onAction={openForm}>我的{typeLabel}</SectionTitle>
        {currentBindings.length ? <Card className="sfa-binding-list">{currentBindings.map((binding, index) => <div key={`${binding}-${index}`}><span className="sfa-action-icon">{accountTypes.find((item) => item.value === type)?.icon}</span><span><strong>{binding}</strong><small>{type === 'trc20' ? 'TRC20协议' : '已完成安全验证'}</small></span><Badge tone="success">已绑定</Badge></div>)}</Card> : <EmptyState title={`暂无${typeLabel}`} description="点击右上角添加新的收款账户" action="+添加" onAction={openForm} />}
        <Hint tone="warning">为了您的资金安全，请确保绑定信息真实、准确。所有操作均为本地演示，不会写入真实账户。</Hint>
      </>}
    </PageShell>
  )
}

function resolveSecurityMode(props) {
  const explicit = props?.type || props?.mode
  if (explicit) return explicit
  const path = String(props?.path || props?.route || '')
  if (path.includes('google-authenticator')) return 'google'
  if (path.includes('email-bind')) return 'email'
  if (path.includes('login-password')) return 'login-password'
  if (path.includes('recharge-password')) return 'recharge-password'
  if (path.includes('security-question')) return 'question'
  if (path.includes('onboarding')) return 'onboarding'
  return 'login-password'
}

const formTitles = {
  email: '绑定邮箱',
  'login-password': '修改登录密码',
  'recharge-password': '修改资金密码',
  question: '更换密保',
  onboarding: '账户安全设置',
  google: '谷歌验证器',
}

export function SecurityFormPage(props) {
  const mode = resolveSecurityMode(props)
  if (mode === 'google') return <GoogleAuthenticatorPage {...props} />
  if (mode === 'onboarding') return <OnboardingPage {...props} />
  if (mode === 'question') return <SecurityQuestionPage {...props} />
  if (mode === 'login-password') return <LoginPasswordPage {...props} />
  if (mode === 'recharge-password') return <FundPasswordPage {...props} />
  return <BasicSecurityForm {...props} mode={mode} />
}

function BasicSecurityForm({ mode, ...props }) {
  const actions = useSfaActions(props)
  const [form, setForm] = useState({ email: '', code: '' })
  const [codeSent, setCodeSent] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return actions.notify('请输入正确邮箱地址')
    if (form.code.length < 4) return actions.notify('请输入邮箱验证码')
    setForm({ email: '', code: '' })
    actions.notify('邮箱绑定成功', 'success')
  }

  return (
    <PageShell title={formTitles[mode]} onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton onClick={validate}>确定</PrimaryButton>}>
      <Card>
        <Field label="邮箱地址" value={form.email} onChange={(value) => update('email', value)} placeholder="请输入邮箱地址" />
        <Field label="验证码" value={form.code} onChange={(value) => update('code', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入邮箱验证码" right={<button type="button" onClick={() => { if (!/^\S+@\S+\.\S+$/.test(form.email)) return actions.notify('请输入正确邮箱地址'); setCodeSent(true); actions.notify('验证码已发送', 'success') }}>{codeSent ? '重新发送' : '发送验证码'}</button>} />
      </Card>
      <button className="sfa-service-link" type="button" onClick={() => actions.go('/pages/service/index')}>如需帮助，请联系客服</button>
    </PageShell>
  )
}

function SecurityQuestionDisplay({ profile }) {
  const configured = Boolean(profile?.configured && profile?.question)
  return (
    <div className="sfa-security-question-value">
      <small>当前密保问题</small>
      <strong>{configured ? profile.question : '尚未设置密保'}</strong>
      <span>{configured ? `密保提示：${profile?.tip || '未填写'}` : '请先设置密保后再使用该验证项'}</span>
    </div>
  )
}

function answerMatches(profile, answer) {
  return Boolean(profile?.configured && profile?.answer && answer.trim() === profile.answer)
}

function LoginPasswordPage(props) {
  const actions = useSfaActions(props)
  const profile = props.securityProfile || {}
  const [form, setForm] = useState({ answer: '', old: '', next: '', confirm: '' })
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const securityRecoveryCredentials = recoveryCredentialsFor('security', {
    securityConfigured: Boolean(profile.configured && profile.answer),
    googleBound: props.googleBound !== false,
  })
  const [recoveryMethod, setRecoveryMethod] = useState(recoveryCredentialPairAvailable(securityRecoveryCredentials) ? 'credentials' : 'transfer')
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = () => {
    if (!profile.configured || !profile.answer) return actions.notify('当前未设置密保，请先完成密保设置')
    if (!form.answer.trim()) return actions.notify('请输入密保答案')
    if (!answerMatches(profile, form.answer)) return actions.notify('密保答案不正确')
    if (form.old.length < 6) return actions.notify('请输入旧登录密码')
    if (form.next.length < 6 || form.next.length > 20) return actions.notify('新登录密码需为6-20位')
    if (form.next !== form.confirm) return actions.notify('两次新登录密码不一致')
    setForm({ answer: '', old: '', next: '', confirm: '' })
    actions.notify('密保与旧密码验证通过，登录密码已修改', 'success')
  }

  const recoverSecurity = ({ amount, currency } = {}) => {
    setRecoveryOpen(false)
    props.setSecurityProfile?.({ configured: false, question: '', answer: '', tip: '', resetGranted: true })
    actions.notify(amount ? `${amount} ${currency} 已计入钱包，请重新设置密保` : '两项凭据验证通过，请重新设置密保', 'success')
    actions.go('/pages/security/security-question')
  }

  const openSecurityRecovery = () => {
    setRecoveryMethod(recoveryCredentialPairAvailable(securityRecoveryCredentials) ? 'credentials' : 'transfer')
    setRecoveryOpen(true)
  }

  const pageBottom = recoveryOpen
    ? null
    : profile.configured
      ? <PrimaryButton onClick={submit}>确认修改</PrimaryButton>
      : <PrimaryButton onClick={() => actions.go('/pages/security/security-question')}>先设置密保</PrimaryButton>

  return (
    <PageShell title={recoveryOpen ? '找回密保' : '修改登录密码'} onBack={recoveryOpen ? () => setRecoveryOpen(false) : actions.back} message={actions.localMessage} bottom={pageBottom}>
      <StorefrontRequirementEntry path="/front/pages/security/login-password" />
      {recoveryOpen ? (
        <>
          <Hint>找回密保提供两条独立路径：固定验证“登录密码＋资金密码”，或使用绑定地址充值验证。密保不能参与验证自己。</Hint>
          <Segmented items={[{ value: 'credentials', label: '双凭据找回' }, { value: 'transfer', label: '绑定地址充值找回' }]} value={recoveryMethod} onChange={setRecoveryMethod} />
          {recoveryMethod === 'credentials' ? <CredentialPairRecoveryPanel
            identityKey="login-password-security-recovery"
            targetLabel="密保"
            availableCredentials={securityRecoveryCredentials}
            actionText="验证并找回密保"
            beforeVerify={(payload) => validateRecoveryCredentialValues(payload, profile, actions.notify)}
            onVerified={recoverSecurity}
          /> : <SecurityRecoveryPanel
            identityKey="login-password-security-recovery"
            title="绑定地址充值找回"
            purpose="演示到账后将密保恢复为未设置状态"
            actionText="我已转账并找回密保"
            onVerified={recoverSecurity}
          />}
        </>
      ) : profile.configured ? <>
        <Card className="sfa-security-form-card">
          <SectionTitle>密保与旧密码验证</SectionTitle>
          <SecurityQuestionDisplay profile={profile} />
          <Field label="密保答案" value={form.answer} onChange={(value) => update('answer', value)} placeholder="请输入密保答案" right={<button type="button" onClick={openSecurityRecovery}>忘记密保？</button>} />
          <PasswordField label="旧登录密码" value={form.old} onChange={(value) => update('old', value)} placeholder="请输入旧登录密码" right={<button type="button" onClick={() => actions.go('/pages/login/recover-password')}>忘记密码？</button>} />
          <PasswordField label="新登录密码" value={form.next} onChange={(value) => update('next', value)} placeholder="请输入6-20位新密码" />
          <PasswordField label="确认新登录密码" value={form.confirm} onChange={(value) => update('confirm', value)} placeholder="请再次输入新密码" />
        </Card>
        <Hint>修改登录密码必须同时验证当前密保答案和旧登录密码。</Hint>
      </> : <>
        <Card className="sfa-security-form-card">
          <SectionTitle>请先完善密保</SectionTitle>
          <Hint tone="warning">当前账户尚未设置密保，不能显示虚拟问题或跳过验证修改登录密码。</Hint>
          <div className="sfa-security-submit"><GhostButton onClick={() => actions.go('/pages/security/security-question')}>设置密保</GhostButton></div>
        </Card>
      </>}
    </PageShell>
  )
}

function FundPasswordPage(props) {
  const actions = useSfaActions(props)
  const profile = props.securityProfile || {}
  const initialRecover = String(props.path || '').includes('recover=1')
  const fundRecoveryCredentials = recoveryCredentialsFor('fund', {
    securityConfigured: Boolean(profile.configured && profile.answer),
    googleBound: props.googleBound !== false,
  })
  const [method, setMethod] = useState(initialRecover ? (recoveryCredentialPairAvailable(fundRecoveryCredentials) ? 'credentials' : 'transfer') : 'modify')
  const [form, setForm] = useState({ old: '', next: '', confirm: '', google: '', answer: '' })
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const validateNewFund = () => {
    if (!/^\d{6}$/.test(form.next)) {
      actions.notify('新资金密码必须为6位数字')
      return false
    }
    if (form.next !== form.confirm) {
      actions.notify('两次新资金密码不一致')
      return false
    }
    return true
  }

  const submitModify = () => {
    if (!/^\d{6}$/.test(form.old)) return actions.notify('请输入6位旧资金密码')
    if (!validateNewFund()) return
    if (!/^\d{6}$/.test(form.google)) return actions.notify('请输入6位谷歌验证码')
    setForm({ old: '', next: '', confirm: '', google: '', answer: '' })
    actions.notify('旧资金密码与谷歌验证通过，资金密码已修改', 'success')
  }

  const finishCredentialRecovery = () => {
    setForm({ old: '', next: '', confirm: '', google: '', answer: '' })
    setMethod('modify')
    actions.notify('两项凭据验证通过，资金密码已重置', 'success')
  }

  const finishTransfer = ({ amount, currency } = {}) => {
    setForm({ old: '', next: '', confirm: '', google: '', answer: '' })
    setMethod('modify')
    actions.notify(`${amount || ''}${amount ? ` ${currency}` : ''} 已计入钱包，资金密码已重置`, 'success')
  }

  const pageBottom = method === 'modify'
    ? <PrimaryButton onClick={submitModify}>确认修改</PrimaryButton>
    : null

  return (
    <PageShell title={method === 'modify' ? '修改资金密码' : '找回资金密码'} onBack={actions.back} message={actions.localMessage} bottom={pageBottom}>
      <StorefrontRequirementEntry path="/front/pages/security/recharge-password" />
      <Segmented items={[{ value: 'modify', label: '正常修改' }, { value: 'credentials', label: '双凭据找回' }, { value: 'transfer', label: '充值找回' }]} value={method} onChange={(value) => { setMethod(value); setForm({ old: '', next: '', confirm: '', google: '', answer: '' }) }} />
      {method === 'modify' ? <Card className="sfa-security-form-card">
        <PasswordField label="旧资金密码" value={form.old} onChange={(value) => update('old', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入旧资金密码" right={<button type="button" onClick={() => setMethod('credentials')}>忘记密码？</button>} />
        <PasswordField label="新资金密码" value={form.next} onChange={(value) => update('next', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位新资金密码" />
        <PasswordField label="确认新资金密码" value={form.confirm} onChange={(value) => update('confirm', value.replace(/\D/g, '').slice(0, 6))} placeholder="请再次输入新资金密码" />
        <Field label="谷歌验证码" value={form.google} onChange={(value) => update('google', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位谷歌验证码" />
      </Card> : <>
        <Hint>找回资金密码提供两条独立路径：固定验证“密保答案＋登录密码”，或使用绑定地址充值验证；资金密码不会参与验证自己。</Hint>
        <Card className="sfa-security-form-card">
          <SectionTitle>设置新资金密码</SectionTitle>
          <PasswordField label="新资金密码" value={form.next} onChange={(value) => update('next', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位新资金密码" />
          <PasswordField label="确认新资金密码" value={form.confirm} onChange={(value) => update('confirm', value.replace(/\D/g, '').slice(0, 6))} placeholder="请再次输入新资金密码" />
        </Card>
        {method === 'credentials' ? <CredentialPairRecoveryPanel
          identityKey="fund-password-recovery"
          targetLabel="资金密码"
          availableCredentials={fundRecoveryCredentials}
          actionText="验证并重置资金密码"
          beforeVerify={(payload) => validateNewFund() && validateRecoveryCredentialValues(payload, profile, actions.notify)}
          onVerified={finishCredentialRecovery}
        /> : <SecurityRecoveryPanel
          identityKey={props.memberId || 'current-member'}
          title="绑定地址充值找回"
          purpose="演示到账后自动验证并重置资金密码"
          actionText="我已转账并重置资金密码"
          beforeVerify={validateNewFund}
          onVerified={finishTransfer}
        />}
      </>}
    </PageShell>
  )
}

function SecurityQuestionPage(props) {
  const actions = useSfaActions(props)
  const securityProfile = props.securityProfile || {}
  const securityConfigured = Boolean(securityProfile.configured)
  const suggestedQuestion = SECURITY_QUESTIONS.find((item) => item !== securityProfile.question) || SECURITY_QUESTIONS[0]
  const [stage, setStage] = useState(securityConfigured ? 'change' : 'setup')
  const [verificationMode, setVerificationMode] = useState('fund')
  const [oldAnswer, setOldAnswer] = useState('')
  const [question, setQuestion] = useState(securityConfigured ? suggestedQuestion : SECURITY_QUESTIONS[2])
  const [questionSheet, setQuestionSheet] = useState(false)
  const [answer, setAnswer] = useState('')
  const [tip, setTip] = useState('')
  const [fund, setFund] = useState('')
  const [googleCode, setGoogleCode] = useState('')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const securityRecoveryCredentials = recoveryCredentialsFor('security', {
    securityConfigured,
    googleBound: props.googleBound !== false,
  })
  const [recoveryMethod, setRecoveryMethod] = useState(recoveryCredentialPairAvailable(securityRecoveryCredentials) ? 'credentials' : 'transfer')

  useEffect(() => {
    setStage(securityConfigured ? 'change' : 'setup')
    setVerificationMode('fund')
    setOldAnswer('')
    setAnswer('')
    setTip('')
    setFund('')
    setGoogleCode('')
    setQuestion(securityConfigured ? suggestedQuestion : SECURITY_QUESTIONS[2])
  }, [securityConfigured])

  const recoveredByVerification = Boolean(securityProfile.resetGranted)
  const initialSetupNeedsFund = stage === 'setup' && !recoveredByVerification
  const setupReady = Boolean(question && answer.trim() && tip.trim() && (!initialSetupNeedsFund || /^\d{6}$/.test(fund)))
  const changeReady = Boolean(oldAnswer.trim() && question && answer.trim() && tip.trim() && (
    verificationMode === 'fund' ? /^\d{6}$/.test(fund) : /^\d{6}$/.test(googleCode)
  ))

  const saveNewSecurity = () => {
    if (stage === 'change') {
      if (!oldAnswer.trim()) return actions.notify('请输入当前密保答案')
      if (!answerMatches(securityProfile, oldAnswer)) return actions.notify('当前密保答案不正确')
      if (verificationMode === 'fund' && !/^\d{6}$/.test(fund)) return actions.notify('请输入6位资金密码')
      if (verificationMode === 'google' && props.googleBound === false) return actions.notify('当前未绑定谷歌验证器，请改用资金密码验证')
      if (verificationMode === 'google' && !/^\d{6}$/.test(googleCode)) return actions.notify('请输入6位谷歌验证码')
    }
    if (!question || !answer.trim() || !tip.trim()) return actions.notify('请完整填写密保问题、答案和提示')
    if (initialSetupNeedsFund && !/^\d{6}$/.test(fund)) return actions.notify('首次设置密保需验证6位资金密码')
    const wasConfigured = securityConfigured
    props.setSecurityProfile?.({
      ...securityProfile,
      configured: true,
      question,
      answer: answer.trim(),
      tip: tip.trim(),
      resetGranted: false,
      updatedAt: new Date().toISOString(),
    })
    actions.notify(wasConfigured ? '密保更换成功' : '密保设置成功', 'success')
    actions.back()
  }

  const finishRecovery = ({ amount, currency } = {}) => {
    props.setSecurityProfile?.({
      ...securityProfile,
      configured: false,
      question: '',
      answer: '',
      tip: '',
      resetGranted: true,
    })
    setRecoveryOpen(false)
    setStage('setup')
    setOldAnswer('')
    setFund('')
    setGoogleCode('')
    actions.notify(amount ? `${amount} ${currency} 已计入钱包，密保已恢复为未设置` : '两项凭据验证通过，密保已恢复为未设置', 'success')
  }

  const openSecurityRecovery = () => {
    setRecoveryMethod(recoveryCredentialPairAvailable(securityRecoveryCredentials) ? 'credentials' : 'transfer')
    setRecoveryOpen(true)
  }

  return (
    <PageShell title={recoveryOpen ? '找回密保' : securityConfigured ? '更换密保' : '设置密保'} onBack={recoveryOpen ? () => setRecoveryOpen(false) : actions.back} message={actions.localMessage}>
      <StorefrontRequirementEntry path="/front/pages/security/security-question" />
      {recoveryOpen ? <>
        <Hint>找回密保有两种方式：使用“登录密码＋资金密码”固定组合验证，或使用绑定地址按指定金额充值验证。验证成功后旧密保清空并进入重新设置。</Hint>
        <Segmented items={[{ value: 'credentials', label: '双凭据找回' }, { value: 'transfer', label: '绑定地址充值找回' }]} value={recoveryMethod} onChange={setRecoveryMethod} />
        {recoveryMethod === 'credentials' ? <CredentialPairRecoveryPanel
          identityKey="security-question-recovery"
          targetLabel="密保"
          availableCredentials={securityRecoveryCredentials}
          actionText="验证并找回密保"
          beforeVerify={(payload) => validateRecoveryCredentialValues(payload, securityProfile, actions.notify)}
          onVerified={finishRecovery}
        /> : <SecurityRecoveryPanel
          identityKey={props.memberId || 'current-member'}
          title="绑定地址充值找回"
          purpose="演示到账后将密保恢复为未设置状态"
          actionText="我已转账并找回密保"
          onVerified={finishRecovery}
        />}
      </> : stage === 'change' ? <>
        <Card className="sfa-security-form-card">
          <SectionTitle>身份验证</SectionTitle>
          <SecurityQuestionDisplay profile={securityProfile} />
          <Field label="当前密保答案" value={oldAnswer} onChange={setOldAnswer} placeholder="请输入当前答案" right={<button type="button" onClick={openSecurityRecovery}>忘记密保？</button>} />
          <Segmented
            items={[{ value: 'fund', label: '资金密码验证' }, ...(props.googleBound === false ? [] : [{ value: 'google', label: '谷歌验证' }])]}
            value={verificationMode}
            onChange={(value) => { setVerificationMode(value); setFund(''); setGoogleCode('') }}
            compact
          />
          {verificationMode === 'fund'
            ? <PasswordField label="资金密码" value={fund} onChange={(value) => setFund(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" />
            : <Field label="谷歌验证码" value={googleCode} onChange={(value) => setGoogleCode(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位谷歌验证码" />}
          <Hint>当前密保答案与资金密码或谷歌验证码任选一组完成身份确认。</Hint>
        </Card>
        <Card className="sfa-security-form-card">
          <SectionTitle>设置新密保</SectionTitle>
          <SelectField label="新密保问题" value={question} onClick={() => setQuestionSheet(true)} />
          <Field label="新密保答案" value={answer} onChange={setAnswer} placeholder="请输入新的密保答案" />
          <Field label="新密保提示" value={tip} onChange={setTip} placeholder="请输入密保提示" />
          <div className="sfa-security-submit"><PrimaryButton disabled={!changeReady} onClick={saveNewSecurity}>确认更换</PrimaryButton></div>
        </Card>
      </> : <Card className="sfa-security-form-card">
        {recoveredByVerification ? <Hint tone="success">身份验证已通过，请直接设置新的密保。</Hint> : null}
        <SectionTitle>请选择密保问题</SectionTitle>
        <SelectField label="" value={question} onClick={() => setQuestionSheet(true)} />
        <Field label="密保答案" value={answer} onChange={setAnswer} placeholder="请输入新的密保答案" />
        <Field label="密保提示" value={tip} onChange={setTip} placeholder="请输入密保提示" />
        {initialSetupNeedsFund ? <PasswordField label="资金密码" value={fund} onChange={(value) => setFund(value.replace(/\D/g, '').slice(0, 6))} placeholder="首次设置请输入6位资金密码" /> : null}
        <div className="sfa-security-submit"><PrimaryButton disabled={!setupReady} onClick={saveNewSecurity}>确定</PrimaryButton></div>
      </Card>}
      <button className="sfa-service-link" type="button" onClick={() => actions.go('/pages/service/index')}>如需帮助，请联系客服</button>
      <SelectSheet open={questionSheet} title="选择密保问题" options={SECURITY_QUESTIONS} value={question} onClose={() => setQuestionSheet(false)} onSelect={(value) => { setQuestion(value); setQuestionSheet(false) }} />
    </PageShell>
  )
}

function OnboardingPage(props) {
  const actions = useSfaActions(props)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ old: '', next: '', confirm: '', question: SECURITY_QUESTIONS[0], answer: '', tip: '', fund: '' })
  const [questions, setQuestions] = useState(false)
  const [google, setGoogle] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const next = () => {
    if (!form.old || form.next.length < 6 || form.next !== form.confirm) return actions.notify('请正确填写并确认新登录密码')
    setStep(2)
    actions.notify('登录密码已修改，请继续设置安全信息', 'success')
  }

  const finish = () => {
    if (!form.answer.trim() || !/^\d{6}$/.test(form.fund)) return actions.notify('请完整填写密保和6位资金密码')
    setGoogle(true)
  }

  return (
    <PageShell title="账户安全设置" subtitle={`步骤 ${step}/2`} onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton onClick={step === 1 ? next : finish}>{step === 1 ? '下一步' : '完成设置'}</PrimaryButton>}>
      <Card className="sfa-step-card"><div className={step >= 1 ? 'is-active' : ''}><b>1</b><span>修改登录密码</span></div><i /><div className={step >= 2 ? 'is-active' : ''}><b>2</b><span>资金密码和密保</span></div></Card>
      <Card>{step === 1 ? <><SectionTitle>修改初始登录密码</SectionTitle><PasswordField label="初始密码" value={form.old} onChange={(value) => update('old', value)} /><PasswordField label="新登录密码" value={form.next} onChange={(value) => update('next', value)} placeholder="请输入新登录密码（6-20位）" /><PasswordField label="确认新登录密码" value={form.confirm} onChange={(value) => update('confirm', value)} /></> : <><SectionTitle>设置资金密码和密保</SectionTitle><SelectField label="密保问题" value={form.question} onClick={() => setQuestions(true)} /><Field label="密保答案" value={form.answer} onChange={(value) => update('answer', value)} /><Field label="密保提示（可选）" value={form.tip} onChange={(value) => update('tip', value)} /><PasswordField label="资金密码" value={form.fund} onChange={(value) => update('fund', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" /></>}</Card>
      <SelectSheet open={questions} title="选择密保问题" options={SECURITY_QUESTIONS} value={form.question} onClose={() => setQuestions(false)} onSelect={(value) => { update('question', value); setQuestions(false) }} />
      <GoogleVerificationModal open={google} purpose="完成账户安全设置" onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); props.setSecurityProfile?.({ ...(props.securityProfile || {}), configured: true, question: form.question, answer: form.answer.trim(), tip: form.tip.trim(), resetGranted: false, updatedAt: new Date().toISOString() }); actions.notify('安全设置完成', 'success'); actions.go('/pages/user/user') }} />
    </PageShell>
  )
}

function GoogleAuthenticatorPage(props) {
  const actions = useSfaActions(props)
  const initialBound = props.googleBound ?? props.initialBound ?? true
  const openRecoveryFromLogin = String(props.path || '').includes('recovery=1')
  const recoveryAccountFromQuery = new URLSearchParams(String(props.path || '').split('?')[1] || '').get('account') || ''
  const [bound, setBound] = useState(Boolean(initialBound))
  const [step, setStep] = useState(bound ? 'manage' : 'bind')
  const [form, setForm] = useState({ fund: '', answer: '', login: '', oldCode: '', newCode: '' })
  const [recoveryAccount, setRecoveryAccount] = useState(recoveryAccountFromQuery)
  const recoveryEntryHandled = useRef(false)
  const securityProfile = props.securityProfile || {}
  const googleRecoveryCredentials = recoveryCredentialsFor('google', {
    securityConfigured: Boolean(securityProfile.configured && securityProfile.answer),
    googleBound: bound,
  })
  const [recoveryMethod, setRecoveryMethod] = useState(recoveryCredentialPairAvailable(googleRecoveryCredentials) ? 'credentials' : 'transfer')
  const secret = 'G6DE MOSE CRET 2026'
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const clearForm = () => setForm({ fund: '', answer: '', login: '', oldCode: '', newCode: '' })

  useEffect(() => {
    if (typeof props.googleBound !== 'boolean') return
    setBound(props.googleBound)
    setStep(props.googleBound ? 'manage' : 'bind')
    clearForm()
  }, [props.googleBound])

  useEffect(() => {
    if (openRecoveryFromLogin && bound && !recoveryEntryHandled.current) {
      recoveryEntryHandled.current = true
      setStep('unbind')
    }
  }, [bound, openRecoveryFromLogin])

  const updateBound = (nextBound) => {
    setBound(nextBound)
    props.setGoogleBound?.(nextBound)
  }

  const validateFundAndSecurity = () => {
    if (!/^\d{6}$/.test(form.fund)) {
      actions.notify('请输入6位资金密码')
      return false
    }
    if (!form.answer.trim()) {
      actions.notify('请输入密保答案')
      return false
    }
    if (!securityProfile.configured || !securityProfile.answer) {
      actions.notify('当前未设置密保，请先完成密保设置')
      return false
    }
    if (!answerMatches(securityProfile, form.answer)) {
      actions.notify('密保答案不正确')
      return false
    }
    return true
  }

  const bindGoogle = () => {
    if (!validateFundAndSecurity()) return
    if (!/^\d{6}$/.test(form.newCode)) return actions.notify('请输入新谷歌验证器显示的6位验证码')
    updateBound(true)
    setStep('manage')
    clearForm()
    actions.notify('资金密码、密保和新谷歌验证码均已通过，绑定成功', 'success')
  }

  const changeGoogle = () => {
    if (!validateFundAndSecurity()) return
    if (!/^\d{6}$/.test(form.oldCode)) return actions.notify('请输入旧谷歌验证器的6位验证码')
    if (!/^\d{6}$/.test(form.newCode)) return actions.notify('请输入新谷歌验证器的6位验证码')
    if (form.oldCode === form.newCode) return actions.notify('新旧谷歌验证码不能相同')
    setStep('manage')
    clearForm()
    actions.notify('资金密码、密保及新旧谷歌验证码验证通过，更换成功', 'success')
  }

  const validateRecoveryAccount = () => {
    if (!openRecoveryFromLogin) return true
    if (!/^[A-Za-z0-9]{6,16}$/.test(recoveryAccount.trim())) {
      actions.notify('请输入6-16位字母或数字会员账号')
      return false
    }
    return true
  }

  const finishGoogleRecovery = ({ amount, currency } = {}) => {
    updateBound(false)
    setStep('bind')
    clearForm()
    actions.notify(amount ? `${amount} ${currency} 已计入钱包，谷歌验证已恢复为未绑定` : '两项凭据验证通过，谷歌验证已恢复为未绑定', 'success')
  }

  const verifyGoogleCredentialPair = (payload) => {
    if (!validateRecoveryAccount()) return false
    return validateRecoveryCredentialValues(payload, securityProfile, actions.notify)
  }

  const cancelManageAction = () => {
    clearForm()
    setStep(bound ? 'manage' : 'bind')
    actions.notify('已取消本次操作')
  }

  const cancelGoogleRecovery = () => {
    if (openRecoveryFromLogin) {
      actions.back()
      return
    }
    cancelManageAction()
  }

  return (
    <PageShell title={step === 'unbind' ? '找回/解绑谷歌验证' : '谷歌验证器'} onBack={step === 'unbind' ? cancelGoogleRecovery : actions.back} message={actions.localMessage}>
      <StorefrontRequirementEntry path="/front/pages/security/google-authenticator" />
      {step === 'bind' ? <>
        <Card className="sfa-security-intro"><div className="sfa-security-emblem"><ShieldCheck size={31} /></div><h2>绑定谷歌验证器</h2><p>使用验证器扫描二维码，再同时验证资金密码、密保答案和新谷歌验证码。</p></Card>
        <Card className="sfa-google-setup">
          <SectionTitle>扫描新验证器二维码</SectionTitle>
          <QrPlaceholder label="G6哈希演示" />
          <CopyLine label="手工输入密钥" value={secret} onCopy={() => actions.copy(secret, '演示密钥')} />
          <PasswordField label="资金密码" value={form.fund} onChange={(value) => update('fund', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" right={<button type="button" onClick={() => actions.go('/pages/security/recharge-password?recover=1')}>忘记密码？</button>} />
          <SecurityQuestionDisplay profile={securityProfile} />
          <Field label="密保答案" value={form.answer} onChange={(value) => update('answer', value)} placeholder="请输入密保答案" right={<button type="button" onClick={() => actions.go('/pages/security/security-question')}>忘记密保？</button>} />
          <Field label="新谷歌验证码" value={form.newCode} onChange={(value) => update('newCode', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入新验证器显示的6位验证码" />
          <PrimaryButton onClick={bindGoogle}>确认绑定</PrimaryButton>
        </Card>
      </> : null}

      {step === 'manage' ? <>
        <Card className="sfa-security-banner"><div className="sfa-security-emblem"><ShieldCheck size={31} /></div><div><strong>谷歌验证器已绑定</strong><small>账户动态验证保护已开启</small></div><Badge tone="success">已绑定</Badge></Card>
        <Card className="sfa-action-list">
          <ActionRow title="更换谷歌验证器" subtitle="需资金密码、密保答案及新旧谷歌验证码" onClick={() => { clearForm(); setStep('change') }} />
          <ActionRow title="重置/解绑谷歌验证" subtitle="双凭据验证或绑定地址充值验证，成功后恢复未绑定" danger onClick={() => { clearForm(); setRecoveryMethod(recoveryCredentialPairAvailable(googleRecoveryCredentials) ? 'credentials' : 'transfer'); setStep('unbind') }} />
        </Card>
        <Hint>无法使用旧验证器时，可使用“密保答案＋资金密码”固定组合验证，或使用绑定地址充值验证。</Hint>
      </> : null}

      {step === 'change' ? <Card className="sfa-google-setup">
        <SectionTitle>更换谷歌验证器</SectionTitle>
        <QrPlaceholder label="新谷歌验证器" />
        <CopyLine label="新验证器演示密钥" value={secret} onCopy={() => actions.copy(secret, '新演示密钥')} />
        <PasswordField label="资金密码" value={form.fund} onChange={(value) => update('fund', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" />
        <SecurityQuestionDisplay profile={securityProfile} />
        <Field label="密保答案" value={form.answer} onChange={(value) => update('answer', value)} placeholder="请输入密保答案" />
        <Field label="旧谷歌验证码" value={form.oldCode} onChange={(value) => update('oldCode', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入旧验证器显示的6位验证码" />
        <Field label="新谷歌验证码" value={form.newCode} onChange={(value) => update('newCode', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入新验证器显示的6位验证码" />
        <PrimaryButton onClick={changeGoogle}>确认更换</PrimaryButton>
        <GhostButton onClick={cancelManageAction}>取消</GhostButton>
      </Card> : null}

      {step === 'unbind' ? <>
        {openRecoveryFromLogin ? <Card className="sfa-security-form-card">
          <Field label="会员账号" value={recoveryAccount} onChange={(value) => setRecoveryAccount(value.replace(/[^A-Za-z0-9]/g, '').slice(0, 16))} placeholder="请输入6-16位会员账号" />
        </Card> : null}
        <Hint tone="warning">找回谷歌验证提供两条独立路径：固定验证“密保答案＋资金密码”，或使用绑定地址充值验证；成功后只恢复为未绑定状态。</Hint>
        <Segmented items={[{ value: 'credentials', label: '双凭据找回' }, { value: 'transfer', label: '绑定地址充值找回' }]} value={recoveryMethod} onChange={setRecoveryMethod} />
        {recoveryMethod === 'credentials' ? <CredentialPairRecoveryPanel
          identityKey={`google-recovery-${recoveryAccount || 'current-member'}`}
          targetLabel="谷歌验证"
          availableCredentials={googleRecoveryCredentials}
          actionText="验证并解绑谷歌验证"
          beforeVerify={verifyGoogleCredentialPair}
          onVerified={finishGoogleRecovery}
        /> : <SecurityRecoveryPanel
          identityKey={`google-recovery-${recoveryAccount || 'current-member'}`}
          title="绑定地址充值找回"
          purpose="演示到账后将谷歌验证恢复为未绑定状态"
          actionText="我已转账并解绑谷歌验证"
          beforeVerify={validateRecoveryAccount}
          onVerified={finishGoogleRecovery}
        />}
        <GhostButton onClick={cancelGoogleRecovery}>取消</GhostButton>
      </> : null}
    </PageShell>
  )
}
