export declare const easyPassEncoder: {
    decodeArray(array: string[], pass: string): any[];
    encodeArray(array: any[], pass: string): string[];
    encodeJSON(json: any, pass: string): string;
    decodeJSON(base64: string, pass: string): any;
    encode(original: string, pass: string): string;
    decode(base64: string, pass: string): string;
};
