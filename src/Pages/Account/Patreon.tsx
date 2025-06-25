import { useLocation, useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

let AccountPatreon = () => {
  let nav = useNavigate();
  let loc = useLocation();

  onMount(async () => {
    let dat = await fetch('https://id.api.phaz.uk/api/v1/patreon/callback?code=' + loc.query['code'], { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);
  })

  return (
    <>
      <div class="app-container" style={{ height: '160px' }}>
        <h1>Phaze ID</h1>
        <h3>Connecting...</h3><br />

        <br />
        <p>Hang On. We're communicating with patreon...</p>
      </div>
    </>
  )
}

export default AccountPatreon;