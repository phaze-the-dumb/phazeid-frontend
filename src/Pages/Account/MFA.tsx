import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import CodeInput from "../../Components/CodeInput";

let AccountMFA = () => {
  let nav = useNavigate();
  let [ txtCode, setTxtCode ] = createSignal('');

  let qrCode!: HTMLDivElement;
  let qrImage!: HTMLImageElement;

  let mfaSlide1!: HTMLDivElement;
  let mfaSlide2!: HTMLDivElement;

  let appContainer!: HTMLDivElement;

  onMount(async () => {
    let dat = await fetch('http://localhost/api/v1/account/enable_mfa', { credentials: 'include' });
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
    let dat = await fetch('http://localhost/api/v1/account/confirm_mfa', { 
      credentials: 'include', 
      body: JSON.stringify({ code }), 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(dat.status !== 200)return window.setErrorText('Cannot confirm 2FA code: ' + await dat.text());

    mfaSlide1.style.display = 'none';
    mfaSlide2.style.display = 'block';

    appContainer.style.height = '225px';
  }

  let disable = async () => {
    let dat = await fetch('http://localhost/api/v1/account/disable_mfa', { credentials: 'include', method: 'DELETE' });
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
        
        <div ref={mfaSlide2} style={{ display: 'none' }}>
          <p>2FA is enabled.</p><br />

          <div class="button-danger" style={{ width: '100%' }} onClick={disable}>Disable 2FA</div>
          <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={() => nav('/settings')}>Back</div>
        </div>
      </div>
    </>
  )
}

export default AccountMFA;