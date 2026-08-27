import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Info,
  LoaderCircle,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'

export function useSfaActions({ toast, navigate, onBack } = {}) {
  const [localMessage, setLocalMessage] = useState('')

  useEffect(() => {
    if (!localMessage) return undefined
    const timer = window.setTimeout(() => setLocalMessage(''), 2200)
    return () => window.clearTimeout(timer)
  }, [localMessage])

  const notify = useCallback((message, tone = 'info') => {
    const text = String(message || '').trim()
    if (!text) return
    setLocalMessage(text)
    if (typeof toast === 'function') toast(text, tone)
  }, [toast])

  const go = useCallback((path) => {
    if (typeof navigate === 'function') navigate(path)
    else notify(`演示跳转：${path}`)
  }, [navigate, notify])

  const back = useCallback(() => {
    if (typeof onBack === 'function') onBack()
    else if (typeof navigate === 'function') navigate(-1)
    else notify('已返回上一页')
  }, [navigate, notify, onBack])

  const copy = useCallback(async (value, label = '内容') => {
    const text = String(value || '').trim()
    if (!text) return notify(`暂无可复制${label}`)
    try {
      await navigator.clipboard?.writeText(text)
      notify(`${label}已复制`, 'success')
    } catch {
      notify(`${label}已复制（演示）`, 'success')
    }
  }, [notify])

  return { localMessage, notify, go, back, copy }
}

export function PageShell({ title, subtitle, onBack, right, children, bottom, message, className = '' }) {
  return (
    <div className={`sfa-page ${className}`.trim()}>
      <header className="sfa-header">
        <button className="sfa-icon-button" type="button" aria-label="返回" onClick={onBack}>
          <ArrowLeft size={21} />
        </button>
        <div className="sfa-header-copy">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <div className="sfa-header-right">{right}</div>
      </header>
      <main className={`sfa-content ${bottom ? 'sfa-content--with-bottom' : ''}`}>{children}</main>
      {bottom ? <footer className="sfa-bottom-bar">{bottom}</footer> : null}
      {message ? <div className="sfa-local-toast" role="status">{message}</div> : null}
    </div>
  )
}

export function Card({ children, className = '', onClick }) {
  const Tag = onClick ? 'button' : 'section'
  return <Tag type={onClick ? 'button' : undefined} className={`sfa-card ${onClick ? 'sfa-card--button' : ''} ${className}`.trim()} onClick={onClick}>{children}</Tag>
}

export function SectionTitle({ children, action, onAction }) {
  return (
    <div className="sfa-section-title">
      <span>{children}</span>
      {action ? <button type="button" onClick={onAction}>{action}<ChevronRight size={15} /></button> : null}
    </div>
  )
}

export function Segmented({ items, value, onChange, compact = false }) {
  return (
    <div className={`sfa-segmented ${compact ? 'sfa-segmented--compact' : ''}`}>
      {items.map((item) => {
        const key = typeof item === 'string' ? item : item.value
        const label = typeof item === 'string' ? item : item.label
        return <button type="button" key={key} className={value === key ? 'is-active' : ''} onClick={() => onChange(key)}>{label}</button>
      })}
    </div>
  )
}

export function PillTabs({ items, value, onChange }) {
  return (
    <div className="sfa-pill-tabs">
      {items.map((item) => {
        const key = typeof item === 'string' ? item : item.value
        const label = typeof item === 'string' ? item : item.label
        return <button type="button" key={key} className={value === key ? 'is-active' : ''} onClick={() => onChange(key)}>{label}</button>
      })}
    </div>
  )
}

export function CurrencyTabs({ currencies, value, onChange, balanceKey = 'balance' }) {
  return (
    <div className="sfa-currency-grid">
      {currencies.map((currency) => (
        <button type="button" key={currency.code} className={`sfa-currency-card ${value === currency.code ? 'is-active' : ''}`} onClick={() => onChange(currency.code)}>
          <span className={`sfa-coin sfa-coin--${currency.color}`}>{currency.symbol}</span>
          <span>{currency.code}</span>
          {balanceKey ? <small>{Number(currency[balanceKey] || 0).toFixed(2)}</small> : null}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, value, onChange, placeholder = '请输入', type = 'text', suffix, right, disabled = false, textarea = false, maxLength }) {
  const Input = textarea ? 'textarea' : 'input'
  return (
    <label className="sfa-field">
      <span className="sfa-field-label">{label}{right ? <em>{right}</em> : null}</span>
      <span className={`sfa-input-wrap ${disabled ? 'is-disabled' : ''}`}>
        <Input
          value={value}
          type={textarea ? undefined : type}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(event) => onChange?.(event.target.value)}
        />
        {suffix ? <b>{suffix}</b> : null}
      </span>
    </label>
  )
}

export function PasswordField({ label, value, onChange, placeholder = '请输入密码', right }) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="sfa-field">
      <span className="sfa-field-label">{label}{right}</span>
      <span className="sfa-input-wrap">
        <input value={value} type={visible ? 'text' : 'password'} inputMode="numeric" autoComplete="new-password" placeholder={placeholder} onChange={(event) => onChange?.(event.target.value)} />
        <button className="sfa-input-icon" type="button" aria-label={visible ? '隐藏密码' : '显示密码'} onClick={() => setVisible((current) => !current)}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  )
}

export function SelectField({ label, value, placeholder = '请选择', onClick, right }) {
  return (
    <button className="sfa-select-field" type="button" onClick={onClick}>
      <span>{label ? <small>{label}</small> : null}<strong className={value ? '' : 'is-placeholder'}>{value || placeholder}</strong></span>
      {right || <ChevronDown size={18} />}
    </button>
  )
}

export function ActionRow({ title, subtitle, value, status, icon, onClick, danger = false }) {
  return (
    <button type="button" className={`sfa-action-row ${danger ? 'is-danger' : ''}`} onClick={onClick}>
      {icon ? <span className="sfa-action-icon">{icon}</span> : null}
      <span className="sfa-action-copy"><strong>{title}</strong>{subtitle ? <small>{subtitle}</small> : null}</span>
      {status ? <Badge tone="success">{status}</Badge> : null}
      {value ? <span className="sfa-action-value">{value}</span> : null}
      <ChevronRight size={17} />
    </button>
  )
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`sfa-badge sfa-badge--${tone}`}>{children}</span>
}

export function PrimaryButton({ children, onClick, disabled = false, loading = false, tone = 'primary', type = 'button' }) {
  return <button className={`sfa-button sfa-button--${tone}`} type={type} disabled={disabled || loading} onClick={onClick}>{loading ? <LoaderCircle className="sfa-spin" size={18} /> : null}{children}</button>
}

export function GhostButton({ children, onClick, danger = false }) {
  return <button className={`sfa-ghost-button ${danger ? 'is-danger' : ''}`} type="button" onClick={onClick}>{children}</button>
}

export function EmptyState({ title = '暂无数据', description, action, onAction }) {
  return (
    <div className="sfa-empty">
      <div className="sfa-empty-art">∅</div>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <GhostButton onClick={onAction}>{action}</GhostButton> : null}
    </div>
  )
}

export function Hint({ children, tone = 'info' }) {
  return <div className={`sfa-hint sfa-hint--${tone}`}><Info size={16} /><span>{children}</span></div>
}

export function QrPlaceholder({ label = '扫码查看', size = 'normal' }) {
  return <div className={`sfa-qr sfa-qr--${size}`} aria-label={label}><span>G6</span><small>{label}</small></div>
}

export function Modal({ open, title, children, onClose, footer, className = '', overlayClassName = '' }) {
  if (!open) return null
  return (
    <div className={`sfa-overlay ${overlayClassName}`.trim()} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className={`sfa-modal ${className}`.trim()} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button type="button" aria-label="关闭" onClick={onClose}><X size={20} /></button></header>
        <div className="sfa-modal-body">{children}</div>
        {footer ? <footer>{footer}</footer> : null}
      </section>
    </div>
  )
}

export function Sheet({ open, title, children, onClose, footer }) {
  if (!open) return null
  return (
    <div className="sfa-overlay sfa-overlay--sheet" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="sfa-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button type="button" onClick={onClose}>关闭</button></header>
        <div className="sfa-sheet-body">{children}</div>
        {footer ? <footer>{footer}</footer> : null}
      </section>
    </div>
  )
}

export function SelectSheet({ open, title, options, value, onSelect, onClose, empty = '暂无可选项' }) {
  return (
    <Sheet open={open} title={title} onClose={onClose}>
      {options?.length ? <div className="sfa-option-list">{options.map((option) => {
        const itemValue = typeof option === 'string' ? option : option.value
        const itemLabel = typeof option === 'string' ? option : option.label
        const itemNote = typeof option === 'string' ? '' : option.note
        return (
          <button type="button" key={itemValue} className={value === itemValue ? 'is-active' : ''} onClick={() => onSelect(itemValue, option)}>
            <span><strong>{itemLabel}</strong>{itemNote ? <small>{itemNote}</small> : null}</span>
            {value === itemValue ? <Check size={18} /> : <ChevronRight size={17} />}
          </button>
        )
      })}</div> : <EmptyState title={empty} />}
    </Sheet>
  )
}

export function ConfirmModal({ open, title, content, confirmText = '确定', cancelText = '取消', danger = false, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={<div className="sfa-modal-actions"><GhostButton onClick={onCancel}>{cancelText}</GhostButton><PrimaryButton tone={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</PrimaryButton></div>}
    >
      <p className="sfa-confirm-copy">{content}</p>
    </Modal>
  )
}

export function GoogleVerificationModal({ open, purpose = '敏感操作', onClose, onVerified }) {
  const [mode, setMode] = useState('code')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setMode('code')
      setValue('')
      setError('')
    }
  }, [open])

  const submit = () => {
    if (mode === 'code' && !/^\d{6}$/.test(value)) return setError('请输入6位谷歌验证码')
    if (mode === 'recovery' && value.trim().length < 6) return setError('请输入一个尚未使用的一次性恢复码')
    onVerified?.({ mode, token: mode === 'code' ? 'demo-google-proof' : 'demo-recovery-proof' })
  }

  return (
    <Modal
      open={open}
      title="谷歌安全验证"
      onClose={onClose}
      className="sfa-google-modal"
      footer={<PrimaryButton onClick={submit}>确认验证</PrimaryButton>}
    >
      <div className="sfa-security-emblem"><ShieldCheck size={31} /></div>
      <h3>{purpose}</h3>
      <p>{mode === 'code' ? '打开谷歌验证器，输入当前显示的6位验证码' : '请输入一个尚未使用的一次性恢复码'}</p>
      <Field
        label={mode === 'code' ? '谷歌验证码' : '一次性恢复码'}
        value={value}
        onChange={(next) => { setValue(mode === 'code' ? next.replace(/\D/g, '').slice(0, 6) : next.toUpperCase().slice(0, 20)); setError('') }}
        placeholder={mode === 'code' ? '请输入6位验证码' : '请输入恢复码'}
      />
      {error ? <div className="sfa-form-error">{error}</div> : null}
      <button className="sfa-text-button" type="button" onClick={() => { setMode(mode === 'code' ? 'recovery' : 'code'); setValue(''); setError('') }}>
        {mode === 'code' ? '无法使用验证器？使用恢复码' : '返回使用谷歌验证码'}
      </button>
    </Modal>
  )
}

export function SearchBox({ value, onChange, placeholder = '请输入搜索内容', onSearch }) {
  return (
    <div className="sfa-search-box">
      <Search size={17} />
      <input value={value} placeholder={placeholder} onChange={(event) => onChange?.(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && onSearch?.()} />
      <button type="button" onClick={onSearch}>搜索</button>
    </div>
  )
}

export function SummaryGrid({ items }) {
  return <div className="sfa-summary-grid">{items.map((item) => <div key={item.label}><small>{item.label}</small><strong>{item.value}</strong>{item.note ? <span>{item.note}</span> : null}</div>)}</div>
}

export function Toggle({ checked, onChange, label }) {
  return <button className={`sfa-toggle-row ${checked ? 'is-on' : ''}`} type="button" onClick={() => onChange(!checked)}><span>{label}</span><i><b /></i></button>
}

export function LoadingBlock({ text = '加载中...' }) {
  return <div className="sfa-loading"><LoaderCircle className="sfa-spin" size={21} />{text}</div>
}

export function useResolvedMode(explicit, path, choices, fallback) {
  return useMemo(() => {
    if (explicit && choices.includes(explicit)) return explicit
    const clean = String(path || '').toLowerCase()
    return choices.find((choice) => clean.includes(choice)) || fallback
  }, [choices, explicit, fallback, path])
}

export function CopyLine({ label, value, onCopy }) {
  return <div className="sfa-copy-line"><span><small>{label}</small><strong>{value || '—'}</strong></span><button type="button" onClick={onCopy}><Copy size={16} />复制</button></div>
}
