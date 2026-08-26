import './account-pages.css'

import {
  CommissionTransferPage,
  DepositPage,
  EnergyRentalPage,
  ExchangePage,
  FixedWalletPage,
  FixedWalletRecordsPage,
  UserPage,
  WithdrawPage,
} from './accountFundsPages'
import {
  ReceiveRedPacketPage,
  RedPacketDetailPage,
  RedPacketPage,
  RedPacketRecordsPage,
} from './accountRedPacketPages'
import { RecordsPage } from './accountRecordsPages'
import { AccountBindPage, SecurityCenterPage, SecurityFormPage } from './accountSecurityPages'
import {
  AuthPage,
  BenefitDetailPage,
  BenefitIndexPage,
  FeeFreePage,
  Lucky5Page,
  VerifyUPage,
} from './accountAuthBenefitPages'
import { EmptyState, PageShell, useSfaActions } from './accountUi'

export {
  AccountBindPage,
  AuthPage,
  BenefitDetailPage,
  BenefitIndexPage,
  CommissionTransferPage,
  DepositPage,
  EnergyRentalPage,
  ExchangePage,
  FeeFreePage,
  FixedWalletPage,
  FixedWalletRecordsPage,
  Lucky5Page,
  ReceiveRedPacketPage,
  RecordsPage,
  RedPacketDetailPage,
  RedPacketPage,
  RedPacketRecordsPage,
  SecurityCenterPage,
  SecurityFormPage,
  UserPage,
  VerifyUPage,
  WithdrawPage,
}

function UnknownAccountPage(props) {
  const actions = useSfaActions(props)
  return <PageShell title="页面未找到" onBack={actions.back} message={actions.localMessage}><EmptyState title="暂无页面内容" description="请检查传入的账户域路由" /></PageShell>
}

export function AccountRoutePage({ path = '', ...props }) {
  const cleanPath = String(path || '').split('?')[0]
  const pageProps = { ...props, path }

  if (cleanPath === '/pages/user/user') return <UserPage {...pageProps} />
  if (cleanPath === '/pages/deposit/index') return <DepositPage {...pageProps} />
  if (cleanPath === '/pages/wallet/withdraw') return <WithdrawPage {...pageProps} />
  if (cleanPath === '/pages/wallet/red_packet') return <RedPacketPage {...pageProps} />
  if (cleanPath === '/pages/wallet/red_packet_records') return <RedPacketRecordsPage {...pageProps} />
  if (cleanPath === '/pages/wallet/red_packet_detail') return <RedPacketDetailPage {...pageProps} />
  if (cleanPath === '/pages/wallet/receive_red_packet' || cleanPath === '/receive') return <ReceiveRedPacketPage {...pageProps} />
  if (cleanPath === '/pages/wallet/commission_transfer') return <CommissionTransferPage {...pageProps} />
  if (cleanPath === '/pages/wallet/exchange') return <ExchangePage {...pageProps} />
  if (cleanPath === '/pages/wallet/fixed_rate_wallet_records') return <FixedWalletRecordsPage {...pageProps} />
  if (cleanPath === '/pages/wallet/fixed_rate_wallet') return <FixedWalletPage {...pageProps} />
  if (cleanPath === '/pages/energy/rental') return <EnergyRentalPage {...pageProps} />
  if (cleanPath === '/pages/records/account_details') return <RecordsPage {...pageProps} mode="account" />
  if (cleanPath === '/pages/records/lottery-bets') return <RecordsPage {...pageProps} mode="lottery" />
  if (cleanPath === '/pages/records/bet_record') return <RecordsPage {...pageProps} mode="hash" />
  if (cleanPath === '/pages/security/center') return <SecurityCenterPage {...pageProps} />
  if (cleanPath === '/pages/security/account-bind') return <AccountBindPage {...pageProps} />
  if (cleanPath.startsWith('/pages/security/')) return <SecurityFormPage {...pageProps} />
  if (cleanPath.startsWith('/pages/login/') || cleanPath.startsWith('/pages/register/') || cleanPath.startsWith('/pages/agreement/') || cleanPath.startsWith('/pages/captcha-test/')) return <AuthPage {...pageProps} />
  if (cleanPath === '/pages/benefit/index') return <BenefitIndexPage {...pageProps} />
  if (cleanPath === '/pages/benefit/lucky5') return <Lucky5Page {...pageProps} />
  if (cleanPath === '/pages/benefit/fee-free') return <FeeFreePage {...pageProps} />
  if (cleanPath === '/pages/benefit/verify-u') return <VerifyUPage {...pageProps} />
  if (cleanPath === '/pages/benefit/detail') return <BenefitDetailPage {...pageProps} />
  return <UnknownAccountPage {...pageProps} />
}

export default AccountRoutePage
