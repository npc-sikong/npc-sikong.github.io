import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  Copy,
  Download,
  Eye,
  Gamepad2,
  Landmark,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Users,
  WalletCards,
  X,
} from 'lucide-react'
import './wallet-reconciliation.css'

const TABS = [
  { key: 'overview', label: '资金总览', icon: WalletCards },
  { key: 'member', label: '用户钱包', icon: Users },
  { key: 'game', label: '游戏钱包', icon: Gamepad2 },
  { key: 'collection', label: '归集钱包', icon: Landmark },
  { key: 'payout', label: '取款（代付）钱包', icon: Send },
]

const GAME_NAMES = [
  '1分彩单双',
  '尾数单双',
  '5分彩单双',
  '3分彩单双',
  '尾数大小',
  '30秒哈希',
  '五张牛牛',
  '牛牛',
  '哈希一分彩',
  '哈希三分彩',
  'Fortune Tiger',
  'God of War',
]

const MEMBERS = [
  { memberId: '133', username: 'evan777', suffix: 'Dfa8kQ2pL6vWn9xR3mJ7cB5tN4sY1uH' },
  { memberId: '291', username: 'evanmm88', suffix: 'Aq7nZ4xK2mV9pL6sR8cF3wB5yH1tJd' },
  { memberId: '288', username: 'Appleee', suffix: 'Vh5cM8qR2zN6sK9wX3bJ7pL1tF4yAd' },
  { memberId: '246', username: 'hashplayer', suffix: 'Qm4xB8sT1nK6vR9pL3yH7cW2zF5jAd' },
  { memberId: '205', username: 'test888', suffix: 'Lk7vN2pC9xR5mT1wB8sH4qY6zF3jAd' },
  { memberId: '187', username: 'sunny66', suffix: 'Jp9mX3tK7vN1sR5cB8wH2qL6zF4yAd' },
  { memberId: '166', username: 'g6user', suffix: 'Wn3cL8pR5xT2mK9vB6sH1qY7zF4jAd' },
  { memberId: '152', username: 'trondemo', suffix: 'Rk6vM2pX9sN4tB8cL1wH5qY7zF3jAd' },
]

const MEMBER_WALLETS = MEMBERS.map((member, index) => {
  const chainUSDT = index === 0 ? 100 : Number((24.5 + index * 17.37).toFixed(2))
  const chainTRX = index === 0 ? 300 : Number((188 + index * 93.6).toFixed(2))
  const usdtDifference = index === 3 ? 0.38 : index === 6 ? -1.2 : 0
  const trxDifference = index === 4 ? 2.4 : 0
  return {
    id: `MW-${member.memberId}`,
    type: 'member',
    name: '会员充提钱包',
    ...member,
    address: `T${member.suffix}`,
    chainUSDT,
    chainTRX,
    platformUSDT: Number((chainUSDT - usdtDifference).toFixed(2)),
    platformTRX: Number((chainTRX - trxDifference).toFixed(2)),
    usdtDifference,
    trxDifference,
    collectionStatus: index === 0 ? '待归集' : index % 3 === 0 ? '归集中' : '已归集',
    lastCollection: index === 0 ? '-' : `2026-08-28 0${4 + (index % 2)}:${String(11 + index * 4).padStart(2, '0')}:20`,
    syncedAt: `2026-08-28 05:${String(8 + index).padStart(2, '0')}:18`,
  }
})

function buildGameWallets() {
  return GAME_NAMES.flatMap((game, gameIndex) => MEMBERS.map((member, memberIndex) => {
    const serial = gameIndex * MEMBERS.length + memberIndex
    const chainUSDT = Number((8.25 + gameIndex * 5.7 + memberIndex * 2.35).toFixed(2))
    const chainTRX = Number((62 + gameIndex * 38.5 + memberIndex * 17.2).toFixed(2))
    const usdtDifference = serial % 19 === 0 ? 0.26 : serial % 31 === 0 ? -0.5 : 0
    const trxDifference = serial % 23 === 0 ? 1.4 : 0
    return {
      id: `GW-${String(gameIndex + 1).padStart(2, '0')}-${member.memberId}`,
      type: 'game',
      name: `${game} · 外盘钱包`,
      game,
      gameCode: `HASH-${String(gameIndex + 1).padStart(2, '0')}`,
      ...member,
      address: `T${String(gameIndex + 1).padStart(2, '0')}${member.suffix.slice(2)}`,
      chainUSDT,
      chainTRX,
      platformUSDT: Number((chainUSDT - usdtDifference).toFixed(2)),
      platformTRX: Number((chainTRX - trxDifference).toFixed(2)),
      usdtDifference,
      trxDifference,
      collectionStatus: serial % 7 === 0 ? '待归集' : serial % 11 === 0 ? '归集中' : '已归集',
      lastCollection: `2026-08-28 04:${String((serial * 3) % 60).padStart(2, '0')}:36`,
      syncedAt: `2026-08-28 05:${String(10 + (serial % 9)).padStart(2, '0')}:08`,
    }
  }))
}

const GAME_WALLETS = buildGameWallets()

const COLLECTION_WALLETS = [
  {
    id: 'CW-001', type: 'collection', name: '归集钱包1', source: '会员充提钱包', address: 'TXCGJPhRwA6PLKNDWZum2qdc5i7JY2t5iY',
    chainUSDT: 186420.35, chainTRX: 928560.8, platformUSDT: 186420.35, platformTRX: 928560.8,
    usdtDifference: 0, trxDifference: 0, collectionStatus: '正常', lastCollection: '2026-08-28 05:16:42', syncedAt: '2026-08-28 05:17:08',
  },
  {
    id: 'CW-002', type: 'collection', name: '归集钱包2', source: '12个游戏外盘钱包', address: 'TUJf5xPxfxKA1zTDqidj2BPFfA272DBHx2',
    chainUSDT: 96382.68, chainTRX: 510280.4, platformUSDT: 96382.18, platformTRX: 510280.4,
    usdtDifference: 0.5, trxDifference: 0, collectionStatus: '正常', lastCollection: '2026-08-28 05:13:26', syncedAt: '2026-08-28 05:17:10',
  },
  {
    id: 'CW-003', type: 'collection', name: '冷备归集钱包', source: '人工转入', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    chainUSDT: 580000, chainTRX: 1380000, platformUSDT: 580000, platformTRX: 1380000,
    usdtDifference: 0, trxDifference: 0, collectionStatus: '正常', lastCollection: '2026-08-27 23:30:00', syncedAt: '2026-08-28 05:17:12',
  },
]

const PAYOUT_WALLETS = [
  {
    id: 'PW-001', type: 'payout', name: 'USDT代付热钱包', source: '会员提现', address: 'TV1sDKejowhLrUEkEBccVGqNs96txfXoqT',
    chainUSDT: 85360.22, chainTRX: 32680, platformUSDT: 85360.22, platformTRX: 32680,
    usdtDifference: 0, trxDifference: 0, collectionStatus: '余额充足', lastCollection: '2026-08-28 04:50:26', syncedAt: '2026-08-28 05:17:14',
  },
  {
    id: 'PW-002', type: 'payout', name: 'TRX代付热钱包', source: '会员提现', address: 'TA7kGFG11Rxbs6xf9feEEk34MziTtzNDfa',
    chainUSDT: 12800, chainTRX: 286420.6, platformUSDT: 12800, platformTRX: 286418.6,
    usdtDifference: 0, trxDifference: 2, collectionStatus: '余额充足', lastCollection: '2026-08-28 04:46:10', syncedAt: '2026-08-28 05:17:16',
  },
  {
    id: 'PW-003', type: 'payout', name: '代付备用钱包', source: '故障切换备用', address: 'TKksYLu9soviyuvdPtcgkgdPe19orP9XsF',
    chainUSDT: 30000, chainTRX: 100000, platformUSDT: 30000, platformTRX: 100000,
    usdtDifference: 0, trxDifference: 0, collectionStatus: '备用', lastCollection: '-', syncedAt: '2026-08-28 05:17:18',
  },
]

const PAYOUT_LOCKED = { usdt: 2360, trx: 12800 }

const EMPTY_FILTERS = { keyword: '', game: '全部游戏' }
const PAGE_SIZES = [15, 30, 50]

function amount(value, currency) {
  const digits = currency === 'TRX' ? 2 : 2
  return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function sumRows(rows) {
  return rows.reduce((total, row) => ({
    chainUSDT: total.chainUSDT + Number(row.chainUSDT || 0),
    chainTRX: total.chainTRX + Number(row.chainTRX || 0),
    platformUSDT: total.platformUSDT + Number(row.platformUSDT || 0),
    platformTRX: total.platformTRX + Number(row.platformTRX || 0),
    usdtDifference: total.usdtDifference + Number(row.usdtDifference || 0),
    trxDifference: total.trxDifference + Number(row.trxDifference || 0),
  }), { chainUSDT: 0, chainTRX: 0, platformUSDT: 0, platformTRX: 0, usdtDifference: 0, trxDifference: 0 })
}

function CurrencyValues({ usdt, trx, signed = false }) {
  const line = (currency, value) => {
    const numeric = Number(value || 0)
    const className = signed ? (numeric > 0 ? 'wr-positive' : numeric < 0 ? 'wr-negative' : 'wr-zero') : ''
    return <span><em>{currency}</em><b className={className}>{signed && numeric > 0 ? '+' : ''}{amount(numeric, currency)}</b></span>
  }
  return <div className="wr-currency-values">{line('USDT', usdt)}{line('TRX', trx)}</div>
}

function CollectionBadge({ value }) {
  const warning = ['待归集', '归集中'].includes(value)
  return <span className={`wr-collection-status ${warning ? 'warning' : ''}`}>{value}</span>
}

function quoteCsv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

function activityRows(row) {
  const seed = Number(String(row.memberId || row.id).replace(/\D/g, '').slice(-3) || 17)
  const usdtAmount = Number((10 + (seed % 17) * 1.25).toFixed(2))
  const trxAmount = Number((60 + (seed % 23) * 3.2).toFixed(2))
  return [
    { id: `FL${seed}01`, type: row.type === 'payout' ? '代付出账' : '链上入账', currency: 'USDT', change: row.type === 'payout' ? -usdtAmount : usdtAmount, before: row.chainUSDT - (row.type === 'payout' ? -usdtAmount : usdtAmount), after: row.chainUSDT, status: '记账成功', time: '2026-08-28 04:58:26' },
    { id: `FL${seed}02`, type: row.type === 'collection' ? '归集入账' : '链上入账', currency: 'TRX', change: trxAmount, before: row.chainTRX - trxAmount, after: row.chainTRX, status: '记账成功', time: '2026-08-28 04:42:18' },
    { id: `FL${seed}03`, type: row.type === 'payout' ? '手续费支出' : '归集转出', currency: 'TRX', change: -Number((3.5 + seed % 9).toFixed(2)), before: row.chainTRX + 3.5 + seed % 9, after: row.chainTRX, status: '记账成功', time: '2026-08-28 03:36:09' },
  ]
}

function transferRows(row) {
  const seed = Number(String(row.memberId || row.id).replace(/\D/g, '').slice(-3) || 17)
  const isPayout = row.type === 'payout'
  const isCollectionWallet = row.type === 'collection'
  const target = isPayout ? '会员提现地址' : isCollectionWallet ? row.address : '归集主钱包'
  const source = isPayout ? row.address : isCollectionWallet ? '下级归集钱包' : row.address
  return [
    { id: `${isPayout ? 'PO' : 'CO'}20260828${seed}01`, direction: `${source} → ${target}`, currency: 'USDT', value: Number((25 + seed % 31).toFixed(2)), status: '已确认', hash: `8f0f91aa...${String(seed).padStart(4, '0')}a1`, time: '2026-08-28 04:50:26' },
    { id: `${isPayout ? 'PO' : 'CO'}20260828${seed}02`, direction: `${source} → ${target}`, currency: 'TRX', value: Number((120 + seed % 87).toFixed(2)), status: '已确认', hash: `b45aa100...${String(seed).padStart(4, '0')}c8`, time: '2026-08-28 03:36:09' },
  ]
}

function WalletDetailModal({ row, onClose, onCopy }) {
  const [tab, setTab] = useState('钱包信息')
  const recordTab = row.type === 'payout' ? '代付记录' : row.type === 'collection' ? '归集入账' : '归集记录'
  const tabs = ['钱包信息', '对账构成', '资金流水', recordTab]
  const flows = activityRows(row)
  const transfers = transferRows(row)
  return (
    <div className="wr-modal-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="wr-detail-dialog" role="dialog" aria-modal="true" aria-label={`${row.name}详情`}>
        <header><div><b>钱包对账详情</b><span>{row.id}</span></div><button type="button" onClick={onClose} aria-label="关闭"><X size={18} /></button></header>
        <nav>{tabs.map((name) => <button type="button" key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}</nav>
        <div className="wr-detail-body">
          {tab === '钱包信息' && <div className="wr-detail-grid">
            <div><span>钱包编号</span><b>{row.id}</b></div>
            <div><span>钱包名称</span><b>{row.name}</b></div>
            {row.game && <div><span>对应游戏</span><b>{row.game}</b><small>{row.gameCode}</small></div>}
            {row.memberId && <div><span>会员信息</span><b>{row.username}</b><small>用户ID：{row.memberId}</small></div>}
            {row.source && <div><span>资金来源</span><b>{row.source}</b></div>}
            <div className="wide"><span>TRON 钱包地址</span><b className="wr-full-address">{row.address}</b><button type="button" onClick={() => onCopy(row.address)}>复制地址</button></div>
            <div><span>归集 / 资金状态</span><CollectionBadge value={row.collectionStatus} /></div>
            <div><span>{row.type === 'payout' ? '最近代付时间' : row.type === 'collection' ? '最近归集入账' : '最近归集时间'}</span><b>{row.lastCollection}</b></div>
            <div><span>最近同步时间</span><b>{row.syncedAt}</b></div>
          </div>}
          {tab === '对账构成' && <div className="wr-recon-detail">
            <section><span>链上实际余额</span><CurrencyValues usdt={row.chainUSDT} trx={row.chainTRX} /></section>
            <section><span>平台记录余额</span><CurrencyValues usdt={row.platformUSDT} trx={row.platformTRX} /></section>
            <section><span>余额差值（仅计算）</span><CurrencyValues usdt={row.usdtDifference} trx={row.trxDifference} signed /></section>
            <div className="wr-formula"><b>人工对账说明</b><p>余额差值 = 链上实际余额 − 平台记录余额，仅作为财务核对时的辅助计算值。系统不设置判断规则、不自动给出核对结论，最终结果由财务人员结合资金流水、归集及代付记录人工判断。</p></div>
          </div>}
          {tab === '资金流水' && <div className="wr-detail-table-wrap"><table className="wr-detail-table"><thead><tr><th>流水号</th><th>资金类型</th><th>币种</th><th>变动金额</th><th>变动前</th><th>变动后</th><th>平台记账</th><th>发生时间</th></tr></thead><tbody>{flows.map((flow) => <tr key={flow.id}><td>{flow.id}</td><td>{flow.type}</td><td>{flow.currency}</td><td className={flow.change > 0 ? 'wr-positive' : 'wr-negative'}>{flow.change > 0 ? '+' : ''}{amount(flow.change, flow.currency)}</td><td>{amount(flow.before, flow.currency)}</td><td>{amount(flow.after, flow.currency)}</td><td><span className="wr-record-status">{flow.status}</span></td><td>{flow.time}</td></tr>)}</tbody></table><p className="wr-record-note">展示影响平台记录余额的演示资金流水，USDT 与 TRX 分币种记录。</p></div>}
          {tab === recordTab && <div className="wr-detail-table-wrap"><table className="wr-detail-table"><thead><tr><th>{row.type === 'payout' ? '代付单号' : '归集单号'}</th><th>资金方向</th><th>币种</th><th>金额</th><th>链上状态</th><th>交易哈希</th><th>完成时间</th></tr></thead><tbody>{transfers.map((record) => <tr key={record.id}><td>{record.id}</td><td>{record.direction}</td><td>{record.currency}</td><td>{amount(record.value, record.currency)}</td><td><span className="wr-record-status">{record.status}</span></td><td><button type="button" className="wr-hash-button" onClick={() => onCopy(record.hash, '交易哈希已复制')}>{record.hash}<Copy size={12} /></button></td><td>{record.time}</td></tr>)}</tbody></table><p className="wr-record-note">{row.type === 'payout' ? '代付记录只展示当前取款钱包的演示出款和手续费扣除，不发起真实转账。' : row.type === 'collection' ? '归集入账展示下级钱包汇入当前归集钱包的演示交易。' : '归集记录展示当前钱包向平台归集主钱包转出的演示交易。'}</p></div>}
        </div>
        <footer><button type="button" className="btn btn-primary" onClick={onClose}>关闭</button></footer>
      </section>
    </div>
  )
}

function StandardRowsTable({ rows, totalRows, activeTab, loading, onCopy, onDetail }) {
  const colSpan = activeTab === 'member' ? 11 : 9
  const totals = sumRows(totalRows)
  return <div className="wr-table-scroll"><table className="wr-table wr-standard-table">
    <thead><tr>
      <th>钱包编号</th>{activeTab === 'member' && <><th>用户ID</th><th>用户名</th></>}<th>钱包名称 / 来源</th><th>TRON钱包地址</th><th>链上实际余额</th><th>平台记录余额</th><th>余额差值（仅计算）</th><th>归集 / 资金状态</th><th>最近同步</th><th>操作</th>
    </tr></thead>
    <tbody>{loading ? <tr><td colSpan={colSpan}><div className="wr-table-state"><LoaderCircle className="wr-spin" size={22} />数据同步中...</div></td></tr> : rows.length ? rows.map((row) => <tr key={row.id}>
      <td><b>{row.id}</b></td>
      {activeTab === 'member' && <><td>{row.memberId}</td><td><b className="wr-username">{row.username}</b></td></>}
      <td><div className="wr-name-cell"><b>{row.name}</b><span>{row.source || (activeTab === 'member' ? '会员充值 / 提现' : '-')}</span></div></td>
      <td><div className="wr-address"><span title={row.address}>{row.address}</span><button type="button" onClick={() => onCopy(row.address)} aria-label={`复制钱包地址 ${row.address}`}><Copy size={13} /></button></div></td>
      <td><CurrencyValues usdt={row.chainUSDT} trx={row.chainTRX} /></td>
      <td><CurrencyValues usdt={row.platformUSDT} trx={row.platformTRX} /></td>
      <td><CurrencyValues usdt={row.usdtDifference} trx={row.trxDifference} signed /></td>
      <td><CollectionBadge value={row.collectionStatus} /></td>
      <td><span className="wr-time">{row.syncedAt}</span></td>
      <td><button type="button" className="wr-row-action" onClick={() => onDetail(row)}><Eye size={13} />详情</button></td>
    </tr>) : <tr><td colSpan={colSpan}><div className="wr-table-state empty">暂无符合条件的钱包</div></td></tr>}</tbody>
    <tfoot><tr>
      <td colSpan={activeTab === 'member' ? 5 : 3}><div className="wr-total-label"><b>总计</b><span>当前筛选结果 · {totalRows.length} 个钱包</span></div></td>
      <td><CurrencyValues usdt={totals.chainUSDT} trx={totals.chainTRX} /></td>
      <td><CurrencyValues usdt={totals.platformUSDT} trx={totals.platformTRX} /></td>
      <td><CurrencyValues usdt={totals.usdtDifference} trx={totals.trxDifference} signed /></td>
      <td>—</td><td>当前筛选</td><td>—</td>
    </tr></tfoot>
  </table></div>
}

function GameSummaryTable({ rows, totalRows, loading, onDrillDown }) {
  const totals = sumRows(totalRows)
  const walletCount = totalRows.reduce((sum, row) => sum + Number(row.walletCount || 0), 0)
  const pendingCount = totalRows.reduce((sum, row) => sum + Number(row.pendingCount || 0), 0)
  return <div className="wr-table-scroll"><table className="wr-table wr-game-summary-table">
    <thead><tr><th>游戏</th><th>游戏编码</th><th>用户钱包数</th><th>链上实际余额</th><th>平台记录余额</th><th>余额差值（仅计算）</th><th>待归集钱包</th><th>最近同步</th><th>操作</th></tr></thead>
    <tbody>{loading ? <tr><td colSpan="9"><div className="wr-table-state"><LoaderCircle className="wr-spin" size={22} />数据同步中...</div></td></tr> : rows.length ? rows.map((row) => <tr key={row.game}>
      <td><b className="wr-game-name">{row.game}</b></td><td>{row.gameCode}</td><td><b>{row.walletCount}</b> 个</td>
      <td><CurrencyValues usdt={row.chainUSDT} trx={row.chainTRX} /></td><td><CurrencyValues usdt={row.platformUSDT} trx={row.platformTRX} /></td><td><CurrencyValues usdt={row.usdtDifference} trx={row.trxDifference} signed /></td>
      <td><span className={row.pendingCount ? 'wr-count-warning' : 'wr-count-ok'}>{row.pendingCount}</span></td><td><span className="wr-time">{row.syncedAt}</span></td>
      <td><button type="button" className="wr-row-action primary" onClick={() => onDrillDown(row.game)}><Users size={13} />查看用户钱包</button></td>
    </tr>) : <tr><td colSpan="9"><div className="wr-table-state empty">暂无符合条件的游戏钱包</div></td></tr>}</tbody>
    <tfoot><tr>
      <td colSpan="2"><div className="wr-total-label"><b>总计</b><span>当前筛选结果 · {totalRows.length} 个游戏</span></div></td>
      <td><b>{walletCount}</b> 个</td>
      <td><CurrencyValues usdt={totals.chainUSDT} trx={totals.chainTRX} /></td>
      <td><CurrencyValues usdt={totals.platformUSDT} trx={totals.platformTRX} /></td>
      <td><CurrencyValues usdt={totals.usdtDifference} trx={totals.trxDifference} signed /></td>
      <td><span className={pendingCount ? 'wr-count-warning' : 'wr-count-ok'}>{pendingCount}</span></td><td>当前筛选</td><td>—</td>
    </tr></tfoot>
  </table></div>
}

function GameWalletTable({ rows, totalRows, loading, onCopy, onDetail }) {
  const totals = sumRows(totalRows)
  return <div className="wr-table-scroll"><table className="wr-table wr-game-wallet-table">
    <thead><tr><th>用户ID</th><th>用户名</th><th>对应游戏</th><th>游戏钱包地址</th><th>链上实际余额</th><th>平台记录余额</th><th>余额差值（仅计算）</th><th>归集状态</th><th>最近同步</th><th>操作</th></tr></thead>
    <tbody>{loading ? <tr><td colSpan="10"><div className="wr-table-state"><LoaderCircle className="wr-spin" size={22} />数据同步中...</div></td></tr> : rows.length ? rows.map((row) => <tr key={row.id}>
      <td><b>{row.memberId}</b></td><td><b className="wr-username">{row.username}</b></td><td><div className="wr-name-cell"><b>{row.game}</b><span>{row.gameCode}</span></div></td>
      <td><div className="wr-address"><span title={row.address}>{row.address}</span><button type="button" onClick={() => onCopy(row.address)}><Copy size={13} /></button></div></td>
      <td><CurrencyValues usdt={row.chainUSDT} trx={row.chainTRX} /></td><td><CurrencyValues usdt={row.platformUSDT} trx={row.platformTRX} /></td><td><CurrencyValues usdt={row.usdtDifference} trx={row.trxDifference} signed /></td>
      <td><CollectionBadge value={row.collectionStatus} /></td><td><span className="wr-time">{row.syncedAt}</span></td><td><button type="button" className="wr-row-action" onClick={() => onDetail(row)}><Eye size={13} />详情</button></td>
    </tr>) : <tr><td colSpan="10"><div className="wr-table-state empty">该游戏暂无符合条件的用户钱包</div></td></tr>}</tbody>
    <tfoot><tr>
      <td colSpan="4"><div className="wr-total-label"><b>总计</b><span>当前筛选结果 · {totalRows.length} 个游戏钱包</span></div></td>
      <td><CurrencyValues usdt={totals.chainUSDT} trx={totals.chainTRX} /></td>
      <td><CurrencyValues usdt={totals.platformUSDT} trx={totals.platformTRX} /></td>
      <td><CurrencyValues usdt={totals.usdtDifference} trx={totals.trxDifference} signed /></td>
      <td>—</td><td>当前筛选</td><td>—</td>
    </tr></tfoot>
  </table></div>
}

function OverviewTable({ rows, loading, onOpen }) {
  return <div className="wr-table-scroll"><table className="wr-table wr-overview-table">
    <thead><tr><th>钱包类别</th><th>钱包数量</th><th>链上实际余额</th><th>平台记录余额</th><th>余额差值（仅计算）</th><th>在途 / 待归集资金</th><th>资金流向</th><th>操作</th></tr></thead>
    <tbody>{loading ? <tr><td colSpan="8"><div className="wr-table-state"><LoaderCircle className="wr-spin" size={22} />四类钱包正在重新汇总...</div></td></tr> : rows.map((row) => <tr key={row.key}>
      <td><div className="wr-category-cell"><span className={`wr-category-icon ${row.key}`}><row.icon size={16} /></span><div><b>{row.label}</b><small>{row.caption}</small></div></div></td>
      <td><b>{row.walletCount}</b> 个</td><td><CurrencyValues usdt={row.chainUSDT} trx={row.chainTRX} /></td><td><CurrencyValues usdt={row.platformUSDT} trx={row.platformTRX} /></td><td><CurrencyValues usdt={row.usdtDifference} trx={row.trxDifference} signed /></td>
      <td><CurrencyValues usdt={row.attentionUSDT} trx={row.attentionTRX} /></td><td><span className="wr-flow-text">{row.flow}</span></td>
      <td><button type="button" className="wr-row-action primary" onClick={() => onOpen(row.key)}><Eye size={13} />查看明细</button></td>
    </tr>)}</tbody>
  </table></div>
}

function WalletPagination({ total, page, pageSize, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return <div className="wr-pagination">
    <span>共 {total} 条</span>
    <select value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))}>{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}条/页</option>)}</select>
    <button type="button" aria-label="上一页" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft size={14} /></button>
    <b>{page}</b><span>/ {totalPages}</span>
    <button type="button" aria-label="下一页" disabled={page >= totalPages} onClick={() => onPage(page + 1)}><ChevronLeft className="wr-next-icon" size={14} /></button>
  </div>
}

export default function WalletReconciliationPage({ toast }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [draft, setDraft] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [gameDetail, setGameDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)
  const [refreshCount, setRefreshCount] = useState(0)
  const [balanceRefreshing, setBalanceRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const timerRef = useRef(null)

  const notify = useCallback((message, type = 'success') => {
    if (typeof toast === 'function') toast(message, type)
  }, [toast])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const activeSourceRows = useMemo(() => {
    if (activeTab === 'overview') return [...MEMBER_WALLETS, ...GAME_WALLETS, ...COLLECTION_WALLETS, ...PAYOUT_WALLETS]
    if (activeTab === 'game') return GAME_WALLETS
    if (activeTab === 'collection') return COLLECTION_WALLETS
    if (activeTab === 'payout') return PAYOUT_WALLETS
    return MEMBER_WALLETS
  }, [activeTab])

  const filteredRows = useMemo(() => {
    const keyword = applied.keyword.trim().toLowerCase()
    return activeSourceRows.filter((row) => {
      if (applied.game !== '全部游戏' && row.game !== applied.game) return false
      if (gameDetail && gameDetail !== '全部游戏' && row.game !== gameDetail) return false
      if (keyword && !`${row.id} ${row.memberId || ''} ${row.username || ''} ${row.name || ''} ${row.game || ''} ${row.gameCode || ''} ${row.address} ${row.source || ''}`.toLowerCase().includes(keyword)) return false
      return true
    })
  }, [activeSourceRows, applied, gameDetail])

  const gameSummaryRows = useMemo(() => GAME_NAMES.map((game, gameIndex) => {
    const rows = GAME_WALLETS.filter((row) => {
      const keyword = applied.keyword.trim().toLowerCase()
      if (applied.game !== '全部游戏' && row.game !== applied.game) return false
      if (keyword && !`${row.memberId} ${row.username} ${row.game} ${row.gameCode} ${row.address}`.toLowerCase().includes(keyword)) return false
      return row.game === game
    })
    if (!rows.length) return null
    return {
      game,
      gameCode: `HASH-${String(gameIndex + 1).padStart(2, '0')}`,
      walletCount: rows.length,
      ...sumRows(rows),
      pendingCount: rows.filter((row) => row.collectionStatus !== '已归集').length,
      syncedAt: rows.at(-1)?.syncedAt || '-',
    }
  }).filter(Boolean), [applied])

  const categorySummaryRows = useMemo(() => [
    { key: 'member', label: '用户钱包', caption: '会员充值与提现钱包', flow: '会员充值 → 用户钱包 → 归集钱包', icon: Users, rows: MEMBER_WALLETS },
    { key: 'game', label: '游戏钱包', caption: '12 个游戏的用户外盘钱包', flow: '用户钱包 → 游戏钱包 → 游戏归集钱包', icon: Gamepad2, rows: GAME_WALLETS },
    { key: 'collection', label: '归集钱包', caption: '会员及游戏资金归集', flow: '用户 / 游戏钱包 → 归集主钱包', icon: Landmark, rows: COLLECTION_WALLETS },
    { key: 'payout', label: '代付钱包', caption: '会员取款出款与备用钱包', flow: '代付钱包 → 会员提现地址', icon: Send, rows: PAYOUT_WALLETS },
  ].map((category) => {
    const totals = sumRows(category.rows)
    const attentionRows = category.rows.filter((row) => ['待归集', '归集中'].includes(row.collectionStatus))
    const attention = sumRows(attentionRows)
    return {
      ...category,
      ...totals,
      walletCount: category.rows.length,
      attentionUSDT: category.key === 'payout' ? PAYOUT_LOCKED.usdt : attention.chainUSDT,
      attentionTRX: category.key === 'payout' ? PAYOUT_LOCKED.trx : attention.chainTRX,
    }
  }), [])

  const pendingCollection = useMemo(() => sumRows([...MEMBER_WALLETS, ...GAME_WALLETS].filter((row) => row.collectionStatus !== '已归集')), [])

  const switchTab = (key) => {
    setActiveTab(key)
    setDraft(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
    setGameDetail('')
    setDetail(null)
    setPage(1)
  }

  const runLoading = useCallback((message, isBalanceRefresh = false) => {
    setLoading(true)
    setBalanceRefreshing(isBalanceRefresh)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setLoading(false)
      setBalanceRefreshing(false)
      if (isBalanceRefresh) setRefreshCount((count) => count + 1)
      notify(message)
    }, 460)
  }, [notify])

  useEffect(() => {
    const refresh = () => {
      runLoading('四类钱包当前余额已重新同步', true)
    }
    window.addEventListener('demo-refresh', refresh)
    return () => window.removeEventListener('demo-refresh', refresh)
  }, [runLoading])

  const query = () => {
    setApplied({ ...draft })
    const keyword = draft.keyword.trim().toLowerCase()
    const memberMatch = keyword && MEMBERS.some((member) => `${member.memberId} ${member.username}`.toLowerCase().includes(keyword))
    const walletMatch = keyword && GAME_WALLETS.some((row) => `${row.id} ${row.address}`.toLowerCase().includes(keyword))
    if (activeTab === 'game') setGameDetail(memberMatch || walletMatch ? '全部游戏' : '')
    setPage(1)
    runLoading('查询完成，已更新钱包余额列表')
  }

  const reset = () => {
    setDraft(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
    setGameDetail('')
    setPage(1)
    runLoading('已重置钱包对账筛选条件')
  }

  const refresh = () => {
    runLoading('用户、游戏、归集和代付钱包当前余额已刷新', true)
  }

  const copyAddress = async (address, message = '钱包地址已复制') => {
    try {
      await navigator.clipboard.writeText(address)
    } catch {
      const input = document.createElement('textarea')
      input.value = address
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    notify(message)
  }

  const exportRows = () => {
    const isGameSummary = activeTab === 'game' && !gameDetail
    const source = activeTab === 'overview'
      ? categorySummaryRows.map((row) => ({ ...row, id: row.key, name: row.label, address: '-', memberId: '-', username: '-', collectionStatus: `${row.walletCount}个钱包`, syncedAt: '2026-08-28 05:20:00' }))
      : isGameSummary ? gameSummaryRows : filteredRows
    const headers = isGameSummary
      ? ['游戏名称', '游戏编码', '用户钱包数', '链上USDT', '链上TRX', '平台记录USDT', '平台记录TRX', 'USDT余额差值（仅计算）', 'TRX余额差值（仅计算）', '待归集钱包', '最近同步']
      : ['钱包编号', '用户ID', '用户名', '游戏/钱包名称', '钱包地址', '链上USDT', '链上TRX', '平台记录USDT', '平台记录TRX', 'USDT余额差值（仅计算）', 'TRX余额差值（仅计算）', '归集/资金状态', '最近同步']
    const values = isGameSummary
      ? source.map((row) => [row.game, row.gameCode, `${row.walletCount}个钱包`, row.chainUSDT, row.chainTRX, row.platformUSDT, row.platformTRX, row.usdtDifference, row.trxDifference, `${row.pendingCount}个`, row.syncedAt])
      : source.map((row) => [row.id, row.memberId || '-', row.username || '-', row.game || row.name, row.address, row.chainUSDT, row.chainTRX, row.platformUSDT, row.platformTRX, row.usdtDifference, row.trxDifference, row.collectionStatus || `${row.walletCount}个钱包`, row.syncedAt])
    if (activeTab !== 'overview') {
      const totals = sumRows(source)
      const walletCount = isGameSummary
        ? source.reduce((sum, row) => sum + Number(row.walletCount || 0), 0)
        : source.length
      if (isGameSummary) {
        const pendingCount = source.reduce((sum, row) => sum + Number(row.pendingCount || 0), 0)
        values.push(['总计', `${source.length}个游戏`, `${walletCount}个钱包`, totals.chainUSDT, totals.chainTRX, totals.platformUSDT, totals.platformTRX, totals.usdtDifference, totals.trxDifference, `${pendingCount}个`, '当前筛选结果'])
      } else {
        values.push(['总计', '-', '-', `${walletCount}个钱包`, '-', totals.chainUSDT, totals.chainTRX, totals.platformUSDT, totals.platformTRX, totals.usdtDifference, totals.trxDifference, '-', '当前筛选结果'])
      }
    }
    const csv = [headers, ...values].map((row) => row.map(quoteCsv).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `钱包资金对账-${TABS.find((tab) => tab.key === activeTab)?.label}${gameDetail ? `-${gameDetail}` : ''}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    notify(`已导出 ${source.length} 条钱包对账数据`)
  }

  const totalVisibleRows = activeTab === 'overview' ? categorySummaryRows.length : activeTab === 'game' && !gameDetail ? gameSummaryRows.length : filteredRows.length
  const totalPages = Math.max(1, Math.ceil(totalVisibleRows / pageSize))
  const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize)
  const pagedGameSummaryRows = gameSummaryRows.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => setPage((current) => Math.min(current, totalPages)), [totalPages])

  const changePageSize = (size) => {
    setPageSize(size)
    setPage(1)
    notify(`已切换为每页 ${size} 条`)
  }

  const shownCount = totalVisibleRows
  const currentLabel = gameDetail ? `${gameDetail} · 用户钱包明细` : TABS.find((tab) => tab.key === activeTab)?.label

  return <div className="wallet-reconciliation-page">
    <section className="wr-intro">
      <div className="wr-intro-icon"><WalletCards size={24} /></div>
      <div><b>全量钱包资金人工对账</b><p>并列展示 TRON 链上实际余额与平台记录余额供财务人工核对；用户资金归集至归集钱包，12 个游戏的用户外盘钱包支持逐层下钻。</p></div>
      <div className="wr-sync-info"><span>最近演示同步</span><b>2026-08-28 05:20:{String(refreshCount % 60).padStart(2, '0')}</b><small>确定性前端模拟数据</small></div>
    </section>

    <nav className="wr-wallet-tabs" aria-label="钱包类型">
      {TABS.map(({ key, label, icon: Icon }) => <button type="button" key={key} className={activeTab === key ? 'active' : ''} onClick={() => switchTab(key)}><Icon size={16} /><span>{label}</span>{key === 'game' && <em>12</em>}</button>)}
    </nav>

    <section className="wr-balance-summary">
      <div className="wr-balance-summary-head">
        <div><b>四类钱包当前余额</b><span>按钱包类型汇总当前 TRON 链上余额，USDT 与 TRX 独立展示</span></div>
        <button type="button" className="btn btn-default" onClick={refresh} disabled={balanceRefreshing}>
          {balanceRefreshing ? <LoaderCircle className="wr-spin" size={14} /> : <RefreshCw size={14} />}
          {balanceRefreshing ? '刷新中...' : '刷新当前余额'}
        </button>
      </div>
      <div className={`wr-overview${balanceRefreshing ? ' is-refreshing' : ''}`} aria-busy={balanceRefreshing}>
        {categorySummaryRows.map(({ key, label, icon: Icon, walletCount, chainUSDT, chainTRX }) => <article key={key}>
          <div className="wr-balance-card-title"><span><Icon size={16} /></span><b>{label}</b></div>
          <CurrencyValues usdt={chainUSDT} trx={chainTRX} />
          <small>{walletCount} 个钱包 · 当前链上余额</small>
        </article>)}
      </div>
      <div className={`wr-overview wr-pending-overview${balanceRefreshing ? ' is-refreshing' : ''}`} aria-busy={balanceRefreshing}>
        <article>
          <div className="wr-balance-card-title"><span><RefreshCw size={16} /></span><b>待归集资金</b></div>
          <CurrencyValues usdt={pendingCollection.chainUSDT} trx={pendingCollection.chainTRX} />
          <small>用户及游戏钱包中待归集、归集中的当前链上余额</small>
        </article>
      </div>
    </section>

    {activeTab !== 'overview' && <section className="panel wr-filter-panel">
      <label><span>综合搜索</span><div><Search size={14} /><input value={draft.keyword} onChange={(event) => setDraft((old) => ({ ...old, keyword: event.target.value }))} onKeyDown={(event) => event.key === 'Enter' && query()} placeholder={activeTab === 'game' ? '用户ID / 用户名 / 游戏 / 钱包地址' : activeTab === 'member' ? '用户ID / 用户名 / 钱包地址' : '钱包编号 / 名称 / 地址'} /></div></label>
      {activeTab === 'game' && <label><span>对应游戏</span><select value={draft.game} onChange={(event) => setDraft((old) => ({ ...old, game: event.target.value }))}><option>全部游戏</option>{GAME_NAMES.map((game) => <option key={game}>{game}</option>)}</select></label>}
      <div className="wr-filter-actions"><button type="button" className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button type="button" className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
    </section>}

    <section className="panel wr-table-panel">
      <div className="wr-table-toolbar">
        <div>{gameDetail && <button type="button" className="wr-back-button" onClick={() => { setGameDetail(''); setPage(1) }}><ChevronLeft size={14} />游戏钱包汇总</button>}<b>{currentLabel}</b><span>余额差值 = 链上实际余额 − 平台记录余额（仅计算）</span></div>
        <div>{activeTab === 'game' && !gameDetail && <button type="button" className="btn btn-default" onClick={() => { setGameDetail('全部游戏'); setPage(1); notify('已展开全部 96 个用户游戏钱包') }}><Users size={14} />全部用户钱包</button>}<button type="button" className="btn btn-default" onClick={exportRows}><Download size={14} />导出当前结果</button><span>共 <b>{shownCount}</b> 条</span></div>
      </div>
      {activeTab === 'overview'
        ? <OverviewTable rows={categorySummaryRows} loading={loading} onOpen={switchTab} />
        : activeTab === 'game' && !gameDetail
        ? <GameSummaryTable rows={pagedGameSummaryRows} totalRows={gameSummaryRows} loading={loading} onDrillDown={(game) => { setGameDetail(game); setPage(1); notify(`已展开 ${game} 的全部用户钱包`) }} />
        : activeTab === 'game'
          ? <GameWalletTable rows={pagedRows} totalRows={filteredRows} loading={loading} onCopy={copyAddress} onDetail={setDetail} />
          : <StandardRowsTable rows={pagedRows} totalRows={filteredRows} activeTab={activeTab} loading={loading} onCopy={copyAddress} onDetail={setDetail} />}
      {activeTab !== 'overview' && <WalletPagination total={totalVisibleRows} page={page} pageSize={pageSize} onPage={setPage} onPageSize={changePageSize} />}
      <footer className="wr-table-footer"><span>本页面仅做前端演示，不连接链上节点或资金系统。</span><span>系统不自动给出核对结论，最终结果由财务人员人工确认。</span></footer>
    </section>

    {detail && <WalletDetailModal row={detail} onClose={() => setDetail(null)} onCopy={copyAddress} />}
  </div>
}
