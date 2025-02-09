import { AliasOptions, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mPath from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': mPath.resolve(__dirname, './src'),
        } as AliasOptions,
    },
})
