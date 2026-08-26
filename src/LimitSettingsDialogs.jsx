import React, { useState } from 'react'
import { Calculator, Coins, ShieldAlert, X } from 'lucide-react'
import './limit-settings.css'

const gameDefaults = { currency: 'CNY', maxReward: '500000.00' }
const lotteryDefaults = { challengeMultiple: '300', challengeRewardCap: '500000.00', periodRewardLimit: '1000000.00' }

function rowName(row = [], fallback) {
  return String(row[1] || fallback).split('\n')[0]
}

export function GameRedLimitDialog({ gameRow, value, onClose, onSave }) {
  const gameName = rowName(gameRow, '1分彩单双')
  const [form, setForm] = useState(value || gameDefaults)
  const [error, setError] = useState('')

  const submit = () => {
    if (!(Number(form.maxReward) > 0)) { setError('请输入大于 0 的每期最高返奖金额'); return }
    onSave({ ...form, currency: 'CNY' })
  }

  return (
    <div className="limit-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="limit-dialog game-limit-dialog" role="dialog" aria-modal="true" aria-label={`游戏限红 · ${gameName}`}>
        <LimitHeader title={`游戏限红 · ${gameName}`} onClose={onClose} />
        <div className="limit-dialog-body">
          <div className="limit-summary"><ShieldAlert size={20} /><div><b>每期净返奖风险控制</b><p>按人民币统一核算本期预计返奖，返奖金额不包含玩家本金。</p></div></div>

          <section className="limit-form-card">
            <h3>限红设置</h3>
            <LimitField label="核算币种"><div className="fixed-currency"><Coins size={15} /><b>CNY</b><span>人民币</span></div></LimitField>
            <LimitField label="每期最高返奖金额" required error={error}>
              <div className="limit-number-input"><input type="number" min="0" step="0.01" value={form.maxReward} onChange={(event) => { setForm((old) => ({ ...old, maxReward: event.target.value })); setError('') }} /><span>CNY</span></div>
            </LimitField>
          </section>

          <section className="limit-rule-card">
            <h3><Calculator size={16} />限红计算说明</h3>
            <ol>
              <li>只配置一个币种 CNY。CNY 投注直接计入；USDT、TRX 投注按投注受理时的平台兑换汇率折算为人民币后再参与计算。</li>
              <li>同一期、同一互斥盘口内汇总所有玩家后先抵扣：单双按“单－双”、大小按“大－小”计算；对冲可以发生在不同玩家之间，只保留绝对值对应的净方向敞口。</li>
              <li>限红占用只计算预计净返奖，不包含本金。新投注加入并重新完成跨用户对冲后，若净返奖占用仍超过本期最高返奖金额，则该笔投注不可受理。</li>
            </ol>
            <div className="limit-formulas">
              <p><b>统一折算金额</b> = CNY + USDT × USDT兑CNY汇率 + TRX × TRX兑CNY汇率</p>
              <p><b>单双 / 大小净敞口</b> = |Σ所有玩家方向A折算金额 − Σ所有玩家方向B折算金额|</p>
              <p><b>占用限红</b> = 净敞口 × 净返奖倍数（总赔率 − 1）</p>
            </div>
            <div className="limit-example"><b>抵扣示例</b><p>同一期购买 1,000 CNY“单”和 1,100 CNY“双”，抵扣后等于只保留 100 CNY“双”。若净返奖为 1 倍，则本期限红只占用 100 CNY，而不是 2,100 CNY。</p></div>
            <div className="limit-example"><b>跨用户对冲示例</b><p>同一期同一玩法中，A 用户投注 1,000 CNY“大”，B 用户投注 1,000 CNY“小”。两侧金额完全对冲，净敞口为 0，因此这两笔投注不会增加本期最高返奖占用，剩余额度不变；若两侧金额不同，只按抵扣后的差额计算占用。</p></div>
          </section>
        </div>
        <LimitFooter onClose={onClose} onSubmit={submit} />
      </section>
    </div>
  )
}

export function LotteryPeriodLimitDialog({ lotteryRow, value, onClose, onSave }) {
  const lotteryName = rowName(lotteryRow, '哈希一分彩')
  const [form, setForm] = useState(value || lotteryDefaults)
  const [errors, setErrors] = useState({})

  const setField = (key, next) => {
    setForm((old) => ({ ...old, [key]: next }))
    setErrors((old) => ({ ...old, [key]: '' }))
  }

  const submit = () => {
    const nextErrors = {}
    if (!(Number(form.challengeMultiple) > 0)) nextErrors.challengeMultiple = '请输入大于 0 的单挑倍数'
    if (!(Number(form.challengeRewardCap) > 0)) nextErrors.challengeRewardCap = '请输入大于 0 的单挑奖励上限'
    if (!(Number(form.periodRewardLimit) > 0)) nextErrors.periodRewardLimit = '请输入大于 0 的本期最高返奖金额'
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    onSave(form)
  }

  return (
    <div className="limit-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="limit-dialog lottery-limit-dialog" role="dialog" aria-modal="true" aria-label={`期数限红 · ${lotteryName}`}>
        <LimitHeader title={`期数限红 · ${lotteryName}`} onClose={onClose} />
        <div className="limit-dialog-body">
          <div className="limit-summary"><ShieldAlert size={20} /><div><b>单挑与整期限红</b><p>分别控制单个玩家的高倍中奖风险，以及本期全部玩家的返奖总风险。</p></div><span>CNY</span></div>

          <section className="limit-form-card lottery-challenge-card">
            <h3>一、单挑规则</h3>
            <div className="limit-field-grid">
              <LimitField label="单挑倍数" required error={errors.challengeMultiple}><div className="limit-number-input"><input type="number" min="0" step="1" value={form.challengeMultiple} onChange={(event) => setField('challengeMultiple', event.target.value)} /><span>倍</span></div></LimitField>
              <LimitField label="单挑奖励上限" required error={errors.challengeRewardCap}><div className="limit-number-input"><input type="number" min="0" step="0.01" value={form.challengeRewardCap} onChange={(event) => setField('challengeRewardCap', event.target.value)} /><span>CNY</span></div></LimitField>
            </div>
            <p className="limit-section-note">单挑倍数既是触发阈值，也是触发后的最高返奖倍数。实际倍数达到或高于设定值时触发；触发后先按单挑倍数封顶，再按单挑奖励上限封顶。</p>
            <div className="limit-formulas compact"><p><b>单挑实际倍数</b> = 命中理论奖金 ÷ 玩家本期该玩法有效投注总额</p><p><b>触发条件</b>：单挑实际倍数 ≥ 单挑倍数</p><p><b>倍数封顶净奖励</b> = 玩家本期该玩法有效投注总额 × 单挑倍数</p><p><b>实际发放净奖励</b> = min（理论净奖励，倍数封顶净奖励，单挑奖励上限）</p></div>
            <div className="limit-example"><b>单挑示例</b><p>“前三”理论奖金为 1,000 倍，单挑倍数设为 300 倍。购买 3 注时：1,000 ÷ 3 = 333.33 倍，高于 300 倍，触发单挑；先按 3 注有效投注 × 300 倍计算最高返奖，若该金额仍超过单挑奖励上限，则只按单挑奖励上限发放。购买 4 注时为 250 倍，不触发单挑。</p></div>
          </section>

          <section className="limit-form-card">
            <h3>二、本期投注限红</h3>
            <LimitField label="本期最高返奖金额" required error={errors.periodRewardLimit}><div className="limit-number-input"><input type="number" min="0" step="0.01" value={form.periodRewardLimit} onChange={(event) => setField('periodRewardLimit', event.target.value)} /><span>CNY</span></div></LimitField>
            <p className="limit-section-note">统计本期所有玩家已受理投注的预计净返奖总额，不包含任何投注本金。同一期、同一互斥玩法的相反选项须跨用户汇总后先对冲，只以抵扣后的净返奖风险占用限红。</p>
            <div className="limit-formulas compact"><p><b>互斥组选项净返奖</b> = |Σ所有玩家方向A预计净奖励 − Σ所有玩家方向B预计净奖励|</p><p><b>本期返奖占用</b> = Σ 各互斥组对冲后净返奖 + Σ 不可对冲投注预计净奖励（单挑订单先按单挑倍数封顶，再按单挑奖励上限封顶）</p><p><b>受理条件</b>：加入新投注并重新对冲后的本期返奖占用 ≤ 本期最高返奖金额</p></div>
            <div className="limit-example"><b>跨用户对冲示例</b><p>同一期同一大小玩法中，A 用户投注 1,000 CNY“大”，B 用户投注 1,000 CNY“小”。两侧预计净返奖完全对冲，新增本期返奖占用为 0，本期最高返奖剩余额度不变；若一侧金额更大，只按抵扣后的差额对应净返奖占用。</p></div>
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
