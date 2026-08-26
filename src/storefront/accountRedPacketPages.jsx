import { useMemo, useState } from 'react'
import { Gift, Send, Share2, Sparkles, Users } from 'lucide-react'
import { ACCOUNT_CURRENCIES, PROMO_DOMAINS, RED_PACKET_RECORDS, SECURITY_QUESTIONS } from './accountData'
import {
  Badge,
  Card,
  ConfirmModal,
  CopyLine,
  CurrencyTabs,
  EmptyState,
  Field,
  GhostButton,
  GoogleVerificationModal,
  Hint,
  Modal,
  PageShell,
  PasswordField,
  PillTabs,
  PrimaryButton,
  SectionTitle,
  Segmented,
  SelectField,
  SelectSheet,
  SummaryGrid,
  useSfaActions,
} from './accountUi'

function currentCurrency(code) {
  return ACCOUNT_CURRENCIES.find((item) => item.code === code) || ACCOUNT_CURRENCIES[0]
}

function numberValue(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

export function RedPacketPage(props) {
  const actions = useSfaActions(props)
  const initialTab = String(props?.tab || props?.path || '').includes('transfer') ? 'transfer' : 'send'
  const [tab, setTab] = useState(initialTab)
  const [currency, setCurrency] = useState('USDT')
  const [mode, setMode] = useState('lucky')
  const [receiveWay, setReceiveWay] = useState('无限制')
  const [amount, setAmount] = useState('')
  const [count, setCount] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const [multiple, setMultiple] = useState('1')
  const [expire, setExpire] = useState('10')
  const [domain, setDomain] = useState(PROMO_DOMAINS[0].value)
  const [domainSheet, setDomainSheet] = useState(false)
  const [fundPassword, setFundPassword] = useState('')
  const [answer, setAnswer] = useState('')
  const [questionSheet, setQuestionSheet] = useState(false)
  const [question, setQuestion] = useState(SECURITY_QUESTIONS[0])
  const [confirm, setConfirm] = useState(false)
  const [google, setGoogle] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdPacket, setCreatedPacket] = useState(null)
  const [transferType, setTransferType] = useState('balance')
  const [receiver, setReceiver] = useState(props?.receiver || '')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferMultiple, setTransferMultiple] = useState('1')
  const [pendingAction, setPendingAction] = useState('send')
  const balance = currentCurrency(currency)

  const resetSecurity = () => {
    setFundPassword('')
    setAnswer('')
  }

  const validateSecurity = () => {
    if (!/^\d{6}$/.test(fundPassword)) {
      actions.notify('请输入6位资金密码')
      return false
    }
    if (!answer.trim()) {
      actions.notify('请输入密保答案')
      return false
    }
    return true
  }

  const requestPacket = () => {
    const total = numberValue(amount)
    const packetCount = numberValue(count)
    if (total <= 0) return actions.notify('请输入红包总金额')
    if (total > 3000) return actions.notify('红包总额上限3000')
    if (!Number.isInteger(packetCount) || packetCount <= 0) return actions.notify('红包个数必须为正整数')
    if (numberValue(multiple) < 0 || numberValue(multiple) > 100) return actions.notify('流水倍数范围0~100')
    if (numberValue(expire) < 0) return actions.notify('请输入正确的退回时间')
    if (!domain) return actions.notify('请选择跳转链接')
    if (!validateSecurity()) return
    setPendingAction('send')
    setConfirm(true)
  }

  const requestTransfer = () => {
    const total = numberValue(transferAmount)
    if (!receiver.trim()) return actions.notify('请输入账号')
    if (total <= 0) return actions.notify('请输入转账金额')
    if (total > 3000) return actions.notify('单笔转账限额3000')
    const available = transferType === 'commission' ? balance.commission : balance.balance
    if (total > available) return actions.notify(transferType === 'commission' ? '佣金余额不足' : '余额不足')
    if (transferType === 'balance' && (numberValue(transferMultiple) < 0 || numberValue(transferMultiple) > 100)) return actions.notify('流水倍数范围0~100')
    if (!validateSecurity()) return
    setPendingAction('transfer')
    setGoogle(true)
  }

  const verified = () => {
    setGoogle(false)
    if (pendingAction === 'send') {
      setCreatedPacket({ amount: numberValue(amount), count: numberValue(count), currency, receiveWay })
      setSuccess(true)
      setAmount('')
      setCount('')
    } else {
      setTransferAmount('')
      actions.notify('转账成功', 'success')
    }
    resetSecurity()
  }

  const selectedDomain = PROMO_DOMAINS.find((item) => item.value === domain)
  const openCreatedPacket = () => {
    if (!createdPacket) return actions.notify('暂无可分享红包')
    const params = new URLSearchParams({
      id: 'RP202608270099',
      amount: String(createdPacket.amount),
      count: String(createdPacket.count),
      currency: createdPacket.currency,
      condition: createdPacket.receiveWay,
      mode: mode === 'fixed' ? '固定金额红包' : '拼手气红包',
    })
    actions.go(`/pages/wallet/red_packet_detail?${params.toString()}`)
  }

  return (
    <PageShell
      title="红包中心"
      onBack={actions.back}
      message={actions.localMessage}
      right={<button className="sfa-header-link" type="button" onClick={() => actions.go('/pages/service/index')}>客服</button>}
      bottom={tab === 'send' ? <div className="sfa-dual-actions"><GhostButton onClick={() => actions.go('/pages/wallet/red_packet_records')}>红包记录</GhostButton><PrimaryButton onClick={requestPacket}>生成红包</PrimaryButton></div> : <div className="sfa-dual-actions"><GhostButton onClick={() => actions.go('/pages/records/account_details?tab=transfer')}>转账记录</GhostButton><PrimaryButton onClick={requestTransfer}>确定</PrimaryButton></div>}
    >
      <Segmented items={[{ value: 'send', label: '发红包' }, { value: 'transfer', label: '转账' }]} value={tab} onChange={setTab} />
      {tab === 'send' ? (
        <>
          <Card className="sfa-red-summary">
            <div><small>预计扣款</small><strong>{numberValue(amount).toFixed(2)} <span>{currency}</span></strong></div>
            <CurrencyTabs currencies={ACCOUNT_CURRENCIES} value={currency} onChange={setCurrency} balanceKey={null} />
          </Card>
          <Hint>红包从账户余额扣除，未领取金额按设置时间退回。每次生成一条分享链接，通过链接领取的玩家会按现有规则绑定邀请关系。</Hint>
          <SectionTitle action="我的红包记录" onAction={() => actions.go('/pages/wallet/red_packet_records')}>红包设置</SectionTitle>
          <Card>
            <Segmented items={[{ value: 'lucky', label: '拼手气红包' }, { value: 'fixed', label: '固定金额红包' }]} value={mode} onChange={setMode} compact />
            <div className="sfa-two-columns">
              <Field label="总金额" value={amount} onChange={setAmount} type="number" suffix={currency} />
              <Field label="红包个数" value={count} onChange={(value) => setCount(value.replace(/\D/g, ''))} type="number" suffix="个" />
            </div>
            <span className="sfa-field-label">领取方式</span>
            <PillTabs items={['无限制', '仅新用户领取', '仅会员领取']} value={receiveWay} onChange={setReceiveWay} />
          </Card>
          <Card className={`sfa-advanced ${advanced ? 'is-open' : ''}`}>
            <button className="sfa-advanced-head" type="button" onClick={() => setAdvanced((current) => !current)}>
              <span><b>高级设置</b><small>{multiple || 0}倍 · {expire || 0}小时 · 跳转域名</small></span><span>{advanced ? '收起' : '展开'}</span>
            </button>
            {advanced ? <div className="sfa-advanced-body">
              <div className="sfa-two-columns"><Field label="流水倍数" value={multiple} onChange={setMultiple} type="number" suffix="倍" /><Field label="退回时间" value={expire} onChange={setExpire} type="number" suffix="小时" /></div>
              <SelectField label="跳转域名" value={selectedDomain?.label} onClick={() => setDomainSheet(true)} />
              <Hint>退回时间填写 0 时，未领取红包不会自动退回。</Hint>
            </div> : null}
          </Card>
          <SecurityFields fundPassword={fundPassword} setFundPassword={setFundPassword} question={question} setQuestionSheet={setQuestionSheet} answer={answer} setAnswer={setAnswer} />
        </>
      ) : (
        <>
          <PillTabs items={[{ value: 'balance', label: '余额转账' }, { value: 'commission', label: '佣金转账' }]} value={transferType} onChange={setTransferType} />
          <Card>
            <SectionTitle action="我的转账记录" onAction={() => actions.go('/pages/records/account_details?tab=transfer')}>转账币种</SectionTitle>
            <CurrencyTabs currencies={ACCOUNT_CURRENCIES} value={currency} onChange={setCurrency} balanceKey={transferType === 'commission' ? 'commission' : 'balance'} />
            <Field label="账号" value={receiver} onChange={setReceiver} placeholder="请输入对方账号" disabled={Boolean(props?.lockReceiver)} />
            <Field label="转账金额" value={transferAmount} onChange={setTransferAmount} type="number" placeholder="单笔转账限额3000" suffix={currency} right={`余额：${(transferType === 'commission' ? balance.commission : balance.balance).toFixed(2)}`} />
            {transferType === 'balance' ? <Field label="设置流水倍数" value={transferMultiple} onChange={setTransferMultiple} type="number" placeholder="0~100（0表示无需流水）" suffix="倍" /> : null}
          </Card>
          <SecurityFields fundPassword={fundPassword} setFundPassword={setFundPassword} question={question} setQuestionSheet={setQuestionSheet} answer={answer} setAnswer={setAnswer} />
        </>
      )}

      <SelectSheet open={domainSheet} title="跳转域名" options={PROMO_DOMAINS.map((item) => ({ value: item.value, label: item.label }))} value={domain} onClose={() => setDomainSheet(false)} onSelect={(value) => { setDomain(value); setDomainSheet(false) }} empty="暂无跳转链接，请先到推广代理生成" />
      <SelectSheet open={questionSheet} title="选择密保问题" options={SECURITY_QUESTIONS} value={question} onClose={() => setQuestionSheet(false)} onSelect={(value) => { setQuestion(value); setQuestionSheet(false) }} />
      <ConfirmModal open={confirm} title="确认生成红包" content={`${currency} ${numberValue(amount).toFixed(2)}，共 ${count || 0} 个。确认后将从余额扣除红包总金额。`} confirmText="确认并扣款" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); setGoogle(true) }} />
      <GoogleVerificationModal open={google} purpose={pendingAction === 'send' ? '生成红包并扣款' : '会员余额转账'} onClose={() => setGoogle(false)} onVerified={verified} />
      <Modal open={success} title="红包生成成功" onClose={() => setSuccess(false)} footer={<div className="sfa-modal-actions"><GhostButton onClick={() => { setSuccess(false); actions.go('/pages/wallet/red_packet_records') }}>查看红包记录</GhostButton><PrimaryButton onClick={() => { setSuccess(false); openCreatedPacket() }}>查看并分享</PrimaryButton></div>}>
        <div className="sfa-red-packet-art"><Gift size={38} /><span>恭喜发财</span></div>
        <SummaryGrid items={[{ label: '红包金额', value: `${numberValue(createdPacket?.amount).toFixed(2)} ${createdPacket?.currency || currency}` }, { label: '红包个数', value: `${createdPacket?.count || 0}个` }, { label: '领取条件', value: createdPacket?.receiveWay || receiveWay }]} />
      </Modal>
    </PageShell>
  )
}

function SecurityFields({ fundPassword, setFundPassword, question, setQuestionSheet, answer, setAnswer }) {
  return (
    <>
      <SectionTitle>安全验证</SectionTitle>
      <Card>
        <PasswordField label="资金密码" value={fundPassword} onChange={(value) => setFundPassword(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" />
        <SelectField label="密保问题" value={question} onClick={() => setQuestionSheet(true)} />
        <Field label="请输入密保答案" value={answer} onChange={setAnswer} placeholder="请输入答案" />
        <small className="sfa-field-tip">密保提示：户口所在地</small>
      </Card>
    </>
  )
}

export function RedPacketRecordsPage(props) {
  const actions = useSfaActions(props)
  const [tab, setTab] = useState('send')
  const [currency, setCurrency] = useState('全部币种')
  const [range, setRange] = useState('全部时间')
  const [currencySheet, setCurrencySheet] = useState(false)
  const [rangeSheet, setRangeSheet] = useState(false)
  const records = RED_PACKET_RECORDS.filter((item) => item.type === tab && (currency === '全部币种' || item.currency === currency))

  return (
    <PageShell title="红包记录" onBack={actions.back} message={actions.localMessage}>
      <Segmented items={[{ value: 'send', label: '我发出的' }, { value: 'receive', label: '我领取的' }]} value={tab} onChange={setTab} />
      <div className="sfa-filter-row"><button type="button" onClick={() => setCurrencySheet(true)}>{currency}</button><button type="button" onClick={() => setRangeSheet(true)}>{range}</button></div>
      {records.length ? <div className="sfa-record-list">{records.map((record) => (
        <Card className="sfa-red-record" key={record.id}>
          <div className="sfa-record-head"><span className="sfa-action-icon"><Gift size={19} /></span><span><strong>{record.mode}</strong><small>{record.time}</small></span><Badge tone={record.status === '领取中' ? 'warning' : 'success'}>{record.status}</Badge></div>
          <SummaryGrid items={tab === 'send' ? [{ label: '总额', value: `${record.amount} ${record.currency}` }, { label: '已领', value: `${record.claimed}/${record.count}个` }, { label: '剩余', value: `${record.remaining} ${record.currency}` }] : [{ label: '领取金额', value: `${record.amount} ${record.currency}` }, { label: '领取条件', value: record.condition }]} />
          <div className="sfa-inline-actions">
            {record.link ? <GhostButton onClick={() => actions.copy(record.link, '红包链接')}>{record.status === '领取中' ? '继续分享' : '复制原链接'}</GhostButton> : null}
            <PrimaryButton onClick={() => actions.go(tab === 'send' ? `/pages/wallet/red_packet_detail?id=${record.id}` : `/pages/wallet/receive_red_packet?no=${record.id}`)}>详情</PrimaryButton>
          </div>
        </Card>
      ))}</div> : <EmptyState title="暂无红包记录" description="当前筛选条件下没有记录" />}
      <SelectSheet open={currencySheet} title="选择币种" options={['全部币种', 'USDT', 'TRX', 'CNY']} value={currency} onClose={() => setCurrencySheet(false)} onSelect={(value) => { setCurrency(value); setCurrencySheet(false) }} />
      <SelectSheet open={rangeSheet} title="选择时间" options={['全部时间', '近7天', '近30天']} value={range} onClose={() => setRangeSheet(false)} onSelect={(value) => { setRange(value); setRangeSheet(false); actions.notify(`已筛选${value}`) }} />
    </PageShell>
  )
}

export function RedPacketDetailPage(props) {
  const actions = useSfaActions(props)
  const query = new URLSearchParams(String(props?.path || '').split('?')[1] || '')
  const requestedId = query.get('id')
  const storedRecord = props?.record || RED_PACKET_RECORDS.find((item) => item.type === 'send' && (!requestedId || item.id === requestedId))
  const generatedAmount = numberValue(query.get('amount'))
  const record = storedRecord || (requestedId && generatedAmount > 0 ? {
    id: requestedId,
    type: 'send',
    mode: query.get('mode') || '拼手气红包',
    currency: query.get('currency') || 'USDT',
    amount: generatedAmount,
    count: Math.max(1, Math.floor(numberValue(query.get('count')))),
    claimed: 0,
    remaining: generatedAmount,
    status: '领取中',
    condition: query.get('condition') || '无限制',
    time: '2026-08-27 12:00',
    link: `https://h5.hash-demo.test/receive?no=${encodeURIComponent(requestedId)}`,
  } : null)
  const [share, setShare] = useState(false)

  if (!record) return <PageShell title="发出红包详情" onBack={actions.back} message={actions.localMessage}><EmptyState title="红包详情加载失败" action="重新加载" onAction={() => actions.notify('已重新加载')} /></PageShell>

  return (
    <PageShell title="发出红包详情" onBack={actions.back} message={actions.localMessage} bottom={<div className="sfa-dual-actions"><GhostButton onClick={() => actions.go('/pages/wallet/red_packet')}>再发一个红包</GhostButton><PrimaryButton onClick={() => setShare(true)}>分享链接</PrimaryButton></div>}>
      <div className="sfa-red-hero"><Gift size={35} /><small>{record.mode}</small><strong>{record.amount.toFixed(2)} {record.currency}</strong><Badge tone="warning">{record.status}</Badge></div>
      <Card>
        <SummaryGrid items={[{ label: '已领取', value: `${record.claimed}个` }, { label: '剩余金额', value: `${record.remaining} ${record.currency}` }, { label: '退款金额', value: '0.00' }, { label: '过期时间', value: '长期有效' }]} />
        <CopyLine label="红包编号" value={record.id} onCopy={() => actions.copy(record.id, '红包编号')} />
        <CopyLine label="红包分享链接" value={record.link} onCopy={() => actions.copy(record.link, '红包链接')} />
      </Card>
      <Card><SectionTitle>领取条件</SectionTitle><p>{record.condition}</p><Hint>当前红包可继续领取，分享链接会绑定现有邀请关系。</Hint></Card>
      <button className="sfa-service-link" type="button" onClick={() => actions.go('/pages/wallet/red_packet_records')}>查看红包记录</button>
      <Modal open={share} title="分享红包" onClose={() => setShare(false)} footer={<PrimaryButton onClick={() => { setShare(false); actions.copy(record.link, '红包链接') }}>复制链接</PrimaryButton>}>
        <div className="sfa-red-packet-art"><Share2 size={34} /><span>领取我的哈希红包</span></div>
        <CopyLine label="分享链接" value={record.link} onCopy={() => actions.copy(record.link, '红包链接')} />
        <div className="sfa-inline-actions"><GhostButton onClick={() => actions.notify('系统分享已打开（演示）')}>系统分享</GhostButton><GhostButton onClick={() => actions.notify('Telegram 分享已打开（演示）')}>分享 Telegram</GhostButton></div>
      </Modal>
    </PageShell>
  )
}

export function ReceiveRedPacketPage(props) {
  const actions = useSfaActions(props)
  const [status, setStatus] = useState('可领取')
  const [success, setSuccess] = useState(false)
  const [records, setRecords] = useState([{ user: '哈***8', amount: '6.28 USDT', time: '12:08' }, { user: 'G6***1', amount: '3.16 USDT', time: '11:52' }])
  const available = status === '可领取'

  const receive = () => {
    if (!available) return actions.notify('请查看红包状态')
    setSuccess(true)
    setStatus('已领取')
    setRecords((current) => [{ user: 'G6***88', amount: '8.88 USDT', time: '刚刚' }, ...current])
  }

  return (
    <PageShell title="领取红包" onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton disabled={!available} onClick={receive}>{available ? '立即领取' : status}</PrimaryButton>}>
      <div className="sfa-receive-hero"><Sparkles size={28} /><h2>哈希红包</h2><p>打开链接，领取你的专属红包</p><strong>88.00 <small>USDT</small></strong><Badge tone={available ? 'success' : 'neutral'}>{status}</Badge></div>
      <Card>
        <SummaryGrid items={[{ label: '红包个数', value: '8个' }, { label: '已领取', value: `${records.length}个` }, { label: '剩余个数', value: `${Math.max(0, 8 - records.length)}个` }, { label: '领取方式', value: '仅会员领取' }]} />
        <CopyLine label="红包编号" value="RP202608270001" onCopy={() => actions.copy('RP202608270001', '红包编号')} />
      </Card>
      <SectionTitle>领取记录</SectionTitle>
      <Card>{records.length ? <div className="sfa-claim-list">{records.map((item, index) => <div key={`${item.user}-${index}`}><span className="sfa-action-icon"><Users size={17} /></span><span><strong>{item.user}</strong><small>{item.time}</small></span><b>{item.amount}</b></div>)}</div> : <EmptyState title="暂无领取记录" />}</Card>
      <Modal open={success} title="领取成功" onClose={() => setSuccess(false)} footer={<div className="sfa-modal-actions"><GhostButton onClick={() => setSuccess(false)}>开心收下</GhostButton><PrimaryButton onClick={() => { setSuccess(false); actions.go('/pages/user/user') }}>查看红包</PrimaryButton></div>}>
        <div className="sfa-red-packet-art"><Gift size={38} /><span>8.88 USDT</span></div>
        <p className="sfa-center-copy">红包已存入账户余额</p>
      </Modal>
    </PageShell>
  )
}
