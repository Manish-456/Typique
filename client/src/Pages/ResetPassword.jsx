import { useLocation, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../Features/auth/authApiSlice';
import {useState} from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectEmailAddress } from '../Features/auth/authSlice';

const ResetPassword = () => {

  const email = useSelector(selectEmailAddress);
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()
  const [resetPassword, {
    isLoading, 
    isError
  }] = useResetPasswordMutation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(password === confirmPassword){
        await resetPassword({password, email})
        toast.success("Your password has been reset");
      navigate('/auth')
        
      }else if (isError){
        toast.error("Something went wrong") 
      }else{
        
        toast.error("Password doesnot match!")
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  
  
    const inputClass = `border-b bg-transparent border-gray-400 text-xl p-2 outline-none`
  return (
    <>
     <Toaster position="top-center" reverseOrder={false}></Toaster>
  <div className="h-[100vh]">


<div className='glass p-4 transform w-[65%] md:w-[40%] lg:w-[20%] mx-auto  translate-y-[30%] items-center'>
      <div className='flex flex-col gap-10'>
        <div className='mx-auto flex flex-col gap-4'>
          <img src="./Logo.svg" alt="" />
          <h1 className='text-gray-500 text-2xl'>Reset Password</h1>
        </div>
        <form className='flex flex-col gap-8 w-full' onSubmit={handleSubmit}>
    
        <input type="password" onChange={e => setPassword(e.target.value)}  className={inputClass} placeholder='New Password *' />
        <input type="password" onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder='Confirm Password *' />
       <button disabled={isLoading} className='primary text-xl w-full'> Reset</button>
        </form>
        
      </div>
    </div>
  </div>
    </>
  )
}

export default ResetPassword