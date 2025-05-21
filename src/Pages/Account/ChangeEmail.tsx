import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

let AccountChangeEmail = () => {
  let turnstile: HTMLElement;

  let nav = useNavigate();

  onMount(async () => {
    let dat = await fetch('http://localhost/api/v1/profile', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    window.turnstile.render(turnstile!, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i' });
  })

  let value = '';
  let submit = async () => {
    let dat = await fetch('http://localhost/api/v1/account/change_email', { 
      credentials: 'include',
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ 
        value,
        token: window.turnstile.getResponse()
      })
    });

    if(dat.status !== 200){
      let err = await dat.text();
      window.setErrorText(err);

      window.turnstile.reset();
      return;
    }

    let json = await dat.json();
    window.setErrorText("");

    nav(json.endpoint);
  }

  return (
    <>
      <div class="app-container" style={{ height: '275px' }}>
        <h4>Change Email</h4>

        <div class="input" style={{ 'margin-top': '5px'}}>
          <input 
            class="input-text" 
            type="text" 
            placeholder="Enter New Email..." 
            onInput={( el ) => value = el.target.value} 
            onKeyUp={(e) => e.key === 'Enter' ? submit() : null} />

          <div class="input-underline"></div>
        </div><br /><br />

        <div ref={( el ) => turnstile = el}></div><br />

        <div class="button" style={{ width: '100%' }} onClick={submit}>Save</div><br />
        <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={() => { window.setErrorText(""); nav('/settings') }}>Cancel</div>
      </div>
    </>
  )
}

export default AccountChangeEmail;