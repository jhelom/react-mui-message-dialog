import { act, cleanup, fireEvent, render, waitFor, within } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import React, { useEffect } from 'react';

import { MessageDialogProvider } from '../src/MessageDialog';
import { MessageDialogSettings, MessageDialogType, useMessageDialog } from '../src/MessageDialogContext';

type DialogRenderResult = {
    dialog: MessageDialogType;
    unmount: () => void;
};

type NamedTest = {
    name: string;
    run: () => Promise<void>;
};

const setupDom = () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
        url: 'http://localhost/'
    });
    const { window } = dom;

    Object.defineProperty(globalThis, 'window', {
        value: window,
        configurable: true,
        writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
        value: window.document,
        configurable: true,
        writable: true,
    });
    Object.defineProperty(globalThis, 'navigator', {
        value: window.navigator,
        configurable: true,
        writable: true,
    });

    const descriptors = Object.getOwnPropertyDescriptors(window);
    for (const [key, descriptor] of Object.entries(descriptors)) {
        if (!(key in globalThis)) {
            Object.defineProperty(globalThis, key, descriptor);
        }
    }

    globalThis.HTMLElement = window.HTMLElement;
    globalThis.DocumentFragment = window.DocumentFragment;
    globalThis.Node = window.Node;
    globalThis.Event = window.Event;
    globalThis.MouseEvent = window.MouseEvent;
    globalThis.PopStateEvent = window.PopStateEvent;
    globalThis.getComputedStyle = window.getComputedStyle.bind(window);
    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => window.setTimeout(callback, 0);
    globalThis.cancelAnimationFrame = (handle: number) => window.clearTimeout(handle);
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
};

const assert = (condition: unknown, message: string): asserts condition => {
    if (!condition) {
        throw new Error(message);
    }
};

const getQueries = () => within(document.body);

const DialogApiProbe = (props: { onReady: (dialog: MessageDialogType) => void }) => {
    const dialog = useMessageDialog();

    useEffect(() => {
        props.onReady(dialog);
    }, [dialog, props]);

    return null;
};

const renderMessageDialog = async (settings?: MessageDialogSettings): Promise<DialogRenderResult> => {
    let dialogApi: MessageDialogType | null = null;

    const view = render(
        <MessageDialogProvider settings={settings}>
            <DialogApiProbe onReady={(dialog) => {
                dialogApi = dialog;
            }} />
        </MessageDialogProvider>
    );

    await waitFor(() => {
        assert(dialogApi !== null, 'Message dialog API was not exposed.');
    });

    return {
        dialog: dialogApi!,
        unmount: view.unmount,
    };
};

const testPopStateResolvesFalse = async () => {
    const { dialog } = await renderMessageDialog();

    let promise!: Promise<boolean>;
    await act(async () => {
        promise = dialog.alert('History navigation');
    });

    await getQueries().findByText('History navigation');

    act(() => {
        window.dispatchEvent(new PopStateEvent('popstate'));
    });

    const result = await promise;
    assert(result === false, 'Expected popstate to resolve the pending promise with false.');

    await waitFor(() => {
        assert(getQueries().queryByText('History navigation') === null, 'Expected dialog to close after popstate.');
    });
};

const testReopenResolvesPreviousPromise = async () => {
    const { dialog } = await renderMessageDialog();

    let firstPromise!: Promise<boolean>;
    await act(async () => {
        firstPromise = dialog.alert('First message');
    });

    await getQueries().findByText('First message');

    let secondPromise!: Promise<boolean>;
    await act(async () => {
        secondPromise = dialog.confirm('Second message');
    });

    const firstResult = await firstPromise;
    assert(firstResult === false, 'Expected reopening the dialog to resolve the previous promise with false.');

    await getQueries().findByText('Second message');
    assert(getQueries().getByTestId('message-dialog-cancel-button') !== null, 'Expected confirm dialog to show a cancel button.');

    act(() => {
        fireEvent.click(getQueries().getByTestId('message-dialog-ok-button'));
    });

    const secondResult = await secondPromise;
    assert(secondResult === true, 'Expected OK button to resolve the active dialog promise with true.');
};

const testCloseButtonIsAccessible = async () => {
    const { dialog } = await renderMessageDialog({
        closeButtonAriaLabel: 'Close the message dialog'
    });

    let promise!: Promise<boolean>;
    await act(async () => {
        promise = dialog.error('Error message');
    });

    const closeButton = await getQueries().findByRole('button', { name: 'Close the message dialog' });
    assert(closeButton !== null, 'Expected close button to expose an accessible name.');

    act(() => {
        fireEvent.click(closeButton);
    });

    const result = await promise;
    assert(result === false, 'Expected close button to resolve the pending promise with false.');
};

const testUnmountResolvesPendingPromise = async () => {
    const { dialog, unmount } = await renderMessageDialog();

    let promise!: Promise<boolean>;
    await act(async () => {
        promise = dialog.alert('Unmount message');
    });

    await getQueries().findByText('Unmount message');

    act(() => {
        unmount();
    });

    const result = await promise;
    assert(result === false, 'Expected unmount to resolve the pending promise with false.');
};

const tests: NamedTest[] = [
    {
        name: 'popstate closes the dialog and resolves false',
        run: testPopStateResolvesFalse,
    },
    {
        name: 'reopening resolves the previous promise and keeps the latest one active',
        run: testReopenResolvesPreviousPromise,
    },
    {
        name: 'close button has an accessible name and resolves false',
        run: testCloseButtonIsAccessible,
    },
    {
        name: 'unmount resolves a pending promise',
        run: testUnmountResolvesPendingPromise,
    },
];

const main = async () => {
    setupDom();

    for (const test of tests) {
        cleanup();
        await test.run();
        console.log(`✓ ${test.name}`);
    }

    cleanup();
    console.log(`Verified ${tests.length} MessageDialog scenarios.`);
};

main().catch((error) => {
    console.error(error);
    cleanup();
    process.exit(1);
});

