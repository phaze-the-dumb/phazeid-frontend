import { createSignal, onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

let formatTime = ( date: number ): string => {
  let seconds = date;
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  minutes = minutes - hours * 60;
  return `${hours} Hour${(hours == 1 ? '' : 's')} and ${minutes} Minute${(minutes == 1 ? '' : 's')}`
}

let RestoreAccount = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let [ timeLeft, setTimeLeft ] = createSignal("");

  onMount(async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/deletion_state', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    if(!json.is_deleting)return nav(loc.query['next']! as string);
    setTimeLeft(formatTime(json.time_left));
  })

  let restore = async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/restore', { credentials: 'include' });
    if(dat.status !== 200)return window.setErrorText(await dat.text());

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);
  }

  let leave = () => { nav('/account/logout'); }

  return (
    <>
      <div class="app-container" style={{ height: '215px' }}>
        <h2>Welcome Back!</h2>
        <p>Your account has been flagged for deletion and will be deleted in { timeLeft() }</p>

        <br />
        <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={restore}>I want to restore it.</div>
        <div class="button-danger" style={{ width: '100%', 'margin-top': '7px' }} onClick={leave}>Delete my account.</div>
      </div>
    </>
  )
}

export default RestoreAccount;