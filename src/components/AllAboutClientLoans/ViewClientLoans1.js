import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { onValue, ref, remove, set, update } from 'firebase/database';
import { db } from "../Firebase/FirebaseConfig";
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import PTR_SI from "../AllAboutClientLoans/PTR_SimpleInterest"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientPdf from '../ClientPDFdownload/ClientPdf'

export default function ViewClientLoans1() {

    const locateUID = useLocation().pathname.split('/')[2]
    const locateID = useLocation().pathname.split('/')[3]
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
        const count = ref(db, `Mains/AllLoans/${locateUID}`);
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
        const count = ref(db, `Mains/AllLoans/${locateUID}/${locateID}/Installments`);
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
        const count = ref(db, `Mains/AllLoans/${locateUID}/${locateID}/SerialNumber/`);
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
        const count = ref(db, `Mains/AllClients/${locateUID}`);
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

    // Store Installment Details and Day wise transaction details
    const [Amount, setAmount] = useState("")
    const [PaidDate, setPaidDate] = useState("")
    const [Remark1, setRemark1] = useState("")
    const [Remark2, setRemark2] = useState("")
    const [Remark3, setRemark3] = useState("")

    let time = new Date()
    let dayDate = time.getDate()
    let month = time.getMonth() + 1
    let year = time.getFullYear()
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()
    let PerfectDate = dayDate + "-" + month + "-" + year
    let PerfectTime = hours + ":" + minutes + ":" + seconds
    // console.log(PerfectDate)
    // console.log(PerfectTime)

    const handleInstallmentData = () => {
        update(ref(db, `Mains/AllLoans/${locateUID}/${locateID}/SerialNumber/`), {
            SlNo: SerialNumber + 1
        });
        set(ref(db, `Mains/AllLoans/${locateUID}/${locateID}/Installments/${SerialNumber}`), {
            Amount: Amount,
            PaidDate: PaidDate,
            Remark1: Remark1,
            Remark2: Remark2,
            Remark3: Remark3,
            SlNo: SerialNumber
        });
        setAmount("")
        setPaidDate("")
        setRemark1("")
        setRemark2("")
        setRemark3("")
        toast.success("Data sent Successfully", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
        set(ref(db, `Mains/Daywise Transactions/${PerfectDate}/${PerfectTime}`), {
            Amount: Amount,
            PaidDate: PaidDate,
            Remark1: Remark1,
            Remark2: Remark2,
            Remark3: Remark3,
            PDate: PerfectDate,
            PTime: PerfectTime,
            ClientName: ClientTransactionName,
            ClientSurname: ClientTransactionSurname
        });
    }

    // Transaction delete function
    const handleDelete = (obj) => {
        let pin = prompt(`Enter the Pin to Delete`)
        if (pin === "1234") {
            remove(ref(db, `Mains/AllLoans/${locateUID}/${locateID}/Installments/${obj}`))
            toast.error("Deleted Successfully", {
                position: "top-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        } else {
            alert("Enter the correct pin to Delete")
        }
    }

    // Tab function
    const [first, setFirst] = useState(true)
    const [second, setSecond] = useState(false)

    const handleTab = (obj) => {
        if (obj === "first") {
            setFirst(true)
            setSecond(false)
        } else {
            setFirst(false)
            setSecond(true)
        }
    }

    // Download function
    const downloadPDF = () => {
        var divContentsA = document.getElementById("PrintAdata").innerHTML;
        var divContentsB = document.getElementById("PrintBdata").innerHTML;
        var divContentsC = document.getElementById("PrintCdata").innerHTML;
        var divContentsD = document.getElementById("PrintDdata").innerHTML;
        var printWindow = window.open('', '');
        printWindow.document.write(`<html><head>`);
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContentsA);
        printWindow.document.write(`<b>------------------------------------------</b>`);
        printWindow.document.write(divContentsB);
        printWindow.document.write(`<b>------------------------------------------</b>`);
        printWindow.document.write(divContentsC);
        printWindow.document.write(`<b>------------------------------------------</b>`);
        printWindow.document.write(divContentsD);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    return (
        <>

            <div className='FontStyle h-screen bg-gradient-to-r from-[#7dd3fc] to-[#f0abfc]'>
                <Navbar />

                <ToastContainer />

                <div className='h-[90%] lg:p-10 overflow-scroll scroll-smooth scrollbar-hide'>
                    <div className='flex justify-between items-center p-3 '>
                        {
                            Userloan.map((event, i) => (
                                event.key === locateID &&
                                <div className='flex lg:flex-row flex-col lg:mt-0 mt-4' key={i}>
                                    <div className='flex gap-2 font-bold'>
                                        {
                                            UserClient.map((event, i) => (
                                                event.key == "Name" &&
                                                <p key={i} className='lg:text-[21px] text-[18px] capitalize '>{event.data}</p>
                                            ))
                                        }
                                        {
                                            UserClient.map((event, i) => (
                                                event.key == "Surname" &&
                                                <><p key={i} className='lg:text-[21px] text-[18px] capitalize '>{event.data}</p>
                                                    <span className='text-[21px] mr-2'> / </span></>
                                            ))
                                        }
                                    </div>

                                    <p className='lg:text-[21px] text-[18px] text-gray-800 font-bold capitalize '>{event.data.Name} Details</p>
                                </div>
                            ))
                        }

                        <div className='flex lg:flex-row flex-col lg:gap-5 gap-2 justify-end items-end lg:mt-0 mt-4'>
                            <ClientPdf locateUID={locateUID} locateID={locateID} />
                            {
                                second ? "" :
                                    <>
                                        <div className='lg:block hidden'>
                                            <Button variant="contained" sx={{ backgroundColor: "red", padding: "4px", ":hover": { backgroundColor: "#e11d48" } }} onClick={downloadPDF}>
                                                pdf lite
                                            </Button>
                                        </div>
                                        <button onClick={downloadPDF} className='lg:hidden block bg-[red] text-white rounded-[5px] p-1 shadow-lg'>pdf lite</button>
                                    </>
                            }
                        </div>

                    </div>
                    <div className='h-[3.5px] mx-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />

                    <div className='flex p-5 gap-5'>
                        <Button
                            variant="contained"
                            className='w-full'
                            sx={first ? { backgroundColor: "#2563eb", fontWeight: "bold", ":hover": { backgroundColor: "#0ea5e9" } } : { backgroundColor: "white", color: "black", ":hover": { backgroundColor: "#0ea5e9" } }}
                            onClick={() => handleTab("first")}
                            autoFocus
                        >
                            View
                        </Button>
                        <Button
                            variant="contained"
                            className='w-full'
                            sx={second ? { backgroundColor: "#2563eb", fontWeight: "bold", ":hover": { backgroundColor: "#0ea5e9" } } : { backgroundColor: "white", color: "black", ":hover": { backgroundColor: "#0ea5e9" } }}
                            onClick={() => handleTab("second")}
                            autoFocus
                        >
                            Transactions
                        </Button>
                    </div>


                    {
                        first &&
                        <>

                            {/* user and basic details */}
                            <div className='flex lg:flex-row flex-col justify-around lg:px-16 px-4 py-5 gap-10'>
                                <div id='PrintAdata' className='w-full shadow-xl rounded-2xl bg-[#ffffff69]'>
                                    <p className='font-bold text-[18px] p-2 text-center text-white bg-gray-800 rounded-t-2xl'>User Details</p>
                                    <div className='flex justify-center p-5 rounded-b-2xl'>
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

                                <div id='PrintBdata' className='w-full shadow-xl rounded-2xl bg-[#ffffff69]'>
                                    <p className='font-bold text-[18px] p-2 text-center text-white bg-gray-800 rounded-t-2xl'>Basic Details</p>
                                    <div className='flex justify-center p-5'>
                                        {
                                            Userloan.map((event, i) => (
                                                event.key === locateID &&
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
                            </div>

                            {/* compound and installment details */}
                            <div className='flex lg:flex-row flex-col justify-around lg:px-16 px-4 py-5 gap-10'>
                                <div id='PrintCdata' className='w-full shadow-xl rounded-2xl bg-[#ffffff69]'>
                                    <p className='flex justify-center items-center gap-5 font-bold text-[18px] p-2 text-center text-white bg-gray-800 rounded-t-2xl'>
                                        <p className='w-[85%] pl-[14%]'>Compound Interest Details</p>
                                        {
                                            Userloan.map((event, i) => (
                                                event.key === locateID &&
                                                <PTR_SI
                                                    key={i}
                                                    userID={locateUID}
                                                    details={event}
                                                />
                                            ))
                                        }
                                    </p>
                                    <div className='flex justify-center p-5 rounded-b-2xl'>
                                        {
                                            Userloan.map((event, i) => (
                                                event.key === locateID &&
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

                                <div className='w-full shadow-xl rounded-2xl'>
                                    <p className='font-bold text-[18px] p-2 text-center text-white bg-gray-800 rounded-t-2xl'>Installment</p>
                                    <div className='flex justify-center bg-[#ffffff69] rounded-b-2xl'>
                                        <table >
                                            <body >
                                                <div className='lg:mt-5 FontStyle lg:p-0 p-5'>
                                                    <tr className=''>
                                                        <td><span className='text-red-500'>*</span> Amount:</td>
                                                        <td><input className='w-full rounded-md bg-[#ffffff69]' type="number" value={Amount} onChange={(e) => { setAmount(e.target.value) }} /></td>
                                                    </tr>
                                                    <tr className=''>
                                                        <td><span className='text-red-500'>*</span> Date:</td>
                                                        <td><input className='w-full rounded-md bg-[#ffffff69]' type="date" value={PaidDate} onChange={(e) => { setPaidDate(e.target.value) }} /></td>
                                                    </tr>
                                                    <tr className=''>
                                                        <td><span className='text-red-500'>*</span> Remark:</td>
                                                        <td><input className='w-full rounded-md bg-[#ffffff69]' type="text" value={Remark1} onChange={(e) => { setRemark1(e.target.value) }} /></td>
                                                    </tr>
                                                    <tr className=''>
                                                        {/* remark 2 is changed as principal/interest */}
                                                        <td className='lg:block hidden'><span className='text-red-500 '>*</span> Principle/Interest:</td>
                                                        <td className='lg:hidden block'><span className='text-red-500 '>*</span> <span>Pri/Int:</span></td>
                                                        <td><input className='w-full rounded-md bg-[#ffffff69]' type="text" value={Remark2} onChange={(e) => { setRemark2(e.target.value) }} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td><span className='text-red-500'>*</span> Remark 3:</td>
                                                        <td><input className='w-full rounded-md bg-[#ffffff69]' type="text" value={Remark3} onChange={(e) => { setRemark3(e.target.value) }} /></td>
                                                    </tr>
                                                    <tr className='flex justify-center items-center'>
                                                        {
                                                            (Amount == "" || PaidDate == "" || Remark1 == "" || Remark2 == "" || Remark3 == "") ?
                                                                <Button disabled sx={{ color: "white", marginY: "16px", opacity: "3" }} className='bg-gradient-to-r from-cyan-200 to-blue-200 w-full'>Submit</Button>
                                                                :
                                                                <Button onClick={handleInstallmentData} sx={{ color: "white", marginY: "16px" }} className='bg-gradient-to-r from-cyan-500 to-blue-500 w-full'>Submit</Button>
                                                        }
                                                    </tr>
                                                </div>
                                            </body>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* hidden content */}
                            <div id='PrintDdata' className=' justify-center items-center hidden'>

                                <div>
                                    <p className='font-bold text-[18px] p-2 text-center text-white bg-black'>Transsaction details</p>
                                    <table className='w-[90%]'>
                                        <tr className='font-bold '>
                                            {/* <td className='border-[1px] border-black text-center'>Sl No</td> */}
                                            <td className='border-[1px] border-black text-center'>Amount</td>
                                            <td className='border-[1px] border-black text-center'>Date</td>
                                            <td className='border-[1px] border-black text-center'>Remark 1</td>
                                            <td className='border-[1px] border-black text-center'>Prinipal/Interest</td>
                                            <td className='border-[1px] border-black text-center'>Remark 3</td>
                                        </tr>
                                        {
                                            InstallmentData.map((event, i) => (
                                                <tr key={i}>
                                                    {/* <td className='border-[1px] border-black text-center'>{event.data.SlNo}</td> */}
                                                    <td className='border-[1px] border-black text-center'>{event.data.Amount}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.PaidDate}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.Remark1}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.Remark2}</td>
                                                    <td className='border-[1px] border-black text-center'>{event.data.Remark3}</td>
                                                    <td className='border-[1px] border-black text-center'>
                                                        <IconButton aria-label="delete" color="error" onClick={() => { handleDelete(event.data.SlNo) }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </table>
                                </div>
                            </div>
                        </>
                    }



                    <div className='lg:p-0 p-5'>
                        {
                            second &&
                            <>
                                <div className='lg:flex hidden justify-center items-center my-3'>

                                    <table className='w-[90%]'>
                                        <tr className='font-bold '>
                                            <td className='bg-gray-800 border-2 border-black p-2 text-white text-center'>Amount</td>
                                            <td className='bg-gray-800 border-2 border-black p-2 text-white text-center'>Date</td>
                                            <td className='bg-gray-800 border-2 border-black p-2 text-white text-center'>Principal/Interest</td>
                                            <td className='bg-gray-800 border-2 border-black p-2 text-white text-center'>Remark </td>
                                            <td className='bg-gray-800 border-2 border-black p-2 text-white text-center'>Remark 3</td>
                                        </tr>
                                        {
                                            InstallmentData.map((event, i) => (
                                                <tr key={i}>
                                                    <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Amount}</td>
                                                    <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.PaidDate}</td>
                                                    <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Remark2}</td>
                                                    <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Remark1}</td>
                                                    <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Remark3}</td>
                                                    <td className=' text-center w-10 '>
                                                        <IconButton aria-label="delete" color="error" onClick={() => { handleDelete(event.data.SlNo) }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </table>
                                </div>

                                <div className='lg:hidden flex justify-center items-center flex-col gap-5 shadow-xl rounded-2xl bg-[#ffffff69] p-5'>
                                    {
                                        InstallmentData.map((event, i) => (
                                            // <tr key={i}>
                                            //     <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Amount}</td>
                                            //     <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.PaidDate}</td>
                                            //     <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Remark1}</td>
                                            //     <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Remark2}</td>
                                            //     <td className='border-[1px] border-black text-center bg-[#ffffff69]'>{event.data.Remark3}</td>
                                            //     <td className=' text-center w-10 '>
                                            //     <IconButton aria-label="delete" color="error" onClick={() => { handleDelete(event.data.SlNo) }}>
                                            //          <DeleteIcon />
                                            //     </IconButton>
                                            //     </td>
                                            // </tr>
                                            <div className='w-full flex justify-between items-center bg-white rounded-lg p-2'>
                                                <div className='flex flex-col justify-start items-start'>
                                                    <p className='text-lg text-black font-bold'>{event.data.PaidDate}</p>
                                                    <p className='text-sm text-gray-600 font-bold'>{event.data.Remark3}</p>
                                                    <p className='text-sm text-gray-600 font-bold'>{event.data.Remark1}</p>
                                                </div>
                                                <div className='flex flex-col justify-end items-end'>
                                                    <p className='text-lg text-black font-bold'>₹ {event.data.Amount}</p>
                                                    <p className='text-sm text-gray-600 font-bold'>{event.data.Remark2}</p> 
                                                    <p onClick={() => { handleDelete(event.data.SlNo) }}><DeleteIcon sx={{color:'red', fontSize:"20px"}}/></p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        }
                    </div>
                </div>

            </div>

        </>
    )
}
