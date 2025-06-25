import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

let AccountLogout = () => {
  let nav = useNavigate();

  onMount(async () => {
    let dat = await fetch('https://id.api.phaz.uk/api/v1/account/logout', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    window.location.href = json.endpoint;
  })

  return (
    <>
      <div class="app-container" style={{ height: '140px' }}>
        <h1>Phaze ID</h1>
        <h3>Clearing Data...</h3><br />

        <br />
        <p>Hang On. We're revoking your session...</p>
      </div>
    </>
  )
}

export default AccountLogout;