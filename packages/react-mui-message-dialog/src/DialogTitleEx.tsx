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

    const baseTitleSx: SxProps<Theme> = {
        position: 'relative',
        pr: 6,
    };

    const titleSx: SxProps<Theme> = Array.isArray(sx)
        ? [baseTitleSx, ...sx]
        : [baseTitleSx, sx];

    return <>
        <DialogTitle data-testid="dialog-title" sx={titleSx}>
            {props.title}
            <IconButton onClick={handleClose}
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