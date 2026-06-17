export const HOUSPIRE_HOME_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
export const HOUSPIRE_SIGN_IN_URL = `${HOUSPIRE_HOME_URL}/auth/signin`;

export function redirectToHouspireHome(options = {}) {
  const url = new URL(HOUSPIRE_HOME_URL);
  
  if (options.openWizard) {
    url.searchParams.set('openWizard', 'true');
  }
  
  if (options.package) {
    url.searchParams.set('package', options.package.toString());
  }
  
  window.location.assign(url.toString());
}

export function redirectToHouspireSignIn() {
  window.location.assign(HOUSPIRE_SIGN_IN_URL);
}
