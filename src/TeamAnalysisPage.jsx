import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Download, LoaderCircle, RotateCcw, Search } from 'lucide-react'
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

const CURRENCIES = ['USDT', 'TRX', 'CNY']
const DATE_SHORTCUTS = [
  { key: 'today', label: '今日', start: '2026-08-27', end: '2026-08-27' },
  { key: 'yesterday', label: '昨日', start: '2026-08-26', end: '2026-08-26' },
  { key: 'day3', label: '近3日', start: '2026-08-25', end: '2026-08-27' },
  { key: 'day7', label: '近7日', start: '2026-08-21', end: '2026-08-27' },
  { key: 'day15', label: '近15日', start: '2026-08-13', end: '2026-08-27' },
  { key: 'day30', label: '近30日', start: '2026-07-29', end: '2026-08-27' },
]

function formatAmount(value) {
  return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

export default function TeamAnalysisPage({ toast }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [applied, setApplied] = useState(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(15)
  const [page, setPage] = useState(1)
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

  const filteredRows = useMemo(() => teamAnalysisRows.filter((row) => {
    if (applied.userId && row.id !== applied.userId.trim()) return false
    if (applied.username && !row.username.toLowerCase().includes(applied.username.trim().toLowerCase())) return false
    if (applied.parent && !row.parent.toLowerCase().includes(applied.parent.trim().toLowerCase())) return false
    if (applied.status !== '全部' && row.status !== applied.status) return false
    return true
  }), [applied])

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

  const exportCsv = () => {
    const headers = ['用户ID', '代理名称', '代理编码', '代理层级', '上级代理', '团队人数', '团队注册量', '直推数量', '团队活跃人数', '团队充值人数', ...['总充值', '总流水', '总盈亏', '工资'].flatMap((field) => CURRENCIES.map((currency) => `${field}（${currency}）`)), '状态']
    const values = filteredRows.map((row) => [row.id, row.username, row.agentCode, `L${row.level}`, row.parent, row.teamSize, row.teamRegistrations, row.directCount, row.activeCount, row.rechargeUsers, ...[row.recharge, row.turnover, row.profitLoss, row.wage].flatMap((valuesByCurrency) => CURRENCIES.map((currency) => formatAmount(valuesByCurrency[currency]))), row.status])
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
        <div><b>团队统计口径</b><p>团队人数及业务指标包含当前代理本人和全部直属、间接下级；团队注册量与直推数量只统计筛选期内新增下级，不含本人。</p></div>
        <span>USDT、TRX、CNY 分开统计，不跨币种相加</span>
      </section>

      <section className="panel team-filter-panel">
        <div className="team-date-shortcuts"><span><CalendarDays size={14} />快捷时间</span>{DATE_SHORTCUTS.map((shortcut) => <button key={shortcut.key} className={filters.quickDate === shortcut.key ? 'active' : ''} onClick={() => selectQuickDate(shortcut)}>{shortcut.label}</button>)}</div>
        <label className="team-filter-item team-date-filter">
          <span>统计日期</span>
          <div className="team-date-control"><CalendarDays size={14} /><input aria-label="统计开始日期" type="date" value={filters.start} onInput={(event) => updateDate('start', event.target.value)} onChange={(event) => updateDate('start', event.target.value)} /><em>至</em><input aria-label="统计结束日期" type="date" value={filters.end} onInput={(event) => updateDate('end', event.target.value)} onChange={(event) => updateDate('end', event.target.value)} /></div>
        </label>
        <label className="team-filter-item"><span>用户ID</span><input value={filters.userId} onChange={(event) => updateFilter('userId', event.target.value)} placeholder="精确查询" /></label>
        <label className="team-filter-item"><span>代理名称</span><input value={filters.username} onChange={(event) => updateFilter('username', event.target.value)} placeholder="模糊查询" /></label>
        <label className="team-filter-item"><span>上级代理</span><input value={filters.parent} onChange={(event) => updateFilter('parent', event.target.value)} placeholder="代理名称 / ID" /></label>
        <SelectControl label="代理状态" value={filters.status} onChange={(value) => updateFilter('status', value)} options={['全部', '启用', '停用']} />
        <div className="team-filter-buttons"><button className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
      </section>

      <section className="panel team-table-panel">
        <div className="team-table-toolbar">
          <button className="btn btn-default" onClick={exportCsv}><Download size={14} />导出当前结果</button>
          <div><span>{applied.start} 至 {applied.end}</span><i /><b>USDT / TRX / CNY</b> 独立统计<i />共 <b>{filteredRows.length}</b> 个团队</div>
        </div>
        <div className="team-table-scroll" tabIndex="0" aria-label="团队分析报表横向滚动区域">
          <table className="team-analysis-table">
            <thead><tr><th>用户ID</th><th>代理名称</th><th>代理编码</th><th>代理层级</th><th>上级代理</th><th>团队人数</th><th>团队注册量</th><th>直推数量</th><th>团队活跃人数</th><th>团队充值人数</th><th>总充值</th><th>总流水</th><th>总盈亏</th><th>工资</th><th>状态</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="15"><div className="team-table-state"><LoaderCircle className="spin" size={22} />加载中...</div></td></tr>
                : pagedRows.length === 0 ? <tr><td colSpan="15"><div className="team-table-state">暂无数据</div></td></tr>
                  : pagedRows.map((row) => <tr key={row.id}>
                    <td>{row.id}</td><td><b className="team-username">{row.username}</b></td><td>{row.agentCode}</td><td><span className="team-level">L{row.level}</span></td><td>{row.parent}</td><td>{row.teamSize}</td><td><b className="team-number">{row.teamRegistrations}</b></td><td>{row.directCount}</td><td>{row.activeCount}</td><td>{row.rechargeUsers}</td><td><CurrencyStack values={row.recharge} /></td><td><CurrencyStack values={row.turnover} /></td><td><CurrencyStack values={row.profitLoss} signed /></td><td><CurrencyStack values={row.wage} kind="wage" /></td><td><span className={`team-status ${row.status === '启用' ? 'enabled' : 'disabled'}`}>{row.status}</span></td>
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
    </div>
  )
}
