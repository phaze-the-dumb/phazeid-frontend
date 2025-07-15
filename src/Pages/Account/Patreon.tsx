import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

let AccountPatreon = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let [ patreonError, setPatreonError ] = createSignal('');

  onMount(async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/patreon/callback?code=' + loc.query['code'] + '&state=' + loc.query['state'], { credentials: 'include' });
    if(dat.status !== 200)return setPatreonError('Error: ' + await dat.text());

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);
  })

  return (
    <>
      <div class="app-container" style={{ height: '200px' }}>
        <h1>Phaze ID</h1>
        <h3>Connecting...</h3><br />

        <br />
        <p>Hang On. We're communicating with patreon...</p>
        <span>{ patreonError() }</span>

        <div class="button" style={{ width: '100%', "margin-top": '5px' }} onClick={() => nav('/settings' + loc.query['state'])}>Back</div>
      </div>
    </>
  )
}

export default AccountPatreon;