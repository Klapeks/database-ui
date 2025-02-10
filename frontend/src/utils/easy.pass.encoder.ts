

export const easyPassEncoder = {
    encodeJSON(json: any, pass: string): string {
        return easyPassEncoder.encode(JSON.stringify(json), pass);
    },
    decodeJSON(base64: string, pass: string): any {
        return JSON.parse(easyPassEncoder.decode(base64, pass));
    },
    encode(original: string, pass: string): string {
        let codeUnits: Uint16Array | Uint8Array = new Uint16Array(original.length);
        for (let i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = original.charCodeAt(i);
        }
        codeUnits = new Uint8Array(codeUnits.buffer);

        let str = '';
        let choto = 0;
        for (let i = 0; i < codeUnits.length; i++) {
            choto = (codeUnits[i] ^ pass.charCodeAt(i % pass.length)) & 0xff;
            str += String.fromCharCode(choto);
        }
        return btoa(str);
    },
    decode(base64: string, pass: string): string {
        base64 = atob(base64);

        let codeUnits: Uint16Array | Uint8Array = new Uint8Array(base64.length);
        for (let i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = (base64.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xFF;
        }
        codeUnits = new Uint16Array(codeUnits.buffer);

        let str = '';
        for (let i = 0; i < codeUnits.length; i++) {
            str += String.fromCharCode(codeUnits[i]);
        }
        return str;
    },
};