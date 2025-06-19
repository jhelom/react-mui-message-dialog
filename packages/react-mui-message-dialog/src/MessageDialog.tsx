import {Button, Dialog, DialogActions, DialogContent, SxProps, Theme} from '@mui/material';
import {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';

import {MessageDialogContext, MessageDialogOptions} from './MessageDialogContext';
import DialogTitleEx from './DialogTitleEx';

const MessageDialogResource = {
    okText: 'OK',
    cancelText: 'Cancel',
    defaultTitle: 'Alert',
    errorTitle: 'Error',
};

export const MessageDialogProvider = (
    props: {
        children: ReactNode,
    }
) => {
    const defaultSx = useMemo<SxProps<Theme>>(() => ({
        backgroundColor: theme => theme.palette.primary.main,
        color: '#fff'
    }), []);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [resolvePromise, setResolvePromise] = useState<((result: boolean) => void) | null>(null);
    const [showCancelButton, setShowCancelButton] = useState<boolean>(false);
    const [sx, setSx] = useState<SxProps<Theme>>(defaultSx);
    const [title, setTitle] = useState<string>(MessageDialogResource.defaultTitle);
    const [okText, setOkText] = useState<string>(MessageDialogResource.okText);
    const [cancelText, setCancelText] = useState<string>(MessageDialogResource.cancelText);

    const show = (message?: string): Promise<boolean> => {
        setMessage(message || '');
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const confirm = useCallback((message?: string, options?: MessageDialogOptions): Promise<boolean> => {
        setTitle(MessageDialogResource.defaultTitle);

        if (options?.okText) {
            setOkText(options.okText);
        }

        if (options?.cancelText) {
            setCancelText(options.cancelText);
        }

        setShowCancelButton(true);
        setSx(defaultSx);
        return show(message);
    }, [defaultSx]);

    const alert = useCallback((message?: string): Promise<boolean> => {
        setTitle(MessageDialogResource.defaultTitle);
        setShowCancelButton(false);
        setSx(defaultSx);
        return show(message);
    }, [defaultSx]);

    const error = useCallback((message?: string): Promise<boolean> => {
        setTitle(MessageDialogResource.errorTitle);
        setShowCancelButton(false);
        setSx({
            backgroundColor: theme => theme.palette.error.main,
            color: '#fff'
        });
        return show(message);
    }, []);

    const handleClose = (result: boolean): void => {
        setOpen(false);
        const resolver = resolvePromise;
        setResolvePromise(null);
        resolver?.(result);
    };

    const onClose = (_: object, reason: string): void => {
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
