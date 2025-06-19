import * as React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {MessageDialogProvider} from '@jhelom/react-message-dialog';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MessageDialogProvider>
            <App/>
        </MessageDialogProvider>
    </React.StrictMode>
);
