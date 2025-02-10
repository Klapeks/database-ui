

export function assertNever(never: never): never {
    throw new Error("Never assered: " + JSON.stringify(never));
}

const utils = {
    assertNever,
    randomPassword(len?: number) {
        if (!len) len = 10 + (Math.random()*10)|0;
        const charset = "0123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let str = '';
        for (let i = 0; i < len; i++) {
            str += charset[(Math.random() * charset.length)|0];
        }
        return str;
    },
}

export default utils;