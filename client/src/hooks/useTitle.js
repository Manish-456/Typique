import  { useEffect } from 'react'

const useTitle = (title) => {
 useEffect(() => {
    let prevTitle = document.title;
    document.title = "Typique 🔵 " + title;
    return () => document.title = "typique";

 }, [title])
}

export default useTitle
