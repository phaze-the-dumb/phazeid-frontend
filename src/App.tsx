import { createSignal, onMount, ParentProps } from "solid-js";

let App = ( props: ParentProps ) => {  
  let [ errorText, setErrorText ] = createSignal("");
  window.setErrorText = setErrorText;

  onMount(() => {
    
  });

  return (
    <>
      { props.children }
      <div class="error-text">{errorText()}</div>
    </>
  )
}

export default App
