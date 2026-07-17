import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [react(), dts()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.tsx'),
            name: 'UiLib1',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            external: (id) =>
                id === 'react' ||
                id.startsWith('react/') ||
                id === 'react-dom' ||
                id.startsWith('react-dom/') ||
                id === '@mui/material' ||
                id.startsWith('@mui/material/') ||
                id === '@mui/icons-material' ||
                id.startsWith('@mui/icons-material/'),
            output: {
                globals: {
                    react: 'React',
                    'react/jsx-runtime': 'react_jsx_runtime',
                    'react/jsx-dev-runtime': 'react_jsx_dev_runtime',
                    'react-dom': 'ReactDOM',
                    '@mui/material': 'MaterialUI',
                    '@mui/icons-material': 'MaterialIcons',
                    '@mui/material/IconButton': 'MaterialUIIconButton',
                    '@mui/icons-material/Close': 'MaterialUICloseIcon',
                },
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});
