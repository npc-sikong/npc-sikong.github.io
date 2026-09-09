import React, { useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, Bell, Check, ChevronRight, CircleHelp, Clock3,
  ListChecks, Pause, Play, Plus, ShieldCheck, Target, Trash2, X,
} from 'lucide-react'
import './game-pages.css'
import './lottery-chase.css'
import ChaseWakeModes from './ChaseWakeModes'
import { DEFAULT_CHASE_WAKE_MODE, chaseWakeMode } from './chaseWakeRules'
import StorefrontRequirementEntry from './StorefrontRequirementEntry'
import ChaseStrategyForm from './ChaseStrategyForm'
import { HASH_GAME_ITEMS, LOTTERY_GAMES } from './gameData'

const GAMES = [
  { code: 'HASH_6S', name: '6秒单双', odds: 1.938, step: 1, range: '1.00000000～10000.00000000' },
  { code: 'HASH_9S', name: '9秒单双', odds: 1.938, step: 1, range: '1.00000000～10000.00000000' },
  { code: 'HASH_15S', name: '15秒单双', odds: 1.938, step: 1, range: '1.00000000～10000.00000000' },
  { code: 'HASH_30S', name: '30秒单双', odds: 1.938, step: 1, range: '1.00000000～10000.00000000' },
  { code: 'HASH_60S', name: '1分单双', odds: 1.938, step: 20, range: '1.00000000～10000.00000000' },
  ...HASH_GAME_ITEMS.filter((game) => ['parity', 'size'].includes(game.template) && game.slug !== 'one-minute-parity').map((game) => ({ code: game.slug, name: game.name })),
  ...LOTTERY_GAMES.map((game) => ({ code: game.path, name: game.name })),
]

const STRATEGIES = [
  { code: 'CUT_DRAGON', name: '斩龙', description: '连出后押相反方向，中奖结束' },
  { code: 'FOLLOW_DRAGON', name: '追龙', description: '连出后继续押同方向，中断结束' },
  { code: 'CUSTOM_SEQUENCE', name: '自定义', description: '精确序列触发，逐步执行方向与金额' },
]

const INITIAL_TASKS = [
  { id: 'CHASE-20260908001', name: '6秒斩龙观察', game: '6秒单双', strategy: '斩龙', mode: 'SIMULATION', status: 'RUNNING', progress: '第2/4级', profit: 126.4, orders: 38 },
  { id: 'CHASE-20260908002', name: '1分追龙计划', game: '1分单双', strategy: '追龙', mode: 'SIMULATION', status: 'DRAFT', progress: '尚未开始', profit: 0, orders: 0 },
  { id: 'CHASE-20260908003', name: '9秒自定义序列', game: '9秒单双', strategy: '自定义序列', mode: 'REAL', status: 'PAUSED', progress: '第1/3步', profit: -20, orders: 7 },
]

function Notice({ message }) {
  return message ? <div className="sfg-page-notice"><Check size={14} />{message}</div> : null
}

function Sheet({ title, children, onClose, footer, full = false, titleAction }) {
  if (!title) return null
  return <div className="sfg-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
    <section className={`sfg-sheet ${full ? 'sfg-sheet-full' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="sfg-sheet-handle" />
      <div className="sfg-sheet-header"><b>{title}</b>{titleAction}<button className="sfg-icon-button" onClick={onClose} aria-label="关闭"><X size={20} /></button></div>
      <div className="sfg-sheet-body">{children}</div>
      {footer && <div className="sfg-sheet-footer">{footer}</div>}
    </section>
  </div>
}

function createDraft(mode = 'SIMULATION') {
  return {
    mode, name: '', gameCode: 'HASH_6S', strategy: 'CUT_DRAGON', listen: 'BOTH', wakeMode: DEFAULT_CHASE_WAKE_MODE,
    triggerLength: 3, startTime: '00:00', endTime: '23:59', takeProfit: '0', stopLoss: '0',
    autoLadder: true, amounts: [1, 3, 6], customDirections: ['单', '双', '单'], confirmed: false,
  }
}

function profitFor(amounts, index, strategy, odds = 1.97) {
  if (strategy === 'FOLLOW_DRAGON') return amounts.slice(0, index + 1).reduce((sum, amount) => sum + amount * (odds - 1), 0)
  const previous = amounts.slice(0, index).reduce((sum, amount) => sum + amount, 0)
  return amounts[index] * (odds - 1) - previous
}

function formatProfit(value) {
  const numeric = Number(value) || 0
  return `${numeric > 0 ? '+' : ''}${numeric.toFixed(2)}`
}

export default function LotteryChasePage({ navigate, toast }) {
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef(null)
  const [mode, setMode] = useState('SIMULATION')
  const [view, setView] = useState('tasks')
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [draft, setDraft] = useState(() => createDraft())
  const [detailId, setDetailId] = useState('')
  const [unread, setUnread] = useState(2)
  const activeTasks = tasks
  const selectedGame = GAMES.find((game) => game.code === draft.gameCode) || GAMES[0]
  const selectedStrategy = STRATEGIES.find((item) => item.code === draft.strategy) || STRATEGIES[0]
  const detailTask = tasks.find((task) => task.id === detailId)
  const metrics = useMemo(() => ({
    running: activeTasks.filter((task) => task.status === 'RUNNING').length,
    profit: activeTasks.reduce((sum, task) => sum + task.profit, 0),
    orders: activeTasks.reduce((sum, task) => sum + task.orders, 0),
  }), [activeTasks])

  const notify = (message, type = 'success') => {
    setNotice(message)
    window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2100)
    toast?.(message, type)
  }

  const switchView = (nextView) => {
    setView(nextView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openWizard = (requestedMode = mode, config = {}) => {
    setDraft({ ...createDraft(requestedMode), ...config, confirmed: false })
    setWizardStep(1)
    setWizardOpen(true)
  }

  const nextStep = () => {
    if (wizardStep === 1 && !draft.name.trim()) {
      notify('请输入任务名称', 'error')
      return
    }
    setWizardStep((step) => Math.min(3, step + 1))
  }

  const updateAmount = (index, value) => {
    const amount = Math.max(1, Math.round(Number(value) || 1))
    setDraft((current) => ({ ...current, confirmed: false, amounts: current.amounts.map((item, itemIndex) => itemIndex === index ? amount : item) }))
  }

  const addLadder = () => setDraft((current) => {
    if (current.amounts.length >= 20) return current
    const previous = current.amounts[current.amounts.length - 1] || 1
    return { ...current, confirmed: false, amounts: [...current.amounts, current.autoLadder ? Math.ceil(previous * 2.05) : previous], customDirections: [...current.customDirections, '单'] }
  })

  const removeLadder = (index) => setDraft((current) => ({
    ...current,
    confirmed: false,
    amounts: current.amounts.filter((_, itemIndex) => itemIndex !== index),
    customDirections: current.customDirections.filter((_, itemIndex) => itemIndex !== index),
  }))

  const createTask = () => {
    if (!draft.name.trim()) { notify('请输入策略名称', 'error'); return }
    if (draft.strategy === 'CUSTOM_SEQUENCE' && !/^[单双]{2,20}$/.test(draft.triggerSequence || '')) { notify('触发规则请输入2～20个单或双', 'error'); return }
    if (draft.strategy !== 'CUSTOM_SEQUENCE' && (!Number.isInteger(Number(draft.triggerLength)) || Number(draft.triggerLength) < 2 || Number(draft.triggerLength) > 20)) { notify('连龙长度须为2～20期整数', 'error'); return }
    if ([draft.takeProfit, draft.stopLoss].some((value) => !Number.isFinite(Number(value)) || Number(value) < 0) || !draft.startTime || !draft.endTime) { notify('请填写有效时段与非负止盈止损金额', 'error'); return }
    if (draft.amounts.some((amount) => !Number.isInteger(Number(amount)) || Number(amount) < 1 || Number(amount) > 10000)) { notify('每级金额须为1～10,000 TRX整数', 'error'); return }
    if (draft.customLadder && draft.ladderRows?.some((row) => [row.win, row.loss].some((value) => !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > draft.amounts.length))) { notify('盈利/亏损目标须为0或有效级数', 'error'); return }
    if (!draft.confirmed) {
      notify('请先确认风险预览', 'error')
      return
    }
    const newTask = {
      id: `CHASE-${Date.now()}`,
      name: draft.name.trim(),
      game: selectedGame.name,
      strategy: selectedStrategy.code === 'CUSTOM_SEQUENCE' ? '自定义序列' : selectedStrategy.name,
      mode: draft.mode,
      status: draft.startEnabled ? 'RUNNING' : 'DRAFT',
      progress: draft.startEnabled ? '等待触发信号' : '尚未开始',
      profit: 0,
      orders: 0,
      wakeMode: draft.wakeMode,
      config: { ...draft, amounts: [...draft.amounts], customDirections: [...draft.customDirections], confirmed: false },
    }
    setTasks((items) => [newTask, ...items])
    setMode(draft.mode)
    setView('tasks')
    setWizardOpen(false)
    notify('追号策略和任务草稿已创建')
  }

  const toggleTask = (task) => {
    const nextStatus = task.status === 'RUNNING' ? 'PAUSED' : 'RUNNING'
    setTasks((items) => items.map((item) => item.id === task.id ? { ...item, status: nextStatus, progress: nextStatus === 'RUNNING' ? (item.progress === '尚未开始' ? '等待触发信号' : item.progress) : item.progress } : item))
    notify(`任务已${nextStatus === 'RUNNING' ? '启动' : '暂停'}`)
  }

  const deleteStrategy = (task) => {
    setTasks((items) => items.filter((item) => item.id !== task.id))
    notify('策略已归档，历史记录继续保留')
  }

  return <main className="sfg-page sfg-auto-chase-page">
    <header className="sfg-header">
      <button className="sfg-icon-button" onClick={() => navigate?.('/pages/lottery/tron-minute')} aria-label="返回"><ArrowLeft size={21} /></button>
      <div className="sfg-header-title"><span>{view === 'tasks' ? '追号策略' : view === 'strategies' ? '我的策略' : '任务通知'}</span>{view !== 'tasks' && <small>追号策略</small>}</div>
      <button className="sfg-chase-bell" onClick={() => switchView('notifications')} aria-label="查看通知"><Bell size={19} />{unread > 0 && <i>{unread}</i>}</button>
    </header>
    <Notice message={notice} />
    <StorefrontRequirementEntry path="/front/pages/lottery/chase" />
    {view === 'tasks' && <>
      <section className="sfg-chase-toolbar"><span><i />数据自动更新中</span></section>
      <section className="sfg-chase-summary-grid" aria-label="追号任务汇总"><article><span>运行中</span><strong>{metrics.running}</strong></article><article><span>总盈亏</span><strong className={metrics.profit < 0 ? 'negative' : 'positive'}>{formatProfit(metrics.profit)}</strong></article><article><span>累计投注</span><strong>{metrics.orders}</strong></article></section>
      <div className="sfg-chase-section-heading"><b>追号策略</b><button onClick={() => openWizard(mode)}><Plus size={15} />新建追号策略</button></div>
      <section className="sfg-chase-task-list">
        {activeTasks.length ? activeTasks.map((task) => <article className="sfg-chase-task-card" key={task.id}>
          <div className="sfg-chase-task-top"><div><h3>{task.name}</h3><p>{task.game} · {task.strategy}</p></div><em className={task.status.toLowerCase()}>{task.status === 'RUNNING' ? '运行中' : task.status === 'DRAFT' ? '草稿' : '已暂停'}</em></div>
          <div className="sfg-chase-task-facts"><span>当前状态<strong>{task.status === 'RUNNING' ? '等待开奖结果' : task.status === 'DRAFT' ? '尚未开始' : '用户暂停'}</strong></span><span>当前进度<strong>{task.progress}</strong></span><span>总盈亏<strong className={task.profit < 0 ? 'negative' : 'positive'}>{formatProfit(task.profit)}</strong></span></div>
          <div className="sfg-chase-task-actions"><button className="detail" onClick={() => setDetailId(task.id)}>查看详情 <ChevronRight size={14} /></button><button className="control" onClick={() => toggleTask(task)}>{task.status === 'RUNNING' ? <><Pause size={14} />暂停</> : <><Play size={14} />启动</>}</button></div>
        </article>) : <div className="sfg-chase-empty"><ListChecks size={36} /><b>暂无追号策略</b><button onClick={() => openWizard(mode)}>创建第一个任务</button></div>}
      </section>
    </>}

    {view === 'strategies' && <section className="sfg-chase-library">
      <div className="sfg-chase-library-head"><div><small>策略库</small><h2>我的策略</h2></div><button onClick={() => openWizard(mode)}><Plus size={15} />新建策略任务</button></div>
      <p className="sfg-chase-library-tip">每次编辑生成独立新版本，已创建任务仍使用原版本。</p>
      {tasks.map((task, index) => <article className="sfg-chase-strategy-card" key={`strategy-${task.id}`}><div><span>{task.game}</span><em>V{index + 1}</em></div><h3>{task.name}</h3><p>{task.strategy} · 运行时段 00:00–23:59 · 最多执行 {index % 2 ? 3 : 4} 步</p><p>{chaseWakeMode(task.wakeMode).label}</p><div><button onClick={() => openWizard(task.mode, { ...task.config, name: task.name, wakeMode: task.wakeMode || DEFAULT_CHASE_WAKE_MODE })}>编辑新版本</button><button onClick={() => openWizard(task.mode, { ...task.config, name: task.name, wakeMode: task.wakeMode || DEFAULT_CHASE_WAKE_MODE })}>创建任务</button><button className="danger" onClick={() => deleteStrategy(task)}>归档</button></div></article>)}
    </section>}

    {view === 'notifications' && <section className="sfg-chase-notifications"><div className="sfg-chase-library-head"><div><small>消息中心</small><h2>任务通知</h2></div><button onClick={() => { setUnread(0); notify('全部通知已标为已读') }}>全部已读</button></div>{[
      ['风险提醒', '9秒自定义序列已由用户暂停，请确认是否继续。', '刚刚'],
      ['任务状态', '6秒斩龙观察进入第 2 级，等待下一期结果。', '2分钟前'],
      ['系统通知', '所有追号任务均为本地演示，不产生真实投注。', '今天'],
    ].map(([title, content, time], index) => <article className={index < unread ? 'unread' : ''} key={title}><Bell size={18} /><div><b>{title}</b><p>{content}</p><small>{time}</small></div></article>)}</section>}

    <nav className="sfg-chase-bottom-nav"><button className={view === 'tasks' ? 'active' : ''} onClick={() => switchView('tasks')}><ListChecks size={20} />任务</button><button className={view === 'strategies' ? 'active' : ''} onClick={() => switchView('strategies')}><Target size={20} />策略</button><button className={view === 'notifications' ? 'active' : ''} onClick={() => switchView('notifications')}><Bell size={20} />通知{unread > 0 && <i>{unread}</i>}</button></nav>

    <Sheet title={wizardOpen ? "新建追号策略" : ""} titleAction={<select className="sfg-chase-title-game" aria-label="选择彩票" value={draft.gameCode} onChange={(event) => setDraft((current) => ({ ...current, gameCode: event.target.value, confirmed: false }))}>{GAMES.map((game) => <option key={game.code} value={game.code}>{game.name}</option>)}</select>} full onClose={() => setWizardOpen(false)} footer={<div className="sfg-chase-wizard-actions"><button className="next" disabled={!draft.confirmed} onClick={createTask}>保存策略任务</button></div>}>
      <ChaseStrategyForm draft={draft} setDraft={setDraft} games={GAMES} strategies={STRATEGIES} />
    </Sheet>

    <Sheet title={detailTask ? '追号任务详情' : ''} full onClose={() => setDetailId('')}>
      {detailTask && <ChaseWakeModes value={detailTask.wakeMode} readOnly />}
      {detailTask && <div className="sfg-chase-detail"><section><div><em>追号策略</em><i className={detailTask.status.toLowerCase()}>{detailTask.status === 'RUNNING' ? '运行中' : detailTask.status === 'DRAFT' ? '草稿' : '已暂停'}</i></div><h2>{detailTask.game} · {detailTask.strategy}</h2><p>{detailTask.name}</p><small>{detailTask.id}</small></section><div className="sfg-chase-detail-metrics"><span>本轮<b>{detailTask.orders ? 6 : '—'}</b></span><span>当前级<b>{detailTask.progress}</b></span><span>本轮盈亏<b className={detailTask.profit < 0 ? 'negative' : 'positive'}>{formatProfit(detailTask.profit)}</b></span><span>待开奖<b>{detailTask.status === 'RUNNING' ? 1 : 0}</b></span></div><section className="sfg-chase-results"><div><span>已开奖区块</span><b>71,428,560</b></div><div className="countdown"><Clock3 size={20} /><b>4</b><small>秒</small></div><div><span>当前下注区块</span><b>71,428,561</b></div><p>最近开奖走势</p><div className="road">{['单', '单', '单', '双', '双', '单', '双', '单', '单', '双'].map((item, index) => <i className={item === '单' ? 'odd' : 'even'} key={index}>{item}</i>)}</div></section><section className="sfg-chase-recent"><h3>最近投注</h3>{detailTask.orders ? <><div><span>区块 71,428,557</span><b>双 · 21 TRX</b><em className="positive">+20.37</em></div><div><span>区块 71,428,553</span><b>单 · 10 TRX</b><em className="negative">-10.00</em></div></> : <p>该任务暂无投注记录</p>}</section><button className="sfg-button sfg-button-primary sfg-chase-detail-control" onClick={() => { toggleTask(detailTask); setDetailId('') }}>{detailTask.status === 'RUNNING' ? '暂停任务' : '启动任务'}</button></div>}
    </Sheet>

  </main>
}
