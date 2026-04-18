import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [react(), dts()],
    test: {
        environment: 'jsdom',
        globals: true,
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.tsx'),
            name: 'UiLib1',
            fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@mui/material'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@mui/material': 'MaterialUI',
                },
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});
