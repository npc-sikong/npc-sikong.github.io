import { useState } from 'react'
import { BookOpenText } from 'lucide-react'
import { getModuleRequirement } from '../requirements.js'
import { Modal, PrimaryButton } from './accountUi'

export default function StorefrontRequirementEntry({ path }) {
  const [open, setOpen] = useState(false)
  const requirement = getModuleRequirement(path)
  if (!requirement) return null

  const logicRows = [
    ['查询 / 查看逻辑', requirement.queryLogic],
    ['操作逻辑', requirement.operationLogic],
    ['状态逻辑', requirement.stateLogic],
    ['金额 / 次数逻辑', requirement.amountLogic],
  ].filter(([, content]) => content)

  return (
    <>
      <button className="sfa-requirement-entry" type="button" onClick={() => setOpen(true)}>
        <BookOpenText size={15} />
        <span>业务及需求说明</span>
        <em>({requirement.changeType})</em>
        <small>最近修改 {requirement.completedAt}</small>
      </button>
      <Modal
        open={open}
        title="业务及需求说明"
        onClose={() => setOpen(false)}
        className="sfa-requirement-modal"
        overlayClassName="sfa-overlay--nested"
        footer={<PrimaryButton onClick={() => setOpen(false)}>关闭</PrimaryButton>}
      >
        <div className="sfa-requirement-summary"><span>({requirement.changeType})</span><b>{requirement.moduleName}</b><small>最近修改 {requirement.completedAt}</small></div>
        <RequirementSection title="页面功能说明"><p>{requirement.pageSummary || requirement.summary}</p></RequirementSection>
        <RequirementSection title="本次业务需求"><p>{requirement.requirement || requirement.summary}</p></RequirementSection>
        {!!requirement.fields?.length && <RequirementSection title="主要字段说明"><ul>{requirement.fields.map((item) => <li key={item}>{item}</li>)}</ul></RequirementSection>}
        {!!logicRows.length && <RequirementSection title="业务逻辑说明">{logicRows.map(([label, content]) => <div className="sfa-requirement-logic" key={label}><b>{label}</b><p>{content}</p></div>)}</RequirementSection>}
        {!!requirement.relatedModules?.length && <RequirementSection title="关联模块"><div className="sfa-requirement-tags">{requirement.relatedModules.map((item) => <span key={item}>{item}</span>)}</div></RequirementSection>}
        {!!requirement.acceptance?.length && <RequirementSection title="功能验收说明"><ul>{requirement.acceptance.map((item) => <li key={item}>{item}</li>)}</ul></RequirementSection>}
        {!!requirement.history?.length && <RequirementSection title="修改记录"><div className="sfa-requirement-history">{requirement.history.map((item) => <article key={`${item.version}-${item.path}`}><b>{item.versionTitle || item.version}</b><small>{item.completedAt}</small><p>{item.summary}</p>{!!item.changes?.length && <ul>{item.changes.map((change) => <li key={change}>{change}</li>)}</ul>}</article>)}</div></RequirementSection>}
      </Modal>
    </>
  )
}

function RequirementSection({ title, children }) {
  return <section className="sfa-requirement-section"><h3>{title}</h3>{children}</section>
}
