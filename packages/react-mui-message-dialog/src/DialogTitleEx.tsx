import {Box, DialogTitle, SxProps, Theme} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export type DialogTitleExProps = {
    title: string;
    onClose?: () => void;
    sx?: SxProps<Theme>;
};

export function DialogTitleEx(props: DialogTitleExProps) {
    const handleClose = () => {
        props.onClose?.();
    };

    const sx = props.sx ||
        {
            backgroundColor: theme => theme.palette.primary.main,
            color: '#fff'
        };

    return <>
        <DialogTitle data-testid="dialog-title" sx={{position: 'relative', ...sx}}>
            <Box sx={{
                position: 'absolute',
                left: "1em",
                top: '50%',
                transform: 'translateY(-50%)',
            }}>{props.title}</Box>
            <IconButton onClick={() => handleClose()}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#fff',
                        }}>
                <CloseIcon/>
            </IconButton>
        </DialogTitle>
    </>;
}

export default DialogTitleEx;
