import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom'
import Navbar from "../Navbar/Navbar"
import CreateLoanDialogBox from "../AllAboutClientLoans/CreateLoanDialogBox"
import { onValue, ref, remove } from 'firebase/database'
import { db } from "../Firebase/FirebaseConfig"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import EditClientLoans from "../AllAboutClientLoans/EditClientLoans"
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ClientLoanDetails() {
  // const locateUID = useLocation().pathname.split('/')[2]
  const params = useParams()
  const [Userloan, setUserloan] = useState([])
  const [Clients, setClients] = useState([])
  const [AfterFetch, setAfterFetch] = useState(false)

  useEffect(() => {
    fetchLoanData();
    fetchUserdata();
    setAfterFetch(true)
  }, [])

  // fetch loan details
  const fetchLoanData = () => {
    const count = ref(db, `Mains/AllLoans/${params.uid}`);
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
  console.log(Userloan)

  // fetch User details
  const fetchUserdata = () => {
    const count = ref(db, 'Mains/AllClients');
    onValue(count, (snapshot) => {
      let retrive1 = [];
      snapshot.forEach(pst => {
        const key = pst.key
        const data = pst.val()
        retrive1.push({ "key": key, "data": data })
      })
      setClients(retrive1);
    })
  }
  // console.log(Clients) 

  //Loan delete function
  const handleDelete = (obj) => {
    let pin = prompt("Enter the Pin to Delete")
    if (pin === "1234") {
      remove(ref(db, `Mains/AllLoans/${params.uid}/${obj}`))
      toast.error("loan Deleted Successfully", {
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

  return (
    <>

      <div className='FontStyle h-screen bg-gradient-to-r from-[#7dd3fc] to-[#f0abfc]'>
        <Navbar />

        <ToastContainer />

        <div className='h-[90%] lg:p-5 pb-5 overflow-scroll scroll-smooth scrollbar-hide'>
          <div className='flex lg:flex-row flex-col lg:justify-between lg:items-center justify-start items-start lg:text-[30px] text-[20px] font-bold mt-5 py-2 lg:mx-10 lg:px-0 px-5'>
            <div className='flex lg:flex-row flex-col lg:justify-between lg:items-center justify-start items-start'>
              Loan Details of
              {
                Clients.map((obj, e) => (
                  <div key={e}>
                    {
                      obj.key === params.uid
                        ?
                        <p className='lg:ml-2'>{obj.data.Name} {obj.data.Surname}</p>
                        :
                        ""
                    }
                  </div>
                ))
              }
            </div>
            <div className='lg:block hidden'>
              <CreateLoanDialogBox
                AfterFetch={AfterFetch}
                clientID={params.uid}
              />
            </div>
          </div>
          <div className='h-[3px] lg:mx-10 mx-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />

          <div className='flex justify-start items-center lg:hidden p-5 pb-0'>
            <CreateLoanDialogBox
              AfterFetch={AfterFetch}
              clientID={params.uid}
            />
          </div>

          <div className='flex flex-col gap-7 mx-5 mt-10 text-[17px] lg:p-10 p-5 rounded-[18px] bg-[#ffffff62] shadow-xl'>
            {
              Userloan[0] == null ? <p className='text-center'>No Loan</p> :
                Userloan.map((e, i) => (
                  <div key={i} className='flex lg:flex-row flex-col gap-3 justify-between items-center rounded-lg shadow-lg bg-[white] p-3'>

                    <div className='flex flex-col lg:justify-start lg:items-start justify-cnter items-center'>
                      <p className='text-[20px] font-bold'> {e.data.Name}</p>
                      <p className='text-md text-gray-600'> {e.data.StartDate}</p>
                    </div>

                    <div className='flex justify-center items-center gap-10'>

                      <div className='flex flex-col justify-center items-center'>
                        <Link to={`/ViewClientLoan/${params.uid}/${e.data.uuid}/`}>
                          <IconButton color="success" sx={{ backgroundColor: "#c6e8c3" }}>
                            <VisibilityIcon />
                          </IconButton>
                        </Link>
                        <span className='text-[13px] lg:block hidden'>View Loan</span>
                        <span className='text-[13px] lg:hidden block'>View Lo..</span>
                      </div>

                      <div className='flex flex-col justify-center items-center'>
                        <EditClientLoans
                          details={e}
                          userID={params.uid}
                        />
                        <span className='text-[13px]'>edit</span>
                      </div>

                      <div className='flex flex-col justify-center items-center'>
                        <IconButton onClick={() => { handleDelete(e.data.uuid) }} color="error" sx={{ backgroundColor: "#f2c8cd" }} >
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
