import { useIsRouting } from "@solidjs/router";
import { createEffect, createSignal, onMount, ParentProps, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";

let App = ( props: ParentProps ) => {
  let [ errorText, setErrorText ] = createSignal("");
  window.setErrorText = setErrorText;

  let trigger = useIsRouting();

  let timeout: number;
  createEffect(() => {
    if(errorText() !== ""){
      window.clearTimeout(timeout);
      timeout = setTimeout(() => {
        setErrorText("");
      }, 5_000)
    }
  })

  onMount(() => {
    
  });

  return (
    <>
      <Presence exitBeforeEnter>
        <Show when={!trigger()}>
          <Motion
            initial={{ transform: "translateX(50px)", opacity: 0 }}
            animate={{ transform: "translateX(0%)", opacity: 1 }}
            exit={{ transform: "translateX(-50px)", opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            { props.children }
          </Motion>
        </Show>
      </Presence>

      <div class="error-text">{errorText()}</div>
    </>
  )
}

export default App
