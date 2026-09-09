import React, { useState } from 'react'
import { X } from 'lucide-react'
import { CHASE_WAKE_MODES, CHASE_WAKE_BOUNDARY, CHASE_WAKE_FRESH_SIGNAL, chaseWakeMode } from './chaseWakeRules'

export default function ChaseWakeModes({ value, onChange, readOnly = false }) {
  const [help, setHelp] = useState(null)
  const selected = chaseWakeMode(value)
  return <section className="sfg-chase-wake">
    <h3>{readOnly ? '唤醒规则触发机制' : '唤醒模式'}</h3>
    {readOnly ? <div className="sfg-chase-wake-row"><span>{selected.label}</span><button type="button" className="sfg-chase-wake-help" aria-label={`说明：${selected.label}`} onClick={() => setHelp(selected)}>?</button></div> : <div role="radiogroup" aria-label="唤醒规则触发机制">
      {CHASE_WAKE_MODES.map((item) => <div className={`sfg-chase-wake-row ${value === item.value ? 'selected' : ''}`} key={item.value}>
        <label><input type="radio" name="chase-wake-mode" value={item.value} checked={value === item.value} onChange={() => { onChange(item.value) }} /><span>{item.label}</span></label>
        <button type="button" className="sfg-chase-wake-help" aria-label={`说明：${item.label}`} onClick={() => setHelp(item)}>?</button>
      </div>)}
    </div>}
    <p className="sfg-chase-wake-note">只控制是否额外等待，不改变原策略的阶梯与结束条件。</p>
    {help && <div className="sfg-overlay sfg-chase-wake-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setHelp(null) }}>
      <section className="sfg-sheet" role="dialog" aria-modal="true" aria-label="唤醒模式说明">
        <div className="sfg-sheet-header"><b>唤醒模式说明</b><button type="button" className="sfg-icon-button" aria-label="关闭模式说明" onClick={() => setHelp(null)}><X size={20} /></button></div>
        <div className="sfg-sheet-body"><h3>{help.label}</h3><p>{help.explanation}</p><p>{help.example}</p><p>{CHASE_WAKE_BOUNDARY}</p><p>{CHASE_WAKE_FRESH_SIGNAL}</p><p>盈亏指本笔已结算的净结果，不是任务累计盈亏；未结算或净结果为0时，本模式不作盈亏触发判断。</p></div>
        <div className="sfg-sheet-footer"><button type="button" className="sfg-button sfg-button-primary" onClick={() => setHelp(null)}>我知道了</button></div>
      </section>
    </div>}
  </section>
}
