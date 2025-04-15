import { onMount } from "solid-js";
import CodeInput from "../Components/CodeInput";
import { useNavigate } from "@solidjs/router";

let VerifyEmail = () => {
  let nav = useNavigate();

  onMount(() => {
    let token = window.location.hash.slice(1);
    if(!token)return nav('/login');
  })

  let submit = async ( code: string ) => {
    let token = window.location.hash.slice(1);
    if(token){
      let dat = await fetch('http://localhost/api/v1/verification/verify_email', {
        method: 'POST',
        body: JSON.stringify({ code, token }),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include'
      })

      if(dat.status !== 200)
        return window.setErrorText(await dat.text());

      let json = await dat.json();
      nav(json.endpoint);
      window.setErrorText("");
    }
  }

  return (
    <>
      <div class="app-container" style={{ height: '220px' }}>
        <h1>Phaze ID</h1>
        <h3>Verify Email</h3><br />

        <CodeInput onChange={submit} />

        <br />
        <p>We've sent you an email with a code in it, please check both your inbox and spam folders.</p>
      </div>
    </>
  )
}

export default VerifyEmail;