/// <reference types="vitest" />

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';

import { MessageDialogProvider } from './MessageDialog';
import { MessageDialogSettings, MessageDialogType, useMessageDialog } from './MessageDialogContext';

const DialogApiProbe = (props: { onReady: (dialog: MessageDialogType) => void }) => {
    const dialog = useMessageDialog();

    useEffect(() => {
        props.onReady(dialog);
    }, [dialog, props]);

    return null;
};

const renderMessageDialog = async (settings?: MessageDialogSettings): Promise<MessageDialogType> => {
    let dialogApi: MessageDialogType | null = null;

    render(
        <MessageDialogProvider settings={settings}>
            <DialogApiProbe onReady={(dialog) => {
                dialogApi = dialog;
            }} />
        </MessageDialogProvider>
    );

    await waitFor(() => {
        expect(dialogApi).not.toBeNull();
    });

    return dialogApi!;
};

describe('MessageDialogProvider', () => {
    it('resolves false and closes the dialog on popstate', async () => {
        const dialog = await renderMessageDialog();

        let promise!: Promise<boolean>;
        await act(async () => {
            promise = dialog.alert('History navigation');
        });

        expect(await screen.findByText('History navigation')).toBeTruthy();

        act(() => {
            window.dispatchEvent(new PopStateEvent('popstate'));
        });

        await expect(promise).resolves.toBe(false);
        await waitFor(() => {
            expect(screen.queryByText('History navigation')).toBeNull();
        });
    });

    it('resolves the previous promise with false when reopened before closing', async () => {
        const dialog = await renderMessageDialog();

        let firstPromise!: Promise<boolean>;
        await act(async () => {
            firstPromise = dialog.alert('First message');
        });

        expect(await screen.findByText('First message')).toBeTruthy();

        let secondPromise!: Promise<boolean>;
        await act(async () => {
            secondPromise = dialog.confirm('Second message');
        });

        await expect(firstPromise).resolves.toBe(false);
        expect(await screen.findByText('Second message')).toBeTruthy();
        expect(screen.getByTestId('message-dialog-cancel-button')).toBeTruthy();

        act(() => {
            fireEvent.click(screen.getByTestId('message-dialog-ok-button'));
        });

        await expect(secondPromise).resolves.toBe(true);
    });

    it('exposes an accessible close button that resolves false', async () => {
        const dialog = await renderMessageDialog({
            closeButtonAriaLabel: 'Close the message dialog'
        });

        let promise!: Promise<boolean>;
        await act(async () => {
            promise = dialog.error('Error message');
        });

        const closeButton = await screen.findByRole('button', { name: 'Close the message dialog' });

        act(() => {
            fireEvent.click(closeButton);
        });

        await expect(promise).resolves.toBe(false);
    });
});

