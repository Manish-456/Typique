import { Link } from "react-router-dom"
import DateFormat from "../utils/DateFormat"
import { userWithUserIdQuery } from "../Helper/UserHelper"
import {  blogwithUserIdQuery } from "../Helper/BlogHelper"




const Notifications = ({notification}) => {
const {user} = userWithUserIdQuery(notification?.clientId)
const {blog} = blogwithUserIdQuery(notification?.blogId)
 
  return (
    <div className='flex   cursor-pointer w-[18rem]'>
      <Link to={`/profile/${user?.id}`} className="w-[50%]" >
      <img src={user?.avatar ? `${user?.avatar}` : "/noavatar.jpg"} alt=""  className='w-10 h-10 rounded-full'/>
      </Link>
      <Link className="w-full -ml-10" to={`/blog/${notification?.blogId}`}>
        <p className='text-sm '> 
        <span className="font-bold">{user?.username} </span>
         {notification?.isLiked ? "liked" : "commented on" } your blog
        <span className="text-gray-400 font-semibold"> '{blog?.title}'</span></p>

        <p className="text-gray-400 mt-2 text-sm">{DateFormat(notification?.createdAt)}</p>

       
      <hr className='mt-2'/>
      </Link>
    </div>
  )
}

export default Notifications
