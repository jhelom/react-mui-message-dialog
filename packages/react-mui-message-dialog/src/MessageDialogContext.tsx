import {createContext, useContext} from 'react';


export type MessageDialogType = {
    confirm: (message?: string, options?: MessageDialogOptions) => Promise<boolean>;
    alert: (message?: string) => Promise<boolean>;
    error: (message?: string) => Promise<boolean>;
}

export type MessageDialogOptions = {
    okText?: string;
    cancelText?: string;
}

export interface MessageDialogSettings {
    okText?: string;
    cancelText?: string;
    alertTitle?: string;
    confirmTitle?: string;
    errorTitle?: string;
    closeButtonAriaLabel?: string;
}


export const MessageDialogContext = createContext<MessageDialogType | null>(null);

export const useMessageDialog = () => {
    const context = useContext(MessageDialogContext);
    if (!context) {
        throw new Error('useMessageDialog must be used within a MessageDialogProvider');
    }
    return context;
};
