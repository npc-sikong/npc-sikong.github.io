import { useMemo, useState } from 'react'
import { Award, CheckCircle2, Gift, ImagePlus, ShieldCheck, Sparkles, Trash2, Trophy } from 'lucide-react'
import { BENEFITS, LUCKY5_REWARDS, RANK_REWARDS, STREAK_REWARDS } from './accountData'
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
        {found ? <CopyLine label="已找回账号" value="G6DEMO88" onCopy={() => actions.copy('G6DEMO88', '账号')} /> : <Field label="请输入已绑定的TRC20提现地址" value={address} onChange={setAddress} placeholder="请输入TRC20地址" />}
      </Modal>
      <GoogleVerificationModal open={google} purpose="谷歌登录验证" onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); actions.notify('登录成功', 'success'); actions.go('/pages/index/index') }} onRecover={() => { setGoogle(false); actions.go('/pages/security/google-authenticator?recovery=1') }} />
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
  const [method, setMethod] = useState('question')
  const [username, setUsername] = useState('')
  const [answer, setAnswer] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [rechargeAddress, setRechargeAddress] = useState('')
  const [withdrawalAddress, setWithdrawalAddress] = useState('')
  const [rechargeScreenshot, setRechargeScreenshot] = useState(null)
  const [withdrawalScreenshot, setWithdrawalScreenshot] = useState(null)
  const [submittedRequest, setSubmittedRequest] = useState(null)

  const normalizedUsername = username.trim()
  const memberId = normalizedUsername.toLowerCase() === 'evan777' ? '133' : normalizedUsername
  const recoveryQuestion = props.securityProfile?.question || '15.您的出生地是?'
  const recoveryHint = props.securityProfile?.tip || '户口所在地'
  const latestAccountRequest = useMemo(() => (props.recoveryRequests || []).find((request) => (
    request.recoveryType === 'login-password'
    && (String(request.memberId || '') === memberId || String(request.username || '').toLowerCase() === normalizedUsername.toLowerCase())
  )), [memberId, normalizedUsername, props.recoveryRequests])

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

  const resetByQuestion = () => {
    if (!validateUsername()) return
    if (!answer.trim()) return actions.notify('请输入密保答案')
    if (props.securityProfile?.answer && answer.trim() !== props.securityProfile.answer) return actions.notify('密保答案不正确')
    if (!validatePassword()) return
    actions.notify('密保验证通过，密码重置成功', 'success')
    actions.go('/pages/login/login')
  }

  const chooseScreenshot = async (event, kind) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) return actions.notify('截图仅支持 JPG、JPEG 或 PNG 格式')
    if (file.size > 5 * 1024 * 1024) return actions.notify('单张截图不能超过5MB')
    try {
      const dataUrl = await readRecoveryImage(file)
      const image = { id: `${kind}-${Date.now()}`, name: file.name, type: file.type, size: file.size, dataUrl, category: kind }
      if (kind === 'recharge') setRechargeScreenshot(image)
      else setWithdrawalScreenshot(image)
      actions.notify(`${kind === 'recharge' ? '最近充值' : '最近提现'}截图已选择`, 'success')
    } catch {
      actions.notify('图片读取失败，请重新选择')
    }
  }

  const submitTransactionRecovery = () => {
    if (!validateUsername() || !validatePassword()) return
    if (!rechargeScreenshot || !rechargeAddress.trim()) return actions.notify('请同时提供最近充值截图和充值钱包地址')
    if (!withdrawalScreenshot || !withdrawalAddress.trim()) return actions.notify('请同时提供最近提现截图和提现钱包地址')

    const pendingRequest = (props.recoveryRequests || []).find((request) => (
      request.status === '待审核'
      && (String(request.memberId || '') === memberId || String(request.username || '').toLowerCase() === normalizedUsername.toLowerCase())
    ))
    if (pendingRequest) {
      setSubmittedRequest(pendingRequest)
      return actions.notify(`已有待审核申请 ${pendingRequest.requestNo || pendingRequest.id}，请勿重复提交`)
    }

    const now = new Date()
    const sequence = String((props.recoveryRequests?.length || 0) + 1).padStart(4, '0')
    const requestNo = `MR${formatRecoveryDate(now, false)}${sequence}`
    const request = {
      id: requestNo,
      requestNo,
      recoveryType: 'login-password',
      recoveryTypeLabel: '登录密码找回',
      memberId,
      username: normalizedUsername,
      sourcePage: 'H5登录页 · 找回密码',
      securityQuestion: '-',
      method: 'transaction-proof',
      methodLabel: '交易资料找回',
      condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址必须同时提供并由运营核对。',
      recharge: {
        walletAddress: rechargeAddress.trim(),
        historyWalletAddress: rechargeAddress.trim(),
        reference: '最近成功充值：100.00 USDT · 演示历史记录',
        screenshots: [rechargeScreenshot],
      },
      withdrawal: {
        walletAddress: withdrawalAddress.trim(),
        historyWalletAddress: withdrawalAddress.trim(),
        reference: '最近成功提现：60.00 USDT · 演示历史记录',
        screenshots: [withdrawalScreenshot],
      },
      reply: `充值钱包地址：${rechargeAddress.trim()}；提现钱包地址：${withdrawalAddress.trim()}`,
      screenshots: [rechargeScreenshot, withdrawalScreenshot],
      passwordSubmitted: true,
      newPassword: password,
      status: '待审核',
      submittedAt: formatRecoveryDate(now),
      reviewer: '',
      reviewedAt: '',
      rejectReason: '',
    }
    const accepted = props.onSubmitRecovery?.(request)
    if (accepted === false) return actions.notify('该会员已有待审核申请，请勿重复提交')
    setSubmittedRequest(request)
    actions.notify(`申请 ${requestNo} 已提交`, 'success')
  }

  if (submittedRequest) {
    const liveRequest = (props.recoveryRequests || []).find((request) => (
      String(request.id || request.requestNo) === String(submittedRequest.id || submittedRequest.requestNo)
    )) || submittedRequest
    const requestNo = liveRequest.requestNo || liveRequest.id
    const status = liveRequest.status || '待审核'
    const approved = status === '审核通过'
    const rejected = status === '已驳回'
    const retry = () => {
      setSubmittedRequest(null)
      setRechargeScreenshot(null)
      setWithdrawalScreenshot(null)
      setPassword('')
      setConfirm('')
    }
    return (
      <PageShell title="找回密码" onBack={actions.back} message={actions.localMessage} className="sfa-password-recovery-page" bottom={<PrimaryButton onClick={rejected ? retry : () => actions.go('/pages/login/login')}>{rejected ? '重新申请' : '返回登录'}</PrimaryButton>}>
        <StorefrontRequirementEntry path="/front/pages/login/recover-password" />
        <Card className="sfa-password-recovery-result">
          <span>{approved ? <CheckCircle2 size={31} /> : <ShieldCheck size={31} />}</span>
          <h2>{approved ? '找回已完成' : rejected ? '申请未通过' : '申请已提交'}</h2>
          <p>{approved ? '运营审核已通过，申请时填写的新密码已生效。' : rejected ? '原密码保持不变，请按驳回说明补充材料后重新申请。' : '运营审核通过后，新密码才会生效。'}</p>
          <div><small>申请单号</small><b>{requestNo}</b></div>
          <div><small>当前状态</small><strong>{status}</strong></div>
          {rejected && <div><small>驳回说明</small><b>{liveRequest.rejectReason || liveRequest.reviewRemark || '材料与历史演示记录不一致'}</b></div>}
        </Card>
        <Hint tone={approved ? 'success' : 'warning'}>{approved ? '本次仅更新当前浏览器内的演示状态，不会修改任何真实账号。' : rejected ? '重新申请仍须同时提交充值和提现两组完整材料。' : '请妥善保管申请单号。审核期间无需重复提交，也请勿向任何人提供新密码。'}</Hint>
      </PageShell>
    )
  }

  const changeMethod = (value) => {
    setMethod(value)
    setAnswer('')
    setPassword('')
    setConfirm('')
  }

  const bottomAction = method === 'question'
    ? <PrimaryButton onClick={resetByQuestion}>确认找回密码</PrimaryButton>
    : <PrimaryButton onClick={submitTransactionRecovery}>提交审核</PrimaryButton>

  return (
    <PageShell title="找回密码" subtitle={method === 'question' ? '密保答案和新密码一次提交' : '交易资料需经运营审核'} onBack={actions.back} message={actions.localMessage} className="sfa-password-recovery-page" bottom={bottomAction}>
      <StorefrontRequirementEntry path="/front/pages/login/recover-password" />
      <Card className="sfa-password-recovery-account">
        <Field label="会员账号" value={username} onChange={(value) => setUsername(value.replace(/[^A-Za-z0-9]/g, '').slice(0, 16))} placeholder="请输入6-16位会员账号" />
        {method === 'transaction' && latestAccountRequest && <button type="button" className="sfa-password-recovery-latest" onClick={() => setSubmittedRequest(latestAccountRequest)}><span><small>最近申请</small><b>{latestAccountRequest.requestNo || latestAccountRequest.id}</b></span><strong>{latestAccountRequest.status || '待审核'} · 查看</strong></button>}
      </Card>
      <Segmented items={[{ value: 'question', label: '通过密保找回' }, { value: 'transaction', label: '交易资料找回' }]} value={method} onChange={changeMethod} />
      {method === 'question' ? (
        <Card className="sfa-password-recovery-card">
          <SectionTitle>密保验证与新密码</SectionTitle>
          <p className="sfa-question-card">{recoveryQuestion}</p>
          <small className="sfa-field-tip">密保提示：{recoveryHint}</small>
          <Field label="密保答案" value={answer} onChange={setAnswer} placeholder="请输入密保答案" />
          <PasswordField label="新密码" value={password} onChange={setPassword} placeholder="请输入新密码（6-20位）" />
          <PasswordField label="确认新密码" value={confirm} onChange={setConfirm} placeholder="请再次输入新密码" />
          <small className="sfa-field-tip">密保答案验证与新密码修改一次提交，验证通过后立即完成找回。</small>
        </Card>
      ) : (
        <>
          <Card className="sfa-password-recovery-card">
            <SectionTitle>设置审核通过后的新密码</SectionTitle>
            <PasswordField label="新密码" value={password} onChange={setPassword} placeholder="请输入新密码（6-20位）" />
            <PasswordField label="确认新密码" value={confirm} onChange={setConfirm} placeholder="请再次输入新密码" />
            <small className="sfa-field-tip">审核通过前新密码不会生效，运营后台仅显示“已填写”，不会展示密码内容。</small>
          </Card>
          <div className="sfa-recovery-proof-list">
            <RecoveryProofCard title="最近充值资料" addressLabel="充值钱包地址" address={rechargeAddress} onAddressChange={setRechargeAddress} screenshot={rechargeScreenshot} onChoose={(event) => chooseScreenshot(event, 'recharge')} onRemove={() => setRechargeScreenshot(null)} />
            <RecoveryProofCard title="最近提现资料" addressLabel="提现钱包地址" address={withdrawalAddress} onAddressChange={setWithdrawalAddress} screenshot={withdrawalScreenshot} onChoose={(event) => chooseScreenshot(event, 'withdrawal')} onRemove={() => setWithdrawalScreenshot(null)} />
          </div>
          <Hint tone="warning">本页仅为前端演示。请勿填写真实密码、真实钱包敏感信息，或上传含私钥、助记词的截图；图片只在本机预览。</Hint>
        </>
      )}
    </PageShell>
  )
}

function RecoveryProofCard({ title, addressLabel, address, onAddressChange, screenshot, onChoose, onRemove }) {
  return (
    <Card className="sfa-recovery-proof-card">
      <SectionTitle>{title}</SectionTitle>
      <Field label={addressLabel} value={address} onChange={onAddressChange} placeholder={`请输入${addressLabel}`} />
      <div className="sfa-recovery-upload-field">
        <div><b>交易截图</b><small>必填，1张 JPG/PNG，≤5MB</small></div>
        {screenshot ? <figure><img src={screenshot.dataUrl} alt={title} /><figcaption title={screenshot.name}>{screenshot.name}</figcaption><button type="button" onClick={onRemove} aria-label={`删除${title}截图`}><Trash2 size={15} /></button></figure> : <label><ImagePlus size={18} /><span>选择截图</span><input type="file" accept="image/jpeg,image/png" onChange={onChoose} /></label>}
      </div>
    </Card>
  )
}

function readRecoveryImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('图片读取失败'))
    reader.readAsDataURL(file)
  })
}

function formatRecoveryDate(date, includeTime = true) {
  const pad = (value) => String(value).padStart(2, '0')
  const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  if (!includeTime) return day
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
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
