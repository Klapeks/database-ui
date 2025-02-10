export declare const easyPassEncoder: {
    encodeJSON(json: any, pass: string): string;
    decodeJSON(base64: string, pass: string): any;
    encode(original: string, pass: string): string;
    decode(base64: string, pass: string): string;
};
