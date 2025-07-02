import { createSignal, For, onMount, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

// http://localhost:5173/oauth?response_type=code&client_id=6845922f2c7fe96bd7a6a58c&redirect_uri=https://phazed.xyz/oauth/cb&scope=identify&state=123

const SCOPE_DESCRIPTIONS: any = {
  "identify": "See your profile"
};

let Profile = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let turnstile!: HTMLDivElement;

  let [ errorState, setErrorState ] = createSignal<string | null>(null);
  let [ appName, setAppName ] = createSignal<string | null>(null);
  let [ scopes, setScopes ] = createSignal<string[]>([]);

  let responseType = loc.query['response_type'];
  let clientId = loc.query['client_id'];
  let redirectUri = loc.query['redirect_uri'];
  let scope = loc.query['scope'] as string;
  let state = loc.query['state'];

  onMount(async () => {
    if(responseType !== "code" && responseType !== "code_skip")return window.setErrorText("Only the \"code\" response type ");

    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/oauth/app?client_id=' + clientId + '&redirect_uri=' + redirectUri, { credentials: 'include' });
    if(dat.status !== 200)return nav('/login?redirect_to=' + encodeURIComponent(loc.pathname) + encodeURIComponent(loc.search));

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    if(json.allow_skip && responseType === "code_skip")return allow(false);

    setAppName(json.name);
    setScopes(scope.split(',').map(x => SCOPE_DESCRIPTIONS[x]!));

    window.turnstile.render(turnstile, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i' });

    if(json.valid === false){
      window.setErrorText('OAuth Error: ' + json.error);
      return setErrorState(json.error);
    }
  })

  let allow = async ( useTurnstile: boolean = true ) => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/oauth/authorize?response_type=' + responseType + '&client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scope, {
      credentials: 'include',
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: useTurnstile ? window.turnstile.getResponse() : crypto.randomUUID() })
    });

    if(dat.status !== 200){
      let err = await dat.text();
      window.setErrorText(err);

      if(useTurnstile)window.turnstile.reset();
      return;
    }

    let json = await dat.json();
    window.setErrorText("");

    if(json.endpoint)return nav(json.endpoint);
    window.location.href = (redirectUri + '?code=' + json.code + '&state=' + state);
  }

  let deny = () => window.location.href = (redirectUri + '?error=access_denied&state=' + state);

  return (
    <div class="app-container" style={{ height: '500px' }}>
      <h1>Phaze ID</h1>
      <h3>OAuth</h3>

      <Show when={errorState()} fallback={
        <Show when={appName()} fallback={ <h2>Loading...</h2> }>
          <div><br />
            <p>{ appName() } would like to be able to:</p>

            <For each={scopes()}>
              {( scope: string ) => scope ? (
                <div style={{ display: 'flex', "justify-content": 'center', "align-items": 'center', "margin": '20px 0' }}>
                  <i style={{ "font-size": '25px' }} class="fa-solid fa-circle-check"></i>
                  <div style={{ "margin-left": '10px' }}></div>
                  <div>{scope}</div>
                </div>
              ) : ( <></> )}
            </For>


            <div style={{ position: 'absolute', bottom: '10px', width: 'calc(100% - 20px)' }}>
              <div ref={turnstile}></div>

              <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={() => allow()}>Allow</div>
              <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={deny}>Deny</div>
            </div>
          </div>
        </Show>
      }>
        <div class="oauth-error">
          <i class="fa-solid fa-circle-exclamation"></i><br />
          <span style={{ color: '#bbb' }}>OAuth Error:</span> { errorState() }
        </div>
      </Show>
    </div>
  )
}

export default Profile;