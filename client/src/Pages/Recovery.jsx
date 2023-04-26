import React, { useEffect, useState } from "react";
import {
  useGenerateOTPQuery,
  useVerifyOTPMutation,
} from "../Features/auth/authApiSlice";
import { Toaster, toast } from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { confirmEmail, selectEmailAddress, setOTPVerifyStatus } from "../Features/auth/authSlice";
const Recovery = () => {
  const [code, setCode] = useState("");
  const [verifyOTP] = useVerifyOTPMutation();
  const isEmailSend = useSelector(confirmEmail);
  const OTPSuccess = useSelector(setOTPVerifyStatus);
  const navigate = useNavigate();

   const email = useSelector(selectEmailAddress);
  const generateOTP = useGenerateOTPQuery(email);

  

  useEffect(() => {
    toast.success(<b>OTP has been sent to your email.</b>);
  }, [isEmailSend]);

  function resendOTP() {
    generateOTP.refetch();
    toast.success(<b>OTP has been resent to your email.</b>)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(code);
    } catch (error) {}
  };

  if (OTPSuccess)
    navigate("/reset");

  const inputClass = `border-b bg-transparent border-gray-400  p-2 outline-none`;
  return (
    <>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
     <div className="h-[100vh]">
     <div className="glass p-4 transform w-[65%] md:w-[40%] lg:w-[20%] mx-auto  translate-y-[30%] items-center">
        <div className="flex flex-col gap-10">
          <div className="mx-auto flex items-center flex-col gap-4">
            <img src="./Logo.svg" alt="" />
            <h1 className="text-gray-500 text-2xl">Recovery </h1>
            <p className="text-center text-gray-400 font-semibold text-lg">
              {" "}
              Enter OTP to recover recovery
            </p>
          </div>
          <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              className={inputClass}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Please enter 6 digits OTP *"
            />

            <button className="primary text-xl w-full" type="submit">
              Verify OTP
            </button>
          </form>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-center font-bold text-gray-400">
              Didn't get OTP?{" "}
              <button
                type="button"
                onClick={resendOTP}
                className="text-blue-700 font-bold text-[16px] cursor-pointer"
              >
                {" "}
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
     </div>
    </>
  );
};

export default Recovery;
