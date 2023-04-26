

import { apiSlice } from "../../app/api/apiSlice";
import { OTPVerify, logOut, setCredentials, setIsEmailSend } from "./authSlice";

export const AuthApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
   
   
    }),
    sendMail: builder.mutation({
      query: (message) => ({
        url: "/api/auth/mailer",
        method: "POST",
        body: { ...message },
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
   
        await queryFulfilled;
        const { username, email } = args;

        await dispatch(
          AuthApiSlice.endpoints.sendMail.initiate({
            username,
            email,
            text: `Hi ${username} Welcome to Typique. is a cutting-edge blogging app that allows users to create
                    visually stunning posts using a wide range of unique typographic
                    styles. With a user-friendly interface and powerful editing
                    tools,Typique is the perfect platform for bloggers and writers
                    looking to stand out in a crowded online space.`,
            subject: "Registration Successful",
          })
        );
      },
    }),
    userDetail: builder.query({
      query: (email) => ({
        url: `/api/auth/getuser/?email=${email}`,
        method: "GET",
      }),
    }),
    generateOTP: builder.query({
      query: (email) => ({
        url: `/api/auth/generateOTP/?email=${email}`,
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
  
        try {
          const res = await queryFulfilled;
          let code = res.data.code;
          const getUserResult = await dispatch(
            AuthApiSlice.endpoints.userDetail.initiate(args)
          );
          if (getUserResult) {
            const { username, email } = getUserResult?.data?.user;
            await dispatch(
              AuthApiSlice.endpoints.sendMail.initiate({
                username,
                email,
                text: `Your OTP is ${code}`,
                subject: "OTP Verification",
              })
            );
            dispatch(setIsEmailSend(true));
          }
          return;
        } catch (error) {
          dispatch(setIsEmailSend(false));
        }
      },
    }),
    verifyOTP: builder.mutation({
      query: (code) => ({
        url: "/api/auth/verifyOTP/verify",
        method: "POST",
        body: { code : code },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(OTPVerify(false));
        try {
          await queryFulfilled;
          dispatch(OTPVerify(true));
        } catch (error) {
          dispatch(OTPVerify(false));
        }
      },
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/resetpassword",
        method: "PUT",
        body: { ...credentials },
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/api/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
            const {data} = await queryFulfilled;
              
            const {accessToken} = data;
            dispatch(setCredentials({accessToken}))
        } catch (err) {
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(OTPVerify(false));
          dispatch(apiSlice.util.resetApiState());
        } catch (error) { 
     
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
  useGenerateOTPQuery,
  useUserDetailQuery,
  useSendMailMutation
} = AuthApiSlice;
