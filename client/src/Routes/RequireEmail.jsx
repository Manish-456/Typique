import React from 'react'
import { useSelector } from 'react-redux'
import { selectEmailAddress } from '../Features/auth/authSlice'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireEmail = () => {
  const location = useLocation();
  const email = useSelector(selectEmailAddress);
   
 let content =  email ? <Outlet /> : <Navigate to={'/auth'} state={{from : location}} replace />
 return content;
}

export default RequireEmail
