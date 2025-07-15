import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, Match, onMount, Show, Switch } from "solid-js";

let Profile = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let service = loc.query['for_service'] as string || 'id';

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

  let removePatreon = async () => {
    let prevTier = patreonTier();
    setPatreonTier(-1);

    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/patreon/remove', { credentials: 'include' });
    if(dat.status !== 200){
      setPatreonTier(prevTier);
      return window.setErrorText("Error removing patreon account: " + await dat.text());
    }

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    setPatreonLinked(false);
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
      <div class="app-container" style={{ height: '250px' }}>
        <div>
          <h2>Patreon</h2><br />

          <div>
            <Show when={patreonLinked()} fallback={
              <div class="patreon-button" onClick={() => window.location.href = 'https://idapi-jye3bcyp.phazed.xyz/api/v1/patreon/link?state=?for_service=' + service}>Link Patreon Account</div>
            }>
              <div>
                <div class="button" style="width: 100%;" onClick={refreshPatreon}>Refresh Patreon Account</div>
                <div class="button" style="width: 100%; margin-top: 5px;" onClick={removePatreon}>Remove Patreon Account</div><br />

                <Switch>
                  <Match when={patreonTier() === -1}>
                    <div style="margin-top: 5px;">Loading...</div>
                  </Match>
                  <Match when={patreonTier() === 0}>
                    <div style="margin-top: 5px;">You can find my Patreon page <span class="link" onClick={() => window.open('https://patreon.com/_phaz')}>here</span></div>
                  </Match>
                  <Match when={patreonTier() === 1}>
                    <div style="margin-top: 5px;">Thank you for being a patreon!</div>
                  </Match>
                  <Match when={patreonTier() === 2}>
                    <div style="margin-top: 5px;">Thank you for being a VIP patreon!!</div>
                  </Match>
                </Switch>
              </div>
            </Show>
          </div><br /><br />

          <div class="button" style="width: 100%;" onClick={() => nav('/settings?for_service=' + service)}>Back</div>
        </div>
      </div>
    </>
  )
}

export default Profile;