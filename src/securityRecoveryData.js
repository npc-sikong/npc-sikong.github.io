export const initialSecurityProfile = {
  configured: false,
  question: '',
  answer: '',
  tip: '',
  resetGranted: false,
}

export function createInitialSecurityProfile() {
  return { ...initialSecurityProfile }
}
