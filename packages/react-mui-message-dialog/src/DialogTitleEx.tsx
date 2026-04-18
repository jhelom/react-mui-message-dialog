import {DialogTitle, SxProps, Theme} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export type DialogTitleExProps = {
    title: string;
    onClose?: () => void;
    sx?: SxProps<Theme>;
};

export default function DialogTitleEx(props: DialogTitleExProps) {
    const handleClose = () => {
        props.onClose?.();
    };

    const sx = props.sx ||
        {
            backgroundColor: theme => theme.palette.primary.main,
            color: '#fff'
        };

    return <>
        <DialogTitle data-testid="dialog-title" sx={sx}>
            {props.title}
        </DialogTitle>
        <IconButton onClick={() => handleClose()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 12,
                        color: '#fff',
                    }}>
            <CloseIcon/>
        </IconButton>
    </>;
}