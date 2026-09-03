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
import { initialSecurityRecoveryRequests as sharedInitialSecurityRecoveryRequests } from './securityRecoveryData.js'
import './security-recovery.css'

export const SECURITY_RECOVERY_PATH = '/member/security-recovery'

export const SECURITY_RECOVERY_SOURCES = [
  '更换密保',
  '添加TRC20地址',
  '安全中心找回',
  'H5找回密码',
  '谷歌二次验证',
]

export const RECOVERY_TYPE_OPTIONS = [
  { value: '密保找回', label: '密保找回' },
  { value: '登录密码找回', label: '登录密码找回' },
  { value: '谷歌二次验证找回', label: '谷歌二次验证找回' },
]

export const SECURITY_RECOVERY_METHODS = [
  {
    value: '充值及提现资料核验',
    label: '充值及提现资料核验',
    condition: '最近充值截图与充值钱包地址、最近提现截图与提现钱包地址两项均需核对一致。',
  },
]

const PAGE_SIZES = [10, 20, 50]
const STATUS_OPTIONS = ['待审核', '审核通过', '已驳回']
export const initialSecurityRecoveryRequests = sharedInitialSecurityRecoveryRequests

function cloneInitialRequests() {
  return initialSecurityRecoveryRequests.map((request) => ({
    ...request,
    images: (request.images || request.screenshots || []).map((image) => ({ ...image })),
    recharge: request.recharge ? {
      ...request.recharge,
      screenshots: (request.recharge.screenshots || []).map((image) => ({ ...image })),
    } : undefined,
    withdrawal: request.withdrawal ? {
      ...request.withdrawal,
      screenshots: (request.withdrawal.screenshots || []).map((image) => ({ ...image })),
    } : undefined,
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

function normalizeEvidenceGroup(group, fallbackAddress = '', prefix = 'proof') {
  const source = group && typeof group === 'object' ? group : {}
  const screenshots = source.screenshots || source.images || source.evidenceImages || (source.screenshot ? [source.screenshot] : [])
  return {
    walletAddress: String(source.walletAddress || source.address || fallbackAddress || ''),
    historyWalletAddress: String(source.historyWalletAddress || source.referenceWalletAddress || source.walletAddress || source.address || fallbackAddress || ''),
    reference: String(source.reference || source.historyRecord || (prefix === 'recharge' ? '最近成功充值订单 · 演示历史记录' : '最近成功提现订单 · 演示历史记录')),
    images: screenshots.map((image, index) => {
      const normalized = normalizeImage(image, index)
      return { ...normalized, id: `${prefix}-${normalized.id}` }
    }),
  }
}

function sourceLabel(value) {
  const source = String(value || '')
  if (source.includes('google') || source.includes('谷歌')) return '谷歌二次验证'
  if (source.includes('recover-password') || source.includes('找回密码')) return 'H5找回密码'
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

function normalizeRecoveryType(value) {
  const type = String(value || '').toLowerCase()
  if (['login-password', 'login-password-reset', 'password', 'password-recovery'].includes(type) || type.includes('登录密码')) {
    return { key: 'login-password', label: '登录密码找回' }
  }
  if (['google-auth', 'google-auth-reset', 'google-2fa', 'totp-reset', '2fa-reset'].includes(type) || type.includes('google') || type.includes('谷歌')) {
    return { key: 'google-auth', label: '谷歌二次验证找回' }
  }
  return { key: 'security-recovery', label: '密保找回' }
}

function normalizeRequest(request, index) {
  const recoveryType = normalizeRecoveryType(request.recoveryType || request.requestType || request.recoveryTypeLabel)
  const recharge = normalizeEvidenceGroup(request.recharge, request.rechargeWalletAddress, 'recharge')
  const withdrawal = normalizeEvidenceGroup(request.withdrawal, request.withdrawalWalletAddress, 'withdrawal')
  const passwordSubmitted = Boolean(request.passwordSubmitted || (typeof request.newPassword === 'string' && request.newPassword.length))
  const safeRequest = { ...request }
  delete safeRequest.newPassword
  delete safeRequest.confirmPassword
  delete safeRequest.password
  delete safeRequest.answer
  delete safeRequest.securityAnswer
  delete safeRequest.reply
  delete safeRequest.response
  delete safeRequest.images
  delete safeRequest.screenshots
  delete safeRequest.evidenceImages
  return {
    ...safeRequest,
    id: String(request.id || request.requestNo || `MB-DEMO-${index + 1}`),
    memberId: String(request.memberId || request.userId || request.member?.id || '-'),
    username: request.username || request.member?.username || request.member?.user || '-',
    source: sourceLabel(request.source || request.sourcePage || request.applicationSource),
    recoveryType: recoveryType.key,
    recoveryTypeLabel: recoveryType.label,
    method: SECURITY_RECOVERY_METHODS[0].label,
    methodKey: 'transaction-proof',
    securityQuestion: request.securityQuestion || '',
    condition: SECURITY_RECOVERY_METHODS[0].condition,
    recharge,
    withdrawal,
    passwordSubmitted,
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

function RecoveryTypeBadge({ request }) {
  const typeClass = request.recoveryType === 'login-password' ? 'password' : request.recoveryType === 'google-auth' ? 'google' : 'security'
  return <span className={`sr-recovery-type ${typeClass}`}>{request.recoveryTypeLabel}</span>
}

function evidenceComplete(group) {
  return Boolean(group?.walletAddress?.trim() && group?.images?.length)
}

function ConfirmModal({ request, canConfirm = true, onClose, onConfirm, onBlocked }) {
  const isPassword = request.recoveryType === 'login-password'
  const isGoogleAuth = request.recoveryType === 'google-auth'
  return (
    <div className="sr-modal-layer sr-modal-top" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sr-confirm-dialog" role="alertdialog" aria-modal="true" aria-label="审核通过确认">
        <div className="sr-confirm-icon approved"><ShieldCheck size={24} /></div>
        <div className="sr-confirm-copy">
          <h3>确认审核通过</h3>
          {isPassword ? (
            <p>通过申请 <b>{request.id}</b> 后，会员 <b>{request.username}</b> 预先提交的新登录密码将生效。后台只确认“已安全提交”，始终不可查看密码明文。</p>
          ) : isGoogleAuth ? (
            <p>通过申请 <b>{request.id}</b> 后，会员 <b>{request.username}</b> 的谷歌二次验证将重置为“未绑定”，会员之后需重新绑定；不修改登录密码或密保。</p>
          ) : (
            <p>通过申请 <b>{request.id}</b> 后，会员 <b>{request.username}</b> 的密保将立即恢复为“未设置”状态，会员需重新设置密保。原密保答案不会被展示或恢复。</p>
          )}
          <div className={`sr-confirm-readiness ${canConfirm ? 'ready' : 'missing'}`}>{canConfirm ? '充值、提现两组材料已完成核对' : '请先完成充值和提现两组材料核对'}</div>
        </div>
        <button type="button" className="sr-icon-button sr-confirm-close" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        <footer><button type="button" className="btn btn-default" onClick={onClose}>取消</button><button type="button" className={`btn btn-primary ${canConfirm ? '' : 'sr-disabled-action'}`} aria-disabled={!canConfirm} onClick={() => canConfirm ? onConfirm() : onBlocked?.()}><Check size={14} />确认通过</button></footer>
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
      <section className="sr-reject-dialog" role="dialog" aria-modal="true" aria-label="驳回会员找回申请">
        <header><div><XCircle size={19} /><b>驳回会员找回申请</b></div><button type="button" className="sr-icon-button" onClick={onClose} aria-label="关闭"><X size={18} /></button></header>
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

function EvidenceGroupCard({ title, group, checked, onCheck, onPreview, notify }) {
  const complete = evidenceComplete(group)
  const copyAddress = () => {
    if (!group.walletAddress) return notify('未提交可复制的钱包地址', 'error')
    navigator.clipboard?.writeText(group.walletAddress)
    notify(`${title}钱包地址已复制`)
  }
  return (
    <section className={`sr-transaction-proof-card ${complete ? 'complete' : 'incomplete'}`}>
      <header>
        <div><b>{title}</b><span>{complete ? '材料完整' : '材料不完整'}</span></div>
        <em>{group.images.length} 张截图</em>
      </header>
      <div className="sr-wallet-address-row">
        <span>会员提交地址</span>
        <code title={group.walletAddress}>{group.walletAddress || '未提交'}</code>
        <button type="button" disabled={!group.walletAddress} onClick={copyAddress}><ClipboardCopy size={13} />复制</button>
      </div>
      <div className="sr-history-reference">
        <span>历史演示记录</span>
        <div><b>{group.reference}</b><code title={group.historyWalletAddress}>{group.historyWalletAddress || '暂无历史地址'}</code></div>
      </div>
      {group.images.length ? <div className="sr-image-grid">{group.images.map((image) => <button type="button" key={image.id} onClick={() => onPreview(image)}><img src={image.url} alt={image.name} /><span><FileImage size={13} />{image.name}</span><em><Eye size={15} />查看大图</em></button>)}</div> : <div className="sr-no-images"><ImageIcon size={26} /><span>未提交{title}截图</span></div>}
      <label className={`sr-proof-check ${checked ? 'checked' : ''} ${complete ? '' : 'disabled'}`}>
        <input type="checkbox" checked={Boolean(checked)} disabled={!complete} onChange={(event) => onCheck(event.target.checked)} />
        <span>{title}截图与钱包地址核对一致</span>
        {!complete && <small>地址和截图均齐全后才可勾选</small>}
      </label>
    </section>
  )
}

function RequestDetailModal({ request, initialTab = '申请信息', proofCheck, onProofCheckChange, onApprove, onClose, notify }) {
  const tabs = ['申请信息', '核验材料', '审核记录']
  const [tab, setTab] = useState(initialTab)
  const [preview, setPreview] = useState(null)
  const isPassword = request.recoveryType === 'login-password'
  const isGoogleAuth = request.recoveryType === 'google-auth'
  const rechargeChecked = request.status === '审核通过' || Boolean(proofCheck?.recharge)
  const withdrawalChecked = request.status === '审核通过' || Boolean(proofCheck?.withdrawal)
  const checksComplete = rechargeChecked && withdrawalChecked && (!isPassword || request.passwordSubmitted)
  return (
    <div className="sr-modal-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sr-detail-dialog" role="dialog" aria-modal="true" aria-label={`会员找回审核详情 ${request.id}`}>
        <header className="sr-dialog-header">
          <div><b>会员找回审核详情</b><span>{request.id}</span><StatusBadge status={request.status} /></div>
          <button type="button" className="sr-icon-button" onClick={onClose} aria-label="关闭"><X size={19} /></button>
        </header>
        <nav className="sr-detail-tabs">{tabs.map((name) => <button type="button" key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}</nav>
        <div className="sr-detail-body">
          {tab === '申请信息' && (
            <div className="sr-detail-grid">
              <DetailRow label="申请单号"><b>{request.id}</b></DetailRow>
              <DetailRow label="会员信息"><b>{request.username}</b><small>ID：{request.memberId}</small></DetailRow>
              <DetailRow label="找回类型"><RecoveryTypeBadge request={request} /></DetailRow>
              <DetailRow label="申请来源">{request.source}</DetailRow>
              <DetailRow label="核验方式">{request.method}</DetailRow>
              {isPassword ? <DetailRow label="新密码提交"><span className={`sr-password-submitted ${request.passwordSubmitted ? 'yes' : 'no'}`}><ShieldCheck size={14} />{request.passwordSubmitted ? '已安全提交' : '未完成提交'}</span><small>为保护会员账号，审核后台不可查看密码明文</small></DetailRow> : isGoogleAuth ? <DetailRow label="解绑目标"><span className="sr-password-submitted yes"><ShieldCheck size={14} />谷歌二次验证绑定</span><small>审核后台不展示验证密钥或动态验证码</small></DetailRow> : <DetailRow label="原密保问题">{request.securityQuestion || '未提供 / 尚未设置'}</DetailRow>}
              <DetailRow label="提交时间">{request.submittedAt}</DetailRow>
              <DetailRow label="审核状态"><StatusBadge status={request.status} /></DetailRow>
            </div>
          )}
          {tab === '核验材料' && (
            <div className="sr-proof-detail">
              <section className="sr-condition-card"><span>本次核验条件</span><p>{request.condition}</p></section>
              <EvidenceGroupCard title="充值材料" group={request.recharge} checked={rechargeChecked} onCheck={(checked) => onProofCheckChange('recharge', checked)} onPreview={setPreview} notify={notify} />
              <EvidenceGroupCard title="提现材料" group={request.withdrawal} checked={withdrawalChecked} onCheck={(checked) => onProofCheckChange('withdrawal', checked)} onPreview={setPreview} notify={notify} />
              <div className={`sr-proof-result ${checksComplete ? 'ready' : 'pending'}`}><ShieldCheck size={18} /><div><b>{checksComplete ? '两项材料均已核对一致' : '需完成两项材料核对'}</b><span>{checksComplete ? (request.status === '待审核' ? '可进入审核通过确认' : '该申请已按双组资料完成核验') : (isPassword && !request.passwordSubmitted ? '还需确认新密码已安全提交' : '充值与提现核对项均勾选后才可通过')}</span></div></div>
            </div>
          )}
          {tab === '审核记录' && (
            <div className="sr-review-record">
              <div className="sr-review-timeline-item submitted"><i /><div><b>会员提交{request.recoveryTypeLabel}申请</b><p>{request.username} 通过“{request.source}”提交“{request.method}”材料。</p><span>{request.submittedAt}</span></div></div>
              {request.status === '待审核' ? <div className="sr-review-pending"><LoaderCircle size={20} /><div><b>等待客服审核</b><p>当前申请尚未处理，客服审核通过或驳回后将在此处生成记录。</p></div></div> : <div className={`sr-review-timeline-item ${statusClass(request.status)}`}><i /><div><b>{request.status}</b><p>{request.reviewRemark || (request.status === '审核通过' ? (isPassword ? '充值与提现材料核对通过，预提交的新登录密码已生效。' : isGoogleAuth ? '充值与提现材料核对通过，谷歌二次验证已重置为未绑定，会员需重新绑定。' : '客服核验通过，会员密保已恢复为未设置状态。') : '申请材料未通过审核。')}</p><span>客服账号：{request.reviewer || 'admin1'}　{request.reviewedAt || '-'}</span></div></div>}
            </div>
          )}
        </div>
        <footer className="sr-dialog-footer">
          <button type="button" className="btn btn-default" onClick={onClose}>关闭</button>
          {request.status === '待审核' && <button type="button" className={`btn btn-primary ${checksComplete ? '' : 'sr-disabled-action'}`} aria-disabled={!checksComplete} onClick={() => checksComplete ? onApprove(request) : notify('请先勾选“充值材料核对一致”和“提现材料核对一致”', 'error')}><CheckCircle2 size={14} />审核通过</button>}
        </footer>
      </section>
      <ImagePreview image={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

function RecoveryTable({ rows, loading, onView, onPreview, onApprove, onReject }) {
  return (
    <div className="sr-table-scroll">
      <table className="sr-table">
        <thead><tr><th>申请单号</th><th>会员信息</th><th>找回类型</th><th>申请来源</th><th>核验方式</th><th>核验条件</th><th>核验材料</th><th>提交时间</th><th>审核状态</th><th>审核信息</th><th>操作</th></tr></thead>
        <tbody>
          {loading ? <tr><td colSpan="11"><div className="sr-table-state"><LoaderCircle className="sr-spin" size={23} /><span>加载中...</span></div></td></tr> : rows.length ? rows.map((request) => {
            const isPassword = request.recoveryType === 'login-password'
            return <tr key={request.id}>
              <td><b className="sr-order-number">{request.id}</b></td>
              <td><div className="sr-member-cell"><b>{request.username}</b><span>ID：{request.memberId}</span></div></td>
              <td><RecoveryTypeBadge request={request} /></td>
              <td><span className="sr-source-cell">{request.source}</span></td>
              <td><span className="sr-method-cell">{request.method}</span></td>
              <td><p className="sr-clamped" title={request.condition}>{request.condition}</p></td>
              <td><div className="sr-material-cell"><p>充值：地址 + {request.recharge.images.length} 张截图</p><p>提现：地址 + {request.withdrawal.images.length} 张截图</p><button type="button" onClick={() => onPreview(request)}><ShieldCheck size={13} />{isPassword ? (request.passwordSubmitted ? '新密码已安全提交' : '新密码未提交') : '查看双组核验资料'}</button></div></td>
              <td><span className="sr-time-cell">{request.submittedAt}</span></td>
              <td><StatusBadge status={request.status} /></td>
              <td><div className="sr-reviewer-cell">{request.status === '待审核' ? <span>等待审核</span> : <><b>{request.reviewer || '-'}</b><span>{request.reviewedAt || '-'}</span><small title={request.reviewRemark}>{request.reviewRemark || '-'}</small></>}</div></td>
              <td><div className="sr-row-actions"><button type="button" onClick={() => onView(request)}><Eye size={13} />查看</button>{request.status === '待审核' && <><button type="button" className="approve" onClick={() => onApprove(request)}><CheckCircle2 size={13} />通过</button><button type="button" className="reject" onClick={() => onReject(request)}><XCircle size={13} />驳回</button></>}</div></td>
            </tr>
          }) : <tr><td colSpan="11"><div className="sr-table-state empty"><FileImage size={28} /><b>暂无符合条件的会员找回申请</b><span>请调整筛选条件后重新查询</span></div></td></tr>}
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
  const emptyFilters = { keyword: '', type: '全部', source: '全部', method: '全部', status: '全部', start: '', end: '' }
  const [draft, setDraft] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [detail, setDetail] = useState(null)
  const [detailTab, setDetailTab] = useState('申请信息')
  const [approving, setApproving] = useState(null)
  const [rejecting, setRejecting] = useState(null)
  const [proofChecks, setProofChecks] = useState({})
  const timerRef = useRef(null)

  const counts = useMemo(() => normalizedRequests.reduce((result, request) => ({
    ...result,
    [request.status]: (result[request.status] || 0) + 1,
  }), {}), [normalizedRequests])

  const filteredRequests = useMemo(() => normalizedRequests.filter((request) => {
    const keyword = applied.keyword.trim().toLowerCase()
    if (keyword && !`${request.id} ${request.memberId} ${request.username} ${request.recharge.walletAddress} ${request.withdrawal.walletAddress}`.toLowerCase().includes(keyword)) return false
    if (applied.type !== '全部' && request.recoveryTypeLabel !== applied.type) return false
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

  const runRefresh = useCallback((message = '会员找回审核数据已刷新') => {
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
    runRefresh('查询成功，已更新会员找回申请列表')
  }

  const reset = () => {
    const next = { ...emptyFilters }
    setDraft(next)
    setApplied(next)
    setCurrentPage(1)
    runRefresh('已重置会员找回审核筛选条件')
  }

  const exportRows = () => {
    const columns = ['申请单号', '会员ID', '用户名', '找回类型', '申请来源', '核验方式', '核验条件', '充值会员提交地址', '充值历史模拟记录', '充值历史地址', '充值截图数量', '提现会员提交地址', '提现历史模拟记录', '提现历史地址', '提现截图数量', '新密码提交状态', '提交时间', '审核状态', '审核人', '审核时间', '审核说明']
    const values = filteredRequests.map((request) => [request.id, request.memberId, request.username, request.recoveryTypeLabel, request.source, request.method, request.condition, request.recharge.walletAddress || '-', request.recharge.reference || '-', request.recharge.historyWalletAddress || '-', request.recharge.images.length, request.withdrawal.walletAddress || '-', request.withdrawal.reference || '-', request.withdrawal.historyWalletAddress || '-', request.withdrawal.images.length, request.recoveryType === 'login-password' ? (request.passwordSubmitted ? '已安全提交（不可查看）' : '未提交') : '-', request.submittedAt, request.status, request.reviewer || '-', request.reviewedAt || '-', request.reviewRemark || '-'])
    const csv = [columns, ...values].map((row) => row.map(quoteCsv).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = '会员找回审核-演示数据.csv'
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    notify(`已导出 ${filteredRequests.length} 条会员找回审核记录`)
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
    const isPassword = approving.recoveryType === 'login-password'
    const isGoogleAuth = approving.recoveryType === 'google-auth'
    const check = proofChecks[approving.id] || {}
    if (!evidenceComplete(approving.recharge) || !evidenceComplete(approving.withdrawal) || !check.recharge || !check.withdrawal) {
      notify('充值、提现截图和对应地址均齐全且核对一致后才可通过', 'error')
      return
    }
    if (isPassword && !approving.passwordSubmitted) {
      notify('该申请未完成新密码安全提交，不可通过', 'error')
      return
    }
    const reviewRemark = isPassword ? '运营核对充值与提现材料一致，预提交的新登录密码已生效。' : isGoogleAuth ? '运营核对充值与提现材料一致，谷歌二次验证已重置为未绑定，会员需重新绑定。' : '客服核验通过，会员密保已恢复为未设置状态。'
    const updated = updateStatus(approving, {
      status: '审核通过',
      reviewer: 'admin1',
      reviewedAt: currentReviewTime(),
      rejectReason: '',
      reviewRemark,
      ...(isPassword ? { passwordEffective: true } : {}),
    })
    setApproving(null)
    setDetail((current) => current?.id === updated.id ? normalizeRequest(updated, 0) : current)
    if (typeof onApprove === 'function') onApprove(normalizeRequest(updated, 0))
    notify(isPassword ? `申请 ${updated.id} 已审核通过，预提交的新登录密码已生效` : isGoogleAuth ? `申请 ${updated.id} 已审核通过，谷歌二次验证已重置为未绑定` : `申请 ${updated.id} 已审核通过，会员密保已还原为未设置状态`)
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

  const updateProofCheck = (requestId, key, checked) => {
    setProofChecks((current) => ({ ...current, [requestId]: { ...(current[requestId] || {}), [key]: checked } }))
  }

  const attemptApprove = (request) => {
    if (!evidenceComplete(request.recharge) || !evidenceComplete(request.withdrawal)) {
      notify('充值、提现两组资料都必须包含截图和对应钱包地址', 'error')
      openProof(request)
      return
    }
    if (request.recoveryType === 'login-password' && !request.passwordSubmitted) {
      notify('该申请未完成新密码安全提交，不可通过', 'error')
      openProof(request)
      return
    }
    const check = proofChecks[request.id] || {}
    if (!check.recharge || !check.withdrawal) {
      notify('请先在核验材料中勾选充值、提现两项核对结果', 'error')
      openProof(request)
      return
    }
    setApproving(request)
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
        <div><b>会员找回审核</b><p>密保找回、登录密码找回与谷歌二次验证找回统一核对最近充值、提现截图及对应钱包地址，两组资料均一致后才可通过；后台不展示密码、密保答案或验证密钥。</p></div>
        <button type="button" className="btn btn-default" onClick={() => runRefresh()}>{loading ? <LoaderCircle className="sr-spin" size={14} /> : <RefreshCw size={14} />}刷新</button>
      </section>

      <section className="sr-summary">
        <div><span>全部申请</span><b>{normalizedRequests.length}</b><small>当前演示数据</small></div>
        <div className="pending"><span>待审核</span><b>{counts['待审核'] || 0}</b><small>需要运营处理</small></div>
        <div className="approved"><span>审核通过</span><b>{counts['审核通过'] || 0}</b><small>已完成对应找回处理</small></div>
        <div className="rejected"><span>已驳回</span><b>{counts['已驳回'] || 0}</b><small>已记录驳回原因</small></div>
      </section>

      <section className="panel sr-filter-panel">
        <div className="sr-filter-grid">
          <label><span>申请 / 会员关键词</span><input value={draft.keyword} onChange={(event) => setDraft((old) => ({ ...old, keyword: event.target.value }))} placeholder="申请单号 / 会员ID / 用户名" /></label>
          <label><span>找回类型</span><select value={draft.type} onChange={(event) => setDraft((old) => ({ ...old, type: event.target.value }))}><option>全部</option>{RECOVERY_TYPE_OPTIONS.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
          <label><span>申请来源</span><select value={draft.source} onChange={(event) => setDraft((old) => ({ ...old, source: event.target.value }))}><option>全部</option>{SECURITY_RECOVERY_SOURCES.map((source) => <option key={source}>{source}</option>)}</select></label>
          <label><span>核验方式</span><select value={draft.method} onChange={(event) => setDraft((old) => ({ ...old, method: event.target.value }))}><option>全部</option>{SECURITY_RECOVERY_METHODS.map((method) => <option key={method.value}>{method.label}</option>)}</select></label>
          <label><span>审核状态</span><select value={draft.status} onChange={(event) => setDraft((old) => ({ ...old, status: event.target.value }))}><option>全部</option>{STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="sr-date-filter"><span>提交时间</span><div><input type="date" value={draft.start} onChange={(event) => setDraft((old) => ({ ...old, start: event.target.value }))} /><em>至</em><input type="date" value={draft.end} onChange={(event) => setDraft((old) => ({ ...old, end: event.target.value }))} /></div></label>
          <div className="sr-filter-actions"><button type="button" className="btn btn-primary" onClick={query}><Search size={14} />查询</button><button type="button" className="btn btn-default" onClick={reset}><RotateCcw size={14} />重置</button></div>
        </div>
      </section>

      <section className="panel sr-table-panel">
        <div className="sr-table-toolbar">
          <div><b>会员找回审核申请</b><span>三种找回均须同时核对充值、提现截图及对应钱包地址</span></div>
          <div><button type="button" className="btn btn-default" onClick={exportRows}><Download size={14} />导出</button><span>共 <b>{filteredRequests.length}</b> 条</span></div>
        </div>
        <RecoveryTable rows={pageRows} loading={loading} onView={(request) => { setDetailTab('申请信息'); setDetail(request) }} onPreview={openProof} onApprove={attemptApprove} onReject={setRejecting} />
        <div className="sr-pagination">
          <span>共 {filteredRequests.length} 条</span>
          <select value={pageSize} onChange={changePageSize}>{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}条/页</option>)}</select>
          <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}><ChevronLeft size={14} /></button>
          <b>{currentPage}</b><span>/ {totalPages}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}><ChevronRight size={14} /></button>
        </div>
      </section>

      {detail && <RequestDetailModal key={`${detail.id}-${detail.status}-${detailTab}`} request={detail} initialTab={detailTab} proofCheck={proofChecks[detail.id] || {}} onProofCheckChange={(key, checked) => updateProofCheck(detail.id, key, checked)} onApprove={attemptApprove} onClose={() => setDetail(null)} notify={notify} />}
      {approving && <ConfirmModal request={approving} canConfirm={Boolean(evidenceComplete(approving.recharge) && evidenceComplete(approving.withdrawal) && proofChecks[approving.id]?.recharge && proofChecks[approving.id]?.withdrawal && (approving.recoveryType !== 'login-password' || approving.passwordSubmitted))} onBlocked={() => notify('请先完成充值和提现两项材料核对', 'error')} onClose={() => setApproving(null)} onConfirm={approve} />}
      {rejecting && <RejectModal request={rejecting} onClose={() => setRejecting(null)} onConfirm={reject} />}
    </div>
  )
}
