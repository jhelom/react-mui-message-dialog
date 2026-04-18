import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@jhelom/react-mui-message-dialog': path.resolve(__dirname, '../../packages/react-mui-message-dialog/src/index.tsx'),
        },
    },
});

