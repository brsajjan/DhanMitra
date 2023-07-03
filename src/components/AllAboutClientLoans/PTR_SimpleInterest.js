import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { ref, update } from 'firebase/database';
import { db } from "../Firebase/FirebaseConfig";
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setP("")
        setT("")
        setR("")
        setCI("0")
        setRemarks("")
        setWitness1("")
        setWitness2("")
        setcollateral("")
        setAfterCalculate(false)
    };


    // Calculating Compound Interest
    const [P, setP] = useState("")
    const [T, setT] = useState("")
    const [R, setR] = useState("")
    const [CI, setCI] = useState("0")
    const [AfterCalculate, setAfterCalculate] = useState(false)
    // let Rinteger = (parseInt(R)/12) + 1
    // console.log(Rinteger)

    const handleCompound = () => {
        if (P == "" || T == "" || R == "") {
            alert("Please fill all the fields")
        }
        else {
            let constant = P * (1 + (parseInt(R) / 1200)) ** (12 * (parseInt(T) / 12))
            // setCI( Math.round(constant) ) 
            setCI(constant)
            setAfterCalculate(true)
        }

    }

    // sending Compound interest data of Loans to database
    const [Remarks, setRemarks] = useState("")
    const [witness1, setWitness1] = useState("")
    const [witness2, setWitness2] = useState("")
    const [collateral, setcollateral] = useState("")

    const SendCompoundData = () => {
        let pin = prompt(`Enter the PIN to proceed`)
        if (pin === "1234") {
            update(ref(db, `Mains/AllLoans/${props.userID}/${props.details.data.uuid}/CompoundInterest`), {
                principle: P,
                time: T,
                rateOfInterest: R,
                compoundInterest: CI,
                collateral: collateral,
                witness1: witness1,
                witness2: witness2,
                remarks: Remarks
            });
            setOpen(false);
            setP("")
            setT("")
            setR("")
            setCI("")
            setRemarks("")
            setWitness1("")
            setWitness2("")
            toast.success("Data Sent Successfully", {
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
            alert("Enter the correct pin to proceed")
        }

    }

    return (
        <div>

            <Button variant="contained" sx={{ paddingX: "10px", borderRadius: "20px", backgroundColor: "#0ea5e9", ":hover": { backgroundColor: "#fb923c" } }} onClick={handleClickOpen}>
                <div className='flex justify-center items-center gap-1'><AddIcon /></div>
            </Button>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <div className='flex justify-between'>
                    <DialogTitle id="responsive-dialog-title">
                        {`Compound Interest`}
                    </DialogTitle>
                    <Button onClick={handleClose}><CloseIcon /></Button>
                </div>

                <DialogContent dividers>
                    <div className='lg:w-[400px] w-full' >
                        <div className='flex flex-col gap-3 text-[18px]'>
                            <div className='flex flex-col gap-2 pb-2 '>
                                <p><span className='text-red-500'>*</span> Principle (P) :</p>
                                <input type="number" className='rounded-md w-full' value={P} onChange={(e) => { setP(e.target.value) }} placeholder='Enter Principle Amount Here' />
                                <p><span className='text-red-500'>*</span> Time (T) :</p>
                                <input type="number" className='rounded-md w-full' value={T} onChange={(e) => { setT(e.target.value) }} placeholder='Enter Time in years' />
                                <p><span className='text-red-500'>*</span> Rate of interest (R) :</p>
                                <input type="number" className='rounded-md w-full' value={R} onChange={(e) => { setR(e.target.value) }} placeholder='@ per years' />
                            </div>

                            <div className='flex flex-col gap-4'>
                                <Button sx={{ marginX: "auto" }} variant="contained" onClick={handleCompound}>calculate</Button>
                                <p className='my-2 mx-auto'><b>Compound Interest :</b> {CI} ₹</p>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <p><span className='text-red-500'>*</span> Collateral :</p>
                                <input type="text" className='rounded-md w-full' value={collateral} onChange={(e) => { setcollateral(e.target.value) }} placeholder='Enter Collateral Link' />
                                <p><span className='text-red-500'>*</span> Witness 1 :</p>
                                <input type="text" className='rounded-md w-full' value={witness1} onChange={(e) => { setWitness1(e.target.value) }} placeholder='1st Witness Name' />
                                <p><span className='text-red-500'>*</span> Witness 2 :</p>
                                <input type="text" className='rounded-md w-full' value={witness2} onChange={(e) => { setWitness2(e.target.value) }} placeholder='2nd Witness Name' />
                                <p value={Remarks} onChange={(e) => { setRemarks(e.target.value) }} ><span className='text-red-500'>*</span> Remarks :</p>
                                <input type="text" className='rounded-md w-full' value={Remarks} onChange={(e) => { setRemarks(e.target.value) }} placeholder='Give remarks here' />
                            </div>
                            {
                                (AfterCalculate && witness1 !== "" && witness2 !== "" && Remarks !== "" && collateral !== "")
                                    ?
                                    <Button variant="contained" onClick={SendCompoundData}>Submit</Button>
                                    :
                                    <button className='bg-[#93c5fd] rounded-[3.5px] px-1 py-2 text-[15px] font-semibold text-white' disabled >SUBMIT</button>
                            }
                        </div>
                        <ToastContainer />
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}