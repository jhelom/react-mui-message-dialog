import { useMessageDialog } from '@jhelom/react-mui-message-dialog';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';

function App() {
    const messageDialog = useMessageDialog();
    const handleClickAlert = async () => {
        await messageDialog.alert('The quick brown fox jumps over the lazy dog');
    };

    const handleClickConfirm = async () => {
        const result = await messageDialog.confirm('The quick brown fox jumps over the lazy dog');
        if (result) {
            console.log('Confirmed');
        } else {
            console.log('Cancelled');
        }
    };

    const handleClickError = async () => {
        await messageDialog.error('The quick brown fox jumps over the lazy dog');
    };

    return <>
        <Typography variant="h5" sx={{mb: 4}}>
            React MUI Message Dialog
        </Typography>
        <Stack spacing={2} direction="row">
            <Button onClick={handleClickAlert} variant="contained">Alert</Button>
            <Button onClick={handleClickConfirm} variant="contained">Confirm</Button>
            <Button onClick={handleClickError} variant="contained">Error</Button>
        </Stack>
    </>;
}

export default App;
