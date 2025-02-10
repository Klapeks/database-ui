

export const easyPassEncoder = {
    encodeJSON(json: any, pass: string): string {
        return easyPassEncoder.encode(JSON.stringify(json), pass);
    },
    decodeJSON(base64: any, pass: string): any {
        return JSON.parse(easyPassEncoder.decode(base64, pass));
    },
    encode(original: string, pass: string): string {
        let choto = Array<number>(original.length);
        for (let i = 0; i < original.length; i++) {
            choto[i] = (original.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
        }
        return btoa(String.fromCharCode(...choto));
    },
    decode(base64: string, pass: string): string {
        base64 = atob(base64);
        let choto = Array<number>(base64.length);
        for (let i = 0; i < base64.length; i++) {
            choto[i] = (base64.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
        }
        return String.fromCharCode(...choto);
    },
};