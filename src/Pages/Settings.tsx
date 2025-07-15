import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, Match, onMount, Show, Switch } from "solid-js";

let services: any = {
  'id': '/profile',
  'vrctools': 'http://dev.test.localhost/settings'
};

let Profile = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let service = loc.query['for_service'] as string || 'id';

  let [ patreonLinked, setPatreonLinked ] = createSignal(false);
  let [ patreonTier, setPatreonTier ] = createSignal(-1);

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
            
              <div class="button" style="width: 100%;" onClick={() => nav('/account/2fa?for_service=' + service)}>2FA Settings</div><br />
              <div class="button" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/devices?for_service=' + service)}>Authenticated Devices</div><br /><br />
            
              <h4>Profile</h4>
            
              <div class="button" style="width: 100%;" onClick={() => nav('/account/email?for_service=' + service)}>Change Email</div><br />
              <div class="button" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/username?for_service=' + service)}>Change Username</div><br />
              <div class="button" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/password?for_service=' + service)}>Change Password</div><br /><br /><br />

              <div class="button-danger" style="width: 100%;" onClick={() => nav('/account/delete?for_service=' + service)}>Delete Account</div><br />
              <div class="button-danger" style="width: 100%; margin-top: 5px;" onClick={() => nav('/account/logout?for_service=' + service)}>Logout</div><br />
            </div>
          </div>
          <br />

          <Show when={services[service].startsWith('/')} fallback={
            <div class="button" style="width: 100%;" onClick={() => window.location.href = services[service]}>Back</div>
          }>
            <div class="button" style="width: 100%;" onClick={() => nav(services[service])}>Back</div>
          </Show>

          <Show when={patreonLinked()} fallback={
            <div class="patreon-button" onClick={() => window.location.href = 'https://idapi-jye3bcyp.phazed.xyz/api/v1/patreon/link?state=?for_service=' + service}>Link Patreon Account</div>
          }>
            <div>
              <div class="patreon-button" onClick={() => nav('/patreon?for_service=' + service)}>Patreon Settings</div><br />

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