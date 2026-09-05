import { useState } from 'react'
import { useDemoSecurity } from './DemoSecurityContext'
import { SecurityRecoveryPanel } from './SecurityRecoveryModal'
import StorefrontRequirementEntry from './StorefrontRequirementEntry'
import { Card, ConfirmModal, CopyLine, Field, GhostButton, Hint, PageShell, PasswordField, PrimaryButton, QrPlaceholder, Segmented, useSfaActions } from './accountUi'

export default function GoogleAuthenticatorPage(props) {
  const actions = useSfaActions(props)
  const demo = useDemoSecurity()
  const bound = props.googleBound !== false
  const fromRecovery = String(props.path).includes('recovery=1')
  const [step, setStep] = useState(fromRecovery ? 'recover' : bound ? 'manage' : 'bind')
  const [method, setMethod] = useState('code')
  const [form, setForm] = useState({ account: demo.account, login: '', fund: '', old: '', next: '', recovery: '' })
  const [authorized, setAuthorized] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [result, setResult] = useState('')
  const [bindingEnabled, setBindingEnabled] = useState(true)
  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); if (['fund', 'old'].includes(key)) setAuthorized(false) }
  const grantValid = Boolean(demo.recoveryGrant?.account === demo.account && demo.recoveryGrant.expires > Date.now())
  const begin = (next) => { setStep(next); setAuthorized(false); setForm({ account: demo.account, login: '', fund: '', old: '', next: '', recovery: '' }); setResult('') }
  const fundValid = () => {
    if (!demo.validFund(form.fund)) { actions.notify('资金密码不正确或尚未设置'); return false }
    return true
  }
  const authorize = () => {
    if (!fundValid()) return
    if (step === 'change' && !/^\d{6}$/.test(form.old)) return actions.notify('请输入6位当前谷歌码')
    if (step === 'rebind' && !grantValid) return actions.notify('恢复授权不存在或已过期，请重新使用恢复码')
    setAuthorized(true)
    actions.notify('身份验证通过，请添加新验证器（演示）', 'success')
  }
  const finishBinding = () => {
    if (!authorized || !fundValid()) return
    if (step === 'rebind' && !grantValid) return actions.notify('恢复授权已过期')
    if (!/^\d{6}$/.test(form.next)) return actions.notify('请输入6位新谷歌验证码')
    if (step !== 'bind') demo.revokeSessions()
    demo.issueCodes()
    props.setGoogleBound?.(true)
    setResult(step === 'bind' ? '绑定成功' : '更换成功，全部旧会话已注销（演示）')
    setStep('codes')
  }
  const verifyRecovery = () => {
    if (form.account !== demo.account || !demo.validLogin(form.login)) return actions.notify('账号或登录密码不正确')
    if (!demo.consumeCode(form.recovery)) return actions.notify('恢复码无效、已使用或已作废')
    actions.notify('已取得受限恢复授权，仅可重新绑定或解绑', 'success')
  }
  const unbind = () => {
    if (!fundValid()) return
    if (step === 'unbind' && !/^\d{6}$/.test(form.old)) return actions.notify('请输入6位当前谷歌码')
    if (step === 'recover' && !grantValid) return actions.notify('请先取得有效恢复授权')
    setConfirm('credential')
  }
  const finishUnbind = () => {
    props.setGoogleBound?.(false)
    demo.clearGoogle()
    setConfirm('')
    setResult('谷歌验证已恢复未绑定，恢复码已作废，全部旧会话已注销（演示）')
    setStep('done')
  }
  const fundField = <PasswordField label="资金密码" value={form.fund} onChange={(v) => update('fund', v.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" />
  const oldField = <Field label="当前谷歌码" value={form.old} onChange={(v) => update('old', v.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位当前谷歌码" />
  return <PageShell title="谷歌验证器" onBack={actions.back} message={actions.localMessage}>
    <StorefrontRequirementEntry path="/front/pages/security/google-authenticator" />
    <Hint>仅本地演示。初始演示资金密码、谷歌码按6位数字格式核验；自行设置资金密码后必须使用新值。恢复码必须使用本原型生成且未消费的演示码。</Hint>
    {result ? <Hint tone="success">{result}</Hint> : null}
    {step === 'manage' ? <Card>
      <h3>谷歌验证器已绑定</h3>
      <PrimaryButton onClick={() => begin('change')}>更换谷歌验证器（原有）</PrimaryButton>
      <GhostButton onClick={() => begin('unbind')}>正常解绑（原有）</GhostButton>
      <GhostButton onClick={() => begin('recover')}>遗失验证器／备用找回</GhostButton>
      <GhostButton onClick={() => setStep('codes')}>查看演示恢复码</GhostButton>
    </Card> : null}
    {['bind', 'change', 'rebind'].includes(step) ? <Card>
      <h3>{step === 'bind' ? '初次绑定' : step === 'rebind' ? '恢复重新绑定' : '更换验证器'}</h3>
      {step === 'bind' ? <label className="sfa-check-row"><input type="checkbox" checked={bindingEnabled} onChange={(e) => setBindingEnabled(e.target.checked)} />模拟后台开放绑定功能</label> : null}
      {step !== 'bind' || bindingEnabled ? <>
        {fundField}
        {step === 'change' ? oldField : null}
        {!authorized ? <PrimaryButton onClick={authorize}>验证并生成新密钥</PrimaryButton> : <>
          <QrPlaceholder label="演示二维码，不可真实绑定" />
          <CopyLine label="演示密钥（无效样例）" value="DEMO-NOT-A-REAL-SECRET" onCopy={() => actions.copy('DEMO-NOT-A-REAL-SECRET', '演示密钥')} />
          <Field label="新谷歌验证码" value={form.next} onChange={(v) => update('next', v.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位新谷歌码" />
          <PrimaryButton onClick={finishBinding}>确认绑定新验证器</PrimaryButton>
        </>}
      </> : <Hint tone="warning">当前配置未开放谷歌绑定</Hint>}
      <GhostButton onClick={() => begin(bound ? 'manage' : 'bind')}>取消</GhostButton>
    </Card> : null}
    {step === 'codes' ? <Card>
      <h3>10个一次性恢复码（演示）</h3>
      <Hint>请保存演示恢复码。每个仅可使用一次，重新绑定后旧码全部作废；刷新恢复初始演示数据。</Hint>
      {demo.codes.map((item) => <CopyLine key={item.value} label={item.used ? '已使用' : '未使用'} value={item.value} onCopy={() => actions.copy(item.value, '演示恢复码')} />)}
      {!demo.codes.length ? <Hint>暂无有效恢复码，请先绑定验证器。</Hint> : null}
      <PrimaryButton onClick={() => begin(bound ? 'manage' : 'bind')}>我已保存，返回</PrimaryButton>
    </Card> : null}
    {step === 'unbind' ? <Card>
      <h3>正常解绑（原有）</h3>{fundField}{oldField}
      <PrimaryButton onClick={unbind}>验证并解绑</PrimaryButton>
      <GhostButton onClick={() => begin('recover')}>当前验证码不可用？</GhostButton>
    </Card> : null}
    {step === 'recover' ? <>
      <Segmented items={[{ value: 'code', label: '恢复码（原有）' }, { value: 'transfer', label: '充值找回（新增）' }]} value={method} onChange={setMethod} />
      {method === 'code' ? <Card>
        {!grantValid ? <>
          <Field label="会员账号" value={form.account} onChange={(v) => update('account', v)} />
          <PasswordField label="登录密码" value={form.login} onChange={(v) => update('login', v)} />
          <Field label="一次性恢复码" value={form.recovery} onChange={(v) => update('recovery', v.toUpperCase())} placeholder="请输入未使用的演示恢复码" />
          <PrimaryButton onClick={verifyRecovery}>验证并取得恢复授权</PrimaryButton>
        </> : <>
          <Hint tone="success">已取得受限恢复授权（10分钟演示有效期），不能直接登录。</Hint>
          {fundField}
          <PrimaryButton onClick={unbind}>恢复解绑</PrimaryButton>
          <GhostButton onClick={() => { if (fundValid()) { setStep('rebind'); setAuthorized(true) } }}>恢复重新绑定</GhostButton>
        </>}
      </Card> : <SecurityRecoveryPanel identityKey={demo.account} onVerified={() => setConfirm('transfer')} purpose="四项匹配后恢复为未绑定，并作废恢复码" actionText="模拟到账并验证" />}
      <GhostButton onClick={() => begin(bound ? 'manage' : 'bind')}>返回</GhostButton>
    </> : null}
    {step === 'done' ? <Card><PrimaryButton onClick={() => begin('bind')}>重新绑定谷歌验证器</PrimaryButton><GhostButton onClick={() => actions.go('/pages/login/login')}>去登录</GhostButton></Card> : null}
    <ConfirmModal open={Boolean(confirm)} title="确认解绑谷歌验证？" content="解绑后恢复未绑定状态，作废全部恢复码并注销旧会话。只影响本地演示账号。" danger confirmText="确认解绑" onCancel={() => setConfirm('')} onConfirm={finishUnbind} />
  </PageShell>
}
