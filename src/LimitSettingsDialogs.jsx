import React, { useState } from 'react'
import { Calculator, Coins, ShieldAlert, X } from 'lucide-react'
import './limit-settings.css'

const gameCurrencies = [
  { code: 'USDT', label: '泰达币' },
  { code: 'TRX', label: '波场币' },
  { code: 'CNY', label: '人民币' },
]
const gameDefaults = { USDT: '500000.00', TRX: '500000.00', CNY: '500000.00' }
const lotteryCurrencies = ['USDT', 'TRX', 'CNY']
const lotteryDefaults = {
  periodRewardLimits: { USDT: '1000000.00', TRX: '1000000.00', CNY: '1000000.00' },
}

function rowName(row = [], fallback) {
  return String(row[1] || fallback).split('\n')[0]
}

function normalizeGameLimits(value) {
  const saved = value?.maxRewards || value?.limits || value || {}
  return Object.fromEntries(gameCurrencies.map(({ code }) => {
    const legacyValue = code === 'CNY' ? value?.maxReward : undefined
    return [code, String(saved[code] ?? legacyValue ?? gameDefaults[code])]
  }))
}

function normalizeLotteryLimits(value) {
  return {
    periodRewardLimits: Object.fromEntries(lotteryCurrencies.map((currency) => [
      currency,
      value?.periodRewardLimits?.[currency]
        ?? value?.[`periodRewardLimit${currency}`]
        ?? (currency === 'CNY' ? value?.periodRewardLimit : undefined)
        ?? lotteryDefaults.periodRewardLimits[currency],
    ])),
  }
}

export function GameRedLimitDialog({ gameRow, value, onClose, onSave }) {
  const gameName = rowName(gameRow, '1分彩单双')
  const [form, setForm] = useState(() => normalizeGameLimits(value))
  const [errors, setErrors] = useState({})

  const setLimit = (currency, next) => {
    setForm((old) => ({ ...old, [currency]: next }))
    setErrors((old) => ({ ...old, [currency]: '' }))
  }

  const submit = () => {
    const nextErrors = {}
    gameCurrencies.forEach(({ code }) => {
      if (!(Number(form[code]) > 0)) nextErrors[code] = `请输入大于 0 的 ${code} 每期最高返奖金额`
    })
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    onSave({ maxRewards: { ...form } })
  }

  return (
    <div className="limit-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="limit-dialog game-limit-dialog" role="dialog" aria-modal="true" aria-label={`游戏限红 · ${gameName}`}>
        <LimitHeader title={`游戏限红 · ${gameName}`} onClose={onClose} />
        <div className="limit-dialog-body">
          <div className="limit-summary"><ShieldAlert size={20} /><div><b>每期净返奖风险控制</b><p>USDT、TRX、CNY 分别配置、分别核算，不做汇率折算或跨币种合并；返奖金额均不包含玩家本金。</p></div><div className="limit-summary-currencies">{gameCurrencies.map(({ code }) => <span key={code}>{code}</span>)}</div></div>

          <section className="limit-form-card">
            <h3>三币种独立限红设置</h3>
            <div className="game-currency-grid">
              {gameCurrencies.map(({ code, label }) => (
                <div className="game-currency-card" key={code}>
                  <div className="game-currency-card-header"><Coins size={15} /><b>{code}</b><span>{label}</span></div>
                  <LimitField label="每期最高返奖金额" required error={errors[code]}>
                    <div className="limit-number-input"><input aria-label={`${code} 每期最高返奖金额`} type="number" min="0" step="0.01" value={form[code]} onChange={(event) => setLimit(code, event.target.value)} /><span>{code}</span></div>
                  </LimitField>
                </div>
              ))}
            </div>
          </section>

          <section className="limit-rule-card">
            <h3><Calculator size={16} />限红计算说明</h3>
            <ol>
              <li>USDT、TRX、CNY 各自使用本币金额计算，三个币种的配置额度、已占用额度和剩余额度完全独立；不做汇率折算，也不跨币种抵扣。</li>
              <li>同一期、同一币种、同一互斥盘口内汇总所有玩家后先抵扣：单双按“单－双”、大小按“大－小”计算；只保留该币种绝对值对应的净方向敞口。</li>
              <li>每个币种的限红占用只计算该币种预计净返奖，不包含本金。新投注只校验投注币种自己的额度，其他币种是否有余额不会影响本币种受理结果。</li>
            </ol>
            <div className="limit-formulas">
              <p><b>币种 c 的单双 / 大小净敞口</b> = |Σ所有玩家方向A投注金额<sub>c</sub> − Σ所有玩家方向B投注金额<sub>c</sub>|</p>
              <p><b>币种 c 的限红占用</b> = 净敞口<sub>c</sub> × 净返奖倍数（总赔率 − 1）</p>
              <p><b>币种 c 的剩余额度</b> = 该币种每期最高返奖金额 − 该币种当前限红占用</p>
              <p><b>受理条件</b>：重新计算后的投注币种限红占用 ≤ 该币种每期最高返奖金额</p>
            </div>
            <div className="limit-example"><b>同币种抵扣示例</b><p>同一期购买 1,000 USDT“单”和 1,100 USDT“双”，抵扣后只保留 100 USDT“双”。若净返奖为 1 倍，则 USDT 限红只占用 100 USDT，而不是 2,100 USDT；TRX 与 CNY 额度均不变化。</p></div>
            <div className="limit-example"><b>跨用户、跨币种边界</b><p>A 用户投注 1,000 USDT“大”，B 用户投注 1,000 USDT“小”时，USDT 净敞口为 0，USDT 额度不增加占用；如果 B 用户投注的是 1,000 CNY“小”，则不能与 USDT 对冲，USDT 与 CNY 必须分别计算各自的限红占用。</p></div>
          </section>
        </div>
        <LimitFooter onClose={onClose} onSubmit={submit} />
      </section>
    </div>
  )
}

export function LotteryPeriodLimitDialog({ lotteryRow, value, onClose, onSave }) {
  const lotteryName = rowName(lotteryRow, '哈希一分彩')
  const [form, setForm] = useState(() => normalizeLotteryLimits(value))
  const [errors, setErrors] = useState({})

  const setCurrencyLimit = (currency, next) => {
    setForm((old) => ({
      ...old,
      periodRewardLimits: { ...old.periodRewardLimits, [currency]: next },
    }))
    setErrors((old) => ({ ...old, [currency]: '' }))
  }

  const submit = () => {
    const nextErrors = Object.fromEntries(lotteryCurrencies
      .filter((currency) => !(Number(form.periodRewardLimits[currency]) > 0))
      .map((currency) => [currency, `请输入大于 0 的 ${currency} 当期最高返奖金额`]))
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    onSave({
      periodRewardLimits: Object.fromEntries(lotteryCurrencies.map((currency) => [currency, form.periodRewardLimits[currency]])),
    })
  }

  return (
    <div className="limit-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="limit-dialog lottery-limit-dialog" role="dialog" aria-modal="true" aria-label={`期数限红 · ${lotteryName}`}>
        <LimitHeader title={`期数限红 · ${lotteryName}`} onClose={onClose} />
        <div className="limit-dialog-body">
          <div className="limit-summary"><ShieldAlert size={20} /><div><b>当期投注限红</b><p>USDT、TRX、CNY 分别配置和核算，不折算、不合并。</p></div><span>USDT / TRX / CNY</span></div>

          <section className="limit-form-card">
            <h3>当期投注限红</h3>
            {lotteryCurrencies.map((currency) => (
              <LimitField key={currency} label={`${currency} 当期最高返奖`} required error={errors[currency]}>
                <div className="limit-number-input"><input aria-label={`${currency} 当期最高返奖`} type="number" min="0" step="0.01" value={form.periodRewardLimits[currency]} onChange={(event) => setCurrencyLimit(currency, event.target.value)} /><span>{currency}</span></div>
              </LimitField>
            ))}
            <p className="limit-section-note">每个币种只统计本币种的预计净返奖，不含本金。相反方向对冲和多选一取最高均只在同币种内计算。</p>
            <div className="limit-formulas compact"><p><b>币种 c 的相反方向净返奖</b> = |Σ方向A预计净奖励 − Σ方向B预计净奖励|</p><p><b>币种 c 的多选一玩法占用</b> = max（各选项汇总后的预计净返奖）</p><p><b>币种 c 的当期返奖占用</b> = Σ相反方向对冲后净返奖 + Σ多选一玩法最高选项净返奖 + Σ其他玩法预计净返奖</p><p><b>受理条件</b>：币种 c 重新计算后的当期返奖占用 ≤ 币种 c 的当期最高返奖金额</p></div>
            <div className="limit-example"><b>同币种对冲示例</b><p>同一期同一大小玩法中，A 用户投注 1,000 USDT“大”，B 用户投注 1,000 USDT“小”，两侧完全对冲，USDT 新增占用为 0。若 B 用户投的是 TRX，则不与 USDT 对冲，两个币种分别计算。</p></div>
            <div className="limit-example"><b>同玩法取最高示例</b><p>定位胆同一位置有 0–9 十个号码，赔率 1:10。号码 0 投 1,000 USDT、号码 1 投 2,000 USDT，该玩法的 USDT 限红只计号码 1 对应的最高净返奖 18,000 USDT；TRX 和 CNY 的占用单独计算。</p></div>
          </section>
        </div>
        <LimitFooter onClose={onClose} onSubmit={submit} />
      </section>
    </div>
  )
}

function LimitHeader({ title, onClose }) {
  return <header className="limit-dialog-header"><b>{title}</b><button aria-label={`关闭${title}`} onClick={onClose}><X size={18} /></button></header>
}

function LimitFooter({ onClose, onSubmit }) {
  return <footer className="limit-dialog-footer"><button className="limit-btn" onClick={onClose}>取消</button><button className="limit-btn primary" onClick={onSubmit}>确定</button></footer>
}

function LimitField({ label, required, error, children }) {
  return <label className="limit-field"><span>{required && <em>*</em>}{label}</span><div>{children}{error && <small>{error}</small>}</div></label>
}
