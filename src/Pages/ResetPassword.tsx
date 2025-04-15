let ResetPassword = () => {
  let email: HTMLInputElement;

  let resetPassword = async () => {
    if(!email! || email!.value)return;

    
  }

  return (
    <>
      <div class="app-container" style={{ height: '310px' }}>
        <h1>Phaze ID</h1><br />
        <h3>Reset Password</h3><br />

        <div class="input">
          <input class="input-text" type="email" placeholder="Enter Email..." ref={email!}></input>
          <div class="input-underline"></div>
        </div><br /><br />

        <div class="button" onClick={resetPassword}>
          Reset Password
        </div>
      </div>
    </>
  )
}

export default ResetPassword;