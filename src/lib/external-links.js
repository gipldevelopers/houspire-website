export const HOUSPIRE_HOME_URL = "https://houspire.ai";
export const HOUSPIRE_SIGN_IN_URL = "https://houspire.ai/auth/signin";

export function redirectToHouspireHome() {
  window.location.assign(HOUSPIRE_HOME_URL);
}

export function redirectToHouspireSignIn() {
  window.location.assign(HOUSPIRE_SIGN_IN_URL);
}
