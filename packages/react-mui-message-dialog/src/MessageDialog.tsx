import { Button, Dialog, DialogActions, DialogContent, SxProps, Theme } from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import DialogTitleEx from './DialogTitleEx';
import {
    MessageDialogAlertOptions,
    MessageDialogConfirmOptions,
    MessageDialogContext,
    MessageDialogErrorOptions,
} from './MessageDialogContext';

export interface MessageDialogSettings {
    okText?: string;
    cancelText?: string;
    alertTitle?: string;
    confirmTitle?: string;
    errorTitle?: string;
    closeOnBackdropClick?: boolean;
}

const resolveDialogOption = (optionValue: string | undefined, defaultValue: string): string => {
    return optionValue ?? defaultValue;
};

const defaultMessageDialogSettings = {
    okText: 'OK',
    cancelText: 'Cancel',
    alertTitle: 'Alert',
    confirmTitle: 'Confirm',
    errorTitle: 'Error',
    closeOnBackdropClick: false,
} as MessageDialogSettings;

export interface MessageDialogProviderProps {
    children: ReactNode,
    settings?: MessageDialogSettings;
}

export const MessageDialogProvider = (props: MessageDialogProviderProps) => {
    const settings: MessageDialogSettings = {
        ...defaultMessageDialogSettings,
        ...(props.settings || {})
    };
    const defaultSx = useMemo<SxProps<Theme>>(() => ({
        backgroundColor: theme => theme.palette.primary.main,
        color: '#fff'
    }), []);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [resolvePromise, setResolvePromise] = useState<((result: boolean) => void) | null>(null);
    const [showCancelButton, setShowCancelButton] = useState<boolean>(false);
    const [sx, setSx] = useState<SxProps<Theme>>(defaultSx);
    const [title, setTitle] = useState<string>(settings.alertTitle!);
    const [okText, setOkText] = useState<string>(settings.okText!);
    const [cancelText, setCancelText] = useState<string>(settings.cancelText!);
    const [closeOnBackdropClick, setCloseOnBackdropClick] = useState<boolean>(settings.closeOnBackdropClick!);

    const show = (message?: string): Promise<boolean> => {
        setMessage(message || '');
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const confirm = useCallback((message?: string, options?: MessageDialogConfirmOptions): Promise<boolean> => {
        setTitle(resolveDialogOption(options?.title, settings.confirmTitle!));
        setOkText(resolveDialogOption(options?.okText, settings.okText!));
        setCancelText(resolveDialogOption(options?.cancelText, settings.cancelText!));
        setCloseOnBackdropClick(options?.closeOnBackdropClick ?? settings.closeOnBackdropClick!);
        setShowCancelButton(true);
        setSx(defaultSx);
        return show(message);
    }, [defaultSx, settings]);

    const alert = useCallback((message?: string, options?: MessageDialogAlertOptions): Promise<boolean> => {
        setTitle(resolveDialogOption(options?.title, settings.alertTitle!));
        setOkText(resolveDialogOption(options?.okText, settings.okText!));
        setCancelText(settings.cancelText!);
        setCloseOnBackdropClick(options?.closeOnBackdropClick ?? settings.closeOnBackdropClick!);
        setShowCancelButton(false);
        setSx(defaultSx);
        return show(message);
    }, [defaultSx, settings]);

    const error = useCallback((message?: string, options?: MessageDialogErrorOptions): Promise<boolean> => {
        setTitle(resolveDialogOption(options?.title, settings.errorTitle!));
        setOkText(resolveDialogOption(options?.okText, settings.okText!));
        setCancelText(settings.cancelText!);
        setCloseOnBackdropClick(options?.closeOnBackdropClick ?? settings.closeOnBackdropClick!);
        setShowCancelButton(false);
        setSx({
            backgroundColor: theme => theme.palette.error.main,
            color: '#fff'
        });
        return show(message);
    }, [settings]);

    const handleClose = (result: boolean): void => {
        setOpen(false);
        const resolver = resolvePromise;
        setResolvePromise(null);
        resolver?.(result);
    };

    const onClose = (_: object, reason: string): void => {
        if (reason === 'backdropClick' && !closeOnBackdropClick) {
            return;
        }
        handleClose(false);
    };

    const dialog = useMemo(() => ({
        error,
        alert,
        confirm,
    }), [error, alert, confirm]);

    useEffect(() => {
        const handlePopState = (_: PopStateEvent) => {
            if (open) {
                setOpen(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [open]);

    return (
        <>
            <MessageDialogContext.Provider value={dialog}>
                {props.children}
                <Dialog
                    data-testid="message-dialog"
                    open={open}
                    onClose={onClose}
                >
                    <DialogTitleEx
                        title={title}
                        onClose={() => handleClose(false)}
                        sx={sx}
                    />
                    <DialogContent
                        dividers
                        sx={{
                            whiteSpace: 'pre-line'
                        }}>
                        {message}
                    </DialogContent>
                    <DialogActions
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingLeft: 3,
                            paddingRight: 3
                        }}>
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: showCancelButton ? 'flex-start' : 'center'
                        }}>
                            <Button
                                data-testid="message-dialog-ok-button"
                                onClick={() => handleClose(true)}
                                sx={sx}
                                autoFocus={true}
                            >{okText}</Button>
                        </div>
                        {showCancelButton && (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}>
                                <Button
                                    data-testid="message-dialog-cancel-button"
                                    onClick={() => handleClose(false)}
                                    variant="outlined"
                                >{cancelText}</Button>
                            </div>
                        )}
                    </DialogActions>
                </Dialog>
            </MessageDialogContext.Provider>
        </>
    );
};
