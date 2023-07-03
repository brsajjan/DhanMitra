import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react'
import { db } from "../Firebase/FirebaseConfig"
import { uid } from "uid"
import { ref, update } from 'firebase/database'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';

export default function FormDialog(props) {

    const [name, setname] = useState(`${props.details.data.Name}`)
    const [StartDate, setStartDate] = useState(`${props.details.data.StartDate}`)
    const [Refered, setRefered] = useState(`${props.details.data.Refered}`)
    const [Uuuid, setUuuid] = useState(props.details.data.uuid)

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setname(props.details.data.Name)
        setStartDate(props.details.data.StartDate)
        setRefered(props.details.data.Refered)
    }

    const handleUpdatedata = () => {
        let pin = prompt("Enter the Pin to Update")
        if (pin === "1234") {
            update(ref(db, `Mains/AllLoans/${props.userID}/${props.details.data.uuid}/`), {
                Name: name,
                StartDate: StartDate,
                Refered: Refered,
                uuid: Uuuid
            });
            setOpen(false);
            toast.success("Data Updated Successfully", {
                position: "top-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        }
        else {
            alert("Please enter the correct pin to Update")
        }
    }

    return (
        <div>

            <IconButton sx={{ backgroundColor: "lightblue", color: "blue" }} onClick={handleClickOpen}>
                <EditIcon />
            </IconButton>

            <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
                <p className='mx-auto mt-3 text-[20px]'>Edit Loan Data</p>

                <ToastContainer />

                <DialogContent>
                    <div className='flex flex-col gap-3 mx-auto'>
                        <span><span className='text-red-500'>*</span> LoanName:</span><input value={name} className='lg:w-[450px] rounded-md' onChange={(e) => { setname(e.target.value) }} type="text" />
                        <span><span className='text-red-500'>*</span> StartDate:</span><input value={StartDate} className='lg:w-[450px] rounded-md' onChange={(e) => { setStartDate(e.target.value) }} type="date" />
                        <span><span className='text-red-500'>*</span> Refered By:</span><input value={Refered} className='lg:w-[450px] rounded-md' onChange={(e) => { setRefered(e.target.value) }} type="text" />
                        
                    </div>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} type="submit" className='w-full' sx={{ backgroundColor: "red", color: "white", ":hover": { backgroundColor: '#dc2626' } }}>Cancel</Button>
                    {
                        (name == "") ?
                            <Button disabled onClick={handleUpdatedata} sx={{ backgroundColor: "#e5e5e5", color: "white" }} type="submit" className='w-full'>Update</Button>
                            :
                            <Button onClick={handleUpdatedata} sx={{ backgroundColor: "#0ea5e9", color: "white", ":hover": { backgroundColor: '#38bdf8' } }} type="submit" className='w-full'>Update</Button>
                    }
                </DialogActions>
            </Dialog>

        </div>
    );
}