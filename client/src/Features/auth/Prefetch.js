import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BlogApiSlice } from "../blog/blogApiSlice";
import { userApiSlice } from "../users/userApiSlice";

const usePrefetch = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  
    dispatch(BlogApiSlice.util.prefetch('getBlogs', 'blogLists', { force: true }));
    dispatch(userApiSlice.util.prefetch('getAllUsers', 'userLists', { force: true }));
  }, []);
};

export default usePrefetch;
