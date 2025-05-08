/** @format */

export const dimension = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const oidcConfig = {
  authority: process.env.REACT_APP_OIDC_AUTHORITY ?? "",
  client_id: process.env.REACT_APP_OIDC_CLIENT_ID ?? "",
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  scope: "openid profile email dataEventRecords offline_access",
  response_type: "code",
  silentRequestTimeoutInSeconds: 10,
  automaticSilentRenew: false,

  // ...
};

export const KEY_CONTEXT = {
  LAYOUT: "layout",
};

export const firebaseConfig = {
  KEY_CONTEXT: "firebase-token",
};
export enum ELanguage {
  VI = "vi",
  EN = "en",
}
export const langs = [ELanguage.VI, ELanguage.EN];
export const signalRConfig = {
  url: process.env.REACT_APP_SIGNALR_URL ?? "",
};
export const emptyGuid = "00000000-0000-0000-0000-000000000000";
export const emptyDate = "1911-01-01";

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const tabMessage = {
  0: 'Hoạt động',
  1: 'Đóng'
}