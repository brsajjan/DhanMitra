import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { db } from "../Firebase/FirebaseConfig"
import { onValue, ref, remove } from 'firebase/database'
import AddClientDialogbox from "../AddClientDialogBox/AddClientDialogBox"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewClient from "../ViewClient/ViewClient"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Link } from 'react-router-dom'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export default function AllClients() {

    const [Clients, setClients] = useState([])
    const [AfterFetch, setAfterFetch] = useState(false)

    useEffect(() => {
        fetchData();
        setAfterFetch(true)
    }, [])

    const fetchData = () => {
        // onValue(ref(db), (snapshot) => {
        //     const data = snapshot.val()
        //     setClients(data.Clients)
        // })
        const count = ref(db, 'Mains/AllClients');
        onValue(count, (snapshot) => {
            let retrive = [];
            snapshot.forEach(pst => {
                const key = pst.key
                const data = pst.val()
                retrive.push({ "key": key, "data": data })
            })
            setClients(retrive);
        })
    }

    const handleDelete = (obj) => {
        alert("Please remember to clear all the loans before deleting the client account")
        let pin = prompt(`Enter the Pin to Delete`)
        if (pin === "1234") {
            remove(ref(db, `Mains/AllClients/${obj}`))
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

    // Search Function
    const [search, setsearch] = useState("")

    return (
        <>

            <div className='FontStyle h-screen bg-gradient-to-r from-[#7dd3fc] to-[#f0abfc]'>
                <Navbar />
                <ToastContainer />
                <div className='h-[90%] lg:p-10 p-4 overflow-scroll scroll-smooth scrollbar-hide'>
                    <div className=' mx-auto'>
                        <p className='lg:flex lg:justify-between lg:items-center text-black lg:mt-0 mt-5 lg:pb-2 pb-0 text-left lg:text-[30px] text-[20px] font-bold capitalize'>
                            <span>list of all clients</span>
                            <div className='lg:flex hidden justify-center items-center bg-white rounded-lg px-2'>
                                <PersonSearchIcon sx={{ color: "dimgray" }} />
                                <input onChange={(e) => setsearch(e.target.value)} className=' rounded-lg border-0 SearchBorder' placeholder='Search Client' value={search} type="text" />
                            </div>
                        </p>
                        <div className='h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />
                    </div>
                    <div className='lg:hidden flex  items-center bg-white rounded-lg px-2 mt-5'>
                        <PersonSearchIcon sx={{ color: "dimgray" }} />
                        <input onChange={(e) => setsearch(e.target.value)} className='w-full rounded-lg border-0 SearchBorder' placeholder='Search Client' value={search} type="text" />
                    </div>

                    <div className='flex flex-col gap-7 mt-5 mx-auto text-[17px] lg:p-10 p-5 rounded-[18px] bg-[#ffffff62] shadow-xl'>
                        {
                            Clients[0] == null ? <p className='text-center'>No Loan</p> :
                                Clients.filter((e) => {
                                    let eventName = e.data.Name
                                    return search.toLowerCase() === "" ? e :
                                        eventName.toLowerCase().includes(search.toLowerCase())
                                }).map((event, i) => (
                                    <div key={i} className='flex lg:flex-row flex-col gap-3 justify-between items-center shadow-lg rounded-lg bg-[white] p-3'>

                                        <div className='capitalize lg:text-left text-center'>
                                            <p className='text-black font-bold'> {event.data.Name.trim()} {event.data.Surname}</p>
                                            <p className='text-gray-700 lowercase text-sm'><span className='font-bold'>loan id :</span> {event.data.uuid.substring(0, 6)}</p>
                                        </div>

                                        <div className='flex gap-8 '>

                                            <div className='flex flex-col justify-center items-center'>
                                                <Link to={`/ClientLoanDetails/${event.data.uuid}`}>
                                                    <IconButton sx={{ backgroundColor: "#fef08a", color: "#ea580c" }} >
                                                        <CurrencyRupeeIcon />
                                                    </IconButton>
                                                </Link>
                                                <span className='text-[13px]'>loan</span>
                                            </div>

                                            <div className='flex flex-col justify-center items-center'>
                                                <ViewClient
                                                    Name={event.data.Name}
                                                    Surname={event.data.Surname}
                                                    FatherName={event.data.FatherName}
                                                    phone={event.data.phone}
                                                    address={event.data.address}
                                                    uuid={event.data.uuid}
                                                    IdProofName={event.data.IdProofName}
                                                    IdProofNo={event.data.IdProofNumber}
                                                    details={event}
                                                />
                                                <span className='text-[13px]'>view</span>
                                            </div>

                                            <div className='flex flex-col justify-center items-center'>
                                                <AddClientDialogbox
                                                    btnName="EDIT"
                                                    AfterFetch={AfterFetch}
                                                    dialogTitle={"Update Client Details"}
                                                    details={event}
                                                />
                                                <span className='text-[13px]'>edit</span>
                                            </div>

                                            <div className='flex flex-col justify-center items-center'>
                                                <IconButton aria-label="delete" color="error" sx={{ backgroundColor: "#f2c8cd" }} onClick={() => { handleDelete(event.data.uuid) }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <span className='text-[13px]'>delete</span>
                                            </div>

                                        </div>

                                    </div>
                                ))
                        }
                    </div>
                </div>

            </div>

        </>
    )
}   
