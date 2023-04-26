import { useEffect } from 'react'

const useInfiniteScroll = (setBlogs, setPage) => {
    
    const handleInfiniteScroll = async() => {
        try {
      
           if( window.innerHeight + document.documentElement.scrollTop + 1 > document.documentElement.offsetHeight -  325){
             setPage(prev => prev + 1);
           }
          } catch (error) {
      
          
        }
        }
    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll)    
        return () => {
         window.removeEventListener("scroll", handleInfiniteScroll)
     
         setBlogs([]);
        }
       },[]);
     
}

export default useInfiniteScroll
