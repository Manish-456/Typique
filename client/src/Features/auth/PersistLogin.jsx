import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {  Link, Navigate, Outlet } from "react-router-dom";
import usePersist from "../../hooks/usePersist";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);

  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const [refresh, { isError, isLoading, isUninitialized, isSuccess }] =
    useRefreshMutation();
 
  useEffect(() => {
    if (
      effectRan.current === true ||
      process.env.NODE_ENV !== "development"
    ) {
      const verifyToken = async () => {
        try {

          await refresh();
          
          setTrueSuccess(true);
        } catch (error) {}
      };
     if(!token && persist) verifyToken();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);
  

  let content;

  if (!persist) {
    //persist : no
    content = <Outlet />;
  } else if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    
    // Persist yes, token : no
    content = <Navigate to={`/auth`} replace />
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    // Persist yes, token yes
    content = <Outlet />;
  }else if(!persist && isUninitialized){
   
    content = <Link to={`/`}>Please login again</Link>
  }

  return content;
};

export default PersistLogin;