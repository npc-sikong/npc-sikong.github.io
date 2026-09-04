import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleHelp,
  CloudDownload,
  Coins,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Gamepad2,
  Gift,
  Globe2,
  Headphones,
  Heart,
  Home,
  Landmark,
  Link2,
  Menu,
  MessageCircle,
  PackageOpen,
  PlusCircle,
  QrCode,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Trophy,
  UserPlus,
  UserRound,
  Users,
  WalletCards,
  X,
  Zap,
} from 'lucide-react'
import {
  assetPath,
  benefits,
  bottomNavItems,
  downloadGroups,
  gameCards,
  gameTabs,
  helpTopics,
  helpWallets,
  homeBanners,
  prizeRanks,
  prizeRules,
  rankRows,
  sideMenuItems,
  teamMetrics,
  userMenuActions,
  userMoneyActions,
  userPrimaryActions,
  walletCurrencies,
  walletVendors,
} from './coreData'
import { getModuleRequirement } from '../requirements'
import './core.css'

const noop = () => {}
const userPageRequirement = getModuleRequirement('/front/pages/user/user')

function splitSecurityRule(rule) {
  const separatorIndex = rule.indexOf('：')
  const title = separatorIndex >= 0 ? rule.slice(0, separatorIndex) : '规则'
  const content = separatorIndex >= 0 ? rule.slice(separatorIndex + 1) : rule
  const clauses = content.split('；').flatMap((part) => (
    part.split('，或').map((clause, index) => `${index > 0 ? '或 ' : ''}${clause}`)
  )).map((clause) => clause.replace(/[。；]+$/g, '').trim()).filter(Boolean)
  return { title, clauses }
}

function SecurityRuleCards({ rules = [] }) {
  return (
    <div className="sf-user-rule-list">
      {rules.map((rule, ruleIndex) => {
        const { title, clauses } = splitSecurityRule(rule)
        return (
          <article className="sf-user-rule-card" key={title}>
            <header><span>{String(ruleIndex + 1).padStart(2, '0')}</span><h4>{title}</h4></header>
            <div className="sf-user-rule-card__body">
              {clauses.map((clause, clauseIndex) => {
                if (clause.includes(' AND ')) {
                  return (
                    <div className="sf-user-rule-and" key={`${title}-${clauseIndex}`}>
                      {clause.split(' AND ').map((condition, conditionIndex, conditions) => (
                        <React.Fragment key={condition}>
                          <span>{condition}</span>
                          {conditionIndex < conditions.length - 1 && <b>AND</b>}
                        </React.Fragment>
                      ))}
                    </div>
                  )
                }
                const isAlternative = clause.startsWith('或 ')
                const clauseText = isAlternative ? clause.slice(2) : clause
                const equalIndex = clauseText.indexOf('=')
                if (equalIndex >= 0) {
                  return (
                    <p className="sf-user-rule-equation" key={`${title}-${clauseIndex}`}>
                      <span>{clauseText.slice(0, equalIndex)}</span><b>=</b><em>{clauseText.slice(equalIndex + 1)}</em>
                    </p>
                  )
                }
                return (
                  <p className={`sf-user-rule-statement ${isAlternative ? 'is-alternative' : ''}`} key={`${title}-${clauseIndex}`}>
                    {isAlternative && <b>或</b>}<span>{clauseText}</span>
                  </p>
                )
              })}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function useFeedback(onToast) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const notify = useCallback((message, type = 'info') => {
    if (!message) return
    onToast?.(message, type)
    setToast({ message, type, key: Date.now() })
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setToast(null), 1800)
  }, [onToast])

  return [toast, notify]
}

function usePageActions(onNavigate, onToast) {
  const [toast, notify] = useFeedback(onToast)
  const go = useCallback((path, label = '页面') => {
    notify(`正在打开${label}`)
    onNavigate?.(path)
  }, [notify, onNavigate])
  return { toast, notify, go }
}

function Brand() {
  return (
    <div className="sf-brand" aria-label="G6哈希">
      <img className="sf-brand__logo" src={assetPath('logo.png')} alt="" />
      <span className="sf-brand__wordmark"><b>G6哈希</b><small>G6HX.VIP</small></span>
    </div>
  )
}

export function Toast({ open = true, message, type = 'info', zIndex = 1400, layer = 0, className = '' }) {
  if (!open || !message) return null
  return (
    <div
      className={`sf-toast sf-toast--${type} ${className}`.trim()}
      style={{ zIndex: zIndex + layer * 20 }}
      role="status"
      aria-live="polite"
    >
      {type === 'success' && <CheckCircle2 size={17} />}
      {message}
    </div>
  )
}

export function Overlay({
  open,
  onClose = noop,
  children,
  className = '',
  closeOnBackdrop = true,
  zIndex = 1000,
  layer = 0,
  labelledBy,
}) {
  if (!open) return null
  return (
    <div
      className={`sf-overlay ${className}`.trim()}
      style={{ zIndex: zIndex + layer * 20 }}
      role="presentation"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose()
      }}
      aria-labelledby={labelledBy}
    >
      {children}
    </div>
  )
}

export function BottomSheet({
  open,
  title,
  onClose = noop,
  children,
  footer,
  className = '',
  bodyClassName = '',
  zIndex = 1100,
  layer = 0,
  showClose = true,
  closeLabel = '关闭',
}) {
  const titleId = `sf-sheet-title-${String(title || 'sheet').replace(/\s+/g, '-')}`
  return (
    <Overlay open={open} onClose={onClose} zIndex={zIndex} layer={layer} labelledBy={titleId}>
      <section className={`sf-sheet ${className}`.trim()} role="dialog" aria-modal="true">
        {(title || showClose) && (
          <header className="sf-sheet__header">
            <h2 id={titleId}>{title}</h2>
            {showClose && (
              <button type="button" className="sf-sheet__close" onClick={onClose} aria-label={closeLabel}>
                {closeLabel === '关闭' ? <><span>关闭</span></> : <X size={19} />}
              </button>
            )}
          </header>
        )}
        <div className={`sf-sheet__body ${bodyClassName}`.trim()}>{children}</div>
        {footer && <footer className="sf-sheet__footer">{footer}</footer>}
      </section>
    </Overlay>
  )
}

export function FrontHeader({
  title,
  showBack = Boolean(title),
  onBack,
  onMenu,
  onService,
  balance = '0.00',
  currency = 'USDT',
  onCurrency,
  onRefresh,
  onRecharge,
  home = !title,
  showBalance = !title,
  showService = true,
  className = '',
}) {
  const [toast, notify] = useFeedback()
  const invoke = (callback, fallback) => callback ? callback() : notify(fallback)
  return (
    <>
      <header className={`sf-front-header ${home ? 'sf-front-header--home' : 'sf-front-header--title'} ${className}`.trim()}>
        <div className="sf-front-header__left">
          {showBack ? (
            <button type="button" className="sf-header-icon-btn" onClick={() => invoke(onBack, '已返回上一页')} aria-label="返回">
              <ChevronLeft size={25} />
            </button>
          ) : (
            <button type="button" className="sf-header-icon-btn sf-header-icon-btn--menu" onClick={() => invoke(onMenu, '菜单已打开')} aria-label="菜单">
              <Menu size={23} />
            </button>
          )}
          {home && <Brand />}
        </div>

        {title && <h1 className="sf-front-header__title">{title}</h1>}

        <div className="sf-front-header__actions">
          {showBalance && (
            <div className="sf-balance-chip">
              <button type="button" className="sf-balance-chip__main" onClick={() => invoke(onCurrency, '币种切换为演示状态')}>
                <span className="sf-token-dot">₮</span>
                <span>{balance}</span>
                <small>{currency === 'USDT' ? '' : currency}</small>
                <ChevronDown size={12} />
              </button>
              <button type="button" className="sf-balance-chip__refresh" onClick={() => invoke(onRefresh, '余额已刷新')} aria-label="刷新余额">
                <RefreshCw size={14} />
              </button>
            </div>
          )}
          {home && (
            <button type="button" className="sf-country-btn" onClick={() => invoke(onRecharge, '充值入口已打开')} aria-label="充值">
              <span>★</span>
            </button>
          )}
          {showService && (
            <button type="button" className="sf-service-btn" onClick={() => invoke(onService, '在线客服弹层已打开')} aria-label="联系客服">
              <img src={assetPath('service.png')} alt="" />
            </button>
          )}
        </div>
      </header>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </>
  )
}

function NavGlyph({ item, active }) {
  if (active && item.activeImage) return <img src={item.activeImage} alt="" />
  if (item.icon === 'home') return <Home />
  if (item.icon === 'entertainment') return <Gamepad2 />
  if (item.icon === 'deposit') return <WalletCards />
  if (item.icon === 'benefit') return <Gift />
  return <UserRound />
}

export function BottomNav({ active = 'home', onNavigate, items = bottomNavItems, className = '' }) {
  const [toast, notify] = useFeedback()
  return (
    <>
      <nav className={`sf-bottom-nav ${className}`.trim()} aria-label="用户端主导航">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <button
              type="button"
              key={item.id}
              className={`sf-bottom-nav__item ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                if (isActive) notify(`当前已在${item.label}`)
                else {
                  notify(`正在打开${item.label}`)
                  onNavigate?.(item.path, item)
                }
              }}
            >
              <span className="sf-bottom-nav__icon"><NavGlyph item={item} active={isActive} /></span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </>
  )
}

export function SideMenu({ open, onClose = noop, onNavigate, balance = '0.00', onToast }) {
  const [toast, notify] = useFeedback(onToast)
  const openItem = (item) => {
    notify(`正在打开${item.label}`)
    if (item.path) onNavigate?.(item.path, item)
    onClose()
  }
  return (
    <>
      <Overlay open={open} onClose={onClose} className="sf-side-menu-overlay" zIndex={1160}>
        <aside className="sf-side-menu" aria-label="快捷菜单">
          <div className="sf-side-menu__top">
            <Brand />
            <div className="sf-side-menu__spacer" />
            <span className="sf-token-dot">₮</span><b>{balance}</b>
            <RefreshCw size={14} />
            <span className="sf-country-btn sf-country-btn--static">★</span>
            <img className="sf-side-menu__service" src={assetPath('service.png')} alt="客服" />
            <button type="button" className="sf-side-menu__close" onClick={onClose} aria-label="关闭菜单"><X /></button>
          </div>
          <div className="sf-side-menu__list">
            {sideMenuItems.map((item) => (
              <button key={item.id} type="button" className="sf-side-menu__item" onClick={() => openItem(item)}>
                <span className={`sf-side-menu__item-icon sf-side-menu__item-icon--${item.id}`}>{item.icon}</span>
                <span>{item.label}</span>
                <ChevronRight size={19} />
              </button>
            ))}
          </div>
        </aside>
      </Overlay>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} zIndex={1500} />
    </>
  )
}

function SectionTitle({ icon, children, action, onAction }) {
  return (
    <div className="sf-section-title">
      <h2>{icon && <span>{icon}</span>}{children}</h2>
      {action && <button type="button" onClick={onAction}>{action}<ChevronRight size={14} /></button>}
    </div>
  )
}

export function HomePage({ onNavigate, onToast, balance = '0.00', userName = 'demo001', initialTab = 'hot' }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  const [menuOpen, setMenuOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [activeBanner, setActiveBanner] = useState(0)
  const [activeGameTab, setActiveGameTab] = useState(initialTab)
  const [rankTab, setRankTab] = useState('lottery')
  const [expandedRank, setExpandedRank] = useState(false)
  const games = useMemo(() => gameCards.filter((game) => game.category.includes(activeGameTab)).slice(0, 12), [activeGameTab])
  const ranking = expandedRank ? rankRows : rankRows.slice(0, 5)

  useEffect(() => {
    if (gameTabs.some((tab) => tab.id === initialTab)) setActiveGameTab(initialTab)
  }, [initialTab])

  return (
    <div className="sf-page sf-home-page sf-page--with-bottom">
      <FrontHeader
        balance={balance}
        onMenu={() => setMenuOpen(true)}
        onService={() => setServiceOpen(true)}
        onRecharge={() => go('/pages/deposit/index', '充值')}
        onCurrency={() => notify('可在钱包中切换 USDT / TRX / CNY')}
        onRefresh={() => notify('余额刷新成功', 'success')}
      />

      <main className="sf-home-content">
        <section className="sf-home-carousel" aria-label="活动轮播">
          <button type="button" className="sf-home-carousel__image" onClick={() => go('/pages/benefit/index', homeBanners[activeBanner].label)}>
            <img src={homeBanners[activeBanner].image} alt={homeBanners[activeBanner].label} />
          </button>
          <div className="sf-home-carousel__dots">
            {homeBanners.map((banner, index) => (
              <button key={banner.id} type="button" className={activeBanner === index ? 'is-active' : ''} onClick={() => setActiveBanner(index)} aria-label={`查看${banner.label}`} />
            ))}
          </div>
        </section>

        <section className="sf-pool-card">
          <div className="sf-pool-card__title">奖池实时余额</div>
          <button type="button" onClick={() => notify('USDT 奖池余额已刷新')}>
            <span><span className="sf-token-dot">₮</span> USDT奖池</span><b>0.00</b>
          </button>
          <button type="button" className="sf-pool-card__history" onClick={() => go('/pages/prize/index', '奖池实时余额')}>
            <span>历史返奖</span><b>270,870<small>次</small></b>
          </button>
          <button type="button" onClick={() => notify('TRX 奖池余额已刷新')}>
            <span><span className="sf-trx-dot">◆</span> TRX奖池</span><b>0.00</b>
          </button>
        </section>

        <div className="sf-game-tabs" role="tablist" aria-label="游戏分类">
          {gameTabs.map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeGameTab === tab.id}
              className={activeGameTab === tab.id ? 'is-active' : ''}
              key={tab.id}
              onClick={() => setActiveGameTab(tab.id)}
            ><span>{tab.icon}</span>{tab.label}</button>
          ))}
        </div>

        <section className="sf-game-grid" aria-label="游戏列表">
          {games.map((game, index) => (
            <button type="button" className="sf-game-card" key={game.id} onClick={() => game.path ? go(game.path, game.title) : notify(`${game.title}游戏入口已打开（演示）`)}>
              <img src={game.image} alt={game.title} />
              {index < 8 && <span className="sf-game-card__hot">HOT!</span>}
              <span className="sf-game-card__streak">{game.streak} <b>{game.result}</b> <em>{game.periods}期</em></span>
            </button>
          ))}
        </section>

        <section className="sf-rank-card">
          <SectionTitle icon="🏆">排行榜</SectionTitle>
          <div className="sf-rank-tabs">
            <button type="button" className={rankTab === 'lottery' ? 'is-active' : ''} onClick={() => setRankTab('lottery')}>彩票实时盈利</button>
            <button type="button" className={rankTab === 'g6' ? 'is-active' : ''} onClick={() => setRankTab('g6')}>G6盈利榜</button>
          </div>
          <div className="sf-rank-table" role="table">
            <div className="sf-rank-table__row sf-rank-table__head" role="row">
              <span>开奖区块</span><span>玩家</span><span>时间</span><span>盈利</span><span>游戏</span>
            </div>
            {ranking.map((row) => (
              <button type="button" className="sf-rank-table__row" role="row" key={`${row.block}-${row.time}`} onClick={() => notify(`${row.player} 在${row.game}盈利 ${row.profit} USDT`)}>
                <span>{row.block}</span><span>{row.player}</span><span>{row.time}</span><strong>+{row.profit}</strong><span>{row.game}</span>
              </button>
            ))}
          </div>
          <button type="button" className="sf-rank-expand" onClick={() => setExpandedRank((value) => !value)}>{expandedRank ? '收起' : '展开'}<ChevronDown className={expandedRank ? 'is-up' : ''} size={15} /></button>
        </section>

        <section className="sf-wallet-section">
          <SectionTitle icon="💼">推荐钱包与交易所</SectionTitle>
          <div className="sf-wallet-vendors">
            {walletVendors.map((vendor) => (
              <button key={vendor.id} type="button" className="sf-wallet-vendor" onClick={() => notify(`${vendor.name} 下载为演示操作`)}>
                {vendor.image ? <img src={vendor.image} alt="" /> : <span style={{ background: vendor.tone }}>{vendor.monogram}</span>}
                <b>{vendor.name}</b><small>{vendor.detail}</small><ChevronRight size={15} />
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="home" onNavigate={(path) => onNavigate?.(path)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} balance={balance} onToast={onToast} />
      <BottomSheet open={serviceOpen} title="联系客服" onClose={() => setServiceOpen(false)} layer={1}>
        <ServicePage embedded userName={userName} onToast={onToast} />
      </BottomSheet>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

export function EntertainmentPage({ onNavigate, onToast, onBack }) {
  const { toast, notify } = usePageActions(onNavigate, onToast)
  return (
    <div className="sf-page sf-entertainment-page sf-page--with-bottom">
      <FrontHeader onMenu={() => notify('快捷菜单可从首页打开')} onService={() => notify('在线客服已准备就绪')} onRefresh={() => notify('余额刷新成功', 'success')} />
      <main className="sf-empty-expectation">
        <div className="sf-empty-expectation__art"><Gamepad2 /><span>•••</span></div>
        <h2>敬请期待！</h2>
        <p>娱乐游戏即将上线</p>
        <button type="button" onClick={() => (onBack ? onBack() : onNavigate?.('/pages/index/index'))}>返回首页看看</button>
      </main>
      <BottomNav active="entertainment" onNavigate={(path) => onNavigate?.(path)} />
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

export function BenefitPage({ onNavigate, onToast, onBack }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  return (
    <div className="sf-page sf-benefit-page sf-page--with-bottom">
      <FrontHeader title="福利中心" onBack={onBack || (() => go('/pages/index/index', '首页'))} onService={() => notify('福利专属客服已打开')} />
      <main className="sf-benefit-list">
        {benefits.map((benefit) => (
          <button key={benefit.id} type="button" className={`sf-benefit-card ${benefit.className}`} onClick={() => go(benefit.path, benefit.title)}>
            <span className="sf-benefit-card__copy"><b>{benefit.title}</b><small>{benefit.caption} <em>{benefit.amount}</em></small></span>
            <span className="sf-benefit-card__art">{benefit.art}</span>
          </button>
        ))}
      </main>
      <BottomNav active="benefit" onNavigate={(path) => onNavigate?.(path)} />
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

function ActionImage({ item }) {
  return item.image ? <img src={item.image} alt="" /> : <span>{item.icon || '•'}</span>
}

export function UserPage({ onNavigate, onToast, userName = 'demo001', userId = '297' }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  const [walletMode, setWalletMode] = useState('balance')
  const [showBalance, setShowBalance] = useState(true)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)
  const [changeNoteOpen, setChangeNoteOpen] = useState(false)
  const [address, setAddress] = useState('')

  const handleAction = (item) => {
    if (item.id === 'service') return setServiceOpen(true)
    if (item.path) return go(item.path, item.label)
    notify(`${item.label}为前端演示操作`)
  }

  return (
    <div className="sf-page sf-user-page sf-page--with-bottom">
      <section className="sf-user-hero">
        {userPageRequirement && (
          <button
            type="button"
            className="sf-user-change-note"
            aria-haspopup="dialog"
            onClick={() => setChangeNoteOpen(true)}
          >
            <span className="sf-user-change-note__icon"><BookOpen size={16} /></span>
            <span className="sf-user-change-note__title">本次修改说明 <em>({userPageRequirement.changeType})</em></span>
            <small>最近修改 {userPageRequirement.completedAt}</small>
            <ChevronRight size={16} />
          </button>
        )}
        <div className="sf-user-profile">
          <button type="button" className="sf-user-avatar" onClick={() => notify('头像更换为演示功能')}><img src={assetPath('default-avatar.png')} alt="用户头像" /><span>✎</span></button>
          <button type="button" className="sf-user-identity" onClick={() => notify(`账号 ${userName}，ID ${userId}`)}>
            <b>{userName} <small>(ID:{userId})</small></b><span>TRC20地址　<em>未绑定</em></span>
          </button>
          <button type="button" className="sf-bind-address" onClick={() => setAddressOpen(true)}>绑定地址</button>
        </div>

        <section className="sf-user-wallet">
          <div className="sf-user-wallet__tabs">
            <button type="button" className={walletMode === 'balance' ? 'is-active' : ''} onClick={() => setWalletMode('balance')}>余额钱包</button>
            <button type="button" className="sf-eye-toggle" onClick={() => setShowBalance((value) => !value)} aria-label={showBalance ? '隐藏余额' : '显示余额'}>{showBalance ? <EyeOff /> : <Eye />}</button>
            <button type="button" className="sf-wallet-refresh" onClick={() => notify('钱包余额已刷新', 'success')}><RefreshCw /></button>
            <button type="button" className={walletMode === 'fixed' ? 'is-active' : ''} onClick={() => setWalletMode('fixed')}>固率钱包</button>
          </div>
          <div className="sf-user-wallet__head"><span>币种</span><span>钱包余额</span><span>佣金余额</span></div>
          {walletCurrencies.map((currency, index) => (
            <button key={currency.id} type="button" className={`sf-user-wallet__row ${index === 0 ? 'is-selected' : ''}`} onClick={() => notify(`${currency.name} 钱包已选中`)}>
              <span><img src={currency.icon} alt="" />{currency.name}</span>
              <b>{showBalance ? currency.balance : '••••'}</b><b>{showBalance ? currency.commission : '••••'}</b>
              {index === 0 && <ChevronDown size={14} />}
            </button>
          ))}
        </section>
      </section>

      <main className="sf-user-actions">
        <section className="sf-user-primary-actions">
          {userPrimaryActions.map((item) => <button type="button" key={item.id} onClick={() => handleAction(item)}><ActionImage item={item} /><span>{item.label}</span></button>)}
        </section>
        <section className="sf-user-action-grid sf-user-action-grid--money">
          {userMoneyActions.map((item) => <button type="button" key={item.id} onClick={() => handleAction(item)}><ActionImage item={item} /><span>{item.label}</span></button>)}
        </section>
        <section className="sf-user-action-grid sf-user-action-grid--menu">
          {userMenuActions.map((item) => (
            <button type="button" key={item.id} onClick={() => handleAction(item)}>
              <span className="sf-user-action-grid__icon"><ActionImage item={item} />{item.badge && <em>{item.badge}</em>}</span><span>{item.label}</span>
            </button>
          ))}
        </section>
      </main>

      <BottomNav active="user" onNavigate={(path) => onNavigate?.(path)} />
      <BottomSheet
        open={changeNoteOpen}
        title="本次修改说明"
        onClose={() => setChangeNoteOpen(false)}
        className="sf-user-change-sheet"
        bodyClassName="sf-user-change-sheet__body"
        footer={<button type="button" className="sf-primary-button" onClick={() => setChangeNoteOpen(false)}>我知道了</button>}
      >
        {userPageRequirement && (
          <div className="sf-user-change-content">
            <div className="sf-user-change-summary">
              <span><BookOpen size={18} /></span>
              <div><b>{userPageRequirement.moduleName}</b><small>({userPageRequirement.changeType}) · {userPageRequirement.completedAt}</small></div>
            </div>
            <p className="sf-user-change-lead">{userPageRequirement.requirement}</p>
            <section>
              <h3>本次修改</h3>
              <ul>{userPageRequirement.changes.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h3>账号与安全规则</h3>
              <SecurityRuleCards rules={userPageRequirement.fields} />
            </section>
            <section>
              <h3>操作与状态逻辑</h3>
              <p>{userPageRequirement.operationLogic}</p>
              <p>{userPageRequirement.stateLogic}</p>
            </section>
            <section>
              <h3>绑定地址充值找回</h3>
              <p>{userPageRequirement.amountLogic}</p>
            </section>
            <section>
              <h3>验收说明</h3>
              <ul>{userPageRequirement.acceptance.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <p className="sf-user-change-warning">本页及全部安全找回仅为前端演示，不连接真实账号、钱包、支付、谷歌验证器或链上网络。</p>
          </div>
        )}
      </BottomSheet>
      <BottomSheet open={serviceOpen} title="联系客服" onClose={() => setServiceOpen(false)}>
        <ServicePage embedded userName={userName} onToast={onToast} />
      </BottomSheet>
      <BottomSheet
        open={addressOpen}
        title="绑定 TRC20 地址"
        onClose={() => setAddressOpen(false)}
        footer={<button type="button" className="sf-primary-button" onClick={() => { if (!address.trim()) return notify('请输入钱包地址'); setAddressOpen(false); notify('演示地址已绑定', 'success') }}>确认绑定</button>}
      >
        <label className="sf-form-field"><span>钱包地址</span><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="请输入 TRC20 钱包地址" /></label>
        <p className="sf-form-hint">仅保存于当前页面演示状态，不会发送或校验真实链上地址。</p>
      </BottomSheet>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

export function ServicePage({ embedded = false, onBack, onToast, onConsult }) {
  const [toast, notify] = useFeedback(onToast)
  const consult = () => {
    onConsult?.()
    notify('已进入在线客服演示会话', 'success')
  }
  const content = (
    <div className="sf-service-content">
      <div className="sf-service-hero">
        <span className="sf-service-hero__icon"><Headphones /></span>
        <span><b>7x24 小时在线客服</b><small>客服专员将尽快为您服务</small></span>
      </div>
      <button type="button" className="sf-service-row" onClick={consult}>
        <span><MessageCircle size={18} />在线客服(7x24小时)</span><b>进入咨询</b>
      </button>
      <button type="button" className="sf-service-row" onClick={() => notify('常见问题已为您打开')}>
        <span><CircleHelp size={18} />常见问题自助查询</span><ChevronRight size={18} />
      </button>
    </div>
  )
  if (embedded) return <>{content}<Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} layer={2} /></>
  return (
    <div className="sf-page sf-service-page">
      <FrontHeader title="联系客服" onBack={onBack} showService={false} />
      <main>{content}</main>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

export function HelpPage({ onBack, onToast, onNavigate }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  return (
    <div className="sf-page sf-help-page">
      <FrontHeader title="帮助中心" onBack={onBack || (() => go('/pages/user/user', '用户中心'))} showService={false} />
      <section className="sf-help-banner">
        <span><b>游戏帮助教程</b><small>转账即开奖　畅玩游戏一触即发</small></span>
        <span className="sf-help-banner__art"><BookOpen /><i>?</i></span>
      </section>
      <main className="sf-help-content">
        <SectionTitle action="购买虚拟币" onAction={() => notify('购买虚拟币入口已打开（演示）')}>官方推荐钱包 <small>点击图标直达下载</small></SectionTitle>
        <p className="sf-help-warning">本站仅支持所有【去中心化钱包】转账，<em>禁止使用【交易所】转账</em></p>
        <div className="sf-help-wallet-grid">
          {helpWallets.map((wallet) => (
            <article key={wallet.id} className="sf-help-wallet-card">
              <button type="button" className="sf-help-wallet-card__brand" onClick={() => notify(`${wallet.name} 钱包已选中`)}>
                <span style={{ background: wallet.tone }}>{wallet.monogram}</span><b>{wallet.name}</b>
              </button>
              <div><button type="button" onClick={() => notify(`${wallet.name} 教程已打开`)}>教程</button><button type="button" onClick={() => notify(`${wallet.name} 下载为演示操作`)}>下载</button></div>
            </article>
          ))}
        </div>
        <SectionTitle>游戏相关</SectionTitle>
        <div className="sf-help-topic-grid">
          {helpTopics.map((topic) => <button type="button" key={topic.id} onClick={() => notify(`${topic.label}已打开`)}><b>{topic.label}</b><span>{topic.icon}</span></button>)}
        </div>
        <SectionTitle>波场区块链浏览器</SectionTitle>
        <div className="sf-chain-links">
          <button type="button" onClick={() => notify('Tronscan.io 为外部演示入口')}><Globe2 />Tronscan.io<ArrowUpRight /></button>
          <button type="button" onClick={() => notify('Tokenview.io 为外部演示入口')}><Globe2 />Tokenview.io<ArrowUpRight /></button>
        </div>
      </main>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

const downloadTabs = [
  ['official', '官方下载'], ['wallet', '钱包下载'], ['exchange', '交易所下载'], ['other', '其他下载'],
]

export function DownloadPage({ onBack, onToast, onNavigate }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  const [tab, setTab] = useState('official')
  return (
    <div className="sf-page sf-download-page">
      <FrontHeader title="相关下载" onBack={onBack || (() => go('/pages/user/user', '用户中心'))} showService={false} />
      <div className="sf-download-tabs" role="tablist">
        {downloadTabs.map(([id, label]) => <button type="button" key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>{label}</button>)}
      </div>
      <main className="sf-download-content">
        <p>在任意交易所中购买USDT和TRX，然后将其转入G6哈希支持的数字货币钱包，即可参与游戏。</p>
        <p className="sf-download-note">注:若无法打开，请在“我的-相关下载-其他下载”下载VPN打开</p>
        <div className="sf-download-list">
          {downloadGroups[tab].map((item) => (
            <article key={item.id} className="sf-download-item">
              {item.image ? <img src={item.image} alt="" /> : <span>{item.icon}</span>}
              <div><b>{item.name}</b><small>{item.detail}</small></div>
              <button type="button" onClick={() => notify(`${item.name} 下载为前端演示，不会获取真实安装包`)}><Download size={16} />下载</button>
            </article>
          ))}
        </div>
      </main>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

const prizePoolSections = [
  { id: 'bonus', title: '奖金池', note: '备付金低于200,000 USDT时，奖金池金额将自动转入备付金' },
  { id: 'reserve', title: '备付金', note: '派彩票地址低于 7W USDT 归集' },
  { id: 'payout', title: '派彩地址', extra: '累计派彩 -- 次' },
]

export function PrizePoolPage({ onBack, onToast, onNavigate }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  const [queried, setQueried] = useState({})
  const [addressesOpen, setAddressesOpen] = useState(true)
  const addresses = [
    { label: 'USDT 转账投注地址', value: 'TQf8...G6HX' },
    { label: 'TRX 转账投注地址', value: 'TUv6...HASH' },
  ]

  const querySection = (section) => {
    setQueried((current) => ({ ...current, [section.id]: true }))
    notify(`${section.title}查询完成，暂无数据`, 'success')
  }

  return (
    <div className="sf-page sf-prize-pool-page">
      <header className="sf-prize-pool-hero">
        <div className="sf-prize-pool-hero__title">
          <button type="button" onClick={onBack || (() => go('/pages/index/index', '首页'))} aria-label="返回"><ChevronLeft /></button>
          <h1>奖池实时余额</h1>
          <button type="button" onClick={() => notify('奖池客服已打开')} aria-label="联系客服"><Headphones /></button>
        </div>
        <div className="sf-prize-pool-hero__balances">
          <button type="button" onClick={() => notify('USDT 奖池暂无余额')}><span><span className="sf-token-dot">₮</span>USDT奖池</span><b>--</b></button>
          <button type="button" onClick={() => notify('TRX 奖池暂无余额')}><span><span className="sf-trx-dot">◆</span>TRX奖池</span><b>--</b></button>
        </div>
        <button type="button" className="sf-prize-pool-hero__history" onClick={() => notify('历史返奖暂无记录')}>历史返奖 -- 次</button>
      </header>

      <main className="sf-prize-pool-content">
        {prizePoolSections.map((section) => (
          <section className="sf-prize-pool-card" key={section.id}>
            <header>
              <h2>{section.title}</h2>
              {section.extra && <span>{section.extra}</span>}
              <button type="button" onClick={() => querySection(section)}>查询 <ChevronRight /></button>
            </header>
            <button type="button" className="sf-prize-pool-card__data" onClick={() => querySection(section)}>
              <span className="sf-prize-pool-card__main">{queried[section.id] ? '暂无数据' : '--'}</span>
              <span><span><span className="sf-token-dot">₮</span>{queried[section.id] ? '暂无数据' : '--'}</span><span><span className="sf-trx-dot">◆</span>{queried[section.id] ? '暂无数据' : '--'}</span></span>
            </button>
            {section.note && <p>{section.note}</p>}
          </section>
        ))}

        <section className="sf-prize-pool-card sf-prize-address-card">
          <header>
            <h2>转账投注地址</h2>
            <button type="button" onClick={() => setAddressesOpen((value) => !value)}>{addressesOpen ? '收起' : '展开'} <ChevronDown className={addressesOpen ? 'is-up' : ''} /></button>
          </header>
          {addressesOpen && (
            <div className="sf-prize-address-list">
              {addresses.map((address) => (
                <button type="button" key={address.label} onClick={() => notify(`${address.label}已复制`, 'success')}>
                  <span><small>{address.label}</small><b>{address.value}</b></span><Copy />
                </button>
              ))}
              <p>演示地址仅用于界面展示，不可用于真实转账或链上投注。</p>
            </div>
          )}
        </section>
      </main>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

export function PrizePage({ activityId = 'weekly-rank', onBack, onToast, onNavigate }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  const benefit = benefits.find((item) => item.id === activityId) || benefits[0]
  return (
    <div className="sf-page sf-prize-page">
      <FrontHeader title={benefit.title} onBack={onBack || (() => go('/pages/benefit/index', '福利中心'))} onService={() => notify('活动客服已打开')} />
      <main className="sf-prize-content">
        <button type="button" className={`sf-benefit-card sf-prize-banner ${benefit.className}`} onClick={() => notify('活动长期有效，奖励自动派发')}>
          <span className="sf-benefit-card__copy"><b>{benefit.title}</b><small>{benefit.caption} <em>{benefit.amount}</em></small></span><span className="sf-benefit-card__art">{benefit.art}</span>
        </button>
        <h2 className="sf-decorated-title"><span>◇</span>活动内容<span>◇</span></h2>
        <section className="sf-prize-summary">
          <p>周榜业绩榜单奖励，每周流水榜单奖励，无需申请，每周一自动发放周榜奖励，排行榜只计算 TRX 流水。</p>
          <div><span>活动对象<b>全体会员</b></span><span>流水要求<b>1倍</b></span><span>活动时间<b>长期有效</b></span></div>
        </section>
        <section className="sf-prize-table">
          <div className="sf-prize-table__head"><span>周榜排名</span><span>奖励金额</span></div>
          {prizeRanks.map(([rank, amount]) => <button type="button" key={rank} onClick={() => notify(`第 ${rank} 名奖励 ${amount}`)}><span>{rank}</span><b>{amount}</b></button>)}
        </section>
        <h2 className="sf-decorated-title"><span>◇</span>活动规则<span>◇</span></h2>
        <ol className="sf-prize-rules">{prizeRules.map((rule, index) => <li key={rule}><span>{index + 1}</span>{rule}</li>)}</ol>
      </main>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} />
    </div>
  )
}

const agentTabs = [
  ['team', '我的团队'], ['links', '链接管理'], ['income', '收益明细'], ['open', '开户中心'],
]

function EmptyCard({ icon, title, description }) {
  return <div className="sf-agent-empty"><span>{icon}</span><b>{title}</b><p>{description}</p></div>
}

export function AgentPage({ onBack, onToast, onNavigate, userName = 'demo001' }) {
  const { toast, notify, go } = usePageActions(onNavigate, onToast)
  const [tab, setTab] = useState('links')
  const [dateFilter, setDateFilter] = useState('today')
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [description, setDescription] = useState('')
  const [wage, setWage] = useState('0.00')
  const [links, setLinks] = useState([])
  const linkSequence = useRef(1)
  const [openUser, setOpenUser] = useState('')
  const [openPassword, setOpenPassword] = useState('')

  const createLink = () => {
    if (inviteCode && !/^[A-Za-z0-9]{6,12}$/.test(inviteCode)) return notify('邀请码需为 6–12 位字母或数字')
    const code = inviteCode || `G6DEMO${String(linkSequence.current++).padStart(2, '0')}`
    setLinks((current) => [...current, { code, description: description || '默认推广链接', wage }])
    setCreateOpen(false)
    setInviteCode('')
    setDescription('')
    notify('推广链接创建成功', 'success')
  }

  const openAccount = () => {
    if (!/^[A-Za-z0-9]{6,16}$/.test(openUser)) return notify('请输入 6–16 位用户名')
    if (openPassword.length < 6) return notify('密码至少 6 位')
    notify(`下级账号 ${openUser} 创建成功`, 'success')
    setOpenUser('')
  }

  return (
    <div className={`sf-page sf-agent-page sf-agent-page--${tab}`}>
      <FrontHeader title="推广代理" onBack={onBack || (() => go('/pages/user/user', '用户中心'))} showService={false} />
      <div className="sf-agent-tabs" role="tablist">
        {agentTabs.map(([id, label]) => <button type="button" key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>{label}</button>)}
      </div>

      <main className="sf-agent-content">
        {tab === 'team' && (
          <div className="sf-agent-team">
            <div className="sf-agent-team__currency"><span className="sf-token-dot">₮</span> USDT</div>
            <div className="sf-filter-pills">
              {[['today', '今天'], ['yesterday', '昨天'], ['custom', '自定义']].map(([id, label]) => <button type="button" key={id} className={dateFilter === id ? 'is-active' : ''} onClick={() => setDateFilter(id)}>{label}{id === 'custom' && <CalendarDays />}</button>)}
            </div>
            <div className="sf-agent-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="请输入账号/ID" /><button type="button" onClick={() => notify(query ? `已查询 ${query}` : '请输入账号或 ID')}>查找</button></div>
            <section className="sf-team-summary">
              <h2>我的团队<small>团队整体汇总结果</small></h2>
              <div>{teamMetrics.map(([label, value]) => <button type="button" key={label} onClick={() => notify(`${label}：${value}`)}><span>{label}</span><b>{value}</b></button>)}</div>
            </section>
            <section className="sf-team-member">
              <h3><UserRound />团队会员 <b>{userName}</b></h3>
              <div>{teamMetrics.slice(0, 4).map(([label, value]) => <span key={label}><small>{label}</small><b>{value}</b></span>)}</div>
            </section>
            <p className="sf-list-end">没有更多了</p>
          </div>
        )}

        {tab === 'links' && (
          <div className="sf-agent-links">
            {links.length === 0 ? <EmptyCard icon={<Link2 />} title="还没有推广链接" description="点击下方按钮创建第一条推广链接" /> : (
              <div className="sf-agent-link-list">
                {links.map((link) => (
                  <article key={link.code}><span><b>{link.description}</b><small>邀请码：{link.code} · 工资 {link.wage}%</small></span><button type="button" onClick={() => notify(`邀请码 ${link.code} 已复制`, 'success')}><Copy />复制</button></article>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'income' && <><h2 className="sf-agent-section-heading"><ReceiptText />收益明细</h2><EmptyCard icon={<BarChart3 />} title="暂无收益记录" description="团队产生有效流水后，收益明细将在这里展示" /></>}

        {tab === 'open' && (
          <form className="sf-agent-open-form" onSubmit={(event) => { event.preventDefault(); openAccount() }}>
            <label className="sf-form-field"><span>用户名</span><div><UserRound /><input value={openUser} onChange={(event) => setOpenUser(event.target.value)} placeholder="请输入用户名" /></div></label>
            <label className="sf-form-field"><span>密码</span><div><ShieldCheck /><input type="password" value={openPassword} onChange={(event) => setOpenPassword(event.target.value)} placeholder="请输入至少6位演示密码" /></div></label>
            <div className="sf-wage-card"><h3>哈希实时工资比例 <small>我的工资 0.00%</small></h3><button type="button" onClick={() => notify('区块链游戏实时工资比例：0.00%')}>区块链游戏实时工资比例：0.00% <ChevronDown /></button><input type="range" min="0" max="1" step="0.01" value={wage} onChange={(event) => setWage(event.target.value)} /></div>
            <div className="sf-agent-tip"><b>温馨提示：</b><p>1.在开户中心创建的账号将会成为您的下级</p><p>2.下级工资比例需低于我的工资，请谨慎设置。</p></div>
            <button type="submit" className="sf-primary-button">立即开户</button>
          </form>
        )}
      </main>

      {tab === 'links' && <div className="sf-agent-fixed-action"><button type="button" className="sf-primary-button" onClick={() => setCreateOpen(true)}><PlusCircle />创建链接</button></div>}

      <BottomSheet
        open={createOpen}
        title="创建推广链接"
        onClose={() => setCreateOpen(false)}
        className="sf-agent-create-sheet"
        footer={<button type="button" className="sf-primary-button" onClick={createLink}>确定</button>}
      >
        <div className="sf-agent-create-form">
          <h3>工资设置</h3>
          <div className="sf-wage-card"><h4>哈希实时工资比例 <small>我的工资 0.00%</small></h4><button type="button" onClick={() => notify('当前比例为前端演示数值')}>区块链游戏实时工资比例：{Number(wage).toFixed(2)}% <ChevronDown /></button><input type="range" min="0" max="1" step="0.01" value={wage} onChange={(event) => setWage(event.target.value)} /></div>
          <label className="sf-form-field"><span>邀请码</span><input value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} placeholder="留空自动生成 8 位邀请码" /><small>可输入 6–12 位字母或数字，创建后不可修改。</small></label>
          <label className="sf-form-field"><span>说明</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="请输入说明" /></label>
          <div className="sf-agent-tip"><b>温馨提示：</b><p>1.通过链接注册的账号将会成为您的下级</p><p>2.下级工资比例必须低于我的工资，邀请链接必须明确设置工资。</p></div>
        </div>
      </BottomSheet>
      <Toast open={Boolean(toast)} message={toast?.message} type={toast?.type} layer={2} />
    </div>
  )
}

export default {
  FrontHeader,
  BottomNav,
  Overlay,
  BottomSheet,
  Toast,
  HomePage,
  EntertainmentPage,
  BenefitPage,
  UserPage,
  SideMenu,
  ServicePage,
  HelpPage,
  DownloadPage,
  PrizePoolPage,
  PrizePage,
  AgentPage,
}
