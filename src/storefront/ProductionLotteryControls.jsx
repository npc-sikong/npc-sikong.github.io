import React, { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
export const PRODUCTION_PLAYS = {
  '一星': ['一星定位胆'],
  '前三码': ['前三直选复式', '前三直选单式', '前三直选和值', '前三组选三', '前三组选六'],
  '中三码': ['中三直选复式', '中三直选单式', '中三组选三', '中三组选六'],
  '后三码': ['后三直选复式', '后三直选单式', '后三直选和值', '后三组选三', '后三组选六'],
  '前二码': ['前二直选复式', '前二直选单式', '前二组选复式'],
  '后二码': ['后二直选复式', '后二直选单式', '后二组选复式'],
  '龙虎': ['万千龙虎和', '万百龙虎和', '万十龙虎和', '万个龙虎和', '千百龙虎和', '千十龙虎和', '千个龙虎和', '百十龙虎和', '百个龙虎和', '十个龙虎和', '万千龙虎斗', '万个龙虎斗'],
  '任选': ['任选二直选复式', '任选三直选复式', '任选四直选复式'],
  '前中后三': ['前三豹子', '中三豹子', '后三豹子'],
  '不定位': ['前三一码不定位', '后三一码不定位'],
  '前后三': ['前三跨度', '后三跨度'], '前后二': ['前二和值', '后二和值'],
  '四星': ['四星直选复式'], '前后四': ['前四直选复式', '后四直选复式'], '五星': ['五星直选复式', '五星直选单式', '五星组选120'],
}
export const GROUP_PLAYS = {
  '六合彩': {'特码':['特码A','特码B'],'正特码':['正码','正码特'],'连码':['二全中','三全中'],'过关':['过关'],'生肖':['特肖'],'特码头尾':['头数','尾数'],'五行家野':['五行','家野'],'波色':['波色'],'七码':['七码'],'一肖尾数':['一肖','尾数'],'生肖连':['二肖连','三肖连'],'尾数连':['二尾连'],'全不中':['五不中'],'多选中一':['五中一'],'特平中':['特平中']},
  'PC28': {'2.0模式':['2.0模式-和值','2.0模式-大小单双','2.0模式-特殊号','2.0模式-龙虎豹'],'2.8模式':['2.8模式-和值','2.8模式-大小单双','2.8模式-特殊号','2.8模式-龙虎豹']},
  '11选5': {'一星':['定位胆'],'前三码':['前三直选复式','前三组选复式'],'前二码':['前二直选复式','前二组选复式'],'不定位':['前三一码不定位'],'任选复式':['任选二中二','任选三中三','任选四中四','任选五中五'],'任选单式':['任选二单式','任选三单式']},
  'PK10': {'一星':['定位胆'],'龙虎':['冠军龙虎','亚军龙虎'],'前一':['冠军直选'],'前二':['前二直选复式'],'前三':['前三直选复式'],'前四':['前四直选复式'],'前五':['前五直选复式'],'大小':['冠军大小'],'单双':['冠军单双'],'和值':['冠亚和值']},
  '快三': {'和值':['快三和值'],'二同号':['二同号复选','二同号单选'],'二不同号':['二不同号'],'三同号':['三同号通选','三同号单选'],'三不同号':['三不同号'],'三连号':['三连号通选'],'单挑一骰':['单挑一骰']},
}
export function ProductionPlayPicker({ play, onChoose, children, plays = PRODUCTION_PLAYS }) {
  const [open, setOpen] = useState(false)
  const [family, setFamily] = useState(Object.keys(plays)[0])
  const [favorites, setFavorites] = useState([])
  const [category, setCategory] = useState(Object.keys(plays)[0])
  const items = family === '常用玩法' ? favorites : plays[family] || []
  return <div className="sfg-production-play"><button className="sfg-production-play-title" onClick={() => setOpen(!open)}>{category}<ChevronDown size={16} /></button>{open && <div className="sfg-production-play-panel"><nav>{['常用玩法', ...Object.keys(plays)].map((item) => <button key={item} className={family === item ? 'active' : ''} onClick={() => setFamily(item)}>{item}</button>)}</nav><div><button className="sfg-production-favorite" onClick={() => setFavorites((current) => current.includes(play) ? current.filter((item) => item !== play) : [...current, play])}>{favorites.includes(play) ? '取消常用玩法' : '添加常用玩法'}</button><small>{family === '一星' ? '定位胆' : family}</small><section>{items.map((item) => <button key={item} className={play === item ? 'active' : ''} onClick={() => { onChoose(item); setCategory(family); setOpen(false) }}>{item}</button>)}{!items.length && <p>暂无常用玩法</p>}</section></div></div>}{children}</div>
}
export function ProductionDialog({ title, children, onClose }) {
  if (!title) return null
  return <div className="sfg-production-overlay" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" aria-label={title}><header><b>{title}</b><button aria-label="关闭" onClick={onClose}><X size={22} /></button></header><div>{children}</div></section></div>
}
export function ProductionDraws({ onVerify, results }) {
  const [period, setPeriod] = useState(30)
  return <section className="sfg-production-draws"><nav>{[30,50,100].map((n) => <button key={n} className={period === n ? 'active' : ''} onClick={() => setPeriod(n)}>近{n}期</button>)}</nav>{Array.from({ length:period }, (_, index) => ({ ...results[index % results.length], issue: String(Number(results[0].issue) - index), block:86087460-index*60 })).map((item) => <button key={item.issue} onClick={() => onVerify(item)}><span>{item.issue}<small>区块：<u>{item.block}</u></small></span><div>{item.numbers.map((n, i) => <i key={i} className={n % 2 ? 'odd' : ''}>{n}</i>)}</div></button>)}</section>
}

export function ProductionTrend({ results }) {
  const [period, setPeriod] = useState(30)
  const [position, setPosition] = useState(0)
  const [range, setRange] = useState('五星')
  const [line, setLine] = useState(true)
  const [omit, setOmit] = useState(true)
  const [kind, setKind] = useState('单号走势')
  return <section className="sfg-production-trend"><div className="sfg-production-trend-tools"><select aria-label="走势类型" value={kind} onChange={(e) => setKind(e.target.value)}>{['单号走势','大小走势','单双走势'].map((v) => <option key={v}>{v}</option>)}</select>{[30,50,100].map((v) => <button className={period === v ? 'active' : ''} onClick={() => setPeriod(v)} key={v}>{v}期</button>)}</div><div className="sfg-production-trend-checks"><label><input type="checkbox" checked={line} onChange={(e) => setLine(e.target.checked)} />显示折线</label><label><input type="checkbox" checked={omit} onChange={(e) => setOmit(e.target.checked)} />遗漏号</label></div><nav>{['五星','前四','后四','前三','中三','后三','前二','后二'].map((v) => <button key={v} className={range === v ? 'active' : ''} onClick={() => { setRange(v); setPosition(v.startsWith('后') ? 5 - Number({后四:4,后三:3,后二:2}[v]) : v === '中三' ? 1 : 0) }}>{v}</button>)}</nav><div className="sfg-production-trend-head"><span>期数/开奖号码</span><div><select aria-label="走势位置" value={position} onChange={(e) => setPosition(Number(e.target.value))}>{['万位','千位','百位','十位','个位'].map((v,i) => <option value={i} key={v}>{v}</option>)}</select><div>{(kind === '单号走势' ? Array.from({length:10},(_,i)=>i) : kind === '大小走势' ? ['小','大'] : ['双','单']).map((v) => <span key={v}>{v}</span>)}</div></div></div>{Array.from({length:period},(_,index) => { const row=results[index%results.length]; const cols=kind==='单号走势'?10:2; const value=kind==='单号走势'?row.numbers[position]:kind==='大小走势'?Number(row.numbers[position]>=5):row.numbers[position]%2; const previous=results[(index+results.length-1)%results.length].numbers[position]; const prev=kind==='单号走势'?previous:kind==='大小走势'?Number(previous>=5):previous%2; return <div className="sfg-production-trend-row" key={index}><span>{Number(results[0].issue)-index}<small>{row.numbers.map((v,i)=><i key={i}>{v}</i>)}</small></span><div style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>{line && index>0 && <svg viewBox="0 0 100 40" preserveAspectRatio="none"><line x1={(prev+.5)*100/cols} y1="-20" x2={(value+.5)*100/cols} y2="20" stroke="#e4cf77" strokeWidth=".6" /></svg>}{Array.from({length:cols},(_,i)=><span key={i} className={i===value?'hit':''}>{i===value?(kind==='单号走势'?value:kind==='大小走势'?['小','大'][value]:['双','单'][value]):omit?(index*3+i)%29:''}</span>)}</div></div>})}</section>
}

export function ProductionOrders({ orders, lottery, onBack, onChase, onDetail }) {
  const [recordTab,setRecordTab]=useState('彩票记录')
  const [currency,setCurrency]=useState('全部币种')
  const [status,setStatus]=useState('全部状态')
  const [scope,setScope]=useState('个人')
  const [date,setDate]=useState('今天')
  const visible=recordTab!=='彩票记录'||scope==='团队'||currency==='TRX'||currency==='CNY'||date!=='今天'?[]:orders.filter((o)=>status==='全部状态'||o.status===status)
  return <div className="sfg-production-orders"><header><button onClick={onBack}>〈</button>投注记录</header><nav>{['彩票记录','哈希记录','娱乐记录'].map(v=><button key={v} className={recordTab===v?'active':''} onClick={()=>setRecordTab(v)}>{v}</button>)}</nav><div className="sfg-production-order-mode"><button className="active" onClick={()=>{setRecordTab('彩票记录');setScope('个人');setCurrency('全部币种');setStatus('全部状态');setDate('今天')}}>彩票投注</button><button onClick={onChase}>追号投注</button></div><div className="sfg-production-order-filters"><button className={scope==='个人'?'active':''} onClick={()=>setScope('个人')}>个人</button><button className={scope==='团队'?'active':''} onClick={()=>setScope('团队')}>团队</button><select aria-label="记录币种" value={currency} onChange={e=>setCurrency(e.target.value)}>{['全部币种','USDT','TRX','CNY'].map(v=><option key={v}>{v}</option>)}</select><select aria-label="记录状态" value={status} onChange={e=>setStatus(e.target.value)}>{['全部状态','待开奖','已中奖','未中奖'].map(v=><option key={v}>{v}</option>)}</select></div><div className="sfg-production-order-filters"><span>{lottery.name}</span><span>全部玩法</span><select aria-label="记录日期" value={date} onChange={e=>setDate(e.target.value)}>{['今天','昨天','近7天','近30天'].map(v=><option key={v}>{v}</option>)}</select></div><table><thead><tr>{['币种','总投注(单)','有效投注','输赢总计'].map(v=><th key={v}>{v}</th>)}</tr></thead><tbody>{['USDT','TRX','CNY'].map(c=><tr key={c}><td>{c}</td><td>{c==='USDT'?visible.length:0}</td><td>{c==='USDT'?visible.reduce((n,o)=>n+Number(o.amount),0).toFixed(2):0}</td><td>0</td></tr>)}</tbody></table>{visible.length?visible.map(o=><button className="sfg-production-order-row" key={o.id} onClick={()=>onDetail(o)}><span>{o.play}<small>{o.issue}期</small></span><span>{o.amount} USDT<small>{o.status} ›</small></span></button>):<p className="sfg-production-no-data">暂无数据</p>}</div>
}
