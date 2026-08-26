import { useMemo, useState } from 'react'
import { CreditCard, KeyRound, Landmark, LockKeyhole, Mail, ShieldCheck, Smartphone, UserRoundCheck, Wallet } from 'lucide-react'
import { BANKS, SECURITY_MENU, SECURITY_QUESTIONS } from './accountData'
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

  return (
    <PageShell title="安全中心" onBack={actions.back} message={actions.localMessage}>
      <Card className="sfa-security-banner"><div className="sfa-security-emblem"><ShieldCheck size={31} /></div><div><strong>账户保护已开启</strong><small>建议定期检查安全配置与恢复码</small></div><Badge tone="success">安全</Badge></Card>
      <SectionTitle>账户安全</SectionTitle>
      <Card className="sfa-action-list">{SECURITY_MENU.map((item) => <ActionRow key={item.id} title={item.title} subtitle={item.subtitle} status={item.status} icon={securityIcons[item.id]} onClick={() => actions.go(item.route)} />)}</Card>
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
  const [type, setType] = useState(initialType)
  const [formOpen, setFormOpen] = useState(Boolean(props?.type))
  const [fundPassword, setFundPassword] = useState('')
  const [question, setQuestion] = useState(SECURITY_QUESTIONS[0])
  const [answer, setAnswer] = useState('')
  const [questionSheet, setQuestionSheet] = useState(false)
  const [bankSheet, setBankSheet] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const [google, setGoogle] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)
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

  const chooseType = (value) => {
    const item = accountTypes.find((candidate) => candidate.value === value)
    if (item?.disabled) return actions.notify(`${item.label}暂未开放`)
    setType(value)
    setFormOpen(false)
  }

  const validate = () => {
    const form = forms[type]
    if (type === 'trc20' && !/^T[A-Za-z0-9]{20,}$/.test(form.address)) return actions.notify('请输入正确的TRC20地址')
    if (type === 'alipay' && (!form.name.trim() || !form.account.trim())) return actions.notify('请填写完整绑定信息')
    if (type === 'bank' && (!form.bank || !form.name.trim() || !form.card.trim())) return actions.notify('请填写完整银行卡信息')
    if (!/^\d{6}$/.test(fundPassword)) return actions.notify('请输入6位资金密码')
    if (!answer.trim()) return actions.notify('请输入密保答案')
    setPendingPayload(form)
    setGoogle(true)
  }

  const finishBind = () => {
    const value = type === 'trc20' ? forms.trc20.address : type === 'alipay' ? `${forms.alipay.name} · ${forms.alipay.account}` : `${forms.bank.bank} · ${forms.bank.card}`
    setBindings((current) => ({ ...current, [type]: [...(current[type] || []), value] }))
    setGoogle(false)
    setFormOpen(false)
    setFundPassword('')
    setAnswer('')
    actions.notify(`绑定${typeLabel}成功`, 'success')
  }

  return (
    <PageShell title="账户管理" onBack={actions.back} message={actions.localMessage} right={<button className="sfa-header-link" type="button" onClick={() => actions.go('/pages/service/index')}>帮助</button>}>
      <PillTabs items={accountTypes} value={type} onChange={chooseType} />
      <SectionTitle action="+添加" onAction={() => setFormOpen(true)}>我的{typeLabel}</SectionTitle>
      {currentBindings.length ? <Card className="sfa-binding-list">{currentBindings.map((binding, index) => <div key={`${binding}-${index}`}><span className="sfa-action-icon">{accountTypes.find((item) => item.value === type)?.icon}</span><span><strong>{binding}</strong><small>{type === 'trc20' ? 'TRC20协议' : '已完成安全验证'}</small></span><Badge tone="success">已绑定</Badge></div>)}</Card> : <EmptyState title={`暂无${typeLabel}`} description="点击右上角添加新的收款账户" action="+添加" onAction={() => setFormOpen(true)} />}
      <Hint tone="warning">为了您的资金安全，请确保绑定信息真实、准确。所有操作均为本地演示，不会写入真实账户。</Hint>

      <Modal open={formOpen} title={`绑定${typeLabel}`} onClose={() => setFormOpen(false)} footer={<PrimaryButton onClick={validate}>确认绑定</PrimaryButton>}>
        {type === 'trc20' ? <><SelectField label="币种选择" value="USDT · TRC20协议" onClick={() => actions.notify('当前仅支持TRC20协议')} /><Field label="USDT-TRC20地址" value={forms.trc20.address} onChange={(value) => updateForm('address', value)} placeholder="请输入TRC20地址" right={<button type="button" onClick={() => { updateForm('address', 'TV8uQp7N2k6QZB8G6HashDemoV6Y2P3s'); actions.notify('已粘贴演示地址') }}>粘贴</button>} /></> : null}
        {type === 'alipay' ? <><Field label="姓名" value={forms.alipay.name} onChange={(value) => updateForm('name', value)} placeholder="请输入支付宝真实姓名" /><Field label="支付宝账号" value={forms.alipay.account} onChange={(value) => updateForm('account', value)} placeholder="请输入支付宝账号" /></> : null}
        {type === 'bank' ? <><SelectField label="开户银行" value={forms.bank.bank} onClick={() => setBankSheet(true)} /><Field label="姓名" value={forms.bank.name} onChange={(value) => updateForm('name', value)} placeholder="请输入持卡人姓名" /><Field label="银行卡号" value={forms.bank.card} onChange={(value) => updateForm('card', value.replace(/\D/g, ''))} placeholder="请输入银行卡号" /><div className="sfa-two-columns"><Field label="开户省份（选填）" value={forms.bank.province} onChange={(value) => updateForm('province', value)} /><Field label="开户城市（选填）" value={forms.bank.city} onChange={(value) => updateForm('city', value)} /></div><Field label="开户支行（选填）" value={forms.bank.branch} onChange={(value) => updateForm('branch', value)} /></> : null}
        <PasswordField label="资金密码" value={fundPassword} onChange={(value) => setFundPassword(value.replace(/\D/g, '').slice(0, 6))} />
        <SelectField label="密保问题" value={question} onClick={() => setQuestionSheet(true)} />
        <Field label="密保答案" value={answer} onChange={setAnswer} placeholder="请输入答案" />
      </Modal>
      <SelectSheet open={questionSheet} title="选择密保问题" options={SECURITY_QUESTIONS} value={question} onClose={() => setQuestionSheet(false)} onSelect={(value) => { setQuestion(value); setQuestionSheet(false) }} />
      <Modal open={bankSheet} title="选择开户银行" onClose={() => setBankSheet(false)}>
        <SearchBox value={bankSearch} onChange={setBankSearch} placeholder="搜索银行名称、简称或编码" onSearch={() => actions.notify(filteredBanks.length ? `找到${filteredBanks.length}家银行` : '没有匹配的银行')} />
        {filteredBanks.length ? <div className="sfa-option-list">{filteredBanks.map((bank) => <button type="button" key={bank} onClick={() => { updateForm('bank', bank); setBankSheet(false) }}><span><strong>{bank}</strong></span></button>)}</div> : <EmptyState title="没有匹配的银行" />}
      </Modal>
      <GoogleVerificationModal open={google} purpose={`绑定${typeLabel}`} onClose={() => setGoogle(false)} onVerified={finishBind} />
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
  return <BasicSecurityForm {...props} mode={mode} />
}

function BasicSecurityForm({ mode, ...props }) {
  const actions = useSfaActions(props)
  const [form, setForm] = useState({ email: '', code: '', old: '', next: '', confirm: '', fund: '' })
  const [google, setGoogle] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const validate = () => {
    if (mode === 'email') {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return actions.notify('请输入正确邮箱地址')
      if (form.code.length < 4) return actions.notify('请输入邮箱验证码')
    } else {
      if (!form.old) return actions.notify(mode === 'recharge-password' ? '请输入旧资金密码' : '请输入旧登录密码')
      if (mode === 'recharge-password' && !/^\d{6}$/.test(form.next)) return actions.notify('资金密码必须为6位数字')
      if (mode === 'login-password' && (form.next.length < 6 || form.next.length > 20)) return actions.notify('新密码需为6-20位')
      if (form.next !== form.confirm) return actions.notify('两次新密码不一致')
    }
    if (!/^\d{6}$/.test(form.fund) && mode !== 'recharge-password') return actions.notify('请输入6位资金密码')
    setGoogle(true)
  }

  return (
    <PageShell title={formTitles[mode]} onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton onClick={validate}>确定</PrimaryButton>}>
      <Card>
        {mode === 'email' ? <><Field label="邮箱地址" value={form.email} onChange={(value) => update('email', value)} placeholder="请输入邮箱地址" /><Field label="验证码" value={form.code} onChange={(value) => update('code', value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入邮箱验证码" right={<button type="button" onClick={() => { if (!/^\S+@\S+\.\S+$/.test(form.email)) return actions.notify('请输入正确邮箱地址'); setCodeSent(true); actions.notify('验证码已发送', 'success') }}>{codeSent ? '重新发送' : '发送验证码'}</button>} /></> : <><PasswordField label={mode === 'recharge-password' ? '旧资金密码' : '旧登录密码'} value={form.old} onChange={(value) => update('old', value)} /><PasswordField label={mode === 'recharge-password' ? '新资金密码' : '新登录密码'} value={form.next} onChange={(value) => update('next', mode === 'recharge-password' ? value.replace(/\D/g, '').slice(0, 6) : value)} /><PasswordField label="确认新密码" value={form.confirm} onChange={(value) => update('confirm', mode === 'recharge-password' ? value.replace(/\D/g, '').slice(0, 6) : value)} /></>}
        {mode !== 'recharge-password' ? <PasswordField label="资金密码" value={form.fund} onChange={(value) => update('fund', value.replace(/\D/g, '').slice(0, 6))} /> : null}
      </Card>
      <button className="sfa-service-link" type="button" onClick={() => actions.go('/pages/service/index')}>如需帮助，请联系客服</button>
      <GoogleVerificationModal open={google} purpose={formTitles[mode]} onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); setForm({ email: '', code: '', old: '', next: '', confirm: '', fund: '' }); actions.notify(mode === 'email' ? '绑定成功' : '修改成功', 'success') }} />
    </PageShell>
  )
}

function SecurityQuestionPage(props) {
  const actions = useSfaActions(props)
  const [stage, setStage] = useState('verify')
  const [oldAnswer, setOldAnswer] = useState('')
  const [question, setQuestion] = useState(SECURITY_QUESTIONS[1])
  const [questionSheet, setQuestionSheet] = useState(false)
  const [answer, setAnswer] = useState('')
  const [tip, setTip] = useState('')
  const [fund, setFund] = useState('')
  const [google, setGoogle] = useState(false)

  const submit = () => {
    if (stage === 'verify') {
      if (!oldAnswer.trim()) return actions.notify('请输入密保答案')
      setStage('edit')
      return actions.notify('验证成功', 'success')
    }
    if (!question || !answer.trim()) return actions.notify('请选择密保问题并输入答案')
    if (!/^\d{6}$/.test(fund)) return actions.notify('资金密码必须为6位数字')
    setGoogle(true)
  }

  return (
    <PageShell title="更换密保" onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton onClick={submit}>{stage === 'verify' ? '验证原密保' : '确定'}</PrimaryButton>}>
      <Card>{stage === 'verify' ? <><SelectField label="原密保问题" value="15.您的出生地是?" onClick={() => actions.notify('原密保问题不可修改')} /><Field label="请输入密保答案" value={oldAnswer} onChange={setOldAnswer} placeholder="请输入答案" /><small className="sfa-field-tip">密保提示：户口所在地</small></> : <><Hint>已通过原密保验证，请设置新的密保问题和答案。</Hint><SelectField label="请选择新密保问题" value={question} onClick={() => setQuestionSheet(true)} /><Field label="密保答案" value={answer} onChange={setAnswer} placeholder="请输入新的密保答案" /><Field label="密保提示" value={tip} onChange={setTip} placeholder="请输入密保提示" /><PasswordField label="资金密码" value={fund} onChange={(value) => setFund(value.replace(/\D/g, '').slice(0, 6))} /></>}</Card>
      <SelectSheet open={questionSheet} title="选择密保问题" options={SECURITY_QUESTIONS} value={question} onClose={() => setQuestionSheet(false)} onSelect={(value) => { setQuestion(value); setQuestionSheet(false) }} />
      <GoogleVerificationModal open={google} purpose="更换密保" onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); actions.notify('修改成功', 'success'); actions.back() }} />
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
      <GoogleVerificationModal open={google} purpose="完成账户安全设置" onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); actions.notify('安全设置完成', 'success'); actions.go('/pages/user/user') }} />
    </PageShell>
  )
}

function GoogleAuthenticatorPage(props) {
  const actions = useSfaActions(props)
  const [bound, setBound] = useState(Boolean(props?.initialBound))
  const [step, setStep] = useState(bound ? 'manage' : 'intro')
  const [fund, setFund] = useState('')
  const [code, setCode] = useState('')
  const [saved, setSaved] = useState(false)
  const [unbinding, setUnbinding] = useState(false)
  const recoveryCodes = Array.from({ length: 6 }, (_, index) => `恢复码 ${String(index + 1).padStart(2, '0')}（演示）`)

  const start = () => {
    if (!/^\d{6}$/.test(fund)) return actions.notify('请输入6位资金密码')
    setStep('scan')
  }
  const confirmCode = () => {
    if (!/^\d{6}$/.test(code)) return actions.notify('请输入6位谷歌验证码')
    setStep('recovery')
  }
  const complete = () => {
    if (!saved) return actions.notify('请先确认已安全保存恢复码')
    setBound(true)
    setStep('manage')
    setFund('')
    setCode('')
    actions.notify('谷歌验证器已绑定', 'success')
  }

  return (
    <PageShell title="谷歌验证器" onBack={actions.back} message={actions.localMessage}>
      {step === 'intro' ? <><Card className="sfa-security-intro"><div className="sfa-security-emblem"><ShieldCheck size={31} /></div><h2>绑定谷歌验证器</h2><p>绑定后，登录与敏感资金操作都需要输入动态验证码。</p></Card><Card><PasswordField label="资金密码" value={fund} onChange={(value) => setFund(value.replace(/\D/g, '').slice(0, 6))} placeholder="绑定前请先输入6位资金密码" /><PrimaryButton onClick={start}>开始绑定</PrimaryButton></Card></> : null}
      {step === 'scan' ? <><Card className="sfa-google-setup"><SectionTitle>扫描二维码并确认</SectionTitle><p>使用谷歌验证器扫描二维码，或复制密钥手工添加账户。</p><QrPlaceholder label="G6哈希演示" /><CopyLine label="手工输入密钥" value="•••• •••• ••••" onCopy={() => actions.copy('演示密钥（不可用于真实验证）', '演示密钥')} /><Field label="谷歌验证码" value={code} onChange={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位演示验证码" /><PrimaryButton onClick={confirmCode}>确认绑定</PrimaryButton><GhostButton onClick={() => setStep('intro')}>取消</GhostButton></Card></> : null}
      {step === 'recovery' ? <Card><SectionTitle>请立即保存恢复码</SectionTitle><Hint tone="warning">每个恢复码只能使用一次，离开此页后将不再显示。</Hint><div className="sfa-recovery-grid">{recoveryCodes.map((item) => <code key={item}>{item}</code>)}</div><GhostButton onClick={() => actions.copy(recoveryCodes.join('\n'), '全部恢复码')}>复制全部恢复码</GhostButton><label className="sfa-check-row"><input type="checkbox" checked={saved} onChange={(event) => setSaved(event.target.checked)} /><span>我已将恢复码保存在安全位置</span></label><PrimaryButton onClick={complete}>完成</PrimaryButton></Card> : null}
      {step === 'manage' ? <><Card className="sfa-security-banner"><div className="sfa-security-emblem"><ShieldCheck size={31} /></div><div><strong>谷歌验证器已绑定</strong><small>账户动态验证保护已开启</small></div><Badge tone="success">已绑定</Badge></Card><Card><PasswordField label="管理前请输入6位资金密码" value={fund} onChange={(value) => setFund(value.replace(/\D/g, '').slice(0, 6))} /></Card><Card className="sfa-action-list"><ActionRow title="重新生成恢复码" subtitle="旧恢复码将立即失效" onClick={() => /^\d{6}$/.test(fund) ? setStep('recovery') : actions.notify('请输入6位资金密码')} /><ActionRow title="重新绑定验证器" subtitle="更换手机或验证器应用" onClick={() => /^\d{6}$/.test(fund) ? setStep('scan') : actions.notify('请输入6位资金密码')} /><ActionRow title="解绑谷歌验证器" subtitle="解绑后账户保护将降低" danger onClick={() => /^\d{6}$/.test(fund) ? setUnbinding(true) : actions.notify('请输入6位资金密码')} /></Card><Hint>验证码、密钥与恢复码请勿发送给任何人。</Hint></> : null}
      <ConfirmModal open={unbinding} title="确认解绑谷歌验证器？" content="解绑后登录与敏感操作将失去动态验证码保护。" confirmText="确认解绑" danger onCancel={() => setUnbinding(false)} onConfirm={() => { setUnbinding(false); setBound(false); setStep('intro'); setFund(''); actions.notify('解绑成功，请重新登录', 'success') }} />
    </PageShell>
  )
}
