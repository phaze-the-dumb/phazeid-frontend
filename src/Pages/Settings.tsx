import { useNavigate } from "@solidjs/router";
import { createSignal, Match, onMount, Show, Switch } from "solid-js";

let Profile = () => {
  let nav = useNavigate();

  let [ patreonLinked, setPatreonLinked ] = createSignal(false);
  let [ patreonTier, setPatreonTier ] = createSignal(-1);

  let refreshPatreon = async () => {
    let prevTier = patreonTier();
    setPatreonTier(-1);

    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/patreon/refresh', { credentials: 'include' });
    if(dat.status !== 200){
      setPatreonTier(prevTier);
      return window.setErrorText("Error refreshing patreon data: " + await dat.text());
    }

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    if(json.patreon_tiers.includes('PATREON'))setPatreonTier(1);
    else if(json.patreon_tiers.includes('VIP_PATREON'))setPatreonTier(2);
    else setPatreonTier(0);
  }

  onMount(async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/profile', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    setPatreonLinked(json.patreon_linked);

    if(json.patreon_tiers.includes('PATREON'))setPatreonTier(1);
    else if(json.patreon_tiers.includes('VIP_PATREON'))setPatreonTier(2);
    else setPatreonTier(0);
  });

  return (
    <>
      <div class="app-container" style={{ height: '515px' }}>
        <div>
          <h2>Settings</h2><br />

          <div>
            <div>
              <h4>Security</h4>
            
              <div class="button" style="width: 100%;" onClick={() => nav('/account/2fa')}>2FA Settings</div><br />
              <div class="button" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/devices')}>Authenticated Devices</div><br /><br />
            
              <h4>Profile</h4>
            
              <div class="button" style="width: 100%;" onClick={() => nav('/account/email')}>Change Email</div><br />
              <div class="button" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/username')}>Change Username</div><br />
              <div class="button" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/password')}>Change Password</div><br /><br /><br />

              <div class="button-danger" style="width: 100%;" onClick={() => nav('/account/delete')}>Delete Account</div><br />
              <div class="button-danger" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/logout')}>Logout</div><br />
            </div>
          </div>
          <br />
        
          <div class="button" style="width: 100%;" onClick={() => nav('/profile')}>Back</div>

          <Show when={patreonLinked()} fallback={
            <div class="patreon-button" onClick={() => window.open('https://idapi-jye3bcyp.phazed.xyz/api/v1/patreon/link')}>Link Patreon Account</div>
          }>
            <div>
              <div class="patreon-button" onClick={refreshPatreon}>Refresh Patreon Account</div><br />

              <Switch>
                <Match when={patreonTier() === -1}>
                  <div>Loading...</div>
                </Match>
                <Match when={patreonTier() === 0}>
                  <div>You can find my Patreon page <span class="link" onClick={() => window.open('https://patreon.com/_phaz')}>here</span></div>
                </Match>
                <Match when={patreonTier() === 1}>
                  <div>Thank you for being a patreon!</div>
                </Match>
                <Match when={patreonTier() === 2}>
                  <div>Thank you for being a VIP patreon!!</div>
                </Match>
              </Switch>
            </div>
          </Show>
        </div>
      </div>
    </>
  )
}

export default Profile;