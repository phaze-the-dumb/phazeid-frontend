import { createSignal, onMount, ParentProps } from "solid-js";

let App = ( props: ParentProps ) => {
  let turnstile: HTMLElement;
  
  let [ errorText, setErrorText ] = createSignal("");
  window.setErrorText = setErrorText;

  onMount(() => {
    window.turnstile.render(turnstile!, { sitekey: '0x4AAAAAABDsYHmEqdJLrO8i', appearance: 'interaction-only' })
  });

  return (
    <>
      <div ref={( el ) => turnstile = el}></div>
      { props.children }
      <div class="error-text">{errorText()}</div>
    </>
  )
}

export default App
