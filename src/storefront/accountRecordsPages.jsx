import { useMemo, useState } from 'react'
import { CalendarDays, ListFilter, ReceiptText } from 'lucide-react'
import { ACCOUNT_RECORDS, HASH_RECORDS, LOTTERY_RECORDS } from './accountData'
import {
  Badge,
  Card,
  EmptyState,
  PageShell,
  PillTabs,
  PrimaryButton,
  SectionTitle,
  Segmented,
  SelectSheet,
  SummaryGrid,
  useSfaActions,
} from './accountUi'

const accountCategories = ['充提明细', '福利明细', '佣金明细', '互转明细', '兑换明细']
const currencyOptions = ['全部币种', 'USDT', 'TRX', 'CNY']
const timeOptions = ['全部时间', '今天', '昨天', '近7天', '近30天', '自定义']

function matchesTime(item, time) {
  if (['全部时间', '近7天', '近30天', '自定义'].includes(time)) return true
  const value = String(item.time || item.id || '')
  if (time === '今天') return value.includes('2026-08-27') || !value.includes('2026-08-26')
  if (time === '昨天') return value.includes('2026-08-26')
  return true
}

function resolveMode(props) {
  if (['account', 'hash', 'lottery'].includes(props?.mode)) return props.mode
  const path = String(props?.path || props?.route || '')
  if (path.includes('account_details')) return 'account'
  if (path.includes('lottery-bets')) return 'lottery'
  return 'hash'
}

export function RecordsPage(props) {
  const actions = useSfaActions(props)
  const mode = resolveMode(props)
  const [recordType, setRecordType] = useState(mode === 'lottery' ? 'lottery' : 'hash')
  const [accountCategory, setAccountCategory] = useState('充提明细')
  const [lotteryTab, setLotteryTab] = useState('lottery')
  const [currency, setCurrency] = useState('全部币种')
  const [status, setStatus] = useState('全部状态')
  const [game, setGame] = useState(mode === 'lottery' ? '全部彩种' : '全部游戏')
  const [play, setPlay] = useState('全部玩法')
  const [accountType, setAccountType] = useState('全部类型')
  const [time, setTime] = useState(mode === 'account' ? '全部时间' : '今天')
  const [sheet, setSheet] = useState(null)
  const [searched, setSearched] = useState(0)

  const effectiveMode = mode === 'account' ? 'account' : recordType
  const title = mode === 'account' ? '账变明细' : '投注记录'

  const records = useMemo(() => {
    if (effectiveMode === 'account') return ACCOUNT_RECORDS.filter((item) => item.category === accountCategory && (currency === '全部币种' || item.currency === currency) && (status === '全部状态' || item.status === status) && (accountType === '全部类型' || item.type === accountType) && matchesTime(item, time))
    if (effectiveMode === 'lottery') {
      if (lotteryTab === 'chase') return []
      return LOTTERY_RECORDS.filter((item) => (currency === '全部币种' || item.currency === currency) && (status === '全部状态' || item.status === status) && (game === '全部彩种' || item.game === game) && (play === '全部玩法' || item.play === play) && matchesTime(item, time))
    }
    return HASH_RECORDS.filter((item) => (currency === '全部币种' || item.currency === currency) && (status === '全部状态' || item.status === status) && (game === '全部游戏' || item.game === game) && matchesTime(item, time))
  }, [accountCategory, accountType, currency, effectiveMode, game, lotteryTab, play, status, searched, time])

  const openSheet = (key, titleText, options, value, setter) => setSheet({ key, title: titleText, options, value, setter })
  const statusOptions = effectiveMode === 'account' ? ['全部状态', '成功', '失败', '处理中'] : effectiveMode === 'lottery' ? ['全部状态', '待开奖', '已中奖', '未中奖', '和'] : ['全部状态', '开奖中', '已中奖', '未中奖', '已退回']
  const gameOptions = effectiveMode === 'lottery' ? ['全部彩种', ...new Set(LOTTERY_RECORDS.map((item) => item.game))] : ['全部游戏', ...new Set(HASH_RECORDS.map((item) => item.game))]

  const changeRecordType = (value) => {
    if (value === 'entertainment') return actions.notify('娱乐记录敬请期待')
    setRecordType(value)
    setGame(value === 'lottery' ? '全部彩种' : '全部游戏')
    setStatus('全部状态')
  }

  return (
    <PageShell title={title} onBack={actions.back} message={actions.localMessage}>
      {mode === 'account' ? <PillTabs items={accountCategories} value={accountCategory} onChange={setAccountCategory} /> : <Segmented items={[{ value: 'lottery', label: '彩票记录' }, { value: 'hash', label: '哈希记录' }, { value: 'entertainment', label: '娱乐记录' }]} value={recordType} onChange={changeRecordType} compact />}
      {effectiveMode === 'lottery' ? <PillTabs items={[{ value: 'lottery', label: '彩票投注' }, { value: 'chase', label: '追号投注' }]} value={lotteryTab} onChange={setLotteryTab} /> : null}

      {effectiveMode !== 'account' ? <Card><SummaryGrid items={[
        { label: '总投注(单)', value: String(records.length || 0) },
        { label: '有效投注', value: records.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2) },
        { label: '输赢总计', value: effectiveMode === 'hash' ? '-40.60' : '+7.60' },
      ]} /></Card> : null}

      <div className="sfa-filter-grid">
        <button type="button" onClick={() => openSheet('currency', '币种筛选', currencyOptions, currency, setCurrency)}><ListFilter size={15} />{currency}</button>
        <button type="button" onClick={() => openSheet('status', '状态筛选', statusOptions, status, setStatus)}>{status}</button>
        {effectiveMode !== 'account' ? <button type="button" onClick={() => openSheet('game', effectiveMode === 'lottery' ? '选择彩种' : '游戏筛选', gameOptions, game, setGame)}>{game}</button> : <button type="button" onClick={() => openSheet('type', '类型筛选', ['全部类型', '充值', '提现', '余额转账', '余额兑换', '首充加赠'], accountType, setAccountType)}>{accountType}</button>}
        {effectiveMode === 'lottery' ? <button type="button" onClick={() => openSheet('play', '选择玩法', ['全部玩法', '五星直选 · 复式', '一星定位胆'], play, setPlay)}>{play}</button> : null}
        <button type="button" onClick={() => openSheet('time', '时间筛选', timeOptions, time, setTime)}><CalendarDays size={15} />{time}</button>
        <button className="is-primary" type="button" onClick={() => { setSearched((value) => value + 1); actions.notify('查询完成', 'success') }}>查询</button>
      </div>

      <SectionTitle>{effectiveMode === 'account' ? accountCategory : `${effectiveMode === 'lottery' ? '彩票' : '哈希'}投注记录`}</SectionTitle>
      {records.length ? <div className="sfa-record-list">{records.map((record) => effectiveMode === 'account' ? (
        <Card className="sfa-record-card" key={record.id} onClick={() => actions.notify(`订单号：${record.id}`)}>
          <div><span className="sfa-action-icon"><ReceiptText size={18} /></span><span><strong>{record.type}</strong><small>{record.time}</small></span><Badge tone={record.status === '成功' ? 'success' : record.status === '处理中' ? 'warning' : 'danger'}>{record.status}</Badge></div>
          <p><b className={record.amount.startsWith('+') ? 'is-positive' : ''}>{record.amount} {record.currency}</b></p>
          <code>{record.id}</code>
        </Card>
      ) : effectiveMode === 'lottery' ? (
        <Card className="sfa-record-card" key={record.id} onClick={() => actions.go(`/pages/lottery/order-detail?id=${record.id}`)}>
          <div><span><strong>{record.game}</strong><small>第{record.issue}期</small></span><Badge tone={record.status === '已中奖' ? 'success' : 'neutral'}>{record.status}</Badge></div>
          <p>{record.play} · {record.pick}</p><p>投注 <b>{record.amount} {record.currency}</b></p><code>{record.id}</code>
        </Card>
      ) : (
        <Card className="sfa-record-card" key={record.id} onClick={() => actions.go(`/pages/hash/order-detail?id=${record.id}`)}>
          <div><span><strong>{record.game}</strong><small>{record.time} · 投 {record.pick}</small></span><Badge tone={record.status === '已中奖' ? 'success' : record.status === '开奖中' ? 'warning' : 'neutral'}>{record.status}</Badge></div>
          <p>{record.amount} {record.currency} <b className={String(record.profit).startsWith('+') ? 'is-positive' : ''}>{record.profit}</b></p><small>开奖结果：{record.result}</small><code>{record.id}</code>
        </Card>
      ))}</div> : <EmptyState title="暂无数据" description="当前筛选条件下暂无记录" action="重置筛选" onAction={() => { setCurrency('全部币种'); setStatus('全部状态'); setGame(effectiveMode === 'lottery' ? '全部彩种' : '全部游戏'); setPlay('全部玩法'); setAccountType('全部类型'); setTime(effectiveMode === 'account' ? '全部时间' : '今天'); setLotteryTab('lottery'); actions.notify('筛选已重置') }} />}
      {records.length ? <PrimaryButton tone="light" onClick={() => actions.notify('没有更多了')}>加载更多</PrimaryButton> : null}

      <SelectSheet
        open={Boolean(sheet)}
        title={sheet?.title}
        options={sheet?.options || []}
        value={sheet?.value}
        onClose={() => setSheet(null)}
        onSelect={(value) => {
          if (sheet?.key === 'time' && value === '自定义') actions.notify('已选择 2026-08-20 至 2026-08-27')
          sheet?.setter?.(value)
          setSheet(null)
        }}
      />
    </PageShell>
  )
}
