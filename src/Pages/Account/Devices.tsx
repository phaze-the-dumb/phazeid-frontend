import { useLocation, useNavigate } from "@solidjs/router";
import { For, onMount, Show } from "solid-js";

const DAYS = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
const MONTH = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

let AccountDevices = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let service = loc.query['for_service'] as string || 'id';

  let sessionsList!: HTMLDivElement;

  let formatDate = ( date: number ): string => {
    let d = new Date(date);
    return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTH[d.getMonth()] + ' (' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ')';
  }

  onMount(async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/sessions', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint + '?for_service=' + service);

    json.sessions.reverse();

    sessionsList.innerHTML = '';
    sessionsList.appendChild(<div>
      <br />
      <For each={json.sessions}>
        { ( item ) => <div class="session" id={ 'session-' + item._id }>
          <h4>{ item.loc.ip } <span class="session-time">{ formatDate(item.created_on * 1_000) }</span></h4>
          <p style={{ 'font-weight': '100', 'color': '#ccc' }}>
            <Show when={item.is_this}>
              (This Session)<br />
            </Show>
            { item.loc.region } { item.loc.city }<br />
            { item.loc.org }
          </p>

          <Show when={!item.is_this}>
            <br /><div class="button-danger" style={{ width: '100%' }} onClick={async () => {
              let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/logout?session=' + item._id, { credentials: 'include' });
              if(dat.status !== 200)return window.setErrorText('Failed to revoke session.');

              document.querySelector('#session-' + item._id)?.remove();
            }}>Remove Device</div>
          </Show>
        </div>}
      </For>
      <br />
    </div> as Node);
  })

  return (
    <>
      <div class="app-container">
        <h1>Phaze ID</h1>
        <h3>Devices</h3>

        <div style={{ height: '310px', overflow: 'auto' }} ref={sessionsList}>Loading...</div>

        <div class="button" style={{ width: '100%' }} onClick={() => nav('/account/devices/oauth?for_service=' + service)}>Authorized Apps</div>
        <div class="button" style={{ width: '100%', "margin-top": '5px' }} onClick={() => nav('/settings?for_service=' + service)}>Back</div>
      </div>
    </>
  )
}

export default AccountDevices;