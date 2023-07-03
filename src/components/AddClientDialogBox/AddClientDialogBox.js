import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react'
import { db } from "../Firebase/FirebaseConfig"
import { uid } from "uid"
import { ref, set, update } from 'firebase/database'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';

export default function ResponsiveDialog(props) {

    const [name, setname] = useState(props.AfterFetch ? props.details.data.Name : "")
    const [Surname, setSurname] = useState(props.AfterFetch ? props.details.data.Surname : "")
    const [FatherName, setFatherName] = useState(props.AfterFetch ? props.details.data.FatherName : "")
    const [phone, setphone] = useState(props.AfterFetch ? props.details.data.phone : "")
    const [address, setaddress] = useState(props.AfterFetch ? props.details.data.address : "")
    const [Uuuid, setUuuid] = useState(props.AfterFetch && props.details.data.uuid)
    const [IdSelectName, setIdSelectName] = useState(props.AfterFetch ? props.details.data.IdProofName : "")
    const [IdProofNo, setIdProofNo] = useState(props.AfterFetch ? props.details.data.IdProofNumber : "")

    // store data
    const handleStoredata = () => {

        const uuid = uid()
        set(ref(db, `Mains/AllClients/${uuid}`), {
            Name: name,
            Surname: Surname,
            FatherName: FatherName,
            phone: phone,
            address: address,
            IdProofName: IdSelectName,
            IdProofNumber: IdProofNo,
            uuid: uuid
        });
        setname("")
        setSurname("")
        setFatherName("")
        setphone("")
        setaddress("")
        setIdSelectName("")
        setIdProofNo("")
        setOpen(false)
        toast.success("Client Added Successfully", {
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
        setSurname("")
        setFatherName("")
        setphone("")
        setaddress("")
        setIdSelectName("")
        setIdProofNo("")
    }

    const handleCloseEdit = () => {
        setOpen(false);
    }

    // Update data
    const handleUpdatedata = () => {
        let pin = prompt("Enter the Pin to Update")
        if (pin === "1234") {
            update(ref(db, `Mains/AllClients/${props.details.data.uuid}`), {
                Name: name,
                Surname: Surname,
                FatherName: FatherName,
                phone: phone,
                address: address,
                IdProofName: IdSelectName,
                IdProofNumber: IdProofNo,
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
            {
                props.AfterFetch ?
                    <IconButton aria-label="delete" sx={{ backgroundColor: "lightblue", color: "blue" }} onClick={handleClickOpen}>
                        <EditIcon />
                    </IconButton>
                    :
                    <Button variant="contained" sx={{paddingX:"10px",borderRadius:"20px",backgroundColor: "#f97316",":hover": { backgroundColor: "#fb923c"}}} onClick={handleClickOpen}>
                        <div className='flex justify-center items-center gap-1'><PersonIcon /> {props.btnName}</div>
                    </Button>
            }
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={props.AfterFetch ? handleCloseEdit : handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col gap-3 mx-auto'>
                        <span><span className='text-red-500'>*</span> Name:</span><input value={name} className='lg:w-[450px] rounded-md' onChange={(e) => { setname(e.target.value) }} type="text" />
                        <span><span className='text-red-500'>*</span> Surname:</span><input value={Surname} className='lg:w-[450px] rounded-md' onChange={(e) => { setSurname(e.target.value) }} type="text" />
                        <span><span className='text-red-500'>*</span> Fathers name:</span><input value={FatherName} className='lg:w-[450px] rounded-md' onChange={(e) => { setFatherName(e.target.value) }} type="text" />
                        <span><span className='text-red-500'>*</span> Phone No:</span><input value={phone} className='lg:w-[450px] rounded-md' onChange={(e) => { setphone(e.target.value) }} type="number" />
                        <span><span className='text-red-500'>*</span> Address:</span><input value={address} className='lg:w-[450px] rounded-md' onChange={(e) => { setaddress(e.target.value) }} type="text" />
                        <span>
                            <span className='text-red-500'>*</span> Identity Proof:
                        </span>
                        <select onChange={(e) => {
                            const selectedFood = e.target.value;
                            setIdSelectName(selectedFood)
                        }}
                            className='lg:w-[450px] rounded-md p-2'
                        >
                            <option value="">Select Id Proof</option>
                            <option value="Aadhar Card">Aadhar Card</option>
                            <option value="Pan Card">Pan Card</option>
                        </select>
                        {
                            (IdSelectName == "Aadhar Card" || IdSelectName == "Pan Card")
                                ?
                                <><span><span className='text-red-500'>*</span> Enter {IdSelectName} No:</span><input type="text" className='lg:w-[450px] rounded-md' value={IdProofNo} onChange={(e) => { setIdProofNo(e.target.value) }} /></>
                                :
                                ""
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.AfterFetch ? handleCloseEdit : handleClose} sx={{ backgroundColor: "red", color: "white", ":hover": { backgroundColor: '#dc2626' } }} className='w-full'>Cancel</Button>
                    {
                        props.AfterFetch ?
                            (
                                (name == "" || Surname == "" || FatherName == "" || phone == "" || address == "" || IdProofNo == "") ?
                                    <Button disabled type="submit" className=' w-full' sx={{ backgroundColor: "#e5e5e5", color: "white" }}>Update</Button>
                                    :
                                    <Button onClick={handleUpdatedata} type="submit" className='w-full' sx={{ backgroundColor: "#0ea5e9", color: "white", ":hover": { backgroundColor: '#38bdf8' } }}>Update</Button>
                            )
                            :
                            (
                                (name == "" || Surname == "" || FatherName == "" || phone == "" || address == "" || IdProofNo == "") ?
                                    <Button disabled type="submit" className='w-full' sx={{ backgroundColor: "#e5e5e5", color: "white" }}>Submit</Button>
                                    :
                                    <Button onClick={handleStoredata} type="submit" sx={{ backgroundColor: "#0ea5e9", color: "white", ":hover": { backgroundColor: '#38bdf8' } }} className='w-full'>Submit</Button>
                            )
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}