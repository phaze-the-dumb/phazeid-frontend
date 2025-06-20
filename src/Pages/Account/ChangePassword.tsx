import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { Encryptable, PlainText, tunnel } from "../../util/auth";

const PASSWORD_CHANGE_ERRORS = [
  "Invalid Token",
  "Incorrect Username or Password",
  "Password must be less than 50 characters",
  "Password has been changed in the last 15 minutes. Please wait to change it again."
]

let AccountChangePassword = () => {
  let turnstile: HTMLElement;

  let newPassword: HTMLInputElement;
  let confirmNewPassword: HTMLInputElement;
  let confirmOldPassword: HTMLInputElement;

  let nav = useNavigate();

  onMount(async () => {
    let dat = await fetch('http://localhost:8080/api/v1/profile', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    window.turnstile.render(turnstile!, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i' });
  })

  let submit = async () => {
    if(newPassword!.value !== confirmNewPassword!.value)
      return window.setErrorText("New password and new password confirmation must be the same.");

    tunnel([
      new PlainText('EP'),
      new Encryptable(confirmNewPassword!.value),
      new Encryptable(confirmOldPassword!.value)
    ],
    async ( res ) => {
      if(res[0] === "1"){
        // Error

        let text = PASSWORD_CHANGE_ERRORS[parseInt(res[1])];
        window.setErrorText(text);
      } else if(res[0] === "0"){
        // No Error

        window.setErrorText("");
        nav('/settings');
      }
    });
  }

  return (
    <>
      <div class="app-container" style={{ height: '380px' }}>
        <h4>Change Password</h4>

        <div class="input" style={{ 'margin-top': '5px'}}>
          <input 
            class="input-text" 
            type="password" 
            placeholder="Enter New Password..." 
            ref={newPassword!}
            onKeyUp={(e) => e.key === 'Enter' ? submit() : null} />

          <div class="input-underline"></div>
        </div><br />

        <div class="input" style={{ 'margin-top': '5px'}}>
          <input 
            class="input-text" 
            type="password" 
            placeholder="Confirm New Password..." 
            ref={confirmNewPassword!}
            onKeyUp={(e) => e.key === 'Enter' ? submit() : null} />

          <div class="input-underline"></div>
        </div><br /><br />

        <div class="input" style={{ 'margin-top': '5px'}}>
          <input 
            class="input-text" 
            type="password" 
            placeholder="Confirm Old Password..." 
            ref={confirmOldPassword!}
            onKeyUp={(e) => e.key === 'Enter' ? submit() : null} />

          <div class="input-underline"></div>
        </div><br /><br />

        <div ref={( el ) => turnstile = el}></div><br />

        <div class="button" style={{ width: '100%' }} onClick={submit}>Save</div><br />
        <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={() => { window.setErrorText(""); nav('/settings') }}>Cancel</div>
      </div>
    </>
  )
}

export default AccountChangePassword;