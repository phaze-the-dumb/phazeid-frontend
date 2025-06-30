declare global{
  interface Window{
    setErrorText: ( text: string ) => void;
  }
}

/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router } from "@solidjs/router";

// @ts-ignore
import { TurnstileObject } from 'turnstile-types';

import './index.css'
import { lazy } from 'solid-js';

import App from './App.tsx';

const root = document.getElementById('root');

let Login = lazy(() => import('./Pages/Login.tsx'));
let Signup = lazy(() => import('./Pages/Signup.tsx'));
let ResetPassword = lazy(() => import('./Pages/ResetPassword.tsx'));
let Reset = lazy(() => import('./Pages/Reset.tsx'));
let VerifyEmail = lazy(() => import('./Pages/VerifyEmail.tsx'));
let VerifyMFA = lazy(() => import('./Pages/VerifyMFA.tsx'));
let VerifyBackup = lazy(() => import('./Pages/VerifyBackup.tsx'));
let Verify = lazy(() => import('./Pages/Verify.tsx'));
let Profile = lazy(() => import('./Pages/Profile.tsx'));
let Settings = lazy(() => import('./Pages/Settings.tsx'));
let OAuth = lazy(() => import('./Pages/OAuth.tsx'));
let RestoreAccount = lazy(() => import('./Pages/RestoreAccount.tsx'));

let AccountLogout = lazy(() => import('./Pages/Account/Logout.tsx'));
let AccountChangeEmail = lazy(() => import('./Pages/Account/ChangeEmail.tsx'));
let AccountVerifyEmail = lazy(() => import('./Pages/Account/VerifyEmail.tsx'));
let AccountChangeUsername = lazy(() => import('./Pages/Account/ChangeUsername.tsx'));
let AccountChangePassword = lazy(() => import('./Pages/Account/ChangePassword.tsx'));
let AccountDevices = lazy(() => import('./Pages/Account/Devices.tsx'));
let AccountAuthorizedApplications = lazy(() => import('./Pages/Account/AuthorizedApplications.tsx'));
let AccountMFA = lazy(() => import('./Pages/Account/MFA.tsx'));
let AccountDelete = lazy(() => import('./Pages/Account/Delete.tsx'));
let AccountDeauthorize = lazy(() => import('./Pages/Account/Deauthorize.tsx'));
let AccountPatreon = lazy(() => import('./Pages/Account/Patreon.tsx'));

render(() => <Router root={App}>
  <Route path="/" component={Login} />

  <Route path="/login" component={Login} />
  <Route path="/signup" component={Signup} />
  <Route path="/reset-password" component={ResetPassword} />
  <Route path="/reset" component={Reset} />
  <Route path="/verify-email" component={VerifyEmail} />
  <Route path="/verify-mfa" component={VerifyMFA} />
  <Route path="/verify-backup" component={VerifyBackup} />
  <Route path="/verify" component={Verify} />
  <Route path="/profile" component={Profile} />
  <Route path="/settings" component={Settings} />
  <Route path="/oauth" component={OAuth} />
  <Route path="/restore-account" component={RestoreAccount} />

  <Route path="/account/logout" component={AccountLogout} />
  <Route path="/account/email" component={AccountChangeEmail} />
  <Route path="/account/email/verify" component={AccountVerifyEmail} />
  <Route path="/account/username" component={AccountChangeUsername} />
  <Route path="/account/password" component={AccountChangePassword} />
  <Route path="/account/devices" component={AccountDevices} />
  <Route path="/account/devices/oauth" component={AccountAuthorizedApplications} />
  <Route path="/account/2fa" component={AccountMFA} />
  <Route path="/account/delete" component={AccountDelete} />
  <Route path="/account/deauthorize" component={AccountDeauthorize} />
  <Route path="/account/patreon" component={AccountPatreon} />
</Router>, root!)