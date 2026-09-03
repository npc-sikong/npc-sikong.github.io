import { useEffect, useId, useMemo, useState } from 'react'
import { ImagePlus, ShieldCheck, Trash2 } from 'lucide-react'
import { Field, Hint, Modal, PrimaryButton, Segmented } from './accountUi'
import './security-recovery.css'

export const SECURITY_RECOVERY_METHODS = [
  {
    value: 'transaction-proof',
    label: '充值及提现资料核验',
    condition: '最近充值截图和充值钱包地址、最近提现截图和提现钱包地址四项必须同时提供。',
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

function formatRequestDay(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

function ProofGroup({
  title,
  addressLabel,
  address,
  onAddressChange,
  screenshot,
  uploadId,
  onChoose,
  onRemove,
}) {
  const completed = Number(Boolean(address.trim())) + Number(Boolean(screenshot))
  return (
    <section className={`sfa-security-recovery-proof ${completed === 2 ? 'is-complete' : ''}`}>
      <header>
        <div>
          <strong>{title}</strong>
          <small>截图与对应钱包地址必须同时提供</small>
        </div>
        <span>{completed}/2</span>
      </header>

      <Field
        label={`${addressLabel}（必填）`}
        value={address}
        onChange={onAddressChange}
        placeholder={`请输入${addressLabel}`}
        maxLength={120}
      />

      <div className="sfa-security-recovery-upload">
        <div>
          <b>{title}截图（必填）</b>
          <small>1 张 JPG/PNG，单张不超过 5MB</small>
        </div>
        <label htmlFor={uploadId}><ImagePlus size={17} />{screenshot ? '更换截图' : '选择截图'}</label>
        <input id={uploadId} type="file" accept="image/jpeg,image/png" onChange={onChoose} />
      </div>

      {screenshot ? (
        <figure className="sfa-security-recovery-preview">
          <img src={screenshot.dataUrl} alt={`${title}截图预览`} />
          <figcaption>
            <b title={screenshot.name}>{screenshot.name}</b>
            <small>{Math.max(1, Math.ceil(screenshot.size / 1024))} KB · 仅本机预览</small>
          </figcaption>
          <button type="button" aria-label={`删除${title}截图`} onClick={onRemove}><Trash2 size={15} /></button>
        </figure>
      ) : null}
    </section>
  )
}

export default function SecurityRecoveryModal({
  open,
  onClose,
  onSubmit,
  onDirectVerified,
  recoveryRequests = [],
  sourcePage = '更换密保',
  currentQuestion = '',
  memberId = '133',
  username = 'evan777',
  title = '找回密保',
  recoveryType = 'security-question',
  recoveryTypeLabel = '密保找回',
  headingTitle = '充值与提现资料双重核验',
  completionText = '客服核对充值和提现两组资料后，审核通过会将密保恢复为未设置状态。',
  transactionActionLabel = '提交找回申请',
  directActionLabel = '验证并解绑',
  directSecurity = null,
}) {
  const rechargeUploadId = useId()
  const withdrawalUploadId = useId()
  const [rechargeAddress, setRechargeAddress] = useState('')
  const [withdrawalAddress, setWithdrawalAddress] = useState('')
  const [rechargeScreenshot, setRechargeScreenshot] = useState(null)
  const [withdrawalScreenshot, setWithdrawalScreenshot] = useState(null)
  const [mode, setMode] = useState(directSecurity ? 'question' : 'transaction')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [error, setError] = useState('')
  const pendingRequest = useMemo(
    () => (recoveryRequests || []).find((request) => String(request.memberId) === String(memberId) && request.status === '待审核'),
    [memberId, recoveryRequests],
  )
  const complete = Boolean(
    rechargeAddress.trim()
    && rechargeScreenshot
    && withdrawalAddress.trim()
    && withdrawalScreenshot,
  )

  useEffect(() => {
    if (!open) return
    setRechargeAddress('')
    setWithdrawalAddress('')
    setRechargeScreenshot(null)
    setWithdrawalScreenshot(null)
    setMode(directSecurity ? 'question' : 'transaction')
    setSecurityAnswer('')
    setError('')
  }, [open])

  const updateAddress = (setter) => (value) => {
    setter(value.slice(0, 120))
    setError('')
  }

  const chooseImage = async (event, kind) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('截图仅支持 JPG、JPEG 或 PNG 格式')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('单张截图不能超过 5MB')
      return
    }
    try {
      const image = await readImage(file)
      if (kind === 'recharge') setRechargeScreenshot(image)
      else setWithdrawalScreenshot(image)
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
    if (!rechargeAddress.trim() || !rechargeScreenshot) {
      setError('请同时提供最近充值截图和充值钱包地址')
      return
    }
    if (!withdrawalAddress.trim() || !withdrawalScreenshot) {
      setError('请同时提供最近提现截图和提现钱包地址')
      return
    }

    const now = new Date()
    const sequence = String((recoveryRequests?.length || 0) + 1).padStart(4, '0')
    const requestPrefix = recoveryType === 'google-auth' ? 'GR' : 'SR'
    const requestNo = `${requestPrefix}${formatRequestDay(now)}${sequence}`
    const normalizedRechargeAddress = rechargeAddress.trim()
    const normalizedWithdrawalAddress = withdrawalAddress.trim()
    const request = {
      id: requestNo,
      requestNo,
      recoveryType,
      recoveryTypeLabel,
      memberId,
      username,
      sourcePage,
      securityQuestion: currentQuestion || '-',
      method: 'transaction-proof',
      methodLabel: SECURITY_RECOVERY_METHODS[0].label,
      condition: SECURITY_RECOVERY_METHODS[0].condition,
      recharge: {
        walletAddress: normalizedRechargeAddress,
        historyWalletAddress: normalizedRechargeAddress,
        reference: '最近成功充值记录 · 由客服对照平台历史核验',
        screenshots: [rechargeScreenshot],
      },
      withdrawal: {
        walletAddress: normalizedWithdrawalAddress,
        historyWalletAddress: normalizedWithdrawalAddress,
        reference: '最近成功提现记录 · 由客服对照平台历史核验',
        screenshots: [withdrawalScreenshot],
      },
      reply: `充值钱包地址：${normalizedRechargeAddress}；提现钱包地址：${normalizedWithdrawalAddress}`,
      screenshots: [rechargeScreenshot, withdrawalScreenshot],
      passwordSubmitted: false,
      status: '待审核',
      submittedAt: formatSubmittedAt(now),
      reviewer: '',
      reviewedAt: '',
      rejectReason: '',
    }
    const accepted = onSubmit?.(request)
    if (accepted === false) setError('该会员已有待审核申请，请勿重复提交')
  }

  const verifySecurity = () => {
    const expectedAnswer = String(directSecurity?.answer || '').trim()
    if (!directSecurity?.question || !expectedAnswer) {
      setError('当前账户未设置可用密保，请改用交易资料申请')
      return
    }
    if (!securityAnswer.trim()) {
      setError('请输入密保答案')
      return
    }
    if (securityAnswer.trim() !== expectedAnswer) {
      setError('密保答案不正确，请重新输入')
      return
    }
    setError('')
    onDirectVerified?.()
  }

  const isDirectMode = Boolean(directSecurity) && mode === 'question'
  const footerAction = isDirectMode ? verifySecurity : submit
  const footerDisabled = isDirectMode
    ? !securityAnswer.trim()
    : Boolean(pendingRequest) || !complete

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      className="sfa-recovery-modal"
      overlayClassName="sfa-overlay--nested"
      footer={<PrimaryButton disabled={footerDisabled} onClick={footerAction}>{isDirectMode ? directActionLabel : transactionActionLabel}</PrimaryButton>}
    >
      {directSecurity ? <Segmented items={[{ value: 'question', label: '通过密保找回' }, { value: 'transaction', label: '交易资料找回' }]} value={mode} onChange={(value) => { setMode(value); setError('') }} /> : null}
      {isDirectMode ? (
        <div className="sfa-security-recovery-direct">
          <div className="sfa-recovery-heading">
            <span><ShieldCheck size={24} /></span>
            <div><strong>验证当前账户密保</strong><small>答案核验通过后将立即解绑谷歌验证器，不进入人工审核</small></div>
          </div>
          <div className="sfa-security-recovery-question">
            <small>当前密保问题</small>
            <strong>{directSecurity.question || '尚未设置密保'}</strong>
            <p>密保提示：{directSecurity.tip || '-'}</p>
          </div>
          <Field label="密保答案" value={securityAnswer} onChange={(value) => { setSecurityAnswer(value.slice(0, 100)); setError('') }} placeholder="请输入密保答案" maxLength={100} />
          <Hint>本方式无需填写新密码，密保答案正确后仅解除当前谷歌二次验证绑定。</Hint>
        </div>
      ) : (
        <>
          {pendingRequest ? <Hint tone="warning">已有申请 {pendingRequest.requestNo || pendingRequest.id} 正在审核，同一会员审核期间不能重复提交。</Hint> : null}
          <div className="sfa-recovery-heading">
            <span><ShieldCheck size={24} /></span>
            <div><strong>{headingTitle}</strong><small>两组材料共四项全部提交后，才可进入客服审核</small></div>
          </div>

          <div className="sfa-security-recovery-rule">
            <b>提交条件</b>
            <span>最近充值截图 + 充值钱包地址</span>
            <i>且</i>
            <span>最近提现截图 + 提现钱包地址</span>
          </div>

          <div className="sfa-security-recovery-proofs">
            <ProofGroup
              title="最近充值资料"
              addressLabel="充值钱包地址"
              address={rechargeAddress}
              onAddressChange={updateAddress(setRechargeAddress)}
              screenshot={rechargeScreenshot}
              uploadId={rechargeUploadId}
              onChoose={(event) => chooseImage(event, 'recharge')}
              onRemove={() => { setRechargeScreenshot(null); setError('') }}
            />
            <ProofGroup
              title="最近提现资料"
              addressLabel="提现钱包地址"
              address={withdrawalAddress}
              onAddressChange={updateAddress(setWithdrawalAddress)}
              screenshot={withdrawalScreenshot}
              uploadId={withdrawalUploadId}
              onChoose={(event) => chooseImage(event, 'withdrawal')}
              onRemove={() => { setWithdrawalScreenshot(null); setError('') }}
            />
          </div>
        </>
      )}

      {error ? <div className="sfa-form-error" role="alert">{error}</div> : null}
      {!isDirectMode ? <Hint tone="warning">{completionText} 本页仅作演示，请勿填写真实钱包敏感信息，或上传含私钥、助记词的图片；截图只在本机预览。</Hint> : null}
    </Modal>
  )
}
