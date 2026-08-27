import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ArrowLeftRight, ChevronLeft, Headphones, ShieldCheck } from 'lucide-react'
import {
  AgentPage,
  BenefitPage,
  DownloadPage,
  EntertainmentPage,
  HelpPage,
  HomePage,
  PrizePage,
  PrizePoolPage,
  ServicePage,
  Toast,
  UserPage,
} from './StorefrontCore.jsx'
import AccountRoutePage from './AccountPages.jsx'
import {
  GameGuidePage,
  GameListPage,
  HashGamePage,
  LotteryChasePage,
  LotteryGamePage,
  LotteryLongDragonPage,
  OrderDetailPage,
} from './GamePages.jsx'
import { HASH_RECORDS } from './accountData.js'
import { HASH_GAME_ITEMS, LOTTERY_ORDERS } from './gameData.js'
import {
  normalizeStorefrontPath,
  STOREFRONT_HOME,
  STOREFRONT_PREFIX,
  storefrontRouteMap,
  toStorefrontPath,
} from './routes.js'
import './storefront-shell.css'

const legacyPaths = {
  '/pages/home/index': '/pages/index/index',
  '/pages/game/list': '/pages/entertainment/game-list',
}

const guideFallbacks = {
  '/pages/hash/tail-parity-guide': 'tail-parity',
  '/pages/hash/sum-parity-guide': 'sum-parity',
  '/pages/hash/banker-player-guide': 'lucky-banker-player',
}

const defaultSecurityProfile = {
  configured: false,
  question: '',
  answer: '',
  tip: '',
}

function readLocation() {
  return `${window.location.pathname}${window.location.search}`
}

function splitTarget(target) {
  const value = String(target || '')
  const queryIndex = value.indexOf('?')
  return queryIndex === -1
    ? { pathname: value, search: '' }
    : { pathname: value.slice(0, queryIndex), search: value.slice(queryIndex) }
}

function toTargetRoute(target) {
  const { pathname: rawPathname, search } = splitTarget(target)
  const pathname = legacyPaths[rawPathname] || rawPathname
  if (pathname.startsWith(STOREFRONT_PREFIX)) return `${pathname}${search}`
  return `${toStorefrontPath(pathname)}${search}`
}

function toHashOrder(record) {
  if (!record) return null
  return {
    id: record.id,
    issue: '70419860',
    play: record.game,
    pick: record.pick,
    amount: record.amount,
    status: record.status,
    prize: String(record.profit || '').startsWith('+') ? String(record.profit).slice(1) : '0.00',
  }
}

function HijackGuidePage({ onBack, notify }) {
  const [step, setStep] = useState(0)
  const steps = [
    ['核对访问地址', '只通过已保存的官方入口访问，避免点击来历不明的短信或聊天链接。'],
    ['检查页面与证书', '发现域名拼写、页面样式或证书提示异常时，立即停止输入账号信息。'],
    ['使用安全工具', '建议使用可信浏览器、钱包和网络环境，并定期清理未知插件。'],
    ['联系客服确认', '无法判断入口真伪时，通过站内客服演示入口进行确认。'],
  ]

  return (
    <main className="sf-static-page">
      <header className="sf-static-header">
        <button type="button" onClick={onBack} aria-label="返回"><ChevronLeft /></button>
        <h1>防劫持教程</h1>
        <button type="button" onClick={() => notify('在线客服演示入口已打开')} aria-label="联系客服"><Headphones /></button>
      </header>
      <section className="sf-static-hero">
        <ShieldCheck />
        <h2>保护您的访问与账户安全</h2>
        <p>本页仅演示安全检查流程，不会读取设备、账号或网络信息。</p>
      </section>
      <section className="sf-static-steps">
        {steps.map(([title, description], index) => (
          <button type="button" className={step === index ? 'is-active' : ''} key={title} onClick={() => setStep(index)}>
            <span>{index + 1}</span><div><b>{title}</b><p>{description}</p></div>
          </button>
        ))}
      </section>
      <section className="sf-static-warning"><AlertTriangle /><p>请勿在任何演示页面输入真实密码、私钥、短信验证码或钱包助记词。</p></section>
      <button className="sf-static-primary" type="button" onClick={() => notify(`第 ${step + 1} 项安全检查已完成`, 'success')}>我已完成本项检查</button>
    </main>
  )
}

function StorefrontPage({ route, targetPath, search, navigate, notify, securityProfile, setSecurityProfile, recoveryRequests, onSubmitRecovery }) {
  const componentPath = `${targetPath}${search}`
  const common = { navigate, path: componentPath, securityProfile, setSecurityProfile, recoveryRequests, onSubmitRecovery }

  switch (route.renderer) {
    case 'home': return <HomePage onNavigate={navigate} initialTab={new URLSearchParams(search).get('tab') || 'hot'} />
    case 'entertainment': return <EntertainmentPage onNavigate={navigate} onBack={() => navigate('/pages/index/index')} />
    case 'game-list': return <GameListPage {...common} />
    case 'user': return <UserPage onNavigate={navigate} />
    case 'service': return <ServicePage onBack={() => navigate(-1)} />
    case 'help': return <HelpPage onNavigate={navigate} onBack={() => navigate(-1)} />
    case 'hijack-guide': return <HijackGuidePage onBack={() => navigate(-1)} notify={notify} />
    case 'download': return <DownloadPage onNavigate={navigate} onBack={() => navigate(-1)} />
    case 'prize': return <PrizePoolPage onNavigate={navigate} onBack={() => navigate(-1)} />
    case 'agent': return <AgentPage onNavigate={navigate} onBack={() => navigate(-1)} />
    case 'benefit': return <BenefitPage onNavigate={navigate} onBack={() => navigate('/pages/index/index')} />
    case 'benefit-detail': {
      const activity = new URLSearchParams(search).get('activity')
      const activityId = { weekly: 'weekly-rank', winning: 'winning-streak', first: 'first-deposit' }[activity] || 'weekly-rank'
      return <PrizePage activityId={activityId} onNavigate={navigate} onBack={() => navigate('/pages/benefit/index')} />
    }
    case 'hash-detail':
    case 'hash-game': return <HashGamePage {...common} onOpenGuide={(game) => navigate(game.guidePath)} />
    case 'hash-guide': {
      const slug = new URLSearchParams(search).get('game') || guideFallbacks[targetPath]
      const game = HASH_GAME_ITEMS.find((item) => item.slug === slug) || HASH_GAME_ITEMS[0]
      return <GameGuidePage {...common} game={game} />
    }
    case 'hash-order-detail': {
      const requestedId = new URLSearchParams(search).get('id')
      const record = HASH_RECORDS.find((item) => item.id === requestedId) || HASH_RECORDS[0]
      return <OrderDetailPage {...common} kind="hash" order={toHashOrder(record)} />
    }
    case 'lottery-game': return <LotteryGamePage {...common} />
    case 'lottery-long-dragon': return <LotteryLongDragonPage {...common} />
    case 'lottery-chase': return <LotteryChasePage {...common} />
    case 'lottery-order-detail': {
      const requestedId = new URLSearchParams(search).get('id')
      const order = LOTTERY_ORDERS.find((item) => item.id === requestedId) || LOTTERY_ORDERS[0]
      return <OrderDetailPage {...common} kind="lottery" order={order} />
    }
    default: return <AccountRoutePage {...common} />
  }
}

export default function StorefrontApp({
  securityProfile: controlledSecurityProfile,
  setSecurityProfile: controlledSetSecurityProfile,
  recoveryRequests: controlledRecoveryRequests,
  onSubmitRecovery: controlledSubmitRecovery,
} = {}) {
  const [location, setLocation] = useState(readLocation)
  const [toast, setToast] = useState(null)
  const [localSecurityProfile, setLocalSecurityProfile] = useState(defaultSecurityProfile)
  const [localRecoveryRequests, setLocalRecoveryRequests] = useState([])
  const toastTimer = useRef(null)
  const localNavigationDepth = useRef(0)
  const pageStageRef = useRef(null)
  const { pathname, search } = useMemo(() => splitTarget(location), [location])
  const normalizedPath = normalizeStorefrontPath(pathname)
  const route = storefrontRouteMap[normalizedPath]
  const targetPath = route?.targetPath || '/pages/index/index'
  const securityProfile = controlledSecurityProfile || localSecurityProfile
  const setSecurityProfile = controlledSetSecurityProfile || setLocalSecurityProfile
  const recoveryRequests = controlledRecoveryRequests || localRecoveryRequests

  const submitRecovery = useCallback((request) => {
    if (typeof controlledSubmitRecovery === 'function') return controlledSubmitRecovery(request)
    setLocalRecoveryRequests((current) => [...current, request])
    return request
  }, [controlledSubmitRecovery])

  useEffect(() => {
    const onPopState = () => setLocation(readLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.body.classList.add('storefront-mode')
    return () => {
      document.body.classList.remove('storefront-mode')
      window.clearTimeout(toastTimer.current)
    }
  }, [])

  useEffect(() => {
    if (pathname !== normalizedPath) {
      window.history.replaceState({}, '', `${normalizedPath}${search}`)
      setLocation(readLocation())
      return
    }
    document.title = `${route?.title || '首页'} · G6哈希演示`
    window.scrollTo(0, 0)
    pageStageRef.current?.scrollTo({ top: 0 })
  }, [normalizedPath, pathname, route?.title, search])

  const notify = useCallback((message, type = 'info') => {
    if (!message) return
    setToast({ message, type, key: Date.now() })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2100)
  }, [])

  const navigate = useCallback((target) => {
    if (typeof target === 'number') {
      if (target < 0 && localNavigationDepth.current <= 0) {
        window.history.replaceState({}, '', STOREFRONT_HOME)
        setLocation(readLocation())
        return
      }
      localNavigationDepth.current = Math.max(0, localNavigationDepth.current + target)
      window.history.go(target)
      return
    }
    const nextRoute = toTargetRoute(target)
    if (nextRoute === readLocation()) return
    localNavigationDepth.current += 1
    window.history.pushState({}, '', nextRoute)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  const returnToAdmin = useCallback(() => {
    window.history.pushState({}, '', '/member/list')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return (
    <div className="storefront-shell" data-storefront-route={targetPath}>
      <div className="storefront-mode-switch-rail">
        <button type="button" className="storefront-admin-switch" onClick={returnToAdmin} aria-label="返回运营后台">
          <ArrowLeftRight size={14} />
          <span>返回运营后台</span>
        </button>
      </div>
      <div className="storefront-page-stage" ref={pageStageRef}>
        <StorefrontPage route={route} targetPath={targetPath} search={search} navigate={navigate} notify={notify} securityProfile={securityProfile} setSecurityProfile={setSecurityProfile} recoveryRequests={recoveryRequests} onSubmitRecovery={submitRecovery} />
      </div>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} zIndex={2400} />
    </div>
  )
}
