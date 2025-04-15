import { onMount } from 'solid-js';

class CodeInputProps{
  onChange!: ( value: string ) => void
}

let CodeInput = ( props: CodeInputProps ) => {
  let inputs: HTMLInputElement[] = [];

  onMount(() => {
    let lastKeyevent: KeyboardEvent;
    let lastSubmit = 0;

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];

      input.onkeydown = ( e ) => {
        lastKeyevent = e;

        if(lastKeyevent.key === "Backspace" && input.value === ''){
          if(!inputs[i - 1])return;
          inputs[i - 1].select();
        }
      }

      input.oninput = () => {
        if(input.value.length > 1){
          let val = input.value;
          for (let j = 0; j < val.length; j++) {
            if(inputs[j + i])
              inputs[j + i].value = val[j];

            if(inputs[j + i + 1])
              inputs[j + i + 1].select();
            else if(lastSubmit + 500 < Date.now()){
              props.onChange(inputs.map(x => x.value).join(''));
              lastSubmit = Date.now();
            }
          }
        } else{
          if(inputs[i + 1] && lastKeyevent.key.length === 1 && lastKeyevent.key !== "Backspace")
            inputs[i + 1].select();
          else if(i === 5 && input.value !== ''){ 
            if(lastSubmit + 500 < Date.now()){
              props.onChange(inputs.map(x => x.value).join(''));
              lastSubmit = Date.now();
            }
          }
        }
      }
    }
  })

  return (
    <div>
      <input type="text" class="input-code" ref={( el ) => inputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => inputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => inputs.push(el)} />
      <span style={{ margin: '2px' }}> </span>
      <input type="text" class="input-code" ref={( el ) => inputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => inputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => inputs.push(el)} />
    </div>
  )
}

export default CodeInput;