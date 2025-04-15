import { Encryptable, PlainText, tunnel } from "../util/auth";
import { useNavigate } from "@solidjs/router";

const LOGIN_ERRORS = [
  "Password and Username must be less than 50 characters",
  "Incorrect Username or Password",
  "Account locked until 000"
]

let Login = () => {
  let username: HTMLInputElement;
  let password: HTMLInputElement;

  let nav = useNavigate();

  let login = async () => {
    if(!username! || !username!.value)return;
    if(!password! || !password!.value)return;

    tunnel([
      new PlainText('AL'),
      new Encryptable(username.value),
      new Encryptable(password.value),
    ],
    async ( res ) => {
      if(res[0] === "1"){
        // Error
        window.setErrorText(LOGIN_ERRORS[parseInt(res[1])])
      } else if(res[0] === "0"){
        // No Error
        let dat = await fetch('http://localhost/api/v1/verification?token=' + res.slice(1));
  
        let json = await dat.json();
        nav(json.endpoint + '#' + res.slice(1));
      }
    });
  }

  return (
    <>
      <div class="app-container" style={{ height: '330px' }}>
        <h1>Phaze ID</h1><br />
        <h3>Login</h3><br />

        <div class="input">
          <input class="input-text" type="text" placeholder="Enter Username..." ref={username!}></input>
          <div class="input-underline"></div>
        </div><br /><br />
        
        <div class="input">
          <input class="input-text" type="password" placeholder="Enter Password..." ref={password!}></input>
          <div class="input-underline"></div>
        </div><br /><br />

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
    </>
  )
}

export default Login;