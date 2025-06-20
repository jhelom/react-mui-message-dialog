import { MessageDialogProvider, MessageDialogSettings } from '@jhelom/react-mui-message-dialog';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// messageDialogSettings: You can specify language resources for dialog texts here.
// For example, to localize button labels and titles, set each property to the desired language string.
const messageDialogSettings = {
    okText: 'OK', 
    cancelText: 'Cancel',
    alertTitle: 'Alert',
    confirmTitle: 'Confirm',
    errorTitle: 'Error',
} as MessageDialogSettings;

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MessageDialogProvider settings={messageDialogSettings}>
            <App/>
        </MessageDialogProvider>
    </React.StrictMode>
);

