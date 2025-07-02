import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import CodeInput from "../../Components/CodeInput";

let AccountVerifyEmail = () => {
  let nav = useNavigate();

  onMount(async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/profile', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);
  })

  let submit = async ( code: string ) => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/change_email/verify', { 
      credentials: 'include',
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if(dat.status !== 200){
      let err = await dat.text();
      window.setErrorText(err);

      return;
    }

    let json = await dat.json();
    window.setErrorText("");

    nav(json.endpoint);
  }

  return (
    <>
      <div class="app-container" style={{ height: '203px' }}>
        <h4>Verify Email</h4>

        <CodeInput onChange={submit} />

        <br />
        <p>We've sent you an email with a code in it, please check both your inbox and spam folders.</p>

        <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={() => { window.setErrorText(""); nav('/settings') }}>Cancel</div>
      </div>
    </>
  )
}

export default AccountVerifyEmail;