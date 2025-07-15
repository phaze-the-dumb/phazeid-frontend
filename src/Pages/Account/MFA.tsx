import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import CodeInput from "../../Components/CodeInput";

let AccountMFA = () => {
  let nav = useNavigate();
  let loc = useLocation();

  let service = loc.query['for_service'] as string || 'id';

  let [ txtCode, setTxtCode ] = createSignal('');

  let qrCode!: HTMLDivElement;
  let qrImage!: HTMLImageElement;

  let mfaSlide1!: HTMLDivElement;
  let mfaSlide2!: HTMLDivElement;

  let mfaLoading!: HTMLDivElement;

  let appContainer!: HTMLDivElement;

  onMount(async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/enable_mfa', { credentials: 'include' });
    if(dat.status !== 200)return window.setErrorText('Cannot load 2FA code: ' + await dat.text());

    let json = await dat.json();
    if(json.is_enabled){
      mfaSlide1.style.display = 'none';
      mfaSlide2.style.display = 'block';

      appContainer.style.height = '225px';
    } else{
      qrImage.src = 'data:image/png;base64,' + json.qr.Ok;
      qrImage.style.display = 'block';

      setTxtCode(json.txt);
    }
  })

  let submit = async ( code: string ) => {
    mfaSlide1.style.display = 'none';
    mfaLoading.style.display = 'block';
    mfaSlide2.style.display = 'none';

    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/confirm_mfa', { 
      credentials: 'include', 
      body: JSON.stringify({ code }), 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(dat.status !== 200){
      mfaSlide1.style.display = 'block';
      mfaLoading.style.display = 'none';
      mfaSlide2.style.display = 'none';

      return window.setErrorText('Cannot confirm 2FA code: ' + await dat.text());
    }

    let json = await dat.json();

    mfaSlide1.style.display = 'none';
    mfaLoading.style.display = 'none';
    mfaSlide2.style.display = 'block';

    appContainer.style.height = '460px';
    appContainer.appendChild(<div>
      <br />
      <p>These are your MFA backup codes, these will never be shown again. Write them down in a safe place incase you lose your account.<br /><br />Once you use a code it will become invalid.</p>
      <div class="mfa-codes">
        <div style="display: flex;">
          <div style="width: 50%;">
            { json.backup_codes[0] }<br />
            { json.backup_codes[1] }<br />
            { json.backup_codes[2] }
          </div>
          <div style="width: 50%;">
            { json.backup_codes[3] }<br />
            { json.backup_codes[4] }<br />
            { json.backup_codes[5] }
          </div>
        </div>
      </div>
    </div> as Node);
  }

  let disable = async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/disable_mfa', { credentials: 'include', method: 'DELETE' });
    if(dat.status !== 200)return window.setErrorText('Cannot disable 2FA : ' + await dat.text());
    
    mfaSlide1.style.display = 'block';
    mfaSlide2.style.display = 'none';
    
    nav('/settings');
  }

  return (
    <>
      <div class="app-container" ref={appContainer} style={{ height: '450px' }}>
        <h1>Phaze ID</h1>
        <h3>Enable 2FA</h3><br />

        <div ref={mfaSlide1}>
          <div class="mfa-qr" ref={qrCode}>
            <img ref={qrImage} />
          </div>
          <p>{ txtCode() }</p><br />

          <p>Enter the code displayed in your authenticator app here.</p><br />
          <CodeInput onChange={submit} />
        </div>

        <div ref={mfaLoading} style={{ display: 'none' }}>
          <p>Loading...</p>
        </div>
        
        <div ref={mfaSlide2} style={{ display: 'none' }}>
          <p>2FA is enabled.</p><br />

          <div class="button-danger" style={{ width: '100%' }} onClick={disable}>Disable 2FA</div>
          <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={() => nav('/settings?for_service=' + service)}>Back</div>
        </div>
      </div>
    </>
  )
}

export default AccountMFA;