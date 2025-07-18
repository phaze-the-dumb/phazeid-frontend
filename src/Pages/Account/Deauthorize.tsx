import { useLocation, useNavigate } from "@solidjs/router";

let AccountDelete = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let service = loc.query['for_service'] as string || 'id';

  let deleteAccount = async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/remove_oauth_app?session=' + loc.query['id'], { credentials: 'include' });
    if(dat.status !== 200)return window.setErrorText(await dat.text());

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint + '?for_service=' + service);
  }

  return (
    <>
      <div class="app-container">
        <h1>Phaze ID</h1>
        <h3>Account Deletion</h3><br />

        <p>
          Are you sure you want to <b>delete</b> all data from <b>{ loc.query['name'] }</b> from your account?<br /><br />

          This will remove all data stored on this application<br /><br />

          Your PhazeID account will <b>NOT</b> be deleted.
        </p><br />

        <div onClick={() => nav('/account/devices/oauth?for_service=' + service)} class="button" style={{ width: '100%' }}>Back</div>
        <div onClick={deleteAccount} class="button-danger" style={{ width: '100%', "margin-top": '10px' }}>Delete application data.</div>
      </div>
    </>
  )
}

export default AccountDelete;