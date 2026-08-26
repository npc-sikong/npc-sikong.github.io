import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import './market-config.css'

const currencies = ['CNY', 'USDT', 'TRX']

const makeLimits = () => Object.fromEntries(currencies.map((currency) => [currency, {
  min: '1.000000',
  max: '20000.000000',
  payout: '45000.000000',
}]))

const initialMarkets = [
  { id: '10', marketCode: 'ws_shuang', marketName: '双', playCode: 'ws_ds', playName: '尾数单双', limits: makeLimits(), sort: '20', enabled: true },
  { id: '9', marketCode: 'ws_dan', marketName: '单', playCode: 'ws_ds', playName: '尾数单双', limits: makeLimits(), sort: '10', enabled: true },
]

function getGameName(row = []) {
  return String(row[1] || '1分彩单双').split('\n')[0]
}

export default function MarketConfigDialog({ gameRow, onClose, toast }) {
  const gameName = getGameName(gameRow)
  const [rows, setRows] = useState(initialMarkets)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState({ keyword: '', status: 'all' })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [pageSize, setPageSize] = useState(15)

  const visibleRows = useMemo(() => rows.filter((item) => {
    const normalized = query.keyword.trim().toLowerCase()
    const matchesKeyword = !normalized || [item.marketCode, item.marketName, item.playCode, item.playName].some((value) => value.toLowerCase().includes(normalized))
    const matchesStatus = query.status === 'all' || (query.status === 'enabled' ? item.enabled : !item.enabled)
    return matchesKeyword && matchesStatus
  }), [query, rows])

  const runQuery = () => {
    setLoading(true)
    window.setTimeout(() => {
      setQuery({ keyword, status })
      setLoading(false)
      toast('查询成功')
    }, 320)
  }

  const reset = () => {
    setKeyword('')
    setStatus('all')
    setQuery({ keyword: '', status: 'all' })
    toast('已重置筛选条件')
  }

  const saveMarket = (values, isCreate) => {
    if (isCreate) {
      const nextId = String(Math.max(0, ...rows.map((item) => Number(item.id) || 0)) + 1)
      setRows((items) => [{ ...values, id: nextId }, ...items])
      toast('新增成功')
    } else {
      setRows((items) => items.map((item) => item.id === values.id ? values : item))
      toast('修改成功')
    }
    setEditing(null)
  }

  const confirmDelete = () => {
    setRows((items) => items.filter((item) => item.id !== deleting.id))
    setDeleting(null)
    toast('删除成功')
  }

  return (
    <div className="market-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="market-config-dialog" role="dialog" aria-modal="true" aria-label={`盘口配置 · ${gameName}`}>
        <header className="market-dialog-header">
          <b>盘口配置 · {gameName}</b>
          <button aria-label="关闭盘口配置" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="market-dialog-body">
          <div className="market-filter-row">
            <label><span>关键词</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="盘口 / 玩法编码 / 名称" onKeyDown={(event) => event.key === 'Enter' && runQuery()} /></label>
            <label><span>状态</span><div className="market-select"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">全部</option><option value="enabled">启用</option><option value="disabled">停用</option></select><ChevronDown size={13} /></div></label>
            <button className="market-btn primary" disabled={loading} onClick={runQuery}>{loading ? '查询中' : '查询'}</button>
            <button className="market-btn" onClick={reset}>重置</button>
          </div>

          <div className="market-toolbar">
            <div><button className="market-btn primary" onClick={() => setEditing({ mode: 'create' })}>新增盘口</button><span>仅自营游戏支持盘口配置，当前游戏：{gameName}</span></div>
            <span>共 {visibleRows.length} 条</span>
          </div>

          <div className={`market-table-wrap ${loading ? 'loading' : ''}`}>
            <table className="market-config-table">
              <thead><tr><th>ID</th><th>盘口信息</th><th>玩法信息</th><th>投注设定</th><th>排序</th><th>操作</th></tr></thead>
              <tbody>
                {visibleRows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><b>{item.marketName}</b><small>{item.marketCode}</small></td>
                    <td><b>{item.playName}</b><small>{item.playCode}</small></td>
                    <td><div className="market-limit-summary">{currencies.map((currency) => <div key={currency}><b>{currency}</b><span>最小 {item.limits[currency].min}</span><span>最大 {item.limits[currency].max}</span><span>派奖 {item.limits[currency].payout}</span></div>)}</div></td>
                    <td><input className="market-sort-input" type="number" value={item.sort} onChange={(event) => setRows((items) => items.map((row) => row.id === item.id ? { ...row, sort: event.target.value } : row))} onBlur={() => toast('排序已更新')} /></td>
                    <td><div className="market-row-actions"><button onClick={() => setEditing({ mode: 'edit', row: item })}>编辑</button><button className="danger" onClick={() => setDeleting(item)}>删除</button></div></td>
                  </tr>
                ))}
                {!visibleRows.length && <tr><td className="market-empty" colSpan="6">暂无数据</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="market-pagination">
            <span>共 {visibleRows.length} 条</span>
            <button className="market-page-size" onClick={() => setPageSize((value) => value === 15 ? 30 : value === 30 ? 50 : 15)}>{pageSize}条/页 <ChevronDown size={12} /></button>
            <button disabled><ChevronLeft size={13} /></button><button className="active">1</button><button disabled><ChevronRight size={13} /></button>
            <span>前往</span><input value="1" readOnly /><span>页</span>
          </div>
        </div>

        <footer className="market-dialog-footer"><button className="market-btn" onClick={onClose}>关闭</button></footer>
      </section>

      {editing && <MarketEditor gameName={gameName} market={editing.row} isCreate={editing.mode === 'create'} onClose={() => setEditing(null)} onSave={saveMarket} />}
      {deleting && <MarketDeleteConfirm market={deleting} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
    </div>
  )
}

function MarketEditor({ gameName, market, isCreate, onClose, onSave }) {
  const [values, setValues] = useState(() => market ? structuredClone(market) : {
    id: '', marketCode: '', marketName: '', playCode: '', playName: '', limits: makeLimits(), sort: '0', enabled: true,
  })
  const [errors, setErrors] = useState({})

  const setField = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const setLimit = (currency, key, value) => setValues((current) => ({
    ...current,
    limits: { ...current.limits, [currency]: { ...current.limits[currency], [key]: value } },
  }))

  const submit = () => {
    const nextErrors = {}
    if (!values.marketCode.trim()) nextErrors.marketCode = '请输入盘口编码'
    if (!values.marketName.trim()) nextErrors.marketName = '请输入盘口名称'
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    onSave(values, isCreate)
  }

  return (
    <div className="market-editor-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="market-editor-dialog" role="dialog" aria-modal="true" aria-label={isCreate ? '新增盘口' : '编辑盘口'}>
        <header className="market-dialog-header"><b>{isCreate ? '新增盘口' : '编辑盘口'}</b><button aria-label="关闭编辑盘口" onClick={onClose}><X size={18} /></button></header>
        <div className="market-editor-body">
          <EditorField label="所属游戏"><input value={gameName} disabled /></EditorField>
          <EditorField label="盘口编码" required error={errors.marketCode}><input value={values.marketCode} onChange={(event) => setField('marketCode', event.target.value)} /></EditorField>
          <EditorField label="盘口名称" required error={errors.marketName}><input value={values.marketName} onChange={(event) => setField('marketName', event.target.value)} /></EditorField>
          <EditorField label="玩法编码"><input value={values.playCode} onChange={(event) => setField('playCode', event.target.value)} /></EditorField>
          <EditorField label="玩法名称"><input value={values.playName} onChange={(event) => setField('playName', event.target.value)} /></EditorField>
          <EditorField label="投注设定" className="market-settings-field">
            <div className="market-limit-editor">{currencies.map((currency) => <div key={currency}><b>{currency}</b><span>最小</span><input type="number" step="0.000001" value={values.limits[currency].min} onChange={(event) => setLimit(currency, 'min', event.target.value)} /><span>最大</span><input type="number" step="0.000001" value={values.limits[currency].max} onChange={(event) => setLimit(currency, 'max', event.target.value)} /><span>派奖</span><input type="number" step="0.000001" value={values.limits[currency].payout} onChange={(event) => setLimit(currency, 'payout', event.target.value)} /></div>)}</div>
          </EditorField>
          <EditorField label="状态"><div className="market-switch-field"><button type="button" className={`market-switch ${values.enabled ? 'checked' : ''}`} onClick={() => setField('enabled', !values.enabled)}><i /></button><span>{values.enabled ? '启用' : '停用'}</span></div></EditorField>
          <EditorField label="排序"><input className="market-order-field" type="number" value={values.sort} onChange={(event) => setField('sort', event.target.value)} /></EditorField>
        </div>
        <footer className="market-dialog-footer"><button className="market-btn" onClick={onClose}>取消</button><button className="market-btn primary" onClick={submit}>确定</button></footer>
      </section>
    </div>
  )
}

function EditorField({ label, required, error, className = '', children }) {
  return <label className={`market-editor-field ${className}`}><span>{required && <em>*</em>}{label}</span><div>{children}{error && <small className="market-field-error">{error}</small>}</div></label>
}

function MarketDeleteConfirm({ market, onCancel, onConfirm }) {
  return (
    <div className="market-editor-overlay market-confirm-overlay">
      <section className="market-confirm-dialog" role="alertdialog" aria-modal="true">
        <header className="market-dialog-header"><b>操作确认</b><button aria-label="关闭删除确认" onClick={onCancel}><X size={18} /></button></header>
        <div><p>确定删除盘口“{market.marketName}”吗？</p><small>删除后仅影响当前前端演示数据。</small></div>
        <footer className="market-dialog-footer"><button className="market-btn" onClick={onCancel}>取消</button><button className="market-btn danger" onClick={onConfirm}>删除</button></footer>
      </section>
    </div>
  )
}
