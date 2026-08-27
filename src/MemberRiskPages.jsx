import React, { useMemo, useRef, useState } from 'react'
import { AlertTriangle, BellOff, CheckCircle2, Copy, Pencil, Plus, RotateCcw, Search, ShieldAlert, Trash2, Users, X } from 'lucide-react'
import './member-risk.css'

export const MEMBER_RISK_RULE_PATH = '/risk/member-rule-setting'
export const MEMBER_RISK_LIST_PATH = '/risk/member-list'

const RISK_BASE_DATE = '2026-08-28'
const RULE_UPDATED_AT = '2026-08-28 03:45:00'

export const MEMBER_RISK_METRICS = [
  { key: 'recharge', label: '充值金额', unit: 'CNY', kind: 'money' },
  { key: 'withdraw', label: '提现金额', unit: 'CNY', kind: 'money' },
  { key: 'bet', label: '投注金额', unit: 'CNY', kind: 'money' },
  { key: 'winRate', label: '胜率', unit: '%', kind: 'percent' },
  { key: 'profit', label: '盈利金额', unit: 'CNY', kind: 'money' },
  { key: 'loss', label: '亏损金额', unit: 'CNY', kind: 'money' },
]

const OPERATORS = [
  { key: 'gte', label: '大于等于', symbol: '≥' },
  { key: 'gt', label: '大于', symbol: '>' },
  { key: 'lte', label: '小于等于', symbol: '≤' },
  { key: 'lt', label: '小于', symbol: '<' },
]

export const initialMemberRiskRules = [
  {
    id: 101,
    name: '近7日大额充值高胜率',
    days: 7,
    logic: 'all',
    enabled: true,
    conditions: [
      { id: '101-1', metric: 'recharge', operator: 'gte', value: 70000 },
      { id: '101-2', metric: 'winRate', operator: 'gte', value: 70 },
    ],
    updatedAt: RULE_UPDATED_AT,
  },
  {
    id: 102,
    name: '近3日高额提现且盈利',
    days: 3,
    logic: 'all',
    enabled: true,
    conditions: [
      { id: '102-1', metric: 'withdraw', operator: 'gte', value: 30000 },
      { id: '102-2', metric: 'profit', operator: 'gte', value: 45000 },
    ],
    updatedAt: RULE_UPDATED_AT,
  },
  {
    id: 103,
    name: '近30日高额亏损',
    days: 30,
    logic: 'all',
    enabled: true,
    conditions: [
      { id: '103-1', metric: 'loss', operator: 'gte', value: 150000 },
    ],
    updatedAt: RULE_UPDATED_AT,
  },
]

export const memberRiskProfiles = [
  { id: '133', username: 'evan777', level: '普通会员', registeredAt: '2026-07-12 11:28:10', lastActiveAt: '2026-08-28 02:46:12', dailyRecharge: 15200, dailyWithdraw: 6800, dailyBet: 48200, dailyPayout: 51400, dailySettledBets: 14, dailyWinningBets: 11 },
  { id: '185', username: 'sky185', level: 'VIP3', registeredAt: '2026-05-09 18:16:35', lastActiveAt: '2026-08-28 03:01:44', dailyRecharge: 23800, dailyWithdraw: 15800, dailyBet: 96600, dailyPayout: 117200, dailySettledBets: 25, dailyWinningBets: 18 },
  { id: '219', username: 'mango219', level: '普通会员', registeredAt: '2026-06-18 09:40:02', lastActiveAt: '2026-08-27 23:57:31', dailyRecharge: 4200, dailyWithdraw: 1500, dailyBet: 37600, dailyPayout: 29400, dailySettledBets: 19, dailyWinningBets: 8 },
  { id: '241', username: 'nova241', level: 'VIP2', registeredAt: '2026-04-23 15:31:27', lastActiveAt: '2026-08-28 01:15:08', dailyRecharge: 13100, dailyWithdraw: 9200, dailyBet: 71300, dailyPayout: 80100, dailySettledBets: 27, dailyWinningBets: 20 },
  { id: '288', username: 'Appleee', level: '普通会员', registeredAt: '2026-08-19 19:32:18', lastActiveAt: '2026-08-27 21:42:19', dailyRecharge: 3800, dailyWithdraw: 1200, dailyBet: 16800, dailyPayout: 15100, dailySettledBets: 29, dailyWinningBets: 14 },
  { id: '289', username: 'orange', level: '普通会员', registeredAt: '2026-08-20 00:32:29', lastActiveAt: '2026-08-28 02:10:52', dailyRecharge: 11400, dailyWithdraw: 4600, dailyBet: 52800, dailyPayout: 56900, dailySettledBets: 32, dailyWinningBets: 23 },
  { id: '290', username: 'ceshi1112', level: 'VIP1', registeredAt: '2026-08-20 09:40:21', lastActiveAt: '2026-08-27 20:33:46', dailyRecharge: 2700, dailyWithdraw: 900, dailyBet: 22400, dailyPayout: 16800, dailySettledBets: 32, dailyWinningBets: 12 },
  { id: '291', username: 'evanmm88', level: 'VIP2', registeredAt: '2026-08-20 18:48:44', lastActiveAt: '2026-08-28 00:22:17', dailyRecharge: 8600, dailyWithdraw: 11800, dailyBet: 67400, dailyPayout: 84800, dailySettledBets: 43, dailyWinningBets: 30 },
]

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function shiftDate(date, offset) {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + offset)
  return value.toISOString().slice(0, 10)
}

function rangeText(days) {
  return days === 1 ? RISK_BASE_DATE : `${shiftDate(RISK_BASE_DATE, -(days - 1))} 至 ${RISK_BASE_DATE}`
}

function metricDefinition(key) {
  return MEMBER_RISK_METRICS.find((item) => item.key === key) || MEMBER_RISK_METRICS[0]
}

function operatorDefinition(key) {
  return OPERATORS.find((item) => item.key === key) || OPERATORS[0]
}

export function getMemberMetrics(profile, days) {
  const safeDays = Math.max(1, Math.min(30, Number(days) || 1))
  const settledBets = Math.max(0, Number(profile.dailySettledBets || 0) * safeDays)
  const winningBets = Math.max(0, Math.min(settledBets, Number(profile.dailyWinningBets || 0) * safeDays))
  const net = roundMoney((Number(profile.dailyPayout || 0) - Number(profile.dailyBet || 0)) * safeDays)
  return {
    recharge: roundMoney(profile.dailyRecharge * safeDays),
    withdraw: roundMoney(profile.dailyWithdraw * safeDays),
    bet: roundMoney(profile.dailyBet * safeDays),
    winRate: settledBets ? roundMoney((winningBets / settledBets) * 100) : 0,
    profit: Math.max(0, net),
    loss: Math.max(0, -net),
  }
}

function conditionMatches(condition, metrics) {
  const actual = Number(metrics[condition.metric] || 0)
  const target = Number(condition.value || 0)
  if (condition.operator === 'gt') return actual > target
  if (condition.operator === 'lte') return actual <= target
  if (condition.operator === 'lt') return actual < target
  return actual >= target
}

function ruleMatches(rule, metrics) {
  if (!rule.conditions?.length) return false
  const results = rule.conditions.map((condition) => conditionMatches(condition, metrics))
  return rule.logic === 'any' ? results.some(Boolean) : results.every(Boolean)
}

function metricValueText(metric, value) {
  return metric.kind === 'percent' ? `${Number(value).toFixed(1)}%` : `${formatMoney(value)} CNY`
}

function conditionText(condition) {
  const metric = metricDefinition(condition.metric)
  const operator = operatorDefinition(condition.operator)
  return `${metric.label} ${operator.symbol} ${metric.kind === 'percent' ? Number(condition.value).toFixed(1) : formatMoney(condition.value)} ${metric.unit}`
}

function matchedConditionText(condition, metrics) {
  const metric = metricDefinition(condition.metric)
  const operator = operatorDefinition(condition.operator)
  return `${metric.label} ${metricValueText(metric, metrics[condition.metric])} ${operator.symbol} ${metricValueText(metric, condition.value)}`
}

export function getMemberRiskMatches(rules, mutedAlerts = {}) {
  return rules.filter((rule) => rule.enabled).flatMap((rule) => memberRiskProfiles.flatMap((profile) => {
    const metrics = getMemberMetrics(profile, rule.days)
    if (!ruleMatches(rule, metrics)) return []
    const key = `${profile.id}:${rule.id}`
    return [{
      key,
      rule,
      profile,
      metrics,
      muted: Boolean(mutedAlerts[key]),
      triggeredAt: `2026-08-28 0${(Number(profile.id) + rule.id) % 4}:2${(Number(profile.id) + rule.id) % 10}:18`,
    }]
  }))
}

export function MemberRiskRulePage({ rules, setRules, allocateRuleId, setMutedAlerts, toast }) {
  const [draft, setDraft] = useState({ keyword: '', status: '全部', logic: '全部' })
  const [applied, setApplied] = useState({ keyword: '', status: '全部', logic: '全部' })
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const matchCounts = useMemo(() => {
    const matches = getMemberRiskMatches(rules)
    return matches.reduce((result, item) => ({ ...result, [item.rule.id]: (result[item.rule.id] || 0) + 1 }), {})
  }, [rules])

  const visibleRules = rules.filter((rule) => {
    const keyword = applied.keyword.trim().toLowerCase()
    if (keyword && !`${rule.id} ${rule.name}`.toLowerCase().includes(keyword)) return false
    if (applied.status === '启用' && !rule.enabled) return false
    if (applied.status === '停用' && rule.enabled) return false
    if (applied.logic === '全部满足' && rule.logic !== 'all') return false
    if (applied.logic === '任一满足' && rule.logic !== 'any') return false
    return true
  })

  const query = () => {
    setApplied({ ...draft })
    toast('查询成功，已更新会员风控规则列表')
  }

  const reset = () => {
    const empty = { keyword: '', status: '全部', logic: '全部' }
    setDraft(empty)
    setApplied(empty)
    toast('已重置会员风控规则筛选')
  }

  const toggleRule = (rule) => {
    setRules((items) => items.map((item) => item.id === rule.id ? { ...item, enabled: !item.enabled, updatedAt: RULE_UPDATED_AT } : item))
    toast(rule.enabled ? `规则“${rule.name}”已停用` : `规则“${rule.name}”已启用`)
  }

  const saveRule = (form) => {
    const newRuleId = form.id ? null : allocateRuleId()
    setRules((items) => {
      if (form.id) return items.map((item) => item.id === form.id ? { ...form, updatedAt: RULE_UPDATED_AT } : item)
      return [{ ...form, id: newRuleId, updatedAt: RULE_UPDATED_AT }, ...items]
    })
    setEditing(null)
    toast(form.id ? '会员风控规则已保存' : '会员风控规则已新增')
  }

  const removeRule = () => {
    setRules((items) => items.filter((item) => item.id !== deleting.id))
    setMutedAlerts((items) => Object.fromEntries(Object.entries(items).filter(([key]) => !key.endsWith(`:${deleting.id}`))))
    toast(`规则“${deleting.name}”已删除`)
    setDeleting(null)
  }

  return (
    <div className="member-risk-page">
      <section className="member-risk-intro">
        <div><ShieldAlert size={21} /><div><b>会员风险组合规则</b><p>统计时间可设置为近 1–30 天，充值、提现、投注、胜率、盈利和亏损可以添加一个或多个条件，并选择全部满足或任一满足。</p></div></div>
        <button className="btn btn-primary" onClick={() => setEditing({ mode: 'create' })}><Plus size={14} />新增规则</button>
      </section>

      <section className="panel member-risk-filter-panel">
        <div className="member-risk-filter-grid">
          <label><span>规则关键词</span><input value={draft.keyword} onChange={(event) => setDraft((old) => ({ ...old, keyword: event.target.value }))} placeholder="规则ID / 规则名称" /></label>
          <label><span>规则状态</span><select value={draft.status} onChange={(event) => setDraft((old) => ({ ...old, status: event.target.value }))}><option>全部</option><option>启用</option><option>停用</option></select></label>
          <label><span>条件关系</span><select value={draft.logic} onChange={(event) => setDraft((old) => ({ ...old, logic: event.target.value }))}><option>全部</option><option>全部满足</option><option>任一满足</option></select></label>
          <div className="member-risk-filter-actions"><button className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
        </div>
      </section>

      <section className="panel member-risk-table-panel">
        <div className="member-risk-table-head"><div><b>会员风控规则</b><span>命中结果随规则配置自动重新计算</span></div><span>共 <b>{visibleRules.length}</b> 条</span></div>
        <div className="member-risk-table-scroll">
          <table className="member-risk-table rule-table">
            <thead><tr><th>规则ID</th><th>规则名称</th><th>统计时间</th><th>条件关系</th><th>风控条件</th><th>风险会员</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead>
            <tbody>{visibleRules.length ? visibleRules.map((rule) => (
              <tr key={rule.id}>
                <td>{rule.id}</td>
                <td><b>{rule.name}</b></td>
                <td>近 {rule.days} 天</td>
                <td><span className="logic-tag">{rule.logic === 'any' ? '任一满足（或）' : '全部满足（且）'}</span></td>
                <td><div className="rule-condition-list">{rule.conditions.map((condition) => <span key={condition.id}>{conditionText(condition)}</span>)}</div></td>
                <td><b className={matchCounts[rule.id] ? 'risk-count-value' : ''}>{matchCounts[rule.id] || 0}</b> 人</td>
                <td><button type="button" role="switch" aria-checked={rule.enabled} aria-label={`${rule.name}${rule.enabled ? '已启用' : '已停用'}`} className={`member-rule-switch ${rule.enabled ? 'checked' : ''}`} onClick={() => toggleRule(rule)}><i /><span>{rule.enabled ? '启用' : '停用'}</span></button></td>
                <td>{rule.updatedAt}</td>
                <td><div className="member-risk-actions"><button onClick={() => setEditing({ mode: 'edit', rule })}><Pencil size={13} />编辑</button><button className="danger" onClick={() => setDeleting(rule)}><Trash2 size={13} />删除</button></div></td>
              </tr>
            )) : <tr><td colSpan="9"><div className="member-risk-empty">暂无符合条件的会员风控规则</div></td></tr>}</tbody>
          </table>
        </div>
      </section>

      {editing && <RuleEditorDialog rules={rules} editing={editing} onClose={() => setEditing(null)} onSave={saveRule} />}
      {deleting && <MemberRiskConfirmDialog title="删除会员风控规则" message={`删除“${deleting.name}”后，该规则产生的风险会员预警将不再显示。确定删除吗？`} confirmText="删除" danger onCancel={() => setDeleting(null)} onConfirm={removeRule} />}
    </div>
  )
}

function RuleEditorDialog({ rules, editing, onClose, onSave }) {
  const source = editing.rule
  const sequence = useRef(1)
  const [form, setForm] = useState(() => source ? {
    ...source,
    conditions: source.conditions.map((condition) => ({ ...condition })),
  } : {
    name: '',
    days: 7,
    logic: 'all',
    enabled: true,
    conditions: [{ id: `new-${sequence.current++}`, metric: 'recharge', operator: 'gte', value: 50000 }],
  })
  const [errors, setErrors] = useState({})

  const updateCondition = (id, patch) => {
    setForm((old) => ({ ...old, conditions: old.conditions.map((condition) => condition.id === id ? { ...condition, ...patch } : condition) }))
    setErrors((old) => ({ ...old, conditions: '', conditionIds: (old.conditionIds || []).filter((conditionId) => conditionId !== id) }))
  }

  const addCondition = () => {
    setForm((old) => ({ ...old, conditions: [...old.conditions, { id: `new-${Date.now()}-${sequence.current++}`, metric: 'bet', operator: 'gte', value: 100000 }] }))
    setErrors((old) => ({ ...old, conditions: '' }))
  }

  const removeCondition = (id) => {
    setForm((old) => ({ ...old, conditions: old.conditions.filter((condition) => condition.id !== id) }))
    setErrors((old) => ({ ...old, conditions: '', conditionIds: (old.conditionIds || []).filter((conditionId) => conditionId !== id) }))
  }

  const submit = () => {
    const nextErrors = {}
    const days = Number(form.days)
    if (!form.name.trim()) nextErrors.name = '请输入规则名称'
    else if (rules.some((rule) => rule.id !== form.id && rule.name.trim() === form.name.trim())) nextErrors.name = '规则名称不能重复'
    if (!Number.isInteger(days) || days < 1 || days > 30) nextErrors.days = '统计时间必须是 1 至 30 天的整数'
    if (!form.conditions.length) nextErrors.conditions = '请至少添加一个风控条件'
    const invalidConditions = form.conditions.filter((condition) => {
      const value = Number(condition.value)
      const metric = metricDefinition(condition.metric)
      return String(condition.value).trim() === '' || !Number.isFinite(value) || value < 0 || (metric.kind === 'percent' && value > 100)
    })
    if (invalidConditions.length) {
      nextErrors.conditionIds = invalidConditions.map((condition) => condition.id)
      nextErrors.conditions = `请检查条件 ${invalidConditions.map((condition) => form.conditions.findIndex((item) => item.id === condition.id) + 1).join('、')}：金额必须为非负数，胜率范围为 0% 至 100%`
    }
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    onSave({ ...form, name: form.name.trim(), days })
  }

  return (
    <div className="modal-overlay member-risk-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="member-rule-dialog" role="dialog" aria-modal="true" aria-label={source ? `编辑会员风控规则 · ${source.name}` : '新增会员风控规则'}>
        <header><div><ShieldAlert size={18} /><b>{source ? `编辑会员风控规则 · ${source.name}` : '新增会员风控规则'}</b></div><button aria-label="关闭会员风控规则弹窗" onClick={onClose}><X size={18} /></button></header>
        <div className="member-rule-dialog-body">
          <section className="member-rule-basic">
            <label><span><em>*</em>规则名称</span><div><input aria-label="规则名称" value={form.name} onChange={(event) => { setForm((old) => ({ ...old, name: event.target.value })); setErrors((old) => ({ ...old, name: '' })) }} placeholder="例如：近7日大额充值高胜率" />{errors.name && <small>{errors.name}</small>}</div></label>
            <label><span><em>*</em>统计时间</span><div><div className="member-rule-number"><input aria-label="统计时间天数" type="number" min="1" max="30" step="1" value={form.days} onChange={(event) => { setForm((old) => ({ ...old, days: event.target.value })); setErrors((old) => ({ ...old, days: '' })) }} /><span>天</span></div>{errors.days && <small>{errors.days}</small>}<p>从当前时间向前滚动统计，可设置近 1 至 30 天。</p></div></label>
            <label><span><em>*</em>条件关系</span><div className="member-logic-options"><button className={form.logic === 'all' ? 'active' : ''} onClick={() => setForm((old) => ({ ...old, logic: 'all' }))}><b>全部满足（且）</b><small>会员同时满足所有条件才预警</small></button><button className={form.logic === 'any' ? 'active' : ''} onClick={() => setForm((old) => ({ ...old, logic: 'any' }))}><b>任一满足（或）</b><small>会员满足任意一个条件即预警</small></button></div></label>
          </section>

          <section className="member-condition-builder">
            <div className="member-condition-head"><div><b>风控条件</b><span>充值 / 提现 / 投注 / 胜率 / 盈利 / 亏损自由组合</span></div><button className="btn btn-primary" onClick={addCondition}><Plus size={14} />添加条件</button></div>
            <div className="member-condition-list">{form.conditions.map((condition, index) => {
              const metric = metricDefinition(condition.metric)
              return <React.Fragment key={condition.id}>
                {index > 0 && <div className="member-condition-relation"><span>{form.logic === 'any' ? '或' : '且'}</span></div>}
                <div className={`member-condition-row ${(errors.conditionIds || []).includes(condition.id) ? 'invalid' : ''}`}>
                  <span className="condition-index">条件 {index + 1}</span>
                  <select aria-label={`条件${index + 1}指标`} value={condition.metric} onChange={(event) => updateCondition(condition.id, { metric: event.target.value, value: event.target.value === 'winRate' ? 70 : 50000 })}>{MEMBER_RISK_METRICS.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select>
                  <select aria-label={`条件${index + 1}比较方式`} value={condition.operator} onChange={(event) => updateCondition(condition.id, { operator: event.target.value })}>{OPERATORS.map((item) => <option value={item.key} key={item.key}>{item.label}（{item.symbol}）</option>)}</select>
                  <div className="member-condition-value"><input aria-label={`条件${index + 1}数值`} type="number" min="0" max={metric.kind === 'percent' ? '100' : undefined} step={metric.kind === 'percent' ? '0.1' : '0.01'} value={condition.value} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} /><span>{metric.unit}</span></div>
                  <button className="condition-remove" aria-label={`删除条件${index + 1}`} onClick={() => removeCondition(condition.id)}><Trash2 size={14} />删除</button>
                </div>
              </React.Fragment>
            })}</div>
            {errors.conditions && <div className="member-condition-error">{errors.conditions}</div>}
          </section>

          <div className="member-rule-tip"><AlertTriangle size={16} /><p><b>仅预警，不拦截</b>规则命中后只会出现在“风控会员列表”中，不会自动冻结会员、拒绝充值提现、限制投注或变更任何资金数据。</p></div>
        </div>
        <footer><button className="btn btn-default" onClick={onClose}>取消</button><button className="btn btn-primary" onClick={submit}>确定</button></footer>
      </section>
    </div>
  )
}

export function RiskMemberListPage({ rules, mutedAlerts, setMutedAlerts, toast }) {
  const [draft, setDraft] = useState({ keyword: '', ruleId: '全部', status: '全部' })
  const [applied, setApplied] = useState({ keyword: '', ruleId: '全部', status: '全部' })
  const [muting, setMuting] = useState(null)
  const matches = useMemo(() => getMemberRiskMatches(rules, mutedAlerts), [rules, mutedAlerts])
  const activeCount = matches.filter((item) => !item.muted).length
  const mutedCount = matches.length - activeCount
  const activeMemberCount = new Set(matches.filter((item) => !item.muted).map((item) => item.profile.id)).size
  const visibleMatches = matches.filter((item) => {
    const keyword = applied.keyword.trim().toLowerCase()
    if (keyword && !`${item.profile.id} ${item.profile.username} ${item.rule.name}`.toLowerCase().includes(keyword)) return false
    if (applied.ruleId !== '全部' && String(item.rule.id) !== applied.ruleId) return false
    if (applied.status === '预警中' && item.muted) return false
    if (applied.status === '不再提醒' && !item.muted) return false
    return true
  })

  const query = () => {
    setApplied({ ...draft })
    toast('查询成功，已更新风险会员预警列表')
  }

  const reset = () => {
    const empty = { keyword: '', ruleId: '全部', status: '全部' }
    setDraft(empty)
    setApplied(empty)
    toast('已重置风险会员筛选')
  }

  const muteMember = () => {
    setMutedAlerts((old) => ({ ...old, [muting.key]: true }))
    toast(`已将会员 ${muting.profile.username} 的本条风险预警设为不再提醒`)
    setMuting(null)
  }

  const restoreMember = (item) => {
    setMutedAlerts((old) => ({ ...old, [item.key]: false }))
    toast(`已恢复会员 ${item.profile.username} 的本条风险预警提醒`)
  }

  return (
    <div className="member-risk-page">
      <section className={`risk-member-banner ${activeCount ? 'warning' : 'safe'}`}>
        <div className="risk-member-banner-icon">{activeCount ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}</div>
        <div><b>{activeCount ? `当前有 ${activeMemberCount} 名会员产生 ${activeCount} 条风险预警` : mutedCount ? `当前没有待提醒记录，另有 ${mutedCount} 条已设为不再提醒` : '当前没有需要提醒的风险会员'}</b><p>由已启用的会员风控规则实时判定；同一会员命中多个规则时分别展示。预警只作提醒，不自动限制业务。</p></div>
        <div className="risk-member-banner-counts"><span className={activeCount ? 'warning' : ''}>待提醒 <b>{activeCount}</b></span><span>不再提醒 <b>{mutedCount}</b></span></div>
      </section>

      <section className="panel member-risk-filter-panel">
        <div className="member-risk-filter-grid member-list-filters">
          <label><span>会员关键词</span><input value={draft.keyword} onChange={(event) => setDraft((old) => ({ ...old, keyword: event.target.value }))} placeholder="会员ID / 用户名 / 规则名称" /></label>
          <label><span>命中规则</span><select value={draft.ruleId} onChange={(event) => setDraft((old) => ({ ...old, ruleId: event.target.value }))}><option>全部</option>{rules.filter((rule) => rule.enabled).map((rule) => <option value={rule.id} key={rule.id}>{rule.name}</option>)}</select></label>
          <label><span>提醒状态</span><select value={draft.status} onChange={(event) => setDraft((old) => ({ ...old, status: event.target.value }))}><option>全部</option><option>预警中</option><option>不再提醒</option></select></label>
          <div className="member-risk-filter-actions"><button className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
        </div>
      </section>

      <section className="panel member-risk-table-panel">
        <div className="member-risk-table-head"><div><Users size={17} /><b>风控会员列表</b><span>按启用规则自动判定</span></div><span>共 <b>{visibleMatches.length}</b> 条</span></div>
        <div className="member-risk-table-scroll">
          <table className="member-risk-table member-alert-table">
            <thead><tr><th>会员信息</th><th>会员等级</th><th>命中规则</th><th>统计范围</th><th>命中条件与实际值</th><th>触发时间</th><th>提醒状态</th><th>操作</th></tr></thead>
            <tbody>{visibleMatches.length ? visibleMatches.map((item) => (
              <tr key={item.key} className={item.muted ? 'muted' : 'warning'}>
                <td><div className="risk-member-cell"><b>{item.profile.username}</b><span>ID：{item.profile.id}</span><small>最后活跃：{item.profile.lastActiveAt}</small></div></td>
                <td>{item.profile.level}</td>
                <td><div className="risk-rule-cell"><b>{item.rule.name}</b><small>规则ID：{item.rule.id} · {item.rule.logic === 'any' ? '任一满足' : '全部满足'}</small></div></td>
                <td><b>近 {item.rule.days} 天</b><small className="block-small">{rangeText(item.rule.days)}</small></td>
                <td><div className="matched-condition-list">{item.rule.conditions.map((condition) => {
                  const satisfied = conditionMatches(condition, item.metrics)
                  return <span className={satisfied ? 'condition-matched' : 'condition-unmatched'} key={condition.id}>{matchedConditionText(condition, item.metrics)}<em>{satisfied ? '已满足' : '未满足'}</em></span>
                })}</div></td>
                <td>{item.triggeredAt}</td>
                <td>{item.muted ? <span className="member-alert-status muted"><BellOff size={13} />不再提醒</span> : <span className="member-alert-status warning"><AlertTriangle size={13} />预警中</span>}</td>
                <td>{item.muted ? <button className="member-restore-button" onClick={() => restoreMember(item)}><CheckCircle2 size={13} />恢复提醒</button> : <button className="member-mute-button" onClick={() => setMuting(item)}><BellOff size={13} />不再提醒</button>}</td>
              </tr>
            )) : <tr><td colSpan="8"><div className="member-risk-empty">暂无符合条件的风险会员预警</div></td></tr>}</tbody>
          </table>
        </div>
      </section>

      {muting && <MemberRiskConfirmDialog title="不再提醒该风险会员" message={`确定不再提醒会员“${muting.profile.username}”命中规则“${muting.rule.name}”的本条预警吗？该记录仍会保留，且不会对会员账户或资金操作产生限制。`} confirmText="不再提醒" onCancel={() => setMuting(null)} onConfirm={muteMember} />}
    </div>
  )
}

export function MemberRiskConfirmDialog({ title, message, confirmText, onCancel, onConfirm, danger = false }) {
  return (
    <div className="modal-overlay member-risk-confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="member-risk-confirm" role="alertdialog" aria-modal="true" aria-label={title}>
        <header><AlertTriangle size={20} /><b>{title}</b></header>
        <p>{message}</p>
        <footer><button className="btn btn-default" onClick={onCancel}>取消</button><button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmText}</button></footer>
      </section>
    </div>
  )
}
