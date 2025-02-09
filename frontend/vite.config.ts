// import { fileURLToPath, URL } from 'node:url';

import { defineConfig, ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import mPath from 'path';


let targetServer = 'http://127.0.0.1:5995';

const devProxy = {} as { [key: string]: ProxyOptions };
function createDevProxy(api: string, target: string) {
    devProxy[api] = { target, secure: false, ws: true, changeOrigin: true };
}
createDevProxy("^/api", targetServer);


// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': mPath.resolve(__dirname, './src')
        },
    },
    server: {
        proxy: devProxy
    },
    build: {
        rollupOptions: {
            output:{
                // inlineDynamicImports: true,
                manualChunks(id) {
                    // console.log("MANUAL CHUNKS ID:", id);
                    if (id.includes('/pages/')) return 'pages';
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    }
})
