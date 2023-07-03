import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react'
import { db } from "../Firebase/FirebaseConfig"
import { uid } from "uid"
import { ref, set } from 'firebase/database'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCardIcon from '@mui/icons-material/AddCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';

export default function FormDialog(props) {

    const [name, setname] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [Refered, setRefered] = useState("")
    const [Uuuid, setUuuid] = useState("")

    const handleStoredata = () => {

        const uuid = uid()
        set(ref(db, `Mains/AllLoans/${props.clientID}/${uuid}`), {
            Name: name,
            StartDate: StartDate,
            Refered: Refered,
            uuid: uuid,
            SerialNumber: { SlNo: 1 }
        });
        setname("")
        setStartDate("")
        setRefered("")
        setOpen(false)
        toast.success("Loan Added Successfully", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })

    }

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setname("")
        setStartDate("")
        setRefered("")
    }

    return (
        <div>

            <Button variant="contained" sx={{ paddingX: "10px", borderRadius: "20px", backgroundColor: "#f97316", ":hover": { backgroundColor: "#fb923c" } }} onClick={handleClickOpen}>
                <div className='flex justify-center items-center gap-2'><AddCardIcon /> add new loan</div>
            </Button>

            <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>

                <p className='mx-auto mt-3 text-[20px]'>Add Loan Data</p>

                <ToastContainer />

                <DialogContent>
                    <div className='flex flex-col gap-3 mx-auto'>
                        <span><span className='text-red-500'>*</span> LoanName:</span><input value={name} className='lg:w-[450px] rounded-md' onChange={(e) => { setname(e.target.value) }} type="text" />
                        <span><span className='text-red-500'>*</span> Start Date:</span><input value={StartDate} className='lg:w-[450px] rounded-md' onChange={(e) => { setStartDate(e.target.value) }} type="date" />
                        <span><span className='text-red-500'>*</span> Refered By:</span><input value={Refered} className='lg:w-[450px] rounded-md' onChange={(e) => { setRefered(e.target.value) }} type="text" />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} type="submit" className='w-full' sx={{ backgroundColor: "red", color: "white", ":hover": { backgroundColor: '#dc2626' } }}>Cancel</Button>
                    {
                        (name == "" || StartDate == "" || Refered == "") ?
                            <Button disabled type="submit" sx={{ backgroundColor: "#e5e5e5", color: "white" }} className='w-full'>Submit</Button>
                            :
                            <Button onClick={handleStoredata} sx={{ backgroundColor: "#0ea5e9", color: "white", ":hover": { backgroundColor: '#38bdf8' } }} type="submit" className='w-full'>Submit</Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}