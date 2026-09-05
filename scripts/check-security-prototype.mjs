import { build } from 'esbuild'
import { createRequire } from 'node:module'
const result = await build({
  stdin: { contents: `
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import assert from 'node:assert/strict'
    import { DemoSecurityProvider } from './src/storefront/DemoSecurityContext.jsx'
    import { SecurityFormPage, AccountBindPage } from './src/storefront/accountSecurityPages.jsx'
    import { AuthPage } from './src/storefront/accountAuthBenefitPages.jsx'
    import { getModuleRequirement } from './src/requirements.js'
    const render = (Component, props = {}) => renderToStaticMarkup(<DemoSecurityProvider><Component {...props} /></DemoSecurityProvider>)
    const input = (html, label) => html.includes('aria-label="' + label + '"')
    let count = 0
    function check(name, fn) { fn(); count++; console.log('PASS', name) }
    check('未绑谷歌修改登录密码无密保无谷歌，必须有资金密码', () => {
      const html = render(SecurityFormPage, { mode: 'login-password', googleBound: false })
      assert(input(html, '旧登录密码')); assert(input(html, '资金密码'))
      assert(!input(html, '密保答案')); assert(!input(html, '谷歌验证码'))
    })
    check('已绑谷歌追加验证码', () => assert(input(render(SecurityFormPage, { mode: 'login-password', googleBound: true }), '谷歌验证码')))
    check('找回登录密码移除固定双凭据', () => {
      const html = render(AuthPage, { mode: 'recover' })
      assert(html.includes('密保找回（原有）')); assert(html.includes('充值找回（新增）'))
      assert(!input(html, '资金密码'))
    })
    check('历史账号首次密保不重复提交资金密码，提示选填', () => {
      const html = render(SecurityFormPage, { mode: 'question', googleBound: false })
      assert(!input(html, '资金密码')); assert(html.includes('选填，不能与答案相同'))
    })
    const profile = { configured: true, question: '演示问题', answer: '演示答案', tip: '' }
    check('更换密保第一步仅原密保加资金密码，新密保与谷歌留到第二步', () => {
      const html = render(SecurityFormPage, { mode: 'question', googleBound: true, securityProfile: profile })
      assert(input(html, '当前密保答案')); assert(input(html, '资金密码'))
      assert(!input(html, '谷歌验证码')); assert(!input(html, '新密保答案'))
      assert(html.includes('找回密保（新增）'))
    })
    check('资金密码未绑定谷歌不要求谷歌码', () => assert(!input(render(SecurityFormPage, { mode: 'recharge-password', googleBound: false }), '谷歌验证码')))
    check('资金密码保留客服入口与新增自助找回', () => {
      const html = render(SecurityFormPage, { mode: 'recharge-password' })
      assert(html.includes('忘记密码？联系客服')); assert(html.includes('自助找回（新增）'))
    })
    check('谷歌初次绑定不要求密保，先核验资金密码', () => {
      const html = render(SecurityFormPage, { mode: 'google', googleBound: false })
      assert(input(html, '资金密码')); assert(!input(html, '密保答案')); assert(!input(html, '新谷歌验证码'))
    })
    check('谷歌遗失恢复使用恢复码而非密保', () => {
      const html = render(SecurityFormPage, { mode: 'google', path: '?recovery=1' })
      assert(input(html, '一次性恢复码')); assert(input(html, '登录密码')); assert(!input(html, '密保答案'))
    })
    check('绑定地址未绑谷歌不要求谷歌码，密保必填', () => {
      const html = render(AccountBindPage, { type: 'trc20', googleBound: false, securityProfile: profile })
      assert(input(html, '密保答案')); assert(input(html, '资金密码')); assert(!input(html, '谷歌验证码'))
    })
    check('修改说明只列六组新增规则，保留两项补强并声明开发待实现', () => {
      const r = getModuleRequirement('/front/pages/user/user')
      assert.equal(r.fields.length, 6)
      assert(r.fields.every(f => f.includes('（新增')))
      assert(!r.fields.some(f => /原有|初始|更换|注册账号|找回账号|恢复授权/.test(f)))
      assert(r.requirement.includes('不表示开发完成'))
      assert(r.fields.some(f => f.includes('非空密保提示 ≠ 密保答案（新增）')))
      assert(r.fields.some(f => f.includes('必须验证并消费有效密保凭证（新增，仅登记，尚待开发实现）')))
      assert(!JSON.stringify([r.changes, r.operationLogic, r.stateLogic]).includes('（原有）'))
    })
    console.log(count + ' security prototype checks passed')
  `, resolveDir: process.cwd(), loader: 'jsx' },
  bundle: true, platform: 'node', format: 'cjs', write: false, jsx: 'automatic',
  loader: { '.css': 'empty' },
})
const module = { exports: {} }
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports)
