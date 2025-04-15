import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

let Profile = () => {
  let nav = useNavigate();

  let headingText: HTMLDivElement;

  let profilePic: HTMLDivElement;
  let username: HTMLDivElement;

  let fileUpload: HTMLInputElement;

  let profilePicUpload = () => {

  }

  onMount(async () => {
    let id = window.location.hash.slice(1);
    if(!id)return nav('/login');

    let dat = await fetch('http://localhost/api/v1/profile', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    username!.innerText = json.username;
    profilePic!.style.background = 'url(\'https://cdn.phaz.uk/id/avatars/' + json.id + '/' + json.avatar + '.png\')';
  })

  return (
    <>
      <div class="app-container" style={{ height: '260px' }}>
        <h2 ref={headingText!}>Welcome Back</h2><br />

        <div>
          <div class="profile-pic" ref={profilePic!}>
            <input type="file" id="avi-upload" style={{ display: 'none' }} accept="image/jpeg, image/png" ref={( el ) => fileUpload = el} onChange={profilePicUpload} />

            <label for="avi-upload">
              <div class="profile-pic-edit"><i class="fa-solid fa-upload"></i></div>
            </label>
          </div>      

          <div class="username" ref={username!}></div>
        </div><br />

        <div style={{ "text-align": 'right', "margin-top": '-200px' }}>
          <div class="button" style={{ padding: '10px' }} onClick={() => nav('/settings')}><i class="fa-solid fa-gear"></i></div>
        </div>
      </div>
    </>
  )
}

export default Profile;