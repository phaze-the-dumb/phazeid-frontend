import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

let Profile = () => {
  let nav = useNavigate();

  let headingText: HTMLDivElement;

  let profilePic: HTMLDivElement;
  let username: HTMLDivElement;

  let fileUpload: HTMLInputElement;

  let originalPfpUrl = '';

  let profilePicUpload = () => {
    let reader = new FileReader();

    reader.onload = () => {
      let canvas = <canvas width={300} height={300}></canvas> as HTMLCanvasElement;

      let img = new Image();
      img.src = reader.result?.toString()!;

      img.onload = () => {
        let scaledByHeight = img.height > img.width;
        let width, height;

        if(scaledByHeight){
          width = 300;
          height = ( 300 / img.width ) * img.height;
        } else{
          height = 300;
          width = ( 300 / img.height ) * img.width;
        }

        let x = 150 - width / 2,
            y = 150 - height / 2;

        canvas!.getContext('2d')!.drawImage(img, x, y, width, height);

        let formdata = new FormData();
        canvas!.toBlob(async ( blob ) => {
          formdata.append('img', blob!);
          
          let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/account/change_avatar', {
            credentials: 'include',
            method: 'PUT',
            body: formdata
          });

          if(dat.status !== 200){
            profilePic!.style.background = 'url(\'' + originalPfpUrl + '\')';
            return window.setErrorText('Failed to upload avatar: ' + await dat.text());
          }

          window.setErrorText("");
        })
        
        profilePic!.style.background = 'url(\'' + canvas!.toDataURL('image/png') + '\')';
      }
    }

    reader.readAsDataURL(fileUpload.files![0]);
  }

  onMount(async () => {
    let dat = await fetch('https://idapi-jye3bcyp.phazed.xyz/api/v1/profile', { credentials: 'include' });
    if(dat.status !== 200)return nav('/login');

    let json = await dat.json();
    if(json.endpoint)return nav(json.endpoint);

    username!.innerText = json.username;

    if([ "default" ].includes(json.avatar)){
      originalPfpUrl = 'https://cdn.phaz.uk/id/avatars/' + json.avatar + '.png';

      profilePic!.style.background = 'url(\'https://cdn.phaz.uk/id/avatars/' + json.avatar + '.png\')';
      profilePic!.style.animation = 'none';
    } else{
      originalPfpUrl = 'https://cdn.phaz.uk/id/avatars/' + json.id + '/' + json.avatar + '.png';

      profilePic!.style.background = 'url(\'https://cdn.phaz.uk/id/avatars/' + json.id + '/' + json.avatar + '.png\')';
      profilePic!.style.animation = 'none';
    }
  })

  return (
    <>
      <div class="app-container">
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

        <div style={{ "text-align": 'right', "margin-top": '-200px', "margin-bottom": '150px' }}>
          <div class="button" style={{ padding: '10px' }} onClick={() => nav('/settings')}><i class="fa-solid fa-gear"></i></div>
        </div>
      </div>
    </>
  )
}

export default Profile;