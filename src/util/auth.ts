let str2ab = ( str: string ): ArrayBuffer => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

let encrypt = async ( str: string, key: CryptoKey ): Promise<string> => {
  let enc = new TextEncoder();
  let toSendData = enc.encode(str);

  let output = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, toSendData);
  return window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(output)]));
}

let decrypt = async ( str: ArrayBuffer, key: CryptoKey ): Promise<string> => {
  let output = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, key, str);
  return String.fromCharCode.apply(null, [...new Uint8Array(output)]);
}

export class PlainText{
  protected contents: string;

  constructor( contents: string ){
    this.contents = contents;
  }

  async toString( _key: CryptoKey ){
    return this.contents;
  }
}

export class Encryptable extends PlainText{
  constructor( contents: string ){
    super(contents);
  }

  async toString( key: CryptoKey ){
    return await encrypt(this.contents, key);
  }
}

export let tunnel = ( text: PlainText[], cb: ( res: string ) => void ) => {
  let key: CryptoKey;
  let keyPair: CryptoKeyPair;

  let allowClose = false;

  let turnstileRes = window.turnstile.getResponse();
  if(!turnstileRes)return;

  window.turnstile.reset();

  let ws = new WebSocket('wss://idapi-jye3bcyp.phazed.xyz/api/v1/auth/tunnel');
  ws.onopen = () => {
    window.setErrorText("");

    ws.send(turnstileRes!);
  }

  ws.onmessage = async ( dat ) => {
    ws.onmessage = async ( dat ) => {
      ws.onmessage = async ( dat ) => {
        let enc = await decrypt(str2ab(window.atob(dat.data)), keyPair.privateKey);
        allowClose = true;

        ws.close();
        cb(enc);
      }

      let enc = await decrypt(str2ab(window.atob(dat.data)), keyPair.privateKey);
      if(enc !== "OK")return ws.close();

      let str = '';

      for (let i = 0; i < text.length; i++)
        str += await text[i].toString(key);

      ws.send(str);
    }

    let binaryDer = str2ab(window.atob(dat.data));

    key = await window.crypto.subtle.importKey(
      "spki", 
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      [ "encrypt" ]
    );

    keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      [ "encrypt", "decrypt" ],
    );

    let genKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    let keyDat = window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(genKey)]));

    ws.send(keyDat);
  }

  ws.onerror = () => {
    if(!allowClose){
      console.error('Failed to authenticate.');
      window.setErrorText("Failed to authenticate, Please reload page to try again.");
    }
  }
}