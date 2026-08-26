import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, BarChart3, Check, ChevronDown, ChevronRight, CircleHelp, Clipboard,
  Clock3, Coins, Copy, FileCheck2, Flame, Gamepad2, History, Info, Layers3,
  ListChecks, LoaderCircle, Minus, Plus, ReceiptText, RefreshCw, Search,
  Settings2, ShieldCheck, ShoppingCart, SlidersHorizontal, Sparkles, Trash2,
  Trophy, Volume2, WalletCards, X,
} from 'lucide-react'
import {
  CURRENCIES, GAME_GROUPS, HASH_DRAWS, HASH_GAME_ITEMS, HASH_TREND, LONG_DRAGONS,
  LOTTERY_GAMES, LOTTERY_NUMBERS, LOTTERY_ORDERS, LOTTERY_PERIODS,
  LOTTERY_POSITION_NAMES, LOTTERY_RESULTS, resolveHashGame,
} from './gameData.js'
import './game-pages.css'

const LOTTERY_FAMILIES = [
  { family: '时时彩', plays: ['五星直选 · 复式', '五星组选 · 组选120', '前三直选 · 和值', '后二组选 · 复式', '一星定位胆'] },
  { family: '11选5', plays: ['前三直选 · 复式', '前三组选 · 复式', '任选二中二', '任选三中三', '定位胆'] },
  { family: 'PK10', plays: ['冠亚军和值', '前五名直选', '冠军定位胆', '两面盘', '龙虎'] },
  { family: '快三', plays: ['和值', '三同号通选', '三不同号', '二同号复选', '独胆'] },
  { family: 'PC28', plays: ['混合', '特码', '波色', '豹子', '极值'] },
  { family: '六合彩', plays: ['特码', '正码', '连码', '生肖', '色波'] },
]

function currentPath(path) {
  if (path) return String(path)
  if (typeof window !== 'undefined') return `${window.location.pathname}${window.location.search}`
  return ''
}

function callNavigate(navigate, path) {
  if (typeof navigate === 'function') navigate(path)
}

function usePageFeedback(externalToast) {
  const [notice, setNotice] = useState('')
  const timer = useRef(null)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const notify = (message, type = 'success') => {
    setNotice(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setNotice(''), 2100)
    externalToast?.(message, type)
  }
  return [notice, notify]
}

function useCountdown(seconds = 60) {
  const [left, setLeft] = useState(Math.max(1, seconds))
  useEffect(() => {
    setLeft(Math.max(1, seconds))
    const timer = window.setInterval(() => setLeft((value) => value <= 1 ? Math.max(1, seconds) : value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [seconds])
  return left
}

function PageNotice({ message }) {
  return message ? <div className="sfg-page-notice"><Check size={14} />{message}</div> : null
}

function H5Header({ title, onBack, titleMenu, right, subTitle }) {
  return (
    <header className="sfg-header">
      <button className="sfg-icon-button" onClick={onBack} aria-label="返回"><ArrowLeft size={21} /></button>
      {titleMenu ? <button className="sfg-header-title sfg-header-title-menu" onClick={titleMenu}>
        <span>{title}</span>{subTitle && <small>{subTitle}</small>}<ChevronDown size={13} />
      </button> : <div className="sfg-header-title"><span>{title}</span>{subTitle && <small>{subTitle}</small>}</div>}
      <div className="sfg-header-right">{right || <span className="sfg-header-space" />}</div>
    </header>
  )
}

function Sheet({ title, children, onClose, full = false, footer, className = '' }) {
  if (!title) return null
  return (
    <div className="sfg-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className={`sfg-sheet ${full ? 'sfg-sheet-full' : ''} ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="sfg-sheet-handle" />
        <div className="sfg-sheet-header"><b>{title}</b><button className="sfg-icon-button" onClick={onClose} aria-label="关闭"><X size={20} /></button></div>
        <div className="sfg-sheet-body">{children}</div>
        {footer && <div className="sfg-sheet-footer">{footer}</div>}
      </section>
    </div>
  )
}

function Empty({ text = '暂无数据' }) {
  return <div className="sfg-empty"><ReceiptText size={32} /><span>{text}</span></div>
}

function SectionTitle({ title, extra }) {
  return <div className="sfg-section-title"><b>{title}</b>{extra}</div>
}

function MoneyInput({ amount, onChange, chips, suffix = '' }) {
  return (
    <>
      <div className="sfg-chip-row">{chips.map((chip) => <button className={Number(amount) === chip ? 'sfg-active' : ''} key={chip} onClick={() => onChange(String(chip))}>{chip}</button>)}</div>
      <label className="sfg-money-input"><span>金额</span><input inputMode="decimal" type="number" min="0" value={amount} onChange={(event) => onChange(event.target.value)} placeholder="请输入金额" />{suffix && <em>{suffix}</em>}</label>
    </>
  )
}

function resultLabel(draw, config) {
  if (config.template === 'quick') return `${draw.result}（${draw.parity}、${draw.size}）`
  if (config.template === 'size') return `${draw.result}（${draw.size}）`
  if (config.template === 'lucky') return `${draw.result}（${Number(draw.result) >= 5 ? '赢' : '输'}）`
  if (config.template === 'banker') return ['庄', '闲', '和'][Number(draw.result) % 3]
  if (config.template === 'niuniu') return ['庄', '和', '闲'][Number(draw.result) % 3]
  return `${draw.result}（${draw.parity}）`
}

function HashBlockCard({ config, countdown, onVerify, onDraws }) {
  const draw = HASH_DRAWS[0]
  return (
    <section className="sfg-card sfg-block-card">
      <div className="sfg-block-half">
        <span>已开奖区块</span><strong>{draw.block}</strong>
        <button className="sfg-link" onClick={onVerify}>验证</button>
      </div>
      <div className="sfg-countdown" style={{ '--sfg-progress': `${(countdown / config.cycle) * 360}deg` }}><b>{countdown}</b><small>秒</small></div>
      <div className="sfg-block-half sfg-align-right">
        <span>当前下注区块 <Volume2 size={12} /></span><strong>{String(Number(draw.block) + (config.template === 'quick' ? 1 : 20))}</strong>
        <button className="sfg-link" onClick={onDraws}>往期开奖结果 <ChevronRight size={13} /></button>
      </div>
      <div className="sfg-block-result"><i>{draw.result}</i><span>{resultLabel(draw, config)}</span><em>{draw.hash}</em></div>
    </section>
  )
}

function HashChoices({ config, selections, onToggle }) {
  const options = config.options
  return (
    <div className={`sfg-hash-choices sfg-hash-${config.template}`}>
      {options.map((option, index) => {
        const selected = selections.includes(option)
        const tone = ['mint', 'red', 'blue', 'gold'][index % 4]
        return (
          <button key={option} className={`sfg-hash-choice sfg-tone-${tone} ${selected ? 'sfg-selected' : ''}`} onClick={() => onToggle(option)}>
            <strong>{option}</strong>
            {config.template === 'niuniu' ? <small>无需选择方向，自动与庄家比点数</small> : <small>{config.template === 'banker' ? '赔率 —' : `总下注 0 · ${config.odds}x`}</small>}
          </button>
        )
      })}
    </div>
  )
}

function HashBetControls({ config, amount, setAmount, selections, setSelections, onBet, notify }) {
  const chips = config.template === 'quick' ? [10, 20, 50, 100, 500, 1000, 2000, 5000] : config.template === 'parity' || config.template === 'size' ? [20, 100, 500, 1000, 5000] : [10, 20, 40, 80, 160]
  const reset = () => { setAmount(''); setSelections(config.template === 'niuniu' || config.template === 'lucky' ? [config.options[0]] : []); notify('已重置投注内容') }
  return (
    <div className={config.template === 'quick' ? 'sfg-quick-bet-dock' : 'sfg-bet-controls'}>
      <MoneyInput amount={amount} onChange={setAmount} chips={chips} />
      <div className="sfg-bet-summary"><span>共 <b>{Number(amount || 0).toFixed(2)}</b></span><span>已选 <b>{selections.length}</b> 注</span></div>
      <div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={reset}>重置</button><button className="sfg-button sfg-button-primary" disabled={!Number(amount) || !selections.length} onClick={onBet}>{config.template === 'quick' ? '立即投注' : '确定'}</button></div>
    </div>
  )
}

function HashTrend({ config }) {
  const [mode, setMode] = useState('区块走势')
  const trendOptions = config.trendOptions || (config.template === 'size' ? ['大', '小'] : config.template === 'quick' ? ['单双', '大小'] : config.options)
  return (
    <section className="sfg-card sfg-trend-card">
      <div className="sfg-trend-head">
        <SectionTitle title="开奖走势" />
        <div className="sfg-trend-counts">{trendOptions.map((item, index) => <span key={item}><i className={index % 2 ? 'sfg-red-dot' : 'sfg-green-dot'}>{item.slice(0, 1)}</i>{index ? 15 : 35}</span>)}</div>
      </div>
      <div className="sfg-segmented"><button className={mode === '区块走势' ? 'sfg-active' : ''} onClick={() => setMode('区块走势')}>区块走势</button><button className={mode === '我的走势' ? 'sfg-active' : ''} onClick={() => setMode('我的走势')}>我的走势</button></div>
      {mode === '我的走势' ? <Empty text="暂无走势数据" /> : <div className="sfg-trend-road">{HASH_TREND.map((item, index) => <i key={`${item}-${index}`} className={item === '单' ? 'sfg-trend-green' : 'sfg-trend-red'}>{config.template === 'size' ? (index % 3 ? '小' : '大') : config.template === 'banker' ? (['庄', '闲', '和'][index % 3]) : item}</i>)}</div>}
    </section>
  )
}

function HashHistory({ config, records, onMore, onVerify }) {
  return (
    <>
      {config.template !== 'quick' && config.template !== 'niuniu' && config.template !== 'banker' && config.template !== 'lucky' && (
        <section className="sfg-card">
          <SectionTitle title="往期开奖" extra={<button className="sfg-link" onClick={onMore}>更多 <ChevronRight size={13} /></button>} />
          <div className="sfg-table sfg-hash-table"><div className="sfg-table-head"><span>开奖区块</span><span>开奖结果</span><span>区块哈希</span><span>操作</span></div>{HASH_DRAWS.slice(0, 5).map((row) => <div className="sfg-table-row" key={row.block}><span>{row.block}</span><span className={row.parity === '单' ? 'sfg-text-green' : 'sfg-text-red'}>{resultLabel(row, config)}</span><span>{row.hash}</span><button className="sfg-link" onClick={() => onVerify(row)}>验证</button></div>)}</div>
        </section>
      )}
      <section className="sfg-card sfg-order-card">
        <SectionTitle title="投注记录" extra={<button className="sfg-link" onClick={onMore}>更多 <ChevronRight size={13} /></button>} />
        <div className="sfg-table"><div className="sfg-table-head"><span>币种</span><span>注数</span><span>下注金额</span><span>今日输赢</span></div>{records.length ? records.map((record) => <div className="sfg-table-row" key={record.id}><span>{record.currency}</span><span>{record.count}</span><span>{record.amount}</span><span>待开奖</span></div>) : <Empty text="暂无数据" />}</div>
      </section>
    </>
  )
}

function HashVerifySheet({ draw, onClose, onBack, notify }) {
  if (!draw) return null
  return (
    <Sheet title="开奖验证" full onClose={onClose}>
      <div className="sfg-verify-status"><ShieldCheck size={34} /><b>区块数据验证一致</b><span>本页为前端演示，不连接真实链上服务</span></div>
      <div className="sfg-detail-list">
        <div><span>开奖区块</span><b>{draw.block}</b></div><div><span>开奖结果</span><b>{draw.result}</b></div><div><span>开奖时间</span><b>{draw.time}</b></div>
        <div className="sfg-detail-wide"><span>区块哈希</span><b>{draw.fullHash}</b><button className="sfg-link" onClick={() => { navigator.clipboard?.writeText(draw.fullHash); notify('区块哈希已复制') }}><Copy size={14} />复制</button></div>
        <div className="sfg-detail-wide"><span>验证逻辑</span><p>读取区块哈希末位有效数字，按当前游戏规则映射开奖结果；演示数据与页面展示结果一致。</p></div>
      </div>
      <button className="sfg-button sfg-button-outline" onClick={() => notify('演示原型不发起真实链上查询')}>链上核对</button>
      {onBack && <button className="sfg-button sfg-button-soft sfg-block-button" onClick={onBack}>返回往期开奖结果</button>}
    </Sheet>
  )
}

function HashGameDetailEntry({ path, navigate, toast }) {
  const route = currentPath(path)
  const gameId = route.match(/[?&]gameId=([^&]+)/)?.[1] || ''
  const [notice, notify] = usePageFeedback(toast)
  const linkedGame = HASH_GAME_ITEMS.find((item) => item.slug === gameId || item.path.endsWith(`/${gameId}`))
  return <main className="sfg-page sfg-hash-detail-entry"><H5Header title="哈希游戏" onBack={() => callNavigate(navigate, '/pages/game/list')} /><PageNotice message={notice} /><section className="sfg-card sfg-hash-entry-card"><span className="sfg-game-orb"><Gamepad2 size={24} /></span><h2>哈希游戏</h2>{!gameId ? <><div className="sfg-entry-warning"><Info size={18} /><span><b>缺少游戏ID</b><small>请从游戏列表选择一个游戏后再进入</small></span></div><button className="sfg-button sfg-button-primary" onClick={() => callNavigate(navigate, '/pages/game/list')}>选择游戏</button></> : <><div className="sfg-entry-info"><span>游戏ID</span><b>{gameId}</b></div><div className="sfg-entry-info"><span>识别结果</span><b>{linkedGame?.name || '通用哈希游戏'}</b></div><button className="sfg-button sfg-button-primary" onClick={() => linkedGame ? callNavigate(navigate, linkedGame.path) : notify('未找到该游戏ID对应的演示页面', 'error')}>进入游戏</button></>}</section></main>
}

function HashGamePlayPage({ path, navigate, toast, onOpenGuide }) {
  const route = currentPath(path)
  const config = useMemo(() => resolveHashGame(route), [route])
  const countdown = useCountdown(config.cycle)
  const [notice, notify] = usePageFeedback(toast)
  const [sheet, setSheet] = useState('')
  const [verifyDraw, setVerifyDraw] = useState(null)
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [mode, setMode] = useState('page')
  const [amount, setAmount] = useState('')
  const initialOptions = config.template === 'niuniu' || config.template === 'lucky' ? [config.options[0]] : []
  const [selections, setSelections] = useState(initialOptions)
  const [records, setRecords] = useState([])
  const orderSequence = useRef(1)
  const [sound, setSound] = useState(true)
  const [fastBet, setFastBet] = useState(false)

  useEffect(() => { setSelections(config.template === 'niuniu' || config.template === 'lucky' ? [config.options[0]] : []); setAmount(''); setSheet('') }, [config.path])
  const toggleChoice = (option) => {
    if (config.template === 'niuniu' || config.template === 'lucky') { setSelections([option]); return }
    setSelections((items) => config.template === 'quick' ? items.includes(option) ? items.filter((item) => item !== option) : [...items, option] : [option])
  }
  const openGuide = () => typeof onOpenGuide === 'function' ? onOpenGuide(config) : callNavigate(navigate, config.guidePath)
  const startBet = () => {
    if (!Number(amount) || !selections.length) { notify('请选择投注方向并输入金额', 'error'); return }
    setSheet('betConfirm')
  }
  const finishBet = () => {
    setSheet('')
    const orderId = `HDEMO${String(orderSequence.current++).padStart(4, '0')}`
    setRecords((items) => [{ id: orderId, currency: currency.code, count: selections.length, amount: Number(amount).toFixed(2) }, ...items])
    setAmount('')
    notify('模拟投注成功，等待开奖')
  }
  const draw = HASH_DRAWS[0]
  return (
    <main className={`sfg-page sfg-hash-page ${config.template === 'quick' ? 'sfg-with-quick-dock' : ''}`}>
      <H5Header title={config.name} onBack={() => callNavigate(navigate, '/pages/home/index')} titleMenu={() => setSheet('games')} right={<div className="sfg-wallet-head"><button onClick={() => setSheet('currency')}><i className={`sfg-coin sfg-${currency.color}`}>{currency.symbol}</i><span>{currency.balance}</span><ChevronDown size={12} /></button><button className="sfg-recharge" onClick={() => callNavigate(navigate, '/pages/deposit/index')}><WalletCards size={14} />充值</button></div>} />
      <PageNotice message={notice} />
      <div className="sfg-bet-mode"><button className={mode === 'transfer' ? 'sfg-active' : ''} onClick={() => setMode('transfer')}><Clipboard size={15} />转账投注</button><button className={mode === 'page' ? 'sfg-active' : ''} onClick={() => setMode('page')}><Gamepad2 size={15} />页面投注</button></div>
      <section className="sfg-game-intro"><div><b>{config.name}</b><em>{config.odds}{config.odds !== '—' && !config.odds.includes('倍') ? ' x' : ''}</em><button className="sfg-link" onClick={openGuide}><Info size={14} />玩法介绍</button></div><p>最低下注：1 USDT / 1 TRX / 1 CNY</p>{config.template === 'niuniu' && <p>下注金额=转账全额；闲方赢时按点数倍率结算演示盈利。</p>}</section>
      <HashBlockCard config={config} countdown={countdown} onVerify={() => { setVerifyDraw(draw); setSheet('verify') }} onDraws={() => setSheet('draws')} />
      {mode === 'transfer' ? <section className="sfg-card sfg-transfer-card"><Coins size={30} /><b>{currency.code} 转账投注</b><p>向演示地址转账，系统将按金额自动识别投注方向。本原型不会发起真实转账。</p><code>TX7M...DEMO...8Q2</code><button className="sfg-button sfg-button-primary" onClick={() => notify('演示地址已复制')}>复制演示地址</button></section> : <>
        <section className="sfg-card sfg-choice-card"><SectionTitle title="当期投注额累计" extra={<button className="sfg-link" onClick={() => setSheet('settings')}><Settings2 size={14} />游戏设置</button>} /><HashChoices config={config} selections={selections} onToggle={toggleChoice} />{config.template !== 'quick' && <HashBetControls config={config} amount={amount} setAmount={setAmount} selections={selections} setSelections={setSelections} onBet={startBet} notify={notify} />}</section>
      </>}
      <HashTrend config={config} />
      <HashHistory config={config} records={records} onMore={() => setSheet('draws')} onVerify={(row) => { setVerifyDraw(row); setSheet('verify') }} />
      {mode === 'page' && config.template === 'quick' && <HashBetControls config={config} amount={amount} setAmount={setAmount} selections={selections} setSelections={setSelections} onBet={startBet} notify={notify} />}

      <Sheet title={sheet === 'games' ? '选择游戏' : ''} onClose={() => setSheet('')} className="sfg-game-picker"><div className="sfg-picker-grid">{HASH_GAME_ITEMS.map((game) => <button className={game.slug === config.slug ? 'sfg-selected' : ''} key={game.slug} onClick={() => { setSheet(''); callNavigate(navigate, game.path) }}><span className="sfg-game-orb"><Gamepad2 size={18} /></span><b>{game.name}</b>{game.slug === config.slug && <Check size={15} />}</button>)}</div></Sheet>
      <Sheet title={sheet === 'currency' ? '选择币种' : ''} onClose={() => setSheet('')}><div className="sfg-option-list">{CURRENCIES.map((item) => <button key={item.code} onClick={() => { setCurrency(item); setSheet(''); notify(`已切换为 ${item.code}`) }}><i className={`sfg-coin sfg-${item.color}`}>{item.symbol}</i><span><b>{item.name}</b><small>余额 {item.balance}</small></span>{currency.code === item.code && <Check size={18} />}</button>)}</div></Sheet>
      <Sheet title={sheet === 'settings' ? '游戏设置' : ''} onClose={() => setSheet('')} footer={<div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={() => setSheet('')}>取消</button><button className="sfg-button sfg-button-primary" onClick={() => { setSheet(''); notify('游戏设置已保存') }}>保存</button></div>}><div className="sfg-setting-list"><label><span><b>开奖声音</b><small>开奖时播放提示音</small></span><input type="checkbox" checked={sound} onChange={(event) => setSound(event.target.checked)} /></label><label><span><b>快速投注</b><small>沿用上一笔投注方向</small></span><input type="checkbox" checked={fastBet} onChange={(event) => setFastBet(event.target.checked)} /></label></div></Sheet>
      <Sheet title={sheet === 'draws' ? '往期开奖结果' : ''} full onClose={() => setSheet('')}><div className="sfg-draw-list">{HASH_DRAWS.map((row) => <button key={row.block} onClick={() => { setVerifyDraw(row); setSheet('verifyFromDraws') }}><div><span>区块 {row.block}</span><small>{row.time}</small></div><strong>{resultLabel(row, config)}</strong><em>{row.hash}</em><ChevronRight size={17} /></button>)}</div></Sheet>
      <HashVerifySheet draw={sheet.startsWith('verify') ? verifyDraw : null} onClose={() => setSheet('')} onBack={sheet === 'verifyFromDraws' ? () => setSheet('draws') : null} notify={notify} />
      <Sheet title={sheet === 'betConfirm' ? '确认投注' : ''} onClose={() => setSheet('')} footer={<div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={() => setSheet('')}>取消</button><button className="sfg-button sfg-button-primary" onClick={finishBet}>确认投注</button></div>}><div className="sfg-confirm-card"><div><span>游戏</span><b>{config.name}</b></div><div><span>当前区块</span><b>{Number(draw.block) + 20}</b></div><div><span>投注方向</span><b>{selections.join('、')}</b></div><div><span>投注金额</span><b>{Number(amount || 0).toFixed(2)} {currency.code}</b></div><p><CircleHelp size={14} />仅模拟确认，不会连接钱包、支付或链上服务。</p></div></Sheet>
    </main>
  )
}

export function HashGamePage(props) {
  return currentPath(props.path).split('?')[0] === '/pages/hash/detail' ? <HashGameDetailEntry {...props} /> : <HashGamePlayPage {...props} />
}

function LotteryBalls({ selected, setSelected, showHot, showOmit, disabled }) {
  const toggleNumber = (rowIndex, number) => {
    if (disabled) return
    setSelected((rows) => rows.map((row, index) => index !== rowIndex ? row : row.includes(number) ? row.filter((item) => item !== number) : [...row, number].sort((a, b) => a - b)))
  }
  const quickPick = (rowIndex, type) => {
    if (disabled) return
    const picks = type === '全' ? LOTTERY_NUMBERS : type === '大' ? [5, 6, 7, 8, 9] : type === '小' ? [0, 1, 2, 3, 4] : type === '奇' ? [1, 3, 5, 7, 9] : type === '偶' ? [0, 2, 4, 6, 8] : []
    setSelected((rows) => rows.map((row, index) => index === rowIndex ? picks : row))
  }
  return <div className={`sfg-number-board ${disabled ? 'sfg-disabled' : ''}`}>{LOTTERY_POSITION_NAMES.map((position, rowIndex) => <div className="sfg-number-row" key={position}><div className="sfg-position-label"><b>{position}</b><small>{selected[rowIndex].length}码</small></div><div className="sfg-number-content"><div className="sfg-number-balls">{LOTTERY_NUMBERS.map((number) => <button key={number} className={selected[rowIndex].includes(number) ? 'sfg-selected' : ''} onClick={() => toggleNumber(rowIndex, number)}><b>{number}</b>{showHot && <small>{[8, 12, 5, 19, 7, 14, 3, 11, 6, 16][(rowIndex + number) % 10]}</small>}{showOmit && <em>{[2, 0, 4, 1, 7, 3, 9, 2, 5, 6][(rowIndex * 2 + number) % 10]}</em>}</button>)}</div><div className="sfg-quick-picks">{['全', '大', '小', '奇', '偶', '清'].map((type) => <button key={type} onClick={() => quickPick(rowIndex, type)}>{type}</button>)}</div></div></div>)}</div>
}

function LotteryPlaySheet({ open, selectedFamily, setSelectedFamily, play, onChoose, onClose }) {
  return <Sheet title={open ? '选择玩法' : ''} full onClose={onClose}><div className="sfg-play-picker"><aside>{LOTTERY_FAMILIES.map((item) => <button className={selectedFamily === item.family ? 'sfg-active' : ''} key={item.family} onClick={() => setSelectedFamily(item.family)}>{item.family}</button>)}</aside><div>{LOTTERY_FAMILIES.find((item) => item.family === selectedFamily)?.plays.map((item) => <button className={play === item ? 'sfg-selected' : ''} key={item} onClick={() => onChoose(item)}><span><b>{item.split(' · ')[0]}</b><small>{item.includes(' · ') ? item.split(' · ')[1] : '标准玩法'}</small></span>{play === item && <Check size={17} />}</button>)}</div></div></Sheet>
}

function LotteryHeader({ lottery, setSheet, navigate }) {
  return <H5Header title={lottery.name} onBack={() => callNavigate(navigate, '/pages/home/index')} titleMenu={() => setSheet('lotteries')} right={<div className="sfg-header-tools"><button onClick={() => callNavigate(navigate, '/pages/lottery/long-dragon')}><Flame size={18} /><small>长龙</small></button><button onClick={() => callNavigate(navigate, '/pages/lottery/chase')}><Layers3 size={18} /><small>追号</small></button></div>} />
}

function LotteryDrawTab({ onVerify, notify }) {
  return <section className="sfg-card sfg-lottery-result-list"><SectionTitle title="近期开奖结果" extra={<button className="sfg-link" onClick={() => notify('已加载全部开奖记录')}>开奖记录</button>} />{LOTTERY_RESULTS.map((item) => <button key={item.issue} onClick={() => onVerify(item)}><div><b>{item.issue}期</b><small>{item.time} 开奖</small></div><span className="sfg-result-balls">{item.numbers.map((number, index) => <i key={`${number}-${index}`}>{number}</i>)}</span><em>和值 {item.sum}</em><ChevronRight size={16} /></button>)}</section>
}

function LotteryOrdersTab({ orders, navigate, notify }) {
  return <section className="sfg-card sfg-lottery-orders"><SectionTitle title="我的注单" extra={<button className="sfg-link" onClick={() => notify('注单记录已刷新')}><RefreshCw size={13} />刷新</button>} />{orders.length ? orders.map((order) => <button key={order.id} onClick={() => callNavigate(navigate, `/pages/lottery/order-detail?id=${order.id}`)}><div><b>{order.play}</b><small>{order.issue}期 · {order.id}</small></div><span><b>{order.amount} USDT</b><em className={order.status === '已中奖' ? 'sfg-text-green' : ''}>{order.status}</em></span><ChevronRight size={17} /></button>) : <Empty />}</section>
}

function LotteryTrendTab({ setSheet, trendPlay }) {
  const [period, setPeriod] = useState(30)
  return <section className="sfg-card sfg-lottery-trend"><button className="sfg-trend-play" onClick={() => setSheet('trendPlay')}><span><b>{trendPlay}</b><small>点击切换走势玩法</small></span><ChevronDown size={17} /></button><div className="sfg-period-tabs">{[30, 50, 100].map((item) => <button className={period === item ? 'sfg-active' : ''} key={item} onClick={() => setPeriod(item)}>近{item}期</button>)}</div><div className="sfg-trend-grid"><div className="sfg-trend-grid-head"><span>期号</span>{LOTTERY_NUMBERS.map((number) => <b key={number}>{number}</b>)}</div>{LOTTERY_RESULTS.map((item, row) => <div className="sfg-trend-grid-row" key={item.issue}><span>{item.issue.slice(-4)}</span>{LOTTERY_NUMBERS.map((number) => <i className={item.numbers.includes(number) ? 'sfg-hit' : ''} key={number}>{item.numbers.includes(number) ? number : ((row + number) % 9) + 1}</i>)}</div>)}</div></section>
}

export function LotteryGamePage({ path, navigate, toast, loading = false, sealed: sealedProp }) {
  const route = currentPath(path)
  const defaultSealed = route.split('?')[0] === '/pages/lottery/game'
  const sealed = sealedProp ?? defaultSealed
  const lottery = LOTTERY_GAMES.find((item) => route.includes(item.path.split('?')[0])) || LOTTERY_GAMES[0]
  const countdown = useCountdown(lottery.cycle)
  const [notice, notify] = usePageFeedback(toast)
  const [sheet, setSheet] = useState('')
  const [tab, setTab] = useState('投注')
  const [play, setPlay] = useState('五星直选 · 复式')
  const [family, setFamily] = useState('时时彩')
  const [selected, setSelected] = useState(() => LOTTERY_POSITION_NAMES.map(() => []))
  const [showHot, setShowHot] = useState(false)
  const [showOmit, setShowOmit] = useState(false)
  const [displayDraft, setDisplayDraft] = useState({ hot: false, omit: false })
  const [multiplier, setMultiplier] = useState(1)
  const [unit, setUnit] = useState(1)
  const [basket, setBasket] = useState([])
  const [orders, setOrders] = useState(LOTTERY_ORDERS)
  const [verifyResult, setVerifyResult] = useState(null)
  const [guideTab, setGuideTab] = useState('玩法')
  const [trendPlay, setTrendPlay] = useState('五星号码分布')
  const [quickAmounts, setQuickAmounts] = useState(['10', '20', '50', '100', '500'])
  const [sourceGame, setSourceGame] = useState(lottery)
  const [pendingBet, setPendingBet] = useState(null)
  const basketSequence = useRef(1)
  const orderSequence = useRef(1)
  const count = useMemo(() => selected.every((row) => row.length) ? selected.reduce((total, row) => total * row.length, 1) : 0, [selected])
  const amount = count * 2 * multiplier * unit
  const resetPicks = () => setSelected(LOTTERY_POSITION_NAMES.map(() => []))
  const selectionText = selected.map((row, index) => row.length ? `${LOTTERY_POSITION_NAMES[index]} ${row.join('')}` : '').filter(Boolean).join(' / ')
  const addBasket = () => {
    if (!count) { notify('请先完成号码选择', 'error'); return }
    const basketId = `BDEMO${String(basketSequence.current++).padStart(3, '0')}`
    setBasket((items) => [...items, { id: basketId, play, picks: selectionText, count, amount }])
    resetPicks(); notify('已添加至采购篮')
  }
  const requestBet = (fromBasket = false) => {
    const totalCount = fromBasket ? basket.reduce((sum, item) => sum + item.count, 0) : count
    const totalAmount = fromBasket ? basket.reduce((sum, item) => sum + item.amount, 0) : amount
    if (!totalCount) { notify('暂无可投注的选号', 'error'); return }
    setPendingBet({ fromBasket, totalCount, totalAmount, pick: fromBasket ? `${basket.length}个方案` : selectionText })
    setSheet('betConfirm')
  }
  const placeBet = () => {
    if (!pendingBet) return
    notify('模拟投注中…', 'loading')
    window.setTimeout(() => {
      const orderId = `LDEMO${String(orderSequence.current++).padStart(4, '0')}`
      setOrders((items) => [{ id: orderId, issue: lottery.issue, play, pick: pendingBet.pick, amount: pendingBet.totalAmount.toFixed(2), status: '待开奖', prize: '—' }, ...items])
      if (pendingBet.fromBasket) setBasket([]); else resetPicks()
      setPendingBet(null); setSheet(''); notify('模拟投注成功，已生成注单')
    }, 650)
  }
  return (
    <main className="sfg-page sfg-lottery-page">
      <LotteryHeader lottery={sourceGame} setSheet={setSheet} navigate={navigate} />
      <PageNotice message={notice} />
      <nav className="sfg-lottery-tabs">{['投注', '开奖', '注单', '走势'].map((item) => <button className={tab === item ? 'sfg-active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</nav>
      {tab === '投注' && <>
        <section className="sfg-lottery-issue"><div><small>第 {lottery.issue} 期</small><b>{sealed ? '本期已封盘' : '投注进行中'}</b></div><div className="sfg-lottery-clock"><Clock3 size={17} /><strong>{String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}</strong></div><div className="sfg-last-numbers">{LOTTERY_RESULTS[0].numbers.map((number, index) => <i key={`${number}-${index}`}>{number}</i>)}</div></section>
        <section className="sfg-card sfg-lottery-toolbar">
          <button className="sfg-play-main" onClick={() => setSheet('plays')}><span><small>当前玩法</small><b>{play}</b></span><ChevronRight size={17} /></button>
          <div className="sfg-tool-row"><button onClick={() => setSheet('guide')}><CircleHelp size={16} />玩法介绍</button><button onClick={() => setSheet('source')}><FileCheck2 size={16} />来源</button><button className={showHot ? 'sfg-active' : ''} onClick={() => setShowHot((value) => !value)}><Flame size={16} />冷热</button><button className={showOmit ? 'sfg-active' : ''} onClick={() => setShowOmit((value) => !value)}><BarChart3 size={16} />遗漏</button><button aria-label="显示设置" onClick={() => { setDisplayDraft({ hot: showHot, omit: showOmit }); setSheet('displaySettings') }}><Settings2 size={16} /></button></div>
        </section>
        {loading ? <section className="sfg-card sfg-loading-card"><LoaderCircle className="sfg-spin" size={30} /><b>正在加载当前期数据</b><span>请稍候</span></section> : <LotteryBalls selected={selected} setSelected={setSelected} showHot={showHot} showOmit={showOmit} disabled={sealed} />}
        {sealed && <div className="sfg-sealed-tip"><Clock3 size={17} /><span>当前期已封盘，请等待下一期开启</span><button onClick={() => notify('正在等待下一期演示数据')}>刷新</button></div>}
        <section className="sfg-card sfg-lottery-amount"><div className="sfg-multiplier"><span>倍数</span><button onClick={() => setMultiplier(Math.max(1, multiplier - 1))}><Minus size={15} /></button><input value={multiplier} inputMode="numeric" onChange={(event) => setMultiplier(Math.max(1, Number(event.target.value) || 1))} /><button onClick={() => setMultiplier(multiplier + 1)}><Plus size={15} /></button></div><div className="sfg-unit-picker">{[[1, '元'], [0.1, '角'], [0.01, '分']].map(([value, label]) => <button className={unit === value ? 'sfg-active' : ''} key={value} onClick={() => setUnit(value)}>{label}</button>)}</div><button className="sfg-link" onClick={() => setSheet('quickAmounts')}><Settings2 size={13} />编辑快捷金额</button></section>
        <div className="sfg-lottery-betbar"><button className="sfg-basket-button" onClick={() => setSheet('basket')}><ShoppingCart size={21} /><small>采购篮</small>{basket.length > 0 && <i>{basket.length}</i>}</button><div><span>共 <b>{count}</b> 注</span><strong>{amount.toFixed(2)} USDT</strong></div><button className="sfg-button sfg-button-soft" disabled={!count || sealed} onClick={addBasket}>添加选号</button><button className="sfg-button sfg-button-primary" disabled={!count || sealed} onClick={() => requestBet(false)}>立即投注</button></div>
      </>}
      {tab === '开奖' && <LotteryDrawTab notify={notify} onVerify={(item) => { setVerifyResult(item); setSheet('lotteryVerify') }} />}
      {tab === '注单' && <LotteryOrdersTab orders={orders} navigate={navigate} notify={notify} />}
      {tab === '走势' && <LotteryTrendTab setSheet={setSheet} trendPlay={trendPlay} />}

      <Sheet title={sheet === 'lotteries' ? '切换彩种' : ''} onClose={() => setSheet('')}><div className="sfg-option-list">{LOTTERY_GAMES.map((item) => <button key={`${item.name}-${item.path}`} onClick={() => { setSourceGame(item); setSheet(''); callNavigate(navigate, item.path) }}><span className="sfg-game-orb"><Sparkles size={17} /></span><span><b>{item.name}</b><small>{item.source}</small></span>{sourceGame.name === item.name && <Check size={17} />}</button>)}</div></Sheet>
      <LotteryPlaySheet open={sheet === 'plays'} selectedFamily={family} setSelectedFamily={setFamily} play={play} onChoose={(value) => { setPlay(value); resetPicks(); setSheet(''); notify(`已切换玩法：${value}`) }} onClose={() => setSheet('')} />
      <Sheet title={sheet === 'guide' ? '玩法介绍' : ''} full onClose={() => setSheet('')}><div className="sfg-sheet-tabs"><button className={guideTab === '玩法' ? 'sfg-active' : ''} onClick={() => setGuideTab('玩法')}>玩法</button><button className={guideTab === '中奖' ? 'sfg-active' : ''} onClick={() => setGuideTab('中奖')}>中奖</button></div>{guideTab === '玩法' ? <div className="sfg-article"><h3>{play}</h3><p>从万、千、百、十、个五个位置分别选择一个或多个号码，所选号码组成一注或多注号码。</p><h4>投注示例</h4><p>选择 1、2、3、4、5，若当期开奖号码与所选号码及位置完全相同，即为中奖。</p></div> : <div className="sfg-article"><h3>中奖说明</h3><p>本玩法按号码和位置共同判断。演示赔率及奖金仅用于界面展示，以注单页面显示为准。</p><h4>单注金额</h4><p>标准模式每注 2 USDT，可通过倍数和元角分单位调整演示金额。</p></div>}</Sheet>
      <Sheet title={sheet === 'source' ? '号码来源' : ''} full onClose={() => setSheet('')}><div className="sfg-article"><h3>{sourceGame.source}</h3><p>开奖号码由演示区块哈希按固定位数映射生成，页面不访问真实区块链服务。</p><h4>开奖示例</h4><p>区块哈希末尾依次提取 5 个有效数字，得到示例号码 6、1、9、3、8。</p><h4>开奖时间</h4><p>每 1 分钟一期，封盘后展示开奖倒计时。</p><h4>玩法规则</h4><p>开奖结果经演示验证后用于各类直选、组选、定位胆等玩法判定。</p></div></Sheet>
      <Sheet title={sheet === 'displaySettings' ? '冷热遗漏设置' : ''} onClose={() => setSheet('')} footer={<div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={() => setSheet('')}>取消</button><button className="sfg-button sfg-button-primary" onClick={() => { setShowHot(displayDraft.hot); setShowOmit(displayDraft.omit); setSheet(''); notify('显示设置已保存') }}>保存</button></div>}><div className="sfg-setting-list"><label><span><b>显示冷热值</b><small>球号下方展示近期出现次数</small></span><input type="checkbox" checked={displayDraft.hot} onChange={(event) => setDisplayDraft((value) => ({ ...value, hot: event.target.checked }))} /></label><label><span><b>显示遗漏值</b><small>球号右上角展示当前遗漏期数</small></span><input type="checkbox" checked={displayDraft.omit} onChange={(event) => setDisplayDraft((value) => ({ ...value, omit: event.target.checked }))} /></label></div></Sheet>
      <Sheet title={sheet === 'quickAmounts' ? '编辑快捷金额' : ''} onClose={() => setSheet('')} footer={<div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={() => setQuickAmounts(['10', '20', '50', '100', '500'])}>恢复默认</button><button className="sfg-button sfg-button-primary" onClick={() => { setSheet(''); notify('快捷金额已保存') }}>保存</button></div>}><p className="sfg-sheet-tip">最多设置 8 个快捷金额</p><div className="sfg-quick-amount-editor">{quickAmounts.map((value, index) => <label key={index}><input value={value} inputMode="decimal" onChange={(event) => setQuickAmounts((items) => items.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /><button onClick={() => setQuickAmounts((items) => items.filter((_, itemIndex) => itemIndex !== index))}><X size={15} /></button></label>)}{quickAmounts.length < 8 && <button onClick={() => setQuickAmounts((items) => [...items, ''])}><Plus size={16} />添加金额</button>}</div></Sheet>
      <Sheet title={sheet === 'basket' ? '采购篮' : ''} full onClose={() => setSheet('')} footer={<div className="sfg-basket-footer"><span>合计 <b>{basket.reduce((sum, item) => sum + item.amount, 0).toFixed(2)} USDT</b></span><button className="sfg-button sfg-button-primary" disabled={!basket.length} onClick={() => requestBet(true)}>立即投注</button></div>}><div className="sfg-basket-head"><span>共 {basket.length} 个选号方案</span><button className="sfg-link" disabled={!basket.length} onClick={() => { setBasket([]); notify('采购篮已清空') }}><Trash2 size={14} />清空</button></div>{basket.length ? basket.map((item) => <div className="sfg-basket-item" key={item.id}><div><b>{item.play}</b><p>{item.picks}</p><small>{item.count}注 · {item.amount.toFixed(2)} USDT</small></div><button onClick={() => setBasket((items) => items.filter((entry) => entry.id !== item.id))}><Trash2 size={17} /></button></div>) : <Empty text="采购篮暂无选号" />}</Sheet>
      <Sheet title={sheet === 'betConfirm' ? '确认投注' : ''} onClose={() => { setSheet(''); setPendingBet(null) }} footer={<div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={() => { setSheet(''); setPendingBet(null) }}>取消</button><button className="sfg-button sfg-button-primary" onClick={placeBet}>确认投注</button></div>}><div className="sfg-confirm-card"><div><span>彩种</span><b>{lottery.name}</b></div><div><span>期号</span><b>{lottery.issue}</b></div><div><span>玩法</span><b>{play}</b></div><div><span>注数</span><b>{pendingBet?.totalCount || 0} 注</b></div><div><span>投注金额</span><b>{Number(pendingBet?.totalAmount || 0).toFixed(2)} USDT</b></div><p><CircleHelp size={14} />仅生成本地演示注单，不会发起真实投注。</p></div></Sheet>
      <Sheet title={sheet === 'lotteryVerify' ? '开奖验证' : ''} full onClose={() => setSheet('')}><div className="sfg-verify-status"><ShieldCheck size={34} /><b>开奖数据验证一致</b><span>本页为演示验证结果</span></div>{verifyResult && <div className="sfg-detail-list"><div><span>期号</span><b>{verifyResult.issue}</b></div><div><span>开奖号码</span><b>{verifyResult.numbers.join(' ')}</b></div><div><span>开奖区块</span><b>70419860</b></div><div className="sfg-detail-wide"><span>区块哈希</span><b>e923744fa65ad2f82ea25ce09de109f6d59269874a06f83d85cb5905be48a314</b><button className="sfg-link" onClick={() => notify('区块哈希已复制')}><Copy size={14} />复制</button></div></div>}<button className="sfg-button sfg-button-outline" onClick={() => notify('演示原型不发起真实链上查询')}>链上核对</button></Sheet>
      <Sheet title={sheet === 'trendPlay' ? '走势玩法' : ''} onClose={() => setSheet('')}><div className="sfg-simple-options">{['五星号码分布', '前二组选走势', '后二和值走势', '总和大小单双'].map((item) => <button key={item} onClick={() => { setTrendPlay(item); setSheet(''); notify(`已切换为${item}`) }}>{item}<ChevronRight size={16} /></button>)}</div></Sheet>
    </main>
  )
}

export function GameGuidePage({ path, navigate, toast, game }) {
  const route = currentPath(path)
  const querySlug = route.match(/[?&]game=([^&]+)/)?.[1]
  const guideFallback = route.includes('banker-player-guide') ? HASH_GAME_ITEMS.find((item) => item.slug === 'lucky-banker-player') : resolveHashGame(route)
  const config = game || HASH_GAME_ITEMS.find((item) => item.slug === querySlug) || guideFallback
  const [notice, notify] = usePageFeedback(toast)
  const [sheet, setSheet] = useState('')
  const [section, setSection] = useState('玩法说明')
  const rules = config.template === 'banker' ? '庄、闲、和按演示哈希映射结果进行判定。' : config.template === 'niuniu' ? '系统生成庄家点数，用户默认押闲，闲方获胜时按1–10倍浮动倍数结算。' : '读取区块哈希末位有效数字，并按单双、大小或输赢规则映射开奖结果。'
  return <main className="sfg-page sfg-guide-page"><H5Header title="玩法介绍" subTitle={config.name} onBack={() => callNavigate(navigate, config.path)} titleMenu={() => setSheet('games')} /><PageNotice message={notice} /><nav className="sfg-guide-nav">{['玩法说明', '开奖规则', '公平验证'].map((item) => <button className={section === item ? 'sfg-active' : ''} key={item} onClick={() => setSection(item)}>{item}</button>)}</nav><article className="sfg-card sfg-guide-article">{section === '玩法说明' && <><h2>{config.name}</h2><p>本游戏为区块哈希结果演示玩法，最低下注为 1 USDT / 1 TRX / 1 CNY。</p><h3>如何投注</h3><ol><li>选择转账投注或页面投注。</li><li>选择投注方向并输入金额。</li><li>确认演示投注，等待当前区块开奖。</li></ol><h3>中奖说明</h3><p>{rules}</p><div className="sfg-rule-example"><b>示例</b><span>演示区块哈希末位数字为 7，则判定为“单”和“大”。</span></div></>}{section === '开奖规则' && <><h2>开奖规则</h2><p>{rules}</p><h3>结算顺序</h3><ol><li>当前期停止接收演示投注。</li><li>读取预设区块及哈希。</li><li>按玩法规则生成结果。</li><li>注单展示模拟结算状态。</li></ol><p className="sfg-warning-note">本原型不连接真实链上节点，所有数据均为确定性前端演示数据。</p></>}{section === '公平验证' && <><h2>公平验证</h2><p>往期开奖结果中可进入验证详情，查看开奖区块、完整区块哈希和映射说明。</p><button className="sfg-button sfg-button-outline" onClick={() => notify('已展示验证流程说明')}>查看验证流程</button></>}</article><Sheet title={sheet === 'games' ? '选择游戏' : ''} onClose={() => setSheet('')}><div className="sfg-option-list">{HASH_GAME_ITEMS.map((item) => <button key={item.slug} onClick={() => { setSheet(''); callNavigate(navigate, `${item.guidePath}${item.guidePath.includes('?') ? '' : `?game=${item.slug}`}`) }}><span className="sfg-game-orb"><Gamepad2 size={17} /></span><span><b>{item.name}</b><small>{item.template === 'quick' ? '快开玩法' : '哈希玩法'}</small></span>{item.slug === config.slug && <Check size={17} />}</button>)}</div></Sheet></main>
}

export function LotteryChasePage({ navigate, toast, selection = '万位 6 / 千位 1 / 百位 9 / 十位 3 / 个位 8' }) {
  const [notice, notify] = usePageFeedback(toast)
  const [rows, setRows] = useState(() => LOTTERY_PERIODS.map((item, index) => ({ ...item, checked: index < 5, multiple: 1 })))
  const [winStop, setWinStop] = useState(true)
  const [confirm, setConfirm] = useState(false)
  const checked = rows.filter((item) => item.checked)
  const total = checked.reduce((sum, item) => sum + item.multiple * 2, 0)
  const toggleMode = (mode) => setRows((items) => items.map((item, index) => ({ ...item, checked: mode === 'all' ? true : mode === 'odd' ? index % 2 === 0 : false })))
  return <main className="sfg-page sfg-chase-page"><H5Header title="追号投注" onBack={() => callNavigate(navigate, '/pages/lottery/tron-minute')} /><PageNotice message={notice} /><section className="sfg-card sfg-chase-summary"><span><small>彩种</small><b>哈希一分彩</b></span><span><small>玩法</small><b>五星直选 · 复式</b></span><p>{selection}</p></section><section className="sfg-card"><div className="sfg-chase-tools"><button onClick={() => toggleMode('all')}>全选</button><button onClick={() => toggleMode('odd')}>隔期</button><button onClick={() => toggleMode('none')}>清空</button><label><input type="checkbox" checked={winStop} onChange={(event) => setWinStop(event.target.checked)} />中奖即停</label></div><div className="sfg-chase-list">{rows.map((row, index) => <div className={row.checked ? 'sfg-selected' : ''} key={row.issue}><input type="checkbox" checked={row.checked} onChange={(event) => setRows((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, checked: event.target.checked } : item))} /><span><b>{row.issue}期</b><small>{row.time} 截止</small></span><label><button onClick={() => setRows((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, multiple: Math.max(1, item.multiple - 1) } : item))}>−</button><input value={row.multiple} inputMode="numeric" onChange={(event) => setRows((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, multiple: Math.max(1, Number(event.target.value) || 1) } : item))} /><button onClick={() => setRows((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, multiple: item.multiple + 1 } : item))}>+</button><em>倍</em></label><strong>{row.multiple * 2}.00</strong></div>)}</div></section><div className="sfg-fixed-action"><span>已选 <b>{checked.length}</b> 期<br /><strong>{total.toFixed(2)} USDT</strong></span><button className="sfg-button sfg-button-primary" disabled={!checked.length} onClick={() => setConfirm(true)}>确认追号</button></div><Sheet title={confirm ? '确认追号计划' : ''} onClose={() => setConfirm(false)} footer={<div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={() => setConfirm(false)}>取消</button><button className="sfg-button sfg-button-primary" onClick={() => { setConfirm(false); notify('追号计划创建成功') }}>提交计划</button></div>}><div className="sfg-confirm-card"><div><span>追号期数</span><b>{checked.length}期</b></div><div><span>计划总额</span><b>{total.toFixed(2)} USDT</b></div><div><span>停止条件</span><b>{winStop ? '中奖即停' : '完成全部期次'}</b></div><p><Info size={14} />仅创建本地演示计划，不会发起真实投注。</p></div></Sheet></main>
}

export function LotteryLongDragonPage({ navigate, toast }) {
  const [notice, notify] = usePageFeedback(toast)
  const [filter, setFilter] = useState('全部')
  const [target, setTarget] = useState(null)
  const [amount, setAmount] = useState('10')
  const rows = LONG_DRAGONS.filter((item) => filter === '全部' || item.result === filter)
  return <main className="sfg-page sfg-long-page"><H5Header title="长龙投注" onBack={() => callNavigate(navigate, '/pages/lottery/tron-minute')} right={<button className="sfg-icon-button" onClick={() => notify('长龙数据已刷新')}><RefreshCw size={18} /></button>} /><PageNotice message={notice} /><div className="sfg-filter-tabs">{['全部', '单', '双', '大', '小'].map((item) => <button className={filter === item ? 'sfg-active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="sfg-long-list">{rows.map((item) => <section className="sfg-card" key={item.id}><div className="sfg-long-top"><span><Flame size={20} /><b>{item.count}期长龙</b></span><small>{item.issue}期</small></div><div className="sfg-long-main"><div><b>{item.game}</b><span>{item.play}</span></div><i>{item.result}</i><div><small>参考赔率</small><b>{item.odds}</b></div></div><button className="sfg-button sfg-button-primary" onClick={() => { setTarget(item); setAmount('10') }}>跟投</button></section>)}</div>{!rows.length && <Empty text="暂无符合条件的长龙" />}<Sheet title={target ? '长龙跟投' : ''} onClose={() => setTarget(null)} footer={<div className="sfg-button-pair"><button className="sfg-button sfg-button-soft" onClick={() => setTarget(null)}>取消</button><button className="sfg-button sfg-button-primary" onClick={() => { setTarget(null); notify('长龙跟投模拟成功') }}>立即跟投</button></div>}>{target && <><div className="sfg-confirm-card"><div><span>彩种</span><b>{target.game}</b></div><div><span>玩法</span><b>{target.play}</b></div><div><span>方向</span><b>{target.result}</b></div></div><MoneyInput amount={amount} onChange={setAmount} chips={[10, 20, 50, 100, 500]} suffix="USDT" /></>}</Sheet></main>
}

export function GameListPage({ navigate, toast }) {
  const [notice, notify] = usePageFeedback(toast)
  const [group, setGroup] = useState('hash')
  const [keyword, setKeyword] = useState('')
  const hashRows = HASH_GAME_ITEMS.filter((item) => item.name.includes(keyword.trim()))
  const lotteryRows = LOTTERY_GAMES.filter((item, index) => index === 0 || !item.path.includes('?')).filter((item) => item.name.includes(keyword.trim()))
  const rows = group === 'lottery' ? lotteryRows : group === 'recent' ? [HASH_GAME_ITEMS[2], HASH_GAME_ITEMS.at(-1), LOTTERY_GAMES[0]].filter((item) => item.name.includes(keyword.trim())) : hashRows
  return <main className="sfg-page sfg-game-list-page"><H5Header title="全部游戏" onBack={() => callNavigate(navigate, '/pages/home/index')} right={<button className="sfg-icon-button" onClick={() => notify('游戏列表已刷新')}><RefreshCw size={18} /></button>} /><PageNotice message={notice} /><label className="sfg-search"><Search size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索游戏名称" />{keyword && <button onClick={() => setKeyword('')}><X size={16} /></button>}</label><nav className="sfg-game-groups">{GAME_GROUPS.map((item) => <button className={group === item.id ? 'sfg-active' : ''} key={item.id} onClick={() => setGroup(item.id)}>{item.label}</button>)}</nav><div className="sfg-game-grid">{rows.map((item, index) => <button key={`${item.name}-${index}`} onClick={() => callNavigate(navigate, item.path)}><span className={`sfg-game-art sfg-art-${index % 6}`}><Gamepad2 size={26} /></span><b>{item.name}</b><small>{item.template === 'quick' ? `${item.cycle}秒快开` : item.source || '区块哈希玩法'}</small>{index < 3 && <em>{index === 0 ? '热门' : '推荐'}</em>}</button>)}</div>{!rows.length && <Empty text="没有找到相关游戏" />}</main>
}

export function OrderDetailPage({ path, navigate, toast, order, kind }) {
  const route = currentPath(path)
  const isLottery = kind === 'lottery' || route.includes('/lottery/')
  const detail = order || (isLottery ? LOTTERY_ORDERS[0] : null)
  const [notice, notify] = usePageFeedback(toast)
  const [verify, setVerify] = useState(false)
  const backPath = isLottery ? '/pages/lottery/tron-minute' : '/pages/hash/one-minute-parity'
  if (!detail) return <main className="sfg-page sfg-order-detail-page"><H5Header title="注单详情" onBack={() => callNavigate(navigate, backPath)} /><PageNotice message={notice} /><div className="sfg-invalid-state"><div><ReceiptText size={42} /></div><h2>注单不存在或已失效</h2><p>未获取到有效的注单 ID，或该演示注单已经过期。</p><button className="sfg-button sfg-button-primary" onClick={() => notify('仍未找到该演示注单', 'error')}><RefreshCw size={16} />重新加载</button><button className="sfg-button sfg-button-soft" onClick={() => callNavigate(navigate, backPath)}>返回游戏</button></div></main>
  return <main className="sfg-page sfg-order-detail-page"><H5Header title="注单详情" onBack={() => callNavigate(navigate, backPath)} /><PageNotice message={notice} /><section className="sfg-order-status"><i className={detail.status === '已中奖' ? 'sfg-win' : ''}><Trophy size={28} /></i><b>{detail.status || '待开奖'}</b><span>{detail.status === '已中奖' ? `奖金 ${detail.prize} USDT` : '本注单已完成模拟结算'}</span></section><section className="sfg-card sfg-detail-list"><div><span>注单编号</span><b>{detail.id}</b><button className="sfg-link" onClick={() => notify('注单编号已复制')}><Copy size={13} /></button></div><div><span>期号</span><b>{detail.issue}</b></div><div><span>玩法</span><b>{detail.play}</b></div><div><span>投注内容</span><b>{detail.pick}</b></div><div><span>投注金额</span><b>{detail.amount} USDT</b></div><div><span>中奖金额</span><b>{detail.prize || '0.00'} USDT</b></div><div><span>投注时间</span><b>2026-08-27 12:46:18</b></div></section><section className="sfg-card"><SectionTitle title="开奖信息" /><div className="sfg-result-line"><span>{LOTTERY_RESULTS[0].numbers.map((number, index) => <i key={`${number}-${index}`}>{number}</i>)}</span><button className="sfg-link" onClick={() => setVerify(true)}>开奖验证 <ChevronRight size={14} /></button></div></section><Sheet title={verify ? '开奖验证' : ''} full onClose={() => setVerify(false)}><div className="sfg-verify-status"><ShieldCheck size={34} /><b>开奖数据验证一致</b><span>确定性前端模拟数据</span></div><div className="sfg-detail-list"><div><span>开奖区块</span><b>70419860</b></div><div><span>开奖号码</span><b>{LOTTERY_RESULTS[0].numbers.join(' ')}</b></div><div className="sfg-detail-wide"><span>区块哈希</span><b>{HASH_DRAWS[0].fullHash}</b></div></div><button className="sfg-button sfg-button-outline" onClick={() => notify('演示原型不发起真实链上查询')}>链上核对</button></Sheet></main>
}

export { HASH_GAME_ITEMS, LOTTERY_GAMES }
