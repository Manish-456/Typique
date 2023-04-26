import React, { useContext, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { Link } from 'react-router-dom';
const Footer = ({setEmail, id}) => {
  const {theme} = useContext(ThemeContext)
  const [userEmail, setUserEmail] = useState("");

  const handleSendEmail = () => {
    if(userEmail){
      setEmail(userEmail)
      setUserEmail("")
    }

  }


  return (
    <footer  className={`bg-[#f3f3ff]  mt-10 ${theme.primary}`}>

      <div className='md:max-w-7xl max-w-[100rem] items-center md:flex-row flex-col gap-4 flex justify-between mx-auto p-6 md:px-4'>
        <div className="left ">
          <h1 className='text-[var(--primary)] md:text-start text-center font-bold text-3xl'>Typique</h1>
          <p className='mt-3 text-semibold text-center text-[14px] md:text-lg text-gray-700'>Redefining Blogging with Unique Typographic Styles

</p>

        </div>
        <div className="center">
           <p className='text-center text-sm font-cursive text-gray-400'>Connect, Create, and Share with Typique!</p>

        </div>
      {id &&   <div className="right flex flex-col md:mt-0 mt-4 gap-4">
            <h1 className='font-bold text-xl text-gray-700 md:text-start text-center'>Subscribe</h1>
         <div className='flex gap-2  items-center'>
         <input type="email" onChange={e => setUserEmail(e.target.value)} value={userEmail} className='bg-transparent outline-none border-b md:text-[15px] text-[14px] border-gray-600' placeholder='Enter Your email' />
         <button onClick={handleSendEmail}  className=' text-2xl font-bold'>&rarr;</button>
         </div>
        </div>
         }
      </div>
        <p  className='text-[12px] text-center mt-5 text-blue-500
'>Copyright ©2023 All rights reserved</p>
  <p className='text-[12px] text-center mt-2 text-cyan-300'>Made with by <span className='text-red-500'>❤</span> <Link target='_blank' to={`https://github.com/Manish-456`} className=''>Manish Tamang</Link> </p>
    </footer>
  )
}

export default Footer