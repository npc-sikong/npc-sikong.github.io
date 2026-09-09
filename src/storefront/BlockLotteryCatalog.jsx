import React, { useState } from 'react'
import './block-lottery-catalog.css'
export const BLOCK_LOTTERY_GROUPS = [
  ['分分彩', '◉', ['哈希一分彩', '哈希三分彩', '哈希五分彩', '波场一分彩', '波场三分彩', '波场五分彩', '币安1分彩', '币安3分彩', '币安5分彩']],
  ['极速彩', 'ϟ', ['哈希极速彩', '波场极速彩', '波场3秒彩', '波场6秒彩', '波场15秒彩']],
  ['六合彩', '♧', ['波场1分六合彩', '波场3分六合彩', '波场5分六合彩', '波场六合彩']],
  ['11选5', '⑤', ['波场11选5', '波场3分11选5', '波场5分11选5', '币安11选5', '币安3分11选5', '币安5分11选5']],
  ['PK10', '⚑', ['币安极速飞艇', '币安5分飞艇', '波场极速赛车', '台湾PK10']],
  ['快三', '⚄', ['波场极速快三', '波场1分快三', '波场3分快三', '波场5分快三', '币安1分快三', '币安3分快三', '币安5分快三']],
  ['时时彩', '◷', ['台湾5分彩']], ['PC28', '㉘', ['台湾28']], ['低频彩', '▥', ['福彩3D', '排列3/5', '福彩排列3D']],
]
export const BLOCK_LOTTERIES = BLOCK_LOTTERY_GROUPS.flatMap(([group, icon, names]) => names.map((name) => ({ name, group, icon, path: `/pages/lottery/tron-minute?lottery=${encodeURIComponent(name)}`, source: name.startsWith('币安') ? '币安区块' : /^(台湾|福彩|排列)/.test(name) ? '官方开奖' : 'TRON 波场区块', cycle: /[三3]分/.test(name) ? 180 : /[五5]分/.test(name) ? 300 : /15秒/.test(name) ? 15 : /6秒/.test(name) ? 6 : /3秒|极速/.test(name) ? 3 : 60, issue: '4347900127' })))
export default function BlockLotteryCatalog({ onChoose }) {
  const [category, setCategory] = useState('全部')
  return <section className="sf-block-catalog" aria-label="区块彩票"><nav aria-label="彩票分类">{[['全部', '✿'], ['常用', '★'], ...BLOCK_LOTTERY_GROUPS].map(([name, icon]) => <button key={name} className={name === category ? 'is-active' : ''} onClick={() => setCategory(name)}><i>{icon}</i>{name}</button>)}</nav><div className="sf-block-catalog-groups">{category === '常用' && <p className="sf-block-catalog-empty">暂无常用彩票</p>}{BLOCK_LOTTERY_GROUPS.filter(([name]) => category === '全部' || name === category).map(([name, icon, names]) => <section key={name}><h3><i>{icon}</i>{name}</h3><div>{(category === '常用' ? names.slice(0, 1) : names).map((title) => <button key={title} onClick={() => onChoose(BLOCK_LOTTERIES.find((game) => game.name === title))}><i className={title.startsWith('币安') ? 'binance' : ''}>{title.startsWith('币安') ? '❖' : '▽'}</i><span>{title}</span></button>)}</div></section>)}</div></section>
}
