import React, { useState } from 'react'
import LoginUpdate from "../Authentication/LoginUpdate"

export default function StratingPage() {


  return (
    <div className='flex lg:flex-row flex-col FontStyle bg-[#f1f5f9]'>

      <div className='p-3 h-screen lg:w-[40%]'>
        <div className='flex justify-center h-full items-center rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#a855f7] text-white'>
          <div>
            <img className='h-56 mx-auto' src="Images\dhanmitra_LOGO.png" alt="dhanmitra logo" />
            <p className='text-[250%] text-center'>Welcome to DhanMitra</p>
            <p className='text-[110%] text-center'>Please sign in to continue</p>
          </div>
        </div>
      </div>

      <div className='lg:flex lg:justify-center lg:items-center lg:w-[60%] lg:h-screen lg:m-0 my-5'>
        <div className='lg:w-[45%] p-5 pt-0 lg:rounded-2xl lg:shadow-xl lg:bg-white'>
          <p className='text-[200%] text-center text-blue-600 font-bold p-4'>Sign in</p>
          <div>
            <LoginUpdate />
          </div>
        </div>
      </div>

    </div>
  )
}
