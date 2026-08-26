import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, Search, X } from 'lucide-react'
import { lotteryRuleRows } from './data.js'
import './lottery-rule.css'

const CURRENCIES = ['USDT', 'TRX', 'CNY']

function formatOddsSource(value) {
  return String(value).split('|').join(' | ')
}

function truncate(value, digits = 3) {
  const scale = 10 ** digits
  const result = Math.trunc((Number(value) + Number.EPSILON) * scale) / scale
  return result.toFixed(digits).replace(/\.?0+$/, '')
}

function playerOdds(row, lottOdds) {
  const extra = row.allowExtra ? Number(row.extraRate || 0) : 0
  const factor = Math.max(0, 1 - (2000 - Number(lottOdds)) / 2000 - extra)
  const values = String(row.configOdds).split('|').map((value) => truncate(Number(value) * factor))
  return { factor, values }
}

function RuleSwitch({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`lottery-rule-switch ${checked ? 'checked' : ''}`} onClick={() => onChange(!checked)}><i /></button>
}

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="lottery-rule-filter-item">
      <span>{label}</span>
      <div className="lottery-rule-select">
        <select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
        <ChevronDown size={14} />
      </div>
    </label>
  )
}

function NumberStepper({ label, value, onChange, step = 1, min = 0, precision = 0, compact = false }) {
  const change = (direction) => {
    const next = Math.max(min, Number(value || 0) + direction * step)
    onChange(precision ? next.toFixed(precision) : String(Math.round(next)))
  }
  return (
    <div className={`lottery-number-stepper ${compact ? 'compact' : ''}`}>
      <button type="button" aria-label={`${label}减少`} onClick={() => change(-1)}><Minus size={16} /></button>
      <input aria-label={label} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
      <button type="button" aria-label={`${label}增加`} onClick={() => change(1)}><Plus size={16} /></button>
    </div>
  )
}

export default function LotteryRulePage({ toast }) {
  const [rows, setRows] = useState(() => lotteryRuleRows.map((row) => ({ ...row, unitLimits: { ...row.unitLimits }, challengeLimits: { ...row.challengeLimits } })))
  const [filters, setFilters] = useState({ system: '时彩', family: '', play: '', status: '全部' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [selected, setSelected] = useState(() => new Set())
  const [lottOdds, setLottOdds] = useState('1940')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [page, setPage] = useState(1)
  const queryTimer = useRef()

  useEffect(() => {
    const refresh = () => {
      setLoading(true)
      window.clearTimeout(queryTimer.current)
      queryTimer.current = window.setTimeout(() => { setLoading(false); toast('页面已刷新') }, 480)
    }
    window.addEventListener('demo-refresh', refresh)
    return () => {
      window.removeEventListener('demo-refresh', refresh)
      window.clearTimeout(queryTimer.current)
    }
  }, [toast])

  const visibleRows = useMemo(() => rows.filter((row) => {
    if (appliedFilters.system !== '全部' && row.system !== appliedFilters.system) return false
    if (appliedFilters.family && !`${row.family}${row.subgroup}`.includes(appliedFilters.family.trim())) return false
    if (appliedFilters.play && !`${row.play}${row.playType}`.includes(appliedFilters.play.trim())) return false
    if (appliedFilters.status !== '全部' && (row.enabled ? '启用' : '停用') !== appliedFilters.status) return false
    return true
  }), [rows, appliedFilters])

  const runQuery = () => {
    setLoading(true)
    window.clearTimeout(queryTimer.current)
    queryTimer.current = window.setTimeout(() => {
      setAppliedFilters(filters)
      setPage(1)
      setLoading(false)
      toast('查询成功')
    }, 420)
  }

  const reset = () => {
    const next = { system: '时彩', family: '', play: '', status: '全部' }
    setFilters(next)
    setLoading(true)
    window.clearTimeout(queryTimer.current)
    queryTimer.current = window.setTimeout(() => {
      setAppliedFilters(next)
      setSelected(new Set())
      setPage(1)
      setLoading(false)
      toast('已重置筛选条件')
    }, 360)
  }

  const toggleSelection = (id) => setSelected((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const selectAll = (checked) => setSelected(checked ? new Set(visibleRows.map((row) => row.id)) : new Set())

  const toggleStatus = (id, enabled) => {
    const row = rows.find((item) => item.id === id)
    setRows((items) => items.map((item) => item.id === id ? { ...item, enabled } : item))
    toast(`${row?.play || '玩法'}已${enabled ? '启用' : '停用'}`)
  }

  const saveRow = (nextRow) => {
    setRows((items) => items.map((item) => item.id === nextRow.id ? nextRow : item))
    setEditing(null)
    toast('玩法赔率修改成功')
  }

  const allChecked = visibleRows.length > 0 && visibleRows.every((row) => selected.has(row.id))
  const drawRate = Math.max(0, (2000 - Number(lottOdds || 0)) / 20).toFixed(2)

  return (
    <div className="lottery-rule-page">
      <section className="lottery-rule-warning">
        <div className="lottery-rule-warning-icon">!</div>
        <div>
          <b>配置赔率 ≠ 玩家赔率</b>
          <p>玩家实际赔率 = 配置赔率 ×（1 -（2000 - lott_odds）/2000 - 抽水率 -【允许额外抽水】× 额外抽水率），并截断到 3 位小数（不是四舍五入）。</p>
          <p>下表「玩家赔率」列按右上角选择的赔率档位实时折算。按配置赔率倍数本金少赔约 3.5%，请以玩家赔率为准。</p>
        </div>
      </section>

      <section className="panel lottery-rule-filters">
        <SelectField label="玩法体系" value={filters.system} onChange={(value) => setFilters((old) => ({ ...old, system: value }))}>
          <option>时彩</option><option>全部</option><option>北京赛车</option><option>六合彩</option>
        </SelectField>
        <label className="lottery-rule-filter-item"><span>玩法族</span><input value={filters.family} onChange={(event) => setFilters((old) => ({ ...old, family: event.target.value }))} placeholder="如：前三" /></label>
        <label className="lottery-rule-filter-item play-name"><span>玩法名</span><input value={filters.play} onChange={(event) => setFilters((old) => ({ ...old, play: event.target.value }))} placeholder="如：前三组三" /></label>
        <SelectField label="状态" value={filters.status} onChange={(value) => setFilters((old) => ({ ...old, status: value }))}>
          <option>全部</option><option>启用</option><option>停用</option>
        </SelectField>
        <div className="lottery-rule-filter-buttons">
          <button className="btn btn-primary" onClick={runQuery}><Search size={14} />查询</button>
          <button className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button>
        </div>
      </section>

      <section className="panel lottery-rule-table-panel">
        <div className="lottery-rule-toolbar">
          <button className={`btn lottery-batch-button ${selected.size ? 'active' : ''}`} data-disabled={!selected.size} onClick={() => toast(selected.size ? `已提交 ${selected.size} 项批量调赔率演示` : '请先选择要调整的玩法', selected.size ? 'success' : 'error')}>批量调赔率（{selected.size}）</button>
          <div className="lottery-tier-tools">
            <span>折算档位 lott_odds</span>
            <NumberStepper compact label="折算档位" value={lottOdds} onChange={setLottOdds} min={1} />
            <em>抽水 {drawRate}%</em>
          </div>
        </div>

        <div className="lottery-rule-table-scroll">
          <table className="lottery-rule-table">
            <thead><tr>
              <th className="check-column"><input aria-label="全选玩法" type="checkbox" checked={allChecked} onChange={(event) => selectAll(event.target.checked)} /></th>
              <th>体系</th><th>玩法族 / 子组</th><th>玩法</th><th>配置赔率</th><th>玩家赔率（折算后）</th><th>额外抽水</th><th>总注数</th><th>单挑阈值</th><th>单注限额</th><th>状态</th><th>操作</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="12"><div className="lottery-rule-state">加载中...</div></td></tr>
                : visibleRows.length === 0 ? <tr><td colSpan="12"><div className="lottery-rule-state">暂无数据</div></td></tr>
                  : visibleRows.map((row) => {
                    const calculated = playerOdds(row, lottOdds)
                    return <tr key={row.id}>
                      <td className="check-column"><input aria-label={`选择${row.play}`} type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelection(row.id)} /></td>
                      <td>{row.system}</td>
                      <td><span className="rule-main-text">{row.family}</span><small>{row.subgroup}</small></td>
                      <td><span className="rule-main-text">{row.play}</span><small>{row.playType}</small></td>
                      <td><span className="configured-odds">{formatOddsSource(row.configOdds)}</span></td>
                      <td><div className="player-odds">{calculated.values.map((value, index) => <React.Fragment key={`${value}-${index}`}>{index > 0 && <i>|</i>}<b>{value}</b></React.Fragment>)}</div><small>系数 {truncate(calculated.factor, 3)}</small></td>
                      <td><span className="extra-rate-tag">{Number(row.extraRate).toFixed(3)}</span></td>
                      <td>{row.totalBets}</td>
                      <td>{row.challengeThreshold || '–'}</td>
                      <td><span className="limit-lines">USDT {row.unitLimits.USDT}<br />TRX {row.unitLimits.TRX}<br />CNY {row.unitLimits.CNY}</span></td>
                      <td><RuleSwitch checked={row.enabled} label={`${row.play}状态`} onChange={(checked) => toggleStatus(row.id, checked)} /></td>
                      <td><button className="lottery-edit-link" onClick={() => setEditing(row)}>编辑</button></td>
                    </tr>
                  })}
            </tbody>
          </table>
        </div>

        <div className="lottery-rule-pagination">
          <span>共 896 条</span><button>15条/页 <ChevronDown size={12} /></button>
          <button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={13} /></button>
          {[1, 2, 3, 4, 5, 60].map((value, index, list) => <React.Fragment key={value}>{index > 0 && value - list[index - 1] > 1 && <span>...</span>}<button className={page === value ? 'active' : ''} onClick={() => setPage(value)}>{value}</button></React.Fragment>)}
          <button disabled={page === 60} onClick={() => setPage((value) => Math.min(60, value + 1))}><ChevronRight size={13} /></button>
          <span>前往</span><input aria-label="前往页码" value={page} onChange={(event) => { const value = Number(event.target.value); if (value >= 1 && value <= 60) setPage(value) }} /><span>页</span>
        </div>
      </section>

      {editing && <LotteryRuleEditDialog row={editing} lottOdds={lottOdds} onClose={() => setEditing(null)} onSave={saveRow} />}
    </div>
  )
}

function LotteryRuleEditDialog({ row, lottOdds, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...row, unitLimits: { ...row.unitLimits }, challengeLimits: { ...row.challengeLimits } }))
  const [error, setError] = useState('')
  const calculated = playerOdds(form, lottOdds)
  const setValue = (key, value) => setForm((old) => ({ ...old, [key]: value }))
  const setLimit = (group, currency, value) => setForm((old) => ({ ...old, [group]: { ...old[group], [currency]: value } }))

  const submit = () => {
    const odds = String(form.configOdds).split('|').map((value) => Number(value.trim()))
    if (!odds.length || odds.some((value) => !Number.isFinite(value) || value <= 0)) {
      setError('请输入正确的配置赔率')
      return
    }
    onSave(form)
  }

  return (
    <div className="lottery-edit-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="lottery-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="lottery-edit-title">
        <header><b id="lottery-edit-title">编辑玩法</b><button aria-label="关闭编辑玩法" onClick={onClose}><X size={23} /></button></header>
        <div className="lottery-edit-body">
          <div className="lottery-edit-row lottery-play-summary"><label>玩法</label><div><b>{form.system} · {form.play}</b></div></div>
          <div className="lottery-edit-row align-start">
            <label htmlFor="configured-odds">配置赔率</label>
            <div className="lottery-edit-control"><input id="configured-odds" value={form.configOdds} onChange={(event) => { setValue('configOdds', event.target.value); setError('') }} />
              <small>折算后玩家赔率： <b>{calculated.values.join(' | ')}</b></small>{error && <em className="lottery-field-error">{error}</em>}
            </div>
          </div>
          <div className="lottery-edit-row">
            <label>允许额外抽水</label>
            <div className="lottery-edit-inline"><RuleSwitch checked={form.allowExtra} label="允许额外抽水" onChange={(checked) => setValue('allowExtra', checked)} /><span>关闭后不再扣减「额外抽水率」。竞品全站仅 5 项为关：各体系的「一星 / 定位胆」。</span></div>
          </div>
          <div className="lottery-edit-row"><label>额外抽水率</label><NumberStepper label="额外抽水率" value={form.extraRate} onChange={(value) => setValue('extraRate', value)} step={0.001} precision={6} /></div>
          <div className="lottery-edit-row"><label>总注数</label><NumberStepper label="总注数" value={String(form.totalBets)} onChange={(value) => setValue('totalBets', Number(value) || 0)} /></div>
          <div className="lottery-edit-row"><label htmlFor="winning-bets">可中注数</label><input id="winning-bets" className="lottery-short-input" value={form.canWinBets} onChange={(event) => setValue('canWinBets', event.target.value)} /></div>
          <div className="lottery-edit-row"><label>单挑阈值</label><div className="lottery-edit-inline"><NumberStepper label="单挑阈值" value={String(form.challengeThreshold)} onChange={(value) => setValue('challengeThreshold', Number(value) || 0)} /><span>注数 ≤ 该值即算单挑注单，0 表示该玩法不适用单挑。</span></div></div>

          <LimitSection title="单注限额" values={form.unitLimits} onChange={(currency, value) => setLimit('unitLimits', currency, value)} />
          <LimitSection title="单挑限额" values={form.challengeLimits} onChange={(currency, value) => setLimit('challengeLimits', currency, value)} />
        </div>
        <footer><button className="btn btn-default" onClick={onClose}>取消</button><button className="btn btn-primary" onClick={submit}>确定</button></footer>
      </section>
    </div>
  )
}

function LimitSection({ title, values, onChange }) {
  return (
    <fieldset className="lottery-limit-section">
      <legend>{title}</legend>
      <div className="lottery-limit-grid">
        {CURRENCIES.map((currency) => <label key={currency}><span>{currency}</span><input aria-label={`${title}${currency}`} value={values[currency]} onChange={(event) => onChange(currency, event.target.value)} /></label>)}
      </div>
    </fieldset>
  )
}
