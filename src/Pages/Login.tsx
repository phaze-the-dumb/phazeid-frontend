import { onMount } from "solid-js";
import { Encryptable, PlainText, tunnel } from "../util/auth";
import { useLocation, useNavigate } from "@solidjs/router";

const LOGIN_ERRORS = [
  "Password and Username must be less than 50 characters",
  "Incorrect Username or Password",
  "Account locked until "
]

let Login = () => {
  let loc = useLocation();
  let nav = useNavigate();

  let turnstile: HTMLElement;

  let username: HTMLInputElement;
  let password: HTMLInputElement;

  let loadingContainer: HTMLDivElement;
  let loginContainer: HTMLDivElement;

  let redirect: string = '/profile';

  if(typeof loc.query['redirect_to'] == 'string')redirect = loc.query['redirect_to'];

  onMount(async () => {
    let dat = await fetch('http://localhost:8080/api/v1/profile', { credentials: 'include' });
    if(dat.status === 200)return nav('/profile');

    window.turnstile.render(turnstile!, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i' });
  });

  let login = async () => {
    if(!username! || !username!.value)return;
    if(!password! || !password!.value)return;

    loginContainer!.style.display = 'none';
    loadingContainer!.style.display = 'block';

    tunnel([
      new PlainText('AL'),
      new Encryptable(username.value),
      new Encryptable(password.value),
    ],
    async ( res ) => {
      if(res[0] === "1"){
        // Error

        let text = LOGIN_ERRORS[parseInt(res[1])];
        if(res[1] === '2'){
          text += new Date(parseInt(res.slice(2)) * 1000)
        }

        window.setErrorText(text);

        loginContainer!.style.display = 'block';
        loadingContainer!.style.display = 'none';
      } else if(res[0] === "0"){
        // No Error
        let dat = await fetch('http://localhost:8080/api/v1/verification?token=' + res.slice(1) + "&next=" + encodeURIComponent(redirect));
  
        let json = await dat.json();
        nav(json.endpoint + '#' + res.slice(1));
      }
    });
  }

  return (
    <>
      <div class="app-container" style={{ height: '420px' }}>
        <h1>Phaze ID</h1><br />
        <h3>Login</h3><br />

        <div ref={loadingContainer!} style={{ display: 'none' }}>Loading...</div>

        <div ref={loginContainer!}>
          <div class="input">
            <input class="input-text" type="text" placeholder="Enter Username..." ref={username!} onKeyUp={(e) => e.key === 'Enter' ? login() : null}></input>
            <div class="input-underline"></div>
          </div><br /><br />
          
          <div class="input">
            <input class="input-text" type="password" placeholder="Enter Password..." ref={password!} onKeyUp={(e) => e.key === 'Enter' ? login() : null}></input>
            <div class="input-underline"></div>
          </div><br /><br />

          <div ref={( el ) => turnstile = el}></div><br />

          <div class="button" onClick={login}>
            Login
          </div><br />

          <div class="button-text" onClick={() => nav('/signup')}>
            I don't have an account
          </div>

          <div class="button-text" style={{ color: '#999' }} onClick={() => nav('/reset-password')}>
            Forgot Password?
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;