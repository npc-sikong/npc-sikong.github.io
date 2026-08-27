import { useEffect, useId, useMemo, useState } from 'react'
import { ImagePlus, ShieldCheck, Trash2 } from 'lucide-react'
import { Field, Hint, Modal, PrimaryButton } from './accountUi'
import './security-recovery.css'

export const SECURITY_RECOVERY_METHODS = [
  {
    value: 'first-deposit',
    label: '首次充值',
    condition: '提供首次充值的币种、金额、日期或订单号，或上传当次充值截图。',
    placeholder: '例如：首次充值 100 USDT，约在 2026-08-01 完成',
  },
  {
    value: 'recent-withdrawal',
    label: '最近成功提现',
    condition: '提供最近一笔成功提现的币种、金额、时间及收款地址后 6 位，或上传提现记录截图。',
    placeholder: '例如：最近提现 50 USDT，收款地址尾号 2P3S',
  },
  {
    value: 'common-wallet',
    label: '历史常用钱包',
    condition: '提供历史常用钱包地址或地址尾号，并说明充值、提现等使用场景，或上传钱包记录截图。',
    placeholder: '例如：常用 TRC20 钱包地址尾号 2P3S，曾用于充值',
  },
]

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: String(reader.result || ''),
    })
    reader.onerror = () => reject(new Error('图片读取失败，请重新选择'))
    reader.readAsDataURL(file)
  })
}

function formatSubmittedAt(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function SecurityRecoveryModal({
  open,
  onClose,
  onSubmit,
  recoveryRequests = [],
  sourcePage = '更换密保',
  currentQuestion = '',
  memberId = '133',
  username = 'evan777',
}) {
  const uploadId = useId()
  const [method, setMethod] = useState(SECURITY_RECOVERY_METHODS[0].value)
  const [reply, setReply] = useState('')
  const [screenshots, setScreenshots] = useState([])
  const [error, setError] = useState('')
  const selectedMethod = useMemo(
    () => SECURITY_RECOVERY_METHODS.find((item) => item.value === method) || SECURITY_RECOVERY_METHODS[0],
    [method],
  )
  const pendingRequest = useMemo(
    () => (recoveryRequests || []).find((request) => String(request.memberId) === String(memberId) && request.status === '待审核'),
    [memberId, recoveryRequests],
  )

  useEffect(() => {
    if (!open) return
    setMethod(SECURITY_RECOVERY_METHODS[0].value)
    setReply('')
    setScreenshots([])
    setError('')
  }, [open])

  const chooseImages = async (event) => {
    const input = event.currentTarget
    const candidates = Array.from(input.files || [])
    input.value = ''
    if (!candidates.length) return
    if (screenshots.length + candidates.length > 3) {
      setError('最多上传 3 张截图')
      return
    }
    const invalidType = candidates.find((file) => !['image/jpeg', 'image/png'].includes(file.type))
    if (invalidType) {
      setError('仅支持 JPG、JPEG 或 PNG 图片')
      return
    }
    const oversized = candidates.find((file) => file.size > 5 * 1024 * 1024)
    if (oversized) {
      setError('单张图片不能超过 5MB')
      return
    }
    try {
      const nextImages = await Promise.all(candidates.map(readImage))
      setScreenshots((current) => [...current, ...nextImages].slice(0, 3))
      setError('')
    } catch (readError) {
      setError(readError.message || '图片读取失败，请重新选择')
    }
  }

  const submit = () => {
    if (pendingRequest) {
      setError(`申请 ${pendingRequest.requestNo || pendingRequest.id} 正在审核，请勿重复提交`)
      return
    }
    const normalizedReply = reply.trim()
    if (!normalizedReply && !screenshots.length) {
      setError('请填写核验信息或至少上传 1 张截图')
      return
    }
    const sequence = String((recoveryRequests?.length || 0) + 1).padStart(4, '0')
    const request = {
      id: `SR20260828${sequence}`,
      requestNo: `SR20260828${sequence}`,
      memberId,
      username,
      sourcePage,
      securityQuestion: currentQuestion || '-',
      method: selectedMethod.value,
      methodLabel: selectedMethod.label,
      condition: selectedMethod.condition,
      reply: normalizedReply,
      screenshots,
      status: '待审核',
      submittedAt: formatSubmittedAt(),
    }
    onSubmit?.(request)
  }

  return (
    <Modal
      open={open}
      title="找回密保"
      onClose={onClose}
      className="sfa-recovery-modal"
      overlayClassName="sfa-overlay--nested"
      footer={<PrimaryButton disabled={Boolean(pendingRequest) || (!reply.trim() && !screenshots.length)} onClick={submit}>提交找回申请</PrimaryButton>}
    >
      {pendingRequest ? <Hint tone="warning">已有申请 {pendingRequest.requestNo || pendingRequest.id} 正在审核，请等待运营处理后再提交新的申请。</Hint> : null}
      <div className="sfa-recovery-heading">
        <span><ShieldCheck size={24} /></span>
        <div><strong>请选择身份核验方式</strong><small>提交后由客服审核，通过后密保将恢复为未设置状态</small></div>
      </div>

      <div className="sfa-recovery-methods" role="radiogroup" aria-label="身份核验方式">
        {SECURITY_RECOVERY_METHODS.map((item) => (
          <button
            type="button"
            role="radio"
            aria-checked={method === item.value}
            className={method === item.value ? 'is-active' : ''}
            key={item.value}
            onClick={() => { setMethod(item.value); setError('') }}
          >
            <strong>{item.label}</strong>
            <small>{item.condition}</small>
          </button>
        ))}
      </div>

      <Field
        textarea
        label={`${selectedMethod.label}核验信息`}
        value={reply}
        onChange={(value) => { setReply(value.slice(0, 300)); setError('') }}
        placeholder={selectedMethod.placeholder}
        maxLength={300}
      />
      <small className="sfa-recovery-counter">{reply.length}/300</small>

      <div className="sfa-recovery-upload">
        <div><strong>凭证截图（选填）</strong><small>最多 3 张，支持 JPG、PNG，单张不超过 5MB</small></div>
        <label htmlFor={uploadId}><ImagePlus size={18} />选择截图</label>
        <input id={uploadId} type="file" accept="image/jpeg,image/png" multiple onChange={chooseImages} />
      </div>

      {screenshots.length ? <div className="sfa-recovery-previews">{screenshots.map((image, index) => (
        <figure key={`${image.name}-${index}`}>
          <img src={image.dataUrl} alt={`凭证截图 ${index + 1}`} />
          <figcaption title={image.name}>{image.name}</figcaption>
          <button type="button" aria-label={`删除截图 ${index + 1}`} onClick={() => setScreenshots((items) => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button>
        </figure>
      ))}</div> : null}

      {error ? <div className="sfa-form-error" role="alert">{error}</div> : null}
      <Hint tone="warning">仅用于本地演示，请勿填写真实密码、完整身份资料，或上传包含私钥、助记词的图片；所选图片只在本机预览，不会上传网络。</Hint>
    </Modal>
  )
}
