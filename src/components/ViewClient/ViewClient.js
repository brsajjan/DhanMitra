import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';

export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // pdf code -------------------------------------------------------------------------------------------------------->
    const downloadPDF = () => {
        var divContents = document.getElementById("printDiv").innerHTML;
        var printWindow = window.open('', '');
        printWindow.document.write(`<html><head><title>${props.Name} Details</title>`);
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    return (
        <div>
            <IconButton color="success" sx={{ backgroundColor: "#c6e8c3" }} onClick={handleClickOpen}>
                <VisibilityIcon />
            </IconButton>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    <div className='flex justify-between'>
                        <span className='font-bold'>{props.Name} Details</span>
                        <button onClick={() => downloadPDF()} className='bg-[red] text-white px-2 rounded-[5px] shadow-xl text-[15px] hover:bg-[#ff460e]'><DownloadIcon />PDF</button>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        <span className='p-5 mx-auto text-[25px]' id='printDiv'>
                            <p className='text-blue-700 bg-gray-200 mt-0 px-3 rounded-lg'><span className='font-bold text-black'>User ID: </span>{props.uuid.substring(0, 6)}</p>
                            <p className='text-blue-700 bg-gray-200 my-3 px-3 rounded-lg'><span className='font-bold text-black'>Name: </span>{props.Name}</p>
                            <p className='text-blue-700 bg-gray-200 my-3 px-3 rounded-lg'><span className='font-bold text-black'>Surname: </span>{props.Surname}</p>
                            <p className='text-blue-700 bg-gray-200 my-3 px-3 rounded-lg'><span className='font-bold text-black'>FatherName: </span>{props.FatherName}</p>
                            <p className='text-blue-700 bg-gray-200 my-3 px-3 rounded-lg'><span className='font-bold text-black'>phone: </span>{props.phone}</p>
                            <p className='text-blue-700 bg-gray-200 my-3 px-3 rounded-lg'><span className='font-bold text-black'>address: </span>{props.address}</p>
                            <p className='text-blue-700 bg-gray-200 my-3 mb-0 px-3 rounded-lg'><span className='font-bold text-black'>Id Proof Name: </span>{props.IdProofName}</p>
                            <p className='text-blue-700 bg-gray-200 my-3 mb-0 px-3 rounded-lg'><span className='font-bold text-black'>Id Proof No: </span>{props.IdProofNo}</p>
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" className='w-full' onClick={handleClose} autoFocus>
                        okay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
