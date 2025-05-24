import { useNavigate } from "@solidjs/router";

let Profile = () => {
  let nav = useNavigate();

  return (
    <>
      <div class="app-container" style={{ height: '470px' }}>
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

              <div class="button-danger" style="width: 100%;" onClick={() => nav('/account/logout')}>Logout</div><br />
            </div>
          </div>
          <br />
        
          <div class="button" style="width: 100%;" onClick={() => nav('/profile')}>Back</div>

          <div class="patreon-button" style="display: none;">Link Patreon Account</div>
          <div style="display: block;">
            <div class="patreon-button">Refresh Patreon Account</div><br />
          
            <div>You can find my Patreon page <span class="link" onClick={() => window.open('https://patreon.com/_phaz')}>here</span></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile;