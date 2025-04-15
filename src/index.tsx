declare global{
  interface Window{
    setErrorText: ( text: string ) => void;
  }
}

/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router } from "@solidjs/router";
import { TurnstileObject } from 'turnstile-types';

import './index.css'
import { lazy } from 'solid-js';

import App from './App.tsx';

const root = document.getElementById('root');

let Login = lazy(() => import('./Pages/Login.tsx'));
let Signup = lazy(() => import('./Pages/Signup.tsx'));
let ResetPassword = lazy(() => import('./Pages/ResetPassword.tsx'));
let VerifyEmail = lazy(() => import('./Pages/VerifyEmail.tsx'));
let Profile = lazy(() => import('./Pages/Profile.tsx'));

render(() => <Router root={App}>
  <Route path="/login" component={Login} />
  <Route path="/signup" component={Signup} />
  <Route path="/reset-password" component={ResetPassword} />
  <Route path="/verify-email" component={VerifyEmail} />
  <Route path="/profile" component={Profile} />
</Router>, root!)