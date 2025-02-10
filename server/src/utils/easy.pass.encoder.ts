

export const easyPassEncoder = {
    decodeArray(array: string[], pass: string): any[] {
        let newArr = Array<string>(array.length);
        for (let i = 0; i < array.length; i++) {
            newArr[i] = easyPassEncoder.decodeJSON(array[i], pass);
        }
        return newArr;
    },
    encodeArray(array: any[], pass: string): string[] {
        let newArr = Array<string>(array.length);
        for (let i = 0; i < array.length; i++) {
            newArr[i] = easyPassEncoder.encodeJSON(array[i], pass);
        }
        return newArr;
    },


    encodeJSON(json: any, pass: string): string {
        return easyPassEncoder.encode(JSON.stringify(json), pass);
    },
    decodeJSON(base64: string, pass: string): any {
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