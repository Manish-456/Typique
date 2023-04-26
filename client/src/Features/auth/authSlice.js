import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isEmailSend: false,
  verifySuccess: false,
  email : null,
};

const authSlice = createSlice({
  name: "auth", 
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {accessToken} = action.payload;
      state.token = accessToken;
     
    },
    setIsEmailSend: (state, action) => {
      state.isEmailSend = action.payload;
      
    },

    setEmailCredential : (state, action) => {
     state.email = action.payload.email;
    },

    OTPVerify: (state, action) => {
      state.verifySuccess = action.payload;
    },
    logOut: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, setIsEmailSend, OTPVerify, logOut, setEmailCredential } =
  authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state) => state?.auth?.token;
export const selectEmailAddress = (state) => state?.auth?.email;
export const confirmEmail = (state) => state?.auth?.isEmailSend;
export const setOTPVerifyStatus = (state) => state?.auth?.verifySuccess;
