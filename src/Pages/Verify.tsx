import { onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

let Verify = () => {
  let nav = useNavigate();
  let loc = useLocation();

  onMount(() => {
    let token = window.location.hash.slice(1);
    if(!token)return nav('/login');
  })

  let submit = async () => {
    let token = window.location.hash.slice(1);
    if(token){
      let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/verification/verify', {
        method: 'POST',
        body: JSON.stringify({ token }),
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

  submit();

  return (
    <>
      <div class="app-container">
        <h1>Phaze ID</h1>
        <h3>Verifing</h3><br />

        <br />
        <p>Hang On. We're verifying your session...</p>
      </div>
    </>
  )
}

export default Verify;