import React, { useEffect, useState } from 'react'
import { BookOpenText, CalendarClock, ChevronRight, ClipboardList, FileClock, X } from 'lucide-react'
import { getModuleRequirement, versionRequirementRecords } from './requirements.js'

export function VersionNotesPage({ onNavigate }) {
  const itemCount = versionRequirementRecords.reduce((total, version) => total + (version.items?.length || 0), 0)
  const currentStage = versionRequirementRecords[0]?.version || '基础复刻'
  const [expanded, setExpanded] = useState(versionRequirementRecords[0]?.version || '')

  return (
    <div className="version-notes-page">
      <section className="version-notes-hero">
        <div><span>产品需求档案</span><h1>版本说明</h1><p>统一记录基础复刻完成后的新增需求、修改模块、实际变更点和验收结果。</p></div>
        <div className="version-note-stats"><div><small>当前阶段</small><b>{currentStage}</b></div><div><small>需求记录</small><b>{itemCount}</b></div></div>
      </section>

      {versionRequirementRecords.length === 0 ? (
        <section className="version-notes-empty">
          <ClipboardList size={34} />
          <b>暂无新需求记录</b>
          <p>当前仍属于基础功能建设阶段。本次不生成版本修改说明，后续每次需求变更会自动汇总到这里。</p>
        </section>
      ) : versionRequirementRecords.map((version) => {
        const open = expanded === version.version
        return (
          <section className="version-record" key={version.version}>
            <button className="version-record-head" onClick={() => setExpanded(open ? '' : version.version)}>
              <div><span>{version.version}</span><b>{version.title}</b><small>{version.completedAt || '进行中'}</small></div>
              <div><em>{version.status || '当前版本'}</em><strong>{version.items?.length || 0} 项</strong><ChevronRight className={open ? 'open' : ''} size={17} /></div>
            </button>
            {open && <div className="version-record-items">{(version.items || []).map((item) => (
              <article key={`${version.version}-${item.path}`}>
                <div className="version-item-title"><span className={`change-kind kind-${item.changeType === '新' ? 'new' : 'edit'}`}>({item.changeType})</span><b>{item.moduleName}</b><small>{item.completedAt}</small></div>
                <p>{item.summary}</p>
                <ul>{(item.changes || []).map((change) => <li key={change}>{change}</li>)}</ul>
                <div className="version-item-footer"><span>验收：{item.acceptanceSummary || '按页面业务说明验收'}</span><button onClick={() => onNavigate(item.path)}>查看页面 <ChevronRight size={14} /></button></div>
              </article>
            ))}</div>}
          </section>
        )
      })}
    </div>
  )
}

export function ModuleRequirementFrame({ path, children }) {
  const requirement = getModuleRequirement(path)
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [path])
  if (!requirement) return children

  return (
    <div className="module-requirement-frame">
      <div className="module-requirement-entry">
        <button onClick={() => setOpen(true)}><BookOpenText size={16} />业务及需求说明</button>
        <span><em>({requirement.changeType})</em> 最近修改：{requirement.completedAt}</span>
      </div>
      {children}
      {open && <RequirementDialog requirement={requirement} close={() => setOpen(false)} />}
    </div>
  )
}

function RequirementDialog({ requirement, close }) {
  const logicRows = [
    ['查询 / 查看逻辑', requirement.queryLogic],
    ['操作逻辑', requirement.operationLogic],
    ['状态逻辑', requirement.stateLogic],
    ['金额 / 次数逻辑', requirement.amountLogic],
  ].filter(([, content]) => content)

  return (
    <div className="modal-overlay requirement-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="requirement-dialog">
        <header><div><span className={`change-kind kind-${requirement.changeType === '新' ? 'new' : 'edit'}`}>({requirement.changeType})</span><b>{requirement.moduleName} · 业务及需求说明</b><small><CalendarClock size={13} />最近修改 {requirement.completedAt}</small></div><button onClick={close}><X size={18} /></button></header>
        <div className="requirement-dialog-body">
          <RequirementSection title="页面功能说明"><p>{requirement.pageSummary || requirement.summary}</p></RequirementSection>
          <RequirementSection title="本次业务需求"><p>{requirement.requirement || requirement.summary}</p></RequirementSection>
          {!!requirement.fields?.length && <RequirementSection title="主要字段说明"><ul>{requirement.fields.map((item) => <li key={item}>{item}</li>)}</ul></RequirementSection>}
          {!!logicRows.length && <RequirementSection title="业务逻辑说明"><div className="requirement-logic-list">{logicRows.map(([label, content]) => <div key={label}><b>{label}</b><p>{content}</p></div>)}</div></RequirementSection>}
          {!!requirement.relatedModules?.length && <RequirementSection title="关联模块"><div className="related-module-list">{requirement.relatedModules.map((item) => <span key={item}>{item}</span>)}</div></RequirementSection>}
          {!!requirement.acceptance?.length && <RequirementSection title="功能验收说明"><ul>{requirement.acceptance.map((item) => <li key={item}>{item}</li>)}</ul></RequirementSection>}
          <RequirementSection title="修改记录">
            <div className="requirement-history">{requirement.history.map((item) => <article key={`${item.version}-${item.path}`}><FileClock size={16} /><div><b>{item.versionTitle || item.version}</b><small>{item.completedAt}</small><p>{item.summary}</p><ul>{(item.changes || []).map((change) => <li key={change}>{change}</li>)}</ul></div></article>)}</div>
          </RequirementSection>
        </div>
        <footer><button className="btn btn-primary" onClick={close}>关闭</button></footer>
      </section>
    </div>
  )
}

function RequirementSection({ title, children }) {
  return <section className="requirement-section"><h3>{title}</h3>{children}</section>
}
