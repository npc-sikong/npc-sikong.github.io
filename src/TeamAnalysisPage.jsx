import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Copy, Download, LoaderCircle, RotateCcw, Search, Users, X } from 'lucide-react'
import { teamAnalysisRows } from './data.js'
import './team-analysis.css'

const DEFAULT_FILTERS = {
  start: '2026-08-27',
  end: '2026-08-27',
  quickDate: 'today',
  userId: '',
  username: '',
  parent: '',
  status: '全部',
}

const DEMO_TODAY = '2026-08-27'
const CURRENCIES = ['USDT', 'TRX', 'CNY']
const DATE_SHORTCUTS = [
  { key: 'today', label: '今日', start: '2026-08-27', end: '2026-08-27' },
  { key: 'yesterday', label: '昨日', start: '2026-08-26', end: '2026-08-26' },
  { key: 'day3', label: '近3日', start: '2026-08-25', end: '2026-08-27' },
  { key: 'day7', label: '近7日', start: '2026-08-21', end: '2026-08-27' },
  { key: 'day15', label: '近15日', start: '2026-08-13', end: '2026-08-27' },
  { key: 'day30', label: '近30日', start: '2026-07-29', end: '2026-08-27' },
]

const TABLE_COLUMNS = [
  ['用户ID', '当前统计行用户的唯一编号。'],
  ['用户名', '当前统计行用户的登录账号名称，不代表代理身份。'],
  ['上级会员', '当前用户的直属上级会员，显示用户名和用户ID；没有上级时显示“-”。'],
  ['团队人数', '当前用户本人及其全部直属、间接下级的当前总人数，不受日期筛选影响。'],
  ['新增注册', '统计日期内完成注册的直属与间接下级去重人数，不包含当前用户本人。'],
  ['直推数量', '统计日期内由当前用户直接邀请并完成注册的去重用户数。'],
  ['团队活跃人数', '统计日期内产生已结算有效流水的团队去重用户数，包含当前用户本人。'],
  ['团队充值人数', '统计日期内任一币种至少有一笔成功入账充值的团队去重用户数。'],
  ['总充值', '统计日期内团队成功且实际入账的充值金额，USDT、TRX、CNY 分开统计。'],
  ['总流水', '统计日期内团队已结算的有效流水，撤单、退款和无效注单不计。'],
  ['总盈亏', '统计日期内团队会员已结算派彩减去有效投注；正数为会员盈利，负数为会员亏损。'],
  ['工资', '统计日期内团队成员已结算或已发放的实际工资，按币种分别汇总。'],
  ['状态', '当前用户账号状态；停用不影响筛选期内已经发生的历史统计。'],
]

const METRIC_DEFINITIONS = {
  teamSize: { label: '团队人数', dateLabel: '注册时间' },
  newRegistrations: { label: '新增注册', dateLabel: '注册时间' },
  directCount: { label: '直推数量', dateLabel: '注册时间' },
  activeCount: { label: '团队活跃人数', dateLabel: '最近活跃时间' },
  rechargeUsers: { label: '团队充值人数', dateLabel: '充值时间' },
}

function formatAmount(value) {
  return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function dateAgo(days) {
  const date = new Date(`${DEMO_TODAY}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}

function withTime(date, index) {
  if (!date) return '-'
  const hour = String(8 + (index * 2) % 7).padStart(2, '0')
  const minute = String((index * 11) % 60).padStart(2, '0')
  return `${date} ${hour}:${minute}:00`
}

function inDateRange(date, start, end) {
  return Boolean(date && date >= start && date <= end)
}

function createTeamMembers(row) {
  const total = Math.max(1, Number(row.teamSize) || 1)
  const todayNew = Math.min(Math.max(0, Number(row.newRegistrations) || 0), total - 1)
  const todayDirect = Math.min(Math.max(0, Number(row.directCount) || 0), todayNew)
  const todayActive = Math.min(Math.max(0, Number(row.activeCount) || 0), total)
  const todayRecharge = Math.min(Math.max(0, Number(row.rechargeUsers) || 0), total)

  return Array.from({ length: total }, (_, index) => {
    const isSelf = index === 0
    const memberId = isSelf ? row.id : String(Number(row.id) * 100 + index)
    const username = isSelf ? row.username : `${row.username}_${String(index).padStart(2, '0')}`
    const registeredDaysAgo = isSelf ? 60 + Number(row.id) % 90 : index <= todayNew ? 0 : 1 + ((index - todayNew - 1) % 29)
    const registeredDate = dateAgo(registeredDaysAgo)
    const isDirect = !isSelf && (index <= todayDirect || (index > todayNew && index % 5 === 0))
    const activeDate = index < todayActive ? DEMO_TODAY : dateAgo(1 + ((index - todayActive + total) % 29))
    const rechargeDate = index < todayRecharge ? DEMO_TODAY : (!isSelf && index % 3 === 0 ? dateAgo(1 + ((index + total) % 29)) : '')
    const firstDirectId = total > 1 ? String(Number(row.id) * 100 + 1) : row.id
    const firstDirectName = total > 1 ? `${row.username}_01` : row.username

    return {
      id: memberId,
      username,
      parentMember: isSelf ? row.parentMember : isDirect ? `${row.username} / ${row.id}` : `${firstDirectName} / ${firstDirectId}`,
      relation: isSelf ? '本人' : isDirect ? '直推' : '间接',
      registeredDate,
      registeredAt: withTime(registeredDate, index),
      activeDate,
      activeAt: withTime(activeDate, index + 2),
      rechargeDate,
      rechargeAt: withTime(rechargeDate, index + 4),
      status: isSelf ? row.status : index % 13 === 0 ? '停用' : '启用',
    }
  })
}

const TEAM_MEMBERS = new Map(teamAnalysisRows.map((row) => [row.id, createTeamMembers(row)]))

function getMetricMembers(row, metric, start, end) {
  const members = TEAM_MEMBERS.get(row.id) || []
  if (metric === 'teamSize') return members
  if (metric === 'newRegistrations') return members.filter((member) => member.relation !== '本人' && inDateRange(member.registeredDate, start, end))
  if (metric === 'directCount') return members.filter((member) => member.relation === '直推' && inDateRange(member.registeredDate, start, end))
  if (metric === 'activeCount') return members.filter((member) => inDateRange(member.activeDate, start, end))
  if (metric === 'rechargeUsers') return members.filter((member) => inDateRange(member.rechargeDate, start, end))
  return []
}

function metricEventTime(member, metric) {
  if (metric === 'activeCount') return member.activeAt
  if (metric === 'rechargeUsers') return member.rechargeAt
  return member.registeredAt
}

function SelectControl({ label, value, onChange, options }) {
  return (
    <label className="team-filter-item">
      <span>{label}</span>
      <div className="team-select-control">
        <select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>
        <ChevronDown size={14} />
      </div>
    </label>
  )
}

function HeaderLabel({ label, tip }) {
  return <span className="team-header-label"><span>{label}</span><button type="button" aria-label={`${label}说明：${tip}`} data-tooltip={tip}>?</button></span>
}

function CurrencyStack({ values, signed = false, kind = '' }) {
  return (
    <div className={`team-currency-stack ${kind}`}>
      {CURRENCIES.map((currency) => {
        const amount = Number(values?.[currency] || 0)
        const amountClass = signed ? (amount < 0 ? 'negative' : amount > 0 ? 'positive' : '') : ''
        return <span key={currency}><em>{currency}</em><b className={amountClass}>{signed && amount > 0 ? '+' : ''}{formatAmount(amount)}</b></span>
      })}
    </div>
  )
}

function MetricButton({ value, label, onClick }) {
  return <button className="team-metric-button" type="button" aria-label={`查看${label}用户`} onClick={onClick}><b>{value}</b><Users size={13} /></button>
}

function UserMetricDialog({ detail, range, onClose, onCopy }) {
  if (!detail) return null
  const definition = METRIC_DEFINITIONS[detail.metric]
  const rangeText = detail.metric === 'teamSize' ? '当前团队全部用户' : `${range.start} 至 ${range.end}`
  return (
    <div className="team-user-dialog-mask" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="team-user-dialog" role="dialog" aria-modal="true" aria-label={`${definition.label}用户明细`}>
        <header>
          <div><b>{definition.label}用户明细</b><span>{detail.row.username}（ID：{detail.row.id}） · {rangeText}</span></div>
          <button type="button" aria-label="关闭" onClick={onClose}><X size={18} /></button>
        </header>
        <div className="team-user-dialog-summary"><span><Users size={15} />共 <b>{detail.members.length}</b> 位用户</span><p>点击右侧按钮可复制对应用户ID</p></div>
        <div className="team-user-dialog-table-wrap">
          <table>
            <thead><tr><th>用户ID</th><th>用户名</th><th>上级会员</th><th>关系</th><th>{definition.dateLabel}</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>{detail.members.length ? detail.members.map((member) => <tr key={member.id}><td><b>{member.id}</b></td><td>{member.username}</td><td>{member.parentMember}</td><td><span className={`team-relation ${member.relation}`}>{member.relation}</span></td><td>{metricEventTime(member, detail.metric)}</td><td>{member.status}</td><td><button className="team-copy-user" type="button" onClick={() => onCopy(member.id)}><Copy size={13} />复制ID</button></td></tr>) : <tr><td colSpan="7"><div className="team-user-empty">当前统计范围暂无对应用户</div></td></tr>}</tbody>
          </table>
        </div>
        <footer><button className="btn btn-default" type="button" onClick={onClose}>关闭</button></footer>
      </section>
    </div>
  )
}

export default function TeamAnalysisPage({ toast }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [applied, setApplied] = useState(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(15)
  const [page, setPage] = useState(1)
  const [metricDetail, setMetricDetail] = useState(null)
  const timer = useRef()

  useEffect(() => {
    const refresh = () => {
      setLoading(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => { setLoading(false); toast('团队分析数据已刷新') }, 500)
    }
    window.addEventListener('demo-refresh', refresh)
    return () => {
      window.removeEventListener('demo-refresh', refresh)
      window.clearTimeout(timer.current)
    }
  }, [toast])

  const rowsWithMetrics = useMemo(() => teamAnalysisRows.map((row) => {
    const metricMembers = Object.fromEntries(Object.keys(METRIC_DEFINITIONS).map((metric) => [metric, getMetricMembers(row, metric, applied.start, applied.end)]))
    return {
      ...row,
      metricMembers,
      teamSize: metricMembers.teamSize.length,
      newRegistrations: metricMembers.newRegistrations.length,
      directCount: metricMembers.directCount.length,
      activeCount: metricMembers.activeCount.length,
      rechargeUsers: metricMembers.rechargeUsers.length,
    }
  }), [applied.start, applied.end])

  const filteredRows = useMemo(() => rowsWithMetrics.filter((row) => {
    if (applied.userId && row.id !== applied.userId.trim()) return false
    if (applied.username && !row.username.toLowerCase().includes(applied.username.trim().toLowerCase())) return false
    if (applied.parent && !row.parentMember.toLowerCase().includes(applied.parent.trim().toLowerCase())) return false
    if (applied.status !== '全部' && row.status !== applied.status) return false
    return true
  }), [applied, rowsWithMetrics])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => setPage((current) => Math.min(current, totalPages)), [totalPages])

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const updateDate = (key, value) => setFilters((current) => current[key] === value && current.quickDate === '' ? current : ({ ...current, [key]: value, quickDate: '' }))
  const selectQuickDate = (shortcut) => setFilters((current) => ({ ...current, start: shortcut.start, end: shortcut.end, quickDate: shortcut.key }))

  const query = () => {
    const start = new Date(`${filters.start}T00:00:00`)
    const end = new Date(`${filters.end}T00:00:00`)
    const days = Math.floor((end - start) / 86400000) + 1
    if (!filters.start || !filters.end || start > end) {
      toast('统计开始日期不能晚于结束日期', 'error')
      return
    }
    if (days > 31) {
      toast('统计日期最多选择 31 天', 'error')
      return
    }
    setLoading(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setApplied(filters)
      setPage(1)
      setLoading(false)
      toast('团队分析查询成功')
    }, 450)
  }

  const reset = () => {
    setFilters(DEFAULT_FILTERS)
    setLoading(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setApplied(DEFAULT_FILTERS)
      setPage(1)
      setLoading(false)
      toast('已重置团队分析筛选条件')
    }, 360)
  }

  const openMetricDetail = (row, metric) => setMetricDetail({ row, metric, members: row.metricMembers[metric] })

  const copyUserId = async (userId) => {
    try {
      await navigator.clipboard.writeText(userId)
    } catch {
      const input = document.createElement('textarea')
      input.value = userId
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    toast(`用户ID ${userId} 已复制`)
  }

  const exportCsv = () => {
    const headers = ['用户ID', '用户名', '上级会员', '团队人数', '新增注册', '直推数量', '团队活跃人数', '团队充值人数', ...['总充值', '总流水', '总盈亏', '工资'].flatMap((field) => CURRENCIES.map((currency) => `${field}（${currency}）`)), '状态']
    const values = filteredRows.map((row) => [row.id, row.username, row.parentMember, row.teamSize, row.newRegistrations, row.directCount, row.activeCount, row.rechargeUsers, ...[row.recharge, row.turnover, row.profitLoss, row.wage].flatMap((valuesByCurrency) => CURRENCIES.map((currency) => formatAmount(valuesByCurrency[currency]))), row.status])
    const csv = [headers, ...values].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `团队分析表-${applied.start}-${applied.end}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    toast(`已导出 ${filteredRows.length} 条团队分析数据`)
  }

  const cyclePageSize = () => {
    const sizes = [15, 30, 50]
    setPageSize(sizes[(sizes.indexOf(pageSize) + 1) % sizes.length])
    setPage(1)
    toast('每页条数已更新')
  }

  return (
    <div className="team-analysis-page">
      <section className="team-analysis-note">
        <div><b>会员团队统计口径</b><p>团队人数包含当前用户本人和全部直属、间接下级；新增注册、直推、活跃和充值人数会随已查询的统计日期重新计算。</p></div>
        <span>USDT、TRX、CNY 分开统计，不跨币种相加</span>
      </section>

      <section className="panel team-filter-panel">
        <div className="team-date-shortcuts"><span><CalendarDays size={14} />快捷时间</span>{DATE_SHORTCUTS.map((shortcut) => <button key={shortcut.key} className={filters.quickDate === shortcut.key ? 'active' : ''} onClick={() => selectQuickDate(shortcut)}>{shortcut.label}</button>)}</div>
        <label className="team-filter-item team-date-filter">
          <span>统计日期</span>
          <div className="team-date-control"><CalendarDays size={14} /><input aria-label="统计开始日期" type="date" value={filters.start} onInput={(event) => updateDate('start', event.target.value)} onChange={(event) => updateDate('start', event.target.value)} /><em>至</em><input aria-label="统计结束日期" type="date" value={filters.end} onInput={(event) => updateDate('end', event.target.value)} onChange={(event) => updateDate('end', event.target.value)} /></div>
        </label>
        <label className="team-filter-item"><span>用户ID</span><input value={filters.userId} onChange={(event) => updateFilter('userId', event.target.value)} placeholder="精确查询" /></label>
        <label className="team-filter-item"><span>用户名</span><input value={filters.username} onChange={(event) => updateFilter('username', event.target.value)} placeholder="模糊查询" /></label>
        <label className="team-filter-item"><span>上级会员</span><input value={filters.parent} onChange={(event) => updateFilter('parent', event.target.value)} placeholder="用户名 / 用户ID" /></label>
        <SelectControl label="用户状态" value={filters.status} onChange={(value) => updateFilter('status', value)} options={['全部', '启用', '停用']} />
        <div className="team-filter-buttons"><button className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
      </section>

      <section className="panel team-table-panel">
        <div className="team-table-toolbar">
          <button className="btn btn-default" onClick={exportCsv}><Download size={14} />导出当前结果</button>
          <div><span>{applied.start} 至 {applied.end}</span><i /><b>USDT / TRX / CNY</b> 独立统计<i />共 <b>{filteredRows.length}</b> 个用户团队</div>
        </div>
        <div className="team-table-scroll" tabIndex="0" aria-label="团队分析报表横向滚动区域">
          <table className="team-analysis-table">
            <thead><tr>{TABLE_COLUMNS.map(([label, tip]) => <th key={label}><HeaderLabel label={label} tip={tip} /></th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="13"><div className="team-table-state"><LoaderCircle className="spin" size={22} />加载中...</div></td></tr>
                : pagedRows.length === 0 ? <tr><td colSpan="13"><div className="team-table-state">暂无数据</div></td></tr>
                  : pagedRows.map((row) => <tr key={row.id}>
                    <td>{row.id}</td>
                    <td><b className="team-username">{row.username}</b></td>
                    <td>{row.parentMember}</td>
                    <td><MetricButton value={row.teamSize} label="团队人数" onClick={() => openMetricDetail(row, 'teamSize')} /></td>
                    <td><MetricButton value={row.newRegistrations} label="新增注册" onClick={() => openMetricDetail(row, 'newRegistrations')} /></td>
                    <td><MetricButton value={row.directCount} label="直推数量" onClick={() => openMetricDetail(row, 'directCount')} /></td>
                    <td><MetricButton value={row.activeCount} label="团队活跃人数" onClick={() => openMetricDetail(row, 'activeCount')} /></td>
                    <td><MetricButton value={row.rechargeUsers} label="团队充值人数" onClick={() => openMetricDetail(row, 'rechargeUsers')} /></td>
                    <td><CurrencyStack values={row.recharge} /></td>
                    <td><CurrencyStack values={row.turnover} /></td>
                    <td><CurrencyStack values={row.profitLoss} signed /></td>
                    <td><CurrencyStack values={row.wage} kind="wage" /></td>
                    <td><span className={`team-status ${row.status === '启用' ? 'enabled' : 'disabled'}`}>{row.status}</span></td>
                  </tr>)}
            </tbody>
          </table>
        </div>
        <div className="team-pagination">
          <span>共 {filteredRows.length} 条</span><button onClick={cyclePageSize}>{pageSize}条/页 <ChevronDown size={12} /></button>
          <button aria-label="上一页" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={13} /></button>
          <button className="active">{page}</button>
          <button aria-label="下一页" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><ChevronRight size={13} /></button>
          <span>共 {totalPages} 页</span>
        </div>
      </section>

      <UserMetricDialog detail={metricDetail} range={applied} onClose={() => setMetricDetail(null)} onCopy={copyUserId} />
    </div>
  )
}
