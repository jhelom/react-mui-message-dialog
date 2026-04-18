import {DialogTitle, SxProps, Theme} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export type DialogTitleExProps = {
    title: string;
    onClose?: () => void;
    sx?: SxProps<Theme>;
    closeButtonAriaLabel?: string;
    titleHeight?: number | string;
};

export default function DialogTitleEx(props: DialogTitleExProps) {
    const handleClose = () => {
        props.onClose?.();
    };

    const sx = {
        backgroundColor: (theme: Theme) => theme.palette.primary.main,
        color: '#fff',
        position: 'relative',
        paddingRight: 7,
        height: props.titleHeight ?? 40,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        ...(props.sx || {}),
    } as SxProps<Theme>;

    return <DialogTitle data-testid="dialog-title" sx={sx}>
        {props.title}
        <IconButton aria-label={props.closeButtonAriaLabel ?? 'Close dialog'}
                    onClick={() => handleClose()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#fff',
                    }}>
            <CloseIcon/>
        </IconButton>
    </DialogTitle>;
}