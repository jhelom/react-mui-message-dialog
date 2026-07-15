import {createContext, useContext} from 'react';


export type MessageDialogType = {
    confirm: (message?: string, options?: MessageDialogConfirmOptions) => Promise<boolean>;
    alert: (message?: string, options?: MessageDialogAlertOptions) => Promise<boolean>;
    error: (message?: string, options?: MessageDialogErrorOptions) => Promise<boolean>;
}

type MessageDialogCommonOptions = {
    title?: string;
    okText?: string;
    closeOnBackdropClick?: boolean;
}

export type MessageDialogAlertOptions = MessageDialogCommonOptions;

export type MessageDialogErrorOptions = MessageDialogCommonOptions;

export type MessageDialogConfirmOptions = MessageDialogCommonOptions & {
    cancelText?: string;
}

export type MessageDialogOptions = MessageDialogConfirmOptions;



export const MessageDialogContext = createContext<MessageDialogType | null>(null);

export const useMessageDialog = () => {
    const context = useContext(MessageDialogContext);
    if (!context) {
        throw new Error('useMessageDialog must be used within a MessageDialogProvider');
    }
    return context;
};
