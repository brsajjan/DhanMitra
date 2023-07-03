import React, { useEffect, useState } from 'react'
import Navbar from "../Navbar/Navbar"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onValue, ref } from 'firebase/database';
import { db } from "../Firebase/FirebaseConfig";
import { Button } from '@mui/material';

export default function Transactions() {

    useEffect(() => {
        DayWiseTransctions()
    }, [])

    const [DayWise, setDayWise] = useState([])
    console.log(DayWise)

    // fetch DayWise Transctions details-----------------------------------------------------------------------------------
    const DayWiseTransctions = () => {
        const count = ref(db, `Mains/Daywise Transactions/`);
        onValue(count, (snapshot) => {
            let retrive = [];
            snapshot.forEach(pst => {
                const key = pst.key
                const data = pst.val()
                const entries = Object.values(data);
                retrive.push({ "key": key, "data": entries })
            })
            setDayWise(retrive);
        })
    }

    // pdf download function 
    const downloadPDF = () => {
        var divContentsA = document.getElementById("PrintAdata").innerHTML;
        // var divContentsB = document.getElementById("PrintBdata").innerHTML;
        // var divContentsC = document.getElementById("PrintCdata").innerHTML;
        // var divContentsD = document.getElementById("PrintDdata").innerHTML;
        var printWindow = window.open('', '');
        printWindow.document.write(`<html><head>`);
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContentsA);
        // printWindow.document.write(`<b>------------------------------------------</b>`);
        // printWindow.document.write(divContentsB);
        // printWindow.document.write(`<b>------------------------------------------</b>`);
        // printWindow.document.write(divContentsC);
        // printWindow.document.write(`<b>------------------------------------------</b>`);
        // printWindow.document.write(divContentsD);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
    return (
        <>
            <div className='FontStyle h-screen bg-gradient-to-r from-[#7dd3fc] to-[#f0abfc]'>
                <Navbar />

                <ToastContainer />

                <div id='PrintAdata' className='h-[90%] lg:p-10 py-8 overflow-scroll scroll-smooth scrollbar-hide'>
                    <div className='flex justify-between items-center pr-5 pb-2'>
                        <p className='mx-5 font-bold lg:text-[30px] text-[20px]'>Transaction History</p>
                        <Button variant="contained" sx={{ backgroundColor: "red", padding: "4px", ":hover": { backgroundColor: "#e11d48" } }} onClick={downloadPDF}>
                            pdf
                        </Button>
                    </div>
                    <div className='h-[3px] mx-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />
                    
                    {
                        DayWise.map((obj) => (
                            <div>
                                <hr className='hidden'/>
                                <hr className='hidden'/>
                                <p className='mx-5 mt-5 text-[20px] text-left text-gray-800'>{obj.key}</p>
                                <hr className='mx-5' />
                                <hr className='hidden'/>

                                <div className='flex lg:flex-wrap lg:flex-row flex-col gap-7 lg:mx-5 mx-3 mt-5 text-[17px] lg:p-10 p-3 rounded-[18px] bg-[#ffffff62] shadow-xl'>
                                    {
                                        obj.data.map((evt) => (
                                            <div className='flex justify-between items-center rounded-lg shadow-lg bg-[white] p-3'>
                                                <div>
                                                    <p className='font-bold text-lg'>{evt.ClientName} {evt.ClientSurname}</p>
                                                    <div className='flex gap-2 text-sm text-gray-700'>
                                                        <p>{evt.PDate}</p>
                                                        <p>{evt.PTime}</p>
                                                    </div>
                                                    <p className='text-sm text-left'>{evt.Remark1}</p>
                                                </div>
                                                <div className='lg:pl-10 pl-4'>
                                                    <p className='text-[20px] font-bold text-right'>₹{evt.Amount}</p>
                                                    
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </>
    )
}
