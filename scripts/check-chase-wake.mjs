import assert from 'node:assert/strict'
import { CHASE_WAKE_MODES, chaseWakeDecision, DEFAULT_CHASE_WAKE_MODE } from '../src/storefront/chaseWakeRules.js'
import { getModuleRequirement } from '../src/requirements.js'

assert.equal(DEFAULT_CHASE_WAKE_MODE, 'CONTINUE')
const expected = { WIN: ['WAITING', 'CONTINUE'], LOSS: ['CONTINUE', 'WAITING'], BOTH: ['WAITING', 'WAITING'], CONTINUE: ['CONTINUE', 'CONTINUE'] }
for (const mode of CHASE_WAKE_MODES) {
  assert.deepEqual(['WIN', 'LOSS'].map((outcome) => chaseWakeDecision(mode.value, outcome)), expected[mode.value])
  for (const outcome of ['WIN', 'LOSS']) assert.equal(chaseWakeDecision(mode.value, outcome, true), 'STOPPED')
  assert.equal(chaseWakeDecision(mode.value, 'PENDING'), 'UNCHANGED')
  assert.equal(chaseWakeDecision(mode.value, 'ZERO'), 'UNCHANGED')
  assert(mode.explanation && mode.example)
}
const requirement = getModuleRequirement('/front/pages/lottery/chase')
assert.equal(requirement.fields.length, 4)
assert(requirement.stateLogic.includes('不重置'))
console.log('PASS 四种模式的8个盈亏分支、停止优先、未结算/零结果、默认模式及同源说明')
