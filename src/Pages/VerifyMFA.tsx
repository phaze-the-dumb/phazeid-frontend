import { onMount } from "solid-js";
import CodeInput from "../Components/CodeInput";
import { useLocation, useNavigate } from "@solidjs/router";

let VerifyMFA = () => {
  let nav = useNavigate();
  let loc = useLocation();

  onMount(() => {
    let token = window.location.hash.slice(1);
    if(!token)return nav('/login');
  })

  let submit = async ( code: string ) => {
    let token = window.location.hash.slice(1);
    if(token){
      let dat = await fetch('http://localhost:8080/api/v1/verification/verify_mfa', {
        method: 'POST',
        body: JSON.stringify({ code, token }),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include'
      })

      if(dat.status !== 200)
        return window.setErrorText(await dat.text());

      let json = await dat.json();
      window.setErrorText("");

      if(json.endpoint)nav(json.endpoint);
      else nav(loc.query['redirect_to'] as string)
    }
  }

  return (
    <>
      <div class="app-container" style={{ height: '220px' }}>
        <h1>Phaze ID</h1>
        <h3>Verify MFA</h3><br />

        <CodeInput onChange={submit} />

        <br />
        <p>Please enter the code from your authenticator app.</p>

        <div class="button-text" onClick={() => nav('/verify-backup' + window.location.hash)} style={{ color: '#aaa' }}>
          Use a backup code.
        </div>
      </div>
    </>
  )
}

export default VerifyMFA