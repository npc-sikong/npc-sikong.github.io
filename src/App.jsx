import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleUserRound,
  ClipboardCopy,
  Download,
  Eye,
  EyeOff,
  FileText,
  Gamepad2,
  KeyRound,
  Link2,
  ListFilter,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Maximize2,
  Menu,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tag,
  Ticket,
  Trash2,
  UserRound,
  Users,
  WalletCards,
  X,
  Zap,
} from 'lucide-react'
import { detailSchemas, memberRows, menuTreeRows, modalSchemas, navGroups, pageConfigs } from './data.js'
import { ModuleRequirementFrame, VersionNotesPage } from './RequirementFeatures.jsx'
import { GameRedLimitDialog, LotteryPeriodLimitDialog } from './LimitSettingsDialogs.jsx'
import MarketConfigDialog from './MarketConfigDialog.jsx'
import LotteryRulePage from './LotteryRulePage.jsx'
import TeamAnalysisPage from './TeamAnalysisPage.jsx'
import MemberAnalysisPage from './MemberAnalysisPage.jsx'
import WalletReconciliationPage from './WalletReconciliationPage.jsx'
import GameRiskControlPage, { getRiskAlertCount, initialGameRiskRows } from './GameRiskControlPage.jsx'
import { initialMemberRiskRules, MemberRiskRulePage, RiskMemberListPage } from './MemberRiskPages.jsx'
import { getGroupChangeType, getModuleChangeType, VERSION_NOTES_PATH } from './requirements.js'
import { createInitialSecurityProfile } from './securityRecoveryData.js'
import StorefrontApp from './storefront/StorefrontApp.jsx'
import { STOREFRONT_HOME, STOREFRONT_PREFIX } from './storefront/routes.js'

const iconMap = {
  Users,
  Link2,
  UserRound,
  FileText,
  Gamepad2,
  ChartNoAxesCombined,
  ShieldAlert,
  WalletCards,
  LockKeyhole,
  Ticket,
  Settings,
}

const primaryActions = new Set([
  '新增', '新增标签', '新增配置', '添加冷钱包', '新增热钱包', '新增 API Key', '新增默认方案',
  '新建版本', '新增线路', '新增厂商', '新增游戏', '新增银行', '新增提现方式', '新增提现类型',
  '新增充值渠道', '新增彩种', '保存', '保存配置', '保存新版本', '原子保存四方向', '立即同步',
])

const riskActions = new Set([
  '删除', '触发归集', '清退转出', '重置区块', '终止', '手动结算', '重新派生', '审核通过', '驳回',
  '同步三方', '重新选通道', '手动成功', '驳回并退款', '手动失败', '提交代付', '批量禁用', '批量启用',
])

const statusWords = new Set(['启用', '停用', '开启', '关闭', '正常', '成功', '失败', '已确认', '待审核', '已发布', '未发布'])

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return pathname
}

function go(path) {
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function titleForPath(path) {
  return pageConfigs[path]?.title || '会员列表'
}

function groupForPath(path) {
  return navGroups.find((group) => group.children.some((child) => Array.isArray(child) && child[0] === path))
}

function App() {
  const path = usePathname()
  const [toasts, setToasts] = useState([])
  const [securityProfile, setSecurityProfile] = useState(createInitialSecurityProfile)
  const [googleBound, setGoogleBound] = useState(true)

  const toast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((items) => [...items, { id, message, type }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2300)
  }

  useEffect(() => {
    if (path === '/' || path === '/login' || path === '/workbench' || path === '/member/security-recovery') go('/member/list')
  }, [path])

  const logout = () => {
    go('/member/list')
    toast('演示原型已保持登录状态')
  }

  if (path.startsWith(STOREFRONT_PREFIX)) {
    return (
      <StorefrontApp
        securityProfile={securityProfile}
        setSecurityProfile={setSecurityProfile}
        googleBound={googleBound}
        setGoogleBound={setGoogleBound}
      />
    )
  }

  return (
    <>
      <AdminShell
        path={path === '/' || path === '/login' || path === '/workbench' || path === '/member/security-recovery' ? '/member/list' : path}
        toast={toast}
        logout={logout}
      />
      <ToastStack items={toasts} />
    </>
  )
}

function ToastStack({ items }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {items.map((item) => (
        <div className={`toast toast-${item.type}`} key={item.id}>
          {item.type === 'loading' ? <LoaderCircle className="spin" size={16} /> : item.type === 'error' ? <X size={16} /> : <Check size={16} />}
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  )
}

function AdminShell({ path, toast, logout }) {
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState(() => new Set([groupForPath(path)?.label].filter(Boolean)))
  const [openTabs, setOpenTabs] = useState([{ path: '/member/list', title: '会员列表' }])
  const [themeOpen, setThemeOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [tabMenuOpen, setTabMenuOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [settingsState, setSettingsState] = useState({ tabs: true, single: false, logo: true, breadcrumb: true, width: 200 })
  const [riskGames, setRiskGames] = useState(() => initialGameRiskRows.map((game) => ({ ...game })))
  const [memberRiskRules, setMemberRiskRules] = useState(() => initialMemberRiskRules.map((rule) => ({ ...rule, conditions: rule.conditions.map((condition) => ({ ...condition })) })))
  const [mutedMemberAlerts, setMutedMemberAlerts] = useState({})
  const nextMemberRiskRuleId = useRef(Math.max(...initialMemberRiskRules.map((rule) => Number(rule.id) || 0)) + 1)
  const riskAlertCount = useMemo(() => getRiskAlertCount(riskGames), [riskGames])

  useEffect(() => {
    const group = groupForPath(path)
    if (group) {
      setOpenGroups((old) => {
        if (old.has(group.label)) return old
        const next = new Set(old)
        next.add(group.label)
        return next
      })
    }
    if (pageConfigs[path]) {
      setOpenTabs((tabs) => tabs.some((tab) => tab.path === path) ? tabs : [...tabs, { path, title: titleForPath(path) }])
    }
    document.title = titleForPath(path)
  }, [path])

  const toggleGroup = (label) => {
    setOpenGroups((old) => {
      const next = settingsState.single ? new Set() : new Set(old)
      if (old.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const closeTab = (targetPath) => {
    if (targetPath === '/member/list') return
    setOpenTabs((tabs) => {
      const index = tabs.findIndex((tab) => tab.path === targetPath)
      const next = tabs.filter((tab) => tab.path !== targetPath)
      if (path === targetPath) go(next[Math.max(0, index - 1)]?.path || '/member/list')
      return next
    })
  }

  const closeTabsBy = (mode) => {
    setTabMenuOpen(false)
    if (mode === 'current') closeTab(path)
    if (mode === 'other') setOpenTabs((tabs) => tabs.filter((tab) => tab.path === path || tab.path === '/member/list'))
    if (mode === 'all') {
      setOpenTabs([{ path: '/member/list', title: '会员列表' }])
      go('/member/list')
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
    toast('已切换全屏显示')
  }

  const doLogout = () => setConfirm({
    title: '退出登录',
    message: '确定要退出当前账号吗？',
    confirmText: '退出',
    onConfirm: logout,
  })

  const group = groupForPath(path)
  return (
    <div className={`admin-shell theme-light ${collapsed ? 'sidebar-collapsed' : ''} ${settingsState.tabs ? '' : 'tabs-hidden'} ${settingsState.logo ? '' : 'logo-hidden'}`} style={{ '--active-sidebar-width': `${collapsed ? 64 : settingsState.width}px` }}>
      <aside className="sidebar" style={{ width: collapsed ? 64 : settingsState.width }}>
        <div className="sidebar-logo">
          {settingsState.logo && <><span className="logo-failed">加载<br />失败</span>{!collapsed && <b>UU管理后台</b>}</>}
        </div>
        <nav className="side-menu">
          <SideLink
            path={VERSION_NOTES_PATH}
            current={path}
            icon={<FileText size={17} />}
            label="版本说明"
            collapsed={collapsed}
            changeType={getModuleChangeType(VERSION_NOTES_PATH)}
          />
          {navGroups.map((navGroup) => {
            const Icon = iconMap[navGroup.icon] || Menu
            const open = openGroups.has(navGroup.label)
            const activeGroup = navGroup.children.some((child) => Array.isArray(child) && child[0] === path)
            const childPaths = navGroup.children.filter(Array.isArray).map((child) => child[0])
            const changeType = getGroupChangeType(navGroup.label, childPaths)
            const alertCount = navGroup.label === '风控管理' ? riskAlertCount : 0
            return (
              <div className={`nav-group ${activeGroup ? 'active-group' : ''}`} key={navGroup.label}>
                <button className={`nav-group-button ${alertCount ? 'has-alert' : ''}`} onClick={() => toggleGroup(navGroup.label)} title={collapsed ? navGroup.label : undefined}>
                  <Icon size={17} />
                  {!collapsed && <span>{navGroup.label}</span>}
                  {!collapsed && changeType && <em className="nav-change-mark">({changeType})</em>}
                  {alertCount > 0 && <sup className="nav-alert-badge" aria-label={`${alertCount}个游戏需要亏损预警提醒`}>{alertCount > 99 ? '99+' : alertCount}</sup>}
                  {!collapsed && <ChevronDown className={open ? 'rotated' : ''} size={14} />}
                </button>
                {!collapsed && open && (
                  <div className="nav-children">
                    {navGroup.children.map((child, index) => child.section ? (
                      <div className="nav-section" key={`${child.section}-${index}`}>{child.section}</div>
                    ) : (
                      <SideLink key={child[0]} path={child[0]} current={path} label={child[1]} changeType={getModuleChangeType(child[0])} child />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      <section className="shell-body" style={{ marginLeft: collapsed ? 64 : settingsState.width }}>
        <header className="shell-header" style={{ left: collapsed ? 64 : settingsState.width }}>
          <div className="topbar">
            <div className="topbar-left">
              <button className="top-icon" onClick={() => setCollapsed((value) => !value)}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>
              <button className="top-icon" onClick={() => { toast('页面已刷新'); window.dispatchEvent(new Event('demo-refresh')) }}><RefreshCw size={17} /></button>
              {settingsState.breadcrumb && (
                <div className="breadcrumb">
                  {group && <><span>{group.label}</span><ChevronRight size={13} /></>}
                  <b>{titleForPath(path)}</b>
                </div>
              )}
            </div>
            <button className="admin-mode-switch" type="button" onClick={() => go(STOREFRONT_HOME)} aria-label="切换到用户端 H5">
              <Smartphone size={16} />
              <span>用户端 H5</span>
              <em>切换</em>
            </button>
            <div className="topbar-right">
              <button className="top-icon" onClick={toggleFullscreen}><Maximize2 size={17} /></button>
              <div className="dropdown-wrap">
                <button className="account-trigger" onClick={() => { setAccountOpen((value) => !value); setTabMenuOpen(false) }}>
                  <span className="avatar-photo" />
                  <span>admin1</span><ChevronDown size={14} />
                </button>
                {accountOpen && (
                  <div className="dropdown-menu account-menu">
                    <button onClick={() => { setAccountOpen(false); go('/user/setting') }}><CircleUserRound size={15} />个人设置</button>
                    <button onClick={() => { setAccountOpen(false); doLogout() }}><LogOut size={15} />退出登录</button>
                  </div>
                )}
              </div>
              <button className="top-icon" onClick={() => { setThemeOpen(true); setAccountOpen(false) }}><Settings size={17} /></button>
            </div>
          </div>
          {settingsState.tabs && (
            <div className="tabbar">
              <div className="tabs-scroll">
                {openTabs.map((tab) => (
                  <button key={tab.path} className={`app-tab ${tab.path === path ? 'active' : ''}`} onClick={() => go(tab.path)}>
                    {tab.path === path && <i />}{tab.title}
                    {tab.path !== '/member/list' && <X size={12} onClick={(event) => { event.stopPropagation(); closeTab(tab.path) }} />}
                  </button>
                ))}
              </div>
              <div className="dropdown-wrap tab-menu-wrap">
                <button className="tab-menu-trigger" onClick={() => setTabMenuOpen((value) => !value)}><ChevronDown size={16} /></button>
                {tabMenuOpen && (
                  <div className="dropdown-menu tab-actions">
                    <button onClick={() => closeTabsBy('current')}>关闭当前</button>
                    <button onClick={() => closeTabsBy('other')}>关闭其他</button>
                    <button onClick={() => closeTabsBy('all')}>关闭全部</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        <main className="main-content">
          <ModuleRequirementFrame path={path}>
            <PageRenderer path={path} config={pageConfigs[path] || pageConfigs['/member/list']} toast={toast} riskGames={riskGames} setRiskGames={setRiskGames} memberRiskRules={memberRiskRules} setMemberRiskRules={setMemberRiskRules} allocateMemberRiskRuleId={() => nextMemberRiskRuleId.current++} mutedMemberAlerts={mutedMemberAlerts} setMutedMemberAlerts={setMutedMemberAlerts} />
          </ModuleRequirementFrame>
        </main>
      </section>

      {themeOpen && <ThemeDrawer state={settingsState} setState={setSettingsState} close={() => setThemeOpen(false)} toast={toast} />}
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} onConfirm={() => { const callback = confirm.onConfirm; setConfirm(null); callback?.() }} />}
    </div>
  )
}

function SideLink({ path, current, icon, label, collapsed, child, changeType }) {
  return (
    <button className={`side-link ${child ? 'side-child' : ''} ${path.startsWith('/risk/') ? 'compact-label' : ''} ${current === path ? 'active' : ''}`} onClick={() => go(path)} title={collapsed ? label : undefined}>
      {icon || <span className="child-dot" />}
      {!collapsed && <><span className="side-link-label">{label}</span>{changeType && <em className="nav-change-mark">({changeType})</em>}</>}
    </button>
  )
}

function ThemeDrawer({ state, setState, close, toast }) {
  const toggle = (key) => setState((old) => ({ ...old, [key]: !old[key] }))
  return (
    <div className="drawer-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <aside className="theme-drawer">
        <div className="drawer-header"><b>主题设置</b><button onClick={close}><X size={18} /></button></div>
        <div className="drawer-body">
          <h3>风格设置</h3>
          <div className="theme-preview-row">
            <button type="button" aria-label="浅色风格" className="theme-preview light selected"><span /><i /></button>
          </div>
          <SettingRow label="主题颜色"><span className="color-dot" /></SettingRow>
          <SettingRow label="开启多页签栏"><Switch checked={state.tabs} onChange={() => toggle('tabs')} /></SettingRow>
          <SettingRow label="只展开一个一级菜单"><Switch checked={state.single} onChange={() => toggle('single')} /></SettingRow>
          <SettingRow label="菜单栏宽度"><input className="tiny-number" value={state.width} onChange={(event) => setState((old) => ({ ...old, width: Math.max(180, Math.min(260, Number(event.target.value) || 200)) }))} /></SettingRow>
          <SettingRow label="显示LOGO"><Switch checked={state.logo} onChange={() => toggle('logo')} /></SettingRow>
          <SettingRow label="显示面包屑"><Switch checked={state.breadcrumb} onChange={() => toggle('breadcrumb')} /></SettingRow>
          <button className="wide-outline-button" onClick={() => { setState({ tabs: true, single: false, logo: true, breadcrumb: true, width: 200 }); toast('主题已重置') }}><RotateCcw size={15} />重置主题</button>
        </div>
      </aside>
    </div>
  )
}

function SettingRow({ label, children }) {
  return <div className="setting-row"><span>{label}</span>{children}</div>
}

function Switch({ checked, onChange, disabled }) {
  return <button type="button" className={`switch ${checked ? 'checked' : ''}`} disabled={disabled} onClick={onChange}><i /></button>
}

function PageRenderer({ path, config, toast, riskGames, setRiskGames, memberRiskRules, setMemberRiskRules, allocateMemberRiskRuleId, mutedMemberAlerts, setMutedMemberAlerts }) {
  if (config.type === 'version-notes') return <VersionNotesPage onNavigate={go} />
  if (config.type === 'game-risk-control') return <GameRiskControlPage games={riskGames} setGames={setRiskGames} toast={toast} />
  if (config.type === 'member-risk-rules') return <MemberRiskRulePage rules={memberRiskRules} setRules={setMemberRiskRules} allocateRuleId={allocateMemberRiskRuleId} setMutedAlerts={setMutedMemberAlerts} toast={toast} />
  if (config.type === 'risk-member-list') return <RiskMemberListPage rules={memberRiskRules} mutedAlerts={mutedMemberAlerts} setMutedAlerts={setMutedMemberAlerts} toast={toast} />
  const special = {
    dashboard: Dashboard,
    status: BlockchainStatus,
    'promotion-settings': PromotionSettings,
    scheme: SchemePage,
    'fixed-wallet': FixedWallet,
    'finance-report': FinanceReport,
    'market-report': MarketReport,
    'member-list': MemberList,
    'tree-table': MenuTree,
    'lottery-bet': LotteryBet,
    'lottery-rule': LotteryRulePage,
    'team-analysis': TeamAnalysisPage,
    'member-analysis': MemberAnalysisPage,
    'wallet-reconciliation': WalletReconciliationPage,
    'captcha-settings': CaptchaSettings,
    'service-settings': ServiceSettings,
    'email-settings': EmailSettings,
    'user-settings': UserSettings,
    'login-register': LoginRegister,
    'personal-settings': PersonalSettings,
    blank: BlankPage,
  }[config.type]
  if (special) {
    const Component = special
    return <Component config={config} path={path} toast={toast} />
  }
  return <DataPage path={path} config={config} toast={toast} />
}

function DataPage({ path, config, toast, hideFilters = false }) {
  const [filterValues, setFilterValues] = useState({})
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(config.rows || [])
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [limitSettings, setLimitSettings] = useState({})
  const refreshTimer = useRef()
  const initialRowsLength = config.rows?.length || 0

  useEffect(() => {
    setRows(config.rows || [])
    setFilterValues({})
    setExpanded(false)
    setModal(null)
    setConfirm(null)
    setLimitSettings({})
  }, [path])

  useEffect(() => {
    const refresh = () => runLoading('页面已刷新')
    window.addEventListener('demo-refresh', refresh)
    return () => window.removeEventListener('demo-refresh', refresh)
  }, [path])

  const runLoading = (message = '查询成功') => {
    setLoading(true)
    window.clearTimeout(refreshTimer.current)
    refreshTimer.current = window.setTimeout(() => { setLoading(false); toast(message) }, 520)
  }

  const reset = () => {
    setFilterValues({})
    setLoading(true)
    window.setTimeout(() => { setLoading(false); toast('已重置筛选条件') }, 360)
  }

  const download = () => {
    const csv = [config.columns || [], ...(rows || [])].map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${config.title}-演示数据.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    toast('文件已生成')
  }

  const handleAction = (action, row, rowIndex) => {
    if (action === '更多筛选' || action === '展开筛选') { setExpanded((value) => !value); return }
    if (action === '展开/折叠') {
      const next = !expanded
      setExpanded(next)
      toast(next ? '菜单已全部展开' : '菜单已折叠')
      return
    }
    if (action.includes('导出')) { toast('导出任务已提交，请稍后下载'); return }
    if (action === '下载文件') { download(); return }
    if (action === '复制') { navigator.clipboard?.writeText(String(row?.[1] || row?.[0] || '')); toast('复制成功'); return }
    if (action.includes('刷新') || action === '立即同步' || action === '同步三方' || action === '查询余额') { runLoading(action === '立即同步' ? '同步成功' : '刷新成功'); return }
    if (action === '返回') { window.history.back(); return }
    if (action.startsWith('批量调赔率')) { toast('请先选择要调整的玩法', 'error'); return }
    if (path === '/lottery/game' && action === '玩法赔率') {
      go('/lottery/rule')
      return
    }
    if (path === '/game/base' && action === '盘口配置') {
      setModal({ type: 'market-config', row })
      return
    }
    if (path === '/game/base' && action === '游戏限红') {
      setModal({ type: 'game-red-limit', row })
      return
    }
    if (path === '/lottery/game' && action === '期数限红') {
      setModal({ type: 'lottery-period-limit', row })
      return
    }
    if (action === '详情' || action === '查看' || action === '数据来源' || action === '投注记录' || action === '盘口配置' || action === '玩法赔率' || action === '权限设置') {
      setModal({ type: 'detail', title: action === '权限设置' ? '权限设置' : `${config.title}${action}`, row, action })
      return
    }
    if (action === '编辑' || action.includes('新增') || action.includes('添加') || action.includes('新建') || action.includes('设置') || action.includes('导入') || action === '标签管理' || action.includes('批量添加') || action.includes('批量取消')) {
      setModal({ type: 'form', action, title: action === '编辑' ? `编辑${config.title.replace('管理', '')}` : undefined, row, rowIndex })
      return
    }
    if (riskActions.has(action)) {
      setConfirm({ action, message: confirmCopy(action), rowIndex })
      return
    }
    toast(`${action}成功`)
  }

  const confirmAction = () => {
    if (confirm?.action === '删除' && confirm.rowIndex != null) setRows((items) => items.filter((_, index) => index !== confirm.rowIndex))
    toast(actionSuccessCopy(confirm?.action))
    setConfirm(null)
  }

  const handleFormSuccess = (message, values) => {
    const isCreate = /新增|添加|新建|导入/.test(modal?.action || '')
    const isEdit = modal?.action === '编辑' && modal?.rowIndex != null
    if (isCreate || isEdit) {
      setRows((items) => {
        const columns = (config.columns || []).filter((column) => column !== '操作')
        const makeRow = (source = [], isNew = false) => {
          const next = [...source]
          const maxId = items.reduce((max, item) => Math.max(max, Number(item?.[0]) || 0), 0)
          columns.forEach((column, index) => {
            if (Object.prototype.hasOwnProperty.call(values, column)) {
              const value = values[column]
              next[index] = value === true ? '启用' : value === false ? '停用' : value
            } else if (isNew && next[index] == null) {
              next[index] = column === 'ID' || column.endsWith('ID') ? String(maxId + 1) : defaultCell(column, items.length)
            }
          })
          return next
        }
        if (isEdit) return items.map((item, index) => index === modal.rowIndex ? makeRow(item) : item)
        return [makeRow([], true), ...items]
      })
    }
    setModal(null)
    toast(message)
  }

  const treeRows = path === '/permission/menu' && expanded
    ? rows.flatMap((row, index) => {
      const children = index === 0 ? [] : (navGroups[index - 1]?.children || []).filter(Array.isArray)
      return [row, ...children.map((child, childIndex) => [`　└ ${child[1]}`, '菜单', '·', child[0], '正常', String(900 - childIndex), '2026-08-25 13:21:18'])]
    })
    : rows
  const total = path === '/permission/menu'
    ? treeRows.length
    : Math.max(0, (config.count || initialRowsLength) + (rows.length - initialRowsLength))

  return (
    <div className="page-stack">
      {(config.kicker || config.subtitle) && (
        <div className="intro-card">
          <div><span className="intro-kicker">{config.kicker || '运营配置'}</span><h1>{config.title}</h1><p>{config.subtitle}</p></div>
          {config.count > 0 && <div className="intro-number"><span>总数</span><b>{config.count}</b></div>}
        </div>
      )}
      {config.note && <InfoBanner tone="info" title="使用说明">{config.note}</InfoBanner>}
      {config.warning && <InfoBanner tone="warning" title="操作风险提示">{config.warning}</InfoBanner>}
      {!hideFilters && config.filters?.length > 0 && (
        <FilterPanel
          filters={config.filters}
          values={filterValues}
          setValues={setFilterValues}
          expanded={expanded}
          onQuery={() => runLoading('查询成功')}
          onReset={reset}
        />
      )}
      <section className="panel table-panel">
        <div className="table-toolbar">
          <div className="toolbar-actions">
            {(config.actions || []).map((action) => (
              <ActionButton key={action} label={action} onClick={() => handleAction(action)} />
            ))}
          </div>
          <div className="table-total">共 <b>{total}</b> 条</div>
        </div>
        <DataTable config={config} rows={treeRows} loading={loading} onAction={handleAction} toast={toast} />
        {config.footerNote && <div className="table-footer-note">{config.footerNote}</div>}
        <Pagination total={total} />
      </section>
      {modal?.type === 'form' && (
        <FormDialog path={path} config={config} action={modal.action} title={modal.title} row={modal.row} onClose={() => setModal(null)} onSuccess={handleFormSuccess} />
      )}
      {modal?.type === 'market-config' && <MarketConfigDialog gameRow={modal.row} onClose={() => setModal(null)} toast={toast} />}
      {modal?.type === 'game-red-limit' && <GameRedLimitDialog gameRow={modal.row} value={limitSettings[`${path}:${modal.row?.[0]}`]} onClose={() => setModal(null)} onSave={(values) => { setLimitSettings((old) => ({ ...old, [`${path}:${modal.row?.[0]}`]: values })); setModal(null); toast('游戏限红设置已保存') }} />}
      {modal?.type === 'lottery-period-limit' && <LotteryPeriodLimitDialog lotteryRow={modal.row} value={limitSettings[`${path}:${modal.row?.[0]}`]} onClose={() => setModal(null)} onSave={(values) => { setLimitSettings((old) => ({ ...old, [`${path}:${modal.row?.[0]}`]: values })); setModal(null); toast('期数限红设置已保存') }} />}
      {modal?.type === 'detail' && <DetailDialog path={path} config={config} row={modal.row} title={modal.title} action={modal.action} onClose={() => setModal(null)} toast={toast} />}
      {confirm && <ConfirmDialog title="操作确认" message={confirm.message} confirmText={confirm.action} onCancel={() => setConfirm(null)} onConfirm={confirmAction} danger={confirm.action === '删除' || confirm.action === '驳回'} />}
    </div>
  )
}

function FilterPanel({ filters, values, setValues, expanded, onQuery, onReset }) {
  const visibleFilters = expanded ? filters : filters.slice(0, 6)
  return (
    <section className="panel filter-panel">
      <div className="filter-grid">
        {visibleFilters.map((filter) => (
          <label className={`filter-item ${filter.type === 'date-range' ? 'date-filter' : ''}`} key={filter.label}>
            <span>{filter.label}</span>
            {filter.type === 'date-range' ? (
              <div className="date-range">
                <CalendarDays size={14} /><input value={values[`${filter.label}-start`] || ''} onChange={(event) => setValues((old) => ({ ...old, [`${filter.label}-start`]: event.target.value }))} placeholder="开始时间" />
                <em>至</em><input value={values[`${filter.label}-end`] || ''} onChange={(event) => setValues((old) => ({ ...old, [`${filter.label}-end`]: event.target.value }))} placeholder="结束时间" />
              </div>
            ) : (
              <div className="input-wrap">
                <input value={values[filter.label] || ''} onChange={(event) => setValues((old) => ({ ...old, [filter.label]: event.target.value }))} placeholder={filter.placeholder} />
                {filter.type === 'select' && <ChevronDown size={13} />}
              </div>
            )}
          </label>
        ))}
        <div className="filter-buttons">
          <button className="btn btn-primary" onClick={onQuery}><Search size={14} />查询</button>
          <button className="btn btn-default" onClick={onReset}><RotateCcw size={14} />重置</button>
        </div>
      </div>
    </section>
  )
}

function ActionButton({ label, onClick }) {
  const Icon = label.includes('新增') || label.includes('添加') || label.includes('新建') ? Plus : label.includes('导出') || label.includes('下载') ? Download : label.includes('刷新') || label.includes('同步') ? RefreshCw : label.includes('筛选') ? ListFilter : label.includes('删除') ? Trash2 : label.includes('编辑') ? Pencil : null
  const primary = primaryActions.has(label) || label.includes('新增') || label.includes('添加') || label.includes('新建')
  return <button className={`btn ${primary ? 'btn-primary' : label === '删除' ? 'btn-danger-text' : 'btn-default'}`} onClick={onClick}>{Icon && <Icon size={14} />}{label}</button>
}

function DataTable({ config, rows, loading, onAction, toast }) {
  const columns = config.columns || []
  const hasActions = columns[columns.length - 1] === '操作'
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr>{columns.map((column, index) => <th key={`${column}-${index}`}>{column}</th>)}</tr></thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={Math.max(1, columns.length)}><div className="table-loading"><LoaderCircle className="spin" size={24} /><span>加载中...</span></div></td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={Math.max(1, columns.length)}><div className="empty-state"><div className="empty-box">⌑</div><span>暂无数据</span></div></td></tr>
          ) : rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => {
                if (hasActions && columnIndex === columns.length - 1) {
                  return <td className={`actions-cell ${config.wideActions ? 'wide-actions' : ''}`} key={column}><div>{(config.rowActions || []).map((action) => <button key={action} className={action === '删除' || action === '驳回' ? 'danger-link' : ''} onClick={() => onAction(action, row, rowIndex)}>{action}</button>)}</div></td>
                }
                const value = row[columnIndex] ?? defaultCell(column, rowIndex)
                return <td key={`${column}-${columnIndex}`}>{renderCell(column, value, toast)}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderCell(column, value, toast) {
  const string = String(value ?? '-')
  if ((column === '状态' || column.includes('状态')) && statusWords.has(string)) {
    const positive = ['启用', '开启', '正常', '成功', '已确认', '已发布'].includes(string)
    return <span className={`status-tag ${positive ? 'positive' : string.includes('失败') ? 'negative' : 'neutral'}`}>{string}</span>
  }
  if (column === '头像' && string === '头像') return <span className="mini-avatar" />
  if ((column.includes('地址') || column.includes('哈希')) && string.length > 22) {
    return <span className="mono-cell" title={string}>{string.length > 36 ? `${string.slice(0, 14)}...${string.slice(-8)}` : string}<button onClick={() => { navigator.clipboard?.writeText(string); toast('复制成功') }}><ClipboardCopy size={13} /></button></span>
  }
  return <span className="cell-lines">{string}</span>
}

function defaultCell(column, index) {
  if (column === 'ID' || column.endsWith('ID')) return String(index + 1)
  if (column.includes('时间')) return '2026-08-25 13:21:18'
  if (column.includes('状态')) return '启用'
  if (column.includes('金额') || column.includes('余额') || column.includes('比例')) return index ? '0.00' : '100.00'
  if (column.includes('编码')) return `DEMO_${index + 1}`
  if (column.includes('名称') || column === '标题') return `演示${column}${index + 1}`
  return '-'
}

function Pagination({ total }) {
  const [pageSize, setPageSize] = useState(15)
  const [current, setCurrent] = useState(1)
  const pages = Math.max(1, Math.ceil((total || 0) / pageSize))
  useEffect(() => setCurrent((page) => Math.min(page, pages)), [pages])
  const visiblePages = Array.from(new Set([1, 2, current - 1, current, current + 1, pages - 1, pages].filter((page) => page >= 1 && page <= pages))).sort((a, b) => a - b)
  const cyclePageSize = () => {
    const sizes = [15, 30, 50]
    setPageSize(sizes[(sizes.indexOf(pageSize) + 1) % sizes.length])
    setCurrent(1)
  }
  return (
    <div className="pagination">
      <span>共 {total || 0} 条</span><button className="page-size" onClick={cyclePageSize}>{pageSize}条/页 <ChevronDown size={12} /></button>
      <button disabled={current === 1} onClick={() => setCurrent((page) => Math.max(1, page - 1))}><ChevronLeft size={13} /></button>
      {visiblePages.map((page, index) => <React.Fragment key={page}>{index > 0 && page - visiblePages[index - 1] > 1 && <span>...</span>}<button className={current === page ? 'active' : ''} onClick={() => setCurrent(page)}>{page}</button></React.Fragment>)}
      <button disabled={current === pages} onClick={() => setCurrent((page) => Math.min(pages, page + 1))}><ChevronRight size={13} /></button>
      <span>前往</span><input value={current} onChange={(event) => { const value = Number(event.target.value); if (value >= 1 && value <= pages) setCurrent(value) }} /><span>页</span>
    </div>
  )
}

function InfoBanner({ tone, title, children }) {
  return <section className={`info-banner ${tone}`}><div className="info-icon">{tone === 'warning' ? '!' : 'i'}</div><div><b>{title}</b><p>{children}</p></div></section>
}

function lotteryGameEditValue(field, row = []) {
  const [lotteryName = '', lotteryCode = ''] = String(row[1] || '').split('\n')
  const periodBlocks = String(row[4] || '').match(/\/\s*(\d+)\s*块/)?.[1] || '20'
  const limitLine = (currency) => {
    const line = String(row[7] || '').split('\n').find((item) => item.trim().startsWith(currency))
    return line ? line.replace(currency, '').trim().replace(/\s*~\s*/, ' / ') : ''
  }
  const values = {
    彩种名称: lotteryName,
    彩种编码: lotteryCode,
    玩法体系: row[3] || '',
    分类: row[2] || '',
    每期区块数: periodBlocks,
    链: row[5] || '',
    抽水率: row[6] || '0',
    排序: row[9] || '0',
    'USDT 最小/最大': limitLine('USDT'),
    'TRX 最小/最大': limitLine('TRX'),
    'CNY 最小/最大': limitLine('CNY'),
    快捷金额: row[8] || '',
    状态: row[11] === '启用',
    热门: row[10] === '热门',
  }
  return values[field]
}

function FormDialog({ path, config, action, title, row, onClose, onSuccess }) {
  const routeSchema = modalSchemas[path]
  const schema = routeSchema?.[action] || (routeSchema?.fields ? routeSchema : null) || {
    title: `${action || '编辑'}${config.title.replace('管理', '')}`,
    fields: (config.filters || []).map((filter) => filter.label).slice(0, 8).concat(['状态', '备注']),
  }
  const fields = schema.fields.length ? schema.fields : ['名称', '状态', '排序', '备注']
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((field, index) => {
    if (path === '/lottery/game' && action === '编辑') return [field, lotteryGameEditValue(field, row)]
    const columnIndex = config.columns?.indexOf(field) ?? -1
    const existing = columnIndex >= 0 ? row?.[columnIndex] : row?.[index]
    return [field, existing ?? (/状态|热门|推荐|允许|强制更新|多处登录|置顶|是否显示|封盘自动/.test(field) ? true : '')]
  })))
  const [error, setError] = useState('')
  const dialogTitle = title || (action === '编辑' ? schema.title.replace(/^新增|^添加|^新建/, '编辑') : schema.title)
  const wide = fields.length > 10

  const submit = () => {
    if (!String(values[fields[0]] || '').trim() && !['状态', '菜单类型'].includes(fields[0])) {
      setError(`请输入${fields[0]}`)
      return
    }
    const message = action === '编辑' ? '修改成功' : action?.includes('导入') ? '导入成功' : action?.includes('设置') ? '保存成功' : '新增成功'
    onSuccess(message, values)
  }

  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal-dialog form-dialog ${wide ? 'wide' : ''}`}>
        <div className="modal-header"><b>{dialogTitle}</b><button onClick={onClose}><X size={18} /></button></div>
        <div className="modal-body">
          {schema.tip && <div className="modal-tip"><ShieldCheck size={16} /><span>{schema.tip}</span></div>}
          <div className={`modal-form-grid ${wide ? 'two-columns' : ''}`}>
            {fields.map((field, index) => (
              <ModalField key={field} field={field} value={values[field]} setValue={(value) => { setValues((old) => ({ ...old, [field]: value })); if (index === 0) setError('') }} error={index === 0 ? error : ''} />
            ))}
          </div>
        </div>
        <div className="modal-footer"><button className="btn btn-default" onClick={onClose}>取消</button><button className="btn btn-primary" onClick={submit}>确定</button></div>
      </section>
    </div>
  )
}

function ModalField({ field, value, setValue, error }) {
  const lower = field.toLowerCase()
  const isSwitch = /状态|开关|启用|热门|推荐|允许|强制更新|多处登录|置顶|是否显示|封盘自动/.test(field)
  const isArea = /备注|说明|内容|正文|配置|私钥|公钥|链接|URL|规则/.test(field) && !/编码/.test(field)
  const isPassword = /密码|secret|key|密钥/i.test(lower)
  const isSelect = /类型|模式|平台|角色|场景|来源|币种|网络|分类|体系|方式|策略/.test(field)
  const isUpload = /图标|图片|封面|头像|横版图|LOGO/.test(field)
  return (
    <label className={`modal-field ${isArea ? 'field-wide' : ''}`}>
      <span><em>*</em>{field}</span>
      {isSwitch ? <div className="switch-field"><Switch checked={value !== false} onChange={() => setValue(value === false)} /><small>{value === false ? '关闭' : '开启'}</small></div>
        : isUpload ? <button type="button" className="upload-box" onClick={() => {}}><Plus size={18} /><span>添加</span></button>
          : isArea ? <textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder={`请输入${field}`} />
            : <div className="input-wrap"><input type={isPassword ? 'password' : 'text'} value={value} onChange={(event) => setValue(event.target.value)} placeholder={isSelect ? '请选择' : `请输入${field}`} />{isSelect && <ChevronDown size={13} />}</div>}
      {error && <small className="field-error">{error}</small>}
    </label>
  )
}

function DetailDialog({ path, config, row = [], title, action, onClose, toast }) {
  const routeSchema = detailSchemas[path]
  const schema = action === '权限设置'
    ? { title: '权限设置', tabs: [{ name: '菜单权限', kind: 'permission' }, { name: '数据权限', kind: 'data-permission' }] }
    : routeSchema?.[action] || routeSchema || { title, tabs: [{ name: '基本信息' }] }
  const tabs = schema.tabs || [{ name: '基本信息' }]
  const [tab, setTab] = useState(tabs[0].name)
  const activeTab = tabs.find((item) => item.name === tab) || tabs[0]
  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-dialog detail-dialog">
        <div className="modal-header"><b>{schema.title || title}</b><button onClick={onClose}><X size={18} /></button></div>
        <div className="detail-tabs scrollable">{tabs.map((item) => <button className={tab === item.name ? 'active' : ''} key={item.name} onClick={() => setTab(item.name)}>{item.name}</button>)}</div>
        <div className="modal-body detail-body">
          {activeTab.kind === 'permission' ? <PermissionTree /> : activeTab.kind === 'data-permission' ? <DataPermissionPanel /> : activeTab.columns ? (
            <DetailTabTable spec={activeTab} toast={toast} />
          ) : (
            <div className="descriptions-grid">
              {(config.columns || []).filter((column) => column !== '操作').slice(0, 18).map((column, index) => (
                <div key={`${column}-${index}`}><span>{column}</span><b>{row[index] ?? defaultCell(column, 0)}</b>{String(row[index] || '').length > 20 && <button onClick={() => toast('复制成功')}><ClipboardCopy size={13} /></button>}</div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer"><button className="btn btn-primary" onClick={onClose}>关闭</button></div>
      </section>
    </div>
  )
}

function DetailTabTable({ spec, toast }) {
  const rows = spec.rows || []
  return (
    <div className="detail-tab-panel">
      {spec.note && <InfoBanner tone="info" title="说明">{spec.note}</InfoBanner>}
      <div className="detail-tab-toolbar">
        <span>共 <b>{rows.length}</b> 条记录</span>
        <button className="btn btn-default" onClick={() => toast('刷新成功')}><RefreshCw size={14} />刷新</button>
      </div>
      <div className="detail-tab-table"><DataTable config={{ columns: spec.columns }} rows={rows} loading={false} onAction={() => {}} toast={toast} /></div>
      <Pagination total={rows.length} />
    </div>
  )
}

function DataPermissionPanel() {
  return (
    <div className="data-permission-panel">
      <div><b>数据范围</b><label><input type="radio" name="scope" defaultChecked />全部数据</label><label><input type="radio" name="scope" />本部门及下级部门</label><label><input type="radio" name="scope" />仅本人数据</label><label><input type="radio" name="scope" />自定义数据范围</label></div>
      <div><b>功能权限</b><label><input type="checkbox" defaultChecked />允许导出</label><label><input type="checkbox" defaultChecked />允许查看敏感字段</label><label><input type="checkbox" />允许批量操作</label></div>
    </div>
  )
}

function PermissionTree() {
  return <div className="permission-tree">{navGroups.map((group) => <div key={group.label}><label><input type="checkbox" defaultChecked /><span>{group.label}</span></label><div>{group.children.filter(Array.isArray).map((child) => <label key={child[1]}><input type="checkbox" defaultChecked /><span>{child[1]}</span></label>)}</div></div>)}</div>
}

function ConfirmDialog({ title, message, confirmText = '确定', onCancel, onConfirm, danger }) {
  return (
    <div className="modal-overlay confirm-overlay">
      <section className="confirm-dialog">
        <div className={`confirm-icon ${danger ? 'danger' : ''}`}>!</div>
        <div className="confirm-copy"><b>{title}</b><p>{message}</p></div>
        <button className="confirm-close" onClick={onCancel}><X size={17} /></button>
        <div className="confirm-buttons"><button className="btn btn-default" onClick={onCancel}>取消</button><button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmText}</button></div>
      </section>
    </div>
  )
}

function confirmCopy(action) {
  const copy = {
    删除: '删除后数据不可恢复，确定继续吗？',
    触发归集: '系统将立即检查该地址余额并发起资产归集，确定继续吗？',
    清退转出: '将把当前钱包的可用资产转出到目标钱包，确定继续吗？',
    重置区块: '重置游标会重新扫描指定区块，可能产生重复事件。确定继续吗？',
    终止: '终止后剩余期次将不再下注，确定终止该追号计划吗？',
    手动结算: '系统将重新执行本期结算，确定继续吗？',
    重新派生: '将根据区块哈希重新派生开奖号码，确定继续吗？',
    审核通过: '审核通过后订单将进入出款流程，确定继续吗？',
    驳回: '订单将被驳回并进入后续处理，确定继续吗？',
  }
  return copy[action] || `确定要执行“${action}”操作吗？`
}

function actionSuccessCopy(action) {
  if (action === '删除') return '删除成功'
  if (action === '触发归集') return '归集任务已提交'
  if (action === '重置区块') return '游标重置成功'
  if (action === '手动结算') return '结算任务已提交'
  if (action === '重新派生') return '重新派生成功'
  if (action === '审核通过') return '审核成功'
  if (action === '驳回') return '订单已驳回'
  if (action === '终止') return '追号计划已终止'
  return `${action || '操作'}成功`
}

function Dashboard({ toast }) {
  const [loading, setLoading] = useState(false)
  const refresh = () => { setLoading(true); window.setTimeout(() => { setLoading(false); toast('数据刷新成功') }, 650) }
  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div><span>综合看板</span><h1>运营数据总览</h1><p>按北京时间统计筛选期内的注册、活跃、充值、推荐人数及分币种资金数据。</p></div>
        <div className="last-login"><small>最近登录时间</small><b>2026-08-25 13:21:18</b></div>
      </section>
      <section className="panel dashboard-filter">
        <div><b>统计日期</b><small>北京时间，最多选择 31 天</small></div>
        <div className="date-range dashboard-date"><CalendarDays size={14} /><input value="2026-08-25" readOnly /><em>至</em><input value="2026-08-25" readOnly /></div>
        <button className="btn btn-default" onClick={refresh}>{loading ? <LoaderCircle className="spin" size={14} /> : <RefreshCw size={14} />}刷新最新数据</button>
      </section>
      <div className="stat-grid">
        {[
          ['注册人数', '会员', '0', '筛选期内注册的前台会员数', Users],
          ['充值人数', '充值', '1', '筛选期内成功充值用户全币种去重', CircleDollarSign],
          ['活跃用户数', '投注', '1', '筛选期内有有效投注记录的用户数', Activity],
          ['推荐用户数', '推荐', '0', '筛选期内产生直属下级的用户，包含开户注册', UserRound],
        ].map(([title, tagName, number, desc, Icon]) => (
          <section className="stat-card" key={title}><div className="stat-top"><span>{title}</span><small><Icon size={13} />{tagName}</small></div><b>{number}</b><p>{desc}</p></section>
        ))}
      </div>
      <section className="panel funds-panel">
        <div className="panel-title"><div><b>分币种资金统计</b><span>实际到账/出款金额</span></div><small>2026-08-25 至 2026-08-25</small></div>
        <table className="data-table"><thead><tr><th>币种</th><th>充值金额</th><th>提现金额</th></tr></thead><tbody><tr><td><b>USDT</b></td><td>600</td><td>0</td></tr><tr><td><b>TRX</b></td><td>0</td><td>0</td></tr><tr><td><b>CNY</b></td><td>0.00</td><td>0.00</td></tr></tbody></table>
      </section>
      <section className="panel system-status"><div><span>系统状态</span><b className="running"><i />运行中</b></div><div><span>后台账号</span><b>8</b></div><div><span>权限角色</span><b>4</b></div><div><span>登录状态</span><b>正常</b></div></section>
    </div>
  )
}

function BlockchainStatus({ toast }) {
  const config = {
    title: '运行状态', actions: ['刷新'],
    columns: ['链', '资产', '扫描类型', '当前区块', '状态', '最后错误', '更新时间'],
    rows: [['TRON', 'TRX', 'deposit', '70372840', '正常', '-', '2026/8/25 13:24:21'], ['TRON', 'TRX', 'fastlane', '70372876', '正常', '-', '2026/8/25 13:24:20'], ['TRON', 'USDT', 'deposit', '70372839', '正常', '-', '2026/8/25 13:24:19']],
  }
  return (
    <div className="page-stack">
      <div className="page-heading-row"><div><span className="intro-kicker">链上服务状态</span><h1>运行状态</h1></div><button className="btn btn-default" onClick={() => toast('刷新成功')}><RefreshCw size={14} />刷新</button></div>
      <div className="summary-grid four"><Metric label="待回调充值" value="0" note="已确认但尚未回调到 like-server" /><Metric label="待确认提现" value="0" note="已广播未上链确认" /><Metric label="待确认归集" value="0" note="已广播未上链确认" /><Metric label="快照时间" value="13:24:21" note="2026/8/25" /></div>
      <section className="panel table-panel"><div className="panel-title"><b>扫链游标</b></div><DataTable config={config} rows={config.rows} loading={false} onAction={() => {}} toast={toast} /></section>
      <section className="panel table-panel"><div className="panel-title"><b>热钱包余额</b></div><DataTable config={{ columns: ['ID', '标签', '链', '地址', 'USDT余额', 'TRX余额', '状态'] }} rows={[['1', 'testOutWallet', 'TRON', 'TBRjxZnSGdYyVhGkqPbJ8yodhDkyKa6HeV', '100', '45.877', '停用'], ['4', 'staging-kms-出款', 'TRON', 'TXCGJPhRwA6PLKNDWZum2qdc5i7JY2t5iY', '882', '1021.64116', '启用']]} loading={false} onAction={() => {}} toast={toast} /></section>
    </div>
  )
}

function PromotionSettings({ toast }) {
  return <SettingsCard title="推广设置" toast={toast} sections={[['前台开户注册', ['开启开户注册']], ['默认返水比例', ['哈希', '彩票', '体育', '竞技', '真人']]]} />
}

function SettingsCard({ title, toast, sections, note }) {
  const [saved, setSaved] = useState(false)
  return (
    <section className="panel settings-page-card">
      <div className="settings-title"><div><h2>{title}</h2>{note && <p>{note}</p>}</div><span className="status-tag positive">{saved ? '已保存' : '配置中'}</span></div>
      {sections.map(([heading, fields]) => <div className="settings-section" key={heading}><h3>{heading}</h3>{fields.map((field, index) => <div className="settings-form-row" key={field}><label>{field}</label>{index % 3 === 0 ? <Switch checked onChange={() => {}} /> : <input defaultValue={field.includes('比例') ? '0.0000' : ''} placeholder={`请输入${field}`} />}</div>)}</div>)}
      <div className="settings-submit"><button className="btn btn-primary" onClick={() => { setSaved(true); toast('保存成功') }}>保存</button></div>
    </section>
  )
}

function SchemePage({ toast }) {
  const [reason, setReason] = useState('')
  return (
    <div className="page-stack">
      <div className="intro-card dark-intro"><div><span className="intro-kicker">平台方案</span><h1>平台赔率与结算方案</h1><p>当前方案对全平台所有游戏统一生效。本期哈希展示赔率固定可选 1940，表示 1.940。</p></div><div className="version-badge">当前 V2</div></div>
      <InfoBanner tone="warning" title="风险说明">赔率点值固定为 0.001；实际结算赔率 = 展示赔率 - 结算服务费点数 × 0.001。修改只影响新投注。</InfoBanner>
      <section className="panel scheme-config"><div className="panel-title"><div><b>当前配置</b><span>保存会创建不可变的新版本，不能覆盖历史数据。</span></div></div><div className="scheme-grid"><label>哈希展示赔率点数<div className="input-wrap"><input defaultValue="1940" /><span>点</span></div></label><label>结算服务费点数<div className="input-wrap"><input defaultValue="0" /><span>点</span></div></label><label>哈希直客工资比例<div className="input-wrap"><input defaultValue="0.0000" /><span>%</span></div></label><div className="scheme-result"><span>实际结算赔率</span><b>1.940</b></div><div className="scheme-result"><span>最大工资比例</span><b>3.0000%</b></div><div className="scheme-result"><span>赔率点值</span><b>0.001</b></div></div><label className="reason-field"><span>变更原因</span><textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} placeholder="请输入变更原因" /><small>{reason.length} / 500</small></label><div className="scheme-buttons"><button className="btn btn-default" onClick={() => setReason('')}>恢复当前值</button><button className="btn btn-primary" onClick={() => reason ? toast('新版本保存成功') : toast('请输入变更原因', 'error')}>保存新版本</button></div></section>
      <section className="panel table-panel"><div className="panel-title"><div><b>版本历史</b><span>恢复历史版本也会创建一个新版本，原版本保持不变。</span></div></div><DataTable config={{ columns: ['版本', '展示赔率', '服务费点数', '结算赔率', '直客工资', '变更原因', '操作人', '操作 IP', '状态', '操作'], rowActions: ['恢复'] }} rows={[['V2', '1.940', '0', '1.940', '0.0000%', '修正直客工资初始值为0', 'SYSTEM', '127.0.0.1', '当前'], ['V1', '1.940', '0', '1.940', '2.7000%', '统一赔率与结算方案初始化', 'SYSTEM', '127.0.0.1', '历史']]} loading={false} onAction={() => toast('历史版本已恢复')} toast={toast} /></section>
    </div>
  )
}

function FixedWallet({ toast }) {
  const directions = ['普通 USDT → 固率 CNY', '普通 CNY → 固率 USDT', '固率 USDT → 普通 CNY', '固率 CNY → 普通 USDT']
  return (
    <div className="page-stack">
      <div className="summary-grid two"><Metric label="USDT往返倍率" value="0.994000000000" note="预览利润率 0.600000%" /><Metric label="CNY往返倍率" value="0.999885600000" note="预览利润率 0.011440%" /></div>
      <section className="panel fixed-wallet-panel"><div className="panel-title"><div><b>四方向汇率配置</b><span>保存时携带每行当前版本，并在同一事务中更新四行。</span></div><div><button className="btn btn-default" onClick={() => toast('刷新成功')}><RefreshCw size={14} />刷新</button><button className="btn btn-primary" onClick={() => toast('四方向配置保存成功')}>原子保存四方向</button></div></div><div className="fixed-grid">{directions.map((name) => <div className="fixed-row" key={name}><b>{name}</b><label>汇率<input defaultValue="1.000000000000" /></label><label>最小来源金额<input defaultValue="0" /></label><label>最大来源金额<input defaultValue="0" /></label><label>状态<Switch checked onChange={() => {}} /></label><small>v2</small><input placeholder="备注" /></div>)}</div></section>
    </div>
  )
}

function FinanceReport({ toast }) {
  return <ReportPage title="财务数据表" subtitle="北京时间统计。客户输赢为页面投注和链上转账投注合计；正数表示客户赢钱，负数表示客户输钱。" metrics={[['充值 USDT', '600'], ['提现 USDT', '0'], ['会员工资', '2.7'], ['客户输赢', '-18.885']]} columns={['日期', 'TRX充值', 'USDT充值', 'CNY充值', 'TRX提现', 'USDT提现', 'CNY提现', '会员工资', '客户输赢', '数据状态', '最后更新时间']} toast={toast} />
}

function MarketReport({ toast }) {
  return <ReportPage title="市场数据表" subtitle="统计时区：Asia/Shanghai。平台输赢为页面投注与链上转账投注合计；正数表示客户输钱、平台赢钱。" metrics={[['新增用户', '0'], ['充值人数', '1'], ['活跃人数', '1'], ['推荐用户', '0']]} columns={['日期', '新增用户', '充值人数', '活跃人数', '推荐用户', 'TRX充值', 'USDT充值', 'CNY充值', 'TRX提现', 'USDT提现', 'CNY提现', '平台输赢', '数据状态', '最后更新时间']} toast={toast} />
}

function ReportPage({ title, subtitle, metrics, columns, toast }) {
  const rows = [
    ['2026-08-25', '0', '600', '0', '0', '0', '0', '2.7', '-18.885', '临时数据', '2026-08-25 13:25:55'],
    ['2026-08-24', '0', '0', '0', '0', '0', '0', '3.24', '-23', '正式数据', '2026-08-25 00:05:03'],
    ['2026-08-22', '50', '50', '100', '99', '21', '201', '31.347', '-113.4', '正式数据', '2026-08-25 00:05:03'],
  ]
  return (
    <div className="page-stack"><div className="page-heading-row"><div><span className="intro-kicker">运营报表</span><h1>{title}</h1><p>{subtitle}</p></div><div className="toolbar-actions"><button className="btn btn-default" onClick={() => toast('刷新成功')}><RefreshCw size={14} />刷新</button><button className="btn btn-default" onClick={() => toast('导出任务已提交')}><Download size={14} />异步导出</button></div></div><div className="summary-grid four">{metrics.map(([label, value]) => <Metric key={label} label={label} value={value} note="筛选期内" />)}</div><FilterPanel filters={[{ label: '统计日期', type: 'date-range' }]} values={{}} setValues={() => {}} expanded onQuery={() => toast('查询成功')} onReset={() => toast('已重置筛选条件')} /><section className="panel table-panel"><div className="table-toolbar"><div /><div className="table-total">共 <b>25</b> 天</div></div><DataTable config={{ columns }} rows={rows} loading={false} onAction={() => {}} toast={toast} /><Pagination total={25} /></section></div>
  )
}

function Metric({ label, value, note }) {
  return <section className="metric-card"><span>{label}</span><b>{value}</b><small>{note}</small></section>
}

function MemberList({ config, path, toast }) {
  const [selected, setSelected] = useState([])
  const [modal, setModal] = useState(null)
  const [filters, setFilters] = useState({})
  const runToolbarAction = (action) => {
    if (action === '新增会员') { setModal({ type: 'form', action }); return }
    if (action === '标签管理') { go('/member/tag'); return }
    if (action.startsWith('批量')) {
      if (!selected.length) { toast('请先选择会员', 'error'); return }
      if (action.includes('标签')) setModal({ type: 'batch-tag', action })
      else setModal({ type: 'batch-confirm', action })
      return
    }
    toast('筛选区域已展开')
  }
  return (
    <div className="page-stack">
      <FilterPanel filters={config.filters} values={filters} setValues={setFilters} expanded onQuery={() => toast('查询成功')} onReset={() => { setFilters({}); toast('已重置筛选条件') }} />
      <section className="panel table-panel">
        <div className="table-toolbar"><div className="toolbar-actions">{config.actions.map((action) => <ActionButton key={action} label={action} onClick={() => runToolbarAction(action)} />)}</div><div className="table-total">共 <b>{config.count}</b> 条 · 已选 <b>{selected.length}</b> 项</div></div>
        <div className="table-scroll"><table className="data-table member-table">
          <thead><tr><th><input type="checkbox" checked={selected.length === memberRows.length} onChange={(event) => setSelected(event.target.checked ? memberRows.map((row) => row.id) : [])} /></th>{config.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
          <tbody>{memberRows.map((member) => <tr key={member.id}><td><input type="checkbox" checked={selected.includes(member.id)} onChange={(event) => setSelected((old) => event.target.checked ? [...old, member.id] : old.filter((id) => id !== member.id))} /></td><td>{member.id}</td><td><div className="member-id"><span>{member.user[0].toUpperCase()}</span><div><b>{member.user}</b><small>{member.status}</small><em>昵称 {member.nickname}</em><em>邀请码 {member.invite}</em></div></div></td><td><CellStack rows={[['手机号', member.phone], ['邮箱', member.email]]} /></td><td>-</td><td><BalanceStack values={member.balances} /></td><td><CellStack rows={[['是否代理', '否'], ['上级代理', member.agent], ['代理层级', member.level], ['哈希工资', member.wage]]} /></td><td><CellStack rows={[['注册时间', member.registered], ['最近登录', member.login], ['最近登录IP', member.ip]]} /></td><td><MemberStatusSwitch toast={toast} /></td><td className="actions-cell"><div><button onClick={() => setModal({ type: 'member-detail', member })}>详情</button><button onClick={() => setModal({ type: 'edit', member })}>编辑</button><button onClick={() => setModal({ type: 'reset', member })}>重置密码</button></div></td></tr>)}</tbody>
        </table></div>
        <Pagination total={config.count} />
      </section>
      {modal?.type === 'form' && <FormDialog path={path} config={config} action="新增会员" onClose={() => setModal(null)} onSuccess={(message) => { setModal(null); toast(message) }} />}
      {modal?.type === 'edit' && <EditMemberDialog member={modal.member} close={() => setModal(null)} success={() => { setModal(null); toast('修改成功') }} />}
      {modal?.type === 'reset' && <ResetPasswordDialog member={modal.member} close={() => setModal(null)} success={() => { setModal(null); toast('密码重置成功') }} />}
      {modal?.type === 'member-detail' && <MemberDetailDialog member={modal.member} close={() => setModal(null)} toast={toast} />}
      {modal?.type === 'batch-tag' && <BatchTagDialog action={modal.action} count={selected.length} close={() => setModal(null)} success={() => { const action = modal.action; setModal(null); toast(`${action}成功`) }} />}
      {modal?.type === 'batch-confirm' && <ConfirmDialog title={modal.action} message={`已选择 ${selected.length} 位会员，确定执行“${modal.action.replace('批量', '')}”吗？`} confirmText="确定" danger={modal.action === '批量禁用'} onCancel={() => setModal(null)} onConfirm={() => { const action = modal.action; setModal(null); toast(`${action}成功`) }} />}
    </div>
  )
}

function MemberStatusSwitch({ toast }) {
  const [enabled, setEnabled] = useState(true)
  return <Switch checked={enabled} onChange={() => { const next = !enabled; setEnabled(next); toast(next ? '会员已启用' : '会员已禁用') }} />
}

function BatchTagDialog({ action, count, close, success }) {
  const tags = ['VIP会员', '高价值会员', '风控关注', '测试账号']
  const [selectedTags, setSelectedTags] = useState([])
  const [error, setError] = useState('')
  const toggle = (tag) => setSelectedTags((items) => items.includes(tag) ? items.filter((item) => item !== tag) : [...items, tag])
  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="modal-dialog">
        <div className="modal-header"><b>{action}</b><button onClick={close}><X size={18} /></button></div>
        <div className="modal-body batch-tag-body">
          <InfoBanner tone="info" title="已选择会员">本次操作将影响 {count} 位会员。</InfoBanner>
          <div className="tag-choice-grid">{tags.map((tag) => <label key={tag}><input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => { toggle(tag); setError('') }} /><span>{tag}</span></label>)}</div>
          {error && <p className="inline-error">{error}</p>}
        </div>
        <div className="modal-footer"><button className="btn btn-default" onClick={close}>取消</button><button className="btn btn-primary" onClick={() => selectedTags.length ? success() : setError('请至少选择一个会员标签')}>确定</button></div>
      </section>
    </div>
  )
}

function CellStack({ rows }) { return <div className="cell-stack">{rows.map(([label, value]) => <p key={label}><span>{label}</span><b>{value}</b></p>)}</div> }
function BalanceStack({ values }) { return <div className="balance-stack"><span>普通</span>{['USDT', 'TRX', 'CNY'].map((currency, index) => <p key={currency}><em>{currency}</em><b>{values[index]}</b></p>)}<span>佣金</span>{['USDT', 'TRX', 'CNY'].map((currency) => <p key={`c-${currency}`}><em>{currency}</em><b>0.00</b></p>)}</div> }

function EditMemberDialog({ member, close, success }) {
  return <SimpleFormModal title="编辑会员" fields={['用户名', '昵称', '真实姓名', '邮箱', '手机号', '生日', '性别', '账号状态']} initial={{ 用户名: member.user, 昵称: member.nickname }} close={close} success={success} />
}

function ResetPasswordDialog({ member, close, success }) {
  return <SimpleFormModal title="重置登录密码" tip={`为会员 ${member.user} 设置新的登录密码`} fields={['新的登录密码']} close={close} success={success} password />
}

function SimpleFormModal({ title, tip, fields, initial = {}, close, success, password }) {
  const [values, setValues] = useState(initial)
  const [error, setError] = useState('')
  return <div className="modal-overlay"><section className="modal-dialog"><div className="modal-header"><b>{title}</b><button onClick={close}><X size={18} /></button></div><div className="modal-body">{tip && <p className="modal-tip">{tip}</p>}<div className="modal-form-grid">{fields.map((field, index) => <label className="modal-field" key={field}><span><em>*</em>{field}</span><input type={password ? 'password' : 'text'} value={values[field] || ''} onChange={(event) => { setValues((old) => ({ ...old, [field]: event.target.value })); if (index === 0) setError('') }} placeholder={`请输入${field}`} />{index === 0 && error && <small className="field-error">{error}</small>}</label>)}</div></div><div className="modal-footer"><button className="btn btn-default" onClick={close}>取消</button><button className="btn btn-primary" onClick={() => values[fields[0]] ? success() : setError(`请输入${fields[0]}`)}>确定</button></div></section></div>
}

function MemberDetailDialog({ member, close, toast }) {
  const tabs = ['基本信息', '数据概览', '钱包详情', '提现方式', '三方注单记录', '存款信息', '提款信息', '帐变记录', '行为日志']
  const [tab, setTab] = useState('数据概览')
  const [period, setPeriod] = useState('今日')
  return (
    <div className="modal-overlay">
      <section className="modal-dialog member-detail-dialog">
        <div className="modal-header member-detail-head"><div><b>用户名：{member.user}</b><span>({member.id})</span><small>账号状态：<em>正常</em>　会员等级：<em>vip0</em>　上级代理：<em>{member.agent}</em></small></div><button onClick={close}><X size={18} /></button></div>
        <div className="detail-tabs scrollable">{tabs.map((name) => <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}</div>
        <div className="modal-body member-detail-body">
          <MemberDetailContent tab={tab} member={member} period={period} setPeriod={setPeriod} toast={toast} />
        </div>
      </section>
    </div>
  )
}

function MemberDetailContent({ tab, member, period, setPeriod, toast }) {
  if (tab === '数据概览') {
    return (
      <>
        <div className="quick-dates"><span>计算时间：</span>{['今日', '昨日', '7日内', '30天', '90天', '180天', '360天'].map((name) => <button key={name} className={period === name ? 'active' : ''} onClick={() => setPeriod(name)}>{name}</button>)}<button className="btn btn-primary" onClick={() => toast(`${period}数据筛选成功`)}>筛 选</button></div>
        <div className="summary-grid three"><Metric label="总输赢(元)" value="0.00" note="当前筛选区间" /><Metric label="总有效投注" value="0.00" note="当前筛选区间" /><Metric label="总存款(元)" value="0.00" note="当前筛选区间" /><Metric label="总提款(元)" value="0.00" note="当前筛选区间" /><Metric label="总优惠赠送(元)" value="0.00" note="当前筛选区间" /><Metric label="总打码金额(元)" value="0.00" note="当前筛选区间" /></div>
      </>
    )
  }

  if (tab === '基本信息') {
    const fields = [
      ['会员ID', member.id], ['用户名', member.user], ['昵称', member.nickname], ['真实姓名', '-'],
      ['手机号', member.phone], ['邮箱', member.email], ['性别', '未知'], ['生日', '-'],
      ['邀请码', member.invite], ['会员等级', 'vip0'], ['上级代理', member.agent], ['代理层级', member.level],
      ['账号状态', member.status], ['注册IP', member.ip], ['注册时间', member.registered], ['最近登录', member.login],
    ]
    return <div className="descriptions-grid member-descriptions">{fields.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div>
  }

  const balance = member.balances || ['0.00', '0.00', '0.00']
  const specs = {
    钱包详情: {
      columns: ['钱包类型', '币种', '可用余额', '冻结余额', '累计充值', '累计提现', '更新时间'],
      rows: [
        ['普通钱包', 'USDT', balance[0], '0.00', '600.00', '0.00', '2026-08-25 13:21:18'],
        ['普通钱包', 'TRX', balance[1], '0.00', '0.00', '0.00', '2026-08-25 13:21:18'],
        ['普通钱包', 'CNY', balance[2], '0.00', '0.00', '0.00', '2026-08-25 13:21:18'],
        ['佣金钱包', 'USDT', '0.00', '0.00', '2.70', '0.00', '2026-08-25 13:21:18'],
      ],
    },
    提现方式: {
      columns: ['提现类型', '收款人', '银行 / 网络', '账号 / 地址', '状态', '创建时间'],
      rows: [['链上钱包', '-', 'TRON', 'TQMmqbDSXdA3bbDmZvKSRXmDSVxoFoAWFX', '启用', '2026-08-20 19:02:10']],
    },
    三方注单记录: {
      columns: ['平台', '三方订单号', '游戏', '投注金额', '有效投注', '输赢', '状态', '投注时间'],
      rows: [],
    },
    存款信息: {
      columns: ['订单号', '币种', '申请金额', '到账金额', '充值方式', '状态', '创建时间'],
      rows: [['RC20260825125821001', 'USDT', '600.00', '600.00', '链上充值', '成功', '2026-08-25 12:58:21']],
    },
    提款信息: {
      columns: ['订单号', '币种', '申请金额', '手续费', '实付金额', '提现方式', '状态', '创建时间'],
      rows: [],
    },
    帐变记录: {
      columns: ['流水号', '钱包类型', '币种', '业务类型', '变动前', '变动金额', '变动后', '时间'],
      rows: [['UC20260825125832001', '普通钱包', 'USDT', '充值入账', '0.00', '+600.00', '600.00', '2026-08-25 12:58:32'], ['UC20260825131002001', '普通钱包', 'USDT', '投注结算', '600.00', '-23.00', '577.00', '2026-08-25 13:10:02']],
    },
    行为日志: {
      columns: ['行为类型', '行为内容', '来源IP', '设备 / 浏览器', '结果', '操作时间'],
      rows: [['登录', '前台账号密码登录', member.ip, 'Chrome / Mac OS X', '成功', member.login], ['安全', '查看钱包地址', member.ip, 'Chrome / Mac OS X', '成功', '2026-08-20 19:02:10']],
    },
  }
  return <DetailTabTable spec={specs[tab] || { columns: [], rows: [] }} toast={toast} />
}

function MenuTree({ config, toast }) {
  return <DataPage config={{ ...config, rows: menuTreeRows, actions: ['新增', '展开/折叠'] }} path="/permission/menu" toast={toast} hideFilters />
}

function LotteryBet({ config, path, toast }) {
  return <div className="page-stack"><div className="summary-grid three"><Metric label="USDT · 注单数" value="101" note="投注额 11976.7 · 平台盈亏 -9689.3197" /><Metric label="TRX · 注单数" value="31" note="投注额 1609 · 平台盈亏 +553.251" /><Metric label="CNY · 注单数" value="8" note="投注额 185 · 平台盈亏 -116.47" /></div><DataPage path={path} config={config} toast={toast} /></div>
}

function CaptchaSettings({ toast }) {
  return <div className="page-stack"><InfoBanner tone="warning" title="配置提示">请先关闭两个验证码开关再修改配置。前台开关开启后，所有账号密码登录都会强制验签。</InfoBanner><section className="panel settings-page-card"><div className="settings-title"><div><h2>安全验证</h2><p>阿里云验证码 2.0 V3 · 嵌入式一点即过</p></div><span className="status-tag positive">凭据：ECS RAM角色</span></div><div className="settings-section"><h3>基础凭据</h3>{['服务商', '数据区域', '身份标 Prefix', 'H5 SceneId', 'Admin SceneId'].map((field) => <div className="settings-form-row" key={field}><label>{field}</label><input defaultValue={field === '服务商' ? '阿里云验证码' : ''} placeholder={field} /></div>)}</div><div className="settings-section inline-settings"><div><h3>Admin 登录</h3><p>当前配置已测试 · 2026/7/15 13:27:40</p></div><Switch checked onChange={() => toast('Admin 登录验证码状态已更新')} /></div><div className="settings-section inline-settings"><div><h3>前台账号密码登录</h3><p>当前配置已测试 · 2026/7/15 13:32:47</p></div><Switch checked onChange={() => toast('前台登录验证码状态已更新')} /></div><div className="settings-submit"><button className="btn btn-default" onClick={() => toast('Admin 真实验签通过')}>提交 Admin 真实验签</button><button className="btn btn-default" onClick={() => toast('已生成 5 分钟测试链接')}>打开 H5 真实测试页</button><button className="btn btn-primary" onClick={() => toast('保存成功')}>保存配置</button></div></section></div>
}

function ServiceSettings({ toast }) {
  return <ChannelSettings title="客服配置" subtitle="维护 Chatwoot 客服入口和备用联系方式" enabled fields={['Chatwoot 地址', 'Telegram', 'WhatsApp', '客服邮箱', '服务时间', '欢迎文案']} toast={toast} />
}
function EmailSettings({ toast }) {
  return <ChannelSettings title="邮件配置" subtitle="维护系统邮箱验证码和通知邮件使用的 SMTP 通道" fields={['SMTP 主机', '端口', '账号', '密码', '加密方式', '发件邮箱', '发件名称']} toast={toast} />
}
function ChannelSettings({ title, subtitle, enabled = false, fields, toast }) {
  const [on, setOn] = useState(enabled)
  return <section className="panel settings-page-card"><div className="settings-title"><div><h2>{title}</h2><p>{subtitle}</p></div><span className={`status-tag ${on ? 'positive' : 'neutral'}`}>{on ? '已启用' : '未启用'}</span></div><div className="settings-section inline-settings"><h3>启用状态</h3><div className="switch-label"><Switch checked={on} onChange={() => setOn((value) => !value)} /><span>{on ? '开启' : '关闭'}</span></div></div><div className="settings-section"><h3>{title.replace('配置', '')}服务</h3>{fields.map((field) => <div className="settings-form-row" key={field}><label>{field}</label>{field.includes('文案') ? <textarea placeholder={`请输入${field}`} /> : <input type={field === '密码' ? 'password' : 'text'} placeholder={`请输入${field}`} />}</div>)}</div><div className="settings-submit"><button className="btn btn-primary" onClick={() => toast('保存成功')}>保存配置</button></div></section>
}

function UserSettings({ toast }) {
  return <section className="panel settings-page-card"><div className="settings-title"><h2>基本设置</h2></div><div className="settings-section"><h3>用户默认头像</h3><p>用户注册时给的默认头像，建议尺寸：400*400像素，支持 jpg、jpeg、png 格式</p><button className="avatar-uploader"><Plus size={23} /><span>添加</span></button></div><div className="settings-submit"><button className="btn btn-primary" onClick={() => toast('保存成功')}>保存</button></div></section>
}

function LoginRegister({ toast }) {
  const [switches, setSwitches] = useState({ phone: false, bind: false, policy: false, register: true, google: true })
  const toggle = (key) => setSwitches((old) => ({ ...old, [key]: !old[key] }))
  return <section className="panel settings-page-card"><div className="settings-title"><h2>登录设置</h2></div><div className="settings-section"><h3>登录方式</h3><label className="check-line"><input type="checkbox" defaultChecked />账号密码登录</label><label className="check-line"><input type="checkbox" checked={switches.phone} onChange={() => toggle('phone')} />手机验证码登录</label><p>系统通用登录方式，至少选择一项</p></div>{[['bind', '强制绑定手机', '开启后新用户注册完成后强制绑定手机号'], ['policy', '政策协议', '登录/注册会员时显示服务协议和隐私政策'], ['register', '全局开放注册', '关闭后所有站点注册都必须填写有效邀请码'], ['google', '谷歌验证器绑定', '开启后用户可在安全中心绑定谷歌验证器']].map(([key, label, note]) => <div className="settings-section inline-settings" key={key}><div><h3>{label}</h3><p>{note}</p></div><div className="switch-label"><Switch checked={switches[key]} onChange={() => toggle(key)} /><span>{switches[key] ? '开启' : '关闭'}</span></div></div>)}<div className="settings-submit"><button className="btn btn-primary" onClick={() => toast('保存成功')}>保存</button></div></section>
}

function PersonalSettings({ toast }) {
  const [show, setShow] = useState(false)
  return <section className="panel personal-card"><div className="personal-avatar"><span className="avatar-photo large" /><button>更换头像</button></div><div className="personal-form"><label><span>账号：</span><input value="admin1" disabled /></label><label><span>名称：</span><input defaultValue="admin1" placeholder="请输入名称" /></label><label><span>当前密码：</span><div className="input-wrap"><input type={show ? 'text' : 'password'} placeholder="修改密码时必填, 不修改密码时留空" /><button onClick={() => setShow((value) => !value)}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label><label><span>新的密码：</span><input type="password" placeholder="修改密码时必填, 不修改密码时留空" /></label><label><span>确定密码：</span><input type="password" placeholder="修改密码时必填, 不修改密码时留空" /></label><button className="btn btn-primary" onClick={() => toast('保存成功')}>保存</button></div></section>
}

function BlankPage() {
  return <div className="blank-target-page" aria-label="目标站原始空白页面" />
}

export default App
