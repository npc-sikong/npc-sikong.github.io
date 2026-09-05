import { useDemoSecurity } from './DemoSecurityContext'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Copy, ShieldCheck } from 'lucide-react'
import { Hint, Modal, PrimaryButton, QrPlaceholder, Field } from './accountUi'
import './security-recovery.css'

const RECOVERY_CHALLENGES = [
  { usdt: '13.06', trx: '36.88', address: 'TDemoRecoverWallet8G6HashV6Y2P3s' },
  { usdt: '13.69', trx: '30.00', address: 'TDemoRecoverWallet3Q9HashN8K2W6x' },
  { usdt: '11.28', trx: '42.16', address: 'TDemoRecoverWallet7R4HashM5V9L2a' },
  { usdt: '15.42', trx: '33.60', address: 'TDemoRecoverWallet2P8HashC6X4T9n' },
]

let challengeCursor = 0

function nextChallenge() {
  const challenge = RECOVERY_CHALLENGES[challengeCursor % RECOVERY_CHALLENGES.length]
  challengeCursor += 1
  return challenge
}

export function SecurityRecoveryPanel({
  beforeVerify,
  onVerified,
  purpose = '验证账户身份',
  title = '绑定地址充值找回',
  actionText = '我已转账',
  onCancel,
  boundAddress: explicitBoundAddress,
  identityKey,
}) {
  const demo = useDemoSecurity()
  const boundAddress = explicitBoundAddress ?? demo.boundAddress
  const [scenario, setScenario] = useState('match')
  const [expiresAt, setExpiresAt] = useState(Date.now() + 10 * 60 * 1000)
  const callbacks = useRef({ beforeVerify, onVerified })
  callbacks.current = { beforeVerify, onVerified }
  const [challenge, setChallenge] = useState(RECOVERY_CHALLENGES[0])
  const [currency, setCurrency] = useState('USDT')
  const [checking, setChecking] = useState(false)
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState('')
  const timerRef = useRef(null)
  const challengeIdentity = identityKey ?? boundAddress

  useEffect(() => {
    window.clearTimeout(timerRef.current)
    setChallenge(nextChallenge())
    setScenario('match')
    setExpiresAt(Date.now() + 10 * 60 * 1000)
    setCurrency('USDT')
    setChecking(false)
    setVerified(false)
    setMessage('')
    return () => window.clearTimeout(timerRef.current)
  }, [challengeIdentity])

  const amount = currency === 'USDT' ? challenge.usdt : challenge.trx

  const copyValue = async (value, label) => {
    try {
      await navigator.clipboard?.writeText(value)
    } catch {
      // Clipboard access may be unavailable in a local preview; the feedback remains observable.
    }
    setMessage(`${label}已复制（演示）`)
  }

  const verifyTransfer = () => {
    if (checking || verified) return
    if (!boundAddress) { setMessage('当前没有已绑定的TRC20提现地址，不能使用充值找回'); return }
    if (Date.now() >= expiresAt) { setMessage('当次挑战已过期，请刷新挑战'); return }

    const verification = {
      currency,
      amount,
      address: challenge.address,
      boundAddress,
    }
    const receipt = {
      source: scenario === 'source' ? '错误来源' : boundAddress,
      target: scenario === 'target' ? '错误目标' : challenge.address,
      coin: scenario === 'coin' ? (currency === 'USDT' ? 'TRX' : 'USDT') : currency,
      paid: scenario === 'amount' ? (Number(amount) + 0.01).toFixed(2) : amount,
    }
    if (receipt.source !== boundAddress || receipt.target !== challenge.address || receipt.coin !== currency || receipt.paid !== amount) {
      setMessage('验证失败：来源地址、收款地址、币种和精确金额必须全部一致，安全资料未改变')
      return
    }
    if (beforeVerify?.(verification) === false) return

    setChecking(true)
    setMessage(`正在自动核验 ${amount} ${currency} 的演示到账记录…`)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setChecking(false)
      if (callbacks.current.beforeVerify?.(verification) === false) return
      setVerified(true)
      setMessage('演示到账已确认，身份验证通过')
      callbacks.current.onVerified?.(verification)
    }, 520)
  }

  const cancel = () => {
    window.clearTimeout(timerRef.current)
    setChecking(false)
    setVerified(false)
    setMessage('')
    onCancel?.()
  }

  return (
    <section className="sfa-recovery-panel" aria-label={title}>
      <div className="sfa-transfer-recovery-heading">
        <span><ShieldCheck size={24} /></span>
        <div><strong>{title}</strong>{purpose ? <small>{purpose}</small> : null}</div>
      </div>

      {!boundAddress ? <Hint tone="warning">尚未绑定TRC20提现地址，充值找回不可用。</Hint> : null}
      <div className="sfa-transfer-recovery-rule">
        <b>请使用绑定地址 {boundAddress}</b>
        <span>向下方指定地址转入当次随机金额；演示核验通过后，仅模拟验证结果，不发生真实充值。</span>
      </div>

      <div className="sfa-transfer-amounts" role="radiogroup" aria-label="选择验证币种">
        {[
          { value: 'USDT', protocol: 'USDT-TRC20', amount: challenge.usdt },
          { value: 'TRX', protocol: 'TRON', amount: challenge.trx },
        ].map((item) => (
          <button type="button" role="radio" aria-checked={currency === item.value} disabled={checking || verified} className={currency === item.value ? 'is-active' : ''} key={item.value} onClick={() => { setCurrency(item.value); setMessage(`已选择 ${item.protocol}`) }}>
            <small>{item.protocol}</small>
            <strong>{item.amount}</strong>
            <span>{item.value}</span>
          </button>
        ))}
      </div>
      <div className="sfa-transfer-or">任选一种币种，按当次随机金额完成演示转账</div>

      <div className="sfa-transfer-qr">
        <QrPlaceholder label={`${currency} 收款地址`} size="large" />
      </div>

      <div className="sfa-transfer-copy-row">
        <span title={challenge.address}>{challenge.address}</span>
        <button type="button" disabled={checking || verified} onClick={() => copyValue(challenge.address, '收款地址')} aria-label="复制收款地址"><Copy size={17} /></button>
      </div>
      <div className="sfa-transfer-copy-row">
        <span>{amount} {currency}</span>
        <button type="button" disabled={checking || verified} onClick={() => copyValue(amount, '验证金额')} aria-label="复制验证金额"><Copy size={17} /></button>
      </div>

      <label className="sfa-field"><span>模拟到账记录（验收用）</span><select value={scenario} disabled={checking || verified} onChange={(e) => setScenario(e.target.value)}>
        <option value="match">四项全部匹配</option><option value="source">来源地址错误</option><option value="target">收款地址错误</option><option value="coin">币种错误</option><option value="amount">金额多0.01</option>
      </select></label>
      <button type="button" className="sfa-text-button" disabled={checking} onClick={() => { setChallenge(nextChallenge()); setExpiresAt(Date.now() + 10 * 60 * 1000); setVerified(false); setMessage('已刷新挑战，旧收款信息失效'); }}>刷新挑战</button>
      {message ? <div className={`sfa-transfer-feedback ${message.includes('通过') ? 'is-success' : ''}`} role="status">{message.includes('通过') ? <CheckCircle2 size={16} /> : null}{message}</div> : null}
      <Hint tone="warning">仅作本地流程演示，请勿真实转账。每次进入或切换验证身份会刷新一组演示金额，页面不会连接钱包或链上网络。</Hint>

      <div className={`sfa-recovery-panel-actions ${onCancel ? 'has-cancel' : ''}`.trim()}>
        {onCancel ? <button type="button" className="sfa-recovery-panel-cancel" onClick={cancel}>取消</button> : null}
        <PrimaryButton disabled={checking || verified || !boundAddress} onClick={verifyTransfer}>{verified ? '验证已完成' : checking ? '自动核验中…' : actionText}</PrimaryButton>
      </div>
    </section>
  )
}

export default function SecurityRecoveryModal({
  open,
  onClose,
  beforeVerify,
  onVerified,
  title = '充值找回',
  purpose = '验证账户身份',
  actionText = '我已转账',
  boundAddress: explicitBoundAddress,
  identityKey,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      className="sfa-recovery-modal"
      overlayClassName="sfa-overlay--nested"
    >
      <SecurityRecoveryPanel
        beforeVerify={beforeVerify}
        onVerified={onVerified}
        purpose={purpose}
        actionText={actionText}
        boundAddress={explicitBoundAddress}
        identityKey={identityKey}
      />
    </Modal>
  )
}
