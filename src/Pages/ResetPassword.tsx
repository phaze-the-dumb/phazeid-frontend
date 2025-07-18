import { onMount } from "solid-js";
import { Encryptable, PlainText, tunnel } from "../util/auth";
const RESET_ERRORS = [
  "Invalid Email"
]

let ResetPassword = () => {
  let turnstile: HTMLElement;

  let email!: HTMLInputElement;

  let resetContainer!: HTMLDivElement;
  let finishedResetContainer!: HTMLDivElement;

  onMount(() => {
    window.turnstile.render(turnstile!, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i' });
  })

  let resetPassword = async () => {
    if(!email.value)return;

    tunnel([
      new PlainText('RP'),
      new Encryptable(email.value)
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
            <input class="input-text" type="email" placeholder="Enter Email..." ref={email} onKeyUp={(e) => e.key === 'Enter' ? resetPassword() : null}></input>
            <div class="input-underline"></div>
          </div><br /><br />

          <div ref={( el ) => turnstile = el}></div><br />

          <div class="button" onClick={resetPassword}>
            Reset Password
          </div>
        </div>
        
        <div ref={finishedResetContainer} style={{ display: 'none' }}>
          <p>We've sent an email with a password reset link in it. Please check your inbox and spam folders.</p>
        </div>
      </div>
    </>
  )
}

export default ResetPassword;