import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { Field, Hint, PrimaryButton } from './accountUi'
import './credential-pair-recovery.css'

function normalizeValue(credential, value) {
  if (credential.type === 'fund' || credential.type === 'google') return value.replace(/\D/g, '').slice(0, 6)
  if (credential.type === 'login') return value.slice(0, 20)
  return value.slice(0, 100)
}

function validationMessage(credential, value) {
  if (credential.type === 'login' && (value.length < 6 || value.length > 20)) return '请输入6-20位登录密码'
  if (credential.type === 'fund' && !/^\d{6}$/.test(value)) return '请输入6位资金密码'
  if (credential.type === 'google' && !/^\d{6}$/.test(value)) return '请输入6位谷歌验证码'
  if (credential.type === 'security' && !value.trim()) return '请输入密保答案'
  return ''
}

export default function CredentialPairRecoveryPanel({
  availableCredentials = [],
  targetLabel = '安全项',
  actionText = '验证并找回',
  onVerified,
  onCancel,
  beforeVerify,
  identityKey = 'current-member',
}) {
  const fixedCredentials = useMemo(() => availableCredentials.slice(0, 2), [availableCredentials])
  const credentialSignature = fixedCredentials.map((credential) => credential.key).join('+')
  const [values, setValues] = useState({})
  const [checking, setChecking] = useState(false)
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    window.clearTimeout(timerRef.current)
    setValues({})
    setChecking(false)
    setVerified(false)
    setMessage('')
    return () => window.clearTimeout(timerRef.current)
  }, [identityKey, credentialSignature])

  const hasFixedPair = availableCredentials.length === 2 && fixedCredentials.length === 2
  const unavailableCredential = fixedCredentials.find((credential) => credential.available === false)

  const updateValue = (credential, value) => {
    setValues((current) => ({ ...current, [credential.key]: normalizeValue(credential, value) }))
    setMessage('')
  }

  const verify = () => {
    if (checking || verified || !hasFixedPair) return
    if (unavailableCredential) {
      setMessage(`${unavailableCredential.unavailableReason || `${unavailableCredential.label}不可用`}，请改用绑定地址充值找回`)
      return
    }
    const selectedKeys = fixedCredentials.map((item) => item.key)
    if (selectedKeys.length !== 2 || new Set(selectedKeys).size !== 2) {
      setMessage('固定双凭据配置异常，请改用绑定地址充值找回')
      return
    }
    for (const credential of fixedCredentials) {
      const error = validationMessage(credential, String(values[credential.key] || ''))
      if (error) {
        setMessage(error)
        return
      }
    }
    const payload = {
      selectedKeys,
      values: Object.fromEntries(selectedKeys.map((key) => [key, values[key] || ''])),
    }
    if (beforeVerify?.(payload) === false) return

    setChecking(true)
    setMessage('正在核验两项凭据…')
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setChecking(false)
      setVerified(true)
      setMessage('两项凭据验证通过')
      onVerified?.(payload)
    }, 420)
  }

  if (!hasFixedPair) {
    return (
      <section className="sfa-credential-recovery-panel" aria-label={`双凭据找回${targetLabel}`}>
        <div className="sfa-credential-recovery-heading"><span><ShieldCheck size={22} /></span><div><strong>双凭据找回{targetLabel}</strong><small>当前可用凭据不足两项</small></div></div>
        <Hint tone="warning">至少需要两项已设置且可用的其他安全凭据，请改用绑定地址充值找回。</Hint>
        {onCancel ? <button type="button" className="sfa-credential-recovery-cancel" onClick={onCancel}>取消</button> : null}
      </section>
    )
  }

  return (
    <section className="sfa-credential-recovery-panel" aria-label={`双凭据找回${targetLabel}`}>
      <div className="sfa-credential-recovery-heading">
        <span><ShieldCheck size={22} /></span>
        <div><strong>双凭据找回{targetLabel}</strong><small>本找回对象使用一组固定凭据，两项均正确才可通过</small></div>
      </div>

      <div className="sfa-credential-fixed-pair" aria-label="固定双凭据组合">
        <span>{fixedCredentials[0].label}</span><b>＋</b><span>{fixedCredentials[1].label}</span>
      </div>

      <div className="sfa-credential-pair-fields">
        {fixedCredentials.map((credential) => {
          const fieldProps = {
            label: credential.label,
            value: values[credential.key] || '',
            onChange: (value) => updateValue(credential, value),
            placeholder: credential.placeholder,
            disabled: checking || verified || Boolean(unavailableCredential),
            name: `recovery-${identityKey}-${credential.key}`,
            autoComplete: 'one-time-code',
            inputMode: credential.type === 'fund' || credential.type === 'google' ? 'numeric' : undefined,
          }
          return <Field key={credential.key} {...fieldProps} type={credential.type === 'login' || credential.type === 'fund' ? 'password' : 'text'} />
        })}
      </div>

      {unavailableCredential
        ? <Hint tone="warning">{unavailableCredential.unavailableReason || `${unavailableCredential.label}不可用`}，当前固定组合暂不可用，请改用绑定地址充值找回。</Hint>
        : <Hint>本方式不使用正在找回的{targetLabel}。固定组合必须两项同时验证，不能只填写其中一项。</Hint>}
      {message ? <div className={`sfa-credential-recovery-feedback ${verified ? 'is-success' : ''}`} role="status">{verified ? <CheckCircle2 size={16} /> : null}{message}</div> : null}
      <div className={`sfa-credential-recovery-actions ${onCancel ? 'has-cancel' : ''}`}>
        {onCancel ? <button type="button" className="sfa-credential-recovery-cancel" onClick={onCancel}>取消</button> : null}
        <PrimaryButton disabled={checking || verified || Boolean(unavailableCredential)} onClick={verify}>{verified ? '验证已完成' : checking ? '验证中…' : actionText}</PrimaryButton>
      </div>
    </section>
  )
}
