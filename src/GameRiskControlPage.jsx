import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, BellOff, BellRing, CheckCircle2, Gauge, Pencil, RotateCcw, Search, ShieldAlert, X } from 'lucide-react'
import { MemberRiskConfirmDialog } from './MemberRiskPages.jsx'

export const GAME_RISK_PATH = '/risk/game-profit-loss'
export const DEFAULT_RISK_BASE_DATE = '2026-08-27'

export const RISK_PERIODS = [
  { key: 'today', label: '今日', days: 1, betFactor: 1, profitFactor: 1, limitFactor: 1 },
  { key: 'day3', label: '近3日', days: 3, betFactor: 2.75, profitFactor: 1.65, limitFactor: 1.55 },
  { key: 'day7', label: '近7日', days: 7, betFactor: 6.25, profitFactor: 3.1, limitFactor: 2.85 },
  { key: 'day15', label: '近15日', days: 15, betFactor: 13.4, profitFactor: 5.3, limitFactor: 4.75 },
  { key: 'day30', label: '近30日', days: 30, betFactor: 26.4, profitFactor: 8.6, limitFactor: 7.5 },
]

export const initialGameRiskRows = [
  { id: 1, name: '1分彩单双', code: 'hash_1fcds', type: '哈希游戏', source: '自营', baseBet: 780000, baseProfit: -132000, warningLimit: 100000 },
  { id: 2, name: '尾数单双', code: 'hash_wsds', type: '哈希游戏', source: '自营', baseBet: 650000, baseProfit: -71000, warningLimit: 60000 },
  { id: 3, name: '5分彩单双', code: 'hash_5fcds', type: '哈希游戏', source: '自营', baseBet: 492000, baseProfit: 45000, warningLimit: 80000 },
  { id: 4, name: '3分彩单双', code: 'hash_3fcds', type: '哈希游戏', source: '自营', baseBet: 438000, baseProfit: -21000, warningLimit: 50000 },
  { id: 5, name: '尾数大小', code: 'hash_wsdx', type: '哈希游戏', source: '自营', baseBet: 386000, baseProfit: 78000, warningLimit: 70000 },
  { id: 6, name: '30秒哈希', code: 'hash_30shash', type: '哈希游戏', source: '自营', baseBet: 355000, baseProfit: -38000, warningLimit: 80000 },
  { id: 7, name: '五张牛牛', code: 'hash_wznn', type: '哈希游戏', source: '自营', baseBet: 318000, baseProfit: 15000, warningLimit: 60000 },
  { id: 8, name: '牛牛', code: 'hash_niuniu', type: '哈希游戏', source: '自营', baseBet: 297000, baseProfit: -44000, warningLimit: 90000 },
  { id: 9, name: '哈希一分彩', code: 'hxyfc', type: '区块彩票', source: '自营', baseBet: 826000, baseProfit: -76000, warningLimit: 120000 },
  { id: 10, name: '哈希三分彩', code: 'hxsfc', type: '区块彩票', source: '自营', baseBet: 692000, baseProfit: 62000, warningLimit: 100000 },
  { id: 11, name: 'Fortune Tiger', code: 'pg_ftiger', type: '电子游戏', source: 'PG', baseBet: 920000, baseProfit: -29000, warningLimit: 100000 },
  { id: 12, name: 'God of War', code: 'cq9_gow', type: '电子游戏', source: 'CQ9', baseBet: 758000, baseProfit: 84000, warningLimit: 120000 },
  { id: 13, name: '经典百家乐', code: 'evo_baccarat', type: '真人游戏', source: 'EVO', baseBet: 1180000, baseProfit: -52000, warningLimit: 100000 },
  { id: 14, name: '足球早盘', code: 'saba_soccer', type: '体育游戏', source: 'SABA', baseBet: 1380000, baseProfit: 96000, warningLimit: 150000 },
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

export function getWarningLimit(game, period) {
  return roundMoney(game.warningLimits?.[period.key] ?? game.warningLimit * period.limitFactor)
}

export function getRiskMetrics(game, period) {
  const betAmount = roundMoney(game.baseBet * period.betFactor)
  const profitLoss = roundMoney(game.baseProfit * period.profitFactor)
  const payoutAmount = roundMoney(betAmount - profitLoss)
  const lossAmount = Math.max(0, -profitLoss)
  const warningLimit = getWarningLimit(game, period)
  const riskValue = lossAmount > 0 ? lossAmount / warningLimit * 100 : 0
  const triggered = warningLimit > 0 && lossAmount >= warningLimit
  return { betAmount, payoutAmount, profitLoss, lossAmount, warningLimit, riskValue, triggered }
}

export function getGamePeriodRows(game, baseDate = DEFAULT_RISK_BASE_DATE) {
  return RISK_PERIODS.map((period) => ({ ...period, dateText: periodDateText(baseDate, period), ...getRiskMetrics(game, period) }))
}

export function getRiskAlertCount(games) {
  return new Set(games.filter((game) => !game.reminderMuted && RISK_PERIODS.some((period) => getRiskMetrics(game, period).triggered)).map((game) => game.id)).size
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
    toast('五个周期的亏损预警额度已保存，预警数量已重新计算')
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
            <thead><tr><th>ID</th><th>游戏信息</th><th>游戏类型 / 来源</th><th>统计周期</th><th>有效投注</th><th>派彩金额</th><th>平台盈亏</th><th>亏损预警额度</th><th>风控盈亏值</th><th>预警状态</th><th>操作</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="11"><div className="risk-loading"><Gauge className="spin" size={22} />正在重新计算五个周期的盈亏与预警...</div></td></tr>
                : visibleRows.length === 0 ? <tr><td colSpan="11"><div className="risk-empty">暂无符合条件的游戏</div></td></tr>
                  : visibleRows.map((game) => game.periods.map((period, periodIndex) => (
                    <tr key={`${game.id}-${period.key}`} className={`${period.triggered ? 'triggered' : ''} ${periodIndex === 0 ? 'game-start' : ''}`}>
                      {periodIndex === 0 && <td rowSpan="5" className="risk-game-fixed">{game.id}</td>}
                      {periodIndex === 0 && <td rowSpan="5" className="risk-game-fixed"><div className="risk-game-cell"><b>{game.name}</b><small>{game.code}</small></div></td>}
                      {periodIndex === 0 && <td rowSpan="5" className="risk-game-fixed"><div className="risk-game-cell"><span>{game.type}</span><small>{game.source}</small></div></td>}
                      <td><div className="risk-period-cell"><b>{period.label}</b><small>{period.dateText}</small></div></td>
                      <td>{formatMoney(period.betAmount)} <small>CNY</small></td>
                      <td>{formatMoney(period.payoutAmount)} <small>CNY</small></td>
                      <td><span className={`risk-money ${period.profitLoss < 0 ? 'loss' : 'profit'}`}>{period.profitLoss > 0 ? '+' : ''}{formatMoney(period.profitLoss)} CNY</span></td>
                      <td>{formatMoney(period.warningLimit)} <small>CNY</small></td>
                      <td><div className={`risk-usage ${period.triggered ? 'danger' : ''}`}><div><i style={{ width: `${Math.min(100, period.riskValue)}%` }} /></div><span>{period.riskValue.toFixed(1)}%</span></div></td>
                      <td>{period.triggered ? <span className="risk-status triggered"><AlertTriangle size={13} />已触发</span> : <span className="risk-status normal"><CheckCircle2 size={13} />正常</span>}</td>
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
  const [values, setValues] = useState(() => Object.fromEntries(RISK_PERIODS.map((period) => [period.key, String(getWarningLimit(game, period))])))
  const [errors, setErrors] = useState({})
  const rows = getGamePeriodRows(game, baseDate)
  const submit = () => {
    const nextErrors = {}
    const limits = {}
    RISK_PERIODS.forEach((period) => {
      const amount = Number(values[period.key])
      if (!Number.isFinite(amount) || amount <= 0) nextErrors[period.key] = `请输入${period.label}大于 0 的额度`
      else limits[period.key] = roundMoney(amount)
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
            <div className="risk-period-config-head"><b>五周期亏损预警额度</b><span>每个周期独立配置</span></div>
            <div className="risk-period-config-scroll"><table className="risk-period-config-table"><thead><tr><th>统计周期</th><th>当前亏损</th><th>亏损预警额度</th><th>风控盈亏值</th><th>状态</th></tr></thead><tbody>{rows.map((row) => {
              const limit = Number(values[row.key]) || 0
              const riskValue = row.lossAmount > 0 && limit > 0 ? row.lossAmount / limit * 100 : 0
              const triggered = limit > 0 && row.lossAmount >= limit
              return <tr key={row.key}><td><b>{row.label}</b><small>{row.dateText}</small></td><td>{formatMoney(row.lossAmount)} CNY</td><td><div className="risk-config-input"><input aria-label={`${row.label}亏损预警额度`} type="number" min="0" step="0.01" value={values[row.key]} onChange={(event) => { setValues((old) => ({ ...old, [row.key]: event.target.value })); setErrors((old) => ({ ...old, [row.key]: '' })) }} /><span>CNY</span></div>{errors[row.key] && <small className="risk-config-error">{errors[row.key]}</small>}</td><td>{riskValue.toFixed(1)}%</td><td>{triggered ? <span className="risk-status triggered">已触发</span> : <span className="risk-status normal">正常</span>}</td></tr>
            })}</tbody></table></div>
          </div>
          <div className="risk-limit-tip"><AlertTriangle size={16} /><p><b>触发与计数规则</b>五个周期分别比较亏损金额与对应预警额度；任一周期达到或超过额度，该游戏即触发预警。一个游戏即使多个周期同时触发，侧栏红圈仍只计 1 个。</p></div>
        </div>
        <footer><button className="btn btn-default" onClick={onClose}>取消</button><button className="btn btn-primary" onClick={submit}>确定</button></footer>
      </section>
    </div>
  )
}
