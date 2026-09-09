import React from 'react'
import ChaseWakeModes from './ChaseWakeModes'

export default function ChaseStrategyForm({ draft, setDraft, games, strategies }) {
  const change = (patch) => setDraft((current) => ({ ...current, ...patch, confirmed: false }))
  const rows = draft.ladderRows || draft.amounts.map((amount, index) => ({ amount, direction: draft.customDirections[index] || '单', loss: index + 1 < draft.amounts.length ? index + 2 : 0, win: 1 }))
  const editRow = (index, patch) => {
    const next = rows.map((row, i) => i === index ? { ...row, ...patch } : row)
    change({ ladderRows: next, amounts: next.map((row) => Number(row.amount) || 0) })
  }
  const addRow = () => {
    const next = [...rows, { amount: Math.min(10000, Number(rows.at(-1).amount) * 2), direction: '单', loss: 0, win: 1 }]
    change({ ladderRows: next, amounts: next.map((row) => Number(row.amount) || 0) })
  }
  const removeRow = (index) => {
    const removed = index + 1
    const target = (value) => Number(value) === removed ? 0 : Number(value) > removed ? Number(value) - 1 : Number(value)
    const next = rows.filter((_, i) => i !== index).map((row) => ({ ...row, loss: target(row.loss), win: target(row.win) }))
    change({ ladderRows: next, amounts: next.map((row) => Number(row.amount) || 0) })
  }
  return <div className="sfg-chase-single-form">
    <section className="sfg-chase-wizard-card">
      <h3>基本设置</h3>
      <label className="sfg-chase-field">策略名称<input maxLength={32} value={draft.name} onChange={(e) => change({ name: e.target.value })} placeholder="请输入策略名称" /></label>
      <div className="sfg-chase-strategy-grid">{strategies.map((strategy) => <button key={strategy.code} className={draft.strategy === strategy.code ? 'active' : ''} onClick={() => change({ strategy: strategy.code })}><b>{strategy.name}</b><small>{strategy.description}</small></button>)}</div>
      <label className="sfg-chase-switch">保存后启动<input type="checkbox" checked={!!draft.startEnabled} onChange={(e) => change({ startEnabled: e.target.checked })} /></label>
    </section>
    <section className="sfg-chase-wizard-card">
      <h3>运行设置</h3>
      <div className="sfg-chase-time-grid"><label>止盈金额（TRX）<input inputMode="decimal" value={draft.takeProfit} onChange={(e) => change({ takeProfit: e.target.value })} /></label><label>止损金额（TRX）<input inputMode="decimal" value={draft.stopLoss} onChange={(e) => change({ stopLoss: e.target.value })} /></label></div>
      <p className="sfg-chase-form-note">0 表示不设置，止盈与止损独立生效。</p>
      <details className="sfg-chase-fold"><summary>自定义运行时段</summary><div className="sfg-chase-time-grid"><label>开始时间<input type="time" value={draft.startTime} onChange={(e) => change({ startTime: e.target.value })} /></label><label>结束时间<input type="time" value={draft.endTime} onChange={(e) => change({ endTime: e.target.value })} /></label></div><p className="sfg-chase-form-note">当前时段：{draft.startTime}–{draft.endTime}；收起不清空设置。</p></details>
    </section>
    <section className="sfg-chase-wizard-card"><h3>触发规则</h3>{draft.strategy === 'CUSTOM_SEQUENCE' ? <><label className="sfg-chase-field">编辑规则<input value={draft.triggerSequence || ''} onChange={(e) => change({ triggerSequence: e.target.value })} placeholder="例如：单单双双" /></label><p className="sfg-chase-form-note">2～20 个“单/双”，按顺序完全匹配；与下方投注方向独立。</p></> : <><div className="sfg-chase-segmented">{[['ODD', '单'], ['EVEN', '双'], ['BOTH', '单双都监听']].map(([value, label]) => <button key={value} className={draft.listen === value ? 'active' : ''} onClick={() => change({ listen: value })}>{label}</button>)}</div><label className="sfg-chase-field">连龙长度（2～20期）<input type="number" min="2" max="20" value={draft.triggerLength} onChange={(e) => change({ triggerLength: e.target.value })} /></label></>}
      <ChaseWakeModes value={draft.wakeMode} onChange={(wakeMode) => change({ wakeMode })} />
      <label className="sfg-chase-switch">基于历史开奖匹配首次触发<input type="checkbox" checked={!!draft.useHistory} onChange={(e) => change({ useHistory: e.target.checked })} /></label><p className="sfg-chase-form-note">开启：启动时可用已有开奖匹配首次信号；关闭：从启动后的新开奖开始。进入唤醒等待后仍只匹配新信号。</p>
    </section>
    <section className="sfg-chase-wizard-card"><h3>倍投设置 · {rows.length} 级</h3>
      <label className="sfg-chase-switch">使用自定义倍投路径<input type="checkbox" checked={!!draft.customLadder} onChange={(e) => change({ customLadder: e.target.checked })} /></label>
      <p className="sfg-chase-form-note">关闭时沿用斩龙/追龙/自定义策略原有推进规则；开启后按本表方向与目标级数推进。0=结束本轮，1=回到第1级。止盈、止损及唤醒等待仍优先。</p>
      <div className="sfg-chase-config-table"><div className="sfg-chase-config-head"><span>级</span><span>金额</span><span>方向</span><span>亏损后</span><span>盈利后</span><span /></div>{rows.map((row, index) => <div className="sfg-chase-config-row" key={index}><b>{index + 1}</b><input aria-label={`第${index + 1}级金额`} type="number" min="1" max="10000" value={row.amount} onChange={(e) => editRow(index, { amount: e.target.value })} /><select aria-label={`第${index + 1}级方向`} disabled={!draft.customLadder} value={row.direction} onChange={(e) => editRow(index, { direction: e.target.value })}><option>单</option><option>双</option></select><input aria-label={`第${index + 1}级亏损后`} type="number" min="0" max={rows.length} disabled={!draft.customLadder} value={row.loss} onChange={(e) => editRow(index, { loss: e.target.value })} /><input aria-label={`第${index + 1}级盈利后`} type="number" min="0" max={rows.length} disabled={!draft.customLadder} value={row.win} onChange={(e) => editRow(index, { win: e.target.value })} /><button aria-label={`删除第${index + 1}级`} disabled={rows.length <= 1} onClick={() => removeRow(index)}>×</button></div>)}</div>
      <button className="sfg-chase-add-ladder" disabled={rows.length >= 20} onClick={addRow}>＋ 添加一级</button>
      <p className="sfg-chase-form-note">最多20级，每级1～10,000 TRX整数；删除级数后，指向被删级的目标改为0，后续级数自动前移。</p>
    </section>
    <section className="sfg-chase-risk-preview"><h3>风险预览</h3><p>遍历全部级数一次：{rows.reduce((total, row) => total + (Number(row.amount) || 0), 0)} TRX</p><p className="sfg-chase-form-note">这不是最大损失；跳转可以循环，可能重复投入。请结合止盈、止损和运行时段。</p><label><input type="checkbox" checked={draft.confirmed} onChange={(e) => setDraft((current) => ({ ...current, confirmed: e.target.checked }))} />我已确认风险预览</label></section>
  </div>
}
