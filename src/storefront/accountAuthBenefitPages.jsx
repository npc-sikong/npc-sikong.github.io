import { useState } from 'react'
import { Award, CheckCircle2, Gift, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import { BENEFITS, DEPOSIT_CHANNELS, LUCKY5_REWARDS, RANK_REWARDS, STREAK_REWARDS } from './accountData'
import CredentialPairRecoveryPanel from './CredentialPairRecoveryPanel'
import { recoveryCredentialPairAvailable, recoveryCredentialsFor, validateRecoveryCredentialValues } from './recoveryCredentials'
import { SecurityRecoveryPanel } from './SecurityRecoveryModal'
import StorefrontRequirementEntry from './StorefrontRequirementEntry'
import {
  Card,
  CopyLine,
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
  SectionTitle,
  Segmented,
  SummaryGrid,
  useSfaActions,
} from './accountUi'

function resolveAuthMode(props) {
  const explicit = props?.type || props?.mode
  if (explicit) return explicit
  const path = String(props?.path || props?.route || '')
  if (path.includes('register')) return 'register'
  if (path.includes('recover')) return 'recover'
  if (path.includes('agreement')) return 'agreement'
  if (path.includes('captcha')) return 'captcha'
  return 'login'
}

export function AuthPage(props) {
  const mode = resolveAuthMode(props)
  if (mode === 'register') return <RegisterPage {...props} />
  if (mode === 'recover') return <RecoverPage {...props} />
  if (mode === 'agreement') return <AgreementPage {...props} />
  if (mode === 'captcha') return <CaptchaPage {...props} />
  return <LoginPage {...props} />
}

function AuthShell({ title, subtitle, actions, children, footer }) {
  return (
    <div className="sfa-page sfa-auth-page">
      <header className="sfa-auth-brand"><div className="sfa-auth-logo">G6</div><div><strong>G6哈希</strong><small>公平 · 公开 · 安全</small></div></header>
      <main className="sfa-auth-content"><div className="sfa-auth-heading"><h1>{title}</h1><p>{subtitle}</p></div>{children}</main>
      {footer ? <footer className="sfa-auth-footer">{footer}</footer> : null}
      {actions.localMessage ? <div className="sfa-local-toast">{actions.localMessage}</div> : null}
    </div>
  )
}

function LoginPage(props) {
  const actions = useSfaActions(props)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [captcha, setCaptcha] = useState(false)
  const [google, setGoogle] = useState(false)
  const [recoverAccount, setRecoverAccount] = useState(false)
  const [address, setAddress] = useState('')
  const [found, setFound] = useState(false)

  const login = () => {
    if (!/^[A-Za-z0-9]{6,16}$/.test(username)) return actions.notify('请输入6-16位字母或数字账号')
    if (password.length < 6 || password.length > 20) return actions.notify('请输入6-20位密码')
    if (!captcha) return actions.notify('请先完成人机验证')
    setGoogle(true)
  }

  const findAccount = () => {
    if (!/^T[A-Za-z0-9]{20,}$/.test(address)) return actions.notify('请输入正确的TRC20地址')
    if (address !== DEPOSIT_CHANNELS[0].address) return actions.notify('该地址未绑定演示账号')
    setFound(true)
    actions.notify('已找回账号', 'success')
  }

  return (
    <AuthShell title="登录" subtitle="欢迎回来，请登录您的账户" actions={actions} footer={<p>G6哈希 © 版权所有 侵权必究</p>}>
      <StorefrontRequirementEntry path="/front/pages/login/login" />
      <Card className="sfa-auth-card">
        <Field label="账号" value={username} onChange={(value) => setUsername(value.replace(/[^A-Za-z0-9]/g, '').slice(0, 16))} placeholder="请输入用户名" />
        <PasswordField label="密码" value={password} onChange={setPassword} placeholder="请输入密码" />
        <label className="sfa-check-row"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>记住密码</span><button type="button" onClick={() => actions.go('/pages/login/recover-password')}>忘记密码?</button></label>
        <button type="button" className={`sfa-captcha-box ${captcha ? 'is-passed' : ''}`} onClick={() => { setCaptcha(true); actions.notify('安全验证通过', 'success') }}><ShieldCheck size={22} /><span>{captcha ? '安全验证已通过' : '点击完成人机验证'}</span>{captcha ? <CheckCircle2 size={20} /> : null}</button>
        <PrimaryButton onClick={login}>登录</PrimaryButton>
        <div className="sfa-auth-links"><button type="button" onClick={() => setRecoverAccount(true)}>忘记账号</button><button type="button" onClick={() => actions.go('/pages/register/register')}>注册账号</button><button type="button" onClick={() => actions.go('/pages/help/hijack-guide')}>防劫持教程</button></div>
      </Card>
      <button className="sfa-service-link" type="button" onClick={() => actions.go('/pages/service/index')}>联系客服</button>
      <Modal open={recoverAccount} title="找回账号" onClose={() => { setRecoverAccount(false); setFound(false) }} footer={found ? <div className="sfa-modal-actions"><GhostButton onClick={() => actions.copy('G6DEMO88', '账号')}>复制账号</GhostButton><PrimaryButton onClick={() => { setUsername('G6DEMO88'); setRecoverAccount(false); setFound(false) }}>去登录</PrimaryButton></div> : <PrimaryButton onClick={findAccount}>查询</PrimaryButton>}>
        {found ? <CopyLine label="已找回账号" value="G6DEMO88" onCopy={() => actions.copy('G6DEMO88', '账号')} /> : <Field label="请输入已绑定的TRC20提现地址" value={address} onChange={setAddress} placeholder="请输入TRC20地址" right={<button type="button" onClick={() => { setAddress(DEPOSIT_CHANNELS[0].address); actions.notify('已粘贴演示地址') }}>粘贴</button>} />}
      </Modal>
      <GoogleVerificationModal open={google} purpose="谷歌登录验证" onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); actions.notify('登录成功', 'success'); actions.go('/pages/index/index') }} onRecover={() => { setGoogle(false); actions.go(`/pages/security/google-authenticator?recovery=1&account=${encodeURIComponent(username)}`) }} />
    </AuthShell>
  )
}

function RegisterPage(props) {
  const actions = useSfaActions(props)
  const [form, setForm] = useState({ username: '', password: '', confirm: '', invite: props?.inviteCode || '' })
  const [showInvite, setShowInvite] = useState(Boolean(props?.inviteCode))
  const [success, setSuccess] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const register = () => {
    if (!/^[A-Za-z0-9]{6,16}$/.test(form.username)) return actions.notify('请输入6-16位字母或数字账号')
    if (form.password.length < 6 || form.password.length > 20) return actions.notify('请输入6-20位密码')
    if (form.password !== form.confirm) return actions.notify('两次密码输入不一致')
    if (props?.inviteRequired && form.invite.length < 6) return actions.notify('请输入邀请码')
    setSuccess(true)
  }
  return (
    <AuthShell title="注册账户" subtitle="创建您的 G6 哈希账户" actions={actions} footer={<button type="button" onClick={() => actions.go('/pages/login/login')}>已有账号？回到登录界面</button>}>
      <Card className="sfa-auth-card">
        <Field label="账号" value={form.username} onChange={(value) => update('username', value.replace(/[^A-Za-z0-9]/g, '').slice(0, 16))} placeholder="请输入用户名" />
        <PasswordField label="密码" value={form.password} onChange={(value) => update('password', value)} />
        <PasswordField label="确认密码" value={form.confirm} onChange={(value) => update('confirm', value)} />
        <button className="sfa-text-button" type="button" onClick={() => setShowInvite((value) => !value)}>{showInvite ? '收起邀请码' : '填写邀请码'}</button>
        {showInvite ? <Field label={`邀请码${props?.inviteRequired ? '（必填）' : ''}`} value={form.invite} onChange={(value) => update('invite', value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))} placeholder="请输入邀请码" /> : null}
        <PrimaryButton onClick={register}>{props?.redPacket ? '注册并领取' : '注册'}</PrimaryButton>
      </Card>
      <Modal open={success} title="注册成功" onClose={() => setSuccess(false)} footer={<PrimaryButton onClick={() => { setSuccess(false); actions.go('/pages/login/login') }}>去登录</PrimaryButton>}>
        <div className="sfa-success-mark"><CheckCircle2 size={31} /></div>
        <CopyLine label="账号" value={form.username} onCopy={() => actions.copy(form.username, '账号')} />
        <p className="sfa-center-copy">账号已创建，请及时完成首次安全设置。</p>
      </Modal>
    </AuthShell>
  )
}

function RecoverPage(props) {
  const actions = useSfaActions(props)
  const securityConfigured = Boolean(props.securityProfile?.configured && props.securityProfile?.answer)
  const availableCredentials = recoveryCredentialsFor('login', {
    securityConfigured,
    googleBound: props.googleBound !== false,
  })
  const [method, setMethod] = useState(recoveryCredentialPairAvailable(availableCredentials) ? 'credentials' : 'transfer')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const normalizedUsername = username.trim()

  const validateUsername = () => {
    if (!/^[A-Za-z0-9]{6,16}$/.test(normalizedUsername)) {
      actions.notify('请输入6-16位字母或数字会员账号')
      return false
    }
    return true
  }

  const validatePassword = () => {
    if (password.length < 6 || password.length > 20) {
      actions.notify('请输入新密码（6-20位）')
      return false
    }
    if (password !== confirm) {
      actions.notify('两次密码输入不一致')
      return false
    }
    return true
  }

  const finishCredentialRecovery = () => {
    actions.notify('两项凭据验证通过，登录密码已重置', 'success')
    actions.go('/pages/login/login')
  }

  const finishTransferRecovery = ({ amount, currency } = {}) => {
    actions.notify(`${amount || ''}${amount ? ` ${currency}` : ''} 已计入钱包，登录密码已重置`, 'success')
    actions.go('/pages/login/login')
  }

  const changeMethod = (value) => {
    setMethod(value)
  }

  const validateCredentialRecovery = (payload) => {
    if (!validateUsername() || !validatePassword()) return false
    return validateRecoveryCredentialValues(payload, props.securityProfile, actions.notify)
  }

  return (
    <PageShell title="找回密码" subtitle={method === 'credentials' ? '使用密保＋资金密码固定组合验证' : '绑定地址充值到账后自动验证'} onBack={actions.back} message={actions.localMessage} className="sfa-password-recovery-page">
      <StorefrontRequirementEntry path="/front/pages/login/recover-password" />
      <Card className="sfa-password-recovery-account">
        <Field label="会员账号" value={username} onChange={(value) => setUsername(value.replace(/[^A-Za-z0-9]/g, '').slice(0, 16))} placeholder="请输入6-16位会员账号" />
      </Card>
      <Hint>本页提供两条独立路径：固定验证“密保答案＋资金密码”，或使用绑定地址充值验证；登录密码不会参与验证自己。</Hint>
      <Segmented items={[{ value: 'credentials', label: '双凭据找回' }, { value: 'transfer', label: '绑定地址充值找回' }]} value={method} onChange={changeMethod} />
      <Card className="sfa-password-recovery-card">
        <SectionTitle>设置新登录密码</SectionTitle>
        <PasswordField label="新密码" value={password} onChange={setPassword} placeholder="请输入新密码（6-20位）" />
        <PasswordField label="确认新密码" value={confirm} onChange={setConfirm} placeholder="请再次输入新密码" />
      </Card>
      {method === 'credentials' ? (
        <CredentialPairRecoveryPanel
          identityKey="login-password-recovery"
          targetLabel="登录密码"
          availableCredentials={availableCredentials}
          actionText="验证并重置登录密码"
          beforeVerify={validateCredentialRecovery}
          onVerified={finishCredentialRecovery}
        />
      ) : (
        <SecurityRecoveryPanel
          identityKey="login-password-recovery"
          title="绑定地址充值找回"
          purpose="演示到账后自动验证并重置登录密码"
          actionText="我已转账并重置密码"
          beforeVerify={() => validateUsername() && validatePassword()}
          onVerified={finishTransferRecovery}
        />
      )}
    </PageShell>
  )
}

function AgreementPage(props) {
  const actions = useSfaActions(props)
  const [tab, setTab] = useState('service')
  return (
    <PageShell title="协议" onBack={actions.back} message={actions.localMessage}>
      <Segmented items={[{ value: 'service', label: '服务协议' }, { value: 'privacy', label: '隐私协议' }]} value={tab} onChange={setTab} />
      <Card className="sfa-article"><h2>{tab === 'service' ? 'G6哈希服务协议' : 'G6哈希隐私协议'}</h2><p>本页面为纯前端演示协议。使用演示原型即表示您了解页面数据、订单、余额、验证码和链上内容均为确定性的模拟信息。</p><h3>一、演示范围</h3><p>原型不会发起真实支付、转账、投注、登录或链上查询，也不会保存真实身份与资金信息。</p><h3>二、账户安全</h3><p>请勿在演示页面输入真实密码、私钥、验证码或钱包敏感信息。</p><h3>三、隐私说明</h3><p>页面状态仅保存在当前浏览器内存中，刷新后恢复初始演示数据。</p></Card>
    </PageShell>
  )
}

function CaptchaPage(props) {
  const actions = useSfaActions(props)
  const [passed, setPassed] = useState(false)
  const [success, setSuccess] = useState(false)
  return (
    <PageShell title="H5 安全验证测试" onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton disabled={!passed} onClick={() => setSuccess(true)}>提交演示验证</PrimaryButton>}>
      <Card className="sfa-captcha-test"><ShieldCheck size={40} /><h2>安全验证测试</h2><p>请完成下方一点即过，然后提交演示验证。</p><button type="button" className={passed ? 'is-passed' : ''} onClick={() => { setPassed(true); actions.notify('验证通过', 'success') }}>{passed ? '✓ 验证成功' : '点击完成验证'}</button></Card>
      <Hint>本测试仅模拟前端交互，不连接真实验证码服务。</Hint>
      <Modal open={success} title="测试成功" onClose={() => setSuccess(false)} footer={<PrimaryButton onClick={() => setSuccess(false)}>确定</PrimaryButton>}><p className="sfa-center-copy">当前 H5 验证流程已完成演示校验，本次操作不会连接任何真实验证服务。</p></Modal>
    </PageShell>
  )
}

export function BenefitDetailPage(props) {
  const actions = useSfaActions(props)
  const benefit = BENEFITS.find((item) => item.id === props?.benefitId) || BENEFITS[0]
  const [claimed, setClaimed] = useState(false)
  const rewards = benefit.id === 'rank' ? RANK_REWARDS : benefit.id === 'streak' ? STREAK_REWARDS : [['首充 100', '加赠 1%'], ['首充 1000', '加赠 1%'], ['奖励上限', '8888']]
  return (
    <PageShell title="福利详情" onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton onClick={() => { setClaimed(true); actions.notify('领取成功', 'success') }}>{claimed ? '已领取' : '领取奖励'}</PrimaryButton>}>
      <div className="sfa-benefit-hero"><Gift size={31} /><small>{benefit.title}</small><strong>{benefit.accent}</strong></div>
      <Card><SummaryGrid items={[{ label: '活动对象', value: benefit.scope }, { label: '流水要求', value: benefit.turnover }, { label: '活动时间', value: benefit.time }, { label: '领取方式', value: benefit.receive }]} /></Card>
      <SectionTitle>活动内容</SectionTitle>
      <Card><p>达到活动要求后，奖励将按活动规则发放至中心钱包。活动奖励需完成 1 倍有效流水后方可提现。</p><div className="sfa-reward-table">{rewards.map((row) => <div key={row.join('-')}><span>{row[0]}</span><b>{row[1]}</b></div>)}</div></Card>
      <SectionTitle>活动规则</SectionTitle>
      <Card className="sfa-rule-list"><ol><li>每位会员仅可使用一个账号参与同一活动。</li><li>奖励以实际到账或有效投注数据为准。</li><li>异常方式套取优惠将取消资格。</li><li>为避免文字理解差异，平台保留最终解释权。</li></ol></Card>
    </PageShell>
  )
}

export function BenefitIndexPage(props) {
  const actions = useSfaActions(props)
  const cards = [
    ...BENEFITS,
    { id: 'fee-free', title: '投注手续费全免', accent: '单笔投注≥30USDT，赠送波场能量', route: '/pages/benefit/fee-free' },
    { id: 'verify-u', title: '千万奖池 验资送U', accent: '验证送U，隔日领取', route: '/pages/benefit/verify-u' },
    { id: 'lucky5', title: '幸运排列5', accent: '充值即送奖票，每日开奖', route: '/pages/benefit/lucky5' },
  ]
  return (
    <PageShell title="福利中心" onBack={actions.back} message={actions.localMessage}>
      <div className="sfa-benefit-list">{cards.map((item, index) => <button type="button" key={item.id} className={`sfa-benefit-card sfa-benefit-card--${index % 3}`} onClick={() => actions.go(item.route || `/pages/benefit/detail?id=${item.id}`)}><span>{index % 2 ? <Gift size={25} /> : <Trophy size={25} />}</span><div><strong>{item.title}</strong><small>{item.accent}</small><b>活动详情 ›</b></div></button>)}</div>
    </PageShell>
  )
}

export function Lucky5Page(props) {
  const actions = useSfaActions(props)
  return (
    <PageShell title="幸运排列5" onBack={actions.back} message={actions.localMessage}>
      <div className="sfa-benefit-hero sfa-benefit-hero--purple"><Trophy size={32} /><small>充值即送奖票，每日开奖</small><strong>幸运排列5</strong></div>
      <Card><SectionTitle>活动内容</SectionTitle><p>每充值200 CNY（USDT、TRX按平台实时汇率换算）可获得一张奖票，每日北京时间21:10开奖。</p></Card>
      <Card><div className="sfa-prize-table"><div><b>奖励等级</b><b>奖金</b><b>中奖条件</b></div>{LUCKY5_REWARDS.map((row) => <div key={row[0]}><span>{row[0]}</span><strong>{row[1]}</strong><span>{row[2]}</span></div>)}</div></Card>
      <SectionTitle>活动规则</SectionTitle><Card className="sfa-rule-list"><ol><li>充值成功即送奖票，每期共10万张，先到先得。</li><li>当日奖票未开奖前属于当期，开奖后视为下期。</li><li>彩金开奖后发到中心钱包，仅需1倍流水。</li><li>当期充值所得奖票在次期开奖后清零。</li><li>异常方式套取优惠将冻结或关闭相关账户。</li></ol></Card>
    </PageShell>
  )
}

export function FeeFreePage(props) {
  const actions = useSfaActions(props)
  const [qr, setQr] = useState(false)
  const address = 'TV8uQp7N2k6QZB8G6HashDemoV6Y2P3s'
  return (
    <PageShell title="投注手续费全免" onBack={actions.back} message={actions.localMessage}>
      <div className="sfa-benefit-hero"><Sparkles size={32} /><small>单笔投注≥30USDT</small><strong>赠送波场能量</strong></div>
      <Card><SummaryGrid items={[{ label: '活动门槛', value: '单笔投注≥30USDT' }, { label: '奖励', value: '波场能量' }, { label: '有效期', value: '1小时' }]} /><p>活动期间满足条件即可获得奖励，无需申请或手动领取，能量自动派发至会员本次投注的波场地址。</p></Card>
      <Card><CopyLine label="投注地址" value={address} onCopy={() => actions.copy(address, '投注地址')} /><PrimaryButton tone="light" onClick={() => setQr(true)}>二维码</PrimaryButton></Card>
      <Modal open={qr} title="投注地址二维码" onClose={() => setQr(false)} footer={<PrimaryButton onClick={() => setQr(false)}>关闭</PrimaryButton>}><QrPlaceholder label="投注地址" /><CopyLine label="投注地址" value={address} onCopy={() => actions.copy(address, '投注地址')} /></Modal>
    </PageShell>
  )
}

export function VerifyUPage(props) {
  const actions = useSfaActions(props)
  const [claimed, setClaimed] = useState(false)
  const [qr, setQr] = useState(false)
  const poolAddress = 'TG6PrizePoolDemo8f2Q7n1U'
  const betAddress = 'TV8uQp7N2k6QZB8G6HashDemoV6Y2P3s'
  return (
    <PageShell title="验资送U" onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton disabled={claimed} onClick={() => { setClaimed(true); actions.notify('申领成功，将于次日派送0.1USDT', 'success') }}>{claimed ? '已申领' : '立即申领'}</PrimaryButton>}>
      <div className="sfa-benefit-hero sfa-benefit-hero--gold"><Award size={32} /><small>千万奖池</small><strong>验资送U</strong></div>
      <Card><SectionTitle>活动说明</SectionTitle><p>会员投注后即可申领。次日平台会使用奖金池或备付金地址向会员钱包派送0.1USDT，以便核验平台奖池余额。</p><Hint>每个会员钱包地址只可申领一次，领取方式为隔日领取。</Hint></Card>
      <Card><CopyLine label="奖金池地址" value={poolAddress} onCopy={() => actions.copy(poolAddress, '奖金池地址')} /><button className="sfa-chain-link" type="button" onClick={() => actions.notify('已打开公链查询演示')}>前往公链查询</button><CopyLine label="投注地址" value={betAddress} onCopy={() => actions.copy(betAddress, '投注地址')} /><PrimaryButton tone="light" onClick={() => setQr(true)}>二维码</PrimaryButton></Card>
      <Card><SectionTitle>为什么要验资？</SectionTitle><p>通过公开链上地址和小额派送，会员可以核对奖池与备付金地址确由平台演示页面展示。</p></Card>
      <Modal open={qr} title="投注地址二维码" onClose={() => setQr(false)} footer={<PrimaryButton onClick={() => setQr(false)}>关闭</PrimaryButton>}><QrPlaceholder label="投注地址" /><CopyLine label="投注地址" value={betAddress} onCopy={() => actions.copy(betAddress, '投注地址')} /></Modal>
    </PageShell>
  )
}
