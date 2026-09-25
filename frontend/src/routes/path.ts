export const rootPaths = {
  root: '/',
  pagesRoot: '/',
  authRoot: '/authentication',
  errorRoot: '/error',
};

/**
 * Object containing various paths used in the application.
 */
const paths = {
  default: `${rootPaths.root}`,
  aboutUs: `${rootPaths.pagesRoot}about-us`,
  investors: `${rootPaths.pagesRoot}investors`,
  offers: `${rootPaths.pagesRoot}offers`,
  contactUs: `${rootPaths.pagesRoot}contact-us`,
  dashboard: `${rootPaths.pagesRoot}dashboard`,
  transactions: `${rootPaths.pagesRoot}transactions`,
  creditCards: `${rootPaths.pagesRoot}credit-cards`,
  investments: `${rootPaths.pagesRoot}investments`,
  loans: `${rootPaths.pagesRoot}loans`,
  accounts: `${rootPaths.pagesRoot}accounts`,
  notifications: `${rootPaths.pagesRoot}notifications`,
  login: `${rootPaths.authRoot}/login`,
  signup: `${rootPaths.authRoot}/sign-up`,
  forgetPassword: `${rootPaths.authRoot}/forget-password`,
  resetPassword: `${rootPaths.authRoot}/reset-password`,
  notFound: `${rootPaths.errorRoot}/404`,
};

export default paths;
