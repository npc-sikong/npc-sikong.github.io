export const CHASE_WAKE_MODES = [
  { value: 'WIN', label: '盈利后停止，等待规则再次触发。', explanation: '本笔盈利后进入等待唤醒；本笔亏损则不额外等待，按现有策略决定下一步。', example: '盈利 → 等待新信号；亏损 → 按现有策略继续。' },
  { value: 'LOSS', label: '亏损后停止，等待规则再次触发。', explanation: '本笔亏损后进入等待唤醒；本笔盈利则不额外等待，按现有策略决定下一步。', example: '亏损 → 等待新信号；盈利 → 按现有策略继续。' },
  { value: 'BOTH', label: '无论盈利或亏损，都等待规则再次触发。', explanation: '每笔结算后都进入等待唤醒。保留现有策略确定的下一步，新的触发条件满足后再执行一笔，结算后再次等待。', example: '若现有策略确定下一步为第2级，等待期间保留第2级；再次触发后执行第2级，不因为等待回到第1级。' },
  { value: 'CONTINUE', label: '无论盈利或亏损，都直接继续交易。', explanation: '每笔结算后不增加唤醒等待，按现有策略在下一可投注期继续；仍需首次触发，不代表立即连续下单或无限执行。', example: '盈利或亏损 → 按现有策略确定下一步 → 下一可投注期执行。' },
]

export const DEFAULT_CHASE_WAKE_MODE = 'CONTINUE'
export const chaseWakeMode = (value) => CHASE_WAKE_MODES.find((item) => item.value === value) || CHASE_WAKE_MODES[3]

// Only decides the additional wait; it never advances or resets the existing strategy.
export function chaseWakeDecision(mode, outcome, stopped = false) {
  if (stopped) return 'STOPPED'
  if (outcome !== 'WIN' && outcome !== 'LOSS') return 'UNCHANGED'
  return mode === 'BOTH' || mode === outcome ? 'WAITING' : 'CONTINUE'
}

export const CHASE_WAKE_BOUNDARY = '这里的“停止”是等待唤醒，不是手动暂停或结束任务。下一步方向、金额、阶梯与本轮结束仍由现有策略决定；止盈、止损、运行时段结束、步骤用尽或手动暂停优先，不会被唤醒模式绕过。'
export const CHASE_WAKE_FRESH_SIGNAL = '进入等待后仅用新产生的开奖结果重新匹配，不重复使用旧触发信号，也不把刚结算这一期计入新序列。斩龙、追龙沿用监听方向和连龙长度，自定义沿用精确触发序列。'
