import React, { useState } from 'react'
import Navbar from "../Navbar/Navbar"
import AddClientDialogbox from "../AddClientDialogBox/AddClientDialogBox"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Homepage() {

    return (
        <>

            <div className='bg-[url("https://img.freepik.com/free-photo/front-view-hand-adding-coin-jar-with-plant-other-coins_23-2148803915.jpg?w=740&t=st=1688047055~exp=1688047655~hmac=2cf4df8de48fa70c1bb209d1b97a9393e2d7e5d3f3063b691ac914f47126ef29")] lg:bg-[url("https://img.freepik.com/free-photo/world-habitat-day-close-up-picture-pile-coins-sag-coin_1150-26741.jpg?w=1060&t=st=1687682541~exp=1687683141~hmac=58333d5f71156881ca6934f3db74de528766c49f35276da6d30ff153cff4a69b")] bg-cover h-screen'>
                <Navbar />
                <ToastContainer />
                <div className='lg:w-[50%] h-[88%] flex items-center lg:ml-10 lg:p-0 p-4'>
                    <div className='FontStyle flex flex-col gap-5'>
                        <div className='FontStyle font-extrabold text-[#222269] bg-[#ffffff5a] rounded-2xl pl-2 py-3'>
                            <p className='lg:text-[45px] text-[30px]'>Simplify your financial journey</p>
                            <p className='lg:text-[30px] text-[17px]'>Track, organize, and manage loans effortlessly</p>
                            <p className='lg:text-[30px] text-[17px]'>Take control of your finances and achieve your goals with Dhanmitra</p>
                        </div>
                        <div className='flex flex-col gap-2 bg-[#ffffff5a] rounded-2xl pl-4 py-4'>
                            <p className='lg:text-[25px] text-[17px] font-semibold text-[#222269]'>Start adding clients with Dhanmitra</p>
                            <AddClientDialogbox
                                btnName="Add Client"
                                dialogTitle={"Add Client Details"}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
