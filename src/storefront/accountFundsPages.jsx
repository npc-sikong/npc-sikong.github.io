import { useMemo, useState } from 'react'
import { CircleDollarSign, Copy, ExternalLink, Landmark, WalletCards, Zap } from 'lucide-react'
import {
  ACCOUNT_CURRENCIES,
  DEPOSIT_CHANNELS,
  ENERGY_PACKAGES,
  FIXED_WALLET_RECORDS,
  WITHDRAW_METHODS,
} from './accountData'
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
  QrPlaceholder,
  SectionTitle,
  Segmented,
  SelectField,
  SelectSheet,
  SummaryGrid,
  Toggle,
  useSfaActions,
} from './accountUi'

const currencyOptions = ACCOUNT_CURRENCIES.map((item) => ({ value: item.code, label: item.name, note: `可用 ${item.balance.toFixed(2)}` }))

function currencyByCode(code) {
  return ACCOUNT_CURRENCIES.find((item) => item.code === code) || ACCOUNT_CURRENCIES[0]
}

function amountValue(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

export function DepositPage(props) {
  const actions = useSfaActions(props)
  const [currency, setCurrency] = useState('USDT')
  const [amount, setAmount] = useState('')
  const [tutorial, setTutorial] = useState(false)
  const [channelSheet, setChannelSheet] = useState(false)
  const [loading, setLoading] = useState(false)
  const channels = DEPOSIT_CHANNELS.filter((item) => item.currency === currency)
  const [channelId, setChannelId] = useState('trc20')
  const channel = channels.find((item) => item.id === channelId) || channels[0]

  const changeCurrency = (next) => {
    setCurrency(next)
    const nextChannel = DEPOSIT_CHANNELS.find((item) => item.currency === next)
    setChannelId(nextChannel?.id || '')
    setAmount('')
  }

  const submit = () => {
    const numeric = amountValue(amount)
    if (!channel) return actions.notify('暂无可用充值通道')
    if (currency !== 'CNY') return actions.notify('请复制地址并在去中心化钱包完成转账')
    if (numeric < channel.min) return actions.notify(`最低金额${channel.min}`)
    if (numeric > channel.max) return actions.notify(`最高金额${channel.max}`)
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setAmount('')
      actions.notify('订单已创建，请等待到账', 'success')
    }, 650)
  }

  return (
    <PageShell
      title="充值"
      onBack={actions.back}
      message={actions.localMessage}
      right={<button className="sfa-header-link" type="button" onClick={() => actions.go('/pages/records/account_details?tab=deposit')}>充值记录</button>}
      bottom={<PrimaryButton loading={loading} onClick={submit}>{currency === 'CNY' ? '立即充值' : '我已完成转账'}</PrimaryButton>}
    >
      <Card className="sfa-balance-card">
        <span>账户余额</span>
        <strong>{currencyByCode(currency).balance.toFixed(2)} <small>{currency}</small></strong>
      </Card>
      <SectionTitle>选择币种</SectionTitle>
      <CurrencyTabs currencies={ACCOUNT_CURRENCIES} value={currency} onChange={changeCurrency} />
      <SectionTitle>支付方式</SectionTitle>
      <Card>
        <SelectField label="当前通道" value={channel?.label} placeholder="暂无可用充值通道" onClick={() => setChannelSheet(true)} />
        {currency === 'CNY' ? (
          <>
            <Field label="支付金额" value={amount} onChange={setAmount} type="number" placeholder={`${channel?.min || 0} - ${channel?.max || 0}`} suffix="CNY" />
            <Hint>请选择支付方式并输入金额，提交后按演示提示完成支付。</Hint>
          </>
        ) : channel ? (
          <div className="sfa-deposit-address">
            <QrPlaceholder label={`${channel.protocol}充值`} />
            <CopyLine label={`${currency}充值地址`} value={channel.address} onCopy={() => actions.copy(channel.address, '充值地址')} />
            <div className="sfa-inline-actions">
              <GhostButton onClick={() => actions.notify('二维码已保存（演示）', 'success')}>保存二维码</GhostButton>
              <GhostButton onClick={() => setTutorial(true)}>查看教程</GhostButton>
            </div>
          </div>
        ) : <EmptyState title="暂无充值地址" />}
      </Card>
      <Hint tone="warning">此地址只接受 {channel?.protocol || '当前'} 协议资产，使用其他货币或协议会造成资产损失。</Hint>
      <button type="button" className="sfa-service-link" onClick={() => actions.go('/pages/service/index')}>如需帮助，请联系客服</button>

      <SelectSheet
        open={channelSheet}
        title="选择支付方式"
        options={channels.map((item) => ({ value: item.id, label: item.label, note: `${item.min} - ${item.max} ${item.currency}` }))}
        value={channel?.id}
        onClose={() => setChannelSheet(false)}
        onSelect={(value) => { setChannelId(value); setChannelSheet(false) }}
        empty="暂无可用充值通道"
      />
      <Modal open={tutorial} title={`${currency}充值教程`} onClose={() => setTutorial(false)} footer={<PrimaryButton onClick={() => setTutorial(false)}>我知道了</PrimaryButton>}>
        <ol className="sfa-steps">
          <li><b>1</b><span>{currency === 'CNY' ? '输入金额并创建充值订单。' : '复制充值地址或保存二维码。'}</span></li>
          <li><b>2</b><span>{currency === 'CNY' ? '按页面演示提示选择支付方式。' : `在钱包中选择 ${channel?.protocol} 网络转账。`}</span></li>
          <li><b>3</b><span>本原型不会发起真实支付，操作后仅展示本地反馈。</span></li>
        </ol>
      </Modal>
    </PageShell>
  )
}

export function WithdrawPage(props) {
  const actions = useSfaActions(props)
  const [source, setSource] = useState('balance')
  const [methodId, setMethodId] = useState('trc20')
  const [methodSheet, setMethodSheet] = useState(false)
  const [accountSheet, setAccountSheet] = useState(false)
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [google, setGoogle] = useState(false)
  const [success, setSuccess] = useState(false)
  const method = WITHDRAW_METHODS.find((item) => item.id === methodId) || WITHDRAW_METHODS[0]
  const currency = currencyByCode(method.currency)
  const balance = source === 'commission' ? currency.commission : currency.balance

  const requestWithdraw = () => {
    const numeric = amountValue(amount)
    if (numeric < method.min) return actions.notify(`最低提现${method.min}`)
    if (numeric > balance) return actions.notify('可提现余额不足')
    if (!/^\d{6}$/.test(password)) return actions.notify('请输入6位资金密码')
    setGoogle(true)
  }

  const finish = () => {
    setGoogle(false)
    setSuccess(true)
    setAmount('')
    setPassword('')
  }

  return (
    <PageShell
      title="提现"
      onBack={actions.back}
      message={actions.localMessage}
      right={<button className="sfa-header-link" type="button" onClick={() => actions.go('/pages/records/account_details?tab=withdraw')}>提现记录</button>}
      bottom={<PrimaryButton onClick={requestWithdraw}>确认提现</PrimaryButton>}
    >
      <Segmented items={[{ value: 'balance', label: '普通余额' }, { value: 'commission', label: '佣金余额' }]} value={source} onChange={setSource} />
      <Card>
        <SummaryGrid items={[{ label: '可提现余额', value: `${balance.toFixed(2)} ${method.currency}` }, { label: '手续费', value: method.fee }]} />
        <SelectField label="提现方式" value={method.label} onClick={() => setMethodSheet(true)} />
        <SelectField label="收款账户" value={method.account} onClick={() => setAccountSheet(true)} />
        <Field label="提现金额" value={amount} onChange={setAmount} type="number" suffix={method.currency} right={<button type="button" onClick={() => setAmount(String(balance))}>全部提现</button>} />
        <PasswordField label="资金密码" value={password} onChange={(value) => setPassword(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位资金密码" right={<button type="button" onClick={() => actions.go('/pages/security/recharge-password?recover=1')}>忘记密码?</button>} />
      </Card>
      <Hint>{source === 'commission' ? '佣金提现无需完成投注流水，提交后按正常审核流程处理。' : '当前没有未完成的提现流水要求。'}</Hint>
      <SelectSheet open={methodSheet} title="选择提现方式" options={WITHDRAW_METHODS.map((item) => ({ value: item.id, label: item.label, note: `最低 ${item.min} ${item.currency}` }))} value={methodId} onClose={() => setMethodSheet(false)} onSelect={(value) => { setMethodId(value); setAmount(''); setMethodSheet(false) }} />
      <SelectSheet open={accountSheet} title="选择收款账户" options={[{ value: method.account, label: method.account, note: `${method.label} · 已绑定` }]} value={method.account} onClose={() => setAccountSheet(false)} onSelect={() => setAccountSheet(false)} />
      <GoogleVerificationModal open={google} purpose="确认提现" onClose={() => setGoogle(false)} onVerified={finish} />
      <Modal open={success} title="提现申请已提交" onClose={() => setSuccess(false)} footer={<PrimaryButton onClick={() => setSuccess(false)}>关闭</PrimaryButton>}>
        <div className="sfa-success-mark"><Checkmark /></div>
        <CopyLine label="订单号" value="W2026082713560088" onCopy={() => actions.copy('W2026082713560088', '订单号')} />
        <CopyLine label="状态" value="审核中" onCopy={() => actions.notify('当前状态：审核中')} />
      </Modal>
    </PageShell>
  )
}

function Checkmark() {
  return <span>✓</span>
}

export function CommissionTransferPage(props) {
  const actions = useSfaActions(props)
  const [currency, setCurrency] = useState('USDT')
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [google, setGoogle] = useState(false)
  const current = currencyByCode(currency)

  const submit = () => {
    const numeric = amountValue(amount)
    if (numeric <= 0) return actions.notify('请输入转入数量')
    if (numeric > current.commission) return actions.notify('可转佣金余额不足')
    if (!/^\d{6}$/.test(password)) return actions.notify('请输入6位资金密码')
    setGoogle(true)
  }

  return (
    <PageShell title="佣金转余额" onBack={actions.back} message={actions.localMessage} right={<button className="sfa-header-link" type="button" onClick={() => actions.go('/pages/records/account_details?tab=transfer')}>转入记录</button>} bottom={<PrimaryButton onClick={submit}>转账</PrimaryButton>}>
      <SectionTitle>选择币种</SectionTitle>
      <CurrencyTabs currencies={ACCOUNT_CURRENCIES} value={currency} onChange={(next) => { setCurrency(next); setAmount('') }} balanceKey="commission" />
      <Card>
        <SummaryGrid items={[{ label: `当前可转游戏${currency}余额`, value: current.commission.toFixed(2) }, { label: '转入后需完成流水', value: `${amountValue(amount).toFixed(2)} ${currency}` }]} />
        <Field label="转入数量" value={amount} onChange={setAmount} type="number" suffix={currency} right={<button type="button" onClick={() => setAmount(String(current.commission))}>全部转为游戏余额</button>} />
        <PasswordField label="资金密码" value={password} onChange={(value) => setPassword(value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入资金密码" right={<button type="button" onClick={() => actions.go('/pages/security/recharge-password?recover=1')}>忘记密码？</button>} />
      </Card>
      <Hint tone="warning">转入普通余额后，本次金额需完成 1 倍有效流水方可提取。</Hint>
      <GoogleVerificationModal open={google} purpose="佣金转余额" onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); setAmount(''); setPassword(''); actions.notify('转账成功，流水要求已生成', 'success') }} />
    </PageShell>
  )
}

export function ExchangePage(props) {
  const actions = useSfaActions(props)
  const [sourceWallet, setSourceWallet] = useState('balance')
  const [from, setFrom] = useState('USDT')
  const [to, setTo] = useState('TRX')
  const [selecting, setSelecting] = useState('')
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [google, setGoogle] = useState(false)
  const [success, setSuccess] = useState(false)
  const source = currencyByCode(from)
  const rate = from === to ? 1 : from === 'USDT' && to === 'TRX' ? 7.352 : from === 'TRX' && to === 'USDT' ? 0.136 : from === 'CNY' ? 0.138 : to === 'CNY' ? 7.24 : 1
  const receive = amountValue(amount) * rate
  const available = sourceWallet === 'commission' ? source.commission : source.balance

  const submit = () => {
    if (from === to) return actions.notify('请选择不同的兑换币种')
    if (amountValue(amount) <= 0) return actions.notify('请输入兑换金额')
    if (amountValue(amount) > available) return actions.notify('当前钱包余额不足')
    if (!/^\d{6}$/.test(password)) return actions.notify('请输入6位资金密码')
    setGoogle(true)
  }

  const chooseCurrency = (value) => {
    if (selecting === 'from') setFrom(value)
    else setTo(value)
    setSelecting('')
  }

  return (
    <PageShell title="货币兑换" onBack={actions.back} message={actions.localMessage} right={<button className="sfa-header-link" type="button" onClick={() => actions.go('/pages/records/account_details?tab=exchange')}>兑换记录</button>} bottom={<PrimaryButton onClick={submit}>确定兑换</PrimaryButton>}>
      <Segmented items={[{ value: 'balance', label: '余额兑换' }, { value: 'commission', label: '佣金兑换' }]} value={sourceWallet} onChange={setSourceWallet} />
      <Card className="sfa-exchange-card">
        <SelectField label="选择使用币种" value={from} onClick={() => setSelecting('from')} />
        <Field label="兑换金额" value={amount} onChange={setAmount} type="number" suffix={from} right={`可用 ${available.toFixed(2)}`} />
        <div className="sfa-rate-divider"><span>实时汇率</span><b>1 {from} = {rate.toFixed(3)} {to}</b></div>
        <SelectField label="选择兑换币种" value={to} onClick={() => setSelecting('to')} />
        <div className="sfa-receive-preview"><small>预计到账</small><strong>{receive.toFixed(4)} {to}</strong></div>
        <PasswordField label="资金密码" value={password} onChange={(value) => setPassword(value.replace(/\D/g, '').slice(0, 6))} />
      </Card>
      <Hint>实时汇率浮动，以兑换时实时汇率为准。</Hint>
      <SelectSheet open={Boolean(selecting)} title={selecting === 'from' ? '选择使用币种' : '选择兑换币种'} options={currencyOptions} value={selecting === 'from' ? from : to} onClose={() => setSelecting('')} onSelect={chooseCurrency} />
      <GoogleVerificationModal open={google} purpose="货币兑换" onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); setSuccess(true); setPassword('') }} />
      <Modal open={success} title="兑换成功" onClose={() => setSuccess(false)} footer={<PrimaryButton onClick={() => { setSuccess(false); setAmount('') }}>完成</PrimaryButton>}>
        <div className="sfa-success-mark"><Checkmark /></div>
        <SummaryGrid items={[{ label: '实际扣款', value: `${amountValue(amount).toFixed(2)} ${from}` }, { label: '实际到账', value: `${receive.toFixed(4)} ${to}` }]} />
        {sourceWallet === 'commission' ? <Hint>未完成流水已按基准汇率迁移，完成后可提取普通余额。</Hint> : null}
      </Modal>
    </PageShell>
  )
}

export function FixedWalletPage(props) {
  const actions = useSfaActions(props)
  const [direction, setDirection] = useState('deposit')
  const [currency, setCurrency] = useState('USDT')
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [google, setGoogle] = useState(false)
  const [showRecords, setShowRecords] = useState(false)
  const current = currencyByCode(currency)
  const target = currency === 'TRX' ? 'USDT' : 'TRX'
  const rate = currency === 'TRX' ? 0.136 : 7.352
  const receive = amountValue(amount) * rate

  const request = () => {
    if (amountValue(amount) <= 0) return actions.notify('请输入有效金额')
    if (amountValue(amount) < 10) return actions.notify('存取金额不能低于最小限额')
    if (!/^\d{6}$/.test(password)) return actions.notify('请输入6位资金密码')
    setConfirm(true)
  }

  return (
    <PageShell title="固率钱包" onBack={actions.back} message={actions.localMessage} right={<button className="sfa-header-link" type="button" onClick={() => setShowRecords(true)}>记录</button>} bottom={<PrimaryButton onClick={request}>{direction === 'deposit' ? '存入' : '取出'}</PrimaryButton>}>
      <Segmented items={[{ value: 'deposit', label: '存入' }, { value: 'withdraw', label: '取出' }]} value={direction} onChange={setDirection} />
      <Card>
        <CurrencyTabs currencies={ACCOUNT_CURRENCIES.slice(0, 2)} value={currency} onChange={setCurrency} />
        <SummaryGrid items={[{ label: '可用余额', value: `${current.balance.toFixed(2)} ${currency}` }, { label: '固定汇率', value: `1 ${currency} = ${rate} ${target}` }]} />
        <Field label={direction === 'deposit' ? '存入金额' : '取出金额'} value={amount} onChange={setAmount} type="number" suffix={currency} />
        <div className="sfa-receive-preview"><small>预计到账</small><strong>{receive.toFixed(4)} {target}</strong></div>
        <PasswordField label="资金密码" value={password} onChange={(value) => setPassword(value.replace(/\D/g, '').slice(0, 6))} />
      </Card>
      <Hint tone="warning">成交后无法无损原路退回，请确认实际扣款与到账金额。</Hint>
      <ConfirmModal open={confirm} title={direction === 'deposit' ? '确认存入' : '确认取出'} content={`实际扣款 ${amountValue(amount).toFixed(2)} ${currency}，到账 ${receive.toFixed(4)} ${target}，成交后无法无损原路退回。`} onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); setGoogle(true) }} />
      <GoogleVerificationModal open={google} purpose={direction === 'deposit' ? '存入固率钱包' : '从固率钱包取出'} onClose={() => setGoogle(false)} onVerified={() => { setGoogle(false); setAmount(''); setPassword(''); actions.notify(direction === 'deposit' ? '存入成功' : '取出成功', 'success') }} />
      <Modal open={showRecords} title="固率钱包记录" onClose={() => setShowRecords(false)} footer={<PrimaryButton onClick={() => setShowRecords(false)}>关闭</PrimaryButton>}>
        <div className="sfa-record-list">{FIXED_WALLET_RECORDS.map((record) => <div className="sfa-record-card" key={record.id}><div><strong>{record.direction}</strong><Badge>{record.time}</Badge></div><p>{record.source} → {record.target}</p><small>{record.rate}</small><code>{record.id}</code></div>)}</div>
      </Modal>
    </PageShell>
  )
}

export function EnergyRentalPage(props) {
  const actions = useSfaActions(props)
  const [product, setProduct] = useState('energy')
  const [payment, setPayment] = useState('balance')
  const [packageValue, setPackageValue] = useState('2笔')
  const [address, setAddress] = useState('')
  const [batch, setBatch] = useState(false)
  const [monitor, setMonitor] = useState(false)
  const [threshold, setThreshold] = useState('1')
  const [days, setDays] = useState('1')
  const [order, setOrder] = useState(false)
  const packageOptions = product === 'bandwidth' ? ENERGY_PACKAGES.bandwidth : ENERGY_PACKAGES.energy
  const price = product === 'activate' ? (batch ? Math.max(1, address.split('\n').filter(Boolean).length) * 1.2 : 1.2) : packageOptions.indexOf(packageValue) * 3.2 + (product === 'energy' ? 6.4 : 2.8)

  const selectProduct = (value) => {
    setProduct(value)
    setPackageValue(value === 'bandwidth' ? ENERGY_PACKAGES.bandwidth[0] : ENERGY_PACKAGES.energy[0])
  }

  const submit = () => {
    if (!address.trim()) return actions.notify(product === 'activate' ? '请输入激活地址' : '请输入接收地址')
    if (monitor && !threshold) return actions.notify('请输入「剩余可转账笔数少于」阈值')
    setOrder(true)
  }

  return (
    <PageShell title="快速租赁" onBack={actions.back} message={actions.localMessage} bottom={<PrimaryButton onClick={submit}>立即下单</PrimaryButton>}>
      <Segmented items={[{ value: 'energy', label: '购买能量' }, { value: 'bandwidth', label: '购买宽带' }, { value: 'activate', label: '激活地址' }]} value={product} onChange={selectProduct} compact />
      {product !== 'activate' ? (
        <>
          <SectionTitle>购买方式</SectionTitle>
          <PillTabs items={[{ value: 'balance', label: '余额购买' }, { value: 'smart', label: '智能购买' }, { value: 'transfer', label: '转账购买' }]} value={payment} onChange={setPayment} />
          {payment === 'smart' ? <Card><Toggle checked={monitor} onChange={setMonitor} label="监控地址自动补充" />{monitor ? <Field label="剩余可转账笔数少于" value={threshold} onChange={setThreshold} type="number" suffix="笔" /> : null}</Card> : null}
          <SectionTitle>{product === 'energy' ? '转账笔数' : '带宽数量'}</SectionTitle>
          <PillTabs items={packageOptions} value={packageValue} onChange={setPackageValue} />
          <Card>
            <Segmented items={[{ value: false, label: '单个购买' }, { value: true, label: '批量购买' }]} value={batch} onChange={setBatch} compact />
            <Field textarea={batch} label={batch ? '接收地址（批量）' : '接收地址'} value={address} onChange={setAddress} placeholder={batch ? '请输入多个地址，每行一个' : '请输入TRC20地址'} />
            {product === 'energy' ? <Field label="租用时间" value={days} onChange={setDays} type="number" suffix="天" /> : null}
          </Card>
        </>
      ) : (
        <Card>
          <Segmented items={[{ value: false, label: '单个激活' }, { value: true, label: '批量激活' }]} value={batch} onChange={setBatch} compact />
          <Field textarea={batch} label={batch ? '接收地址（批量）' : '接收地址'} value={address} onChange={setAddress} placeholder={batch ? '请输入多个地址，每行一个' : '请输入需要激活的地址'} />
        </Card>
      )}
      {payment === 'transfer' && product !== 'activate' ? <Card><SectionTitle>向下方地址转账</SectionTitle><CopyLine label="平台地址" value="TG6EnergyDemoAddress001" onCopy={() => actions.copy('TG6EnergyDemoAddress001', '平台地址')} /><button className="sfa-chain-link" type="button" onClick={() => actions.notify('已打开 Tronscan 演示链接')}><ExternalLink size={16} />在 Tronscan 查看该地址（链上）</button></Card> : null}
      <SummaryGrid items={[{ label: '支付金额', value: `${price.toFixed(2)} USDT` }, { label: '选择支付方式', value: payment === 'balance' ? '余额购买' : payment === 'smart' ? '智能购买' : '转账购买' }]} />
      <Hint tone="warning">请确认接收能量或带宽的地址已经被激活。本原型不会发起真实链上订单。</Hint>
      <Modal open={order} title="订单信息" onClose={() => setOrder(false)} footer={<PrimaryButton onClick={() => { setOrder(false); setAddress(''); actions.notify('下单成功（本地演示）', 'success') }}>确定</PrimaryButton>}>
        <div className="sfa-success-mark"><Zap size={30} /></div>
        <SummaryGrid items={[{ label: '服务', value: product === 'energy' ? `能量 ${packageValue}` : product === 'bandwidth' ? `带宽 ${packageValue}` : '激活地址' }, { label: '租用时间', value: product === 'energy' ? `${days}天` : '即时' }, { label: '支付金额', value: `${price.toFixed(2)} USDT` }]} />
        <Hint>订单仅保存在当前页面状态，刷新后会恢复初始演示数据。</Hint>
      </Modal>
    </PageShell>
  )
}

export function FixedWalletRecordsPage(props) {
  const actions = useSfaActions(props)
  const [filter, setFilter] = useState('全部')
  const records = FIXED_WALLET_RECORDS.filter((item) => filter === '全部' || item.direction.includes(filter))
  return (
    <PageShell title="固率钱包记录" onBack={actions.back} message={actions.localMessage}>
      <PillTabs items={['全部', '存入', '取出']} value={filter} onChange={setFilter} />
      {records.length ? <div className="sfa-record-list">{records.map((record) => <Card className="sfa-record-card" key={record.id} onClick={() => actions.notify(`订单号：${record.id}`)}><div><span><strong>{record.direction}</strong><small>{record.time}</small></span><Badge tone="success">成功</Badge></div><p>{record.source} → {record.target}</p><small>{record.rate}</small><code>{record.id}</code></Card>)}</div> : <EmptyState title="暂无记录" />}
      <PrimaryButton tone="light" onClick={() => actions.notify('没有更多了')}>加载更多</PrimaryButton>
    </PageShell>
  )
}

export function UserPage(props) {
  const actions = useSfaActions(props)
  const [currency, setCurrency] = useState('USDT')
  const current = currencyByCode(currency)
  const menus = [
    ['能量租赁', '/pages/energy/rental', <Zap size={19} />],
    ['佣金转余额', '/pages/wallet/commission_transfer', <CircleDollarSign size={19} />],
    ['兑换中心', '/pages/wallet/exchange', <WalletCards size={19} />],
    ['分享赚钱', '/pages/agent/index', <ExternalLink size={19} />],
    ['账户设置', '/pages/security/center', <Landmark size={19} />],
    ['投注记录', '/pages/records/bet_record', <Copy size={19} />],
  ]
  return (
    <PageShell title="用户中心" onBack={actions.back} message={actions.localMessage} right={<button className="sfa-header-link" type="button" onClick={() => actions.notify('刷新成功', 'success')}>刷新</button>}>
      <Card className="sfa-user-card"><div className="sfa-user-avatar">G6</div><div><strong>G6DEMO88</strong><small>TRC20地址 · 已绑定</small></div><Badge tone="success">已登录</Badge></Card>
      <CurrencyTabs currencies={ACCOUNT_CURRENCIES} value={currency} onChange={setCurrency} />
      <Card><SummaryGrid items={[{ label: '钱包余额', value: `${current.balance.toFixed(2)} ${currency}` }, { label: '佣金余额', value: `${current.commission.toFixed(2)} ${currency}` }]} /><div className="sfa-inline-actions"><PrimaryButton onClick={() => actions.go('/pages/deposit/index')}>充值</PrimaryButton><GhostButton onClick={() => actions.go('/pages/wallet/withdraw')}>提现</GhostButton></div></Card>
      <div className="sfa-wallet-shortcuts"><Card onClick={() => actions.go('/pages/user/user')}><WalletCards size={23} /><strong>余额钱包</strong></Card><Card onClick={() => actions.go('/pages/wallet/fixed_rate_wallet')}><CircleDollarSign size={23} /><strong>固率钱包</strong></Card></div>
      <Card className="sfa-action-list">{menus.map(([title, route, icon]) => <button className="sfa-action-row" type="button" key={title} onClick={() => actions.go(route)}><span className="sfa-action-icon">{icon}</span><span className="sfa-action-copy"><strong>{title}</strong></span><span>›</span></button>)}</Card>
      <button className="sfa-service-link" type="button" onClick={() => actions.go('/pages/service/index')}>联系客服</button>
    </PageShell>
  )
}
