import { onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

let Verify = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let code!: HTMLInputElement;

  let loadingContainer!: HTMLDivElement;
  let codeContainer!: HTMLDivElement;

  onMount(() => {
    let token = window.location.hash.slice(1);
    if(!token)return nav('/login');
  })

  let submit = async () => {
    let token = window.location.hash.slice(1);
    if(token){
      loadingContainer.style.display = 'block';
      codeContainer.style.display = 'none';

      let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/verification/verify_backup', {
        method: 'POST',
        body: JSON.stringify({ token, code: code.value }),
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
      <div class="app-container">
        <h1>Phaze ID</h1>
        <h3>Verify Backup Code</h3><br />

        <div ref={codeContainer}>
          <div class="input">
            <input class="input-text" type="text" placeholder="Enter Backup Code..." ref={code} onKeyUp={(e) => e.key === 'Enter' ? submit() : null}></input>
            <div class="input-underline"></div>
          </div><br /><br />

          <div class="button" onClick={submit}>
            Verify
          </div><br />

          <br />

          <div class="button-text" onClick={() => nav('/verify-mfa' + window.location.hash)} style={{ color: '#aaa' }}>
            Use a MFA code.
          </div>
        </div>

        <div ref={loadingContainer} style={{ display: 'none' }}>Loading...</div>
      </div>
    </>
  )
}

export default Verify;