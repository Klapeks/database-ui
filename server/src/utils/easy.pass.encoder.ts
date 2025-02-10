

export const easyPassEncoder = {
    encodeJSON(json: any, pass: string): string {
        return easyPassEncoder.encode(JSON.stringify(json), pass);
    },
    decodeJSON(base64: string, pass: string): any {
        return JSON.parse(easyPassEncoder.decode(base64, pass));
    },
    encode(original: string, pass: string): string {
        let str = '';
        let choto = 0;
        for (let i = 0; i < original.length; i++) {
            choto = (original.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
            str += String.fromCharCode(choto);
        }
        return btoa(str);
    },
    decode(base64: string, pass: string): string {
        base64 = atob(base64);
        let str = '';
        let choto = 0;
        for (let i = 0; i < base64.length; i++) {
            choto = (base64.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
            str += String.fromCharCode(choto);
        }
        return str;
    },
};