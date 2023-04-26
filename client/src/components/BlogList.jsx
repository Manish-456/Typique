import { Link } from "react-router-dom"
import { API_URL } from "../config"
import { userWithUserIdQuery } from "../Helper/UserHelper"
import useDOMParser from "../hooks/useDOMParser"

const BlogList = ({ title, desc ,image, userId, id, createdAt } ) => {
    const created = new Date(createdAt).toLocaleString("en-US", {
        day : "numeric",
        month : "long"
    })
    const {user} = userWithUserIdQuery(userId);
   const truncatedText = useDOMParser(desc, 40)
    return (
      <Link to={`/blog/${id}`} className='flex shadow-sm gap-4'>
          
              <img src={`${API_URL}/images/${image}`} alt="" className='w-[5rem] h-20 object-cover'/>

          <div>
              <h1 className='md:text-[14px] text-[13px] font-bold'>{title?.length < 20 ? title : `${title?.slice(0, 30)}...`}</h1>
              <p className="text-sm mt-3 text-[11.5px] md:text-[13px] text-gray-400">{truncatedText}</p>
              <p className='text-[12px] md:text-[13px] mt-4 text-gray-400'>{user?.username} <span className='text-blue-900'>{created}</span></p>
          </div>
      
      </Link>
    )
  }
  
  export default BlogList