import React, { useEffect, useState } from 'react'
import { onValue, ref, set, update } from 'firebase/database';
import { db } from "../Firebase/FirebaseConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ViewClientLoansTransactions(props) {

    useEffect(() => {
        fetchSerialNumberData();
    }, [])

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

    const [SerialNumber, setSerialNumber] = useState(0)
    console.log(SerialNumber)

    const [Amount, setAmount] = useState("")
    const [Date, setDate] = useState("")
    const [Remark1, setRemark1] = useState("")
    const [Remark2, setRemark2] = useState("")
    const [Remark3, setRemark3] = useState("")

    const handleInstallmentData = () => {
        set(ref(db, `Mains/AllLoans/${props.locateUID}/${props.locateID}/Installments/${SerialNumber}`), {
            Amount: Amount,
            Date: Date,
            Remark1: Remark1,
            Remark2: Remark2,
            Remark3: Remark3,
            SlNo: SerialNumber
        });
        setAmount("")
        setDate("")
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
        setSerialNumber(SerialNumber + 1)
        update(ref(db, `Mains/AllLoans/${props.locateUID}/${props.locateID}/SerialNumber/`), {
            SlNo: SerialNumber
        });
    }


    return (
        <>
            <ToastContainer />
            <table >
                <body >
                    <div className='mt-5'>
                        <tr className=''>
                            <td>Enter Amount:</td>
                            <td><input className='w-full' type="number" value={Amount} onChange={(e) => { setAmount(e.target.value) }} /></td>
                        </tr>
                        <tr className=''>
                            <td>Enter Date:</td>
                            <td><input className='w-full' type="date" value={Date} onChange={(e) => { setDate(e.target.value) }} /></td>
                        </tr>
                        <tr className=''>
                            <td>Remark 1:</td>
                            <td><input className='w-full' type="text" value={Remark1} onChange={(e) => { setRemark1(e.target.value) }} /></td>
                        </tr>
                        <tr className=''>
                            <td>Remark 2:</td>
                            <td><input className='w-full' type="text" value={Remark2} onChange={(e) => { setRemark2(e.target.value) }} /></td>
                        </tr>
                        <tr>
                            <td>Remark 3:</td>
                            <td><input className='w-full' type="text" value={Remark3} onChange={(e) => { setRemark3(e.target.value) }} /></td>
                        </tr>
                        <tr className='flex justify-center items-center'>
                            {
                                (Amount == "" || Date == "") ?
                                    <button type="submit" disabled className='w-full p-2 rounded-lg bg-blue-300 text-white my-4'>Submit</button>
                                    :
                                    <button type="submit" onClick={handleInstallmentData} className='w-full p-2 rounded-lg bg-blue-600 shadow-2xl text-white my-4'>Submit</button>
                            }
                        </tr>
                    </div>
                </body>
            </table>
        </>
    )
}
