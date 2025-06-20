import { onMount } from "solid-js";
import { Encryptable, PlainText, tunnel } from "../util/auth";
import { useNavigate } from "@solidjs/router";

const SIGNUP_ERRORS = [
  "Password and Username must be less than 50 characters",
  "Invalid Email",
  "Username in Use",
  "Email in Use"
]

let Signup = () => {
  let turnstile: HTMLElement;

  let username: HTMLInputElement;
  let email: HTMLInputElement;

  let password: HTMLInputElement;
  let passwordConf: HTMLInputElement;

  let nav = useNavigate();

  onMount(() => {
    window.turnstile.render(turnstile!, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i' })
  });

  let signup = async () => {
    if(!username! || !username!.value)return console.log('u');
    if(!email! || !email!.value)return console.log('e');
    if(!password! || !password!.value)return console.log('p');
    if(!passwordConf! || !passwordConf!.value)return console.log('pc');

    if(password!.value !== passwordConf!.value)return;

    tunnel([
      new PlainText('AS'),
      new Encryptable(username.value),
      new Encryptable(password.value),
      new Encryptable(email.value),
    ],
    ( res ) => {
      if(res[0] === "1"){
        // Error
        window.setErrorText(SIGNUP_ERRORS[parseInt(res[1])])
      } else if(res[0] === "0"){
        // No Error
        nav('/verify-email?redirect_to=/profile#' + res.slice(1));
      }
    });
  } 

  return (
    <>
      <div class="app-container" style={{ height: '540px' }}>
        <h1>Phaze ID</h1><br />
        <h3>Sign Up</h3><br />

        <p>Profile</p>
        <div class="input">
          <input class="input-text" type="text" placeholder="Enter Username..." ref={username!}></input>
          <div class="input-underline"></div>
        </div><br /><br />

        <div class="input">
          <input class="input-text" type="email" placeholder="Enter Email..." ref={email!}></input>
          <div class="input-underline"></div>
        </div><br /><br />

        <p>Password</p>
        <div class="input">
          <input class="input-text" type="password" placeholder="Enter Password..." ref={password!}></input>
          <div class="input-underline"></div>
        </div><br /><br />

        <div class="input">
          <input class="input-text" type="password" placeholder="Confirm Password..." ref={passwordConf!}></input>
          <div class="input-underline"></div>
        </div><br /><br />

        <div ref={( el ) => turnstile = el}></div><br />

        <div class="button" onClick={signup}>
          Sign Up
        </div><br />

        <div class="button-text" onClick={() => nav('/login')}>
          I already have an account
        </div>
      </div>
    </>
  )
}

export default Signup;