import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Download,
  Eye,
  FileImage,
  Image as ImageIcon,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRoundCheck,
  X,
  XCircle,
} from 'lucide-react'
import './security-recovery.css'

export const SECURITY_RECOVERY_PATH = '/member/security-recovery'

export const SECURITY_RECOVERY_SOURCES = [
  '更换密保',
  '添加TRC20地址',
  '安全中心找回',
]

export const SECURITY_RECOVERY_METHODS = [
  {
    value: '首次充值',
    label: '首次充值',
    condition: '请提供首次成功充值的币种、实际到账金额和大致日期，可补充充值订单或链上凭证截图。',
  },
  {
    value: '最近成功提现',
    label: '最近成功提现',
    condition: '请提供最近一次成功提现的币种、实际到账金额、大致时间及收款TRC20地址后6位，可补充提现凭证截图。',
  },
  {
    value: '历史常用钱包',
    label: '历史常用钱包',
    condition: '请提供历史常用钱包地址或地址尾号，并说明充值、提现等使用场景，可补充钱包地址页或对应交易截图。',
  },
]

const PAGE_SIZES = [10, 20, 50]
const STATUS_OPTIONS = ['待审核', '审核通过', '已驳回']

function escapeSvg(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function demoProofImage(title, lines, accent = '#356cff') {
  const safeTitle = escapeSvg(title)
  const lineNodes = lines.map((line, index) => (
    `<text x="44" y="${116 + index * 34}" font-family="Arial, PingFang SC, sans-serif" font-size="19" fill="#455066">${escapeSvg(line)}</text>`
  )).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="440" viewBox="0 0 760 440">
    <rect width="760" height="440" fill="#f3f6fb"/>
    <rect x="24" y="24" width="712" height="392" rx="18" fill="#ffffff" stroke="#dce3ef"/>
    <rect x="24" y="24" width="712" height="58" rx="18" fill="${accent}"/>
    <rect x="24" y="62" width="712" height="20" fill="${accent}"/>
    <text x="44" y="61" font-family="Arial, PingFang SC, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${safeTitle}</text>
    ${lineNodes}
    <line x1="44" y1="330" x2="716" y2="330" stroke="#e4e9f2"/>
    <text x="44" y="372" font-family="Arial, PingFang SC, sans-serif" font-size="16" fill="#8a94a6">前端演示凭证 · 不代表真实交易</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const rechargeProof = demoProofImage('首次充值记录', [
  '币种：USDT',
  '实际到账：100.00 USDT',
  '充值日期：2026-07-12',
  '订单状态：成功',
])

const withdrawProof = demoProofImage('提现凭证', [
  '币种：USDT',
  '实际到账：500.00 USDT',
  '提现日期：2026-08-20',
  '收款地址尾号：V6Y2P3',
], '#16a56f')

export const initialSecurityRecoveryRequests = [
  {
    id: 'MB202608280001',
    memberId: '133',
    username: 'evan777',
    source: '更换密保',
    method: '首次充值核验',
    condition: SECURITY_RECOVERY_METHODS[0].condition,
    reply: '首次充值为 100 USDT，大约在 2026 年 7 月 12 日到账。',
    images: [{ id: 'proof-recharge-1', name: '首次充值凭证.png', url: rechargeProof }],
    submittedAt: '2026-08-28 04:56:18',
    status: '待审核',
    reviewer: '',
    reviewedAt: '',
    reviewRemark: '',
  },
  {
    id: 'MB202608280002',
    memberId: '291',
    username: 'evanmm88',
    source: '账户管理 · 添加TRC20地址',
    method: '最近一次成功提现核验',
    condition: SECURITY_RECOVERY_METHODS[1].condition,
    reply: '最近一次提现 500 USDT，收款地址后 6 位是 V6Y2P3。',
    images: [{ id: 'proof-withdraw-1', name: '最近提现凭证.png', url: withdrawProof }],
    submittedAt: '2026-08-28 04:48:06',
    status: '审核通过',
    reviewer: 'admin1',
    reviewedAt: '2026-08-28 04:51:32',
    reviewRemark: '客服核验通过，会员密保已恢复为未设置状态。',
  },
  {
    id: 'MB202608280003',
    memberId: '288',
    username: 'Appleee',
    source: '安全中心 · 找回密保',
    method: '账户注册与常用登录核验',
    condition: SECURITY_RECOVERY_METHODS[2].condition,
    reply: '大约 8 月中旬注册，常用地区为新加坡，设备为 iPhone。',
    images: [],
    submittedAt: '2026-08-28 04:36:42',
    status: '已驳回',
    reviewer: 'admin1',
    reviewedAt: '2026-08-28 04:41:09',
    reviewRemark: '提交信息与演示账户资料不一致，请重新选择其他核验方式。',
  },
]

function cloneInitialRequests() {
  return initialSecurityRecoveryRequests.map((request) => ({
    ...request,
    images: request.images.map((image) => ({ ...image })),
  }))
}

function normalizeImage(image, index) {
  if (typeof image === 'string') return { id: `image-${index}`, name: `核验截图${index + 1}.png`, url: image }
  return {
    id: image?.id || `image-${index}`,
    name: image?.name || `核验截图${index + 1}.png`,
    url: image?.url || image?.src || image?.dataUrl || '',
  }
}

function formatConditionValue(value) {
  if (value == null || value === '') return ''
  if (Array.isArray(value)) return value.map(formatConditionValue).filter(Boolean).join('；')
  if (typeof value !== 'object') return String(value)
  const preferredLabel = value.label || value.name || value.field || value.title || value.prompt
  const preferredValue = value.value ?? value.text ?? value.content ?? value.description
  if (preferredLabel && preferredValue != null && preferredValue !== '') return `${preferredLabel}：${formatConditionValue(preferredValue)}`
  if (preferredLabel) return String(preferredLabel)
  return Object.entries(value).map(([key, item]) => `${key}：${formatConditionValue(item)}`).filter((item) => !item.endsWith('：')).join('；')
}

function sourceLabel(value) {
  const source = String(value || '')
  if (source.includes('account-bind') || source.includes('TRC20')) return '添加TRC20地址'
  if (source.includes('security-question')) return '更换密保'
  if (source.includes('center') || source.includes('安全中心')) return '安全中心找回'
  return source || '安全中心找回'
}

function normalizeStatus(value) {
  const status = String(value || '待审核')
  if (['approved', 'passed', 'success'].includes(status.toLowerCase())) return '审核通过'
  if (['rejected', 'refused', 'failed'].includes(status.toLowerCase())) return '已驳回'
  if (['pending', 'reviewing'].includes(status.toLowerCase())) return '待审核'
  return status
}

function normalizeRequest(request, index) {
  const rawMethod = request.method || request.verificationMethod || '首次充值核验'
  const methodAliases = {
    'first-deposit': '首次充值',
    '首次充值核验': '首次充值',
    'recent-withdrawal': '最近成功提现',
    '最近一次成功提现核验': '最近成功提现',
    'common-wallet': '历史常用钱包',
    '账户注册与常用登录核验': '历史常用钱包',
  }
  const method = methodAliases[request.methodLabel] || methodAliases[rawMethod] || request.methodLabel || SECURITY_RECOVERY_METHODS.find((item) => item.value === rawMethod)?.label || rawMethod
  const methodDefinition = SECURITY_RECOVERY_METHODS.find((item) => item.value === method)
  const conditions = formatConditionValue(request.conditions)
  return {
    ...request,
    id: String(request.id || request.requestNo || `MB-DEMO-${index + 1}`),
    memberId: String(request.memberId || request.userId || request.member?.id || '-'),
    username: request.username || request.member?.username || request.member?.user || '-',
    source: sourceLabel(request.source || request.sourcePage || request.applicationSource),
    method,
    methodKey: rawMethod,
    securityQuestion: request.securityQuestion || '',
    condition: request.condition || request.verificationCondition || conditions || methodDefinition?.condition || '-',
    reply: request.reply || request.response || '',
    images: (request.images || request.screenshots || request.evidenceImages || []).map(normalizeImage),
    submittedAt: request.submittedAt || request.createdAt || '-',
    status: normalizeStatus(request.status),
    reviewer: request.reviewer || '',
    reviewedAt: request.reviewedAt || '',
    rejectReason: request.rejectReason || '',
    reviewRemark: request.reviewRemark || request.rejectReason || '',
  }
}

function statusClass(status) {
  if (status === '审核通过') return 'approved'
  if (status === '已驳回') return 'rejected'
  return 'pending'
}

function quoteCsv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

function currentReviewTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function DetailRow({ label, children }) {
  return <div className="sr-detail-row"><span>{label}</span><div>{children || '-'}</div></div>
}

function StatusBadge({ status }) {
  const Icon = status === '审核通过' ? CheckCircle2 : status === '已驳回' ? XCircle : AlertTriangle
  return <span className={`sr-status ${statusClass(status)}`}><Icon size={13} />{status}</span>
}

function ConfirmModal({ request, onClose, onConfirm }) {
  return (
    <div className="sr-modal-layer sr-modal-top" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sr-confirm-dialog" role="alertdialog" aria-modal="true" aria-label="审核通过确认">
        <div className="sr-confirm-icon approved"><ShieldCheck size={24} /></div>
        <div className="sr-confirm-copy">
          <h3>确认审核通过</h3>
          <p>客服通过申请 <b>{request.id}</b> 后，会员 <b>{request.username}</b> 的密保将立即恢复为“未设置”状态，会员需重新设置密保。原密保答案不会被展示或恢复。</p>
        </div>
        <button type="button" className="sr-icon-button sr-confirm-close" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        <footer><button type="button" className="btn btn-default" onClick={onClose}>取消</button><button type="button" className="btn btn-primary" onClick={onConfirm}><Check size={14} />确认通过</button></footer>
      </section>
    </div>
  )
}

function RejectModal({ request, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const submit = () => {
    const value = reason.trim()
    if (!value) {
      setError('请输入驳回原因')
      return
    }
    onConfirm(value)
  }
  return (
    <div className="sr-modal-layer sr-modal-top" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sr-reject-dialog" role="dialog" aria-modal="true" aria-label="驳回密保找回申请">
        <header><div><XCircle size={19} /><b>驳回密保找回申请</b></div><button type="button" className="sr-icon-button" onClick={onClose} aria-label="关闭"><X size={18} /></button></header>
        <div className="sr-reject-body">
          <div className="sr-request-summary"><span>申请单号</span><b>{request.id}</b><span>会员</span><b>{request.username} / {request.memberId}</b></div>
          <label><span><em>*</em>驳回原因</span><textarea value={reason} onChange={(event) => { setReason(event.target.value); setError('') }} maxLength={200} placeholder="请输入驳回原因，会员端将显示该说明" /><small>{reason.length} / 200</small></label>
          {error && <p className="sr-form-error">{error}</p>}
        </div>
        <footer><button type="button" className="btn btn-default" onClick={onClose}>取消</button><button type="button" className="btn btn-danger" onClick={submit}>确认驳回</button></footer>
      </section>
    </div>
  )
}

function ImagePreview({ image, onClose }) {
  if (!image) return null
  return (
    <div className="sr-image-preview" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-label={`查看${image.name}`}>
        <header><div><ImageIcon size={17} /><b>{image.name}</b></div><button type="button" onClick={onClose} aria-label="关闭图片"><X size={20} /></button></header>
        <div><img src={image.url} alt={image.name} /></div>
        <footer><button type="button" className="btn btn-primary" onClick={onClose}>关闭</button></footer>
      </section>
    </div>
  )
}

function RequestDetailModal({ request, initialTab = '申请信息', onClose, notify }) {
  const tabs = ['申请信息', '核验材料', '审核记录']
  const [tab, setTab] = useState(initialTab)
  const [preview, setPreview] = useState(null)
  const copyReply = () => {
    navigator.clipboard?.writeText(request.reply || '')
    notify('用户回复已复制')
  }
  return (
    <div className="sr-modal-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sr-detail-dialog" role="dialog" aria-modal="true" aria-label={`密保找回申请详情 ${request.id}`}>
        <header className="sr-dialog-header">
          <div><b>密保找回申请详情</b><span>{request.id}</span><StatusBadge status={request.status} /></div>
          <button type="button" className="sr-icon-button" onClick={onClose} aria-label="关闭"><X size={19} /></button>
        </header>
        <nav className="sr-detail-tabs">{tabs.map((name) => <button type="button" key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}</nav>
        <div className="sr-detail-body">
          {tab === '申请信息' && (
            <div className="sr-detail-grid">
              <DetailRow label="申请单号"><b>{request.id}</b></DetailRow>
              <DetailRow label="会员信息"><b>{request.username}</b><small>ID：{request.memberId}</small></DetailRow>
              <DetailRow label="申请来源">{request.source}</DetailRow>
              <DetailRow label="核验方式">{request.method}</DetailRow>
              <DetailRow label="原密保问题">{request.securityQuestion || '未提供 / 尚未设置'}</DetailRow>
              <DetailRow label="提交时间">{request.submittedAt}</DetailRow>
              <DetailRow label="审核状态"><StatusBadge status={request.status} /></DetailRow>
            </div>
          )}
          {tab === '核验材料' && (
            <div className="sr-proof-detail">
              <section className="sr-condition-card"><span>本次核验条件</span><p>{request.condition}</p></section>
              <section className="sr-reply-card">
                <header><div><b>用户文字回复</b><span>{request.reply ? `${request.reply.length} 字` : '未填写'}</span></div>{request.reply && <button type="button" onClick={copyReply}><ClipboardCopy size={13} />复制</button>}</header>
                <p>{request.reply || '本次申请未填写文字回复，请核对下方图片凭证。'}</p>
              </section>
              <section className="sr-evidence-card">
                <header><b>用户上传截图</b><span>共 {request.images.length} 张</span></header>
                {request.images.length ? <div className="sr-image-grid">{request.images.map((image) => <button type="button" key={image.id} onClick={() => setPreview(image)}><img src={image.url} alt={image.name} /><span><FileImage size={13} />{image.name}</span><em><Eye size={15} />查看大图</em></button>)}</div> : <div className="sr-no-images"><ImageIcon size={26} /><span>未上传截图</span></div>}
              </section>
            </div>
          )}
          {tab === '审核记录' && (
            <div className="sr-review-record">
              <div className="sr-review-timeline-item submitted"><i /><div><b>会员提交找回申请</b><p>{request.username} 通过“{request.source}”提交“{request.method}”材料。</p><span>{request.submittedAt}</span></div></div>
              {request.status === '待审核' ? <div className="sr-review-pending"><LoaderCircle size={20} /><div><b>等待客服审核</b><p>当前申请尚未处理，客服审核通过或驳回后将在此处生成记录。</p></div></div> : <div className={`sr-review-timeline-item ${statusClass(request.status)}`}><i /><div><b>{request.status}</b><p>{request.reviewRemark || (request.status === '审核通过' ? '客服核验通过，会员密保已恢复为未设置状态。' : '申请材料未通过审核。')}</p><span>客服账号：{request.reviewer || 'admin1'}　{request.reviewedAt || '-'}</span></div></div>}
            </div>
          )}
        </div>
        <footer className="sr-dialog-footer"><button type="button" className="btn btn-primary" onClick={onClose}>关闭</button></footer>
      </section>
      <ImagePreview image={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

function RecoveryTable({ rows, loading, onView, onPreview, onApprove, onReject }) {
  return (
    <div className="sr-table-scroll">
      <table className="sr-table">
        <thead><tr><th>申请单号</th><th>会员信息</th><th>申请来源</th><th>核验方式</th><th>核验条件</th><th>用户回复 / 截图</th><th>提交时间</th><th>审核状态</th><th>审核信息</th><th>操作</th></tr></thead>
        <tbody>
          {loading ? <tr><td colSpan="10"><div className="sr-table-state"><LoaderCircle className="sr-spin" size={23} /><span>加载中...</span></div></td></tr> : rows.length ? rows.map((request) => (
            <tr key={request.id}>
              <td><b className="sr-order-number">{request.id}</b></td>
              <td><div className="sr-member-cell"><b>{request.username}</b><span>ID：{request.memberId}</span></div></td>
              <td><span className="sr-source-cell">{request.source}</span></td>
              <td><span className="sr-method-cell">{request.method}</span></td>
              <td><p className="sr-clamped" title={request.condition}>{request.condition}</p></td>
              <td><div className="sr-material-cell"><p title={request.reply}>{request.reply || '无文字回复'}</p>{request.images.length ? <button type="button" onClick={() => onPreview(request)}><FileImage size={13} />图片 {request.images.length} 张</button> : <span>未上传图片</span>}</div></td>
              <td><span className="sr-time-cell">{request.submittedAt}</span></td>
              <td><StatusBadge status={request.status} /></td>
              <td><div className="sr-reviewer-cell">{request.status === '待审核' ? <span>等待审核</span> : <><b>{request.reviewer || '-'}</b><span>{request.reviewedAt || '-'}</span><small title={request.reviewRemark}>{request.reviewRemark || '-'}</small></>}</div></td>
              <td><div className="sr-row-actions"><button type="button" onClick={() => onView(request)}><Eye size={13} />查看</button>{request.status === '待审核' && <><button type="button" className="approve" onClick={() => onApprove(request)}><CheckCircle2 size={13} />通过</button><button type="button" className="reject" onClick={() => onReject(request)}><XCircle size={13} />驳回</button></>}</div></td>
            </tr>
          )) : <tr><td colSpan="10"><div className="sr-table-state empty"><FileImage size={28} /><b>暂无符合条件的密保找回申请</b><span>请调整筛选条件后重新查询</span></div></td></tr>}
        </tbody>
      </table>
    </div>
  )
}

export default function SecurityRecoveryPage({ requests, setRequests, onApprove, toast }) {
  const [localRequests, setLocalRequests] = useState(cloneInitialRequests)
  const sourceRequests = Array.isArray(requests) ? requests : localRequests
  const updateRequests = typeof setRequests === 'function' ? setRequests : setLocalRequests
  const normalizedRequests = useMemo(() => sourceRequests.map(normalizeRequest), [sourceRequests])
  const notify = useCallback((message, type = 'success') => {
    if (typeof toast === 'function') toast(message, type)
  }, [toast])
  const emptyFilters = { keyword: '', source: '全部', method: '全部', status: '全部', start: '', end: '' }
  const [draft, setDraft] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [detail, setDetail] = useState(null)
  const [detailTab, setDetailTab] = useState('申请信息')
  const [approving, setApproving] = useState(null)
  const [rejecting, setRejecting] = useState(null)
  const timerRef = useRef(null)

  const counts = useMemo(() => normalizedRequests.reduce((result, request) => ({
    ...result,
    [request.status]: (result[request.status] || 0) + 1,
  }), {}), [normalizedRequests])

  const filteredRequests = useMemo(() => normalizedRequests.filter((request) => {
    const keyword = applied.keyword.trim().toLowerCase()
    if (keyword && !`${request.id} ${request.memberId} ${request.username} ${request.condition} ${request.reply}`.toLowerCase().includes(keyword)) return false
    if (applied.source !== '全部' && request.source !== applied.source) return false
    if (applied.method !== '全部' && request.method !== applied.method) return false
    if (applied.status !== '全部' && request.status !== applied.status) return false
    const submittedDate = request.submittedAt.slice(0, 10)
    if (applied.start && submittedDate < applied.start) return false
    if (applied.end && submittedDate > applied.end) return false
    return true
  }), [applied, normalizedRequests])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize))
  const pageRows = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage((page) => Math.min(page, totalPages)), [totalPages])
  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const runRefresh = useCallback((message = '密保找回数据已刷新') => {
    setLoading(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setLoading(false)
      notify(message)
    }, 480)
  }, [notify])

  useEffect(() => {
    const refresh = () => runRefresh()
    window.addEventListener('demo-refresh', refresh)
    return () => window.removeEventListener('demo-refresh', refresh)
  }, [runRefresh])

  const query = () => {
    if (draft.start && draft.end && draft.start > draft.end) {
      notify('提交时间的开始日期不能晚于结束日期', 'error')
      return
    }
    setApplied({ ...draft })
    setCurrentPage(1)
    runRefresh('查询成功，已更新密保找回申请列表')
  }

  const reset = () => {
    const next = { ...emptyFilters }
    setDraft(next)
    setApplied(next)
    setCurrentPage(1)
    runRefresh('已重置密保找回筛选条件')
  }

  const exportRows = () => {
    const columns = ['申请单号', '会员ID', '用户名', '申请来源', '原密保问题', '核验方式', '核验条件', '用户回复', '图片数量', '提交时间', '审核状态', '审核人', '审核时间', '审核说明']
    const values = filteredRequests.map((request) => [request.id, request.memberId, request.username, request.source, request.securityQuestion || '-', request.method, request.condition, request.reply || '-', request.images.length, request.submittedAt, request.status, request.reviewer || '-', request.reviewedAt || '-', request.reviewRemark || '-'])
    const csv = [columns, ...values].map((row) => row.map(quoteCsv).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = '密保找回申请-演示数据.csv'
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    notify(`已导出 ${filteredRequests.length} 条密保找回申请`)
  }

  const updateStatus = (request, patch) => {
    let updatedRequest = null
    updateRequests((items) => items.map((item, index) => {
      const normalized = normalizeRequest(item, index)
      if (normalized.id !== request.id) return item
      updatedRequest = { ...item, ...patch }
      return updatedRequest
    }))
    return updatedRequest || { ...request, ...patch }
  }

  const approve = () => {
    const updated = updateStatus(approving, {
      status: '审核通过',
      reviewer: 'admin1',
      reviewedAt: currentReviewTime(),
      rejectReason: '',
      reviewRemark: '客服核验通过，会员密保已恢复为未设置状态。',
    })
    setApproving(null)
    setDetail((current) => current?.id === updated.id ? normalizeRequest(updated, 0) : current)
    if (typeof onApprove === 'function') onApprove(normalizeRequest(updated, 0))
    notify(`申请 ${updated.id} 已审核通过，会员密保已还原为未设置状态`)
  }

  const reject = (reason) => {
    const updated = updateStatus(rejecting, {
      status: '已驳回',
      reviewer: 'admin1',
      reviewedAt: currentReviewTime(),
      rejectReason: reason,
      reviewRemark: reason,
    })
    setRejecting(null)
    setDetail((current) => current?.id === updated.id ? normalizeRequest(updated, 0) : current)
    notify(`申请 ${updated.id} 已驳回`)
  }

  const openProof = (request) => {
    setDetailTab('核验材料')
    setDetail(request)
  }

  const changePageSize = (event) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
    notify(`已切换为每页 ${event.target.value} 条`)
  }

  return (
    <div className="security-recovery-page">
      <section className="sr-intro">
        <div className="sr-intro-icon"><UserRoundCheck size={23} /></div>
        <div><b>密保找回客服审核</b><p>客服核对会员提交的验证条件、文字回复和截图凭证；通过后立即将会员密保还原为“未设置”，不会显示或恢复旧密保答案。</p></div>
        <button type="button" className="btn btn-default" onClick={() => runRefresh()}>{loading ? <LoaderCircle className="sr-spin" size={14} /> : <RefreshCw size={14} />}刷新</button>
      </section>

      <section className="sr-summary">
        <div><span>全部申请</span><b>{normalizedRequests.length}</b><small>当前演示数据</small></div>
        <div className="pending"><span>待审核</span><b>{counts['待审核'] || 0}</b><small>需要运营处理</small></div>
        <div className="approved"><span>审核通过</span><b>{counts['审核通过'] || 0}</b><small>密保已还原为未设置</small></div>
        <div className="rejected"><span>已驳回</span><b>{counts['已驳回'] || 0}</b><small>已记录驳回原因</small></div>
      </section>

      <section className="panel sr-filter-panel">
        <div className="sr-filter-grid">
          <label><span>申请 / 会员关键词</span><input value={draft.keyword} onChange={(event) => setDraft((old) => ({ ...old, keyword: event.target.value }))} placeholder="申请单号 / 会员ID / 用户名" /></label>
          <label><span>申请来源</span><select value={draft.source} onChange={(event) => setDraft((old) => ({ ...old, source: event.target.value }))}><option>全部</option>{SECURITY_RECOVERY_SOURCES.map((source) => <option key={source}>{source}</option>)}</select></label>
          <label><span>核验方式</span><select value={draft.method} onChange={(event) => setDraft((old) => ({ ...old, method: event.target.value }))}><option>全部</option>{SECURITY_RECOVERY_METHODS.map((method) => <option key={method.value}>{method.label}</option>)}</select></label>
          <label><span>审核状态</span><select value={draft.status} onChange={(event) => setDraft((old) => ({ ...old, status: event.target.value }))}><option>全部</option>{STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="sr-date-filter"><span>提交时间</span><div><input type="date" value={draft.start} onChange={(event) => setDraft((old) => ({ ...old, start: event.target.value }))} /><em>至</em><input type="date" value={draft.end} onChange={(event) => setDraft((old) => ({ ...old, end: event.target.value }))} /></div></label>
          <div className="sr-filter-actions"><button type="button" className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button type="button" className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
        </div>
      </section>

      <section className="panel sr-table-panel">
        <div className="sr-table-toolbar">
          <div><b>密保找回申请</b><span>文字回复或截图至少提供一项</span></div>
          <div><button type="button" className="btn btn-default" onClick={exportRows}><Download size={14} />导出</button><span>共 <b>{filteredRequests.length}</b> 条</span></div>
        </div>
        <RecoveryTable rows={pageRows} loading={loading} onView={(request) => { setDetailTab('申请信息'); setDetail(request) }} onPreview={openProof} onApprove={setApproving} onReject={setRejecting} />
        <div className="sr-pagination">
          <span>共 {filteredRequests.length} 条</span>
          <select value={pageSize} onChange={changePageSize}>{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}条/页</option>)}</select>
          <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}><ChevronLeft size={14} /></button>
          <b>{currentPage}</b><span>/ {totalPages}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}><ChevronRight size={14} /></button>
        </div>
      </section>

      {detail && <RequestDetailModal key={`${detail.id}-${detail.status}-${detailTab}`} request={detail} initialTab={detailTab} onClose={() => setDetail(null)} notify={notify} />}
      {approving && <ConfirmModal request={approving} onClose={() => setApproving(null)} onConfirm={approve} />}
      {rejecting && <RejectModal request={rejecting} onClose={() => setRejecting(null)} onConfirm={reject} />}
    </div>
  )
}
