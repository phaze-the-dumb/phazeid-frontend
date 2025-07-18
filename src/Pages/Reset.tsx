import { onMount } from "solid-js";
import { Encryptable, PlainText, tunnel } from "../util/auth";
import { useNavigate } from "@solidjs/router";

const RESET_ERRORS = [
  "Invalid Token",
  "Password has been changed in the last 15 minutes. Please wait to change it again.",
  "Password must be less than 50 characters"
]

let Reset = () => {
  let nav = useNavigate();

  let turnstile: HTMLElement;

  let password: HTMLInputElement;
  let passwordConf: HTMLInputElement;

  let resetContainer!: HTMLDivElement;
  let finishedResetContainer!: HTMLDivElement;

  onMount(() => {
    let token = window.location.hash.slice(1);
    if(!token)return nav('/login');

    window.turnstile.render(turnstile!, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i' });
  })

  let resetPassword = async () => {
    let token = window.location.hash.slice(1);
    if(!token)return window.setErrorText('Invalid Token');

    console.log(password!.value, passwordConf!.value);

    if(!password!.value || password!.value !== passwordConf!.value)return;

    tunnel([
      new PlainText('NP'),
      new PlainText(token),
      new Encryptable(password!.value)
    ],
    async ( res ) => {
      if(res[0] === "1"){
        // Error
        window.setErrorText(RESET_ERRORS[parseInt(res[1])])
      } else if(res[0] === "0"){
        // No Error
        resetContainer.style.display = 'none';
        finishedResetContainer.style.display = 'block';
      }
    });
  }

  return (
    <>
      <div class="app-container">
        <h1>Phaze ID</h1><br />
        <h3>Reset Password</h3><br />

        <div ref={resetContainer}>
          <div class="input">
            <input class="input-text" type="password" placeholder="Enter Password..." ref={password!}></input>
            <div class="input-underline"></div>
          </div><br /><br />

          <div class="input">
            <input class="input-text" type="password" placeholder="Confirm Password..." ref={passwordConf!}></input>
            <div class="input-underline"></div>
          </div><br /><br />

          <div ref={( el ) => turnstile = el}></div><br />

          <div class="button" onClick={resetPassword}>
            Change Password
          </div>
        </div>
        
        <div ref={finishedResetContainer} style={{ display: 'none' }}>
          <p>Password reset. Please login using your new password.</p><br />

          <div class="button" onclick={() => nav('/login')}>Login</div>
        </div>
      </div>
    </>
  )
}

export default Reset;