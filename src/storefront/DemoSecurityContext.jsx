import { createContext, useContext, useState } from 'react'
import { DEPOSIT_CHANNELS } from './accountData'

const DemoSecurityContext = createContext(null)
export function DemoSecurityProvider({ children }) {
  const [account, setAccount] = useState('G6DEMO88')
  const [loginPassword, setLoginPassword] = useState(null)
  const [fundPassword, setFundPassword] = useState(null)
  const [fundConfigured, setFundConfigured] = useState(true)
  const [boundAddress, setBoundAddress] = useState(DEPOSIT_CHANNELS[0].address)
  const [codes, setCodes] = useState(Array.from({ length: 10 }, (_, i) => ({ value: `DEMO-01-${String(i + 1).padStart(3, '0')}`, used: false })))
  const [generation, setGeneration] = useState(1)
  const [recoveryGrant, setRecoveryGrant] = useState(null)
  const [sessions, setSessions] = useState(1)
  const [sessionNotice, setSessionNotice] = useState('')
  const validLogin = (value) => loginPassword === null ? /^.{6,20}$/.test(value) : value === loginPassword
  const validFund = (value) => fundConfigured && (fundPassword === null ? /^\d{6}$/.test(value) : value === fundPassword)
  const revokeSessions = () => { setSessions(0); setSessionNotice('该账号全部旧会话已注销（本地演示）') }
  const issueCodes = () => {
    const next = generation + 1
    setGeneration(next)
    setCodes(Array.from({ length: 10 }, (_, i) => ({ value: `DEMO-${String(next).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`, used: false })))
    setRecoveryGrant(null)
  }
  const consumeCode = (value) => {
    const found = codes.find((item) => item.value === value.trim().toUpperCase() && !item.used)
    if (!found) return false
    setCodes((current) => current.map((item) => item.value === found.value ? { ...item, used: true } : item))
    setRecoveryGrant({ account, expires: Date.now() + 10 * 60 * 1000 })
    return true
  }
  const clearGoogle = () => { setCodes([]); setRecoveryGrant(null); revokeSessions() }
  return <DemoSecurityContext.Provider value={{
    account, setAccount, loginPassword, setLoginPassword, fundConfigured, setFundConfigured,
    setFundPassword, validLogin, validFund, boundAddress, setBoundAddress,
    codes, issueCodes, consumeCode, recoveryGrant, setRecoveryGrant, clearGoogle,
    sessions, sessionNotice, revokeSessions,
    signIn: () => { setSessions(1); setSessionNotice('') },
    register: (name, password) => {
      setAccount(name); setLoginPassword(password); setFundPassword(null); setFundConfigured(false)
      setBoundAddress(''); setCodes([]); setRecoveryGrant(null); setSessions(0)
    },
  }}>{children}</DemoSecurityContext.Provider>
}
export const useDemoSecurity = () => useContext(DemoSecurityContext)
