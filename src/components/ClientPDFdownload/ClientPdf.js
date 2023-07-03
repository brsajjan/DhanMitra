import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { onValue, ref } from 'firebase/database';
import { useState } from 'react';
import { useEffect } from 'react';
import { db } from "../Firebase/FirebaseConfig";
import DhanLogo from "../../Src_Images/dhanmitra_LOGO.png"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    // basic functions-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=->
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // important funtions -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=->
    const [Userloan, setUserloan] = useState([])
    const [UserClient, setUserClient] = useState([])
    const [InstallmentData, setInstallmentData] = useState([])
    const [SerialNumber, setSerialNumber] = useState(0)
    // console.log()

    useEffect(() => {
        fetchLoanData();
        fetchInstallmentData();
        fetchSerialNumberData();
        fetchUserData()
    }, [])

    // fetch loan details-----------------------------------------------------------------------------------
    const fetchLoanData = () => {
        const count = ref(db, `Mains/AllLoans/${props.locateUID}`);
        onValue(count, (snapshot) => {
            let retrive = [];
            snapshot.forEach(pst => {
                const key = pst.key
                const data = pst.val()
                retrive.push({ "key": key, "data": data })
            })
            setUserloan(retrive);
        })
    }

    // Fetch Installment Details-----------------------------------------------------------------------------
    const fetchInstallmentData = () => {
        const count = ref(db, `Mains/AllLoans/${props.locateUID}/${props.locateID}/Installments`);
        onValue(count, (snapshot) => {
            let retrive1 = [];
            snapshot.forEach(pst => {
                const key = pst.key
                const data = pst.val()
                retrive1.push({ "key": key, "data": data })
            })
            setInstallmentData(retrive1);
        })
    }

    // Fetch Serial Number Details----------------------------------------------------------------------------
    const fetchSerialNumberData = () => {
        const count = ref(db, `Mains/AllLoans/${props.locateUID}/${props.locateID}/SerialNumber/`);
        onValue(count, (snapshot) => {
            let retrive2 = [];
            snapshot.forEach(pst => {
                const key = pst.key
                const data = pst.val()
                retrive2.push({ "key": key, "data": data })
            })
            setSerialNumber(retrive2[0].data);
        })
    }

    // fetch User details-----------------------------------------------------------------------------------
    const [ClientTransactionName, setClientTransactionName] = useState("")
    const [ClientTransactionSurname, setClientTransactionSurname] = useState("")
    const fetchUserData = () => {
        const count = ref(db, `Mains/AllClients/${props.locateUID}`);
        onValue(count, (snapshot) => {
            let retrive2 = [];
            snapshot.forEach(pst => {
                const key = pst.key
                const data = pst.val()
                retrive2.push({ "key": key, "data": data })
            })
            setUserClient(retrive2);
            retrive2.map((event, i) => (
                event.key == "Name" && setClientTransactionName(event.data)
            ))
            retrive2.map((event, i) => (
                event.key == "Surname" && setClientTransactionSurname(event.data)
            ))
        })
    }

    // Download function
    const downloadTransPDF = () => {
        const capture = document.getElementById('Printdata');
        html2canvas(capture).then((canvas) => {
            const imgData = canvas.toDataURL('img/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const componentWidth = doc.internal.pageSize.getWidth();
            const componentHeight = doc.internal.pageSize.getHeight();
            doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
            doc.save(`${ClientTransactionName} ${ClientTransactionSurname} loan details.pdf`);
        })
    }

    const downloadViewPdf = () => {
        var divContentsD = document.getElementById("PrintDdata").innerHTML;
        var printWindow = window.open('', '');
        printWindow.document.write(`<html><head>`);
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContentsD);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    // Print Transaction details
    const [TransactionCondition, setTransactionCondition] = useState(false)
    const handlePrintTransaction = (obj) => {
        if (obj == "first") {
            setTransactionCondition(false)
        } else {
            setTransactionCondition(true)
        }

    }

    return (
        <div>
            <div className='lg:block hidden'>
                <Button variant="contained" sx={{ backgroundColor: "red", padding: "4px", ":hover": { backgroundColor: "#e11d48" } }} onClick={handleClickOpen}>
                    pdf
                </Button>
            </div>
            <div className='lg:hidden block'>
                <button onClick={handleClickOpen} className='lg:hidden block bg-[red] text-white rounded-[5px] py-[2px] px-[10px] shadow-lg'>pdf</button>
            </div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                {/*  Appbar */}
                <div className='flex justify-between items-center bg-[#00a2ff] text-white px-5 py-2 shadow-lg shadow-gray-400'>
                    <div className='flex justify-center items-center gap-5'>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <p className='text-xl'>View PDF Format</p>
                    </div>
                    <Button autoFocus color="inherit" sx={{ backgroundColor: "#2563eb", ":hover": { backgroundColor: "#0062ff" } }}
                        onClick={TransactionCondition ? downloadViewPdf : downloadTransPDF}
                    >
                        download
                    </Button>
                </div>
                <div className='text-right p-3 text-md'>
                    <button onClick={() => handlePrintTransaction("first")} className='p-1 rounded-lg bg-gray-300'>ViewData</button>
                    <button onClick={() => handlePrintTransaction("second")} className='p-1 rounded-lg bg-gray-300 ml-3'>Transactions</button>
                </div>

                {/* Contents */}
                <div className='flex justify-center items-center'>
                    {
                        TransactionCondition ?
                            <div id='PrintDdata' className=' justify-center items-center'>
                                <div>
                                    <p className='font-bold text-[18px] p-2 text-center text-white bg-gray-800'>Transaction details</p>
                                    <table className='w-[100%]'>
                                        <tr className='font-bold '>
                                            <td className='border-[1px] border-black text-center'>Amount</td>
                                            <td className='border-[1px] border-black text-center'>Date</td>
                                            <td className='border-[1px] border-black text-center'>Remark</td>
                                            <td className='border-[1px] border-black text-center'>Prinipal/Interest</td>
                                            <td className='border-[1px] border-black text-center'>Remark 3</td>
                                        </tr>
                                        {
                                            InstallmentData.map((event, i) => (
                                                <tr key={i}>
                                                    <td className='border-[1px] border-black text-center'>{event.data.Amount}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.PaidDate}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.Remark1}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.Remark2}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.Remark3}</td>
                                                </tr>
                                            ))
                                        }
                                    </table>
                                </div>
                            </div>
                            :
                            <div id='Printdata' className='lg:w-[50%] p-3'>
                                <p className="LogoFontStyle bg-gradient-to-r from-[#7dd3fc] to-[#f0abfc] flex justify-center items-center gap-2 text-[35px] font-bold p-3">
                                    <img className="w-16" src={DhanLogo} alt="" />
                                    <span><span className="text-[#2563eb]">Dhan</span><span className="text-[#f97316]">Mitra</span></span>
                                </p>
                                <div className='lg:p-10 p-3 flex flex-col gap-10'>
                                    <div id='PrintAdata' className='w-full border-2 border-t-0 border-gray-500 rounded-2xl bg-[#ffffff69]'>
                                        <p className='font-bold text-[18px] p-2 text-center text-white bg-gray-800 rounded-t-2xl'>User Details</p>
                                        <div className='flex justify-center px-7 py-4 rounded-b-2xl'>
                                            <table >
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "uuid" &&
                                                        <tr key={i}>
                                                            <td>User ID</td>
                                                            <td>: {event.data.substring(0, 6)}</td>
                                                        </tr>

                                                    ))
                                                }
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "Name" &&
                                                        <tr>
                                                            <td>Name</td>
                                                            <td>: {event.data}</td>
                                                        </tr>

                                                    ))
                                                }
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "Surname" &&
                                                        <tr>
                                                            <td>Surname</td>
                                                            <td>: {event.data}</td>
                                                        </tr>

                                                    ))
                                                }
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "FatherName" &&
                                                        <tr>
                                                            <td>Father Name</td>
                                                            <td>: {event.data}</td>
                                                        </tr>

                                                    ))
                                                }
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "phone" &&
                                                        <tr>
                                                            <td>Phone No</td>
                                                            <td>: {event.data}</td>
                                                        </tr>

                                                    ))
                                                }
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "address" &&
                                                        <tr>
                                                            <td>Address</td>
                                                            <td>: {event.data}</td>
                                                        </tr>

                                                    ))
                                                }
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "IdProofName" &&
                                                        <tr>
                                                            <td>ID Proof Name</td>
                                                            <td>: {event.data}</td>
                                                        </tr>

                                                    ))
                                                }
                                                {
                                                    UserClient.map((event, i) => (
                                                        event.key == "IdProofNumber" &&
                                                        <tr >
                                                            <td className='pr-4'>ID Proof Number</td>
                                                            <td>: {event.data}</td>
                                                        </tr>

                                                    ))
                                                }

                                            </table>
                                        </div>
                                    </div>

                                    <div id='PrintBdata' className='w-full border-2 border-t-0 border-gray-500 rounded-2xl bg-[#ffffff69]'>
                                        <p className='font-bold text-[18px] p-2 text-center text-white bg-gray-800 rounded-t-2xl'>Basic Details</p>
                                        <div className='flex justify-center py-5'>
                                            {
                                                Userloan.map((event, i) => (
                                                    event.key === props.locateID &&
                                                    <table>
                                                        <tr>
                                                            <td className='pr-3'>Loan Name</td>
                                                            <td>: {event.data.Name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='pr-3'>Start Date</td>
                                                            <td>: {event.data.StartDate}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='pr-3'>Refered By</td>
                                                            <td>: {event.data.Refered}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='pr-3'>Loan ID</td>
                                                            <td>: {event.data.uuid.substring(0, 6)}</td>
                                                        </tr>
                                                    </table>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <div id='PrintCdata' className='w-full border-2 border-t-0 border-gray-500 rounded-2xl bg-[#ffffff69]'>
                                        <p className='flex justify-center items-center gap-5 font-bold text-[18px] p-2 text-center text-white bg-gray-800 rounded-t-2xl'>
                                            Compound Interest Details
                                        </p>
                                        <div className='flex justify-center py-5 rounded-b-2xl'>
                                            {
                                                Userloan.map((event, i) => (
                                                    event.key === props.locateID &&
                                                    <div key={i}>
                                                        {
                                                            event.data.CompoundInterest == null ? <div className="mt-5">No Data</div>
                                                                :
                                                                <div>
                                                                    <table>
                                                                        <tr>
                                                                            <td className='pr-3'>Principle</td>
                                                                            <td>: {event.data.CompoundInterest.principle} ₹</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pr-3'>Time</td>
                                                                            <td>: {event.data.CompoundInterest.time} {event.data.CompoundInterest.time <= 1 ? "year" : "years"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pr-3'>Rate of Interest</td>
                                                                            <td>: {event.data.CompoundInterest.rateOfInterest} %</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pr-3'>Compound Interest</td>
                                                                            <td>: {event.data.CompoundInterest.compoundInterest} ₹</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pr-3'>Witness 1</td>
                                                                            <td>: {event.data.CompoundInterest.witness1}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pr-3'>Witness 2</td>
                                                                            <td>: {event.data.CompoundInterest.witness2}</td>
                                                                        </tr>
                                                                        {
                                                                            event.data.CompoundInterest.collateral &&
                                                                            <tr>
                                                                                <td className='pr-3'>Collateral</td>
                                                                                <td>: <a className='text-blue-500 capita' href={`${event.data.CompoundInterest.collateral}`}>click here to view</a>
                                                                                </td>
                                                                            </tr>
                                                                        }
                                                                        <tr>
                                                                            <td className='pr-3'>Remarks</td>
                                                                            <td>: {event.data.CompoundInterest.remarks}</td>
                                                                        </tr>
                                                                    </table>
                                                                </div>

                                                        }

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </Dialog>
        </div>
    );
}