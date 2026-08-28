import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, BellOff, BellRing, CheckCircle2, Gauge, Pencil, RotateCcw, Search, ShieldAlert, X } from 'lucide-react'
import { MemberRiskConfirmDialog } from './MemberRiskPages.jsx'

export const GAME_RISK_PATH = '/risk/game-profit-loss'
export const DEFAULT_RISK_BASE_DATE = '2026-08-27'
export const RISK_CURRENCIES = ['CNY', 'TRX', 'USDT']

export const RISK_PERIODS = [
  { key: 'today', label: '今日', days: 1, betFactor: 1, profitFactor: 1, limitFactor: 1 },
  { key: 'day3', label: '近3日', days: 3, betFactor: 2.75, profitFactor: 1.65, limitFactor: 1.55 },
  { key: 'day7', label: '近7日', days: 7, betFactor: 6.25, profitFactor: 3.1, limitFactor: 2.85 },
  { key: 'day15', label: '近15日', days: 15, betFactor: 13.4, profitFactor: 5.3, limitFactor: 4.75 },
  { key: 'day30', label: '近30日', days: 30, betFactor: 26.4, profitFactor: 8.6, limitFactor: 7.5 },
]

export const initialGameRiskRows = [
  { id: 1, name: '1分彩单双', code: 'hash_1fcds', type: '哈希游戏', source: '自营', baseBet: 780000, baseProfitLoss: { CNY: -132000, TRX: -18800, USDT: -2380 }, baseWarningLimits: { CNY: 100000, TRX: 13500, USDT: 1900 } },
  { id: 2, name: '尾数单双', code: 'hash_wsds', type: '哈希游戏', source: '自营', baseBet: 650000, baseProfitLoss: { CNY: -71000, TRX: -9800, USDT: -1320 }, baseWarningLimits: { CNY: 60000, TRX: 8000, USDT: 1100 } },
  { id: 3, name: '5分彩单双', code: 'hash_5fcds', type: '哈希游戏', source: '自营', baseBet: 492000, baseProfitLoss: { CNY: 45000, TRX: 6200, USDT: 880 }, baseWarningLimits: { CNY: 80000, TRX: 11000, USDT: 1600 } },
  { id: 4, name: '3分彩单双', code: 'hash_3fcds', type: '哈希游戏', source: '自营', baseBet: 438000, baseProfitLoss: { CNY: -21000, TRX: -3600, USDT: -520 }, baseWarningLimits: { CNY: 50000, TRX: 7200, USDT: 980 } },
  { id: 5, name: '尾数大小', code: 'hash_wsdx', type: '哈希游戏', source: '自营', baseBet: 386000, baseProfitLoss: { CNY: 78000, TRX: 10500, USDT: 1520 }, baseWarningLimits: { CNY: 70000, TRX: 9800, USDT: 1350 } },
  { id: 6, name: '30秒哈希', code: 'hash_30shash', type: '哈希游戏', source: '自营', baseBet: 355000, baseProfitLoss: { CNY: -38000, TRX: -5200, USDT: -780 }, baseWarningLimits: { CNY: 80000, TRX: 11200, USDT: 1450 } },
  { id: 7, name: '五张牛牛', code: 'hash_wznn', type: '哈希游戏', source: '自营', baseBet: 318000, baseProfitLoss: { CNY: 15000, TRX: 2100, USDT: 310 }, baseWarningLimits: { CNY: 60000, TRX: 8500, USDT: 1200 } },
  { id: 8, name: '牛牛', code: 'hash_niuniu', type: '哈希游戏', source: '自营', baseBet: 297000, baseProfitLoss: { CNY: -44000, TRX: -6100, USDT: -920 }, baseWarningLimits: { CNY: 90000, TRX: 12500, USDT: 1650 } },
  { id: 9, name: '哈希一分彩', code: 'hxyfc', type: '区块彩票', source: '自营', baseBet: 826000, baseProfitLoss: { CNY: -76000, TRX: -10300, USDT: -1480 }, baseWarningLimits: { CNY: 120000, TRX: 16800, USDT: 2300 } },
  { id: 10, name: '哈希三分彩', code: 'hxsfc', type: '区块彩票', source: '自营', baseBet: 692000, baseProfitLoss: { CNY: 62000, TRX: 8700, USDT: 1260 }, baseWarningLimits: { CNY: 100000, TRX: 14000, USDT: 1950 } },
  { id: 11, name: 'Fortune Tiger', code: 'pg_ftiger', type: '电子游戏', source: 'PG', baseBet: 920000, baseProfitLoss: { CNY: -29000, TRX: -4100, USDT: -650 }, baseWarningLimits: { CNY: 100000, TRX: 14000, USDT: 1950 } },
  { id: 12, name: 'God of War', code: 'cq9_gow', type: '电子游戏', source: 'CQ9', baseBet: 758000, baseProfitLoss: { CNY: 84000, TRX: 11600, USDT: 1680 }, baseWarningLimits: { CNY: 120000, TRX: 17000, USDT: 2350 } },
  { id: 13, name: '经典百家乐', code: 'evo_baccarat', type: '真人游戏', source: 'EVO', baseBet: 1180000, baseProfitLoss: { CNY: -52000, TRX: -7200, USDT: -980 }, baseWarningLimits: { CNY: 100000, TRX: 14500, USDT: 2050 } },
  { id: 14, name: '足球早盘', code: 'saba_soccer', type: '体育游戏', source: 'SABA', baseBet: 1380000, baseProfitLoss: { CNY: 96000, TRX: 13200, USDT: 1920 }, baseWarningLimits: { CNY: 150000, TRX: 21000, USDT: 2900 } },
]

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function shiftDate(date, offset) {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + offset)
  return value.toISOString().slice(0, 10)
}

function periodDateText(baseDate, period) {
  return period.days === 1 ? baseDate : `${shiftDate(baseDate, -(period.days - 1))} 至 ${baseDate}`
}

export function getWarningLimit(game, period, currency = 'CNY') {
  const savedLimit = game.warningLimits?.[currency]?.[period.key]
  const legacyCnyLimit = currency === 'CNY' ? game.warningLimits?.[period.key] : undefined
  const baseLimit = game.baseWarningLimits?.[currency] ?? (currency === 'CNY' ? game.warningLimit : 0)
  return roundMoney(savedLimit ?? legacyCnyLimit ?? baseLimit * period.limitFactor)
}

export function getRiskMetrics(game, period, currency = 'CNY') {
  const baseProfitLoss = game.baseProfitLoss?.[currency] ?? (currency === 'CNY' ? game.baseProfit : 0)
  const profitLoss = roundMoney(baseProfitLoss * period.profitFactor)
  const lossAmount = Math.max(0, -profitLoss)
  const warningLimit = getWarningLimit(game, period, currency)
  const riskValue = lossAmount > 0 ? lossAmount / warningLimit * 100 : 0
  const triggered = warningLimit > 0 && lossAmount >= warningLimit
  return { profitLoss, lossAmount, warningLimit, riskValue, triggered }
}

export function getGamePeriodRows(game, baseDate = DEFAULT_RISK_BASE_DATE) {
  return RISK_PERIODS.map((period) => {
    const currencies = Object.fromEntries(RISK_CURRENCIES.map((currency) => [currency, getRiskMetrics(game, period, currency)]))
    const betAmount = roundMoney(game.baseBet * period.betFactor)
    const payoutAmount = roundMoney(betAmount - currencies.CNY.profitLoss)
    const triggeredCurrencies = RISK_CURRENCIES.filter((currency) => currencies[currency].triggered)
    return { ...period, dateText: periodDateText(baseDate, period), betAmount, payoutAmount, currencies, triggeredCurrencies, triggered: triggeredCurrencies.length > 0 }
  })
}

export function getRiskAlertCount(games) {
  return new Set(games.filter((game) => !game.reminderMuted && RISK_PERIODS.some((period) => RISK_CURRENCIES.some((currency) => getRiskMetrics(game, period, currency).triggered))).map((game) => game.id)).size
}

function RiskCurrencyStack({ metrics, valueKey, percent = false }) {
  return (
    <div className={`risk-currency-stack ${percent ? 'percentage' : ''}`}>
      {RISK_CURRENCIES.map((currency) => {
        const metric = metrics[currency]
        const value = percent ? `${Number(metric[valueKey] || 0).toFixed(1)}%` : formatMoney(metric[valueKey])
        return <span className={metric.triggered ? 'danger' : ''} key={currency}><em>{currency}</em><b>{value}</b></span>
      })}
    </div>
  )
}

function RiskPeriodStatus({ metrics }) {
  const triggeredCurrencies = RISK_CURRENCIES.filter((currency) => metrics[currency].triggered)
  return triggeredCurrencies.length
    ? <span className="risk-status triggered currency-risk-status"><span><AlertTriangle size={13} />已触发</span><small>{triggeredCurrencies.join(' / ')}</small></span>
    : <span className="risk-status normal"><CheckCircle2 size={13} />正常</span>
}

export default function GameRiskControlPage({ games, setGames, toast }) {
  const baseDate = DEFAULT_RISK_BASE_DATE
  const [draft, setDraft] = useState({ keyword: '', type: '全部', status: '全部' })
  const [applied, setApplied] = useState({ keyword: '', type: '全部', status: '全部' })
  const [editing, setEditing] = useState(null)
  const [muting, setMuting] = useState(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef()

  const metricRows = useMemo(() => games.map((game) => {
    const periods = getGamePeriodRows(game, baseDate)
    const triggered = periods.some((period) => period.triggered)
    return { ...game, periods, triggered, activeReminder: triggered && !game.reminderMuted }
  }), [games, baseDate])
  const rawAlertCount = metricRows.filter((game) => game.triggered).length
  const alertCount = metricRows.filter((game) => game.activeReminder).length
  const mutedAlertCount = rawAlertCount - alertCount
  const visibleRows = metricRows.filter((game) => {
    const keyword = applied.keyword.trim().toLowerCase()
    if (keyword && !`${game.name} ${game.code} ${game.source}`.toLowerCase().includes(keyword)) return false
    if (applied.type !== '全部' && game.type !== applied.type) return false
    if (applied.status === '已触发' && !game.triggered) return false
    if (applied.status === '已忽略' && !(game.triggered && game.reminderMuted)) return false
    if (applied.status === '正常' && game.triggered) return false
    return true
  })
  const types = [...new Set(games.map((game) => game.type))]

  useEffect(() => {
    const refresh = () => runLoading('五个周期的风控数据已刷新')
    window.addEventListener('demo-refresh', refresh)
    return () => {
      window.removeEventListener('demo-refresh', refresh)
      window.clearTimeout(timer.current)
    }
  }, [])

  const runLoading = (message) => {
    setLoading(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setLoading(false)
      toast(message)
    }, 420)
  }

  const query = () => {
    setApplied({ keyword: draft.keyword, type: draft.type, status: draft.status })
    runLoading('查询成功，已筛选五周期游戏记录')
  }

  const reset = () => {
    setDraft({ keyword: '', type: '全部', status: '全部' })
    setApplied({ keyword: '', type: '全部', status: '全部' })
    runLoading('已重置风控筛选条件')
  }

  const saveLimits = (gameId, warningLimits) => {
    setGames((items) => items.map((game) => game.id === gameId ? { ...game, warningLimits } : game))
    setEditing(null)
    toast('五个周期的 CNY、TRX、USDT 亏损预警额度已保存，预警数量已重新计算')
  }

  const muteReminder = () => {
    setGames((items) => items.map((game) => game.id === muting.id ? { ...game, reminderMuted: true } : game))
    toast(`已关闭“${muting.name}”的亏损预警提醒，风险状态仍保留`)
    setMuting(null)
  }

  const restoreReminder = (game) => {
    setGames((items) => items.map((item) => item.id === game.id ? { ...item, reminderMuted: false } : item))
    toast(`已恢复“${game.name}”的亏损预警提醒`)
  }

  return (
    <div className="risk-page">
      <section className={`risk-alert-banner ${alertCount ? 'warning' : rawAlertCount ? 'muted' : 'safe'}`}>
        <div className="risk-alert-banner-icon">{alertCount ? <AlertTriangle size={22} /> : rawAlertCount ? <BellOff size={22} /> : <CheckCircle2 size={22} />}</div>
        <div><b>{alertCount ? `当前有 ${alertCount} 个游戏需要亏损预警提醒` : rawAlertCount ? '当前触发预警的游戏均已设置不再提醒' : '当前没有游戏触发亏损预警'}</b><p>原始风险状态始终保留；侧栏红色角标只统计已触发且尚未设置不再提醒的游戏。{mutedAlertCount > 0 ? ` 当前另有 ${mutedAlertCount} 个触发游戏已关闭提醒。` : ''}</p></div>
        {alertCount > 0 && <span>{alertCount}</span>}
      </section>

      <section className="panel risk-filter-panel">
        <div className="risk-filter-grid">
          <label><span>游戏关键词</span><input value={draft.keyword} onChange={(event) => setDraft((old) => ({ ...old, keyword: event.target.value }))} placeholder="游戏名称 / 编码 / 厂商" /></label>
          <label><span>游戏类型</span><select value={draft.type} onChange={(event) => setDraft((old) => ({ ...old, type: event.target.value }))}><option>全部</option>{types.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>预警状态</span><select value={draft.status} onChange={(event) => setDraft((old) => ({ ...old, status: event.target.value }))}><option>全部</option><option>已触发</option><option>已忽略</option><option>正常</option></select></label>
          <div className="risk-filter-actions"><button className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
        </div>
      </section>

      <section className="panel risk-table-panel">
        <div className="risk-table-head"><div><ShieldAlert size={17} /><b>游戏盈亏监控</b><span>每个游戏 5 排周期记录</span></div><span>共 <b>{visibleRows.length}</b> 个游戏 / <b>{visibleRows.length * 5}</b> 条周期记录</span></div>
        <div className="risk-table-scroll">
          <table className="risk-table five-period-table">
            <thead><tr><th>ID</th><th>游戏信息</th><th>游戏类型 / 来源</th><th>统计周期</th><th>有效投注（CNY）</th><th>派彩金额（CNY）</th><th>CNY 平台盈亏</th><th>TRX 平台盈亏</th><th>USDT 平台盈亏</th><th>亏损预警额度</th><th>风控盈亏值</th><th>预警状态</th><th>操作</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="13"><div className="risk-loading"><Gauge className="spin" size={22} />正在重新计算五个周期与三个币种的盈亏与预警...</div></td></tr>
                : visibleRows.length === 0 ? <tr><td colSpan="13"><div className="risk-empty">暂无符合条件的游戏</div></td></tr>
                  : visibleRows.map((game) => game.periods.map((period, periodIndex) => (
                    <tr key={`${game.id}-${period.key}`} className={`${period.triggered ? 'triggered' : ''} ${periodIndex === 0 ? 'game-start' : ''}`}>
                      {periodIndex === 0 && <td rowSpan="5" className="risk-game-fixed">{game.id}</td>}
                      {periodIndex === 0 && <td rowSpan="5" className="risk-game-fixed"><div className="risk-game-cell"><b>{game.name}</b><small>{game.code}</small></div></td>}
                      {periodIndex === 0 && <td rowSpan="5" className="risk-game-fixed"><div className="risk-game-cell"><span>{game.type}</span><small>{game.source}</small></div></td>}
                      <td><div className="risk-period-cell"><b>{period.label}</b><small>{period.dateText}</small></div></td>
                      <td>{formatMoney(period.betAmount)} <small>CNY</small></td>
                      <td>{formatMoney(period.payoutAmount)} <small>CNY</small></td>
                      {RISK_CURRENCIES.map((currency) => {
                        const profitLoss = period.currencies[currency].profitLoss
                        return <td key={currency}><span className={`risk-money ${profitLoss < 0 ? 'loss' : 'profit'}`}>{profitLoss > 0 ? '+' : ''}{formatMoney(profitLoss)} {currency}</span></td>
                      })}
                      <td><RiskCurrencyStack metrics={period.currencies} valueKey="warningLimit" /></td>
                      <td><RiskCurrencyStack metrics={period.currencies} valueKey="riskValue" percent /></td>
                      <td><RiskPeriodStatus metrics={period.currencies} /></td>
                      {periodIndex === 0 && <td rowSpan="5" className="risk-game-fixed"><div className="risk-game-actions"><button className="risk-edit-button" onClick={() => setEditing(game)}><Pencil size={13} />设置预警</button>{game.triggered && (game.reminderMuted ? <button className="risk-restore-button" onClick={() => restoreReminder(game)}><BellRing size={13} />恢复提醒</button> : <button className="risk-mute-button" onClick={() => setMuting(game)}><BellOff size={13} />不再提醒</button>)}</div></td>}
                    </tr>
                  )))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && <RiskLimitDialog game={editing} baseDate={baseDate} onClose={() => setEditing(null)} onSave={saveLimits} />}
      {muting && <MemberRiskConfirmDialog title="不再提醒该游戏" message={`确定不再提醒“${muting.name}”的亏损预警吗？五个周期的盈亏、额度、风控盈亏值和已触发状态仍会保留。`} confirmText="不再提醒" onCancel={() => setMuting(null)} onConfirm={muteReminder} />}
    </div>
  )
}

function RiskLimitDialog({ game, baseDate, onClose, onSave }) {
  const [values, setValues] = useState(() => Object.fromEntries(RISK_CURRENCIES.map((currency) => [currency, Object.fromEntries(RISK_PERIODS.map((period) => [period.key, String(getWarningLimit(game, period, currency))]))])))
  const [errors, setErrors] = useState({})
  const rows = getGamePeriodRows(game, baseDate)
  const updateValue = (currency, periodKey, value) => {
    const errorKey = `${currency}-${periodKey}`
    setValues((old) => ({ ...old, [currency]: { ...old[currency], [periodKey]: value } }))
    setErrors((old) => ({ ...old, [errorKey]: '' }))
  }
  const submit = () => {
    const nextErrors = {}
    const limits = Object.fromEntries(RISK_CURRENCIES.map((currency) => [currency, {}]))
    RISK_CURRENCIES.forEach((currency) => {
      RISK_PERIODS.forEach((period) => {
        const errorKey = `${currency}-${period.key}`
        const amount = Number(values[currency][period.key])
        if (String(values[currency][period.key]).trim() === '' || !Number.isFinite(amount) || amount <= 0) nextErrors[errorKey] = `请输入大于 0 的${currency}额度`
        else limits[currency][period.key] = roundMoney(amount)
      })
    })
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    onSave(game.id, limits)
  }
  return (
    <div className="modal-overlay risk-limit-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="risk-limit-dialog five-period-limit-dialog" role="dialog" aria-modal="true" aria-label={`设置亏损预警 · ${game.name}`}>
        <header><div><ShieldAlert size={18} /><b>设置亏损预警 · {game.name}</b></div><button aria-label="关闭亏损预警设置" onClick={onClose}><X size={18} /></button></header>
        <div className="risk-limit-body">
          <div className="risk-limit-game"><div><span>游戏编码</span><b>{game.code}</b></div><div><span>统计基准日</span><b>{baseDate}</b></div></div>
          <div className="risk-period-config">
            <div className="risk-period-config-head"><b>五周期三币种亏损预警额度</b><span>CNY、TRX、USDT 分别配置、分别判定</span></div>
            <div className="risk-period-config-scroll"><table className="risk-period-config-table multi-currency-config-table"><thead><tr><th>统计周期</th><th>当前亏损</th>{RISK_CURRENCIES.map((currency) => <th key={currency}>{currency} 预警额度</th>)}<th>风控盈亏值</th><th>状态</th></tr></thead><tbody>{rows.map((row) => {
              const draftMetrics = Object.fromEntries(RISK_CURRENCIES.map((currency) => {
                const limit = Number(values[currency][row.key]) || 0
                const lossAmount = row.currencies[currency].lossAmount
                return [currency, { ...row.currencies[currency], warningLimit: limit, riskValue: lossAmount > 0 && limit > 0 ? lossAmount / limit * 100 : 0, triggered: limit > 0 && lossAmount >= limit }]
              }))
              return <tr key={row.key}><td><b>{row.label}</b><small>{row.dateText}</small></td><td><RiskCurrencyStack metrics={row.currencies} valueKey="lossAmount" /></td>{RISK_CURRENCIES.map((currency) => {
                const errorKey = `${currency}-${row.key}`
                return <td key={currency}><div className="risk-config-input"><input aria-label={`${row.label}${currency}亏损预警额度`} type="number" min="0" step="0.01" value={values[currency][row.key]} onChange={(event) => updateValue(currency, row.key, event.target.value)} /><span>{currency}</span></div>{errors[errorKey] && <small className="risk-config-error">{errors[errorKey]}</small>}</td>
              })}<td><RiskCurrencyStack metrics={draftMetrics} valueKey="riskValue" percent /></td><td><RiskPeriodStatus metrics={draftMetrics} /></td></tr>
            })}</tbody></table></div>
          </div>
          <div className="risk-limit-tip"><AlertTriangle size={16} /><p><b>触发与计数规则</b>CNY、TRX、USDT 分别比较本币亏损与本币额度，不折算、不合并；任一周期的任一币种达到或超过额度，该游戏即触发预警。同一游戏即使多个周期或币种同时触发，侧栏红圈仍只计 1 个。</p></div>
        </div>
        <footer><button className="btn btn-default" onClick={onClose}>取消</button><button className="btn btn-primary" onClick={submit}>确定</button></footer>
      </section>
    </div>
  )
}
