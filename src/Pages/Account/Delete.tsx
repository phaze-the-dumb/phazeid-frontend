import { useNavigate } from "@solidjs/router";

let AccountDelete = () => {
  let nav = useNavigate();

  let deleteAccount = async () => {
    let dat = await fetch('http://localhost:8080/api/v1/account/delete', { method: 'DELETE', credentials: 'include' });
    if(dat.status !== 200)return window.setErrorText(await dat.text());

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);
  }

  return (
    <>
      <div class="app-container" style={{ height: '400px' }}>
        <h1>Phaze ID</h1>
        <h3>Account Deletion</h3><br />

        <p>
          Are you sure you want to <b>delete</b> your account?<br /><br />

          You will no longer be able to access your account.<br /><br />

          It will be deleted in <b>24 HOURS</b> after you submit the deletion request. You can restore the account by logging back in within that time.
        </p><br />

        <div onClick={() => nav('/settings')} class="button" style={{ width: '100%' }}>Back</div>
        <div onClick={deleteAccount} class="button-danger" style={{ width: '100%', "margin-top": '10px' }}>Delete my account.</div>
      </div>
    </>
  )
}

export default AccountDelete;