import { Button, Dialog, DialogActions, DialogContent, DialogProps, SxProps, Theme } from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import DialogTitleEx from './DialogTitleEx';
import { MessageDialogContext, MessageDialogOptions, MessageDialogSettings } from './MessageDialogContext';

export type { MessageDialogSettings } from './MessageDialogContext';

const defaultMessageDialogSettings: Required<MessageDialogSettings> = {
    okText: 'OK',
    cancelText: 'Cancel',
    alertTitle: 'Alert',
    confirmTitle: 'Confirm',
    errorTitle: 'Error',
    closeButtonAriaLabel: 'Close dialog',
};

export interface MessageDialogProviderProps {
    children: ReactNode,
    settings?: MessageDialogSettings;
}

export const MessageDialogProvider = (props: MessageDialogProviderProps) => {
    const settings = useMemo<Required<MessageDialogSettings>>(() => ({
        ...defaultMessageDialogSettings,
        ...(props.settings ?? {})
    }), [props.settings]);
    const defaultSx = useMemo<SxProps<Theme>>(() => ({
        backgroundColor: theme => theme.palette.primary.main,
        color: '#fff'
    }), []);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [showCancelButton, setShowCancelButton] = useState<boolean>(false);
    const [sx, setSx] = useState<SxProps<Theme>>(defaultSx);
    const [title, setTitle] = useState<string>(settings.alertTitle);
    const [okText, setOkText] = useState<string>(settings.okText);
    const [cancelText, setCancelText] = useState<string>(settings.cancelText);
    const resolvePromiseRef = useRef<((result: boolean) => void) | null>(null);

    const resolvePendingPromise = useCallback((result: boolean): void => {
        const resolver = resolvePromiseRef.current;
        resolvePromiseRef.current = null;
        resolver?.(result);
    }, []);

    const handleClose = useCallback((result: boolean): void => {
        setOpen(false);
        resolvePendingPromise(result);
    }, [resolvePendingPromise]);

    const show = useCallback((message?: string): Promise<boolean> => {
        if (resolvePromiseRef.current) {
            resolvePendingPromise(false);
        }

        setMessage(message ?? '');
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            resolvePromiseRef.current = resolve;
        });
    }, [resolvePendingPromise]);

    const confirm = useCallback((message?: string, options?: MessageDialogOptions): Promise<boolean> => {
        setTitle(settings.confirmTitle);
        setOkText(options?.okText ?? settings.okText);
        setCancelText(options?.cancelText ?? settings.cancelText);
        setShowCancelButton(true);
        setSx(defaultSx);
        return show(message);
    }, [defaultSx, settings]);

    const alert = useCallback((message?: string): Promise<boolean> => {
        setTitle(settings.alertTitle);
        setOkText(settings.okText);
        setShowCancelButton(false);
        setSx(defaultSx);
        return show(message);
    }, [defaultSx, settings]);

    const error = useCallback((message?: string): Promise<boolean> => {
        setTitle(settings.errorTitle);
        setOkText(settings.okText);
        setShowCancelButton(false);
        setSx({
            backgroundColor: theme => theme.palette.error.main,
            color: '#fff'
        });
        return show(message);
    }, [settings]);

    const onClose: NonNullable<DialogProps['onClose']> = (_, reason): void => {
        if (reason === 'backdropClick') {
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
            if (resolvePromiseRef.current) {
                handleClose(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [handleClose]);

    useEffect(() => () => {
        if (resolvePromiseRef.current) {
            resolvePendingPromise(false);
        }
    }, [resolvePendingPromise]);

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
                        closeButtonAriaLabel={settings.closeButtonAriaLabel}
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
